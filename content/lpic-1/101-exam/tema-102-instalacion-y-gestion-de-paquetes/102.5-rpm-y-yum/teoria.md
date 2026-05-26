---
title: "102.5 - Gestion de paquetes RPM y YUM: Teoria"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.5"
---

# 102.5 - Gestion de paquetes RPM y YUM: Teoria

## Introduccion

El sistema de paquetes RPM (RPM Package Manager) es utilizado por distribuciones como Red Hat Enterprise Linux (RHEL), CentOS, Fedora, openSUSE y sus derivados. Al igual que en Debian, existen dos niveles de herramientas: `rpm` para la gestion de paquetes individuales y `yum`/`dnf`/`zypper` para la gestion de repositorios y dependencias.

---

## 1. Arquitectura del sistema de paquetes RPM

### Dos niveles de gestion

```
+--------------------------------------------+
|  yum / dnf / zypper                        |  <- Nivel alto
|  (gestion de repositorios y dependencias)  |
+--------------------------------------------+
|  rpm                                        |  <- Nivel bajo
|  (instalacion/desinstalacion de .rpm)       |
+--------------------------------------------+
```

| Nivel | Herramienta | Distribucion |
|-------|------------|-------------|
| **Bajo** | `rpm` | Todas las basadas en RPM |
| **Alto** | `yum` | RHEL/CentOS 7 y anteriores |
| **Alto** | `dnf` | Fedora, RHEL/CentOS 8+ |
| **Alto** | `zypper` | openSUSE/SLES |

---

## 2. RPM - Herramienta de bajo nivel

### Estructura de un paquete .rpm

Nombre de archivo:
```
nombre-version-release.arquitectura.rpm
```

Ejemplo: `nginx-1.20.1-2.el8.x86_64.rpm`
- `nginx` - nombre del paquete
- `1.20.1` - version upstream
- `2.el8` - release (revision 2, para Enterprise Linux 8)
- `x86_64` - arquitectura
- `.rpm` - extension

Arquitecturas comunes: `x86_64`, `i686`, `noarch` (independiente de arquitectura), `aarch64`

### Base de datos RPM

RPM mantiene su base de datos en `/var/lib/rpm/`. Contiene informacion sobre todos los paquetes instalados.

### Instalar paquetes con rpm

```bash
# Instalar un paquete nuevo
rpm -i paquete.rpm
rpm -ivh paquete.rpm    # verbose + barra de progreso

# Actualizar (instala si no existe, actualiza si existe)
rpm -U paquete.rpm
rpm -Uvh paquete.rpm

# Actualizar solo si ya esta instalado (freshen)
rpm -F paquete.rpm
rpm -Fvh paquete.rpm
```

**Opciones comunes de instalacion:**

| Opcion | Descripcion |
|--------|-------------|
| `-i` | Instalar (install) |
| `-U` | Actualizar o instalar (upgrade) |
| `-F` | Actualizar solo si existe (freshen) |
| `-v` | Modo verbose |
| `-h` | Mostrar barra de progreso (hash marks) |
| `--nodeps` | Ignorar dependencias (peligroso) |
| `--force` | Forzar instalacion (peligroso) |
| `--test` | Simulacion (no instala realmente) |

**Diferencia importante entre -i, -U y -F:**
- `rpm -i`: Instala el paquete. Si ya existe, da error.
- `rpm -U`: Instala si no existe; si existe, actualiza. Es la opcion **mas usada**.
- `rpm -F`: Solo actualiza si el paquete ya esta instalado. Si no existe, no hace nada.

### Desinstalar paquetes con rpm

```bash
# Desinstalar un paquete
rpm -e paquete
rpm -e --nodeps paquete    # Sin verificar dependencias (peligroso)
```

**Nota**: rpm no tiene equivalente a "purge" de dpkg. Siempre elimina los archivos de configuracion (aunque puede renombrar los modificados a `.rpmsave`).

### Consultar paquetes con rpm (flag -q)

La opcion `-q` (query) es la base de todas las consultas. Se combina con otros flags:

```bash
# Consultar si un paquete esta instalado
rpm -q nginx

# Listar TODOS los paquetes instalados
rpm -qa
rpm -qa | sort

# Buscar paquetes por patron
rpm -qa 'nginx*'
rpm -qa | grep nginx

# Informacion detallada de un paquete instalado
rpm -qi nginx

# Listar archivos de un paquete instalado
rpm -ql nginx

# Listar archivos de configuracion de un paquete
rpm -qc nginx

# Listar archivos de documentacion de un paquete
rpm -qd nginx

# Buscar a que paquete pertenece un archivo
rpm -qf /usr/sbin/nginx

# Mostrar scripts pre/post instalacion
rpm -q --scripts nginx
```

### Consultar paquetes SIN instalar (flag -p)

Combinando `-q` con `-p` se consulta un archivo `.rpm` sin instalarlo:

```bash
# Informacion de un archivo .rpm
rpm -qpi paquete.rpm

# Listar archivos del .rpm
rpm -qpl paquete.rpm

# Listar archivos de configuracion del .rpm
rpm -qpc paquete.rpm

# Dependencias del .rpm
rpm -qpR paquete.rpm
```

### Verificar paquetes con rpm

```bash
# Verificar integridad de un paquete instalado
rpm -V nginx
rpm --verify nginx

# Verificar todos los paquetes instalados
rpm -Va

# Verificar firma GPG de un archivo .rpm
rpm -K paquete.rpm
rpm --checksig paquete.rpm

# Importar clave GPG
rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-redhat-release
```

**Salida de rpm -V (verificacion):**

Cada caracter indica un tipo de cambio:

| Caracter | Significado |
|----------|-------------|
| `S` | Tamano del archivo cambio (Size) |
| `M` | Permisos o tipo cambio (Mode) |
| `5` | Checksum MD5 cambio |
| `D` | Dispositivo cambio (Device) |
| `L` | Enlace simbolico cambio (Link) |
| `U` | Usuario propietario cambio (User) |
| `G` | Grupo propietario cambio (Group) |
| `T` | Tiempo de modificacion cambio (Time) |
| `.` | Sin cambios |

Ejemplo:
```
S.5....T.  c /etc/nginx/nginx.conf
```
Significa: el tamano (S), checksum (5) y fecha (T) del archivo de configuracion (c) `/etc/nginx/nginx.conf` han cambiado respecto al original.

### Consultar dependencias

```bash
# Dependencias de un paquete instalado
rpm -qR nginx
rpm -q --requires nginx

# Que proporciona (provides) un paquete
rpm -q --provides nginx

# Que paquete proporciona una capacidad
rpm -q --whatprovides "webserver"

# Que paquete requiere una capacidad
rpm -q --whatrequires libssl.so
```

---

## 3. rpm2cpio - Extraer contenido sin instalar

`rpm2cpio` convierte un paquete .rpm al formato cpio, permitiendo extraer su contenido sin instalarlo.

```bash
# Ver contenido de un .rpm
rpm2cpio paquete.rpm | cpio -t

# Extraer contenido en el directorio actual
rpm2cpio paquete.rpm | cpio -idmv

# Extraer un archivo especifico
rpm2cpio paquete.rpm | cpio -idmv ./usr/bin/programa
```

**Uso practico**: Recuperar archivos de un paquete sin tener que instalarlo. Util para rescate o para obtener archivos de configuracion por defecto.

---

## 4. YUM (Yellowdog Updater, Modified)

### Configuracion

Archivo principal: `/etc/yum.conf`

Repositorios: `/etc/yum.repos.d/*.repo`

Ejemplo de archivo `.repo`:
```ini
[base]
name=CentOS Base Repository
baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
```

| Campo | Descripcion |
|-------|-------------|
| `[base]` | Identificador unico del repositorio |
| `name` | Nombre descriptivo |
| `baseurl` | URL del repositorio |
| `mirrorlist` | Alternativa a baseurl (lista de mirrors) |
| `enabled` | 1 = activado, 0 = desactivado |
| `gpgcheck` | 1 = verificar firmas, 0 = no verificar |
| `gpgkey` | Ubicacion de la clave GPG |

### Repositorios comunes

| Repositorio | Descripcion |
|------------|-------------|
| `base` | Paquetes base del sistema |
| `updates` | Actualizaciones de seguridad y correcciones |
| `extras` | Paquetes adicionales |
| `EPEL` | Extra Packages for Enterprise Linux (de Fedora) |
| `centosplus` | Paquetes mejorados por CentOS |

### Comandos YUM

#### Gestion de paquetes

```bash
# Instalar un paquete
yum install nginx

# Instalar sin confirmar
yum install -y nginx

# Desinstalar un paquete
yum remove nginx
yum erase nginx

# Actualizar un paquete especifico
yum update nginx

# Actualizar todos los paquetes
yum update

# Reinstalar un paquete
yum reinstall nginx

# Instalar un archivo .rpm local (resolviendo dependencias)
yum localinstall paquete.rpm
# o en versiones recientes:
yum install paquete.rpm
```

#### Busqueda e informacion

```bash
# Buscar paquetes
yum search nginx
yum search all "web server"

# Informacion detallada
yum info nginx

# Listar paquetes
yum list installed          # Paquetes instalados
yum list available          # Paquetes disponibles
yum list updates            # Paquetes con actualizaciones
yum list all                # Todos los paquetes

# Buscar que paquete proporciona un archivo
yum provides /usr/sbin/nginx
yum provides "*/nginx"

# Listar repositorios
yum repolist
yum repolist all            # Incluye desactivados
```

#### Gestion de grupos de paquetes

```bash
# Listar grupos disponibles
yum grouplist
yum group list

# Instalar un grupo
yum groupinstall "Development Tools"
yum group install "Development Tools"

# Informacion de un grupo
yum groupinfo "Development Tools"

# Desinstalar un grupo
yum groupremove "Development Tools"
```

#### Historial y cache

```bash
# Ver historial de transacciones
yum history
yum history info <id>

# Deshacer una transaccion
yum history undo <id>

# Limpiar cache
yum clean all
yum clean packages
yum clean metadata

# Generar cache
yum makecache
```

---

## 5. DNF (Dandified YUM)

DNF es el sucesor de YUM, usado en Fedora y RHEL/CentOS 8+. La sintaxis es practicamente identica a YUM.

### Diferencias principales con YUM

| Aspecto | YUM | DNF |
|---------|-----|-----|
| Resolucion de deps | Antiguo resolvedor | libsolv (mas rapido y preciso) |
| Rendimiento | Mas lento | Mas rapido |
| API Python | Python 2 | Python 3 |
| Configuracion | `/etc/yum.conf` | `/etc/dnf/dnf.conf` |
| Repos | `/etc/yum.repos.d/` | `/etc/yum.repos.d/` (mismo) |

### Comandos DNF

```bash
# Gestion de paquetes
dnf install nginx              # Instalar un paquete
dnf install -y nginx           # Instalar sin pedir confirmacion
dnf remove nginx               # Desinstalar un paquete
dnf update                     # Actualizar todos los paquetes
dnf update nginx               # Actualizar un paquete especifico
dnf upgrade                    # Equivalente a update (en DNF son sinonimos)

# Busqueda e informacion
dnf search nginx               # Buscar paquetes por nombre/descripcion
dnf info nginx                 # Informacion detallada de un paquete
dnf provides /usr/sbin/nginx   # Buscar que paquete proporciona un archivo
dnf provides "*/nginx.conf"    # Buscar con comodines
dnf list installed             # Listar paquetes instalados
dnf list available             # Listar paquetes disponibles

# Gestion de repositorios
dnf repolist                   # Listar repositorios habilitados
dnf repolist all               # Listar todos los repositorios (incluidos deshabilitados)
dnf config-manager --add-repo URL   # Anadir un nuevo repositorio
dnf config-manager --set-enabled repo_id    # Habilitar un repositorio
dnf config-manager --set-disabled repo_id   # Deshabilitar un repositorio

# Mantenimiento
dnf clean all                  # Limpiar toda la cache
dnf makecache                  # Regenerar la cache
dnf history                    # Ver historial de transacciones
dnf history undo <id>          # Deshacer una transaccion
dnf autoremove                 # Eliminar dependencias huerfanas

# Grupos de paquetes
dnf group install "Development Tools"   # Instalar un grupo de paquetes
dnf group list                          # Listar grupos disponibles
dnf group info "Development Tools"      # Informacion de un grupo
```

La mayor parte de los comandos de YUM funcionan identicamente en DNF. En muchas distribuciones modernas, `yum` es un enlace simbolico a `dnf`.

> **Para el examen:** `dnf config-manager` es una herramienta exclusiva de DNF para gestionar repositorios desde la linea de comandos. En YUM, la gestion de repositorios se hacia editando directamente los archivos `.repo` en `/etc/yum.repos.d/`.

---

## 6. Zypper (SUSE/openSUSE)

Zypper es el gestor de paquetes de alto nivel para distribuciones SUSE.

### Comandos de zypper

```bash
# Actualizar lista de repositorios (descargar metadatos)
zypper refresh
zypper ref

# Instalar un paquete
zypper install nginx
zypper in nginx

# Desinstalar un paquete
zypper remove nginx
zypper rm nginx

# Actualizar todos los paquetes
zypper update
zypper up

# Buscar paquetes
zypper search nginx
zypper se nginx

# Informacion de un paquete
zypper info nginx

# Listar repositorios configurados
zypper repos
zypper lr
zypper lr -d              # Con detalle (URLs)

# Anadir un repositorio
zypper addrepo URL alias
zypper ar URL alias
# Ejemplo: zypper ar http://download.opensuse.org/repo/oss/ repo-oss

# Eliminar un repositorio
zypper removerepo alias
zypper rr alias

# Habilitar/deshabilitar un repositorio
zypper modifyrepo -e alias    # Habilitar
zypper modifyrepo -d alias    # Deshabilitar

# Actualizacion de distribucion (equivalente a dist-upgrade)
zypper dist-upgrade
zypper dup

# Buscar que paquete proporciona un archivo
zypper search --provides /usr/bin/programa

# Limpiar cache
zypper clean
zypper clean --all
```

**Tabla resumen de abreviaturas de zypper:**

| Comando completo | Abreviatura | Funcion |
|-----------------|-------------|---------|
| `zypper install` | `zypper in` | Instalar paquete |
| `zypper remove` | `zypper rm` | Desinstalar paquete |
| `zypper search` | `zypper se` | Buscar paquete |
| `zypper update` | `zypper up` | Actualizar paquetes |
| `zypper refresh` | `zypper ref` | Refrescar repositorios |
| `zypper repos` | `zypper lr` | Listar repositorios |
| `zypper addrepo` | `zypper ar` | Anadir repositorio |
| `zypper removerepo` | `zypper rr` | Eliminar repositorio |

---

## 7. Comparativa entre sistemas de paquetes

### rpm vs dpkg

| Accion | rpm | dpkg |
|--------|-----|------|
| Instalar | `rpm -ivh pkg.rpm` | `dpkg -i pkg.deb` |
| Actualizar | `rpm -Uvh pkg.rpm` | `dpkg -i pkg.deb` |
| Desinstalar | `rpm -e pkg` | `dpkg -r pkg` |
| Purgar | N/A (siempre purga) | `dpkg -P pkg` |
| Listar todos | `rpm -qa` | `dpkg -l` |
| Listar archivos | `rpm -ql pkg` | `dpkg -L pkg` |
| Buscar por archivo | `rpm -qf /ruta` | `dpkg -S /ruta` |
| Info del paquete | `rpm -qi pkg` | `dpkg -s pkg` |
| Verificar | `rpm -V pkg` | `dpkg -V pkg` (limitado) |

### yum/dnf vs apt

| Accion | yum/dnf | apt |
|--------|---------|-----|
| Actualizar listas | (automatico) | `apt update` |
| Instalar | `yum install pkg` | `apt install pkg` |
| Desinstalar | `yum remove pkg` | `apt remove pkg` |
| Actualizar todo | `yum update` | `apt upgrade` |
| Buscar | `yum search texto` | `apt search texto` |
| Info | `yum info pkg` | `apt show pkg` |
| Buscar por archivo | `yum provides /ruta` | `apt-file search /ruta` |
| Limpiar cache | `yum clean all` | `apt clean` |
| Listar repos | `yum repolist` | (ver sources.list) |

---

## Resumen para el examen

1. `rpm -ivh` instala, `rpm -Uvh` actualiza/instala, `rpm -Fvh` solo actualiza si existe, `rpm -e` desinstala.
2. `rpm -q` es la base de consultas: `-qa` (todos), `-ql` (archivos), `-qf` (buscar por archivo), `-qi` (info).
3. `rpm -qp` + flag permite consultar un .rpm sin instalarlo (e.g., `rpm -qpl paquete.rpm`).
4. `rpm -V` verifica integridad; `rpm -K` verifica firma GPG.
5. `rpm2cpio` extrae contenido de un .rpm sin instalarlo.
6. `yum`/`dnf` resuelven dependencias automaticamente; los repos estan en `/etc/yum.repos.d/`.
7. `yum provides` busca que paquete contiene un archivo (equivale a `apt-file search`).
8. `dnf` es el sucesor de `yum` con la misma sintaxis pero mejor rendimiento.
9. `zypper` es la herramienta de SUSE: `zypper in`, `zypper rm`, `zypper se`, `zypper up`.
