---
title: "364.1 - Ejercicios: HA de Hardware y Recursos"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "364 - HA de Nodo Unico"
subtema: "364.1"
peso: 2
tags:
  - lpic-3
  - tema-364
  - ejercicios
  - watchdog
  - ups
  - ipmi
---

# 364.1 - Ejercicios: HA de Hardware y Recursos

### Pregunta 1
¿Que tipo de memoria puede detectar y corregir automaticamente errores de un solo bit?

a) DDR4
b) ECC
c) Registered
d) Buffered

<details><summary>Respuesta</summary>

**b) ECC**

La memoria ECC (Error-Correcting Code) detecta y corrige automaticamente errores de un bit, y detecta errores de dos bits. Es esencial en servidores para garantizar la integridad de los datos.
</details>

### Pregunta 2
¿Que dispositivo del sistema representa el watchdog timer en Linux?

a) `/dev/timer`
b) `/dev/watchdog`
c) `/dev/wdt`
d) `/proc/watchdog`

<details><summary>Respuesta</summary>

**b) `/dev/watchdog`**

El watchdog timer se accede a traves de `/dev/watchdog`. Las aplicaciones deben escribir periodicamente en este dispositivo para mantener el sistema vivo. Si dejan de escribir, el watchdog reinicia el sistema.
</details>

### Pregunta 3
¿Que modulo del kernel proporciona un watchdog por software?

a) `iTCO_wdt`
b) `hpwdt`
c) `softdog`
d) `ipmi_watchdog`

<details><summary>Respuesta</summary>

**c) `softdog`**

`softdog` es el modulo de watchdog por software del kernel Linux. No requiere hardware especifico, a diferencia de `iTCO_wdt` (Intel), `hpwdt` (HP) o `ipmi_watchdog` (IPMI).
</details>

### Pregunta 4
¿En que archivo de NUT se define el modo de operacion (standalone, netserver, netclient)?

a) `/etc/nut/ups.conf`
b) `/etc/nut/nut.conf`
c) `/etc/nut/upsmon.conf`
d) `/etc/nut/upsd.conf`

<details><summary>Respuesta</summary>

**b) `/etc/nut/nut.conf`**

El archivo `/etc/nut/nut.conf` define el modo de operacion con la directiva `MODE=`. Los valores posibles son: `standalone`, `netserver`, `netclient` y `none`.
</details>

### Pregunta 5
¿Que modo de NUT permite compartir la informacion del UPS con otros servidores por red?

a) `standalone`
b) `netserver`
c) `netclient`
d) `shared`

<details><summary>Respuesta</summary>

**b) `netserver`**

El modo `netserver` configura NUT para que el UPS conectado localmente sea accesible por otros servidores (clientes) a traves de la red. Los clientes usan el modo `netclient`.
</details>

### Pregunta 6
¿Que comando de ipmitool reinicia un servidor remoto?

a) `ipmitool -I lanplus -H IP -U user -P pass power restart`
b) `ipmitool -I lanplus -H IP -U user -P pass power cycle`
c) `ipmitool -I lanplus -H IP -U user -P pass reboot`
d) `ipmitool -I lanplus -H IP -U user -P pass chassis restart`

<details><summary>Respuesta</summary>

**b) `ipmitool -I lanplus -H IP -U user -P pass power cycle`**

`power cycle` apaga y enciende el servidor remotamente via IPMI. Las opciones de `ipmitool power` son: `status`, `on`, `off`, `cycle` y `reset`.
</details>

### Pregunta 7
¿En que archivo de NUT se configuran el driver y puerto del UPS?

a) `/etc/nut/nut.conf`
b) `/etc/nut/ups.conf`
c) `/etc/nut/upsd.conf`
d) `/etc/nut/upsmon.conf`

<details><summary>Respuesta</summary>

**b) `/etc/nut/ups.conf`**

El archivo `/etc/nut/ups.conf` define cada UPS con su nombre, driver (ej: `usbhid-ups`), puerto y descripcion.
</details>

### Pregunta 8
¿Que comando muestra los sensores de hardware (temperatura, voltaje, ventiladores) via IPMI?

a) `ipmitool mc info`
b) `ipmitool sel list`
c) `ipmitool sensor list`
d) `ipmitool lan print`

<details><summary>Respuesta</summary>

**c) `ipmitool sensor list`**

`ipmitool sensor list` muestra todos los sensores del servidor incluyendo temperatura, voltaje, velocidad de ventiladores y su estado. `sdr list` muestra informacion similar desde el Sensor Data Repository.
</details>

### Pregunta 9
¿Que parametro de systemd configura el watchdog del sistema?

a) `WatchdogSec=`
b) `RuntimeWatchdogSec=`
c) `SystemWatchdog=`
d) `WatchdogTimeout=`

<details><summary>Respuesta</summary>

**b) `RuntimeWatchdogSec=`**

`RuntimeWatchdogSec=` en `/etc/systemd/system.conf` configura el timeout del watchdog de systemd. Si systemd no responde dentro de este tiempo, el watchdog reinicia el sistema.
</details>

### Pregunta 10
¿Que funcion tiene el BMC (Baseboard Management Controller) en un servidor?

a) Gestionar la BIOS/UEFI
b) Permitir gestion remota del hardware independiente del SO
c) Controlar la velocidad del procesador
d) Gestionar la memoria cache

<details><summary>Respuesta</summary>

**b) Permitir gestion remota del hardware independiente del SO**

El BMC es un controlador independiente que permite gestionar el servidor remotamente (encender, apagar, consola, sensores) incluso cuando el sistema operativo no esta funcionando o el servidor esta apagado.
</details>
