---
title: "204.3 - LVM"
tags: [lpic-2, examen-201, tema-204, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.3"
---

# 204.3 - Ejercicios: LVM

### Pregunta 1
Cual es el orden correcto de la jerarquia LVM, de nivel mas bajo a mas alto?

a) LV -> VG -> PV -> Disco
b) Disco -> VG -> PV -> LV
c) Disco -> PV -> VG -> LV
d) PV -> Disco -> LV -> VG

<details>
<summary>Respuesta</summary>

**c) Disco -> PV -> VG -> LV**

La jerarquia de LVM es: disco fisico o particion -> Physical Volume (PV) -> Volume Group (VG) -> Logical Volume (LV). Primero se inicializan los discos como PVs con `pvcreate`, luego se agrupan en VGs con `vgcreate`, y finalmente se crean LVs con `lvcreate` dentro del VG.
</details>

---

### Pregunta 2
Un administrador quiere ampliar un volumen logico con ext4 en 10 GB sin desmontar el sistema de archivos. Cual es el comando mas eficiente?

a) `lvextend -L +10G /dev/vg_datos/lv_home && resize2fs /dev/vg_datos/lv_home`
b) `lvextend -r -L +10G /dev/vg_datos/lv_home`
c) `resize2fs /dev/vg_datos/lv_home +10G && lvextend -L +10G /dev/vg_datos/lv_home`
d) `lvresize -L 10G /dev/vg_datos/lv_home`

<details>
<summary>Respuesta</summary>

**b) `lvextend -r -L +10G /dev/vg_datos/lv_home`**

La opcion `-r` (o `--resizefs`) de `lvextend` redimensiona automaticamente el sistema de archivos despues de ampliar el LV, en un solo paso. La opcion a) tambien funciona pero requiere dos comandos. La opcion c) tiene el orden invertido (nunca se debe ampliar el FS antes que el LV). La opcion d) establece el tamano total a 10G en lugar de agregar 10G.
</details>

---

### Pregunta 3
Que comando crea un snapshot de 5 GB llamado "snap_datos" del volumen logico `/dev/vg_datos/lv_datos`?

a) `lvcreate -L 5G -n snap_datos --snapshot /dev/vg_datos/lv_datos`
b) `lvcreate -s -L 5G -n snap_datos /dev/vg_datos/lv_datos`
c) `lvsnap -L 5G -n snap_datos /dev/vg_datos/lv_datos`
d) `lvcreate -L 5G -n snap_datos --type snapshot vg_datos`

<details>
<summary>Respuesta</summary>

**b) `lvcreate -s -L 5G -n snap_datos /dev/vg_datos/lv_datos`**

La opcion `-s` (o `--snapshot`) de `lvcreate` indica que se crea un snapshot. Se especifica el tamano con `-L`, el nombre con `-n`, y al final se indica el LV de origen. La opcion a) tambien seria valida (usa `--snapshot` en forma larga). La opcion b) es la forma mas habitual y concisa.
</details>

---

### Pregunta 4
Que ocurre si un snapshot LVM alcanza el 100% de su capacidad asignada?

a) Se amplia automaticamente
b) Se elimina automaticamente
c) Se invalida y no puede ser utilizado
d) Se congela en modo solo lectura

<details>
<summary>Respuesta</summary>

**c) Se invalida y no puede ser utilizado**

Cuando un snapshot se llena al 100%, se marca como invalido porque ya no puede registrar los cambios del volumen original. Un snapshot invalido debe ser eliminado con `lvremove`. Para evitar esto, se debe monitorizar el porcentaje de uso con `lvs` (columna Data%) y dimensionar adecuadamente el snapshot o ampliarlo a tiempo con `lvextend`.
</details>

---

### Pregunta 5
Un administrador necesita agregar un nuevo disco `/dev/sde1` a un grupo de volumenes existente llamado `vg_produccion`. Que secuencia de comandos es correcta?

a) `vgextend vg_produccion /dev/sde1`
b) `pvcreate /dev/sde1 && vgextend vg_produccion /dev/sde1`
c) `vgadd vg_produccion /dev/sde1`
d) `pvcreate /dev/sde1 && vgcreate vg_produccion /dev/sde1`

<details>
<summary>Respuesta</summary>

**b) `pvcreate /dev/sde1 && vgextend vg_produccion /dev/sde1`**

Primero se debe inicializar el disco como volumen fisico con `pvcreate`, y luego agregarlo al VG existente con `vgextend`. Nota: en versiones recientes de LVM, `vgextend` puede ejecutar implicitamente `pvcreate`, pero la secuencia explicita es la practica recomendada y la que se espera en el examen. La opcion d) crearia un nuevo VG en lugar de extender el existente.
</details>

---

### Pregunta 6
Que comando se utiliza para mover los datos de un volumen fisico a otro dentro del mismo grupo de volumenes, sin interrupcion del servicio?

a) `lvcopy /dev/sdb1 /dev/sdc1`
b) `pvmove /dev/sdb1 /dev/sdc1`
c) `vgmove /dev/sdb1 /dev/sdc1`
d) `dd if=/dev/sdb1 of=/dev/sdc1`

<details>
<summary>Respuesta</summary>

**b) `pvmove /dev/sdb1 /dev/sdc1`**

El comando `pvmove` migra todos los extents (datos) de un PV a otro dentro del mismo VG, sin necesidad de desmontar los sistemas de archivos ni detener los servicios. Es el metodo estandar para evacuar un disco antes de retirarlo con `vgreduce`. Si no se especifica el destino, LVM elige automaticamente otro PV con espacio disponible.
</details>

---

### Pregunta 7
Cual es la diferencia principal entre `-L` y `-l` en los comandos LVM?

a) `-L` especifica el tamano en bytes y `-l` en kilobytes
b) `-L` especifica el tamano en unidades legibles y `-l` en extents o porcentaje
c) `-L` se usa para LVs y `-l` para PVs
d) No hay diferencia, son sinonimos

<details>
<summary>Respuesta</summary>

**b) `-L` especifica el tamano en unidades legibles y `-l` en extents o porcentaje**

La opcion `-L` (mayuscula) acepta tamanos en formato legible como `10G`, `500M`, `1T`. La opcion `-l` (minuscula) acepta un numero de extents logicos o porcentajes como `100%FREE`, `50%VG`, `5000` (extents). Por ejemplo: `lvcreate -L 20G` crea un LV de 20 GiB, mientras que `lvcreate -l 100%FREE` utiliza todo el espacio libre del VG.
</details>

---

### Pregunta 8
Un administrador tiene un LV con XFS que necesita reducir. Que afirmacion es correcta?

a) Puede reducirlo con `xfs_shrink` despues de desmontar
b) Puede reducirlo con `lvreduce -r` que gestiona XFS automaticamente
c) XFS no soporta reduccion; debe hacer backup, recrear el LV mas pequeno y restaurar
d) Puede reducirlo convirtiendo primero a ext4 y luego de vuelta a XFS

<details>
<summary>Respuesta</summary>

**c) XFS no soporta reduccion; debe hacer backup, recrear el LV mas pequeno y restaurar**

El sistema de archivos XFS solo soporta crecimiento (con `xfs_growfs`), no reduccion. No existe un comando `xfs_shrink`. Si se necesita un volumen XFS mas pequeno, la unica opcion es respaldar los datos, eliminar y recrear el LV con menor tamano, crear un nuevo XFS y restaurar el backup. Esta es una limitacion importante a recordar para el examen.
</details>

---

### Pregunta 9
Que comando restaura un volumen logico al estado capturado en un snapshot?

a) `lvrevert /dev/vg_datos/snap_datos`
b) `lvconvert --merge /dev/vg_datos/snap_datos`
c) `lvrestore /dev/vg_datos/snap_datos`
d) `lvcreate --restore /dev/vg_datos/snap_datos`

<details>
<summary>Respuesta</summary>

**b) `lvconvert --merge /dev/vg_datos/snap_datos`**

El comando `lvconvert --merge` fusiona el snapshot con su volumen de origen, revirtiendo el LV original al estado en que se encontraba cuando se creo el snapshot. El snapshot se elimina automaticamente despues de la fusion. Si el LV original esta montado, la fusion se efectua en el siguiente arranque o tras desmontar y remontar.
</details>

---

### Pregunta 10
Que es el thin provisioning en LVM y cual es su ventaja principal?

a) Un metodo de compresion de datos en volumenes logicos
b) Una tecnica que permite asignar mas espacio virtual que el fisicamente disponible, asignando almacenamiento real solo al escribir datos
c) Una forma de crear volumenes logicos sin grupo de volumenes
d) Un tipo de RAID especifico de LVM para discos SSD

<details>
<summary>Respuesta</summary>

**b) Una tecnica que permite asignar mas espacio virtual que el fisicamente disponible, asignando almacenamiento real solo al escribir datos**

El thin provisioning (aprovisionamiento ligero) crea un "thin pool" desde el cual se asignan "thin volumes" que pueden tener un tamano virtual mayor al espacio fisico real. El almacenamiento se consume solo cuando se escriben datos realmente. Se crea con `lvcreate -T` (thin pool) y `lvcreate -V` (tamano virtual). Es ideal para entornos de virtualizacion donde muchas VMs no usan todo su espacio asignado.
</details>

---
