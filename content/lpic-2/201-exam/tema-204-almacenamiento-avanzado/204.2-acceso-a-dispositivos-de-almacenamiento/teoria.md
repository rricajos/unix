---
title: "204.2 - Acceso a dispositivos de almacenamiento"
tags: [lpic-2, examen-201, tema-204, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.2"
---

# 204.2 - Acceso a dispositivos de almacenamiento

## Introduccion a SAN e iSCSI

### Conceptos de SAN (Storage Area Network)

Una SAN es una red dedicada de alta velocidad que conecta servidores con dispositivos de almacenamiento compartido. A diferencia de NAS (que comparte a nivel de archivo), la SAN comparte almacenamiento a nivel de bloque.

- **FC (Fibre Channel):** Protocolo tradicional de SAN con velocidades de 8/16/32 Gbps
- **iSCSI:** Protocolo que encapsula comandos SCSI sobre TCP/IP
- **FCoE (Fibre Channel over Ethernet):** FC encapsulado en tramas Ethernet
- **LUN (Logical Unit Number):** Unidad logica de almacenamiento presentada por la SAN al servidor

| Tecnologia | Transporte | Velocidad tipica | Coste |
|---|---|---|---|
| Fibre Channel | Fibra optica dedicada | 8-32 Gbps | Alto |
| iSCSI | Red Ethernet TCP/IP | 1-100 Gbps | Bajo-Medio |
| FCoE | Ethernet (sin TCP) | 10-100 Gbps | Medio |

> **Para el examen:** iSCSI es el protocolo SAN mas preguntado en LPIC-2. Entiende la relacion target-initiator y los comandos de configuracion.

## iSCSI - Conceptos fundamentales

### Terminologia iSCSI

| Termino | Descripcion |
|---|---|
| **Target** | El servidor que exporta/comparte el almacenamiento |
| **Initiator** | El cliente que accede al almacenamiento remoto |
| **LUN** | Unidad logica de almacenamiento en el target |
| **IQN** | iSCSI Qualified Name - identificador unico (ej: `iqn.2024-01.com.empresa:storage.lun1`) |
| **Portal** | Direccion IP y puerto del target (por defecto TCP 3260) |
| **Discovery** | Proceso de descubrir targets disponibles |
| **Session** | Conexion establecida entre initiator y target |
| **CHAP** | Protocolo de autenticacion para iSCSI |

### Formato del IQN

```
iqn.AAAA-MM.nombre_dominio_invertido:identificador_unico
```

Ejemplo: `iqn.2024-01.com.empresa:storage.disco1`

## Configuracion del initiator iSCSI (cliente)

### Paquete y servicio

```bash
# Instalacion
apt install open-iscsi       # Debian/Ubuntu
yum install iscsi-initiator-utils  # RHEL/CentOS

# Servicios
systemctl enable iscsid
systemctl start iscsid
systemctl enable iscsi
systemctl start iscsi
```

### Configuracion del nombre del initiator

```bash
# Archivo de identidad del initiator
cat /etc/iscsi/initiatorname.iscsi
# InitiatorName=iqn.2024-01.com.empresa:servidor01
```

### Descubrimiento y conexion con iscsiadm

```bash
# Descubrir targets en un servidor
iscsiadm -m discovery -t sendtargets -p 192.168.1.100

# Listar targets descubiertos
iscsiadm -m node

# Conectar a un target especifico
iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 --login

# Desconectar de un target
iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 --logout

# Conectar a todos los targets descubiertos
iscsiadm -m node --login

# Desconectar de todos
iscsiadm -m node --logout

# Ver sesiones activas
iscsiadm -m session

# Ver informacion detallada de sesiones
iscsiadm -m session -P 3
```

### Modos de iscsiadm

| Modo (-m) | Funcion |
|---|---|
| `discovery` | Descubrir targets disponibles |
| `node` | Gestionar targets descubiertos (login/logout) |
| `session` | Ver y gestionar sesiones activas |
| `iface` | Gestionar interfaces de red para iSCSI |

### Conexion automatica en el arranque

```bash
# Configurar un target para conexion automatica
iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 \
  --op update -n node.startup -v automatic

# Configurar conexion manual (por defecto)
iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 \
  --op update -n node.startup -v manual
```

### Autenticacion CHAP

```bash
# Configurar autenticacion CHAP para un target
iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 \
  --op update -n node.session.auth.authmethod -v CHAP

iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 \
  --op update -n node.session.auth.username -v mi_usuario

iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 \
  --op update -n node.session.auth.password -v mi_password
```

> **Para el examen:** Conoce la secuencia completa: discovery -> login -> uso -> logout. Y los archivos de configuracion en `/etc/iscsi/`.

## Archivos de configuracion iSCSI

| Archivo | Funcion |
|---|---|
| `/etc/iscsi/iscsid.conf` | Configuracion global del demonio iSCSI |
| `/etc/iscsi/initiatorname.iscsi` | Nombre IQN del initiator |
| `/var/lib/iscsi/nodes/` | Informacion de targets descubiertos |
| `/var/lib/iscsi/send_targets/` | Cache de discovery |

### Parametros importantes de iscsid.conf

```ini
# Timeout de conexion
node.conn[0].timeo.login_timeout = 15

# Tipo de arranque por defecto
node.startup = automatic

# Autenticacion CHAP global
node.session.auth.authmethod = CHAP
node.session.auth.username = usuario
node.session.auth.password = secreto
```

## Configuracion del target iSCSI (servidor)

### Usando targetcli (LIO)

```bash
# Instalacion
apt install targetcli-fb     # Debian/Ubuntu
yum install targetcli         # RHEL/CentOS

# Iniciar targetcli (interfaz interactiva)
targetcli

# Dentro de targetcli:
/> backstores/block create disco1 /dev/sdb
/> iscsi/ create iqn.2024-01.com.empresa:storage
/> iscsi/iqn.2024-01.com.empresa:storage/tpg1/luns/ create /backstores/block/disco1
/> iscsi/iqn.2024-01.com.empresa:storage/tpg1/acls/ create iqn.2024-01.com.empresa:servidor01
/> exit
```

## Multipath I/O

### Concepto

Multipath permite acceder a un dispositivo de almacenamiento SAN a traves de multiples rutas fisicas. Esto proporciona:

- **Redundancia:** Si una ruta falla, el trafico se redirige automaticamente
- **Rendimiento:** Se puede balancear la carga entre rutas activas
- **Alta disponibilidad:** Sin interrupcion del servicio

### Componentes de multipath

```
Servidor ---[Ruta 1: HBA1 -> Switch1 -> Puerto1]---> Storage
         ---[Ruta 2: HBA2 -> Switch2 -> Puerto2]---> (mismo LUN)
```

### Configuracion de multipathd

```bash
# Instalacion
apt install multipath-tools    # Debian/Ubuntu
yum install device-mapper-multipath  # RHEL/CentOS

# Generar configuracion base
mpathconf --enable

# Iniciar el servicio
systemctl enable multipathd
systemctl start multipathd
```

### Archivo /etc/multipath.conf

```conf
defaults {
    polling_interval     30
    path_grouping_policy multibus
    path_selector        "round-robin 0"
    failback             immediate
    no_path_retry        5
    user_friendly_names  yes
}

blacklist {
    devnode "^sd[a-z]$"
    device {
        vendor "ATA"
    }
}

multipaths {
    multipath {
        wwid    3600508b1001c4a3f5e2e4b3c1d2e3f4a
        alias   san_datos
    }
}

devices {
    device {
        vendor             "NETAPP"
        product            "LUN"
        path_grouping_policy group_by_prio
        path_selector      "round-robin 0"
        failback           immediate
    }
}
```

### Secciones de multipath.conf

| Seccion | Funcion |
|---|---|
| `defaults` | Valores por defecto globales |
| `blacklist` | Dispositivos a excluir de multipath |
| `blacklist_exceptions` | Excepciones al blacklist |
| `multipaths` | Configuracion por dispositivo multipath |
| `devices` | Configuracion por fabricante/modelo |

### Comandos de gestion multipath

```bash
# Ver dispositivos multipath
multipath -ll

# Ejemplo de salida:
# san_datos (3600508b...) dm-0 NETAPP,LUN
# size=100G features='1 queue_if_no_path' hwhandler='0'
# |-+- policy='round-robin 0' prio=1 status=active
# | `- 1:0:0:0 sda 8:0  active ready running
# `-+- policy='round-robin 0' prio=1 status=enabled
#   `- 2:0:0:0 sdb 8:16 active ready running

# Recargar configuracion
multipath -r

# Listar dispositivos
multipath -l

# Flush (eliminar) un mapa multipath
multipath -f san_datos

# Ver dispositivos sin multipath
multipath -v2

# Ver la tabla de device-mapper
dmsetup ls
dmsetup table
dmsetup info
```

> **Para el examen:** Comprende las politicas de balanceo (`round-robin`, `multibus`) y la seccion `blacklist` para excluir discos locales.

### Politicas de balanceo

| Politica | Descripcion |
|---|---|
| `round-robin` | Alterna entre rutas equitativamente |
| `multibus` | Todas las rutas en un grupo, round-robin |
| `group_by_prio` | Agrupa rutas por prioridad |
| `failover` | Solo una ruta activa, las demas en standby |
| `group_by_serial` | Agrupa por numero de serie del storage |

## udev y nombres persistentes

Las reglas udev permiten asignar nombres persistentes a dispositivos de almacenamiento:

```bash
# Ver atributos de un dispositivo para crear reglas
udevadm info --query=all --name=/dev/sdb
udevadm info --attribute-walk --name=/dev/sdb

# Ejemplo de regla udev para nombre persistente
# /etc/udev/rules.d/99-storage.rules
SUBSYSTEM=="block", ATTR{serial}=="WD-ABC123", SYMLINK+="disco_datos"

# Recargar reglas udev
udevadm control --reload-rules
udevadm trigger

# Directorios de enlaces persistentes creados por udev:
# /dev/disk/by-id/      - Por identificador del fabricante
# /dev/disk/by-uuid/    - Por UUID del sistema de archivos
# /dev/disk/by-path/    - Por ruta del bus (PCI, etc.)
# /dev/disk/by-label/   - Por etiqueta del sistema de archivos
```

> **Para el examen:** Los enlaces en `/dev/disk/by-*` son generados automaticamente por udev y son la forma recomendada de referenciar dispositivos en `/etc/fstab` para garantizar nombres estables.

## dmsetup - Gestion de Device Mapper

Device Mapper es la capa del kernel que gestiona dispositivos virtuales de bloque (usada por LVM, multipath, dm-crypt):

```bash
# Listar todos los dispositivos device-mapper
dmsetup ls

# Ver informacion de un dispositivo
dmsetup info /dev/dm-0

# Ver la tabla de mapeo
dmsetup table

# Ver el estado
dmsetup status

# Eliminar un dispositivo
dmsetup remove nombre_dispositivo
```
