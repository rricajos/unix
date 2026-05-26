# 102.4 - Gestion de paquetes Debian: Teoria

## Introduccion

El sistema de paquetes Debian es utilizado por Debian y sus derivados (Ubuntu, Linux Mint, etc.). Se basa en el formato de paquetes `.deb` y utiliza dos capas de herramientas: `dpkg` para la gestion de paquetes individuales y `apt`/`apt-get` para la gestion de repositorios y dependencias.

---

## 1. Arquitectura del sistema de paquetes Debian

### Dos niveles de gestion

```
+--------------------------------------------+
|  apt / apt-get / apt-cache / aptitude      |  <- Nivel alto
|  (gestion de repositorios y dependencias)  |
+--------------------------------------------+
|  dpkg                                       |  <- Nivel bajo
|  (instalacion/desinstalacion de .deb)       |
+--------------------------------------------+
```

| Nivel | Herramienta | Funcion |
|-------|------------|---------|
| **Bajo** | `dpkg` | Instala/desinstala paquetes .deb individuales. No resuelve dependencias |
| **Alto** | `apt` / `apt-get` | Descarga paquetes de repositorios, resuelve dependencias automaticamente |

---

## 2. dpkg - Herramienta de bajo nivel

### Estructura de un paquete .deb

Un archivo `.deb` es un archivo `ar` que contiene:

```
nombre_version_arquitectura.deb
  |
  ├── debian-binary     (version del formato deb)
  ├── control.tar.gz    (metadatos: dependencias, descripcion, scripts)
  └── data.tar.gz       (archivos a instalar en el sistema)
```

Ejemplo de nombre: `nginx_1.18.0-1_amd64.deb`
- `nginx` - nombre del paquete
- `1.18.0-1` - version (upstream-debian_revision)
- `amd64` - arquitectura

### Base de datos de dpkg

`dpkg` mantiene su base de datos en `/var/lib/dpkg/`:
- `status` - estado de todos los paquetes conocidos
- `available` - lista de paquetes disponibles
- `info/` - scripts y archivos de control de cada paquete

### Instalar paquetes con dpkg

```bash
# Instalar un paquete .deb
dpkg -i paquete.deb
dpkg --install paquete.deb

# Instalar multiples paquetes
dpkg -i paquete1.deb paquete2.deb
```

**Importante**: Si faltan dependencias, dpkg mostrara un error pero dejara el paquete en estado "parcialmente instalado". Se puede resolver con:

```bash
apt-get install -f    # Instala las dependencias faltantes
# o
apt --fix-broken install
```

### Desinstalar paquetes con dpkg

```bash
# Desinstalar (mantiene archivos de configuracion)
dpkg -r paquete
dpkg --remove paquete

# Purgar (elimina TODO: programa + configuracion)
dpkg -P paquete
dpkg --purge paquete
```

**Diferencia clave**:
- `dpkg -r` (remove): Elimina los archivos del programa pero **conserva** los archivos de configuracion
- `dpkg -P` (purge): Elimina **todo**, incluyendo los archivos de configuracion

### Consultar paquetes con dpkg

```bash
# Listar todos los paquetes instalados
dpkg -l
dpkg --list

# Buscar un paquete especifico
dpkg -l nginx
dpkg -l 'lib*'    # Soporta comodines

# Listar archivos instalados por un paquete
dpkg -L nginx
dpkg --listfiles nginx

# Buscar que paquete instalo un archivo
dpkg -S /usr/bin/ssh
dpkg --search /usr/bin/ssh

# Mostrar informacion de un paquete instalado
dpkg -s nginx
dpkg --status nginx

# Mostrar informacion de un archivo .deb (sin instalar)
dpkg -I paquete.deb
dpkg --info paquete.deb

# Listar contenido de un archivo .deb (sin instalar)
dpkg -c paquete.deb
dpkg --contents paquete.deb
```

### Estados de los paquetes (dpkg -l)

La salida de `dpkg -l` muestra dos letras de estado:

```
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
```

| Codigo | Significado |
|--------|-------------|
| `ii` | Instalado correctamente |
| `rc` | Eliminado, archivos de configuracion presentes |
| `un` | Desconocido, no instalado |
| `iU` | Instalado, pendiente de desempaquetar |
| `iF` | Instalado, configuracion fallida |
| `hi` | Instalado con "hold" (retenido, no se actualiza) |

### Reparar paquetes con dpkg

```bash
# Configurar paquetes pendientes
dpkg --configure -a

# Reconfigurar un paquete ya instalado (ejecutar scripts postinstall)
dpkg-reconfigure paquete

# Ejemplo comun: reconfigurar zona horaria
dpkg-reconfigure tzdata

# Reconfigurar las locales
dpkg-reconfigure locales
```

---

## 3. APT - Herramientas de alto nivel

### apt vs apt-get vs apt-cache

| Herramienta | Uso | Notas |
|-------------|-----|-------|
| `apt` | Herramienta moderna y unificada | Combina funcionalidades de apt-get y apt-cache. Salida mas amigable |
| `apt-get` | Herramienta clasica de gestion | Mas adecuada para scripts (salida estable) |
| `apt-cache` | Consultas sobre la cache de paquetes | Busqueda e informacion de paquetes |

### Actualizar la lista de paquetes

```bash
# Descargar la lista actualizada de paquetes de los repositorios
apt update
apt-get update
```

**Nota**: `apt update` NO instala ni actualiza paquetes. Solo descarga la informacion actualizada de que paquetes estan disponibles.

### Actualizar paquetes instalados

```bash
# Actualizar paquetes (no elimina paquetes ni instala nuevos)
apt upgrade
apt-get upgrade

# Actualizacion completa (puede eliminar paquetes obsoletos e instalar nuevos)
apt full-upgrade
apt-get dist-upgrade
```

**Diferencia clave**:
- `upgrade`: Actualiza paquetes existentes sin eliminar ninguno. Si una actualizacion requiere eliminar otro paquete, la omite.
- `full-upgrade` / `dist-upgrade`: Actualizacion mas agresiva. Puede eliminar paquetes si es necesario para resolver dependencias.

### Instalar paquetes

```bash
# Instalar un paquete
apt install nginx
apt-get install nginx

# Instalar una version especifica
apt install nginx=1.18.0-1

# Instalar sin confirmar (auto-yes)
apt install -y nginx

# Instalar un archivo .deb local (resolviendo dependencias)
apt install ./paquete.deb

# Reinstalar un paquete
apt install --reinstall nginx
apt-get install --reinstall nginx
```

### Desinstalar paquetes

```bash
# Desinstalar (mantiene configuracion)
apt remove nginx
apt-get remove nginx

# Purgar (elimina todo incluyendo configuracion)
apt purge nginx
apt-get purge nginx

# Eliminar dependencias huerfanas (ya no necesarias)
apt autoremove
apt-get autoremove
```

### Buscar paquetes

```bash
# Buscar paquetes por nombre o descripcion
apt search nginx
apt-cache search nginx

# Busqueda solo en nombres de paquetes
apt-cache search --names-only nginx

# Mostrar informacion detallada de un paquete
apt show nginx
apt-cache show nginx

# Mostrar informacion breve (politica de versiones)
apt-cache policy nginx

# Mostrar dependencias de un paquete
apt-cache depends nginx

# Mostrar que paquetes dependen de este (dependencias inversas)
apt-cache rdepends nginx
```

### Limpiar cache

```bash
# Eliminar paquetes .deb descargados en cache
apt clean
apt-get clean

# Eliminar solo paquetes obsoletos de la cache
apt autoclean
apt-get autoclean
```

La cache de paquetes descargados se almacena en `/var/cache/apt/archives/`.

---

## 4. Repositorios - sources.list

### /etc/apt/sources.list

Archivo principal que define los repositorios de paquetes.

#### Formato de una linea

```
tipo_paquete  URI  distribucion  componentes
```

Ejemplo:
```
deb http://archive.ubuntu.com/ubuntu jammy main restricted universe multiverse
deb-src http://archive.ubuntu.com/ubuntu jammy main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu jammy-updates main restricted universe multiverse
deb http://security.ubuntu.com/ubuntu jammy-security main restricted universe multiverse
```

| Campo | Descripcion | Ejemplo |
|-------|-------------|---------|
| `deb` | Paquetes binarios | `deb` |
| `deb-src` | Codigo fuente | `deb-src` |
| URI | Direccion del repositorio | `http://archive.ubuntu.com/ubuntu` |
| Distribucion | Nombre de la release | `jammy`, `bookworm`, `stable` |
| Componentes | Secciones del repositorio | `main`, `restricted`, `universe` |

### Componentes del repositorio (Ubuntu)

| Componente | Descripcion |
|-----------|-------------|
| `main` | Software libre soportado oficialmente |
| `restricted` | Controladores propietarios soportados |
| `universe` | Software libre mantenido por la comunidad |
| `multiverse` | Software no libre (propietario) |

### Componentes del repositorio (Debian)

| Componente | Descripcion |
|-----------|-------------|
| `main` | Software que cumple las DFSG (totalmente libre) |
| `contrib` | Software libre que depende de software no libre |
| `non-free` | Software propietario |

### /etc/apt/sources.list.d/

Directorio para archivos de repositorios adicionales (terceros). Cada archivo tiene extension `.list` o `.sources`.

```bash
# Ejemplo: /etc/apt/sources.list.d/docker.list
deb https://download.docker.com/linux/ubuntu jammy stable
```

---

## 5. apt-file - Buscar archivos en paquetes

`apt-file` permite buscar que paquete contiene un archivo especifico, **incluso si el paquete no esta instalado**.

### Instalacion y uso

```bash
# Instalar apt-file
apt install apt-file

# Actualizar la base de datos de apt-file
apt-file update

# Buscar que paquete contiene un archivo
apt-file search /usr/bin/htop

# Listar archivos de un paquete (sin necesidad de tenerlo instalado)
apt-file list nginx
```

### Diferencia con dpkg -S

| Comando | Busca en | Requisito |
|---------|----------|-----------|
| `dpkg -S <archivo>` | Paquetes **instalados** | Paquete debe estar instalado |
| `apt-file search <archivo>` | **Todos** los paquetes (repositorios) | Base de datos de apt-file actualizada |

---

## 6. dpkg-reconfigure

Permite reconfigurar un paquete ya instalado ejecutando sus scripts de configuracion post-instalacion.

```bash
# Reconfigurar la zona horaria
dpkg-reconfigure tzdata

# Reconfigurar las locales del sistema
dpkg-reconfigure locales

# Reconfigurar el teclado
dpkg-reconfigure keyboard-configuration

# Reconfigurar en modo no interactivo (usar respuestas por defecto)
dpkg-reconfigure -f noninteractive paquete
```

**Uso principal**: Cuando un paquete necesita ser reconfigurado despues de la instalacion (por ejemplo, cambiar la zona horaria, las locales o los parametros de un servicio).

---

## 7. Gestion de claves GPG de repositorios

Los repositorios se firman con claves GPG para verificar la autenticidad de los paquetes.

```bash
# Anadir clave GPG de un repositorio (metodo clasico, obsoleto)
apt-key add clave.gpg

# Metodo moderno: almacenar en /etc/apt/trusted.gpg.d/
curl -fsSL https://ejemplo.com/clave.gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/ejemplo.gpg

# Listar claves instaladas
apt-key list
```

---

## Resumen para el examen

1. **dpkg** es de bajo nivel (no resuelve dependencias); **apt** es de alto nivel (resuelve dependencias).
2. `dpkg -i` instala, `dpkg -r` desinstala (conserva config), `dpkg -P` purga (elimina todo).
3. `dpkg -l` lista paquetes, `dpkg -L` lista archivos de un paquete, `dpkg -S` busca que paquete tiene un archivo.
4. `apt update` actualiza la lista; `apt upgrade` actualiza paquetes; `apt full-upgrade` actualizacion agresiva.
5. `apt remove` mantiene config; `apt purge` elimina todo.
6. `/etc/apt/sources.list` define repositorios; `/etc/apt/sources.list.d/` para repos adicionales.
7. `apt-file search` busca archivos en **todos** los paquetes (instalados o no); `dpkg -S` solo en instalados.
8. `dpkg-reconfigure` re-ejecuta la configuracion post-instalacion de un paquete.
9. `dpkg --configure -a` intenta configurar paquetes que quedaron en estado roto.
