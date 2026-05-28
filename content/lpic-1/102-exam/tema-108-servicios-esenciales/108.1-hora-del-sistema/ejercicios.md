---
title: "108.1 Mantener la hora del sistema - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.1"
---

# 108.1 Mantener la hora del sistema - Ejercicios

### Pregunta 1

Un administrador necesita copiar la hora actual del sistema operativo al reloj hardware (RTC). Cual de los siguientes comandos es el correcto?

a) `hwclock --hctosys`
b) `hwclock --systohc`
c) `timedatectl set-rtc`
d) `date --set-hwclock`

<details><summary>Respuesta</summary>

**b) `hwclock --systohc`**

`hwclock --systohc` significa "System TO Hardware Clock", es decir, copia la hora del reloj del sistema al reloj hardware (RTC). La opcion `--hctosys` hace lo contrario: copia la hora del hardware al sistema. `timedatectl set-rtc` y `date --set-hwclock` no son comandos validos.

</details>

---

### Pregunta 2

Que archivo contiene la informacion sobre si el reloj hardware (RTC) esta configurado en UTC o en hora local?

a) `/etc/localtime`
b) `/etc/timezone`
c) `/etc/adjtime`
d) `/etc/ntp.conf`

<details><summary>Respuesta</summary>

**c) `/etc/adjtime`**

El archivo `/etc/adjtime` contiene tres lineas: informacion de deriva (drift), la fecha del ultimo ajuste y en la tercera linea indica `UTC` o `LOCAL` segun la configuracion del reloj hardware. `/etc/localtime` es un enlace simbolico a la zona horaria del sistema. `/etc/timezone` contiene el nombre de la zona horaria en Debian/Ubuntu. `/etc/ntp.conf` es la configuracion del demonio NTP.

</details>

---

### Pregunta 3

Cual es el puerto y protocolo de transporte que utiliza NTP?

a) TCP 123
b) UDP 123
c) TCP 514
d) UDP 514

<details><summary>Respuesta</summary>

**b) UDP 123**

NTP (Network Time Protocol) utiliza el puerto 123 con el protocolo de transporte UDP. El puerto 514 con UDP corresponde a syslog. NTP usa UDP porque la sincronizacion de tiempo requiere baja latencia y el overhead de una conexion TCP seria contraproducente.

</details>

---

### Pregunta 4

En la salida de `ntpq -p`, que indica el simbolo `*` junto al nombre de un servidor?

a) El servidor esta descartado por el algoritmo de seleccion
b) El servidor es un candidato aceptable que podria ser seleccionado
c) El servidor esta seleccionado actualmente como fuente de sincronizacion
d) El servidor ha sido designado como falseticker

<details><summary>Respuesta</summary>

**c) El servidor esta seleccionado actualmente como fuente de sincronizacion**

En la salida de `ntpq -p`, el simbolo `*` indica que ese servidor es la fuente de sincronizacion actualmente seleccionada. El simbolo `+` indica un candidato aceptable, `-` indica un servidor descartado por el algoritmo, y `x` indica un falseticker. Estos simbolos son importantes para diagnosticar el estado de la sincronizacion NTP.

</details>

---

### Pregunta 5

Cual de las siguientes afirmaciones sobre `systemd-timesyncd` es correcta?

a) Puede actuar como servidor y cliente NTP
b) Implementa el protocolo NTP completo con calculo de drift
c) Es un cliente SNTP ligero que solo puede actuar como cliente
d) Su archivo de configuracion es `/etc/ntp.conf`

<details><summary>Respuesta</summary>

**c) Es un cliente SNTP ligero que solo puede actuar como cliente**

`systemd-timesyncd` es un cliente SNTP (Simple NTP) ligero integrado en systemd. Solo puede actuar como cliente, no como servidor NTP. Utiliza SNTP en lugar del protocolo NTP completo, por lo que no calcula drift ni mantiene un driftfile. Su archivo de configuracion es `/etc/systemd/timesyncd.conf`. Para actuar como servidor NTP se necesita ntpd o chrony.

</details>

---

### Pregunta 6

Un administrador ejecuta `timedatectl set-ntp true`. Que servicio se activa con este comando?

a) ntpd
b) chronyd
c) systemd-timesyncd
d) ntpdate

<details><summary>Respuesta</summary>

**c) systemd-timesyncd**

El comando `timedatectl set-ntp true` activa el servicio `systemd-timesyncd`, no ntpd ni chronyd. Este es un punto importante para el examen LPIC-1. Si se necesita ntpd o chrony, deben instalarse y configurarse por separado. `ntpdate` es una herramienta deprecada de sincronizacion puntual, no un servicio permanente.

</details>

---

### Pregunta 7

Cual es el estrato maximo valido en el sistema de estratos de NTP?

a) 10
b) 15
c) 16
d) 255

<details><summary>Respuesta</summary>

**b) 15**

En el sistema de estratos de NTP, el estrato maximo valido es 15. El estrato 0 corresponde a dispositivos de referencia (relojes atomicos, GPS) que no son accesibles directamente por red. El estrato 1 son servidores conectados directamente a dispositivos de estrato 0. Cada nivel sucesivo se sincroniza con el anterior. El estrato 16 indica "no sincronizado" y se considera invalido.

</details>

---

### Pregunta 8

Cual de los siguientes comandos muestra las fuentes de tiempo en chrony, de forma equivalente a `ntpq -p` en ntpd?

a) `chronyc tracking`
b) `chronyc sources`
c) `chronyc activity`
d) `chronyc serverstats`

<details><summary>Respuesta</summary>

**b) `chronyc sources`**

`chronyc sources` muestra las fuentes NTP configuradas y su estado, de forma equivalente a `ntpq -p` en ntpd. `chronyc tracking` muestra informacion detallada de sincronizacion del sistema. `chronyc activity` muestra el numero de fuentes online/offline. `chronyc serverstats` no es un subcomando valido de chronyc. Se puede usar `chronyc sources -v` para obtener una explicacion detallada de las columnas.

</details>

---

### Pregunta 9

Que comando se utiliza para mostrar la fecha actual del sistema en formato `AAAA-MM-DD HH:MM:SS`?

a) `date +%d-%m-%Y %H:%M:%S`
b) `date "+%Y-%m-%d %H:%M:%S"`
c) `date --format=iso`
d) `timedatectl show --format`

<details><summary>Respuesta</summary>

**b) `date "+%Y-%m-%d %H:%M:%S"`**

El comando `date` con la cadena de formato `"+%Y-%m-%d %H:%M:%S"` produce una salida como `2024-01-15 14:30:45`. Los codigos de formato son: `%Y` (anio 4 digitos), `%m` (mes 01-12), `%d` (dia 01-31), `%H` (hora 00-23), `%M` (minutos 00-59), `%S` (segundos 00-59). Las comillas son necesarias porque el formato contiene espacios. La opcion A tiene el orden de fecha incorrecto (dia-mes-anio en lugar de anio-mes-dia).

</details>

---

### Pregunta 10

En la terminologia NTP, cual es la diferencia entre un ajuste "step" y un ajuste "slew"?

a) Step es un ajuste gradual y slew es un salto abrupto
b) Step es un salto abrupto del reloj y slew es un ajuste gradual acelerando o frenando el reloj
c) Step se usa para diferencias menores a 1 segundo y slew para diferencias mayores
d) No hay diferencia, son sinonimos del mismo tipo de ajuste

<details><summary>Respuesta</summary>

**b) Step es un salto abrupto del reloj y slew es un ajuste gradual acelerando o frenando el reloj**

Un ajuste "step" cambia el reloj de golpe, lo cual es rapido pero puede causar problemas en aplicaciones sensibles al tiempo (logs desordenados, transacciones duplicadas). Un ajuste "slew" modifica el reloj gradualmente acelerandolo o frenandolo ligeramente, lo cual es mas seguro para aplicaciones en produccion pero tarda mas en sincronizar. NTP usa slew para diferencias pequenas y step para diferencias grandes.

</details>
