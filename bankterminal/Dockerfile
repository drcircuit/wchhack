FROM adamdoupe/vuln-base:latest

# Install Apache
RUN apt-get update && apt-get install -y apache2 && \
    rm -rf /var/lib/apt/lists/*

# Copy static content to Apache's serve directory
COPY index.html/ /var/www/html/
RUN mkdir /var/www/html/bin

WORKDIR /challenge
COPY bankterminal.c /challenge/
COPY flag.txt /flag.txt
RUN gcc -o challenge bankterminal.c -fno-stack-protector -z execstack -no-pie
RUN chmod +x challenge
RUN cp ./challenge /var/www/html/bin/challenge

# Expose the port for the Apache server
EXPOSE 80

# Expose the original port
EXPOSE 31337

# A script to start both the xinetd service and Apache
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
