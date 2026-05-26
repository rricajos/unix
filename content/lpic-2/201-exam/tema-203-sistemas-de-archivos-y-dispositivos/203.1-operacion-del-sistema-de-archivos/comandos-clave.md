---
title: "203.1 - Operacion del sistema de archivos"
tags: [lpic-2, examen-201, tema-203, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.1"
---

# 203.1 - Comandos clave: Operacion del sistema de archivos

## Comandos de montaje

| Comando | Funcion | Ejemplo |
|---|---|---|
| `mount` | Montar sistema de archivos | `mount /dev/sdb1 /mnt/datos` |
| `mount -t` | Montar especificando tipo | `mount -t ext4 /dev/sdb1 /mnt` |
| `mount -o` | Montar con opciones | `mount -o ro,noexec /dev/sdb1 /mnt` |
| `mount -a` | Montar todo lo de fstab | `mount -a` |
| `mount --bind` | Montaje enlace (bind) | `mount --bind /var/www /home/user/web` |
| `mount -o loop` | Montar imagen de disco | `mount -o loop imagen.iso /mnt/iso` |
| `mount -o remount` | Remontar con nuevas opciones | `mount -o remount,rw /` |
| `umount` | Desmontar sistema de archivos | `umount /mnt/datos` |
| `umount -l` | Desmontaje perezoso (lazy) | `umount -l /mnt/datos` |
| `umount -f` | Forzar desmontaje | `umount -f /mnt/nfs` |
| `umount -R` | Desmontar recursivamente | `umount -R /mnt` |

## Comandos de identificacion de dispositivos

| Comando | Funcion | Ejemplo |
|---|---|---|
| `blkid` | Mostrar UUID, tipo FS, etiqueta | `blkid` |
| `blkid /dev/sda1` | Info de dispositivo especifico | `blkid /dev/sda1` |
| `blkid -U` | Buscar dispositivo por UUID | `blkid -U "a1b2-c3d4"` |
| `blkid -L` | Buscar dispositivo por etiqueta | `blkid -L "datos"` |
| `findmnt` | Mostrar montajes en arbol | `findmnt` |
| `findmnt /home` | Buscar punto de montaje | `findmnt /home` |
| `findmnt -t ext4` | Filtrar por tipo FS | `findmnt -t ext4` |
| `findmnt --fstab` | Mostrar montajes de fstab | `findmnt --fstab` |
| `lsblk` | Listar dispositivos de bloque | `lsblk` |
| `lsblk -f` | Listar con info de FS | `lsblk -f` |
| `lsblk -o` | Seleccionar columnas | `lsblk -o NAME,SIZE,FSTYPE,UUID` |

## Comandos de autofs

| Comando | Funcion | Ejemplo |
|---|---|---|
| `systemctl start autofs` | Iniciar servicio autofs | `systemctl start autofs` |
| `systemctl enable autofs` | Habilitar autofs en arranque | `systemctl enable autofs` |
| `systemctl restart autofs` | Reiniciar autofs tras cambios | `systemctl restart autofs` |
| `automount -f -v` | Ejecutar autofs en primer plano (debug) | `automount -f -v` |

## Comandos de systemd para montajes

| Comando | Funcion | Ejemplo |
|---|---|---|
| `systemctl start X.mount` | Activar unidad de montaje | `systemctl start mnt-datos.mount` |
| `systemctl enable X.mount` | Habilitar montaje en arranque | `systemctl enable mnt-datos.mount` |
| `systemctl start X.automount` | Activar automontaje | `systemctl start mnt-datos.automount` |
| `systemctl daemon-reload` | Recargar unidades tras cambios | `systemctl daemon-reload` |

## Campos de /etc/fstab

| Campo | Posicion | Descripcion | Ejemplo |
|---|---|---|---|
| Dispositivo | 1 | Identificador del dispositivo | `UUID=xxxx`, `LABEL=datos`, `/dev/sda1` |
| Punto montaje | 2 | Directorio de montaje | `/`, `/home`, `swap` |
| Tipo FS | 3 | Tipo de sistema de archivos | `ext4`, `xfs`, `swap`, `nfs` |
| Opciones | 4 | Opciones de montaje | `defaults`, `ro,noexec` |
| Dump | 5 | Backup con dump | `0` (no), `1` (si) |
| Pass | 6 | Orden de fsck | `0` (no), `1` (raiz), `2` (otros) |

## Opciones de montaje mas importantes

| Opcion | Descripcion |
|---|---|
| `defaults` | rw, suid, dev, exec, auto, nouser, async |
| `auto` / `noauto` | Montar o no con `mount -a` |
| `ro` / `rw` | Solo lectura / lectura-escritura |
| `exec` / `noexec` | Permitir/prohibir ejecucion |
| `suid` / `nosuid` | Permitir/prohibir SUID/SGID |
| `user` / `users` | Permitir montaje por usuarios |
| `noatime` | No actualizar tiempo de acceso |
| `_netdev` | Requiere red para montaje |
| `nofail` | No fallar si dispositivo ausente |
| `bind` | Montaje enlace de directorio |
| `loop` | Montar archivo como dispositivo |
| `x-systemd.automount` | Automontaje via systemd |
| `x-systemd.idle-timeout=` | Tiempo para desmontar automaticamente |

## Archivos de configuracion de autofs

| Archivo | Funcion |
|---|---|
| `/etc/auto.master` | Archivo maestro (puntos de montaje y mapas) |
| `/etc/auto.master.d/*.autofs` | Archivos de configuracion adicionales |
| `/etc/auto.misc` | Mapa para montajes miscelaneos |
| `/etc/auto.nfs` | Mapa tipico para montajes NFS |
| `/etc/auto.home` | Mapa tipico para directorios home |

## Identificacion de dispositivos - directorios utiles

| Directorio | Contenido |
|---|---|
| `/dev/disk/by-uuid/` | Enlaces simbolicos por UUID |
| `/dev/disk/by-label/` | Enlaces simbolicos por etiqueta |
| `/dev/disk/by-id/` | Enlaces simbolicos por ID hardware |
| `/dev/disk/by-path/` | Enlaces simbolicos por ruta PCI/SCSI |
