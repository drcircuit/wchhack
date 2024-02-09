FROM adamdoupe/vuln-base:latest
WORKDIR /challenge
COPY stringit.c /challenge/
COPY flag.txt /flag.txt
RUN gcc -o challenge stringit.c 
RUN chmod +x challenge
EXPOSE 31337
CMD ["/usr/sbin/xinetd", "-dontfork", "-f", "challenge.conf"]
