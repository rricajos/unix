---
title: "206.2 - Operaciones de backup"
tags: [lpic-2, examen-201, tema-206, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.2"
---

# 206.2 - Ejercicios: Operaciones de backup

## Pregunta 1

¿Que opcion de `tar` permite realizar backups incrementales utilizando un archivo snapshot?

a) `--incremental`
b) `--newer`
c) `--listed-incremental`
d) `--snapshot`

<details><summary>Respuesta</summary>

**c) `--listed-incremental`**

La opcion `--listed-incremental=ARCHIVO` permite a tar realizar backups incrementales. El archivo snapshot (.snar) registra el estado de los archivos. En la primera ejecucion se crea un backup completo; en ejecuciones posteriores solo se archivan los archivos nuevos o modificados.

</details>

## Pregunta 2

Al ejecutar `rsync -av /home/usuario/ /backup/usuario/`, ¿que efecto tiene la barra final (`/`) en la ruta de origen?

a) No tiene ningun efecto
b) Copia el contenido del directorio sin incluir el directorio en si
c) Fuerza la eliminacion de archivos en el destino
d) Activa la compresion durante la transferencia

<details><summary>Respuesta</summary>

**b) Copia el contenido del directorio sin incluir el directorio en si**

En rsync, la barra final en la ruta de origen indica que se debe copiar el contenido del directorio. Sin la barra (`/home/usuario`), rsync copiaria el directorio `usuario` dentro del destino, creando `/backup/usuario/usuario/`.

</details>

## Pregunta 3

¿Que comando crea una copia exacta del MBR (Master Boot Record) de un disco?

a) `dd if=/dev/sda of=mbr.bin bs=446 count=1`
b) `dd if=/dev/sda of=mbr.bin bs=512 count=1`
c) `dd if=/dev/sda of=mbr.bin bs=1024 count=1`
d) `cp /dev/sda mbr.bin`

<details><summary>Respuesta</summary>

**b) `dd if=/dev/sda of=mbr.bin bs=512 count=1`**

El MBR ocupa exactamente los primeros 512 bytes del disco: 446 bytes para el bootloader, 64 bytes para la tabla de particiones y 2 bytes para la firma (0x55AA). El comando `dd if=/dev/sda of=mbr.bin bs=512 count=1` copia estos 512 bytes completos.

</details>

## Pregunta 4

¿Cual es la diferencia principal entre un backup incremental y un backup diferencial?

a) El incremental es mas rapido de restaurar
b) El diferencial copia los cambios desde el ultimo backup de cualquier tipo
c) El incremental copia los cambios desde el ultimo backup (cualquier tipo), el diferencial desde el ultimo backup completo
d) No hay diferencia significativa entre ambos

<details><summary>Respuesta</summary>

**c) El incremental copia los cambios desde el ultimo backup (cualquier tipo), el diferencial desde el ultimo backup completo**

El backup incremental registra solo los cambios desde la ultima copia (sea full o incremental), generando archivos pequenos pero requiriendo toda la cadena para restaurar. El diferencial siempre referencia al ultimo backup completo, lo que produce archivos mas grandes pero simplifica la restauracion (solo se necesita el full + el ultimo diferencial).

</details>

## Pregunta 5

¿Que opcion de `rsync` elimina en el destino los archivos que ya no existen en el origen?

a) `--remove`
b) `--clean`
c) `--delete`
d) `--purge`

<details><summary>Respuesta</summary>

**c) `--delete`**

La opcion `--delete` hace que rsync elimine del destino cualquier archivo que no exista en el origen, creando una replica exacta. Es muy util para mantener un espejo actualizado, pero debe usarse con precaucion ya que puede causar perdida de datos si se configura incorrectamente.

</details>

## Pregunta 6

¿En que modo opera `cpio` cuando se usa con la opcion `-o`?

a) Copy-in (extraccion)
b) Copy-out (creacion de archivo)
c) Copy-pass (copia directa)
d) Copy-over (sobreescritura)

<details><summary>Respuesta</summary>

**b) Copy-out (creacion de archivo)**

El modo copy-out (`-o`) de cpio lee nombres de archivo desde la entrada estandar y crea un archivo cpio en la salida estandar. Ejemplo: `find /etc | cpio -ov > backup.cpio`. Los otros modos son copy-in (`-i`) para extraer y copy-pass (`-p`) para copiar directamente entre directorios.

</details>

## Pregunta 7

¿Que opcion de rsync se recomienda para realizar una simulacion antes de ejecutar la sincronizacion real?

a) `--test`
b) `--simulate`
c) `-n` o `--dry-run`
d) `--preview`

<details><summary>Respuesta</summary>

**c) `-n` o `--dry-run`**

La opcion `-n` (o `--dry-run`) ejecuta rsync sin realizar ningun cambio real, mostrando lo que se haria. Es especialmente importante usarla antes de ejecutar rsync con `--delete` para verificar que no se eliminaran archivos importantes.

</details>

## Pregunta 8

¿Cual de las siguientes herramientas es un sistema de backup empresarial con arquitectura modular que incluye Director, Storage Daemon y File Daemon?

a) Amanda
b) Bacula
c) rsync
d) BURP

<details><summary>Respuesta</summary>

**b) Bacula**

Bacula utiliza una arquitectura modular compuesta por: el Director (coordina las operaciones), el Storage Daemon (gestiona los medios de almacenamiento), el File Daemon (agente en los clientes) y la Console (interfaz de administracion). Ademas usa una base de datos como catalogo.

</details>

## Pregunta 9

Para restaurar una secuencia de backups incrementales realizados con `tar --listed-incremental`, ¿que valor se usa para el archivo snapshot durante la restauracion?

a) El mismo archivo snapshot usado al crear el backup
b) `/dev/null`
c) Un archivo snapshot vacio nuevo
d) No se necesita especificar un archivo snapshot para restaurar

<details><summary>Respuesta</summary>

**b) `/dev/null`**

Al restaurar un backup incremental, se usa `--listed-incremental=/dev/null` para indicar a tar que se trata de una operacion de restauracion. Ejemplo: `tar --listed-incremental=/dev/null -xzf backup-inc.tar.gz`. Esto asegura que tar procese correctamente las eliminaciones y movimientos de archivos registrados en el backup.

</details>

## Pregunta 10

¿Que significa la opcion `-a` de rsync?

a) Solo sincroniza archivos (no directorios)
b) Activa el modo automatico sin intervencion del usuario
c) Es equivalente a `-rlptgoD` (modo archivo: recursivo, enlaces, permisos, tiempos, grupo, owner, devices)
d) Agrega archivos al destino sin eliminar nada

<details><summary>Respuesta</summary>

**c) Es equivalente a `-rlptgoD` (modo archivo: recursivo, enlaces, permisos, tiempos, grupo, owner, devices)**

La opcion `-a` (archive) de rsync es un atajo que combina varias opciones: `-r` (recursivo), `-l` (enlaces simbolicos), `-p` (permisos), `-t` (tiempos de modificacion), `-g` (grupo), `-o` (propietario) y `-D` (dispositivos y archivos especiales). Es la opcion mas comun para realizar backups ya que preserva la mayoria de los atributos de los archivos.

</details>
