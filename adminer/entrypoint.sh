#!/bin/bash

# Default to 'peachy' theme if not provided
THEME="${ADMINER_THEME:-peachy}"

echo "Selected Adminer theme: $THEME"

# Check if theme folder exists
if [ ! -f "/var/www/html/designs/$THEME/adminer.css" ]; then
    echo "Downloading theme $THEME..."
    mkdir -p "/var/www/html/designs/$THEME"
    curl -s -o "/var/www/html/designs/$THEME/adminer.css" "https://raw.githubusercontent.com/pematon/adminer-theme/master/dist/adminer.css"
fi

# Set env var to use it
export ADMINER_DESIGN="$THEME"

# Launch Adminer
exec "$@"
