# 107.3 - Teoria: Localizacion e internacionalizacion

## 1. Conceptos basicos

### Internacionalizacion (i18n)
La **internacionalizacion** (i18n - 18 letras entre la i y la n) es el proceso de disenar software para que pueda adaptarse a diferentes idiomas y regiones sin necesidad de modificar el codigo fuente.

### Localizacion (l10n)
La **localizacion** (l10n - 10 letras entre la l y la n) es el proceso de adaptar el software a un idioma y region especificos: traducir textos, ajustar formatos de fecha, moneda, etc.

### Locale
Un **locale** es un conjunto de parametros que define las preferencias regionales del usuario: idioma, formato de fecha, moneda, orden de clasificacion, etc.

---

## 2. Variables de locale

Las variables de locale controlan diferentes aspectos de la configuracion regional.

### Variables individuales

| Variable | Controla | Ejemplo |
|----------|----------|---------|
| `LANG` | Configuracion por defecto para todas las categorias | `es_ES.UTF-8` |
| `LC_CTYPE` | Clasificacion de caracteres (mayusculas, minusculas, digitos) | `es_ES.UTF-8` |
| `LC_MESSAGES` | Idioma de mensajes del sistema y aplicaciones | `es_ES.UTF-8` |
| `LC_NUMERIC` | Formato de numeros (separador decimal, miles) | `es_ES.UTF-8` |
| `LC_TIME` | Formato de fecha y hora | `es_ES.UTF-8` |
| `LC_COLLATE` | Orden de clasificacion de cadenas (sort) | `es_ES.UTF-8` |
| `LC_MONETARY` | Formato de moneda | `es_ES.UTF-8` |
| `LC_PAPER` | Tamano de papel por defecto | `es_ES.UTF-8` |
| `LC_NAME` | Formato de nombres de personas | `es_ES.UTF-8` |
| `LC_ADDRESS` | Formato de direcciones | `es_ES.UTF-8` |
| `LC_TELEPHONE` | Formato de numeros de telefono | `es_ES.UTF-8` |
| `LC_MEASUREMENT` | Sistema de medidas (metrico/imperial) | `es_ES.UTF-8` |
| `LC_ALL` | Sobreescribe TODAS las variables de locale | `es_ES.UTF-8` |

### Orden de prioridad (CRITICO para el examen)

```
LC_ALL  >  LC_*  >  LANG
```

1. **`LC_ALL`**: Tiene la maxima prioridad. Si esta definida, sobreescribe TODAS las demas variables de locale (LC_* y LANG). Se usa para forzar una configuracion uniforme.

2. **`LC_*` individuales**: Prioridad media. Si estan definidas, sobreescriben a LANG para su categoria especifica.

3. **`LANG`**: Prioridad mas baja. Establece el valor por defecto para cualquier variable LC_* que NO este definida explicitamente.

**Ejemplo practico:**
```bash
# Sistema en espanol, pero con mensajes en ingles
export LANG="es_ES.UTF-8"         # Todo en espanol por defecto
export LC_MESSAGES="en_US.UTF-8"  # Mensajes del sistema en ingles
# LC_TIME, LC_NUMERIC, etc. heredan es_ES.UTF-8 de LANG

# Forzar todo en ingles (ignora LANG y todos los LC_*)
export LC_ALL="en_US.UTF-8"
```

**IMPORTANTE:** `LC_ALL` se usa normalmente solo de forma temporal (en scripts o para pruebas), NO para configuracion permanente, porque sobreescribe todo.

### Formato de un locale
```
idioma_PAIS.CODIFICACION
es_ES.UTF-8     # Espanol de Espana con UTF-8
en_US.UTF-8     # Ingles de Estados Unidos con UTF-8
pt_BR.ISO-8859-1  # Portugues de Brasil con ISO-8859-1
de_DE.UTF-8     # Aleman de Alemania con UTF-8
C               # Locale minimo POSIX (ingles basico, ASCII)
POSIX           # Equivalente a C
```

El locale `C` (o `POSIX`) es el locale minimo: usa ASCII, ingles basico, y un orden de clasificacion basado en el valor del byte.

---

## 3. Comandos de locale

### locale - Mostrar configuracion
```bash
# Mostrar la configuracion actual de locale
locale
# LANG=es_ES.UTF-8
# LC_CTYPE="es_ES.UTF-8"
# LC_NUMERIC="es_ES.UTF-8"
# LC_TIME="es_ES.UTF-8"
# LC_COLLATE="es_ES.UTF-8"
# ...
# LC_ALL=

# Listar todos los locales disponibles en el sistema
locale -a

# Listar solo locales con codificacion especifica
locale -a | grep UTF-8

# Mostrar informacion de un locale especifico
locale -k LC_TIME
```

### localectl - Configurar locale y layout del teclado (systemd)
```bash
# Ver configuracion actual
localectl status
# System Locale: LANG=es_ES.UTF-8
# VC Keymap: es
# X11 Layout: es

# Establecer locale del sistema
localectl set-locale LANG=es_ES.UTF-8
localectl set-locale LANG=es_ES.UTF-8 LC_MESSAGES=en_US.UTF-8

# Establecer layout del teclado
localectl set-keymap es
localectl set-x11-keymap es

# Listar locales disponibles
localectl list-locales

# Listar layouts de teclado
localectl list-keymaps
```

### Archivos de configuracion de locale

| Archivo | Distribucion | Descripcion |
|---------|-------------|-------------|
| `/etc/locale.conf` | Red Hat, Fedora, Arch (systemd) | Configuracion del locale del sistema |
| `/etc/default/locale` | Debian, Ubuntu | Configuracion del locale del sistema |
| `~/.bashrc` o `~/.profile` | Todas | Configuracion de locale por usuario |

**Contenido tipico de `/etc/locale.conf`:**
```
LANG=es_ES.UTF-8
LC_MESSAGES=en_US.UTF-8
```

**Contenido tipico de `/etc/default/locale`:**
```
LANG="es_ES.UTF-8"
```

### Generar locales
En Debian/Ubuntu, los locales se deben generar antes de poder usarlos:
```bash
# Editar la lista de locales a generar
nano /etc/locale.gen
# Descomentar: es_ES.UTF-8 UTF-8

# Generar los locales
locale-gen

# O usar dpkg-reconfigure
dpkg-reconfigure locales
```

---

## 4. Codificaciones de caracteres

### ASCII (American Standard Code for Information Interchange)
- **7 bits:** 128 caracteres (0-127)
- Incluye letras inglesas (a-z, A-Z), digitos (0-9), signos de puntuacion y caracteres de control
- **NO incluye** caracteres acentuados, n, ni caracteres de otros idiomas
- Base para todas las codificaciones posteriores

### ISO-8859 (Latin)
Familia de codificaciones de **8 bits** (256 caracteres). Los primeros 128 son ASCII, los siguientes 128 son especificos de cada variante:

| Codificacion | Nombre | Idiomas |
|-------------|--------|---------|
| ISO-8859-1 | Latin-1 | Europa Occidental (espanol, frances, aleman, etc.) |
| ISO-8859-2 | Latin-2 | Europa Central (polaco, checo, hungaro) |
| ISO-8859-5 | - | Cirilico (ruso, bulgaro) |
| ISO-8859-9 | Latin-5 | Turco |
| ISO-8859-15 | Latin-9 | Como Latin-1 pero con el simbolo del euro |

**Problema:** Cada variante solo soporta un subconjunto de idiomas. No se pueden mezclar idiomas que usen diferentes variantes en el mismo texto.

### UTF-8 (Unicode Transformation Format - 8 bits)
- Codificacion de **longitud variable**: 1 a 4 bytes por caracter
- Los primeros 128 caracteres son identicos a ASCII (compatibilidad hacia atras)
- Soporta **todos** los caracteres de todos los idiomas del mundo (mas de 1 millon de caracteres)
- Es el **estandar actual** en Linux y la web
- Un caracter ASCII ocupa 1 byte; caracteres acentuados 2 bytes; emojis 4 bytes

**Para el examen:** UTF-8 es la codificacion recomendada y mas usada. Es compatible con ASCII.

---

## 5. iconv - Conversion entre codificaciones

`iconv` convierte texto de una codificacion a otra.

```bash
# Sintaxis basica
iconv -f ORIGEN -t DESTINO archivo_entrada > archivo_salida
iconv -f ORIGEN -t DESTINO archivo_entrada -o archivo_salida

# Convertir de ISO-8859-1 a UTF-8
iconv -f ISO-8859-1 -t UTF-8 archivo_latin1.txt > archivo_utf8.txt
iconv -f ISO-8859-1 -t UTF-8 archivo_latin1.txt -o archivo_utf8.txt

# Convertir de UTF-8 a ISO-8859-15
iconv -f UTF-8 -t ISO-8859-15 entrada.txt -o salida.txt

# Listar todas las codificaciones soportadas
iconv -l
iconv --list

# Convertir desde stdin
echo "texto con acento" | iconv -f UTF-8 -t ASCII//TRANSLIT
```

| Opcion | Descripcion |
|--------|-------------|
| `-f` | Codificacion de origen (from) |
| `-t` | Codificacion de destino (to) |
| `-o` | Archivo de salida |
| `-l` | Listar codificaciones disponibles |
| `//TRANSLIT` | Intentar transliteracion si el caracter no existe en destino |
| `//IGNORE` | Ignorar caracteres que no pueden convertirse |

---

## 6. Zona horaria (timezone)

### Archivos y directorios clave

| Ruta | Descripcion |
|------|-------------|
| `/usr/share/zoneinfo/` | Directorio con todos los archivos de zona horaria |
| `/etc/localtime` | Enlace simbolico (o copia) al archivo de zona horaria activa |
| `/etc/timezone` | Archivo de texto con el nombre de la zona horaria (Debian) |
| `TZ` | Variable de entorno para configurar zona horaria por usuario/sesion |

### /usr/share/zoneinfo/
Contiene archivos binarios con la informacion de cada zona horaria, organizados por region:
```
/usr/share/zoneinfo/
├── America/
│   ├── Mexico_City
│   ├── Argentina/Buenos_Aires
│   └── New_York
├── Europe/
│   ├── Madrid
│   ├── Berlin
│   └── London
├── Asia/
│   ├── Tokyo
│   └── Shanghai
├── UTC
└── ...
```

### /etc/localtime
Es un enlace simbolico (o copia) que apunta al archivo de zona horaria del sistema:
```bash
ls -la /etc/localtime
# lrwxrwxrwx 1 root root 36 ... /etc/localtime -> /usr/share/zoneinfo/Europe/Madrid

# Cambiar zona horaria manualmente
ln -sf /usr/share/zoneinfo/America/Mexico_City /etc/localtime
```

### /etc/timezone (Debian/Ubuntu)
Archivo de texto simple que contiene el nombre de la zona horaria:
```bash
cat /etc/timezone
# Europe/Madrid
```

### Variable TZ
Permite a un usuario o proceso usar una zona horaria diferente a la del sistema:
```bash
# Ver la hora en diferentes zonas
TZ="America/New_York" date
TZ="Asia/Tokyo" date
TZ="UTC" date

# Exportar para toda la sesion
export TZ="America/Mexico_City"
```

---

## 7. Herramientas de configuracion de zona horaria

### tzselect
Herramienta interactiva que guia al usuario para seleccionar una zona horaria. **NO cambia la configuracion del sistema**, solo muestra el nombre de la zona horaria seleccionada.

```bash
tzselect
# Presenta un menu interactivo por continente/region/ciudad
# Al final muestra la zona seleccionada (ej: Europe/Madrid)
# NO modifica /etc/localtime ni /etc/timezone
```

### timedatectl (systemd)
Herramienta de systemd para gestionar fecha, hora y zona horaria.

```bash
# Ver configuracion actual
timedatectl
# O equivalente:
timedatectl status
#                Local time: mar 2026-05-26 14:30:00 CEST
#            Universal time: mar 2026-05-26 12:30:00 UTC
#                  RTC time: mar 2026-05-26 12:30:00
#                 Time zone: Europe/Madrid (CEST, +0200)
#        System clock synchronized: yes
#              NTP service: active

# Cambiar zona horaria
timedatectl set-timezone Europe/Madrid
timedatectl set-timezone America/Mexico_City

# Listar zonas horarias disponibles
timedatectl list-timezones
timedatectl list-timezones | grep America

# Establecer fecha y hora manualmente
timedatectl set-time "2026-05-26 14:30:00"

# Activar/desactivar sincronizacion NTP
timedatectl set-ntp true
timedatectl set-ntp false
```

### dpkg-reconfigure tzdata (Debian/Ubuntu)
Herramienta interactiva de Debian para configurar la zona horaria:
```bash
dpkg-reconfigure tzdata
# Presenta un menu grafico para seleccionar continente y ciudad
# Modifica /etc/localtime y /etc/timezone
```

### date con locale
El comando `date` muestra la fecha y hora formateada segun el locale actual:
```bash
# Formato por defecto (segun locale)
date
# mar 26 may 2026 14:30:00 CEST

# Forzar formato con locale especifico
LC_TIME=en_US.UTF-8 date
# Tue May 26 14:30:00 CEST 2026

# Con zona horaria temporal
TZ="America/New_York" date
# Tue May 26 08:30:00 EDT 2026

# Formato personalizado
date +"%d/%m/%Y %H:%M:%S"
# 26/05/2026 14:30:00
```

---

## 8. Resumen del flujo de configuracion

### Configurar locale del sistema
```bash
# Opcion 1: Con localectl (systemd)
localectl set-locale LANG=es_ES.UTF-8

# Opcion 2: Editar archivo de configuracion
# Red Hat/Fedora/Arch: /etc/locale.conf
# Debian/Ubuntu: /etc/default/locale

# Opcion 3: Debian/Ubuntu interactivo
dpkg-reconfigure locales
```

### Configurar zona horaria del sistema
```bash
# Opcion 1: Con timedatectl (systemd)
timedatectl set-timezone Europe/Madrid

# Opcion 2: Manualmente
ln -sf /usr/share/zoneinfo/Europe/Madrid /etc/localtime
echo "Europe/Madrid" > /etc/timezone    # Debian

# Opcion 3: Debian/Ubuntu interactivo
dpkg-reconfigure tzdata
```

---

## Resumen para el examen

1. **Prioridad de locale:** `LC_ALL` > `LC_*` individuales > `LANG`
2. **`LC_ALL`** sobreescribe TODO. Usarlo solo temporalmente, no en configuracion permanente
3. **`LANG`** es el valor por defecto para cualquier `LC_*` no definida
4. **`locale`** muestra config actual; **`locale -a`** lista locales disponibles
5. **`localectl`** configura locale y teclado en sistemas systemd
6. **UTF-8** es la codificacion estandar; compatible con ASCII; soporta todos los idiomas
7. **`iconv -f ORIGEN -t DESTINO`** convierte entre codificaciones
8. **`/etc/localtime`** es un enlace simbolico a `/usr/share/zoneinfo/...`
9. **`tzselect`** ayuda a elegir zona horaria pero NO cambia la configuracion
10. **`timedatectl set-timezone`** cambia la zona horaria en sistemas systemd
11. **Locale `C`/`POSIX`** es el locale minimo (ASCII, ingles, orden por byte)
