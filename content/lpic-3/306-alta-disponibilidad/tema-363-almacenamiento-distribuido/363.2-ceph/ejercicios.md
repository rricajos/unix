---
title: "363.2 - Ejercicios: Ceph"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "363 - Almacenamiento Distribuido"
subtema: "363.2"
peso: 5
tags:
  - lpic-3
  - tema-363
  - ejercicios
  - ceph
---

# 363.2 - Ejercicios: Ceph

### Pregunta 1
¿Que componente de Ceph almacena los datos y gestiona la replicacion?

a) MON (Monitor)
b) OSD (Object Storage Daemon)
c) MDS (Metadata Server)
d) MGR (Manager)

<details><summary>Respuesta</summary>

**b) OSD (Object Storage Daemon)**

Los OSDs almacenan los datos como objetos, gestionan la replicacion, la recuperacion y el rebalanceo. Hay un OSD por cada disco del cluster.
</details>

### Pregunta 2
¿Que algoritmo usa Ceph para determinar la ubicacion de los datos sin necesidad de una tabla centralizada?

a) DHT
b) CRUSH
c) Consistent Hashing
d) Round Robin

<details><summary>Respuesta</summary>

**b) CRUSH**

CRUSH (Controlled Replication Under Scalable Hashing) calcula la ubicacion de los datos de forma determinista usando un mapa jerarquico del cluster. Esto elimina la necesidad de una tabla de localizacion centralizada.
</details>

### Pregunta 3
¿Cuantos monitores (MON) se recomienda como minimo en un cluster Ceph de produccion?

a) 1
b) 2
c) 3
d) 5

<details><summary>Respuesta</summary>

**c) 3**

Se necesitan al menos 3 monitores para mantener quorum (algoritmo Paxos). Un numero impar (3 o 5) es recomendado para evitar empates en la votacion de quorum.
</details>

### Pregunta 4
¿Que comando muestra el arbol jerarquico de todos los OSDs del cluster Ceph?

a) `ceph osd ls`
b) `ceph osd tree`
c) `ceph osd stat`
d) `ceph osd dump`

<details><summary>Respuesta</summary>

**b) `ceph osd tree`**

`ceph osd tree` muestra la jerarquia CRUSH completa incluyendo roots, racks, hosts y OSDs con su estado (up/down) y peso.
</details>

### Pregunta 5
¿Que componente de Ceph es necesario unicamente para CephFS y no para RBD o RGW?

a) MON
b) OSD
c) MDS
d) MGR

<details><summary>Respuesta</summary>

**c) MDS (Metadata Server)**

El MDS gestiona los metadatos del sistema de archivos (directorios, permisos, etc.) y solo es necesario para CephFS. RBD y RGW no requieren MDS.
</details>

### Pregunta 6
¿Que tipo de almacenamiento proporciona RBD (RADOS Block Device)?

a) Almacenamiento de objetos compatible con S3
b) Sistema de archivos distribuido POSIX
c) Almacenamiento de bloques (como un disco virtual)
d) Almacenamiento NAS por NFS

<details><summary>Respuesta</summary>

**c) Almacenamiento de bloques (como un disco virtual)**

RBD proporciona dispositivos de bloque sobre RADOS. Se mapea como `/dev/rbdN` y puede usarse como cualquier disco (crear FS, montar). Es ideal para volumenes de VMs y contenedores.
</details>

### Pregunta 7
¿Que estado de un Placement Group (PG) indica funcionamiento normal y completo?

a) `active+degraded`
b) `active+clean`
c) `peering`
d) `active+recovering`

<details><summary>Respuesta</summary>

**b) `active+clean`**

`active+clean` indica que el PG esta activo (sirviendo peticiones) y limpio (todas las replicas estan sincronizadas). `degraded` indica replicas faltantes y `recovering` indica recuperacion en curso.
</details>

### Pregunta 8
¿Que protocolo de almacenamiento de objetos es compatible con RGW (RADOS Gateway)?

a) NFS y SMB
b) iSCSI y Fibre Channel
c) Amazon S3 y OpenStack Swift
d) FTP y WebDAV

<details><summary>Respuesta</summary>

**c) Amazon S3 y OpenStack Swift**

RGW proporciona una interfaz REST compatible con las APIs de Amazon S3 y OpenStack Swift, permitiendo que aplicaciones existentes que usan estos protocolos se conecten a Ceph.
</details>

### Pregunta 9
¿Que herramienta es la oficial para desplegar clusters Ceph modernos (desde version Octopus)?

a) ceph-deploy
b) ceph-ansible
c) cephadm
d) ceph-installer

<details><summary>Respuesta</summary>

**c) cephadm**

`cephadm` es la herramienta oficial de despliegue desde Ceph Octopus. Usa contenedores para los daemons y SSH para gestionar los nodos. Reemplazo a `ceph-deploy` que esta obsoleto.
</details>

### Pregunta 10
En `/etc/ceph/ceph.conf`, ¿que parametro define la red usada para el trafico de replicacion entre OSDs?

a) `public_network`
b) `cluster_network`
c) `osd_network`
d) `replication_network`

<details><summary>Respuesta</summary>

**b) `cluster_network`**

`cluster_network` define la red dedicada al trafico interno de replicacion, recovery y heartbeat entre OSDs. `public_network` es la red para trafico de clientes. Separar estas redes mejora el rendimiento.
</details>
