#!/bin/bash

# Ensure Nginx directory exists
mkdir -p /etc/nginx/certs
mkdir -p /etc/nginx/dhparam

# Check if certificates exist, if not generate self-signed certificates
if [ ! -f /etc/nginx/certs/api.colonizadar.fr.crt ]; then
  echo "Generating self-signed certificate..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/certs/api.colonizadar.fr.key -out /etc/nginx/certs/api.colonizadar.fr.crt -subj "/C=US/ST=SomeState/L=SomeCity/O=SomeOrg/CN=api.colonizadar.fr"
else
  echo "Certificate api.colonizadar.fr.crt already exists."
fi

# Check if DH parameters exist, if not generate Diffie-Hellman parameters
if [ ! -f /etc/nginx/dhparam/dhparam.pem ]; then
  echo "Generating Diffie-Hellman parameters..."
  openssl dhparam -out /etc/nginx/dhparam/dhparam.pem 2048
else
  echo "Diffie-Hellman parameters already exist."
fi

# Ensure that the certs directory is readable by nginx (optional but good practice)
chmod -R 755 /etc/nginx/certs
chmod -R 755 /etc/nginx/dhparam

# Start nginx service in the foreground
echo "Starting nginx..."
exec nginx -g "daemon off;"
