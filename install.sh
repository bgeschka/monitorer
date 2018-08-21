#!/bin/sh
DEFAULTDATADIR="/var/monitorer"
DEFAULTLISTENIP="0.0.0.0"
DEFAULTLISTENPORT="8000"

err() {
	echo "Error:$*"
	exit 1
}

if [ "$UID" != '0' ]; then
	echo "this has to run as root"
	echo "try again with sudo $0"
	exit 1
fi

cat<<EOF

___  ___            _ _                      
|  \/  |           (_) |                     
| .  . | ___  _ __  _| |_ ___  _ __ ___ _ __ 
| |\/| |/ _ \| '_ \| | __/ _ \| '__/ _ \ \'__|
| |  | | (_) | | | | | || (_) | | |  __/ |   
\_|  |_/\___/|_| |_|_|\__\___/|_|  \___|_|   
                     


This script installs a systemd service file
with adjusted paths to the installation in $pwd			
                                             
EOF


printf 'continue?(y):'
read x
[ "$x" != "y" ] && exit 2

systemctl stop monitorer.service 2>/dev/null

#cp systemd.service /etc/systemd/system/monitorer.service:

systemdinstallpath="/etc/systemd/system/monitorer.service"
mpath="$(dirname "$(realpath ./main.js)" )"
sed 's#{{mainpath}}#'"$mpath"'#g' systemd.service > $systemdinstallpath || err 'failed to prepare systemd.service'
systemctl daemon-reload || err 'faild to reload systemd'
echo "installed $systemdinstallpath"


cat<<EOF
Monitorer has to store data like previous results,
job configurations, mail settings etc
EOF

printf "Where do you want monitorer to listen on? (default $DEFAULTLISTENIP):"
read listenip
printf "which Port? (default $DEFAULTLISTENPORT):"
read listenport

printf "Where do you want to store the data(default $DEFAULTDATADIR ):"
read path
mkdir -p "${path:-$DEFAULTDATADIR}" || err "failed to create data dir $path"

sed 's#\/tmp#'"${path:-$DEFAULTDATADIR}"'#g' example.config.json > config.json || err 'failed to prepare config'
sed -i 's#0.0.0.0#'"${listenip:-$DEFAULTLISTENIP}"'#g' config.json || err 'failed to prepare config' 
sed -i 's#8000#'"${listenport:-$DEFAULTLISTENPORT}"'#g' config.json || err 'failed to prepare config' 

npm install || err 'missing npm install node and npm'

printf 'Start monitorer now?(y)'
read sn
[ "$sn" == "y" ] && systemctl start monitorer.service

printf 'Enable monitorer on system startup?(y)'
read onboot
[ "$onboot" == "y" ] && systemctl enable monitorer.service

cat<<EOF
     _                  _ 
    | |                | |
  __| | ___  _ __   ___| |
 / _\` |/ _ \| '_ \ / _ \ |
| (_| | (_) | | | |  __/_|
 \__,_|\___/|_| |_|\___(_)
                          

If you made a mistake during installation
just re-run $0 and adjust			  
EOF
