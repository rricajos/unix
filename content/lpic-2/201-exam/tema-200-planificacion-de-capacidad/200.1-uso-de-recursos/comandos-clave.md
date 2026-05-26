---
title: "200.1 - Uso de recursos"
tags: [lpic-2, examen-201, tema-200, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "200"
subtema: "200.1"
---

# 200.1 - Comandos clave: Uso de recursos

## Comandos principales

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `vmstat` | Estadisticas de memoria virtual, CPU, I/O | `vmstat 5 3` (cada 5s, 3 veces) |
| `iostat` | Estadisticas de CPU y dispositivos de I/O | `iostat -x 2` (extendido cada 2s) |
| `sar` | Reportes historicos de actividad del sistema | `sar -u 1 10` (CPU cada 1s, 10 veces) |
| `top` | Monitor interactivo de procesos en tiempo real | `top -d 2` (actualizar cada 2s) |
| `htop` | Version mejorada de top con interfaz visual | `htop -u usuario` (filtrar por usuario) |
| `uptime` | Tiempo de actividad y load average | `uptime` |
| `free` | Uso de memoria y swap | `free -h` (formato legible) |
| `iotop` | Monitor de I/O por proceso | `iotop -o` (solo procesos con I/O) |
| `iftop` | Monitor de ancho de banda de red | `iftop -i eth0` |
| `swapon` | Mostrar/activar dispositivos de swap | `swapon --show` |
| `w` | Usuarios conectados y load average | `w` |

## Opciones importantes de sar

| Opcion | Funcion | Ejemplo |
|--------|---------|---------|
| `sar -u` | Uso de CPU | `sar -u 2 5` |
| `sar -r` | Uso de memoria | `sar -r 2 5` |
| `sar -d` | Actividad de disco | `sar -d 2 5` |
| `sar -n DEV` | Estadisticas de red | `sar -n DEV 2 5` |
| `sar -b` | Actividad de I/O global | `sar -b 2 5` |
| `sar -q` | Cola de ejecucion y load average | `sar -q 2 5` |
| `sar -S` | Uso de swap | `sar -S 2 5` |
| `sar -f` | Leer datos historicos | `sar -u -f /var/log/sysstat/sa15` |

## Columnas clave de vmstat

| Columna | Seccion | Significado |
|---------|---------|-------------|
| `r` | procs | Procesos en cola de ejecucion |
| `b` | procs | Procesos bloqueados (I/O wait) |
| `swpd` | memory | Swap usada (KB) |
| `free` | memory | Memoria libre (KB) |
| `si` | swap | Datos leidos desde swap (KB/s) |
| `so` | swap | Datos escritos a swap (KB/s) |
| `bi` | io | Bloques leidos de disco (bloques/s) |
| `bo` | io | Bloques escritos a disco (bloques/s) |
| `us` | cpu | % CPU usuario |
| `sy` | cpu | % CPU sistema |
| `id` | cpu | % CPU inactiva |
| `wa` | cpu | % CPU esperando I/O |

## Archivos importantes

| Archivo/Directorio | Funcion |
|--------------------|---------|
| `/proc/meminfo` | Informacion detallada de memoria |
| `/proc/cpuinfo` | Informacion de procesadores |
| `/proc/stat` | Estadisticas del kernel y CPU |
| `/proc/loadavg` | Load average y procesos activos |
| `/proc/<PID>/io` | Estadisticas de I/O de un proceso |
| `/var/log/sysstat/` | Datos historicos de sar (Debian/Ubuntu) |
| `/var/log/sa/` | Datos historicos de sar (Red Hat/CentOS) |
| `/etc/collectd/collectd.conf` | Configuracion de collectd |

## Comparativa de herramientas de monitorizacion

| Herramienta | Tipo | Funcion principal | Protocolo |
|-------------|------|-------------------|-----------|
| `collectd` | Demonio | Recopilacion de metricas | Plugins propios |
| `Nagios` | Plataforma | Alertas y verificacion de estado | Checks/Plugins |
| `MRTG` | Graficos | Graficos de trafico de red | SNMP |
| `Cacti` | Graficos | Graficos avanzados con RRDtool | SNMP |

## Diagnostico rapido de cuellos de botella

| Problema | Indicador | Comando |
|----------|-----------|---------|
| CPU saturada | `r` > num CPUs, `id` bajo | `vmstat 1`, `top` |
| Falta de memoria | `si`/`so` > 0 constantemente | `vmstat 1`, `free -h` |
| Disco saturado | `%util` ~ 100%, `wa` alto | `iostat -x 1`, `iotop` |
| Red saturada | Paquetes perdidos, alta latencia | `sar -n DEV 1`, `iftop` |
