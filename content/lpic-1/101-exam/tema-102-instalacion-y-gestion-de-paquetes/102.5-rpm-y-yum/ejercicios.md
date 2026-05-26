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

## Ejercicio 1
**Cual es la diferencia entre `rpm -i`, `rpm -U` y `rpm -F`? Cual es la opcion mas recomendada para uso general y por que?**

<details>
<summary>Ver respuesta</summary>

| Opcion | Paquete NO instalado | Paquete YA instalado |
|--------|---------------------|---------------------|
| `rpm -i` (install) | Lo instala | Da error (ya existe) |
| `rpm -U` (upgrade) | Lo instala | Lo actualiza |
| `rpm -F` (freshen) | No hace nada | Lo actualiza |

La opcion **mas recomendada es `rpm -U`** (normalmente con `-Uvh`) porque:
- Si el paquete no esta instalado, lo instala
- Si ya esta instalado, lo actualiza a la nueva version
- Es la opcion mas versatil y segura para ambos escenarios

`rpm -F` es util cuando se quiere actualizar **solo** paquetes que ya estan instalados (por ejemplo, al aplicar un conjunto de parches, evitando instalar paquetes nuevos).
</details>

---

## Ejercicio 2
**Necesitas saber que paquete RPM instalo el archivo `/etc/httpd/conf/httpd.conf`. Escribe el comando. Tambien escribe el comando para listar todos los archivos de configuracion de ese paquete.**

<details>
<summary>Ver respuesta</summary>

Para saber **que paquete instalo el archivo**:
```bash
rpm -qf /etc/httpd/conf/httpd.conf
```
Resultado probable: `httpd-2.4.37-xx.el8.x86_64`

Para listar todos los **archivos de configuracion** de ese paquete:
```bash
rpm -qc httpd
```

Otros comandos utiles para investigar el paquete:
```bash
rpm -qi httpd    # Informacion detallada
rpm -ql httpd    # Todos los archivos (no solo configuracion)
rpm -qd httpd    # Solo archivos de documentacion
rpm -qR httpd    # Dependencias del paquete
```
</details>

---

## Ejercicio 3
**Ejecutas `rpm -V httpd` y obtienes la siguiente salida:**
```
S.5....T.  c /etc/httpd/conf/httpd.conf
..5....T.  c /etc/httpd/conf.d/ssl.conf
```
**Que significa cada caracter? Es preocupante este resultado?**

<details>
<summary>Ver respuesta</summary>

Analisis de la primera linea `S.5....T.  c /etc/httpd/conf/httpd.conf`:

| Posicion | Caracter | Significado |
|----------|----------|-------------|
| 1 | `S` | El **tamano** del archivo ha cambiado |
| 2 | `.` | Sin cambios (permisos) |
| 3 | `5` | El **checksum MD5** ha cambiado (contenido modificado) |
| 4-7 | `....` | Sin cambios (dispositivo, enlace, usuario, grupo) |
| 8 | `T` | La **fecha de modificacion** ha cambiado |
| 9 | `.` | Sin cambios |
| | `c` | Es un archivo de **configuracion** |

La segunda linea indica que `ssl.conf` ha sido modificado (checksum y fecha), pero su tamano no cambio.

**No es preocupante** en este caso. La marca `c` indica que son archivos de configuracion, y es **normal y esperado** que el administrador los haya modificado. Si estos cambios aparecieran en archivos binarios (sin la marca `c`), entonces si seria preocupante (posible intrusion o corrupcion).
</details>

---

## Ejercicio 4
**Tienes un archivo `nginx-1.20.1-2.el8.x86_64.rpm` y necesitas ver que archivos contiene SIN instalarlo. Escribe dos formas de hacerlo: una con rpm y otra con rpm2cpio.**

<details>
<summary>Ver respuesta</summary>

**Metodo 1: con rpm (flag -qp)**
```bash
rpm -qpl nginx-1.20.1-2.el8.x86_64.rpm
```
El flag `-p` indica que se consulta un archivo .rpm en lugar de un paquete instalado. `-ql` lista los archivos.

**Metodo 2: con rpm2cpio**
```bash
rpm2cpio nginx-1.20.1-2.el8.x86_64.rpm | cpio -t
```
`rpm2cpio` convierte el .rpm a formato cpio, y `cpio -t` lista el contenido sin extraerlo.

Para **extraer** los archivos sin instalar (con rpm2cpio):
```bash
rpm2cpio nginx-1.20.1-2.el8.x86_64.rpm | cpio -idmv
```

Tambien se puede consultar informacion del .rpm sin instalar:
```bash
rpm -qpi nginx-1.20.1-2.el8.x86_64.rpm    # Info general
rpm -qpR nginx-1.20.1-2.el8.x86_64.rpm    # Dependencias
rpm -qpc nginx-1.20.1-2.el8.x86_64.rpm    # Archivos de configuracion
```
</details>

---

## Ejercicio 5
**Que comando de yum/dnf usarias para buscar que paquete proporciona el archivo `/usr/bin/wget`? Cual es el equivalente en el mundo Debian?**

<details>
<summary>Ver respuesta</summary>

En **yum/dnf** (Red Hat):
```bash
yum provides /usr/bin/wget
# o
dnf provides /usr/bin/wget
# tambien se puede buscar con patron:
yum provides "*/wget"
```

En el mundo **Debian**:
- Si el paquete esta instalado: `dpkg -S /usr/bin/wget`
- Si el paquete NO esta instalado: `apt-file search /usr/bin/wget`

Equivalencia directa: `rpm -qf` y `yum provides` corresponden a `dpkg -S` y `apt-file search` respectivamente.

| Situacion | RPM/YUM | Debian |
|-----------|---------|--------|
| Paquete instalado | `rpm -qf /usr/bin/wget` | `dpkg -S /usr/bin/wget` |
| Cualquier paquete | `yum provides /usr/bin/wget` | `apt-file search /usr/bin/wget` |
</details>

---

## Ejercicio 6
**Describe la estructura de un archivo de repositorio en `/etc/yum.repos.d/` y explica que significa cada campo. Escribe un ejemplo para el repositorio EPEL.**

<details>
<summary>Ver respuesta</summary>

Un archivo `.repo` tiene formato INI con los siguientes campos:

```ini
[epel]
name=Extra Packages for Enterprise Linux 8 - $basearch
baseurl=https://dl.fedoraproject.org/pub/epel/8/$basearch/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-8
```

Explicacion de cada campo:

| Campo | Valor | Descripcion |
|-------|-------|-------------|
| `[epel]` | Identificador | Nombre unico del repositorio (usado internamente) |
| `name` | Texto descriptivo | Nombre legible. `$basearch` se sustituye por la arquitectura |
| `baseurl` | URL | Direccion del repositorio. Alternativa: `mirrorlist` |
| `enabled` | `1` | 1 = repositorio activo; 0 = desactivado |
| `gpgcheck` | `1` | 1 = verificar firmas GPG; 0 = no verificar |
| `gpgkey` | Ruta/URL | Ubicacion de la clave GPG publica para verificacion |

Variables especiales:
- `$releasever` - version del sistema (7, 8, 9...)
- `$basearch` - arquitectura (x86_64, aarch64...)

Para gestionar repositorios:
```bash
yum repolist                    # Ver repos activos
yum repolist all                # Ver todos (activos e inactivos)
yum-config-manager --enable epel   # Activar repo
yum-config-manager --disable epel  # Desactivar repo
```
</details>

---

## Ejercicio 7
**Compara los comandos equivalentes entre `rpm`/`yum` y `dpkg`/`apt` para las siguientes operaciones: instalar un paquete local, listar todos los paquetes instalados, buscar a que paquete pertenece un archivo.**

<details>
<summary>Ver respuesta</summary>

| Operacion | RPM/YUM | Debian |
|-----------|---------|--------|
| **Instalar paquete local** | `rpm -ivh paquete.rpm` (sin deps) | `dpkg -i paquete.deb` (sin deps) |
| | `yum localinstall paquete.rpm` (con deps) | `apt install ./paquete.deb` (con deps) |
| **Listar todos los instalados** | `rpm -qa` | `dpkg -l` |
| | `yum list installed` | `apt list --installed` |
| **Buscar paquete por archivo** | `rpm -qf /ruta/archivo` (instalados) | `dpkg -S /ruta/archivo` (instalados) |
| | `yum provides /ruta/archivo` (todos) | `apt-file search /ruta/archivo` (todos) |

Diferencias importantes:
- `rpm` y `dpkg` son de **bajo nivel**: no resuelven dependencias
- `yum`/`dnf` y `apt` son de **alto nivel**: resuelven dependencias automaticamente
- `yum` actualiza su lista de paquetes automaticamente, mientras que `apt` requiere `apt update`
- `rpm -e` no tiene concepto de "purge" vs "remove" como `dpkg`
</details>

---

## Ejercicio 8
**Un sistema CentOS tiene un paquete parcialmente instalado y corrupto. Describe como usarias `rpm2cpio` para extraer un archivo de configuracion del paquete original `.rpm` sin reinstalar todo el paquete. Da los comandos paso a paso.**

<details>
<summary>Ver respuesta</summary>

Escenario: El archivo `/etc/nginx/nginx.conf` se ha corrompido y necesitas restaurar la version original del paquete RPM.

```bash
# 1. Identificar que paquete proporciona el archivo
rpm -qf /etc/nginx/nginx.conf
# Resultado: nginx-1.20.1-2.el8.x86_64

# 2. Descargar el RPM sin instalarlo (si no lo tienes)
yumdownloader nginx
# o
dnf download nginx

# 3. Ver el contenido del RPM para confirmar la ruta
rpm2cpio nginx-1.20.1-2.el8.x86_64.rpm | cpio -t | grep nginx.conf

# 4. Extraer solo el archivo necesario en un directorio temporal
mkdir /tmp/recuperacion
cd /tmp/recuperacion
rpm2cpio /ruta/nginx-1.20.1-2.el8.x86_64.rpm | cpio -idmv ./etc/nginx/nginx.conf

# 5. Copiar el archivo restaurado a su ubicacion original
cp /tmp/recuperacion/etc/nginx/nginx.conf /etc/nginx/nginx.conf

# 6. Verificar que el paquete ahora esta correcto
rpm -V nginx
```

**Notas**:
- `cpio -idmv`: `i` = extraer, `d` = crear directorios, `m` = mantener fechas, `v` = verbose
- Las rutas dentro del cpio son relativas, por eso se usa `./etc/...`
- Alternativa: `rpm -Uvh --force nginx.rpm` reinstalaria todo el paquete
</details>
