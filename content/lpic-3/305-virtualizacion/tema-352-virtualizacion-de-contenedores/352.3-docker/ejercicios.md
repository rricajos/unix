---
title: "352.3 - Ejercicios: Docker"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.3"
peso: 9
tags:
  - lpic-3
  - tema-352
  - ejercicios
  - docker
  - dockerfile
---

# Ejercicios - 352.3 Docker

### Pregunta 1
¿Cuál es la diferencia entre las instrucciones `CMD` y `ENTRYPOINT` en un Dockerfile?

a) No hay diferencia, son sinónimos
b) `CMD` define el ejecutable principal y `ENTRYPOINT` los argumentos
c) `ENTRYPOINT` define el ejecutable principal; `CMD` proporciona argumentos por defecto que pueden sobrescribirse
d) `CMD` solo acepta formato shell, `ENTRYPOINT` solo formato exec

<details><summary>Respuesta</summary>

**c) `ENTRYPOINT` define el ejecutable principal; `CMD` proporciona argumentos por defecto que pueden sobrescribirse**

`ENTRYPOINT` define el ejecutable que siempre se ejecuta. `CMD` proporciona argumentos por defecto que se pasan a `ENTRYPOINT` y pueden ser sobrescritos al hacer `docker run imagen nuevos-args`. `ENTRYPOINT` solo se sobrescribe con `--entrypoint`.
</details>

### Pregunta 2
¿Qué ventaja proporcionan los multi-stage builds en un Dockerfile?

a) Permiten ejecutar múltiples contenedores simultáneamente
b) Aceleran la descarga de la imagen base
c) Reducen el tamaño de la imagen final al separar las etapas de compilación y ejecución
d) Permiten usar múltiples sistemas operativos en un mismo contenedor

<details><summary>Respuesta</summary>

**c) Reducen el tamaño de la imagen final al separar las etapas de compilación y ejecución**

Los multi-stage builds permiten usar una imagen con herramientas de compilación en la primera etapa y copiar solo el binario resultante a una imagen mínima final. `COPY --from=builder` copia archivos de una etapa anterior.
</details>

### Pregunta 3
¿Qué tipo de red Docker permite la resolución DNS automática de contenedores por nombre?

a) La red bridge por defecto (docker0)
b) La red host
c) Una red bridge personalizada (user-defined)
d) La red none

<details><summary>Respuesta</summary>

**c) Una red bridge personalizada (user-defined)**

Las redes bridge personalizadas (creadas con `docker network create`) incluyen un servidor DNS interno que permite a los contenedores resolverse por nombre. La red bridge por defecto (`docker0`) no ofrece esta funcionalidad; solo permite comunicación por IP.
</details>

### Pregunta 4
¿Qué hace el archivo `.dockerignore`?

a) Lista las imágenes que Docker debe ignorar del registry
b) Excluye archivos y directorios del contexto de build enviado al daemon
c) Define reglas de seguridad para el contenedor
d) Lista contenedores que no deben iniciarse automáticamente

<details><summary>Respuesta</summary>

**b) Excluye archivos y directorios del contexto de build enviado al daemon**

`.dockerignore` funciona como `.gitignore`: excluye archivos del contexto de build. Esto reduce el tamaño del contexto enviado al daemon, acelera la construcción y evita incluir archivos sensibles (.env, .git, node_modules) en la imagen.
</details>

### Pregunta 5
¿Qué comando ejecuta un proceso bash interactivo dentro de un contenedor Docker ya en ejecución?

a) `docker run -it contenedor bash`
b) `docker attach contenedor`
c) `docker exec -it contenedor bash`
d) `docker shell contenedor`

<details><summary>Respuesta</summary>

**c) `docker exec -it contenedor bash`**

`docker exec` ejecuta un nuevo proceso dentro de un contenedor en ejecución. `-i` mantiene stdin abierto y `-t` asigna un pseudo-TTY. `docker run` crearía un nuevo contenedor. `docker attach` conecta al proceso principal del contenedor, no crea uno nuevo.
</details>

### Pregunta 6
¿Cuál es la diferencia entre un volumen Docker y un bind mount?

a) Los bind mounts son más portátiles que los volúmenes
b) Los volúmenes son gestionados por Docker; los bind mounts mapean una ruta específica del host
c) Los volúmenes solo funcionan en Linux; los bind mounts en cualquier SO
d) No hay diferencia, son sinónimos

<details><summary>Respuesta</summary>

**b) Los volúmenes son gestionados por Docker; los bind mounts mapean una ruta específica del host**

Los volúmenes Docker son creados y gestionados por Docker (almacenados en `/var/lib/docker/volumes/`). Los bind mounts mapean directamente un directorio o archivo del host al contenedor. Los volúmenes son más portátiles y recomendados para datos persistentes.
</details>

### Pregunta 7
¿Qué comando detiene todos los servicios definidos en un docker-compose.yml y elimina los volúmenes asociados?

a) `docker compose stop --volumes`
b) `docker compose down -v`
c) `docker compose rm --volumes`
d) `docker compose destroy -v`

<details><summary>Respuesta</summary>

**b) `docker compose down -v`**

`docker compose down` detiene y elimina contenedores, redes y la configuración creada por `up`. La opción `-v` (o `--volumes`) también elimina los volúmenes nombrados definidos en la sección `volumes` del archivo compose.
</details>

### Pregunta 8
¿Qué instrucción del Dockerfile se recomienda en lugar de `ADD` para copiar archivos locales?

a) `PUT`
b) `COPY`
c) `INSERT`
d) `IMPORT`

<details><summary>Respuesta</summary>

**b) `COPY`**

`COPY` es la instrucción recomendada para copiar archivos locales al contenedor. `ADD` tiene funcionalidad extra (descomprimir tar, descargar URLs) que puede causar comportamientos inesperados. `ADD` solo se justifica cuando se necesita específicamente la descompresión automática de archivos tar.
</details>

### Pregunta 9
¿Qué opción de `docker run` hace que el contenedor se elimine automáticamente cuando se detiene?

a) `--auto-remove`
b) `--rm`
c) `--clean`
d) `--disposable`

<details><summary>Respuesta</summary>

**b) `--rm`**

La opción `--rm` elimina automáticamente el contenedor y su filesystem cuando el proceso principal sale. Es útil para contenedores efímeros usados en pruebas o ejecuciones puntuales: `docker run -it --rm ubuntu bash`.
</details>

### Pregunta 10
¿Qué comando elimina contenedores detenidos, redes no usadas, imágenes sin referencia y caché de build?

a) `docker cleanup`
b) `docker system prune`
c) `docker purge all`
d) `docker gc`

<details><summary>Respuesta</summary>

**b) `docker system prune`**

`docker system prune` elimina todos los recursos no utilizados: contenedores detenidos, redes sin contenedores, imágenes dangling y caché de build. Con `--volumes` también elimina volúmenes no usados. `docker system df` muestra el uso de disco antes de limpiar.
</details>
