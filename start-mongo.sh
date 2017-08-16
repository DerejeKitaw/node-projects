#!/bin/bash

docker start node-mongo || docker run -p 27017:27017 --name node-mongo -v $(pwd)/mongo:/data/db -d mongo:latest --logpath /var/log/mongodb/mongod.log --logappend --logRotate rename --auth --directoryperdb
