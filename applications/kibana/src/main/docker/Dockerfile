FROM kibana:4.5.4

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN /opt/kibana/bin/kibana plugin --install elastic/sense
RUN chown -R kibana:kibana /opt/kibana
