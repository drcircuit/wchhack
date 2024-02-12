#!/bin/bash
# entrypoint.sh

# Start Apache in the background
service apache2 start

# Start socat and bind it to port 2187
exec socat TCP-LISTEN:2187,reuseaddr,fork, EXEC:"/home/jedimindtrick/jedimindtrick",pty
