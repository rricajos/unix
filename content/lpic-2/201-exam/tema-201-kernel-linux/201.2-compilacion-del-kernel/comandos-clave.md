---
title: "201.2 - Compilacion del kernel"
tags: [lpic-2, examen-201, tema-201, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.2"
---

# 201.2 - Comandos clave: Compilacion del kernel

## Comandos de configuracion

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `make menuconfig` | Configuracion interactiva con ncurses (TUI) | `make menuconfig` |
| `make xconfig` | Configuracion grafica con Qt | `make xconfig` |
| `make gconfig` | Configuracion grafica con GTK | `make gconfig` |
| `make nconfig` | Configuracion TUI mejorada | `make nconfig` |
| `make config` | Configuracion pregunta a pregunta | `make config` |
| `make oldconfig` | Actualizar .config preguntando solo opciones nuevas | `make oldconfig` |
| `make olddefconfig` | Actualizar .config con defaults para opciones nuevas | `make olddefconfig` |
| `make defconfig` | Crear configuracion por defecto | `make defconfig` |
| `make allmodconfig` | Todo como modulo donde sea posible | `make allmodconfig` |

## Comandos de compilacion e instalacion

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `make bzImage` | Compilar imagen del kernel comprimida | `make bzImage -j4` |
| `make modules` | Compilar modulos del kernel | `make modules -j$(nproc)` |
| `make modules_install` | Instalar modulos en `/lib/modules/<ver>/` | `make modules_install` |
| `make install` | Instalar kernel en `/boot/` | `make install` |
| `make all` | Compilar kernel + modulos | `make all -j$(nproc)` |
| `make` | Equivalente a `make all` | `make -j4` |

## Comandos de limpieza

| Comando | Que elimina | Conserva .config |
|---------|-------------|-----------------|
| `make clean` | Archivos objeto y compilacion | Si |
| `make mrproper` | Todo incluyendo .config y backups | No |
| `make distclean` | mrproper + archivos de editor y parches | No |

## Herramientas de initramfs/initrd

| Comando | Distribucion | Ejemplo |
|---------|-------------|---------|
| `mkinitramfs` | Debian/Ubuntu | `mkinitramfs -o /boot/initrd.img-5.15.60 5.15.60` |
| `update-initramfs` | Debian/Ubuntu | `update-initramfs -u -k 5.15.60` |
| `mkinitrd` | Legacy (RHEL antiguo) | `mkinitrd /boot/initrd-5.15.60.img 5.15.60` |
| `dracut` | Red Hat/Fedora/SUSE | `dracut /boot/initramfs-5.15.60.img 5.15.60` |
| `lsinitrd` | Red Hat/Fedora | `lsinitrd /boot/initramfs-5.15.60.img` |
| `lsinitramfs` | Debian/Ubuntu | `lsinitramfs /boot/initrd.img-5.15.60` |

## Comandos DKMS

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `dkms add` | Registrar modulo en DKMS | `dkms add -m driver -v 1.0` |
| `dkms build` | Compilar modulo para un kernel | `dkms build -m driver -v 1.0 -k 5.15.60` |
| `dkms install` | Instalar modulo compilado | `dkms install -m driver -v 1.0 -k 5.15.60` |
| `dkms remove` | Eliminar modulo de DKMS | `dkms remove -m driver -v 1.0 --all` |
| `dkms status` | Ver estado de modulos DKMS | `dkms status` |

## Archivos y directorios importantes

| Ruta | Funcion |
|------|---------|
| `/usr/src/linux/` | Codigo fuente del kernel (enlace simbolico) |
| `/usr/src/linux/.config` | Configuracion de compilacion |
| `/usr/src/linux/Makefile` | Reglas de compilacion y version |
| `/usr/src/linux/arch/x86/boot/bzImage` | Imagen compilada (x86) |
| `/boot/vmlinuz-<version>` | Kernel instalado |
| `/boot/config-<version>` | Configuracion del kernel instalado |
| `/boot/System.map-<version>` | Tabla de simbolos |
| `/boot/initrd.img-<version>` | Imagen initramfs |
| `/lib/modules/<version>/` | Modulos instalados |
| `/usr/src/linux-headers-<version>/` | Headers para modulos externos |
| `/lib/modules/<version>/build` | Enlace a headers/fuente |
| `/usr/src/<modulo>-<version>/dkms.conf` | Configuracion DKMS del modulo |

## Secuencia completa de compilacion

| Paso | Comando | Descripcion |
|------|---------|-------------|
| 1 | `make mrproper` | Limpieza total (solo si necesario) |
| 2 | `cp /boot/config-$(uname -r) .config` | Copiar config existente |
| 3 | `make oldconfig` | Actualizar config para nuevo kernel |
| 4 | `make menuconfig` | Ajustar opciones si es necesario |
| 5 | `make -j$(nproc)` | Compilar kernel y modulos |
| 6 | `make modules_install` | Instalar modulos |
| 7 | `make install` | Instalar kernel |
| 8 | `dracut` / `mkinitramfs` | Generar initramfs |
| 9 | `update-grub` / `grub2-mkconfig` | Actualizar bootloader |
