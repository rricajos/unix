# 108.1 Mantener la hora del sistema - Teoria

## Conceptos fundamentales: Dos relojes en Linux

Un sistema Linux mantiene **dos relojes** independientes:

### Reloj hardware (RTC / CMOS)
- Tambien llamado **Real Time Clock (RTC)** o reloj CMOS
- Es un chip fisico en la placa base alimentado por una pila (bateria CR2032)
- Funciona incluso con el equipo apagado
- Menos preciso que el reloj del sistema (puede desviarse varios segundos al dia)
- Se accede con el comando `hwclock`
- Se almacena la configuracion en `/etc/adjtime`

### Reloj del sistema (system clock)
- Es un reloj mantenido por el kernel de Linux en memoria
- Se inicializa al arrancar tomando la hora del reloj hardware
- Es mas preciso durante la ejecucion del sistema
- Se puede sincronizar con servidores NTP para maxima precision
- Se accede con los comandos `date` y `timedatectl`

---

## Comando `date`

El comando `date` muestra y establece la fecha y hora del sistema.

### Mostrar la fecha y hora
```bash
date                        # Muestra fecha/hora actual
date -u                     # Muestra en UTC
date +%Y-%m-%d              # Formato: 2024-01-15
date +%H:%M:%S              # Formato: 14:30:45
date "+%Y-%m-%d %H:%M:%S"  # Formato completo
date +%s                    # Epoch (segundos desde 1970-01-01)
```

### Codigos de formato importantes
| Codigo | Significado           | Ejemplo    |
|--------|-----------------------|------------|
| `%Y`   | Anio (4 digitos)      | 2024       |
| `%m`   | Mes (01-12)           | 01         |
| `%d`   | Dia del mes (01-31)   | 15         |
| `%H`   | Hora (00-23)          | 14         |
| `%M`   | Minutos (00-59)       | 30         |
| `%S`   | Segundos (00-59)      | 45         |
| `%Z`   | Zona horaria          | CET        |
| `%s`   | Epoch Unix            | 1705312245 |
| `%A`   | Dia de la semana      | Monday     |
| `%B`   | Nombre del mes        | January    |
| `%j`   | Dia del anio (001-366)| 015        |

### Establecer la fecha y hora (requiere root)
```bash
date -s "2024-01-15 14:30:00"       # Establecer fecha y hora
date MMDDhhmm[[CC]YY][.ss]          # Formato legacy
date 011514302024.00                 # 15 enero 2024, 14:30:00
date -s "14:30:00"                   # Solo cambiar la hora
```

---

## Comando `hwclock`

El comando `hwclock` gestiona el reloj hardware (RTC).

### Opciones principales
```bash
hwclock -r                  # Leer el reloj hardware (--show)
hwclock --systohc           # Copiar hora del sistema al hardware
hwclock --hctosys           # Copiar hora del hardware al sistema
hwclock --localtime         # Indica que RTC esta en hora local
hwclock --utc               # Indica que RTC esta en UTC
hwclock --set --date "2024-01-15 14:30:00"  # Establecer RTC directamente
```

### Direccion de sincronizacion
- `--systohc` = **System TO Hardware Clock** (sistema -> hardware)
- `--hctosys` = **Hardware Clock TO System** (hardware -> sistema)

### Archivo `/etc/adjtime`
Este archivo contiene informacion sobre:
- La deriva (drift) del reloj hardware
- La ultima vez que se ajusto
- Si el RTC esta en UTC o LOCAL

Ejemplo de contenido:
```
0.000000 1705312245 0.000000
1705312245
UTC
```
La tercera linea indica si el RTC esta en `UTC` o `LOCAL`.

---

## Comando `timedatectl` (systemd)

Herramienta moderna de systemd para gestionar fecha, hora y zona horaria.

### Operaciones principales
```bash
timedatectl                          # Mostrar estado completo
timedatectl status                   # Igual que sin argumentos
timedatectl set-time "2024-01-15 14:30:00"  # Establecer fecha/hora
timedatectl set-time "14:30:00"      # Solo la hora
timedatectl set-timezone Europe/Madrid       # Establecer zona horaria
timedatectl list-timezones           # Listar todas las zonas
timedatectl set-ntp true             # Activar sincronizacion NTP
timedatectl set-ntp false            # Desactivar sincronizacion NTP
```

### Salida tipica de `timedatectl status`
```
               Local time: Mon 2024-01-15 14:30:00 CET
           Universal time: Mon 2024-01-15 13:30:00 UTC
                 RTC time: Mon 2024-01-15 13:30:00
                Time zone: Europe/Madrid (CET, +0100)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

> **Importante para el examen**: `timedatectl set-ntp true` habilita `systemd-timesyncd`, no ntpd.

---

## Zonas horarias

### Archivos clave
- `/usr/share/zoneinfo/` - Directorio con todas las zonas horarias
- `/etc/localtime` - Enlace simbolico o copia del archivo de zona actual
- `/etc/timezone` - Archivo de texto con el nombre de la zona (Debian/Ubuntu)
- Variable de entorno `TZ` - Permite cambiar la zona temporalmente

### Configurar la zona horaria
```bash
# Metodo 1: timedatectl (recomendado en systemd)
timedatectl set-timezone America/Mexico_City

# Metodo 2: enlace simbolico manual
ln -sf /usr/share/zoneinfo/America/Mexico_City /etc/localtime

# Metodo 3: dpkg-reconfigure (Debian)
dpkg-reconfigure tzdata

# Metodo 4: variable TZ temporal
export TZ="America/Mexico_City"
date    # Muestra la hora en esa zona
```

---

## NTP (Network Time Protocol)

### Conceptos fundamentales
- Protocolo para sincronizar relojes a traves de la red
- Usa el puerto **UDP 123**
- Precision tipica de milisegundos en redes LAN
- Usa un sistema de **estratos (stratum)**

### Terminologia NTP (IMPORTANTE para el examen)

| Termino | Descripcion |
|---------|-------------|
| **Offset** | Diferencia de tiempo entre el reloj local y el servidor NTP (en milisegundos) |
| **Drift** | Tendencia del reloj local a desviarse con el tiempo. Se registra en el `driftfile` para compensacion continua |
| **Jitter** | Variacion (inestabilidad) del offset entre consultas sucesivas. Menor jitter = mas estable |
| **Stratum** | Nivel jerarquico del servidor NTP (0-15). Menor estrato = mas cercano a la fuente de tiempo |
| **Step** | Ajuste abrupto (salto) del reloj. Se usa cuando la diferencia es grande |
| **Slew** | Ajuste gradual del reloj acelerando o frenando ligeramente. Preferido para diferencias pequenas |
| **Insane time** | Diferencia de tiempo demasiado grande (tipicamente > 1000 segundos). NTP puede negarse a corregirla |

**Step vs Slew:**
- **Step (salto):** Cambia el reloj de golpe. Rapido pero puede causar problemas en aplicaciones sensibles al tiempo (logs desordenados, transacciones duplicadas).
- **Slew (deslizamiento gradual):** Ajusta el reloj lentamente acelerandolo o frenandolo. Mas seguro para aplicaciones en produccion, pero tarda mas en sincronizar.

### Sistema de estratos NTP
| Estrato | Descripcion |
|---------|------------|
| 0       | Dispositivos de referencia (relojes atomicos, GPS) - no accesibles por red |
| 1       | Servidores conectados directamente a dispositivos de estrato 0 |
| 2       | Servidores sincronizados con estrato 1 |
| 3       | Servidores sincronizados con estrato 2 |
| ...     | Hasta estrato 15 (maximo) |
| 16      | No sincronizado (invalido) |

### pool.ntp.org
- Proyecto colaborativo con miles de servidores NTP
- Se recomienda usar los pools regionales:
  - `0.pool.ntp.org`, `1.pool.ntp.org`, `2.pool.ntp.org`, `3.pool.ntp.org`
  - `0.es.pool.ntp.org` (pool de Espana)
  - `0.mx.pool.ntp.org` (pool de Mexico)

---

## ntpd (demonio NTP clasico)

### Archivo de configuracion `/etc/ntp.conf`
```
# Servidores NTP
server 0.pool.ntp.org iburst
server 1.pool.ntp.org iburst
server 2.pool.ntp.org iburst
server 3.pool.ntp.org iburst

# Archivo de drift
driftfile /var/lib/ntp/ntp.drift

# Restricciones
restrict default nomodify notrap nopeer noquery
restrict 127.0.0.1
restrict ::1
```

- La opcion `iburst` envia rafagas iniciales para sincronizar mas rapido
- El archivo `driftfile` almacena la desviacion calculada del reloj local

### Comandos asociados
```bash
ntpq -p                     # Mostrar peers/estado de sincronizacion
```

### `ntpdate` (DEPRECADO)

`ntpdate` era una herramienta para sincronizacion puntual (one-shot) del reloj.

```bash
ntpdate pool.ntp.org        # Sincronizar una vez (ajuste tipo step)
ntpdate -q pool.ntp.org     # Solo consultar sin ajustar
```

**IMPORTANTE:** `ntpdate` esta **deprecado** y ha sido reemplazado por:
- `ntpd -gq` (sincronizar una vez y salir)
- `chronyd -q` (con chrony)
- `timedatectl set-ntp true` (con systemd-timesyncd)

**No debe usarse `ntpdate` mientras `ntpd` o `chronyd` estan en ejecucion**, ya que causa conflictos con el ajuste gradual (slew) que realizan estos demonios.

### Interpretar `ntpq -p`
```
     remote           refid      st t when poll reach   delay   offset  jitter
==============================================================================
*ntp1.example.com  .GPS.     1 u   34   64  377    1.234   -0.567   0.123
+ntp2.example.com  .PPS.     1 u   35   64  377    2.345   +0.234   0.456
```

| Simbolo | Significado |
|---------|------------|
| `*`     | Servidor seleccionado actualmente (fuente de sincronizacion) |
| `+`     | Candidato aceptable |
| `-`     | Descartado por el algoritmo |
| `x`     | Designado como falseticker |

| Campo   | Significado |
|---------|------------|
| `st`    | Estrato del servidor |
| `when`  | Segundos desde ultima consulta |
| `poll`  | Intervalo de consulta en segundos |
| `reach` | Registro de alcanzabilidad (octal) - 377 = ultimas 8 consultas exitosas |
| `delay` | Retardo de ida y vuelta (ms) |
| `offset`| Diferencia de tiempo (ms) |
| `jitter`| Variacion del offset (ms) |

---

## Chrony

### Caracteristicas
- Alternativa moderna a ntpd
- Sincroniza mas rapido, especialmente en conexiones intermitentes
- Ideal para maquinas virtuales y equipos que no estan siempre encendidos
- Compuesto por:
  - `chronyd` - Demonio que se ejecuta en segundo plano
  - `chronyc` - Herramienta de linea de comandos para interactuar con chronyd

### Archivo de configuracion `/etc/chrony.conf`
```
# Servidores NTP
server 0.pool.ntp.org iburst
server 1.pool.ntp.org iburst
server 2.pool.ntp.org iburst
server 3.pool.ntp.org iburst

# Archivo de drift
driftfile /var/lib/chrony/drift

# Permitir ajuste rapido si la diferencia es grande
makestep 1.0 3

# Habilitar RTC
rtcsync
```

- `makestep 1.0 3` - Permite un salto en el reloj si la diferencia es mayor a 1 segundo, solo en los primeros 3 ajustes

### Comandos `chronyc`
```bash
chronyc sources         # Mostrar fuentes NTP (equivalente a ntpq -p)
chronyc sources -v      # Con explicacion detallada de columnas
chronyc sourcestats      # Estadisticas de las fuentes
chronyc tracking        # Informacion detallada de sincronizacion
chronyc activity        # Numero de fuentes online/offline
```

### Interpretar `chronyc sources`
```
210 Number of sources = 4
MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^* ntp1.example.com              1   6   377    34   -567us[ -567us] +/-  1234us
^+ ntp2.example.com              1   6   377    35   +234us[ +234us] +/-  2345us
```

- `^*` = Fuente seleccionada actualmente
- `^+` = Fuente aceptable combinable
- `^-` = Fuente excluida por el algoritmo
- `^?` = Fuente a la que se ha perdido conectividad

---

## SNTP vs NTP

| Caracteristica | NTP (completo) | SNTP (Simple NTP) |
|---------------|----------------|---------------------|
| Complejidad | Completo, con algoritmos avanzados | Simplificado, subconjunto de NTP |
| Precision | Alta (microsegundos) | Menor (milisegundos) |
| Ajuste del reloj | Step y **slew** (gradual) | Solo **step** (saltos) |
| Actua como servidor | Si (ntpd, chronyd) | No (solo cliente) |
| Calculo de drift | Si (mantiene driftfile) | No |
| Multiples fuentes | Si (algoritmo de seleccion) | Tipicamente una fuente |
| Implementacion tipica | ntpd, chronyd | **systemd-timesyncd** |

**Para el examen:** `systemd-timesyncd` usa SNTP (no NTP completo). Es mas simple y menos preciso, pero suficiente para la mayoria de estaciones de trabajo. Para servidores que requieren alta precision o que deben actuar como servidores NTP para otros, se debe usar `ntpd` o `chronyd`.

---

## systemd-timesyncd

### Caracteristicas
- Cliente **SNTP** ligero integrado en systemd (no NTP completo)
- Solo puede actuar como **cliente** (no como servidor)
- Es la opcion mas simple para sincronizacion NTP basica
- Se activa con `timedatectl set-ntp true`

### Archivo de configuracion
- `/etc/systemd/timesyncd.conf`

```ini
[Time]
NTP=0.pool.ntp.org 1.pool.ntp.org
FallbackNTP=0.debian.pool.ntp.org
```

### Comandos
```bash
systemctl status systemd-timesyncd    # Ver estado del servicio
timedatectl timesync-status           # Estado detallado de sincronizacion
timedatectl show-timesync             # Propiedades del servicio
```

---

## Resumen comparativo de soluciones NTP

| Caracteristica | ntpd | chrony | systemd-timesyncd |
|---------------|------|--------|-------------------|
| Actua como servidor | Si | Si | No |
| Actua como cliente | Si | Si | Si |
| Sincronizacion rapida | No | Si | Si |
| Configuracion | `/etc/ntp.conf` | `/etc/chrony.conf` | `/etc/systemd/timesyncd.conf` |
| Herramienta CLI | `ntpq` | `chronyc` | `timedatectl` |
| Ideal para | Servidores permanentes | VMs, portatiles | Uso basico |

---

## Puntos clave para el examen

1. **Dos relojes**: hardware (RTC/CMOS) y sistema (kernel)
2. **hwclock --systohc** copia sistema -> hardware, **--hctosys** hardware -> sistema
3. **timedatectl** es la herramienta moderna de systemd para gestionar hora y zona
4. **NTP usa UDP puerto 123** y un sistema de estratos (0-15, 16=invalido)
5. **Terminologia NTP**: offset (diferencia), drift (desviacion), jitter (variacion), step (salto), slew (ajuste gradual)
6. **SNTP** (usado por systemd-timesyncd) es mas simple que NTP: solo cliente, solo step, sin calculo de drift
7. **`ntpdate`** esta deprecado; reemplazado por `ntpd -gq`, `chronyd -q` o `timedatectl set-ntp true`
8. **/etc/adjtime** indica si el RTC esta en UTC o LOCAL
9. **ntpq -p** muestra los peers; `*` indica el servidor seleccionado
10. **chronyc sources** es el equivalente de `ntpq -p` para chrony
11. **systemd-timesyncd** es solo cliente SNTP, ntpd y chrony pueden ser servidor NTP completo
12. **/etc/localtime** define la zona horaria del sistema (enlace a `/usr/share/zoneinfo/`)
13. **pool.ntp.org** es el pool publico de servidores NTP
