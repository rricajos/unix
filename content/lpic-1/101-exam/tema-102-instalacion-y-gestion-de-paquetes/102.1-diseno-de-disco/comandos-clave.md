---
title: "102.1 - Diseno de disco duro: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.1"
---

# 102.1 - Diseno de disco duro: Comandos clave

## Herramientas de particionado

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `fdisk <disco>` | Particionar disco (MBR/GPT) | `fdisk /dev/sda` |
| `fdisk -l` | Listar particiones de todos los discos | `fdisk -l` |
| `fdisk -l <disco>` | Listar particiones de un disco | `fdisk -l /dev/sda` |
| `gdisk <disco>` | Particionar disco GPT | `gdisk /dev/sda` |
| `gdisk -l <disco>` | Listar particiones GPT | `gdisk -l /dev/sda` |
| `parted <disco>` | Herramienta avanzada MBR/GPT | `parted /dev/sda` |
| `parted <disco> print` | Mostrar tabla de particiones | `parted /dev/sda print` |

## Comandos interactivos de fdisk/gdisk

| Tecla | Accion |
|-------|--------|
| `m` | Mostrar ayuda |
| `p` | Imprimir tabla de particiones |
| `n` | Crear nueva particion |
| `d` | Eliminar particion |
| `t` | Cambiar tipo de particion |
| `l` | Listar tipos de particion |
| `w` | Escribir cambios y salir |
| `q` | Salir sin guardar |

## Swap

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `mkswap <particion>` | Formatear como swap | `mkswap /dev/sda3` |
| `swapon <particion>` | Activar swap | `swapon /dev/sda3` |
| `swapoff <particion>` | Desactivar swap | `swapoff /dev/sda3` |
| `swapon --show` | Mostrar swaps activos | `swapon --show` |
| `swapon -s` | Resumen de swap | `swapon -s` |
| `free -h` | Ver memoria RAM y swap | `free -h` |

## Crear archivo de swap

```bash
fallocate -l 2G /swapfile      # Crear archivo de 2 GB
chmod 600 /swapfile             # Permisos restrictivos
mkswap /swapfile                # Formatear como swap
swapon /swapfile                # Activar
```

## LVM - Volumenes fisicos (PV)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `pvcreate <part>` | Crear volumen fisico | `pvcreate /dev/sdb1` |
| `pvdisplay` | Info detallada de PVs | `pvdisplay` |
| `pvs` | Listado resumido de PVs | `pvs` |
| `pvremove <part>` | Eliminar volumen fisico | `pvremove /dev/sdb1` |

## LVM - Grupos de volumenes (VG)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `vgcreate <nombre> <PVs>` | Crear grupo de volumenes | `vgcreate vg01 /dev/sdb1 /dev/sdc1` |
| `vgdisplay` | Info detallada de VGs | `vgdisplay` |
| `vgs` | Listado resumido de VGs | `vgs` |
| `vgextend <VG> <PV>` | Anadir PV a un VG | `vgextend vg01 /dev/sdd1` |
| `vgreduce <VG> <PV>` | Quitar PV de un VG | `vgreduce vg01 /dev/sdc1` |
| `vgremove <VG>` | Eliminar grupo de volumenes | `vgremove vg01` |

## LVM - Volumenes logicos (LV)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `lvcreate -n <nombre> -L <tam> <VG>` | Crear LV con tamano fijo | `lvcreate -n lv_home -L 50G vg01` |
| `lvcreate -n <nombre> -l 100%FREE <VG>` | Crear LV con todo el espacio libre | `lvcreate -n lv_data -l 100%FREE vg01` |
| `lvdisplay` | Info detallada de LVs | `lvdisplay` |
| `lvs` | Listado resumido de LVs | `lvs` |
| `lvextend -L +10G <LV>` | Ampliar LV en 10 GB | `lvextend -L +10G /dev/vg01/lv_home` |
| `lvreduce -L -5G <LV>` | Reducir LV en 5 GB | `lvreduce -L -5G /dev/vg01/lv_home` |
| `lvremove <LV>` | Eliminar volumen logico | `lvremove /dev/vg01/lv_home` |

## /etc/fstab - Formato

```
<dispositivo>  <punto_montaje>  <tipo_fs>  <opciones>  <dump>  <pass>
```

| Campo | Valores comunes |
|-------|----------------|
| dispositivo | UUID=xxx, /dev/sdX, LABEL=xxx, /dev/vg/lv |
| punto_montaje | /, /home, /var, /boot, none (swap) |
| tipo_fs | ext4, xfs, btrfs, vfat, swap, tmpfs |
| opciones | defaults, noexec, nosuid, nodev, ro, rw |
| dump | 0 (no backup), 1 (backup con dump) |
| pass | 0 (no verificar), 1 (raiz), 2 (otras) |

## Identificacion de discos

| Comando | Descripcion |
|---------|-------------|
| `lsblk` | Listar dispositivos de bloque en arbol |
| `blkid` | Mostrar UUID y tipo de FS de particiones |
| `lsblk -f` | Listar con info de sistema de archivos |

## Tamanos recomendados de particiones

| Particion | Tamano recomendado | Notas |
|-----------|-------------------|-------|
| `/boot` | 500 MB - 1 GB | Kernels e initramfs |
| ESP (`/boot/efi`) | 100 - 550 MB | Solo UEFI, FAT32 |
| `/` | 15 - 30 GB | Si se separan otras particiones |
| `/home` | Variable | Depende de usuarios |
| `/var` | 5 - 20 GB | Mas en servidores |
| `/tmp` | 1 - 5 GB | O usar tmpfs |
| swap | Ver reglas | Depende de RAM e hibernacion |
