---
title: "102.4 - Gestion de paquetes Debian: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.4"
---

# 102.4 - Gestion de paquetes Debian: Ejercicios

### Pregunta 1

Cual es la diferencia entre `dpkg -r paquete` y `dpkg -P paquete`?

a) `-r` desinstala y purga, `-P` solo desinstala
b) `-r` desinstala conservando los archivos de configuracion, `-P` elimina todo incluyendo la configuracion
c) No hay diferencia, ambos eliminan todo completamente
d) `-r` marca el paquete para eliminacion futura, `-P` lo desinstala inmediatamente

<details><summary>Respuesta</summary>

**b) `-r` desinstala conservando los archivos de configuracion, `-P` elimina todo incluyendo la configuracion**

`dpkg -r` (remove) elimina los archivos del programa pero conserva los archivos de configuracion, permitiendo reinstalar el paquete y recuperar la configuracion anterior. El paquete aparecera con estado `rc` en `dpkg -l`. `dpkg -P` (purge) elimina todo: archivos del programa y archivos de configuracion. Los equivalentes con apt son `apt remove` y `apt purge` respectivamente.

</details>

---

### Pregunta 2

Necesitas saber que paquete instalo el archivo `/usr/bin/vim` en tu sistema. Que comando usarias?

a) `apt-file search /usr/bin/vim`
b) `apt search vim`
c) `dpkg -S /usr/bin/vim`
d) `dpkg -L vim`

<details><summary>Respuesta</summary>

**c) `dpkg -S /usr/bin/vim`**

`dpkg -S` busca entre los paquetes instalados en el sistema cual proporciona un archivo determinado. `apt-file search` tambien puede buscar archivos pero busca en todos los repositorios (incluso paquetes no instalados) y requiere tener su base de datos actualizada. `apt search` busca paquetes por nombre o descripcion, no por archivo. `dpkg -L` hace lo contrario: lista los archivos que pertenecen a un paquete, no busca a que paquete pertenece un archivo.

</details>

---

### Pregunta 3

Cual es la diferencia entre `apt update` y `apt upgrade`?

a) `apt update` actualiza los paquetes instalados y `apt upgrade` descarga las listas de paquetes
b) `apt update` descarga las listas de paquetes disponibles y `apt upgrade` actualiza los paquetes instalados
c) Son equivalentes, ambos actualizan el sistema
d) `apt update` solo actualiza el kernel y `apt upgrade` actualiza el resto

<details><summary>Respuesta</summary>

**b) `apt update` descarga las listas de paquetes disponibles y `apt upgrade` actualiza los paquetes instalados**

`apt update` descarga la informacion actualizada de que paquetes estan disponibles en los repositorios configurados en `/etc/apt/sources.list`. No instala ni actualiza nada. `apt upgrade` actualiza los paquetes instalados a su version mas reciente usando esas listas. Siempre se debe ejecutar `apt update` antes de `apt upgrade`. Existe tambien `apt full-upgrade` (equivalente a `apt-get dist-upgrade`) que puede eliminar paquetes obsoletos e instalar nuevas dependencias.

</details>

---

### Pregunta 4

Has descargado un paquete `.deb` manualmente y al ejecutar `dpkg -i paquete.deb` falla por dependencias faltantes. Cual es la forma correcta de resolver el problema?

a) Ejecutar `dpkg --fix-broken paquete.deb`
b) Ejecutar `apt --fix-broken install` o `apt-get install -f`
c) Reinstalar el paquete con `dpkg -i --force-depends paquete.deb`
d) Descargar e instalar manualmente cada dependencia con `dpkg -i`

<details><summary>Respuesta</summary>

**b) Ejecutar `apt --fix-broken install` o `apt-get install -f`**

Cuando `dpkg -i` falla por dependencias, el paquete queda en estado "parcialmente instalado". Al ejecutar `apt --fix-broken install` (o `apt-get install -f`), apt descarga e instala automaticamente las dependencias faltantes de los repositorios y completa la instalacion. Una alternativa mas directa es usar `apt install ./paquete.deb` (con el prefijo `./`), que resuelve dependencias automaticamente al instalar el archivo local.

</details>

---

### Pregunta 5

En la estructura del archivo `/etc/apt/sources.list`, que significa el campo `deb-src`?

a) Repositorio de paquetes binarios de codigo cerrado
b) Repositorio de codigo fuente de los paquetes
c) Repositorio de seguridad para actualizaciones criticas
d) Repositorio secundario de respaldo

<details><summary>Respuesta</summary>

**b) Repositorio de codigo fuente de los paquetes**

En una linea de `sources.list`, el primer campo indica el tipo: `deb` es para paquetes binarios compilados y `deb-src` es para el codigo fuente de los paquetes. Una linea completa tiene el formato: `tipo URI distribucion componentes`. Por ejemplo: `deb http://archive.ubuntu.com/ubuntu jammy main restricted`. Los componentes tipicos de Ubuntu son `main` (libre oficial), `restricted` (propietario soportado), `universe` (libre comunitario) y `multiverse` (no libre).

</details>

---

### Pregunta 6

Que comando lista todos los archivos instalados por el paquete `openssh-server`?

a) `dpkg -s openssh-server`
b) `dpkg -S openssh-server`
c) `dpkg -L openssh-server`
d) `apt-file list openssh-server`

<details><summary>Respuesta</summary>

**c) `dpkg -L openssh-server`**

`dpkg -L` (listfiles) muestra la lista completa de archivos que un paquete instalo en el sistema. `dpkg -s` muestra el estado e informacion del paquete (version, dependencias, descripcion). `dpkg -S` busca a que paquete pertenece un archivo especifico (operacion inversa). `apt-file list` tambien puede listar archivos de un paquete, pero busca en todos los repositorios y no solo en paquetes instalados, requiriendo ademas tener su base de datos actualizada.

</details>

---

### Pregunta 7

Que hace el comando `dpkg-reconfigure tzdata`?

a) Reinstala el paquete `tzdata` desde el repositorio
b) Elimina y vuelve a crear la configuracion de zona horaria por defecto
c) Vuelve a ejecutar los scripts de configuracion post-instalacion del paquete `tzdata`
d) Actualiza el paquete `tzdata` a la ultima version disponible

<details><summary>Respuesta</summary>

**c) Vuelve a ejecutar los scripts de configuracion post-instalacion del paquete `tzdata`**

`dpkg-reconfigure` re-ejecuta los scripts de configuracion post-instalacion de un paquete ya instalado, como si el paquete se estuviera configurando por primera vez. Es util para cambiar configuraciones interactivas como la zona horaria (`tzdata`), los idiomas del sistema (`locales`) o el teclado (`keyboard-configuration`). No confundir con `dpkg --configure -a`, que intenta completar la configuracion de paquetes que quedaron en estado parcialmente configurado.

</details>

---

### Pregunta 8

En la salida de `dpkg -l`, un paquete aparece con el estado `rc`. Que significa?

a) El paquete esta instalado correctamente y configurado
b) El paquete fue eliminado pero sus archivos de configuracion aun permanecen en el sistema
c) El paquete esta retenido y no se actualizara
d) El paquete tiene un error de configuracion que necesita reparacion

<details><summary>Respuesta</summary>

**b) El paquete fue eliminado pero sus archivos de configuracion aun permanecen en el sistema**

El estado `rc` se compone de dos letras: `r` (desired: Remove) indica que se solicito la eliminacion, y `c` (status: Config-files) indica que los archivos de configuracion siguen presentes. Esto ocurre cuando se usa `dpkg -r` o `apt remove`. Para eliminar completamente el paquete incluyendo la configuracion residual, se debe usar `dpkg -P nombre_paquete` o `apt purge nombre_paquete`.

</details>

---

### Pregunta 9

Donde se almacenan los archivos `.deb` descargados por apt y que comando los elimina todos?

a) En `/tmp/apt/` y se eliminan con `apt remove --cache`
b) En `/var/cache/apt/archives/` y se eliminan con `apt clean`
c) En `/var/lib/dpkg/cache/` y se eliminan con `dpkg --clean`
d) En `/usr/share/apt/downloads/` y se eliminan con `apt autoclean`

<details><summary>Respuesta</summary>

**b) En `/var/cache/apt/archives/` y se eliminan con `apt clean`**

Los paquetes `.deb` descargados se almacenan en `/var/cache/apt/archives/` y pueden ocupar mucho espacio con el tiempo. `apt clean` (o `apt-get clean`) elimina todos los `.deb` descargados. `apt autoclean` (o `apt-get autoclean`) es mas conservador: solo elimina los `.deb` de versiones obsoletas que ya no estan en los repositorios, conservando los de las versiones actuales.

</details>

---

### Pregunta 10

Cual es la diferencia fundamental entre `dpkg` y `apt` como herramientas de gestion de paquetes?

a) `dpkg` trabaja con repositorios remotos y `apt` solo con archivos locales
b) `apt` es de bajo nivel y `dpkg` de alto nivel
c) `dpkg` gestiona paquetes individuales sin resolver dependencias, mientras que `apt` resuelve dependencias automaticamente
d) `dpkg` solo funciona en Debian y `apt` funciona en cualquier distribucion

<details><summary>Respuesta</summary>

**c) `dpkg` gestiona paquetes individuales sin resolver dependencias, mientras que `apt` resuelve dependencias automaticamente**

`dpkg` es la herramienta de bajo nivel del sistema de paquetes Debian: instala y desinstala archivos `.deb` individuales pero no gestiona dependencias. Si un paquete requiere otro que no esta instalado, `dpkg` simplemente reporta el error. `apt` (y `apt-get`) es la herramienta de alto nivel que trabaja con repositorios, descarga paquetes y resuelve dependencias automaticamente. Internamente, `apt` utiliza `dpkg` para la instalacion final de los paquetes.

</details>
