# 107.2 - Teoria: Automatizar tareas de administracion

## 1. Cron - Tareas programadas recurrentes

### Que es cron
**Cron** es el daemon que ejecuta tareas programadas de forma recurrente (periodica). El daemon `crond` (o `cron`) se ejecuta en segundo plano y revisa cada minuto si hay tareas que deban ejecutarse.

### Formato del crontab
Cada linea de un crontab define una tarea programada con el siguiente formato:

```
* * * * * comando
| | | | |
| | | | +--- Dia de la semana (0-7, donde 0 y 7 = domingo)
| | | +----- Mes (1-12)
| | +------- Dia del mes (1-31)
| +--------- Hora (0-23)
+----------- Minuto (0-59)
```

### Valores especiales en los campos

| Simbolo | Significado | Ejemplo |
|---------|-------------|---------|
| `*` | Cualquier valor | `* * * * *` = cada minuto |
| `,` | Lista de valores | `1,15,30 * * * *` = minutos 1, 15 y 30 |
| `-` | Rango de valores | `1-5 * * * *` = minutos 1 a 5 |
| `/` | Incremento (cada N) | `*/15 * * * *` = cada 15 minutos |

### Ejemplos de programacion

```bash
# Cada minuto
* * * * * /ruta/script.sh

# Todos los dias a las 2:30 AM
30 2 * * * /ruta/backup.sh

# Lunes a viernes a las 8:00 AM
0 8 * * 1-5 /ruta/informe.sh

# El dia 1 de cada mes a medianoche
0 0 1 * * /ruta/mensual.sh

# Cada 15 minutos
*/15 * * * * /ruta/monitoreo.sh

# Domingos a las 3:00 AM
0 3 * * 0 /ruta/mantenimiento.sh

# Cada hora en punto
0 * * * * /ruta/cada_hora.sh

# Lunes y miercoles a las 14:30
30 14 * * 1,3 /ruta/tarea.sh
```

### Cadenas especiales (atajos)

| Cadena | Equivalente | Significado |
|--------|-------------|-------------|
| `@reboot` | - | Al iniciar el sistema |
| `@yearly` / `@annually` | `0 0 1 1 *` | Una vez al ano (1 enero) |
| `@monthly` | `0 0 1 * *` | Una vez al mes (dia 1) |
| `@weekly` | `0 0 * * 0` | Una vez a la semana (domingo) |
| `@daily` / `@midnight` | `0 0 * * *` | Una vez al dia (medianoche) |
| `@hourly` | `0 * * * *` | Una vez por hora |

---

## 2. Crontab de usuario vs crontab del sistema

### Crontab de usuario
Cada usuario puede tener su propio crontab. Los archivos se almacenan en `/var/spool/cron/crontabs/` (Debian) o `/var/spool/cron/` (Red Hat).

```bash
# Editar el crontab del usuario actual
crontab -e

# Listar el crontab del usuario actual
crontab -l

# Eliminar el crontab del usuario actual
crontab -r

# Editar el crontab de otro usuario (solo root)
crontab -e -u sandra

# Listar el crontab de otro usuario (solo root)
crontab -l -u sandra
```

**Formato del crontab de usuario** (5 campos + comando):
```
min hora dia mes dia_sem comando
30  2    *   *   *       /home/sandra/backup.sh
```

### Crontab del sistema: /etc/crontab
El crontab del sistema tiene un **campo extra**: el nombre del usuario que ejecutara el comando.

**Formato de /etc/crontab** (6 campos + comando):
```
min hora dia mes dia_sem USUARIO comando
30  2    *   *   *       root    /usr/local/bin/backup.sh
```

```bash
# Ejemplo de /etc/crontab
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# min hora dia mes dia_sem usuario comando
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
```

**IMPORTANTE para el examen:** La diferencia clave entre el crontab de usuario y el del sistema es el **campo de usuario** extra en el del sistema.

### Directorio /etc/cron.d/
Contiene archivos crontab adicionales del sistema. Cada archivo tiene el **mismo formato que `/etc/crontab`** (con campo de usuario). Es util para paquetes de software que necesitan programar tareas.

### Directorios cron.{hourly,daily,weekly,monthly}
Son directorios que contienen **scripts ejecutables** (no crontabs). Se ejecutan automaticamente con la periodicidad indicada:

| Directorio | Frecuencia |
|-----------|------------|
| `/etc/cron.hourly/` | Cada hora |
| `/etc/cron.daily/` | Una vez al dia |
| `/etc/cron.weekly/` | Una vez a la semana |
| `/etc/cron.monthly/` | Una vez al mes |

- Los scripts deben tener permiso de ejecucion
- Se ejecutan mediante `run-parts` (ejecuta todos los scripts de un directorio)
- NO tienen formato crontab; son scripts normales

---

## 3. Control de acceso a cron

### Logica de /etc/cron.allow y /etc/cron.deny

El acceso de usuarios a cron se controla con dos archivos:

| Situacion | Quien puede usar cron |
|-----------|----------------------|
| `/etc/cron.allow` existe | **SOLO** los usuarios listados en cron.allow |
| `/etc/cron.allow` NO existe, `/etc/cron.deny` existe | Todos los usuarios **EXCEPTO** los listados en cron.deny |
| Ninguno de los dos existe | Depende de la distribucion (generalmente solo root) |
| Ambos existen | cron.allow tiene prioridad |

**IMPORTANTE para el examen:** Si `cron.allow` existe, `cron.deny` se ignora. `cron.allow` siempre tiene prioridad.

```bash
# Solo sandra y carlos pueden usar cron
echo "sandra" > /etc/cron.allow
echo "carlos" >> /etc/cron.allow

# Todos pueden usar cron excepto ana
echo "ana" > /etc/cron.deny

# Todos pueden usar cron (deny vacio)
> /etc/cron.deny    # Crear archivo vacio
```

---

## 4. Anacron - Para sistemas que no estan siempre encendidos

### Que es anacron
**Anacron** es un complemento de cron para sistemas que NO estan encendidos las 24 horas (laptops, estaciones de trabajo). Si una tarea programada no se ejecuto porque el sistema estaba apagado, anacron la ejecuta cuando el sistema se encienda.

### Diferencias con cron

| Aspecto | cron | anacron |
|---------|------|---------|
| Precision minima | Minutos | Dias |
| Requiere sistema encendido | Si | No (ejecuta tareas perdidas) |
| Se ejecuta como | Daemon permanente | Invocado por cron o al inicio |
| Quien lo usa | Cualquier usuario | Solo root |

### /etc/anacrontab
```bash
# Formato: periodo retardo identificador comando
# periodo: dias entre ejecuciones
# retardo: minutos de espera antes de ejecutar
# identificador: nombre unico para registro
# comando: comando a ejecutar

SHELL=/bin/sh
PATH=/sbin:/bin:/usr/sbin:/usr/bin
RANDOM_DELAY=45
START_HOURS_RANGE=3-22

1   5   cron.daily      nice run-parts /etc/cron.daily
7   25  cron.weekly     nice run-parts /etc/cron.weekly
@monthly 45 cron.monthly nice run-parts /etc/cron.monthly
```

| Campo | Descripcion |
|-------|-------------|
| periodo | Frecuencia en dias (1 = diario, 7 = semanal, @monthly) |
| retardo | Minutos de espera adicional antes de ejecutar |
| identificador | Nombre unico (usado para el timestamp en /var/spool/anacron/) |
| comando | Comando a ejecutar |

**Variables especiales:**
- `RANDOM_DELAY`: Retardo aleatorio adicional (en minutos)
- `START_HOURS_RANGE`: Rango de horas en que anacron puede ejecutar tareas

Anacron registra la ultima ejecucion en `/var/spool/anacron/`. Al iniciar, compara la fecha actual con la ultima ejecucion para decidir si debe ejecutar la tarea.

---

## 5. at - Tareas unicas programadas

### Que es at
`at` ejecuta un comando **una sola vez** en un momento especifico del futuro (a diferencia de cron que es recurrente).

### Uso de at
```bash
# Programar una tarea para las 3:00 PM
at 15:00
> /usr/local/bin/backup.sh
> <Ctrl+D>

# Programar para manana a las 2:30 AM
at 02:30 tomorrow

# Programar para una fecha especifica
at 14:00 2026-12-25

# Programar para dentro de 2 horas
at now + 2 hours

# Programar para dentro de 30 minutos
at now + 30 minutes

# Programar para dentro de 3 dias
at now + 3 days

# Leer comandos desde un archivo
at 15:00 -f /ruta/comandos.txt
```

### Comandos relacionados

| Comando | Descripcion |
|---------|-------------|
| `at hora` | Programar una tarea |
| `atq` | Listar tareas pendientes (= `at -l`) |
| `atrm ID` | Eliminar una tarea por su ID (= `at -d ID`) |
| `batch` | Ejecutar cuando la carga del sistema sea baja (< 0.8 por defecto) |

```bash
# Ver tareas programadas
atq
# 1    Tue May 26 15:00:00 2026 a sandra

# Eliminar tarea numero 1
atrm 1
```

### Control de acceso a at
La logica es **identica** a la de cron:

| Situacion | Quien puede usar at |
|-----------|---------------------|
| `/etc/at.allow` existe | SOLO los usuarios listados |
| `/etc/at.allow` NO existe, `/etc/at.deny` existe | Todos EXCEPTO los listados en at.deny |
| Ninguno existe | Depende de la distribucion |

---

## 6. Systemd timers - Alternativa moderna a cron

### Que son los timers de systemd
Los timers de systemd son una alternativa a cron integrada en systemd. Un timer es una unidad (`.timer`) que activa otra unidad (`.service`) en momentos programados.

### Estructura
Se necesitan dos archivos:
1. **Archivo .timer** - Define cuando se ejecuta
2. **Archivo .service** - Define que se ejecuta

### Ejemplo de timer
**`/etc/systemd/system/backup.timer`:**
```ini
[Unit]
Description=Backup diario

[Timer]
OnCalendar=daily
# O con formato detallado:
# OnCalendar=*-*-* 02:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

**`/etc/systemd/system/backup.service`:**
```ini
[Unit]
Description=Ejecutar backup

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

### Opciones de programacion del timer

| Opcion | Descripcion | Ejemplo |
|--------|-------------|---------|
| `OnCalendar` | Tiempo basado en calendario | `daily`, `weekly`, `*-*-* 02:30:00` |
| `OnBootSec` | Tiempo despues del arranque | `15min` |
| `OnUnitActiveSec` | Tiempo despues de la ultima activacion | `1h` |
| `OnActiveSec` | Tiempo despues de la activacion del timer | `30s` |
| `Persistent` | Ejecutar si se perdio la ejecucion (como anacron) | `true` |

### Formato OnCalendar
```
DiaSem Ano-Mes-Dia Hora:Min:Seg

# Ejemplos:
daily                    # Todos los dias a medianoche
weekly                   # Cada lunes a medianoche
monthly                  # Dia 1 de cada mes a medianoche
*-*-* 02:30:00          # Todos los dias a las 2:30
Mon *-*-* 08:00:00      # Lunes a las 8:00
*-*-01 00:00:00         # Dia 1 de cada mes a medianoche
```

### Gestion de timers
```bash
# Listar todos los timers activos
systemctl list-timers
systemctl list-timers --all

# Habilitar y arrancar un timer
systemctl enable backup.timer
systemctl start backup.timer

# Ver estado de un timer
systemctl status backup.timer

# Verificar la proxima ejecucion
systemd-analyze calendar daily
systemd-analyze calendar "*-*-* 02:30:00"
```

### Ventajas de timers sobre cron

| Aspecto | cron | systemd timers |
|---------|------|----------------|
| Logs | Salida por email | Integrado en journal (`journalctl`) |
| Dependencias | No soporta | Soporta dependencias de unidades |
| Recuperacion | No (necesita anacron) | `Persistent=true` |
| Control | crontab | `systemctl` (start/stop/enable/disable) |
| Precision | 1 minuto | Hasta microsegundos |

---

## Resumen para el examen

1. **Formato crontab de usuario:** `min hora dia mes dia_sem comando` (5 campos + comando)
2. **Formato /etc/crontab:** Igual pero con campo **usuario** extra (6 campos + comando)
3. **cron.allow tiene prioridad** sobre cron.deny. Si allow existe, deny se ignora
4. Si solo allow existe: solo los listados; si solo deny existe: todos menos los listados
5. **Anacron:** Para sistemas no siempre encendidos. Precision minima: dias. Solo root
6. **/etc/anacrontab:** `periodo retardo identificador comando`
7. **at:** Tareas unicas. `atq` lista, `atrm` elimina, `batch` ejecuta con carga baja
8. **at.allow/at.deny:** Misma logica que cron.allow/cron.deny
9. **systemd timers:** Usan archivos `.timer` + `.service`. OnCalendar para programacion
10. `systemctl list-timers` para ver timers activos
