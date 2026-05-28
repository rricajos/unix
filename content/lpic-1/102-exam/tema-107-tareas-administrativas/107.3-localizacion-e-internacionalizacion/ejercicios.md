---
title: "107.3 - Ejercicios: Localizacion e internacionalizacion"
tags:
  - lpic-1
  - examen-102
  - tema-107
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "107"
subtema: "107.3"
---

# 107.3 - Ejercicios: Localizacion e internacionalizacion

### Pregunta 1

Un sistema tiene las siguientes variables configuradas. Que idioma se usara para los mensajes del sistema?
```bash
LANG=es_ES.UTF-8
LC_MESSAGES=en_US.UTF-8
LC_ALL=
```

a) Espanol, porque `LANG` tiene prioridad sobre `LC_MESSAGES`
b) Ingles, porque `LC_MESSAGES` sobreescribe a `LANG` para los mensajes
c) Frances, porque `LC_ALL` esta vacia y se usa el valor por defecto del sistema
d) No se mostraran mensajes porque `LC_ALL` no esta definida

<details><summary>Respuesta</summary>

**b) Ingles, porque `LC_MESSAGES` sobreescribe a `LANG` para los mensajes**

El orden de prioridad de las variables de locale es: `LC_ALL` > `LC_*` individuales > `LANG`. Como `LC_ALL` esta vacia, no sobreescribe nada. `LC_MESSAGES=en_US.UTF-8` esta definida explicitamente, asi que los mensajes del sistema estaran en ingles. Las demas categorias (LC_NUMERIC, LC_TIME, LC_COLLATE, etc.) que NO estan definidas explicitamente heredan el valor de `LANG=es_ES.UTF-8` (espanol). Esta configuracion es comun en servidores donde se quiere el sistema en espanol pero los mensajes de error en ingles para facilitar su busqueda.

</details>

---

### Pregunta 2

Cual es la principal ventaja de UTF-8 sobre ISO-8859-1 (Latin-1)?

a) UTF-8 ocupa siempre menos espacio que ISO-8859-1
b) UTF-8 soporta todos los idiomas del mundo simultaneamente y es compatible con ASCII
c) UTF-8 es mas rapido de procesar que ISO-8859-1
d) UTF-8 solo necesita 1 byte por caracter, igual que ASCII

<details><summary>Respuesta</summary>

**b) UTF-8 soporta todos los idiomas del mundo simultaneamente y es compatible con ASCII**

UTF-8 es una codificacion de longitud variable (1 a 4 bytes por caracter) que soporta mas de un millon de caracteres de todos los idiomas. Los primeros 128 caracteres son identicos a ASCII (compatibilidad hacia atras). ISO-8859-1 solo soporta 256 caracteres (8 bits), cubriendo unicamente idiomas de Europa Occidental. Con ISO-8859-1 no se pueden mezclar idiomas como espanol y ruso en el mismo texto. UTF-8 no siempre ocupa menos espacio: un caracter acentuado ocupa 2 bytes en UTF-8 pero solo 1 en ISO-8859-1.

</details>

---

### Pregunta 3

Que comando convierte un archivo de codificacion ISO-8859-1 a UTF-8?

a) `convert -f ISO-8859-1 -t UTF-8 archivo.txt`
b) `iconv -f ISO-8859-1 -t UTF-8 archivo.txt -o archivo_utf8.txt`
c) `recode ISO-8859-1..UTF-8 archivo.txt`
d) `charset -from ISO-8859-1 -to UTF-8 archivo.txt`

<details><summary>Respuesta</summary>

**b) `iconv -f ISO-8859-1 -t UTF-8 archivo.txt -o archivo_utf8.txt`**

`iconv` es la herramienta estandar para convertir entre codificaciones. Las opciones son: `-f` (from, codificacion de origen), `-t` (to, codificacion de destino), `-o` (archivo de salida). Tambien se puede usar redireccion: `iconv -f ISO-8859-1 -t UTF-8 archivo.txt > archivo_utf8.txt`. Para listar todas las codificaciones soportadas se usa `iconv -l`. Opciones adicionales: `//TRANSLIT` intenta transliterar caracteres no disponibles y `//IGNORE` los omite.

</details>

---

### Pregunta 4

Cual es la diferencia entre `tzselect` y `timedatectl set-timezone`?

a) `tzselect` cambia la zona horaria permanentemente y `timedatectl` solo la muestra
b) `tzselect` solo ayuda a elegir una zona horaria (no cambia la configuracion); `timedatectl set-timezone` si cambia la zona horaria del sistema
c) Ambos cambian la zona horaria del sistema, pero `tzselect` es para Debian y `timedatectl` para Red Hat
d) `tzselect` configura la zona para un usuario y `timedatectl` para todo el sistema

<details><summary>Respuesta</summary>

**b) `tzselect` solo ayuda a elegir una zona horaria (no cambia la configuracion); `timedatectl set-timezone` si cambia la zona horaria del sistema**

`tzselect` es una herramienta interactiva que presenta un menu con continentes y ciudades para ayudar al usuario a elegir una zona horaria, pero **NO modifica la configuracion del sistema**. Solo muestra el nombre de la zona seleccionada (por ejemplo, `Europe/Madrid`). `timedatectl set-timezone Europe/Madrid` **si cambia** la configuracion del sistema, modificando `/etc/localtime` y actualizando la zona horaria de forma efectiva e inmediata.

</details>

---

### Pregunta 5

Que archivo es un enlace simbolico que apunta a la zona horaria activa del sistema?

a) `/etc/timezone`
b) `/etc/localtime`
c) `/usr/share/zoneinfo/UTC`
d) `/etc/default/timezone`

<details><summary>Respuesta</summary>

**b) `/etc/localtime`**

`/etc/localtime` es un enlace simbolico (o copia) que apunta al archivo de zona horaria activa dentro de `/usr/share/zoneinfo/`. Por ejemplo: `/etc/localtime -> /usr/share/zoneinfo/Europe/Madrid`. Es leido por las aplicaciones del sistema para determinar la zona horaria. `/etc/timezone` es un archivo de texto plano (solo en Debian/Ubuntu) que contiene el nombre de la zona horaria (por ejemplo, `Europe/Madrid`). `/usr/share/zoneinfo/` es el directorio con todos los archivos binarios de zonas horarias.

</details>

---

### Pregunta 6

Que variable de entorno permite a un usuario usar una zona horaria diferente a la del sistema sin modificar la configuracion global?

a) `LANG`
b) `LC_TIME`
c) `TZ`
d) `TIMEZONE`

<details><summary>Respuesta</summary>

**c) `TZ`**

La variable `TZ` permite a un usuario o proceso usar una zona horaria diferente a la configurada en el sistema (que se define en `/etc/localtime`). Por ejemplo: `TZ="America/New_York" date` muestra la hora en Nueva York, y `export TZ="Asia/Tokyo"` establece la zona para toda la sesion. `TZ` tiene prioridad sobre `/etc/localtime` para el proceso que la define. `LC_TIME` controla el formato de presentacion de fechas (idioma) pero no la zona horaria en si.

</details>

---

### Pregunta 7

Que es el locale `C` (o `POSIX`) y que efecto tiene en el ordenamiento de texto?

a) Es el locale por defecto de China que usa caracteres chinos simplificados
b) Es el locale minimo estandar que usa ASCII y ordena por valor numerico del byte (mayusculas antes que minusculas)
c) Es un locale que desactiva toda salida de texto para optimizar el rendimiento
d) Es el locale para programacion en C que solo muestra numeros sin texto

<details><summary>Respuesta</summary>

**b) Es el locale minimo estandar que usa ASCII y ordena por valor numerico del byte (mayusculas antes que minusculas)**

El locale `C` (equivalente a `POSIX`) es el locale minimo estandar definido por POSIX. Usa codificacion ASCII (128 caracteres), idioma ingles basico, y un orden de clasificacion basado en el valor numerico del byte (A-Z [65-90] antes que a-z [97-122]). Es predecible y consistente en cualquier sistema. Se usa en scripts para comportamiento determinista: `LC_ALL=C sort archivo.txt` ordena por valor ASCII. En contraste, `es_ES.UTF-8` usa reglas linguisticas espanolas que pueden ignorar mayusculas y tratar acentos de forma especial.

</details>

---

### Pregunta 8

Que comando de systemd se usa para configurar el locale y el layout del teclado del sistema?

a) `timedatectl`
b) `systemctl set-locale`
c) `localectl`
d) `hostnamectl`

<details><summary>Respuesta</summary>

**c) `localectl`**

`localectl` es la herramienta de systemd para configurar el locale y el layout del teclado del sistema. `localectl status` muestra la configuracion actual. `localectl set-locale LANG=es_ES.UTF-8` establece el locale. `localectl set-keymap es` establece el layout del teclado de la consola virtual. `localectl set-x11-keymap es` establece el layout para X11. `localectl list-locales` lista los locales disponibles. El archivo de configuracion resultante es `/etc/locale.conf` en sistemas con systemd.

</details>

---

### Pregunta 9

Un administrador quiere un servidor con formato de fechas y numeros en espanol pero mensajes del sistema en ingles. Que configuracion debe usar?

a) `LC_ALL=es_ES.UTF-8` y `LANG=en_US.UTF-8`
b) `LANG=es_ES.UTF-8` y `LC_MESSAGES=en_US.UTF-8`
c) `LANG=en_US.UTF-8` y `LC_ALL=es_ES.UTF-8`
d) `LC_MESSAGES=es_ES.UTF-8` y `LC_TIME=en_US.UTF-8`

<details><summary>Respuesta</summary>

**b) `LANG=es_ES.UTF-8` y `LC_MESSAGES=en_US.UTF-8`**

`LANG=es_ES.UTF-8` establece espanol como valor por defecto para todas las categorias (fecha, numeros, moneda, clasificacion, etc.). `LC_MESSAGES=en_US.UTF-8` sobreescribe solo los mensajes del sistema a ingles, ya que las variables `LC_*` individuales tienen prioridad sobre `LANG`. NO se debe usar `LC_ALL` porque sobreescriria TODAS las categorias. Esta configuracion es comun en servidores porque los mensajes de error en ingles son mas faciles de buscar en documentacion. Se configura en `/etc/locale.conf` o `/etc/default/locale`.

</details>

---

### Pregunta 10

Que muestra el comando `timedatectl` y que subcomando activa la sincronizacion NTP?

a) Muestra la configuracion de locale; `timedatectl set-locale ntp=true`
b) Muestra la fecha, hora, zona horaria y estado de sincronizacion; `timedatectl set-ntp true`
c) Muestra los timers de systemd activos; `timedatectl enable ntp`
d) Muestra la configuracion del kernel; `timedatectl sync`

<details><summary>Respuesta</summary>

**b) Muestra la fecha, hora, zona horaria y estado de sincronizacion; `timedatectl set-ntp true`**

`timedatectl` (o `timedatectl status`) muestra: hora local, hora UTC, hora del reloj RTC (hardware), zona horaria actual, si el reloj esta sincronizado con NTP y si el servicio NTP esta activo. `timedatectl set-ntp true` activa la sincronizacion de tiempo con NTP (generalmente `systemd-timesyncd` o `chrony`). Otros subcomandos utiles: `timedatectl set-timezone Europe/Madrid` (cambiar zona horaria), `timedatectl list-timezones` (listar zonas disponibles), `timedatectl set-time "2026-05-28 14:00:00"` (establecer fecha/hora manualmente).

</details>
