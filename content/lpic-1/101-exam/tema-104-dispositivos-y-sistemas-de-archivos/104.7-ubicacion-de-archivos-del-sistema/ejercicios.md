---
title: "104.7 Encontrar archivos del sistema y su ubicacion correcta - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.7"
---

# 104.7 Encontrar archivos del sistema y su ubicacion correcta - Ejercicios

## Ejercicio 1
**Segun el FHS, ¿en que directorio deberian ubicarse los siguientes elementos?**
- a) Archivos de configuracion del servidor Apache
- b) Logs del sistema
- c) Un programa comercial como Google Chrome instalado como paquete de terceros
- d) Software compilado e instalado manualmente por el administrador
- e) El kernel de Linux
- f) El directorio personal del usuario root

<details>
<summary>Ver respuesta</summary>

| Elemento | Ubicacion FHS |
|----------|--------------|
| a) Config de Apache | `/etc/apache2/` o `/etc/httpd/` (siempre en `/etc`) |
| b) Logs del sistema | `/var/log/` |
| c) Google Chrome (terceros) | `/opt/google/chrome/` (software de terceros en `/opt`) |
| d) Software compilado manualmente | `/usr/local/` (binarios en `/usr/local/bin`, libs en `/usr/local/lib`) |
| e) Kernel de Linux | `/boot/` (archivo `vmlinuz-*`) |
| f) Home de root | `/root` (NO en `/home/root`) |

</details>

---

## Ejercicio 2
**¿Cual es la diferencia entre `/tmp` y `/var/tmp`? ¿Y entre `/mnt` y `/media`?**

<details>
<summary>Ver respuesta</summary>

**`/tmp` vs `/var/tmp`:**

| Directorio | Persistencia | Uso |
|-----------|-------------|-----|
| `/tmp` | Se **borra al reiniciar** el sistema | Archivos temporales de corta vida |
| `/var/tmp` | **Persiste entre reinicios** | Archivos temporales que deben sobrevivir reinicios |

**`/mnt` vs `/media`:**

| Directorio | Uso |
|-----------|-----|
| `/mnt` | Punto de montaje para montajes **manuales temporales** del administrador |
| `/media` | Punto de montaje **automatico** para medios extraibles (USB, CD/DVD, etc.) |

En la practica: cuando insertas un USB, el entorno de escritorio lo monta automaticamente en `/media/usuario/nombre_usb`. Si el administrador quiere montar algo manualmente, usa `/mnt`.

</details>

---

## Ejercicio 3
**¿Que comando usarias para cada una de estas tareas?**
- a) Encontrar TODOS los archivos `.conf` dentro de `/etc`
- b) Saber si `cd` es un builtin del shell o un programa externo
- c) Encontrar rapidamente donde esta el archivo `updatedb.conf` (sin recorrer el disco)
- d) Saber la ruta completa del comando `fdisk`
- e) Encontrar todos los archivos con SUID activo en el sistema

<details>
<summary>Ver respuesta</summary>

```bash
# a) Encontrar archivos .conf en /etc
find /etc -name "*.conf"
# O tambien: find /etc -type f -name "*.conf"

# b) Saber si cd es builtin
type cd
# cd is a shell builtin

# c) Encontrar rapidamente updatedb.conf
locate updatedb.conf
# /etc/updatedb.conf

# d) Ruta completa de fdisk
which fdisk
# /usr/sbin/fdisk
# O tambien: whereis fdisk

# e) Archivos con SUID en todo el sistema
find / -perm -4000 -type f
# O: find / -perm -u=s -type f
```

</details>

---

## Ejercicio 4
**Explica las diferencias entre `which`, `whereis` y `type`. ¿Cuando usarias cada uno?**

<details>
<summary>Ver respuesta</summary>

| Comando | Que busca | Donde busca | Encuentra builtins | Ejemplo |
|---------|-----------|-------------|-------------------|---------|
| `which` | Solo el ejecutable | Solo en `$PATH` | No | `which ls` -> `/usr/bin/ls` |
| `whereis` | Binario + fuente + man page | Ubicaciones estandar del sistema | No | `whereis ls` -> `/usr/bin/ls /usr/share/man/man1/ls.1.gz` |
| `type` | Tipo del comando | Shell (alias, builtins, funciones) + `$PATH` | **Si** | `type cd` -> `cd is a shell builtin` |

**Cuando usar cada uno:**
- **`which`**: Cuando solo necesitas la ruta del ejecutable (ej: para un script)
- **`whereis`**: Cuando necesitas encontrar tambien la pagina de manual o el codigo fuente
- **`type`**: Cuando quieres saber QUE es un comando (si es alias, builtin, funcion o archivo), especialmente si sospechas que un comando esta siendo reemplazado por un alias

</details>

---

## Ejercicio 5
**`locate` no encuentra un archivo que sabes que existe y fue creado hace 5 minutos. ¿Por que? ¿Como lo solucionarias?**

<details>
<summary>Ver respuesta</summary>

**Causa:** `locate` busca en una base de datos indexada que se actualiza periodicamente (normalmente una vez al dia mediante un cron job). Si el archivo fue creado hace 5 minutos, la base de datos no lo incluye todavia.

**Solucion:**

```bash
# Opcion 1: Actualizar la base de datos manualmente
sudo updatedb

# Ahora locate lo encontrara
locate nombre_archivo

# Opcion 2: Usar find (busca en tiempo real, siempre actualizado)
find / -name "nombre_archivo"
```

La base de datos se configura en `/etc/updatedb.conf`, donde se definen las rutas y sistemas de archivos a excluir de la indexacion (`PRUNEPATHS`, `PRUNEFS`).

</details>

---

## Ejercicio 6
**Escribe comandos `find` para:**
- a) Buscar archivos mayores de 500 MB en todo el sistema
- b) Buscar archivos modificados en las ultimas 24 horas en `/var/log`
- c) Buscar archivos `.tmp` en `/tmp` y borrarlos
- d) Buscar directorios vacios en `/home`

<details>
<summary>Ver respuesta</summary>

```bash
# a) Archivos mayores de 500 MB
find / -type f -size +500M

# b) Archivos modificados en ultimas 24 horas en /var/log
find /var/log -type f -mtime -1
# O en minutos: find /var/log -type f -mmin -1440

# c) Buscar y borrar archivos .tmp en /tmp
find /tmp -name "*.tmp" -exec rm {} \;
# O mas eficiente:
find /tmp -name "*.tmp" -delete

# d) Directorios vacios en /home
find /home -type d -empty
```

**Notas sobre `-mtime`:**
- `-mtime -1` = modificados en las ultimas 24 horas (menos de 1 dia)
- `-mtime +7` = modificados hace mas de 7 dias
- `-mtime 7` = modificados exactamente hace 7 dias

</details>

---

## Ejercicio 7
**¿Que es el UsrMerge? Explica que directorios se ven afectados y por que se implemento.**

<details>
<summary>Ver respuesta</summary>

**UsrMerge** es un cambio en la estructura del sistema de archivos donde los directorios raiz `/bin`, `/sbin`, `/lib` y `/lib64` se convierten en **enlaces simbolicos** a sus equivalentes dentro de `/usr/`:

| Enlace | Destino |
|--------|---------|
| `/bin` -> | `/usr/bin` |
| `/sbin` -> | `/usr/sbin` |
| `/lib` -> | `/usr/lib` |
| `/lib64` -> | `/usr/lib64` |

**¿Por que se implemento?**
1. **Simplificacion:** Elimina la distincion historica entre "binarios necesarios antes de montar /usr" y "binarios en /usr". En sistemas modernos, `/usr` siempre esta disponible en el arranque.
2. **Facilidad de gestion:** Todo el software del sistema esta en un solo lugar (`/usr`).
3. **Snapshots y backups:** Es mas facil hacer snapshots de un solo directorio.
4. **Compatibilidad:** Los enlaces simbolicos mantienen compatibilidad con scripts y programas que usan las rutas antiguas.

**Distribuciones con UsrMerge:** Fedora, Arch Linux, Debian 12+, Ubuntu 22.04+, openSUSE Tumbleweed, entre otras.

</details>

---

## Ejercicio 8
**Para cada directorio del FHS, indica si su contenido es estatico o variable, y si es compartible en red o no:**
- a) `/usr`
- b) `/etc`
- c) `/var`
- d) `/home`
- e) `/boot`

<details>
<summary>Ver respuesta</summary>

| Directorio | Estatico/Variable | Compartible/No compartible |
|-----------|-------------------|---------------------------|
| a) `/usr` | **Estatico** (no cambia en operacion normal) | **Compartible** (puede compartirse via NFS entre multiples maquinas) |
| b) `/etc` | **Estatico** (cambia solo por configuracion) | **No compartible** (especifico de cada maquina) |
| c) `/var` | **Variable** (logs, colas, cache cambian constantemente) | **Parcial** (algunos subdirectorios como `/var/mail` son compartibles, otros como `/var/run` no) |
| d) `/home` | **Variable** (los usuarios modifican sus archivos) | **Compartible** (se puede compartir via NFS para login centralizado) |
| e) `/boot` | **Estatico** (solo cambia al actualizar kernel) | **No compartible** (especifico del hardware de cada maquina) |

Esta clasificacion es util para planificar particiones, backups y montajes NFS.

</details>
