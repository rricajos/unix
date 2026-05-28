---
title: "102.5 - Gestion de paquetes RPM y YUM: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.5"
---

# 102.5 - Gestion de paquetes RPM y YUM: Ejercicios

### Pregunta 1

Cual es la diferencia entre `rpm -i`, `rpm -U` y `rpm -F`?

a) `-i` instala o actualiza, `-U` solo instala si no existe, `-F` fuerza la instalacion
b) `-i` solo instala (da error si existe), `-U` instala o actualiza, `-F` solo actualiza si ya esta instalado
c) Los tres son equivalentes y realizan la misma operacion
d) `-i` instala desde repositorio, `-U` actualiza desde repositorio, `-F` instala desde archivo local

<details><summary>Respuesta</summary>

**b) `-i` solo instala (da error si existe), `-U` instala o actualiza, `-F` solo actualiza si ya esta instalado**

`rpm -i` (install) instala un paquete nuevo; si ya esta instalado, da error. `rpm -U` (upgrade) es la opcion mas versatil: instala si no existe y actualiza si ya existe. `rpm -F` (freshen) solo actualiza paquetes que ya estan instalados; si el paquete no existe, no hace nada. Por esto, `rpm -Uvh` es la opcion mas recomendada para uso general, ya que cubre ambos escenarios (instalacion y actualizacion).

</details>

---

### Pregunta 2

Necesitas saber que paquete RPM instalo el archivo `/etc/httpd/conf/httpd.conf`. Que comando usarias?

a) `rpm -ql /etc/httpd/conf/httpd.conf`
b) `rpm -qi httpd`
c) `rpm -qf /etc/httpd/conf/httpd.conf`
d) `yum search httpd.conf`

<details><summary>Respuesta</summary>

**c) `rpm -qf /etc/httpd/conf/httpd.conf`**

El flag `-qf` (query file) busca a que paquete instalado pertenece un archivo determinado. Es el equivalente en RPM a `dpkg -S` en Debian. `rpm -ql` lista los archivos de un paquete (no busca por archivo). `rpm -qi` muestra informacion detallada de un paquete. `yum search` busca paquetes por nombre o descripcion en los repositorios, no por archivo. Para buscar que paquete proporciona un archivo en los repositorios (no solo instalados), se usa `yum provides`.

</details>

---

### Pregunta 3

Al ejecutar `rpm -V httpd` obtienes la salida `S.5....T.  c /etc/httpd/conf/httpd.conf`. Que significa `S`, `5` y `T`?

a) `S` = seguridad comprometida, `5` = 5 modificaciones, `T` = tipo de archivo cambiado
b) `S` = tamano cambiado, `5` = checksum MD5 cambiado, `T` = fecha de modificacion cambiada
c) `S` = SUID activado, `5` = nivel 5 de alerta, `T` = transferido a otra ubicacion
d) `S` = symlink roto, `5` = 5 dependencias faltantes, `T` = temporalmente deshabilitado

<details><summary>Respuesta</summary>

**b) `S` = tamano cambiado, `5` = checksum MD5 cambiado, `T` = fecha de modificacion cambiada**

En la salida de `rpm -V`, cada posicion indica un tipo de verificacion: S (Size/tamano), M (Mode/permisos), 5 (MD5 checksum), D (Device), L (Link), U (User), G (Group), T (Time/fecha). Un punto (`.`) significa sin cambios. La marca `c` indica que es un archivo de configuracion. Es normal que los archivos de configuracion muestren cambios porque el administrador los modifica habitualmente. Seria preocupante si estos cambios aparecieran en archivos binarios.

</details>

---

### Pregunta 4

Como puedes ver los archivos que contiene un paquete `.rpm` SIN instalarlo?

a) `rpm -ql paquete.rpm`
b) `rpm -qpl paquete.rpm`
c) `rpm -qa paquete.rpm`
d) `rpm -qf paquete.rpm`

<details><summary>Respuesta</summary>

**b) `rpm -qpl paquete.rpm`**

El flag `-p` indica que se consulta un archivo `.rpm` en lugar de un paquete instalado en el sistema. Combinado con `-ql` (query list), muestra los archivos contenidos en el paquete sin necesidad de instalarlo. Sin el flag `-p`, `rpm -ql` solo funciona con paquetes ya instalados. Otros flags utiles con `-p` son: `rpm -qpi` (informacion), `rpm -qpR` (dependencias) y `rpm -qpc` (archivos de configuracion). Otra alternativa es usar `rpm2cpio paquete.rpm | cpio -t`.

</details>

---

### Pregunta 5

Que comando de yum/dnf busca que paquete proporciona un archivo determinado, incluso si el paquete no esta instalado?

a) `yum search /usr/bin/wget`
b) `yum info /usr/bin/wget`
c) `yum provides /usr/bin/wget`
d) `yum list /usr/bin/wget`

<details><summary>Respuesta</summary>

**c) `yum provides /usr/bin/wget`**

`yum provides` (o `dnf provides`) busca en todos los repositorios configurados que paquete proporciona un archivo determinado, sin necesidad de tenerlo instalado. Tambien acepta patrones con comodines: `yum provides "*/wget"`. Para paquetes ya instalados se puede usar `rpm -qf`. El equivalente en el mundo Debian es `apt-file search` para repositorios y `dpkg -S` para paquetes instalados.

</details>

---

### Pregunta 6

En un archivo de repositorio de `/etc/yum.repos.d/`, que significa el campo `gpgcheck=1`?

a) El repositorio esta habilitado y activo
b) Se verificaran las firmas GPG de los paquetes descargados
c) La clave GPG se generara automaticamente
d) El repositorio usa conexion cifrada HTTPS

<details><summary>Respuesta</summary>

**b) Se verificaran las firmas GPG de los paquetes descargados**

El campo `gpgcheck=1` indica que yum/dnf verificara la firma GPG de cada paquete descargado de ese repositorio para garantizar su autenticidad e integridad. La clave GPG publica para la verificacion se especifica en el campo `gpgkey`. Si se establece `gpgcheck=0`, no se verifican firmas (no recomendado en produccion). El campo `enabled=1/0` controla si el repositorio esta activo o no, que es una configuracion independiente de la verificacion GPG.

</details>

---

### Pregunta 7

Cual es el equivalente en el mundo Debian de `rpm -qa` (listar todos los paquetes instalados)?

a) `apt list`
b) `dpkg -l`
c) `dpkg -S`
d) `apt-cache search`

<details><summary>Respuesta</summary>

**b) `dpkg -l`**

`rpm -qa` lista todos los paquetes RPM instalados en el sistema. Su equivalente directo en Debian es `dpkg -l`, que lista todos los paquetes con su estado, version y descripcion breve. Tambien se puede usar `apt list --installed` para una salida similar. `dpkg -S` busca a que paquete pertenece un archivo (equivalente a `rpm -qf`). `apt-cache search` busca paquetes por nombre o descripcion en los repositorios.

</details>

---

### Pregunta 8

Que herramienta permite extraer archivos de un paquete `.rpm` sin instalarlo?

a) `rpm --extract paquete.rpm`
b) `rpm2cpio paquete.rpm | cpio -idmv`
c) `yum extract paquete.rpm`
d) `tar xvf paquete.rpm`

<details><summary>Respuesta</summary>

**b) `rpm2cpio paquete.rpm | cpio -idmv`**

`rpm2cpio` convierte un paquete `.rpm` al formato cpio, que luego se extrae con el comando `cpio`. Los flags de cpio son: `i` (extraer), `d` (crear directorios), `m` (mantener fechas de modificacion), `v` (verbose). Para solo listar el contenido sin extraer se usa `cpio -t`. Esta herramienta es muy util para recuperar archivos de configuracion originales de un paquete sin tener que reinstalarlo completamente. Tambien se puede descargar el RPM con `yumdownloader` o `dnf download` si no se tiene el archivo.

</details>

---

### Pregunta 9

Cual es la principal diferencia entre `yum` y `dnf`?

a) `yum` resuelve dependencias y `dnf` no
b) `dnf` usa el resolvedor de dependencias `libsolv` y tiene mejor rendimiento que `yum`
c) `yum` funciona en Fedora y `dnf` solo en CentOS
d) `dnf` no soporta grupos de paquetes a diferencia de `yum`

<details><summary>Respuesta</summary>

**b) `dnf` usa el resolvedor de dependencias `libsolv` y tiene mejor rendimiento que `yum`**

DNF (Dandified YUM) es el sucesor de YUM, usado en Fedora y RHEL/CentOS 8+. La sintaxis es practicamente identica, pero DNF utiliza `libsolv` para la resolucion de dependencias (mas rapido y preciso), tiene mejor rendimiento general y usa Python 3. La configuracion principal de DNF esta en `/etc/dnf/dnf.conf` aunque comparte el directorio `/etc/yum.repos.d/` para los repositorios. En muchas distribuciones modernas, `yum` es simplemente un enlace simbolico a `dnf`.

</details>

---

### Pregunta 10

Que gestor de paquetes de alto nivel se utiliza en distribuciones openSUSE/SLES?

a) `apt`
b) `dnf`
c) `zypper`
d) `pacman`

<details><summary>Respuesta</summary>

**c) `zypper`**

`zypper` es el gestor de paquetes de alto nivel para distribuciones SUSE (openSUSE y SLES). Utiliza RPM como formato de paquetes de bajo nivel, al igual que yum/dnf. Los comandos principales de zypper son: `zypper install` (o `zypper in`) para instalar, `zypper remove` (o `zypper rm`) para desinstalar, `zypper search` (o `zypper se`) para buscar, `zypper update` (o `zypper up`) para actualizar, y `zypper refresh` (o `zypper ref`) para actualizar la lista de repositorios.

</details>
