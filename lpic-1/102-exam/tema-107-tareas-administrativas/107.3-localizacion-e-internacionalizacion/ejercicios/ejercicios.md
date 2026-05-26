# 107.3 - Ejercicios: Localizacion e internacionalizacion

## Ejercicio 1
Explica el orden de prioridad de las variables de locale. Si un sistema tiene configuradas las siguientes variables, que idioma se usara para los mensajes del sistema y que formato para las fechas?
```bash
LANG=es_ES.UTF-8
LC_MESSAGES=en_US.UTF-8
LC_TIME=de_DE.UTF-8
LC_ALL=
```

<details>
<summary>Respuesta</summary>

**Orden de prioridad:** `LC_ALL` > `LC_*` individuales > `LANG`

Con la configuracion dada:
- **`LC_ALL`** esta vacia (no definida), por lo que NO sobreescribe nada
- **`LC_MESSAGES=en_US.UTF-8`** esta definida explicitamente, asi que los mensajes del sistema estaran en **ingles**
- **`LC_TIME=de_DE.UTF-8`** esta definida explicitamente, asi que las fechas estaran en formato **aleman**
- Todas las demas categorias (LC_NUMERIC, LC_COLLATE, LC_MONETARY, etc.) NO estan definidas explicitamente, asi que heredan el valor de **`LANG=es_ES.UTF-8`** (espanol)

**Resultado:**
- Mensajes del sistema: Ingles (LC_MESSAGES)
- Formato de fecha: Aleman (LC_TIME)
- Formato de numeros: Espanol (heredado de LANG)
- Formato de moneda: Espanol (heredado de LANG)
- Orden de clasificacion: Espanol (heredado de LANG)

Si se definiera `LC_ALL=fr_FR.UTF-8`, TODO estaria en frances, ignorando LANG y todas las LC_* individuales.
</details>

---

## Ejercicio 2
Cual es la diferencia entre ASCII, ISO-8859-1 y UTF-8? Por que UTF-8 es el estandar actual? Que herramienta se usa para convertir entre codificaciones?

<details>
<summary>Respuesta</summary>

**ASCII:**
- 7 bits, 128 caracteres (0-127)
- Solo caracteres ingleses basicos (a-z, A-Z, 0-9, puntuacion)
- NO soporta caracteres acentuados, n, ni otros idiomas

**ISO-8859-1 (Latin-1):**
- 8 bits, 256 caracteres
- Los primeros 128 son ASCII
- Los otros 128 incluyen caracteres de Europa Occidental (a, e, n, u, etc.)
- Solo soporta un subconjunto de idiomas. No se pueden mezclar latin con cirilico o chino

**UTF-8:**
- Longitud variable: 1 a 4 bytes por caracter
- Compatible con ASCII (los primeros 128 caracteres son identicos)
- Soporta mas de 1 millon de caracteres de TODOS los idiomas
- Es el estandar actual porque resuelve el problema de las codificaciones incompatibles

**Por que UTF-8 es el estandar:**
- Compatible hacia atras con ASCII
- Soporta todos los idiomas simultaneamente
- No hay conflictos entre codificaciones regionales

**Herramienta de conversion: `iconv`**
```bash
iconv -f ISO-8859-1 -t UTF-8 archivo.txt -o archivo_utf8.txt
iconv -l    # Listar codificaciones disponibles
```
</details>

---

## Ejercicio 3
Un servidor tiene archivos de datos en codificacion ISO-8859-1 que necesitan ser convertidos a UTF-8. Escribe el comando para: a) convertir un archivo, b) convertir con transliteracion, c) listar las codificaciones disponibles.

<details>
<summary>Respuesta</summary>

```bash
# a) Convertir un archivo de ISO-8859-1 a UTF-8
iconv -f ISO-8859-1 -t UTF-8 datos_latin.txt -o datos_utf8.txt
# O con redireccion:
iconv -f ISO-8859-1 -t UTF-8 datos_latin.txt > datos_utf8.txt

# b) Convertir con transliteracion (intenta aproximar caracteres no disponibles)
iconv -f UTF-8 -t ASCII//TRANSLIT datos_utf8.txt -o datos_ascii.txt
# Ejemplo: "cafe" se convierte a "cafe" (la e acentuada se aproxima a e)
# Con //IGNORE en lugar de //TRANSLIT: simplemente omite los caracteres no convertibles

# c) Listar todas las codificaciones soportadas
iconv -l
# O equivalente:
iconv --list
```

**Opciones clave de iconv:**
- `-f` (from): codificacion de origen
- `-t` (to): codificacion de destino
- `-o`: archivo de salida
- `//TRANSLIT`: transliterar caracteres no disponibles en el destino
- `//IGNORE`: ignorar caracteres que no pueden convertirse
</details>

---

## Ejercicio 4
Describe tres formas de cambiar la zona horaria del sistema a `America/Mexico_City`. Que diferencia hay entre `tzselect` y `timedatectl set-timezone`?

<details>
<summary>Respuesta</summary>

**Tres formas de cambiar la zona horaria:**

**1. Con timedatectl (sistemas systemd):**
```bash
timedatectl set-timezone America/Mexico_City
```
Modifica `/etc/localtime` y es la forma recomendada en sistemas modernos.

**2. Manualmente (cualquier sistema):**
```bash
ln -sf /usr/share/zoneinfo/America/Mexico_City /etc/localtime
echo "America/Mexico_City" > /etc/timezone    # Solo en Debian/Ubuntu
```
Crea un enlace simbolico desde `/etc/localtime` al archivo de zona correspondiente.

**3. Con dpkg-reconfigure (Debian/Ubuntu):**
```bash
dpkg-reconfigure tzdata
```
Presenta un menu interactivo para seleccionar la zona. Modifica `/etc/localtime` y `/etc/timezone`.

**Diferencia entre `tzselect` y `timedatectl set-timezone`:**
- **`tzselect`:** Es una herramienta interactiva que **solo ayuda a elegir** una zona horaria. Muestra un menu con continentes y ciudades, y al final muestra el nombre de la zona seleccionada. **NO modifica la configuracion del sistema.** Solo informa.
- **`timedatectl set-timezone`:** **SI cambia** la configuracion del sistema. Modifica `/etc/localtime` y actualiza la zona horaria de forma efectiva e inmediata.
</details>

---

## Ejercicio 5
Que contienen los archivos `/etc/localtime`, `/etc/timezone` y el directorio `/usr/share/zoneinfo/`? Como se relacionan entre si? Que es la variable `TZ` y como se usa?

<details>
<summary>Respuesta</summary>

**`/usr/share/zoneinfo/`:**
Directorio que contiene **archivos binarios** con la informacion de todas las zonas horarias del mundo, organizados por region:
```
/usr/share/zoneinfo/Europe/Madrid
/usr/share/zoneinfo/America/Mexico_City
/usr/share/zoneinfo/Asia/Tokyo
/usr/share/zoneinfo/UTC
```

**`/etc/localtime`:**
Es un **enlace simbolico** (o copia) que apunta al archivo de zona horaria activa dentro de `/usr/share/zoneinfo/`:
```bash
ls -la /etc/localtime
# /etc/localtime -> /usr/share/zoneinfo/Europe/Madrid
```
Este archivo es leido por las aplicaciones del sistema para determinar la zona horaria.

**`/etc/timezone`:**
Es un archivo de **texto plano** que contiene el nombre de la zona horaria (solo en Debian/Ubuntu):
```bash
cat /etc/timezone
# Europe/Madrid
```

**Relacion:** `/etc/localtime` apunta a un archivo dentro de `/usr/share/zoneinfo/`, y `/etc/timezone` contiene el nombre legible de esa zona.

**Variable `TZ`:**
Permite a un usuario o proceso usar una zona horaria **diferente** a la del sistema, sin modificar la configuracion global:
```bash
# Ver hora en diferentes zonas (temporal)
TZ="America/New_York" date
TZ="Asia/Tokyo" date

# Establecer para toda la sesion
export TZ="America/Mexico_City"
```
`TZ` tiene prioridad sobre `/etc/localtime` para el proceso que la define.
</details>

---

## Ejercicio 6
Un administrador quiere que su servidor tenga las siguientes configuraciones: sistema en espanol de Espana con UTF-8, pero los logs y mensajes del sistema en ingles para facilitar la busqueda de errores. Que variables debe configurar y en que archivo?

<details>
<summary>Respuesta</summary>

**Configuracion necesaria:**
```bash
LANG=es_ES.UTF-8
LC_MESSAGES=en_US.UTF-8
```

**Explicacion:**
- `LANG=es_ES.UTF-8`: Establece espanol como idioma por defecto para todas las categorias (fecha, numeros, moneda, clasificacion, etc.)
- `LC_MESSAGES=en_US.UTF-8`: Sobreescribe solo los mensajes del sistema/aplicaciones a ingles. Esto facilita buscar errores en Google o documentacion (los mensajes de error en ingles son mas faciles de encontrar)
- NO se debe usar `LC_ALL` porque sobreescriria todo

**Donde configurarlo:**

En sistemas systemd (Red Hat, Fedora, Arch) - `/etc/locale.conf`:
```
LANG=es_ES.UTF-8
LC_MESSAGES=en_US.UTF-8
```

En Debian/Ubuntu - `/etc/default/locale`:
```
LANG="es_ES.UTF-8"
LC_MESSAGES="en_US.UTF-8"
```

O usando `localectl`:
```bash
localectl set-locale LANG=es_ES.UTF-8 LC_MESSAGES=en_US.UTF-8
```

**Resultado:**
- Formato de fecha: espanol (26/05/2026, lunes, mayo)
- Formato de numeros: espanol (1.234,56)
- Formato de moneda: espanol (EUR)
- Mensajes del sistema: ingles ("Permission denied" en vez de "Permiso denegado")
</details>

---

## Ejercicio 7
Que muestra el comando `timedatectl`? Escribe los comandos para: listar zonas horarias disponibles, cambiar la zona a UTC, activar la sincronizacion NTP y verificar el cambio.

<details>
<summary>Respuesta</summary>

**`timedatectl` muestra:**
- Hora local
- Hora UTC (Universal)
- Hora del reloj RTC (hardware)
- Zona horaria actual
- Si el reloj esta sincronizado con NTP
- Si el servicio NTP esta activo

**Comandos solicitados:**
```bash
# Listar zonas horarias disponibles
timedatectl list-timezones
# O filtrar:
timedatectl list-timezones | grep Europe
timedatectl list-timezones | grep America

# Cambiar zona horaria a UTC
timedatectl set-timezone UTC

# Activar sincronizacion NTP
timedatectl set-ntp true

# Verificar el cambio
timedatectl status
# O simplemente:
timedatectl
```

**Salida tipica de `timedatectl`:**
```
               Local time: mar 2026-05-26 12:30:00 UTC
           Universal time: mar 2026-05-26 12:30:00 UTC
                 RTC time: mar 2026-05-26 12:30:00
                Time zone: UTC (UTC, +0000)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

Nota: `timedatectl set-ntp true` activa el servicio de sincronizacion de tiempo (generalmente `systemd-timesyncd` o `chrony`).
</details>

---

## Ejercicio 8
Que es el locale `C` (o `POSIX`)? En que situaciones se utilizaria? Que efecto tiene ejecutar `LC_ALL=C sort archivo.txt` en comparacion con `sort archivo.txt` en un sistema con locale `es_ES.UTF-8`?

<details>
<summary>Respuesta</summary>

**Locale `C` (o `POSIX`):**
Es el locale minimo estandar definido por POSIX. Sus caracteristicas:
- Usa codificacion **ASCII** (solo 128 caracteres)
- Idioma: ingles basico
- Orden de clasificacion: basado en el **valor numerico del byte** (A-Z antes que a-z, segun codigo ASCII)
- Es predecible y consistente en cualquier sistema

**Situaciones de uso:**
- **Scripts** que necesitan comportamiento predecible independientemente del sistema
- **Procesamiento de datos** donde el locale podria interferir con el resultado
- **Comparaciones y ordenamiento** que deben ser consistentes
- **Depuracion** de problemas relacionados con locale

**Diferencia en el ordenamiento:**

Con `es_ES.UTF-8` (locale espanol):
```bash
sort archivo.txt
# El sort usa reglas de clasificacion espanolas:
# ignora mayusculas/minusculas
# trata acentos de forma especial
# Resultado: Ana, arbol, Banana, cafe
```

Con `LC_ALL=C sort archivo.txt`:
```bash
LC_ALL=C sort archivo.txt
# El sort usa el valor ASCII de cada caracter:
# Mayusculas (65-90) van antes que minusculas (97-122)
# Resultado: Ana, Banana, arbol, cafe
```

El locale `C` ordena por valor de byte (ASCII), mientras que `es_ES.UTF-8` ordena segun las reglas linguisticas del espanol. Para scripts y procesamiento de datos, `LC_ALL=C` es mas predecible y tambien mas rapido.
</details>
