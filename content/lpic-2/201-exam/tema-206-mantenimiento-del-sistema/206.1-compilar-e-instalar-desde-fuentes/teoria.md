---
title: "206.1 - Compilar e instalar desde fuentes"
tags: [lpic-2, examen-201, tema-206, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.1"
---

# 206.1 - Compilar e instalar desde fuentes

## Introduccion

En el mundo Linux, aunque los gestores de paquetes facilitan la instalacion de software, existen situaciones en las que es necesario compilar programas directamente desde el codigo fuente. Esto puede deberse a la necesidad de una version especifica, opciones de compilacion personalizadas, o simplemente porque el software no esta disponible en los repositorios oficiales.

Este subtema tiene un **peso de 2** en el examen LPIC-2 201 y cubre el proceso completo de compilacion, desde la obtencion del codigo fuente hasta la instalacion y gestion de bibliotecas compartidas.

## El proceso clasico de compilacion: configure, make, make install

### Obtencion del codigo fuente

El codigo fuente generalmente se distribuye en archivos comprimidos (tarballs):

```bash
# Descargar el codigo fuente
wget https://example.com/software-1.0.tar.gz

# Descomprimir
tar xzf software-1.0.tar.gz
cd software-1.0/
```

### El script ./configure

El script `configure` es generado por **autoconf** y se encarga de:

- Detectar el sistema operativo y la arquitectura
- Verificar que las dependencias necesarias estan instaladas
- Comprobar la presencia de compiladores y herramientas
- Generar el `Makefile` adaptado al sistema

```bash
# Ejecucion basica
./configure

# Ver todas las opciones disponibles
./configure --help
```

#### Opciones principales de configure

| Opcion | Descripcion |
|--------|-------------|
| `--prefix=DIR` | Directorio base de instalacion (por defecto `/usr/local`) |
| `--bindir=DIR` | Directorio para ejecutables |
| `--sysconfdir=DIR` | Directorio para archivos de configuracion |
| `--with-PAQUETE` | Habilitar soporte para un paquete externo |
| `--without-PAQUETE` | Deshabilitar soporte para un paquete externo |
| `--enable-FEATURE` | Activar una caracteristica opcional |
| `--disable-FEATURE` | Desactivar una caracteristica |
| `--host=TIPO` | Compilacion cruzada para otra arquitectura |

```bash
# Ejemplo: instalar en /opt con soporte SSL y sin soporte IPv6
./configure --prefix=/opt/mi-software \
            --with-ssl=/usr/lib/ssl \
            --disable-ipv6 \
            --enable-shared

# Ejemplo: compilacion para instalacion en el directorio home
./configure --prefix=$HOME/local
```

> **Para el examen:** Recuerda que `--prefix` cambia el directorio base. Con `--prefix=/usr`, los binarios iran a `/usr/bin`, las librerias a `/usr/lib`, etc. El valor por defecto es `/usr/local`.

## El sistema Makefile

### Estructura de un Makefile

Un `Makefile` contiene reglas que definen como compilar el software:

```makefile
# Variables
CC = gcc
CFLAGS = -Wall -O2
PREFIX = /usr/local

# Regla principal
all: programa

# Compilacion
programa: main.o utils.o
	$(CC) $(CFLAGS) -o programa main.o utils.o

main.o: main.c
	$(CC) $(CFLAGS) -c main.c

utils.o: utils.c
	$(CC) $(CFLAGS) -c utils.c

# Instalacion
install: programa
	install -m 755 programa $(PREFIX)/bin/

# Limpieza
clean:
	rm -f *.o programa
```

### Comandos make principales

```bash
# Compilar el software
make

# Compilar usando multiples nucleos (j = numero de nucleos)
make -j$(nproc)

# Instalar (generalmente requiere root)
sudo make install

# Limpiar archivos compilados
make clean

# Limpiar todo incluyendo archivos generados por configure
make distclean

# Desinstalar (si el Makefile lo soporta)
sudo make uninstall
```

> **Para el examen:** El comando `make` sin argumentos ejecuta la primera regla del Makefile (generalmente `all`). La opcion `-j` permite compilacion en paralelo.

## Herramientas Autotools

Las **autotools** son un conjunto de herramientas GNU que automatizan la generacion de scripts de configuracion:

### Componentes principales

- **autoconf**: Genera el script `configure` a partir de `configure.ac` (o `configure.in`)
- **automake**: Genera `Makefile.in` a partir de `Makefile.am`
- **libtool**: Facilita la creacion de bibliotecas compartidas portables
- **aclocal**: Genera macros m4 necesarias para autoconf

### Flujo de trabajo de autotools

```
configure.ac  -->  autoconf  -->  configure
Makefile.am   -->  automake  -->  Makefile.in
                                       |
configure + Makefile.in  -->  Makefile
```

```bash
# Regenerar los scripts de configuracion (si se modifico configure.ac)
aclocal
autoheader
automake --add-missing
autoconf

# O usar el script de conveniencia
autoreconf -i
```

> **Para el examen:** Conoce la relacion entre `configure.ac` y `configure`, y entre `Makefile.am` y `Makefile.in`. El script `autoreconf -i` regenera todos los archivos necesarios.

## CMake

**CMake** es un sistema de compilacion alternativo a autotools, cada vez mas popular:

```bash
# Proceso tipico con CMake
mkdir build && cd build
cmake ..
make
sudo make install
```

### Opciones de CMake

```bash
# Especificar directorio de instalacion
cmake -DCMAKE_INSTALL_PREFIX=/usr/local ..

# Tipo de compilacion
cmake -DCMAKE_BUILD_TYPE=Release ..

# Habilitar/deshabilitar opciones
cmake -DENABLE_TESTS=ON -DWITH_SSL=ON ..

# Ver opciones disponibles del proyecto
cmake -LH ..
```

El archivo de configuracion de CMake se llama `CMakeLists.txt` y se encuentra en la raiz del proyecto.

## Gestion de bibliotecas compartidas

### Tipos de bibliotecas

- **Estaticas** (`.a`): Se integran en el binario durante la compilacion
- **Compartidas/Dinamicas** (`.so`): Se cargan en tiempo de ejecucion

```bash
# Ver las bibliotecas compartidas que necesita un binario
ldd /usr/bin/programa

# Ejemplo de salida
#   linux-vdso.so.1 (0x00007ffd...)
#   libssl.so.1.1 => /usr/lib/x86_64-linux-gnu/libssl.so.1.1
#   libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6
```

### ldconfig y /etc/ld.so.conf

El enlazador dinamico busca bibliotecas en directorios definidos en `/etc/ld.so.conf` y sus archivos incluidos en `/etc/ld.so.conf.d/`.

```bash
# Contenido tipico de /etc/ld.so.conf
include /etc/ld.so.conf.d/*.conf

# Agregar un nuevo directorio de bibliotecas
echo "/opt/mi-software/lib" | sudo tee /etc/ld.so.conf.d/mi-software.conf

# Actualizar la cache del enlazador dinamico
sudo ldconfig

# Ver la cache actual
ldconfig -p

# Verificar una biblioteca especifica
ldconfig -p | grep libssl
```

### Variables de entorno para bibliotecas

```bash
# Agregar temporalmente un directorio de busqueda de bibliotecas
export LD_LIBRARY_PATH=/opt/mi-software/lib:$LD_LIBRARY_PATH

# Variable para tiempo de compilacion
export LIBRARY_PATH=/opt/mi-software/lib

# Variable para busqueda de cabeceras
export C_INCLUDE_PATH=/opt/mi-software/include
```

> **Para el examen:** `ldconfig` actualiza el cache `/etc/ld.so.cache`. Siempre ejecutar `ldconfig` despues de instalar nuevas bibliotecas compartidas. `LD_LIBRARY_PATH` es temporal; `/etc/ld.so.conf.d/` es la solucion permanente.

## pkg-config

**pkg-config** ayuda a obtener informacion sobre bibliotecas instaladas, facilitando la compilacion:

```bash
# Ver flags de compilacion para una biblioteca
pkg-config --cflags openssl
# Salida: -I/usr/include/openssl

# Ver flags de enlazado
pkg-config --libs openssl
# Salida: -lssl -lcrypto

# Ver ambos
pkg-config --cflags --libs libpng

# Verificar si una biblioteca esta disponible
pkg-config --exists libxml-2.0 && echo "Disponible"

# Ver la version de una biblioteca
pkg-config --modversion openssl

# Listar todos los paquetes disponibles
pkg-config --list-all
```

Los archivos `.pc` de pkg-config se encuentran normalmente en `/usr/lib/pkgconfig/` o `/usr/lib64/pkgconfig/`.

```bash
# Agregar una ruta adicional para archivos .pc
export PKG_CONFIG_PATH=/opt/mi-software/lib/pkgconfig:$PKG_CONFIG_PATH
```

### Uso en compilacion

```bash
# Compilar un programa usando pkg-config
gcc -o programa programa.c $(pkg-config --cflags --libs libcurl)
```

> **Para el examen:** `pkg-config` es fundamental para resolver dependencias durante la compilacion. Recuerda la variable `PKG_CONFIG_PATH` para agregar rutas personalizadas.

## Ejemplo completo de compilacion

```bash
# 1. Descargar y descomprimir
wget https://example.com/software-2.0.tar.gz
tar xzf software-2.0.tar.gz
cd software-2.0

# 2. Revisar documentacion
cat README
cat INSTALL

# 3. Configurar
./configure --prefix=/usr/local \
            --enable-shared \
            --with-ssl

# 4. Compilar
make -j$(nproc)

# 5. Ejecutar tests (opcional pero recomendado)
make check

# 6. Instalar
sudo make install

# 7. Actualizar cache de bibliotecas
sudo ldconfig

# 8. Verificar instalacion
which software
software --version
ldd $(which software)
```

## Resolucion de problemas comunes

| Problema | Causa probable | Solucion |
|----------|---------------|----------|
| `configure: error: C compiler cannot create executables` | Falta compilador | Instalar `build-essential` o `gcc` |
| `configure: error: Package requirements not met` | Falta dependencia | Instalar paquete `-dev` o `-devel` correspondiente |
| `error while loading shared libraries` | Biblioteca no encontrada | Ejecutar `ldconfig` o configurar `LD_LIBRARY_PATH` |
| `No rule to make target` | Makefile incorrecto | Ejecutar `make clean` y volver a configurar |
| `Permission denied during install` | Falta permisos | Usar `sudo make install` |

## Buenas practicas

- **Siempre leer** los archivos `README`, `INSTALL` y `CHANGELOG` antes de compilar
- **Usar `--prefix`** para mantener el software compilado separado del sistema
- **Crear paquetes** con `checkinstall` en lugar de `make install` cuando sea posible
- **Documentar** las opciones de configure utilizadas para futuras recompilaciones
- **Verificar** con `make check` o `make test` antes de instalar
