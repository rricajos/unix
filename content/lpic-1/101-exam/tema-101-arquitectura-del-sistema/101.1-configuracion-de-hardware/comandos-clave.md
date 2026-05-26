---
title: "101.1 - Comandos Clave"
tags:
  - lpic-1
  - examen-101
  - tema-101
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "101"
subtema: "101.1"
---

# 101.1 - Comandos Clave

## Referencia rapida

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `lspci` | Listar dispositivos PCI | `lspci -v` |
| `lsusb` | Listar dispositivos USB | `lsusb -t` |
| `lsmod` | Listar modulos del kernel cargados | `lsmod` |
| `modinfo` | Info de un modulo | `modinfo ext4` |
| `modprobe` | Cargar/descargar modulo (con deps) | `modprobe -r ext4` |
| `insmod` | Cargar modulo (sin deps) | `insmod /path/mod.ko` |
| `rmmod` | Descargar modulo (sin deps) | `rmmod ext4` |
| `lsblk` | Listar dispositivos de bloque | `lsblk -f` |
| `lscpu` | Info del procesador | `lscpu` |
| `udevadm` | Gestionar udev | `udevadm monitor` |

## Archivos de /proc para hardware

| Archivo | Contenido |
|---------|-----------|
| `/proc/cpuinfo` | Informacion del procesador |
| `/proc/meminfo` | Estado de la memoria |
| `/proc/interrupts` | Tabla de IRQs |
| `/proc/ioports` | Puertos de E/S asignados |
| `/proc/dma` | Canales DMA en uso |
| `/proc/modules` | Modulos cargados (equivale a lsmod) |
| `/proc/bus/pci/` | Dispositivos PCI |

## Diferencias clave

### modprobe vs insmod/rmmod

| Caracteristica | modprobe | insmod/rmmod |
|---------------|----------|--------------|
| Dependencias | Automaticas | Manual |
| Ruta del modulo | Solo nombre | Ruta completa |
| Blacklist | Respeta | Ignora |
| Uso recomendado | Siempre | Solo casos especiales |

### BIOS vs UEFI

| Caracteristica | BIOS | UEFI |
|---------------|------|------|
| Tabla de particiones | MBR | GPT |
| Tamano max disco | 2 TB | >2 TB |
| Particiones max | 4 primarias | 128 |
| Secure Boot | No | Si |
| Interfaz | Texto | Grafica |
| Particion de arranque | MBR (512 bytes) | ESP (/boot/efi) |

### /proc vs /sys

| Caracteristica | /proc | /sys |
|---------------|-------|------|
| Proposito principal | Procesos e info kernel | Dispositivos y drivers |
| Hardware info | Archivos individuales | Arbol jerarquico |
| Modificable | Algunos archivos | Muchos atributos |
| Estructura | Plana | Jerarquica por bus/clase |
