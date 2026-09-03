FROM node:20-bookworm

# Install yt-dlp and FFmpeg
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg python3 python3-pip \
    && pip3 install --break-system-packages yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY server.js ./

RUN mkdir -p /app/downloads

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "server.js"]