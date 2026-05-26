---
title: "208.3 - Squid como proxy caché"
tags: [lpic-2, examen-202, tema-208, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.3"
---

# 208.3 - Ejercicios: Squid como proxy caché

### Pregunta 1
¿Cuál es el puerto predeterminado en el que Squid escucha las conexiones de los clientes?

a) 8080
b) 80
c) 3128
d) 8888

<details>
<summary>Respuesta</summary>

**c) 3128**

El puerto predeterminado de Squid es 3128, configurado mediante la directiva `http_port` en `/etc/squid/squid.conf`. Aunque puede cambiarse a cualquier otro puerto, 3128 es el estándar reconocido para proxies Squid.
</details>

---

### Pregunta 2
¿Qué tipo de ACL en Squid se utiliza para filtrar peticiones basándose en el dominio de destino?

a) src
b) dst
c) dstdomain
d) url_regex

<details>
<summary>Respuesta</summary>

**c) dstdomain**

La ACL de tipo `dstdomain` filtra las peticiones según el nombre de dominio de destino. Por ejemplo, `acl bloqueados dstdomain .facebook.com` coincide con cualquier petición dirigida a facebook.com o sus subdominios. El tipo `dst` filtra por dirección IP de destino, no por nombre de dominio.
</details>

---

### Pregunta 3
¿Qué comando debe ejecutarse antes del primer inicio de Squid para crear la estructura de directorios de la caché?

a) squid -k reconfigure
b) squid -k init
c) squid -z
d) squid --create-cache

<details>
<summary>Respuesta</summary>

**c) squid -z**

El comando `squid -z` crea la estructura de directorios de caché definida en la directiva `cache_dir`. Debe ejecutarse antes del primer inicio del servicio para que Squid pueda almacenar los objetos en caché correctamente.
</details>

---

### Pregunta 4
En la directiva `cache_dir ufs /var/spool/squid 100 16 256`, ¿qué representa el valor 100?

a) El número máximo de archivos en caché
b) El tamaño máximo de la caché en disco en megabytes
c) El número de subdirectorios de nivel 1
d) El porcentaje máximo de uso del disco

<details>
<summary>Respuesta</summary>

**b) El tamaño máximo de la caché en disco en megabytes**

En la directiva `cache_dir`, los parámetros son: tipo de almacenamiento (`ufs`), directorio (`/var/spool/squid`), tamaño en MB (100), subdirectorios de nivel 1 (16) y subdirectorios de nivel 2 (256).
</details>

---

### Pregunta 5
¿Qué código de estado en el log de Squid indica que un objeto fue servido directamente desde la caché?

a) TCP_MISS
b) TCP_HIT
c) TCP_DENIED
d) TCP_REFRESH

<details>
<summary>Respuesta</summary>

**b) TCP_HIT**

`TCP_HIT` en el `access.log` de Squid indica que el objeto solicitado se encontró en la caché y fue servido al cliente sin necesidad de contactar el servidor origen. `TCP_MISS` indica que el objeto no estaba en caché y tuvo que descargarse.
</details>

---

### Pregunta 6
¿Cuál es la forma correcta de configurar Squid como proxy transparente en versiones recientes?

a) http_port 3128 transparent
b) http_port 3128 intercept
c) http_port 3128 redirect
d) http_port 3128 inline

<details>
<summary>Respuesta</summary>

**b) http_port 3128 intercept**

En versiones recientes de Squid (3.1+), la palabra clave correcta es `intercept` en lugar de `transparent`. Ambas opciones configuran el modo proxy transparente, pero `transparent` está obsoleta. Además, se necesitan reglas de iptables para redirigir el tráfico al puerto del proxy.
</details>

---

### Pregunta 7
¿Qué representan las letras MTWHF en una ACL de tipo `time` en Squid?

a) Month, Tuesday, Wednesday, Thursday, Friday
b) Monday, Tuesday, Wednesday, Thursday, Friday
c) Monday, Thursday, Wednesday, Holiday, Friday
d) Monday, Tuesday, Week, Holiday, Friday

<details>
<summary>Respuesta</summary>

**b) Monday, Tuesday, Wednesday, Thursday, Friday**

En las ACLs de tipo `time`, cada día se representa con una letra: S=Sunday, M=Monday, T=Tuesday, W=Wednesday, H=Thursday, F=Friday, A=Saturday. MTWHF corresponde a los días laborales de lunes a viernes.
</details>

---

### Pregunta 8
¿Qué directiva de Squid especifica la cantidad de memoria RAM que puede utilizarse para almacenar objetos en caché?

a) memory_cache
b) ram_cache_size
c) cache_mem
d) maximum_memory

<details>
<summary>Respuesta</summary>

**c) cache_mem**

La directiva `cache_mem` especifica la cantidad de memoria RAM que Squid dedica a almacenar los objetos más frecuentemente solicitados. Por ejemplo, `cache_mem 256 MB`. Esto es adicional a la memoria que Squid necesita para su funcionamiento normal.
</details>

---

### Pregunta 9
Un administrador quiere recargar la configuración de Squid sin interrumpir las conexiones activas. ¿Qué comando debe usar?

a) squid -k restart
b) squid -k reload
c) squid -k reconfigure
d) squid -k refresh

<details>
<summary>Respuesta</summary>

**c) squid -k reconfigure**

El comando `squid -k reconfigure` hace que Squid relea su archivo de configuración sin necesidad de reiniciar el servicio. Las conexiones activas no se interrumpen. Es equivalente a enviar la señal SIGHUP al proceso de Squid.
</details>

---

### Pregunta 10
¿Qué protocolo utiliza Squid para comunicarse con otros proxies en una jerarquía de caché y en qué puerto opera por defecto?

a) HTTP en el puerto 3128
b) HTCP en el puerto 4827
c) ICP en el puerto 3130
d) SNMP en el puerto 3401

<details>
<summary>Respuesta</summary>

**c) ICP en el puerto 3130**

ICP (Internet Cache Protocol) es el protocolo utilizado por Squid para comunicarse con proxies hermanos (sibling) y padres (parent) en una jerarquía de caché. Funciona sobre UDP en el puerto 3130 por defecto, configurado mediante la directiva `icp_port`.
</details>

---
