---
title: "104.7 Encontrar archivos del sistema y su ubicacion correcta - Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.7"
---

# 104.7 Encontrar archivos del sistema y su ubicacion correcta - Comandos clave

## find - Buscar archivos en tiempo real

### Por nombre

| Comando | Descripcion |
|---------|-------------|
| `find /ruta -name "archivo"` | Buscar por nombre exacto |
| `find /ruta -name "*.txt"` | Buscar por patron (comodines) |
| `find /ruta -iname "*.TXT"` | Buscar sin distinguir mayusculas |

### Por tipo

| Comando | Descripcion |
|---------|-------------|
| `find /ruta -type f` | Solo archivos regulares |
| `find /ruta -type d` | Solo directorios |
| `find /ruta -type l` | Solo enlaces simbolicos |

**Tipos:** `f`=archivo, `d`=directorio, `l`=enlace, `b`=bloque, `c`=caracter, `p`=pipe, `s`=socket

### Por tamano

| Comando | Descripcion |
|---------|-------------|
| `find / -size +100M` | Mayor de 100 MB |
| `find / -size -1k` | Menor de 1 KB |
| `find / -size 0` | Archivos vacios |
| `find / -empty` | Archivos/directorios vacios |

**Sufijos:** `c`=bytes, `k`=KB, `M`=MB, `G`=GB

### Por tiempo

| Comando | Descripcion |
|---------|-------------|
| `find / -mtime -7` | Modificados en ultimos 7 dias |
| `find / -mtime +30` | Modificados hace mas de 30 dias |
| `find / -mmin -60` | Modificados en ultimos 60 minutos |
| `find / -amin -30` | Accedidos en ultimos 30 minutos |

### Por permisos y propietario

| Comando | Descripcion |
|---------|-------------|
| `find / -perm 777` | Permisos exactos 777 |
| `find / -perm -4000` | Con SUID activo |
| `find / -perm -2000` | Con SGID activo |
| `find / -user sandra` | Propiedad de usuario sandra |
| `find / -group developers` | Propiedad del grupo developers |

### Acciones (-exec)

| Comando | Descripcion |
|---------|-------------|
| `find /tmp -name "*.tmp" -exec rm {} \;` | Borrar archivos encontrados |
| `find / -name "*.sh" -exec chmod 755 {} \;` | Cambiar permisos |
| `find / -name "*.conf" -exec ls -l {} \;` | Listar en detalle |
| `find / -name "*.log" -exec grep -l "error" {} +` | Buscar texto (agrupado) |
| `find /tmp -name "*.tmp" -delete` | Borrar (alternativa a -exec rm) |

## locate / mlocate - Busqueda rapida en base de datos

| Comando | Descripcion |
|---------|-------------|
| `locate passwd` | Buscar archivos que contengan "passwd" en su ruta |
| `locate -i readme` | Buscar sin distinguir mayusculas |
| `locate -n 10 "*.conf"` | Limitar a 10 resultados |
| `locate -c "*.log"` | Contar coincidencias |
| `locate -r '/etc/.*\.conf$'` | Buscar con expresion regular |
| `sudo updatedb` | Actualizar base de datos |

### Configuracion de updatedb (/etc/updatedb.conf)

| Variable | Funcion |
|----------|---------|
| `PRUNEPATHS` | Directorios a excluir |
| `PRUNEFS` | Tipos de FS a excluir |
| `PRUNENAMES` | Nombres de directorios a excluir |
| `PRUNE_BIND_MOUNTS` | Excluir bind mounts (yes/no) |

## which - Ruta del ejecutable

| Comando | Descripcion |
|---------|-------------|
| `which ls` | Ruta completa del ejecutable ls |
| `which -a python` | Todas las ubicaciones de python en $PATH |

> Nota: `which` NO encuentra builtins del shell

## whereis - Binario, fuente y manual

| Comando | Descripcion |
|---------|-------------|
| `whereis ls` | Binario, fuente y man page de ls |
| `whereis -b ls` | Solo binario |
| `whereis -m ls` | Solo pagina de manual |
| `whereis -s gcc` | Solo codigo fuente |

## type - Identificar tipo de comando

| Comando | Descripcion |
|---------|-------------|
| `type ls` | ¿Que es ls? (alias, builtin, archivo...) |
| `type cd` | ¿Que es cd? (builtin) |
| `type -t ls` | Solo el tipo (una palabra) |
| `type -a ls` | Todas las definiciones de ls |

**Tipos:** `alias`, `builtin`, `file`, `function`, `keyword`

## Comparativa de comandos de busqueda

| Comando | Busca en | Velocidad | Encuentra builtins | Requiere ruta |
|---------|---------|-----------|-------------------|---------------|
| `find` | Disco (tiempo real) | Lenta | No | Si |
| `locate` | Base de datos | Muy rapida | No | No |
| `which` | $PATH | Rapida | No | No |
| `whereis` | Ubicaciones estandar | Rapida | No | No |
| `type` | Shell + $PATH | Rapida | Si | No |

## FHS - Directorios clave (referencia rapida)

| Directorio | Contenido |
|-----------|-----------|
| `/bin` | Binarios esenciales (-> `/usr/bin` en UsrMerge) |
| `/sbin` | Binarios admin (-> `/usr/sbin` en UsrMerge) |
| `/lib`, `/lib64` | Bibliotecas (-> `/usr/lib` en UsrMerge) |
| `/usr/bin` | Binarios de usuario |
| `/usr/sbin` | Binarios de administracion |
| `/usr/local` | Software instalado localmente (manual) |
| `/etc` | Configuracion del sistema |
| `/var/log` | Logs del sistema |
| `/var/spool` | Colas de trabajo |
| `/var/tmp` | Temporales persistentes |
| `/tmp` | Temporales (se borran al reiniciar) |
| `/home` | Directorios de usuarios |
| `/root` | Home de root |
| `/boot` | Kernel, initramfs, GRUB |
| `/dev` | Archivos de dispositivo |
| `/proc` | FS virtual: procesos y kernel |
| `/sys` | FS virtual: hardware y drivers |
| `/run` | Datos de runtime (desde ultimo boot) |
| `/mnt` | Montajes manuales temporales |
| `/media` | Montajes automaticos de extraibles |
| `/opt` | Software de terceros |
| `/srv` | Datos de servicios |
