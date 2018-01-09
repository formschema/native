#!/bin/sh

package=`node -p 'require("./package").name'`

docker build --build-arg cwd="$(pwd)" -t $package .

# create a new session. Note the -d flag, we do not want to attach just yet!
tmux new-session -s $package -n $package -d

# Adress the first pane using the -t flag.
# for the <enter> key, use either C-m (linefeed) or C-j (newline)
tmux send-keys -t $package:$package.0 \
  "nodemon -w src -w test -x 'docker run --rm -v $(pwd)/src:$(pwd)/src -v $(pwd)/test:$(pwd)/test -v $(pwd)/coverage:$(pwd)/coverage $package ./node_modules/.bin/jest --colors --roots src test test/specs/FormSchemaField.spec.js'" C-j

# split the window *vertically*
tmux split-window -v
tmux split-window -v -t 0
tmux split-window -h -t 2

# again, specifying pane 1 with '-t 1' is optional
tmux send-keys -t 2 'cd ../vue-json-schema-demo-elementui && npm run dev' C-j
tmux send-keys -t 3 \
  "nodemon -w src -x 'docker run --rm -v $(pwd)/src:$(pwd)/src -v $(pwd)/dist:$(pwd)/dist $package node build'" C-j
tmux send-keys -t 1 'git status' C-j

# finally attach to the session
tmux attach -t $package
