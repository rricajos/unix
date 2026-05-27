---
title: "352.2 - LXC"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.2"
peso: 6
tags:
  - lpic-3
  - tema-352
  - lxc
  - lxd
  - contenedores-sistema
---

# 352.2 LXC (Linux Containers)

## Introducción

LXC (Linux Containers) proporciona contenedores a nivel de sistema operativo, más parecidos a máquinas virtuales ligeras que a contenedores de aplicación (como Docker). Cada contenedor LXC ejecuta un sistema Linux completo con su propio init, servicios y usuarios.

## Arquitectura LXC

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│Container1│ │Container2│ │Container3│
│(Ubuntu)  │ │(CentOS)  │ │(Debian)  │
│ init     │ │ init     │ │ init     │
│ sshd     │ │ httpd    │ │ postfix  │
│ cron     │ │ mysql    │ │ dovecot  │
├──────────┴─┴──────────┴─┴──────────┤
│        LXC (liblxc)                 │
├─────────────────────────────────────┤
│   Kernel Linux (namespaces, cgroups)│
└─────────────────────────────────────┘
```

LXC utiliza directamente las características del kernel:
- **Namespaces**: Aislamiento de procesos, red, filesystem, etc.
- **Cgroups**: Límites de recursos.
- **Chroot/pivot_root**: Aislamiento del filesystem raíz.
- **Capabilities**: Restricción de privilegios.
- **Seccomp**: Filtrado de syscalls.

## Gestión de Contenedores LXC

### Crear contenedores

```bash
# Crear contenedor con template de descarga
lxc-create -n mi-contenedor -t download -- -d ubuntu -r jammy -a amd64

# Crear con template local
lxc-create -n mi-contenedor -t ubuntu

# Crear con template Debian
lxc-create -n mi-debian -t debian -- -r bookworm

# Crear con template CentOS
lxc-create -n mi-centos -t centos -- -R 9
```

> **Para el examen:** El template `download` descarga imágenes preconfiguradas del servidor de imágenes LXC. Los templates locales (`-t ubuntu`, `-t debian`) ejecutan scripts de debootstrap para construir el rootfs.

### Ciclo de vida

```bash
# Iniciar contenedor
lxc-start -n mi-contenedor

# Iniciar en primer plano (para debug)
lxc-start -n mi-contenedor -F

# Detener contenedor (señal SIGPWR para init)
lxc-stop -n mi-contenedor

# Detener forzosamente
lxc-stop -n mi-contenedor -k

# Congelar contenedor (SIGSTOP a todos los procesos)
lxc-freeze -n mi-contenedor

# Descongelar
lxc-unfreeze -n mi-contenedor

# Destruir contenedor (eliminar completamente)
lxc-destroy -n mi-contenedor

# Destruir con snapshots
lxc-destroy -n mi-contenedor -s
```

### Acceder al contenedor

```bash
# Adjuntar una shell al contenedor
lxc-attach -n mi-contenedor

# Ejecutar un comando específico
lxc-attach -n mi-contenedor -- ls /etc/

# Conectar a la consola del contenedor
lxc-console -n mi-contenedor

# Salir de la consola: Ctrl+a seguido de q
```

### Información y monitorización

```bash
# Estado del contenedor
lxc-info -n mi-contenedor

# Listar todos los contenedores
lxc-ls

# Listar con detalles (fancy output)
lxc-ls --fancy

# Listar solo contenedores activos
lxc-ls --active

# Monitorizar eventos de contenedores
lxc-monitor -n mi-contenedor

# Ver estado de todos los contenedores
lxc-ls --fancy --fancy-format name,state,ipv4,memory
```

### Snapshots y clones

```bash
# Crear snapshot
lxc-snapshot -n mi-contenedor

# Listar snapshots
lxc-snapshot -n mi-contenedor -L

# Restaurar snapshot
lxc-snapshot -n mi-contenedor -r snap0

# Clonar contenedor (copia completa)
lxc-copy -n mi-contenedor -N mi-clon

# Clonar con snapshot (copy-on-write, requiere btrfs/LVM/overlay)
lxc-copy -n mi-contenedor -N mi-clon -s
```

> **Para el examen:** `lxc-copy` reemplazó al antiguo `lxc-clone`. La opción `-s` crea un clon con snapshot (COW), mucho más rápido y eficiente en espacio.

## Configuración de Contenedores

### Archivos de configuración

| Ruta | Descripción |
|---|---|
| `/etc/lxc/lxc.conf` | Configuración global de LXC |
| `/etc/lxc/default.conf` | Configuración por defecto para nuevos contenedores |
| `/var/lib/lxc/<nombre>/config` | Configuración de un contenedor específico |
| `/var/lib/lxc/<nombre>/rootfs/` | Sistema de archivos raíz del contenedor |
| `~/.local/share/lxc/` | Contenedores no privilegiados (por usuario) |

### Archivo config del contenedor

```ini
# /var/lib/lxc/mi-contenedor/config

# Distribución
lxc.include = /usr/share/lxc/config/common.conf
lxc.arch = linux64

# Red
lxc.net.0.type = veth
lxc.net.0.link = lxcbr0
lxc.net.0.flags = up
lxc.net.0.hwaddr = 00:16:3e:xx:xx:xx
lxc.net.0.ipv4.address = 10.0.3.100/24
lxc.net.0.ipv4.gateway = 10.0.3.1

# Filesystem
lxc.rootfs.path = dir:/var/lib/lxc/mi-contenedor/rootfs
lxc.mount.auto = proc:mixed sys:ro cgroup:mixed

# Límites de recursos (cgroups)
lxc.cgroup.memory.limit_in_bytes = 512M
lxc.cgroup.cpu.shares = 512
lxc.cgroup2.memory.max = 512M
lxc.cgroup2.cpu.max = 50000 100000

# Seguridad
lxc.cap.drop = sys_admin mac_admin mac_override
lxc.apparmor.profile = generated

# Arranque automático
lxc.start.auto = 1
lxc.start.delay = 5
lxc.start.order = 100
```

### Opciones de configuración clave

| Opción | Descripción |
|---|---|
| `lxc.net.X.type` | Tipo de red: `veth`, `macvlan`, `phys`, `none` |
| `lxc.net.X.link` | Bridge al que conectar |
| `lxc.rootfs.path` | Ruta al rootfs |
| `lxc.mount.entry` | Puntos de montaje adicionales |
| `lxc.cgroup.*` | Límites cgroups v1 |
| `lxc.cgroup2.*` | Límites cgroups v2 |
| `lxc.cap.drop` | Capabilities a eliminar |
| `lxc.cap.keep` | Capabilities a mantener (descarta el resto) |
| `lxc.start.auto` | Autoarranque (0 o 1) |
| `lxc.idmap` | Mapeo de UIDs/GIDs (unprivileged) |

## Networking en LXC

### Tipos de red

```
┌─────────────────────────────────────┐
│ veth: Par de interfaces virtuales   │
│                                     │
│ Container (eth0) ←→ vethXXX (host) │
│                       │             │
│                    lxcbr0 (bridge)  │
│                       │             │
│                    eth0 (físico)    │
└─────────────────────────────────────┘
```

| Tipo | Descripción |
|---|---|
| `veth` | Par de interfaces virtuales conectadas a un bridge (más común) |
| `macvlan` | Interfaz virtual con MAC propia directamente en la interfaz del host |
| `phys` | Interfaz física asignada directamente al contenedor |
| `none` | Sin red |

### Configurar bridge LXC

```bash
# El bridge lxcbr0 se configura en:
cat /etc/default/lxc-net

USE_LXC_BRIDGE="true"
LXC_BRIDGE="lxcbr0"
LXC_ADDR="10.0.3.1"
LXC_NETMASK="255.255.255.0"
LXC_NETWORK="10.0.3.0/24"
LXC_DHCP_RANGE="10.0.3.2,10.0.3.254"
```

## Backends de Almacenamiento

| Backend | Descripción | Snapshots eficientes |
|---|---|---|
| **dir** | Directorio simple (por defecto) | No |
| **btrfs** | Subvolúmenes Btrfs | Sí |
| **lvm** | Volúmenes lógicos LVM | Sí |
| **zfs** | Datasets ZFS | Sí |
| **overlay** | OverlayFS | Sí |
| **loop** | Archivo de imagen montado en loop | No |

```bash
# Crear contenedor con backend btrfs
lxc-create -n mi-contenedor -t download -B btrfs -- -d ubuntu -r jammy -a amd64

# Crear con backend LVM
lxc-create -n mi-contenedor -t download -B lvm --lvname mi-contenedor --vgname vg0 --fssize 10G
```

## LXD: La Evolución de LXC

LXD es un gestor de contenedores de sistema construido sobre LXC que añade:
- API REST
- Gestión de imágenes
- Clustering
- Migración en vivo
- Gestión de almacenamiento y redes avanzada

```bash
# Inicializar LXD
lxd init

# Lanzar contenedor
lxc launch ubuntu:22.04 mi-contenedor

# Listar contenedores
lxc list

# Shell en el contenedor
lxc exec mi-contenedor -- bash

# Info del contenedor
lxc info mi-contenedor

# Detener y eliminar
lxc stop mi-contenedor
lxc delete mi-contenedor
```

> **Para el examen:** Distinguir entre los comandos `lxc-*` (LXC nativo) y `lxc` (cliente de LXD). Son herramientas diferentes: LXC es la librería base, LXD es una capa superior con más funcionalidades.

## Contenedores No Privilegiados

Ejecutan el contenedor mapeando UIDs/GIDs a rangos sin privilegios:

```ini
# En la configuración del contenedor
lxc.idmap = u 0 100000 65536
lxc.idmap = g 0 100000 65536

# Esto mapea:
# UID 0 del contenedor → UID 100000 del host
# UID 1 del contenedor → UID 100001 del host
# ... hasta 65536 UIDs
```

```bash
# Verificar rangos disponibles
cat /etc/subuid
# usuario:100000:65536

cat /etc/subgid
# usuario:100000:65536
```

> **Para el examen:** Los contenedores no privilegiados son más seguros porque root dentro del contenedor (UID 0) se mapea a un usuario sin privilegios en el host. Un escape del contenedor no otorga privilegios de root.

## Resumen

| Concepto | Detalle clave |
|---|---|
| LXC | Contenedores de sistema (similar a VM ligera) |
| `lxc-create -t download` | Crear contenedor desde imagen remota |
| `lxc-attach` | Shell dentro del contenedor |
| `lxc-copy -s` | Clonar con snapshot (COW) |
| `/var/lib/lxc/<n>/config` | Configuración del contenedor |
| veth + bridge | Modelo de red más común |
| Unprivileged | Mapeo de UIDs para seguridad |
| LXD vs LXC | LXD es capa superior con API REST |
