#!/bin/bash
# start-services.sh
service apache2 start
/usr/sbin/xinetd -dontfork -f challenge.conf
