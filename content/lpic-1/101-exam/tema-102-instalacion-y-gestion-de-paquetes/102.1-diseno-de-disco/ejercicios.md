---
title: "102.1 - Diseno de disco duro: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.1"
---

# 102.1 - Diseno de disco duro: Ejercicios

## Ejercicio 1
**Un disco con tabla de particiones MBR tiene actualmente 3 particiones primarias. Necesitas crear 4 particiones mas. Cual es la solucion correcta?**

<details>
<summary>Ver respuesta</summary>

Debes crear una particion extendida como 4a particion primaria, y dentro de ella crear las 4 particiones logicas necesarias. MBR permite maximo 4 particiones primarias. Al convertir la 4a en extendida, puedes crear multiples logicas dentro de ella. Las particiones logicas se numeran a partir del 5 (sda5, sda6, etc.).
</details>

---

## Ejercicio 2
**Cual es la principal diferencia entre MBR y GPT en cuanto a tamano maximo de disco soportado? Que esquema usarias en un disco de 4 TB?**

<details>
<summary>Ver respuesta</summary>

- **MBR** soporta un maximo de **2 TB** (2^32 sectores x 512 bytes).
- **GPT** soporta discos de hasta **8 ZB** (zettabytes) teoricos.

Para un disco de 4 TB se **debe** usar GPT, ya que MBR no puede direccionar mas alla de 2 TB. Ademas, GPT ofrece ventajas como redundancia de la tabla de particiones y verificacion CRC32.
</details>

---

## Ejercicio 3
**En un servidor web con alto trafico que genera muchos logs, que directorios recomendarias separar en particiones independientes y por que?**

<details>
<summary>Ver respuesta</summary>

Se recomienda separar al menos:

1. **`/var`** - Contiene los logs del servidor web (Apache/Nginx), cache y datos variables. Si los logs crecen sin control, no afectaran al resto del sistema.
2. **`/tmp`** - Los archivos temporales de las conexiones no llenaran la raiz. Se puede montar con `noexec` para mayor seguridad.
3. **`/home`** - Separar datos de usuarios protege ante reinstalaciones.
4. **`/boot`** - Particion pequena para garantizar el arranque.

La razon principal de separar `/var` es que si se llena (por logs excesivos), el sistema raiz `/` sigue teniendo espacio disponible y el sistema no se bloquea.
</details>

---

## Ejercicio 4
**Que es la EFI System Partition (ESP)? Que sistema de archivos debe tener y donde se monta tipicamente en Linux?**

<details>
<summary>Ver respuesta</summary>

La **EFI System Partition (ESP)** es una particion obligatoria en sistemas con firmware UEFI. Contiene los cargadores de arranque (.efi) de los sistemas operativos instalados.

- **Sistema de archivos**: debe ser **FAT32** (obligatorio segun la especificacion UEFI).
- **Punto de montaje tipico**: `/boot/efi`.
- **Tamano recomendado**: 100 - 550 MB.
- **Tipo de particion GPT**: `EF00`.
- Cada sistema operativo instala su cargador en un subdirectorio propio, por ejemplo `/boot/efi/EFI/ubuntu/`.
</details>

---

## Ejercicio 5
**Explica los tres componentes principales de LVM (PV, VG, LV) y describe el proceso para crear un volumen logico desde cero usando dos discos.**

<details>
<summary>Ver respuesta</summary>

Los tres componentes de LVM son:

1. **PV (Physical Volume)**: particion o disco fisico inicializado para LVM con `pvcreate`.
2. **VG (Volume Group)**: agrupacion de uno o mas PVs que forman un pool de almacenamiento.
3. **LV (Logical Volume)**: "particion virtual" creada dentro de un VG, sobre la cual se crea el sistema de archivos.

Proceso con dos discos (`/dev/sdb1` y `/dev/sdc1`):

```bash
# 1. Crear volumenes fisicos
pvcreate /dev/sdb1 /dev/sdc1

# 2. Crear grupo de volumenes
vgcreate mi_vg /dev/sdb1 /dev/sdc1

# 3. Crear volumen logico de 100 GB
lvcreate -n mi_lv -L 100G mi_vg

# 4. Crear sistema de archivos
mkfs.ext4 /dev/mi_vg/mi_lv

# 5. Montar
mount /dev/mi_vg/mi_lv /datos
```
</details>

---

## Ejercicio 6
**Tienes un sistema con 4 GB de RAM que necesita soporte para hibernacion. Cuanto espacio de swap recomiendas? Escribe los comandos para crear y activar una particion swap en `/dev/sda3`.**

<details>
<summary>Ver respuesta</summary>

Para hibernacion, el espacio de swap debe ser **al menos igual al tamano de la RAM**, ya que la hibernacion vuelca todo el contenido de la RAM al swap. Con 4 GB de RAM, se recomienda un swap de **al menos 4 GB** (idealmente un poco mas, como 5-6 GB).

Comandos:

```bash
# Formatear la particion como swap
mkswap /dev/sda3

# Activar el swap
swapon /dev/sda3

# Verificar que esta activo
swapon --show
free -h

# Para que sea permanente, anadir a /etc/fstab:
# UUID=<uuid-de-sda3>  none  swap  sw  0  0
```
</details>

---

## Ejercicio 7
**Que herramienta usarias para particionar un disco GPT: `fdisk`, `gdisk` o `parted`? Cual es la diferencia principal entre `parted` y las otras dos?**

<details>
<summary>Ver respuesta</summary>

Para discos GPT se puede usar tanto **`gdisk`** como **`parted`**:

- **`gdisk`**: diseñado especificamente para GPT. Interfaz similar a fdisk.
- **`parted`**: soporta tanto MBR como GPT.
- **`fdisk`**: tradicionalmente solo MBR, aunque versiones modernas soportan GPT.

La **diferencia principal** de `parted` respecto a `fdisk`/`gdisk` es que `parted` **aplica los cambios inmediatamente** al ejecutar cada comando, mientras que `fdisk` y `gdisk` no escriben los cambios hasta que se pulsa `w` (write). Esto hace que `parted` sea mas peligroso si se comete un error, ya que no se pueden deshacer los cambios.
</details>

---

## Ejercicio 8
**Escribe una linea de `/etc/fstab` para montar la particion `/dev/sda2` (UUID: a1b2-c3d4) en `/home` con sistema de archivos ext4, opciones por defecto con `nosuid`, que se verifique con fsck despues de la raiz.**

<details>
<summary>Ver respuesta</summary>

```
UUID=a1b2-c3d4   /home   ext4   defaults,nosuid   0   2
```

Explicacion de cada campo:
- `UUID=a1b2-c3d4` - Identificacion por UUID (mas fiable que /dev/sdX)
- `/home` - Punto de montaje
- `ext4` - Sistema de archivos
- `defaults,nosuid` - Opciones por defecto mas la restriccion de no permitir bits SUID
- `0` - No incluir en copias con dump
- `2` - Verificar con fsck despues de la raiz (que tiene pass=1)
</details>
