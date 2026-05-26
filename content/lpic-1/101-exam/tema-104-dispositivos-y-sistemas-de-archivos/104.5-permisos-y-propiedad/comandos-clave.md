---
title: "104.5 Gestionar permisos y propiedad de archivos - Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.5"
---

# 104.5 Gestionar permisos y propiedad de archivos - Comandos clave

## Ver permisos

| Comando | Descripcion |
|---------|-------------|
| `ls -l` | Ver permisos en formato largo |
| `ls -la` | Incluir archivos ocultos |
| `ls -ld directorio/` | Ver permisos del directorio (no su contenido) |
| `stat archivo` | Informacion completa (permisos en octal y simbolico) |

## chmod - Cambiar permisos

### Modo simbolico

| Comando | Resultado |
|---------|-----------|
| `chmod u+x archivo` | Anadir ejecucion al propietario |
| `chmod g-w archivo` | Quitar escritura al grupo |
| `chmod o=r archivo` | Establecer solo lectura para otros |
| `chmod a+r archivo` | Anadir lectura a todos |
| `chmod u+x,g=rx,o-w archivo` | Multiples cambios |
| `chmod u=rwx,g=rx,o= archivo` | Establecer todos exactamente |
| `chmod +x archivo` | Anadir ejecucion a todos |
| `chmod -R u+rw directorio/` | Recursivo |

### Modo numerico (octal)

| Comando | Permisos resultantes | Uso tipico |
|---------|---------------------|------------|
| `chmod 777 archivo` | rwxrwxrwx | Todos (inseguro) |
| `chmod 755 archivo` | rwxr-xr-x | Scripts, directorios |
| `chmod 750 dir/` | rwxr-x--- | Dir privado de grupo |
| `chmod 700 dir/` | rwx------ | Dir privado |
| `chmod 644 archivo` | rw-r--r-- | Archivos regulares |
| `chmod 640 archivo` | rw-r----- | Legible por grupo |
| `chmod 600 archivo` | rw------- | Archivos privados |

### Permisos especiales (4 digitos)

| Comando | Resultado |
|---------|-----------|
| `chmod 4755 archivo` | SUID + rwxr-xr-x |
| `chmod 2775 dir/` | SGID + rwxrwxr-x |
| `chmod 1777 dir/` | Sticky + rwxrwxrwx |
| `chmod 6755 archivo` | SUID + SGID + rwxr-xr-x |
| `chmod u+s archivo` | Establecer SUID |
| `chmod g+s dir/` | Establecer SGID |
| `chmod +t dir/` | Establecer sticky bit |
| `chmod u-s archivo` | Quitar SUID |
| `chmod g-s dir/` | Quitar SGID |
| `chmod -t dir/` | Quitar sticky bit |

## chown - Cambiar propietario

| Comando | Descripcion |
|---------|-------------|
| `chown sandra archivo` | Cambiar propietario |
| `chown sandra:developers archivo` | Cambiar propietario y grupo |
| `chown :developers archivo` | Cambiar solo grupo |
| `chown -R sandra:developers dir/` | Recursivo |
| `chown --reference=ref archivo` | Copiar propietario de otro archivo |

## chgrp - Cambiar grupo

| Comando | Descripcion |
|---------|-------------|
| `chgrp developers archivo` | Cambiar grupo |
| `chgrp -R developers dir/` | Recursivo |

## umask

| Comando | Descripcion |
|---------|-------------|
| `umask` | Ver umask actual (octal) |
| `umask -S` | Ver umask actual (simbolico) |
| `umask 022` | Establecer umask (archivos:644, dirs:755) |
| `umask 077` | Establecer umask (archivos:600, dirs:700) |
| `umask 002` | Establecer umask (archivos:664, dirs:775) |
| `umask 027` | Establecer umask (archivos:640, dirs:750) |

## Tabla de calculo de umask

| umask | Archivos (base 666) | Directorios (base 777) |
|-------|---------------------|----------------------|
| `022` | 644 (rw-r--r--) | 755 (rwxr-xr-x) |
| `002` | 664 (rw-rw-r--) | 775 (rwxrwxr-x) |
| `077` | 600 (rw-------) | 700 (rwx------) |
| `027` | 640 (rw-r-----) | 750 (rwxr-x---) |
| `066` | 600 (rw-------) | 711 (rwx--x--x) |
| `000` | 666 (rw-rw-rw-) | 777 (rwxrwxrwx) |

## Permisos especiales - Resumen rapido

| Permiso | Octal | Simbolico | En archivo | En directorio |
|---------|-------|-----------|------------|---------------|
| SUID | 4000 | u+s | Ejecuta como propietario | Sin efecto |
| SGID | 2000 | g+s | Ejecuta como grupo | Hereda grupo del dir |
| Sticky | 1000 | +t | Sin efecto | Solo owner borra |

## Indicadores en ls -l

| Caracter | Posicion | Significado |
|----------|----------|-------------|
| `s` | En lugar de `x` del user | SUID + ejecucion |
| `S` | En lugar de `x` del user | SUID sin ejecucion |
| `s` | En lugar de `x` del group | SGID + ejecucion |
| `S` | En lugar de `x` del group | SGID sin ejecucion |
| `t` | En lugar de `x` de others | Sticky + ejecucion |
| `T` | En lugar de `x` de others | Sticky sin ejecucion |

## Valores octales de permisos

| Permiso | Valor |
|---------|-------|
| r (lectura) | 4 |
| w (escritura) | 2 |
| x (ejecucion) | 1 |
| - (nada) | 0 |
| **rwx** | **7** |
| **rw-** | **6** |
| **r-x** | **5** |
| **r--** | **4** |
