# dockerfile for a static webserver on port 80 and ssh open to the world on port 22
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y openssh-server nginx
RUN useradd -m adm -g adm
RUN echo "adm:opensesame" | chpasswd
COPY *.html /var/www/html/
ADD etc /var/www/html/etc
COPY flag.txt /flag.txt
RUN chmod 644 /flag.txt
RUN chown adm:adm /flag.txt
EXPOSE 80 22
CMD service ssh start && nginx -g 'daemon off;'
