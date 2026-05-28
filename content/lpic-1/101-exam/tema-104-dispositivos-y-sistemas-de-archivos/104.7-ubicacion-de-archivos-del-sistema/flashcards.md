---
title: "104.7 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "104.7"
---

# Flashcards: 104.7 - Ubicacion De Archivos Del Sistema

> 19 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-001">
<div class="flashcard-front">

**P:** Segun el FHS, en que directorio deberia ubicarse el software compilado e instalado manualmente por el administrador del sistema?

</div>
<div class="flashcard-back">

**R:** c) `/usr/local`. Segun el Filesystem Hierarchy Standard (FHS), `/usr/local` es la jerarquia terciaria destinada al software instalado localmente por el administrador, tipicamente compilado desde el codigo fuente. Tiene su propia estructura con `bin/`, `sbin/`, `lib/`, etc. El software instalado aqui no es gestionado por el gestor de paquetes de la distribucion. `/opt` es para software de terceros que se instala como paquetes autocontenidos (por ejemplo, Google Chrome). `/usr/bin` contiene binarios instalados por el gestor de paquetes. `/var/lib` almacena datos de estado de aplicaciones.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-002">
<div class="flashcard-front">

**P:** Cual es la diferencia entre `/tmp` y `/var/tmp` segun el FHS?

</div>
<div class="flashcard-back">

**R:** b) `/tmp` se borra al reiniciar y `/var/tmp` persiste entre reinicios. `/tmp` es para archivos temporales de corta vida que se limpian al reiniciar el sistema (o periodicamente por systemd-tmpfiles o tmpwatch). `/var/tmp` es para archivos temporales que deben sobrevivir a reinicios del sistema, siendo mas adecuado para datos temporales de larga duracion. Esta distincion es importante para el examen LPIC-1 y para decidir donde almacenar archivos temporales segun si necesitan persistencia entre reinicios o no.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-003">
<div class="flashcard-front">

**P:** Un administrador necesita encontrar rapidamente la ubicacion del archivo `updatedb.conf` sin recorrer el disco en tiempo real. Cual es el comando mas adecuado?

</div>
<div class="flashcard-back">

**R:** b) `locate updatedb.conf`. `locate` busca en una base de datos indexada previamente construida por `updatedb`, lo que lo hace extremadamente rapido en comparacion con `find`, que recorre el arbol de directorios en tiempo real. `which` solo busca ejecutables en las rutas del `$PATH`, no archivos de configuracion. `whereis` busca binarios, paginas de manual y codigo fuente en ubicaciones estandar, pero no archivos de configuracion genericos. La unica desventaja de `locate` es que la base de datos puede estar desactualizada si el archivo fue creado recientemente (se actualiza normalmente una vez al dia via cron).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-004">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos identifica correctamente si `cd` es un comando interno (builtin) del shell o un programa externo?

</div>
<div class="flashcard-back">

**R:** c) `type cd`. `type` es un builtin del shell que identifica que tipo de comando es: builtin, alias, funcion del shell, palabra reservada o archivo externo. Para `cd`, mostraria "cd is a shell builtin". `which` solo busca ejecutables en las rutas del `$PATH` y no reconoce builtins (no devolveria resultado para `cd`). `whereis` busca binarios, fuentes y paginas de manual pero tampoco identifica builtins. `find` busca archivos en el sistema de archivos y desconoce los builtins del shell. `type -a` muestra todas las formas en que un comando esta disponible.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-005">
<div class="flashcard-front">

**P:** `locate` no encuentra un archivo que fue creado hace 5 minutos. Cual es la causa y como se soluciona?

</div>
<div class="flashcard-back">

**R:** b) La base de datos de `locate` esta desactualizada; ejecutar `sudo updatedb`. `locate` busca en una base de datos indexada que se actualiza periodicamente, normalmente una vez al dia mediante una tarea cron o un timer de systemd. Si el archivo fue creado despues de la ultima ejecucion de `updatedb`, no aparecera en los resultados. La solucion es ejecutar `sudo updatedb` para actualizar la base de datos manualmente, tras lo cual `locate` encontrara el archivo. Como alternativa inmediata, se puede usar `find` que busca en tiempo real. La configuracion de `updatedb` se encuentra en `/etc/updatedb.conf`, donde se definen rutas y sistemas de archivos a excluir con `PRUNEPATHS` y `PRUNEFS`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-006">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos `find` busca todos los archivos con el bit SUID activo en todo el sistema?

</div>
<div class="flashcard-back">

**R:** b) `find / -type f -perm -4000`. El comando `find` con `-perm -4000` busca archivos que tengan al menos el bit SUID (valor 4000) activo, independientemente de los demas permisos. El guion `-` antes del valor significa "al menos estos bits deben estar activos". `-type f` restringe la busqueda a archivos regulares. Equivalentemente se puede usar `find / -perm -u=s`. La opcion `a` busca archivos con permisos exactos 777, no SUID. La opcion `c` busca archivos por tamano, no por permisos. La opcion `d` busca archivos propiedad de root, lo cual no implica que tengan SUID.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-007">
<div class="flashcard-front">

**P:** Que es el UsrMerge y cual de los siguientes es un resultado de su implementacion?

</div>
<div class="flashcard-back">

**R:** b) `/bin`, `/sbin` y `/lib` se convierten en enlaces simbolicos a sus equivalentes dentro de `/usr`. UsrMerge es un cambio en la estructura del sistema de archivos donde los directorios raiz `/bin`, `/sbin`, `/lib` y `/lib64` se convierten en enlaces simbolicos a `/usr/bin`, `/usr/sbin`, `/usr/lib` y `/usr/lib64` respectivamente. Esto simplifica la estructura eliminando la distincion historica entre binarios "esenciales para el arranque" y binarios en `/usr`. En sistemas modernos, `/usr` siempre esta disponible durante el arranque. Los enlaces simbolicos mantienen compatibilidad con scripts que usan las rutas antiguas. Distribuciones como Fedora, Debian 12+, Ubuntu 22.04+ y Arch Linux ya implementan UsrMerge.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-008">
<div class="flashcard-front">

**P:** Segun el FHS, cual de los siguientes directorios es "variable" (cambia durante la operacion normal) y parcialmente "compartible" en red?

</div>
<div class="flashcard-back">

**R:** c) `/var`. `/var` contiene datos variables que cambian constantemente durante la operacion normal: logs (`/var/log`), colas de trabajos (`/var/spool`), cache (`/var/cache`), etc. Es parcialmente compartible porque algunos subdirectorios como `/var/mail` o `/var/spool` pueden compartirse via NFS, mientras que otros como `/var/run` o `/var/lock` son especificos de cada maquina. `/usr` es estatico y compartible. `/etc` es estatico y no compartible (especifico de cada maquina). `/boot` es estatico y no compartible (especifico del hardware). Esta clasificacion es importante para planificar particiones, backups y montajes NFS.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-009">
<div class="flashcard-front">

**P:** Cual es la diferencia principal entre `which` y `type`?

</div>
<div class="flashcard-back">

**R:** b) `which` solo busca ejecutables en `$PATH`, mientras que `type` identifica builtins, alias, funciones y archivos. `which` busca exclusivamente archivos ejecutables en los directorios listados en la variable `$PATH`. No reconoce builtins del shell, alias ni funciones. `type` es un builtin del shell que identifica la naturaleza completa de un comando: si es un alias, un builtin, una funcion del shell, una palabra reservada o un archivo ejecutable en disco. Por ejemplo, `which cd` no devuelve resultado (cd es un builtin), pero `type cd` muestra "cd is a shell builtin". `type -t` devuelve una palabra clave (alias, builtin, file, function, keyword) y `type -a` muestra todas las formas disponibles de un comando.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-010">
<div class="flashcard-front">

**P:** Segun el FHS, en que directorio se almacena el kernel de Linux (`vmlinuz-*`)?

</div>
<div class="flashcard-back">

**R:** c) `/boot`. El directorio `/boot` contiene los archivos necesarios para el proceso de arranque del sistema, incluyendo el kernel comprimido de Linux (`vmlinuz-*`), la imagen initramfs (`initrd.img-*` o `initramfs-*`) y la configuracion del bootloader GRUB (`/boot/grub/`). Es un directorio estatico (solo cambia al actualizar el kernel) y no compartible (especifico del hardware de cada maquina). En algunos sistemas, `/boot` es una particion separada, especialmente cuando se usa un bootloader que tiene limitaciones para acceder a ciertos sistemas de archivos. Historicamente, `/boot` usaba ext2 por su simplicidad y amplio soporte por bootloaders.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: `locate -b` (basename) restringe la busqueda al nombre del archivo solamente, ig...

</div>
<div class="flashcard-back">

**R:** `locate -b` (basename) restringe la busqueda al nombre del archivo solamente, ignorando la ruta. Sin `-b`, `locate passwd` encontraria tanto `/etc/passwd` como `/documentos/passwd_info/datos.txt` (porque la ruta contiene "passwd").

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-012">
<div class="flashcard-front">

**P:** Tip de examen: Es importante saber que `updatedb` se ejecuta automaticamente a traves de cron (...

</div>
<div class="flashcard-back">

**R:** Es importante saber que `updatedb` se ejecuta automaticamente a traves de cron (generalmente a diario). Los archivos creados despues de la ultima ejecucion de `updatedb` no apareceran en los resultados de `locate` hasta la proxima actualizacion.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-013">
<div class="flashcard-front">

**P:** Que hace el comando `/bin`?

</div>
<div class="flashcard-back">

**R:** Binarios esenciales del sistema

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `/sbin`?

</div>
<div class="flashcard-back">

**R:** Binarios esenciales de administracion

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `/lib`?

</div>
<div class="flashcard-back">

**R:** Bibliotecas compartidas esenciales

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `/lib64`?

</div>
<div class="flashcard-back">

**R:** Bibliotecas de 64 bits

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-017">
<div class="flashcard-front">

**P:** Que hace el comando `/usr`?

</div>
<div class="flashcard-back">

**R:** Jerarquia secundaria para datos de solo lectura del usuario

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-018">
<div class="flashcard-front">

**P:** Que es/son 1. FHS - Filesystem Hierarchy Standard?

</div>
<div class="flashcard-back">

**R:** El **FHS** (Filesystem Hierarchy Standard) es un estandar que define la estructura de directorios y su contenido en sistemas Linux/Unix. Su objetivo es garantizar la interoperabilidad entre distribucio

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-019">
<div class="flashcard-front">

**P:** Que es/son 4. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **`/bin` y `/sbin`** contienen binarios esenciales. En distros modernas con **UsrMerge**, son enlaces simbolicos a `/usr/bin` y `/usr/sbin`.

</div>
</div>

---

