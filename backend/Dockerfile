FROM node:24-bookworm

RUN apt-get update \
    && apt-get install --no-install-recommends --yes \
        libnss3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxkbcommon-dev \
        libxcomposite-dev \
        libxdamage-dev \
        libxrandr-dev \
        libgbm-dev \
        libasound2 \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@3.2.3 --activate
RUN mkdir --mode=700 /home/10001 && chown 10001:10001 /home/10001
ENV HOME=/home/10001 \
    YARN_IGNORE_PATH=1
USER 10001:10001
WORKDIR /build

COPY --chown=10001:10001 package.json yarn.lock .yarnrc.yml ./
RUN YARN_IGNORE_PATH=1 yarn install --immutable
COPY --chown=10001:10001 rollup.config.mjs tsconfig.json ./
COPY --chown=10001:10001 src ./src
RUN yarn run build

EXPOSE 8080
CMD ["yarn", "start:prod"]
