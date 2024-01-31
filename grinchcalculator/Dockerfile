FROM node:latest
WORKDIR /app
COPY package.json .
RUN npm install
COPY static ./static
COPY index.js .
EXPOSE 80
CMD ["node", "index.js"]