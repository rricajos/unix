---
title: "209.2 - Configuración del servidor NFS"
tags: [lpic-2, examen-202, tema-209, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "209"
subtema: "209.2"
---

# 209.2 - Configuración del servidor NFS

## Peso: 3

## Introducción

NFS (Network File System) es el protocolo estándar para compartir sistemas de archivos en redes Unix/Linux. Permite que los clientes accedan a directorios remotos como si fueran locales. El examen LPIC-2 cubre la configuración del servidor y el cliente NFS, las diferencias entre NFSv3 y NFSv4, las opciones de seguridad y las configuraciones de rendimiento.

## Instalación

```bash
# Debian/Ubuntu - Servidor
apt install nfs-kernel-server

# Debian/Ubuntu - Cliente
apt install nfs-common

# Red Hat/CentOS - Servidor
yum install nfs-utils

# Red Hat/CentOS - Cliente
yum install nfs-utils
```

### Servicios relacionados

```bash
# Habilitar e iniciar el servidor NFS
systemctl enable nfs-server
systemctl start nfs-server

# Servicios auxiliares
systemctl enable rpcbind   # Necesario para NFSv3
systemctl start rpcbind
```

## Diferencias entre NFSv3 y NFSv4

| Característica | NFSv3 | NFSv4 |
|---|---|---|
| Protocolo de transporte | UDP o TCP | Solo TCP |
| Puerto | Puertos dinámicos (requiere rpcbind) | Solo puerto TCP 2049 |
| Seguridad | Basada en IP/host | Kerberos integrado |
| Pseudo-filesystem | No | Sí (raíz única) |
| Bloqueo de archivos | Protocolo separado (NLM) | Integrado en el protocolo |
| Dependencia de rpcbind | Sí | No |
| ACLs | No nativas | Soporte nativo |
| Rendimiento | Bueno | Mejorado con compuestos |

> **Para el examen:** NFSv4 utiliza exclusivamente el puerto TCP 2049 y no necesita rpcbind. NFSv3 requiere rpcbind (puerto 111) y utiliza puertos dinámicos para los servicios auxiliares (mountd, statd, lockd). Esta diferencia es crucial para la configuración de firewalls.

## Configuración del servidor: /etc/exports

El archivo `/etc/exports` define qué directorios se comparten y con qué opciones.

### Sintaxis básica

```
directorio   cliente(opciones)   [cliente2(opciones2)]
```

### Ejemplos de configuración

```bash
# Compartir con un host específico
/srv/datos    192.168.1.10(rw,sync,no_subtree_check)

# Compartir con una red completa
/srv/datos    192.168.1.0/24(rw,sync,no_subtree_check)

# Compartir con un nombre de host
/srv/datos    cliente.empresa.com(rw,sync,no_root_squash)

# Compartir con comodín de dominio
/srv/datos    *.empresa.com(ro,sync)

# Compartir con múltiples clientes
/srv/datos    192.168.1.0/24(rw,sync) 10.0.0.0/8(ro,sync)

# Compartir con todos (peligroso, solo para pruebas)
/srv/publico  *(ro,sync,all_squash)
```

> **Para el examen:** Es muy importante no dejar espacio entre el cliente y el paréntesis de opciones. `192.168.1.0/24(rw)` da acceso de lectura y escritura a esa red, mientras que `192.168.1.0/24 (rw)` da acceso de lectura y escritura a TODOS los hosts (el espacio separa las dos entradas).

### Opciones de exportación principales

| Opción | Descripción |
|---|---|
| `rw` | Lectura y escritura |
| `ro` | Solo lectura (predeterminado) |
| `sync` | Escrituras sincrónicas (más seguro, predeterminado) |
| `async` | Escrituras asincrónicas (mejor rendimiento, riesgo de pérdida de datos) |
| `no_subtree_check` | Deshabilita la verificación de subárbol (recomendado) |
| `subtree_check` | Habilita la verificación de subárbol |
| `root_squash` | Mapea root remoto a anonuid/anongid (predeterminado) |
| `no_root_squash` | Permite acceso como root desde el cliente |
| `all_squash` | Mapea todos los usuarios al usuario anónimo |
| `no_all_squash` | No mapea usuarios normales (predeterminado) |
| `anonuid=UID` | UID del usuario anónimo para squash |
| `anongid=GID` | GID del grupo anónimo para squash |
| `secure` | Requiere que la conexión provenga de un puerto < 1024 (predeterminado) |
| `insecure` | Permite conexiones desde cualquier puerto |

## Seguridad: Squashing de usuarios

### root_squash (predeterminado)

```bash
# El usuario root del cliente se mapea al usuario anónimo (nobody/nfsnobody)
/srv/datos    192.168.1.0/24(rw,sync,root_squash)
```

Cuando un cliente accede como root (UID 0), el servidor lo trata como el usuario anónimo (normalmente `nobody` con UID 65534). Los demás usuarios mantienen sus UIDs originales.

### no_root_squash

```bash
# El usuario root del cliente mantiene privilegios de root en el servidor
/srv/datos    192.168.1.0/24(rw,sync,no_root_squash)
```

> **Para el examen:** `no_root_squash` es un riesgo de seguridad significativo porque permite que root en el cliente tenga privilegios de root sobre los archivos del servidor. Solo debe usarse en entornos controlados.

### all_squash

```bash
# TODOS los usuarios se mapean al usuario anónimo
/srv/datos    192.168.1.0/24(rw,sync,all_squash,anonuid=1000,anongid=1000)
```

`all_squash` es útil para comparticiones públicas donde todos los accesos deben realizarse con un mismo usuario, independientemente del UID del cliente.

## Comando exportfs

```bash
# Exportar todos los directorios definidos en /etc/exports
exportfs -a

# Re-exportar todos los directorios (recargar)
exportfs -ra

# Mostrar los directorios exportados actualmente
exportfs -v

# Exportar un directorio temporalmente (sin /etc/exports)
exportfs -o rw,sync 192.168.1.10:/srv/temporal

# Des-exportar un directorio específico
exportfs -u 192.168.1.10:/srv/datos

# Des-exportar todos los directorios
exportfs -ua
```

> **Para el examen:** Después de modificar `/etc/exports`, se debe ejecutar `exportfs -ra` para aplicar los cambios sin reiniciar el servicio NFS. La opción `-a` aplica todas las entradas del archivo, y `-r` re-sincroniza la tabla de exportaciones.

## Comando showmount

```bash
# Mostrar los directorios exportados de un servidor
showmount -e servidor

# Mostrar los directorios exportados del servidor local
showmount -e localhost

# Mostrar los clientes que tienen montajes activos
showmount -a servidor

# Mostrar solo los directorios montados
showmount -d servidor
```

## NFSv4 - Pseudo Filesystem

NFSv4 introduce el concepto de pseudo-filesystem, que presenta todas las exportaciones bajo una raíz virtual única.

### Configuración del pseudo-filesystem

```bash
# Definir la raíz del pseudo-filesystem
# En /etc/exports:
/srv/nfs4          *(ro,sync,fsid=0,crossmnt,no_subtree_check)
/srv/nfs4/datos    192.168.1.0/24(rw,sync,no_subtree_check)
/srv/nfs4/homes    192.168.1.0/24(rw,sync,no_subtree_check)
```

```bash
# Crear la estructura
mkdir -p /srv/nfs4/datos /srv/nfs4/homes

# Montar los directorios reales en la estructura del pseudo-filesystem
mount --bind /datos /srv/nfs4/datos
mount --bind /home /srv/nfs4/homes
```

### Montaje del cliente NFSv4

```bash
# El cliente monta desde la raíz del pseudo-filesystem
mount -t nfs4 servidor:/ /mnt/nfs4

# O montar un subdirectorio específico
mount -t nfs4 servidor:/datos /mnt/datos
```

> **Para el examen:** En NFSv4, la opción `fsid=0` marca la raíz del pseudo-filesystem. Los clientes ven todas las exportaciones como subdirectorios de esta raíz. La opción `crossmnt` permite que el cliente atraviese los puntos de montaje automáticamente.

## Montaje del cliente NFS

### Montaje manual

```bash
# Montar NFSv3
mount -t nfs servidor:/srv/datos /mnt/datos

# Montar NFSv4
mount -t nfs4 servidor:/datos /mnt/datos

# Montar con opciones específicas
mount -t nfs -o rw,hard,intr,rsize=65536,wsize=65536 servidor:/datos /mnt/datos

# Especificar versión de NFS
mount -t nfs -o vers=3 servidor:/datos /mnt/datos
mount -t nfs -o vers=4 servidor:/datos /mnt/datos
```

### Montaje permanente en /etc/fstab

```
# NFSv3
servidor:/srv/datos  /mnt/datos  nfs  rw,hard,intr,rsize=65536,wsize=65536  0  0

# NFSv4
servidor:/datos  /mnt/datos  nfs4  rw,hard,intr  0  0

# Con opciones de alta disponibilidad
servidor:/datos  /mnt/datos  nfs  rw,soft,timeo=300,retrans=3,_netdev  0  0
```

### Opciones de montaje del cliente

| Opción | Descripción |
|---|---|
| `hard` | Reintenta indefinidamente si el servidor no responde (predeterminado) |
| `soft` | Devuelve error después de los reintentos configurados |
| `intr` | Permite interrumpir operaciones NFS (obsoleto en kernels modernos) |
| `rsize=N` | Tamaño del buffer de lectura en bytes |
| `wsize=N` | Tamaño del buffer de escritura en bytes |
| `timeo=N` | Timeout en décimas de segundo |
| `retrans=N` | Número de reintentos antes de reportar error |
| `_netdev` | Indica que requiere red (espera a que la red esté disponible) |
| `bg` | Monta en segundo plano si falla el primer intento |
| `fg` | Monta en primer plano (predeterminado) |
| `vers=N` | Versión de NFS a utilizar (3, 4, 4.1, 4.2) |
| `sec=krb5` | Autenticación Kerberos |

> **Para el examen:** La opción `hard` es la predeterminada y la más segura para datos críticos, ya que reintenta la operación indefinidamente hasta que el servidor responda. La opción `soft` puede causar corrupción de datos si la aplicación no maneja bien los errores de E/S. La opción `_netdev` es importante en `/etc/fstab` para que el montaje espere a que la red esté disponible.

## Opciones de rendimiento

```bash
# Valores típicos para buen rendimiento
mount -t nfs -o rw,hard,rsize=65536,wsize=65536,async servidor:/datos /mnt/datos
```

- **rsize/wsize**: Definen el tamaño del buffer de lectura/escritura. Valores comunes: 8192, 32768, 65536. Valores mayores suelen mejorar el rendimiento.
- **async**: Mejora el rendimiento permitiendo escrituras asincrónicas, pero con riesgo de pérdida de datos si el servidor se apaga inesperadamente.
- **sync**: Más seguro pero más lento, ya que cada escritura se confirma antes de continuar.

## Puertos y firewall

### NFSv3 (múltiples puertos)

```bash
# Servicios y puertos de NFSv3
rpcbind         111/tcp  111/udp
nfs             2049/tcp 2049/udp
mountd          puerto dinámico
statd           puerto dinámico
lockd           puerto dinámico

# Fijar puertos para facilitar la configuración del firewall
# En /etc/sysconfig/nfs o /etc/default/nfs-kernel-server:
MOUNTD_PORT=892
STATD_PORT=662
LOCKD_TCPPORT=32803
LOCKD_UDPPORT=32769
```

### NFSv4 (solo un puerto)

```bash
# Solo necesita un puerto
nfs   2049/tcp
```

```bash
# Reglas de firewall para NFSv4
iptables -A INPUT -p tcp --dport 2049 -j ACCEPT

# Reglas de firewall para NFSv3
iptables -A INPUT -p tcp --dport 111 -j ACCEPT
iptables -A INPUT -p udp --dport 111 -j ACCEPT
iptables -A INPUT -p tcp --dport 2049 -j ACCEPT
iptables -A INPUT -p udp --dport 2049 -j ACCEPT
iptables -A INPUT -p tcp --dport 892 -j ACCEPT
iptables -A INPUT -p udp --dport 892 -j ACCEPT
```

> **Para el examen:** Una de las grandes ventajas de NFSv4 sobre NFSv3 es la simplificación del firewall. NFSv4 solo necesita el puerto TCP 2049, mientras que NFSv3 requiere rpcbind (111) y puertos dinámicos adicionales para mountd, statd y lockd.

## Demonios NFS

| Demonio | Descripción |
|---|---|
| `nfsd` | Demonio principal del servidor NFS |
| `rpcbind` / `portmap` | Mapea servicios RPC a puertos (necesario para NFSv3) |
| `rpc.mountd` | Gestiona las solicitudes de montaje de los clientes |
| `rpc.statd` | Monitor de estado para recuperación de bloqueos |
| `rpc.lockd` | Gestión de bloqueos de archivos (NFSv3) |
| `rpc.idmapd` | Mapeo de nombres de usuario/grupo en NFSv4 |

### Verificar servicios RPC activos

```bash
# Listar los servicios RPC registrados
rpcinfo -p
rpcinfo -p servidor

# Verificar que NFS está registrado
rpcinfo -t servidor nfs
rpcinfo -u servidor nfs
```

> **Para el examen:** El demonio `rpc.idmapd` es específico de NFSv4 y se encarga de mapear los UIDs/GIDs numéricos a nombres de usuario y grupo (y viceversa). Esto es importante porque NFSv4 transmite los nombres de usuario en lugar de UIDs numéricos.
