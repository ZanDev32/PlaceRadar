FROM jasonrivers/nagios:latest

RUN sed -i 's|cfg_file=/opt/nagios/etc/objects/localhost.cfg|#cfg_file=/opt/nagios/etc/objects/localhost.cfg|' /opt/nagios/etc/nagios.cfg
RUN apt-get update && apt-get install -y monitoring-plugins && apt-get clean
