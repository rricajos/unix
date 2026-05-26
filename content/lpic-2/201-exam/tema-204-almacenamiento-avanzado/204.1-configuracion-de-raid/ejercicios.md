---
title: "204.1 - Configuracion de RAID"
tags: [lpic-2, examen-201, tema-204, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.1"
---

# 204.1 - Ejercicios: Configuracion de RAID

### Pregunta 1
Cual es el numero minimo de discos necesarios para crear un array RAID 5?

a) 2
b) 3
c) 4
d) 5

<details>
<summary>Respuesta</summary>

**b) 3**

RAID 5 requiere un minimo de 3 discos porque necesita distribuir los datos y la paridad entre al menos tres dispositivos. Con dos discos no seria posible implementar el esquema de paridad distribuida que caracteriza a RAID 5.
</details>

---

### Pregunta 2
Que comando se utiliza para crear un array RAID 1 con dos discos y un disco spare?

a) `mdadm --create /dev/md0 --level=1 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1`
b) `mdadm --create /dev/md0 --level=1 --raid-devices=2 --spare-devices=1 /dev/sdb1 /dev/sdc1 /dev/sdd1`
c) `mdadm --assemble /dev/md0 --level=1 --raid-devices=2 --spare=1 /dev/sdb1 /dev/sdc1 /dev/sdd1`
d) `mdadm --build /dev/md0 --level=1 --raid-devices=2 --spare-devices=1 /dev/sdb1 /dev/sdc1 /dev/sdd1`

<details>
<summary>Respuesta</summary>

**b) `mdadm --create /dev/md0 --level=1 --raid-devices=2 --spare-devices=1 /dev/sdb1 /dev/sdc1 /dev/sdd1`**

Se usa `--create` para crear nuevos arrays, `--raid-devices=2` indica que el mirror tiene 2 discos activos, y `--spare-devices=1` designa un disco como repuesto. Se proporcionan los tres dispositivos (2 activos + 1 spare).
</details>

---

### Pregunta 3
En la salida de `/proc/mdstat`, que indica la notacion `[U_]`?

a) El array tiene un disco sin utilizar
b) El array esta en estado degradado con un disco fallido
c) El array esta siendo reconstruido
d) El array tiene un disco spare disponible

<details>
<summary>Respuesta</summary>

**b) El array esta en estado degradado con un disco fallido**

En `/proc/mdstat`, cada caracter entre corchetes representa un disco del array. `U` (Up) significa que el disco esta activo y funcionando. `_` (guion bajo) significa que el disco esta ausente o fallido. Por tanto, `[U_]` indica un array RAID 1 con un disco activo y uno fallido.
</details>

---

### Pregunta 4
Que archivo de configuracion debe actualizarse para que los arrays RAID se ensamblen automaticamente durante el arranque?

a) `/etc/fstab`
b) `/etc/mdadm.conf`
c) `/etc/raid.conf`
d) `/proc/mdstat`

<details>
<summary>Respuesta</summary>

**b) `/etc/mdadm.conf`**

El archivo `/etc/mdadm.conf` (o `/etc/mdadm/mdadm.conf` en Debian) contiene las definiciones de los arrays RAID. Se genera con `mdadm --detail --scan` y es leido durante el arranque para reensamblar los arrays automaticamente. Nota: `/etc/fstab` se usa para el montaje, pero el ensamblado del array depende de `mdadm.conf`.
</details>

---

### Pregunta 5
Dispones de 4 discos de 1 TB cada uno en RAID 6. Cual es la capacidad util del array?

a) 1 TB
b) 2 TB
c) 3 TB
d) 4 TB

<details>
<summary>Respuesta</summary>

**b) 2 TB**

RAID 6 utiliza doble paridad, por lo que la capacidad util es (N-2) discos. Con 4 discos de 1 TB: (4-2) x 1 TB = 2 TB. Los 2 TB restantes se usan para almacenar los dos bloques de paridad independientes, lo que permite tolerar la perdida simultanea de hasta 2 discos.
</details>

---

### Pregunta 6
Cual es el procedimiento correcto para reemplazar un disco fallido en un array RAID?

a) Detener el array, reemplazar el disco, reiniciar el array
b) Marcar el disco como fallido con `--fail`, retirarlo con `--remove`, agregar el nuevo con `--add`
c) Ejecutar `mdadm --rebuild /dev/md0 /dev/nuevo_disco`
d) Editar `/etc/mdadm.conf` y reiniciar el servicio mdmonitor

<details>
<summary>Respuesta</summary>

**b) Marcar el disco como fallido con `--fail`, retirarlo con `--remove`, agregar el nuevo con `--add`**

El procedimiento correcto sin detener el array es: primero marcar el disco como fallido (`mdadm --fail /dev/md0 /dev/sdX`), luego retirarlo del array (`mdadm --remove /dev/md0 /dev/sdX`), reemplazar fisicamente el disco, particionar el nuevo disco, y finalmente agregarlo al array (`mdadm --add /dev/md0 /dev/sdY`). La reconstruccion comienza automaticamente.
</details>

---

### Pregunta 7
Que comando permite expandir un array RAID 5 de 3 a 4 discos?

a) `mdadm --add /dev/md0 /dev/sde1`
b) `mdadm --grow /dev/md0 --raid-devices=4 --add /dev/sde1`
c) `mdadm --extend /dev/md0 --devices=4 /dev/sde1`
d) `mdadm --create /dev/md0 --level=5 --raid-devices=4 /dev/sdb1 /dev/sdc1 /dev/sdd1 /dev/sde1`

<details>
<summary>Respuesta</summary>

**b) `mdadm --grow /dev/md0 --raid-devices=4 --add /dev/sde1`**

La opcion `--grow` de mdadm permite modificar un array existente. Se usa junto con `--raid-devices=4` para indicar el nuevo numero de discos activos y `--add` para agregar el nuevo disco. Despues de completar el crecimiento, es necesario redimensionar el sistema de archivos con `resize2fs` o `xfs_growfs`.
</details>

---

### Pregunta 8
Que nivel RAID ofrece la mejor combinacion de rendimiento y redundancia, pero requiere un minimo de 4 discos?

a) RAID 5
b) RAID 6
c) RAID 10
d) RAID 0

<details>
<summary>Respuesta</summary>

**c) RAID 10**

RAID 10 (1+0) combina mirroring (RAID 1) con striping (RAID 0), ofreciendo tanto alto rendimiento de lectura/escritura como redundancia. Requiere un minimo de 4 discos (2 pares de espejos). Aunque RAID 6 tambien requiere 4 discos, su rendimiento de escritura es inferior debido al calculo de doble paridad.
</details>

---

### Pregunta 9
Un administrador ejecuta `mdadm --detail /dev/md0` y observa que un disco aparece como "spare rebuilding". Que significa esto?

a) El disco spare esta defectuoso y debe ser reemplazado
b) El disco spare se ha activado y esta reconstruyendo los datos del disco fallido
c) El array esta siendo convertido de un nivel RAID a otro
d) El disco spare esta siendo verificado antes de ser agregado al array

<details>
<summary>Respuesta</summary>

**b) El disco spare se ha activado y esta reconstruyendo los datos del disco fallido**

Cuando un disco del array falla y hay un spare disponible, mdadm activa automaticamente el disco spare e inicia la reconstruccion (rebuild). Durante este proceso, el disco aparece como "spare rebuilding" en la salida de `--detail`. El progreso se puede monitorizar con `cat /proc/mdstat`.
</details>

---

### Pregunta 10
Que comando elimina completamente los metadatos RAID del superbloque de un dispositivo para poder reutilizarlo?

a) `mdadm --remove /dev/sdb1`
b) `mdadm --zero-superblock /dev/sdb1`
c) `mdadm --clean /dev/sdb1`
d) `mdadm --erase /dev/sdb1`

<details>
<summary>Respuesta</summary>

**b) `mdadm --zero-superblock /dev/sdb1`**

El comando `mdadm --zero-superblock` borra los metadatos RAID almacenados en el superbloque del dispositivo. Esto es necesario cuando se quiere reutilizar un disco que pertenecioa a un array RAID, ya que sin limpiar el superbloque, mdadm podria intentar reensamblarlo en un array antiguo. Es una practica recomendada antes de reutilizar discos.
</details>

---
