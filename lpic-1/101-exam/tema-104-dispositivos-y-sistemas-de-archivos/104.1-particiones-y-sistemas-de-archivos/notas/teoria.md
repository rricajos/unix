# 104.1 Crear particiones y sistemas de archivos - Teoria

## 1. Dispositivos de bloque en Linux

En Linux, los discos y particiones se representan como archivos especiales de dispositivo en `/dev/`.

### Nomenclatura de dispositivos

| Dispositivo | Descripcion |
|-------------|-------------|
| `/dev/sda` | Primer disco SATA/SCSI/USB |
| `/dev/sdb` | Segundo disco SATA/SCSI/USB |
| `/dev/sda1` | Primera particion del primer disco |
| `/dev/sda2` | Segunda particion del primer disco |
| `/dev/nvme0n1` | Primer disco NVMe |
| `/dev/nvme0n1p1` | Primera particion del primer disco NVMe |
| `/dev/vda` | Primer disco virtual (KVM/virtio) |
| `/dev/hda` | Disco IDE legacy (obsoleto) |

> **Nota para el examen:** Los discos SATA usan la nomenclatura `sd*`, los NVMe usan `nvme*n*p*`. Las particiones se numeran con sufijos numericos.

---

## 2. Esquemas de particionado: MBR vs GPT

### 2.1 MBR (Master Boot Record)

El MBR se encuentra en los primeros 512 bytes del disco. Es el esquema tradicional.

**Caracteristicas:**
- Maximo **4 particiones primarias**
- O bien **3 primarias + 1 extendida** (que contiene particiones logicas)
- Tamano maximo de disco: **2 TB**
- Las particiones logicas empiezan desde el numero **5** (ej: `/dev/sda5`)

**Tipos de particiones MBR:**

| Tipo | Descripcion |
|------|-------------|
| **Primaria** | Hasta 4 por disco, directamente en la tabla MBR |
| **Extendida** | Contenedor para particiones logicas. Solo puede haber 1. |
| **Logica** | Dentro de la extendida. Numeradas a partir de 5. |

**Codigos de tipo de particion importantes:**

| Codigo hex | Tipo |
|-----------|------|
| `83` | Linux (ext2/ext3/ext4, etc.) |
| `82` | Linux swap |
| `8e` | Linux LVM |
| `fd` | Linux RAID autodetect |
| `05` | Extendida |
| `07` | NTFS/HPFS |
| `0b` / `0c` | FAT32 |

### 2.2 GPT (GUID Partition Table)

GPT es el esquema moderno asociado a UEFI.

**Caracteristicas:**
- Hasta **128 particiones** (por defecto, ampliable)
- Sin distincion entre primaria/extendida/logica
- Tamano maximo de disco: **9.4 ZB** (zettabytes)
- Cada particion tiene un GUID unico
- Incluye CRC32 para deteccion de errores
- Mantiene una copia de respaldo de la tabla al final del disco
- Requiere **UEFI** para arrancar (aunque puede usarse con BIOS mediante protective MBR)

> **Dato clave para el examen:** GPT no tiene el concepto de particiones extendidas ni logicas. Todas las particiones son iguales.

---

## 3. Herramientas de particionado

### 3.1 fdisk (para MBR, tambien GPT en versiones modernas)

`fdisk` es la herramienta clasica e interactiva para gestionar particiones MBR.

```bash
# Abrir disco para editar
fdisk /dev/sda

# Listar particiones de todos los discos
fdisk -l

# Listar particiones de un disco especifico
fdisk -l /dev/sda
```

**Comandos internos de fdisk:**

| Comando | Accion |
|---------|--------|
| `m` | Mostrar ayuda |
| `p` | Imprimir tabla de particiones |
| `n` | Crear nueva particion |
| `d` | Eliminar particion |
| `t` | Cambiar tipo de particion |
| `l` | Listar tipos de particion conocidos |
| `w` | Escribir cambios y salir |
| `q` | Salir sin guardar |
| `a` | Cambiar flag de arranque (bootable) |

> **Importante:** Los cambios NO se aplican hasta que se usa `w`. Se puede salir sin guardar con `q`.

### 3.2 gdisk (para GPT)

`gdisk` es el equivalente de `fdisk` para tablas de particiones GPT.

```bash
# Abrir disco GPT para editar
gdisk /dev/sda

# Listar particiones
gdisk -l /dev/sda
```

**Comandos internos de gdisk:**

| Comando | Accion |
|---------|--------|
| `p` | Imprimir tabla de particiones |
| `n` | Crear nueva particion |
| `d` | Eliminar particion |
| `t` | Cambiar tipo de particion |
| `l` | Listar tipos de particion |
| `w` | Escribir cambios y salir |
| `q` | Salir sin guardar |
| `i` | Informacion detallada de una particion |
| `o` | Crear nueva tabla GPT vacia |

### 3.3 parted (MBR y GPT)

`parted` es una herramienta mas avanzada que soporta tanto MBR como GPT. **A diferencia de fdisk/gdisk, los cambios se aplican inmediatamente.**

```bash
# Modo interactivo
parted /dev/sda

# Listar particiones
parted /dev/sda print

# Crear tabla de particiones GPT
parted /dev/sda mklabel gpt

# Crear tabla de particiones MBR
parted /dev/sda mklabel msdos

# Crear particion
parted /dev/sda mkpart primary ext4 1MiB 500MiB

# Eliminar particion
parted /dev/sda rm 1
```

> **Advertencia para el examen:** `parted` aplica cambios de forma **inmediata** (no espera a un "write"). Esto es una diferencia clave respecto a `fdisk` y `gdisk`.

---

## 4. Crear sistemas de archivos (mkfs)

### 4.1 Sintaxis general

```bash
mkfs -t tipo /dev/sdXN
# Equivalente a:
mkfs.tipo /dev/sdXN
```

### 4.2 Sistemas de archivos Linux

#### ext2
- Sin journaling
- Adecuado para particiones pequenas como `/boot`
- Rapido en lecturas

```bash
mkfs.ext2 /dev/sda1
mkfs -t ext2 /dev/sda1
```

#### ext3
- ext2 + journaling
- Compatible hacia atras con ext2
- Mejora la recuperacion tras fallos

```bash
mkfs.ext3 /dev/sda2
```

#### ext4
- **Sistema de archivos Linux por defecto** en muchas distribuciones
- Soporta volumenes de hasta 1 EB (exabyte)
- Archivos de hasta 16 TB
- Extents (mejora el rendimiento con archivos grandes)
- Journaling mejorado

```bash
mkfs.ext4 /dev/sda3
mkfs -t ext4 /dev/sda3
```

#### XFS
- Alto rendimiento, especialmente con archivos grandes
- No se puede reducir (solo ampliar)
- Usado por defecto en RHEL/CentOS 7+
- Excelente journaling

```bash
mkfs.xfs /dev/sda4
```

#### Btrfs
- Sistema de archivos moderno con funciones avanzadas
- Soporta snapshots, compresion, RAID integrado
- Puede abarcar multiples dispositivos
- Subvolumenes

```bash
mkfs.btrfs /dev/sda5

# Crear Btrfs con multiples dispositivos
mkfs.btrfs /dev/sdb /dev/sdc
```

#### VFAT (FAT32)
- Compatible con Windows, macOS, Linux
- Usado en particiones EFI System Partition (ESP)
- Limite de archivo: 4 GB

```bash
mkfs.vfat /dev/sda6
mkfs -t vfat /dev/sda6

# Especificar FAT32 explicitamente
mkfs.vfat -F 32 /dev/sda6
```

#### exFAT
- Version mejorada de FAT sin limite de 4 GB
- Ideal para medios extraibles grandes

```bash
mkfs.exfat /dev/sda7
```

### 4.3 Tabla resumen de sistemas de archivos

| FS | Journaling | Tamano max volumen | Tamano max archivo | Notas |
|----|-----------|--------------------|--------------------|-------|
| ext2 | No | 32 TB | 2 TB | Sin journal, bueno para /boot |
| ext3 | Si | 32 TB | 2 TB | ext2 + journal |
| ext4 | Si | 1 EB | 16 TB | Default en muchas distros |
| XFS | Si | 8 EB | 8 EB | No se puede reducir |
| Btrfs | Si (CoW) | 16 EB | 16 EB | Snapshots, multi-dispositivo |
| VFAT | No | 2 TB | 4 GB | Compatibilidad universal |
| exFAT | No | 128 PB | 16 EB | Medios extraibles grandes |

---

## 5. Gestion del espacio swap

El swap es espacio en disco usado como extension de la RAM cuando esta se agota.

### 5.1 Crear particion swap

```bash
# 1. Crear la particion con fdisk (tipo 82)
fdisk /dev/sda
# -> n (nueva), seleccionar tamano
# -> t (tipo), codigo 82

# 2. Formatear como swap
mkswap /dev/sda2

# 3. Activar
swapon /dev/sda2

# 4. Verificar
swapon --show
# o
cat /proc/swaps
free -h
```

### 5.2 Crear archivo swap

```bash
# 1. Crear archivo de tamano fijo (ej: 1 GB)
dd if=/dev/zero of=/swapfile bs=1M count=1024

# O con fallocate (mas rapido, pero no siempre soportado para swap)
fallocate -l 1G /swapfile

# 2. Establecer permisos seguros
chmod 600 /swapfile

# 3. Formatear como swap
mkswap /swapfile

# 4. Activar
swapon /swapfile
```

### 5.3 Hacer swap permanente

Para que el swap persista tras reiniciar, se agrega a `/etc/fstab`:

```
/dev/sda2   swap   swap   defaults   0   0
# O con UUID:
UUID=xxxx   swap   swap   defaults   0   0
# O para archivo:
/swapfile   swap   swap   defaults   0   0
```

### 5.4 Desactivar swap

```bash
# Desactivar una particion/archivo swap especifico
swapoff /dev/sda2
swapoff /swapfile

# Desactivar todo el swap
swapoff -a
```

### 5.5 Prioridad del swap

Se puede establecer la prioridad del swap (mayor numero = mayor prioridad):

```bash
swapon -p 10 /dev/sda2
```

En `/etc/fstab`:
```
/dev/sda2   swap   swap   defaults,pri=10   0   0
```

---

## 6. Puntos clave para el examen

1. **MBR vs GPT:** MBR soporta hasta 4 particiones primarias y discos de hasta 2 TB. GPT soporta 128+ particiones y discos enormes.

2. **Codigos de tipo MBR:** 82 = swap, 83 = Linux, 8e = LVM.

3. **parted aplica cambios inmediatamente**, fdisk y gdisk no (hasta que se ejecuta `w`).

4. **Nomenclatura de dispositivos:** `sd*` para SATA/SCSI/USB, `nvme*n*p*` para NVMe, `vd*` para virtio.

5. **ext4** es el FS por defecto en la mayoria de distribuciones Linux. **XFS** es el default en RHEL/CentOS 7+.

6. **XFS no se puede reducir**, solo ampliar.

7. **Btrfs** soporta multiples dispositivos y snapshots nativos.

8. **mkswap** formatea, **swapon** activa, **swapoff** desactiva.

9. **VFAT/FAT32** se usa para la particion EFI (ESP).

10. Las particiones logicas siempre empiezan en **5** (sda5, sda6...) independientemente de cuantas primarias haya.
