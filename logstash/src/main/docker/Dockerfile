FROM logstash

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ADD build/logstash.conf /etc/logstash/conf.d/logstash.conf
ADD build/difi_template.json /etc/logstash/conf.d/difi_template.json
