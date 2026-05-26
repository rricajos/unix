---
title: "208.4 - Nginx como servidor web y proxy inverso"
tags: [lpic-2, examen-202, tema-208, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.4"
---

# 208.4 - Comandos clave: Nginx como servidor web y proxy inverso

## Comandos de administración de Nginx

| Comando | Descripción |
|---|---|
| `nginx -t` | Verifica la sintaxis de la configuración |
| `nginx -T` | Verifica la sintaxis y muestra la configuración completa |
| `nginx -s reload` | Recarga la configuración sin detener el servicio |
| `nginx -s stop` | Detiene Nginx inmediatamente |
| `nginx -s quit` | Detiene Nginx de forma ordenada (espera conexiones) |
| `nginx -s reopen` | Reabre los archivos de log |
| `nginx -v` | Muestra la versión de Nginx |
| `nginx -V` | Muestra la versión y las opciones de compilación |
| `nginx -c /ruta/nginx.conf` | Inicia Nginx con un archivo de configuración alternativo |

## Directivas del contexto principal (main)

| Directiva | Ejemplo | Descripción |
|---|---|---|
| `user` | `www-data` | Usuario bajo el que se ejecutan los workers |
| `worker_processes` | `auto` | Número de procesos worker |
| `pid` | `/run/nginx.pid` | Archivo del PID del proceso maestro |
| `error_log` | `/var/log/nginx/error.log` | Archivo de log de errores global |

## Directivas del contexto events

| Directiva | Ejemplo | Descripción |
|---|---|---|
| `worker_connections` | `1024` | Conexiones simultáneas por worker |
| `multi_accept` | `on` | Acepta múltiples conexiones a la vez |

## Directivas del contexto http/server

| Directiva | Ejemplo | Descripción |
|---|---|---|
| `listen` | `80` / `443 ssl` | Puerto y opciones de escucha |
| `server_name` | `www.ejemplo.com` | Nombre del servidor virtual |
| `root` | `/var/www/html` | Directorio raíz de documentos |
| `index` | `index.html index.php` | Archivos índice predeterminados |
| `error_page` | `404 /404.html` | Página de error personalizada |
| `access_log` | `/var/log/nginx/access.log` | Archivo de log de acceso |
| `error_log` | `/var/log/nginx/error.log warn` | Log de errores con nivel de detalle |
| `sendfile` | `on` | Optimiza la transferencia de archivos |
| `keepalive_timeout` | `65` | Tiempo de espera para keep-alive |

## Directivas de location y contenido

| Directiva | Ejemplo | Descripción |
|---|---|---|
| `try_files` | `$uri $uri/ =404` | Intenta servir archivos en orden |
| `return` | `301 https://$host$request_uri` | Devuelve un código de estado o redirección |
| `rewrite` | `^/old(.*)$ /new$1 permanent` | Reescritura de URL |
| `alias` | `/ruta/alternativa/` | Ruta alternativa al sistema de archivos |
| `internal` | (sin valor) | Limita el acceso solo a peticiones internas |

## Directivas de proxy inverso

| Directiva | Ejemplo | Descripción |
|---|---|---|
| `proxy_pass` | `http://127.0.0.1:8080` | Reenvía la petición al backend |
| `proxy_set_header` | `Host $host` | Establece cabeceras hacia el backend |
| `proxy_connect_timeout` | `60s` | Timeout de conexión al backend |
| `proxy_read_timeout` | `60s` | Timeout de lectura del backend |
| `upstream` | (bloque) | Define grupo de servidores para balanceo |

## Métodos de balanceo en upstream

| Método | Descripción |
|---|---|
| (round-robin) | Distribución secuencial (predeterminado) |
| `least_conn` | Envía al servidor con menos conexiones activas |
| `ip_hash` | Mismo cliente siempre al mismo servidor |
| `weight=N` | Peso relativo del servidor en el balanceo |
| `backup` | Servidor de respaldo, usado si los demás fallan |
| `down` | Marca el servidor como inactivo |

## Modificadores de location

| Modificador | Descripción | Prioridad |
|---|---|---|
| `=` | Coincidencia exacta | 1 (mayor) |
| `^~` | Prefijo preferente (detiene búsqueda de regex) | 2 |
| `~` | Expresión regular (sensible a mayúsculas) | 3 |
| `~*` | Expresión regular (insensible a mayúsculas) | 3 |
| (ninguno) | Prefijo normal | 4 (menor) |

## Archivos y directorios clave

| Ruta | Descripción |
|---|---|
| `/etc/nginx/nginx.conf` | Archivo de configuración principal |
| `/etc/nginx/sites-available/` | Sitios disponibles (Debian/Ubuntu) |
| `/etc/nginx/sites-enabled/` | Sitios habilitados (Debian/Ubuntu) |
| `/etc/nginx/conf.d/` | Configuraciones adicionales (Red Hat/CentOS) |
| `/var/log/nginx/access.log` | Log de acceso predeterminado |
| `/var/log/nginx/error.log` | Log de errores predeterminado |
