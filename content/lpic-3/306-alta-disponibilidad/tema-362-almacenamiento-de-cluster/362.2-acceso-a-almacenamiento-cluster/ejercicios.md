---
title: "362.2 - Ejercicios: Acceso a Almacenamiento Cluster"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "362 - Almacenamiento de Cluster"
subtema: "362.2"
peso: 3
tags:
  - lpic-3
  - tema-362
  - ejercicios
  - iscsi
  - multipath
---

# 362.2 - Ejercicios: Acceso a Almacenamiento Cluster

### Pregunta 1
¿Que tipo de almacenamiento proporciona acceso a nivel de bloque a traves de una red dedicada?

a) DAS
b) NAS
c) SAN
d) NFS

<details><summary>Respuesta</summary>

**c) SAN**

SAN (Storage Area Network) proporciona acceso a nivel de bloque a traves de una red dedicada usando protocolos como Fibre Channel o iSCSI. NAS proporciona acceso a nivel de archivo.
</details>

### Pregunta 2
¿Cual es el puerto TCP predeterminado de iSCSI?

a) 860
b) 3260
c) 3306
d) 5432

<details><summary>Respuesta</summary>

**b) 3260**

El puerto predeterminado para iSCSI es 3260/TCP. Este se configura en los portals del target.
</details>

### Pregunta 3
¿Que herramienta se usa para configurar iSCSI targets usando LIO en Linux?

a) iscsiadm
b) tgtadm
c) targetcli
d) iscsi-target

<details><summary>Respuesta</summary>

**c) targetcli**

`targetcli` es la interfaz de linea de comandos interactiva para configurar LIO (Linux-IO), el framework de iSCSI target integrado en el kernel Linux. `iscsiadm` es la herramienta del initiator (cliente).
</details>

### Pregunta 4
¿Que comando descubre targets iSCSI disponibles en un servidor?

a) `iscsiadm -m node -T iqn... --login`
b) `iscsiadm -m discovery -t sendtargets -p 192.168.1.100:3260`
c) `iscsiadm -m session`
d) `targetcli discover 192.168.1.100`

<details><summary>Respuesta</summary>

**b) `iscsiadm -m discovery -t sendtargets -p 192.168.1.100:3260`**

El modo `discovery` con tipo `sendtargets` consulta al portal iSCSI especificado para obtener la lista de targets disponibles.
</details>

### Pregunta 5
¿Que politica de agrupacion de multipath mantiene solo una ruta activa y las demas en espera?

a) `multibus`
b) `group_by_prio`
c) `failover`
d) `round-robin`

<details><summary>Respuesta</summary>

**c) `failover`**

La politica `failover` usa una sola ruta activa a la vez. Las demas rutas quedan en espera y se activan solo si la ruta principal falla. `multibus` usa todas las rutas activas simultaneamente.
</details>

### Pregunta 6
¿Que comando muestra la topologia multipath con el estado detallado de todas las rutas?

a) `multipath -v0`
b) `multipath -ll`
c) `multipathd show maps`
d) `dmsetup ls`

<details><summary>Respuesta</summary>

**b) `multipath -ll`**

`multipath -ll` muestra la topologia completa incluyendo el nombre del mapa, las politicas, los grupos de rutas y el estado de cada ruta individual.
</details>

### Pregunta 7
¿Que operacion SPC-3 permite a un nodo del cluster quitar la reserva SCSI de otro nodo?

a) register
b) reserve
c) release
d) preempt

<details><summary>Respuesta</summary>

**d) preempt**

La operacion `preempt` permite a un nodo quitar forzosamente la reserva de otro nodo. Es fundamental para el fencing a nivel de almacenamiento en clusters HA.
</details>

### Pregunta 8
¿En que directorio del sistema se encuentra la informacion de los HBAs Fibre Channel?

a) `/proc/fc_host/`
b) `/sys/class/fc_host/`
c) `/dev/fc/`
d) `/etc/fc/`

<details><summary>Respuesta</summary>

**b) `/sys/class/fc_host/`**

La informacion de los HBAs (Host Bus Adapters) Fibre Channel se encuentra en `/sys/class/fc_host/`. Desde alli se pueden leer el WWPN, WWNN y estado del puerto.
</details>

### Pregunta 9
¿Cual es el formato correcto de un IQN (iSCSI Qualified Name)?

a) `wwn.50014380123456789`
b) `iqn.2024-01.com.empresa:storage.lun1`
c) `naa.600508b4000123456`
d) `eui.0123456789ABCDEF`

<details><summary>Respuesta</summary>

**b) `iqn.2024-01.com.empresa:storage.lun1`**

El formato IQN es: `iqn.YYYY-MM.dominio.invertido:identificador`. Las opciones a, c y d son formatos de identificacion de almacenamiento (WWN, NAA, EUI) pero no son IQN.
</details>

### Pregunta 10
¿Que archivo configura el nombre IQN del initiator iSCSI?

a) `/etc/iscsi/iscsid.conf`
b) `/etc/iscsi/initiatorname.iscsi`
c) `/etc/iscsi/targets.conf`
d) `/etc/target/saveconfig.json`

<details><summary>Respuesta</summary>

**b) `/etc/iscsi/initiatorname.iscsi`**

El archivo `/etc/iscsi/initiatorname.iscsi` contiene el IQN del initiator. Cada nodo debe tener un IQN unico. El archivo `/etc/iscsi/iscsid.conf` contiene la configuracion general del daemon.
</details>
