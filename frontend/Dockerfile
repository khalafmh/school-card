FROM bitnami/node:18 as builder

RUN corepack enable && corepack prepare yarn@3.2.3 --activate
RUN mkdir -m 700 /home/10001 && chown 10001:10001 /home/10001
ENV HOME=/home/10001
USER 10001:10001
COPY --chown=10001:10001 package.json yarn.lock .yarn .pnp.* .yarnrc.yml /build/
COPY --chown=10001:10001 .yarn /build/.yarn
WORKDIR /build
RUN yarn
COPY --chown=10001:10001 . /build
ARG VITE_BACKEND_URL
RUN yarn run build

FROM bitnami/nginx:latest
COPY --from=builder /build/dist /app
EXPOSE 8080
