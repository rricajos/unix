# 104.1 Crear particiones y sistemas de archivos

## Objetivo
El candidato debe ser capaz de configurar particiones de disco y crear sistemas de archivos en medios como discos duros. Esto incluye el manejo de particiones swap.

## Peso
**2**

## Conocimientos clave
- Gestionar tablas de particiones MBR y GPT
- Usar varios comandos `mkfs` para crear distintos sistemas de archivos: ext2, ext3, ext4, XFS, VFAT, exFAT
- Conocimiento basico de Btrfs, incluyendo sistemas de archivos multi-dispositivo
- Crear, configurar y activar particiones swap

## Archivos y utilidades clave
| Recurso | Descripcion |
|---------|-------------|
| `fdisk` | Manipular tabla de particiones MBR |
| `gdisk` | Manipular tabla de particiones GPT |
| `parted` | Herramienta avanzada de particionado (MBR y GPT) |
| `mkfs` | Crear sistemas de archivos |
| `mkswap` | Crear espacio swap |
| `swapon` / `swapoff` | Activar/desactivar swap |
| `mkfs.ext2` / `mkfs.ext3` / `mkfs.ext4` | Crear FS ext |
| `mkfs.xfs` | Crear FS XFS |
| `mkfs.vfat` | Crear FS VFAT (FAT32) |
| `mkfs.btrfs` | Crear FS Btrfs |

## Contenido

| Seccion | Recurso | Estado |
|---------|---------|--------|
| Teoria completa | [notas/teoria.md](notas/teoria.md) | Completado |
| Comandos clave | [notas/comandos-clave.md](notas/comandos-clave.md) | Completado |
| Ejercicios | [ejercicios/ejercicios.md](ejercicios/ejercicios.md) | Completado |
