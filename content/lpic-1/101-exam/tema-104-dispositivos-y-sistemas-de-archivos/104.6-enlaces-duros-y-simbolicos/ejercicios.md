---
title: "104.6 Crear y cambiar enlaces duros y simbolicos - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.6"
---

# 104.6 Crear y cambiar enlaces duros y simbolicos - Ejercicios

### Pregunta 1

Se crea un archivo y un enlace duro con los siguientes comandos:
```bash
echo "hola" > archivo.txt
ln archivo.txt enlace_duro.txt
```
Si luego se borra `archivo.txt`, que sucede al ejecutar `cat enlace_duro.txt`?

a) Se produce un error "No such file or directory"
b) Se muestra "hola" correctamente
c) Se muestra un archivo vacio
d) Se produce un error "dangling link"

<details>
<summary>Respuesta</summary>

**b) Se muestra "hola" correctamente**

Un enlace duro comparte el mismo inodo que el archivo original. Borrar `archivo.txt` solo elimina una de las entradas de directorio que apuntan a ese inodo. El conteo de enlaces pasa de 2 a 1, pero los datos en disco persisten porque aun queda una referencia (el enlace duro). Los datos solo se liberan del disco cuando el conteo de enlaces llega a 0 y ningun proceso tiene el archivo abierto. Esta es una diferencia clave con los enlaces simbolicos, que se "rompen" al borrar el archivo original.

</details>

---

### Pregunta 2

Cual de los siguientes comandos fallaria, asumiendo que `/home` y `/mnt/usb` son sistemas de archivos diferentes?

a) `ln -s /home/sandra/archivo.txt /mnt/usb/enlace.txt`
b) `ln /home/sandra/archivo.txt /home/sandra/enlace.txt`
c) `ln /home/sandra/archivo.txt /mnt/usb/enlace.txt`
d) `ln -s /home/sandra/directorio/ /tmp/enlace_dir`

<details>
<summary>Respuesta</summary>

**c) `ln /home/sandra/archivo.txt /mnt/usb/enlace.txt`**

Los enlaces duros NO pueden cruzar sistemas de archivos diferentes, ya que dependen del numero de inodo que es unico dentro de cada sistema de archivos. La opcion `c` intenta crear un enlace duro entre dos filesystems distintos (`/home` y `/mnt/usb`), lo cual es imposible. La opcion `a` funciona porque los enlaces simbolicos si pueden cruzar filesystems. La opcion `b` funciona porque ambos archivos estan en el mismo filesystem. La opcion `d` funciona porque los enlaces simbolicos pueden apuntar a directorios (los duros no).

</details>

---

### Pregunta 3

Dada la siguiente salida de `ls -li`:
```
1234567 -rw-r--r-- 3 sandra sandra 2048 Jan 10 file_a.txt
1234567 -rw-r--r-- 3 sandra sandra 2048 Jan 10 file_b.txt
9876543 lrwxrwxrwx 1 sandra sandra   10 Jan 10 file_c.txt -> file_a.txt
```
Cuantos enlaces duros apuntan al mismo inodo que `file_a.txt`?

a) 1
b) 2
c) 3
d) 4

<details>
<summary>Respuesta</summary>

**c) 3**

El numero de inodo de `file_a.txt` es `1234567`, y el conteo de enlaces duros (tercer campo) es `3`. Esto indica que hay 3 entradas de directorio apuntando al mismo inodo: `file_a.txt`, `file_b.txt` (que tiene el mismo inodo 1234567) y un tercer enlace duro que no se muestra en la salida pero que existe en algun otro lugar. `file_c.txt` es un enlace simbolico (tipo `l`, inodo diferente 9876543) que apunta a `file_a.txt`, pero no incrementa el conteo de enlaces duros del inodo original.

</details>

---

### Pregunta 4

Un directorio vacio `/home/sandra/proyecto` muestra un conteo de enlaces de 2 en `ls -ld`. Si se crean 3 subdirectorios dentro, cual sera el nuevo conteo de enlaces?

a) 3
b) 4
c) 5
d) 8

<details>
<summary>Respuesta</summary>

**c) 5**

Un directorio vacio tiene conteo de enlaces 2: la entrada del directorio padre que apunta a el y la entrada `.` dentro del propio directorio (que apunta a si mismo). Cada subdirectorio creado dentro anade 1 al conteo, porque cada subdirectorio contiene una entrada `..` que es un enlace duro al directorio padre. La formula es: conteo = 2 + numero de subdirectorios directos. Con 3 subdirectorios: 2 + 3 = 5. Las entradas `.` y `..` son enlaces duros que el sistema crea y mantiene automaticamente.

</details>

---

### Pregunta 5

Que comando encuentra todos los enlaces simbolicos rotos en `/etc`?

a) `find /etc -type l`
b) `find /etc -xtype l`
c) `find /etc -type f -links +1`
d) `ls -la /etc | grep "^l"`

<details>
<summary>Respuesta</summary>

**b) `find /etc -xtype l`**

La opcion `-xtype l` de `find` busca archivos que serian de tipo enlace simbolico (`l`) si NO se siguiera el enlace, pero cuyo destino no existe (es decir, el enlace esta roto o "dangling"). La opcion `a` (`-type l`) encuentra todos los enlaces simbolicos, tanto validos como rotos, sin distinguir entre ellos. La opcion `c` (`-links +1`) busca archivos con mas de un enlace duro, que es algo completamente diferente. La opcion `d` con `ls` listaria enlaces simbolicos por su indicador `l` al inicio pero no distinguiria los rotos.

</details>

---

### Pregunta 6

Un usuario crea un enlace simbolico con ruta relativa:
```bash
cd /home/sandra
ln -s documentos/informe.txt /tmp/enlace_informe.txt
```
Al acceder a `/tmp/enlace_informe.txt`, que ocurre?

a) Funciona correctamente, mostrando el contenido de `/home/sandra/documentos/informe.txt`
b) El enlace esta roto porque la ruta relativa se resuelve desde la ubicacion del enlace, buscando `/tmp/documentos/informe.txt`
c) Se produce un error de permisos porque `/tmp` no tiene acceso a `/home`
d) Funciona correctamente porque la ruta relativa se resuelve desde el directorio de trabajo actual

<details>
<summary>Respuesta</summary>

**b) El enlace esta roto porque la ruta relativa se resuelve desde la ubicacion del enlace, buscando `/tmp/documentos/informe.txt`**

La ruta relativa `documentos/informe.txt` se almacena literalmente en el enlace simbolico. Cuando se accede al enlace desde `/tmp/enlace_informe.txt`, el sistema resuelve la ruta relativa desde la ubicacion del enlace (no desde donde se creo), buscando `/tmp/documentos/informe.txt`, que no existe. La solucion es usar una ruta absoluta: `ln -s /home/sandra/documentos/informe.txt /tmp/enlace_informe.txt`. Las rutas relativas en enlaces simbolicos siempre son relativas a la ubicacion del enlace, no al directorio de trabajo al momento de la creacion.

</details>

---

### Pregunta 7

Cual de las siguientes afirmaciones sobre la diferencia entre copiar un archivo y crear un enlace duro es correcta?

a) Tanto copiar como crear un enlace duro duplican el espacio en disco
b) Un enlace duro crea un nuevo inodo con una copia independiente de los datos
c) Al modificar un enlace duro, los cambios se reflejan en el original porque comparten el mismo inodo
d) Al borrar el archivo original, tanto la copia como el enlace duro dejan de funcionar

<details>
<summary>Respuesta</summary>

**c) Al modificar un enlace duro, los cambios se reflejan en el original porque comparten el mismo inodo**

Un enlace duro comparte el mismo inodo y los mismos bloques de datos que el archivo original. No hay un "original" y una "copia"; ambos nombres son equivalentes y apuntan a los mismos datos. Modificar el contenido a traves de cualquier nombre afecta a todos los demas nombres que apuntan al mismo inodo. En cambio, copiar con `cp` crea un nuevo archivo con nuevo inodo y copia independiente de los datos, duplicando el espacio en disco. El enlace duro NO duplica espacio, solo anade una entrada de directorio. Al borrar el original, el enlace duro sigue funcionando (la copia con `cp` tambien, al ser independiente).

</details>

---

### Pregunta 8

Que muestra el comando `readlink -f enlace.txt` a diferencia de `readlink enlace.txt` (sin opciones)?

a) `readlink -f` muestra los permisos del enlace, `readlink` muestra el destino
b) `readlink -f` resuelve toda la cadena de enlaces y devuelve la ruta absoluta final, `readlink` muestra solo el destino inmediato
c) `readlink -f` fuerza la lectura del enlace, `readlink` solo verifica si existe
d) No hay diferencia, ambos muestran el mismo resultado

<details>
<summary>Respuesta</summary>

**b) `readlink -f` resuelve toda la cadena de enlaces y devuelve la ruta absoluta final, `readlink` muestra solo el destino inmediato**

`readlink` sin opciones muestra unicamente el destino inmediato (un nivel) del enlace simbolico. Si hay una cadena de enlaces (enlace3 -> enlace2 -> enlace1 -> original.txt), `readlink enlace3` solo mostraria `enlace2`. En cambio, `readlink -f` resuelve toda la cadena de enlaces recursivamente y devuelve la ruta absoluta canonicalizada del archivo final (por ejemplo, `/home/sandra/original.txt`). Variantes utiles: `readlink -e` requiere que todos los componentes existan, y `readlink -m` no requiere que ningun componente exista.

</details>

---

### Pregunta 9

Cual de las siguientes limitaciones aplica a los enlaces duros pero NO a los enlaces simbolicos?

a) No pueden apuntar a archivos en otros sistemas de archivos
b) No pueden apuntar a archivos que no existen
c) No se pueden identificar con `ls -l`
d) Todas las anteriores

<details>
<summary>Respuesta</summary>

**d) Todas las anteriores**

Los enlaces duros tienen tres limitaciones que los simbolicos no: (1) No pueden cruzar sistemas de archivos porque dependen del numero de inodo, que es unico por filesystem. (2) No pueden apuntar a archivos inexistentes; el archivo debe existir para poder crear otro enlace duro al mismo inodo. Los enlaces simbolicos si pueden apuntar a archivos que no existen (enlaces rotos). (3) Los enlaces duros no tienen indicador visual especial en `ls -l`; se ven identicos a archivos normales. Los simbolicos muestran `l` al inicio y `-> destino`. Ademas, los enlaces duros no pueden apuntar a directorios (con excepcion de `.` y `..` que el sistema gestiona automaticamente).

</details>

---

### Pregunta 10

Que tipo de archivo se muestra con el caracter `l` al inicio en la salida de `ls -l`?

a) Un archivo de log del sistema
b) Un enlace duro
c) Un enlace simbolico
d) Una biblioteca compartida (library)

<details>
<summary>Respuesta</summary>

**c) Un enlace simbolico**

El primer caracter en la salida de `ls -l` indica el tipo de archivo: `-` para archivo regular, `d` para directorio, `l` para enlace simbolico (symbolic link), `b` para dispositivo de bloque, `c` para dispositivo de caracter, `p` para pipe (FIFO) y `s` para socket. Los enlaces simbolicos ademas muestran `-> destino` al final de la linea, indicando a que archivo o directorio apuntan. Los enlaces duros NO tienen un indicador especial; se muestran como archivos regulares con `-` al inicio, ya que tecnicamente son simplemente otra entrada de directorio para el mismo inodo.

</details>
