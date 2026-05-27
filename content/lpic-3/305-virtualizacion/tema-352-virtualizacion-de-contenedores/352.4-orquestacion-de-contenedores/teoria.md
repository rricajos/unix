---
title: "352.4 - Orquestación de Contenedores"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.4"
peso: 3
tags:
  - lpic-3
  - tema-352
  - kubernetes
  - docker-swarm
  - orquestacion
  - kubectl
---

# 352.4 Orquestación de Contenedores

## Introducción

La orquestación de contenedores automatiza el despliegue, escalado, gestión y recuperación de aplicaciones contenerizadas en clústeres de múltiples hosts. Los dos principales orquestadores son Docker Swarm (integrado en Docker) y Kubernetes (estándar de la industria).

## Docker Swarm

Docker Swarm es el orquestador nativo de Docker, integrado directamente en el Docker Engine.

### Arquitectura

```
┌─────────────────────────────────────────┐
│            Docker Swarm Cluster          │
├─────────────┬─────────────┬─────────────┤
│  Manager 1  │  Manager 2  │  Manager 3  │
│  (Leader)   │  (Follower) │  (Follower) │
├─────────────┼─────────────┼─────────────┤
│  Worker 1   │  Worker 2   │  Worker 3   │
│  ┌────────┐ │  ┌────────┐ │  ┌────────┐ │
│  │Task 1  │ │  │Task 2  │ │  │Task 3  │ │
│  │Task 4  │ │  │Task 5  │ │  │Task 6  │ │
│  └────────┘ │  └────────┘ │  └────────┘ │
└─────────────┴─────────────┴─────────────┘
```

### Inicializar y unirse al Swarm

```bash
# Inicializar Swarm en el primer manager
docker swarm init --advertise-addr 192.168.1.10

# Obtener token para añadir workers
docker swarm join-token worker

# Obtener token para añadir managers
docker swarm join-token manager

# Unirse como worker
docker swarm join --token SWMTKN-1-xxx 192.168.1.10:2377

# Listar nodos del clúster
docker node ls

# Abandonar el Swarm
docker swarm leave
docker swarm leave --force  # En un manager
```

### Servicios en Swarm

```bash
# Crear un servicio
docker service create --name web --replicas 3 -p 8080:80 nginx

# Listar servicios
docker service ls

# Ver tareas de un servicio
docker service ps web

# Escalar servicio
docker service scale web=5

# Actualizar imagen
docker service update --image nginx:latest web

# Eliminar servicio
docker service rm web

# Ver logs del servicio
docker service logs web
```

### Stack Deploy

Permite desplegar aplicaciones multi-servicio usando archivos Compose:

```bash
# Desplegar stack desde archivo compose
docker stack deploy -c docker-compose.yml mi-app

# Listar stacks
docker stack ls

# Listar servicios de un stack
docker stack services mi-app

# Eliminar stack
docker stack rm mi-app
```

> **Para el examen:** Docker Swarm es más sencillo de configurar que Kubernetes y está integrado en Docker. Sin embargo, Kubernetes domina el mercado para orquestación en producción a gran escala.

## Kubernetes

Kubernetes (K8s) es la plataforma estándar de la industria para orquestación de contenedores, desarrollada originalmente por Google.

### Arquitectura

```
┌─────────────────────────────────────────────────┐
│                 Control Plane                    │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────┐ │
│  │kube-api  │ │etcd      │ │kube-scheduler   │ │
│  │server    │ │(almacén) │ │                 │ │
│  └──────────┘ └──────────┘ └─────────────────┘ │
│  ┌────────────────────┐                         │
│  │kube-controller-mgr │                         │
│  └────────────────────┘                         │
├─────────────────────────────────────────────────┤
│                  Worker Nodes                    │
│  ┌──────────────────────────────────────┐       │
│  │ Node 1                                │       │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │       │
│  │ │kubelet  │ │kube-proxy│ │Container│ │       │
│  │ │         │ │         │ │Runtime  │ │       │
│  │ └─────────┘ └─────────┘ └─────────┘ │       │
│  │ ┌─────┐ ┌─────┐ ┌─────┐             │       │
│  │ │Pod 1│ │Pod 2│ │Pod 3│             │       │
│  │ └─────┘ └─────┘ └─────┘             │       │
│  └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

### Conceptos Fundamentales

| Concepto | Descripción |
|---|---|
| **Pod** | Unidad mínima de despliegue. Uno o más contenedores que comparten red y almacenamiento. |
| **Deployment** | Gestiona réplicas de Pods con actualizaciones declarativas y rollbacks. |
| **Service** | Expone Pods como servicio de red con IP estable y balanceo de carga. |
| **Namespace** | Aislamiento lógico de recursos dentro del clúster. |
| **ConfigMap** | Almacena configuración como pares clave-valor (no sensible). |
| **Secret** | Almacena datos sensibles (contraseñas, tokens) codificados en base64. |
| **Volume** | Almacenamiento para Pods (emptyDir, hostPath, PV/PVC, etc.). |
| **Ingress** | Gestión de acceso HTTP/HTTPS externo con reglas de enrutamiento. |

### YAML Manifests

#### Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mi-pod
  labels:
    app: web
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

#### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.24
        ports:
        - containerPort: 80
```

#### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP    # ClusterIP, NodePort, LoadBalancer
```

> **Para el examen:** Los tipos de Service son: `ClusterIP` (solo accesible dentro del clúster), `NodePort` (expone en un puerto de cada nodo), `LoadBalancer` (provisiona un LB externo en cloud).

### Comandos kubectl

```bash
# Ver recursos
kubectl get pods
kubectl get pods -o wide
kubectl get deployments
kubectl get services
kubectl get nodes
kubectl get all
kubectl get all -n mi-namespace

# Información detallada
kubectl describe pod mi-pod
kubectl describe deployment web-deployment
kubectl describe service web-service

# Aplicar manifiesto YAML
kubectl apply -f mi-recurso.yaml
kubectl apply -f directorio/

# Eliminar recursos
kubectl delete pod mi-pod
kubectl delete -f mi-recurso.yaml
kubectl delete deployment web-deployment

# Logs
kubectl logs mi-pod
kubectl logs -f mi-pod
kubectl logs mi-pod -c mi-contenedor  # Multi-container pod

# Ejecutar comando en pod
kubectl exec -it mi-pod -- bash

# Escalar deployment
kubectl scale deployment web-deployment --replicas=5

# Ver historial de rollout
kubectl rollout history deployment web-deployment

# Rollback
kubectl rollout undo deployment web-deployment

# Crear recursos imperativamente
kubectl create namespace mi-namespace
kubectl create configmap mi-config --from-literal=clave=valor
kubectl create secret generic mi-secret --from-literal=password=s3cr3t
```

### Namespaces

```bash
# Listar namespaces
kubectl get namespaces

# Crear namespace
kubectl create namespace desarrollo

# Usar namespace por defecto
kubectl config set-context --current --namespace=desarrollo

# Operar en un namespace específico
kubectl get pods -n desarrollo
```

## Container Registries

Los registros almacenan y distribuyen imágenes de contenedores:

| Registro | Descripción |
|---|---|
| **Docker Hub** | Registro público por defecto de Docker |
| **Harbor** | Registro empresarial de código abierto |
| **Amazon ECR** | Registro de AWS |
| **Google GCR/GAR** | Registro de Google Cloud |
| **Azure ACR** | Registro de Azure |
| **Quay.io** | Registro de Red Hat |

```bash
# Login a un registry
docker login registry.ejemplo.com

# Etiquetar para registry privado
docker tag mi-app:v1 registry.ejemplo.com/mi-app:v1

# Subir imagen
docker push registry.ejemplo.com/mi-app:v1

# Kubernetes: crear secret para registry privado
kubectl create secret docker-registry mi-registry-secret \
  --docker-server=registry.ejemplo.com \
  --docker-username=usuario \
  --docker-password=clave
```

## Resumen

| Concepto | Detalle clave |
|---|---|
| Docker Swarm | Orquestador integrado en Docker, fácil de configurar |
| `docker swarm init` | Inicializar clúster Swarm |
| `docker service create` | Crear servicio en Swarm |
| Kubernetes | Estándar de la industria para orquestación |
| Pod | Unidad mínima en K8s (1+ contenedores) |
| Deployment | Gestión declarativa de réplicas de Pods |
| Service | Exposición de red estable para Pods |
| `kubectl apply -f` | Aplicar configuración declarativa |
| `kubectl get/describe` | Consultar estado de recursos |
| Registries | Almacenes de imágenes (Docker Hub, Harbor, etc.) |
