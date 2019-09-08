FROM nginx:alpine

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY nginx.conf /etc/nginx/nginx.conf
COPY google4ccb17746cf8ee55.html /etc/nginx/data/google4ccb17746cf8ee55.html
COPY errorPages /usr/share/nginx/html/errorPages

EXPOSE 8080

