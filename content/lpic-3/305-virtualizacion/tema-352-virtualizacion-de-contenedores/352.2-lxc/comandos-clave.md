---
title: "352.2 - Comandos Clave: LXC"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.2"
peso: 6
tags:
  - lpic-3
  - tema-352
  - comandos
  - lxc
  - lxd
---

# Comandos Clave - 352.2 LXC

## Ciclo de Vida del Contenedor

| Comando | Descripción |
|---|---|
| `lxc-create -n <nombre> -t download -- -d <distro> -r <release> -a <arch>` | Crear contenedor desde imagen |
| `lxc-create -n <nombre> -t <template>` | Crear con template local |
| `lxc-start -n <nombre>` | Iniciar contenedor |
| `lxc-start -n <nombre> -F` | Iniciar en primer plano |
| `lxc-stop -n <nombre>` | Detener contenedor |
| `lxc-stop -n <nombre> -k` | Detener forzosamente (kill) |
| `lxc-freeze -n <nombre>` | Congelar contenedor |
| `lxc-unfreeze -n <nombre>` | Descongelar contenedor |
| `lxc-destroy -n <nombre>` | Eliminar contenedor |
| `lxc-destroy -n <nombre> -s` | Eliminar con snapshots |

## Acceso e Información

| Comando | Descripción |
|---|---|
| `lxc-attach -n <nombre>` | Shell en el contenedor |
| `lxc-attach -n <nombre> -- <cmd>` | Ejecutar comando en el contenedor |
| `lxc-console -n <nombre>` | Conectar a consola (salir: Ctrl+a, q) |
| `lxc-info -n <nombre>` | Información del contenedor |
| `lxc-ls` | Listar contenedores |
| `lxc-ls --fancy` | Listar con detalles |
| `lxc-ls --active` | Listar solo contenedores activos |
| `lxc-monitor -n <nombre>` | Monitorizar eventos |

## Snapshots y Clones

| Comando | Descripción |
|---|---|
| `lxc-snapshot -n <nombre>` | Crear snapshot |
| `lxc-snapshot -n <nombre> -L` | Listar snapshots |
| `lxc-snapshot -n <nombre> -r <snap>` | Restaurar snapshot |
| `lxc-snapshot -n <nombre> -d <snap>` | Eliminar snapshot |
| `lxc-copy -n <orig> -N <nuevo>` | Clonar contenedor |
| `lxc-copy -n <orig> -N <nuevo> -s` | Clonar con snapshot (COW) |

## Comandos LXD (cliente `lxc`)

| Comando | Descripción |
|---|---|
| `lxd init` | Inicializar LXD |
| `lxc launch <imagen> <nombre>` | Crear e iniciar contenedor |
| `lxc list` | Listar contenedores |
| `lxc exec <nombre> -- <cmd>` | Ejecutar comando |
| `lxc info <nombre>` | Información del contenedor |
| `lxc stop <nombre>` | Detener contenedor |
| `lxc delete <nombre>` | Eliminar contenedor |
| `lxc image list` | Listar imágenes locales |
| `lxc config show <nombre>` | Ver configuración |

## Archivos de Configuración

| Ruta | Descripción |
|---|---|
| `/etc/lxc/lxc.conf` | Configuración global de LXC |
| `/etc/lxc/default.conf` | Config por defecto para nuevos contenedores |
| `/var/lib/lxc/<nombre>/config` | Config de contenedor específico |
| `/var/lib/lxc/<nombre>/rootfs/` | Rootfs del contenedor |
| `~/.local/share/lxc/` | Contenedores no privilegiados |
| `/etc/default/lxc-net` | Configuración del bridge LXC |
| `/etc/subuid` | Mapeo UIDs para unprivileged |
| `/etc/subgid` | Mapeo GIDs para unprivileged |

## Opciones de Configuración del Contenedor

| Opción | Descripción |
|---|---|
| `lxc.net.0.type = veth` | Tipo de interfaz de red |
| `lxc.net.0.link = lxcbr0` | Bridge de conexión |
| `lxc.net.0.flags = up` | Activar interfaz |
| `lxc.rootfs.path = dir:/path` | Ruta del rootfs |
| `lxc.cgroup2.memory.max = 512M` | Límite de memoria (v2) |
| `lxc.cgroup2.cpu.max = 50000 100000` | Límite de CPU (v2) |
| `lxc.cap.drop = sys_admin` | Eliminar capabilities |
| `lxc.start.auto = 1` | Autoarranque |
| `lxc.idmap = u 0 100000 65536` | Mapeo UIDs |
| `lxc.idmap = g 0 100000 65536` | Mapeo GIDs |
