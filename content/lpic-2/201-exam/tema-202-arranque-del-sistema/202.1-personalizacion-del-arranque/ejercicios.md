---
title: "202.1 - Personalizacion del arranque"
tags: [lpic-2, examen-201, tema-202, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.1"
---

# 202.1 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

Un administrador ha modificado el archivo `/etc/default/grub` para cambiar el tiempo de espera del menu. ¿Que comando debe ejecutar para que los cambios surtan efecto?

a) `grub-update`
b) `grub-mkconfig -o /boot/grub/grub.cfg`
c) `grub-install /dev/sda`
d) `systemctl restart grub`

<details>
<summary>Respuesta</summary>

**b) `grub-mkconfig -o /boot/grub/grub.cfg`**

Despues de modificar `/etc/default/grub`, es necesario regenerar el archivo `grub.cfg` ejecutando `grub-mkconfig` con la opcion `-o` para especificar el archivo de salida. El comando `grub-install` se usa para instalar los archivos de GRUB en el disco, no para actualizar la configuracion. No existe `grub-update` como comando estandar (en Debian existe `update-grub` como wrapper).
</details>

---

### Pregunta 2

¿Cual de los siguientes parametros del kernel permite arrancar directamente en una shell sin pasar por el proceso init?

a) `single`
b) `init=/bin/bash`
c) `systemd.unit=emergency.target`
d) `rescue`

<details>
<summary>Respuesta</summary>

**b) `init=/bin/bash`**

El parametro `init=/bin/bash` reemplaza completamente el proceso init por una shell bash, proporcionando acceso directo al sistema sin ningun servicio activo. `single` y `rescue` arrancan en modo usuario unico pero a traves del proceso init normal. `systemd.unit=emergency.target` tambien pasa por systemd.
</details>

---

### Pregunta 3

¿Que directorio contiene los scripts que generan las secciones del archivo `grub.cfg`?

a) `/boot/grub/`
b) `/etc/default/grub.d/`
c) `/etc/grub.d/`
d) `/usr/lib/grub/`

<details>
<summary>Respuesta</summary>

**c) `/etc/grub.d/`**

El directorio `/etc/grub.d/` contiene los scripts ejecutables (como `00_header`, `10_linux`, `30_os-prober`, `40_custom`) que son procesados por `grub-mkconfig` para generar el archivo `grub.cfg`. Cada script genera una seccion especifica de la configuracion final.
</details>

---

### Pregunta 4

Un administrador necesita ver los mensajes de error del arranque anterior del sistema. ¿Que comando es el mas adecuado?

a) `dmesg --level=err`
b) `journalctl -b -1 -p err`
c) `journalctl -b -p err`
d) `cat /var/log/boot.log`

<details>
<summary>Respuesta</summary>

**b) `journalctl -b -1 -p err`**

La opcion `-b -1` selecciona el arranque anterior (el actual seria `-b 0` o simplemente `-b`), y `-p err` filtra por prioridad de error. `dmesg` solo muestra los mensajes del kernel del arranque actual. `journalctl -b -p err` mostraria los errores del arranque actual, no del anterior.
</details>

---

### Pregunta 5

¿Cual es la diferencia principal entre `rescue.target` y `emergency.target` en systemd?

a) `rescue.target` no monta sistemas de archivos; `emergency.target` si
b) `rescue.target` monta sistemas de archivos y ejecuta servicios basicos; `emergency.target` solo monta raiz en solo lectura
c) Son identicos, solo cambia el nombre
d) `emergency.target` requiere contrasena de root; `rescue.target` no

<details>
<summary>Respuesta</summary>

**b) `rescue.target` monta sistemas de archivos y ejecuta servicios basicos; `emergency.target` solo monta raiz en solo lectura**

`rescue.target` (equivalente al runlevel 1) monta todos los sistemas de archivos de `/etc/fstab` e inicia algunos servicios basicos. `emergency.target` es mucho mas minimalista: solo monta el sistema de archivos raiz en modo solo lectura y no inicia practicamente ningun servicio, proporcionando el entorno minimo posible para reparaciones.
</details>

---

### Pregunta 6

¿Que variable en `/etc/default/grub` permite agregar parametros del kernel que se aplican a TODAS las entradas de menu, incluyendo las de recuperacion?

a) `GRUB_CMDLINE_LINUX_DEFAULT`
b) `GRUB_CMDLINE_LINUX`
c) `GRUB_CMDLINE`
d) `GRUB_KERNEL_PARAMS`

<details>
<summary>Respuesta</summary>

**b) `GRUB_CMDLINE_LINUX`**

`GRUB_CMDLINE_LINUX` agrega parametros a todas las entradas de Linux, incluyendo las de recuperacion. `GRUB_CMDLINE_LINUX_DEFAULT` solo agrega parametros a la entrada por defecto (no a las de recuperacion). Las opciones `GRUB_CMDLINE` y `GRUB_KERNEL_PARAMS` no existen como variables estandar de GRUB 2.
</details>

---

### Pregunta 7

En un sistema con SysV init, ¿que archivo determina el nivel de ejecucion por defecto?

a) `/etc/rc.local`
b) `/etc/default/runlevel`
c) `/etc/inittab`
d) `/etc/sysconfig/init`

<details>
<summary>Respuesta</summary>

**c) `/etc/inittab`**

El archivo `/etc/inittab` contiene la linea `id:N:initdefault:` donde N es el numero del runlevel por defecto. Este archivo es el punto central de configuracion del sistema SysV init. En sistemas con systemd, este archivo ya no se utiliza y se reemplaza por el concepto de default target.
</details>

---

### Pregunta 8

Un administrador quiere que GRUB recuerde la ultima entrada seleccionada y la use como defecto en el siguiente arranque. ¿Que configuracion debe establecer en `/etc/default/grub`?

a) `GRUB_DEFAULT=last`
b) `GRUB_DEFAULT=saved` y `GRUB_SAVEDEFAULT=true`
c) `GRUB_REMEMBER=true`
d) `GRUB_DEFAULT=remember`

<details>
<summary>Respuesta</summary>

**b) `GRUB_DEFAULT=saved` y `GRUB_SAVEDEFAULT=true`**

Para que GRUB recuerde la ultima entrada seleccionada, se necesitan dos configuraciones: `GRUB_DEFAULT=saved` indica que se use la entrada guardada, y `GRUB_SAVEDEFAULT=true` hace que GRUB guarde la seleccion del usuario. Tambien se puede usar `grub-set-default` o `grub-reboot` para establecer la entrada de forma manual.
</details>

---

### Pregunta 9

¿Que comando muestra el contenido actual de los parametros con los que se arranco el kernel en ejecucion?

a) `dmesg | head`
b) `cat /proc/cmdline`
c) `grub-editenv list`
d) `sysctl -a | grep boot`

<details>
<summary>Respuesta</summary>

**b) `cat /proc/cmdline`**

El archivo virtual `/proc/cmdline` contiene los parametros exactos con los que se arranco el kernel actual. Es la fuente definitiva para verificar que parametros estan activos. `dmesg | head` podria mostrar informacion del kernel pero no de forma estructurada. `grub-editenv list` muestra variables del entorno de GRUB guardadas.
</details>

---

### Pregunta 10

Para que el journal de systemd mantenga logs persistentes entre reinicios, ¿que condicion debe cumplirse?

a) Instalar el paquete `rsyslog`
b) Configurar `Storage=volatile` en `/etc/systemd/journald.conf`
c) Que exista el directorio `/var/log/journal/` o configurar `Storage=persistent` en `journald.conf`
d) Ejecutar `systemctl enable systemd-journald-persistent`

<details>
<summary>Respuesta</summary>

**c) Que exista el directorio `/var/log/journal/` o configurar `Storage=persistent` en `journald.conf`**

Por defecto, el valor de `Storage` es `auto`, lo que significa que si existe `/var/log/journal/`, los logs se guardan de forma persistente. Si no existe, se almacenan en `/run/log/journal/` (volatil). Alternativamente, establecer `Storage=persistent` en `/etc/systemd/journald.conf` crea automaticamente el directorio y fuerza el almacenamiento persistente.
</details>
