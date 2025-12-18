#!/usr/bin/env sh
set -eu

# Configure Nagios web UI Basic Auth from environment variables.
# Defaults:
# - NAGIOS_USERNAME: nagiosadmin
# - NAGIOS_PASSWORD: (empty) -> keep existing credentials

NAGIOS_USER="${NAGIOS_USERNAME:-nagiosadmin}"
NAGIOS_PASS="${NAGIOS_PASSWORD:-}"

HTPASSWD_FILE="/opt/nagios/etc/htpasswd.users"
CGI_CFG="/opt/nagios/etc/cgi.cfg"

if [ -n "${NAGIOS_PASS}" ]; then
  echo "[nagios] Applying web UI credentials from env (user=${NAGIOS_USER})"

  # Overwrite htpasswd file with a single user.
  # -c: create new file (overwrite)
  # -b: batch mode (password from arg)
  htpasswd -bc "${HTPASSWD_FILE}" "${NAGIOS_USER}" "${NAGIOS_PASS}"

  # Best-effort permissions (image may run as root at startup)
  chown nagios:nagios "${HTPASSWD_FILE}" 2>/dev/null || true
  chmod 640 "${HTPASSWD_FILE}" 2>/dev/null || true

  # Ensure CGI authorization uses the same username
  if [ -f "${CGI_CFG}" ]; then
    sed -i \
      -e "s/^authorized_for_system_information=.*/authorized_for_system_information=${NAGIOS_USER}/" \
      -e "s/^authorized_for_configuration_information=.*/authorized_for_configuration_information=${NAGIOS_USER}/" \
      -e "s/^authorized_for_system_commands=.*/authorized_for_system_commands=${NAGIOS_USER}/" \
      -e "s/^authorized_for_all_services=.*/authorized_for_all_services=${NAGIOS_USER}/" \
      -e "s/^authorized_for_all_hosts=.*/authorized_for_all_hosts=${NAGIOS_USER}/" \
      -e "s/^authorized_for_all_service_commands=.*/authorized_for_all_service_commands=${NAGIOS_USER}/" \
      -e "s/^authorized_for_all_host_commands=.*/authorized_for_all_host_commands=${NAGIOS_USER}/" \
      "${CGI_CFG}" || true
  fi
else
  echo "[nagios] NAGIOS_PASSWORD is empty; keeping existing htpasswd.users"
fi

exec /usr/local/bin/start_nagios