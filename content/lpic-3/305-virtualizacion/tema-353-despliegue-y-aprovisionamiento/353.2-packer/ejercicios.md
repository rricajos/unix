---
title: "353.2 - Ejercicios: Packer"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.2"
peso: 2
tags:
  - lpic-3
  - tema-353
  - ejercicios
  - packer
---

# Ejercicios - 353.2 Packer

### Pregunta 1
¿Cuáles son los tres componentes principales de un template de Packer?

a) Source, Target, Pipeline
b) Builder, Provisioner, Post-processor
c) Image, Script, Output
d) Provider, Resource, Module

<details><summary>Respuesta</summary>

**b) Builder, Provisioner, Post-processor**

Los tres componentes de un template Packer son: Builder (crea la imagen para una plataforma), Provisioner (configura la imagen durante la construcción) y Post-processor (procesa la imagen resultante, como comprimir o subir).
</details>

### Pregunta 2
¿Qué comando de Packer verifica la sintaxis de un template sin construir la imagen?

a) `packer check .`
b) `packer validate .`
c) `packer verify .`
d) `packer lint .`

<details><summary>Respuesta</summary>

**b) `packer validate .`**

`packer validate` verifica que el template es sintácticamente correcto y que todas las configuraciones requeridas están presentes, sin iniciar ningún proceso de construcción.
</details>

### Pregunta 3
¿Qué formato de template utiliza Packer en versiones modernas (1.7+)?

a) JSON exclusivamente
b) YAML
c) HCL2 (archivos .pkr.hcl)
d) TOML

<details><summary>Respuesta</summary>

**c) HCL2 (archivos .pkr.hcl)**

HCL2 (HashiCorp Configuration Language v2) es el formato recomendado desde Packer 1.7+. Los archivos usan la extensión `.pkr.hcl`. El formato JSON anterior sigue soportado pero se considera legacy.
</details>

### Pregunta 4
¿Qué provisioner de Packer permite subir archivos desde el host a la imagen en construcción?

a) `upload`
b) `copy`
c) `file`
d) `transfer`

<details><summary>Respuesta</summary>

**c) `file`**

El provisioner `file` sube archivos o directorios desde el host a la imagen en construcción. Como las subidas suelen ejecutarse sin privilegios, es común subir a `/tmp/` y luego mover con un provisioner `shell` usando sudo.
</details>

### Pregunta 5
¿Qué opción de `packer build` permite construir solo un source específico de un template multi-plataforma?

a) `packer build --source qemu.ubuntu .`
b) `packer build -only=qemu.ubuntu .`
c) `packer build --target qemu.ubuntu .`
d) `packer build --builder qemu .`

<details><summary>Respuesta</summary>

**b) `packer build -only=qemu.ubuntu .`**

La opción `-only` filtra qué sources se construyen. El formato es `tipo.nombre` (ej. `qemu.ubuntu`). La opción inversa es `-except` para excluir sources específicos.
</details>

### Pregunta 6
¿Cuál es la principal ventaja de usar Packer para crear imágenes?

a) Es más rápido que clonar VMs manualmente
b) Permite crear imágenes idénticas para múltiples plataformas desde un único template
c) Incluye un hipervisor integrado
d) Reemplaza la necesidad de usar Terraform

<details><summary>Respuesta</summary>

**b) Permite crear imágenes idénticas para múltiples plataformas desde un único template**

Packer puede construir imágenes para QEMU, VirtualBox, VMware, AWS, Azure, GCP y más, todo desde un único template. Esto garantiza que las imágenes sean idénticas independientemente de la plataforma de destino.
</details>

### Pregunta 7
¿Qué builder de Packer crea imágenes para QEMU/KVM en formato qcow2?

a) `kvm`
b) `libvirt`
c) `qemu`
d) `qcow2`

<details><summary>Respuesta</summary>

**c) `qemu`**

El builder `qemu` crea imágenes para QEMU/KVM. Puede generar imágenes en formatos qcow2 y raw. Se configura con opciones como `format`, `accelerator`, `disk_size`, `memory`, etc.
</details>

### Pregunta 8
¿Qué post-processor de Packer convierte la imagen resultante en un box de Vagrant?

a) `vagrant-box`
b) `vagrant`
c) `box`
d) `vagrant-export`

<details><summary>Respuesta</summary>

**b) `vagrant`**

El post-processor `vagrant` convierte la imagen resultante en un archivo `.box` compatible con Vagrant. Esto permite usar imágenes creadas con Packer directamente en entornos Vagrant.
</details>

### Pregunta 9
¿En qué bloque HCL2 de Packer se definen los provisioners y post-processors?

a) `source { }`
b) `build { }`
c) `template { }`
d) `config { }`

<details><summary>Respuesta</summary>

**b) `build { }`**

El bloque `build` asocia uno o más `sources` con `provisioners` y `post-processors`. El bloque `source` define el builder y la configuración de la imagen base. El bloque `build` orquesta todo el proceso de construcción.
</details>

### Pregunta 10
¿Qué comando inicializa Packer descargando los plugins necesarios definidos en el template?

a) `packer setup`
b) `packer install`
c) `packer init .`
d) `packer get`

<details><summary>Respuesta</summary>

**c) `packer init .`**

`packer init` lee el bloque `packer { required_plugins { } }` del template y descarga los plugins necesarios. Es similar a `terraform init` en Terraform. Debe ejecutarse antes del primer build o cuando se añaden nuevos plugins.
</details>
