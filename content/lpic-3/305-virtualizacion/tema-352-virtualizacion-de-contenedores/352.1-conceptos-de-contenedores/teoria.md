---
title: "352.1 - Conceptos de Contenedores"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.1"
peso: 7
tags:
  - lpic-3
  - tema-352
  - contenedores
  - namespaces
  - cgroups
  - oci
  - seccomp
---

# 352.1 Conceptos de Contenedores

## Introducción

Los contenedores son una forma de virtualización a nivel de sistema operativo que permite ejecutar múltiples instancias aisladas sobre un mismo kernel. A diferencia de las máquinas virtuales, no requieren un hipervisor ni un sistema operativo completo por cada instancia.

## Contenedores vs Máquinas Virtuales

```
    Máquinas Virtuales              Contenedores
┌───────┐ ┌───────┐           ┌───────┐ ┌───────┐
│ App A │ │ App B │           │ App A │ │ App B │
├───────┤ ├───────┤           ├───────┤ ├───────┤
│ Libs  │ │ Libs  │           │ Libs  │ │ Libs  │
├───────┤ ├───────┤           └───┬───┘ └───┬───┘
│Guest OS│ │Guest OS│              │         │
├───────┴─┴───────┤           ┌───┴─────────┴───┐
│   Hipervisor     │           │  Container Engine│
├──────────────────┤           ├─────────────────┤
│   Host OS        │           │   Host OS + Kernel│
├──────────────────┤           ├─────────────────┤
│   Hardware       │           │   Hardware       │
└──────────────────┘           └─────────────────┘
```

| Aspecto | Máquinas Virtuales | Contenedores |
|---|---|---|
| Aislamiento | Completo (kernel propio) | Nivel de proceso (kernel compartido) |
| Arranque | Minutos | Segundos/milisegundos |
| Tamaño | GB (SO completo) | MB (solo app + dependencias) |
| Rendimiento | Overhead de hipervisor | Casi nativo |
| Densidad | Decenas por host | Cientos/miles por host |
| Seguridad | Mayor (superficie de ataque reducida) | Menor (kernel compartido) |

> **Para el examen:** Los contenedores comparten el kernel del host. Esto los hace más ligeros pero potencialmente menos seguros que las VMs. Un exploit en el kernel afecta a todos los contenedores.

## Namespaces del Kernel Linux

Los namespaces proporcionan aislamiento de recursos del sistema. Cada contenedor tiene su propio conjunto de namespaces:

| Namespace | Flag | Aísla |
|---|---|---|
| **pid** | `CLONE_NEWPID` | Árbol de procesos (PID 1 propio) |
| **net** | `CLONE_NEWNET` | Interfaces de red, rutas, firewall |
| **mnt** | `CLONE_NEWNS` | Puntos de montaje del filesystem |
| **uts** | `CLONE_NEWUTS` | Hostname y domainname |
| **ipc** | `CLONE_NEWIPC` | Colas de mensajes, semáforos, memoria compartida |
| **user** | `CLONE_NEWUSER` | UIDs/GIDs (mapeo de usuarios) |
| **cgroup** | `CLONE_NEWCGROUP` | Vista de cgroups |
| **time** | `CLONE_NEWTIME` | Reloj del sistema (desde kernel 5.6) |

### Trabajar con namespaces

```bash
# Ver namespaces de un proceso
ls -la /proc/<PID>/ns/

# Crear un nuevo namespace de red
unshare --net bash

# Entrar en los namespaces de un contenedor existente
nsenter -t <PID> -n -p -m

# Listar todos los namespaces
lsns

# Ver namespace de un proceso específico
lsns -p <PID>
```

> **Para el examen:** El namespace `user` es fundamental para contenedores rootless. Permite mapear el UID 0 dentro del contenedor a un UID sin privilegios en el host.

## Cgroups (Control Groups)

Los cgroups limitan, contabilizan y aíslan el uso de recursos del sistema por grupos de procesos.

### Cgroups v1

Estructura jerárquica con múltiples árboles independientes (uno por controlador):

```
/sys/fs/cgroup/
├── cpu/
│   └── docker/
│       └── <container-id>/
│           ├── cpu.shares
│           └── cpu.cfs_quota_us
├── memory/
│   └── docker/
│       └── <container-id>/
│           ├── memory.limit_in_bytes
│           └── memory.usage_in_bytes
├── blkio/
├── cpuset/
├── devices/
├── freezer/
├── net_cls/
└── pids/
```

### Cgroups v2

Estructura unificada con un único árbol jerárquico:

```
/sys/fs/cgroup/
└── system.slice/
    └── docker-<container-id>.scope/
        ├── cgroup.controllers
        ├── cgroup.subtree_control
        ├── cpu.max
        ├── memory.max
        ├── memory.current
        ├── io.max
        └── pids.max
```

| Aspecto | Cgroups v1 | Cgroups v2 |
|---|---|---|
| Estructura | Múltiples jerarquías | Jerarquía única |
| Configuración | Un montaje por controlador | Montaje único unificado |
| Delegación | Compleja | Simplificada |
| Pressure Stall Info | No | Sí (PSI) |
| Controlador memory | `memory.limit_in_bytes` | `memory.max` |
| Controlador CPU | `cpu.shares`, `cpu.cfs_quota_us` | `cpu.max`, `cpu.weight` |

### Recursos controlados por cgroups

| Controlador | Recurso |
|---|---|
| **cpu** | Tiempo de CPU (cuotas, pesos) |
| **memory** | Memoria RAM y swap |
| **blkio/io** | Ancho de banda de E/S de disco |
| **pids** | Número máximo de procesos |
| **cpuset** | Asignación de CPUs y nodos NUMA específicos |
| **devices** | Acceso a dispositivos |
| **freezer** | Congelar/descongelar grupos de procesos |
| **net_cls** | Clasificación de tráfico de red |

```bash
# Ver controladores disponibles (v2)
cat /sys/fs/cgroup/cgroup.controllers

# Limitar memoria de un cgroup (v2)
echo "512M" > /sys/fs/cgroup/mi-grupo/memory.max

# Ver uso actual de memoria
cat /sys/fs/cgroup/mi-grupo/memory.current

# Limitar CPU (v2): máximo 50% de un core
echo "50000 100000" > /sys/fs/cgroup/mi-grupo/cpu.max
```

## Overlay Filesystems

### OverlayFS

Sistema de archivos por capas que combina múltiples directorios en una vista unificada:

```
┌─────────────────────────┐
│    Merged View          │  ← Lo que ve el contenedor
├─────────────────────────┤
│    Upper Layer (RW)     │  ← Cambios del contenedor
├─────────────────────────┤
│    Lower Layer 1 (RO)  │  ← Capa de imagen
├─────────────────────────┤
│    Lower Layer 2 (RO)  │  ← Capa base
└─────────────────────────┘
```

```bash
# Montar overlayfs manualmente
mount -t overlay overlay \
  -o lowerdir=/lower1:/lower2,upperdir=/upper,workdir=/work \
  /merged
```

### AUFS (Advanced Multi-Layered Unification Filesystem)

Predecesor de OverlayFS, ya en desuso en la mayoría de distribuciones. OverlayFS es el estándar actual incluido en el kernel Linux mainline.

> **Para el examen:** OverlayFS es el storage driver predeterminado en Docker moderno. AUFS fue usado en versiones antiguas pero no está en el kernel mainline.

## Container Runtimes

### Arquitectura de capas

```
┌─────────────────────────────────────────┐
│  Alto nivel: Docker, Podman, LXC        │
├─────────────────────────────────────────┤
│  Runtime de alto nivel: containerd, CRI-O│
├─────────────────────────────────────────┤
│  Runtime de bajo nivel: runc, crun       │
├─────────────────────────────────────────┤
│  Kernel: namespaces, cgroups, seccomp    │
└─────────────────────────────────────────┘
```

| Runtime | Nivel | Descripción |
|---|---|---|
| **runc** | Bajo | Runtime OCI de referencia, escrito en Go |
| **crun** | Bajo | Runtime OCI alternativo, escrito en C, más ligero y rápido |
| **containerd** | Alto | Demonio de gestión de contenedores (usado por Docker y Kubernetes) |
| **CRI-O** | Alto | Runtime optimizado para Kubernetes |

## Especificación OCI

La Open Container Initiative define tres especificaciones estándar:

### 1. Runtime Specification

Define cómo ejecutar un contenedor. Un "bundle" OCI contiene:
- `config.json`: Configuración del contenedor (namespaces, mounts, proceso, etc.)
- `rootfs/`: Sistema de archivos raíz

### 2. Image Specification

Define el formato de las imágenes de contenedor:
- **Manifest**: Referencia a la configuración y capas
- **Configuration**: Metadatos (CMD, ENV, puertos, etc.)
- **Layers**: Capas del sistema de archivos (tarballs comprimidos)

### 3. Distribution Specification

Define cómo distribuir imágenes a través de registros (registries).

```bash
# Inspeccionar una imagen OCI
skopeo inspect docker://docker.io/library/nginx:latest

# Copiar imagen entre registros
skopeo copy docker://registry1/app:v1 docker://registry2/app:v1
```

> **Para el examen:** OCI asegura la interoperabilidad entre diferentes herramientas de contenedores. Una imagen construida con Docker puede ejecutarse con Podman, y viceversa.

## Seccomp (Secure Computing Mode)

Filtra las llamadas al sistema (syscalls) que un proceso puede realizar:

```bash
# Ver perfil seccomp por defecto de Docker
docker info | grep -i seccomp

# Ejecutar contenedor con perfil personalizado
docker run --security-opt seccomp=mi-perfil.json nginx

# Ejecutar sin restricciones seccomp (peligroso)
docker run --security-opt seccomp=unconfined nginx
```

Ejemplo de perfil seccomp (JSON):
```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "syscalls": [
    {
      "names": ["read", "write", "open", "close", "stat"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

## Linux Capabilities

Las capabilities dividen los privilegios de root en unidades individuales:

| Capability | Permite |
|---|---|
| `CAP_NET_ADMIN` | Administrar redes (interfaces, rutas, firewall) |
| `CAP_NET_BIND_SERVICE` | Vincular puertos privilegiados (<1024) |
| `CAP_SYS_ADMIN` | Operaciones de administración del sistema |
| `CAP_SYS_PTRACE` | Trazar procesos (debug) |
| `CAP_CHOWN` | Cambiar propietario de archivos |
| `CAP_DAC_OVERRIDE` | Ignorar permisos de archivos |
| `CAP_MKNOD` | Crear dispositivos especiales |

```bash
# Eliminar todas las capabilities y añadir solo las necesarias
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx

# Ver capabilities de un proceso
getpcaps <PID>

# Ver capabilities de un contenedor
docker inspect --format='{{.HostConfig.CapAdd}}' <container>
```

> **Para el examen:** Por defecto, los contenedores Docker se ejecutan con un subconjunto limitado de capabilities. Nunca deben ejecutarse con `--privileged` en producción.

## Contenedores Rootless

Ejecutan el container engine y los contenedores sin privilegios de root en el host:

```bash
# Docker rootless
dockerd-rootless-setuptool.sh install
export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock

# Podman rootless (por defecto)
podman run nginx

# Verificar mapeo de usuarios
cat /etc/subuid
cat /etc/subgid
```

Requisitos para contenedores rootless:
- Soporte de user namespaces en el kernel
- `/etc/subuid` y `/etc/subgid` configurados
- `newuidmap` y `newgidmap` disponibles

## Resumen

| Concepto | Detalle clave |
|---|---|
| Namespaces | Aislamiento de recursos (pid, net, mnt, uts, ipc, user, cgroup) |
| Cgroups | Límites de recursos (CPU, memoria, E/S, PIDs) |
| Cgroups v2 | Jerarquía unificada, reemplaza v1 |
| OverlayFS | Filesystem por capas (lower RO + upper RW) |
| runc/crun | Runtimes OCI de bajo nivel |
| containerd | Runtime de alto nivel, usado por Docker y K8s |
| OCI | Estándar de interoperabilidad (runtime, image, distribution) |
| Seccomp | Filtrado de syscalls |
| Capabilities | Permisos granulares (sustituyen a root monolítico) |
| Rootless | Contenedores sin privilegios root en el host |
