---
title: "200.2 - Prediccion de necesidades"
tags: [lpic-2, examen-201, tema-200, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "200"
subtema: "200.2"
---

# 200.2 - Comandos clave: Prediccion de necesidades

## Comandos para recopilacion de datos historicos

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `sar` | Consultar datos historicos de rendimiento | `sar -u -f /var/log/sysstat/sa20` |
| `sadf` | Exportar datos de sar a otros formatos | `sadf -d /var/log/sysstat/sa20 -- -u > cpu.csv` |
| `df` | Uso actual de sistemas de archivos | `df -h` |
| `du` | Uso de disco por directorio | `du -sh /var/log/*` |
| `rrdtool` | Crear graficos desde bases de datos RRD | `rrdtool graph salida.png --start -30d` |
| `free` | Instantanea del uso de memoria | `free -h` |
| `uptime` | Load average como indicador instantaneo | `uptime` |

## Opciones de sadf para exportacion

| Opcion | Formato de salida | Ejemplo |
|--------|-------------------|---------|
| `sadf -d` | CSV separado por punto y coma | `sadf -d sa20 -- -u` |
| `sadf -j` | JSON | `sadf -j sa20 -- -r` |
| `sadf -x` | XML | `sadf -x sa20 -- -d` |
| `sadf -g` | SVG (grafico) | `sadf -g sa20 -- -u > cpu.svg` |
| `sadf -H` | Incluir cabeceras | `sadf -dH sa20 -- -u` |

## Archivos importantes para prediccion

| Archivo/Directorio | Funcion |
|--------------------|---------|
| `/var/log/sysstat/saDD` | Datos de sar del dia DD (Debian/Ubuntu) |
| `/var/log/sa/saDD` | Datos de sar del dia DD (Red Hat/CentOS) |
| `/var/lib/collectd/rrd/` | Bases de datos RRD de collectd |
| `/etc/sysstat/sysstat` | Configuracion de recopilacion de sysstat |
| `/etc/cron.d/sysstat` | Cron para la recopilacion automatica de datos |

## Calculo rapido de tendencias de disco

| Paso | Comando/Accion | Detalle |
|------|---------------|---------|
| 1. Recopilar uso actual | `df -h /particion` | Anotar uso y total |
| 2. Comparar con historico | Revisar registros anteriores | Calcular delta mensual |
| 3. Calcular crecimiento | `(uso_actual - uso_anterior) / meses` | Crecimiento mensual |
| 4. Estimar agotamiento | `espacio_libre / crecimiento_mensual` | Meses restantes |
| 5. Aplicar margen | Actuar al 80% de uso | Factor de seguridad |

## Comparativa de estrategias de escalado

| Aspecto | Escalado vertical | Escalado horizontal |
|---------|-------------------|---------------------|
| Definicion | Mas recursos a la misma maquina | Agregar mas maquinas |
| CPU | Mas nucleos/mayor frecuencia | Distribuir procesos |
| RAM | Agregar modulos de memoria | Repartir servicios |
| Disco | Discos mas grandes o SSD | SAN, NAS, almacenamiento distribuido |
| Complejidad | Baja (mismo sistema) | Alta (balanceo, sincronizacion) |
| Limite | Tope fisico del hardware | Teoricamente ilimitado |
| Coste | Puede ser alto por unidad | Puede usar hardware commodity |

## Umbrales tipicos de actuacion

| Recurso | Umbral de alerta | Umbral critico | Accion |
|---------|------------------|----------------|--------|
| CPU | > 70% sostenido | > 90% sostenido | Optimizar o escalar |
| Memoria | > 80% de RAM | Swap activo constante | Ampliar RAM |
| Disco | > 80% ocupado | > 90% ocupado | Ampliar o limpiar |
| Red | > 70% del ancho de banda | Perdida de paquetes | Ampliar enlace |
