---
title: "206.1 - Compilar e instalar desde fuentes"
tags: [lpic-2, examen-201, tema-206, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.1"
---

# 206.1 - Comandos clave: Compilar e instalar desde fuentes

## Proceso de compilacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `./configure` | Detecta el sistema y genera el Makefile | `./configure --prefix=/usr/local` |
| `./configure --help` | Muestra todas las opciones disponibles | `./configure --help \| less` |
| `./configure --prefix=DIR` | Define directorio base de instalacion | `./configure --prefix=/opt/app` |
| `./configure --with-PKG` | Habilita soporte para un paquete | `./configure --with-ssl=/usr/lib/ssl` |
| `./configure --without-PKG` | Deshabilita soporte para un paquete | `./configure --without-readline` |
| `./configure --enable-FEAT` | Activa una caracteristica | `./configure --enable-shared` |
| `./configure --disable-FEAT` | Desactiva una caracteristica | `./configure --disable-ipv6` |
| `make` | Compila el software segun el Makefile | `make` |
| `make -j N` | Compila en paralelo con N procesos | `make -j$(nproc)` |
| `make install` | Instala el software compilado | `sudo make install` |
| `make clean` | Elimina archivos objeto compilados | `make clean` |
| `make distclean` | Limpieza completa (incluye archivos de configure) | `make distclean` |
| `make uninstall` | Desinstala (si el Makefile lo soporta) | `sudo make uninstall` |
| `make check` / `make test` | Ejecuta las pruebas del proyecto | `make check` |

## Autotools

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `autoconf` | Genera `configure` desde `configure.ac` | `autoconf` |
| `automake` | Genera `Makefile.in` desde `Makefile.am` | `automake --add-missing` |
| `aclocal` | Genera macros m4 para autoconf | `aclocal` |
| `autoreconf -i` | Regenera todos los archivos autotools | `autoreconf -i` |

## CMake

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `cmake ..` | Genera Makefiles desde CMakeLists.txt | `mkdir build && cd build && cmake ..` |
| `cmake -DCMAKE_INSTALL_PREFIX=DIR` | Define directorio de instalacion | `cmake -DCMAKE_INSTALL_PREFIX=/usr ..` |
| `cmake -DCMAKE_BUILD_TYPE=TYPE` | Tipo de compilacion (Release/Debug) | `cmake -DCMAKE_BUILD_TYPE=Release ..` |
| `cmake -LH ..` | Lista opciones configurables del proyecto | `cmake -LH ..` |

## Gestion de bibliotecas compartidas

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `ldconfig` | Actualiza cache del enlazador dinamico | `sudo ldconfig` |
| `ldconfig -p` | Muestra la cache de bibliotecas actual | `ldconfig -p \| grep libssl` |
| `ldd BINARIO` | Muestra bibliotecas compartidas de un binario | `ldd /usr/bin/ssh` |
| `LD_LIBRARY_PATH` | Variable para rutas temporales de bibliotecas | `export LD_LIBRARY_PATH=/opt/lib` |

## pkg-config

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `pkg-config --cflags PKG` | Muestra flags de compilacion | `pkg-config --cflags openssl` |
| `pkg-config --libs PKG` | Muestra flags de enlazado | `pkg-config --libs openssl` |
| `pkg-config --modversion PKG` | Muestra version del paquete | `pkg-config --modversion libpng` |
| `pkg-config --list-all` | Lista todos los paquetes disponibles | `pkg-config --list-all` |
| `pkg-config --exists PKG` | Verifica si un paquete existe | `pkg-config --exists libxml-2.0` |
| `PKG_CONFIG_PATH` | Variable para rutas adicionales de archivos .pc | `export PKG_CONFIG_PATH=/opt/lib/pkgconfig` |

## Archivos y directorios importantes

| Ruta | Descripcion |
|------|-------------|
| `/etc/ld.so.conf` | Configuracion de directorios de bibliotecas |
| `/etc/ld.so.conf.d/` | Directorio para archivos de configuracion adicionales |
| `/etc/ld.so.cache` | Cache binario generado por ldconfig |
| `/usr/local/` | Directorio por defecto para software compilado |
| `/usr/lib/pkgconfig/` | Archivos .pc de pkg-config |
| `configure.ac` | Archivo fuente para autoconf |
| `Makefile.am` | Archivo fuente para automake |
| `Makefile.in` | Plantilla de Makefile generada por automake |
| `CMakeLists.txt` | Archivo de configuracion de CMake |
