---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "333 - Control de Acceso"
tema: "333.1 - Control de acceso discrecional"
subtema: "333.1"
peso: 3
tags:
  - lpic-3
  - tema-333
  - permisos
  - acl
  - xattr
---

# Ejercicios - 333.1 Control de Acceso Discrecional

### Pregunta 1
Un directorio tiene permisos `drwxrwxrwt`. ¿Que significa la `t` al final?

a) El directorio tiene ACLs configuradas
b) El sticky bit esta establecido; solo el propietario puede eliminar sus archivos
c) El directorio esta cifrado
d) La `t` indica que el directorio es temporal

<details><summary>Respuesta</summary>

**b)** El sticky bit esta establecido; solo el propietario puede eliminar sus archivos

El sticky bit (`t` en la posicion de ejecucion de "otros") en un directorio significa que solo el propietario del archivo, el propietario del directorio o root pueden eliminar o renombrar archivos dentro del directorio, incluso si otros tienen permiso de escritura. Ejemplo clasico: `/tmp`.
</details>

### Pregunta 2
¿Que comando establece una ACL por defecto para que el usuario "juan" tenga permisos rwx en todos los nuevos archivos creados dentro de `/datos/proyecto/`?

a) `setfacl -m u:juan:rwx /datos/proyecto/`
b) `setfacl -d -m u:juan:rwx /datos/proyecto/`
c) `setfacl --default u:juan:rwx /datos/proyecto/`
d) `setfacl -R -m u:juan:rwx /datos/proyecto/`

<details><summary>Respuesta</summary>

**b)** `setfacl -d -m u:juan:rwx /datos/proyecto/`

La opcion `-d` (o `--default`) establece una ACL por defecto en el directorio. Los nuevos archivos y subdirectorios creados dentro heredaran automaticamente esta ACL.
</details>

### Pregunta 3
Un archivo tiene la siguiente salida de `getfacl`: `user:juan:rw-` y `mask::r--`. ¿Cuales son los permisos efectivos de juan?

a) rw-
b) r--
c) ---
d) r-x

<details><summary>Respuesta</summary>

**b)** r--

La mascara (mask) limita los permisos efectivos de las entradas ACL de usuarios y grupos adicionales. Los permisos efectivos son la interseccion de la ACL del usuario y la mascara: `rw-` AND `r--` = `r--`.
</details>

### Pregunta 4
¿Que comando hace que un archivo sea completamente inmutable, impidiendo incluso a root modificarlo o eliminarlo?

a) `chmod 000 archivo`
b) `chattr +i archivo`
c) `setfacl -m u:root:--- archivo`
d) `chattr +a archivo`

<details><summary>Respuesta</summary>

**b)** `chattr +i archivo`

El atributo inmutable (`+i`) impide cualquier modificacion al archivo: no se puede escribir, eliminar, renombrar o crear enlaces. Ni siquiera root puede hacerlo sin primero quitar el atributo con `chattr -i`.
</details>

### Pregunta 5
Con una umask de 0027, ¿que permisos tendran los nuevos archivos creados?

a) 750 (rwxr-x---)
b) 640 (rw-r-----)
c) 027 (----w-rwx)
d) 733 (rwx-wx-wx)

<details><summary>Respuesta</summary>

**b)** 640 (rw-r-----)

Los archivos se crean con permisos base 666 menos la umask: 666 - 027 = 640 (rw-r-----). Los directorios se crean con 777 - 027 = 750 (rwxr-x---).
</details>

### Pregunta 6
¿Que efecto tiene el bit SGID (2000) en un directorio?

a) Los ejecutables dentro se ejecutan como root
b) Los nuevos archivos creados heredan el grupo del directorio
c) Solo el propietario puede eliminar archivos
d) El directorio se vuelve inmutable

<details><summary>Respuesta</summary>

**b)** Los nuevos archivos creados heredan el grupo del directorio

El SGID en un directorio hace que los nuevos archivos y subdirectorios creados dentro hereden el grupo del directorio padre, en lugar del grupo primario del usuario que los crea. Es muy util para directorios de trabajo compartido.
</details>

### Pregunta 7
¿Que indica el simbolo `+` al final de los permisos en la salida de `ls -l`?

a) El archivo tiene atributos extendidos con chattr
b) El archivo tiene ACLs POSIX configuradas
c) El archivo esta cifrado
d) El archivo tiene el bit SUID activado

<details><summary>Respuesta</summary>

**b)** El archivo tiene ACLs POSIX configuradas

Cuando `ls -l` muestra un `+` despues de los permisos (ej: `-rw-r--r--+`), indica que el archivo tiene ACLs POSIX adicionales. Se pueden ver con `getfacl`.
</details>

### Pregunta 8
¿Que comando elimina todas las ACLs de un archivo, dejando solo los permisos Unix tradicionales?

a) `setfacl -x archivo`
b) `setfacl --remove-all archivo`
c) `setfacl -b archivo`
d) `setfacl -d archivo`

<details><summary>Respuesta</summary>

**c)** `setfacl -b archivo`

La opcion `-b` (o `--remove-all`) elimina todas las ACLs extendidas del archivo, dejando solo los permisos Unix basicos. `-x` elimina entradas especificas, `-k` elimina ACLs por defecto, `-d` establece ACLs por defecto.
</details>

### Pregunta 9
¿Que atributo de `chattr` permite solo añadir contenido a un archivo sin poder modificar o eliminar el contenido existente?

a) `+i` (immutable)
b) `+a` (append-only)
c) `+s` (secure deletion)
d) `+u` (undeletable)

<details><summary>Respuesta</summary>

**b)** `+a` (append-only)

El atributo append-only (`+a`) permite añadir datos al final del archivo pero no modificar ni eliminar el contenido existente. Es ideal para archivos de log donde se quiere garantizar que los registros no puedan ser alterados.
</details>

### Pregunta 10
Un administrador ejecuta `chmod 750 archivo.txt` en un archivo que tiene ACLs. ¿Que efecto tiene esto en las ACLs?

a) Las ACLs se eliminan automaticamente
b) La mascara (mask) de las ACLs se modifica al valor del grupo (5 = r-x)
c) No tiene ningun efecto en las ACLs
d) Los permisos del grupo en las ACLs se sobreescriben

<details><summary>Respuesta</summary>

**b)** La mascara (mask) de las ACLs se modifica al valor del grupo (5 = r-x)

Cuando se usa `chmod` en un archivo con ACLs, los permisos del grupo que muestra `ls -l` corresponden en realidad a la mascara de las ACLs. Por lo tanto, `chmod 750` establece la mascara a `r-x`, limitando los permisos efectivos de todas las entradas ACL de usuarios y grupos adicionales.
</details>
