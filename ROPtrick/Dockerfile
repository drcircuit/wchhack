FROM adamdoupe/vuln-base:latest
WORKDIR /challenge
COPY roptrick.c /challenge/
COPY flag.txt /flag.txt
RUN gcc -o challenge roptrick.c -fno-stack-protector -z execstack -no-pie
RUN chmod +x challenge
EXPOSE 31337
CMD ["/usr/sbin/xinetd", "-dontfork", "-f", "challenge.conf"]
