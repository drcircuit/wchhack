FROM node:latest
WORKDIR /app
RUN chown node:node /app
COPY package.json .
RUN npm install
ADD views ./views
ADD img ./img
COPY data.json ./
COPY index.js ./
COPY flag.txt /flag.txt
RUN chown node:node /flag.txt 
RUN chown node:node /app/*
USER node
EXPOSE 7331
CMD ["node", "index.js"]

