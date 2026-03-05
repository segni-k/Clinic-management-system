#!/usr/bin/env bash
set -e

if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
