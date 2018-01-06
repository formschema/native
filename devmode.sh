#!/bin/sh

package=`node -p 'require("./package").name'`

docker build -t $package .

# create a new session. Note the -d flag, we do not want to attach just yet!
tmux new-session -s $package -n $package -d

# Adress the first pane using the -t flag.
# for the <enter> key, use either C-m (linefeed) or C-j (newline)
tmux send-keys -t $package:$package.0 \
  "docker run --rm -v $(pwd)/src:/src -v $(pwd)/test:/test -v $(pwd)/coverage:/coverage $package nodemon -w /src -w /test -x './node_modules/.bin/jest --colors --roots src test'" C-j

# split the window *vertically*
tmux split-window -v
tmux split-window -v -t 0
tmux split-window -h -t 2

# again, specifying pane 1 with '-t 1' is optional
tmux send-keys -t 2 'cd ../vue-json-schema-demo-elementui && npm run dev' C-j
tmux send-keys -t 3 "nodemon -w src -x 'docker run --rm -v $(pwd)/dist:/dist $package node build.js && cp -f dist/* ../vue-json-schema-demo-elementui'" C-j
tmux send-keys -t 1 'git status' C-j

# finally attach to the session
tmux attach -t $package
