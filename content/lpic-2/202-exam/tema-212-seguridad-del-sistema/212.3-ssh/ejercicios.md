---
title: "212.3 - SSH: Ejercicios"
tags: [lpic-2, examen-202, tema-212, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.3"
---

# 212.3 - SSH: Ejercicios

### Pregunta 1

¿Qué directiva de sshd_config permite el acceso root solo mediante clave pública, bloqueando la autenticación por contraseña?

a) `PermitRootLogin yes`
b) `PermitRootLogin no`
c) `PermitRootLogin prohibit-password`
d) `PermitRootLogin publickey-only`

<details>
<summary>Respuesta</summary>

**c) `PermitRootLogin prohibit-password`**

La opción `prohibit-password` (anteriormente `without-password`) permite el login de root únicamente mediante autenticación por clave pública, deshabilitando la autenticación por contraseña y teclado interactivo para el usuario root.
</details>

---

### Pregunta 2

Un administrador quiere crear usuarios que solo puedan usar SFTP y estén confinados a su directorio home. ¿Qué configuración en sshd_config es correcta?

a) `Match Group sftponly` con `ForceCommand /usr/bin/sftp` y `ChrootDirectory /home/%u`
b) `Match Group sftponly` con `ForceCommand internal-sftp` y `ChrootDirectory /home/%u`
c) `SFTPOnly yes` con `ChrootDirectory /home/%u`
d) `Match Group sftponly` con `Shell /bin/sftp`

<details>
<summary>Respuesta</summary>

**b) `Match Group sftponly` con `ForceCommand internal-sftp` y `ChrootDirectory /home/%u`**

`ForceCommand internal-sftp` usa el subsistema SFTP integrado en sshd (necesario con chroot). `ChrootDirectory /home/%u` confina al usuario. El directorio chroot debe ser propiedad de root y no tener permisos de escritura para el grupo u otros.
</details>

---

### Pregunta 3

¿Qué comando crea un túnel que permite acceder al puerto 3306 de un servidor de base de datos remoto a través de localhost:13306?

a) `ssh -R 13306:localhost:3306 usuario@servidor`
b) `ssh -L 13306:db-server:3306 usuario@servidor`
c) `ssh -D 13306 usuario@servidor`
d) `ssh -L 3306:13306 usuario@servidor`

<details>
<summary>Respuesta</summary>

**b) `ssh -L 13306:db-server:3306 usuario@servidor`**

La opción `-L` crea un túnel local: `ssh -L puerto_local:destino:puerto_destino usuario@servidor_ssh`. Las conexiones al puerto local 13306 se reenvían a través del servidor SSH hacia db-server:3306.
</details>

---

### Pregunta 4

¿Qué comando se usa para eliminar la entrada de un servidor del archivo `known_hosts`?

a) `ssh-keygen -D servidor.ejemplo.com`
b) `ssh-keygen -R servidor.ejemplo.com`
c) `ssh-agent -R servidor.ejemplo.com`
d) `ssh -remove-host servidor.ejemplo.com`

<details>
<summary>Respuesta</summary>

**b) `ssh-keygen -R servidor.ejemplo.com`**

El comando `ssh-keygen -R hostname` elimina todas las claves asociadas a ese hostname del archivo `known_hosts`. Esto es necesario cuando un servidor ha sido reinstalado y su huella digital ha cambiado.
</details>

---

### Pregunta 5

¿Qué opción de ssh_config permite reutilizar una conexión SSH existente para múltiples sesiones al mismo host?

a) `ConnectionReuse yes`
b) `ControlMaster auto`
c) `Multiplexing yes`
d) `SessionShare auto`

<details>
<summary>Respuesta</summary>

**b) `ControlMaster auto`**

`ControlMaster auto` habilita la multiplexación de conexiones SSH. Junto con `ControlPath` (ruta del socket) y `ControlPersist` (tiempo de vida), permite que conexiones posteriores al mismo host reutilicen la conexión existente sin repetir la autenticación.
</details>

---

### Pregunta 6

¿Qué permisos debe tener el archivo de clave privada SSH `~/.ssh/id_ed25519` para que OpenSSH lo acepte?

a) 644
b) 755
c) 600
d) 700

<details>
<summary>Respuesta</summary>

**c) 600**

Las claves privadas SSH deben tener permisos 600 (lectura y escritura solo para el propietario). OpenSSH rechazará usar una clave privada si tiene permisos demasiado abiertos, mostrando el mensaje "Permissions are too open".
</details>

---

### Pregunta 7

¿Qué opción de la línea de comandos ssh permite saltar a través de un servidor intermedio (bastion host) para llegar al destino final?

a) `-B bastion`
b) `-J bastion`
c) `-P bastion`
d) `-G bastion`

<details>
<summary>Respuesta</summary>

**b) `-J bastion`**

La opción `-J` (ProxyJump) permite especificar uno o más hosts intermedios para llegar al destino. Es equivalente a la directiva `ProxyJump` en ssh_config. Se pueden encadenar múltiples saltos: `ssh -J bastion1,bastion2 usuario@destino`.
</details>

---

### Pregunta 8

Si se definen las directivas `AllowUsers` y `DenyUsers` en sshd_config, ¿cuál se evalúa primero?

a) AllowUsers se evalúa primero
b) DenyUsers se evalúa primero
c) Se evalúan simultáneamente
d) La última directiva en el archivo tiene prioridad

<details>
<summary>Respuesta</summary>

**b) DenyUsers se evalúa primero**

El orden de evaluación de acceso en sshd es: DenyUsers -> AllowUsers -> DenyGroups -> AllowGroups. Primero se verifican las listas de denegación, luego las de permitidos. Si un usuario aparece en DenyUsers, será denegado sin importar las demás directivas.
</details>

---

### Pregunta 9

¿Qué opción en el archivo `authorized_keys` permite restringir una clave pública para que solo pueda ejecutar un comando específico?

a) `force="/usr/bin/comando"`
b) `command="/usr/bin/comando"`
c) `restrict="/usr/bin/comando"`
d) `exec="/usr/bin/comando"`

<details>
<summary>Respuesta</summary>

**b) `command="/usr/bin/comando"`**

La opción `command="..."` al inicio de una línea en `authorized_keys` fuerza la ejecución de un comando específico cuando esa clave se usa para autenticarse, ignorando cualquier comando proporcionado por el cliente. Se combina con opciones como `no-pty` y `no-port-forwarding` para mayor restricción.
</details>

---

### Pregunta 10

¿Qué hace el comando `ssh -D 1080 usuario@servidor`?

a) Crea un túnel directo al puerto 1080 del servidor
b) Descarga archivos del servidor al puerto local 1080
c) Crea un proxy SOCKS dinámico en el puerto local 1080
d) Establece el tiempo de desconexión a 1080 segundos

<details>
<summary>Respuesta</summary>

**c) Crea un proxy SOCKS dinámico en el puerto local 1080**

La opción `-D` crea un proxy SOCKS5 en el puerto local especificado. Todo el tráfico dirigido a este proxy se cifra y se envía a través de la conexión SSH, donde el servidor lo reenvía al destino final. Es útil para navegar de forma segura a través de un servidor remoto.
</details>
