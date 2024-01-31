FROM node:latest
WORKDIR /mm
RUN apt-get update && \
      apt-get -y install sudo

RUN apt install build-essential -y
RUN apt install cmake -y
RUN git clone https://github.com/fletcher/MultiMarkdown-5.git
WORKDIR /mm/MultiMarkdown-5
RUN git submodule init
RUN git submodule update
RUN make
WORKDIR /mm/MultiMarkdown-5/build
RUN make install
WORKDIR /server
COPY ./static/ ./static/
COPY motd /etc/motd
COPY server.js .
COPY package.json .
RUN npm install
EXPOSE 8888
CMD [ "node", "server.js" ]
