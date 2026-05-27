---
title: "353.4 - Ejercicios: Vagrant"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.4"
peso: 3
tags:
  - lpic-3
  - tema-353
  - ejercicios
  - vagrant
---

# Ejercicios - 353.4 Vagrant

### Pregunta 1
¿Qué lenguaje utiliza el Vagrantfile para definir la configuración?

a) YAML
b) JSON
c) Ruby DSL
d) HCL

<details><summary>Respuesta</summary>

**c) Ruby DSL**

El Vagrantfile usa Ruby DSL (Domain Specific Language). La configuración se define dentro de un bloque `Vagrant.configure("2") do |config| ... end`. Aunque es Ruby, no se requieren conocimientos profundos del lenguaje para escribir Vagrantfiles básicos.
</details>

### Pregunta 2
¿Qué comando crea e inicia una máquina virtual definida en el Vagrantfile?

a) `vagrant start`
b) `vagrant create`
c) `vagrant up`
d) `vagrant init`

<details><summary>Respuesta</summary>

**c) `vagrant up`**

`vagrant up` crea la VM (si no existe), la configura y la inicia. Si la VM ya existe pero está detenida, simplemente la inicia. `vagrant init` solo crea el Vagrantfile inicial. `vagrant start` no existe como comando.
</details>

### Pregunta 3
¿Qué es un "box" en el contexto de Vagrant?

a) Un contenedor Docker
b) Una imagen base preconfigurada que sirve como plantilla para crear VMs
c) Un directorio de proyecto Vagrant
d) Un plugin de Vagrant

<details><summary>Respuesta</summary>

**b) Una imagen base preconfigurada que sirve como plantilla para crear VMs**

Un box es una imagen de máquina virtual empaquetada que Vagrant usa como base para crear nuevas VMs. Los boxes se descargan de Vagrant Cloud (por ejemplo `ubuntu/jammy64`) y se almacenan localmente en `~/.vagrant.d/boxes/`.
</details>

### Pregunta 4
¿Qué comando ejecuta los provisioners en una VM que ya está en funcionamiento?

a) `vagrant up --provision`
b) `vagrant provision`
c) `vagrant reload --provision`
d) Todas las anteriores son válidas

<details><summary>Respuesta</summary>

**d) Todas las anteriores son válidas**

`vagrant provision` ejecuta los provisioners en una VM en ejecución. `vagrant up --provision` los ejecuta al iniciar. `vagrant reload --provision` reinicia la VM y ejecuta los provisioners. Todos logran ejecutar los provisioners, pero en contextos diferentes.
</details>

### Pregunta 5
¿Cuál es el provider por defecto de Vagrant?

a) Libvirt
b) Docker
c) VirtualBox
d) Hyper-V

<details><summary>Respuesta</summary>

**c) VirtualBox**

VirtualBox es el provider por defecto de Vagrant. Para usar otros providers como libvirt, se necesita instalar el plugin correspondiente (`vagrant plugin install vagrant-libvirt`) y especificarlo con `vagrant up --provider=libvirt`.
</details>

### Pregunta 6
¿Cómo se define una red privada con IP estática en el Vagrantfile?

a) `config.vm.network "host_only", ip: "192.168.56.10"`
b) `config.vm.network "private_network", ip: "192.168.56.10"`
c) `config.vm.ip = "192.168.56.10"`
d) `config.vm.network "static", address: "192.168.56.10"`

<details><summary>Respuesta</summary>

**b) `config.vm.network "private_network", ip: "192.168.56.10"`**

`private_network` crea una red host-only donde la VM es accesible desde el host por la IP especificada. `public_network` crea una red bridge. `forwarded_port` redirige puertos específicos.
</details>

### Pregunta 7
¿Cómo se define un entorno multi-máquina en el Vagrantfile?

a) Creando múltiples Vagrantfiles
b) Usando `config.vm.define "nombre" do |nombre| ... end`
c) Usando `config.vm.multi = true`
d) Usando `config.cluster.add "nombre"`

<details><summary>Respuesta</summary>

**b) Usando `config.vm.define "nombre" do |nombre| ... end`**

Cada VM se define con un bloque `config.vm.define` con un nombre único. Esto permite definir múltiples VMs con diferentes configuraciones en un solo Vagrantfile. Los comandos vagrant aceptan el nombre como argumento (ej. `vagrant ssh web`).
</details>

### Pregunta 8
¿Qué comando de Vagrant crea un snapshot de la VM actual?

a) `vagrant snapshot create mi-snap`
b) `vagrant snapshot save mi-snap`
c) `vagrant save mi-snap`
d) `vagrant checkpoint mi-snap`

<details><summary>Respuesta</summary>

**b) `vagrant snapshot save mi-snap`**

`vagrant snapshot save` crea un snapshot con nombre. `vagrant snapshot list` los lista, `vagrant snapshot restore` restaura y `vagrant snapshot delete` elimina. También existen `push` y `pop` para gestionar snapshots como una pila.
</details>

### Pregunta 9
¿Qué tipo de red Vagrant conecta la VM directamente a la red física del host mediante bridge?

a) `private_network`
b) `public_network`
c) `bridged_network`
d) `forwarded_port`

<details><summary>Respuesta</summary>

**b) `public_network`**

`public_network` crea una interfaz bridge que conecta la VM directamente a la red física, obteniendo una IP de la misma red que el host. Se configura con `config.vm.network "public_network"`, opcionalmente especificando la interfaz de bridge.
</details>

### Pregunta 10
¿Cuál es la carpeta compartida por defecto entre el host y la VM en Vagrant?

a) El directorio home del usuario se monta en `/home/vagrant`
b) El directorio del Vagrantfile se monta en `/vagrant` dentro de la VM
c) No hay carpeta compartida por defecto
d) `/tmp` del host se monta en `/tmp` de la VM

<details><summary>Respuesta</summary>

**b) El directorio del Vagrantfile se monta en `/vagrant` dentro de la VM**

Por defecto, Vagrant comparte el directorio donde se encuentra el Vagrantfile como `/vagrant` dentro de la VM. Esto permite acceder fácilmente a los archivos del proyecto desde la VM. Se puede desactivar con `config.vm.synced_folder ".", "/vagrant", disabled: true`.
</details>
