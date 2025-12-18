FROM jasonrivers/nagios:latest

RUN sed -i 's|cfg_file=/opt/nagios/etc/objects/localhost.cfg|#cfg_file=/opt/nagios/etc/objects/localhost.cfg|' /opt/nagios/etc/nagios.cfg
RUN apt-get update && apt-get install -y monitoring-plugins && apt-get clean

COPY start_nagios_with_env.sh /usr/local/bin/start_nagios_with_env.sh
RUN chmod +x /usr/local/bin/start_nagios_with_env.sh

CMD ["/usr/local/bin/start_nagios_with_env.sh"]