---
title: "102.3 - Gestion de bibliotecas compartidas: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.3"
---

# 102.3 - Gestion de bibliotecas compartidas: Comandos clave

## ldd - Listar dependencias

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `ldd <ejecutable>` | Mostrar bibliotecas compartidas requeridas | `ldd /bin/ls` |
| `ldd -v <ejecutable>` | Modo verbose con informacion de version | `ldd -v /usr/bin/ssh` |
| `ldd -u <ejecutable>` | Mostrar dependencias no utilizadas | `ldd -u /bin/ls` |

### Alternativas seguras a ldd

| Comando | Descripcion |
|---------|-------------|
| `objdump -p <ejecutable> \| grep NEEDED` | Listar dependencias sin ejecutar el binario |
| `readelf -d <ejecutable> \| grep NEEDED` | Listar dependencias de forma segura |

## ldconfig - Gestionar cache de bibliotecas

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `ldconfig` | Actualizar cache y crear enlaces simbolicos | `sudo ldconfig` |
| `ldconfig -p` | Mostrar todas las bibliotecas en cache | `ldconfig -p` |
| `ldconfig -p \| grep <nombre>` | Buscar biblioteca en cache | `ldconfig -p \| grep libssl` |
| `ldconfig -v` | Modo verbose (muestra lo que hace) | `sudo ldconfig -v` |
| `ldconfig -N` | No reconstruir cache (solo enlaces) | `sudo ldconfig -N` |
| `ldconfig <directorio>` | Procesar solo un directorio | `sudo ldconfig /opt/lib` |

## Archivos de configuracion

| Archivo | Funcion |
|---------|---------|
| `/etc/ld.so.conf` | Lista de directorios de busqueda de bibliotecas |
| `/etc/ld.so.conf.d/*.conf` | Archivos individuales con rutas adicionales |
| `/etc/ld.so.cache` | Cache binaria de bibliotecas (generada por ldconfig) |

## LD_LIBRARY_PATH

| Accion | Comando |
|--------|---------|
| Establecer temporalmente | `export LD_LIBRARY_PATH=/opt/lib` |
| Anadir a la ruta existente | `export LD_LIBRARY_PATH=/opt/lib:$LD_LIBRARY_PATH` |
| Usar para un solo comando | `LD_LIBRARY_PATH=/opt/lib ./programa` |
| Ver valor actual | `echo $LD_LIBRARY_PATH` |

## Directorios estandar de bibliotecas

| Directorio | Contenido |
|-----------|-----------|
| `/lib` | Bibliotecas esenciales del sistema |
| `/lib64` | Bibliotecas esenciales de 64 bits |
| `/usr/lib` | Bibliotecas del sistema (paquetes) |
| `/usr/lib64` | Bibliotecas de 64 bits (paquetes) |
| `/usr/local/lib` | Bibliotecas compiladas localmente |

## Convencion de nombres

```
libNOMBRE.so.MAYOR.MENOR.REVISION
```

| Componente | Ejemplo | Descripcion |
|-----------|---------|-------------|
| `lib` | `lib` | Prefijo obligatorio |
| Nombre | `readline` | Nombre de la biblioteca |
| `.so` | `.so` | Shared Object |
| Mayor | `.8` | Version mayor (incompatible) |
| Menor | `.1` | Version menor (compatible) |
| Revision | `.2` | Correccion de errores |

### Ejemplo de enlaces simbolicos

```
libreadline.so       -> libreadline.so.8         (desarrollo)
libreadline.so.8     -> libreadline.so.8.1.2     (soname)
libreadline.so.8.1.2                              (archivo real)
```

## Orden de busqueda de bibliotecas

```
1. RPATH/RUNPATH (incrustado en el ejecutable)
2. LD_LIBRARY_PATH (variable de entorno)
3. /etc/ld.so.cache (cache generada por ldconfig)
4. /lib y /usr/lib (directorios por defecto)
```

## Flujo para anadir nuevas bibliotecas

```bash
# 1. Copiar las bibliotecas al directorio deseado
cp libmiapp.so.1.0.0 /usr/local/lib/

# 2. Crear archivo de configuracion
echo "/usr/local/lib" | sudo tee /etc/ld.so.conf.d/local.conf

# 3. Actualizar la cache
sudo ldconfig

# 4. Verificar
ldconfig -p | grep miapp
ldd /usr/local/bin/miapp
```

## El cargador dinamico

| Archivo | Arquitectura |
|---------|-------------|
| `/lib64/ld-linux-x86-64.so.2` | 64 bits (x86_64) |
| `/lib/ld-linux.so.2` | 32 bits (x86) |

```bash
# Usar el cargador directamente (equivalente a ldd)
/lib64/ld-linux-x86-64.so.2 --list /bin/ls
```
