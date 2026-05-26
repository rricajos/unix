---
title: "203.1 - Operacion del sistema de archivos"
tags: [lpic-2, examen-201, tema-203, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.1"
---

# 203.1 - Operacion del sistema de archivos

## Introduccion

La gestion correcta de los sistemas de archivos es una competencia esencial para cualquier administrador Linux. Este subtema cubre en profundidad la configuracion de montajes mediante `/etc/fstab`, las opciones avanzadas de montaje, el automontaje con autofs y systemd, y las herramientas de identificacion de dispositivos de bloque.

**Peso del subtema: 4**

## El archivo /etc/fstab

### Estructura y campos

El archivo `/etc/fstab` define los sistemas de archivos que se montan automaticamente durante el arranque. Cada linea tiene seis campos separados por espacios o tabulaciones:

```
<dispositivo>  <punto_montaje>  <tipo_fs>  <opciones>  <dump>  <pass>
```

Ejemplo completo:

```bash
# /etc/fstab
# <dispositivo>                              <montaje>   <tipo>  <opciones>            <dump> <pass>
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890   /           ext4    defaults               1      1
UUID=b2c3d4e5-f6a7-8901-bcde-f12345678901   /home       ext4    defaults,noatime       1      2
UUID=c3d4e5f6-a7b8-9012-cdef-123456789012   /boot       ext4    defaults               1      2
UUID=d4e5f6a7-b8c9-0123-def0-1234567890ab   swap        swap    defaults               0      0
LABEL=datos                                  /datos      xfs     defaults,noexec        0      2
/dev/sr0                                     /media/cdrom iso9660 ro,noauto,user        0      0
tmpfs                                        /tmp        tmpfs   defaults,noatime,size=2G 0    0
192.168.1.10:/exports/share                  /mnt/nfs    nfs     defaults,_netdev       0      0
```

### Descripcion de cada campo

| Campo | Descripcion | Valores comunes |
|---|---|---|
| **Dispositivo** | Identificador del dispositivo | UUID=, LABEL=, /dev/sdXN, ruta NFS |
| **Punto de montaje** | Directorio donde se monta | /, /home, /boot, swap |
| **Tipo FS** | Tipo de sistema de archivos | ext4, xfs, btrfs, swap, nfs, tmpfs |
| **Opciones** | Opciones de montaje separadas por comas | defaults, noatime, ro, noexec |
| **Dump** | Respaldo con dump (0=no, 1=si) | 0 o 1 |
| **Pass** | Orden de fsck (0=no, 1=raiz, 2=otros) | 0, 1 o 2 |

> **Para el examen:** El campo **pass** es critico: `0` significa que no se ejecuta fsck, `1` se reserva para la particion raiz (se verifica primero), y `2` para el resto de particiones (se verifican despues de la raiz, en paralelo si es posible).

### Formas de identificar dispositivos

Existen varias formas de referenciar un dispositivo en fstab:

```bash
# Por UUID (recomendado - unico y persistente)
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890

# Por etiqueta (legible pero puede no ser unica)
LABEL=mi_disco

# Por ruta del dispositivo (puede cambiar entre arranques)
/dev/sda1

# Por ID del dispositivo (persistente)
/dev/disk/by-id/ata-Samsung_SSD_850-part1

# Por ruta del dispositivo (persistente por posicion)
/dev/disk/by-path/pci-0000:00:1f.2-ata-1-part1
```

> **Para el examen:** Usar UUID es la forma recomendada porque es unica por sistema de archivos y no cambia si se reordena el hardware. Los nombres de dispositivo como `/dev/sda1` pueden cambiar si se agregan o remueven discos.

### Opciones de montaje comunes

| Opcion | Descripcion |
|---|---|
| `defaults` | Equivale a rw,suid,dev,exec,auto,nouser,async |
| `auto` / `noauto` | Montar/no montar automaticamente con `mount -a` |
| `ro` / `rw` | Solo lectura / lectura-escritura |
| `exec` / `noexec` | Permitir/prohibir ejecucion de binarios |
| `suid` / `nosuid` | Permitir/prohibir bits SUID/SGID |
| `dev` / `nodev` | Permitir/prohibir dispositivos especiales |
| `user` | Cualquier usuario puede montar (implica noexec,nosuid,nodev) |
| `users` | Cualquier usuario puede montar y desmontar |
| `noatime` | No actualizar tiempo de acceso (mejora rendimiento) |
| `relatime` | Actualizar atime solo si es anterior a mtime |
| `nodiratime` | No actualizar atime en directorios |
| `sync` / `async` | Escritura sincrona / asincrona |
| `_netdev` | Indica que el dispositivo requiere red |
| `nofail` | No reportar error si el dispositivo no existe |
| `x-systemd.automount` | Habilitar automontaje con systemd |

## Comandos mount y umount

### mount - Montar sistemas de archivos

```bash
# Montar un dispositivo con deteccion automatica del tipo
mount /dev/sdb1 /mnt/datos

# Montar especificando el tipo de sistema de archivos
mount -t ext4 /dev/sdb1 /mnt/datos

# Montar con opciones especificas
mount -o ro,noexec /dev/sdb1 /mnt/datos

# Montar todo lo definido en /etc/fstab
mount -a

# Montar solo los de un tipo especifico
mount -a -t ext4

# Ver todos los sistemas de archivos montados
mount
# O con formato mas legible:
findmnt
```

### Opciones avanzadas de mount

#### Montaje bind (enlace)

Permite montar un directorio en otra ubicacion, haciendo que el mismo contenido sea accesible desde dos rutas:

```bash
# Montaje bind basico
mount --bind /var/www /home/usuario/web

# Equivalente con -o
mount -o bind /var/www /home/usuario/web

# Bind recursivo (incluye submontajes)
mount --rbind /dev /mnt/dev

# En /etc/fstab
/var/www  /home/usuario/web  none  bind  0  0
```

#### Montaje loop (imagenes de disco)

Permite montar archivos de imagen como si fueran dispositivos:

```bash
# Montar una imagen ISO
mount -o loop imagen.iso /mnt/iso

# Montar una imagen de disco con particion
mount -o loop,offset=$((512*2048)) disco.img /mnt/disco

# Crear y montar un sistema de archivos en archivo
dd if=/dev/zero of=/tmp/filesystem.img bs=1M count=100
mkfs.ext4 /tmp/filesystem.img
mount -o loop /tmp/filesystem.img /mnt/loop

# En /etc/fstab
/ruta/imagen.iso  /mnt/iso  iso9660  loop,ro  0  0
```

#### Remontaje

Permite cambiar las opciones de un sistema de archivos ya montado:

```bash
# Remontar en lectura/escritura
mount -o remount,rw /

# Remontar en solo lectura
mount -o remount,ro /datos

# Remontar con opciones adicionales
mount -o remount,noexec,nosuid /tmp
```

### umount - Desmontar sistemas de archivos

```bash
# Desmontar por punto de montaje
umount /mnt/datos

# Desmontar por dispositivo
umount /dev/sdb1

# Forzar desmontaje (puede causar perdida de datos)
umount -f /mnt/datos

# Desmontaje perezoso (desconecta y limpia cuando no este en uso)
umount -l /mnt/datos

# Desmontar todos los sistemas de archivos de un tipo
umount -a -t nfs
```

> **Para el examen:** `umount -l` (lazy) es util cuando un sistema de archivos esta ocupado. Desvincula inmediatamente el punto de montaje pero retrasa la limpieza real hasta que no haya procesos usandolo. `umount -f` fuerza el desmontaje pero puede causar perdida de datos.

## Automontaje con autofs

### Introduccion a autofs

`autofs` es un servicio que monta automaticamente sistemas de archivos cuando se accede a ellos y los desmonta despues de un periodo de inactividad. Esto es especialmente util para recursos de red (NFS, CIFS) y medios extraibles.

### Configuracion de autofs

**Archivo maestro** (`/etc/auto.master` o `/etc/auto.master.d/*.autofs`):

```bash
# /etc/auto.master
# <punto_montaje>  <mapa>            <opciones>
/mnt/nfs            /etc/auto.nfs     --timeout=60
/mnt/misc           /etc/auto.misc
/home               /etc/auto.home    --timeout=300

# Incluir archivos adicionales
+auto.master

# Directorio de configuracion adicional
# /etc/auto.master.d/*.autofs
```

**Archivos de mapa** (definen los montajes individuales):

```bash
# /etc/auto.nfs
# <clave>    <opciones>     <ubicacion>
datos        -fstype=nfs,rw  servidor:/exports/datos
backup       -fstype=nfs,ro  servidor:/exports/backup
proyectos    -fstype=nfs,rw  servidor:/exports/proyectos

# /etc/auto.misc
cdrom        -fstype=iso9660,ro,nosuid,nodev  :/dev/sr0
usb          -fstype=auto,rw,nosuid,nodev     :/dev/sdb1
```

**Funcionamiento:**
- Cuando un usuario accede a `/mnt/nfs/datos`, autofs monta automaticamente `servidor:/exports/datos` en `/mnt/nfs/datos`
- Despues de 60 segundos de inactividad, el sistema de archivos se desmonta automaticamente

```bash
# Gestionar el servicio autofs
systemctl enable autofs
systemctl start autofs
systemctl restart autofs

# Verificar montajes activos de autofs
ls /mnt/nfs/
```

### Mapas con comodines

```bash
# /etc/auto.home
# Monta automaticamente /home/<usuario> desde el servidor NFS
*    -fstype=nfs,rw    servidor:/home/&
```

El `*` coincide con cualquier nombre y `&` se reemplaza con el nombre coincidente. Asi, acceder a `/home/juan` montaria `servidor:/home/juan`.

> **Para el examen:** En autofs, el archivo maestro (`/etc/auto.master`) define los puntos de montaje y referencia los archivos de mapa. Los archivos de mapa definen las claves individuales (subdirectorios) con sus opciones y ubicaciones de origen.

## Unidades de montaje en systemd

### mount units (.mount)

systemd puede gestionar montajes directamente a traves de unidades `.mount`. El nombre de la unidad debe corresponder a la ruta del punto de montaje con barras reemplazadas por guiones.

```ini
# /etc/systemd/system/mnt-datos.mount
[Unit]
Description=Montaje de datos
After=network.target

[Mount]
What=/dev/sdb1
Where=/mnt/datos
Type=ext4
Options=defaults,noatime

[Install]
WantedBy=multi-user.target
```

```bash
# Activar y habilitar la unidad de montaje
systemctl start mnt-datos.mount
systemctl enable mnt-datos.mount

# Verificar estado
systemctl status mnt-datos.mount
```

### automount units (.automount)

Las unidades `.automount` implementan automontaje similar a autofs:

```ini
# /etc/systemd/system/mnt-datos.automount
[Unit]
Description=Automontaje de datos

[Automount]
Where=/mnt/datos
TimeoutIdleSec=120

[Install]
WantedBy=multi-user.target
```

```bash
# La unidad .mount correspondiente debe existir
# Habilitar el automontaje
systemctl enable mnt-datos.automount
systemctl start mnt-datos.automount
```

> **Para el examen:** En systemd, una unidad `.automount` siempre necesita una unidad `.mount` correspondiente. El nombre debe coincidir y corresponder al punto de montaje (ejemplo: `/mnt/datos` se traduce a `mnt-datos.mount` y `mnt-datos.automount`).

### Opciones de fstab para systemd

```bash
# En /etc/fstab, opciones especificas de systemd:
/dev/sdb1  /mnt/datos  ext4  defaults,x-systemd.automount,x-systemd.idle-timeout=120  0  2
```

| Opcion fstab | Funcion |
|---|---|
| `x-systemd.automount` | Habilita automontaje via systemd |
| `x-systemd.idle-timeout=` | Tiempo antes de desmontar automaticamente |
| `x-systemd.device-timeout=` | Tiempo de espera para que el dispositivo aparezca |
| `x-systemd.requires=` | Dependencia de otra unidad |
| `x-systemd.after=` | Ordenacion respecto a otra unidad |

## Herramientas de identificacion de dispositivos

### blkid

Muestra atributos de dispositivos de bloque (UUID, tipo de filesystem, etiqueta):

```bash
# Mostrar todos los dispositivos
blkid

# Mostrar un dispositivo especifico
blkid /dev/sda1

# Salida formateada
blkid -o list

# Buscar por UUID
blkid -U "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

# Buscar por etiqueta
blkid -L "datos"
```

### findmnt

Muestra los sistemas de archivos montados en formato de arbol:

```bash
# Mostrar todos los montajes en arbol
findmnt

# Buscar un punto de montaje especifico
findmnt /home

# Buscar por dispositivo
findmnt -S /dev/sda1

# Buscar por tipo
findmnt -t ext4

# Formato tabla con columnas especificas
findmnt -o TARGET,SOURCE,FSTYPE,OPTIONS

# Mostrar solo montajes de fstab
findmnt --fstab

# Modo en tiempo real (monitorear cambios)
findmnt --poll
```

### lsblk

Lista informacion sobre dispositivos de bloque:

```bash
# Listar todos los dispositivos de bloque
lsblk

# Con informacion del sistema de archivos
lsblk -f

# Con informacion de tamano y tipo
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,UUID

# Mostrar solo discos (sin particiones)
lsblk -d

# Formato JSON
lsblk -J
```

> **Para el examen:** `blkid` es la herramienta principal para obtener UUIDs y etiquetas de particiones. `findmnt` es la forma moderna de ver montajes (reemplaza a `mount` sin argumentos). `lsblk` proporciona una vista jerarquica de discos y particiones.

## Resumen de archivos y directorios clave

| Recurso | Funcion |
|---|---|
| `/etc/fstab` | Definicion de montajes automaticos del sistema |
| `/etc/auto.master` | Archivo maestro de autofs |
| `/etc/auto.misc` | Mapa de montajes miscelaneos de autofs |
| `/etc/auto.master.d/` | Directorio de configuracion adicional de autofs |
| `/etc/systemd/system/*.mount` | Unidades de montaje systemd |
| `/etc/systemd/system/*.automount` | Unidades de automontaje systemd |
| `/proc/mounts` | Montajes actuales del sistema (kernel) |
| `/etc/mtab` | Tabla de montajes (enlace a /proc/mounts) |
| `/dev/disk/by-uuid/` | Enlaces simbolicos a dispositivos por UUID |
| `/dev/disk/by-label/` | Enlaces simbolicos a dispositivos por etiqueta |
| `/dev/disk/by-id/` | Enlaces simbolicos a dispositivos por ID hardware |
