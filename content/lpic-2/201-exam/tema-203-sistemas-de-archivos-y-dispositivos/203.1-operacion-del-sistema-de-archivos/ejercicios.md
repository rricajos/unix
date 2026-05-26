---
title: "203.1 - Operacion del sistema de archivos"
tags: [lpic-2, examen-201, tema-203, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.1"
---

# 203.1 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

En el archivo `/etc/fstab`, ¿que valor debe tener el campo "pass" (sexto campo) para la particion raiz (`/`)?

a) 0
b) 1
c) 2
d) 3

<details>
<summary>Respuesta</summary>

**b) 1**

El campo "pass" determina el orden en que `fsck` verifica los sistemas de archivos durante el arranque. El valor `1` esta reservado exclusivamente para la particion raiz, que se verifica primero. El valor `2` se usa para el resto de particiones (verificadas despues de la raiz). El valor `0` desactiva la verificacion para esa particion.
</details>

---

### Pregunta 2

¿Cual de las siguientes opciones de montaje en `/etc/fstab` indica a systemd que el dispositivo requiere conexion de red para estar disponible?

a) `noauto`
b) `nofail`
c) `_netdev`
d) `x-systemd.requires=network.target`

<details>
<summary>Respuesta</summary>

**c) `_netdev`**

La opcion `_netdev` indica que el dispositivo requiere que la red este disponible antes de intentar el montaje. Es esencial para montajes NFS, CIFS u otros sistemas de archivos remotos. Sin esta opcion, el sistema podria intentar montar el recurso antes de que la red este configurada, causando errores o retrasos en el arranque. La opcion d) tambien funcionaria como alternativa con sintaxis de systemd.
</details>

---

### Pregunta 3

Un administrador quiere que el contenido de `/var/www` sea accesible tambien desde `/home/webdev/sitio`. ¿Que tipo de montaje debe utilizar?

a) `mount -o loop /var/www /home/webdev/sitio`
b) `mount --bind /var/www /home/webdev/sitio`
c) `mount -t symlink /var/www /home/webdev/sitio`
d) `ln -s /var/www /home/webdev/sitio`

<details>
<summary>Respuesta</summary>

**b) `mount --bind /var/www /home/webdev/sitio`**

Un montaje bind permite montar un directorio en otra ubicacion del arbol de directorios, haciendo que el mismo contenido sea accesible desde ambas rutas. A diferencia de un enlace simbolico (opcion d), un bind mount funciona a nivel del sistema de archivos virtual y es mas robusto en ciertos escenarios (como chroot). La opcion loop es para montar archivos de imagen como dispositivos.
</details>

---

### Pregunta 4

En la configuracion de autofs, ¿que archivo define los puntos de montaje y referencia los archivos de mapa correspondientes?

a) `/etc/autofs.conf`
b) `/etc/auto.misc`
c) `/etc/auto.master`
d) `/etc/fstab`

<details>
<summary>Respuesta</summary>

**c) `/etc/auto.master`**

El archivo `/etc/auto.master` es el archivo maestro de autofs. Define los puntos de montaje base y referencia los archivos de mapa que contienen las definiciones individuales de cada montaje. Por ejemplo, una linea como `/mnt/nfs /etc/auto.nfs --timeout=60` indica que los montajes bajo `/mnt/nfs` estan definidos en el archivo `/etc/auto.nfs` con un timeout de 60 segundos.
</details>

---

### Pregunta 5

¿Que herramienta es la mas adecuada para obtener el UUID de una particion que se necesita para configurar en `/etc/fstab`?

a) `fdisk -l`
b) `lsblk`
c) `blkid`
d) `df -h`

<details>
<summary>Respuesta</summary>

**c) `blkid`**

`blkid` es la herramienta principal para obtener los atributos de dispositivos de bloque, incluyendo UUID, etiqueta (LABEL) y tipo de sistema de archivos. Aunque `lsblk -f` tambien puede mostrar UUIDs, `blkid` es la herramienta especificamente diseñada para este proposito. `fdisk -l` muestra la tabla de particiones pero no UUIDs, y `df -h` muestra el uso del espacio en disco.
</details>

---

### Pregunta 6

Un administrador crea una unidad de automontaje en systemd para `/mnt/datos`. ¿Cual debe ser el nombre correcto del archivo de la unidad `.automount`?

a) `datos.automount`
b) `mnt-datos.automount`
c) `mnt_datos.automount`
d) `/mnt/datos.automount`

<details>
<summary>Respuesta</summary>

**b) `mnt-datos.automount`**

En systemd, el nombre de las unidades `.mount` y `.automount` debe corresponder a la ruta del punto de montaje, reemplazando las barras (`/`) por guiones (`-`) y eliminando la barra inicial. Asi, `/mnt/datos` se convierte en `mnt-datos`. La unidad `.automount` siempre requiere una unidad `.mount` correspondiente con el mismo nombre base.
</details>

---

### Pregunta 7

¿Que opcion de montaje en `/etc/fstab` permite que cualquier usuario pueda montar el sistema de archivos, pero solo el usuario que lo monto pueda desmontarlo?

a) `users`
b) `user`
c) `nouser`
d) `owner`

<details>
<summary>Respuesta</summary>

**b) `user`**

La opcion `user` permite que cualquier usuario monte el sistema de archivos, pero solo el usuario que realizo el montaje (o root) puede desmontarlo. Ademas, implica automaticamente `noexec`, `nosuid` y `nodev`. La opcion `users` permite que cualquier usuario pueda montar Y desmontar el sistema de archivos, sin importar quien lo monto. `nouser` (por defecto) solo permite a root montar.
</details>

---

### Pregunta 8

Un sistema de archivos NFS montado remotamente se ha vuelto inaccesible. El comando `umount /mnt/nfs` no responde. ¿Que opcion de umount es la mas segura para resolver la situacion?

a) `umount -f /mnt/nfs`
b) `umount -l /mnt/nfs`
c) `umount -r /mnt/nfs`
d) `umount -a`

<details>
<summary>Respuesta</summary>

**b) `umount -l /mnt/nfs`**

La opcion `-l` (lazy unmount) desvincula inmediatamente el sistema de archivos del arbol de directorios y limpia todas las referencias cuando deja de estar en uso. Es la opcion mas segura para montajes remotos inaccesibles porque no bloquea. La opcion `-f` (force) tambien puede funcionar con NFS, pero es mas agresiva. La opcion `-r` remonta en solo lectura si falla el desmontaje.
</details>

---

### Pregunta 9

En un archivo de mapa de autofs, ¿que significan los caracteres `*` y `&` en la siguiente linea?

```
*    -fstype=nfs,rw    servidor:/home/&
```

a) `*` es un nombre literal y `&` es un comodin
b) `*` coincide con cualquier clave y `&` se sustituye por la clave coincidente
c) `*` indica todos los servidores y `&` indica todos los directorios
d) `*` y `&` son caracteres de escape

<details>
<summary>Respuesta</summary>

**b) `*` coincide con cualquier clave y `&` se sustituye por la clave coincidente**

En los archivos de mapa de autofs, `*` es un comodin que coincide con cualquier nombre de subdirectorio solicitado, y `&` se reemplaza con el nombre que coincidio. En este ejemplo, si un usuario accede a `/home/juan`, autofs montaria `servidor:/home/juan`. Si accede a `/home/maria`, montaria `servidor:/home/maria`. Es una forma elegante de mapear directorios home de forma dinamica.
</details>

---

### Pregunta 10

¿Que comando muestra los sistemas de archivos montados actualmente en formato de arbol jerarquico?

a) `mount`
b) `df -h`
c) `findmnt`
d) `cat /etc/mtab`

<details>
<summary>Respuesta</summary>

**c) `findmnt`**

`findmnt` es la herramienta moderna para visualizar los sistemas de archivos montados. Por defecto, muestra la informacion en formato de arbol jerarquico, lo que permite ver facilmente la relacion entre puntos de montaje. Admite filtros por tipo de sistema de archivos (`-t`), por dispositivo (`-S`) y por punto de montaje. El comando `mount` sin argumentos tambien muestra montajes pero en formato lista plana, menos legible.
</details>
