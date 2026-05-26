---
title: "206.2 - Operaciones de backup"
tags: [lpic-2, examen-201, tema-206, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.2"
---

# 206.2 - Comandos clave: Operaciones de backup

## tar

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `tar czf FILE DIR` | Crear archivo comprimido con gzip | `tar czf backup.tar.gz /home` |
| `tar cjf FILE DIR` | Crear archivo comprimido con bzip2 | `tar cjf backup.tar.bz2 /etc` |
| `tar cJf FILE DIR` | Crear archivo comprimido con xz | `tar cJf backup.tar.xz /home` |
| `tar xzf FILE` | Extraer archivo gzip | `tar xzf backup.tar.gz -C /restore` |
| `tar tzf FILE` | Listar contenido del archivo | `tar tzf backup.tar.gz` |
| `tar --listed-incremental=SNAP` | Backup incremental con archivo snapshot | `tar --listed-incremental=/var/backups/snap.snar -czf inc.tar.gz /home` |
| `tar --newer=FECHA` | Archivar archivos mas nuevos que una fecha | `tar czf cambios.tar.gz --newer="2024-01-15" /home` |

## rsync

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `rsync -av SRC DEST` | Sincronizar en modo archivo con detalle | `rsync -av /home/ /backup/home/` |
| `rsync -avz SRC HOST:DEST` | Sincronizacion remota con compresion | `rsync -avz /home/ user@srv:/backup/` |
| `rsync --delete` | Eliminar archivos en destino que no estan en origen | `rsync -av --delete /home/ /backup/` |
| `rsync --exclude=PATRON` | Excluir archivos por patron | `rsync -av --exclude='*.tmp' /home/ /backup/` |
| `rsync --exclude-from=FILE` | Excluir usando archivo de patrones | `rsync -av --exclude-from=lista.txt /home/ /backup/` |
| `rsync -n` / `--dry-run` | Simulacion sin cambios | `rsync -avn --delete /home/ /backup/` |
| `rsync -e "ssh -p PORT"` | Usar puerto SSH especifico | `rsync -avz -e "ssh -p 2222" /home/ user@srv:/bkp/` |
| `rsync --link-dest=DIR` | Hardlinks para backup incremental | `rsync -av --link-dest=../ayer /home/ /bkp/hoy/` |
| `rsync --bwlimit=KBPS` | Limitar ancho de banda | `rsync -avz --bwlimit=5000 /home/ user@srv:/bkp/` |

## dd

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `dd if=IN of=OUT` | Copia a nivel de bloques | `dd if=/dev/sda of=/dev/sdb bs=4M` |
| `dd bs=512 count=1` | Copiar el MBR | `dd if=/dev/sda of=mbr.bin bs=512 count=1` |
| `dd status=progress` | Mostrar progreso | `dd if=/dev/sda of=disk.img bs=4M status=progress` |
| `dd conv=noerror,sync` | Continuar en errores, rellenar con ceros | `dd if=/dev/sda of=disk.img conv=noerror,sync` |

## cpio

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `cpio -ov` | Crear archivo (copy-out) | `find /etc \| cpio -ov > etc.cpio` |
| `cpio -idv` | Extraer archivo (copy-in) | `cpio -idv < etc.cpio` |
| `cpio -tv` | Listar contenido | `cpio -tv < etc.cpio` |
| `cpio -pdv DIR` | Copiar directo entre directorios (copy-pass) | `find /home \| cpio -pdv /backup/` |

## Automatizacion y programacion

| Ruta / Comando | Descripcion |
|-----------------|-------------|
| `/etc/cron.d/` | Directorio para tareas cron del sistema |
| `/etc/crontab` | Archivo principal de cron del sistema |
| `crontab -e` | Editar crontab del usuario actual |

## Soluciones empresariales

| Herramienta | Descripcion |
|-------------|-------------|
| **Amanda** | Backup en red cliente-servidor, usa tar/dump como backend |
| **Bacula** | Arquitectura modular (Director, Storage, File Daemon), catalogo en BD |
| **BURP** | Backup en red con deduplicacion y protocolo SSL propio |

## Snapshots LVM para backup

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `lvcreate -s -n NAME -L SIZE LV` | Crear snapshot | `lvcreate -s -n snap_home -L 5G /dev/vg0/home` |
| `lvremove LV` | Eliminar snapshot | `lvremove /dev/vg0/snap_home` |
