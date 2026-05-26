---
title: "206.1 - Compilar e instalar desde fuentes"
tags: [lpic-2, examen-201, tema-206, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.1"
---

# 206.1 - Ejercicios: Compilar e instalar desde fuentes

## Pregunta 1

¿Cual es el directorio de instalacion por defecto cuando se ejecuta `./configure` sin la opcion `--prefix`?

a) `/usr`
b) `/opt`
c) `/usr/local`
d) `/usr/share`

<details><summary>Respuesta</summary>

**c) `/usr/local`**

El directorio por defecto para la instalacion de software compilado desde fuentes es `/usr/local`. Este directorio esta reservado para software que el administrador instala manualmente, separandolo del software gestionado por el sistema de paquetes.

</details>

## Pregunta 2

¿Que comando se utiliza para regenerar todos los archivos de autotools de una sola vez?

a) `autoconf --regenerate`
b) `autoreconf -i`
c) `automake --rebuild-all`
d) `aclocal --force`

<details><summary>Respuesta</summary>

**b) `autoreconf -i`**

El comando `autoreconf -i` ejecuta automaticamente `aclocal`, `autoheader`, `automake --add-missing` y `autoconf` en el orden correcto, regenerando todos los archivos necesarios del sistema autotools.

</details>

## Pregunta 3

¿Que archivo genera `autoconf` a partir de `configure.ac`?

a) `Makefile`
b) `Makefile.in`
c) `configure`
d) `config.h`

<details><summary>Respuesta</summary>

**c) `configure`**

`autoconf` lee el archivo `configure.ac` (o el antiguo `configure.in`) y genera el script `configure`. Este script es el que se ejecuta para detectar las caracteristicas del sistema y generar el `Makefile` final.

</details>

## Pregunta 4

Despues de instalar una nueva biblioteca compartida en `/opt/custom/lib`, ¿cual es la forma correcta y permanente de hacerla accesible al sistema?

a) Establecer `LD_LIBRARY_PATH=/opt/custom/lib` en `/etc/profile`
b) Crear un archivo en `/etc/ld.so.conf.d/` con la ruta y ejecutar `ldconfig`
c) Copiar la biblioteca a `/usr/lib` manualmente
d) Ejecutar `ldconfig /opt/custom/lib` sin configuracion adicional

<details><summary>Respuesta</summary>

**b) Crear un archivo en `/etc/ld.so.conf.d/` con la ruta y ejecutar `ldconfig`**

La forma correcta y permanente es crear un archivo `.conf` en `/etc/ld.so.conf.d/` que contenga la ruta `/opt/custom/lib` y luego ejecutar `sudo ldconfig` para actualizar la cache. La opcion a) funciona pero no es la solucion recomendada.

</details>

## Pregunta 5

¿Que comando muestra las bibliotecas compartidas que necesita un binario?

a) `ldconfig -p`
b) `pkg-config --libs`
c) `ldd`
d) `objdump -d`

<details><summary>Respuesta</summary>

**c) `ldd`**

El comando `ldd` muestra todas las bibliotecas compartidas (shared libraries) que un binario ejecutable necesita en tiempo de ejecucion, junto con las rutas donde se encuentran. Por ejemplo: `ldd /usr/bin/ssh`.

</details>

## Pregunta 6

¿Que opcion de `./configure` se utiliza para habilitar el soporte de un paquete externo como OpenSSL?

a) `--enable-ssl`
b) `--with-ssl`
c) `--add-ssl`
d) `--include-ssl`

<details><summary>Respuesta</summary>

**b) `--with-ssl`**

Las opciones `--with-PAQUETE` se usan para habilitar soporte para paquetes externos. Las opciones `--enable-FEATURE` se usan para activar caracteristicas internas del software. Aunque ambas pueden parecer similares, `--with` hace referencia a dependencias externas y `--enable` a funcionalidades internas.

</details>

## Pregunta 7

En un proyecto que utiliza CMake, ¿cual es el procedimiento correcto de compilacion?

a) `cmake . && make && make install`
b) `mkdir build && cd build && cmake .. && make`
c) `cmake --build && cmake --install`
d) `cmake configure && cmake make`

<details><summary>Respuesta</summary>

**b) `mkdir build && cd build && cmake .. && make`**

La practica recomendada con CMake es crear un directorio de compilacion separado (out-of-source build), entrar en el, ejecutar `cmake` apuntando al directorio del codigo fuente (`..`), y luego ejecutar `make`. Esto mantiene los archivos generados separados del codigo fuente.

</details>

## Pregunta 8

¿Que comando de `pkg-config` muestra los flags necesarios para enlazar con una biblioteca?

a) `pkg-config --cflags libreria`
b) `pkg-config --link libreria`
c) `pkg-config --libs libreria`
d) `pkg-config --ldflags libreria`

<details><summary>Respuesta</summary>

**c) `pkg-config --libs libreria`**

`pkg-config --libs` devuelve los flags de enlazado (linker flags) necesarios para compilar contra una biblioteca, como `-L/ruta/lib -lnombre`. Por otro lado, `--cflags` devuelve los flags de compilacion como rutas de inclusion de cabeceras (`-I/ruta/include`).

</details>

## Pregunta 9

¿Que hace el comando `make -j$(nproc)`?

a) Ejecuta make en modo silencioso
b) Compila el proyecto utilizando todos los nucleos disponibles del procesador
c) Genera un reporte de compilacion en formato JSON
d) Fuerza la recompilacion de todos los archivos

<details><summary>Respuesta</summary>

**b) Compila el proyecto utilizando todos los nucleos disponibles del procesador**

La opcion `-j` de `make` permite la compilacion en paralelo. `$(nproc)` es un comando que devuelve el numero de nucleos del procesador. Juntos, `make -j$(nproc)` aprovecha todos los nucleos disponibles para acelerar la compilacion.

</details>

## Pregunta 10

¿Que archivo almacena la cache binaria generada por `ldconfig`?

a) `/etc/ld.so.conf`
b) `/etc/ld.so.cache`
c) `/var/cache/ldconfig/ld.cache`
d) `/usr/lib/ld.cache`

<details><summary>Respuesta</summary>

**b) `/etc/ld.so.cache`**

`ldconfig` lee las rutas configuradas en `/etc/ld.so.conf` y sus archivos incluidos, y genera una cache binaria en `/etc/ld.so.cache`. Esta cache es consultada por el enlazador dinamico (`ld.so` / `ld-linux.so`) para localizar rapidamente las bibliotecas compartidas en tiempo de ejecucion.

</details>
