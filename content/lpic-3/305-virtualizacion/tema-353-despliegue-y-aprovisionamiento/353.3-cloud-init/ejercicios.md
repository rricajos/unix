---
title: "353.3 - Ejercicios: cloud-init"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.3"
peso: 3
tags:
  - lpic-3
  - tema-353
  - ejercicios
  - cloud-init
---

# Ejercicios - 353.3 cloud-init

### Pregunta 1
¿Cuál debe ser la primera línea de un archivo user-data en formato cloud-config?

a) `---`
b) `#cloud-config`
c) `cloud-config:`
d) `#!/bin/cloud-config`

<details><summary>Respuesta</summary>

**b) `#cloud-config`**

La primera línea `#cloud-config` es obligatoria para que cloud-init identifique el formato como cloud-config YAML. Sin esta línea, cloud-init no procesará el archivo correctamente. A pesar de parecer un comentario, es un marcador de formato.
</details>

### Pregunta 2
¿Cuáles son las cuatro etapas de ejecución de cloud-init en orden?

a) boot, network, config, scripts
b) init-local, init, config, final
c) pre-init, init, post-init, cleanup
d) detect, configure, provision, finalize

<details><summary>Respuesta</summary>

**b) init-local, init, config, final**

Las etapas son: 1) `init-local` (detecta datasource local antes de la red), 2) `init` (obtiene metadata, configura red), 3) `config` (ejecuta módulos de configuración como SSH y usuarios), 4) `final` (ejecuta runcmd, instala paquetes, scripts de usuario).
</details>

### Pregunta 3
¿Qué datasource de cloud-init se utiliza para pruebas locales con QEMU/KVM sin plataforma cloud?

a) Local
b) None
c) NoCloud
d) ConfigDrive

<details><summary>Respuesta</summary>

**c) NoCloud**

NoCloud permite usar cloud-init sin plataforma cloud. Se proporcionan user-data y meta-data a través de un ISO con volid `cidata`, un directorio en el filesystem, o una URL especificada en los parámetros del kernel (`ds=nocloud;s=URL`).
</details>

### Pregunta 4
¿Qué volid debe tener el ISO de NoCloud para que cloud-init lo reconozca?

a) `cloud-init`
b) `nocloud`
c) `cidata`
d) `userdata`

<details><summary>Respuesta</summary>

**c) `cidata`**

El ISO debe crearse con volid `cidata`: `genisoimage -output seed.iso -volid cidata -joliet -rock user-data meta-data`. cloud-init busca específicamente este volid para detectar el datasource NoCloud.
</details>

### Pregunta 5
¿Qué módulo de cloud-config permite ejecutar comandos durante la etapa final del arranque?

a) `commands`
b) `exec`
c) `runcmd`
d) `bootcmd`

<details><summary>Respuesta</summary>

**c) `runcmd`**

`runcmd` ejecuta comandos en la etapa final de cloud-init, después de que la red y los paquetes estén configurados. `bootcmd` existe también pero se ejecuta muy temprano en el arranque, en cada boot (no solo el primero).
</details>

### Pregunta 6
¿Qué comando verifica el estado de ejecución de cloud-init?

a) `systemctl status cloud-init`
b) `cloud-init status`
c) `cloud-init check`
d) `cloud-init info`

<details><summary>Respuesta</summary>

**b) `cloud-init status`**

`cloud-init status` muestra el estado actual: `running`, `done`, o `error`. Con `--long` muestra detalles adicionales. Con `--wait` espera a que cloud-init termine antes de retornar.
</details>

### Pregunta 7
¿Qué comando permite que cloud-init se vuelva a ejecutar en el próximo arranque?

a) `cloud-init reset`
b) `cloud-init restart`
c) `cloud-init clean`
d) `cloud-init rerun`

<details><summary>Respuesta</summary>

**c) `cloud-init clean`**

`cloud-init clean` elimina los archivos de estado que cloud-init usa para saber que ya se ejecutó. En el próximo arranque, cloud-init se ejecutará como si fuera la primera vez. `--logs` también limpia los archivos de log.
</details>

### Pregunta 8
¿Qué módulo de cloud-config permite crear archivos con contenido específico en el sistema de archivos?

a) `create_files`
b) `file_content`
c) `write_files`
d) `copy_files`

<details><summary>Respuesta</summary>

**c) `write_files`**

`write_files` permite crear archivos con contenido específico, especificando path, content, owner y permissions. Es útil para crear archivos de configuración durante el primer arranque.
</details>

### Pregunta 9
¿Qué archivo contiene el log principal con la salida de los scripts ejecutados por cloud-init?

a) `/var/log/cloud-init.log`
b) `/var/log/cloud-init-output.log`
c) `/var/log/syslog`
d) `/var/log/cloud-init/scripts.log`

<details><summary>Respuesta</summary>

**b) `/var/log/cloud-init-output.log`**

`/var/log/cloud-init-output.log` contiene la salida (stdout/stderr) de los scripts y comandos ejecutados por cloud-init. `/var/log/cloud-init.log` contiene los mensajes internos de cloud-init (debug, info, warning).
</details>

### Pregunta 10
¿Qué formato de user-data se activa cuando la primera línea contiene un shebang como `#!/bin/bash`?

a) cloud-config YAML
b) Script de shell ejecutable
c) Formato MIME multipart
d) Formato Jinja template

<details><summary>Respuesta</summary>

**b) Script de shell ejecutable**

Cuando cloud-init detecta que el user-data comienza con un shebang (`#!/bin/bash`, `#!/usr/bin/python3`, etc.), lo trata como un script ejecutable y lo ejecuta en la etapa final. Si comienza con `#cloud-config`, lo trata como YAML. También soporta formato MIME multipart para combinar ambos.
</details>
