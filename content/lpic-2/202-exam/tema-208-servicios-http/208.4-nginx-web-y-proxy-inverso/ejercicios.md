---
title: "208.4 - Nginx como servidor web y proxy inverso"
tags: [lpic-2, examen-202, tema-208, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.4"
---

# 208.4 - Ejercicios: Nginx como servidor web y proxy inverso

### Pregunta 1
¿Cuál es la estructura jerárquica correcta de los bloques de configuración en Nginx?

a) http → events → server → location
b) main → http → server → location
c) global → server → http → location
d) server → http → location → upstream

<details>
<summary>Respuesta</summary>

**b) main → http → server → location**

La configuración de Nginx tiene una estructura jerárquica: el contexto `main` (global) contiene los bloques `events` y `http`. Dentro de `http` se definen bloques `server` (equivalentes a VirtualHosts), y dentro de `server` se definen bloques `location` para gestionar las peticiones según la URI.
</details>

---

### Pregunta 2
¿Qué directiva de Nginx se utiliza para definir el número de conexiones simultáneas que puede manejar cada proceso worker?

a) max_connections
b) worker_processes
c) worker_connections
d) connection_limit

<details>
<summary>Respuesta</summary>

**c) worker_connections**

La directiva `worker_connections` se define dentro del bloque `events` y especifica el número máximo de conexiones simultáneas que cada proceso worker puede manejar. El número total teórico de conexiones es `worker_processes * worker_connections`.
</details>

---

### Pregunta 3
¿Qué directiva de Nginx se utiliza para reenviar peticiones a un servidor backend?

a) backend_pass
b) forward_to
c) proxy_pass
d) upstream_pass

<details>
<summary>Respuesta</summary>

**c) proxy_pass**

La directiva `proxy_pass` dentro de un bloque `location` reenvía las peticiones al servidor backend especificado. Por ejemplo, `proxy_pass http://127.0.0.1:8080;` envía todas las peticiones coincidentes al servidor que escucha en el puerto 8080 de localhost.
</details>

---

### Pregunta 4
¿Qué hace la directiva `try_files $uri $uri/ =404;` en Nginx?

a) Intenta crear el archivo solicitado, luego un directorio, y si falla devuelve un error 404
b) Intenta servir el archivo, luego busca un directorio con ese nombre, y si ninguno existe devuelve un error 404
c) Redirige todas las peticiones al archivo 404.html
d) Busca el archivo en tres ubicaciones diferentes

<details>
<summary>Respuesta</summary>

**b) Intenta servir el archivo, luego busca un directorio con ese nombre, y si ninguno existe devuelve un error 404**

`try_files` intenta servir los recursos en el orden especificado: primero el archivo correspondiente a `$uri`, luego un directorio `$uri/` (lo que buscaría el archivo índice dentro), y si ninguno existe, devuelve un código de error 404. El último argumento siempre es la acción de fallback.
</details>

---

### Pregunta 5
¿Qué método de balanceo de carga en Nginx garantiza que las peticiones de un mismo cliente siempre se dirijan al mismo servidor backend?

a) round_robin
b) least_conn
c) ip_hash
d) sticky

<details>
<summary>Respuesta</summary>

**c) ip_hash**

El método `ip_hash` utiliza la dirección IP del cliente para determinar a qué servidor backend se dirige la petición. Esto garantiza que las peticiones del mismo cliente siempre vayan al mismo servidor, lo que es útil para mantener la persistencia de sesión.
</details>

---

### Pregunta 6
¿Cuál es el orden correcto de prioridad de los modificadores de `location` en Nginx, de mayor a menor?

a) `~` > `^~` > `=` > prefijo normal
b) `=` > `^~` > `~`/`~*` > prefijo normal
c) `^~` > `=` > `~`/`~*` > prefijo normal
d) prefijo normal > `~`/`~*` > `^~` > `=`

<details>
<summary>Respuesta</summary>

**b) `=` > `^~` > `~`/`~*` > prefijo normal**

El orden de prioridad es: coincidencia exacta (`=`) tiene la mayor prioridad, seguida del prefijo preferente (`^~`) que detiene la búsqueda de expresiones regulares, luego las expresiones regulares (`~` sensible y `~*` insensible a mayúsculas) en orden de aparición, y finalmente el prefijo normal con la menor prioridad.
</details>

---

### Pregunta 7
¿Qué comando de Nginx verifica la sintaxis de la configuración sin reiniciar el servicio?

a) nginx -c
b) nginx -t
c) nginx -s check
d) nginx --verify

<details>
<summary>Respuesta</summary>

**b) nginx -t**

El comando `nginx -t` analiza todos los archivos de configuración y reporta errores de sintaxis sin afectar al servicio en ejecución. Es una práctica recomendada ejecutarlo siempre antes de `nginx -s reload` para evitar que un error de configuración interrumpa el servicio.
</details>

---

### Pregunta 8
En un bloque `upstream`, ¿qué significa marcar un servidor con la opción `backup`?

a) El servidor almacena una copia de seguridad de los datos
b) El servidor solo recibe peticiones cuando todos los demás servidores no están disponibles
c) El servidor tiene prioridad sobre los demás
d) El servidor se utiliza para replicar la configuración

<details>
<summary>Respuesta</summary>

**b) El servidor solo recibe peticiones cuando todos los demás servidores no están disponibles**

Un servidor marcado con `backup` en un bloque `upstream` actúa como reserva. Solo recibe tráfico cuando todos los servidores principales (no marcados como `backup` ni `down`) están inactivos o no responden. Es útil para implementar alta disponibilidad.
</details>

---

### Pregunta 9
¿Qué directiva de Nginx se utiliza para redirigir todo el tráfico HTTP al puerto 80 hacia HTTPS?

a) `redirect 301 https://$host$request_uri;`
b) `rewrite ^ https://$host$request_uri permanent;`
c) `return 301 https://$host$request_uri;`
d) `proxy_pass https://$host$request_uri;`

<details>
<summary>Respuesta</summary>

**c) `return 301 https://$host$request_uri;`**

La directiva `return 301` es la forma más eficiente y recomendada de redirigir en Nginx. Es más rápida que `rewrite` porque no necesita evaluar expresiones regulares. El código 301 indica una redirección permanente. La opción b) también funcionaría pero es menos eficiente.
</details>

---

### Pregunta 10
Un administrador quiere configurar Nginx para que sirva archivos estáticos desde `/var/www/static` cuando se accede a la URL `/assets/`. ¿Qué configuración es correcta?

a) `location /assets/ { root /var/www/static; }`
b) `location /assets/ { alias /var/www/static/; }`
c) `location /assets/ { document_root /var/www/static; }`
d) `location /assets/ { proxy_pass /var/www/static; }`

<details>
<summary>Respuesta</summary>

**b) `location /assets/ { alias /var/www/static/; }`**

La directiva `alias` reemplaza completamente la parte de la URI que coincide con el `location`. Así, `/assets/imagen.jpg` se sirve desde `/var/www/static/imagen.jpg`. Si se usara `root /var/www/static`, Nginx buscaría en `/var/www/static/assets/imagen.jpg`, añadiendo la URI completa a la ruta, que no es lo deseado en este caso.
</details>

---
