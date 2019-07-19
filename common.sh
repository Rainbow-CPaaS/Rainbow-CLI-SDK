if [[ "$#" -gt 0 && "a${@: -1}" = "ainstalled" ]]
then 
    export RBW_LOCATION="installed"
else
    export RBW_LOCATION="local"
    alias rbw="node $PWD/index.js"  
fi
echo "Using $RBW_LOCATION rbw command"
