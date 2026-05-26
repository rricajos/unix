---
title: "204.1 - Configuracion de RAID"
tags: [lpic-2, examen-201, tema-204, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.1"
---

# 204.1 - Comandos clave: Configuracion de RAID

## Comandos principales de mdadm

| Comando | Funcion | Ejemplo |
|---|---|---|
| `mdadm --create` | Crear un nuevo array RAID | `mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1` |
| `mdadm --detail` | Mostrar informacion detallada del array | `mdadm --detail /dev/md0` |
| `mdadm --detail --scan` | Generar lineas de configuracion | `mdadm --detail --scan >> /etc/mdadm.conf` |
| `mdadm --examine` | Examinar superbloque de un dispositivo | `mdadm --examine /dev/sdb1` |
| `mdadm --query` | Consulta rapida sobre un dispositivo | `mdadm --query /dev/md0` |
| `mdadm --assemble` | Reensamblar un array existente | `mdadm --assemble /dev/md0 /dev/sdb1 /dev/sdc1` |
| `mdadm --assemble --scan` | Reensamblar todos los arrays | `mdadm --assemble --scan` |
| `mdadm --stop` | Detener un array | `mdadm --stop /dev/md0` |
| `mdadm --add` | Agregar un disco a un array | `mdadm --add /dev/md0 /dev/sdd1` |
| `mdadm --fail` | Marcar un disco como fallido | `mdadm --fail /dev/md0 /dev/sdb1` |
| `mdadm --remove` | Retirar un disco del array | `mdadm --remove /dev/md0 /dev/sdb1` |
| `mdadm --grow` | Expandir o modificar un array | `mdadm --grow /dev/md1 --raid-devices=4` |
| `mdadm --monitor` | Monitorizar arrays | `mdadm --monitor --scan --daemonise` |
| `mdadm --zero-superblock` | Borrar metadatos RAID de un disco | `mdadm --zero-superblock /dev/sdb1` |

## Opciones de creacion (--create)

| Opcion | Funcion | Ejemplo |
|---|---|---|
| `--level=N` | Nivel RAID (0,1,5,6,10) | `--level=5` |
| `--raid-devices=N` | Numero de discos activos | `--raid-devices=3` |
| `--spare-devices=N` | Numero de discos spare | `--spare-devices=1` |
| `--chunk=N` | Tamano de chunk en KB | `--chunk=256` |
| `--bitmap=internal` | Activar bitmap interno | `--bitmap=internal` |
| `--name=X` | Nombre del array | `--name=datos` |
| `--assume-clean` | Omitir inicializacion | `--assume-clean` |

## Archivos y rutas importantes

| Archivo/Ruta | Funcion |
|---|---|
| `/proc/mdstat` | Estado en tiempo real de todos los arrays RAID |
| `/etc/mdadm.conf` | Configuracion persistente de arrays (Debian: `/etc/mdadm/mdadm.conf`) |
| `/dev/mdX` | Dispositivos de bloque RAID (md0, md1, etc.) |
| `/sys/block/mdX/md/sync_action` | Control de verificacion/reparacion |
| `/sys/block/mdX/md/mismatch_cnt` | Contador de inconsistencias tras check |
| `/sys/block/mdX/md/degraded` | Estado degradado (0=OK, 1=degradado) |
| `/sys/block/mdX/md/array_state` | Estado del array (clean, active, etc.) |

## Comparacion de niveles RAID

| Nivel | Min. discos | Capacidad util | Tolerancia fallos | Tipo |
|---|---|---|---|---|
| RAID 0 | 2 | N | Ninguna | Striping |
| RAID 1 | 2 | 1 | N-1 | Mirroring |
| RAID 5 | 3 | N-1 | 1 disco | Paridad distribuida |
| RAID 6 | 4 | N-2 | 2 discos | Doble paridad |
| RAID 10 | 4 | N/2 | 1 por subarray | Mirror + Stripe |

## Flujo de trabajo tipico

```bash
# 1. Crear particiones tipo fd (Linux RAID) en cada disco
fdisk /dev/sdb   # Tipo: fd

# 2. Crear el array
mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1

# 3. Verificar construccion
watch cat /proc/mdstat

# 4. Crear sistema de archivos
mkfs.ext4 /dev/md0

# 5. Montar
mount /dev/md0 /mnt/raid

# 6. Guardar configuracion
mdadm --detail --scan >> /etc/mdadm.conf

# 7. Actualizar initramfs
update-initramfs -u   # Debian
dracut -f             # RHEL
```

## Procedimiento de recuperacion ante fallo

```bash
# 1. Identificar disco fallido
cat /proc/mdstat            # Buscar [U_] o [_U]
mdadm --detail /dev/md0     # Ver disco con estado "faulty"

# 2. Retirar disco fallido
mdadm --fail /dev/md0 /dev/sdb1
mdadm --remove /dev/md0 /dev/sdb1

# 3. Reemplazar fisicamente el disco y particionar
fdisk /dev/sdX              # Crear particion tipo fd

# 4. Agregar nuevo disco
mdadm --add /dev/md0 /dev/sdX1

# 5. Monitorizar reconstruccion
watch cat /proc/mdstat
```
