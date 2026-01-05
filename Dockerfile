FROM dunglas/frankenphp:latest-php8.3

# 1. Installation des extensions indispensables au runtime
RUN install-php-extensions \
    pdo_mysql \
    intl \
    zip \
    opcache \
    gd \
    bcmath \
    pcntl

# 2. Config environnement
ENV SERVER_NAME=:80
ENV PHP_INI_DIR=/usr/local/etc/php
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

WORKDIR /app

# 3. On copie TOUT (incluant ton dossier public/build que tu as buildé localement)
COPY . /app

# 4. Installation de Composer pour optimiser l'autoloader en prod
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-scripts

# 5. Droits d'accès pour FrankenPHP
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache
