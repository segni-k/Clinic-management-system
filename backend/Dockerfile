FROM php:8.2-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libicu-dev \
    libpq-dev \
    libzip-dev \
  && docker-php-ext-install intl pdo_pgsql zip \
  && a2enmod rewrite headers \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . ./
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
  && chown -R www-data:www-data storage bootstrap/cache \
  && composer install --no-dev --optimize-autoloader \
  && php artisan config:cache \
  && php artisan route:cache \
  && php artisan view:cache

EXPOSE 80

ENTRYPOINT ["entrypoint.sh"]
CMD ["apache2-foreground"]
