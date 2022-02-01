{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "workspace";
  nativeBuildInputs = [
    pkgs.tmux
    pkgs.vim
    pkgs.nodejs
    pkgs.yarn
    pkgs.jq
  ];
  shellHook = ''
    mkdir -p .nix-node
    export NODE_PATH=$PWD/.nix-node
    export PATH=$NODE_PATH/bin:$PATH
    export PS1='\[\033[1;32m\][nix-shell]:\[\033[0;34m\]\w\[\033[0;37m\]\$\[\033[0m\]\n\[\033[0;37m\]$(if [ -f package.json ]; then jq -r .name package.json; else echo git; fi):(\[\033[1;37m\]$(git rev-parse --abbrev-ref HEAD)\[\033[0;37m\])>\[\033[0m\] '
    
    tmux set-option -g prefix C-e
    git config --global core.editor "vim"
    npm config set prefix $NODE_PATH
  '';
}
