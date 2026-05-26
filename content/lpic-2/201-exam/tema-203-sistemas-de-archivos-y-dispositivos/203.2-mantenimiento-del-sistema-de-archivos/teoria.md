---
title: "203.2 - Mantenimiento del sistema de archivos"
tags: [lpic-2, examen-201, tema-203, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.2"
---

# 203.2 - Mantenimiento del sistema de archivos

## Introduccion

El mantenimiento adecuado de los sistemas de archivos es crucial para garantizar la integridad, el rendimiento y la fiabilidad del almacenamiento en sistemas Linux. Este subtema cubre la creacion de sistemas de archivos, la configuracion de parametros avanzados, la comprobacion y reparacion, la obtencion de informacion y el redimensionamiento, asi como la monitorizacion de la salud del disco mediante S.M.A.R.T.

**Peso del subtema: 3**

## Creacion de sistemas de archivos con mkfs

### Sintaxis general

```bash
# Formato generico
mkfs -t <tipo> [opciones] <dispositivo>

# O usando el comando especifico
mkfs.<tipo> [opciones] <dispositivo>
```

### Creacion de sistemas de archivos ext4

```bash
# Creacion basica
mkfs.ext4 /dev/sdb1

# Con etiqueta
mkfs.ext4 -L "datos" /dev/sdb1

# Con tamano de bloque especifico (1024, 2048, 4096)
mkfs.ext4 -b 4096 /dev/sdb1

# Con numero especifico de inodos
mkfs.ext4 -N 1000000 /dev/sdb1

# Especificando porcentaje de bloques reservados para root
mkfs.ext4 -m 2 /dev/sdb1

# Con journal externo
mkfs.ext4 -J device=/dev/sdc1 /dev/sdb1

# Desactivar journal (convertir en ext2 efectivamente)
mkfs.ext4 -O ^has_journal /dev/sdb1
```

### Creacion de sistemas de archivos XFS

```bash
# Creacion basica
mkfs.xfs /dev/sdb1

# Con etiqueta
mkfs.xfs -L "datos_xfs" /dev/sdb1

# Con tamano de bloque especifico
mkfs.xfs -b size=4096 /dev/sdb1

# Forzar creacion (sobreescribir FS existente)
mkfs.xfs -f /dev/sdb1

# Con tamano de log especifico
mkfs.xfs -l size=128m /dev/sdb1
```

### Creacion de otros sistemas de archivos

```bash
# Btrfs
mkfs.btrfs /dev/sdb1
mkfs.btrfs -L "btrfs_data" /dev/sdb1
mkfs.btrfs -d raid1 -m raid1 /dev/sdb1 /dev/sdc1   # RAID1 con Btrfs

# VFAT (FAT32)
mkfs.vfat /dev/sdb1
mkfs.vfat -F 32 /dev/sdb1           # Forzar FAT32
mkfs.vfat -n "USB_DRIVE" /dev/sdb1   # Con etiqueta

# Swap
mkswap /dev/sdb2
mkswap -L "swap_data" /dev/sdb2
swapon /dev/sdb2                      # Activar swap
```

> **Para el examen:** Los comandos `mkfs.ext4`, `mkfs.xfs`, `mkfs.btrfs` y `mkfs.vfat` son las formas directas de crear cada tipo de sistema de archivos. Tambien se puede usar `mkfs -t ext4 /dev/sdb1` como forma generica.

## tune2fs - Ajuste de parametros ext2/3/4

`tune2fs` es la herramienta principal para modificar parametros de sistemas de archivos de la familia ext. Funciona con ext2, ext3 y ext4.

### Opciones principales

```bash
# Cambiar la etiqueta del sistema de archivos
tune2fs -L "nueva_etiqueta" /dev/sda1

# Cambiar el porcentaje de bloques reservados para root
tune2fs -m 1 /dev/sda1    # 1% reservado (default es 5%)

# Cambiar el usuario/grupo de los bloques reservados
tune2fs -u webuser /dev/sda1
tune2fs -g webgroup /dev/sda1

# Establecer el numero maximo de montajes antes de fsck
tune2fs -c 30 /dev/sda1

# Desactivar la verificacion por numero de montajes
tune2fs -c 0 /dev/sda1
tune2fs -c -1 /dev/sda1

# Establecer intervalo de tiempo entre verificaciones
tune2fs -i 30d /dev/sda1    # Cada 30 dias
tune2fs -i 2w /dev/sda1     # Cada 2 semanas
tune2fs -i 0 /dev/sda1      # Desactivar

# Agregar journal a ext2 (convertir a ext3)
tune2fs -j /dev/sda1

# Habilitar/deshabilitar caracteristicas
tune2fs -O extents,uninit_bg,dir_index /dev/sda1
tune2fs -O ^has_journal /dev/sda1    # Eliminar journal

# Establecer contador de montajes actual
tune2fs -C 0 /dev/sda1

# Cambiar el UUID
tune2fs -U random /dev/sda1
tune2fs -U clear /dev/sda1
```

> **Para el examen:** `tune2fs -m` cambia el porcentaje de bloques reservados (importante para particiones de datos donde el 5% por defecto puede desperdiciar mucho espacio). `tune2fs -c` y `tune2fs -i` controlan cuando se fuerza una verificacion automatica.

## xfs_admin - Ajuste de parametros XFS

```bash
# Cambiar la etiqueta
xfs_admin -L "nueva_etiqueta" /dev/sda1

# Eliminar la etiqueta
xfs_admin -L -- /dev/sda1

# Cambiar el UUID
xfs_admin -U generate /dev/sda1

# Limpiar el UUID
xfs_admin -U nil /dev/sda1

# Habilitar lazy-counter (mejora rendimiento)
xfs_admin -c 1 /dev/sda1
```

## Comprobacion y reparacion de sistemas de archivos

### fsck - Verificacion generica

```bash
# Verificar un sistema de archivos (deteccion automatica de tipo)
fsck /dev/sda2

# Verificar sin reparar
fsck -n /dev/sda2

# Reparar automaticamente sin preguntar
fsck -y /dev/sda2

# Reparar interactivamente
fsck /dev/sda2    # Pregunta antes de cada reparacion

# Verificar por tipo especifico
fsck -t ext4 /dev/sda2

# Verificar todas las particiones de fstab con pass > 0
fsck -A

# Forzar verificacion incluso si parece limpio
fsck -f /dev/sda2
```

### e2fsck - Verificacion de ext2/3/4

```bash
# Verificacion estandar
e2fsck /dev/sda2

# Forzar verificacion (ignora flag "limpio")
e2fsck -f /dev/sda2

# Reparar automaticamente
e2fsck -y /dev/sda2

# Reparar automaticamente solo errores seguros
e2fsck -p /dev/sda2

# Modo verbose
e2fsck -v /dev/sda2

# Verificar bloques defectuosos
e2fsck -c /dev/sda2
```

### xfs_repair - Reparacion de XFS

```bash
# Reparacion estandar (el FS debe estar desmontado)
xfs_repair /dev/sda3

# Solo verificar sin reparar (dry-run)
xfs_repair -n /dev/sda3

# Reparacion en modo verbose
xfs_repair -v /dev/sda3

# Forzar reconstruccion del log (ultimo recurso)
xfs_repair -L /dev/sda3
```

> **Para el examen:** `xfs_repair` se usa en lugar de `fsck.xfs` para sistemas XFS. El comando `fsck.xfs` existe pero no hace nada real; es un placeholder. Ademas, `xfs_repair -L` fuerza la limpieza del log y puede causar perdida de datos, solo se usa como ultimo recurso.

## Obtencion de informacion de sistemas de archivos

### dumpe2fs - Informacion detallada de ext2/3/4

```bash
# Mostrar informacion completa del superbloque
dumpe2fs /dev/sda1

# Solo mostrar informacion del superbloque (sin grupos)
dumpe2fs -h /dev/sda1

# Informacion tipica que muestra:
# - Tamano del sistema de archivos
# - Numero de bloques e inodos (totales, libres, reservados)
# - Tamano de bloque
# - Estado del sistema de archivos
# - Conteo de montajes y maximo
# - Ultima verificacion y proximo chequeo programado
# - Caracteristicas del FS (journal, extents, etc.)
# - UUID y etiqueta
```

Salida ejemplo resumida:

```
Filesystem volume name:   datos
Filesystem UUID:          a1b2c3d4-e5f6-7890-abcd-ef1234567890
Filesystem state:         clean
Block count:              2621440
Block size:               4096
Reserved block count:     131072
Free blocks:              1843200
Inode count:              655360
Free inodes:              654000
Mount count:              15
Maximum mount count:      -1
Last checked:             Mon Jan 15 10:00:00 2024
```

### xfs_info - Informacion de XFS

```bash
# Mostrar informacion del sistema de archivos XFS
# NOTA: El FS debe estar montado
xfs_info /dev/sda3
# O por punto de montaje
xfs_info /mnt/datos
```

Salida ejemplo:

```
meta-data=/dev/sda3    isize=512    agcount=4, agsize=1310720 blks
         =             sectsz=512   attr=2, projid32bit=1
data     =             bsize=4096   blocks=5242880, imaxpct=25
         =             sunit=0      swidth=0 blks
naming   =version 2    bsize=4096   ascii-ci=0, ftype=1
log      =internal     bsize=4096   blocks=2560, version=2
realtime =none         extsz=4096   blocks=0, rtextents=0
```

## Redimensionamiento de sistemas de archivos

### resize2fs - Redimensionar ext2/3/4

```bash
# Expandir al tamano maximo de la particion
resize2fs /dev/sda1

# Redimensionar a un tamano especifico
resize2fs /dev/sda1 50G

# Reducir a un tamano especifico (requiere fsck previo)
e2fsck -f /dev/sda1
resize2fs /dev/sda1 30G

# Nota: Para reducir, el FS debe estar desmontado
# Para expandir, ext4 soporta redimensionamiento en linea (montado)
```

> **Para el examen:** `resize2fs` puede expandir un sistema ext4 **en linea** (montado), pero para reducir, el sistema debe estar **desmontado** y se recomienda ejecutar `e2fsck -f` antes de la reduccion.

### xfs_growfs - Expandir XFS

```bash
# Expandir XFS al tamano maximo disponible
# NOTA: El FS debe estar montado
xfs_growfs /mnt/datos

# Expandir a un numero especifico de bloques
xfs_growfs -D 10485760 /mnt/datos
```

> **Para el examen:** XFS **solo puede expandirse**, nunca reducirse. Ademas, `xfs_growfs` opera sobre el punto de montaje (no sobre el dispositivo) y el sistema de archivos debe estar montado. Esto contrasta con `resize2fs` que opera sobre el dispositivo.

### Comparativa de redimensionamiento

| Caracteristica | ext4 (resize2fs) | XFS (xfs_growfs) |
|---|---|---|
| Expandir en linea | Si | Si |
| Reducir | Si (desmontado) | No soportado |
| Opera sobre | Dispositivo | Punto de montaje |
| Requiere FS montado | No (expandir si, reducir no) | Si |
| Requiere fsck previo para reducir | Si | N/A |

## Monitorizacion S.M.A.R.T.

### Introduccion

S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology) es un sistema de monitorizacion integrado en los discos duros y SSDs que detecta y reporta indicadores de fiabilidad.

### smartctl - Herramienta de diagnostico

```bash
# Verificar si el disco soporta SMART
smartctl -i /dev/sda

# Habilitar SMART en el disco
smartctl -s on /dev/sda

# Ver informacion completa de salud
smartctl -a /dev/sda

# Ver solo el estado de salud
smartctl -H /dev/sda

# Ver atributos SMART
smartctl -A /dev/sda

# Ejecutar test corto
smartctl -t short /dev/sda

# Ejecutar test largo (completo)
smartctl -t long /dev/sda

# Ver resultados de tests
smartctl -l selftest /dev/sda

# Ver log de errores
smartctl -l error /dev/sda
```

### Atributos SMART importantes

| Atributo | ID | Significado |
|---|---|---|
| Reallocated Sector Count | 5 | Sectores reasignados (critico) |
| Spin Retry Count | 10 | Reintentos de giro del motor |
| Reallocated Event Count | 196 | Eventos de reasignacion |
| Current Pending Sector | 197 | Sectores pendientes de reasignacion |
| Offline Uncorrectable | 198 | Sectores no corregibles |
| Temperature | 194 | Temperatura del disco |
| Power On Hours | 9 | Horas de encendido |
| Start Stop Count | 4 | Ciclos de encendido/apagado |

### smartd - Demonio de monitorizacion

El demonio `smartd` monitoriza los discos de forma continua y envia alertas:

```bash
# Archivo de configuracion
# /etc/smartd.conf

# Monitorizar /dev/sda con alertas por email
/dev/sda -a -m admin@ejemplo.com

# Monitorizar todos los discos
DEVICESCAN -a -m admin@ejemplo.com

# Monitorizar con test programado
/dev/sda -a -m admin@ejemplo.com -s (S/../.././02|L/../../6/03)
# S = test corto cada dia a las 02:00
# L = test largo cada sabado a las 03:00

# Gestionar el servicio
systemctl enable smartd
systemctl start smartd
systemctl status smartd
```

> **Para el examen:** `smartctl -H /dev/sda` es la forma rapida de verificar la salud del disco. Si muestra "PASSED", el disco no reporta problemas criticos. Los atributos mas criticos son Reallocated Sector Count (ID 5) y Current Pending Sector (ID 197).

## Resumen de herramientas por sistema de archivos

| Operacion | ext2/3/4 | XFS | Btrfs |
|---|---|---|---|
| Crear | `mkfs.ext4` | `mkfs.xfs` | `mkfs.btrfs` |
| Verificar/Reparar | `e2fsck` / `fsck.ext4` | `xfs_repair` | `btrfs check` |
| Informacion | `dumpe2fs` | `xfs_info` | `btrfs filesystem show` |
| Ajustar parametros | `tune2fs` | `xfs_admin` | `btrfs property` |
| Expandir | `resize2fs` | `xfs_growfs` | `btrfs filesystem resize` |
| Reducir | `resize2fs` | No soportado | `btrfs filesystem resize` |
| Cambiar etiqueta | `tune2fs -L` | `xfs_admin -L` | `btrfs filesystem label` |

## Archivos de configuracion clave

| Archivo | Funcion |
|---|---|
| `/etc/fstab` | Montajes automaticos (campo pass controla fsck) |
| `/etc/smartd.conf` | Configuracion del demonio smartd |
| `/etc/e2fsck.conf` | Configuracion de e2fsck |
| `/forcefsck` | Fuerza fsck en el proximo arranque (si existe) |
