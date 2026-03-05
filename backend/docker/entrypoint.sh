#!/usr/bin/env bash
set -e

if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

php artisan migrate --force
php artisan db:seed --force

exec "$@"
