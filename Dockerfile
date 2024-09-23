# Start with Node v18.17.1
FROM node:18.17.1
# Install necessary system libraries using apt-get
RUN apt-get update && apt-get install -y \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libpng-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    rsync \
    procps

RUN apt-get install valgrind
RUN apt-get install gdb

# Remove /etc/timezone, create /app directory, and install pm2 globally
RUN rm -rf /etc/timezone && \
    mkdir /app && \
    npm install pm2 -g
RUN pm2 install pm2-logrotate@2.6
RUN pm2 set pm2-logrotate:rotateInterval '0 * * * *'
RUN pm2 set pm2-logrotate:retain 72
RUN pm2 set pm2-logrotate:compress true
RUN pm2 set pm2-logsessionrotate:max_size 3G

COPY ./package.json /app/
COPY ./producer.js /app/
COPY ./batch_receive.js /app/

WORKDIR /app
RUN npm install