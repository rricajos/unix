---
title: "209.2 - Configuración del servidor NFS"
tags: [lpic-2, examen-202, tema-209, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "209"
subtema: "209.2"
---

# 209.2 - Comandos clave: Configuración del servidor NFS

## Comandos del servidor NFS

| Comando | Descripción |
|---|---|
| `exportfs -a` | Exporta todos los directorios de /etc/exports |
| `exportfs -ra` | Re-exporta todos los directorios (recarga cambios) |
| `exportfs -v` | Muestra los directorios exportados con opciones |
| `exportfs -u cliente:/ruta` | Des-exporta un directorio para un cliente |
| `exportfs -ua` | Des-exporta todos los directorios |
| `exportfs -o rw,sync host:/ruta` | Exporta temporalmente sin modificar /etc/exports |
| `showmount -e servidor` | Lista los directorios exportados del servidor |
| `showmount -a servidor` | Lista los clientes con montajes activos |
| `showmount -d servidor` | Lista solo los directorios montados por clientes |

## Comandos del cliente NFS

| Comando | Descripción |
|---|---|
| `mount -t nfs servidor:/ruta /mnt` | Monta un recurso NFS (NFSv3) |
| `mount -t nfs4 servidor:/ruta /mnt` | Monta un recurso NFS (NFSv4) |
| `mount -t nfs -o vers=4 servidor:/ruta /mnt` | Monta especificando versión NFS |
| `mount -t nfs -o rsize=65536,wsize=65536 srv:/ruta /mnt` | Monta con buffer personalizado |
| `umount /mnt` | Desmonta un recurso NFS |
| `umount -l /mnt` | Desmontaje perezoso (lazy unmount) |

## Comandos RPC

| Comando | Descripción |
|---|---|
| `rpcinfo -p` | Lista los servicios RPC locales registrados |
| `rpcinfo -p servidor` | Lista los servicios RPC de un servidor remoto |
| `rpcinfo -t servidor nfs` | Verifica NFS sobre TCP en un servidor |
| `rpcinfo -u servidor nfs` | Verifica NFS sobre UDP en un servidor |

## Opciones de /etc/exports

| Opción | Descripción |
|---|---|
| `rw` | Lectura y escritura |
| `ro` | Solo lectura (predeterminado) |
| `sync` | Escrituras sincrónicas (predeterminado) |
| `async` | Escrituras asincrónicas (mayor rendimiento) |
| `root_squash` | Mapea root remoto a anónimo (predeterminado) |
| `no_root_squash` | Root remoto conserva privilegios |
| `all_squash` | Todos los usuarios se mapean a anónimo |
| `anonuid=N` | UID para el usuario anónimo |
| `anongid=N` | GID para el grupo anónimo |
| `no_subtree_check` | Deshabilita verificación de subárbol (recomendado) |
| `secure` | Solo conexiones desde puertos < 1024 (predeterminado) |
| `insecure` | Permite conexiones desde cualquier puerto |
| `fsid=0` | Marca la raíz del pseudo-filesystem NFSv4 |
| `crossmnt` | Permite atravesar puntos de montaje (NFSv4) |

## Opciones de montaje del cliente

| Opción | Descripción |
|---|---|
| `hard` | Reintenta indefinidamente (predeterminado) |
| `soft` | Devuelve error tras reintentos agotados |
| `rsize=N` | Tamaño del buffer de lectura en bytes |
| `wsize=N` | Tamaño del buffer de escritura en bytes |
| `timeo=N` | Timeout en décimas de segundo |
| `retrans=N` | Número de reintentos |
| `_netdev` | Requiere red disponible antes de montar |
| `bg` | Montaje en segundo plano si falla |
| `vers=N` | Versión de NFS (3, 4, 4.1, 4.2) |
| `sec=krb5` | Autenticación Kerberos |

## Formato de entrada en /etc/fstab para NFS

```
servidor:/ruta   /punto_montaje   nfs    rw,hard,_netdev   0  0
servidor:/ruta   /punto_montaje   nfs4   rw,hard,_netdev   0  0
```

## Demonios y puertos

| Servicio | Puerto | Protocolo | Descripción |
|---|---|---|---|
| `nfsd` | 2049 | TCP/UDP | Demonio principal NFS |
| `rpcbind` | 111 | TCP/UDP | Mapeador de puertos RPC (NFSv3) |
| `rpc.mountd` | dinámico | TCP/UDP | Gestión de montajes (NFSv3) |
| `rpc.statd` | dinámico | TCP/UDP | Monitor de estado (NFSv3) |
| `rpc.lockd` | dinámico | TCP/UDP | Bloqueo de archivos (NFSv3) |
| `rpc.idmapd` | - | - | Mapeo de nombres usuario/grupo (NFSv4) |

## Archivos de configuración clave

| Archivo | Descripción |
|---|---|
| `/etc/exports` | Define los directorios exportados y sus opciones |
| `/etc/fstab` | Montajes permanentes del cliente NFS |
| `/var/lib/nfs/etab` | Tabla de exportaciones activas (gestionada por exportfs) |
| `/var/lib/nfs/rmtab` | Lista de montajes remotos activos |
| `/etc/default/nfs-kernel-server` | Opciones del servidor NFS (Debian) |
| `/etc/sysconfig/nfs` | Opciones del servidor NFS (Red Hat) |
| `/etc/idmapd.conf` | Configuración del mapeo de IDs para NFSv4 |
