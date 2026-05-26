---
title: "208.4 - Nginx como servidor web y proxy inverso"
tags: [lpic-2, examen-202, tema-208, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.4"
---

# 208.4 - Nginx como servidor web y proxy inverso

## Peso: 2

## Introducción

Nginx es un servidor web y proxy inverso de alto rendimiento conocido por su arquitectura basada en eventos, bajo consumo de recursos y capacidad para manejar miles de conexiones simultáneas. Además de servir contenido estático, es ampliamente utilizado como proxy inverso y balanceador de carga.

## Instalación

```bash
# Debian/Ubuntu
apt install nginx
systemctl enable nginx
systemctl start nginx

# Red Hat/CentOS
yum install epel-release
yum install nginx
systemctl enable nginx
systemctl start nginx
```

## Estructura de configuración

### Archivo principal: nginx.conf

```
/etc/nginx/
├── nginx.conf              # Configuración principal
├── sites-available/        # Configuraciones de sitios disponibles (Debian)
├── sites-enabled/          # Sitios habilitados (enlaces simbólicos)
├── conf.d/                 # Configuraciones adicionales (Red Hat)
├── modules-available/      # Módulos disponibles
├── modules-enabled/        # Módulos habilitados
├── mime.types              # Tipos MIME
└── snippets/               # Fragmentos de configuración reutilizables
```

### Estructura jerárquica de nginx.conf

```nginx
# Contexto principal (global)
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;

events {
    worker_connections 1024;
    multi_accept on;
}

http {
    # Configuración HTTP global
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;

    sendfile on;
    keepalive_timeout 65;

    # Incluir configuraciones de sitios
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    server {
        # Bloque de servidor (VirtualHost)
        listen 80;
        server_name www.ejemplo.com;

        location / {
            # Bloque de ubicación
            root /var/www/html;
            index index.html index.htm;
        }
    }
}
```

> **Para el examen:** La configuración de Nginx es jerárquica: `main` (global) contiene `events` y `http`. Dentro de `http` se definen bloques `server` (equivalentes a VirtualHosts de Apache), y dentro de `server` se definen bloques `location`.

## Directivas globales principales

### worker_processes

```nginx
# Número de procesos worker (auto = uno por núcleo de CPU)
worker_processes auto;
worker_processes 4;
```

### worker_connections

```nginx
events {
    # Número máximo de conexiones simultáneas por worker
    worker_connections 1024;
}
```

> **Para el examen:** El número máximo teórico de conexiones simultáneas es `worker_processes * worker_connections`. Con 4 workers y 1024 conexiones cada uno, se pueden manejar hasta 4096 conexiones simultáneas.

## Bloques server (Hosts virtuales)

### Servidor virtual básico

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name www.ejemplo.com ejemplo.com;

    root /var/www/ejemplo;
    index index.html index.htm index.php;

    access_log /var/log/nginx/ejemplo-access.log;
    error_log /var/log/nginx/ejemplo-error.log;
}
```

### Servidor predeterminado

```nginx
server {
    listen 80 default_server;
    server_name _;
    return 444;  # Cerrar la conexión sin respuesta
}
```

### Habilitar y deshabilitar sitios (Debian/Ubuntu)

```bash
# Crear enlace simbólico para habilitar
ln -s /etc/nginx/sites-available/ejemplo.conf /etc/nginx/sites-enabled/

# Eliminar enlace para deshabilitar
rm /etc/nginx/sites-enabled/ejemplo.conf

# Verificar y recargar
nginx -t && systemctl reload nginx
```

## Bloques location

Los bloques `location` determinan cómo Nginx procesa las peticiones según la URI solicitada.

### Tipos de coincidencia

```nginx
# Coincidencia por prefijo (menos prioritaria)
location /imagenes/ {
    root /var/www;
}

# Coincidencia exacta (máxima prioridad)
location = /favicon.ico {
    log_not_found off;
}

# Coincidencia por expresión regular (sensible a mayúsculas)
location ~ \.php$ {
    fastcgi_pass unix:/run/php/php-fpm.sock;
}

# Coincidencia por expresión regular (insensible a mayúsculas)
location ~* \.(jpg|jpeg|png|gif)$ {
    expires 30d;
}

# Coincidencia preferente por prefijo (prevalece sobre regex)
location ^~ /static/ {
    root /var/www;
}
```

### Orden de prioridad de location

1. `=` - Coincidencia exacta (mayor prioridad).
2. `^~` - Prefijo preferente (detiene la búsqueda de regex).
3. `~` y `~*` - Expresión regular (en orden de aparición).
4. Prefijo sin modificador (menor prioridad).

> **Para el examen:** El orden de prioridad de las directivas `location` es: exacta (`=`) > prefijo preferente (`^~`) > expresión regular (`~`/`~*`) > prefijo normal. Dentro de las regex, se usa la primera que coincida en el orden del archivo de configuración.

## Directiva try_files

`try_files` intenta servir archivos en un orden específico y, si ninguno existe, ejecuta una acción alternativa.

```nginx
# Intenta archivo, luego directorio, luego devuelve 404
location / {
    try_files $uri $uri/ =404;
}

# Patrón común para frameworks (reescritura a index.php)
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

# Intentar archivo estático, luego pasar al backend
location / {
    try_files $uri @backend;
}

location @backend {
    proxy_pass http://127.0.0.1:8080;
}
```

## Proxy inverso con proxy_pass

### Configuración básica

```nginx
server {
    listen 80;
    server_name www.ejemplo.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Cabeceras importantes para proxy

| Cabecera | Descripción |
|---|---|
| `Host` | Nombre de host original de la petición |
| `X-Real-IP` | IP real del cliente |
| `X-Forwarded-For` | Cadena de IPs de proxies intermedios |
| `X-Forwarded-Proto` | Protocolo original (http o https) |

## Balanceo de carga con upstream

```nginx
# Definir grupo de servidores backend
upstream backend_app {
    # Round-robin (predeterminado)
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080 weight=3;   # Triple de peticiones
    server 192.168.1.13:8080 backup;     # Solo si los demás fallan
    server 192.168.1.14:8080 down;       # Marcado como inactivo
}

server {
    listen 80;
    server_name www.ejemplo.com;

    location / {
        proxy_pass http://backend_app;
    }
}
```

### Métodos de balanceo

```nginx
# Round-robin (predeterminado, no requiere directiva)
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

# Least connections (envía al servidor con menos conexiones activas)
upstream backend {
    least_conn;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

# IP hash (mismo cliente siempre al mismo servidor)
upstream backend {
    ip_hash;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}
```

> **Para el examen:** El método `ip_hash` es útil para mantener la persistencia de sesión, ya que asegura que las peticiones del mismo cliente siempre se dirijan al mismo servidor backend.

## Configuración SSL en Nginx

```nginx
server {
    listen 443 ssl;
    server_name www.ejemplo.com;

    ssl_certificate /etc/ssl/certs/ejemplo.crt;
    ssl_certificate_key /etc/ssl/private/ejemplo.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name www.ejemplo.com;
    return 301 https://$host$request_uri;
}
```

## Páginas de error personalizadas

```nginx
server {
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;

    location = /404.html {
        root /var/www/errores;
        internal;
    }

    location = /50x.html {
        root /var/www/errores;
        internal;
    }
}
```

## Logging

```nginx
# Formato de log personalizado
log_format main '$remote_addr - $remote_user [$time_local] '
                '"$request" $status $body_bytes_sent '
                '"$http_referer" "$http_user_agent"';

# Logs por servidor virtual
access_log /var/log/nginx/ejemplo-access.log main;
error_log /var/log/nginx/ejemplo-error.log warn;

# Deshabilitar log de acceso para recursos estáticos
location ~* \.(jpg|png|css|js)$ {
    access_log off;
}
```

## Comandos de administración

```bash
# Verificar la sintaxis de configuración
nginx -t

# Recargar configuración sin detener el servicio
nginx -s reload

# Detener el servicio de forma ordenada
nginx -s quit

# Detener el servicio inmediatamente
nginx -s stop

# Mostrar la versión
nginx -v

# Mostrar versión y opciones de compilación
nginx -V
```

> **Para el examen:** Siempre ejecuta `nginx -t` antes de recargar la configuración con `nginx -s reload`. Esto evita que un error de sintaxis detenga el servicio. El comando `nginx -s reload` envía la señal SIGHUP al proceso maestro.
