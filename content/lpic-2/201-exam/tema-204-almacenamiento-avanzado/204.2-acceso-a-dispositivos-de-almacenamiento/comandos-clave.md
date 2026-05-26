---
title: "204.2 - Acceso a dispositivos de almacenamiento"
tags: [lpic-2, examen-201, tema-204, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.2"
---

# 204.2 - Comandos clave: Acceso a dispositivos de almacenamiento

## Comandos iSCSI (iscsiadm)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `iscsiadm -m discovery -t sendtargets -p IP` | Descubrir targets en un servidor | `iscsiadm -m discovery -t sendtargets -p 192.168.1.100` |
| `iscsiadm -m node` | Listar targets descubiertos | `iscsiadm -m node` |
| `iscsiadm -m node -T IQN -p IP --login` | Conectar a un target | `iscsiadm -m node -T iqn.2024-01.com.empresa:lun1 -p 192.168.1.100 --login` |
| `iscsiadm -m node -T IQN -p IP --logout` | Desconectar de un target | `iscsiadm -m node -T iqn.2024-01.com.empresa:lun1 -p 192.168.1.100 --logout` |
| `iscsiadm -m node --login` | Conectar a todos los targets | `iscsiadm -m node --login` |
| `iscsiadm -m node --logout` | Desconectar de todos | `iscsiadm -m node --logout` |
| `iscsiadm -m session` | Ver sesiones activas | `iscsiadm -m session` |
| `iscsiadm -m session -P 3` | Detalle completo de sesiones | `iscsiadm -m session -P 3` |
| `iscsiadm -m node --op update -n PARAM -v VALOR` | Modificar parametro de un target | `iscsiadm -m node -T IQN -p IP --op update -n node.startup -v automatic` |
| `iscsiadm -m node --op delete -T IQN` | Eliminar un target de la cache | `iscsiadm -m node --op delete -T iqn.2024-01.com.empresa:lun1` |

## Comandos multipath

| Comando | Funcion | Ejemplo |
|---|---|---|
| `multipath -ll` | Ver dispositivos multipath con detalle | `multipath -ll` |
| `multipath -l` | Listar dispositivos multipath | `multipath -l` |
| `multipath -r` | Recargar configuracion | `multipath -r` |
| `multipath -f NOMBRE` | Eliminar un mapa multipath | `multipath -f san_datos` |
| `multipath -F` | Eliminar todos los mapas multipath no usados | `multipath -F` |
| `multipath -v2` | Mostrar dispositivos con verbosidad | `multipath -v2` |
| `multipathd show paths` | Ver estado de las rutas | `multipathd show paths` |
| `multipathd show maps` | Ver mapas de dispositivos | `multipathd show maps` |

## Comandos dmsetup

| Comando | Funcion | Ejemplo |
|---|---|---|
| `dmsetup ls` | Listar dispositivos device-mapper | `dmsetup ls` |
| `dmsetup info` | Informacion de dispositivos DM | `dmsetup info /dev/dm-0` |
| `dmsetup table` | Ver tabla de mapeo | `dmsetup table` |
| `dmsetup status` | Ver estado de dispositivos DM | `dmsetup status` |
| `dmsetup remove NOMBRE` | Eliminar un dispositivo DM | `dmsetup remove mi_dispositivo` |

## Comandos udev

| Comando | Funcion | Ejemplo |
|---|---|---|
| `udevadm info --query=all --name=DEV` | Ver toda la informacion udev | `udevadm info --query=all --name=/dev/sdb` |
| `udevadm info --attribute-walk --name=DEV` | Recorrer arbol de atributos | `udevadm info --attribute-walk --name=/dev/sdb` |
| `udevadm control --reload-rules` | Recargar reglas udev | `udevadm control --reload-rules` |
| `udevadm trigger` | Reaplicar reglas a dispositivos | `udevadm trigger` |
| `udevadm monitor` | Monitorizar eventos udev en tiempo real | `udevadm monitor` |

## Archivos y rutas importantes

| Archivo/Ruta | Funcion |
|---|---|
| `/etc/iscsi/iscsid.conf` | Configuracion global del demonio iSCSI |
| `/etc/iscsi/initiatorname.iscsi` | Nombre IQN del initiator |
| `/var/lib/iscsi/nodes/` | Cache de targets descubiertos |
| `/var/lib/iscsi/send_targets/` | Cache de resultados de discovery |
| `/etc/multipath.conf` | Configuracion de multipath |
| `/etc/udev/rules.d/` | Directorio de reglas udev personalizadas |
| `/dev/disk/by-id/` | Enlaces persistentes por ID del fabricante |
| `/dev/disk/by-uuid/` | Enlaces persistentes por UUID |
| `/dev/disk/by-path/` | Enlaces persistentes por ruta del bus |
| `/dev/disk/by-label/` | Enlaces persistentes por etiqueta |
| `/dev/mapper/` | Dispositivos gestionados por device-mapper |

## Comparacion de tecnologias SAN

| Caracteristica | Fibre Channel | iSCSI | FCoE |
|---|---|---|---|
| Transporte | Fibra dedicada | TCP/IP (Ethernet) | Ethernet (sin TCP) |
| Puerto por defecto | N/A | TCP 3260 | N/A |
| Identificador | WWPN/WWNN | IQN | WWPN |
| Coste | Alto | Bajo | Medio |
| Rendimiento | Muy alto | Depende de la red | Alto |
| Complejidad | Alta | Baja | Media |

## Flujo de trabajo iSCSI (initiator)

```bash
# 1. Configurar nombre del initiator
echo "InitiatorName=iqn.2024-01.com.empresa:servidor01" > /etc/iscsi/initiatorname.iscsi

# 2. Iniciar el servicio
systemctl start iscsid

# 3. Descubrir targets
iscsiadm -m discovery -t sendtargets -p 192.168.1.100

# 4. Conectar
iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 --login

# 5. Verificar nuevo dispositivo
lsblk
fdisk -l

# 6. Configurar auto-login
iscsiadm -m node -T iqn.2024-01.com.empresa:storage.lun1 -p 192.168.1.100 \
  --op update -n node.startup -v automatic
```
