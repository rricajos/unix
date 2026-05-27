---
title: "352.1 - Comandos Clave: Conceptos de Contenedores"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.1"
peso: 7
tags:
  - lpic-3
  - tema-352
  - comandos
  - contenedores
  - namespaces
  - cgroups
---

# Comandos Clave - 352.1 Conceptos de Contenedores

## Namespaces

| Comando | Descripción |
|---|---|
| `ls -la /proc/<PID>/ns/` | Ver namespaces de un proceso |
| `lsns` | Listar todos los namespaces del sistema |
| `lsns -p <PID>` | Namespaces de un proceso específico |
| `unshare --net bash` | Crear nuevo namespace de red |
| `unshare --pid --fork --mount-proc bash` | Crear namespace PID aislado |
| `unshare --user bash` | Crear namespace de usuario |
| `nsenter -t <PID> -n -p -m` | Entrar en namespaces de un proceso |
| `nsenter -t <PID> --all` | Entrar en todos los namespaces |
| `ip netns list` | Listar namespaces de red |
| `ip netns exec <ns> <cmd>` | Ejecutar comando en namespace de red |

## Cgroups v1

| Ruta/Comando | Descripción |
|---|---|
| `/sys/fs/cgroup/` | Raíz de cgroups v1 |
| `/sys/fs/cgroup/memory/<grupo>/memory.limit_in_bytes` | Límite de memoria |
| `/sys/fs/cgroup/memory/<grupo>/memory.usage_in_bytes` | Uso actual de memoria |
| `/sys/fs/cgroup/cpu/<grupo>/cpu.shares` | Peso relativo de CPU |
| `/sys/fs/cgroup/cpu/<grupo>/cpu.cfs_quota_us` | Cuota CPU en microsegundos |
| `/sys/fs/cgroup/pids/<grupo>/pids.max` | Máximo de PIDs |
| `cgcreate -g memory,cpu:/<grupo>` | Crear cgroup (v1) |
| `cgset -r memory.limit_in_bytes=512M <grupo>` | Establecer límite |
| `cgexec -g memory,cpu:/<grupo> <cmd>` | Ejecutar en un cgroup |

## Cgroups v2

| Ruta/Comando | Descripción |
|---|---|
| `/sys/fs/cgroup/` | Raíz unificada de cgroups v2 |
| `cat /sys/fs/cgroup/cgroup.controllers` | Controladores disponibles |
| `echo "+memory +cpu" > cgroup.subtree_control` | Activar controladores |
| `echo "512M" > <grupo>/memory.max` | Límite de memoria (v2) |
| `cat <grupo>/memory.current` | Uso actual de memoria (v2) |
| `echo "50000 100000" > <grupo>/cpu.max` | Cuota CPU: 50% de 1 core |
| `echo "100" > <grupo>/cpu.weight` | Peso CPU (1-10000) |
| `echo "max" > <grupo>/pids.max` | Sin límite de PIDs |
| `cat <grupo>/cgroup.procs` | Procesos en el cgroup |

## OverlayFS

| Comando | Descripción |
|---|---|
| `mount -t overlay overlay -o lowerdir=X,upperdir=Y,workdir=Z /merged` | Montar overlayfs |
| `mount \| grep overlay` | Ver montajes overlay activos |
| `cat /proc/filesystems \| grep overlay` | Verificar soporte del kernel |

## Seguridad

| Comando | Descripción |
|---|---|
| `getpcaps <PID>` | Ver capabilities de un proceso |
| `capsh --print` | Mostrar capabilities del shell actual |
| `grep Seccomp /proc/<PID>/status` | Ver modo seccomp de un proceso |
| `cat /etc/subuid` | Mapeo de UIDs para user namespaces |
| `cat /etc/subgid` | Mapeo de GIDs para user namespaces |
| `newuidmap <PID> <inner> <outer> <count>` | Configurar mapeo de UIDs |
| `newgidmap <PID> <inner> <outer> <count>` | Configurar mapeo de GIDs |

## Container Runtimes

| Comando | Descripción |
|---|---|
| `runc spec` | Generar config.json OCI de referencia |
| `runc create <id>` | Crear contenedor OCI |
| `runc start <id>` | Iniciar contenedor |
| `runc list` | Listar contenedores |
| `runc delete <id>` | Eliminar contenedor |
| `ctr containers list` | Listar contenedores (containerd) |
| `crictl pods` | Listar pods (CRI-O) |
| `skopeo inspect docker://<imagen>` | Inspeccionar imagen OCI remota |
| `skopeo copy <origen> <destino>` | Copiar imagen entre registros |

## Archivos Importantes

| Ruta | Descripción |
|---|---|
| `/proc/<PID>/ns/` | Namespaces de un proceso |
| `/proc/<PID>/cgroup` | Cgroup de un proceso |
| `/sys/fs/cgroup/` | Punto de montaje de cgroups |
| `/etc/subuid` | Rangos de UIDs subordinados |
| `/etc/subgid` | Rangos de GIDs subordinados |
