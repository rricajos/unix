---
title: "351.3 - Ejercicios: QEMU"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.3"
peso: 4
tags:
  - lpic-3
  - tema-351
  - ejercicios
  - qemu
  - qemu-img
---

# Ejercicios - 351.3 QEMU

### Pregunta 1
¿Qué opción de qemu-system-x86_64 activa la aceleración por hardware KVM?

a) `-kvm`
b) `-accel hardware`
c) `-enable-kvm`
d) `-use-kvm`

<details><summary>Respuesta</summary>

**c) `-enable-kvm`**

La opción `-enable-kvm` (o `-accel kvm`) activa la aceleración KVM, permitiendo que QEMU use las extensiones de virtualización del procesador (VT-x/AMD-V) para ejecutar código nativo en lugar de emular.
</details>

### Pregunta 2
¿Qué comando crea una imagen de disco qcow2 de 20GB?

a) `qemu-img new -f qcow2 disco.qcow2 20G`
b) `qemu-img create -f qcow2 disco.qcow2 20G`
c) `qemu-img make -t qcow2 disco.qcow2 20G`
d) `qemu-img init -format qcow2 disco.qcow2 20G`

<details><summary>Respuesta</summary>

**b) `qemu-img create -f qcow2 disco.qcow2 20G`**

`qemu-img create` es el subcomando para crear imágenes. `-f qcow2` especifica el formato. El tamaño 20G es el tamaño máximo virtual (con thin provisioning en qcow2, el archivo físico será mucho menor inicialmente).
</details>

### Pregunta 3
¿Qué formato de imagen de disco NO soporta snapshots internos?

a) qcow2
b) raw
c) Ambos los soportan
d) Ninguno los soporta

<details><summary>Respuesta</summary>

**b) raw**

El formato raw no soporta snapshots, compresión, cifrado ni backing files. Es el formato más simple y de mejor rendimiento puro, pero carece de funcionalidades avanzadas. Solo qcow2 soporta snapshots internos.
</details>

### Pregunta 4
¿Qué comando convierte una imagen de formato raw a qcow2 con compresión?

a) `qemu-img convert -c -f raw -O qcow2 disco.raw disco.qcow2`
b) `qemu-img compress -f raw -O qcow2 disco.raw disco.qcow2`
c) `qemu-img convert --compress raw:disco.raw qcow2:disco.qcow2`
d) `qemu-img transform -c -i disco.raw -o disco.qcow2`

<details><summary>Respuesta</summary>

**a) `qemu-img convert -c -f raw -O qcow2 disco.raw disco.qcow2`**

`-c` activa la compresión, `-f raw` indica el formato de origen, `-O qcow2` el formato de destino. La compresión reduce el tamaño del archivo pero puede impactar el rendimiento de lectura.
</details>

### Pregunta 5
¿Qué comando del QEMU Monitor crea un snapshot completo del estado de la VM (incluyendo memoria)?

a) `snapshot create`
b) `savevm mi-snap`
c) `create-snapshot mi-snap`
d) `snap -c mi-snap`

<details><summary>Respuesta</summary>

**b) `savevm mi-snap`**

En el QEMU Monitor, `savevm` crea un snapshot completo que incluye disco, memoria RAM y estado de dispositivos. `loadvm` restaura el snapshot. Esto solo funciona con imágenes qcow2.
</details>

### Pregunta 6
¿Qué es un backing file en el contexto de imágenes qcow2?

a) Una copia de seguridad automática de la imagen
b) Una imagen base de solo lectura sobre la que se registran solo los cambios (copy-on-write)
c) Un archivo de metadatos que describe la imagen
d) Un archivo de log de cambios realizados en la imagen

<details><summary>Respuesta</summary>

**b) Una imagen base de solo lectura sobre la que se registran solo los cambios (copy-on-write)**

Los backing files implementan copy-on-write: la imagen nueva solo almacena los bloques que difieren de la base. Esto permite crear múltiples VMs derivadas de una imagen base compartida de forma muy eficiente en espacio.
</details>

### Pregunta 7
¿Cuál es la diferencia principal entre VNC y SPICE para acceso remoto a VMs?

a) VNC soporta audio y USB remoto, SPICE no
b) SPICE ofrece mejor rendimiento de escritorio, audio y soporte USB remoto
c) VNC es más rápido que SPICE en todos los escenarios
d) SPICE solo funciona sin KVM

<details><summary>Respuesta</summary>

**b) SPICE ofrece mejor rendimiento de escritorio, audio y soporte USB remoto**

SPICE está optimizado para entornos de escritorio con soporte nativo para audio, redirección USB, copiar/pegar bidireccional y ajuste dinámico de resolución. VNC es más universal pero más básico.
</details>

### Pregunta 8
¿Qué opción permite iniciar una VM QEMU sin interfaz gráfica, redirigiendo la salida a la consola serial?

a) `-display none`
b) `-nographic`
c) `-headless`
d) `-no-gui`

<details><summary>Respuesta</summary>

**b) `-nographic`**

`-nographic` desactiva la salida gráfica y redirige la consola serial y el monitor QEMU a la terminal. El guest debe estar configurado con `console=ttyS0` en los parámetros del kernel.
</details>

### Pregunta 9
¿Qué comando muestra la cadena completa de backing files de una imagen qcow2?

a) `qemu-img info disco.qcow2`
b) `qemu-img info --backing-chain disco.qcow2`
c) `qemu-img chain disco.qcow2`
d) `qemu-img check --chain disco.qcow2`

<details><summary>Respuesta</summary>

**b) `qemu-img info --backing-chain disco.qcow2`**

`--backing-chain` muestra la información de la imagen y de todos sus backing files encadenados, desde la imagen actual hasta la imagen base original. Sin esta opción, solo muestra el backing file inmediato.
</details>

### Pregunta 10
¿Qué interfaz de disco virtual ofrece el mejor rendimiento con drivers paravirtualizados en QEMU/KVM?

a) IDE
b) SCSI
c) SATA
d) virtio

<details><summary>Respuesta</summary>

**d) virtio**

Los dispositivos virtio son drivers paravirtualizados que comunican directamente con el hipervisor sin emular hardware real. Se especifican con `-drive file=disco.qcow2,if=virtio` y ofrecen significativamente mejor rendimiento que IDE, SCSI o SATA emulados.
</details>
