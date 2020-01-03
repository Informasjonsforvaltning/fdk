FROM node:12 AS build

WORKDIR /app

COPY  package.json package-lock.json ./
RUN npm set progress=false && \
  npm config set depth 0 && \
  npm ci

RUN npm audit

COPY .babelrc ./
COPY webpack.* ./
COPY src ./src
COPY test ./test

RUN npm test
RUN npm run build

FROM nginx:alpine
RUN mkdir /app
RUN addgroup -g 1001 -S app && \
  adduser -u 1001 -S app -G app && \
  chown -R app:app /app && \
  chown -R app:app /var/cache/nginx && \
  touch /var/run/nginx.pid && \
  chown -R app:app /var/run/nginx.pid && \
  chmod 770 /app
USER app:app
WORKDIR /app
COPY --chown=app:app nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=app:app nginx/app.conf /etc/nginx/conf.d/default.conf
COPY --chown=app:app --from=build /app/dist ./
COPY --chown=app:app entrypoint.sh config.template.js ./
RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

ENTRYPOINT ./entrypoint.sh
EXPOSE 8080
