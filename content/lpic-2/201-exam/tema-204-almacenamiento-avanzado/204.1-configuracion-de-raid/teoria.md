---
title: "204.1 - Configuracion de RAID"
tags: [lpic-2, examen-201, tema-204, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.1"
---

# 204.1 - Configuracion de RAID

## Introduccion a RAID

RAID (Redundant Array of Independent Disks) es una tecnologia que combina multiples discos fisicos en una unica unidad logica para mejorar el rendimiento, la redundancia o ambos. En el contexto de LPIC-2, es fundamental comprender tanto la implementacion por hardware como por software.

### Hardware RAID vs Software RAID

| Caracteristica | Hardware RAID | Software RAID |
|---|---|---|
| Controlador | Tarjeta RAID dedicada | Gestionado por el SO (mdadm) |
| Rendimiento | Mayor (procesador dedicado) | Consume CPU del sistema |
| Coste | Elevado | Sin coste adicional |
| Portabilidad | Dependiente del controlador | Portable entre sistemas Linux |
| Visibilidad | El SO ve un solo disco | El SO ve todos los discos |
| Recuperacion | Requiere mismo controlador | Cualquier sistema Linux |

> **Para el examen:** Es importante saber que el software RAID en Linux se gestiona con `mdadm` y que los dispositivos RAID aparecen como `/dev/mdX` (por ejemplo, `/dev/md0`, `/dev/md1`).

## Niveles de RAID

### RAID 0 - Striping (Distribucion)

- Los datos se dividen en bloques y se distribuyen entre todos los discos
- **Ventaja:** Maximo rendimiento de lectura y escritura
- **Desventaja:** Sin redundancia; si falla un disco, se pierden TODOS los datos
- **Minimo de discos:** 2
- **Capacidad util:** Suma de todos los discos (N discos)
- **Uso tipico:** Datos temporales, scratch space, donde el rendimiento es critico

```
Disco 1: [A1] [A3] [A5] [A7]
Disco 2: [A2] [A4] [A6] [A8]
```

### RAID 1 - Mirroring (Espejo)

- Los datos se duplican exactamente en todos los discos del array
- **Ventaja:** Alta redundancia; lectura rapida (puede leer de cualquier disco)
- **Desventaja:** Capacidad util reducida al 50% (con 2 discos)
- **Minimo de discos:** 2
- **Capacidad util:** Tamano de un solo disco
- **Uso tipico:** Sistema operativo, datos criticos

```
Disco 1: [A1] [A2] [A3] [A4]
Disco 2: [A1] [A2] [A3] [A4]  (copia exacta)
```

### RAID 5 - Striping con paridad distribuida

- Los datos y la informacion de paridad se distribuyen entre todos los discos
- **Ventaja:** Buen equilibrio entre rendimiento, capacidad y redundancia
- **Desventaja:** Escrituras lentas (calculo de paridad), reconstruccion lenta
- **Tolerancia a fallos:** Soporta la perdida de 1 disco
- **Minimo de discos:** 3
- **Capacidad util:** (N-1) discos

```
Disco 1: [A1] [B2] [Cp]
Disco 2: [A2] [Bp] [C1]
Disco 3: [Ap] [B1] [C2]
(p = paridad, rotada entre discos)
```

### RAID 6 - Striping con doble paridad

- Similar a RAID 5 pero con dos bloques de paridad independientes
- **Ventaja:** Soporta la perdida simultanea de 2 discos
- **Desventaja:** Mayor penalizacion en escritura que RAID 5
- **Minimo de discos:** 4
- **Capacidad util:** (N-2) discos
- **Uso tipico:** Arrays grandes donde la probabilidad de fallo multiple es mayor

### RAID 10 (1+0) - Mirroring + Striping

- Combinacion de RAID 1 y RAID 0: primero se crean espejos, luego se hace striping
- **Ventaja:** Alto rendimiento y alta redundancia
- **Desventaja:** Se pierde el 50% de la capacidad total
- **Minimo de discos:** 4 (en pares)
- **Capacidad util:** N/2 discos
- **Uso tipico:** Bases de datos, aplicaciones de alto rendimiento

```
Espejo 1:  Disco 1 [A1][A3]  <-->  Disco 2 [A1][A3]
Espejo 2:  Disco 3 [A2][A4]  <-->  Disco 4 [A2][A4]
           |--- Stripe (RAID 0) entre espejos ---|
```

> **Para el examen:** Memoriza el numero minimo de discos, la capacidad util y la tolerancia a fallos de cada nivel. Son preguntas frecuentes.

## Tabla resumen de niveles RAID

| Nivel | Discos min. | Capacidad util | Tolerancia a fallos | Rendimiento lectura | Rendimiento escritura |
|---|---|---|---|---|---|
| RAID 0 | 2 | N | Ninguna | Excelente | Excelente |
| RAID 1 | 2 | 1 | N-1 discos | Bueno | Normal |
| RAID 5 | 3 | N-1 | 1 disco | Bueno | Moderado |
| RAID 6 | 4 | N-2 | 2 discos | Bueno | Bajo |
| RAID 10 | 4 | N/2 | 1 por espejo | Excelente | Bueno |

## Software RAID con mdadm

### Creacion de un array RAID

La herramienta principal para gestionar RAID por software en Linux es `mdadm`. Los pasos generales son:

1. Preparar las particiones (tipo `fd` - Linux RAID autodetect, o `da` en GPT)
2. Crear el array con `mdadm --create`
3. Crear el sistema de archivos sobre `/dev/mdX`
4. Configurar `/etc/mdadm.conf` para persistencia

```bash
# Crear RAID 1 con dos discos
mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1

# Crear RAID 5 con tres discos y un spare
mdadm --create /dev/md1 --level=5 --raid-devices=3 --spare-devices=1 \
  /dev/sdb2 /dev/sdc2 /dev/sdd2 /dev/sde2

# Crear RAID 10 con cuatro discos
mdadm --create /dev/md2 --level=10 --raid-devices=4 \
  /dev/sdb3 /dev/sdc3 /dev/sdd3 /dev/sde3
```

### Opciones principales de mdadm --create

| Opcion | Descripcion |
|---|---|
| `--level=N` | Nivel de RAID (0, 1, 5, 6, 10) |
| `--raid-devices=N` | Numero de discos activos en el array |
| `--spare-devices=N` | Numero de discos de reserva (spare) |
| `--chunk=N` | Tamano de bloque en KB (por defecto 512K) |
| `--bitmap=internal` | Habilitar bitmap para resincronizacion rapida |
| `--name=nombre` | Asignar un nombre al array |
| `--assume-clean` | No inicializar (usar con precaucion) |

### Monitorizacion del estado RAID

```bash
# Ver estado de todos los arrays
cat /proc/mdstat

# Ejemplo de salida de /proc/mdstat:
# md0 : active raid1 sdc1[1] sdb1[0]
#       1048512 blocks super 1.2 [2/2] [UU]
# [UU] = ambos discos activos
# [U_] = un disco fallido

# Detalle de un array especifico
mdadm --detail /dev/md0

# Examinar un dispositivo miembro
mdadm --examine /dev/sdb1

# Ver informacion resumida
mdadm --query /dev/md0
```

> **Para el examen:** `/proc/mdstat` es la forma rapida de comprobar el estado del RAID. Los caracteres `[UU]` indican discos activos (U=Up) y `[U_]` indica un disco fallido.

### Discos de reserva (spare)

Los discos spare son unidades que permanecen inactivas en el array hasta que un disco falla, momento en que se activa automaticamente la reconstruccion:

```bash
# Agregar un disco spare a un array existente
mdadm --add /dev/md0 /dev/sdd1

# Verificar que aparece como spare
mdadm --detail /dev/md0
# Debe mostrar: spare   /dev/sdd1
```

### Gestion de fallos y recuperacion

```bash
# Simular un fallo de disco (para pruebas)
mdadm --fail /dev/md0 /dev/sdb1

# Retirar un disco fallido del array
mdadm --remove /dev/md0 /dev/sdb1

# Agregar un disco nuevo (reemplazo)
mdadm --add /dev/md0 /dev/sdf1

# Ver el progreso de reconstruccion
watch cat /proc/mdstat
# Mostrara algo como: [=>........] recovery = 12.5% (123456/987654) finish=5.2min
```

### Detencion y reensamblado de arrays

```bash
# Detener un array
mdadm --stop /dev/md0

# Reensamblar un array
mdadm --assemble /dev/md0 /dev/sdb1 /dev/sdc1

# Reensamblar todos los arrays detectados
mdadm --assemble --scan

# Reensamblar basandose en /etc/mdadm.conf
mdadm --assemble --scan --config=/etc/mdadm.conf
```

## Archivo de configuracion /etc/mdadm.conf

Este archivo es fundamental para que los arrays se ensamblen automaticamente en el arranque:

```bash
# Generar la configuracion automaticamente
mdadm --detail --scan >> /etc/mdadm.conf

# Contenido tipico de /etc/mdadm.conf:
DEVICE partitions
ARRAY /dev/md0 metadata=1.2 UUID=12345678:abcdef01:12345678:abcdef01
ARRAY /dev/md1 metadata=1.2 UUID=87654321:fedcba10:87654321:fedcba10
MAILADDR root@localhost
```

| Directiva | Descripcion |
|---|---|
| `DEVICE` | Dispositivos a escanear (`partitions` para todas las particiones) |
| `ARRAY` | Definicion de un array con su UUID |
| `MAILADDR` | Direccion para alertas de fallo |
| `PROGRAM` | Script a ejecutar en eventos |
| `CREATE` | Opciones por defecto para creacion |

> **Para el examen:** Despues de crear o modificar un array, siempre hay que actualizar `/etc/mdadm.conf` con `mdadm --detail --scan` y luego actualizar el initramfs con `update-initramfs -u` (Debian) o `dracut -f` (RHEL).

## Monitorizacion con mdadm

```bash
# Iniciar el demonio de monitorizacion
mdadm --monitor --daemonise --mail=admin@ejemplo.com /dev/md0

# Monitorizacion continua de todos los arrays
mdadm --monitor --scan --daemonise

# Verificar integridad (scrub) - se programa via cron
echo check > /sys/block/md0/md/sync_action

# Ver resultado del check
cat /sys/block/md0/md/mismatch_cnt
```

## Crecimiento y modificacion de arrays

```bash
# Agregar un disco a un RAID 5 existente (grow)
mdadm --grow /dev/md1 --raid-devices=4 --add /dev/sdf1

# Cambiar el tamano de chunk
mdadm --grow /dev/md1 --chunk=256

# Despues de crecer, redimensionar el sistema de archivos
resize2fs /dev/md1       # para ext4
xfs_growfs /mountpoint   # para XFS
```

## Consideraciones para el arranque

- Para arrancar desde RAID, se recomienda RAID 1 para `/boot`
- El gestor de arranque (GRUB) debe estar instalado en todos los discos del array
- El `initramfs` debe contener los modulos de RAID y la configuracion de mdadm
- En sistemas con UEFI, la particion EFI no puede estar en RAID por software

```bash
# Instalar GRUB en ambos discos de un RAID 1
grub-install /dev/sdb
grub-install /dev/sdc

# Regenerar initramfs
update-initramfs -u    # Debian/Ubuntu
dracut -f              # RHEL/CentOS
```

## Buenas practicas

- Usar siempre discos spare para reconstruccion automatica
- Configurar alertas por correo con `MAILADDR` en `/etc/mdadm.conf`
- Programar verificaciones periodicas (weekly scrub)
- Documentar la configuracion del array y el UUID de cada disco
- Mantener actualizado `/etc/mdadm.conf` y el initramfs
- Monitorizar `/proc/mdstat` regularmente
- No mezclar discos de diferentes tamanos en RAID 5/6 (se usa el menor)
