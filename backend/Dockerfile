FROM node:18 as builder

RUN apt update && \
    apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon-dev libxcomposite-dev \
        libxdamage-dev libxrandr-dev libgbm-dev libasound2
RUN corepack enable && corepack prepare yarn@3.2.3 --activate
RUN mkdir -m 700 /home/10001 && chown 10001:10001 /home/10001
ENV HOME=/home/10001
COPY --chown=10001:10001 . /build
USER 10001:10001
WORKDIR /build
RUN yarn && yarn run build

### temporary section
CMD yarn start:prod
EXPOSE 8080
### end temporary section

#FROM bitnami/node:18
#COPY --from=builder /build/dist /app
#CMD node main.js
#EXPOSE 8080
