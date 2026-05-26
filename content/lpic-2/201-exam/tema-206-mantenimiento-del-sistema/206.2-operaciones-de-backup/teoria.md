---
title: "206.2 - Operaciones de backup"
tags: [lpic-2, examen-201, tema-206, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.2"
---

# 206.2 - Operaciones de backup

## Introduccion

Las copias de seguridad son una de las responsabilidades mas criticas de un administrador de sistemas. Este subtema tiene un **peso de 3** en el examen LPIC-2 201 y cubre las herramientas y estrategias fundamentales para realizar backups en sistemas Linux.

## Estrategias de backup

### Tipos de backup

| Tipo | Descripcion | Ventajas | Desventajas |
|------|-------------|----------|-------------|
| **Completo (Full)** | Copia todos los datos seleccionados | Restauracion rapida y sencilla | Requiere mas espacio y tiempo |
| **Incremental** | Copia solo los datos modificados desde el ultimo backup (cualquier tipo) | Rapido y ahorra espacio | Restauracion lenta (necesita todos los incrementales) |
| **Diferencial** | Copia los datos modificados desde el ultimo backup completo | Restauracion mas rapida que incremental | Crece con el tiempo hasta el proximo full |

### Esquema clasico de rotacion

Un esquema comun es realizar un backup completo semanal y backups incrementales diarios:

```
Domingo:    Full backup
Lunes:      Incremental (cambios desde domingo)
Martes:     Incremental (cambios desde lunes)
Miercoles:  Incremental (cambios desde martes)
...
Sabado:     Incremental (cambios desde viernes)
```

> **Para el examen:** Entiende la diferencia entre incremental (desde el ultimo backup de cualquier tipo) y diferencial (siempre desde el ultimo full). La restauracion incremental requiere el full + todos los incrementales en orden.

## tar - Archivado y backups incrementales

### Uso basico de tar

```bash
# Crear un archivo tar comprimido con gzip
tar czf backup-2024-01-15.tar.gz /home /etc

# Crear con compresion bzip2
tar cjf backup.tar.bz2 /home

# Crear con compresion xz
tar cJf backup.tar.xz /home

# Extraer un archivo tar
tar xzf backup.tar.gz

# Extraer en un directorio especifico
tar xzf backup.tar.gz -C /restore/

# Listar contenido sin extraer
tar tzf backup.tar.gz
```

### Backups incrementales con tar

tar soporta backups incrementales mediante el archivo snapshot (`--listed-incremental`):

```bash
# Backup completo (nivel 0) - crea el archivo snapshot
tar --listed-incremental=/var/backups/snapshot.snar \
    -czf /backup/full-$(date +%Y%m%d).tar.gz /home

# Backup incremental (nivel 1) - usa y actualiza el snapshot
tar --listed-incremental=/var/backups/snapshot.snar \
    -czf /backup/inc-$(date +%Y%m%d).tar.gz /home
```

El archivo `.snar` (snapshot) registra el estado de los archivos. Cada vez que se ejecuta, tar solo archiva los archivos nuevos o modificados desde la ultima ejecucion.

```bash
# Para restaurar una cadena incremental:
# 1. Restaurar el backup completo
tar --listed-incremental=/dev/null -xzf /backup/full-20240115.tar.gz

# 2. Restaurar cada incremental en orden
tar --listed-incremental=/dev/null -xzf /backup/inc-20240116.tar.gz
tar --listed-incremental=/dev/null -xzf /backup/inc-20240117.tar.gz
```

### Backup con --newer (backups por fecha)

```bash
# Archivar archivos modificados despues de una fecha
tar -czf /backup/cambios.tar.gz --newer="2024-01-15" /home

# Usar un archivo de referencia para la fecha
tar -czf /backup/cambios.tar.gz --newer-mtime="/var/backups/timestamp" /home

# Actualizar el archivo de referencia
touch /var/backups/timestamp
```

> **Para el examen:** `--listed-incremental` es el metodo preferido para backups incrementales con tar. Al restaurar, se usa `--listed-incremental=/dev/null` para indicar que se trata de una restauracion.

## rsync - Sincronizacion eficiente

### Conceptos basicos

`rsync` sincroniza archivos y directorios de forma eficiente, transfiriendo solo las diferencias entre origen y destino.

```bash
# Sincronizacion local basica
rsync -av /home/usuario/ /backup/usuario/

# IMPORTANTE: la barra final en el origen afecta el comportamiento
# Con barra: copia el CONTENIDO del directorio
rsync -av /home/usuario/ /backup/usuario/
# Sin barra: copia el directorio MISMO
rsync -av /home/usuario /backup/
```

### Opciones principales de rsync

| Opcion | Descripcion |
|--------|-------------|
| `-a` (archive) | Equivale a `-rlptgoD`: recursivo, enlaces, permisos, tiempos, grupo, owner, devices |
| `-v` (verbose) | Muestra informacion detallada |
| `-z` (compress) | Comprime los datos durante la transferencia |
| `--delete` | Elimina archivos en destino que no existen en origen |
| `--exclude=PATRON` | Excluye archivos que coinciden con el patron |
| `--exclude-from=FILE` | Lee patrones de exclusion de un archivo |
| `-n` / `--dry-run` | Simulacion sin realizar cambios |
| `--progress` | Muestra progreso de la transferencia |
| `-e` | Especifica el shell remoto (generalmente ssh) |
| `--bwlimit=KBPS` | Limita el ancho de banda |
| `--backup` | Crea copias de los archivos modificados |
| `--backup-dir=DIR` | Directorio para las copias de seguridad |

### rsync remoto

```bash
# Sincronizar con servidor remoto via SSH
rsync -avz /home/usuario/ usuario@servidor:/backup/usuario/

# Especificar puerto SSH diferente
rsync -avz -e "ssh -p 2222" /home/ usuario@servidor:/backup/

# Sincronizacion espejo (elimina archivos extras en destino)
rsync -avz --delete /home/usuario/ usuario@servidor:/backup/usuario/

# Excluir archivos y directorios
rsync -avz --exclude='*.tmp' --exclude='.cache/' /home/ /backup/

# Simulacion antes de ejecutar
rsync -avzn --delete /home/ /backup/
```

### rsync para backups incrementales con hardlinks

```bash
# Backup incremental usando hardlinks (estilo Time Machine)
rsync -av --delete \
      --link-dest=/backup/daily/$(date -d yesterday +%Y%m%d) \
      /home/ /backup/daily/$(date +%Y%m%d)/
```

> **Para el examen:** Conoce bien las opciones `-a`, `-v`, `-z` y `--delete`. Recuerda la diferencia de comportamiento con y sin barra final en la ruta de origen. `rsync` usa SSH por defecto para conexiones remotas.

## dd - Copia a bajo nivel

`dd` copia datos a nivel de bloques, ideal para clonar discos y particiones.

```bash
# Clonar un disco completo
dd if=/dev/sda of=/dev/sdb bs=4M status=progress

# Crear imagen de un disco
dd if=/dev/sda of=/backup/disco.img bs=4M status=progress

# Restaurar imagen a un disco
dd if=/backup/disco.img of=/dev/sda bs=4M status=progress

# Backup del MBR (primeros 512 bytes)
dd if=/dev/sda of=/backup/mbr.bin bs=512 count=1

# Restaurar solo la tabla de particiones (sin el bootloader)
dd if=/backup/mbr.bin of=/dev/sda bs=1 count=64 skip=446 seek=446

# Crear un archivo de tamano fijo (para swap, testing)
dd if=/dev/zero of=/swapfile bs=1M count=1024
```

### Opciones importantes de dd

| Opcion | Descripcion |
|--------|-------------|
| `if=` | Archivo/dispositivo de entrada (input file) |
| `of=` | Archivo/dispositivo de salida (output file) |
| `bs=` | Tamano del bloque de lectura/escritura |
| `count=` | Numero de bloques a copiar |
| `skip=` | Bloques a saltar en la entrada |
| `seek=` | Bloques a saltar en la salida |
| `status=progress` | Muestra progreso de la copia |
| `conv=noerror,sync` | Continua en caso de errores, rellena con ceros |

> **Para el examen:** `dd` es esencial para backup de MBR y clonacion de discos. Recuerda que `bs=512 count=1` copia exactamente el MBR. Ten cuidado: `dd` no pide confirmacion y puede destruir datos.

## cpio - Archivado alternativo

`cpio` (Copy In and Out) es una herramienta de archivado que lee nombres de archivo desde la entrada estandar.

```bash
# Crear un archivo cpio (modo copy-out)
find /home -name "*.conf" | cpio -ov > backup-conf.cpio

# Extraer un archivo cpio (modo copy-in)
cpio -idv < backup-conf.cpio

# Listar contenido de un archivo cpio
cpio -tv < backup-conf.cpio

# Crear archivo con compresion
find /etc | cpio -ov | gzip > etc-backup.cpio.gz

# Extraer archivo comprimido
zcat etc-backup.cpio.gz | cpio -idv

# Copiar una estructura de directorio (modo copy-pass)
find /home -newer /var/backups/timestamp | cpio -pdv /backup/
```

### Modos de cpio

| Modo | Opcion | Descripcion |
|------|--------|-------------|
| Copy-out | `-o` | Crea un archivo (escribe en stdout) |
| Copy-in | `-i` | Extrae de un archivo (lee de stdin) |
| Copy-pass | `-p` | Copia directamente entre directorios |

> **Para el examen:** `cpio` se usa frecuentemente con `find` para seleccionar archivos. Recuerda los tres modos: `-o` (crear), `-i` (extraer) y `-p` (copiar directo).

## Soluciones de backup empresarial

### Amanda (Advanced Maryland Automatic Network Disk Archiver)

- Sistema de backup en red cliente-servidor
- Soporta backup a disco y cinta
- Planificacion automatica de backups full e incrementales
- Usa herramientas nativas (`tar`, `dump`) como backend
- Archivos de configuracion en `/etc/amanda/`

### Bacula

- Arquitectura modular: Director, Storage Daemon, File Daemon, Console
- Soporta multiples sistemas operativos
- Base de datos para catalogo (MySQL, PostgreSQL, SQLite)
- Soporte para cintas, discos y almacenamiento en la nube
- Alta escalabilidad para entornos empresariales

### BURP (BackUp and Restore Program)

- Sistema de backup en red con deduplicacion
- Backups incrementales eficientes
- Protocolo propio basado en SSL
- Interfaz web opcional

> **Para el examen:** No necesitas conocer la configuracion detallada de Amanda, Bacula o BURP, pero si debes saber que existen y sus caracteristicas principales.

## Automatizacion de backups con cron

```bash
# Archivo en /etc/cron.d/backup-diario
# Backup incremental diario a las 2:00 AM
0 2 * * 1-6 root /usr/local/bin/backup-incremental.sh

# Backup completo los domingos a las 1:00 AM
0 1 * * 0 root /usr/local/bin/backup-full.sh
```

### Script de ejemplo para backup automatizado

```bash
#!/bin/bash
# /usr/local/bin/backup-incremental.sh

BACKUP_DIR="/backup"
SNAPSHOT="/var/backups/home.snar"
DATE=$(date +%Y%m%d)
LOG="/var/log/backup.log"

echo "$(date): Iniciando backup incremental" >> $LOG

tar --listed-incremental=$SNAPSHOT \
    -czf $BACKUP_DIR/home-inc-$DATE.tar.gz \
    /home 2>> $LOG

if [ $? -eq 0 ]; then
    echo "$(date): Backup completado exitosamente" >> $LOG
else
    echo "$(date): ERROR en el backup" >> $LOG
fi
```

## Snapshots y backups con LVM

```bash
# Crear snapshot de un volumen logico
lvcreate -L 5G -s -n snap_home /dev/vg0/home

# Montar el snapshot para backup
mount -o ro /dev/vg0/snap_home /mnt/snapshot

# Realizar backup del snapshot
tar czf /backup/home-snapshot.tar.gz /mnt/snapshot/

# Limpiar
umount /mnt/snapshot
lvremove /dev/vg0/snap_home
```

> **Para el examen:** Los snapshots LVM permiten realizar backups consistentes de un sistema en funcionamiento. El snapshot se crea instantaneamente y captura el estado del volumen en ese momento.
