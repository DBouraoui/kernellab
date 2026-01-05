# -----------------------------------------------------------------------------
# Étape 2 : Image Finale de Production (Propre et légère)
# -----------------------------------------------------------------------------
FROM dunglas/frankenphp

# Installation des extensions pour le runtime
RUN install-php-extensions \
    pdo_mysql \
    intl \
    zip \
    opcache \
    gd \
    bcmath \
    pcntl

ENV SERVER_NAME=:80

# Configuration PHP Prod
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

WORKDIR /app

# On copie le code source
COPY . /app

# Permissions finales
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache
