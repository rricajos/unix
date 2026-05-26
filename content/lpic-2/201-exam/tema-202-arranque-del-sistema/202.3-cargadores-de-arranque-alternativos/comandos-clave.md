---
title: "202.3 - Cargadores de arranque alternativos"
tags: [lpic-2, examen-201, tema-202, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.3"
---

# 202.3 - Comandos clave: Cargadores de arranque alternativos

## Comandos de SYSLINUX/ISOLINUX/PXELINUX

| Comando | Funcion | Ejemplo |
|---|---|---|
| `syslinux --install` | Instalar SYSLINUX en particion FAT | `syslinux --install /dev/sdb1` |
| `mkisofs` / `genisoimage` | Crear ISO arrancable con ISOLINUX | `mkisofs -o boot.iso -b isolinux/isolinux.bin -no-emul-boot ./root/` |
| `isohybrid` | Hacer ISO arrancable por USB | `isohybrid boot.iso` |

## Comandos de systemd-boot (bootctl)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `bootctl install` | Instalar systemd-boot en la ESP | `bootctl install` |
| `bootctl update` | Actualizar systemd-boot | `bootctl update` |
| `bootctl status` | Mostrar estado del cargador | `bootctl status` |
| `bootctl list` | Listar entradas de arranque | `bootctl list` |
| `bootctl remove` | Eliminar systemd-boot | `bootctl remove` |

## Comandos de efibootmgr

| Comando | Funcion | Ejemplo |
|---|---|---|
| `efibootmgr -v` | Ver entradas UEFI detalladas | `efibootmgr -v` |
| `efibootmgr -c` | Crear nueva entrada de arranque | `efibootmgr -c -d /dev/sda -p 1 -L "Linux" -l "\EFI\BOOT\bootx64.efi"` |
| `efibootmgr -o` | Cambiar orden de arranque | `efibootmgr -o 0001,0002,0003` |
| `efibootmgr -n` | Establecer proximo arranque unico | `efibootmgr -n 0002` |
| `efibootmgr -b N -B` | Eliminar una entrada | `efibootmgr -b 0004 -B` |
| `efibootmgr -b N -a` | Activar entrada | `efibootmgr -b 0003 -a` |
| `efibootmgr -b N -A` | Desactivar entrada | `efibootmgr -b 0003 -A` |

## Comandos de Secure Boot

| Comando | Funcion | Ejemplo |
|---|---|---|
| `mokutil --sb-state` | Ver estado de Secure Boot | `mokutil --sb-state` |
| `mokutil --list-enrolled` | Listar claves MOK enrolladas | `mokutil --list-enrolled` |
| `mokutil --import` | Importar clave MOK | `mokutil --import clave.der` |

## Archivos de configuracion importantes

| Archivo | Cargador | Funcion |
|---|---|---|
| `syslinux.cfg` | SYSLINUX | Configuracion de arranque (FAT) |
| `isolinux.cfg` | ISOLINUX | Configuracion de arranque (CD/DVD) |
| `isolinux.bin` | ISOLINUX | Binario del cargador (CD/DVD) |
| `pxelinux.0` | PXELINUX | Binario del cargador (red) |
| `pxelinux.cfg/default` | PXELINUX | Configuracion por defecto (red) |
| `pxelinux.cfg/01-<MAC>` | PXELINUX | Configuracion por MAC |
| `/boot/loader/loader.conf` | systemd-boot | Configuracion principal |
| `/boot/loader/entries/*.conf` | systemd-boot | Entradas de arranque individuales |
| `/boot/boot.scr` | U-Boot | Script de arranque compilado |
| `/boot/uEnv.txt` | U-Boot | Variables de entorno texto plano |

## Directivas de configuracion SYSLINUX

| Directiva | Funcion |
|---|---|
| `DEFAULT <label>` | Entrada de arranque por defecto |
| `PROMPT 0/1` | Mostrar/ocultar prompt |
| `TIMEOUT <decimas>` | Tiempo de espera (decimas de segundo) |
| `LABEL <nombre>` | Define una entrada de arranque |
| `KERNEL <ruta>` | Ruta al kernel |
| `APPEND <params>` | Parametros del kernel |
| `INITRD <ruta>` | Ruta al initramfs |
| `DISPLAY <archivo>` | Texto a mostrar en pantalla |
| `MENU TITLE <titulo>` | Titulo del menu grafico |

## Orden de busqueda de configuracion PXELINUX

| Prioridad | Busqueda | Ejemplo |
|---|---|---|
| 1 | MAC con prefijo 01- | `pxelinux.cfg/01-aa-bb-cc-dd-ee-ff` |
| 2 | IP en hexadecimal (completa) | `pxelinux.cfg/C0A80164` |
| 3 | IP hex (quitando ultimo digito) | `pxelinux.cfg/C0A8016` |
| 4 | Continua reduciendo... | `pxelinux.cfg/C0A801` ... |
| 5 | Archivo por defecto | `pxelinux.cfg/default` |

## Comparativa rapida de cargadores

| Cargador | Medio | Firmware | Uso principal |
|---|---|---|---|
| SYSLINUX | FAT (USB) | BIOS | Medios extraibles |
| ISOLINUX | ISO 9660 (CD/DVD) | BIOS | Live CDs, instaladores |
| PXELINUX | Red (PXE/TFTP) | BIOS | Arranque por red |
| systemd-boot | ESP (FAT32) | UEFI | Escritorio/servidor UEFI |
| U-Boot | Varios | Embebido | ARM, IoT, embebidos |
| GRUB 2 | Multiples | BIOS/UEFI | Uso general |
