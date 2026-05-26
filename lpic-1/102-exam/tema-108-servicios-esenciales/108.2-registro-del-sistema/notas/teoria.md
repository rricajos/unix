# 108.2 Registro del sistema - Teoria

## Introduccion al registro del sistema

El registro (logging) del sistema es fundamental para la administracion, seguridad y resolucion de problemas. Linux dispone de dos sistemas principales de logging:

1. **syslog tradicional** (rsyslog, syslog-ng): Basado en archivos de texto
2. **systemd journal** (journald): Sistema binario moderno integrado en systemd

---

## Syslog: El sistema clasico de registro

### Conceptos: Facility y Priority

Cada mensaje de syslog tiene dos componentes:

#### Facilities (origen del mensaje)
| Facility | Descripcion |
|----------|-------------|
| `auth` / `authpriv` | Mensajes de autenticacion y seguridad |
| `cron` | Mensajes del servicio cron |
| `daemon` | Demonios del sistema |
| `kern` | Mensajes del kernel |
| `lpr` | Sistema de impresion |
| `mail` | Sistema de correo |
| `user` | Aplicaciones de usuario |
| `local0` - `local7` | Uso personalizado (8 facilities libres) |
| `syslog` | Mensajes internos del propio syslog |
| `ftp` | Servicio FTP |

#### Priorities (severidad del mensaje, de mayor a menor)
| Priority | Valor | Descripcion |
|----------|-------|-------------|
| `emerg` | 0 | Sistema inutilizable |
| `alert` | 1 | Accion inmediata necesaria |
| `crit` | 2 | Condicion critica |
| `err` | 3 | Error |
| `warning` | 4 | Advertencia |
| `notice` | 5 | Condicion normal pero significativa |
| `info` | 6 | Informativo |
| `debug` | 7 | Depuracion |

> **Regla mnemotecnica para el examen**: "**E**very **A**lley **C**at **E**ats **W**et **N**oodles **I**n **D**ecember" (Emerg, Alert, Crit, Err, Warning, Notice, Info, Debug)

### Formato de reglas syslog
```
facility.priority    destino
```

Ejemplos:
```
mail.info            /var/log/maillog       # mail con prioridad info o superior
kern.*               /var/log/kern.log      # todos los mensajes del kernel
*.emerg              :omusrmsg:*            # emergencias a todos los usuarios
auth,authpriv.*      /var/log/auth.log      # autenticacion
*.info;mail.none     /var/log/messages      # todo info excepto mail
local7.=debug        /var/log/debug.log     # solo debug de local7 (exacta)
```

#### Operadores de prioridad
- `facility.priority` - La prioridad indicada **y todas las superiores**
- `facility.=priority` - **Solo** esa prioridad exacta
- `facility.!priority` - Todas las prioridades **excepto** la indicada y superiores
- `facility.none` - Ninguna prioridad (excluir facility)

---

## rsyslog

### Caracteristicas
- Implementacion mas comun de syslog en distribuciones modernas
- Compatible con el formato clasico de syslog
- Soporta modulos para funcionalidad extendida
- Puede enviar/recibir logs por red (TCP/UDP)

### Archivo de configuracion `/etc/rsyslog.conf`
```bash
# Modulos
module(load="imuxsock")    # Soporte para logging local
module(load="imklog")      # Soporte para logs del kernel

# Reglas
auth,authpriv.*            /var/log/auth.log
*.*;auth,authpriv.none     -/var/log/syslog
kern.*                     -/var/log/kern.log
mail.*                     -/var/log/mail.log
cron.*                     /var/log/cron.log
*.emerg                    :omusrmsg:*

# Enviar a servidor remoto
*.* @192.168.1.100:514     # UDP
*.* @@192.168.1.100:514    # TCP
```

- El prefijo `-` antes del archivo significa escritura asincrona (mejor rendimiento)
- `@` = UDP, `@@` = TCP para envio remoto

### Registro remoto con rsyslog (IMPORTANTE para el examen)

rsyslog puede enviar y recibir logs por red, permitiendo centralizar el registro de multiples servidores.

**Envio de logs a un servidor remoto (en el cliente):**
```
# En /etc/rsyslog.conf del cliente:

# Enviar TODOS los logs via UDP (un solo @)
*.* @192.168.1.100:514

# Enviar TODOS los logs via TCP (doble @@)
*.* @@192.168.1.100:514

# Enviar solo logs de autenticacion via TCP
auth,authpriv.* @@logserver.ejemplo.com:514
```

**Recepcion de logs (en el servidor central):**
```
# En /etc/rsyslog.conf del servidor:

# Habilitar recepcion por UDP
module(load="imudp")
input(type="imudp" port="514")

# Habilitar recepcion por TCP
module(load="imtcp")
input(type="imtcp" port="514")

# Almacenar logs remotos en archivos separados por host
$template RemoteLogs,"/var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log"
*.* ?RemoteLogs
```

**Regla mnemotecnica:** `@` = UDP (un arroba, un protocolo simple), `@@` = TCP (dos arrobas, protocolo con mas garantias).

### Directorio de configuracion adicional
- `/etc/rsyslog.d/` - Archivos de configuracion adicionales (incluidos via `$IncludeConfig`)

---

## syslog-ng

### Caracteristicas
- Alternativa mas flexible a rsyslog
- Configuracion basada en objetos (source, destination, filter, log)

### Archivo de configuracion `/etc/syslog-ng/syslog-ng.conf`
```
source s_local {
    system();
    internal();
};

destination d_auth {
    file("/var/log/auth.log");
};

filter f_auth {
    facility(auth, authpriv);
};

log {
    source(s_local);
    filter(f_auth);
    destination(d_auth);
};
```

---

## systemd-journald

### Caracteristicas
- Sistema de registro binario integrado en systemd
- Almacena logs en formato binario en `/var/log/journal/` (persistente) o `/run/log/journal/` (volatil)
- Indexado automatico, busquedas rapidas
- Se accede con el comando `journalctl`

### Configuracion: `/etc/systemd/journald.conf`
```ini
[Journal]
Storage=persistent          # auto | persistent | volatile | none
Compress=yes
SystemMaxUse=500M           # Tamano maximo del journal
SystemMaxFileSize=50M       # Tamano maximo por archivo
MaxRetentionSec=1month      # Retencion maxima temporal
ForwardToSyslog=yes         # Reenviar mensajes a syslog (rsyslog)
ForwardToConsole=no         # Reenviar mensajes a la consola (/dev/console)
```

### Almacenamiento persistente del journal (IMPORTANTE)

Valores de `Storage`:
- **`auto`** (por defecto) - Persistente si existe `/var/log/journal/`, sino volatil en `/run/log/journal/`
- **`persistent`** - Siempre persistente (crea el directorio automaticamente si no existe)
- **`volatile`** - Solo en RAM (`/run/log/journal/`), se pierde al reiniciar
- **`none`** - No almacenar (solo reenviar a otros destinos)

**Para habilitar almacenamiento persistente manualmente** (cuando `Storage=auto`):
```bash
# Crear el directorio de journal persistente
mkdir -p /var/log/journal

# Establecer los permisos correctos
systemd-tmpfiles --create --prefix /var/log/journal

# Reiniciar el servicio para que detecte el directorio
systemctl restart systemd-journald
```

**Para el examen:** Con `Storage=auto`, basta con crear `/var/log/journal/` para que los logs persistan entre reinicios. Con `Storage=persistent`, systemd crea el directorio automaticamente.

### Opciones de reenvio del journal

| Opcion | Descripcion |
|--------|-------------|
| `ForwardToSyslog=yes` | Reenvia mensajes al syslog tradicional (rsyslog/syslog-ng) |
| `ForwardToConsole=no` | Reenvia mensajes a la consola del sistema (`/dev/console`) |
| `ForwardToKMsg=no` | Reenvia mensajes al buffer del kernel (`/dev/kmsg`) |
| `ForwardToWall=yes` | Reenvia mensajes de emergencia a todos los terminales con `wall` |

Estas opciones permiten que journald coexista con syslog tradicional, reenviandole los mensajes para que los almacene en archivos de texto plano.

---

## Comando `journalctl`

### Opciones principales
```bash
journalctl                       # Mostrar todos los logs
journalctl -u sshd               # Logs de un servicio especifico
journalctl -u sshd -u nginx      # Logs de multiples servicios
journalctl -p err                # Solo prioridad err y superiores
journalctl -p warning..err       # Rango de prioridades
journalctl -f                    # Seguimiento en tiempo real (como tail -f)
journalctl -b                    # Logs del arranque actual
journalctl -b -1                 # Logs del arranque anterior
journalctl --list-boots           # Listar arranques disponibles
journalctl -k                    # Solo mensajes del kernel (como dmesg)
journalctl --since "2024-01-15"  # Desde una fecha
journalctl --since "1 hour ago"  # Desde hace 1 hora
journalctl --until "2024-01-16"  # Hasta una fecha
journalctl --since "2024-01-15 10:00" --until "2024-01-15 12:00"
journalctl _PID=1234             # Filtrar por PID
journalctl _UID=1000             # Filtrar por UID
journalctl --disk-usage          # Espacio usado por el journal
journalctl --vacuum-size=100M    # Reducir a maximo 100MB
journalctl --vacuum-time=2weeks  # Eliminar logs de mas de 2 semanas
journalctl -o json               # Salida en formato JSON
journalctl -o verbose            # Salida con todos los campos
journalctl -n 50                 # Ultimas 50 entradas
journalctl --no-pager            # Sin paginador
```

---

## Archivos de log importantes en `/var/log/`

| Archivo | Contenido |
|---------|-----------|
| `/var/log/messages` | Mensajes generales del sistema (RHEL/CentOS) |
| `/var/log/syslog` | Mensajes generales del sistema (Debian/Ubuntu) |
| `/var/log/auth.log` | Autenticacion y seguridad (Debian/Ubuntu) |
| `/var/log/secure` | Autenticacion y seguridad (RHEL/CentOS) |
| `/var/log/kern.log` | Mensajes del kernel |
| `/var/log/dmesg` | Mensajes del kernel durante el arranque |
| `/var/log/boot.log` | Mensajes de arranque de servicios |
| `/var/log/cron` | Actividad del servicio cron |
| `/var/log/maillog` / `mail.log` | Mensajes del sistema de correo |
| `/var/log/wtmp` | Registro de logins (binario, leer con `last`) |
| `/var/log/btmp` | Intentos de login fallidos (binario, leer con `lastb`) |
| `/var/log/lastlog` | Ultimo login de cada usuario (binario, leer con `lastlog`) |
| `/var/log/faillog` | Registro de fallos de autenticacion |

> **Importante**: `wtmp`, `btmp` y `lastlog` son archivos **binarios**. No se pueden leer con `cat`, se usan `last`, `lastb` y `lastlog` respectivamente.

---

## Comando `logger`

Genera mensajes syslog desde la linea de comandos o scripts.

```bash
logger "Mensaje de prueba"                      # Facility user, priority notice
logger -p local0.info "Mensaje personalizado"   # Facility y priority especificas
logger -t miscript "Inicio de backup"           # Etiqueta personalizada
logger -p auth.warning "Intento sospechoso"     # Facility auth
```

Util en scripts para registrar eventos:
```bash
#!/bin/bash
logger -t backup "Inicio del backup diario"
rsync -av /datos /backup/
if [ $? -eq 0 ]; then
    logger -t backup "Backup completado exitosamente"
else
    logger -p local0.err -t backup "Error en el backup"
fi
```

---

## Comando `dmesg`

Muestra los mensajes del buffer del anillo del kernel.

```bash
dmesg                   # Mostrar todos los mensajes del kernel
dmesg -T                # Con marcas de tiempo legibles
dmesg -H                # Formato legible para humanos
dmesg -l err            # Solo errores
dmesg -f daemon         # Solo facility daemon
dmesg -c                # Mostrar y limpiar el buffer
dmesg | tail -20        # Ultimos 20 mensajes
```

---

## Rotacion de logs: `logrotate`

### Funcion
- Evita que los archivos de log crezcan indefinidamente
- Rota, comprime y elimina archivos de log automaticamente
- Se ejecuta normalmente mediante cron (diariamente)

### Archivo de configuracion principal: `/etc/logrotate.conf`
```
# Configuracion global
weekly                  # Rotar semanalmente
rotate 4                # Mantener 4 rotaciones
create                  # Crear nuevo archivo despues de rotar
compress                # Comprimir archivos rotados
include /etc/logrotate.d   # Incluir configuraciones adicionales
```

### Directorio `/etc/logrotate.d/`
Contiene archivos de configuracion individuales para cada servicio.

Ejemplo `/etc/logrotate.d/syslog`:
```
/var/log/syslog
/var/log/messages
{
    rotate 7
    daily
    missingok
    notifempty
    delaycompress
    compress
    postrotate
        /usr/lib/rsyslog/rsyslog-rotate
    endscript
}
```

### Directivas importantes de logrotate
| Directiva | Descripcion |
|-----------|-------------|
| `daily` / `weekly` / `monthly` | Frecuencia de rotacion |
| `rotate N` | Numero de archivos rotados a mantener |
| `compress` | Comprimir archivos rotados (gzip) |
| `delaycompress` | Comprimir en la siguiente rotacion (no la actual) |
| `missingok` | No generar error si el archivo no existe |
| `notifempty` | No rotar si el archivo esta vacio |
| `create mode owner group` | Crear nuevo archivo con permisos especificos |
| `copytruncate` | Copiar y truncar en vez de mover (para apps que no cierran el fd) |
| `postrotate/endscript` | Script a ejecutar despues de la rotacion |
| `prerotate/endscript` | Script a ejecutar antes de la rotacion |
| `size 100M` | Rotar cuando alcance cierto tamano |
| `maxage N` | Eliminar rotaciones con mas de N dias |
| `dateext` | Usar fecha como extension en vez de numeros |

### Ejecucion manual
```bash
logrotate /etc/logrotate.conf        # Ejecutar logrotate
logrotate -f /etc/logrotate.conf     # Forzar rotacion
logrotate -d /etc/logrotate.conf     # Modo debug (simular sin ejecutar)
```

---

## Puntos clave para el examen

1. **Facilities** definen el origen del mensaje, **priorities** la severidad
2. Las prioridades van de `emerg` (0, mas critica) a `debug` (7, menos critica)
3. Una regla `facility.priority` incluye esa prioridad **y todas las superiores**
4. `journalctl -u servicio` filtra por unidad systemd, `-p` por prioridad, `-f` para seguimiento
5. `journalctl -b` muestra logs del arranque actual, `-b -1` del anterior
6. **rsyslog**: `@` = UDP, `@@` = TCP para envio remoto
7. `logger` genera mensajes syslog desde la linea de comandos
8. **logrotate** se ejecuta via cron, no es un demonio permanente
9. `/var/log/wtmp` y `/var/log/btmp` son **binarios** (usar `last` y `lastb`)
10. `journalctl --vacuum-size` y `--vacuum-time` controlan el tamano del journal
