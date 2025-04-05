# Use official PHP image with FPM
FROM php:7.4-fpm

# Install required PHP extensions (for AdminNeo)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Set the working directory
WORKDIR /var/www/html

# Copy the AdminNeo code into the container
COPY . /var/www/html/

# Set proper permissions (useful for Docker volumes)
RUN chown -R www-data:www-data /var/www/html

# Expose the necessary port (PHP-FPM listens on 9000 by default)
EXPOSE 9000
