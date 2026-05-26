---
title: "208.3 - Squid como proxy caché"
tags: [lpic-2, examen-202, tema-208, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.3"
---

# 208.3 - Comandos clave: Squid como proxy caché

## Comandos de gestión del servicio Squid

| Comando | Descripción |
|---|---|
| `squid -z` | Inicializa los directorios de caché |
| `squid -k parse` | Verifica la sintaxis de `squid.conf` |
| `squid -k reconfigure` | Recarga la configuración sin reiniciar el servicio |
| `squid -k rotate` | Rota los archivos de log |
| `squid -k shutdown` | Detiene Squid de forma ordenada |
| `squid -k check` | Verifica si Squid está en ejecución |
| `systemctl restart squid` | Reinicia el servicio Squid |
| `systemctl reload squid` | Recarga la configuración de Squid |

## Comandos de squidclient

| Comando | Descripción |
|---|---|
| `squidclient mgr:info` | Muestra información general del proxy |
| `squidclient mgr:mem` | Muestra estadísticas de uso de memoria |
| `squidclient mgr:counters` | Muestra contadores de tráfico |
| `squidclient mgr:utilization` | Muestra uso de la caché |
| `squidclient mgr:active_requests` | Muestra las peticiones activas |
| `squidclient -m PURGE http://url` | Purga un objeto específico de la caché |
| `squidclient -h host -p 3128 http://url` | Hace una petición a través del proxy |

## Directivas principales de squid.conf

| Directiva | Ejemplo | Descripción |
|---|---|---|
| `http_port` | `3128` | Puerto de escucha del proxy |
| `http_port` | `3128 intercept` | Modo proxy transparente |
| `cache_dir` | `ufs /var/spool/squid 100 16 256` | Directorio y tamaño de la caché |
| `cache_mem` | `256 MB` | Memoria RAM dedicada a la caché |
| `maximum_object_size` | `4 MB` | Tamaño máximo de objeto en caché |
| `acl` | `red_local src 192.168.1.0/24` | Define una lista de control de acceso |
| `http_access` | `allow red_local` | Aplica una regla de acceso basada en ACL |
| `cache_peer` | `padre parent 3128 3130` | Define un proxy padre o hermano |
| `icp_port` | `3130` | Puerto ICP para jerarquía de caché |
| `auth_param` | `basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/passwd` | Configura autenticación |

## Tipos de ACL más importantes

| Tipo | Ejemplo | Descripción |
|---|---|---|
| `src` | `192.168.1.0/24` | IP o red de origen del cliente |
| `dst` | `10.0.0.0/8` | IP o red de destino |
| `dstdomain` | `.ejemplo.com` | Dominio de destino |
| `srcdomain` | `.empresa.com` | Dominio de origen (DNS inverso) |
| `time` | `MTWHF 08:00-18:00` | Franja horaria |
| `port` | `80 443 8080` | Puertos de destino |
| `proto` | `HTTP FTP` | Protocolo utilizado |
| `method` | `CONNECT GET POST` | Método HTTP |
| `url_regex` | `-i \.exe$` | Expresión regular sobre la URL |
| `proxy_auth` | `REQUIRED` | Requiere autenticación |

## Archivos y directorios clave

| Ruta | Descripción |
|---|---|
| `/etc/squid/squid.conf` | Archivo de configuración principal |
| `/var/spool/squid/` | Directorio de caché en disco |
| `/var/log/squid/access.log` | Log de peticiones procesadas |
| `/var/log/squid/cache.log` | Log de eventos del servicio |
| `/var/log/squid/store.log` | Log de objetos en caché |
| `/etc/squid/passwd` | Archivo de contraseñas para autenticación NCSA |
