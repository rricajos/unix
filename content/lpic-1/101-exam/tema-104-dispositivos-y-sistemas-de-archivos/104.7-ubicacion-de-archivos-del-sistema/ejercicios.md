---
title: "104.7 Encontrar archivos del sistema y su ubicacion correcta - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.7"
---

# 104.7 Encontrar archivos del sistema y su ubicacion correcta - Ejercicios

### Pregunta 1

Segun el FHS, en que directorio deberia ubicarse el software compilado e instalado manualmente por el administrador del sistema?

a) `/opt`
b) `/usr/bin`
c) `/usr/local`
d) `/var/lib`

<details>
<summary>Respuesta</summary>

**c) `/usr/local`**

Segun el Filesystem Hierarchy Standard (FHS), `/usr/local` es la jerarquia terciaria destinada al software instalado localmente por el administrador, tipicamente compilado desde el codigo fuente. Tiene su propia estructura con `bin/`, `sbin/`, `lib/`, etc. El software instalado aqui no es gestionado por el gestor de paquetes de la distribucion. `/opt` es para software de terceros que se instala como paquetes autocontenidos (por ejemplo, Google Chrome). `/usr/bin` contiene binarios instalados por el gestor de paquetes. `/var/lib` almacena datos de estado de aplicaciones.

</details>

---

### Pregunta 2

Cual es la diferencia entre `/tmp` y `/var/tmp` segun el FHS?

a) `/tmp` persiste entre reinicios y `/var/tmp` se borra al reiniciar
b) `/tmp` se borra al reiniciar y `/var/tmp` persiste entre reinicios
c) Ambos se borran al reiniciar el sistema
d) Ambos persisten entre reinicios del sistema

<details>
<summary>Respuesta</summary>

**b) `/tmp` se borra al reiniciar y `/var/tmp` persiste entre reinicios**

`/tmp` es para archivos temporales de corta vida que se limpian al reiniciar el sistema (o periodicamente por systemd-tmpfiles o tmpwatch). `/var/tmp` es para archivos temporales que deben sobrevivir a reinicios del sistema, siendo mas adecuado para datos temporales de larga duracion. Esta distincion es importante para el examen LPIC-1 y para decidir donde almacenar archivos temporales segun si necesitan persistencia entre reinicios o no.

</details>

---

### Pregunta 3

Un administrador necesita encontrar rapidamente la ubicacion del archivo `updatedb.conf` sin recorrer el disco en tiempo real. Cual es el comando mas adecuado?

a) `find / -name "updatedb.conf"`
b) `locate updatedb.conf`
c) `which updatedb.conf`
d) `whereis updatedb.conf`

<details>
<summary>Respuesta</summary>

**b) `locate updatedb.conf`**

`locate` busca en una base de datos indexada previamente construida por `updatedb`, lo que lo hace extremadamente rapido en comparacion con `find`, que recorre el arbol de directorios en tiempo real. `which` solo busca ejecutables en las rutas del `$PATH`, no archivos de configuracion. `whereis` busca binarios, paginas de manual y codigo fuente en ubicaciones estandar, pero no archivos de configuracion genericos. La unica desventaja de `locate` es que la base de datos puede estar desactualizada si el archivo fue creado recientemente (se actualiza normalmente una vez al dia via cron).

</details>

---

### Pregunta 4

Cual de los siguientes comandos identifica correctamente si `cd` es un comando interno (builtin) del shell o un programa externo?

a) `which cd`
b) `whereis cd`
c) `type cd`
d) `find / -name cd`

<details>
<summary>Respuesta</summary>

**c) `type cd`**

`type` es un builtin del shell que identifica que tipo de comando es: builtin, alias, funcion del shell, palabra reservada o archivo externo. Para `cd`, mostraria "cd is a shell builtin". `which` solo busca ejecutables en las rutas del `$PATH` y no reconoce builtins (no devolveria resultado para `cd`). `whereis` busca binarios, fuentes y paginas de manual pero tampoco identifica builtins. `find` busca archivos en el sistema de archivos y desconoce los builtins del shell. `type -a` muestra todas las formas en que un comando esta disponible.

</details>

---

### Pregunta 5

`locate` no encuentra un archivo que fue creado hace 5 minutos. Cual es la causa y como se soluciona?

a) El archivo no tiene permisos de lectura; ejecutar `chmod +r` en el archivo
b) La base de datos de `locate` esta desactualizada; ejecutar `sudo updatedb`
c) `locate` solo busca en `/usr`; usar `find` para buscar en toda la ruta
d) El archivo esta en un directorio excluido; mover el archivo a `/home`

<details>
<summary>Respuesta</summary>

**b) La base de datos de `locate` esta desactualizada; ejecutar `sudo updatedb`**

`locate` busca en una base de datos indexada que se actualiza periodicamente, normalmente una vez al dia mediante una tarea cron o un timer de systemd. Si el archivo fue creado despues de la ultima ejecucion de `updatedb`, no aparecera en los resultados. La solucion es ejecutar `sudo updatedb` para actualizar la base de datos manualmente, tras lo cual `locate` encontrara el archivo. Como alternativa inmediata, se puede usar `find` que busca en tiempo real. La configuracion de `updatedb` se encuentra en `/etc/updatedb.conf`, donde se definen rutas y sistemas de archivos a excluir con `PRUNEPATHS` y `PRUNEFS`.

</details>

---

### Pregunta 6

Cual de los siguientes comandos `find` busca todos los archivos con el bit SUID activo en todo el sistema?

a) `find / -type f -perm 777`
b) `find / -type f -perm -4000`
c) `find / -type f -size +4000k`
d) `find / -type f -user root`

<details>
<summary>Respuesta</summary>

**b) `find / -type f -perm -4000`**

El comando `find` con `-perm -4000` busca archivos que tengan al menos el bit SUID (valor 4000) activo, independientemente de los demas permisos. El guion `-` antes del valor significa "al menos estos bits deben estar activos". `-type f` restringe la busqueda a archivos regulares. Equivalentemente se puede usar `find / -perm -u=s`. La opcion `a` busca archivos con permisos exactos 777, no SUID. La opcion `c` busca archivos por tamano, no por permisos. La opcion `d` busca archivos propiedad de root, lo cual no implica que tengan SUID.

</details>

---

### Pregunta 7

Que es el UsrMerge y cual de los siguientes es un resultado de su implementacion?

a) `/usr` se convierte en un enlace simbolico a `/bin`
b) `/bin`, `/sbin` y `/lib` se convierten en enlaces simbolicos a sus equivalentes dentro de `/usr`
c) `/usr/local` reemplaza completamente a `/usr`
d) `/opt` se fusiona con `/usr/bin`

<details>
<summary>Respuesta</summary>

**b) `/bin`, `/sbin` y `/lib` se convierten en enlaces simbolicos a sus equivalentes dentro de `/usr`**

UsrMerge es un cambio en la estructura del sistema de archivos donde los directorios raiz `/bin`, `/sbin`, `/lib` y `/lib64` se convierten en enlaces simbolicos a `/usr/bin`, `/usr/sbin`, `/usr/lib` y `/usr/lib64` respectivamente. Esto simplifica la estructura eliminando la distincion historica entre binarios "esenciales para el arranque" y binarios en `/usr`. En sistemas modernos, `/usr` siempre esta disponible durante el arranque. Los enlaces simbolicos mantienen compatibilidad con scripts que usan las rutas antiguas. Distribuciones como Fedora, Debian 12+, Ubuntu 22.04+ y Arch Linux ya implementan UsrMerge.

</details>

---

### Pregunta 8

Segun el FHS, cual de los siguientes directorios es "variable" (cambia durante la operacion normal) y parcialmente "compartible" en red?

a) `/usr`
b) `/etc`
c) `/var`
d) `/boot`

<details>
<summary>Respuesta</summary>

**c) `/var`**

`/var` contiene datos variables que cambian constantemente durante la operacion normal: logs (`/var/log`), colas de trabajos (`/var/spool`), cache (`/var/cache`), etc. Es parcialmente compartible porque algunos subdirectorios como `/var/mail` o `/var/spool` pueden compartirse via NFS, mientras que otros como `/var/run` o `/var/lock` son especificos de cada maquina. `/usr` es estatico y compartible. `/etc` es estatico y no compartible (especifico de cada maquina). `/boot` es estatico y no compartible (especifico del hardware). Esta clasificacion es importante para planificar particiones, backups y montajes NFS.

</details>

---

### Pregunta 9

Cual es la diferencia principal entre `which` y `type`?

a) `which` encuentra builtins del shell, `type` solo encuentra ejecutables en disco
b) `which` solo busca ejecutables en `$PATH`, mientras que `type` identifica builtins, alias, funciones y archivos
c) `which` busca en todo el sistema, mientras que `type` solo busca en `$PATH`
d) No hay diferencia, ambos producen el mismo resultado para cualquier comando

<details>
<summary>Respuesta</summary>

**b) `which` solo busca ejecutables en `$PATH`, mientras que `type` identifica builtins, alias, funciones y archivos**

`which` busca exclusivamente archivos ejecutables en los directorios listados en la variable `$PATH`. No reconoce builtins del shell, alias ni funciones. `type` es un builtin del shell que identifica la naturaleza completa de un comando: si es un alias, un builtin, una funcion del shell, una palabra reservada o un archivo ejecutable en disco. Por ejemplo, `which cd` no devuelve resultado (cd es un builtin), pero `type cd` muestra "cd is a shell builtin". `type -t` devuelve una palabra clave (alias, builtin, file, function, keyword) y `type -a` muestra todas las formas disponibles de un comando.

</details>

---

### Pregunta 10

Segun el FHS, en que directorio se almacena el kernel de Linux (`vmlinuz-*`)?

a) `/usr/lib/kernel`
b) `/etc/kernel`
c) `/boot`
d) `/var/boot`

<details>
<summary>Respuesta</summary>

**c) `/boot`**

El directorio `/boot` contiene los archivos necesarios para el proceso de arranque del sistema, incluyendo el kernel comprimido de Linux (`vmlinuz-*`), la imagen initramfs (`initrd.img-*` o `initramfs-*`) y la configuracion del bootloader GRUB (`/boot/grub/`). Es un directorio estatico (solo cambia al actualizar el kernel) y no compartible (especifico del hardware de cada maquina). En algunos sistemas, `/boot` es una particion separada, especialmente cuando se usa un bootloader que tiene limitaciones para acceder a ciertos sistemas de archivos. Historicamente, `/boot` usaba ext2 por su simplicidad y amplio soporte por bootloaders.

</details>
