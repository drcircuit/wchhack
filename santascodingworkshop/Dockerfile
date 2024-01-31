FROM httpd:2.4.49-alpine
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY . /usr/local/apache2/htdocs/
COPY ./flag.txt /flag.txt
RUN rm /usr/local/apache2/htdocs/flag.txt
RUN rm /usr/local/apache2/htdocs/httpd.conf
EXPOSE 80