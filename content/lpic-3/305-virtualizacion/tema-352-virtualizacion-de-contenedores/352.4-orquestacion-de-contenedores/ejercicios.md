---
title: "352.4 - Ejercicios: Orquestación de Contenedores"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.4"
peso: 3
tags:
  - lpic-3
  - tema-352
  - ejercicios
  - kubernetes
  - docker-swarm
---

# Ejercicios - 352.4 Orquestación de Contenedores

### Pregunta 1
¿Qué comando inicializa un clúster Docker Swarm?

a) `docker cluster init`
b) `docker swarm create`
c) `docker swarm init`
d) `docker init swarm`

<details><summary>Respuesta</summary>

**c) `docker swarm init`**

`docker swarm init` inicializa el nodo actual como manager del Swarm. Se recomienda usar `--advertise-addr` para especificar la IP del manager. El comando devuelve un token que los workers usan para unirse con `docker swarm join`.
</details>

### Pregunta 2
¿Cuál es la unidad mínima de despliegue en Kubernetes?

a) Container
b) Deployment
c) Pod
d) Service

<details><summary>Respuesta</summary>

**c) Pod**

Un Pod es la unidad mínima de despliegue en Kubernetes. Puede contener uno o más contenedores que comparten red (mismo IP) y almacenamiento. Los contenedores dentro de un Pod se comunican por localhost.
</details>

### Pregunta 3
¿Qué comando de kubectl aplica una configuración declarativa desde un archivo YAML?

a) `kubectl create -f recurso.yaml`
b) `kubectl apply -f recurso.yaml`
c) `kubectl deploy -f recurso.yaml`
d) `kubectl run -f recurso.yaml`

<details><summary>Respuesta</summary>

**b) `kubectl apply -f recurso.yaml`**

`kubectl apply -f` aplica configuración de forma declarativa: crea el recurso si no existe o lo actualiza si ya existe. `kubectl create` es imperativo y falla si el recurso ya existe. `apply` es el método recomendado para gestión declarativa.
</details>

### Pregunta 4
¿Qué tipo de Service en Kubernetes es accesible solo desde dentro del clúster?

a) NodePort
b) LoadBalancer
c) ClusterIP
d) ExternalName

<details><summary>Respuesta</summary>

**c) ClusterIP**

ClusterIP es el tipo de Service por defecto. Asigna una IP virtual interna al clúster y solo es accesible desde dentro. NodePort expone en cada nodo, LoadBalancer provisiona un balanceador externo, y ExternalName crea un alias DNS.
</details>

### Pregunta 5
¿Qué comando escala un servicio Docker Swarm a 5 réplicas?

a) `docker service replicas web 5`
b) `docker service scale web=5`
c) `docker service update --replicas 5 web`
d) Tanto b) como c) son correctas

<details><summary>Respuesta</summary>

**d) Tanto b) como c) son correctas**

`docker service scale web=5` y `docker service update --replicas 5 web` logran el mismo resultado: escalar el servicio "web" a 5 réplicas. `scale` es un atajo más directo, mientras que `update` permite cambiar múltiples parámetros simultáneamente.
</details>

### Pregunta 6
¿Qué recurso de Kubernetes almacena datos de configuración no sensibles como pares clave-valor?

a) Secret
b) ConfigMap
c) Volume
d) Annotation

<details><summary>Respuesta</summary>

**b) ConfigMap**

Los ConfigMaps almacenan datos de configuración no confidenciales como pares clave-valor. Se pueden inyectar en Pods como variables de entorno o montar como archivos. Los Secrets son para datos sensibles y se almacenan codificados en base64.
</details>

### Pregunta 7
¿Qué comando de kubectl revierte un Deployment a la versión anterior?

a) `kubectl rollout revert deployment web`
b) `kubectl rollout undo deployment web`
c) `kubectl rollback deployment web`
d) `kubectl undo deployment web`

<details><summary>Respuesta</summary>

**b) `kubectl rollout undo deployment web`**

`kubectl rollout undo` revierte un Deployment a la revisión anterior. Se puede especificar una revisión concreta con `--to-revision=N`. `kubectl rollout history` muestra las revisiones disponibles.
</details>

### Pregunta 8
¿Qué recurso de Kubernetes gestiona el acceso HTTP/HTTPS externo con reglas de enrutamiento basadas en host y ruta?

a) Service
b) NetworkPolicy
c) Ingress
d) Gateway

<details><summary>Respuesta</summary>

**c) Ingress**

Ingress gestiona el acceso HTTP/HTTPS externo al clúster, proporcionando enrutamiento basado en host y ruta, terminación TLS y balanceo de carga. Requiere un Ingress Controller (nginx, traefik, etc.) instalado en el clúster.
</details>

### Pregunta 9
¿Qué comando despliega una aplicación multi-servicio en Docker Swarm desde un archivo compose?

a) `docker compose up -d`
b) `docker stack deploy -c docker-compose.yml mi-app`
c) `docker swarm deploy docker-compose.yml`
d) `docker service create -f docker-compose.yml`

<details><summary>Respuesta</summary>

**b) `docker stack deploy -c docker-compose.yml mi-app`**

`docker stack deploy` despliega servicios definidos en un archivo compose como un stack en Docker Swarm. `-c` especifica el archivo compose. `docker compose up` es para Docker Compose local, no para Swarm.
</details>

### Pregunta 10
¿Qué comando de kubectl muestra información detallada sobre un pod, incluyendo eventos y condiciones?

a) `kubectl get pod mi-pod -o yaml`
b) `kubectl info pod mi-pod`
c) `kubectl describe pod mi-pod`
d) `kubectl inspect pod mi-pod`

<details><summary>Respuesta</summary>

**c) `kubectl describe pod mi-pod`**

`kubectl describe` muestra información detallada y legible sobre un recurso, incluyendo metadata, especificación, estado, condiciones y eventos recientes. `get -o yaml` muestra la definición completa en YAML pero sin eventos ni formato legible.
</details>
