---
title: "201.3 - Gestion del kernel en ejecucion"
tags: [lpic-2, examen-201, tema-201, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.3"
---

# 201.3 - Gestion del kernel en ejecucion

## Introduccion

La gestion del kernel en ejecucion permite a los administradores ajustar el comportamiento del sistema sin necesidad de reiniciar ni recompilar el kernel. Esto incluye la carga y descarga de modulos, el ajuste de parametros del kernel en tiempo real y el diagnostico del sistema a traves del buffer de anillo del kernel.

Este subtema tiene un **peso de 4** en el examen, lo que lo convierte en el mas importante del Tema 201.

## Sistema de archivos /proc

### /proc/sys - Parametros del kernel

El directorio `/proc/sys/` contiene archivos virtuales que representan parametros ajustables del kernel en tiempo real. Los cambios realizados aqui son inmediatos pero no persisten tras un reinicio.

```bash
$ ls /proc/sys/
abi/  crypto/  debug/  dev/  fs/  kernel/  net/  vm/
```

Categorias principales:

| Directorio | Contenido |
|------------|-----------|
| `/proc/sys/kernel/` | Parametros generales del kernel |
| `/proc/sys/net/` | Configuracion de red |
| `/proc/sys/vm/` | Gestion de memoria virtual |
| `/proc/sys/fs/` | Parametros del sistema de archivos |
| `/proc/sys/dev/` | Parametros de dispositivos |

### Ejemplos de parametros comunes

```bash
# Ver el hostname
$ cat /proc/sys/kernel/hostname
servidor01

# Ver el reenvio de paquetes IPv4
$ cat /proc/sys/net/ipv4/ip_forward
0

# Ver la tendencia del sistema a usar swap (swappiness)
$ cat /proc/sys/vm/swappiness
60

# Numero maximo de archivos abiertos del sistema
$ cat /proc/sys/fs/file-max
9223372036854775807

# Numero maximo de PIDs
$ cat /proc/sys/kernel/pid_max
4194304
```

### Modificacion directa de parametros

Se pueden modificar parametros escribiendo directamente en los archivos de `/proc/sys/`:

```bash
# Habilitar el reenvio de paquetes IPv4
$ echo 1 > /proc/sys/net/ipv4/ip_forward

# Reducir la tendencia a usar swap
$ echo 10 > /proc/sys/vm/swappiness

# Habilitar SYN cookies (proteccion contra SYN flood)
$ echo 1 > /proc/sys/net/ipv4/tcp_syncookies
```

> **Para el examen:** Los cambios realizados directamente en `/proc/sys/` son inmediatos pero se pierden al reiniciar. Para hacerlos permanentes, se deben configurar en `sysctl.conf`.

## sysctl - Gestion de parametros del kernel

### Consultar parametros

`sysctl` es la herramienta de linea de comandos para leer y modificar parametros del kernel:

```bash
# Ver todos los parametros
$ sysctl -a

# Ver un parametro especifico
$ sysctl net.ipv4.ip_forward
net.ipv4.ip_forward = 0

# Ver parametros que coinciden con un patron
$ sysctl -a | grep swappiness
vm.swappiness = 60
```

La notacion de `sysctl` usa puntos en lugar de barras:
- `/proc/sys/net/ipv4/ip_forward` equivale a `net.ipv4.ip_forward`

### Modificar parametros en tiempo real

```bash
# Habilitar reenvio de paquetes
$ sysctl -w net.ipv4.ip_forward=1
net.ipv4.ip_forward = 1

# Cambiar swappiness
$ sysctl -w vm.swappiness=10
vm.swappiness = 10

# Cambiar numero maximo de conexiones en cola
$ sysctl -w net.core.somaxconn=4096
net.core.somaxconn = 4096
```

### Persistencia con sysctl.conf

Para que los cambios persistan entre reinicios, se configuran en `/etc/sysctl.conf` o en archivos dentro de `/etc/sysctl.d/`:

```bash
# /etc/sysctl.conf
net.ipv4.ip_forward = 1
vm.swappiness = 10
net.ipv4.tcp_syncookies = 1
net.core.somaxconn = 4096
fs.file-max = 2097152
kernel.panic = 10
```

```bash
# Aplicar los cambios del archivo de configuracion
$ sysctl -p
# o especificar un archivo
$ sysctl -p /etc/sysctl.d/99-custom.conf

# Cargar todos los archivos de configuracion
$ sysctl --system
```

> **Para el examen:** `sysctl -w` modifica un parametro en tiempo real. `sysctl -p` carga la configuracion desde el archivo (por defecto `/etc/sysctl.conf`). La opcion `--system` carga desde todos los archivos de configuracion del sistema.

### Parametros importantes para el examen

| Parametro | Funcion | Valor tipico |
|-----------|---------|-------------|
| `net.ipv4.ip_forward` | Enrutamiento de paquetes IPv4 | 0 (deshabilitado) |
| `net.ipv6.conf.all.forwarding` | Enrutamiento IPv6 | 0 |
| `vm.swappiness` | Tendencia a usar swap (0-100) | 60 |
| `kernel.hostname` | Nombre del host | Nombre del sistema |
| `kernel.panic` | Segundos antes de reiniciar tras panic | 0 (no reinicia) |
| `net.ipv4.tcp_syncookies` | Proteccion contra SYN flood | 1 |
| `fs.file-max` | Maximo de archivos abiertos | Variable |
| `net.ipv4.icmp_echo_ignore_all` | Ignorar ping | 0 (responde) |
| `kernel.sysrq` | Habilitar teclas SysRq magicas | 1 |

## Gestion de modulos del kernel

### lsmod - Listar modulos cargados

`lsmod` muestra los modulos actualmente cargados en el kernel, formateando la informacion de `/proc/modules`:

```bash
$ lsmod
Module                  Size  Used by
nf_tables             258048  0
ext4                  819200  1
mbcache                16384  1 ext4
jbd2                  135168  1 ext4
vfat                   20480  1
fat                    86016  1 vfat
```

Columnas:
- **Module**: nombre del modulo
- **Size**: tamano en bytes que ocupa en memoria
- **Used by**: numero de dependencias y nombres de modulos que lo usan

### modinfo - Informacion de un modulo

```bash
$ modinfo ext4
filename:       /lib/modules/5.15.0-56-generic/kernel/fs/ext4/ext4.ko
softdep:        pre: crc32c
license:        GPL
description:    Fourth Extended Filesystem
author:         Remy Card, Stephen Tweedie, Andrew Morton, Andreas Dilger
alias:          fs-ext4
alias:          ext3
depends:        mbcache,jbd2
intree:         Y
name:           ext4
vermagic:       5.15.0-56-generic SMP mod_unload modversions
parm:           mb_max_to_scan:... (uint)
```

Campos importantes:
- **filename**: ruta del archivo del modulo
- **depends**: modulos de los que depende
- **parm**: parametros configurables del modulo
- **alias**: nombres alternativos
- **vermagic**: version del kernel para la que fue compilado

### modprobe - Cargar y descargar modulos inteligentemente

`modprobe` es la herramienta recomendada para gestionar modulos. A diferencia de `insmod`, resuelve dependencias automaticamente.

```bash
# Cargar un modulo (con dependencias)
$ modprobe vfat
# Carga automaticamente 'fat' si no esta cargado

# Descargar un modulo (con dependencias no usadas)
$ modprobe -r vfat

# Cargar un modulo con parametros
$ modprobe snd_hda_intel power_save=1

# Simular la carga sin cargar realmente (dry-run)
$ modprobe -n -v vfat

# Mostrar dependencias de un modulo
$ modprobe --show-depends vfat
```

### insmod y rmmod - Carga y descarga basicas

`insmod` y `rmmod` son herramientas de bajo nivel que no resuelven dependencias:

```bash
# Cargar un modulo (requiere ruta completa, no resuelve dependencias)
$ insmod /lib/modules/$(uname -r)/kernel/fs/vfat/vfat.ko

# Descargar un modulo (falla si hay dependencias activas)
$ rmmod vfat

# Forzar la descarga (peligroso)
$ rmmod -f vfat
```

> **Para el examen:** Siempre usa `modprobe` en lugar de `insmod`/`rmmod`. `modprobe` resuelve dependencias automaticamente, mientras que `insmod` requiere la ruta completa del archivo `.ko` y no gestiona dependencias.

### depmod - Generar dependencias de modulos

`depmod` analiza los modulos instalados y genera el archivo `modules.dep` con las dependencias:

```bash
# Generar dependencias para el kernel actual
$ depmod

# Generar dependencias para una version especifica
$ depmod 5.15.60

# Modo verbose
$ depmod -v
```

El archivo generado esta en:
```
/lib/modules/<version>/modules.dep
```

> **Para el examen:** `depmod` debe ejecutarse despues de instalar modulos manualmente. `modprobe` depende de `modules.dep` para resolver dependencias. Si `modprobe` no encuentra un modulo nuevo, ejecuta `depmod`.

## Configuracion de modulos

### /etc/modprobe.d/

Los archivos en `/etc/modprobe.d/` configuran el comportamiento de `modprobe`:

```bash
$ ls /etc/modprobe.d/
blacklist.conf
alsa-base.conf
dkms.conf
```

### Tipos de directivas

```bash
# /etc/modprobe.d/custom.conf

# Crear un alias para un modulo
alias eth0 e1000e

# Definir opciones/parametros por defecto para un modulo
options snd_hda_intel power_save=1 power_save_controller=Y

# Impedir la carga de un modulo (blacklist)
blacklist nouveau

# Ejecutar un comando al cargar un modulo
install pcspkr /bin/true

# Ejecutar un comando al descargar un modulo
remove pcspkr /bin/true

# Cargar un modulo antes que otro (soft dependency)
softdep moduleA pre: moduleB
```

### Blacklisting de modulos

Para impedir que un modulo se cargue automaticamente:

```bash
# /etc/modprobe.d/blacklist-nouveau.conf
blacklist nouveau
options nouveau modeset=0
```

> **Para el examen:** Blacklistar un modulo con `blacklist` solo impide la carga automatica. El modulo aun puede cargarse manualmente con `modprobe`. Para bloquear completamente, usa `install nombre_modulo /bin/true` que redirige la carga a un comando inocuo.

### Parametros de modulos

Los modulos pueden aceptar parametros que modifican su comportamiento:

```bash
# Ver parametros disponibles
$ modinfo -p e1000e
IntMode:Interrupt Mode (int)
InterruptThrottleRate:Interrupt Throttling Rate (int)
SmartPowerDownEnable:Enable PHY smart power down (int)

# Cargar con parametros
$ modprobe e1000e InterruptThrottleRate=3000

# Configurar parametros permanentes
# /etc/modprobe.d/e1000e.conf
options e1000e InterruptThrottleRate=3000
```

## Estructura de /lib/modules/

```bash
$ ls /lib/modules/$(uname -r)/
build@           modules.alias      modules.dep      modules.symbols
kernel/          modules.alias.bin  modules.dep.bin  modules.symbols.bin
source@          modules.builtin    modules.devname  updates/
```

| Elemento | Descripcion |
|----------|-------------|
| `kernel/` | Directorio con modulos organizados por categoria |
| `modules.dep` | Dependencias entre modulos (texto) |
| `modules.dep.bin` | Dependencias en formato binario (mas rapido) |
| `modules.alias` | Mapeo de alias a modulos |
| `modules.builtin` | Lista de modulos compilados como built-in |
| `build` | Enlace simbolico al codigo fuente/headers |
| `updates/` | Modulos actualizados (DKMS, etc.) |

## uname - Informacion del kernel

```bash
# Version del kernel
$ uname -r
5.15.0-56-generic

# Toda la informacion
$ uname -a
Linux servidor01 5.15.0-56-generic #62-Ubuntu SMP x86_64 GNU/Linux

# Solo el nombre del kernel
$ uname -s
Linux

# Arquitectura
$ uname -m
x86_64
```

## dmesg - Buffer de anillo del kernel

### Concepto

`dmesg` muestra el contenido del **kernel ring buffer** (buffer de anillo del kernel), que contiene los mensajes generados por el kernel desde el arranque. Es fundamental para diagnostico de hardware, drivers y errores del kernel.

```bash
# Ver todos los mensajes del kernel
$ dmesg

# Solo mensajes de error y mas graves
$ dmesg --level=err,crit,alert,emerg

# Formato legible con marcas de tiempo
$ dmesg -T

# Seguir los mensajes en tiempo real
$ dmesg -w

# Limpiar el buffer
$ dmesg -c

# Formato con colores y paginacion
$ dmesg -H
```

### Niveles de mensajes del kernel

| Nivel | Nombre | Significado |
|-------|--------|-------------|
| 0 | emerg | Sistema inutilizable |
| 1 | alert | Accion inmediata necesaria |
| 2 | crit | Condicion critica |
| 3 | err | Error |
| 4 | warning | Advertencia |
| 5 | notice | Normal pero significativo |
| 6 | info | Informativo |
| 7 | debug | Depuracion |

### Filtrado de mensajes

```bash
# Mensajes relacionados con USB
$ dmesg | grep -i usb

# Mensajes de dispositivos de red
$ dmesg | grep -i eth

# Mensajes del ultimo arranque con journalctl
$ journalctl -k -b 0

# Mensajes del kernel con prioridad de error o superior
$ dmesg --level=err
```

> **Para el examen:** `dmesg` es la herramienta principal para diagnosticar problemas de hardware y modulos. Los mensajes del kernel tambien se pueden ver con `journalctl -k` en sistemas con systemd. La opcion `-T` muestra marcas de tiempo legibles.

## Ajuste de parametros en tiempo de ejecucion: ejemplos practicos

### Optimizacion de red

```bash
# Habilitar enrutamiento
$ sysctl -w net.ipv4.ip_forward=1

# Aumentar el buffer de conexiones TCP
$ sysctl -w net.core.somaxconn=65535

# Aumentar el rango de puertos efimeros
$ sysctl -w net.ipv4.ip_local_port_range="1024 65535"

# Habilitar reutilizacion de sockets TIME_WAIT
$ sysctl -w net.ipv4.tcp_tw_reuse=1
```

### Optimizacion de memoria

```bash
# Reducir swappiness para servidores de base de datos
$ sysctl -w vm.swappiness=10

# Ajustar proporcion de dirty pages
$ sysctl -w vm.dirty_ratio=15
$ sysctl -w vm.dirty_background_ratio=5

# Habilitar overcommit de memoria
$ sysctl -w vm.overcommit_memory=1
```

### Seguridad

```bash
# Deshabilitar respuesta a ping
$ sysctl -w net.ipv4.icmp_echo_ignore_all=1

# Proteccion contra IP spoofing
$ sysctl -w net.ipv4.conf.all.rp_filter=1

# Deshabilitar aceptacion de redireccion ICMP
$ sysctl -w net.ipv4.conf.all.accept_redirects=0

# Habilitar proteccion contra SYN flood
$ sysctl -w net.ipv4.tcp_syncookies=1
```

> **Para el examen:** Los ajustes de `sysctl` mas preguntados son: `ip_forward` (enrutamiento), `swappiness` (memoria), `tcp_syncookies` (seguridad) y `icmp_echo_ignore_all` (seguridad). Recuerda que `-w` aplica en tiempo real y `/etc/sysctl.conf` hace los cambios permanentes.
