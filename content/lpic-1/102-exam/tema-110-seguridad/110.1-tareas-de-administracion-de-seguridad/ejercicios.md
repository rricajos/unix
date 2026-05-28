---
title: "110.1 Tareas de administracion de seguridad - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-110
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "110"
subtema: "110.1"
---

# 110.1 Tareas de administracion de seguridad - Ejercicios

### Pregunta 1

Que comando encuentra todos los archivos con el bit SUID activado en el sistema?

a) `find / -perm 4000 -type f 2>/dev/null`
b) `find / -perm -4000 -type f 2>/dev/null`
c) `locate --suid /`
d) `ls -laR / | grep suid`

<details><summary>Respuesta</summary>

**b) `find / -perm -4000 -type f 2>/dev/null`**

El comando `find / -perm -4000 -type f` busca archivos regulares que tengan al menos el bit SUID activado. El guion antes de 4000 (`-4000`) significa "al menos estos permisos". Sin el guion (`4000`, opcion A), buscaria archivos con exactamente esos permisos y nada mas. La redireccion `2>/dev/null` suprime los errores de permisos. Es importante auditar archivos SUID porque se ejecutan con los permisos del propietario (normalmente root).

</details>

---

### Pregunta 2

Un administrador necesita que el usuario `maria` pueda reiniciar nginx sin contrasena. Cual es la linea correcta en `/etc/sudoers`?

a) `maria ALL=(ALL) /usr/bin/systemctl restart nginx`
b) `maria ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx`
c) `maria NOPASSWD: systemctl restart nginx`
d) `maria ALL=NOPASSWD: restart nginx`

<details><summary>Respuesta</summary>

**b) `maria ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx`**

La sintaxis correcta de `/etc/sudoers` es: `usuario host=(usuario_ejecutar) opciones: comandos`. `ALL=(ALL)` permite ejecutar desde cualquier host como cualquier usuario, `NOPASSWD:` evita la solicitud de contrasena, y se debe especificar la ruta completa del comando. La opcion A es valida pero pedira contrasena (falta NOPASSWD). Siempre se debe editar con `visudo` para validar la sintaxis.

</details>

---

### Pregunta 3

Cual es la diferencia entre `su` y `su -`?

a) `su` inicia un login shell completo y `su -` mantiene el entorno actual
b) `su -` inicia un login shell completo cargando el entorno de root, y `su` mantiene el entorno actual
c) `su -` requiere la contrasena del usuario actual y `su` la de root
d) No hay diferencia practica entre ambos comandos

<details><summary>Respuesta</summary>

**b) `su -` inicia un login shell completo cargando el entorno de root, y `su` mantiene el entorno actual**

`su` cambia al usuario root pero mantiene el entorno actual (variables, directorio de trabajo, PATH). `su -` (equivalente a `su -l` o `su --login`) cambia a root con un login shell completo, cargando el entorno de root (/root como HOME, PATH de root, etc.). Se recomienda usar `su -` para tener un entorno limpio de root. Ambos requieren la contrasena de root (a diferencia de `sudo` que pide la contrasena del propio usuario).

</details>

---

### Pregunta 4

Que comando establece que la contrasena del usuario `juan` expire en un maximo de 60 dias?

a) `passwd -M 60 juan`
b) `chage -M 60 juan`
c) `usermod --expire 60 juan`
d) `chage -E 60 juan`

<details><summary>Respuesta</summary>

**b) `chage -M 60 juan`**

El comando `chage -M 60 juan` establece que la contrasena debe cambiarse cada 60 dias como maximo. Otras opciones de `chage`: `-m` (dias minimos entre cambios), `-W` (dias de aviso antes de caducidad), `-E` (fecha de expiracion de la cuenta, no de la contrasena), `-I` (dias de inactividad tras caducidad), `-d 0` (forzar cambio en proximo login). `chage -l juan` muestra toda la informacion de caducidad.

</details>

---

### Pregunta 5

Que comando muestra que proceso esta usando el puerto TCP 80?

a) `ps aux | grep port 80`
b) `lsof -i :80`
c) `top -p 80`
d) `which port 80`

<details><summary>Respuesta</summary>

**b) `lsof -i :80`**

El comando `lsof -i :80` lista los procesos que tienen abierto el puerto 80 (tanto TCP como UDP). Otras formas: `fuser -n tcp 80` identifica el proceso usando el puerto TCP 80, `ss -tulnp | grep :80` muestra los sockets en escucha en el puerto 80 con informacion del proceso. `lsof` (List Open Files) es una herramienta versatil que puede filtrar por puerto, protocolo, usuario o PID.

</details>

---

### Pregunta 6

Cual es la diferencia entre un limite `soft` y un limite `hard` en `/etc/security/limits.conf`?

a) `soft` es permanente y `hard` es temporal
b) `soft` es el limite actual que el usuario puede aumentar hasta el `hard`, y `hard` es el maximo absoluto que solo root puede aumentar
c) `hard` se aplica a usuarios y `soft` a grupos
d) `soft` limita CPU y `hard` limita memoria

<details><summary>Respuesta</summary>

**b) `soft` es el limite actual que el usuario puede aumentar hasta el `hard`, y `hard` es el maximo absoluto que solo root puede aumentar**

El soft limit es el limite actualmente en efecto que el usuario puede modificar (aumentar hasta el hard limit o reducir). El hard limit es el techo maximo que solo root puede aumentar. En `/etc/security/limits.conf`, el tipo `-` establece ambos limites al mismo valor. Los recursos comunes son: `nproc` (procesos), `nofile` (archivos abiertos), `fsize` (tamano de archivo), `core` (core dumps).

</details>

---

### Pregunta 7

Que comando muestra los usuarios conectados actualmente al sistema junto con el comando que estan ejecutando?

a) `who`
b) `w`
c) `last`
d) `lastlog`

<details><summary>Respuesta</summary>

**b) `w`**

El comando `w` muestra los usuarios conectados actualmente con informacion detallada: usuario, terminal, host remoto, hora de login, tiempo de inactividad (idle), carga del sistema y el comando que estan ejecutando en ese momento. `who` muestra los usuarios conectados pero con menos detalle (sin el comando actual ni el idle time). `last` muestra el historico de logins (pasado). `lastlog` muestra el ultimo login de cada usuario.

</details>

---

### Pregunta 8

Que comando busca archivos en el sistema que no tienen un propietario valido (usuario eliminado)?

a) `find / -noowner 2>/dev/null`
b) `find / -nouser 2>/dev/null`
c) `find / -user nobody 2>/dev/null`
d) `locate --orphan /`

<details><summary>Respuesta</summary>

**b) `find / -nouser 2>/dev/null`**

El parametro `-nouser` de `find` busca archivos cuyo UID numerico no corresponde a ningun usuario en `/etc/passwd`, lo cual ocurre cuando se elimina un usuario sin eliminar sus archivos. Similarmente, `-nogroup` busca archivos sin grupo valido. Estos archivos son un riesgo de seguridad porque si se crea un nuevo usuario con el mismo UID, heredaria automaticamente la propiedad de esos archivos. La opcion A usa `-noowner` que no es un parametro valido de `find`.

</details>

---

### Pregunta 9

Que herramienta se utiliza para editar de forma segura el archivo `/etc/sudoers`?

a) `nano /etc/sudoers`
b) `sudoedit /etc/sudoers`
c) `visudo`
d) `vim /etc/sudoers`

<details><summary>Respuesta</summary>

**c) `visudo`**

`visudo` es la herramienta designada para editar `/etc/sudoers` de forma segura. Valida la sintaxis antes de guardar, evitando errores que podrian dejar el sistema sin acceso sudo. Tambien implementa bloqueo de archivo para evitar ediciones simultaneas. Editar directamente con `nano` o `vim` (opciones A y D) es peligroso porque un error de sintaxis puede bloquear todo el acceso sudo. `sudoedit` se usa para editar otros archivos con privilegios, no para editar sudoers.

</details>

---

### Pregunta 10

Que hace el comando `nmap -sn 192.168.1.0/24`?

a) Escanea todos los puertos de los hosts en la red 192.168.1.0/24
b) Realiza un escaneo de descubrimiento de hosts (ping scan) sin escanear puertos
c) Escanea solo los puertos bien conocidos (0-1023)
d) Realiza un escaneo sigiloso (stealth) de toda la subred

<details><summary>Respuesta</summary>

**b) Realiza un escaneo de descubrimiento de hosts (ping scan) sin escanear puertos**

La opcion `-sn` (antes `-sP`) de `nmap` realiza un ping scan, que descubre que hosts estan activos en la red sin escanear sus puertos. Es util para obtener un inventario rapido de dispositivos en la red. Otras opciones de nmap: `-sT` (escaneo TCP connect), `-sS` (escaneo SYN stealth, requiere root), `-sU` (escaneo UDP), `-p` (puertos especificos), `-O` (detectar sistema operativo), `-sV` (detectar version de servicios).

</details>
