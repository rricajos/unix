---
title: "208.1 - Configuración básica de Apache"
tags: [lpic-2, examen-202, tema-208, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.1"
---

# 208.1 - Ejercicios: Configuración básica de Apache

### Pregunta 1
¿Cuál es el archivo de configuración principal de Apache en una distribución basada en Red Hat/CentOS?

a) /etc/apache2/apache2.conf
b) /etc/httpd/httpd.conf
c) /etc/httpd/conf/httpd.conf
d) /etc/apache/httpd.conf

<details>
<summary>Respuesta</summary>

**c) /etc/httpd/conf/httpd.conf**

En distribuciones basadas en Red Hat/CentOS, el archivo de configuración principal de Apache se encuentra en `/etc/httpd/conf/httpd.conf`. En Debian/Ubuntu, el equivalente es `/etc/apache2/apache2.conf`.
</details>

---

### Pregunta 2
¿Qué comando se utiliza en Debian/Ubuntu para habilitar el módulo `mod_rewrite`?

a) apache2ctl enable rewrite
b) a2enmod rewrite
c) httpd -enable rewrite
d) modprobe rewrite

<details>
<summary>Respuesta</summary>

**b) a2enmod rewrite**

El comando `a2enmod` se utiliza en distribuciones Debian/Ubuntu para habilitar módulos de Apache. Crea un enlace simbólico desde `mods-available` hacia `mods-enabled`. Su opuesto es `a2dismod`.
</details>

---

### Pregunta 3
En un VirtualHost basado en nombre, ¿qué cabecera HTTP utiliza Apache para determinar qué VirtualHost debe responder a la petición?

a) Accept
b) Referer
c) Host
d) X-Forwarded-For

<details>
<summary>Respuesta</summary>

**c) Host**

Apache utiliza la cabecera `Host` de la petición HTTP para identificar qué VirtualHost basado en nombre debe procesar la solicitud. Esta cabecera contiene el nombre de dominio solicitado por el cliente.
</details>

---

### Pregunta 4
¿Qué directiva de Apache 2.4 se utiliza para permitir el acceso solo desde la red 10.0.0.0/8?

a) Allow from 10.0.0.0/8
b) Require ip 10.0.0.0/8
c) Grant ip 10.0.0.0/8
d) Access allow 10.0.0.0/8

<details>
<summary>Respuesta</summary>

**b) Require ip 10.0.0.0/8**

En Apache 2.4, el control de acceso se realiza mediante la directiva `Require`. La opción `Allow from` pertenece a la sintaxis antigua de Apache 2.2, que solo funciona si se tiene cargado el módulo `mod_access_compat`.
</details>

---

### Pregunta 5
¿Qué hace el comando `apachectl graceful`?

a) Detiene Apache inmediatamente
b) Reinicia Apache cortando todas las conexiones activas
c) Recarga la configuración sin interrumpir las conexiones existentes
d) Verifica la sintaxis del archivo de configuración

<details>
<summary>Respuesta</summary>

**c) Recarga la configuración sin interrumpir las conexiones existentes**

El comando `apachectl graceful` envía la señal `SIGUSR1` al proceso Apache, lo que provoca que recargue su configuración sin interrumpir las conexiones activas. Los procesos hijo terminan de atender las peticiones actuales antes de releer la configuración.
</details>

---

### Pregunta 6
¿Cuál es el orden correcto de procesamiento de las directivas de contenedor en Apache?

a) Location → Directory → Files
b) Files → Directory → Location
c) Directory → Files → Location
d) Location → Files → Directory

<details>
<summary>Respuesta</summary>

**c) Directory → Files → Location**

El orden de procesamiento en Apache es: primero `<Directory>` (y `.htaccess`), luego `<DirectoryMatch>`, después `<Files>` (y `<FilesMatch>`), y finalmente `<Location>` (y `<LocationMatch>`). Las directivas procesadas después pueden sobreescribir las anteriores.
</details>

---

### Pregunta 7
¿Qué valor de `AllowOverride` proporciona el mejor rendimiento al deshabilitar completamente los archivos `.htaccess`?

a) AllowOverride All
b) AllowOverride Off
c) AllowOverride None
d) AllowOverride Disabled

<details>
<summary>Respuesta</summary>

**c) AllowOverride None**

Cuando `AllowOverride` se establece en `None`, Apache no busca archivos `.htaccess` en los directorios, lo que mejora el rendimiento al evitar lecturas innecesarias del sistema de archivos en cada petición.
</details>

---

### Pregunta 8
¿Qué variable del `LogFormat` de Apache representa el código de estado HTTP final de la respuesta?

a) %s
b) %r
c) %>s
d) %{status}

<details>
<summary>Respuesta</summary>

**c) %>s**

La variable `%>s` representa el código de estado final de la respuesta HTTP. El símbolo `>` indica que se toma el estado final (después de redirecciones internas). Sin el `>`, se tomaría el estado original de la petición.
</details>

---

### Pregunta 9
¿Qué MPM (Multi-Processing Module) de Apache es necesario cuando se utiliza `mod_php`?

a) event
b) worker
c) prefork
d) proxy

<details>
<summary>Respuesta</summary>

**c) prefork**

El MPM `prefork` utiliza un proceso separado para cada conexión, sin hilos. Es necesario para módulos que no son seguros para hilos (non-thread-safe) como `mod_php`. Los MPMs `worker` y `event` utilizan hilos y son incompatibles con `mod_php`.
</details>

---

### Pregunta 10
Un administrador necesita crear un archivo de contraseñas para autenticación básica de Apache y añadir el primer usuario. ¿Qué comando debe utilizar?

a) htpasswd /etc/apache2/.htpasswd usuario1
b) htpasswd -c /etc/apache2/.htpasswd usuario1
c) passwd -c /etc/apache2/.htpasswd usuario1
d) apache2-passwd --create usuario1

<details>
<summary>Respuesta</summary>

**b) htpasswd -c /etc/apache2/.htpasswd usuario1**

La opción `-c` de `htpasswd` crea un nuevo archivo de contraseñas. Sin `-c`, el comando intenta añadir o modificar un usuario en un archivo existente. Es importante usar `-c` solo la primera vez, ya que sobreescribiría el archivo existente eliminando todos los usuarios previos.
</details>

---
