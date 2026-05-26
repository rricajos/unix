# 104.3 Controlar el montaje y desmontaje de sistemas de archivos - Teoria

## 1. Concepto de montaje

En Linux, para acceder al contenido de un sistema de archivos (particion, disco USB, imagen ISO, etc.), es necesario **montarlo** en un directorio del arbol de directorios. Este directorio se llama **punto de montaje** (mount point).

El punto de montaje debe:
- Existir previamente como directorio
- Estar preferiblemente vacio (si tiene contenido, este queda oculto mientras haya algo montado)

---

## 2. Comando mount

### 2.1 Uso basico

```bash
# Sintaxis general
mount -t tipo -o opciones dispositivo punto_de_montaje

# Montar una particion ext4
mount /dev/sda1 /mnt/datos

# Montar especificando el tipo
mount -t ext4 /dev/sda1 /mnt/datos

# Montar por UUID
mount UUID="xxxx-xxxx" /mnt/datos

# Ver todos los sistemas montados
mount
# O mejor:
findmnt
```

### 2.2 Opciones de montaje (-o)

Las opciones se especifican con `-o` separadas por comas:

```bash
mount -o ro,noexec,nosuid /dev/sdb1 /mnt/usb
```

**Opciones principales:**

| Opcion | Descripcion |
|--------|-------------|
| `ro` | Solo lectura (read-only) |
| `rw` | Lectura-escritura (predeterminado) |
| `noexec` | No permitir ejecucion de binarios |
| `exec` | Permitir ejecucion (predeterminado) |
| `nosuid` | Ignorar bits SUID y SGID |
| `suid` | Respetar SUID/SGID (predeterminado) |
| `nodev` | No interpretar dispositivos especiales |
| `dev` | Interpretar dispositivos (predeterminado) |
| `auto` | Puede montarse con `mount -a` |
| `noauto` | No montar con `mount -a` (requiere montaje manual) |
| `user` | Permitir a usuarios normales montar (implica noexec, nosuid, nodev) |
| `nouser` | Solo root puede montar (predeterminado) |
| `users` | Cualquier usuario puede montar y desmontar |
| `defaults` | Equivale a `rw,suid,dev,exec,auto,nouser,async` |
| `remount` | Remontar un FS ya montado (cambiar opciones) |
| `loop` | Montar un archivo como dispositivo de bloque (imagenes ISO, etc.) |
| `sync` | Escrituras sincronas (mas seguro, mas lento) |
| `async` | Escrituras asincronas (predeterminado) |
| `noatime` | No actualizar tiempo de acceso (mejora rendimiento) |
| `relatime` | Actualizar atime solo si mtime/ctime es mas reciente |
| `nofail` | No reportar error si el dispositivo no existe al arrancar |

### 2.3 Remontar un sistema de archivos

Para cambiar opciones sin desmontar:

```bash
# Remontar como solo lectura
mount -o remount,ro /mnt/datos

# Remontar la raiz como solo lectura (util para fsck)
mount -o remount,ro /

# Remontar como lectura-escritura
mount -o remount,rw /
```

### 2.4 Montar imagenes ISO con loop

```bash
# Montar una imagen ISO
mount -o loop imagen.iso /mnt/iso

# Equivalente explicito
mount -t iso9660 -o loop imagen.iso /mnt/iso

# Montar imagen de disco
mount -o loop,offset=1048576 disk.img /mnt/disk
```

> **Nota:** La opcion `loop` crea un dispositivo loop (`/dev/loopN`) que trata al archivo como si fuera un dispositivo de bloque.

### 2.5 Montar todo lo de fstab

```bash
# Montar todos los FS listados en /etc/fstab (excepto noauto)
mount -a
```

---

## 3. Comando umount

```bash
# Desmontar por punto de montaje
umount /mnt/datos

# Desmontar por dispositivo
umount /dev/sda1

# Forzar desmontaje (usar con precaucion)
umount -f /mnt/datos

# Lazy unmount: desconecta inmediatamente, limpia cuando ya no este en uso
umount -l /mnt/datos
```

> **Error comun:** Si recibes "target is busy", significa que algun proceso esta usando archivos en ese punto de montaje. Puedes usar `lsof /mnt/datos` o `fuser -mv /mnt/datos` para ver que procesos lo usan.

> **Importante:** El comando es `umount`, NO "unmount" (sin la primera 'n').

---

## 4. /etc/fstab - Montaje automatico al arrancar

### 4.1 Formato

`/etc/fstab` define los sistemas de archivos que se montan automaticamente al arrancar. Tiene **6 campos** separados por espacios o tabulaciones:

```
<dispositivo>  <punto_montaje>  <tipo>  <opciones>  <dump>  <pass>
```

| Campo | Descripcion | Ejemplos |
|-------|-------------|----------|
| **1. Dispositivo** | Que montar (dispositivo, UUID, LABEL) | `/dev/sda1`, `UUID=xxxx`, `LABEL=datos` |
| **2. Punto de montaje** | Donde montar | `/`, `/home`, `/mnt/datos`, `swap` |
| **3. Tipo** | Tipo de sistema de archivos | `ext4`, `xfs`, `vfat`, `swap`, `auto` |
| **4. Opciones** | Opciones de montaje | `defaults`, `ro,noexec`, `defaults,noatime` |
| **5. Dump** | Backup con dump (0=no, 1=si) | `0` o `1` (casi siempre `0`) |
| **6. Pass** | Orden de fsck al arrancar | `0`=no chequear, `1`=primero (raiz), `2`=despues |

### 4.2 Ejemplos de /etc/fstab

```bash
# Particion raiz por UUID
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890  /          ext4  defaults        0  1

# Particion /home
UUID=b2c3d4e5-f6a7-8901-bcde-f12345678901  /home      ext4  defaults        0  2

# Swap
UUID=c3d4e5f6-a7b8-9012-cdef-123456789012  swap       swap  defaults        0  0

# Particion de datos con opciones
/dev/sdb1                                   /datos     xfs   defaults,noatime  0  2

# USB que no se monta automaticamente
LABEL=USBDatos  /mnt/usb  vfat  noauto,user,rw  0  0

# Imagen ISO
/home/user/distro.iso  /mnt/iso  iso9660  loop,ro,noauto  0  0

# Particion Windows NTFS
/dev/sda3  /mnt/windows  ntfs-3g  defaults,uid=1000,gid=1000  0  0

# tmpfs (sistema de archivos en RAM)
tmpfs  /tmp  tmpfs  defaults,noatime,size=2G  0  0
```

### 4.3 Campo pass (orden de fsck)

| Valor | Significado |
|-------|-------------|
| `0` | No verificar con fsck al arrancar |
| `1` | Verificar primero (solo para `/`, la particion raiz) |
| `2` | Verificar despues de la raiz (para el resto de particiones) |

### 4.4 UUID vs nombres de dispositivo

Se recomienda usar **UUID** en lugar de `/dev/sd*` porque:

- Los nombres de dispositivo pueden cambiar al agregar/quitar discos
- El UUID es unico e invariable para cada sistema de archivos
- Es el metodo predeterminado en distribuciones modernas

```bash
# Ver UUIDs
blkid
lsblk -f
```

> **Clave para el examen:** Un fstab mal configurado puede impedir que el sistema arranque correctamente. La opcion `nofail` evita que un dispositivo ausente bloquee el arranque.

---

## 5. Herramientas de consulta

### 5.1 blkid

Muestra UUID, tipo de FS y etiqueta de los dispositivos de bloque.

```bash
# Ver todos los dispositivos
blkid

# Dispositivo especifico
blkid /dev/sda1

# Salida ejemplo:
# /dev/sda1: UUID="a1b2c3d4..." TYPE="ext4" LABEL="root"
```

### 5.2 lsblk

Lista los dispositivos de bloque en formato de arbol.

```bash
# Formato basico
lsblk

# Con sistemas de archivos y UUIDs
lsblk -f

# Con tamanos y tipos
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT

# Solo dispositivos SCSI/SATA
lsblk -S
```

### 5.3 /proc/mounts y /etc/mtab

Ademas de `mount` y `findmnt`, existen dos archivos importantes para consultar los sistemas de archivos montados:

#### /proc/mounts

`/proc/mounts` es un archivo virtual del kernel que muestra los sistemas de archivos **actualmente montados** en tiempo real. Es la fuente mas fiable de informacion sobre montajes.

```bash
cat /proc/mounts                         # Ver todos los montajes actuales
grep "ext4" /proc/mounts                 # Filtrar por tipo de FS
grep "/home" /proc/mounts                # Ver como esta montado /home
```

#### /etc/mtab

`/etc/mtab` es un archivo que tradicionalmente mantiene una lista de los sistemas de archivos montados, similar a `/proc/mounts`. En distribuciones modernas, `/etc/mtab` suele ser un **enlace simbolico a `/proc/mounts`** (o a `/proc/self/mounts`).

```bash
cat /etc/mtab                            # Ver montajes (puede ser enlace a /proc/mounts)
ls -la /etc/mtab                         # Verificar si es un enlace simbolico
# lrwxrwxrwx 1 root root 19 ... /etc/mtab -> ../proc/self/mounts
```

#### Diferencias entre los archivos de montaje

| Archivo | Descripcion | Fiabilidad |
|---------|-------------|------------|
| `/proc/mounts` | Informacion del kernel en tiempo real | La mas fiable |
| `/etc/mtab` | Tradicionalmente mantenido por `mount` (hoy suele ser enlace a /proc/mounts) | Fiable en sistemas modernos |
| `/etc/fstab` | Configuracion de montaje **deseada** (no refleja el estado actual) | Solo configuracion |

> **Para el examen**: `/proc/mounts` es la fuente autoritativa de montajes actuales. `/etc/fstab` es la configuracion deseada pero no necesariamente refleja el estado real. En distribuciones modernas, `/etc/mtab` es generalmente un enlace simbolico a `/proc/self/mounts`.

### 5.4 findmnt

Muestra los sistemas de archivos montados de forma mas clara que `mount`.

```bash
# Todos los montajes
findmnt

# Formato de lista
findmnt -l

# Solo sistemas de archivos reales (no virtuales)
findmnt -t ext4,xfs,btrfs

# Buscar donde esta montado un dispositivo
findmnt /dev/sda1

# Buscar que hay montado en un punto
findmnt /home

# Formato de fstab
findmnt --fstab
```

---

## 6. Unidades de montaje de systemd

En sistemas con systemd, los montajes de `/etc/fstab` se traducen automaticamente a unidades `.mount`. Tambien se pueden crear unidades de montaje manualmente.

### 6.1 Unidades .mount

El nombre de la unidad debe coincidir con la ruta del punto de montaje, reemplazando `/` por `-`.

Ejemplo: para montar en `/mnt/datos`, la unidad seria `mnt-datos.mount`

```ini
# /etc/systemd/system/mnt-datos.mount
[Unit]
Description=Montaje de datos

[Mount]
What=/dev/sdb1
Where=/mnt/datos
Type=ext4
Options=defaults,noatime

[Install]
WantedBy=multi-user.target
```

```bash
# Activar la unidad
systemctl enable mnt-datos.mount
systemctl start mnt-datos.mount

# Ver estado
systemctl status mnt-datos.mount
```

### 6.2 Unidades .automount

Permiten montaje automatico bajo demanda (cuando se accede al directorio).

```ini
# /etc/systemd/system/mnt-datos.automount
[Unit]
Description=Automontaje de datos

[Automount]
Where=/mnt/datos
TimeoutIdleSec=300

[Install]
WantedBy=multi-user.target
```

### 6.3 autofs

`autofs` es un servicio que monta sistemas de archivos automaticamente cuando se accede a ellos y los desmonta tras un periodo de inactividad.

**Archivos de configuracion:**
- `/etc/auto.master` - Archivo maestro que define los puntos de montaje base
- `/etc/auto.*` - Mapas individuales

```bash
# /etc/auto.master
/mnt/auto  /etc/auto.datos  --timeout=60

# /etc/auto.datos
usb     -fstype=vfat,rw     :/dev/sdb1
nfs     -fstype=nfs,rw      servidor:/export/datos
```

Con esta configuracion, acceder a `/mnt/auto/usb` monta automaticamente `/dev/sdb1`.

```bash
# Reiniciar autofs tras cambios
systemctl restart autofs
```

---

## 7. Puntos clave para el examen

1. **`/etc/fstab` tiene 6 campos:** dispositivo, punto de montaje, tipo, opciones, dump, pass.

2. **Pass:** 0 = no chequear, 1 = raiz (primero), 2 = resto (despues).

3. **UUID es preferible** a `/dev/sd*` porque los nombres de dispositivo pueden cambiar.

4. **`mount -o remount,ro /`** remonta la raiz como solo lectura sin desmontar.

5. **`mount -o loop`** permite montar archivos (imagenes ISO) como dispositivos.

6. **`defaults`** equivale a `rw,suid,dev,exec,auto,nouser,async`.

7. **`user`** permite a usuarios normales montar (implica noexec, nosuid, nodev).

8. **`blkid`** muestra UUID, tipo y etiqueta. **`lsblk -f`** muestra arbol con info de FS.

9. **`findmnt`** es la forma moderna de ver montajes (mas legible que `mount`).

10. Las **unidades .mount de systemd** deben nombrarse segun la ruta: `/mnt/datos` -> `mnt-datos.mount`.

11. El comando es **`umount`** (sin 'n'), no "unmount".

12. **`nofail`** en fstab evita que un dispositivo ausente bloquee el arranque.
