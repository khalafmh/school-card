FROM bitnami/node:18 as builder

RUN corepack enable && corepack prepare yarn@3.2.3 --activate
COPY . /build
WORKDIR /build
RUN yarn && yarn run build

### temporary section
CMD yarn run:prod
EXPOSE 8080
### end temporary section

#FROM bitnami/node:18
#COPY --from=builder /build/dist /app
#CMD node main.js
#EXPOSE 8080
