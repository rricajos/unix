---
title: "201.2 - Compilacion del kernel"
tags: [lpic-2, examen-201, tema-201, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.2"
---

# 201.2 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

¿Cual es el orden correcto de los pasos para compilar e instalar un kernel personalizado?

a) make install → make modules → make bzImage → make modules_install
b) make bzImage → make modules → make modules_install → make install
c) make modules → make bzImage → make install → make modules_install
d) make modules_install → make bzImage → make modules → make install

<details>
<summary>Respuesta</summary>

**b) make bzImage → make modules → make modules_install → make install**

El orden correcto es: primero compilar la imagen del kernel (`bzImage`), luego compilar los modulos (`modules`), despues instalar los modulos en `/lib/modules/<version>/` (`modules_install`), y finalmente instalar el kernel en `/boot/` (`install`). Los modulos deben compilarse antes de instalarlos, y el kernel debe compilarse antes de instalarlo.
</details>

---

### Pregunta 2

Un administrador tiene un archivo `.config` de un kernel 5.10 y quiere usarlo para compilar un kernel 5.15. ¿Que comando es el mas apropiado para actualizar la configuracion?

a) `make menuconfig`
b) `make defconfig`
c) `make oldconfig`
d) `make mrproper`

<details>
<summary>Respuesta</summary>

**c) `make oldconfig`**

`make oldconfig` lee el `.config` existente y solo pregunta por las opciones nuevas que no existian en la version anterior. Es la forma mas eficiente de migrar una configuracion entre versiones de kernel. `make menuconfig` mostraria todas las opciones, `make defconfig` descartaria la configuracion anterior, y `make mrproper` eliminaria el `.config`.
</details>

---

### Pregunta 3

¿Cual es la diferencia entre `make clean` y `make mrproper`?

a) Son identicos, hacen lo mismo
b) `make clean` elimina archivos objeto pero conserva `.config`; `make mrproper` elimina todo incluyendo `.config`
c) `make mrproper` solo limpia modulos; `make clean` limpia todo
d) `make clean` es para Debian y `make mrproper` para Red Hat

<details>
<summary>Respuesta</summary>

**b) `make clean` elimina archivos objeto pero conserva `.config`; `make mrproper` elimina todo incluyendo `.config`**

`make clean` elimina los archivos generados durante la compilacion (archivos `.o`, la imagen del kernel, etc.) pero preserva el archivo `.config` y otros archivos de configuracion. `make mrproper` realiza una limpieza completa, eliminando ademas `.config`, backups y archivos de configuracion. Siempre respalda `.config` antes de `make mrproper`.
</details>

---

### Pregunta 4

¿Que herramienta se utiliza en distribuciones basadas en Red Hat/Fedora para generar la imagen initramfs?

a) `mkinitramfs`
b) `update-initramfs`
c) `dracut`
d) `initramfs-tools`

<details>
<summary>Respuesta</summary>

**c) `dracut`**

`dracut` es la herramienta estandar en Red Hat, Fedora, CentOS y SUSE para generar imagenes initramfs. `mkinitramfs` y `update-initramfs` son herramientas de Debian/Ubuntu. `dracut` ha reemplazado al antiguo `mkinitrd` en las distribuciones de la familia Red Hat.
</details>

---

### Pregunta 5

¿Donde instala `make modules_install` los modulos compilados?

a) `/boot/modules/<version>/`
b) `/usr/src/linux/modules/`
c) `/lib/modules/<version>/`
d) `/etc/modules/<version>/`

<details>
<summary>Respuesta</summary>

**c) `/lib/modules/<version>/`**

`make modules_install` copia todos los modulos compilados (archivos `.ko`) al directorio `/lib/modules/<version>/` organizado en subdirectorios segun su categoria (kernel/drivers/, kernel/fs/, kernel/net/, etc.). Tambien genera el archivo `modules.dep` con las dependencias entre modulos.
</details>

---

### Pregunta 6

¿Que funcion cumple DKMS en la gestion del kernel?

a) Detecta automaticamente hardware nuevo al arrancar
b) Recompila automaticamente modulos de terceros cuando se instala un nuevo kernel
c) Gestiona las versiones del bootloader GRUB
d) Comprime automaticamente la imagen del kernel

<details>
<summary>Respuesta</summary>

**b) Recompila automaticamente modulos de terceros cuando se instala un nuevo kernel**

DKMS (Dynamic Kernel Module Support) mantiene el codigo fuente de modulos de terceros (como drivers de NVIDIA, VirtualBox, etc.) y los recompila automaticamente cuando se instala una nueva version del kernel. Sin DKMS, estos modulos dejarian de funcionar despues de cada actualizacion del kernel.
</details>

---

### Pregunta 7

Un administrador quiere compilar el kernel usando 8 hilos para acelerar el proceso. ¿Que comando debe usar?

a) `make --threads=8`
b) `make -j8`
c) `make -p8`
d) `make --parallel 8`

<details>
<summary>Respuesta</summary>

**b) `make -j8`**

La opcion `-j` (jobs) de `make` permite ejecutar multiples procesos de compilacion en paralelo. `-j8` ejecuta hasta 8 procesos simultaneos. Es comun usar `make -j$(nproc)` para usar automaticamente tantos hilos como nucleos tenga el sistema, optimizando el tiempo de compilacion.
</details>

---

### Pregunta 8

¿Que interfaz utiliza `make menuconfig` para la configuracion del kernel?

a) Interfaz grafica GTK
b) Interfaz grafica Qt
c) Interfaz de texto basada en ncurses
d) Solo linea de comandos sin menus

<details>
<summary>Respuesta</summary>

**c) Interfaz de texto basada en ncurses**

`make menuconfig` utiliza la biblioteca ncurses para mostrar una interfaz de menus basada en texto (TUI - Text User Interface). Es la opcion mas popular porque funciona en terminales sin entorno grafico. `make xconfig` usa Qt, `make gconfig` usa GTK, y `make config` es solo linea de comandos pregunta a pregunta.
</details>

---

### Pregunta 9

¿Donde se almacena el codigo fuente de los modulos gestionados por DKMS?

a) `/lib/modules/dkms/`
b) `/usr/src/<modulo>-<version>/`
c) `/boot/dkms/`
d) `/var/lib/dkms/source/`

<details>
<summary>Respuesta</summary>

**b) `/usr/src/<modulo>-<version>/`**

DKMS almacena el codigo fuente de los modulos en `/usr/src/<nombre-modulo>-<version>/`. Cada modulo tiene un archivo `dkms.conf` en ese directorio que define las instrucciones de compilacion. El arbol de compilacion de DKMS se mantiene en `/var/lib/dkms/` donde se guardan los modulos ya compilados para cada version del kernel.
</details>

---

### Pregunta 10

Despues de compilar un kernel personalizado, ¿que hace exactamente el comando `make install`?

a) Solo copia vmlinuz a /boot/
b) Copia vmlinuz, System.map y config a /boot/, y ejecuta scripts de post-instalacion que pueden actualizar el bootloader
c) Compila e instala todo el kernel y modulos
d) Solo actualiza la configuracion de GRUB

<details>
<summary>Respuesta</summary>

**b) Copia vmlinuz, System.map y config a /boot/, y ejecuta scripts de post-instalacion que pueden actualizar el bootloader**

`make install` copia la imagen del kernel (`vmlinuz`), la tabla de simbolos (`System.map`) y la configuracion (`.config`) al directorio `/boot/` con el sufijo de version apropiado. Ademas, ejecuta el script `/sbin/installkernel` si existe, que en muchas distribuciones actualiza automaticamente la configuracion del bootloader (GRUB). No compila ni instala modulos.
</details>
