FROM nginx:alpine

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY nginx.conf /etc/nginx/nginx.conf

COPY mockdata /mockdata

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]