---
title: "352.3 - Docker"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.3"
peso: 9
tags:
  - lpic-3
  - tema-352
  - docker
  - dockerfile
  - docker-compose
  - contenedores
---

# 352.3 Docker

## Introducción

Docker es la plataforma de contenedores más extendida. Con un peso de 9 puntos (junto con libvirt), es uno de los subtemas más importantes del examen LPIC-3 305. Docker empaqueta aplicaciones y sus dependencias en contenedores portátiles y reproducibles.

## Arquitectura de Docker

```
┌─────────────────────────────────────────────┐
│  Docker CLI (docker)                         │
├─────────────────────────────────────────────┤
│  Docker Daemon (dockerd)                     │
├──────────────┬──────────────────────────────┤
│  containerd  │  Docker Registry              │
├──────────────┤  (Docker Hub, privado)        │
│  runc        │                               │
├──────────────┴──────────────────────────────┤
│  Kernel Linux (namespaces, cgroups, overlay) │
└─────────────────────────────────────────────┘
```

| Componente | Función |
|---|---|
| **Docker CLI** | Interfaz de línea de comandos del usuario |
| **dockerd** | Demonio que gestiona imágenes, contenedores, redes y volúmenes |
| **containerd** | Runtime de alto nivel que gestiona el ciclo de vida |
| **runc** | Runtime OCI de bajo nivel que crea los contenedores |
| **Registry** | Almacén de imágenes (Docker Hub, Harbor, etc.) |

## Dockerfile

El Dockerfile define cómo construir una imagen de contenedor paso a paso.

### Instrucciones principales

```dockerfile
# Imagen base
FROM ubuntu:22.04

# Metadatos
LABEL maintainer="admin@ejemplo.com"
LABEL version="1.0"

# Variables de entorno
ENV APP_HOME=/app
ENV NODE_ENV=production

# Variables de build (solo disponibles durante la construcción)
ARG VERSION=1.0
ARG DEBIAN_FRONTEND=noninteractive

# Directorio de trabajo
WORKDIR $APP_HOME

# Ejecutar comandos durante la construcción
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos del contexto de build
COPY ./src/ /app/src/
COPY nginx.conf /etc/nginx/nginx.conf

# ADD: Similar a COPY pero soporta URLs y descompresión automática de tar
ADD https://ejemplo.com/archivo.tar.gz /tmp/
ADD archivo.tar.gz /app/

# Exponer puertos (documentación)
EXPOSE 80 443

# Definir volúmenes
VOLUME ["/data", "/logs"]

# Usuario para ejecutar el contenedor
USER nginx

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Comando por defecto (puede ser sobrescrito)
CMD ["nginx", "-g", "daemon off;"]

# Punto de entrada (no se sobrescribe fácilmente)
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
```

### CMD vs ENTRYPOINT

| Aspecto | CMD | ENTRYPOINT |
|---|---|---|
| Propósito | Comando por defecto | Ejecutable principal |
| Override | `docker run imagen comando` | `docker run --entrypoint X imagen` |
| Combinación | CMD proporciona argumentos a ENTRYPOINT | ENTRYPOINT define el ejecutable |
| Forma shell | `CMD comando arg1` | `ENTRYPOINT comando arg1` |
| Forma exec | `CMD ["cmd", "arg1"]` | `ENTRYPOINT ["cmd", "arg1"]` |

> **Para el examen:** Siempre usar la forma exec (con corchetes JSON). La forma shell ejecuta el comando a través de `/bin/sh -c`, lo que impide que las señales lleguen correctamente al proceso.

### COPY vs ADD

| Aspecto | COPY | ADD |
|---|---|---|
| Copiar archivos locales | Sí | Sí |
| Descomprimir tar automáticamente | No | Sí |
| Descargar URLs | No | Sí |
| Recomendado | Sí (preferible) | Solo cuando se necesita descompresión |

### Multi-stage Builds

Permiten construir en múltiples etapas para reducir el tamaño final de la imagen:

```dockerfile
# Etapa de compilación
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN go build -o mi-app

# Etapa final (imagen mínima)
FROM alpine:3.18
COPY --from=builder /app/mi-app /usr/local/bin/
EXPOSE 8080
CMD ["mi-app"]
```

> **Para el examen:** Los multi-stage builds son esenciales para crear imágenes pequeñas y seguras. La imagen final solo contiene lo necesario para ejecutar la aplicación, sin herramientas de compilación.

## Comandos Docker Principales

### Imágenes

```bash
# Construir imagen
docker build -t mi-app:v1 .
docker build -t mi-app:v1 -f Dockerfile.prod .

# Listar imágenes
docker images
docker image ls

# Descargar imagen
docker pull nginx:latest

# Subir imagen a registry
docker push mi-registry/mi-app:v1

# Etiquetar imagen
docker tag mi-app:v1 mi-registry/mi-app:v1

# Eliminar imagen
docker rmi mi-app:v1

# Historial de capas
docker history mi-app:v1

# Inspeccionar imagen
docker inspect mi-app:v1
```

### Contenedores

```bash
# Ejecutar contenedor
docker run -d --name web -p 8080:80 nginx

# Ejecutar interactivo
docker run -it --rm ubuntu bash

# Listar contenedores activos
docker ps

# Listar todos (incluyendo detenidos)
docker ps -a

# Detener contenedor
docker stop web

# Iniciar contenedor detenido
docker start web

# Reiniciar
docker restart web

# Eliminar contenedor
docker rm web

# Forzar eliminación
docker rm -f web

# Logs
docker logs web
docker logs -f web          # Follow
docker logs --tail 100 web  # Últimas 100 líneas

# Ejecutar comando en contenedor existente
docker exec -it web bash
docker exec web cat /etc/nginx/nginx.conf

# Inspeccionar contenedor
docker inspect web

# Copiar archivos
docker cp archivo.txt web:/tmp/
docker cp web:/etc/nginx/nginx.conf ./

# Crear imagen desde contenedor modificado
docker commit web mi-imagen-custom:v1

# Estadísticas en tiempo real
docker stats
```

### Opciones de run importantes

| Opción | Descripción |
|---|---|
| `-d` | Modo daemon (background) |
| `-it` | Interactivo con terminal |
| `--rm` | Eliminar al salir |
| `--name <nombre>` | Asignar nombre |
| `-p <host>:<cont>` | Mapear puertos |
| `-P` | Mapear todos los puertos expuestos |
| `-v <host>:<cont>` | Bind mount |
| `--mount type=X,...` | Montar volumen/bind/tmpfs |
| `-e VAR=valor` | Variable de entorno |
| `--env-file <file>` | Variables de entorno desde archivo |
| `--network <red>` | Conectar a red |
| `--restart <política>` | Política de reinicio (no, always, unless-stopped, on-failure) |
| `--memory <límite>` | Límite de memoria |
| `--cpus <N>` | Límite de CPUs |

## Docker Networking

### Tipos de red

| Driver | Descripción |
|---|---|
| **bridge** | Red privada interna (por defecto). Contenedores se comunican entre sí. |
| **host** | El contenedor comparte la red del host directamente. |
| **none** | Sin red. |
| **overlay** | Red que abarca múltiples hosts Docker (Swarm). |
| **macvlan** | Asigna MAC real al contenedor, aparece como dispositivo físico. |

```bash
# Listar redes
docker network ls

# Crear red bridge personalizada
docker network create mi-red

# Crear red con subnet específica
docker network create --subnet 172.20.0.0/16 mi-red

# Ejecutar contenedor en red personalizada
docker run -d --network mi-red --name web nginx

# Conectar contenedor existente a red
docker network connect mi-red web

# Desconectar de red
docker network disconnect mi-red web

# Inspeccionar red
docker network inspect mi-red

# Eliminar red
docker network rm mi-red
```

> **Para el examen:** En redes bridge personalizadas, los contenedores pueden resolverse por nombre (DNS interno). En la red bridge por defecto (`docker0`), solo se pueden comunicar por IP.

## Volúmenes y Bind Mounts

### Volúmenes Docker (gestionados por Docker)

```bash
# Crear volumen
docker volume create mis-datos

# Listar volúmenes
docker volume ls

# Inspeccionar
docker volume inspect mis-datos

# Usar volumen en contenedor
docker run -d -v mis-datos:/data nginx

# Eliminar volumen
docker volume rm mis-datos

# Eliminar volúmenes no utilizados
docker volume prune
```

### Bind Mounts (directorios del host)

```bash
# Bind mount
docker run -d -v /host/path:/container/path nginx

# Con --mount (más explícito)
docker run -d --mount type=bind,source=/host/path,target=/container/path nginx

# Solo lectura
docker run -d -v /host/path:/container/path:ro nginx
```

| Aspecto | Volúmenes | Bind Mounts |
|---|---|---|
| Gestión | Docker gestiona ubicación | Ruta del host explícita |
| Portabilidad | Alta | Depende del host |
| Backup | Fácil con docker commands | Manual |
| Rendimiento | Mejor en algunos drivers | Directo al host |
| Uso típico | Datos persistentes | Desarrollo, configuración |

## Docker Compose

Define aplicaciones multi-contenedor en un archivo YAML:

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    environment:
      - DB_HOST=db
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - app-net

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: miapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secreto
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-net

volumes:
  db-data:

networks:
  app-net:
    driver: bridge
```

```bash
# Levantar todos los servicios
docker compose up -d

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Detener y eliminar volúmenes
docker compose down -v

# Reconstruir imágenes
docker compose build

# Escalar servicio
docker compose up -d --scale web=3
```

## .dockerignore

Excluye archivos del contexto de build:

```
# .dockerignore
.git
.gitignore
node_modules
*.md
.env
Dockerfile
docker-compose.yml
.dockerignore
__pycache__
*.pyc
```

> **Para el examen:** `.dockerignore` reduce el tamaño del contexto de build enviado al daemon Docker, acelerando la construcción y evitando incluir archivos sensibles en la imagen.

## Seguridad en Docker

### Docker Rootless

```bash
# Instalar Docker rootless
dockerd-rootless-setuptool.sh install

# Configurar variable de entorno
export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock
```

### User Namespaces

```bash
# Habilitar user namespaces en dockerd
# /etc/docker/daemon.json
{
  "userns-remap": "default"
}

# Verificar
docker info | grep -i userns
```

### Buenas prácticas de seguridad

```bash
# No ejecutar como root
docker run --user 1000:1000 nginx

# Eliminar capabilities
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx

# Filesystem de solo lectura
docker run --read-only nginx

# Sin acceso a nuevos privilegios
docker run --security-opt=no-new-privileges nginx

# NUNCA usar --privileged en producción
```

## Limpieza del Sistema

```bash
# Eliminar contenedores detenidos, redes no usadas, imágenes sin referencia, caché
docker system prune

# Incluir volúmenes
docker system prune --volumes

# Ver uso de disco
docker system df

# Limpiar imágenes no referenciadas
docker image prune -a
```

## Resumen

| Concepto | Detalle clave |
|---|---|
| Dockerfile | FROM, RUN, COPY, CMD, ENTRYPOINT, EXPOSE, VOLUME |
| CMD vs ENTRYPOINT | CMD = defecto sobrescribible; ENTRYPOINT = ejecutable fijo |
| Multi-stage | Múltiples FROM para imagen final mínima |
| bridge personalizado | DNS automático entre contenedores |
| Volúmenes vs Bind Mounts | Docker-managed vs ruta del host |
| Docker Compose | Aplicaciones multi-contenedor en YAML |
| .dockerignore | Excluir archivos del contexto de build |
| Rootless | Docker sin privilegios de root |
