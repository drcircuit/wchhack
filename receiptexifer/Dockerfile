FROM ubuntu:18.04
RUN apt update && apt upgrade -y && apt install -y nginx
RUN rm /etc/nginx/sites-enabled/*
COPY nginx_site.conf /etc/nginx/sites-enabled/
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf
RUN apt install -y php7.2-fpm
RUN rm /etc/nginx/sites-enabled/*
COPY nginx_site.conf /etc/nginx/sites-enabled/
RUN rm /var/www/html/*
COPY server/ /var/www/html/
COPY flag.txt /var/www/html/
RUN rm /etc/php/7.2/fpm/php.ini
RUN rm /etc/php/7.2/cli/php.ini
COPY php.ini /etc/php/7.2/fpm/
COPY php.ini /etc/php/7.2/cli/
RUN mkdir /var/www/html/uploads
RUN ls /var/www/html/uploads
RUN chown www-data:www-data /var/www/html/uploads
RUN service php7.2-fpm start
EXPOSE 80
CMD service php7.2-fpm start && nginx