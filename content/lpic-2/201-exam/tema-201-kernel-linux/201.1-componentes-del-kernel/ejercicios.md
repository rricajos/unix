---
title: "201.1 - Componentes del kernel"
tags: [lpic-2, examen-201, tema-201, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.1"
---

# 201.1 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

¿Cual es la principal diferencia entre `bzImage` y `zImage` como formatos de imagen del kernel?

a) `bzImage` esta comprimido con bzip2 y `zImage` con gzip
b) `bzImage` puede cargarse en memoria alta (por encima de 1 MB), mientras que `zImage` esta limitado a los primeros 640 KB
c) `bzImage` es para arquitectura de 64 bits y `zImage` para 32 bits
d) `bzImage` incluye modulos y `zImage` no

<details>
<summary>Respuesta</summary>

**b) `bzImage` puede cargarse en memoria alta (por encima de 1 MB), mientras que `zImage` esta limitado a los primeros 640 KB**

La "b" en `bzImage` significa "big", refiriendose a que puede usar memoria alta, eliminando la restriccion de 640 KB de `zImage`. Ambos formatos usan el mismo tipo de compresion. `bzImage` es el formato estandar para kernels modernos en arquitectura x86.
</details>

---

### Pregunta 2

¿En que directorio se encuentra la documentacion oficial incluida con el codigo fuente del kernel de Linux?

a) `/usr/share/doc/linux/`
b) `/usr/src/linux/Documentation/`
c) `/etc/kernel/docs/`
d) `/var/lib/kernel/documentation/`

<details>
<summary>Respuesta</summary>

**b) `/usr/src/linux/Documentation/`**

La documentacion oficial del kernel viene incluida en el arbol del codigo fuente, dentro del subdirectorio `Documentation/`. Este directorio contiene informacion sobre subsistemas, parametros de arranque, API del kernel y guias de configuracion. Es la referencia primaria para cualquier aspecto tecnico del kernel.
</details>

---

### Pregunta 3

Un archivo `.config` del kernel contiene la linea `CONFIG_EXT4_FS=m`. ¿Que significa esto?

a) El soporte para EXT4 esta deshabilitado
b) El soporte para EXT4 se compilara directamente en el kernel
c) El soporte para EXT4 se compilara como un modulo cargable
d) El soporte para EXT4 esta marcado como experimental

<details>
<summary>Respuesta</summary>

**c) El soporte para EXT4 se compilara como un modulo cargable**

En la configuracion del kernel, `=m` indica que la funcionalidad se compilara como modulo que puede cargarse y descargarse en tiempo de ejecucion. `=y` significaria compilado directamente en el kernel (built-in), y `# CONFIG_EXT4_FS is not set` indicaria que esta deshabilitado.
</details>

---

### Pregunta 4

¿Que comando muestra la version del kernel actualmente en ejecucion?

a) `kernel --version`
b) `cat /etc/kernel-version`
c) `uname -r`
d) `version -k`

<details>
<summary>Respuesta</summary>

**c) `uname -r`**

El comando `uname` con la opcion `-r` muestra la version (release) del kernel en ejecucion, por ejemplo `5.15.0-56-generic`. Tambien se puede obtener de `/proc/version` o con `uname -a` que muestra toda la informacion del kernel.
</details>

---

### Pregunta 5

¿Donde se definen las variables VERSION, PATCHLEVEL y SUBLEVEL que determinan la version del kernel?

a) En `/etc/kernel.conf`
b) En `/usr/src/linux/.config`
c) En `/usr/src/linux/Makefile`
d) En `/boot/config-<version>`

<details>
<summary>Respuesta</summary>

**c) En `/usr/src/linux/Makefile`**

El `Makefile` principal en la raiz del codigo fuente del kernel contiene las variables `VERSION`, `PATCHLEVEL`, `SUBLEVEL` y `EXTRAVERSION` que definen la version completa del kernel. Estas variables se usan durante la compilacion para generar el nombre de version del kernel resultante.
</details>

---

### Pregunta 6

¿Que comando se utiliza para aplicar un parche al codigo fuente del kernel?

a) `apply -patch archivo.patch`
b) `patch -p1 < archivo.patch`
c) `kernel-patch archivo.patch`
d) `diff -apply archivo.patch`

<details>
<summary>Respuesta</summary>

**b) `patch -p1 < archivo.patch`**

El comando `patch` se ejecuta desde el directorio raiz del codigo fuente. La opcion `-p1` indica que se debe eliminar el primer componente de la ruta en las lineas del parche (tipicamente `a/` o `b/` generados por `diff` o `git diff`). Para revertir un parche se usa `patch -R -p1`.
</details>

---

### Pregunta 7

¿Que archivo en `/boot/` contiene la tabla de correspondencias entre direcciones de memoria y nombres de funciones del kernel?

a) `vmlinuz-<version>`
b) `initrd.img-<version>`
c) `System.map-<version>`
d) `config-<version>`

<details>
<summary>Respuesta</summary>

**c) `System.map-<version>`**

`System.map` es la tabla de simbolos del kernel que mapea direcciones de memoria a nombres de funciones y variables del kernel. Se utiliza para depuracion y diagnostico, especialmente para interpretar mensajes de error del kernel (kernel oops/panic). Cada version del kernel tiene su propio `System.map`.
</details>

---

### Pregunta 8

¿Cual de las siguientes afirmaciones sobre el kernel Linux es correcta?

a) Linux es un microkernel puro
b) Linux es un kernel monolitico con soporte de modulos cargables
c) Linux no soporta modulos, todo debe compilarse en el kernel
d) Linux es un hipervisor que ejecuta multiples kernels

<details>
<summary>Respuesta</summary>

**b) Linux es un kernel monolitico con soporte de modulos cargables**

Linux se clasifica como un kernel monolitico hibrido. Toda la funcionalidad del kernel se ejecuta en espacio de kernel (a diferencia de un microkernel), pero soporta modulos cargables que pueden anadirse o eliminarse en tiempo de ejecucion sin reiniciar. Esto combina el rendimiento del diseno monolitico con la flexibilidad de los modulos.
</details>

---

### Pregunta 9

Un administrador quiere copiar la configuracion del kernel en ejecucion para usarla como base en una nueva compilacion. ¿Cual de los siguientes comandos es apropiado?

a) `cp /proc/kernel/.config /usr/src/linux/.config`
b) `cp /boot/config-$(uname -r) /usr/src/linux/.config`
c) `uname --config > /usr/src/linux/.config`
d) `sysctl -export > /usr/src/linux/.config`

<details>
<summary>Respuesta</summary>

**b) `cp /boot/config-$(uname -r) /usr/src/linux/.config`**

La configuracion del kernel en ejecucion se almacena en `/boot/config-<version>`. Usando `$(uname -r)` se obtiene la version actual automaticamente. Alternativamente, si el kernel fue compilado con `CONFIG_IKCONFIG_PROC`, se puede usar `zcat /proc/config.gz > /usr/src/linux/.config`.
</details>

---

### Pregunta 10

¿Donde se almacenan los modulos compilados del kernel en ejecucion?

a) `/boot/modules/`
b) `/usr/src/linux/modules/`
c) `/lib/modules/$(uname -r)/`
d) `/etc/modules/$(uname -r)/`

<details>
<summary>Respuesta</summary>

**c) `/lib/modules/$(uname -r)/`**

Los modulos compilados del kernel se instalan en `/lib/modules/<version>/`. Cada version del kernel tiene su propio directorio de modulos. Dentro se encuentran subdirectorios como `kernel/` (con los modulos organizados por tipo), archivos de dependencias (`modules.dep`) y otros metadatos.
</details>
