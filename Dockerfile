FROM ghcr.io/puppeteer/puppeteer:22.9.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/user-data

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8000

CMD [ "node", "index.js" ]