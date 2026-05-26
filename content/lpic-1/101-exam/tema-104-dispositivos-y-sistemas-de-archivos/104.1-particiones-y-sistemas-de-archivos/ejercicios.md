---
title: "104.1 Crear particiones y sistemas de archivos - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.1"
---

# 104.1 Crear particiones y sistemas de archivos - Ejercicios

## Ejercicio 1
**Un disco tiene tabla de particiones MBR y ya tiene 3 particiones primarias. Necesitas crear 3 particiones mas. ¿Como lo harias?**

<details>
<summary>Ver respuesta</summary>

Crearias la 4ta particion como **extendida** (no primaria), y dentro de ella crearias 3 **particiones logicas**. Las particiones logicas se numerarian como 5, 6 y 7 (las logicas siempre empiezan en 5, independientemente del numero de primarias).

```bash
fdisk /dev/sda
# n -> e (extendida) para la 4ta particion
# n -> l (logica) para crear sda5, sda6, sda7
# w -> guardar
```

</details>

---

## Ejercicio 2
**¿Cual es el comando correcto para crear un sistema de archivos ext4 en `/dev/sdb1`? Da dos formas equivalentes.**

<details>
<summary>Ver respuesta</summary>

```bash
# Forma 1:
mkfs.ext4 /dev/sdb1

# Forma 2:
mkfs -t ext4 /dev/sdb1
```

Ambas formas son equivalentes. La primera invoca directamente `mkfs.ext4`, la segunda usa `mkfs` con la opcion `-t` para especificar el tipo.

</details>

---

## Ejercicio 3
**¿Que diferencia fundamental hay entre `fdisk` y `parted` respecto a cuando se aplican los cambios?**

<details>
<summary>Ver respuesta</summary>

- **fdisk** (y gdisk): Los cambios se almacenan en memoria y **no se aplican hasta ejecutar el comando `w`** (write). Se puede salir sin guardar con `q`.
- **parted**: Los cambios se aplican **inmediatamente** al ejecutar cada comando. No hay opcion de "deshacer" o "salir sin guardar".

Esta es una diferencia critica para el examen.

</details>

---

## Ejercicio 4
**Describe los pasos para crear un archivo swap de 2 GB y activarlo.**

<details>
<summary>Ver respuesta</summary>

```bash
# 1. Crear el archivo de 2 GB
dd if=/dev/zero of=/swapfile bs=1M count=2048

# 2. Establecer permisos seguros (solo root)
chmod 600 /swapfile

# 3. Formatear como swap
mkswap /swapfile

# 4. Activar el swap
swapon /swapfile

# 5. Verificar
swapon --show
free -h
```

Para hacerlo permanente, agregar en `/etc/fstab`:
```
/swapfile   swap   swap   defaults   0   0
```

</details>

---

## Ejercicio 5
**¿Que codigo hexadecimal de tipo de particion MBR corresponde a cada uno de estos usos?**
- a) Particion Linux normal
- b) Particion swap
- c) Particion LVM

<details>
<summary>Ver respuesta</summary>

| Uso | Codigo hexadecimal |
|-----|-------------------|
| a) Linux normal | `83` |
| b) Linux swap | `82` |
| c) Linux LVM | `8e` |

Estos codigos se establecen con el comando `t` dentro de `fdisk`.

</details>

---

## Ejercicio 6
**Enumera 3 diferencias clave entre MBR y GPT.**

<details>
<summary>Ver respuesta</summary>

| Caracteristica | MBR | GPT |
|---------------|-----|-----|
| **Particiones maximas** | 4 primarias (o 3 + extendida con logicas) | 128 por defecto |
| **Tamano max de disco** | 2 TB | 9.4 ZB |
| **Tipos de particion** | Primaria, extendida y logica | Todas iguales (sin distincion) |

Otras diferencias: GPT incluye CRC32 para deteccion de errores, guarda una copia de respaldo de la tabla al final del disco, y cada particion tiene un GUID unico.

</details>

---

## Ejercicio 7
**¿Que sistema de archivos usarias en cada situacion? Justifica.**
- a) Particion `/boot` en un sistema antiguo
- b) Servidor de archivos con ficheros muy grandes (RHEL)
- c) Unidad USB que debe leerse en Windows, macOS y Linux
- d) Sistema que necesita snapshots nativos y RAID por software integrado

<details>
<summary>Ver respuesta</summary>

| Situacion | FS recomendado | Justificacion |
|-----------|---------------|---------------|
| a) `/boot` antiguo | **ext2** | Sin journaling, simple, ampliamente soportado por bootloaders |
| b) Servidor RHEL con archivos grandes | **XFS** | Alto rendimiento con archivos grandes, default en RHEL 7+ |
| c) USB multiplataforma | **VFAT (FAT32)** o **exFAT** | VFAT si archivos < 4GB, exFAT si > 4GB. Compatibilidad universal |
| d) Snapshots y RAID integrado | **Btrfs** | Soporte nativo de snapshots, compresion y RAID integrado |

</details>

---

## Ejercicio 8
**Un disco NVMe es el segundo controlador NVMe del sistema. ¿Como se llamaria el dispositivo y su tercera particion en `/dev/`?**

<details>
<summary>Ver respuesta</summary>

- Dispositivo: **`/dev/nvme1n1`** (segundo controlador = nvme1, primer namespace = n1)
- Tercera particion: **`/dev/nvme1n1p3`**

La nomenclatura NVMe es: `nvme[controlador]n[namespace]p[particion]`

Recordar que en SATA seria `/dev/sdb3` para la tercera particion del segundo disco, pero NVMe usa un esquema diferente con controlador, namespace y particion.

</details>
