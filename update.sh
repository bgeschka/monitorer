#!/bin/sh

git pull


cat<<EOF
You have to restart monitorer in order to make use of the updated features

sudo systemctl restart monitorer.service

EOF

