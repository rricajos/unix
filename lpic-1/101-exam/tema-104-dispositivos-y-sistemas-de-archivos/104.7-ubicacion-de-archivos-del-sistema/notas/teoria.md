# 104.7 Encontrar archivos del sistema y su ubicacion correcta - Teoria

## 1. FHS - Filesystem Hierarchy Standard

El **FHS** (Filesystem Hierarchy Standard) es un estandar que define la estructura de directorios y su contenido en sistemas Linux/Unix. Su objetivo es garantizar la interoperabilidad entre distribuciones.

### 1.1 Directorio raiz (/)

Todo parte del directorio raiz `/`. Todos los demas directorios son subdirectorios de este.

### 1.2 Directorios principales del FHS

#### Directorios esenciales del sistema

| Directorio | Contenido | Notas |
|-----------|-----------|-------|
| `/bin` | Binarios esenciales del sistema | Comandos basicos para todos los usuarios (ls, cp, cat, etc.) |
| `/sbin` | Binarios esenciales de administracion | Comandos de administracion (fdisk, fsck, iptables, etc.) |
| `/lib` | Bibliotecas compartidas esenciales | Librerias para binarios de /bin y /sbin |
| `/lib64` | Bibliotecas de 64 bits | En sistemas de 64 bits |

> **UsrMerge:** En distribuciones modernas (Fedora, Debian 12+, Ubuntu 22.04+, Arch), `/bin`, `/sbin`, `/lib` y `/lib64` son **enlaces simbolicos** a sus equivalentes en `/usr/`. Es decir:
> - `/bin` -> `/usr/bin`
> - `/sbin` -> `/usr/sbin`
> - `/lib` -> `/usr/lib`
> - `/lib64` -> `/usr/lib64`
>
> Esto se conoce como **UsrMerge** y simplifica la estructura del sistema.

#### Directorio /usr (Unix System Resources)

| Directorio | Contenido |
|-----------|-----------|
| `/usr` | Jerarquia secundaria para datos de solo lectura del usuario |
| `/usr/bin` | Binarios de usuario no esenciales para el arranque |
| `/usr/sbin` | Binarios de administracion no esenciales |
| `/usr/lib` | Bibliotecas para /usr/bin y /usr/sbin |
| `/usr/local` | Jerarquia terciaria para software instalado localmente |
| `/usr/local/bin` | Binarios instalados localmente por el admin |
| `/usr/local/sbin` | Binarios admin instalados localmente |
| `/usr/local/lib` | Librerias instaladas localmente |
| `/usr/share` | Datos independientes de la arquitectura (man pages, iconos, etc.) |
| `/usr/src` | Codigo fuente (ej: headers del kernel) |
| `/usr/include` | Headers para compilacion en C/C++ |

> **`/usr/local`** es para software compilado e instalado manualmente por el administrador (no gestionado por el gestor de paquetes). Tiene su propia estructura bin/, sbin/, lib/, etc.

#### Directorio /etc (configuracion)

| Directorio | Contenido |
|-----------|-----------|
| `/etc` | Archivos de configuracion del sistema y los servicios |
| `/etc/passwd` | Base de datos de usuarios |
| `/etc/shadow` | Contrasenas cifradas |
| `/etc/group` | Base de datos de grupos |
| `/etc/fstab` | Tabla de montaje de sistemas de archivos |
| `/etc/hostname` | Nombre del host |
| `/etc/hosts` | Resolucion estatica de nombres |
| `/etc/resolv.conf` | Configuracion DNS |
| `/etc/crontab` | Tareas programadas del sistema |
| `/etc/apt/` | Configuracion de APT (Debian/Ubuntu) |
| `/etc/yum.repos.d/` | Repositorios de YUM/DNF (Red Hat/Fedora) |

> **Clave:** `/etc` contiene SOLO archivos de configuracion, NUNCA binarios ejecutables.

#### Directorio /var (datos variables)

| Directorio | Contenido |
|-----------|-----------|
| `/var` | Datos variables que cambian durante la operacion normal |
| `/var/log` | Archivos de log del sistema y servicios |
| `/var/log/syslog` | Log general del sistema (Debian/Ubuntu) |
| `/var/log/messages` | Log general (Red Hat/CentOS) |
| `/var/log/auth.log` | Log de autenticacion |
| `/var/spool` | Colas de trabajos pendientes |
| `/var/spool/mail` | Buzon de correo de usuarios |
| `/var/spool/cron` | Colas de cron |
| `/var/spool/cups` | Cola de impresion |
| `/var/tmp` | Archivos temporales que persisten entre reinicios |
| `/var/cache` | Cache de aplicaciones |
| `/var/lib` | Datos de estado de aplicaciones |
| `/var/run` | Datos de tiempo de ejecucion (PIDs, sockets) - a veces enlace a /run |

> **Diferencia `/tmp` vs `/var/tmp`:** `/tmp` se limpia al reiniciar. `/var/tmp` persiste entre reinicios.

#### Directorios temporales

| Directorio | Contenido | Persistencia |
|-----------|-----------|-------------|
| `/tmp` | Archivos temporales | Se borra al reiniciar |
| `/var/tmp` | Archivos temporales persistentes | Persiste entre reinicios |

#### Directorios de usuario

| Directorio | Contenido |
|-----------|-----------|
| `/home` | Directorios personales de los usuarios |
| `/home/sandra` | Directorio personal del usuario sandra |
| `/root` | Directorio personal del usuario root |

> **Nota:** `/root` NO esta dentro de `/home`. Root tiene su propio directorio en la raiz.

#### Directorio /boot

| Directorio | Contenido |
|-----------|-----------|
| `/boot` | Archivos necesarios para el arranque |
| `/boot/vmlinuz-*` | Kernel de Linux comprimido |
| `/boot/initrd.img-*` o `/boot/initramfs-*` | Imagen initramfs |
| `/boot/grub/` | Configuracion del bootloader GRUB |

#### Directorios de dispositivos y sistemas virtuales

| Directorio | Contenido |
|-----------|-----------|
| `/dev` | Archivos de dispositivo (discos, terminales, etc.) |
| `/dev/sda` | Primer disco SATA |
| `/dev/null` | Descarta todo lo que se le envie |
| `/dev/zero` | Fuente infinita de ceros |
| `/dev/random` | Generador de numeros aleatorios |
| `/proc` | Sistema de archivos virtual con info de procesos y kernel |
| `/proc/cpuinfo` | Informacion de la CPU |
| `/proc/meminfo` | Informacion de la memoria |
| `/proc/PID/` | Informacion del proceso con ese PID |
| `/sys` | Sistema de archivos virtual con info de hardware y drivers |
| `/run` | Datos de tiempo de ejecucion (desde el ultimo arranque) |

> **`/proc` y `/sys`** no existen en disco; son sistemas de archivos virtuales generados por el kernel en tiempo real.

#### Directorios de montaje

| Directorio | Uso |
|-----------|-----|
| `/mnt` | Punto de montaje temporal para montajes manuales del administrador |
| `/media` | Punto de montaje automatico para medios extraibles (USB, CD, etc.) |
| `/media/sandra/USB_DRIVE` | Montaje automatico de un USB del usuario sandra |

#### Otros directorios

| Directorio | Contenido |
|-----------|-----------|
| `/opt` | Software de terceros y paquetes adicionales |
| `/srv` | Datos servidos por el sistema (web, FTP, etc.) |

---

## 2. Comandos para encontrar archivos

### 2.1 find

`find` busca archivos en tiempo real recorriendo el arbol de directorios. Es el mas potente pero puede ser lento en grandes sistemas.

```bash
# Sintaxis general
find [ruta] [expresiones]
```

#### Busqueda por nombre

```bash
# Buscar por nombre exacto
find /etc -name "passwd"

# Buscar por nombre con comodines (case-sensitive)
find /home -name "*.txt"

# Buscar por nombre sin distinguir mayusculas (-iname)
find /var -iname "*.log"

# Buscar por nombre en el directorio actual
find . -name "config*"
```

#### Busqueda por tipo

```bash
# Buscar solo archivos regulares
find /etc -type f -name "*.conf"

# Buscar solo directorios
find /home -type d -name "proyecto"

# Buscar solo enlaces simbolicos
find /usr -type l
```

**Tipos de archivo para `find -type`:**

| Tipo | Descripcion |
|------|-------------|
| `f` | Archivo regular |
| `d` | Directorio |
| `l` | Enlace simbolico |
| `b` | Dispositivo de bloque |
| `c` | Dispositivo de caracter |
| `p` | Pipe (FIFO) |
| `s` | Socket |

#### Busqueda por tamano

```bash
# Archivos mayores de 100 MB
find / -type f -size +100M

# Archivos menores de 1 KB
find /tmp -type f -size -1k

# Archivos de exactamente 0 bytes (vacios)
find /var -type f -size 0
# O equivalente:
find /var -type f -empty
```

**Sufijos de tamano:**
- `c` = bytes
- `k` = kilobytes
- `M` = megabytes
- `G` = gigabytes

#### Busqueda por tiempo

```bash
# Modificados en los ultimos 7 dias
find /var/log -mtime -7

# Modificados hace mas de 30 dias
find /tmp -mtime +30

# Accedidos en los ultimos 60 minutos
find /home -amin -60

# Modificados en los ultimos 60 minutos
find /var -mmin -60
```

#### Busqueda por permisos y propietario

```bash
# Archivos con permisos exactos 777
find / -perm 777

# Archivos con SUID activo
find / -perm -4000

# Archivos con SGID activo
find / -perm -2000

# Archivos de un usuario especifico
find /home -user sandra

# Archivos de un grupo especifico
find /var -group developers
```

#### Ejecutar acciones con -exec

```bash
# Eliminar archivos .tmp encontrados
find /tmp -name "*.tmp" -exec rm {} \;

# Cambiar permisos de todos los .sh encontrados
find /scripts -name "*.sh" -exec chmod 755 {} \;

# Listar en detalle los archivos encontrados
find /var/log -name "*.log" -exec ls -lh {} \;

# Buscar texto dentro de archivos encontrados
find /etc -name "*.conf" -exec grep -l "error" {} \;
```

> **Nota:** `{}` se reemplaza por cada archivo encontrado. `\;` marca el fin del comando. Se puede usar `+` en lugar de `\;` para agrupar los archivos y ejecutar el comando una sola vez (mas eficiente).

### 2.2 locate / mlocate

`locate` busca archivos en una **base de datos indexada**, lo que lo hace mucho mas rapido que `find`. Sin embargo, la base de datos puede estar desactualizada.

```bash
# Buscar archivos
locate passwd

# Buscar sin distinguir mayusculas
locate -i readme

# Limitar el numero de resultados
locate -n 10 "*.conf"

# Contar resultados
locate -c "*.log"

# Usar expresiones regulares
locate -r '/etc/.*\.conf$'
```

#### updatedb

```bash
# Actualizar la base de datos de locate (ejecutar como root)
sudo updatedb
```

La base de datos se almacena normalmente en `/var/lib/mlocate/mlocate.db` o `/var/lib/plocate/plocate.db`.

#### /etc/updatedb.conf

Configura que directorios y sistemas de archivos incluir/excluir:

```bash
# Ejemplo de /etc/updatedb.conf
PRUNE_BIND_MOUNTS="yes"
PRUNENAMES=".git .svn .hg"
PRUNEPATHS="/tmp /var/spool /media /mnt"
PRUNEFS="NFS nfs nfs4 rpc_pipefs afs binfmt_misc proc smbfs autofs iso9660 ncpfs coda devpts ftpfs devfs mfs shfs sysfs cifs lustre tmpfs usbfs udf"
```

| Variable | Descripcion |
|----------|-------------|
| `PRUNEPATHS` | Directorios a excluir de la indexacion |
| `PRUNEFS` | Tipos de sistema de archivos a excluir |
| `PRUNENAMES` | Nombres de directorios a excluir |
| `PRUNE_BIND_MOUNTS` | Excluir bind mounts |

> **Clave para el examen:** `locate` es rapido pero puede no encontrar archivos recien creados hasta que se ejecute `updatedb`. `find` siempre busca en tiempo real.

### 2.3 which

Muestra la ruta completa de un ejecutable que se encontraria en el PATH.

```bash
which ls
# /usr/bin/ls

which python3
# /usr/bin/python3

# No encuentra builtins del shell
which cd
# (sin resultado, cd es un builtin)

# Buscar todas las coincidencias
which -a python
# /usr/bin/python
# /usr/local/bin/python
```

> **Limitacion:** `which` solo busca en los directorios del `$PATH` y solo encuentra ejecutables. No encuentra builtins del shell, funciones ni alias.

### 2.4 whereis

Localiza el binario, el codigo fuente y la pagina de manual de un comando.

```bash
whereis ls
# ls: /usr/bin/ls /usr/share/man/man1/ls.1.gz

whereis fdisk
# fdisk: /usr/sbin/fdisk /usr/share/man/man8/fdisk.8.gz

# Solo binario
whereis -b ls

# Solo manual
whereis -m ls

# Solo fuentes
whereis -s gcc
```

### 2.5 type

Identifica **que es** un comando: builtin, alias, funcion, archivo, etc. Es un builtin del shell.

```bash
type ls
# ls is aliased to 'ls --color=auto'

type cd
# cd is a shell builtin

type find
# find is /usr/bin/find

type if
# if is a shell keyword

# Mostrar todos los tipos (si hay multiples)
type -a ls
# ls is aliased to 'ls --color=auto'
# ls is /usr/bin/ls

# Solo mostrar el tipo (una palabra)
type -t ls
# alias

type -t cd
# builtin

type -t find
# file
```

**Tipos que devuelve `type -t`:**

| Tipo | Significado |
|------|-------------|
| `alias` | Es un alias |
| `builtin` | Comando integrado del shell |
| `file` | Archivo ejecutable en disco |
| `function` | Funcion del shell |
| `keyword` | Palabra reservada del shell (if, for, while, etc.) |

---

## 3. Resumen del FHS por categorias

### Archivos estaticos vs dinamicos

| Categoria | Directorios | Descripcion |
|-----------|-------------|-------------|
| **Estaticos** | `/bin`, `/sbin`, `/usr`, `/lib`, `/boot`, `/etc`, `/opt` | No cambian durante la operacion normal |
| **Dinamicos** | `/var`, `/tmp`, `/run`, `/home` | Cambian frecuentemente |

### Compartibles vs no compartibles

| Categoria | Directorios | Descripcion |
|-----------|-------------|-------------|
| **Compartibles** | `/usr`, `/opt`, `/home` | Se pueden compartir en red (NFS) |
| **No compartibles** | `/etc`, `/boot`, `/var/run`, `/var/lock` | Especificos de cada maquina |

---

## 4. Puntos clave para el examen

1. **`/bin` y `/sbin`** contienen binarios esenciales. En distros modernas con **UsrMerge**, son enlaces simbolicos a `/usr/bin` y `/usr/sbin`.

2. **`/usr/local`** es para software instalado manualmente por el administrador (compilado desde fuente).

3. **`/etc`** solo contiene archivos de configuracion, nunca ejecutables.

4. **`/var/log`** contiene los logs. **`/var/spool`** contiene colas de trabajos. **`/var/tmp`** persiste entre reinicios.

5. **`/tmp`** se limpia al reiniciar; **`/var/tmp`** no.

6. **`/opt`** es para software de terceros (paquetes autocontenidos).

7. **`/proc` y `/sys`** son sistemas de archivos virtuales (no existen en disco).

8. **`/mnt`** para montajes manuales temporales; **`/media`** para medios extraibles automaticos.

9. **`find`** busca en tiempo real (lento pero siempre actualizado). **`locate`** usa base de datos (rapido pero puede estar desactualizado).

10. **`updatedb`** actualiza la base de datos de locate. Se configura en **`/etc/updatedb.conf`**.

11. **`which`** solo busca ejecutables en $PATH. **`type`** identifica builtins, alias, funciones y archivos. **`whereis`** busca binario, fuente y man page.

12. **`/root`** es el home de root. NO esta dentro de `/home`.
