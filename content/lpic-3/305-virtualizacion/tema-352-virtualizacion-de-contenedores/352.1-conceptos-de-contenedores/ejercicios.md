---
title: "352.1 - Ejercicios: Conceptos de Contenedores"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.1"
peso: 7
tags:
  - lpic-3
  - tema-352
  - ejercicios
  - contenedores
  - namespaces
  - cgroups
---

# Ejercicios - 352.1 Conceptos de Contenedores

### Pregunta 1
¿Qué namespace de Linux aísla los árboles de procesos, permitiendo que un contenedor tenga su propio PID 1?

a) mnt
b) net
c) pid
d) uts

<details><summary>Respuesta</summary>

**c) pid**

El namespace PID aísla el árbol de procesos. Dentro del contenedor, el proceso principal tiene PID 1, aunque en el host tiene un PID diferente. Esto permite que cada contenedor tenga su propia vista independiente de los procesos.
</details>

### Pregunta 2
¿Cuál es la diferencia fundamental entre contenedores y máquinas virtuales?

a) Los contenedores son más seguros que las VMs
b) Los contenedores comparten el kernel del host, las VMs tienen kernel propio
c) Los contenedores no pueden acceder a la red
d) Las VMs son más rápidas que los contenedores

<details><summary>Respuesta</summary>

**b) Los contenedores comparten el kernel del host, las VMs tienen kernel propio**

Los contenedores comparten el kernel del sistema operativo host y usan namespaces y cgroups para el aislamiento. Las VMs tienen su propio kernel y SO completo ejecutándose sobre un hipervisor. Esto hace a los contenedores más ligeros pero potencialmente menos aislados.
</details>

### Pregunta 3
¿Qué mecanismo del kernel Linux limita el uso de CPU, memoria y E/S por grupos de procesos?

a) Namespaces
b) Cgroups
c) SELinux
d) Seccomp

<details><summary>Respuesta</summary>

**b) Cgroups**

Los Control Groups (cgroups) limitan, contabilizan y aíslan el uso de recursos del sistema (CPU, memoria, E/S de disco, PIDs) por grupos de procesos. Los namespaces proporcionan aislamiento de visibilidad, no de recursos.
</details>

### Pregunta 4
¿Cuál es la principal diferencia entre cgroups v1 y cgroups v2?

a) v2 no soporta límites de memoria
b) v1 usa una jerarquía única, v2 usa múltiples
c) v2 usa una jerarquía única unificada, v1 usa múltiples jerarquías independientes
d) v2 solo funciona con Docker, v1 con cualquier runtime

<details><summary>Respuesta</summary>

**c) v2 usa una jerarquía única unificada, v1 usa múltiples jerarquías independientes**

En cgroups v1, cada controlador (cpu, memory, blkio, etc.) tiene su propia jerarquía independiente. En v2, hay una única jerarquía unificada donde todos los controladores se gestionan de forma coherente.
</details>

### Pregunta 5
¿Qué sistema de archivos por capas es el storage driver predeterminado en Docker moderno?

a) AUFS
b) Btrfs
c) OverlayFS (overlay2)
d) DeviceMapper

<details><summary>Respuesta</summary>

**c) OverlayFS (overlay2)**

OverlayFS (driver overlay2) es el storage driver predeterminado en Docker moderno. Combina capas lower (solo lectura) con una capa upper (lectura-escritura) en una vista merged. AUFS fue usado anteriormente pero no está en el kernel mainline.
</details>

### Pregunta 6
¿Qué especificación OCI define el formato de las imágenes de contenedor?

a) Runtime Specification
b) Image Specification
c) Distribution Specification
d) Container Specification

<details><summary>Respuesta</summary>

**b) Image Specification**

La OCI Image Specification define el formato estándar de las imágenes de contenedor: manifest (referencia a configuración y capas), configuration (metadatos) y layers (capas del filesystem como tarballs). La Runtime Spec define cómo ejecutar contenedores.
</details>

### Pregunta 7
¿Qué mecanismo de seguridad filtra las llamadas al sistema (syscalls) que un contenedor puede realizar?

a) Capabilities
b) AppArmor
c) Seccomp
d) Namespaces

<details><summary>Respuesta</summary>

**c) Seccomp**

Seccomp (Secure Computing Mode) filtra las syscalls que un proceso puede realizar. Docker aplica un perfil seccomp por defecto que bloquea syscalls peligrosas. Las capabilities dividen los privilegios de root en unidades, pero no filtran syscalls específicas.
</details>

### Pregunta 8
¿Qué namespace es fundamental para ejecutar contenedores rootless?

a) pid
b) net
c) user
d) mnt

<details><summary>Respuesta</summary>

**c) user**

El namespace user permite mapear UID 0 (root) dentro del contenedor a un UID sin privilegios en el host. Esto es la base de los contenedores rootless: el proceso parece ser root dentro del contenedor pero no tiene privilegios reales en el host.
</details>

### Pregunta 9
¿Cuál es la función de `runc` en la arquitectura de contenedores?

a) Es un registro de imágenes de contenedores
b) Es un runtime OCI de bajo nivel que crea y ejecuta contenedores
c) Es una herramienta de orquestación de contenedores
d) Es un sistema de archivos para contenedores

<details><summary>Respuesta</summary>

**b) Es un runtime OCI de bajo nivel que crea y ejecuta contenedores**

`runc` es la implementación de referencia del runtime OCI. Se encarga de crear los namespaces, configurar cgroups y ejecutar el proceso del contenedor. Herramientas de alto nivel como Docker y containerd usan runc internamente.
</details>

### Pregunta 10
¿Qué archivos del sistema deben estar configurados para que funcionen los contenedores rootless con user namespaces?

a) `/etc/passwd` y `/etc/group`
b) `/etc/subuid` y `/etc/subgid`
c) `/etc/containers/policy.json`
d) `/etc/security/limits.conf`

<details><summary>Respuesta</summary>

**b) `/etc/subuid` y `/etc/subgid`**

`/etc/subuid` y `/etc/subgid` definen los rangos de UIDs y GIDs subordinados que cada usuario puede usar en user namespaces. Ejemplo: `usuario:100000:65536` asigna 65536 UIDs empezando en 100000 al usuario indicado.
</details>
