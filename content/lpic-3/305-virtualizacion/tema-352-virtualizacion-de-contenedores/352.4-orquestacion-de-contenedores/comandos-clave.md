---
title: "352.4 - Comandos Clave: Orquestación de Contenedores"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.4"
peso: 3
tags:
  - lpic-3
  - tema-352
  - comandos
  - kubernetes
  - docker-swarm
  - kubectl
---

# Comandos Clave - 352.4 Orquestación de Contenedores

## Docker Swarm

| Comando | Descripción |
|---|---|
| `docker swarm init --advertise-addr <IP>` | Inicializar Swarm |
| `docker swarm join --token <token> <IP>:2377` | Unirse al Swarm |
| `docker swarm join-token worker` | Obtener token de worker |
| `docker swarm join-token manager` | Obtener token de manager |
| `docker swarm leave` | Abandonar Swarm |
| `docker node ls` | Listar nodos del clúster |
| `docker service create --name X --replicas N <img>` | Crear servicio |
| `docker service ls` | Listar servicios |
| `docker service ps <servicio>` | Ver tareas del servicio |
| `docker service scale <servicio>=N` | Escalar servicio |
| `docker service update --image <img> <servicio>` | Actualizar imagen |
| `docker service rm <servicio>` | Eliminar servicio |
| `docker service logs <servicio>` | Ver logs del servicio |
| `docker stack deploy -c docker-compose.yml <stack>` | Desplegar stack |
| `docker stack ls` | Listar stacks |
| `docker stack services <stack>` | Servicios de un stack |
| `docker stack rm <stack>` | Eliminar stack |

## kubectl - Consultar Recursos

| Comando | Descripción |
|---|---|
| `kubectl get pods` | Listar pods |
| `kubectl get pods -o wide` | Listar pods con detalles extra |
| `kubectl get pods -n <namespace>` | Pods en namespace específico |
| `kubectl get deployments` | Listar deployments |
| `kubectl get services` | Listar services |
| `kubectl get nodes` | Listar nodos |
| `kubectl get all` | Listar todos los recursos |
| `kubectl get namespaces` | Listar namespaces |
| `kubectl get configmaps` | Listar configmaps |
| `kubectl get secrets` | Listar secrets |
| `kubectl get ingress` | Listar ingress |

## kubectl - Operaciones

| Comando | Descripción |
|---|---|
| `kubectl apply -f <archivo.yaml>` | Aplicar configuración |
| `kubectl delete -f <archivo.yaml>` | Eliminar recursos del archivo |
| `kubectl delete pod <pod>` | Eliminar pod |
| `kubectl delete deployment <deploy>` | Eliminar deployment |
| `kubectl describe pod <pod>` | Información detallada del pod |
| `kubectl describe deployment <deploy>` | Info detallada del deployment |
| `kubectl logs <pod>` | Ver logs del pod |
| `kubectl logs -f <pod>` | Seguir logs en tiempo real |
| `kubectl logs <pod> -c <contenedor>` | Logs de contenedor específico |
| `kubectl exec -it <pod> -- bash` | Shell en el pod |
| `kubectl scale deployment <deploy> --replicas=N` | Escalar |
| `kubectl rollout history deployment <deploy>` | Historial de versiones |
| `kubectl rollout undo deployment <deploy>` | Rollback |
| `kubectl create namespace <ns>` | Crear namespace |
| `kubectl create configmap <cm> --from-literal=k=v` | Crear configmap |
| `kubectl create secret generic <s> --from-literal=k=v` | Crear secret |

## Tipos de Service en Kubernetes

| Tipo | Descripción |
|---|---|
| `ClusterIP` | Solo accesible dentro del clúster (por defecto) |
| `NodePort` | Expone en un puerto de cada nodo (30000-32767) |
| `LoadBalancer` | Provisiona load balancer externo (cloud) |
| `ExternalName` | Alias DNS a un servicio externo |

## Container Registries

| Comando | Descripción |
|---|---|
| `docker login <registry>` | Autenticarse en registry |
| `docker tag <img> <registry>/<img>:<tag>` | Etiquetar para registry |
| `docker push <registry>/<img>:<tag>` | Subir imagen |
| `docker pull <registry>/<img>:<tag>` | Descargar imagen |
| `kubectl create secret docker-registry ...` | Crear secret para registry en K8s |
