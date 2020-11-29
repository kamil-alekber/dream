#!/bin/sh

FILE=./users/index.js

if [ -f "$FILE" ]; then
    # echo "$FILE exists."
    node ./users/index.js
else 
    # echo "$FILE does not exist."
    node ./entry/index.js
fi

exit $?