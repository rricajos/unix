---
title: "102.1 - Diseno de disco duro: Teoria"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.1"
---

# 102.1 - Diseno de disco duro: Teoria

## Introduccion

El diseno del esquema de particionado es una de las primeras decisiones que se toman al instalar un sistema Linux. Un buen diseno de disco mejora el rendimiento, facilita la administracion, aumenta la seguridad y simplifica las copias de respaldo.

---

## 1. Conceptos basicos de particionado

### Que es una particion

Una particion es una division logica del disco duro que el sistema operativo trata como una unidad independiente. Cada particion puede contener un sistema de archivos diferente y montarse en un punto distinto del arbol de directorios.

### Tipos de particiones (MBR)

En un esquema MBR (Master Boot Record), existen tres tipos de particiones:

| Tipo | Descripcion | Limite |
|------|-------------|--------|
| **Primaria** | Particion directa en la tabla de particiones del MBR | Maximo 4 por disco |
| **Extendida** | Contenedor que alberga particiones logicas | Maximo 1 por disco (ocupa el espacio de una primaria) |
| **Logica** | Particion dentro de la extendida | Sin limite practico (hasta 15 en discos SCSI, 63 en IDE) |

**Regla clave**: Un disco MBR puede tener hasta 4 particiones primarias, o hasta 3 primarias + 1 extendida (que contiene logicas).

### Nomenclatura de dispositivos

```
/dev/sda    -> primer disco SATA/SCSI/USB
/dev/sda1   -> primera particion del primer disco
/dev/sda2   -> segunda particion
/dev/sdb    -> segundo disco
/dev/nvme0n1    -> primer disco NVMe
/dev/nvme0n1p1  -> primera particion del primer NVMe
```

- Las particiones primarias y la extendida se numeran del 1 al 4
- Las particiones logicas comienzan en el numero 5

---

## 2. MBR vs GPT

### MBR (Master Boot Record)

- Estandar antiguo (1983), aun ampliamente usado
- Primer sector del disco (512 bytes) contiene:
  - Codigo de arranque (bootstrap): 446 bytes
  - Tabla de particiones: 64 bytes (4 entradas de 16 bytes)
  - Firma de arranque: 2 bytes (0x55AA)
- **Limite de tamano de disco**: 2 TB (2^32 sectores x 512 bytes)
- **Limite de particiones**: 4 primarias (o 3 primarias + 1 extendida)
- No tiene redundancia: si el MBR se corrompe, se pierde la tabla de particiones

### GPT (GUID Partition Table)

- Estandar moderno, parte de la especificacion UEFI
- Usa direccionamiento LBA (Logical Block Addressing)
- **Limite de tamano de disco**: 8 ZB (zettabytes) teoricos
- **Limite de particiones**: 128 particiones por defecto (ampliable)
- Mantiene un MBR protector en el sector 0 (compatibilidad)
- **Redundancia**: almacena una copia de la tabla GPT al final del disco
- Cada particion tiene un GUID unico
- Usa CRC32 para detectar errores en la tabla de particiones

### Comparativa rapida

| Caracteristica | MBR | GPT |
|---------------|-----|-----|
| Tamano maximo disco | 2 TB | 8 ZB |
| Particiones maximas | 4 primarias | 128 (por defecto) |
| Redundancia | No | Si (tabla de respaldo) |
| Verificacion de integridad | No | Si (CRC32) |
| Compatibilidad con UEFI | No nativo | Si |
| Compatibilidad con BIOS | Si | Parcial (con MBR protector) |

---

## 3. Puntos de montaje y esquemas de particionado

### Puntos de montaje principales

#### `/` (raiz)
- Contiene todo el sistema de archivos si no se crean particiones adicionales
- Es obligatorio
- Debe contener al menos los directorios esenciales para arrancar y reparar el sistema
- Tamano recomendado: 15-20 GB minimo (si se separan otras particiones)

#### `/boot`
- Contiene el kernel, initramfs y archivos del gestor de arranque
- Se recomienda separar en sistemas con BIOS/MBR
- En sistemas UEFI, se complementa con la particion ESP
- Tamano recomendado: 500 MB - 1 GB
- **Importante**: debe estar en una particion accesible por el gestor de arranque (generalmente los primeros sectores del disco en MBR)
- Sistema de archivos recomendado: ext4 (ext2 en sistemas antiguos)

#### `/home`
- Directorios personales de los usuarios
- Separarlo permite reinstalar el SO sin perder datos de usuario
- Tamano: depende del numero de usuarios y sus necesidades
- Se puede montar con opciones como `nosuid` y `nodev` para mayor seguridad

#### `/var`
- Datos variables: logs, colas de correo, bases de datos, cache del gestor de paquetes
- Crece de forma impredecible
- Separarlo protege a `/` de quedarse sin espacio por logs excesivos
- Tamano recomendado: 5-10 GB minimo (mas para servidores)
- Importante en servidores web, de correo y bases de datos

#### `/tmp`
- Archivos temporales
- Separarlo limita el impacto de archivos temporales en el sistema
- Se puede montar con `noexec`, `nosuid`, `nodev` para mayor seguridad
- Alternativa: montar como tmpfs (en RAM)
- Tamano recomendado: 1-5 GB

#### `/usr`
- Programas, bibliotecas y documentacion del sistema
- Generalmente se mantiene en la particion raiz en sistemas modernos
- En algunas configuraciones especiales (servidores de solo lectura) se separa
- Tamano: 5-10 GB

#### Swap (espacio de intercambio)
- Espacio en disco usado cuando la RAM esta llena
- Usado tambien para hibernacion
- Puede ser una particion dedicada o un archivo de swap
- Reglas clasicas de tamano:
  - RAM < 2 GB: swap = 2x RAM
  - RAM 2-8 GB: swap = igual a RAM
  - RAM > 8 GB: swap = 0.5x RAM o un minimo de 4 GB
  - Para hibernacion: swap >= tamano de RAM

### EFI System Partition (ESP)

- Particion requerida en sistemas UEFI
- Formato: FAT32 (obligatorio)
- Punto de montaje tipico: `/boot/efi`
- Tamano recomendado: 100-550 MB
- Contiene los archivos del cargador de arranque UEFI (.efi)
- Identificada por el tipo de particion `EF00` en GPT
- Cada sistema operativo instala su cargador en un subdirectorio:
  - `/boot/efi/EFI/ubuntu/`
  - `/boot/efi/EFI/fedora/`

---

## 4. Esquemas de particionado segun el uso

### Escritorio basico

```
/boot   -> 500 MB (ext4)
ESP     -> 300 MB (FAT32, solo en UEFI)
/       -> 30-50 GB (ext4)
/home   -> resto del disco (ext4)
swap    -> segun RAM
```

### Servidor web

```
/boot   -> 500 MB
ESP     -> 300 MB (solo UEFI)
/       -> 20 GB
/var    -> 20-50 GB (logs, datos web)
/tmp    -> 5 GB
/home   -> 10 GB
swap    -> segun RAM
```

### Servidor de base de datos

```
/boot   -> 500 MB
/       -> 20 GB
/var    -> 50-100 GB (bases de datos)
/tmp    -> 10 GB (consultas temporales)
swap    -> igual a RAM
```

---

## 5. LVM (Logical Volume Manager)

### Conceptos fundamentales

LVM proporciona una capa de abstraccion sobre los discos fisicos que permite gestionar el almacenamiento de forma mas flexible.

```
+----------------------------------------------------------+
|                   Volumenes Logicos (LV)                 |
|   [ lv_root ]    [ lv_home ]    [ lv_var ]               |
+----------------------------------------------------------+
|                  Grupo de Volumenes (VG)                  |
|                    [ vg_sistema ]                         |
+----------------------------------------------------------+
|              Volumenes Fisicos (PV)                       |
|   [ /dev/sda2 ]    [ /dev/sdb1 ]    [ /dev/sdc1 ]       |
+----------------------------------------------------------+
```

### Componentes de LVM

| Componente | Sigla | Descripcion |
|-----------|-------|-------------|
| **Physical Volume** | PV | Particion o disco fisico preparado para LVM |
| **Volume Group** | VG | Agrupacion de uno o mas PV. Pool de almacenamiento |
| **Logical Volume** | LV | "Particion virtual" creada dentro de un VG |
| **Physical Extent** | PE | Unidad minima de asignacion en un PV (por defecto 4 MB) |
| **Logical Extent** | LE | Unidad minima de asignacion en un LV |

### Ventajas de LVM

1. **Redimensionado dinamico**: ampliar o reducir volumenes logicos sin desmontar (en ext4, ampliar se puede hacer en caliente)
2. **Agregar discos en caliente**: anadir un nuevo PV al VG y extender un LV
3. **Snapshots**: crear instantaneas de un LV para copias de seguridad consistentes
4. **Distribucion entre discos**: un LV puede abarcar varios discos fisicos
5. **Migracion en caliente**: mover datos de un PV a otro sin parar el sistema

### Flujo basico de creacion LVM

```bash
# 1. Crear volumenes fisicos
pvcreate /dev/sdb1 /dev/sdc1

# 2. Crear grupo de volumenes
vgcreate vg_datos /dev/sdb1 /dev/sdc1

# 3. Crear volumenes logicos
lvcreate -n lv_home -L 50G vg_datos
lvcreate -n lv_var -L 20G vg_datos

# 4. Crear sistema de archivos
mkfs.ext4 /dev/vg_datos/lv_home
mkfs.ext4 /dev/vg_datos/lv_var

# 5. Montar
mount /dev/vg_datos/lv_home /home
```

### Comandos basicos de LVM

| Accion | PV | VG | LV |
|--------|----|----|-----|
| Crear | `pvcreate` | `vgcreate` | `lvcreate` |
| Mostrar info | `pvdisplay` | `vgdisplay` | `lvdisplay` |
| Listar | `pvs` | `vgs` | `lvs` |
| Extender | - | `vgextend` | `lvextend` |
| Reducir | - | `vgreduce` | `lvreduce` |
| Eliminar | `pvremove` | `vgremove` | `lvremove` |

---

## 6. Herramientas de particionado

### fdisk

- Herramienta clasica de particionado para discos MBR
- Tambien soporta GPT en versiones modernas
- Interfaz interactiva basada en texto
- Comandos principales dentro de fdisk:
  - `m` - ayuda
  - `p` - imprimir tabla de particiones
  - `n` - nueva particion
  - `d` - eliminar particion
  - `t` - cambiar tipo de particion
  - `w` - escribir cambios y salir
  - `q` - salir sin guardar

```bash
fdisk /dev/sda
```

### gdisk

- Equivalente a fdisk pero diseñado para discos GPT
- Interfaz similar a fdisk
- Puede convertir MBR a GPT y viceversa
- Comandos similares: `p`, `n`, `d`, `t`, `w`, `q`

```bash
gdisk /dev/sda
```

### parted

- Herramienta avanzada que soporta tanto MBR como GPT
- Puede ejecutarse de forma interactiva o con comandos directos
- **Los cambios se aplican inmediatamente** (a diferencia de fdisk/gdisk)
- Permite redimensionar particiones

```bash
# Modo interactivo
parted /dev/sda

# Modo comando
parted /dev/sda print
parted /dev/sda mkpart primary ext4 1MiB 20GiB
```

---

## 7. Swap (espacio de intercambio)

### Crear y activar swap

```bash
# Crear particion swap
mkswap /dev/sda3

# Activar swap
swapon /dev/sda3

# Verificar
swapon --show
free -h

# Desactivar swap
swapoff /dev/sda3
```

### Archivo de swap (alternativa)

```bash
# Crear archivo de 2 GB
dd if=/dev/zero of=/swapfile bs=1M count=2048
# O con fallocate
fallocate -l 2G /swapfile

chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Entrada en /etc/fstab para swap

```
# Particion
/dev/sda3   none   swap   sw   0   0

# Archivo
/swapfile   none   swap   sw   0   0

# Usando UUID
UUID=xxxx-xxxx   none   swap   sw   0   0
```

---

## 8. /etc/fstab

El archivo `/etc/fstab` define como se montan las particiones automaticamente al arrancar el sistema.

### Formato

```
<dispositivo>   <punto_montaje>   <tipo_fs>   <opciones>   <dump>   <pass>
```

| Campo | Descripcion |
|-------|-------------|
| dispositivo | Ruta del dispositivo, UUID o etiqueta |
| punto_montaje | Directorio donde se monta (none para swap) |
| tipo_fs | Sistema de archivos (ext4, xfs, swap, vfat, etc.) |
| opciones | Opciones de montaje (defaults, noexec, nosuid, etc.) |
| dump | 0 o 1 - si se incluye en copias de seguridad con dump |
| pass | Orden de verificacion con fsck (0=no verificar, 1=raiz, 2=resto) |

### Ejemplo de /etc/fstab

```
UUID=a1b2c3d4   /           ext4    defaults            0   1
UUID=e5f6g7h8   /boot       ext4    defaults            0   2
UUID=i9j0k1l2   /home       ext4    defaults,nosuid     0   2
UUID=m3n4o5p6   /var        ext4    defaults            0   2
UUID=q7r8s9t0   none        swap    sw                  0   0
UUID=ABCD-1234  /boot/efi   vfat    umask=0077          0   1
```

**Nota importante para el examen**: Se recomienda usar UUID en lugar de nombres de dispositivo (/dev/sdX) porque los nombres pueden cambiar al anadir o quitar discos.

---

## Resumen para el examen

1. MBR: maximo 4 primarias, limite 2 TB. GPT: 128 particiones, sin limite practico de tamano.
2. Separar `/home`, `/var`, `/tmp` mejora seguridad y mantenimiento.
3. `/boot` debe ser accesible por el bootloader; ESP es obligatoria en UEFI (FAT32).
4. LVM: PV -> VG -> LV. Permite redimensionado flexible.
5. `fdisk` para MBR, `gdisk` para GPT, `parted` para ambos.
6. Swap: `mkswap` para crear, `swapon`/`swapoff` para activar/desactivar.
7. `/etc/fstab` define el montaje automatico; usar UUID es la practica recomendada.
