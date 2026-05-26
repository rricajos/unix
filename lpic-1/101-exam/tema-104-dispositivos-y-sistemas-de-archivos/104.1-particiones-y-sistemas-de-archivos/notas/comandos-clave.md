# 104.1 Crear particiones y sistemas de archivos - Comandos clave

## Herramientas de particionado

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `fdisk /dev/sda` | Editar particiones MBR interactivamente | `fdisk /dev/sda` |
| `fdisk -l` | Listar todas las particiones | `fdisk -l /dev/sda` |
| `gdisk /dev/sda` | Editar particiones GPT interactivamente | `gdisk /dev/sda` |
| `gdisk -l /dev/sda` | Listar particiones GPT | `gdisk -l /dev/sda` |
| `parted /dev/sda print` | Mostrar particiones (MBR o GPT) | `parted /dev/sda print` |
| `parted /dev/sda mklabel gpt` | Crear tabla de particiones GPT | `parted /dev/sda mklabel gpt` |
| `parted /dev/sda mklabel msdos` | Crear tabla de particiones MBR | `parted /dev/sda mklabel msdos` |
| `parted /dev/sda mkpart` | Crear particion | `parted /dev/sda mkpart primary ext4 1MiB 500MiB` |
| `parted /dev/sda rm N` | Eliminar particion N | `parted /dev/sda rm 1` |

## Comandos interactivos de fdisk

| Tecla | Accion |
|-------|--------|
| `m` | Ayuda |
| `p` | Imprimir tabla |
| `n` | Nueva particion |
| `d` | Eliminar particion |
| `t` | Cambiar tipo |
| `l` | Listar tipos |
| `w` | Guardar y salir |
| `q` | Salir sin guardar |
| `a` | Toggle bootable |

## Codigos de tipo de particion MBR

| Codigo | Tipo |
|--------|------|
| `82` | Linux swap |
| `83` | Linux nativo |
| `8e` | Linux LVM |
| `fd` | Linux RAID |
| `05` | Extendida |
| `07` | NTFS |
| `0b`/`0c` | FAT32 |

## Crear sistemas de archivos

| Comando | Descripcion |
|---------|-------------|
| `mkfs.ext2 /dev/sdXN` | Crear ext2 |
| `mkfs.ext3 /dev/sdXN` | Crear ext3 |
| `mkfs.ext4 /dev/sdXN` | Crear ext4 |
| `mkfs.xfs /dev/sdXN` | Crear XFS |
| `mkfs.vfat /dev/sdXN` | Crear VFAT (FAT32) |
| `mkfs.vfat -F 32 /dev/sdXN` | Crear FAT32 explicitamente |
| `mkfs.btrfs /dev/sdXN` | Crear Btrfs |
| `mkfs.exfat /dev/sdXN` | Crear exFAT |
| `mkfs -t tipo /dev/sdXN` | Crear FS especificando tipo |

## Gestion de swap

| Comando | Descripcion |
|---------|-------------|
| `mkswap /dev/sdXN` | Formatear particion como swap |
| `mkswap /swapfile` | Formatear archivo como swap |
| `swapon /dev/sdXN` | Activar swap |
| `swapon /swapfile` | Activar archivo swap |
| `swapon --show` | Mostrar swaps activos |
| `swapon -p 10 /dev/sdXN` | Activar swap con prioridad 10 |
| `swapoff /dev/sdXN` | Desactivar swap especifico |
| `swapoff -a` | Desactivar todo el swap |
| `free -h` | Ver uso de RAM y swap |
| `cat /proc/swaps` | Ver particiones swap activas |

## Crear archivo swap paso a paso

```bash
dd if=/dev/zero of=/swapfile bs=1M count=1024
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

## Comparativa MBR vs GPT

| Caracteristica | MBR | GPT |
|---------------|-----|-----|
| Particiones primarias | 4 max | 128 (por defecto) |
| Tamano max disco | 2 TB | 9.4 ZB |
| Particiones extendidas/logicas | Si | No necesarias |
| Firmware asociado | BIOS | UEFI |
| Herramienta clasica | `fdisk` | `gdisk` |
| Redundancia tabla | No | Si (copia al final) |
| Deteccion errores | No | CRC32 |

## Comparativa de sistemas de archivos

| FS | Journal | Max archivo | Reducir | Notas |
|----|---------|-------------|---------|-------|
| ext2 | No | 2 TB | Si | Bueno para /boot |
| ext3 | Si | 2 TB | Si | ext2 + journal |
| ext4 | Si | 16 TB | Si | Default comun |
| XFS | Si | 8 EB | **No** | Default RHEL 7+ |
| Btrfs | CoW | 16 EB | Si | Snapshots, multi-dev |
| VFAT | No | 4 GB | N/A | Compatibilidad, ESP |
| exFAT | No | 16 EB | N/A | Medios extraibles |
