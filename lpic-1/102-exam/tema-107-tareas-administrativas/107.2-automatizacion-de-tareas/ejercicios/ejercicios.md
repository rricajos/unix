# 107.2 - Ejercicios: Automatizacion de tareas

## Ejercicio 1
Escribe las entradas de crontab para las siguientes tareas:
1. Ejecutar `/opt/backup.sh` todos los dias a las 3:30 AM
2. Ejecutar `/opt/informe.sh` de lunes a viernes a las 8:00 AM
3. Ejecutar `/opt/limpieza.sh` el dia 1 y 15 de cada mes a medianoche
4. Ejecutar `/opt/monitor.sh` cada 10 minutos

<details>
<summary>Respuesta</summary>

```bash
# 1. Todos los dias a las 3:30 AM
30 3 * * * /opt/backup.sh

# 2. Lunes a viernes a las 8:00 AM
0 8 * * 1-5 /opt/informe.sh

# 3. Dia 1 y 15 de cada mes a medianoche
0 0 1,15 * * /opt/limpieza.sh

# 4. Cada 10 minutos
*/10 * * * * /opt/monitor.sh
```

**Explicacion de cada campo:**
1. `30 3 * * *`: minuto 30, hora 3, cualquier dia, cualquier mes, cualquier dia de semana
2. `0 8 * * 1-5`: minuto 0, hora 8, cualquier dia del mes, cualquier mes, lunes(1) a viernes(5)
3. `0 0 1,15 * *`: minuto 0, hora 0, dias 1 y 15, cualquier mes, cualquier dia de semana
4. `*/10 * * * *`: cada 10 minutos (0, 10, 20, 30, 40, 50), cualquier hora, dia, mes, dia de semana
</details>

---

## Ejercicio 2
Cual es la diferencia entre el crontab de un usuario (`crontab -e`) y el archivo `/etc/crontab`? Muestra el formato de una linea en cada caso.

<details>
<summary>Respuesta</summary>

**Crontab de usuario** (`crontab -e`):
- Tiene **5 campos de tiempo + comando** (6 elementos en total)
- Se ejecuta como el usuario que lo creo
- Se edita con `crontab -e`
- Se almacena en `/var/spool/cron/crontabs/usuario`

Formato:
```
min hora dia mes dia_sem comando
30  2    *   *   *       /home/sandra/backup.sh
```

**Crontab del sistema** (`/etc/crontab`):
- Tiene **5 campos de tiempo + campo USUARIO + comando** (7 elementos)
- Incluye un campo adicional que especifica QUE USUARIO ejecuta el comando
- Se edita directamente con un editor de texto (no con `crontab -e`)
- Puede definir variables de entorno (SHELL, PATH, MAILTO)

Formato:
```
min hora dia mes dia_sem usuario  comando
30  2    *   *   *       root     /usr/local/bin/backup.sh
```

**El campo usuario extra** es la diferencia fundamental. Los archivos en `/etc/cron.d/` tambien usan el formato del sistema (con campo usuario).
</details>

---

## Ejercicio 3
Explica la logica de control de acceso de `/etc/cron.allow` y `/etc/cron.deny`. Un servidor tiene solo el archivo `/etc/cron.deny` con el contenido `ana`. Quien puede usar cron? Que pasaria si se crea `/etc/cron.allow` con el contenido `sandra`?

<details>
<summary>Respuesta</summary>

**Logica de control de acceso:**
1. Si `/etc/cron.allow` existe: SOLO los usuarios listados en el pueden usar cron (cron.deny se ignora)
2. Si solo `/etc/cron.deny` existe: TODOS los usuarios pueden usar cron EXCEPTO los listados en deny
3. Si ninguno existe: depende de la distribucion (normalmente solo root)

**Escenario actual** (solo `/etc/cron.deny` con `ana`):
- **Todos los usuarios** del sistema pueden usar cron **excepto** `ana`
- sandra, carlos, root y cualquier otro usuario pueden ejecutar `crontab -e`
- ana recibira un error "You (ana) are not allowed to use this program"

**Si se crea `/etc/cron.allow` con `sandra`:**
- **Solo sandra** podra usar cron
- `/etc/cron.deny` es completamente ignorado
- ana, carlos y todos los demas (incluido root en algunos sistemas) NO podran usar cron
- Solo sandra podra ejecutar `crontab -e` exitosamente

**CLAVE:** `cron.allow` siempre tiene prioridad absoluta sobre `cron.deny`.
</details>

---

## Ejercicio 4
Que es anacron y por que es necesario? Explica el formato de `/etc/anacrontab` con un ejemplo. En que se diferencia de cron?

<details>
<summary>Respuesta</summary>

**Que es anacron:**
Anacron es un complemento de cron disenado para sistemas que NO estan encendidos 24/7 (laptops, estaciones de trabajo). Si una tarea programada no se ejecuto porque el sistema estaba apagado, anacron la ejecutara la proxima vez que el sistema se encienda.

**Diferencias con cron:**

| Aspecto | cron | anacron |
|---------|------|---------|
| Precision | Minutos | Dias (minimo) |
| Sistema apagado | Tarea perdida | Tarea recuperada al encender |
| Ejecucion | Daemon permanente | Invocado periodicamente |
| Usuarios | Cualquier usuario | Solo root |

**Formato de `/etc/anacrontab`:**
```
# periodo  retardo  identificador  comando
1          5        cron.daily     nice run-parts /etc/cron.daily
7          25       cron.weekly    nice run-parts /etc/cron.weekly
@monthly   45       cron.monthly   nice run-parts /etc/cron.monthly
```

- **periodo (1):** Ejecutar cada 1 dia
- **retardo (5):** Esperar 5 minutos antes de ejecutar (para no sobrecargar al arrancar)
- **identificador (cron.daily):** Nombre unico para registrar la ultima ejecucion en `/var/spool/anacron/`
- **comando:** Lo que se ejecuta

Anacron registra el timestamp de la ultima ejecucion. Al iniciarse, compara la fecha actual con el ultimo registro. Si han pasado mas dias que el periodo, ejecuta la tarea (tras el retardo especificado).
</details>

---

## Ejercicio 5
Programa las siguientes tareas usando el comando `at`:
1. Ejecutar un backup dentro de 2 horas
2. Apagar el sistema manana a las 23:00
3. Listar todas las tareas pendientes de at
4. Eliminar la tarea con ID 3

<details>
<summary>Respuesta</summary>

```bash
# 1. Ejecutar backup dentro de 2 horas
at now + 2 hours
at> /usr/local/bin/backup.sh
at> <Ctrl+D>
# Alternativa con -f:
at now + 2 hours -f /usr/local/bin/backup.sh

# 2. Apagar el sistema manana a las 23:00
at 23:00 tomorrow
at> /sbin/shutdown -h now
at> <Ctrl+D>

# 3. Listar todas las tareas pendientes
atq
# O equivalente:
at -l

# 4. Eliminar la tarea con ID 3
atrm 3
# O equivalente:
at -d 3
```

**Notas importantes:**
- `at` se usa para tareas **unicas** (se ejecutan una vez y se eliminan)
- Se introduce el comando interactivamente y se finaliza con Ctrl+D
- `atq` muestra el ID, fecha/hora programada y usuario
- `batch` es similar a `at` pero ejecuta cuando la carga del sistema es baja (< 0.8)
- El control de acceso usa `/etc/at.allow` y `/etc/at.deny` con la misma logica que cron
</details>

---

## Ejercicio 6
Explica que son los timers de systemd y como se diferencian de cron. Que archivos se necesitan para crear un timer que ejecute un script de backup diariamente a las 2:30 AM?

<details>
<summary>Respuesta</summary>

**Los timers de systemd** son una alternativa a cron integrada en systemd. Usan dos archivos: un `.timer` (cuando ejecutar) y un `.service` (que ejecutar).

**Diferencias con cron:**
| Aspecto | cron | systemd timers |
|---------|------|----------------|
| Logs | Email | journal (journalctl) |
| Dependencias | No | Si (After=, Requires=) |
| Recuperacion | Necesita anacron | `Persistent=true` |
| Gestion | crontab | systemctl |
| Precision | 1 minuto | Microsegundos |

**Archivos necesarios:**

**1. `/etc/systemd/system/backup.timer`:**
```ini
[Unit]
Description=Timer de backup diario

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

**2. `/etc/systemd/system/backup.service`:**
```ini
[Unit]
Description=Servicio de backup

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

**Activar el timer:**
```bash
systemctl daemon-reload          # Recargar configuracion
systemctl enable backup.timer    # Habilitar al arranque
systemctl start backup.timer     # Iniciar ahora

# Verificar
systemctl list-timers
systemctl status backup.timer
```

`OnCalendar=*-*-* 02:30:00` significa "cualquier ano, cualquier mes, cualquier dia, a las 02:30:00". `Persistent=true` asegura que si se perdio una ejecucion (sistema apagado), se ejecute al encender.
</details>

---

## Ejercicio 7
Que diferencia hay entre los directorios `/etc/cron.daily/` y `/etc/cron.d/`? Que tipo de archivos contiene cada uno?

<details>
<summary>Respuesta</summary>

**`/etc/cron.daily/`** (y hourly, weekly, monthly):
- Contiene **scripts ejecutables** (no archivos crontab)
- Los scripts se ejecutan con `run-parts` a la frecuencia indicada por el nombre del directorio
- Los scripts deben tener **permiso de ejecucion** (`chmod +x`)
- NO tienen formato crontab; son scripts normales con shebang
- Ejemplo de contenido: scripts de logrotate, actualizaciones, limpieza

```bash
# Ejemplo de script en /etc/cron.daily/
ls /etc/cron.daily/
  logrotate
  apt-compat
  dpkg
```

**`/etc/cron.d/`**:
- Contiene **archivos en formato crontab** (igual que /etc/crontab)
- Incluyen el **campo de usuario** (como el crontab del sistema)
- No necesitan permiso de ejecucion
- Son instalados tipicamente por paquetes de software
- Permiten programacion con precision de minutos

```bash
# Ejemplo de archivo en /etc/cron.d/
cat /etc/cron.d/php
SHELL=/bin/sh
09,39 * * * * root [ -x /usr/lib/php/sessionclean ] && /usr/lib/php/sessionclean
```

**Resumen:**
- `/etc/cron.d/` = Archivos crontab (con campo usuario y programacion temporal)
- `/etc/cron.daily/` = Scripts ejecutables (sin programacion, se ejecutan una vez al dia)
</details>

---

## Ejercicio 8
Un administrador quiere que la usuaria `ana` no pueda usar `at` pero que si pueda usar `cron`. Actualmente no existen los archivos allow/deny. Que archivos debe crear y con que contenido?

<details>
<summary>Respuesta</summary>

**Para bloquear a `ana` en `at`:**
Crear `/etc/at.deny` con el nombre `ana`:
```bash
echo "ana" > /etc/at.deny
```
Esto permite que todos los usuarios usen `at` excepto `ana`.

**Para permitir a `ana` en `cron`:**
No es necesario crear ningun archivo. Si no existen `/etc/cron.allow` ni `/etc/cron.deny`, el comportamiento depende de la distribucion:
- En Debian/Ubuntu: normalmente todos los usuarios pueden usar cron por defecto
- Si se quiere ser explicito, crear un `/etc/cron.deny` vacio:
```bash
touch /etc/cron.deny
```
Un `cron.deny` vacio significa que todos pueden usar cron y nadie esta bloqueado.

**IMPORTANTE:** NO crear `/etc/cron.allow` porque entonces SOLO los listados podrian usar cron, bloqueando a todos los demas.

**Alternativa mas restrictiva para at:**
Si se quisiera que solo ciertos usuarios usen `at`, se crearia `/etc/at.allow`:
```bash
echo "sandra" > /etc/at.allow
echo "carlos" >> /etc/at.allow
```
Esto solo permitiria a `sandra` y `carlos` usar `at` (ignorando at.deny).

**Resumen de archivos creados:**
- `/etc/at.deny` con contenido: `ana`
- `/etc/cron.deny` vacio (o no crear nada si la distribucion permite cron por defecto)
</details>
