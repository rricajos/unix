---
title: "200.1 - Uso de recursos"
tags: [lpic-2, examen-201, tema-200, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "200"
subtema: "200.1"
---

# 200.1 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

Un servidor Linux muestra un load average de 4.50, 3.20, 1.10. El sistema tiene 2 nucleos de CPU. ¿Que indica esta situacion?

a) El sistema esta infrautilizado ya que el load average es bajo
b) El sistema tiene una carga moderada y estable
c) La carga del sistema esta aumentando y actualmente supera la capacidad de las CPUs
d) La carga del sistema esta disminuyendo y se esta estabilizando

<details>
<summary>Respuesta</summary>

**c) La carga del sistema esta aumentando y actualmente supera la capacidad de las CPUs**

El load average se lee de izquierda a derecha: 1 min, 5 min, 15 min. Los valores van de 1.10 (hace 15 min) a 4.50 (ultimo minuto), lo que muestra una tendencia ascendente. Con 2 nucleos, un load de 4.50 significa que hay mas del doble de procesos que CPUs disponibles, indicando sobrecarga creciente.
</details>

---

### Pregunta 2

En la salida de `vmstat`, ¿que columnas debes observar para detectar un cuello de botella de I/O en disco?

a) `r` y `us`
b) `si` y `so`
c) `b` y `wa`
d) `swpd` y `free`

<details>
<summary>Respuesta</summary>

**c) `b` y `wa`**

La columna `b` muestra procesos bloqueados esperando I/O y `wa` muestra el porcentaje de CPU en espera de operaciones de I/O. Valores altos en ambas columnas indican un cuello de botella de disco. `si`/`so` estan relacionados con swap, `r`/`us` con CPU, y `swpd`/`free` con memoria.
</details>

---

### Pregunta 3

¿Que comando de `sar` muestra los datos historicos de uso de CPU del dia 22 del mes actual?

a) `sar -u -d 22`
b) `sar -u -f /var/log/sysstat/sa22`
c) `sar --cpu --date 22`
d) `sar -u --history /var/log/sa/22`

<details>
<summary>Respuesta</summary>

**b) `sar -u -f /var/log/sysstat/sa22`**

La opcion `-u` indica estadisticas de CPU y `-f` especifica el archivo de datos historicos. Los archivos de datos de sar se almacenan en `/var/log/sysstat/` (Debian/Ubuntu) o `/var/log/sa/` con nombres como `sa22` donde el numero corresponde al dia del mes.
</details>

---

### Pregunta 4

Un administrador ejecuta `iostat -x` y observa que el dispositivo `/dev/sda` tiene `%util` al 98% y `await` de 245ms. ¿Que conclusion es correcta?

a) El disco esta practicamente inactivo
b) El disco esta saturado y las solicitudes experimentan alta latencia
c) El disco tiene mucho espacio libre disponible
d) El disco esta funcionando de forma optima

<details>
<summary>Respuesta</summary>

**b) El disco esta saturado y las solicitudes experimentan alta latencia**

Un `%util` cercano a 100% indica que el disco esta ocupado casi todo el tiempo. Un `await` de 245ms es extremadamente alto (valores normales estan por debajo de 10-20ms para discos convencionales). La combinacion de ambos valores confirma que el disco es un cuello de botella severo.
</details>

---

### Pregunta 5

¿Cual es la diferencia principal entre `MemFree` y `MemAvailable` en `/proc/meminfo`?

a) No hay diferencia, son sinonimos
b) `MemFree` incluye la cache y `MemAvailable` no
c) `MemAvailable` estima la memoria disponible para nuevas aplicaciones incluyendo cache recuperable, mientras que `MemFree` solo muestra memoria completamente sin uso
d) `MemAvailable` solo cuenta la memoria fisica y `MemFree` incluye el swap

<details>
<summary>Respuesta</summary>

**c) `MemAvailable` estima la memoria disponible para nuevas aplicaciones incluyendo cache recuperable, mientras que `MemFree` solo muestra memoria completamente sin uso**

`MemFree` es la memoria que no esta siendo utilizada para nada. `MemAvailable` es una estimacion mas practica que incluye memoria que puede ser recuperada rapidamente (como buffers y cache de paginas), proporcionando una vision mas realista de la memoria disponible para aplicaciones.
</details>

---

### Pregunta 6

¿Que herramienta de monitorizacion se especializa en generar alertas cuando un servicio o recurso del sistema supera un umbral definido?

a) collectd
b) MRTG
c) Cacti
d) Nagios

<details>
<summary>Respuesta</summary>

**d) Nagios**

Nagios es un sistema de monitorizacion centrado en la verificacion de estado y generacion de alertas. Monitoriza servicios de red y recursos del host, y envia notificaciones (email, SMS, etc.) cuando se superan umbrales. `collectd` recopila metricas, y MRTG/Cacti se centran en generar graficos.
</details>

---

### Pregunta 7

En la salida de `vmstat`, las columnas `si` y `so` muestran valores de 1200 y 3500 respectivamente de forma continua. ¿Que indica esto?

a) El sistema tiene un uso intensivo de disco convencional
b) El sistema esta realizando swap activo, lo que indica falta de memoria RAM
c) La red esta saturada con trafico entrante y saliente
d) El sistema tiene un alto uso de CPU

<details>
<summary>Respuesta</summary>

**b) El sistema esta realizando swap activo, lo que indica falta de memoria RAM**

`si` (swap in) y `so` (swap out) muestran la cantidad de datos en KB/s que se leen desde y se escriben hacia el espacio de swap. Valores altos y continuos indican que el sistema no tiene suficiente memoria RAM y esta moviendo datos constantemente entre RAM y disco (thrashing), lo que degrada severamente el rendimiento.
</details>

---

### Pregunta 8

¿Que comando muestra las estadisticas de I/O de un proceso especifico con PID 1234?

a) `iostat -p 1234`
b) `iotop -p 1234`
c) `cat /proc/1234/io`
d) Ambas b) y c) son correctas

<details>
<summary>Respuesta</summary>

**d) Ambas b) y c) son correctas**

`iotop -p 1234` muestra la actividad de I/O en tiempo real del proceso 1234 en una interfaz interactiva. `cat /proc/1234/io` muestra las estadisticas acumuladas de I/O de ese proceso desde su inicio. Ambos metodos son validos para obtener informacion de I/O a nivel de proceso, pero ofrecen perspectivas diferentes.
</details>

---

### Pregunta 9

¿Que protocolo utilizan MRTG y Cacti para recopilar datos de dispositivos de red?

a) SSH
b) HTTP
c) SNMP
d) Syslog

<details>
<summary>Respuesta</summary>

**c) SNMP**

MRTG (Multi Router Traffic Grapher) y Cacti utilizan el protocolo SNMP (Simple Network Management Protocol) para consultar contadores de trafico y otras metricas en dispositivos de red como routers, switches y servidores. SNMP permite acceder a los datos a traves de OIDs (Object Identifiers) definidos en MIBs.
</details>

---

### Pregunta 10

Un administrador necesita identificar que proceso esta consumiendo mas ancho de banda de disco en un servidor de produccion. ¿Que herramienta es la mas adecuada?

a) `vmstat`
b) `iotop`
c) `sar -d`
d) `iostat -x`

<details>
<summary>Respuesta</summary>

**b) `iotop`**

`iotop` es la unica herramienta de las opciones que muestra el uso de I/O de disco desglosado por proceso individual. `vmstat`, `sar -d` e `iostat -x` muestran estadisticas globales del sistema o por dispositivo, pero no identifican que proceso especifico esta generando la carga de I/O.
</details>
