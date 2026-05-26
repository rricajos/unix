---
title: "204.3 - LVM"
tags: [lpic-2, examen-201, tema-204, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.3"
---

# 204.3 - Comandos clave: LVM

## Comandos de Volumenes Fisicos (PV)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `pvcreate` | Inicializar disco/particion como PV | `pvcreate /dev/sdb1` |
| `pvs` | Listar PVs (resumen) | `pvs` |
| `pvdisplay` | Mostrar informacion detallada del PV | `pvdisplay /dev/sdb1` |
| `pvscan` | Escanear discos en busca de PVs | `pvscan` |
| `pvremove` | Eliminar un PV | `pvremove /dev/sdb1` |
| `pvmove` | Mover datos entre PVs | `pvmove /dev/sdb1 /dev/sdc1` |
| `pvresize` | Redimensionar un PV | `pvresize /dev/sdb1` |

## Comandos de Grupos de Volumenes (VG)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `vgcreate` | Crear un VG con uno o mas PVs | `vgcreate vg_datos /dev/sdb1 /dev/sdc1` |
| `vgs` | Listar VGs (resumen) | `vgs` |
| `vgdisplay` | Mostrar informacion detallada del VG | `vgdisplay vg_datos` |
| `vgscan` | Escanear en busca de VGs | `vgscan` |
| `vgextend` | Agregar un PV a un VG | `vgextend vg_datos /dev/sdd1` |
| `vgreduce` | Retirar un PV de un VG | `vgreduce vg_datos /dev/sdb1` |
| `vgremove` | Eliminar un VG | `vgremove vg_datos` |
| `vgrename` | Renombrar un VG | `vgrename vg_datos vg_produccion` |
| `vgchange -a y/n` | Activar/desactivar un VG | `vgchange -a y vg_datos` |
| `vgexport` | Exportar VG para mover entre sistemas | `vgexport vg_datos` |
| `vgimport` | Importar VG de otro sistema | `vgimport vg_datos` |
| `vgcfgbackup` | Hacer backup de metadatos VG | `vgcfgbackup vg_datos` |
| `vgcfgrestore` | Restaurar metadatos VG | `vgcfgrestore vg_datos` |

## Comandos de Volumenes Logicos (LV)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `lvcreate -L TAM -n NOMBRE VG` | Crear un LV | `lvcreate -L 20G -n lv_home vg_datos` |
| `lvcreate -l EXTENTS -n NOMBRE VG` | Crear LV por extents/porcentaje | `lvcreate -l 100%FREE -n lv_backup vg_datos` |
| `lvcreate -s -L TAM -n SNAP LV` | Crear snapshot | `lvcreate -s -L 5G -n snap_home /dev/vg_datos/lv_home` |
| `lvs` | Listar LVs (resumen) | `lvs` |
| `lvdisplay` | Mostrar informacion detallada del LV | `lvdisplay /dev/vg_datos/lv_home` |
| `lvscan` | Escanear en busca de LVs | `lvscan` |
| `lvextend -L +TAM LV` | Ampliar un LV | `lvextend -L +10G /dev/vg_datos/lv_home` |
| `lvextend -r -L +TAM LV` | Ampliar LV y FS juntos | `lvextend -r -L +10G /dev/vg_datos/lv_home` |
| `lvreduce -L TAM LV` | Reducir un LV | `lvreduce -L 15G /dev/vg_datos/lv_home` |
| `lvresize -L TAM LV` | Redimensionar (ampliar o reducir) | `lvresize -r -L 30G /dev/vg_datos/lv_home` |
| `lvremove` | Eliminar un LV | `lvremove /dev/vg_datos/lv_home` |
| `lvrename` | Renombrar un LV | `lvrename vg_datos lv_home lv_usuarios` |
| `lvconvert --merge` | Fusionar snapshot con origen | `lvconvert --merge /dev/vg_datos/snap_home` |

## Comandos de redimensionado de FS

| Comando | Funcion | Ejemplo |
|---|---|---|
| `resize2fs` | Redimensionar ext2/ext3/ext4 | `resize2fs /dev/vg_datos/lv_home` |
| `xfs_growfs` | Ampliar XFS (solo crecimiento) | `xfs_growfs /punto_montaje` |
| `e2fsck -f` | Verificar FS ext antes de reducir | `e2fsck -f /dev/vg_datos/lv_home` |

## Archivos y rutas importantes

| Archivo/Ruta | Funcion |
|---|---|
| `/etc/lvm/lvm.conf` | Configuracion principal de LVM |
| `/etc/lvm/backup/` | Ultimo backup de metadatos de cada VG |
| `/etc/lvm/archive/` | Historico de cambios de metadatos |
| `/dev/VG/LV` | Ruta de acceso al LV (ej: `/dev/vg_datos/lv_home`) |
| `/dev/mapper/VG-LV` | Ruta alternativa via device-mapper |

## Comparacion de operaciones: ampliar vs reducir

| Operacion | Ampliar | Reducir |
|---|---|---|
| Paso 1 | `lvextend` (ampliar LV) | Desmontar (`umount`) |
| Paso 2 | `resize2fs` o `xfs_growfs` (ampliar FS) | `e2fsck -f` (verificar) |
| Paso 3 | - | `resize2fs TAM` (reducir FS) |
| Paso 4 | - | `lvreduce -L TAM` (reducir LV) |
| En linea | Si (con `-r`) | No (requiere desmontar) |
| XFS | Si | No soportado |
| Atajo | `lvextend -r` | `lvresize -r` (con precaucion) |

## Especificadores de tamano para lvcreate/lvextend

| Formato | Significado | Ejemplo |
|---|---|---|
| `-L 20G` | Tamano absoluto de 20 GiB | `lvcreate -L 20G -n lv vg` |
| `-L +10G` | Incrementar 10 GiB | `lvextend -L +10G /dev/vg/lv` |
| `-l 5000` | 5000 extents | `lvcreate -l 5000 -n lv vg` |
| `-l 100%FREE` | Todo el espacio libre del VG | `lvcreate -l 100%FREE -n lv vg` |
| `-l 50%VG` | 50% del tamano total del VG | `lvcreate -l 50%VG -n lv vg` |
| `-l +100%FREE` | Agregar todo el espacio libre | `lvextend -l +100%FREE /dev/vg/lv` |
