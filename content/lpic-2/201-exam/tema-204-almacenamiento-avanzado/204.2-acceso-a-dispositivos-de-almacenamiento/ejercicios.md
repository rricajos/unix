---
title: "204.2 - Acceso a dispositivos de almacenamiento"
tags: [lpic-2, examen-201, tema-204, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "204"
subtema: "204.2"
---

# 204.2 - Ejercicios: Acceso a dispositivos de almacenamiento

### Pregunta 1
Que comando se utiliza para descubrir targets iSCSI disponibles en un servidor remoto?

a) `iscsiadm -m node -t sendtargets -p 192.168.1.100`
b) `iscsiadm -m discovery -t sendtargets -p 192.168.1.100`
c) `iscsiadm -m session -t sendtargets -p 192.168.1.100`
d) `iscsi-discover -p 192.168.1.100`

<details>
<summary>Respuesta</summary>

**b) `iscsiadm -m discovery -t sendtargets -p 192.168.1.100`**

El modo `discovery` con el tipo `sendtargets` es el comando correcto para descubrir targets iSCSI. Se usa `-m discovery` para indicar el modo de descubrimiento, `-t sendtargets` como tipo de descubrimiento y `-p` para especificar la IP (y opcionalmente el puerto) del target.
</details>

---

### Pregunta 2
En que archivo se configura el nombre IQN del initiator iSCSI?

a) `/etc/iscsi/iscsid.conf`
b) `/etc/iscsi/initiatorname.iscsi`
c) `/etc/iscsi/iqn.conf`
d) `/var/lib/iscsi/initiator`

<details>
<summary>Respuesta</summary>

**b) `/etc/iscsi/initiatorname.iscsi`**

El archivo `/etc/iscsi/initiatorname.iscsi` contiene el nombre IQN unico del initiator, con el formato `InitiatorName=iqn.AAAA-MM.dominio.invertido:identificador`. Este archivo es leido por el demonio iscsid al iniciar. El archivo `iscsid.conf` contiene la configuracion global del demonio, no el nombre del initiator.
</details>

---

### Pregunta 3
Cual es el puerto TCP por defecto utilizado por iSCSI?

a) 860
b) 3260
c) 3389
d) 5060

<details>
<summary>Respuesta</summary>

**b) 3260**

El puerto TCP 3260 es el puerto estandar asignado por IANA para el protocolo iSCSI. Tanto el target como el initiator utilizan este puerto por defecto para la comunicacion. El puerto 860 fue un puerto alternativo historico pero no es el estandar actual.
</details>

---

### Pregunta 4
Que comando conecta el initiator a un target iSCSI descubierto previamente?

a) `iscsiadm -m node -T iqn.2024-01.com.empresa:lun1 -p 192.168.1.100 --connect`
b) `iscsiadm -m session -T iqn.2024-01.com.empresa:lun1 --start`
c) `iscsiadm -m node -T iqn.2024-01.com.empresa:lun1 -p 192.168.1.100 --login`
d) `iscsiadm -m discovery -T iqn.2024-01.com.empresa:lun1 --login`

<details>
<summary>Respuesta</summary>

**c) `iscsiadm -m node -T iqn.2024-01.com.empresa:lun1 -p 192.168.1.100 --login`**

Para conectar a un target se usa el modo `node` (`-m node`) con la opcion `--login`. Se especifica el target con `-T` seguido del IQN y el portal con `-p` seguido de la IP. El termino "login" en iSCSI equivale a establecer la sesion y hacer disponible el LUN como dispositivo de bloque local.
</details>

---

### Pregunta 5
Que seccion del archivo `/etc/multipath.conf` se utiliza para excluir discos locales del control de multipath?

a) `defaults`
b) `devices`
c) `blacklist`
d) `multipaths`

<details>
<summary>Respuesta</summary>

**c) `blacklist`**

La seccion `blacklist` en `/etc/multipath.conf` permite excluir dispositivos del control de multipathd. Se pueden filtrar por `devnode` (nombre del dispositivo), `wwid`, o por `vendor`/`product`. Es comun excluir discos locales (como los discos ATA del sistema) para que multipath solo gestione los LUNs SAN.
</details>

---

### Pregunta 6
Un administrador necesita que un target iSCSI se conecte automaticamente al arrancar el sistema. Que parametro debe configurar?

a) `node.conn[0].startup = automatic`
b) `node.startup = automatic`
c) `node.session.auto_connect = yes`
d) `discovery.startup = automatic`

<details>
<summary>Respuesta</summary>

**b) `node.startup = automatic`**

El parametro `node.startup` controla si la conexion al target se establece automaticamente durante el arranque. Se configura con: `iscsiadm -m node -T IQN -p IP --op update -n node.startup -v automatic`. El valor por defecto suele ser `manual`, lo que requiere login explicito tras cada reinicio.
</details>

---

### Pregunta 7
Que comando muestra el estado detallado de los dispositivos multipath incluyendo todas las rutas?

a) `multipath -l`
b) `multipath -ll`
c) `multipath -v0`
d) `multipathd status`

<details>
<summary>Respuesta</summary>

**b) `multipath -ll`**

El comando `multipath -ll` (doble L) muestra informacion detallada de todos los dispositivos multipath, incluyendo cada ruta individual, su estado (active/faulty), la politica de balanceo y los grupos de rutas. El comando `multipath -l` (una sola L) muestra informacion menos detallada.
</details>

---

### Pregunta 8
Que directorio contiene los enlaces simbolicos persistentes generados automaticamente por udev basados en el UUID del sistema de archivos?

a) `/dev/disk/by-id/`
b) `/dev/disk/by-uuid/`
c) `/dev/disk/by-path/`
d) `/dev/disk/by-name/`

<details>
<summary>Respuesta</summary>

**b) `/dev/disk/by-uuid/`**

El directorio `/dev/disk/by-uuid/` contiene enlaces simbolicos que apuntan a los dispositivos de bloque usando el UUID del sistema de archivos como nombre. Estos enlaces son generados automaticamente por las reglas udev del sistema y son la forma recomendada para referenciar dispositivos en `/etc/fstab`, ya que el UUID no cambia aunque se muevan los discos a otros puertos.
</details>

---

### Pregunta 9
Que comando de dmsetup permite ver la tabla de mapeo de los dispositivos device-mapper?

a) `dmsetup ls`
b) `dmsetup info`
c) `dmsetup table`
d) `dmsetup map`

<details>
<summary>Respuesta</summary>

**c) `dmsetup table`**

El comando `dmsetup table` muestra la tabla de mapeo de cada dispositivo device-mapper, que describe como se traducen los sectores logicos a fisicos. `dmsetup ls` lista los nombres, `dmsetup info` muestra metadatos generales (estado, numero mayor/menor), y `dmsetup map` no es un subcomando valido.
</details>

---

### Pregunta 10
Que diferencia principal hay entre una SAN y un NAS?

a) SAN usa protocolos TCP/IP y NAS usa protocolos propietarios
b) SAN comparte almacenamiento a nivel de bloque y NAS a nivel de archivo
c) SAN es mas economica que NAS
d) SAN solo funciona con Fibre Channel y NAS solo con Ethernet

<details>
<summary>Respuesta</summary>

**b) SAN comparte almacenamiento a nivel de bloque y NAS a nivel de archivo**

La diferencia fundamental es el nivel de abstraccion: una SAN presenta dispositivos de bloque al servidor (como si fueran discos locales), mientras que un NAS comparte sistemas de archivos ya formateados usando protocolos como NFS o SMB/CIFS. En una SAN, el servidor crea su propio sistema de archivos sobre el LUN; en un NAS, el sistema de archivos lo gestiona el servidor NAS.
</details>

---
