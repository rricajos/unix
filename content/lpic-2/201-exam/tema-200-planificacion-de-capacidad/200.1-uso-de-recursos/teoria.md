---
title: "200.1 - Uso de recursos"
tags: [lpic-2, examen-201, tema-200, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "200"
subtema: "200.1"
---

# 200.1 - Uso de recursos

## Introduccion

La planificacion de capacidad es una de las responsabilidades fundamentales de un administrador de sistemas Linux avanzado. El subtema 200.1 se centra en medir y analizar el uso actual de los recursos del sistema: CPU, memoria, disco y red. Sin una comprension clara del estado actual, es imposible planificar para el futuro.

Este subtema tiene un **peso de 6** en el examen, lo que lo convierte en uno de los mas importantes del Tema 200.

## Medicion del uso de CPU

### El concepto de carga del sistema (Load Average)

El **load average** representa el numero promedio de procesos que estan en estado ejecutable o en espera de I/O durante un periodo de tiempo. Se muestran tres valores correspondientes a los ultimos 1, 5 y 15 minutos.

```bash
$ uptime
 14:32:07 up 45 days,  3:21,  2 users,  load average: 0.45, 0.67, 0.82
```

- Un load average de **1.0** en un sistema con un solo nucleo significa que la CPU esta al 100%
- En un sistema con **4 nucleos**, un load average de 4.0 indica uso completo
- Valores superiores al numero de nucleos indican que hay procesos en cola de espera

> **Para el examen:** El load average NO es un porcentaje. Es el numero promedio de procesos en cola de ejecucion. Un load average de 2.0 en un sistema con 2 CPUs significa uso completo, pero en uno con 8 CPUs es una carga baja.

### vmstat - Estadisticas de memoria virtual

El comando `vmstat` proporciona informacion sobre procesos, memoria, swap, I/O, sistema y CPU.

```bash
$ vmstat 5 3
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0  12340 245680  98432 1234560    0    0    12    45  234  567 15  3 80  2  0
 0  0  12340 244320  98432 1234680    0    0     0    32  198  432 12  2 85  1  0
 2  0  12340 243980  98448 1234720    0    0     4    28  210  489 18  4 76  2  0
```

Columnas importantes:
- **r**: procesos en espera de ejecucion (run queue)
- **b**: procesos bloqueados en espera de I/O
- **swpd**: memoria swap utilizada (KB)
- **si/so**: swap in/swap out por segundo
- **us**: porcentaje CPU en modo usuario
- **sy**: porcentaje CPU en modo sistema (kernel)
- **id**: porcentaje CPU inactiva
- **wa**: porcentaje CPU esperando I/O
- **st**: porcentaje CPU robada por el hipervisor (en virtualizacion)

> **Para el examen:** Si `wa` (wait) es consistentemente alto, indica un cuello de botella de I/O en disco. Si `r` es mayor que el numero de CPUs, hay un cuello de botella de CPU.

### top y htop

`top` es la herramienta interactiva por excelencia para monitorizar procesos en tiempo real.

```bash
$ top
top - 14:35:22 up 45 days,  3:24,  2 users,  load average: 0.45, 0.67, 0.82
Tasks: 234 total,   2 running, 230 sleeping,   0 stopped,   2 zombie
%Cpu(s): 15.2 us,  3.1 sy,  0.0 ni, 79.5 id,  2.0 wa,  0.0 hi,  0.2 si,  0.0 st
MiB Mem :   7856.4 total,   2456.8 free,   3245.2 used,   2154.4 buff/cache
MiB Swap:   4096.0 total,   4083.7 free,     12.3 used.   4123.6 avail Mem
```

Teclas utiles en `top`:
- **P**: ordenar por uso de CPU
- **M**: ordenar por uso de memoria
- **k**: enviar senal (kill) a un proceso
- **1**: mostrar cada CPU individual
- **q**: salir

`htop` es una version mejorada con interfaz en color, soporte de raton y visualizacion mas intuitiva. Permite desplazamiento vertical y horizontal por la lista de procesos.

### iostat - Estadisticas de I/O

`iostat` pertenece al paquete **sysstat** y muestra estadisticas de CPU y dispositivos de I/O.

```bash
$ iostat -x 2 3
Linux 5.15.0-56-generic    05/15/2026    _x86_64_

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
          15.23    0.00    3.12    2.04    0.00   79.61

Device  r/s  w/s  rkB/s  wkB/s  rrqm/s  wrqm/s  %util  await  r_await  w_await
sda    12.4  45.6  198.4  364.8    1.2     8.9   12.3    4.56    3.21     5.12
sdb     0.8   2.1   12.8   33.6    0.1     0.4    1.2    2.34    1.89     2.67
```

Campos clave:
- **%util**: porcentaje de tiempo que el dispositivo estuvo ocupado
- **await**: tiempo medio de espera de las solicitudes de I/O (ms)
- **r/s y w/s**: lecturas y escrituras por segundo

> **Para el examen:** Un `%util` cercano a 100% indica que el disco esta saturado. Un `await` alto combinado con `%util` alto confirma un cuello de botella de disco.

### sar - System Activity Reporter

`sar` es la herramienta mas completa del paquete **sysstat**. Recopila, reporta y guarda informacion de actividad del sistema. Los datos se almacenan en `/var/log/sysstat/` o `/var/log/sa/`.

```bash
# CPU
$ sar -u 2 5

# Memoria
$ sar -r 2 5

# Disco
$ sar -d 2 5

# Red
$ sar -n DEV 2 5

# Datos historicos del dia 15
$ sar -u -f /var/log/sysstat/sa15
```

El servicio `sadc` (system activity data collector) se ejecuta tipicamente via cron cada 10 minutos para recopilar datos historicos.

> **Para el examen:** `sar` es la unica herramienta que permite consultar datos historicos de rendimiento. Recuerda las opciones `-u` (CPU), `-r` (memoria), `-d` (disco), `-n DEV` (red) y `-f` (archivo de datos).

## Analisis de memoria

### /proc/meminfo

El archivo `/proc/meminfo` contiene informacion detallada sobre el uso de memoria del sistema.

```bash
$ cat /proc/meminfo
MemTotal:        8042596 kB
MemFree:         2515648 kB
MemAvailable:    4223616 kB
Buffers:          100800 kB
Cached:          2205440 kB
SwapCached:         1024 kB
SwapTotal:       4194304 kB
SwapFree:        4181760 kB
```

Conceptos clave:
- **MemTotal**: memoria RAM total del sistema
- **MemFree**: memoria no utilizada por nada
- **MemAvailable**: memoria disponible para nuevas aplicaciones (incluye cache recuperable)
- **Buffers**: cache de metadatos del sistema de archivos
- **Cached**: cache de paginas de datos de archivos

### Uso de swap

El swap es espacio en disco utilizado como extension de la RAM. Un uso excesivo de swap indica falta de memoria fisica.

```bash
# Ver uso de swap
$ free -h
              total    used    free    shared  buff/cache   available
Mem:          7.7Gi   3.1Gi   2.4Gi   256Mi   2.2Gi        4.0Gi
Swap:         4.0Gi    12Mi   4.0Gi

# Ver actividad de swap
$ vmstat 1
# Observar columnas si (swap in) y so (swap out)

# Ver particiones/archivos de swap
$ swapon --show
NAME      TYPE      SIZE   USED PRIO
/dev/sda2 partition   4G  12.3M   -2
```

> **Para el examen:** Si `si` y `so` en `vmstat` son consistentemente mayores que cero, el sistema esta haciendo swap activo y probablemente necesita mas RAM. `swpd` solo muestra cuanta swap esta en uso, pero no indica actividad.

## Monitorizacion de I/O de disco

### Identificacion de cuellos de botella de disco

Senales de un cuello de botella de I/O:
- Alto `%iowait` en `top`, `vmstat` o `sar`
- Alto `%util` en `iostat`
- Columna `b` (bloqueados) elevada en `vmstat`
- Tiempos de `await` elevados en `iostat`

```bash
# Monitorizar I/O por proceso
$ iotop -o
# Muestra solo procesos con I/O activo

# I/O de un proceso especifico
$ cat /proc/<PID>/io
```

## Monitorizacion de red

```bash
# Estadisticas de interfaces
$ sar -n DEV 1 5
# Muestra paquetes y bytes enviados/recibidos por interfaz

# Ancho de banda en tiempo real
$ iftop
# Muestra conexiones y consumo de ancho de banda

# Estadisticas de la interfaz
$ ip -s link show eth0
```

## Herramientas de monitorizacion continua

### collectd

`collectd` es un demonio que recopila metricas del sistema periodicamente y las almacena en archivos RRD (Round Robin Database) u otros backends. Es ligero y eficiente, ideal para sistemas de produccion.

- Arquitectura basada en plugins (CPU, memoria, disco, red, etc.)
- Configuracion en `/etc/collectd/collectd.conf` o `/etc/collectd.conf`
- Puede enviar datos a servidores remotos

### Nagios

Nagios es un sistema de monitorizacion de infraestructura que se centra en alertas y verificacion de estado de servicios.

- Monitoriza servicios de red (HTTP, SMTP, SSH, etc.)
- Monitoriza recursos del host (CPU, disco, memoria)
- Sistema de notificaciones (email, SMS, etc.)
- Interfaz web para visualizacion
- Arquitectura basada en plugins y checks

### MRTG (Multi Router Traffic Grapher)

MRTG genera graficos HTML de trafico de red usando SNMP.

- Crea graficos de trafico diario, semanal, mensual y anual
- Usa protocolo SNMP para obtener datos
- Genera paginas HTML estaticas con graficos PNG

### Cacti

Cacti es una solucion completa de graficos de red basada en RRDtool.

- Interfaz web completa
- Recopilacion via SNMP
- Templates para dispositivos comunes
- Graficos mas avanzados que MRTG
- Gestion de usuarios y permisos

> **Para el examen:** Debes conocer el proposito de cada herramienta. `collectd` recopila metricas, Nagios genera alertas, MRTG y Cacti generan graficos. No necesitas saber configurarlas en detalle, pero si entender su funcion.

## Identificacion de cuellos de botella

Resumen de como identificar el recurso limitante:

| Sintoma | Recurso | Herramientas |
|---------|---------|-------------|
| Load average alto, `us`+`sy` alto | CPU | top, vmstat, sar -u |
| Swap activo (si/so > 0) | Memoria | vmstat, free, sar -r |
| `%iowait` alto, `%util` alto | Disco | iostat, iotop, sar -d |
| Perdida de paquetes, alta latencia | Red | sar -n, iftop, ip -s |

## Archivos y directorios importantes

- `/proc/meminfo` - informacion de memoria
- `/proc/cpuinfo` - informacion de CPU
- `/proc/stat` - estadisticas del kernel
- `/proc/loadavg` - load average
- `/proc/<PID>/io` - estadisticas de I/O por proceso
- `/var/log/sysstat/` o `/var/log/sa/` - datos historicos de sar
- `/etc/collectd/collectd.conf` - configuracion de collectd
