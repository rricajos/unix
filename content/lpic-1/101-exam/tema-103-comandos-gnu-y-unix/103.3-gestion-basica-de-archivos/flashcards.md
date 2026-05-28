---
title: "103.3 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "103.3"
---

# Flashcards: 103.3 - Gestion Basica De Archivos

> 21 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-001">
<div class="flashcard-front">

**P:** Un administrador necesita copiar el directorio `/home/sandra/proyecto/` a `/backup/` preservando todos los permisos, propietarios, timestamps y enlaces simbolicos. Cual es el comando mas adecuado?

</div>
<div class="flashcard-back">

**R:** C) `cp -a /home/sandra/proyecto/ /backup/`. La opcion `-a` (archive) es equivalente a `-dR --preserve=all`, lo que significa que copia recursivamente, preserva permisos, propietarios, timestamps y enlaces simbolicos (los mantiene como enlaces en lugar de copiar el contenido al que apuntan). La opcion A (`-r`) copia recursivamente pero no preserva permisos ni enlaces simbolicos. La opcion B (`-p`) preserva permisos pero no es recursiva (fallaria al copiar un directorio). La opcion D mueve en lugar de copiar.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-002">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos `find` localiza todos los archivos regulares mayores de 50 MB en `/var` que fueron modificados hace mas de 30 dias?

</div>
<div class="flashcard-back">

**R:** B) `find /var -type f -size +50M -mtime +30`. El comando correcto usa: `-type f` para archivos regulares, `-size +50M` (con el sufijo M para megabytes y + para "mayor que"), y `-mtime +30` (con + para "hace mas de 30 dias"). La opcion A falta el sufijo `M` en el tamanho (sin sufijo, `+50` se interpreta como bloques de 512 bytes). La opcion C usa `-type d` que busca directorios, no archivos, y `-mtime -30` busca archivos mas recientes de 30 dias. La opcion D tiene opciones inventadas que no existen.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-003">
<div class="flashcard-front">

**P:** Un usuario necesita crear un archivo tar comprimido con bzip2 del directorio `/etc/` y guardarlo como `/tmp/etc_backup.tar.bz2`. Cual es el comando correcto?

</div>
<div class="flashcard-back">

**R:** B) `tar -cjvf /tmp/etc_backup.tar.bz2 /etc/`. Las opciones son: `-c` para crear, `-j` para compresion bzip2, `-v` para verbose y `-f` seguido del nombre del archivo. La opcion A usa `-z` que es para gzip (no bzip2). La opcion C usa `-J` que es para xz (no bzip2). La opcion D usa `-x` que es para extraer, no para crear. Recordar: `-z` = gzip (.gz), `-j` = bzip2 (.bz2), `-J` = xz (.xz).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-004">
<div class="flashcard-front">

**P:** Que hace el siguiente comando?

</div>
<div class="flashcard-back">

**R:** B) Elimina todos los archivos .log en /tmp que fueron modificados hace mas de 7 dias. El comando `find` busca en `/tmp` archivos cuyo nombre termine en `.log` (`-name "*.log"`) y que hayan sido modificados hace mas de 7 dias (`-mtime +7`). Para cada archivo encontrado, ejecuta `rm` (`-exec rm {} \;`), donde `{}` es reemplazado por el nombre del archivo y `\;` marca el fin del comando. El signo `+` en `-mtime +7` significa "hace mas de 7 dias" (no "en los ultimos 7 dias", que seria `-mtime -7`).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-005">
<div class="flashcard-front">

**P:** Cual es la diferencia entre `rmdir` y `rm -r`?

</div>
<div class="flashcard-back">

**R:** B) `rmdir` solo elimina directorios vacios, `rm -r` elimina directorios con todo su contenido. `rmdir` es un comando seguro que solo puede eliminar directorios que estan completamente vacios. Si el directorio contiene algun archivo o subdirectorio, `rmdir` dara un error. En cambio, `rm -r` (recursivo) elimina el directorio especificado junto con todo su contenido (archivos, subdirectorios y su contenido), de forma recursiva. Por seguridad, es preferible usar `rmdir` cuando se espera que el directorio este vacio, ya que protege contra la eliminacion accidental de contenido.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-006">
<div class="flashcard-front">

**P:** Un administrador necesita crear una imagen exacta del disco `/dev/sda` con bloques de 4 MB mostrando el progreso. Cual es el comando correcto?

</div>
<div class="flashcard-back">

**R:** C) `dd if=/dev/sda of=/backup/disco.img bs=4M status=progress`. `dd` es el comando adecuado para crear imagenes bit a bit de discos. `if=` especifica el archivo/dispositivo de entrada, `of=` el de salida, `bs=4M` establece el tamanho de bloque a 4 megabytes (mejora el rendimiento) y `status=progress` muestra el progreso de la operacion. La opcion A no crearia una copia exacta a nivel de bloques. La opcion B archivaria el dispositivo como un archivo tar, no como una imagen de disco. La opcion D tiene invertidos `if` y `of`, lo que escribiria la imagen sobre el disco en lugar de leerlo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-007">
<div class="flashcard-front">

**P:** El comando `file /usr/bin/python3` muestra la informacion `ELF 64-bit LSB pie executable, x86-64`. Que se puede concluir?

</div>
<div class="flashcard-back">

**R:** B) El archivo es un binario ejecutable compilado de 64 bits. El comando `file` examina el contenido real del archivo (no su extension ni su nombre) para determinar su tipo. "ELF" (Executable and Linkable Format) indica que es un formato binario ejecutable de Linux. "64-bit" indica la arquitectura y "x86-64" la plataforma. `file` utiliza los "numeros magicos" (secuencias de bytes al inicio del archivo) para identificar el tipo. A diferencia de Windows, que depende de extensiones (.exe, .txt), Linux usa `file` para determinar el tipo real del contenido.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-008">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos `find` busca archivos con nombre que termine en `.txt` O en `.md`, que sean archivos regulares?

</div>
<div class="flashcard-back">

**R:** C) `find /home -type f \( -name "*.txt" -or -name "*.md" \)`. La opcion correcta usa parentesis escapados `\( \)` para agrupar la condicion OR, y `-type f` fuera del grupo para que aplique a ambas condiciones. La opcion A usa dos `-name` con AND implicito, lo que buscaria archivos que terminen en `.txt` Y en `.md` a la vez (imposible). La opcion B sin parentesis aplicaria `-type f` solo a la segunda condicion (`-name "*.md"`) debido a la precedencia de operadores (AND tiene mayor precedencia que OR). La opcion D tiene una sintaxis invalida para `-name`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-009">
<div class="flashcard-front">

**P:** Tip de examen: `cp -a` es la forma mas completa de copiar directorios preservando todas las pro...

</div>
<div class="flashcard-back">

**R:** `cp -a` es la forma mas completa de copiar directorios preservando todas las propiedades. Es equivalente a `cp -dR --preserve=all`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-010">
<div class="flashcard-front">

**P:** Tip de examen: `file` analiza el contenido real del archivo usando "numeros magicos" (magic num...

</div>
<div class="flashcard-back">

**R:** `file` analiza el contenido real del archivo usando "numeros magicos" (magic numbers) internos, no la extension del nombre.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-011">
<div class="flashcard-front">

**P:** Que hace el comando `-r`?

</div>
<div class="flashcard-back">

**R:** No

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-012">
<div class="flashcard-front">

**P:** Que hace el comando `-p`?

</div>
<div class="flashcard-back">

**R:** Si

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-013">
<div class="flashcard-front">

**P:** Que hace el comando `-a`?

</div>
<div class="flashcard-back">

**R:** Si

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `rmdir`?

</div>
<div class="flashcard-back">

**R:** No

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `rm -r`?

</div>
<div class="flashcard-back">

**R:** Si

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-016">
<div class="flashcard-front">

**P:** Que es/son 1. Listar archivos: ls?

</div>
<div class="flashcard-back">

**R:** `ls` es el comando fundamental para listar el contenido de directorios.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-017">
<div class="flashcard-front">

**P:** Que es/son 3. Mover y renombrar: mv?

</div>
<div class="flashcard-back">

**R:** `mv` mueve archivos/directorios y tambien sirve para renombrar.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-018">
<div class="flashcard-front">

**P:** Que es/son 6. Determinar tipo de archivo: file?

</div>
<div class="flashcard-back">

**R:** `file` determina el tipo de un archivo **examinando su contenido** (no se basa en la extension):

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-019">
<div class="flashcard-front">

**P:** Que es/son 7. Globbing (comodines)?

</div>
<div class="flashcard-back">

**R:** El globbing permite seleccionar archivos usando patrones. La expansion la realiza el shell antes de pasar los argumentos al comando.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-020">
<div class="flashcard-front">

**P:** Que es/son 8. Buscar archivos: find?

</div>
<div class="flashcard-back">

**R:** `find` es un comando extremadamente potente para buscar archivos en el sistema de archivos. Busca recursivamente a partir de un directorio dado.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.3">
</div>

<div class="flashcard" data-id="103.3-fc-021">
<div class="flashcard-front">

**P:** Que es/son 11. dd (disk dump)?

</div>
<div class="flashcard-back">

**R:** `dd` copia y convierte datos a nivel de bloques. Es muy potente y peligroso si se usa incorrectamente.

</div>
</div>

---

