---
title: "204.3 - LVM"
tags: [lpic-2, examen-201, tema-204, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.3"
---

# 204.3 - LVM (Logical Volume Manager)

## Introduccion a LVM

LVM (Logical Volume Manager) es una capa de abstraccion entre los dispositivos de almacenamiento fisico y los sistemas de archivos. Permite gestionar el almacenamiento de forma flexible, pudiendo redimensionar, mover y crear instantaneas de volumenes sin interrupcion del servicio.

### Arquitectura de LVM

```
+------------------------------------------+
|     Sistemas de archivos (ext4, xfs)     |
+------------------------------------------+
|    Volumenes Logicos (LV)                |
|    /dev/vg_datos/lv_home                 |
+------------------------------------------+
|    Grupos de Volumenes (VG)              |
|    vg_datos                              |
+------------------------------------------+
|    Volumenes Fisicos (PV)                |
|    /dev/sdb1   /dev/sdc1   /dev/sdd1    |
+------------------------------------------+
|    Discos fisicos / Particiones          |
|    sdb          sdc          sdd         |
+------------------------------------------+
```

### Conceptos fundamentales

| Concepto | Abreviatura | Descripcion |
|---|---|---|
| Physical Volume | PV | Disco o particion inicializado para LVM |
| Volume Group | VG | Conjunto de PVs que forman un pool de almacenamiento |
| Logical Volume | LV | Volumen virtual creado desde un VG (donde se crea el FS) |
| Physical Extent | PE | Unidad minima de asignacion en un PV (por defecto 4 MB) |
| Logical Extent | LE | Unidad minima de asignacion en un LV (mismo tamano que PE) |

> **Para el examen:** La jerarquia es siempre: Disco -> PV -> VG -> LV -> Sistema de archivos. Memoriza esta cadena y los comandos asociados a cada nivel.

## Volumenes fisicos (PV)

Los volumenes fisicos son la base de LVM. Se crean a partir de discos enteros o particiones (tipo `8e` en MBR o `8e00` en GPT).

### Creacion y gestion de PVs

```bash
# Crear un volumen fisico
pvcreate /dev/sdb1
pvcreate /dev/sdc1
pvcreate /dev/sdd          # Disco entero (sin particionar)

# Crear multiples PVs a la vez
pvcreate /dev/sdb1 /dev/sdc1 /dev/sdd1

# Ver informacion resumida de todos los PVs
pvs

# Ejemplo de salida de pvs:
#   PV         VG        Fmt  Attr PSize   PFree
#   /dev/sdb1  vg_datos  lvm2 a--  50.00g  20.00g
#   /dev/sdc1  vg_datos  lvm2 a--  50.00g  50.00g

# Ver informacion detallada de un PV
pvdisplay /dev/sdb1

# Ejemplo de salida de pvdisplay:
#   --- Physical volume ---
#   PV Name               /dev/sdb1
#   VG Name               vg_datos
#   PV Size               50.00 GiB
#   PE Size               4.00 MiB
#   Total PE              12799
#   Free PE               5120
#   Allocated PE          7679

# Escanear discos en busca de PVs
pvscan

# Eliminar un PV (debe estar fuera de cualquier VG)
pvremove /dev/sdb1

# Mover datos de un PV a otro (dentro del mismo VG)
pvmove /dev/sdb1 /dev/sdc1

# Redimensionar un PV (tras redimensionar la particion)
pvresize /dev/sdb1
```

> **Para el examen:** `pvmove` es critico para migrar datos entre discos sin tiempo de inactividad. Permite evacuar un disco antes de retirarlo del VG.

## Grupos de volumenes (VG)

Un VG agrupa uno o mas PVs en un unico pool de almacenamiento del cual se crean los LVs.

### Creacion y gestion de VGs

```bash
# Crear un grupo de volumenes
vgcreate vg_datos /dev/sdb1 /dev/sdc1

# Crear VG con tamano de PE personalizado (por defecto 4 MB)
vgcreate -s 16M vg_datos /dev/sdb1 /dev/sdc1

# Ver informacion resumida de todos los VGs
vgs

# Ejemplo de salida de vgs:
#   VG        #PV #LV #SN Attr   VSize   VFree
#   vg_datos    2   1   0 wz--n- 99.99g  49.99g

# Ver informacion detallada de un VG
vgdisplay vg_datos

# Agregar un nuevo PV a un VG existente
vgextend vg_datos /dev/sdd1

# Retirar un PV de un VG (primero mover datos con pvmove)
pvmove /dev/sdb1
vgreduce vg_datos /dev/sdb1

# Renombrar un VG
vgrename vg_datos vg_produccion

# Eliminar un VG (todos los LVs deben estar eliminados)
vgremove vg_datos

# Activar/desactivar un VG
vgchange -a y vg_datos     # Activar
vgchange -a n vg_datos     # Desactivar

# Escanear en busca de VGs
vgscan
```

### Exportar e importar VGs

Para mover un VG entre sistemas:

```bash
# En el sistema origen: desactivar y exportar
vgchange -a n vg_datos
vgexport vg_datos

# Mover los discos fisicamente al nuevo sistema

# En el sistema destino: importar y activar
pvscan
vgimport vg_datos
vgchange -a y vg_datos
```

## Volumenes logicos (LV)

Los LVs son los volumenes sobre los que se crean los sistemas de archivos. Son analogos a las particiones pero mucho mas flexibles.

### Creacion de LVs

```bash
# Crear un LV con tamano especifico
lvcreate -L 20G -n lv_home vg_datos

# Crear un LV usando porcentaje del espacio libre
lvcreate -l 100%FREE -n lv_backup vg_datos

# Crear un LV con porcentaje del VG total
lvcreate -l 50%VG -n lv_datos vg_datos

# Crear un LV con numero de extents
lvcreate -l 5000 -n lv_logs vg_datos

# Crear un LV tipo mirror (RAID 1)
lvcreate --type mirror -m 1 -L 10G -n lv_mirror vg_datos

# Crear un LV tipo striped (RAID 0)
lvcreate --type striped -i 2 -L 20G -n lv_stripe vg_datos
```

### Opciones de lvcreate

| Opcion | Descripcion |
|---|---|
| `-L tamano` | Tamano del LV (ej: 10G, 500M) |
| `-l extents` | Numero de extents o porcentaje (50%VG, 100%FREE) |
| `-n nombre` | Nombre del volumen logico |
| `-s` | Crear un snapshot |
| `--type tipo` | Tipo de LV (linear, mirror, striped, raid1, raid5) |
| `-m N` | Numero de copias para mirror |
| `-i N` | Numero de stripes |
| `-I tamano` | Tamano de stripe |
| `-T` | Crear thin pool |
| `-V tamano` | Tamano virtual para thin volume |

### Informacion y listado de LVs

```bash
# Ver informacion resumida de todos los LVs
lvs

# Ejemplo de salida de lvs:
#   LV       VG        Attr       LSize   Pool Origin Data%
#   lv_home  vg_datos  -wi-ao---- 20.00g
#   lv_snap  vg_datos  swi-a-s--- 5.00g        lv_home 12.50

# Ver informacion detallada
lvdisplay /dev/vg_datos/lv_home

# Escanear LVs
lvscan
```

> **Para el examen:** Los LVs se acceden como `/dev/VG/LV` o `/dev/mapper/VG-LV`. Ambas rutas son validas y equivalentes.

### Rutas de acceso a LVs

| Formato | Ejemplo |
|---|---|
| `/dev/VG/LV` | `/dev/vg_datos/lv_home` |
| `/dev/mapper/VG-LV` | `/dev/mapper/vg_datos-lv_home` |

## Redimensionamiento de volumenes

### Ampliar un LV

```bash
# Paso 1: Ampliar el LV
lvextend -L +10G /dev/vg_datos/lv_home      # Agregar 10 GB
lvextend -L 50G /dev/vg_datos/lv_home       # Establecer tamano total a 50 GB
lvextend -l +100%FREE /dev/vg_datos/lv_home # Usar todo el espacio libre

# Paso 2: Redimensionar el sistema de archivos
resize2fs /dev/vg_datos/lv_home             # Para ext2/ext3/ext4
xfs_growfs /punto_de_montaje                # Para XFS (solo crece, no encoge)

# Forma rapida: ampliar LV y FS en un solo comando
lvextend -r -L +10G /dev/vg_datos/lv_home   # -r = resize FS automaticamente
lvresize -r -L +10G /dev/vg_datos/lv_home   # lvresize equivalente
```

### Reducir un LV (solo ext2/ext3/ext4)

```bash
# IMPORTANTE: XFS no soporta reduccion

# Paso 1: Desmontar el sistema de archivos
umount /dev/vg_datos/lv_home

# Paso 2: Verificar el sistema de archivos
e2fsck -f /dev/vg_datos/lv_home

# Paso 3: Reducir el sistema de archivos primero
resize2fs /dev/vg_datos/lv_home 15G

# Paso 4: Reducir el LV
lvreduce -L 15G /dev/vg_datos/lv_home

# O en un solo paso (con confirmacion):
lvresize -r -L 15G /dev/vg_datos/lv_home
```

> **Para el examen:** Al ampliar: primero LV, luego FS. Al reducir: primero FS, luego LV. Si se reduce el LV antes que el FS, se perderan datos. XFS solo puede crecer, nunca reducirse.

## Snapshots (instantaneas)

Los snapshots son copias instantaneas del estado de un LV en un momento dado. Usan la tecnica COW (Copy-On-Write).

### Creacion y uso de snapshots

```bash
# Crear un snapshot del LV
lvcreate -s -L 5G -n lv_home_snap /dev/vg_datos/lv_home

# El snapshot es montable como cualquier LV
mount -o ro /dev/vg_datos/lv_home_snap /mnt/snapshot

# Ver uso del snapshot (columna Data%)
lvs

# Ejemplo:
#   LV            VG        Attr       LSize  Pool Origin  Data%
#   lv_home       vg_datos  owi-aos--  20.00g
#   lv_home_snap  vg_datos  swi-a-s--   5.00g      lv_home 15.00

# Revertir al snapshot (restaurar el LV al estado de la instantanea)
lvconvert --merge /dev/vg_datos/lv_home_snap
# Requiere desmontar el LV original o reiniciar

# Eliminar un snapshot
lvremove /dev/vg_datos/lv_home_snap
```

### Caracteristicas de los snapshots

- **COW (Copy-On-Write):** Solo almacenan los bloques que cambian despues de la creacion
- **Tamano:** Debe ser suficiente para almacenar todos los cambios durante su vida util
- **Si se llena:** El snapshot se invalida automaticamente
- **Rendimiento:** Las escrituras al LV original son mas lentas con snapshots activos
- **Uso tipico:** Backups consistentes, pruebas antes de actualizaciones

> **Para el examen:** Si un snapshot se llena al 100%, se invalida y no puede ser utilizado. Monitoriza con `lvs` la columna `Data%`.

## Thin Provisioning

El thin provisioning permite asignar mas espacio del fisicamente disponible (overprovisioning), asignando almacenamiento real solo cuando se escribe.

```bash
# Crear un thin pool
lvcreate -T -L 50G vg_datos/thin_pool

# Crear un thin volume (puede superar el tamano del pool)
lvcreate -T -V 100G -n lv_thin1 vg_datos/thin_pool
lvcreate -T -V 100G -n lv_thin2 vg_datos/thin_pool

# Ver el uso real del thin pool
lvs -a

# Extender el thin pool si se llena
lvextend -L +20G vg_datos/thin_pool
```

### Ventajas del thin provisioning

- Uso eficiente del almacenamiento (solo se asigna lo que se usa)
- Los snapshots thin son mas eficientes que los clasicos
- Permite overprovisioning controlado
- Ideal para entornos de virtualizacion

## LVM y RAID

LVM puede crear volumenes logicos con redundancia integrada:

```bash
# Crear LV con RAID 1 (mirror)
lvcreate --type raid1 -m 1 -L 10G -n lv_raid1 vg_datos

# Crear LV con RAID 5
lvcreate --type raid5 -i 3 -L 30G -n lv_raid5 vg_datos

# Crear LV con RAID 10
lvcreate --type raid10 -i 2 -m 1 -L 20G -n lv_raid10 vg_datos

# Ver estado de sincronizacion
lvs -a -o name,copy_percent,devices vg_datos
```

## Buenas practicas

- Siempre dejar espacio libre en el VG para snapshots y crecimiento futuro
- Usar `lvextend -r` para redimensionar LV y FS en un solo paso
- Monitorizar el uso de los snapshots para evitar invalidacion
- Documentar la estructura PV -> VG -> LV
- Usar nombres descriptivos para VGs y LVs
- Antes de reducir: backup, verificar FS, y desmontar
- Considerar thin provisioning para entornos con muchos volumenes
- Usar `pvmove` para migrar datos sin interrupcion antes de retirar discos

## Comandos de diagnostico y recuperacion

```bash
# Verificar metadatos LVM
vgck vg_datos

# Hacer backup de metadatos LVM
vgcfgbackup vg_datos

# Restaurar metadatos desde backup
vgcfgrestore vg_datos

# Los backups automaticos se guardan en:
# /etc/lvm/backup/      - ultimo backup
# /etc/lvm/archive/     - historico de cambios

# Archivo de configuracion principal
# /etc/lvm/lvm.conf
```
