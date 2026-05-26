---
title: "203.3 - Opciones de sistemas de archivos"
tags: [lpic-2, examen-201, tema-203, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.3"
---

# 203.3 - Opciones de sistemas de archivos

## Introduccion

Los sistemas de archivos modernos de Linux ofrecen funcionalidades avanzadas que van mucho mas alla del simple almacenamiento de archivos. Este subtema cubre las caracteristicas avanzadas de Btrfs y ZFS, el uso de tmpfs para almacenamiento en memoria, la comparativa entre ext4 y XFS, y los mecanismos de cifrado de sistemas de archivos con LUKS/dm-crypt y alternativas.

**Peso del subtema: 2**

## Btrfs - B-tree File System

### Introduccion a Btrfs

Btrfs es un sistema de archivos moderno de tipo copy-on-write (CoW) diseñado para Linux. Ofrece funcionalidades avanzadas que tradicionalmente requerian herramientas externas o gestores de volumenes.

**Caracteristicas principales:**
- Copy-on-write (CoW) para datos y metadatos
- Subvolumenes
- Instantaneas (snapshots) eficientes
- Compresion transparente
- RAID integrado (0, 1, 10, 5, 6)
- Checksums para datos y metadatos
- Deduplicacion
- Redimensionamiento en linea (expandir y reducir)
- Envio/recepcion de instantaneas (send/receive)

### Subvolumenes

Los subvolumenes son divisiones logicas dentro de un sistema de archivos Btrfs. Cada subvolumen puede montarse independientemente y tener sus propias instantaneas.

```bash
# Crear un subvolumen
btrfs subvolume create /mnt/btrfs/datos
btrfs subvolume create /mnt/btrfs/home
btrfs subvolume create /mnt/btrfs/var

# Listar subvolumenes
btrfs subvolume list /mnt/btrfs

# Mostrar informacion de un subvolumen
btrfs subvolume show /mnt/btrfs/datos

# Eliminar un subvolumen
btrfs subvolume delete /mnt/btrfs/datos

# Montar un subvolumen especifico
mount -o subvol=datos /dev/sdb1 /mnt/datos
mount -o subvolid=257 /dev/sdb1 /mnt/datos

# En /etc/fstab
UUID=xxxx  /datos  btrfs  defaults,subvol=datos  0  0
UUID=xxxx  /home   btrfs  defaults,subvol=home   0  0
```

> **Para el examen:** Los subvolumenes de Btrfs son similares a particiones logicas pero mas flexibles. No tienen un tamano fijo y comparten el espacio del sistema de archivos. Se pueden montar de forma independiente usando `subvol=` o `subvolid=`.

### Instantaneas (Snapshots)

Las instantaneas son copias punto-en-tiempo de un subvolumen. Gracias al mecanismo CoW, son casi instantaneas y no consumen espacio adicional hasta que los datos divergen.

```bash
# Crear una instantanea de solo lectura
btrfs subvolume snapshot -r /mnt/btrfs/datos /mnt/btrfs/snapshots/datos-20240115

# Crear una instantanea de lectura/escritura
btrfs subvolume snapshot /mnt/btrfs/datos /mnt/btrfs/snapshots/datos-writable

# Listar instantaneas (son subvolumenes)
btrfs subvolume list -s /mnt/btrfs

# Eliminar una instantanea
btrfs subvolume delete /mnt/btrfs/snapshots/datos-20240115

# Enviar/recibir instantaneas (backup incremental)
btrfs send /mnt/btrfs/snapshots/datos-20240115 | btrfs receive /mnt/backup/

# Envio incremental (solo diferencias desde la instantanea anterior)
btrfs send -p /mnt/btrfs/snapshots/datos-20240114 \
    /mnt/btrfs/snapshots/datos-20240115 | btrfs receive /mnt/backup/
```

### Compresion transparente

Btrfs soporta compresion transparente de datos con varios algoritmos:

```bash
# Montar con compresion zlib (mejor ratio)
mount -o compress=zlib /dev/sdb1 /mnt/btrfs

# Montar con compresion lzo (mas rapido)
mount -o compress=lzo /dev/sdb1 /mnt/btrfs

# Montar con compresion zstd (equilibrio velocidad/ratio)
mount -o compress=zstd /dev/sdb1 /mnt/btrfs

# Especificar nivel de compresion zstd
mount -o compress=zstd:3 /dev/sdb1 /mnt/btrfs

# Forzar compresion (incluso para archivos ya comprimidos)
mount -o compress-force=zstd /dev/sdb1 /mnt/btrfs

# En /etc/fstab
UUID=xxxx  /datos  btrfs  defaults,compress=zstd  0  0

# Comprimir archivos existentes
btrfs filesystem defragment -r -czstd /mnt/btrfs/
```

| Algoritmo | Velocidad | Ratio compresion | Uso recomendado |
|---|---|---|---|
| `lzo` | Muy rapida | Bajo | Uso general, SSD |
| `zlib` | Lenta | Alto | Archivos, poco acceso |
| `zstd` | Rapida | Alto | Recomendado por defecto |

### RAID integrado en Btrfs

```bash
# Crear Btrfs con RAID1 (espejo) para datos y metadatos
mkfs.btrfs -d raid1 -m raid1 /dev/sdb1 /dev/sdc1

# Crear con RAID0 para datos, RAID1 para metadatos
mkfs.btrfs -d raid0 -m raid1 /dev/sdb1 /dev/sdc1

# Agregar un dispositivo a un Btrfs existente
btrfs device add /dev/sdd1 /mnt/btrfs

# Eliminar un dispositivo
btrfs device remove /dev/sdc1 /mnt/btrfs

# Convertir perfil de datos a RAID1
btrfs balance start -dconvert=raid1 /mnt/btrfs

# Ver uso del sistema de archivos
btrfs filesystem usage /mnt/btrfs
btrfs filesystem df /mnt/btrfs
btrfs device stats /mnt/btrfs
```

### Gestion general de Btrfs

```bash
# Informacion del sistema de archivos
btrfs filesystem show
btrfs filesystem show /mnt/btrfs

# Uso del espacio
btrfs filesystem df /mnt/btrfs
btrfs filesystem usage /mnt/btrfs

# Redimensionar
btrfs filesystem resize +10G /mnt/btrfs    # Expandir 10GB
btrfs filesystem resize -5G /mnt/btrfs     # Reducir 5GB
btrfs filesystem resize max /mnt/btrfs     # Expandir al maximo

# Verificar integridad
btrfs scrub start /mnt/btrfs
btrfs scrub status /mnt/btrfs

# Balance (reorganizar datos entre dispositivos)
btrfs balance start /mnt/btrfs
btrfs balance status /mnt/btrfs
```

## ZFS - Zettabyte File System

### Introduccion a ZFS

ZFS es un sistema de archivos y gestor de volumenes combinado, originalmente desarrollado por Sun Microsystems para Solaris. En Linux se usa a traves del proyecto OpenZFS. Debido a incompatibilidades de licencia (CDDL vs GPL), ZFS no esta integrado directamente en el kernel de Linux.

**Caracteristicas principales:**
- Pools de almacenamiento (zpools)
- Datasets (equivalentes a subvolumenes)
- Instantaneas y clones
- Compresion y deduplicacion
- RAID-Z (niveles 1, 2, 3)
- Checksums en todos los datos
- Reparacion automatica de datos corruptos
- Copy-on-write
- Sin limite practico de tamano

### zpools - Pools de almacenamiento

```bash
# Crear un pool simple
zpool create mipiscina /dev/sdb

# Crear un pool con espejo (mirror/RAID1)
zpool create mipiscina mirror /dev/sdb /dev/sdc

# Crear un pool con RAID-Z1 (equivalente a RAID5)
zpool create mipiscina raidz /dev/sdb /dev/sdc /dev/sdd

# Crear un pool con RAID-Z2 (equivalente a RAID6)
zpool create mipiscina raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde

# Ver estado del pool
zpool status
zpool status mipiscina

# Ver estadisticas de uso
zpool list

# Agregar un dispositivo al pool
zpool add mipiscina /dev/sde

# Exportar un pool (para mover a otro sistema)
zpool export mipiscina

# Importar un pool
zpool import mipiscina

# Destruir un pool
zpool destroy mipiscina

# Verificar integridad (scrub)
zpool scrub mipiscina
```

### Datasets

Los datasets de ZFS son similares a los subvolumenes de Btrfs:

```bash
# Crear un dataset
zfs create mipiscina/datos
zfs create mipiscina/home
zfs create mipiscina/home/usuario1

# Listar datasets
zfs list

# Ver propiedades de un dataset
zfs get all mipiscina/datos

# Establecer propiedades
zfs set compression=lz4 mipiscina/datos
zfs set quota=50G mipiscina/home/usuario1
zfs set reservation=10G mipiscina/datos
zfs set mountpoint=/datos mipiscina/datos

# Eliminar un dataset
zfs destroy mipiscina/datos
```

### Instantaneas y clones en ZFS

```bash
# Crear una instantanea
zfs snapshot mipiscina/datos@backup-20240115

# Listar instantaneas
zfs list -t snapshot

# Restaurar desde una instantanea (rollback)
zfs rollback mipiscina/datos@backup-20240115

# Crear un clon (instantanea escribible)
zfs clone mipiscina/datos@backup-20240115 mipiscina/datos-clon

# Enviar/recibir (backup)
zfs send mipiscina/datos@snap1 | zfs receive backuppool/datos

# Envio incremental
zfs send -i mipiscina/datos@snap1 mipiscina/datos@snap2 | zfs receive backuppool/datos
```

> **Para el examen:** ZFS combina la gestion de volumenes y el sistema de archivos en una sola capa. Los zpools son los pools de almacenamiento (equivalentes a grupos de volumenes) y los datasets son los sistemas de archivos individuales. Las instantaneas usan la sintaxis `dataset@nombre`.

## tmpfs - Sistema de archivos en memoria

### Descripcion

tmpfs es un sistema de archivos que almacena todos los datos en la memoria RAM (y opcionalmente en swap). Los datos se pierden al reiniciar el sistema.

**Ventajas:**
- Velocidad extrema (lectura/escritura en RAM)
- Tamano dinamico (solo usa la memoria necesaria)
- Ideal para datos temporales

**Usos comunes:**
- `/tmp` - Archivos temporales
- `/run` - Datos de tiempo de ejecucion
- `/dev/shm` - Memoria compartida POSIX

```bash
# Montar tmpfs manualmente
mount -t tmpfs -o size=2G tmpfs /tmp

# En /etc/fstab
tmpfs  /tmp      tmpfs  defaults,noatime,size=2G       0  0
tmpfs  /dev/shm  tmpfs  defaults,noexec,nodev,size=4G  0  0

# Verificar uso
df -h /tmp
```

| Opcion | Funcion |
|---|---|
| `size=2G` | Tamano maximo (puede usar sufijos K, M, G) |
| `nr_inodes=1000000` | Numero maximo de inodos |
| `mode=1777` | Permisos del directorio |
| `uid=1000` | Propietario |
| `gid=1000` | Grupo propietario |

> **Para el examen:** tmpfs no tiene un tamano fijo asignado; crece y se reduce dinamicamente segun el uso. El parametro `size=` define el tamano **maximo**, no una asignacion fija de RAM. Por defecto, si no se especifica tamano, usa la mitad de la RAM.

## Comparativa ext4 vs XFS

| Caracteristica | ext4 | XFS |
|---|---|---|
| Tamano maximo FS | 1 EiB | 8 EiB |
| Tamano maximo archivo | 16 TiB | 8 EiB |
| Redimensionar (expandir) | Si, en linea y offline | Si, solo en linea |
| Redimensionar (reducir) | Si, solo offline | No soportado |
| Journal | Si | Si |
| Desfragmentacion en linea | Si (`e4defrag`) | Si (`xfs_fsr`) |
| Herramienta reparacion | `e2fsck` | `xfs_repair` |
| Herramienta informacion | `dumpe2fs` | `xfs_info` |
| Herramienta parametros | `tune2fs` | `xfs_admin` |
| Bloques reservados | Si (por defecto 5%) | No |
| Rendimiento archivos grandes | Bueno | Excelente |
| Rendimiento muchos archivos | Bueno | Bueno |
| Uso recomendado | General, servidores | Archivos grandes, alto rendimiento |
| Distribucion por defecto | Debian/Ubuntu | RHEL/CentOS/Fedora |

## Cifrado de sistemas de archivos

### LUKS y dm-crypt

LUKS (Linux Unified Key Setup) es el estandar de cifrado de disco en Linux. Funciona sobre dm-crypt, que es la capa de cifrado del device mapper del kernel.

**Arquitectura:**
```
Aplicacion -> Sistema de archivos -> dm-crypt (cifrado) -> Disco fisico
```

#### Configuracion de LUKS

```bash
# Crear un volumen cifrado LUKS
cryptsetup luksFormat /dev/sdb1

# Abrir (desbloquear) el volumen
cryptsetup luksOpen /dev/sdb1 datos_cifrados
# O en sintaxis moderna:
cryptsetup open --type luks /dev/sdb1 datos_cifrados

# El dispositivo descifrado aparece en /dev/mapper/datos_cifrados

# Crear un sistema de archivos en el volumen descifrado
mkfs.ext4 /dev/mapper/datos_cifrados

# Montar
mount /dev/mapper/datos_cifrados /mnt/cifrado

# Desmontar y cerrar
umount /mnt/cifrado
cryptsetup luksClose datos_cifrados
# O en sintaxis moderna:
cryptsetup close datos_cifrados
```

#### Gestion de claves LUKS

LUKS soporta hasta 8 slots de clave (0-7), permitiendo multiples contraseñas:

```bash
# Ver informacion del volumen LUKS
cryptsetup luksDump /dev/sdb1

# Agregar una clave adicional
cryptsetup luksAddKey /dev/sdb1

# Eliminar una clave
cryptsetup luksRemoveKey /dev/sdb1

# Eliminar una clave por slot
cryptsetup luksKillSlot /dev/sdb1 1

# Cambiar una clave
cryptsetup luksChangeKey /dev/sdb1
```

#### Montaje automatico con /etc/crypttab

```bash
# /etc/crypttab
# <nombre>        <dispositivo>                                    <clave>    <opciones>
datos_cifrados     UUID=xxxx-xxxx-xxxx-xxxx                        none       luks
datos_auto         UUID=yyyy-yyyy-yyyy-yyyy                        /etc/keys/keyfile  luks

# Luego en /etc/fstab
/dev/mapper/datos_cifrados  /mnt/cifrado  ext4  defaults  0  2
```

> **Para el examen:** LUKS cifra una particion completa a nivel de bloque. El archivo `/etc/crypttab` define los volumenes cifrados que se abren al arrancar. `none` como clave significa que se pedira la contraseña interactivamente. Se pueden usar archivos de clave para montaje automatico.

### EncFS y eCryptfs - Cifrado a nivel de archivo

A diferencia de LUKS que cifra a nivel de bloque, EncFS y eCryptfs cifran archivos individuales.

#### eCryptfs

eCryptfs funciona como una capa sobre el sistema de archivos existente:

```bash
# Montar un directorio cifrado con eCryptfs
mount -t ecryptfs /datos/cifrado /datos/cifrado

# Se solicitaran opciones de cifrado interactivamente:
# - Algoritmo (aes, blowfish, twofish, etc.)
# - Tamano de clave
# - Passthrough en texto plano
# - Cifrado de nombres de archivo
```

**Caracteristicas de eCryptfs:**
- Cifrado por archivo (no por particion)
- Los archivos cifrados son accesibles individualmente
- Usado por Ubuntu para cifrado del directorio home
- Integrado en el kernel de Linux

#### EncFS

EncFS funciona en espacio de usuario (FUSE):

```bash
# Crear/montar un directorio cifrado
encfs /ruta/almacenamiento_cifrado /ruta/punto_montaje

# Desmontar
fusermount -u /ruta/punto_montaje
```

**Comparativa de cifrado:**

| Caracteristica | LUKS/dm-crypt | eCryptfs | EncFS |
|---|---|---|---|
| Nivel | Bloque (particion) | Archivo (kernel) | Archivo (FUSE) |
| Rendimiento | Alto | Medio | Bajo |
| Cifra nombres archivo | Si (todo el bloque) | Opcional | Opcional |
| Cifra metadatos | Si | Parcial | No |
| Tamano visible | Fijo (particion) | Variable | Variable |
| Requiere particion | Si | No | No |
| Backup incremental | Dificil | Facil | Facil |

> **Para el examen:** LUKS/dm-crypt cifra a nivel de bloque (particion completa), eCryptfs cifra a nivel de archivo dentro del kernel, y EncFS cifra a nivel de archivo en espacio de usuario (FUSE). LUKS es mas seguro pero menos flexible para backups; eCryptfs/EncFS permiten backups incrementales de archivos individuales.

## Resumen de archivos y comandos clave

| Recurso | Funcion |
|---|---|
| `/etc/crypttab` | Definicion de volumenes cifrados LUKS |
| `/dev/mapper/` | Dispositivos descifrados por dm-crypt |
| `btrfs subvolume` | Gestion de subvolumenes Btrfs |
| `zpool` | Gestion de pools ZFS |
| `zfs` | Gestion de datasets y snapshots ZFS |
| `cryptsetup` | Herramienta de gestion de LUKS/dm-crypt |
| `mount -t tmpfs` | Montar sistemas de archivos en RAM |
