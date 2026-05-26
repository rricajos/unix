---
title: "203.3 - Opciones de sistemas de archivos"
tags: [lpic-2, examen-201, tema-203, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.3"
---

# 203.3 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

Un administrador necesita crear una instantanea de solo lectura del subvolumen `/mnt/btrfs/datos`. ¿Que comando es correcto?

a) `btrfs snapshot -r /mnt/btrfs/datos /mnt/btrfs/snap`
b) `btrfs subvolume snapshot -r /mnt/btrfs/datos /mnt/btrfs/snap`
c) `btrfs subvolume clone /mnt/btrfs/datos /mnt/btrfs/snap`
d) `cp --snapshot /mnt/btrfs/datos /mnt/btrfs/snap`

<details>
<summary>Respuesta</summary>

**b) `btrfs subvolume snapshot -r /mnt/btrfs/datos /mnt/btrfs/snap`**

El comando correcto para crear una instantanea en Btrfs es `btrfs subvolume snapshot`. La opcion `-r` hace que la instantanea sea de solo lectura, lo cual es necesario si se planea usar `btrfs send` para transferirla. Sin `-r`, la instantanea seria de lectura/escritura. Las instantaneas en Btrfs son casi instantaneas gracias al mecanismo copy-on-write.
</details>

---

### Pregunta 2

¿Cual es la principal diferencia entre LUKS/dm-crypt y eCryptfs en cuanto al nivel de cifrado?

a) LUKS cifra archivos individuales; eCryptfs cifra particiones completas
b) LUKS cifra a nivel de bloque (particion); eCryptfs cifra a nivel de archivo
c) Ambos cifran a nivel de bloque, pero usan diferentes algoritmos
d) LUKS solo cifra metadatos; eCryptfs cifra datos y metadatos

<details>
<summary>Respuesta</summary>

**b) LUKS cifra a nivel de bloque (particion); eCryptfs cifra a nivel de archivo**

LUKS/dm-crypt opera a nivel de bloque, cifrando toda la particion de forma transparente. El sistema de archivos se crea sobre el dispositivo descifrado en `/dev/mapper/`. eCryptfs, en cambio, opera a nivel de archivo dentro del kernel, cifrando cada archivo individualmente sobre un sistema de archivos existente. Esta diferencia tiene implicaciones practicas: LUKS ofrece mayor seguridad (cifra metadatos completos) pero eCryptfs permite backups incrementales mas faciles.
</details>

---

### Pregunta 3

En ZFS, ¿que comando se usa para crear un pool de almacenamiento con redundancia equivalente a RAID5 usando tres discos?

a) `zpool create mipool raid5 /dev/sdb /dev/sdc /dev/sdd`
b) `zpool create mipool raidz /dev/sdb /dev/sdc /dev/sdd`
c) `zfs create mipool raidz /dev/sdb /dev/sdc /dev/sdd`
d) `zpool create mipool mirror /dev/sdb /dev/sdc /dev/sdd`

<details>
<summary>Respuesta</summary>

**b) `zpool create mipool raidz /dev/sdb /dev/sdc /dev/sdd`**

En ZFS, `raidz` (o `raidz1`) es el equivalente a RAID5, proporcionando tolerancia a la falla de un disco mediante paridad distribuida. Se usa `zpool create` (no `zfs create`, que es para datasets). La opcion `mirror` crearia un espejo (RAID1), y `raidz2` seria el equivalente a RAID6 (tolerancia a dos fallos).
</details>

---

### Pregunta 4

¿Que algoritmo de compresion de Btrfs ofrece el mejor equilibrio entre velocidad y ratio de compresion?

a) `lzo`
b) `gzip`
c) `zstd`
d) `zlib`

<details>
<summary>Respuesta</summary>

**c) `zstd`**

Zstandard (`zstd`) es el algoritmo de compresion recomendado para Btrfs en la mayoria de los casos, ya que ofrece el mejor equilibrio entre velocidad de compresion/descompresion y ratio de compresion. `lzo` es el mas rapido pero con menor ratio de compresion. `zlib` ofrece buen ratio pero es significativamente mas lento. `gzip` no es un algoritmo soportado directamente por Btrfs (es un formato de archivo, no un algoritmo de compresion de FS).
</details>

---

### Pregunta 5

Un administrador quiere montar un tmpfs de 4GB en `/tmp`. ¿Cual es la linea correcta para `/etc/fstab`?

a) `ram0  /tmp  ramfs  defaults,size=4G  0  0`
b) `tmpfs  /tmp  tmpfs  defaults,size=4G  0  0`
c) `/dev/tmpfs  /tmp  tmpfs  defaults,size=4G  0  0`
d) `none  /tmp  tmpfs  defaults,maxsize=4G  0  0`

<details>
<summary>Respuesta</summary>

**b) `tmpfs  /tmp  tmpfs  defaults,size=4G  0  0`**

La sintaxis correcta usa `tmpfs` como dispositivo (primer campo), `/tmp` como punto de montaje, `tmpfs` como tipo de sistema de archivos, y `size=4G` para establecer el tamano maximo. El parametro `size=` define el limite maximo, no una asignacion fija; tmpfs solo consume la memoria que realmente se usa. `ramfs` no tiene limite de tamano y no usa swap, lo que lo hace peligroso. La opcion `maxsize` no es un parametro valido.
</details>

---

### Pregunta 6

¿Que archivo de configuracion define los volumenes LUKS que deben abrirse automaticamente durante el arranque del sistema?

a) `/etc/fstab`
b) `/etc/luks.conf`
c) `/etc/crypttab`
d) `/etc/dm-crypt.conf`

<details>
<summary>Respuesta</summary>

**c) `/etc/crypttab`**

El archivo `/etc/crypttab` define los volumenes cifrados LUKS que se desbloquean durante el arranque, antes de que se monten los sistemas de archivos de `/etc/fstab`. Cada linea contiene el nombre del mapeo, el dispositivo, el archivo de clave (o `none` para solicitar contraseña interactivamente) y opciones. Los sistemas de archivos dentro de los volumenes descifrados se montan luego a traves de fstab usando `/dev/mapper/<nombre>`.
</details>

---

### Pregunta 7

Un administrador quiere montar un subvolumen Btrfs llamado "home" de la particion `/dev/sda2` en `/home`. ¿Cual es la linea correcta para `/etc/fstab`?

a) `UUID=xxxx  /home  btrfs  defaults  0  0`
b) `UUID=xxxx  /home  btrfs  defaults,subvol=home  0  0`
c) `UUID=xxxx  /home  btrfs  defaults,subvolume=home  0  0`
d) `UUID=xxxx  /home  btrfs  defaults,volume=home  0  0`

<details>
<summary>Respuesta</summary>

**b) `UUID=xxxx  /home  btrfs  defaults,subvol=home  0  0`**

Para montar un subvolumen especifico de Btrfs, se usa la opcion `subvol=nombre` (o alternativamente `subvolid=ID`). Sin esta opcion, se montaria el subvolumen por defecto (normalmente el subvolumen raiz, ID 5). La opcion `subvolume=` no es valida; el parametro correcto es `subvol=`.
</details>

---

### Pregunta 8

¿Cual de las siguientes afirmaciones sobre tmpfs es correcta?

a) tmpfs asigna un bloque fijo de RAM al crearse, independientemente del uso real
b) tmpfs solo usa RAM, nunca utiliza el espacio swap
c) tmpfs crece dinamicamente y puede usar swap si la RAM se llena
d) tmpfs persiste sus datos entre reinicios del sistema

<details>
<summary>Respuesta</summary>

**c) tmpfs crece dinamicamente y puede usar swap si la RAM se llena**

tmpfs es un sistema de archivos que almacena datos en memoria virtual, lo que incluye tanto RAM como swap. No asigna un bloque fijo; solo consume la memoria que realmente necesita y la libera cuando los archivos se eliminan. Si la RAM disponible se agota, los datos de tmpfs pueden moverse al swap. El parametro `size=` define un limite maximo, no una preasignacion. Los datos se pierden al reiniciar. `ramfs`, a diferencia de tmpfs, no usa swap y no tiene limite de tamano.
</details>

---

### Pregunta 9

¿Que comando de ZFS se utiliza para verificar la integridad de todos los datos en un pool, similar a `btrfs scrub` en Btrfs?

a) `zfs check mipool`
b) `zpool verify mipool`
c) `zpool scrub mipool`
d) `zfs scrub mipool`

<details>
<summary>Respuesta</summary>

**c) `zpool scrub mipool`**

`zpool scrub` lee todos los datos y metadatos del pool, verifica los checksums y repara automaticamente los datos corruptos si hay redundancia disponible (mirror o raidz). Es equivalente a `btrfs scrub start` en Btrfs. El scrub se ejecuta a nivel de pool (con `zpool`), no a nivel de dataset (con `zfs`), ya que la verificacion abarca todo el almacenamiento fisico del pool.
</details>

---

### Pregunta 10

Un administrador necesita abrir un volumen LUKS existente en `/dev/sda3` con el nombre "datos_seguros" para poder montar el sistema de archivos que contiene. ¿Que comando debe usar?

a) `cryptsetup create datos_seguros /dev/sda3`
b) `cryptsetup luksOpen /dev/sda3 datos_seguros`
c) `cryptsetup mount /dev/sda3 datos_seguros`
d) `cryptsetup luksMount /dev/sda3 /mnt/datos_seguros`

<details>
<summary>Respuesta</summary>

**b) `cryptsetup luksOpen /dev/sda3 datos_seguros`**

`cryptsetup luksOpen` (o su equivalente moderno `cryptsetup open --type luks`) desbloquea un volumen LUKS y crea un dispositivo descifrado en `/dev/mapper/datos_seguros`. Despues de abrir el volumen, se puede montar con `mount /dev/mapper/datos_seguros /mnt/punto`. La opcion `create` es para dm-crypt plano (sin LUKS). No existen los subcomandos `mount` ni `luksMount` en cryptsetup.
</details>
