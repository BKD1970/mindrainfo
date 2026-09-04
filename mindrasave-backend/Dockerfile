FROM node:22-bookworm

# Install FFmpeg, Python, pip, Git and Deno
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       ffmpeg \
       python3 \
       python3-pip \
       git \
       curl \
       ca-certificates \
    && curl -fsSL https://deno.land/install.sh | sh \
    && ln -s /root/.deno/bin/deno /usr/local/bin/deno \
    && python3 -m pip install --break-system-packages --no-cache-dir \
       -U yt-dlp yt-dlp-ejs bgutil-ytdlp-pot-provider \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

# Install BgUtils PO-token provider
RUN git clone --depth 1 --branch 1.3.1 \
    https://github.com/Brainicism/bgutil-ytdlp-pot-provider.git \
    /app/bgutil-ytdlp-pot-provider \
    && cd /app/bgutil-ytdlp-pot-provider/server \
    && npm ci \
    && npx tsc

COPY server.js ./

RUN mkdir -p /app/downloads

ENV NODE_ENV=production
ENV PATH="/root/.deno/bin:${PATH}"

EXPOSE 4000

CMD ["node", "server.js"]