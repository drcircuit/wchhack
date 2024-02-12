FROM ubuntu:16.04
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y socat --fix-missing
RUN apt-get install gcc --fix-missing -y
RUN apt-get install build-essential --fix-missing -y
RUN apt-get install gcc-multilib g++-multilib apache2  -y --fix-missing
RUN export TERM=xterm
WORKDIR /home/jedimindtrick
COPY jedimindtrick.c /home/jedimindtrick
ENV CKRET_FLAG='${TheForceIsStrongWithThisOne}'
RUN gcc -o jedimindtrick ./jedimindtrick.c 
COPY index.html /var/www/html/
RUN mkdir /var/www/html/bin
RUN cp ./jedimindtrick /var/www/html/bin/jedimindtrick

# Expose ports for socat and Apache
EXPOSE 2187 80

# Use a custom entrypoint script to start both Apache and socat
COPY start.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]