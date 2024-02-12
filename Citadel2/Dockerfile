# dockerfile for a static webserver on port 80 and ssh open to the world on port 22
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y openssh-server nginx
RUN useradd -m arne -g adm
RUN echo "arne:qwertyuiop" | chpasswd
COPY *.html /var/www/html/
COPY config.conf /var/www/html/
COPY admin.pub /var/www/html/
EXPOSE 80 22
CMD service ssh start && nginx -g 'daemon off;'
