---
title: "209.2 - Configuración del servidor NFS"
tags: [lpic-2, examen-202, tema-209, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "209"
subtema: "209.2"
---

# 209.2 - Ejercicios: Configuración del servidor NFS

### Pregunta 1
¿En qué archivo se definen los directorios que un servidor NFS exporta a los clientes?

a) /etc/nfs.conf
b) /etc/exports
c) /etc/nfs/shares
d) /etc/fstab

<details>
<summary>Respuesta</summary>

**b) /etc/exports**

El archivo `/etc/exports` es el archivo de configuración principal del servidor NFS donde se definen los directorios exportados, los clientes que tienen acceso y las opciones de cada exportación. Después de modificarlo, se aplican los cambios con `exportfs -ra`.
</details>

---

### Pregunta 2
¿Qué opción de exportación NFS impide que el usuario root del cliente tenga privilegios de root sobre los archivos del servidor?

a) no_root_squash
b) root_squash
c) all_squash
d) secure

<details>
<summary>Respuesta</summary>

**b) root_squash**

La opción `root_squash` mapea el usuario root del cliente (UID 0) al usuario anónimo (normalmente `nobody`), impidiendo que tenga privilegios de root sobre los archivos del servidor. Es la opción predeterminada por razones de seguridad. La opción contraria, `no_root_squash`, permite que root remoto mantenga sus privilegios.
</details>

---

### Pregunta 3
¿Qué ventaja principal tiene NFSv4 sobre NFSv3 en relación con la configuración de firewalls?

a) NFSv4 no requiere autenticación
b) NFSv4 utiliza solo el puerto TCP 2049, mientras que NFSv3 necesita múltiples puertos
c) NFSv4 utiliza cifrado por defecto
d) NFSv4 funciona solo sobre UDP, que es más fácil de filtrar

<details>
<summary>Respuesta</summary>

**b) NFSv4 utiliza solo el puerto TCP 2049, mientras que NFSv3 necesita múltiples puertos**

NFSv4 simplifica enormemente la configuración de firewalls al utilizar exclusivamente el puerto TCP 2049. NFSv3 requiere rpcbind (puerto 111) y puertos dinámicos adicionales para mountd, statd y lockd, lo que complica las reglas de firewall.
</details>

---

### Pregunta 4
¿Qué comando aplica los cambios realizados en /etc/exports sin reiniciar el servicio NFS?

a) exportfs -r
b) exportfs -ra
c) nfsreload
d) systemctl reload exports

<details>
<summary>Respuesta</summary>

**b) exportfs -ra**

El comando `exportfs -ra` re-exporta todos los directorios, sincronizando la tabla de exportaciones activas con el contenido actual de `/etc/exports`. La opción `-r` significa re-exportar y `-a` significa todos. Sin la `-r`, `exportfs -a` solo exportaría las entradas nuevas sin eliminar las que ya no están en el archivo.
</details>

---

### Pregunta 5
¿Cuál es la diferencia entre las siguientes entradas en /etc/exports?
- Línea A: `/datos 192.168.1.0/24(rw)`
- Línea B: `/datos 192.168.1.0/24 (rw)`

a) No hay diferencia, ambas son equivalentes
b) La línea A da acceso rw a la red 192.168.1.0/24; la línea B da acceso rw a todos los hosts
c) La línea A es una sintaxis inválida
d) La línea B aplica las opciones solo al primer cliente

<details>
<summary>Respuesta</summary>

**b) La línea A da acceso rw a la red 192.168.1.0/24; la línea B da acceso rw a todos los hosts**

En `/etc/exports`, el espacio entre el cliente y las opciones es significativo. En la línea A, `192.168.1.0/24(rw)` concede acceso de lectura y escritura a esa red. En la línea B, el espacio hace que se interprete como dos entradas separadas: `192.168.1.0/24` con opciones predeterminadas (ro) y `(rw)` que se aplica a todos los hosts. Este es un error muy común y peligroso.
</details>

---

### Pregunta 6
¿Qué comando muestra los directorios exportados por un servidor NFS remoto?

a) exportfs -v servidor
b) nfsstat -e servidor
c) showmount -e servidor
d) rpcinfo -e servidor

<details>
<summary>Respuesta</summary>

**c) showmount -e servidor**

El comando `showmount -e` (exports) consulta a un servidor NFS y muestra la lista de directorios exportados junto con los clientes que tienen acceso. Con la opción `-a` muestra los montajes activos y con `-d` muestra solo los directorios montados.
</details>

---

### Pregunta 7
¿Qué opción de montaje NFS en el cliente garantiza que las operaciones de escritura se confirmen antes de continuar?

a) async
b) sync
c) hard
d) direct

<details>
<summary>Respuesta</summary>

**b) sync**

La opción `sync` en el montaje del cliente asegura que las operaciones de escritura se confirmen en el servidor antes de que la llamada retorne al proceso. La opción `async` permite que las escrituras se almacenen en buffer, mejorando el rendimiento pero con riesgo de pérdida de datos si el servidor falla.
</details>

---

### Pregunta 8
¿Qué servicio es necesario para NFSv3 pero no para NFSv4?

a) nfsd
b) rpcbind
c) idmapd
d) nfs-server

<details>
<summary>Respuesta</summary>

**b) rpcbind**

`rpcbind` (anteriormente `portmap`) es el servicio que mapea los programas RPC a puertos de red. NFSv3 lo necesita porque utiliza puertos dinámicos para sus servicios auxiliares (mountd, statd, lockd). NFSv4 no lo necesita porque opera exclusivamente en el puerto TCP 2049 con todos los servicios integrados.
</details>

---

### Pregunta 9
Un administrador quiere montar un recurso NFS permanentemente con la opción de que el sistema espere a que la red esté disponible antes de intentar el montaje. ¿Qué opción debe incluir en /etc/fstab?

a) netmount
b) network
c) _netdev
d) wait_net

<details>
<summary>Respuesta</summary>

**c) _netdev**

La opción `_netdev` en `/etc/fstab` indica al sistema que el recurso depende de la conectividad de red y que no debe intentar montarlo hasta que la red esté disponible. Sin esta opción, el sistema podría intentar montar el recurso NFS antes de que la interfaz de red esté configurada, causando retrasos o fallos en el arranque.
</details>

---

### Pregunta 10
¿Qué opción de /etc/exports marca un directorio como raíz del pseudo-filesystem de NFSv4?

a) root=true
b) nfsv4root
c) fsid=0
d) pseudoroot

<details>
<summary>Respuesta</summary>

**c) fsid=0**

La opción `fsid=0` en `/etc/exports` marca un directorio como la raíz del pseudo-filesystem de NFSv4. Todos los demás directorios exportados se presentan como subdirectorios de esta raíz. Combinado con la opción `crossmnt`, permite que los clientes naveguen automáticamente entre los diferentes puntos de montaje exportados.
</details>

---
