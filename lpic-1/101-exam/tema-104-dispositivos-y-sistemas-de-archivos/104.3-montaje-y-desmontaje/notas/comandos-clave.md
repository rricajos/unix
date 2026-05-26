# 104.3 Controlar el montaje y desmontaje - Comandos clave

## Montar sistemas de archivos (mount)

| Comando | Descripcion |
|---------|-------------|
| `mount /dev/sda1 /mnt` | Montar particion en /mnt |
| `mount -t ext4 /dev/sda1 /mnt` | Montar especificando tipo |
| `mount UUID="xxxx" /mnt` | Montar por UUID |
| `mount LABEL="datos" /mnt` | Montar por etiqueta |
| `mount -o ro /dev/sda1 /mnt` | Montar como solo lectura |
| `mount -o rw,noexec,nosuid /dev/sdb1 /mnt` | Montar con opciones multiples |
| `mount -o remount,ro /` | Remontar raiz como solo lectura |
| `mount -o remount,rw /` | Remontar raiz como lectura-escritura |
| `mount -o loop imagen.iso /mnt/iso` | Montar imagen ISO |
| `mount -a` | Montar todo lo de /etc/fstab (excepto noauto) |
| `mount` | Ver sistemas montados (salida sin formato) |

## Opciones de montaje comunes

| Opcion | Descripcion |
|--------|-------------|
| `defaults` | `rw,suid,dev,exec,auto,nouser,async` |
| `ro` | Solo lectura |
| `rw` | Lectura-escritura |
| `noexec` | No permitir ejecucion |
| `nosuid` | Ignorar SUID/SGID |
| `nodev` | No interpretar dispositivos especiales |
| `noatime` | No actualizar tiempo de acceso |
| `user` | Usuarios pueden montar (implica noexec,nosuid,nodev) |
| `users` | Cualquiera puede montar/desmontar |
| `noauto` | No montar con `mount -a` |
| `loop` | Montar archivo como dispositivo |
| `remount` | Cambiar opciones sin desmontar |
| `nofail` | No fallar si dispositivo ausente |
| `sync` | Escrituras sincronas |

## Desmontar (umount)

| Comando | Descripcion |
|---------|-------------|
| `umount /mnt/datos` | Desmontar por punto de montaje |
| `umount /dev/sda1` | Desmontar por dispositivo |
| `umount -f /mnt/datos` | Forzar desmontaje |
| `umount -l /mnt/datos` | Lazy unmount (desconecta, limpia despues) |

> Nota: es `umount`, NO "unmount"

## /etc/fstab - Formato de 6 campos

```
<dispositivo>  <punto_montaje>  <tipo>  <opciones>  <dump>  <pass>
```

| Campo | Descripcion | Valores comunes |
|-------|-------------|-----------------|
| 1. Dispositivo | Que montar | `UUID=xxxx`, `/dev/sda1`, `LABEL=datos` |
| 2. Punto montaje | Donde montar | `/`, `/home`, `/mnt/datos`, `swap` |
| 3. Tipo | Tipo FS | `ext4`, `xfs`, `vfat`, `swap`, `auto` |
| 4. Opciones | Opciones montaje | `defaults`, `defaults,noatime` |
| 5. Dump | Backup | `0` (no) o `1` (si) |
| 6. Pass | Orden fsck | `0`=no, `1`=raiz, `2`=resto |

### Ejemplo de /etc/fstab

```
UUID=abc-123    /        ext4   defaults          0  1
UUID=def-456    /home    ext4   defaults          0  2
UUID=ghi-789    swap     swap   defaults          0  0
/dev/sdb1       /datos   xfs    defaults,noatime  0  2
LABEL=USB       /mnt/usb vfat   noauto,user       0  0
```

## Consultar dispositivos y montajes

| Comando | Descripcion |
|---------|-------------|
| `blkid` | Mostrar UUID, tipo y etiqueta de dispositivos |
| `blkid /dev/sda1` | Info de un dispositivo especifico |
| `lsblk` | Listar dispositivos en arbol |
| `lsblk -f` | Arbol con UUID, tipo FS, punto montaje |
| `lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT` | Columnas personalizadas |
| `findmnt` | Mostrar montajes en arbol (moderna) |
| `findmnt -l` | Formato de lista plana |
| `findmnt -t ext4,xfs` | Filtrar por tipo de FS |
| `findmnt /dev/sda1` | Buscar donde esta montado |
| `findmnt /home` | Ver que hay montado en /home |
| `findmnt --fstab` | Mostrar entradas de fstab |

## Unidades de montaje systemd

| Concepto | Descripcion |
|----------|-------------|
| `.mount` | Unidad de montaje (nombre = ruta con `-`) |
| `.automount` | Montaje bajo demanda |
| Nombre | `/mnt/datos` -> `mnt-datos.mount` |
| `systemctl start mnt-datos.mount` | Montar |
| `systemctl stop mnt-datos.mount` | Desmontar |
| `systemctl enable mnt-datos.mount` | Montar al arrancar |

## Diagnostico de "target is busy"

| Comando | Descripcion |
|---------|-------------|
| `lsof /mnt/datos` | Ver archivos abiertos en el punto de montaje |
| `fuser -mv /mnt/datos` | Ver procesos usando el punto de montaje |
| `fuser -km /mnt/datos` | Matar procesos que usan el montaje |
