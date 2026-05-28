---
title: "106.1 - Ejercicios: Instalar y configurar X11"
tags:
  - lpic-1
  - examen-102
  - tema-106
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "106"
subtema: "106.1"
---

# 106.1 - Ejercicios: Instalar y configurar X11

### Pregunta 1

En la arquitectura de X11, donde se ejecuta el servidor X y donde se ejecutan los clientes X?

a) El servidor X se ejecuta en la maquina remota y los clientes en la maquina local
b) El servidor X se ejecuta en la maquina local (donde esta la pantalla) y los clientes son las aplicaciones graficas
c) El servidor y los clientes siempre se ejecutan en la misma maquina
d) El servidor X es el kernel de Linux y los clientes son los drivers graficos

<details><summary>Respuesta</summary>

**b) El servidor X se ejecuta en la maquina local (donde esta la pantalla) y los clientes son las aplicaciones graficas**

En X11, la terminologia es contraintuitiva: el **servidor X** se ejecuta en la maquina donde estan la pantalla, el teclado y el raton, gestionando el hardware grafico. Los **clientes X** son las aplicaciones graficas (firefox, xterm, gimp, etc.) que pueden ejecutarse en la misma maquina o en una remota. La comunicacion se realiza mediante el protocolo X11, que puede funcionar a traves de la red, permitiendo ejecutar una aplicacion en un servidor remoto y ver su ventana en la pantalla local.

</details>

---

### Pregunta 2

Que significa el valor `DISPLAY=localhost:10.0` en una sesion SSH?

a) El display local numero 10 de la maquina localhost, pantalla 0 (tipico de SSH X forwarding)
b) El display principal del sistema, pantalla 10
c) Una conexion directa al display 10 del servidor remoto
d) Un display virtual sin conexion a hardware real

<details><summary>Respuesta</summary>

**a) El display local numero 10 de la maquina localhost, pantalla 0 (tipico de SSH X forwarding)**

El formato de DISPLAY es `[host]:display[.screen]`. En `localhost:10.0`, `localhost` es el host, `10` es el numero de display y `0` es la pantalla. El offset 10 viene de la directiva `X11DisplayOffset 10` en la configuracion de SSH. Cuando se usa SSH X forwarding (`ssh -X`), SSH configura automaticamente esta variable y tuneliza la conexion X11 a traves del canal seguro SSH, gestionando las cookies de `xauth` automaticamente.

</details>

---

### Pregunta 3

Cual de los siguientes metodos de control de acceso al servidor X es mas seguro y por que?

a) `xhost +` porque permite el acceso desde cualquier host
b) `xhost` porque controla el acceso basandose en la direccion IP del host
c) `xauth` porque usa cookies MIT-MAGIC-COOKIE almacenadas en `~/.Xauthority` para autenticar por sesion
d) XDMCP porque cifra toda la comunicacion entre cliente y servidor

<details><summary>Respuesta</summary>

**c) `xauth` porque usa cookies MIT-MAGIC-COOKIE almacenadas en `~/.Xauthority` para autenticar por sesion**

`xauth` es mas seguro porque requiere que el cliente presente un token secreto (cookie) para conectarse al servidor X. Cada sesion genera una cookie unica almacenada en `~/.Xauthority`. `xhost` es inseguro porque controla el acceso basandose unicamente en el host: si se permite un host, CUALQUIER usuario de ese host puede acceder. `xhost +` desactiva toda verificacion, siendo extremadamente inseguro. XDMCP no cifra el trafico y esta practicamente en desuso.

</details>

---

### Pregunta 4

Que seccion del archivo `xorg.conf` vincula un monitor con una tarjeta grafica?

a) `ServerLayout`
b) `Device`
c) `Screen`
d) `Monitor`

<details><summary>Respuesta</summary>

**c) `Screen`**

La seccion **Screen** es la que vincula un monitor con una tarjeta grafica (Device), referenciando ambos por su `Identifier`. Tambien define la profundidad de color y las resoluciones disponibles. La seccion **Device** configura la tarjeta grafica (driver, BusID). La seccion **Monitor** define las caracteristicas del monitor (frecuencias). La seccion **ServerLayout** es la configuracion global que vincula las pantallas (Screen) con los dispositivos de entrada (InputDevice).

</details>

---

### Pregunta 5

Que comando se utiliza para generar un archivo `xorg.conf` basado en el hardware detectado automaticamente?

a) `xorg --generate`
b) `X -configure` (o `Xorg -configure`)
c) `xdpyinfo --config`
d) `dpkg-reconfigure xorg`

<details><summary>Respuesta</summary>

**b) `X -configure` (o `Xorg -configure`)**

El comando `Xorg -configure` (o `X -configure`) genera un archivo `xorg.conf` basado en el hardware detectado. El archivo generado se guarda como `/root/xorg.conf.new` y se puede copiar a `/etc/X11/xorg.conf`. Es importante que el servidor X NO este en ejecucion al ejecutar este comando. En sistemas modernos, Xorg suele funcionar sin `xorg.conf` gracias a la autodeteccion, y se prefieren archivos parciales en `/etc/X11/xorg.conf.d/`.

</details>

---

### Pregunta 6

Cual es la diferencia entre `ssh -X` y `ssh -Y` para X forwarding?

a) `-X` habilita X forwarding confiable y `-Y` lo habilita con restricciones
b) `-X` habilita X forwarding con restricciones de seguridad (untrusted) y `-Y` lo habilita sin restricciones (trusted)
c) `-X` solo funciona con Wayland y `-Y` solo funciona con X11
d) `-X` requiere configuracion en el cliente y `-Y` requiere configuracion en el servidor

<details><summary>Respuesta</summary>

**b) `-X` habilita X forwarding con restricciones de seguridad (untrusted) y `-Y` lo habilita sin restricciones (trusted)**

`ssh -X` habilita X forwarding con la extension X11 SECURITY, que restringe lo que la aplicacion remota puede hacer (por ejemplo, no puede capturar el teclado de otras ventanas). Es mas seguro pero algunas aplicaciones complejas pueden no funcionar. `ssh -Y` habilita X forwarding confiable (trusted), sin restricciones de seguridad, dando a la aplicacion remota acceso completo al servidor X local. Ambos requieren `X11Forwarding yes` en `/etc/ssh/sshd_config` del servidor.

</details>

---

### Pregunta 7

En el log de Xorg (`/var/log/Xorg.0.log`), que significan los marcadores `(EE)` y `(WW)`?

a) `(EE)` indica entradas informativas y `(WW)` indica valores por defecto
b) `(EE)` indica errores y `(WW)` indica advertencias
c) `(EE)` indica valores de entorno y `(WW)` indica configuraciones de ventanas
d) `(EE)` indica extensiones habilitadas y `(WW)` indica extensiones deshabilitadas

<details><summary>Respuesta</summary>

**b) `(EE)` indica errores y `(WW)` indica advertencias**

En el log de Xorg, los marcadores tienen estos significados: `(EE)` = Error, `(WW)` = Warning (advertencia), `(II)` = Information (informativo), `(**)` = valor de configuracion encontrado, y `(==)` = valor por defecto usado. Cuando X11 no arranca o presenta problemas, `/var/log/Xorg.0.log` es el primer lugar donde buscar informacion de diagnostico, filtrando con `grep "(EE)" /var/log/Xorg.0.log` para encontrar errores.

</details>

---

### Pregunta 8

Que Display Manager esta asociado por defecto con KDE Plasma?

a) GDM
b) LightDM
c) SDDM
d) XDM

<details><summary>Respuesta</summary>

**c) SDDM**

**SDDM** (Simple Desktop Display Manager) es el Display Manager por defecto de KDE Plasma. Es moderno y esta basado en QML. **GDM** (GNOME Display Manager) es el DM por defecto de GNOME. **LightDM** es un DM independiente y ligero, muy usado en Xfce y MATE. **XDM** (X Display Manager) es el original de X11, muy basico y sin dependencias de escritorio. Para cambiar el DM en sistemas systemd se usa `systemctl enable --now nombre_dm`.

</details>

---

### Pregunta 9

Cual de los siguientes directorios contiene archivos de configuracion de Xorg proporcionados por la distribucion que NO deben editarse directamente?

a) `/etc/X11/xorg.conf.d/`
b) `/usr/share/X11/xorg.conf.d/`
c) `/etc/X11/`
d) `/var/log/`

<details><summary>Respuesta</summary>

**b) `/usr/share/X11/xorg.conf.d/`**

`/usr/share/X11/xorg.conf.d/` contiene archivos de configuracion proporcionados por la distribucion y los paquetes del sistema. No deben editarse directamente porque se sobrescriben en actualizaciones. La jerarquia de prioridad es: `/etc/X11/xorg.conf` (maxima prioridad, configuracion manual del administrador), `/etc/X11/xorg.conf.d/*.conf` (configuraciones parciales del administrador), y `/usr/share/X11/xorg.conf.d/*.conf` (configuraciones de la distribucion, menor prioridad).

</details>

---

### Pregunta 10

Como se puede verificar si la sesion actual usa Wayland o X11?

a) Ejecutando `xdpyinfo | grep wayland`
b) Verificando el valor de `$XDG_SESSION_TYPE` que muestra `wayland` o `x11`
c) Comprobando si existe el archivo `/etc/wayland.conf`
d) Ejecutando `systemctl status wayland`

<details><summary>Respuesta</summary>

**b) Verificando el valor de `$XDG_SESSION_TYPE` que muestra `wayland` o `x11`**

La forma mas directa de verificar el tipo de sesion es con `echo $XDG_SESSION_TYPE`, que devuelve `wayland` o `x11`. Otra forma es comprobar si la variable `$WAYLAND_DISPLAY` tiene valor (por ejemplo, `wayland-0`), lo que indica que se usa Wayland. Wayland es un protocolo de display moderno que busca reemplazar a X11, con un compositor integrado y mayor seguridad (aislamiento entre clientes). XWayland permite ejecutar aplicaciones X11 antiguas dentro de sesiones Wayland.

</details>
