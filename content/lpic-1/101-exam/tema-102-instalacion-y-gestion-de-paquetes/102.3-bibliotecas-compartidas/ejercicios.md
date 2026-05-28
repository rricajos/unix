---
title: "102.3 - Gestion de bibliotecas compartidas: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.3"
---

# 102.3 - Gestion de bibliotecas compartidas: Ejercicios

### Pregunta 1

Que comando se utiliza para ver las bibliotecas compartidas que necesita un programa ejecutable?

a) `objdump /usr/bin/ssh`
b) `ldd /usr/bin/ssh`
c) `ldconfig -p /usr/bin/ssh`
d) `readelf /usr/bin/ssh`

<details><summary>Respuesta</summary>

**b) `ldd /usr/bin/ssh`**

El comando `ldd` muestra las bibliotecas compartidas que necesita un programa ejecutable, indicando el soname de cada biblioteca, la ruta donde se encontro y la direccion de memoria donde se cargara. Si aparece "not found" junto a una biblioteca, el programa no podra ejecutarse hasta que se instale o se configure correctamente su ruta. Nota de seguridad: no se debe ejecutar `ldd` sobre ejecutables no confiables; en ese caso es mejor usar `objdump -p` o `readelf -d` con filtro `NEEDED`.

</details>

---

### Pregunta 2

Cual es la relacion entre `/etc/ld.so.conf` y `/etc/ld.so.cache`?

a) Son el mismo archivo con diferente nombre segun la distribucion
b) `/etc/ld.so.cache` es una copia de seguridad de `/etc/ld.so.conf`
c) `ldconfig` lee los directorios de `/etc/ld.so.conf` y genera la cache binaria `/etc/ld.so.cache`
d) `/etc/ld.so.conf` se genera automaticamente a partir de `/etc/ld.so.cache`

<details><summary>Respuesta</summary>

**c) `ldconfig` lee los directorios de `/etc/ld.so.conf` y genera la cache binaria `/etc/ld.so.cache`**

`/etc/ld.so.conf` es un archivo de texto que lista los directorios adicionales donde buscar bibliotecas compartidas (normalmente incluye archivos de `/etc/ld.so.conf.d/`). `/etc/ld.so.cache` es un archivo binario indexado que contiene la lista de todas las bibliotecas disponibles y sus rutas. Al ejecutar `ldconfig`, este escanea los directorios de `/etc/ld.so.conf` y los directorios por defecto, y genera (actualiza) la cache binaria. El cargador dinamico consulta esta cache para localizar rapidamente las bibliotecas.

</details>

---

### Pregunta 3

Has compilado una aplicacion que instala sus bibliotecas en `/opt/miapp/lib`. Cual es la forma correcta de hacer que el sistema las encuentre de forma permanente?

a) Ejecutar `export LD_LIBRARY_PATH=/opt/miapp/lib` en `/etc/profile`
b) Copiar las bibliotecas a `/usr/lib` manualmente
c) Crear un archivo en `/etc/ld.so.conf.d/` con la ruta y ejecutar `ldconfig`
d) Anadir la ruta directamente en `/etc/ld.so.cache`

<details><summary>Respuesta</summary>

**c) Crear un archivo en `/etc/ld.so.conf.d/` con la ruta y ejecutar `ldconfig`**

La forma correcta y permanente es crear un archivo de configuracion (por ejemplo, `/etc/ld.so.conf.d/miapp.conf`) que contenga la ruta `/opt/miapp/lib`, y luego ejecutar `sudo ldconfig` para actualizar la cache. No se recomienda usar `LD_LIBRARY_PATH` para configuraciones permanentes porque es temporal, es ignorada por programas SUID/SGID y puede causar conflictos de versiones. No se debe editar `/etc/ld.so.cache` directamente porque es un archivo binario generado por `ldconfig`.

</details>

---

### Pregunta 4

Cual de las siguientes afirmaciones sobre `LD_LIBRARY_PATH` es correcta?

a) Es la forma recomendada para configurar rutas de bibliotecas en produccion
b) Los programas con bit SUID/SGID la ignoran por razones de seguridad
c) Sus rutas tienen menor prioridad que la cache `/etc/ld.so.cache`
d) Requiere permisos de root para ser definida

<details><summary>Respuesta</summary>

**b) Los programas con bit SUID/SGID la ignoran por razones de seguridad**

`LD_LIBRARY_PATH` es una variable de entorno que especifica directorios adicionales para buscar bibliotecas. Por seguridad, es ignorada por programas con bits SUID/SGID para evitar que un usuario normal pueda inyectar bibliotecas maliciosas en programas privilegiados. No requiere permisos de root y tiene mayor prioridad que la cache (no menor). No se recomienda para produccion porque es temporal y puede causar conflictos.

</details>

---

### Pregunta 5

Cual es el orden correcto en que el cargador dinamico busca las bibliotecas compartidas?

a) Cache -> LD_LIBRARY_PATH -> RPATH -> directorios por defecto
b) LD_LIBRARY_PATH -> Cache -> directorios por defecto -> RPATH
c) RPATH -> LD_LIBRARY_PATH -> Cache -> directorios por defecto
d) Directorios por defecto -> Cache -> LD_LIBRARY_PATH -> RPATH

<details><summary>Respuesta</summary>

**c) RPATH -> LD_LIBRARY_PATH -> Cache -> directorios por defecto**

El cargador dinamico (`ld-linux.so`) busca las bibliotecas en este orden: 1) RPATH/RUNPATH (rutas incrustadas en el ejecutable durante la compilacion), 2) LD_LIBRARY_PATH (variable de entorno), 3) Cache `/etc/ld.so.cache` (generada por `ldconfig`), y 4) directorios por defecto (`/lib`, `/usr/lib` y sus equivalentes de 64 bits). Si la biblioteca no se encuentra en ninguno de estos pasos, el programa fallara con el error "cannot open shared object file".

</details>

---

### Pregunta 6

Dado el archivo `libcrypto.so.1.1.0`, que representa el numero `1` inmediatamente despues de `.so`?

a) La revision de correccion de errores
b) La version menor con nuevas funcionalidades
c) La version mayor que indica cambios incompatibles
d) El numero de compilacion de la biblioteca

<details><summary>Respuesta</summary>

**c) La version mayor que indica cambios incompatibles**

La convencion de nombres es `libNOMBRE.so.MAYOR.MENOR.REVISION`. En `libcrypto.so.1.1.0`: `lib` es el prefijo estandar, `crypto` es el nombre, `.so` indica Shared Object, `1` (primera posicion) es la version mayor (cambios incompatibles), `1` (segunda posicion) es la version menor (nuevas funcionalidades compatibles), y `0` es la revision (correcciones de errores). El soname (`libcrypto.so.1`) solo incluye la version mayor, permitiendo actualizar versiones menores sin romper compatibilidad.

</details>

---

### Pregunta 7

Despues de instalar manualmente una biblioteca en `/usr/local/lib`, un programa sigue mostrando "cannot open shared object file". Cual es el paso mas probable que falta?

a) Reiniciar el sistema para que detecte la nueva biblioteca
b) Ejecutar `ldconfig` para actualizar la cache de bibliotecas
c) Establecer la variable `LD_PRELOAD` con la ruta de la biblioteca
d) Copiar la biblioteca tambien en `/lib64`

<details><summary>Respuesta</summary>

**b) Ejecutar `ldconfig` para actualizar la cache de bibliotecas**

Cuando se instalan bibliotecas manualmente, la cache `/etc/ld.so.cache` no se actualiza automaticamente. Se debe ejecutar `sudo ldconfig` para que escanee los directorios configurados, encuentre la nueva biblioteca, cree los enlaces simbolicos (soname) necesarios y actualice la cache. Ademas, hay que verificar que `/usr/local/lib` este listado en `/etc/ld.so.conf` o en algun archivo de `/etc/ld.so.conf.d/`. Los gestores de paquetes (apt, yum) ejecutan `ldconfig` automaticamente, pero al instalar manualmente se debe hacer de forma explicita.

</details>

---

### Pregunta 8

Cual es la principal ventaja de las bibliotecas compartidas (.so) frente a las estaticas (.a)?

a) El ejecutable resultante no tiene ninguna dependencia externa
b) El ejecutable se puede copiar a cualquier sistema sin problemas de compatibilidad
c) Multiples programas comparten una sola copia en memoria, ahorrando espacio
d) La compilacion es mas rapida porque no se necesita el codigo fuente de la biblioteca

<details><summary>Respuesta</summary>

**c) Multiples programas comparten una sola copia en memoria, ahorrando espacio**

Las bibliotecas compartidas (.so) se cargan una sola vez en memoria y se comparten entre todos los procesos que las necesitan, ahorrando espacio en disco y RAM. Ademas, actualizar la biblioteca actualiza automaticamente todos los programas que la usan. Las opciones a) y b) son ventajas de las bibliotecas estaticas (.a), donde el codigo se copia dentro del ejecutable haciendolo autonomo pero mas grande.

</details>

---

### Pregunta 9

Que comando muestra el contenido de la cache de bibliotecas compartidas del sistema?

a) `ldd -p`
b) `ldconfig -p`
c) `ld --cache`
d) `cat /etc/ld.so.cache`

<details><summary>Respuesta</summary>

**b) `ldconfig -p`**

El comando `ldconfig -p` (print cache) muestra todas las bibliotecas registradas en la cache `/etc/ld.so.cache`, incluyendo el soname, tipo (libc6, x86-64) y ruta completa de cada biblioteca. Se puede combinar con `grep` para buscar una biblioteca especifica: `ldconfig -p | grep libssl`. No se puede usar `cat` para leer la cache porque es un archivo binario. Para ver el proceso de escaneo con detalle se usa `ldconfig -v` (verbose).

</details>

---

### Pregunta 10

En la convencion de nombrado de bibliotecas compartidas, que enlace simbolico es el "soname" y quien lo utiliza?

a) `libfuse.so` - usado por el compilador durante la compilacion
b) `libfuse.so.2` - usado por el cargador dinamico cuando los programas se ejecutan
c) `libfuse.so.2.9.7` - usado por el sistema de archivos para localizar el archivo real
d) `libfuse.a` - usado por el enlazador estatico

<details><summary>Respuesta</summary>

**b) `libfuse.so.2` - usado por el cargador dinamico cuando los programas se ejecutan**

En la cadena de enlaces simbolicos, el soname (`libfuse.so.2`) incluye solo la version mayor y es el nombre que los programas compilados contra esta biblioteca buscan en tiempo de ejecucion. El enlace de desarrollo (`libfuse.so`, sin version) es usado por el compilador (`gcc -lfuse`). El archivo real (`libfuse.so.2.9.7`) contiene el codigo compilado. El comando `ldconfig` se encarga de crear y mantener automaticamente los enlaces soname, permitiendo actualizar la version menor y revision sin romper la compatibilidad.

</details>
