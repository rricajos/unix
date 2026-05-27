---
title: "361.3 - Ejercicios: Clusters de Failover"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "361 - Gestión de Clusters HA"
subtema: "361.3"
peso: 6
tags:
  - lpic-3
  - tema-361
  - ejercicios
  - failover
  - pacemaker
---

# 361.3 - Ejercicios: Clusters de Failover

### Pregunta 1
¿Qué comando crea un recurso IP virtual en Pacemaker usando pcs?

a) `pcs resource add VIP ocf:heartbeat:IPaddr2 ip=10.0.0.100`
b) `pcs resource create VIP ocf:heartbeat:IPaddr2 ip=10.0.0.100 cidr_netmask=24`
c) `pcs cluster resource VIP ip=10.0.0.100`
d) `pcs create resource VIP IPaddr2 ip=10.0.0.100`

<details><summary>Respuesta</summary>

**b) `pcs resource create VIP ocf:heartbeat:IPaddr2 ip=10.0.0.100 cidr_netmask=24`**

La sintaxis correcta es `pcs resource create NOMBRE clase:proveedor:agente parámetros`. El agente `IPaddr2` del proveedor `heartbeat` requiere los parámetros `ip` y `cidr_netmask`.
</details>

### Pregunta 2
¿Qué tipo de recurso Pacemaker se ejecuta en múltiples nodos y permite que una instancia sea promovida a Master?

a) primitive
b) group
c) clone
d) promotable

<details><summary>Respuesta</summary>

**d) promotable**

Un recurso `promotable` (anteriormente master/slave o multi-state) es un tipo especial de clone donde una instancia puede ser promovida al rol Master (Promoted) mientras las demás permanecen como Slave (Unpromoted). Es usado típicamente para DRBD.
</details>

### Pregunta 3
¿Qué comando se debe ejecutar después de `pcs resource move` para eliminar la restricción temporal creada?

a) `pcs resource delete`
b) `pcs resource clear`
c) `pcs resource reset`
d) `pcs constraint delete`

<details><summary>Respuesta</summary>

**b) `pcs resource clear`**

`pcs resource move` crea una restricción temporal de ubicación con score `-INFINITY` para evitar que el recurso vuelva al nodo original. `pcs resource clear` elimina esta restricción temporal.
</details>

### Pregunta 4
¿Cuál es el formato correcto para especificar un agente OCF del proveedor heartbeat?

a) `heartbeat:ocf:IPaddr2`
b) `ocf:IPaddr2:heartbeat`
c) `ocf:heartbeat:IPaddr2`
d) `IPaddr2:ocf:heartbeat`

<details><summary>Respuesta</summary>

**c) `ocf:heartbeat:IPaddr2`**

El formato es `clase:proveedor:agente`. OCF es la clase, heartbeat es el proveedor, e IPaddr2 es el nombre del agente.
</details>

### Pregunta 5
En la configuración de Corosync, ¿qué sección define los nodos del cluster con sus direcciones?

a) `totem`
b) `quorum`
c) `nodelist`
d) `logging`

<details><summary>Respuesta</summary>

**c) `nodelist`**

La sección `nodelist` define los nodos del cluster, incluyendo sus direcciones de red (`ring0_addr`, `ring1_addr`) y sus IDs únicos (`nodeid`).
</details>

### Pregunta 6
¿Qué restricción en Pacemaker asegura que dos recursos se ejecuten en el mismo nodo?

a) `location`
b) `colocation`
c) `order`
d) `group`

<details><summary>Respuesta</summary>

**b) `colocation`**

La restricción `colocation` (colocación) con score `INFINITY` asegura que dos recursos se ejecuten en el mismo nodo. Con score `-INFINITY` se asegura que estén en nodos diferentes.
</details>

### Pregunta 7
¿Qué dispositivo STONITH es apropiado para servidores físicos con interfaces IPMI/BMC?

a) `fence_xvm`
b) `fence_ipmilan`
c) `sbd`
d) `fence_apc`

<details><summary>Respuesta</summary>

**b) `fence_ipmilan`**

`fence_ipmilan` es el agente de fencing para servidores con interfaces IPMI (Intelligent Platform Management Interface) / BMC accesibles por red LAN. `fence_xvm` es para VMs libvirt, `sbd` para disco compartido, y `fence_apc` para PDUs APC.
</details>

### Pregunta 8
¿Qué comando exporta la CIB (Cluster Information Base) completa en formato XML?

a) `pcs cluster export`
b) `cibadmin --query`
c) `crm_resource --show-xml`
d) `pcs config backup`

<details><summary>Respuesta</summary>

**b) `cibadmin --query`**

`cibadmin --query` exporta la CIB completa en XML. Se puede redirigir a un archivo con `cibadmin --query > backup.xml` y restaurar con `cibadmin --replace --xml-file backup.xml`.
</details>

### Pregunta 9
En un grupo de recursos Pacemaker, ¿en qué orden se detienen los recursos?

a) En el mismo orden en que se inician
b) En orden inverso al de inicio
c) Todos simultáneamente
d) En orden alfabético

<details><summary>Respuesta</summary>

**b) En orden inverso al de inicio**

Los recursos de un grupo se inician en el orden definido (primero a último) y se detienen en orden inverso (último a primero). Por ejemplo, si el grupo tiene VIP -> FS -> Apache, se inicia VIP primero y se detiene Apache primero.
</details>

### Pregunta 10
¿Qué parámetro de Corosync debe establecerse a `1` en un cluster de exactamente 2 nodos?

a) `expected_votes: 1`
b) `two_node: 1`
c) `quorum_votes: 1`
d) `min_nodes: 1`

<details><summary>Respuesta</summary>

**b) `two_node: 1`**

El parámetro `two_node: 1` en la sección `quorum` de corosync.conf permite que un cluster de 2 nodos funcione correctamente a pesar de no poder alcanzar quorum natural cuando un nodo falla. Se recomienda combinarlo con `wait_for_all: 1`.
</details>
