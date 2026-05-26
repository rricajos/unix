# 104.2 Mantener la integridad de los sistemas de archivos - Comandos clave

## Monitorizar espacio en disco (df)

| Comando | Descripcion |
|---------|-------------|
| `df` | Espacio de todos los FS montados |
| `df -h` | Formato legible (human readable) |
| `df -T` | Mostrar tipo de sistema de archivos |
| `df -i` | Mostrar uso de inodos |
| `df -hT` | Legible + tipo de FS |
| `df -h /home` | Espacio del FS que contiene /home |
| `df -h /dev/sda1` | Espacio de un dispositivo especifico |

## Uso de espacio de directorios (du)

| Comando | Descripcion |
|---------|-------------|
| `du /var/log` | Uso de cada subdirectorio |
| `du -s /var/log` | Solo total (summary) |
| `du -sh /var/log` | Total legible |
| `du -shc dir1 dir2` | Totales + gran total |
| `du --max-depth=1 /var` | Profundidad maxima 1 nivel |
| `du -d 1 /var` | Alias de --max-depth=1 |
| `du -ah /home` | Todos los archivos, legible |
| `du -sh /var/* \| sort -rh` | Ordenar por tamano descendente |

## Verificar y reparar (fsck / e2fsck)

| Comando | Descripcion |
|---------|-------------|
| `fsck /dev/sda1` | Verificar FS (debe estar desmontado) |
| `fsck -y /dev/sda1` | Reparar respondiendo "yes" a todo |
| `fsck -n /dev/sda1` | Solo verificar, no reparar |
| `fsck -f /dev/sda1` | Forzar verificacion |
| `fsck -t ext4 /dev/sda1` | Especificar tipo de FS |
| `e2fsck /dev/sda1` | Verificar ext2/ext3/ext4 |
| `e2fsck -y /dev/sda1` | Reparar ext automaticamente |
| `e2fsck -f /dev/sda1` | Forzar verificacion ext |
| `e2fsck -b 32768 /dev/sda1` | Usar superbloque de respaldo |

## Reparar XFS

| Comando | Descripcion |
|---------|-------------|
| `xfs_repair /dev/sda1` | Reparar XFS (desmontado) |
| `xfs_repair -n /dev/sda1` | Solo verificar (dry-run) |
| `xfs_repair -L /dev/sda1` | Forzar, limpiar log sucio |

> **Nota:** `fsck.xfs` NO repara. Es un placeholder. Usar siempre `xfs_repair`.

## Ajustar parametros ext (tune2fs)

| Comando | Descripcion |
|---------|-------------|
| `tune2fs -l /dev/sda1` | Listar info del superbloque |
| `tune2fs -c 30 /dev/sda1` | Max 30 montajes antes de fsck |
| `tune2fs -c 0 /dev/sda1` | Desactivar check por montajes |
| `tune2fs -i 30d /dev/sda1` | Check cada 30 dias |
| `tune2fs -i 0 /dev/sda1` | Desactivar check por tiempo |
| `tune2fs -j /dev/sda1` | Anadir journal (ext2->ext3) |
| `tune2fs -L "datos" /dev/sda1` | Cambiar etiqueta |
| `tune2fs -m 5 /dev/sda1` | 5% bloques reservados root |
| `tune2fs -U random /dev/sda1` | Generar nuevo UUID |

## Informacion detallada del FS

| Comando | Descripcion |
|---------|-------------|
| `dumpe2fs /dev/sda1` | Info completa (ext) |
| `dumpe2fs -h /dev/sda1` | Solo superbloque (sin grupos) |
| `dumpe2fs /dev/sda1 \| grep superblock` | Ubicaciones de superbloques |
| `xfs_info /mnt/datos` | Info de XFS (debe estar montado) |

## Inodos

| Comando | Descripcion |
|---------|-------------|
| `df -i` | Uso de inodos de todos los FS |
| `ls -i archivo.txt` | Ver inodo de un archivo |
| `stat archivo.txt` | Info completa del inodo |

## Regla de oro: Cuando usar cada herramienta

| Tarea | ext2/ext3/ext4 | XFS |
|-------|---------------|-----|
| Verificar/reparar | `fsck` / `e2fsck` | `xfs_repair` |
| Info del FS | `dumpe2fs` / `tune2fs -l` | `xfs_info` |
| Ajustar parametros | `tune2fs` | N/A |
| Anadir journal | `tune2fs -j` | N/A (siempre tiene) |
