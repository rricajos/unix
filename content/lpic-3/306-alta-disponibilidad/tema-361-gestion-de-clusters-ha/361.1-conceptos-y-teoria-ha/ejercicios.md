---
title: "361.1 - Ejercicios: Conceptos y Teoría HA"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "361 - Gestión de Clusters HA"
subtema: "361.1"
peso: 5
tags:
  - lpic-3
  - tema-361
  - ejercicios
  - alta-disponibilidad
---

# 361.1 - Ejercicios: Conceptos y Teoría HA

### Pregunta 1
¿Cuánto tiempo de inactividad máximo al año permite una disponibilidad de 99.99%?

a) 8.76 horas
b) 52.6 minutos
c) 5.26 minutos
d) 31.5 segundos

<details><summary>Respuesta</summary>

**b) 52.6 minutos**

99.99% (cuatro nueves) permite aproximadamente 52.6 minutos de inactividad al año. 99.9% = 8.76 horas, 99.999% = 5.26 minutos y 99.9999% = 31.5 segundos.
</details>

### Pregunta 2
¿Qué componente de la arquitectura Pacemaker/Corosync se encarga de la comunicación entre nodos y la gestión de membresía?

a) Pacemaker
b) CIB
c) Corosync
d) LRMd

<details><summary>Respuesta</summary>

**c) Corosync**

Corosync es la capa de mensajería que gestiona la comunicación entre nodos, la membresía del cluster y el quorum. Pacemaker se encarga de la gestión de recursos.
</details>

### Pregunta 3
En un cluster de 5 nodos, ¿cuántos nodos deben estar activos para mantener el quorum?

a) 2
b) 3
c) 4
d) 5

<details><summary>Respuesta</summary>

**b) 3**

El quorum requiere (N+1)/2 nodos para N impar. Con 5 nodos: (5+1)/2 = 3. Esto permite tolerar el fallo de hasta 2 nodos.
</details>

### Pregunta 4
¿Qué es STONITH?

a) Un protocolo de comunicación entre nodos del cluster
b) Un mecanismo para apagar o reiniciar físicamente un nodo defectuoso
c) Un algoritmo de balanceo de carga
d) Un tipo de sistema de archivos cluster

<details><summary>Respuesta</summary>

**b) Un mecanismo para apagar o reiniciar físicamente un nodo defectuoso**

STONITH (Shoot The Other Node In The Head) es un mecanismo de fencing que garantiza que un nodo problemático sea eliminado físicamente del cluster para evitar corrupción de datos.
</details>

### Pregunta 5
¿Cuál es la principal consecuencia de un split-brain en un cluster?

a) Mejora del rendimiento
b) Corrupción de datos en almacenamiento compartido
c) Aumento de la disponibilidad
d) Reducción del consumo de recursos

<details><summary>Respuesta</summary>

**b) Corrupción de datos en almacenamiento compartido**

El split-brain ocurre cuando los nodos pierden comunicación y ambos creen ser el primario. Si ambos escriben simultáneamente en almacenamiento compartido, se produce corrupción de datos.
</details>

### Pregunta 6
¿Qué almacena el CIB (Cluster Information Base)?

a) Los logs del cluster
b) La configuración completa del cluster en formato XML
c) Las estadísticas de rendimiento
d) Las credenciales de los nodos

<details><summary>Respuesta</summary>

**b) La configuración completa del cluster en formato XML**

El CIB es una base de datos XML que contiene la configuración del cluster, incluyendo nodos, recursos, restricciones y propiedades. Se replica automáticamente entre todos los nodos.
</details>

### Pregunta 7
¿Qué valor de `no-quorum-policy` detiene todos los recursos cuando se pierde el quorum?

a) `freeze`
b) `ignore`
c) `stop`
d) `suicide`

<details><summary>Respuesta</summary>

**c) `stop`**

`stop` es el valor predeterminado y detiene todos los recursos. `freeze` mantiene los activos pero no inicia nuevos. `ignore` ignora la pérdida de quorum. `suicide` apaga el nodo.
</details>

### Pregunta 8
¿Cuál es la clase de agente de recurso más completa y recomendada en Pacemaker?

a) LSB
b) systemd
c) OCF
d) service

<details><summary>Respuesta</summary>

**c) OCF**

Los agentes OCF (Open Cluster Framework) son los más completos, soportando operaciones como start, stop, monitor, promote, demote y migrate. Se encuentran en `/usr/lib/ocf/resource.d/`.
</details>

### Pregunta 9
Un sistema tiene un MTBF de 1000 horas y un MTTR de 1 hora. ¿Cuál es su disponibilidad aproximada?

a) 99%
b) 99.9%
c) 99.99%
d) 99.999%

<details><summary>Respuesta</summary>

**b) 99.9%**

Disponibilidad = MTBF / (MTBF + MTTR) = 1000 / (1000 + 1) = 1000 / 1001 ≈ 0.999 = 99.9%.
</details>

### Pregunta 10
¿Qué mecanismo adicional se necesita en un cluster de exactamente 2 nodos para resolver el problema de quorum?

a) Un tercer anillo de Corosync
b) Un quorum disk o quorum device
c) Desactivar el fencing
d) Configurar modo activo/activo

<details><summary>Respuesta</summary>

**b) Un quorum disk o quorum device**

Con 2 nodos, ningún nodo tiene mayoría si el otro falla o si se pierde la comunicación. Un quorum disk o quorum device actúa como "tercer voto" para desempatar. Alternativamente se puede configurar `two_node: 1` en Corosync junto con `wait_for_all`.
</details>
