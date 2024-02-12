FROM adamdoupe/vuln-base:latest

# Install Apache
RUN apt-get update && apt-get install -y apache2 && \
    rm -rf /var/lib/apt/lists/*

# Copy static content to Apache's serve directory
COPY index.html/ /var/www/html/
ADD bin/ /var/www/html/bin
WORKDIR /challenge
COPY overlord.c /challenge/
COPY flag.txt /flag.txt
RUN gcc -o challenge overlord.c -fno-stack-protector -z execstack -no-pie
RUN chmod +x challenge

# Expose the port for the Apache server
EXPOSE 80

# Expose the original port
EXPOSE 31337

# A script to start both the xinetd service and Apache
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
