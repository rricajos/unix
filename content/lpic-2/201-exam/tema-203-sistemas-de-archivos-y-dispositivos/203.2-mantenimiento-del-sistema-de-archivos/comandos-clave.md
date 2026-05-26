---
title: "203.2 - Mantenimiento del sistema de archivos"
tags: [lpic-2, examen-201, tema-203, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.2"
---

# 203.2 - Comandos clave: Mantenimiento del sistema de archivos

## Comandos de creacion de sistemas de archivos

| Comando | Funcion | Ejemplo |
|---|---|---|
| `mkfs.ext4` | Crear sistema de archivos ext4 | `mkfs.ext4 -L "datos" /dev/sdb1` |
| `mkfs.xfs` | Crear sistema de archivos XFS | `mkfs.xfs -L "xfs_data" /dev/sdb1` |
| `mkfs.btrfs` | Crear sistema de archivos Btrfs | `mkfs.btrfs -L "btrfs_data" /dev/sdb1` |
| `mkfs.vfat` | Crear sistema de archivos FAT32 | `mkfs.vfat -F 32 -n "USB" /dev/sdb1` |
| `mkswap` | Crear espacio de intercambio | `mkswap -L "swap" /dev/sdb2` |
| `swapon` | Activar espacio de intercambio | `swapon /dev/sdb2` |
| `swapoff` | Desactivar espacio de intercambio | `swapoff /dev/sdb2` |

## Comandos de ajuste ext2/3/4 (tune2fs)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `tune2fs -L` | Cambiar etiqueta | `tune2fs -L "datos" /dev/sda1` |
| `tune2fs -m` | Cambiar % bloques reservados | `tune2fs -m 1 /dev/sda1` |
| `tune2fs -c` | Maximo montajes antes de fsck | `tune2fs -c 30 /dev/sda1` |
| `tune2fs -c 0` | Desactivar verificacion por montajes | `tune2fs -c 0 /dev/sda1` |
| `tune2fs -i` | Intervalo de tiempo para fsck | `tune2fs -i 30d /dev/sda1` |
| `tune2fs -i 0` | Desactivar verificacion por tiempo | `tune2fs -i 0 /dev/sda1` |
| `tune2fs -j` | Agregar journal (ext2 a ext3) | `tune2fs -j /dev/sda1` |
| `tune2fs -C` | Establecer contador de montajes | `tune2fs -C 0 /dev/sda1` |
| `tune2fs -U` | Cambiar UUID | `tune2fs -U random /dev/sda1` |
| `tune2fs -O` | Habilitar/deshabilitar features | `tune2fs -O ^has_journal /dev/sda1` |

## Comandos de ajuste XFS (xfs_admin)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `xfs_admin -L` | Cambiar etiqueta | `xfs_admin -L "datos" /dev/sda1` |
| `xfs_admin -U` | Cambiar UUID | `xfs_admin -U generate /dev/sda1` |
| `xfs_admin -c` | Habilitar lazy-counter | `xfs_admin -c 1 /dev/sda1` |

## Comandos de verificacion y reparacion

| Comando | Funcion | Ejemplo |
|---|---|---|
| `fsck` | Verificar/reparar (generico) | `fsck /dev/sda2` |
| `fsck -y` | Reparar automaticamente | `fsck -y /dev/sda2` |
| `fsck -n` | Solo verificar | `fsck -n /dev/sda2` |
| `fsck -f` | Forzar verificacion | `fsck -f /dev/sda2` |
| `fsck -A` | Verificar todas (segun fstab) | `fsck -A` |
| `e2fsck` | Verificar ext2/3/4 | `e2fsck -f /dev/sda2` |
| `e2fsck -p` | Reparar errores seguros auto | `e2fsck -p /dev/sda2` |
| `e2fsck -c` | Verificar bloques defectuosos | `e2fsck -c /dev/sda2` |
| `xfs_repair` | Reparar XFS | `xfs_repair /dev/sda3` |
| `xfs_repair -n` | Solo verificar XFS | `xfs_repair -n /dev/sda3` |
| `xfs_repair -L` | Forzar limpieza de log XFS | `xfs_repair -L /dev/sda3` |

## Comandos de informacion

| Comando | Funcion | Ejemplo |
|---|---|---|
| `dumpe2fs` | Info detallada ext2/3/4 | `dumpe2fs /dev/sda1` |
| `dumpe2fs -h` | Solo superbloque ext | `dumpe2fs -h /dev/sda1` |
| `xfs_info` | Info de XFS (debe estar montado) | `xfs_info /mnt/datos` |

## Comandos de redimensionamiento

| Comando | Funcion | Ejemplo |
|---|---|---|
| `resize2fs` | Expandir ext al maximo | `resize2fs /dev/sda1` |
| `resize2fs` (tamano) | Redimensionar ext a tamano | `resize2fs /dev/sda1 50G` |
| `xfs_growfs` | Expandir XFS (debe estar montado) | `xfs_growfs /mnt/datos` |

## Comparativa de redimensionamiento

| Operacion | ext4 | XFS |
|---|---|---|
| Expandir en linea | `resize2fs /dev/sdX` | `xfs_growfs /mnt/punto` |
| Reducir | `resize2fs /dev/sdX 30G` | No soportado |
| Opera sobre | Dispositivo | Punto de montaje |
| Requiere montado | Expandir: opcional, Reducir: no | Si, obligatorio |

## Comandos SMART

| Comando | Funcion | Ejemplo |
|---|---|---|
| `smartctl -i` | Info del disco y soporte SMART | `smartctl -i /dev/sda` |
| `smartctl -s on` | Habilitar SMART | `smartctl -s on /dev/sda` |
| `smartctl -a` | Info completa SMART | `smartctl -a /dev/sda` |
| `smartctl -H` | Estado de salud rapido | `smartctl -H /dev/sda` |
| `smartctl -A` | Atributos SMART | `smartctl -A /dev/sda` |
| `smartctl -t short` | Ejecutar test corto | `smartctl -t short /dev/sda` |
| `smartctl -t long` | Ejecutar test largo | `smartctl -t long /dev/sda` |
| `smartctl -l selftest` | Ver resultados de tests | `smartctl -l selftest /dev/sda` |
| `smartctl -l error` | Ver log de errores | `smartctl -l error /dev/sda` |

## Archivos de configuracion

| Archivo | Funcion |
|---|---|
| `/etc/fstab` | Montajes automaticos (campo pass para fsck) |
| `/etc/smartd.conf` | Configuracion del demonio smartd |
| `/etc/e2fsck.conf` | Configuracion de e2fsck |
| `/forcefsck` | Indicador para forzar fsck al arranque |
