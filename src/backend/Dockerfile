FROM php:8.3-apache

#PostgreSQL Driver Import
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev && docker-php-ext-install pdo_pgsql && rm -rf /var/lib/apt/lists/*

#WORKDIR /app
WORKDIR /var/www/html   
COPY . .
