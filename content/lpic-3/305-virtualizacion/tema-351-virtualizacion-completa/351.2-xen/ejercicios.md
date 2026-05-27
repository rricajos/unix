---
title: "351.2 - Ejercicios: Xen"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.2"
peso: 3
tags:
  - lpic-3
  - tema-351
  - ejercicios
  - xen
---

# Ejercicios - 351.2 Xen

### Pregunta 1
¿Qué es Dom0 en la arquitectura Xen?

a) Un dominio guest sin privilegios
b) El hipervisor Xen en sí mismo
c) El dominio privilegiado que gestiona el hardware y los DomU
d) Un dominio especial para almacenamiento

<details><summary>Respuesta</summary>

**c) El dominio privilegiado que gestiona el hardware y los DomU**

Dom0 es el primer dominio que arranca, tiene acceso directo al hardware, ejecuta los drivers y es necesario para gestionar los dominios guest (DomU). Sin Dom0, Xen no puede funcionar.
</details>

### Pregunta 2
¿Qué tipo de guest Xen requiere que el kernel del sistema operativo esté modificado?

a) HVM
b) PVH
c) PV
d) Todos los tipos

<details><summary>Respuesta</summary>

**c) PV**

Los guests PV (Paravirtualizados) requieren un kernel modificado que use hypercalls para comunicarse con el hipervisor. Los HVM usan virtualización completa con hardware assist y no necesitan modificaciones. PVH es un híbrido que tampoco requiere kernel modificado.
</details>

### Pregunta 3
¿Qué comando de xl detiene forzosamente un dominio Xen de forma inmediata?

a) `xl shutdown mi-vm`
b) `xl stop mi-vm`
c) `xl destroy mi-vm`
d) `xl kill mi-vm`

<details><summary>Respuesta</summary>

**c) `xl destroy mi-vm`**

`xl destroy` detiene el dominio inmediatamente (equivalente a desconectar el cable de alimentación). `xl shutdown` envía una señal ACPI para un apagado ordenado. Los comandos `stop` y `kill` no existen en xl.
</details>

### Pregunta 4
En un archivo de configuración xl.cfg, ¿qué valor debe tener el parámetro `builder` para un guest HVM?

a) `"generic"`
b) `"hvm"`
c) `"pvh"`
d) `"full"`

<details><summary>Respuesta</summary>

**b) `"hvm"`**

El parámetro `builder = "hvm"` configura un guest de virtualización completa. `builder = "generic"` se usa para guests PV. Para PVH se usa `type = "pvh"` en versiones recientes.
</details>

### Pregunta 5
¿Qué herramienta proporciona monitorización en tiempo real de los dominios Xen similar a `top`?

a) `xl monitor`
b) `xen-monitor`
c) `xentop`
d) `xl top`

<details><summary>Respuesta</summary>

**c) `xentop`**

`xentop` es una herramienta interactiva que muestra el uso de CPU, memoria, red y disco de todos los dominios Xen en tiempo real. Soporta modo batch con `-b` y personalización del intervalo con `-d`.
</details>

### Pregunta 6
¿Qué es xenstore?

a) Un sistema de archivos para almacenar imágenes de VM
b) Una base de datos jerárquica compartida entre Dom0 y DomU para información de configuración
c) Un repositorio de plantillas de configuración Xen
d) El almacén de snapshots de dominios Xen

<details><summary>Respuesta</summary>

**b) Una base de datos jerárquica compartida entre Dom0 y DomU para información de configuración**

Xenstore permite a Dom0 y los DomU intercambiar información de configuración en tiempo real. Se accede mediante `xenstore-read`, `xenstore-write`, `xenstore-ls` y `xenstore-watch`.
</details>

### Pregunta 7
¿Qué formato de disco en xl.cfg permite usar un volumen LVM como almacenamiento?

a) `file:/dev/vg0/disco,xvda,w`
b) `lvm:/dev/vg0/disco,xvda,w`
c) `phy:/dev/vg0/disco,xvda,w`
d) `block:/dev/vg0/disco,xvda,w`

<details><summary>Respuesta</summary>

**c) `phy:/dev/vg0/disco,xvda,w`**

El prefijo `phy:` se usa para dispositivos de bloques físicos, incluyendo volúmenes LVM. `file:` es para imágenes en archivos regulares. Los prefijos `lvm:` y `block:` no existen en la sintaxis de xl.cfg.
</details>

### Pregunta 8
¿Qué comando realiza la migración en vivo de un dominio Xen a otro host?

a) `xl move mi-vm host-destino`
b) `xl migrate mi-vm host-destino`
c) `xl transfer mi-vm host-destino`
d) `xl live-migrate mi-vm host-destino`

<details><summary>Respuesta</summary>

**b) `xl migrate mi-vm host-destino`**

`xl migrate` realiza la migración en vivo de un dominio a otro host Xen. Requiere almacenamiento compartido (NFS, DRBD, etc.) y conectividad de red entre ambos hosts.
</details>

### Pregunta 9
¿Qué tipo de guest Xen combina extensiones de hardware para CPU con drivers paravirtualizados para E/S?

a) PV
b) HVM
c) PVH
d) PVHVM

<details><summary>Respuesta</summary>

**c) PVH**

PVH (PV in HVM container) es un modo híbrido que usa extensiones de hardware (VT-x) para la virtualización de CPU pero emplea drivers paravirtualizados para E/S, combinando las ventajas de ambos enfoques. Es el modo recomendado en Xen moderno.
</details>

### Pregunta 10
¿Qué herramienta de línea de comandos reemplazó a `xm` en las versiones recientes de Xen?

a) `xen-cli`
b) `xenctl`
c) `xl`
d) `xapi`

<details><summary>Respuesta</summary>

**c) `xl`**

`xl` reemplazó a `xm` como herramienta principal de gestión de dominios Xen. `xm` dependía del demonio `xend` que fue eliminado. `xl` interactúa directamente con el hipervisor a través de `libxl`.
</details>
