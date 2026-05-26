---
title: "202.2 - Recuperacion del sistema"
tags: [lpic-2, examen-201, tema-202, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.2"
---

# 202.2 - Comandos clave: Recuperacion del sistema

## Comandos de recuperacion y arranque

| Comando | Funcion | Ejemplo |
|---|---|---|
| `mount -o remount,rw /` | Remontar raiz en lectura/escritura | `mount -o remount,rw /` |
| `mount -o remount,ro /` | Remontar raiz en solo lectura | `mount -o remount,ro /` |
| `mount --bind` | Montar un directorio sobre otro | `mount --bind /dev /mnt/dev` |
| `chroot` | Cambiar directorio raiz del proceso | `chroot /mnt /bin/bash` |
| `sync` | Forzar escritura de buffers a disco | `sync` |
| `exec /sbin/init` | Reemplazar shell por init (arrancar) | `exec /sbin/init` |

## Comandos de reparacion de sistemas de archivos

| Comando | Funcion | Ejemplo |
|---|---|---|
| `fsck` | Comprobar/reparar sistema de archivos | `fsck /dev/sda2` |
| `fsck -y` | Reparar automaticamente sin preguntar | `fsck -y /dev/sda2` |
| `fsck -n` | Solo verificar, no reparar | `fsck -n /dev/sda2` |
| `e2fsck` | fsck especifico para ext2/3/4 | `e2fsck -f /dev/sda2` |
| `xfs_repair` | Reparar sistema de archivos XFS | `xfs_repair /dev/sda3` |
| `touch /forcefsck` | Forzar fsck en el proximo arranque | `touch /forcefsck` |

## Comandos de identificacion de discos

| Comando | Funcion | Ejemplo |
|---|---|---|
| `blkid` | Mostrar UUID y tipo de particiones | `blkid` |
| `lsblk` | Listar dispositivos de bloque | `lsblk -f` |
| `fdisk -l` | Listar tablas de particiones | `fdisk -l /dev/sda` |

## Comandos de GRUB para recuperacion

| Comando | Funcion | Ejemplo |
|---|---|---|
| `grub-install` | Instalar/reinstalar GRUB en disco | `grub-install /dev/sda` |
| `grub-mkconfig -o` | Regenerar configuracion de GRUB | `grub-mkconfig -o /boot/grub/grub.cfg` |

## Comandos dd para backup/restauracion

| Comando | Funcion | Ejemplo |
|---|---|---|
| `dd if= of= bs= count=` | Copiar bloques de datos | `dd if=/dev/sda of=mbr.img bs=512 count=1` |
| `dd` (backup MBR completo) | Respaldar 512 bytes del MBR | `dd if=/dev/sda of=mbr.img bs=512 count=1` |
| `dd` (solo bootloader) | Respaldar 446 bytes del bootloader | `dd if=/dev/sda of=boot.img bs=446 count=1` |
| `dd` (restaurar bootloader) | Restaurar sin tocar tabla particiones | `dd if=boot.img of=/dev/sda bs=446 count=1` |
| `dd` (imagen disco) | Crear imagen completa de disco | `dd if=/dev/sda of=disk.img bs=4M status=progress` |
| `dd` (imagen comprimida) | Crear imagen comprimida | `dd if=/dev/sda bs=4M \| gzip > disk.img.gz` |

## Estructura del MBR

| Seccion | Tamano (bytes) | Offset |
|---|---|---|
| Codigo bootloader | 446 | 0-445 |
| Tabla de particiones | 64 | 446-509 |
| Firma de arranque (0x55AA) | 2 | 510-511 |
| **Total MBR** | **512** | **0-511** |

## Parametros del kernel para recuperacion

| Parametro | Funcion |
|---|---|
| `init=/bin/bash` | Reemplaza init por shell bash |
| `init=/bin/sh` | Reemplaza init por shell sh |
| `single` o `1` | Modo usuario unico SysV |
| `systemd.unit=rescue.target` | Modo rescate systemd |
| `systemd.unit=emergency.target` | Modo emergencia systemd |
| `rd.break` | Interrumpe en initramfs |
| `fsck.mode=force` | Fuerza fsck al arrancar |

## Procedimiento chroot completo (referencia rapida)

```bash
mount /dev/sda2 /mnt              # Montar raiz
mount /dev/sda1 /mnt/boot         # Montar boot
mount --bind /dev /mnt/dev        # Sistemas virtuales
mount --bind /dev/pts /mnt/dev/pts
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys
mount --bind /run /mnt/run
chroot /mnt /bin/bash             # Entrar al chroot
# ... realizar reparaciones ...
exit                               # Salir
umount -R /mnt                    # Desmontar todo recursivamente
reboot                            # Reiniciar
```

## Archivos importantes en recuperacion

| Archivo | Funcion |
|---|---|
| `/etc/fstab` | Definicion de montajes automaticos |
| `/boot/grub/grub.cfg` | Configuracion de GRUB generada |
| `/etc/default/grub` | Parametros de configuracion de GRUB |
| `/proc/sysrq-trigger` | Interfaz SysRq para reinicio forzado |
| `/forcefsck` | Indicador para forzar fsck al arranque |
