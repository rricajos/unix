---
title: "203.3 - Opciones de sistemas de archivos"
tags: [lpic-2, examen-201, tema-203, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.3"
---

# 203.3 - Comandos clave: Opciones de sistemas de archivos

## Comandos Btrfs

| Comando | Funcion | Ejemplo |
|---|---|---|
| `btrfs subvolume create` | Crear subvolumen | `btrfs subvolume create /mnt/btrfs/datos` |
| `btrfs subvolume list` | Listar subvolumenes | `btrfs subvolume list /mnt/btrfs` |
| `btrfs subvolume delete` | Eliminar subvolumen | `btrfs subvolume delete /mnt/btrfs/datos` |
| `btrfs subvolume show` | Info de subvolumen | `btrfs subvolume show /mnt/btrfs/datos` |
| `btrfs subvolume snapshot` | Crear instantanea | `btrfs subvolume snapshot /src /dest` |
| `btrfs subvolume snapshot -r` | Instantanea solo lectura | `btrfs subvolume snapshot -r /src /dest` |
| `btrfs filesystem show` | Info del sistema de archivos | `btrfs filesystem show` |
| `btrfs filesystem df` | Uso del espacio | `btrfs filesystem df /mnt/btrfs` |
| `btrfs filesystem usage` | Uso detallado | `btrfs filesystem usage /mnt/btrfs` |
| `btrfs filesystem resize` | Redimensionar | `btrfs filesystem resize +10G /mnt` |
| `btrfs device add` | Agregar dispositivo | `btrfs device add /dev/sdc1 /mnt/btrfs` |
| `btrfs device remove` | Quitar dispositivo | `btrfs device remove /dev/sdc1 /mnt/btrfs` |
| `btrfs scrub start` | Verificar integridad | `btrfs scrub start /mnt/btrfs` |
| `btrfs balance start` | Rebalancear datos | `btrfs balance start /mnt/btrfs` |
| `btrfs send` | Enviar instantanea | `btrfs send /mnt/snap \| btrfs receive /backup/` |

## Comandos ZFS

| Comando | Funcion | Ejemplo |
|---|---|---|
| `zpool create` | Crear pool | `zpool create mipiscina /dev/sdb` |
| `zpool create mirror` | Crear pool con espejo | `zpool create pool mirror /dev/sdb /dev/sdc` |
| `zpool create raidz` | Crear pool RAID-Z1 | `zpool create pool raidz /dev/sdb /dev/sdc /dev/sdd` |
| `zpool status` | Estado del pool | `zpool status` |
| `zpool list` | Listar pools | `zpool list` |
| `zpool destroy` | Destruir pool | `zpool destroy mipiscina` |
| `zpool export` | Exportar pool | `zpool export mipiscina` |
| `zpool import` | Importar pool | `zpool import mipiscina` |
| `zpool scrub` | Verificar integridad | `zpool scrub mipiscina` |
| `zfs create` | Crear dataset | `zfs create mipiscina/datos` |
| `zfs list` | Listar datasets | `zfs list` |
| `zfs destroy` | Destruir dataset | `zfs destroy mipiscina/datos` |
| `zfs set` | Establecer propiedad | `zfs set compression=lz4 pool/datos` |
| `zfs get` | Ver propiedades | `zfs get all pool/datos` |
| `zfs snapshot` | Crear instantanea | `zfs snapshot pool/datos@snap1` |
| `zfs rollback` | Restaurar instantanea | `zfs rollback pool/datos@snap1` |
| `zfs clone` | Clonar instantanea | `zfs clone pool/datos@snap1 pool/clon` |
| `zfs send` | Enviar instantanea | `zfs send pool/datos@snap1 \| zfs receive backup/datos` |

## Comandos LUKS/dm-crypt

| Comando | Funcion | Ejemplo |
|---|---|---|
| `cryptsetup luksFormat` | Crear volumen LUKS | `cryptsetup luksFormat /dev/sdb1` |
| `cryptsetup luksOpen` | Abrir/desbloquear volumen | `cryptsetup luksOpen /dev/sdb1 cifrado` |
| `cryptsetup luksClose` | Cerrar volumen | `cryptsetup luksClose cifrado` |
| `cryptsetup luksDump` | Info del volumen LUKS | `cryptsetup luksDump /dev/sdb1` |
| `cryptsetup luksAddKey` | Agregar clave | `cryptsetup luksAddKey /dev/sdb1` |
| `cryptsetup luksRemoveKey` | Eliminar clave | `cryptsetup luksRemoveKey /dev/sdb1` |
| `cryptsetup luksKillSlot` | Eliminar clave por slot | `cryptsetup luksKillSlot /dev/sdb1 1` |
| `cryptsetup luksChangeKey` | Cambiar clave | `cryptsetup luksChangeKey /dev/sdb1` |

## Comandos de cifrado a nivel de archivo

| Comando | Funcion | Ejemplo |
|---|---|---|
| `mount -t ecryptfs` | Montar directorio con eCryptfs | `mount -t ecryptfs /cifrado /cifrado` |
| `encfs` | Crear/montar directorio EncFS | `encfs /almacen_cifrado /punto_montaje` |
| `fusermount -u` | Desmontar EncFS | `fusermount -u /punto_montaje` |

## Opciones de montaje Btrfs para compresion

| Opcion | Algoritmo | Caracteristica |
|---|---|---|
| `compress=lzo` | LZO | Rapido, baja compresion |
| `compress=zlib` | zlib | Lento, alta compresion |
| `compress=zstd` | Zstandard | Equilibrio velocidad/ratio |
| `compress=zstd:N` | Zstandard nivel N | Nivel 1-15 |
| `compress-force=X` | Forzar algoritmo X | Comprime incluso datos ya comprimidos |

## Archivos de configuracion clave

| Archivo | Funcion |
|---|---|
| `/etc/crypttab` | Volumenes cifrados LUKS para abrir al arranque |
| `/dev/mapper/` | Dispositivos descifrados |
| `/etc/fstab` | Montaje de tmpfs, subvolumenes Btrfs, etc. |

## Comparativa rapida: Btrfs vs ZFS

| Caracteristica | Btrfs | ZFS |
|---|---|---|
| Licencia kernel Linux | GPL (integrado) | CDDL (modulo externo) |
| Pools de almacenamiento | No (usa device add) | Si (zpools) |
| Subvolumenes/Datasets | Si | Si |
| Instantaneas | Si | Si |
| Compresion | lzo, zlib, zstd | lz4, gzip, zstd |
| RAID integrado | 0, 1, 10, 5, 6 | mirror, raidz, raidz2, raidz3 |
| Checksums | Si | Si |
| Deduplicacion | Si (offline) | Si (en linea) |
| Copy-on-write | Si | Si |
| Reparacion auto | Parcial | Si (con redundancia) |

## Comparativa ext4 vs XFS

| Aspecto | ext4 | XFS |
|---|---|---|
| Tamano max FS | 1 EiB | 8 EiB |
| Reducir FS | Si | No |
| Reparacion | `e2fsck` | `xfs_repair` |
| Parametros | `tune2fs` | `xfs_admin` |
| Info | `dumpe2fs` | `xfs_info` |
| Expandir | `resize2fs` | `xfs_growfs` |
| Bloques reservados | Si (5%) | No |
| Distro default | Debian/Ubuntu | RHEL/Fedora |
