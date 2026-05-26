---
title: "102.4 - Gestion de paquetes Debian: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.4"
---

# 102.4 - Gestion de paquetes Debian: Comandos clave

## dpkg - Gestion de paquetes de bajo nivel

### Instalacion y desinstalacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `dpkg -i <paquete.deb>` | Instalar paquete | `dpkg -i nginx_1.18.0_amd64.deb` |
| `dpkg -r <paquete>` | Desinstalar (conserva config) | `dpkg -r nginx` |
| `dpkg -P <paquete>` | Purgar (elimina todo) | `dpkg -P nginx` |
| `dpkg --configure -a` | Configurar paquetes pendientes | `dpkg --configure -a` |
| `dpkg-reconfigure <paq>` | Reconfigurar paquete instalado | `dpkg-reconfigure tzdata` |

### Consultas

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `dpkg -l` | Listar todos los paquetes | `dpkg -l` |
| `dpkg -l <patron>` | Buscar paquetes por patron | `dpkg -l 'nginx*'` |
| `dpkg -L <paquete>` | Listar archivos de un paquete instalado | `dpkg -L nginx` |
| `dpkg -S <archivo>` | Buscar que paquete instalo un archivo | `dpkg -S /usr/bin/ssh` |
| `dpkg -s <paquete>` | Estado e info de un paquete instalado | `dpkg -s nginx` |
| `dpkg -I <paquete.deb>` | Info de un archivo .deb | `dpkg -I nginx.deb` |
| `dpkg -c <paquete.deb>` | Listar contenido de un .deb | `dpkg -c nginx.deb` |

### Estados de paquetes (dpkg -l)

| Codigo | Estado deseado | Estado actual | Significado |
|--------|---------------|---------------|-------------|
| `ii` | Install | Installed | Instalado correctamente |
| `rc` | Remove | Config-files | Eliminado, quedan configs |
| `un` | Unknown | Not-installed | No instalado |
| `hi` | Hold | Installed | Retenido (no se actualiza) |
| `iU` | Install | Unpacked | Desempaquetado, sin configurar |
| `iF` | Install | halF-configured | Configuracion fallida |

## apt - Herramienta de alto nivel (moderna)

### Actualizacion

| Comando | Descripcion |
|---------|-------------|
| `apt update` | Actualizar lista de paquetes disponibles |
| `apt upgrade` | Actualizar paquetes instalados (seguro) |
| `apt full-upgrade` | Actualizacion completa (puede eliminar paquetes) |

### Instalacion y desinstalacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `apt install <paq>` | Instalar paquete | `apt install nginx` |
| `apt install <paq>=<ver>` | Instalar version especifica | `apt install nginx=1.18.0-1` |
| `apt install -y <paq>` | Instalar sin confirmar | `apt install -y nginx` |
| `apt install ./<archivo.deb>` | Instalar .deb local con deps | `apt install ./paquete.deb` |
| `apt install --reinstall <paq>` | Reinstalar paquete | `apt install --reinstall nginx` |
| `apt remove <paq>` | Desinstalar (conserva config) | `apt remove nginx` |
| `apt purge <paq>` | Purgar (elimina todo) | `apt purge nginx` |
| `apt autoremove` | Eliminar dependencias huerfanas | `apt autoremove` |
| `apt --fix-broken install` | Reparar dependencias rotas | `apt --fix-broken install` |

### Busqueda e informacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `apt search <texto>` | Buscar paquetes | `apt search nginx` |
| `apt show <paq>` | Info detallada de un paquete | `apt show nginx` |
| `apt list --installed` | Listar paquetes instalados | `apt list --installed` |
| `apt list --upgradable` | Listar paquetes actualizables | `apt list --upgradable` |

### Limpieza

| Comando | Descripcion |
|---------|-------------|
| `apt clean` | Eliminar toda la cache de .deb descargados |
| `apt autoclean` | Eliminar solo .deb obsoletos de cache |

## apt-get - Herramienta clasica

| apt | apt-get equivalente |
|-----|-------------------|
| `apt update` | `apt-get update` |
| `apt upgrade` | `apt-get upgrade` |
| `apt full-upgrade` | `apt-get dist-upgrade` |
| `apt install` | `apt-get install` |
| `apt remove` | `apt-get remove` |
| `apt purge` | `apt-get purge` |
| `apt autoremove` | `apt-get autoremove` |
| `apt install -f` | `apt-get install -f` |

## apt-cache - Consultas de cache

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `apt-cache search <texto>` | Buscar paquetes en cache | `apt-cache search web server` |
| `apt-cache search --names-only <texto>` | Buscar solo en nombres | `apt-cache search --names-only nginx` |
| `apt-cache show <paq>` | Info completa de un paquete | `apt-cache show nginx` |
| `apt-cache policy <paq>` | Version y repositorio de origen | `apt-cache policy nginx` |
| `apt-cache depends <paq>` | Dependencias del paquete | `apt-cache depends nginx` |
| `apt-cache rdepends <paq>` | Dependencias inversas | `apt-cache rdepends nginx` |
| `apt-cache showpkg <paq>` | Info de dependencias extendida | `apt-cache showpkg nginx` |

## apt-file - Buscar archivos en repositorios

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `apt-file update` | Actualizar base de datos | `apt-file update` |
| `apt-file search <archivo>` | Buscar que paquete contiene un archivo | `apt-file search /usr/bin/htop` |
| `apt-file list <paq>` | Listar archivos de un paquete | `apt-file list nginx` |

### Comparacion: dpkg -S vs apt-file search

| Comando | Busca en | Paquete debe estar instalado? |
|---------|----------|-------------------------------|
| `dpkg -S <archivo>` | Paquetes instalados | Si |
| `apt-file search <archivo>` | Todos los repositorios | No |

## Archivos de configuracion de repositorios

| Archivo | Funcion |
|---------|---------|
| `/etc/apt/sources.list` | Repositorios principales |
| `/etc/apt/sources.list.d/` | Repositorios adicionales (archivos .list) |
| `/var/cache/apt/archives/` | Cache de paquetes .deb descargados |
| `/var/lib/apt/lists/` | Listas de paquetes descargadas |
| `/var/lib/dpkg/status` | Base de datos de estado de dpkg |

### Formato de sources.list

```
deb     http://archive.ubuntu.com/ubuntu  jammy  main restricted universe multiverse
deb-src http://archive.ubuntu.com/ubuntu  jammy  main restricted universe multiverse
```

| Campo | Significado |
|-------|-------------|
| `deb` | Paquetes binarios |
| `deb-src` | Codigo fuente |
| URL | Direccion del repositorio |
| Distribucion | Release (jammy, bookworm, etc.) |
| Componentes | Secciones (main, universe, etc.) |

## Componentes de repositorios

### Ubuntu

| Componente | Contenido |
|-----------|-----------|
| `main` | Software libre soportado oficialmente |
| `restricted` | Controladores propietarios soportados |
| `universe` | Software libre de la comunidad |
| `multiverse` | Software no libre |

### Debian

| Componente | Contenido |
|-----------|-----------|
| `main` | Software libre (DFSG) |
| `contrib` | Software libre con dependencias no libres |
| `non-free` | Software propietario |
