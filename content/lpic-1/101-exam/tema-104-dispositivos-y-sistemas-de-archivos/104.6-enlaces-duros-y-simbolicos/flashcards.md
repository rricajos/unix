---
title: "104.6 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "104.6"
---

# Flashcards: 104.6 - Enlaces Duros Y Simbolicos

> 14 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-001">
<div class="flashcard-front">

**P:** Se crea un archivo y un enlace duro con los siguientes comandos: ```bash echo "hola" > archivo.txt ln archivo.txt enlace_duro.txt ``` Si luego se borra `archivo.txt`, que sucede al ejecutar `cat enlace_duro.txt`?

</div>
<div class="flashcard-back">

**R:** b) Se muestra "hola" correctamente. Un enlace duro comparte el mismo inodo que el archivo original. Borrar `archivo.txt` solo elimina una de las entradas de directorio que apuntan a ese inodo. El conteo de enlaces pasa de 2 a 1, pero los datos en disco persisten porque aun queda una referencia (el enlace duro). Los datos solo se liberan del disco cuando el conteo de enlaces llega a 0 y ningun proceso tiene el archivo abierto. Esta es una diferencia clave con los enlaces simbolicos, que se "rompen" al borrar el archivo original.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-002">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos fallaria, asumiendo que `/home` y `/mnt/usb` son sistemas de archivos diferentes?

</div>
<div class="flashcard-back">

**R:** c) `ln /home/sandra/archivo.txt /mnt/usb/enlace.txt`. Los enlaces duros NO pueden cruzar sistemas de archivos diferentes, ya que dependen del numero de inodo que es unico dentro de cada sistema de archivos. La opcion `c` intenta crear un enlace duro entre dos filesystems distintos (`/home` y `/mnt/usb`), lo cual es imposible. La opcion `a` funciona porque los enlaces simbolicos si pueden cruzar filesystems. La opcion `b` funciona porque ambos archivos estan en el mismo filesystem. La opcion `d` funciona porque los enlaces simbolicos pueden apuntar a directorios (los duros no).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-003">
<div class="flashcard-front">

**P:** Dada la siguiente salida de `ls -li`: ``` 1234567 -rw-r--r-- 3 sandra sandra 2048 Jan 10 file_a.txt 1234567 -rw-r--r-- 3 sandra sandra 2048 Jan 10 file_b.txt 9876543 lrwxrwxrwx 1 sandra sandra   10 Jan 10 file_c.txt -> file_a.txt ``` Cuantos enlaces duros apuntan al mismo inodo que `file_a.txt`?

</div>
<div class="flashcard-back">

**R:** c) 3. El numero de inodo de `file_a.txt` es `1234567`, y el conteo de enlaces duros (tercer campo) es `3`. Esto indica que hay 3 entradas de directorio apuntando al mismo inodo: `file_a.txt`, `file_b.txt` (que tiene el mismo inodo 1234567) y un tercer enlace duro que no se muestra en la salida pero que existe en algun otro lugar. `file_c.txt` es un enlace simbolico (tipo `l`, inodo diferente 9876543) que apunta a `file_a.txt`, pero no incrementa el conteo de enlaces duros del inodo original.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-004">
<div class="flashcard-front">

**P:** Un directorio vacio `/home/sandra/proyecto` muestra un conteo de enlaces de 2 en `ls -ld`. Si se crean 3 subdirectorios dentro, cual sera el nuevo conteo de enlaces?

</div>
<div class="flashcard-back">

**R:** c) 5. Un directorio vacio tiene conteo de enlaces 2: la entrada del directorio padre que apunta a el y la entrada `.` dentro del propio directorio (que apunta a si mismo). Cada subdirectorio creado dentro anade 1 al conteo, porque cada subdirectorio contiene una entrada `..` que es un enlace duro al directorio padre. La formula es: conteo = 2 + numero de subdirectorios directos. Con 3 subdirectorios: 2 + 3 = 5. Las entradas `.` y `..` son enlaces duros que el sistema crea y mantiene automaticamente.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-005">
<div class="flashcard-front">

**P:** Que comando encuentra todos los enlaces simbolicos rotos en `/etc`?

</div>
<div class="flashcard-back">

**R:** b) `find /etc -xtype l`. La opcion `-xtype l` de `find` busca archivos que serian de tipo enlace simbolico (`l`) si NO se siguiera el enlace, pero cuyo destino no existe (es decir, el enlace esta roto o "dangling"). La opcion `a` (`-type l`) encuentra todos los enlaces simbolicos, tanto validos como rotos, sin distinguir entre ellos. La opcion `c` (`-links +1`) busca archivos con mas de un enlace duro, que es algo completamente diferente. La opcion `d` con `ls` listaria enlaces simbolicos por su indicador `l` al inicio pero no distinguiria los rotos.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-006">
<div class="flashcard-front">

**P:** Un usuario crea un enlace simbolico con ruta relativa: ```bash cd /home/sandra ln -s documentos/informe.txt /tmp/enlace_informe.txt ``` Al acceder a `/tmp/enlace_informe.txt`, que ocurre?

</div>
<div class="flashcard-back">

**R:** b) El enlace esta roto porque la ruta relativa se resuelve desde la ubicacion del enlace, buscando `/tmp/documentos/informe.txt`. La ruta relativa `documentos/informe.txt` se almacena literalmente en el enlace simbolico. Cuando se accede al enlace desde `/tmp/enlace_informe.txt`, el sistema resuelve la ruta relativa desde la ubicacion del enlace (no desde donde se creo), buscando `/tmp/documentos/informe.txt`, que no existe. La solucion es usar una ruta absoluta: `ln -s /home/sandra/documentos/informe.txt /tmp/enlace_informe.txt`. Las rutas relativas en enlaces simbolicos siempre son relativas a la ubicacion del enlace, no al directorio de trabajo al momento de la creacion.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-007">
<div class="flashcard-front">

**P:** Cual de las siguientes afirmaciones sobre la diferencia entre copiar un archivo y crear un enlace duro es correcta?

</div>
<div class="flashcard-back">

**R:** c) Al modificar un enlace duro, los cambios se reflejan en el original porque comparten el mismo inodo. Un enlace duro comparte el mismo inodo y los mismos bloques de datos que el archivo original. No hay un "original" y una "copia"; ambos nombres son equivalentes y apuntan a los mismos datos. Modificar el contenido a traves de cualquier nombre afecta a todos los demas nombres que apuntan al mismo inodo. En cambio, copiar con `cp` crea un nuevo archivo con nuevo inodo y copia independiente de los datos, duplicando el espacio en disco. El enlace duro NO duplica espacio, solo anade una entrada de directorio. Al borrar el original, el enlace duro sigue funcionando (la copia con `cp` tambien, al ser independiente).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-008">
<div class="flashcard-front">

**P:** Que muestra el comando `readlink -f enlace.txt` a diferencia de `readlink enlace.txt` (sin opciones)?

</div>
<div class="flashcard-back">

**R:** b) `readlink -f` resuelve toda la cadena de enlaces y devuelve la ruta absoluta final, `readlink` muestra solo el destino inmediato. `readlink` sin opciones muestra unicamente el destino inmediato (un nivel) del enlace simbolico. Si hay una cadena de enlaces (enlace3 -> enlace2 -> enlace1 -> original.txt), `readlink enlace3` solo mostraria `enlace2`. En cambio, `readlink -f` resuelve toda la cadena de enlaces recursivamente y devuelve la ruta absoluta canonicalizada del archivo final (por ejemplo, `/home/sandra/original.txt`). Variantes utiles: `readlink -e` requiere que todos los componentes existan, y `readlink -m` no requiere que ningun componente exista.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-009">
<div class="flashcard-front">

**P:** Cual de las siguientes limitaciones aplica a los enlaces duros pero NO a los enlaces simbolicos?

</div>
<div class="flashcard-back">

**R:** d) Todas las anteriores. Los enlaces duros tienen tres limitaciones que los simbolicos no: (1) No pueden cruzar sistemas de archivos porque dependen del numero de inodo, que es unico por filesystem. (2) No pueden apuntar a archivos inexistentes; el archivo debe existir para poder crear otro enlace duro al mismo inodo. Los enlaces simbolicos si pueden apuntar a archivos que no existen (enlaces rotos). (3) Los enlaces duros no tienen indicador visual especial en `ls -l`; se ven identicos a archivos normales. Los simbolicos muestran `l` al inicio y `-> destino`. Ademas, los enlaces duros no pueden apuntar a directorios (con excepcion de `.` y `..` que el sistema gestiona automaticamente).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-010">
<div class="flashcard-front">

**P:** Que tipo de archivo se muestra con el caracter `l` al inicio en la salida de `ls -l`?

</div>
<div class="flashcard-back">

**R:** c) Un enlace simbolico. El primer caracter en la salida de `ls -l` indica el tipo de archivo: `-` para archivo regular, `d` para directorio, `l` para enlace simbolico (symbolic link), `b` para dispositivo de bloque, `c` para dispositivo de caracter, `p` para pipe (FIFO) y `s` para socket. Los enlaces simbolicos ademas muestran `-> destino` al final de la linea, indicando a que archivo o directorio apuntan. Los enlaces duros NO tienen un indicador especial; se muestran como archivos regulares con `-` al inicio, ya que tecnicamente son simplemente otra entrada de directorio para el mismo inodo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-011">
<div class="flashcard-front">

**P:** Que hace el comando `ln`?

</div>
<div class="flashcard-back">

**R:** `ln -s`

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-012">
<div class="flashcard-front">

**P:** Que es/son 1. Conceptos fundamentales: Inodos?

</div>
<div class="flashcard-back">

**R:** Para entender los enlaces, primero hay que entender los **inodos**.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-013">
<div class="flashcard-front">

**P:** Que es/son 4. Tabla comparativa: enlaces duros vs simbolicos?

</div>
<div class="flashcard-back">

**R:** | Caracteristica | Enlace duro | Enlace simbolico |

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.6">
</div>

<div class="flashcard" data-id="104.6-fc-014">
<div class="flashcard-front">

**P:** Que es/son 7. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **`ln`** crea enlaces duros. **`ln -s`** crea enlaces simbolicos.

</div>
</div>

---

