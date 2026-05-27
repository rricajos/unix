---
title: "352.2 - Ejercicios: LXC"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.2"
peso: 6
tags:
  - lpic-3
  - tema-352
  - ejercicios
  - lxc
---

# Ejercicios - 352.2 LXC

### Pregunta 1
¿Qué comando crea un contenedor LXC descargando una imagen de Ubuntu Jammy para arquitectura amd64?

a) `lxc-create -n mi-ct -t ubuntu -- --release jammy`
b) `lxc-create -n mi-ct -t download -- -d ubuntu -r jammy -a amd64`
c) `lxc-create -n mi-ct --image ubuntu:jammy:amd64`
d) `lxc-create -n mi-ct -t download -d ubuntu`

<details><summary>Respuesta</summary>

**b) `lxc-create -n mi-ct -t download -- -d ubuntu -r jammy -a amd64`**

El template `download` descarga imágenes preconfiguradas del servidor de imágenes LXC. Los parámetros después de `--` son: `-d` (distribución), `-r` (release), `-a` (arquitectura). El template `-t ubuntu` usa debootstrap local.
</details>

### Pregunta 2
¿Dónde se almacena el archivo de configuración de un contenedor LXC llamado "web-server"?

a) `/etc/lxc/web-server.conf`
b) `/var/lib/lxc/web-server/config`
c) `/etc/lxc/containers/web-server/config`
d) `/opt/lxc/web-server/lxc.conf`

<details><summary>Respuesta</summary>

**b) `/var/lib/lxc/web-server/config`**

Los contenedores privilegiados se almacenan en `/var/lib/lxc/<nombre>/`, con el archivo `config` para la configuración y el directorio `rootfs/` para el sistema de archivos. Los no privilegiados se almacenan en `~/.local/share/lxc/`.
</details>

### Pregunta 3
¿Qué comando permite obtener una shell interactiva dentro de un contenedor LXC en ejecución?

a) `lxc-console -n mi-ct`
b) `lxc-shell -n mi-ct`
c) `lxc-attach -n mi-ct`
d) `lxc-exec -n mi-ct bash`

<details><summary>Respuesta</summary>

**c) `lxc-attach -n mi-ct`**

`lxc-attach` adjunta una nueva sesión a los namespaces del contenedor en ejecución, proporcionando una shell. `lxc-console` conecta a la consola del contenedor (similar a un terminal serial). Con `lxc-attach` se puede ejecutar también un comando específico añadiendo `-- comando`.
</details>

### Pregunta 4
¿Qué opción de configuración LXC establece el tipo de interfaz de red como par virtual ethernet?

a) `lxc.network.type = bridge`
b) `lxc.net.0.type = veth`
c) `lxc.net.0.type = bridge`
d) `lxc.network.0.mode = veth`

<details><summary>Respuesta</summary>

**b) `lxc.net.0.type = veth`**

`lxc.net.0.type = veth` configura un par de interfaces virtuales ethernet. El `0` es el índice de la interfaz. El tipo `veth` crea un par donde un extremo está en el contenedor y el otro se conecta al bridge del host.
</details>

### Pregunta 5
¿Qué comando clona un contenedor LXC usando copy-on-write (snapshot)?

a) `lxc-clone -n mi-ct -N mi-clon -s`
b) `lxc-copy -n mi-ct -N mi-clon -s`
c) `lxc-snapshot -n mi-ct -c mi-clon`
d) `lxc-create -n mi-clon --clone mi-ct`

<details><summary>Respuesta</summary>

**b) `lxc-copy -n mi-ct -N mi-clon -s`**

`lxc-copy` reemplazó al antiguo `lxc-clone`. La opción `-s` crea un clon con snapshot (copy-on-write), que es más rápido y eficiente en espacio. Requiere un backend que lo soporte (btrfs, LVM, ZFS u overlay).
</details>

### Pregunta 6
¿Qué diferencia principal hay entre LXC y LXD?

a) LXC es para contenedores de aplicación, LXD para contenedores de sistema
b) LXD añade una API REST, gestión de imágenes y clustering sobre LXC
c) LXD es la versión de LXC para Docker
d) LXC es más moderno que LXD

<details><summary>Respuesta</summary>

**b) LXD añade una API REST, gestión de imágenes y clustering sobre LXC**

LXD es un gestor de contenedores de sistema construido sobre LXC (liblxc). Añade una API REST, gestión de imágenes, clustering, migración en vivo y gestión avanzada de almacenamiento y redes. El cliente de LXD usa el comando `lxc` (sin guión).
</details>

### Pregunta 7
¿Qué configuración de `lxc.idmap` mapea UID 0 del contenedor al UID 100000 del host con un rango de 65536 UIDs?

a) `lxc.idmap = user 0:100000:65536`
b) `lxc.idmap = u 0 100000 65536`
c) `lxc.uid.map = 0-65536:100000`
d) `lxc.userns.uid = 100000+65536`

<details><summary>Respuesta</summary>

**b) `lxc.idmap = u 0 100000 65536`**

El formato es: `lxc.idmap = <u|g> <id_inicio_contenedor> <id_inicio_host> <rango>`. `u` es para UIDs y `g` para GIDs. En este caso, el UID 0 del contenedor se mapea al 100000 del host, y así sucesivamente para 65536 UIDs.
</details>

### Pregunta 8
¿Qué backend de almacenamiento LXC NO soporta snapshots eficientes (copy-on-write)?

a) btrfs
b) zfs
c) dir
d) lvm

<details><summary>Respuesta</summary>

**c) dir**

El backend `dir` (directorio simple) es el predeterminado pero no soporta snapshots eficientes; debe copiar todo el rootfs. Los backends btrfs, zfs, lvm y overlay soportan snapshots nativos con copy-on-write.
</details>

### Pregunta 9
¿Qué comando detiene forzosamente un contenedor LXC que no responde al apagado normal?

a) `lxc-destroy -n mi-ct`
b) `lxc-stop -n mi-ct -k`
c) `lxc-kill -n mi-ct`
d) `lxc-stop -n mi-ct --force`

<details><summary>Respuesta</summary>

**b) `lxc-stop -n mi-ct -k`**

La opción `-k` (kill) de `lxc-stop` fuerza la detención inmediata del contenedor. Sin `-k`, `lxc-stop` envía la señal SIGPWR al init del contenedor y espera un apagado ordenado. `lxc-destroy` elimina el contenedor, no solo lo detiene.
</details>

### Pregunta 10
¿Cuál es la diferencia entre `lxc-attach` y `lxc-console`?

a) Son idénticos en funcionalidad
b) `lxc-attach` crea un nuevo proceso en los namespaces del contenedor; `lxc-console` conecta al terminal del contenedor
c) `lxc-console` solo funciona con contenedores no privilegiados
d) `lxc-attach` requiere que SSH esté instalado en el contenedor

<details><summary>Respuesta</summary>

**b) `lxc-attach` crea un nuevo proceso en los namespaces del contenedor; `lxc-console` conecta al terminal del contenedor**

`lxc-attach` usa `nsenter` para crear un nuevo proceso directamente en los namespaces del contenedor. `lxc-console` conecta a la consola del contenedor (como un terminal serie), que es el tty configurado para el contenedor. Se sale de `lxc-console` con Ctrl+a seguido de q.
</details>
