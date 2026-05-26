---
title: "104.6 Crear y cambiar enlaces duros y simbolicos - Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.6"
---

# 104.6 Crear y cambiar enlaces duros y simbolicos - Comandos clave

## Crear enlaces

| Comando | Descripcion |
|---------|-------------|
| `ln archivo enlace` | Crear enlace duro |
| `ln -s objetivo enlace` | Crear enlace simbolico |
| `ln -s /ruta/absoluta enlace` | Enlace simbolico con ruta absoluta |
| `ln -s ../relativa enlace` | Enlace simbolico con ruta relativa |
| `ln -sf objetivo enlace` | Crear/sobrescribir enlace simbolico (force) |
| `ln -s /var/log /home/user/logs` | Enlace simbolico a directorio |

## Identificar enlaces

| Comando | Descripcion |
|---------|-------------|
| `ls -l` | Ver tipo (l = simbolico) y destino (-> target) |
| `ls -li` | Ver inodos + permisos (enlaces duros comparten inodo) |
| `ls -i archivo1 archivo2` | Comparar inodos (iguales = enlace duro) |
| `stat archivo` | Info completa del inodo |
| `stat -L enlace` | Info del destino (siguiendo el enlace) |
| `readlink enlace` | Ver destino de enlace simbolico |
| `readlink -f enlace` | Resolver ruta absoluta completa |
| `file enlace` | Identifica si es enlace simbolico |

## Buscar enlaces

| Comando | Descripcion |
|---------|-------------|
| `find /ruta -type l` | Buscar enlaces simbolicos |
| `find /ruta -xtype l` | Buscar enlaces simbolicos rotos |
| `find /ruta -type f -links +1` | Archivos con mas de 1 enlace duro |
| `find /ruta -samefile archivo` | Buscar enlaces duros a un archivo |
| `find /ruta -inum 1234567` | Buscar por numero de inodo |

## Tabla comparativa rapida

| Aspecto | Enlace duro (`ln`) | Enlace simbolico (`ln -s`) |
|---------|-------------------|---------------------------|
| Inodo | Mismo | Diferente |
| Cruza FS | No | Si |
| A directorios | No | Si |
| Borrar original | Datos persisten | Enlace roto |
| Tipo en `ls -l` | `-` (normal) | `l` (link) |
| Visual en `ls -l` | Sin indicador | `-> destino` |
| Puede ser a inexistente | No | Si |

## Conteo de enlaces en ls -l

```
-rw-r--r-- 2 sandra sandra 1024 ... archivo.txt
            ^
            Numero de enlaces duros que apuntan a este inodo
```

| Tipo | Conteo minimo |
|------|--------------|
| Archivo regular (sin enlaces extra) | 1 |
| Archivo con 1 enlace duro adicional | 2 |
| Directorio vacio | 2 (el directorio + `.` dentro) |
| Directorio con N subdirectorios | 2 + N (por los `..` de cada subdir) |

## Ejemplos practicos

```bash
# Crear enlace duro y verificar
ln original.txt duro.txt
ls -li original.txt duro.txt    # Mismo inodo, conteo = 2

# Crear enlace simbolico y verificar
ln -s original.txt simb.txt
ls -li original.txt simb.txt    # Diferente inodo, tipo 'l'

# Ver destino de enlace simbolico
readlink simb.txt               # original.txt
readlink -f simb.txt            # /ruta/completa/original.txt

# Borrar original: duro sobrevive, simb se rompe
rm original.txt
cat duro.txt                    # Funciona
cat simb.txt                    # Error: No such file or directory

# Sobrescribir enlace simbolico existente
ln -sf nuevo_destino.txt simb.txt
```
