---
title: "352.3 - Comandos Clave: Docker"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "352 - Virtualización de Contenedores"
subtema: "352.3"
peso: 9
tags:
  - lpic-3
  - tema-352
  - comandos
  - docker
  - dockerfile
  - docker-compose
---

# Comandos Clave - 352.3 Docker

## Gestión de Imágenes

| Comando | Descripción |
|---|---|
| `docker build -t <nombre>:<tag> .` | Construir imagen desde Dockerfile |
| `docker build -f Dockerfile.prod -t app:v1 .` | Construir con Dockerfile específico |
| `docker images` / `docker image ls` | Listar imágenes locales |
| `docker pull <imagen>:<tag>` | Descargar imagen del registry |
| `docker push <imagen>:<tag>` | Subir imagen al registry |
| `docker tag <imagen> <nuevo-nombre>:<tag>` | Etiquetar imagen |
| `docker rmi <imagen>` | Eliminar imagen |
| `docker history <imagen>` | Ver capas/historial de la imagen |
| `docker inspect <imagen>` | Inspeccionar metadatos de imagen |
| `docker image prune` | Eliminar imágenes sin referencia |

## Gestión de Contenedores

| Comando | Descripción |
|---|---|
| `docker run -d --name X -p 8080:80 nginx` | Ejecutar contenedor en background |
| `docker run -it --rm ubuntu bash` | Ejecutar interactivo, eliminar al salir |
| `docker ps` | Listar contenedores activos |
| `docker ps -a` | Listar todos los contenedores |
| `docker stop <contenedor>` | Detener contenedor |
| `docker start <contenedor>` | Iniciar contenedor detenido |
| `docker restart <contenedor>` | Reiniciar contenedor |
| `docker rm <contenedor>` | Eliminar contenedor |
| `docker rm -f <contenedor>` | Forzar eliminación |
| `docker logs <contenedor>` | Ver logs |
| `docker logs -f --tail 100 <contenedor>` | Seguir últimas 100 líneas |
| `docker exec -it <contenedor> bash` | Shell en contenedor activo |
| `docker inspect <contenedor>` | Inspeccionar contenedor |
| `docker cp <archivo> <cont>:<ruta>` | Copiar archivo al contenedor |
| `docker cp <cont>:<ruta> <local>` | Copiar archivo del contenedor |
| `docker commit <cont> <imagen>:<tag>` | Crear imagen desde contenedor |
| `docker stats` | Estadísticas en tiempo real |

## Redes

| Comando | Descripción |
|---|---|
| `docker network ls` | Listar redes |
| `docker network create <red>` | Crear red bridge |
| `docker network create --subnet X <red>` | Crear red con subnet |
| `docker network inspect <red>` | Inspeccionar red |
| `docker network connect <red> <cont>` | Conectar contenedor a red |
| `docker network disconnect <red> <cont>` | Desconectar de red |
| `docker network rm <red>` | Eliminar red |
| `docker network prune` | Eliminar redes no usadas |

## Volúmenes

| Comando | Descripción |
|---|---|
| `docker volume create <vol>` | Crear volumen |
| `docker volume ls` | Listar volúmenes |
| `docker volume inspect <vol>` | Inspeccionar volumen |
| `docker volume rm <vol>` | Eliminar volumen |
| `docker volume prune` | Eliminar volúmenes no usados |
| `-v <vol>:/ruta` | Montar volumen en contenedor |
| `-v /host:/cont:ro` | Bind mount solo lectura |

## Docker Compose

| Comando | Descripción |
|---|---|
| `docker compose up -d` | Levantar servicios en background |
| `docker compose down` | Detener y eliminar servicios |
| `docker compose down -v` | Detener, eliminar servicios y volúmenes |
| `docker compose ps` | Estado de servicios |
| `docker compose logs -f` | Logs de todos los servicios |
| `docker compose build` | Reconstruir imágenes |
| `docker compose up -d --scale web=3` | Escalar servicio |
| `docker compose exec <servicio> bash` | Shell en servicio |
| `docker compose pull` | Descargar imágenes actualizadas |

## Limpieza

| Comando | Descripción |
|---|---|
| `docker system prune` | Limpiar recursos no usados |
| `docker system prune --volumes` | Limpiar incluyendo volúmenes |
| `docker system df` | Ver uso de disco |
| `docker image prune -a` | Eliminar todas las imágenes no usadas |
| `docker container prune` | Eliminar contenedores detenidos |

## Instrucciones Dockerfile

| Instrucción | Descripción |
|---|---|
| `FROM <imagen>` | Imagen base |
| `RUN <comando>` | Ejecutar comando durante build |
| `COPY <origen> <destino>` | Copiar archivos del contexto |
| `ADD <origen> <destino>` | Copiar + descomprimir tar + URLs |
| `CMD ["exec", "arg"]` | Comando por defecto |
| `ENTRYPOINT ["exec"]` | Ejecutable principal |
| `ENV VAR=valor` | Variable de entorno |
| `ARG VAR=valor` | Variable de build |
| `EXPOSE <puerto>` | Documentar puertos |
| `VOLUME ["/data"]` | Definir punto de montaje |
| `WORKDIR /ruta` | Directorio de trabajo |
| `USER <usuario>` | Usuario de ejecución |
| `HEALTHCHECK CMD <cmd>` | Verificación de salud |
| `LABEL clave="valor"` | Metadatos |

## Archivos Importantes

| Ruta | Descripción |
|---|---|
| `Dockerfile` | Definición de imagen |
| `.dockerignore` | Exclusiones del contexto de build |
| `docker-compose.yml` | Definición multi-contenedor |
| `/etc/docker/daemon.json` | Configuración del daemon |
| `/var/lib/docker/` | Datos de Docker (imágenes, contenedores) |
| `/var/run/docker.sock` | Socket Unix del daemon |
