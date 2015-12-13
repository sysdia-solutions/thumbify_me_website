FROM sysdia/docker-php-server

RUN apt-get -q -y update
RUN apt-add-repository ppa:ondrej/php5-oldstable
RUN apt-get -q -y purge php5
RUN apt-get -q -y update
RUN apt-get -q -y install php5
RUN apt-get -q -y install php5-curl

RUN mkdir -p /var/www/site
ADD . /var/www/site
RUN rm /var/www/site/Dockerfile
RUN rm /var/www/site/docker-deploy.sh
RUN rm /var/www/site/config.ini.example
RUN chmod 777 /var/www/site/cache

RUN a2enmod rewrite

#Setup Apache host
RUN rm /etc/apache2/sites-available/default
RUN echo "<VirtualHost *:80>\n ServerAdmin info@thumbify.co.uk\n ErrorLog /var/log/apache2/error.log\n DocumentRoot /var/www/site/public\n <Directory \"/var/www/site/public\">\n Options Indexes MultiViews FollowSymLinks\n AllowOverride None\n Order allow,deny\n Allow from all\n </Directory>\n <IfModule mod_rewrite.c>\n RewriteEngine On \n RewriteCond %{REQUEST_URI} !\\.(php|css|js|jpe?g|png|ico)$ [NC] \n RewriteRule . /index.php [L] \n </IfModule> \n</VirtualHost>" >  /etc/apache2/sites-available/default

ENTRYPOINT ["/usr/sbin/apache2"]
CMD ["-D", "FOREGROUND"]
