#!/bin/sh

tag=`node -p 'require("./package").name'`
container=$tag-dev
cwd=$(pwd)

if [ "X`docker images -q $tag`" = "X" ]; then
  docker build --build-arg cwd="$cwd" -t $tag .
fi

existsOrExited=`docker inspect -f {{.State.Running}} $container 2> /dev/null`

if [ "$existsOrExited" = '' ]; then
  docker run -d -it --name $container \
    -v "$(pwd)/src":"$cwd/src" \
    -v "$(pwd)/test":"$cwd/test" \
    -v "$(pwd)/coverage":"$cwd/coverage" \
    -v "$(pwd)/dist":"$cwd/dist" \
    $tag
else
  if [ "$existsOrExited" = 'false' ]; then
    docker start $container
  fi
fi

# create a new session. Note the -d flag, we do not want to attach just yet!
tmux new-session -s $tag -n $tag -d

# Adress the first pane using the -t flag.
# for the <enter> key, use either C-m (linefeed) or C-j (newline)
tmux send-keys -t $tag:$tag.0 \
  "docker exec $container nodemon -w src -w test -x './node_modules/.bin/jest --colors test/specs/FormSchemaField.spec.js'" C-j

# split the window *vertically*
tmux split-window -v
tmux split-window -v -t 0
tmux split-window -h -t 2

# again, specifying pane 1 with '-t 1' is optional
tmux send-keys -t 2 'cd ../vue-json-schema-demo-elementui && npm run dev' C-j
tmux send-keys -t 3 "docker exec $container nodemon -w src -x 'node build'" C-j
tmux send-keys -t 1 'git status' C-j

# finally attach to the session
tmux attach -t $tag
