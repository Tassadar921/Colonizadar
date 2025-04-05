#!/bin/bash

# Ensure Nginx directory exists
mkdir -p /etc/nginx/certs
mkdir -p /etc/nginx/dhparam

# Check if certificates for app.colonizadar.fr exist, if not generate self-signed certificates
if [ ! -f /etc/nginx/certs/app.colonizadar.fr.crt ]; then
  echo "Generating self-signed certificate for app.colonizadar.fr..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/certs/app.colonizadar.fr.key -out /etc/nginx/certs/app.colonizadar.fr.crt -subj "/C=US/ST=SomeState/L=SomeCity/O=SomeOrg/CN=app.colonizadar.fr"
else
  echo "Certificate app.colonizadar.fr.crt already exists."
fi

# Create fullchain.pem for app.colonizadar.fr (self-signed, so it's just the certificate itself)
echo "Generating fullchain.pem for app.colonizadar.fr..."
cat /etc/nginx/certs/app.colonizadar.fr.crt /etc/nginx/certs/app.colonizadar.fr.crt > /etc/nginx/certs/app.colonizadar.fr.fullchain.pem

# Check if certificates for api.colonizadar.fr exist, if not generate self-signed certificates
if [ ! -f /etc/nginx/certs/api.colonizadar.fr.crt ]; then
  echo "Generating self-signed certificate for api.colonizadar.fr..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/certs/api.colonizadar.fr.key -out /etc/nginx/certs/api.colonizadar.fr.crt -subj "/C=US/ST=SomeState/L=SomeCity/O=SomeOrg/CN=api.colonizadar.fr"
else
  echo "Certificate api.colonizadar.fr.crt already exists."
fi

# Create fullchain.pem for api.colonizadar.fr (self-signed, so it's just the certificate itself)
echo "Generating fullchain.pem for api.colonizadar.fr..."
cat /etc/nginx/certs/api.colonizadar.fr.crt /etc/nginx/certs/api.colonizadar.fr.crt > /etc/nginx/certs/api.colonizadar.fr.fullchain.pem

# Check if certificates for db.colonizadar.fr exist, if not generate self-signed certificates
if [ ! -f /etc/nginx/certs/db.colonizadar.fr.crt ]; then
  echo "Generating self-signed certificate for db.colonizadar.fr..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/certs/db.colonizadar.fr.key -out /etc/nginx/certs/db.colonizadar.fr.crt -subj "/C=US/ST=SomeState/L=SomeCity/O=SomeOrg/CN=db.colonizadar.fr"
else
  echo "Certificate db.colonizadar.fr.crt already exists."
fi

# Create fullchain.pem for db.colonizadar.fr (self-signed, so it's just the certificate itself)
echo "Generating fullchain.pem for db.colonizadar.fr..."
cat /etc/nginx/certs/db.colonizadar.fr.crt /etc/nginx/certs/db.colonizadar.fr.crt > /etc/nginx/certs/db.colonizadar.fr.fullchain.pem

# Check if DH parameters exist, if not generate Diffie-Hellman parameters
if [ ! -f /etc/nginx/dhparam/dhparam.pem ]; then
  echo "Generating Diffie-Hellman parameters..."
  openssl dhparam -out /etc/nginx/dhparam/dhparam.pem 2048
else
  echo "Diffie-Hellman parameters already exist."
fi

# Ensure that the certs directory is readable and owned by nginx user
echo "Setting ownership of the certs directory to nginx user..."
chown -R nginx:nginx /etc/nginx/certs
chmod -R 755 /etc/nginx/certs
chmod -R 755 /etc/nginx/dhparam

# Start nginx service in the foreground
echo "Starting nginx..."
exec nginx -g "daemon off;"
