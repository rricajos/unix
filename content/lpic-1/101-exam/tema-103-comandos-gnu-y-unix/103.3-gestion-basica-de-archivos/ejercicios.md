---
title: "103.3 - Gestion basica de archivos: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.3"
---

# 103.3 - Gestion basica de archivos: Ejercicios

### Pregunta 1
Un administrador necesita copiar el directorio `/home/sandra/proyecto/` a `/backup/` preservando todos los permisos, propietarios, timestamps y enlaces simbolicos. Cual es el comando mas adecuado?

A) `cp -r /home/sandra/proyecto/ /backup/`
B) `cp -p /home/sandra/proyecto/ /backup/`
C) `cp -a /home/sandra/proyecto/ /backup/`
D) `mv /home/sandra/proyecto/ /backup/`

<details>
<summary>Respuesta</summary>

**C) `cp -a /home/sandra/proyecto/ /backup/`**

La opcion `-a` (archive) es equivalente a `-dR --preserve=all`, lo que significa que copia recursivamente, preserva permisos, propietarios, timestamps y enlaces simbolicos (los mantiene como enlaces en lugar de copiar el contenido al que apuntan). La opcion A (`-r`) copia recursivamente pero no preserva permisos ni enlaces simbolicos. La opcion B (`-p`) preserva permisos pero no es recursiva (fallaria al copiar un directorio). La opcion D mueve en lugar de copiar.
</details>

---

### Pregunta 2
Cual de los siguientes comandos `find` localiza todos los archivos regulares mayores de 50 MB en `/var` que fueron modificados hace mas de 30 dias?

A) `find /var -type f -size +50 -mtime +30`
B) `find /var -type f -size +50M -mtime +30`
C) `find /var -type d -size +50M -mtime -30`
D) `find /var -file -size 50M -time 30`

<details>
<summary>Respuesta</summary>

**B) `find /var -type f -size +50M -mtime +30`**

El comando correcto usa: `-type f` para archivos regulares, `-size +50M` (con el sufijo M para megabytes y + para "mayor que"), y `-mtime +30` (con + para "hace mas de 30 dias"). La opcion A falta el sufijo `M` en el tamanho (sin sufijo, `+50` se interpreta como bloques de 512 bytes). La opcion C usa `-type d` que busca directorios, no archivos, y `-mtime -30` busca archivos mas recientes de 30 dias. La opcion D tiene opciones inventadas que no existen.
</details>

---

### Pregunta 3
Un usuario necesita crear un archivo tar comprimido con bzip2 del directorio `/etc/` y guardarlo como `/tmp/etc_backup.tar.bz2`. Cual es el comando correcto?

A) `tar -czvf /tmp/etc_backup.tar.bz2 /etc/`
B) `tar -cjvf /tmp/etc_backup.tar.bz2 /etc/`
C) `tar -cJvf /tmp/etc_backup.tar.bz2 /etc/`
D) `tar -xjvf /tmp/etc_backup.tar.bz2 /etc/`

<details>
<summary>Respuesta</summary>

**B) `tar -cjvf /tmp/etc_backup.tar.bz2 /etc/`**

Las opciones son: `-c` para crear, `-j` para compresion bzip2, `-v` para verbose y `-f` seguido del nombre del archivo. La opcion A usa `-z` que es para gzip (no bzip2). La opcion C usa `-J` que es para xz (no bzip2). La opcion D usa `-x` que es para extraer, no para crear. Recordar: `-z` = gzip (.gz), `-j` = bzip2 (.bz2), `-J` = xz (.xz).
</details>

---

### Pregunta 4
Que hace el siguiente comando?
```bash
find /tmp -name "*.log" -mtime +7 -exec rm {} \;
```

A) Lista todos los archivos .log en /tmp modificados en los ultimos 7 dias
B) Elimina todos los archivos .log en /tmp que fueron modificados hace mas de 7 dias
C) Mueve todos los archivos .log de /tmp a la papelera
D) Comprime todos los archivos .log en /tmp mayores de 7 MB

<details>
<summary>Respuesta</summary>

**B) Elimina todos los archivos .log en /tmp que fueron modificados hace mas de 7 dias**

El comando `find` busca en `/tmp` archivos cuyo nombre termine en `.log` (`-name "*.log"`) y que hayan sido modificados hace mas de 7 dias (`-mtime +7`). Para cada archivo encontrado, ejecuta `rm` (`-exec rm {} \;`), donde `{}` es reemplazado por el nombre del archivo y `\;` marca el fin del comando. El signo `+` en `-mtime +7` significa "hace mas de 7 dias" (no "en los ultimos 7 dias", que seria `-mtime -7`).
</details>

---

### Pregunta 5
Cual es la diferencia entre `rmdir` y `rm -r`?

A) `rmdir` es mas rapido que `rm -r`
B) `rmdir` solo elimina directorios vacios, `rm -r` elimina directorios con todo su contenido
C) `rm -r` solo funciona con archivos, no con directorios
D) No hay diferencia, son equivalentes

<details>
<summary>Respuesta</summary>

**B) `rmdir` solo elimina directorios vacios, `rm -r` elimina directorios con todo su contenido**

`rmdir` es un comando seguro que solo puede eliminar directorios que estan completamente vacios. Si el directorio contiene algun archivo o subdirectorio, `rmdir` dara un error. En cambio, `rm -r` (recursivo) elimina el directorio especificado junto con todo su contenido (archivos, subdirectorios y su contenido), de forma recursiva. Por seguridad, es preferible usar `rmdir` cuando se espera que el directorio este vacio, ya que protege contra la eliminacion accidental de contenido.
</details>

---

### Pregunta 6
Un administrador necesita crear una imagen exacta del disco `/dev/sda` con bloques de 4 MB mostrando el progreso. Cual es el comando correcto?

A) `cp /dev/sda /backup/disco.img`
B) `tar -cvf /backup/disco.img /dev/sda`
C) `dd if=/dev/sda of=/backup/disco.img bs=4M status=progress`
D) `dd of=/dev/sda if=/backup/disco.img bs=4M`

<details>
<summary>Respuesta</summary>

**C) `dd if=/dev/sda of=/backup/disco.img bs=4M status=progress`**

`dd` es el comando adecuado para crear imagenes bit a bit de discos. `if=` especifica el archivo/dispositivo de entrada, `of=` el de salida, `bs=4M` establece el tamanho de bloque a 4 megabytes (mejora el rendimiento) y `status=progress` muestra el progreso de la operacion. La opcion A no crearia una copia exacta a nivel de bloques. La opcion B archivaria el dispositivo como un archivo tar, no como una imagen de disco. La opcion D tiene invertidos `if` y `of`, lo que escribiria la imagen sobre el disco en lugar de leerlo.
</details>

---

### Pregunta 7
El comando `file /usr/bin/python3` muestra la informacion `ELF 64-bit LSB pie executable, x86-64`. Que se puede concluir?

A) El archivo es un script de Python
B) El archivo es un binario ejecutable compilado de 64 bits
C) El archivo es un enlace simbolico a Python
D) El archivo es un archivo de texto

<details>
<summary>Respuesta</summary>

**B) El archivo es un binario ejecutable compilado de 64 bits**

El comando `file` examina el contenido real del archivo (no su extension ni su nombre) para determinar su tipo. "ELF" (Executable and Linkable Format) indica que es un formato binario ejecutable de Linux. "64-bit" indica la arquitectura y "x86-64" la plataforma. `file` utiliza los "numeros magicos" (secuencias de bytes al inicio del archivo) para identificar el tipo. A diferencia de Windows, que depende de extensiones (.exe, .txt), Linux usa `file` para determinar el tipo real del contenido.
</details>

---

### Pregunta 8
Cual de los siguientes comandos `find` busca archivos con nombre que termine en `.txt` O en `.md`, que sean archivos regulares?

A) `find /home -name "*.txt" -name "*.md" -type f`
B) `find /home -name "*.txt" -or -name "*.md" -type f`
C) `find /home -type f \( -name "*.txt" -or -name "*.md" \)`
D) `find /home -type f -name "*.txt, *.md"`

<details>
<summary>Respuesta</summary>

**C) `find /home -type f \( -name "*.txt" -or -name "*.md" \)`**

La opcion correcta usa parentesis escapados `\( \)` para agrupar la condicion OR, y `-type f` fuera del grupo para que aplique a ambas condiciones. La opcion A usa dos `-name` con AND implicito, lo que buscaria archivos que terminen en `.txt` Y en `.md` a la vez (imposible). La opcion B sin parentesis aplicaria `-type f` solo a la segunda condicion (`-name "*.md"`) debido a la precedencia de operadores (AND tiene mayor precedencia que OR). La opcion D tiene una sintaxis invalida para `-name`.
</details>
