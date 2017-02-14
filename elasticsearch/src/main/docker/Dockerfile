FROM docker.elastic.co/elasticsearch/elasticsearch:5.2.0
ADD elasticsearch.yml /usr/share/elasticsearch/config/
USER root
chown elasticsearch:elasticsearch config/elasticsearch.yml
USER elasticsearch

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
