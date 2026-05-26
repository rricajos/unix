---
title: "208.1 - Configuración básica de Apache"
tags: [lpic-2, examen-202, tema-208, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.1"
---

# 208.1 - Comandos clave: Configuración básica de Apache

## Comandos de gestión del servicio

| Comando | Descripción |
|---|---|
| `apachectl start` | Inicia el servidor Apache |
| `apachectl stop` | Detiene el servidor Apache |
| `apachectl restart` | Reinicia Apache (corta conexiones activas) |
| `apachectl graceful` | Reinicio elegante sin interrumpir conexiones |
| `apachectl configtest` | Verifica la sintaxis de configuración |
| `apachectl -t` | Equivalente a `configtest` |
| `apachectl -S` | Muestra la configuración de VirtualHosts |
| `apachectl -M` | Lista los módulos cargados (estáticos y dinámicos) |
| `apachectl -V` | Muestra la versión y opciones de compilación |

## Comandos de gestión de módulos y sitios (Debian/Ubuntu)

| Comando | Descripción |
|---|---|
| `a2enmod <módulo>` | Habilita un módulo de Apache |
| `a2dismod <módulo>` | Deshabilita un módulo de Apache |
| `a2ensite <sitio>` | Habilita un VirtualHost |
| `a2dissite <sitio>` | Deshabilita un VirtualHost |
| `a2enconf <conf>` | Habilita un fragmento de configuración |
| `a2disconf <conf>` | Deshabilita un fragmento de configuración |
| `a2query -m <módulo>` | Consulta si un módulo está habilitado |
| `a2query -M` | Muestra el MPM activo |

## Gestión de usuarios para autenticación

| Comando | Descripción |
|---|---|
| `htpasswd -c /ruta/.htpasswd usuario` | Crea archivo de contraseñas y primer usuario |
| `htpasswd /ruta/.htpasswd usuario` | Añade o modifica un usuario |
| `htpasswd -D /ruta/.htpasswd usuario` | Elimina un usuario del archivo |
| `htpasswd -b /ruta/.htpasswd usuario clave` | Establece contraseña en línea de comandos |

## Archivos de configuración principales

| Archivo | Distribución | Descripción |
|---|---|---|
| `/etc/apache2/apache2.conf` | Debian/Ubuntu | Configuración principal |
| `/etc/httpd/conf/httpd.conf` | Red Hat/CentOS | Configuración principal |
| `/etc/apache2/ports.conf` | Debian/Ubuntu | Puertos de escucha |
| `/etc/apache2/sites-available/` | Debian/Ubuntu | VirtualHosts disponibles |
| `/etc/apache2/sites-enabled/` | Debian/Ubuntu | VirtualHosts habilitados |
| `/etc/apache2/mods-available/` | Debian/Ubuntu | Módulos disponibles |
| `/etc/apache2/mods-enabled/` | Debian/Ubuntu | Módulos habilitados |
| `/etc/httpd/conf.d/` | Red Hat/CentOS | Configuraciones adicionales |

## Directivas de configuración esenciales

| Directiva | Ejemplo | Descripción |
|---|---|---|
| `ServerRoot` | `"/etc/httpd"` | Directorio base del servidor |
| `Listen` | `80` | Puerto de escucha |
| `ServerName` | `www.ejemplo.com:80` | Nombre del servidor |
| `DocumentRoot` | `"/var/www/html"` | Directorio raíz de documentos |
| `ServerAdmin` | `admin@ejemplo.com` | Email del administrador |
| `ErrorLog` | `${APACHE_LOG_DIR}/error.log` | Archivo de log de errores |
| `CustomLog` | `access.log combined` | Archivo de log de acceso con formato |
| `LogLevel` | `warn` | Nivel de detalle del log de errores |
| `AllowOverride` | `All` / `None` | Control de `.htaccess` |
| `Options` | `Indexes FollowSymLinks` | Opciones del directorio |
| `Require` | `all granted` / `ip 10.0.0.0/8` | Control de acceso (Apache 2.4) |

## Archivos de log predeterminados

| Archivo | Descripción |
|---|---|
| `/var/log/apache2/access.log` | Log de acceso (Debian/Ubuntu) |
| `/var/log/apache2/error.log` | Log de errores (Debian/Ubuntu) |
| `/var/log/httpd/access_log` | Log de acceso (Red Hat/CentOS) |
| `/var/log/httpd/error_log` | Log de errores (Red Hat/CentOS) |
