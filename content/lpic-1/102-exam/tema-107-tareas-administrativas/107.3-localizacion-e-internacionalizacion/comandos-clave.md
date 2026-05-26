---
title: "107.3 - Comandos clave: Localizacion e internacionalizacion"
tags:
  - lpic-1
  - examen-102
  - tema-107
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "107"
subtema: "107.3"
---

# 107.3 - Comandos clave: Localizacion e internacionalizacion

## Variables de locale

| Variable | Controla | Prioridad |
|----------|----------|-----------|
| `LC_ALL` | TODO (sobreescribe todas las demas) | Maxima |
| `LC_CTYPE` | Clasificacion de caracteres | Media |
| `LC_MESSAGES` | Idioma de mensajes del sistema | Media |
| `LC_NUMERIC` | Formato de numeros | Media |
| `LC_TIME` | Formato de fecha y hora | Media |
| `LC_COLLATE` | Orden de clasificacion (sort) | Media |
| `LC_MONETARY` | Formato de moneda | Media |
| `LC_PAPER` | Tamano de papel | Media |
| `LANG` | Valor por defecto si LC_* no esta definida | Minima |

### Orden de prioridad
```
LC_ALL  >  LC_*  >  LANG
```

## Formato de locale
```
idioma_PAIS.CODIFICACION
es_ES.UTF-8        # Espanol Espana UTF-8
en_US.UTF-8        # Ingles USA UTF-8
C / POSIX          # Locale minimo (ASCII, ingles)
```

## Comandos de locale

| Comando | Descripcion |
|---------|-------------|
| `locale` | Mostrar configuracion actual de locale |
| `locale -a` | Listar todos los locales disponibles |
| `locale -k LC_TIME` | Mostrar claves de una categoria |
| `localectl status` | Ver locale y layout de teclado (systemd) |
| `localectl set-locale LANG=es_ES.UTF-8` | Cambiar locale del sistema |
| `localectl list-locales` | Listar locales disponibles |
| `localectl set-keymap es` | Cambiar layout de teclado |
| `locale-gen` | Generar locales (Debian) |
| `dpkg-reconfigure locales` | Configurar locales interactivamente (Debian) |

## Archivos de configuracion de locale

| Archivo | Distribucion |
|---------|-------------|
| `/etc/locale.conf` | Red Hat, Fedora, Arch (systemd) |
| `/etc/default/locale` | Debian, Ubuntu |
| `/etc/locale.gen` | Lista de locales a generar (Debian) |

## Codificaciones de caracteres

| Codificacion | Bits | Descripcion |
|-------------|------|-------------|
| ASCII | 7 bits (128 chars) | Solo ingles basico, sin acentos |
| ISO-8859-1 (Latin-1) | 8 bits (256 chars) | Europa Occidental |
| ISO-8859-15 (Latin-9) | 8 bits (256 chars) | Como Latin-1 + simbolo euro |
| UTF-8 | 1-4 bytes variable | Todos los idiomas, estandar actual |

## iconv - Conversion de codificaciones

| Comando | Descripcion |
|---------|-------------|
| `iconv -f ISO-8859-1 -t UTF-8 entrada.txt > salida.txt` | Convertir Latin-1 a UTF-8 |
| `iconv -f UTF-8 -t ISO-8859-15 -o salida.txt entrada.txt` | Convertir UTF-8 a Latin-9 |
| `iconv -l` | Listar codificaciones disponibles |
| `iconv -f UTF-8 -t ASCII//TRANSLIT` | Convertir con transliteracion |
| `iconv -f UTF-8 -t ASCII//IGNORE` | Convertir ignorando errores |

| Opcion | Descripcion |
|--------|-------------|
| `-f` | Codificacion de origen (from) |
| `-t` | Codificacion de destino (to) |
| `-o` | Archivo de salida (output) |
| `-l` | Listar codificaciones |
| `//TRANSLIT` | Transliterar caracteres no disponibles |
| `//IGNORE` | Ignorar caracteres no convertibles |

## Zona horaria - Archivos

| Ruta | Descripcion |
|------|-------------|
| `/usr/share/zoneinfo/` | Directorio con archivos de zonas horarias |
| `/etc/localtime` | Enlace simbolico a la zona activa |
| `/etc/timezone` | Nombre de la zona en texto (Debian) |
| `TZ` | Variable de entorno para zona horaria temporal |

## Zona horaria - Comandos

| Comando | Descripcion |
|---------|-------------|
| `timedatectl` | Ver fecha, hora, zona horaria y NTP |
| `timedatectl set-timezone Europe/Madrid` | Cambiar zona horaria (systemd) |
| `timedatectl list-timezones` | Listar zonas disponibles |
| `timedatectl set-time "2026-05-26 14:30:00"` | Establecer fecha/hora |
| `timedatectl set-ntp true` | Activar sincronizacion NTP |
| `tzselect` | Seleccionar zona interactivamente (NO cambia config) |
| `dpkg-reconfigure tzdata` | Configurar zona (Debian interactivo) |
| `ln -sf /usr/share/zoneinfo/ZONA /etc/localtime` | Cambiar zona manualmente |

## Variable TZ

```bash
TZ="America/New_York" date    # Hora en Nueva York
TZ="Asia/Tokyo" date          # Hora en Tokio
TZ="UTC" date                 # Hora UTC
export TZ="Europe/Madrid"     # Para toda la sesion
```

## date con locale y zona horaria

```bash
date                                    # Fecha segun locale actual
LC_TIME=en_US.UTF-8 date              # Fecha en ingles
TZ="America/New_York" date            # Fecha en otra zona
date +"%d/%m/%Y %H:%M:%S"             # Formato personalizado
```

## Resumen de configuracion

### Cambiar locale
```bash
localectl set-locale LANG=es_ES.UTF-8     # systemd
# o editar /etc/locale.conf (Red Hat) o /etc/default/locale (Debian)
```

### Cambiar zona horaria
```bash
timedatectl set-timezone Europe/Madrid     # systemd
# o: ln -sf /usr/share/zoneinfo/Europe/Madrid /etc/localtime
# Debian: dpkg-reconfigure tzdata
```
