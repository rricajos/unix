---
title: "208.3 - Squid como proxy caché"
tags: [lpic-2, examen-202, tema-208, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.3"
---

# 208.3 - Squid como proxy caché

## Peso: 2

## Introducción

Squid es un servidor proxy caché ampliamente utilizado en entornos Linux. Permite almacenar en caché contenido web para mejorar el rendimiento, controlar el acceso a Internet mediante ACLs y actuar como proxy transparente o proxy inverso. El archivo de configuración principal es `/etc/squid/squid.conf`.

## Instalación y servicio

```bash
# Debian/Ubuntu
apt install squid
systemctl enable squid
systemctl start squid

# Red Hat/CentOS
yum install squid
systemctl enable squid
systemctl start squid
```

## Configuración básica de squid.conf

### Puerto de escucha

```conf
# Puerto estándar del proxy
http_port 3128

# Escuchar en una IP específica
http_port 192.168.1.1:3128

# Modo proxy transparente
http_port 3128 transparent
# O en versiones más recientes
http_port 3128 intercept
```

> **Para el examen:** El puerto predeterminado de Squid es 3128. En modo transparente, los clientes no necesitan configurar el proxy en su navegador; el tráfico se redirige al proxy mediante reglas de iptables.

### Configuración de caché

```conf
# Directorio de caché en disco
# cache_dir tipo directorio tamaño_MB L1 L2
cache_dir ufs /var/spool/squid 100 16 256

# Caché en memoria
cache_mem 256 MB

# Tamaño máximo de objeto en memoria
maximum_object_size_in_memory 512 KB

# Tamaño máximo de objeto en disco
maximum_object_size 4 MB

# Tamaño mínimo de objeto en disco
minimum_object_size 0 KB
```

- **ufs**: Formato de almacenamiento estándar de Squid.
- **100**: Tamaño máximo de la caché en disco en MB.
- **16**: Número de subdirectorios de nivel 1.
- **256**: Número de subdirectorios de nivel 2.

### Otros tipos de almacenamiento

```conf
# AUFS - Asynchronous UFS (mejor rendimiento)
cache_dir aufs /var/spool/squid 10000 16 256

# Diskd - Proceso separado para E/S de disco
cache_dir diskd /var/spool/squid 10000 16 256
```

## Listas de Control de Acceso (ACLs)

Las ACLs son el mecanismo central de Squid para controlar el acceso. Se definen en dos pasos: primero se define la ACL y luego se aplica una regla.

### Tipos de ACL comunes

```conf
# Por dirección IP de origen
acl red_local src 192.168.1.0/24

# Por dirección IP de destino
acl servidores_internos dst 10.0.0.0/8

# Por dominio de destino
acl dominios_bloqueados dstdomain .facebook.com .twitter.com

# Por dominio de origen (requiere resolución DNS inversa)
acl origen_dominio srcdomain .empresa.com

# Por horario
acl horario_laboral time MTWHF 08:00-18:00

# Por puerto
acl puertos_seguros port 80 443 8080

# Por protocolo
acl protocolo_ftp proto FTP

# Por URL con expresión regular
acl url_prohibida url_regex -i \.exe$ \.torrent$

# Por tipo MIME de la respuesta
acl tipo_video rep_mime_type video/mp4

# Por método HTTP
acl metodo_connect method CONNECT
```

> **Para el examen:** Los días de la semana en la ACL `time` se representan como: S=Sunday, M=Monday, T=Tuesday, W=Wednesday, H=Thursday, F=Friday, A=Saturday. Nota que Thursday es `H` y Saturday es `A`.

### Reglas de acceso (http_access)

```conf
# Permitir acceso a la red local
acl red_local src 192.168.1.0/24
http_access allow red_local

# Bloquear dominios específicos
acl bloqueados dstdomain .facebook.com .youtube.com
http_access deny bloqueados

# Permitir solo en horario laboral
acl horario time MTWHF 09:00-17:00
http_access allow red_local horario

# Regla final: denegar todo lo demás
http_access deny all
```

> **Para el examen:** El orden de las reglas `http_access` es fundamental. Squid las procesa de arriba a abajo y aplica la primera regla que coincida. La última regla debe ser siempre `http_access deny all` para denegar todo lo que no esté explícitamente permitido.

## Proxy transparente

En un proxy transparente, el tráfico del cliente se redirige al proxy sin necesidad de configurar el navegador.

### Configuración de Squid

```conf
http_port 3128 intercept
```

### Reglas de iptables para redirigir el tráfico

```bash
# Redirigir todo el tráfico HTTP al proxy
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 \
    -j REDIRECT --to-port 3128

# No redirigir el tráfico del propio servidor proxy
iptables -t nat -A OUTPUT -p tcp --dport 80 \
    -m owner --uid-owner squid -j ACCEPT
```

## Proxy inverso (Reverse Proxy)

Squid puede actuar como proxy inverso para servir contenido desde servidores backend.

```conf
# Configurar como proxy inverso
http_port 80 accel defaultsite=www.ejemplo.com vhost

# Definir el servidor backend
cache_peer 192.168.1.10 parent 80 0 no-query originserver name=backend

# Regla de acceso
acl sitio dstdomain www.ejemplo.com
http_access allow sitio
cache_peer_access backend allow sitio
```

## Jerarquía de caché (Cache Hierarchy)

Squid permite configurar jerarquías de caché con servidores padre (parent) y hermanos (sibling).

```conf
# Proxy padre (reenvía peticiones si no tiene la respuesta en caché)
cache_peer proxy-padre.empresa.com parent 3128 3130

# Proxy hermano (solo comparte caché, no reenvía peticiones)
cache_peer proxy-hermano.empresa.com sibling 3128 3130

# ICP (Internet Cache Protocol) para comunicación entre proxies
icp_port 3130
```

> **Para el examen:** ICP (Internet Cache Protocol) utiliza el puerto UDP 3130 por defecto para la comunicación entre proxies en una jerarquía de caché.

## Autenticación

### Autenticación básica con NCSA

```conf
# Configurar el programa de autenticación
auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/passwd
auth_param basic realm Proxy Corporativo
auth_param basic credentialsttl 2 hours
auth_param basic children 5

# Crear ACL para usuarios autenticados
acl usuarios_autenticados proxy_auth REQUIRED
http_access allow usuarios_autenticados
```

### Crear usuarios

```bash
# Crear archivo de contraseñas y primer usuario
htpasswd -c /etc/squid/passwd usuario1

# Añadir más usuarios
htpasswd /etc/squid/passwd usuario2
```

## Archivos de log

| Archivo | Descripción |
|---|---|
| `/var/log/squid/access.log` | Registro de todas las peticiones procesadas |
| `/var/log/squid/cache.log` | Registro de eventos del servicio Squid |
| `/var/log/squid/store.log` | Registro de objetos almacenados/eliminados de la caché |

### Formato del access.log

```
timestamp elapsed client action/code size method URL user hierarchy content_type
```

- **TCP_HIT**: Objeto servido desde la caché.
- **TCP_MISS**: Objeto no encontrado en caché, obtenido del servidor origen.
- **TCP_DENIED**: Acceso denegado por ACL.

## squidclient - Herramienta de diagnóstico

```bash
# Consultar estadísticas de la caché
squidclient mgr:info

# Ver estadísticas de uso de memoria
squidclient mgr:mem

# Ver contadores de tráfico
squidclient mgr:counters

# Ver las ACLs activas
squidclient mgr:active_requests

# Purgar un objeto de la caché
squidclient -m PURGE http://www.ejemplo.com/imagen.jpg
```

## Verificación y recarga de configuración

```bash
# Verificar la sintaxis de squid.conf
squid -k parse

# Recargar la configuración sin reiniciar
squid -k reconfigure

# Rotar los archivos de log
squid -k rotate

# Inicializar los directorios de caché
squid -z
```

> **Para el examen:** El comando `squid -z` debe ejecutarse antes del primer inicio de Squid para crear la estructura de directorios de la caché. Después de modificar `squid.conf`, usa `squid -k reconfigure` para aplicar los cambios sin interrumpir el servicio.
