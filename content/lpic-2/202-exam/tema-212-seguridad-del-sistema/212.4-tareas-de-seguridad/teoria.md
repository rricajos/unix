---
title: "212.4 - Tareas de seguridad"
tags: [lpic-2, examen-202, tema-212, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.4"
---

# 212.4 - Tareas de seguridad

## Introducción

Las tareas de seguridad del sistema incluyen la detección de intrusiones, monitorización de integridad de archivos, auditoría de puertos abiertos, protección contra ataques de fuerza bruta, configuración de límites de recursos y gestión de privilegios elevados.

## fail2ban: protección contra fuerza bruta

**fail2ban** monitoriza archivos de log y bloquea IPs que muestran comportamiento malicioso (intentos fallidos de autenticación).

### Arquitectura

- **Jails**: definen qué servicio proteger, qué log monitorizar y qué acción tomar
- **Filtros**: expresiones regulares que detectan intentos fallidos en los logs
- **Acciones**: comandos que se ejecutan al detectar un ataque (ej: bloquear IP con iptables)

### Archivos de configuración

| Archivo | Descripción |
|---------|-------------|
| `/etc/fail2ban/jail.conf` | Configuración por defecto (no modificar) |
| `/etc/fail2ban/jail.local` | Configuración personalizada (sobreescribe jail.conf) |
| `/etc/fail2ban/jail.d/*.conf` | Configuración modular por servicio |
| `/etc/fail2ban/filter.d/` | Filtros (expresiones regulares) |
| `/etc/fail2ban/action.d/` | Acciones de bloqueo |

### Configuración de un jail

```ini
# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600        # Tiempo de bloqueo en segundos (1 hora)
findtime = 600        # Ventana de tiempo para contar fallos
maxretry = 5          # Intentos máximos antes del bloqueo
ignoreip = 127.0.0.1/8 ::1 192.168.1.0/24

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[apache-auth]
enabled = true
port = http,https
filter = apache-auth
logpath = /var/log/apache2/error.log
```

> **Para el examen:** Siempre crear/modificar `jail.local` en lugar de `jail.conf`. Los valores en `jail.local` sobrescriben los de `jail.conf`. Las actualizaciones del paquete pueden sobrescribir `jail.conf`.

### Comandos de gestión

```bash
# Ver estado general
fail2ban-client status

# Ver estado de un jail específico
fail2ban-client status sshd

# Desbloquear una IP
fail2ban-client set sshd unbanip 192.168.1.100

# Bloquear una IP manualmente
fail2ban-client set sshd banip 10.0.0.50

# Recargar configuración
fail2ban-client reload
```

## Monitorización de integridad: AIDE y Tripwire

### AIDE (Advanced Intrusion Detection Environment)

AIDE crea una base de datos con huellas digitales de los archivos del sistema y detecta cambios no autorizados.

```bash
# Archivo de configuración
/etc/aide/aide.conf

# Inicializar la base de datos
aide --init

# Mover la nueva base de datos
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Verificar integridad
aide --check

# Actualizar base de datos después de cambios autorizados
aide --update
```

Ejemplo de configuración de AIDE:

```
# Reglas de verificación
/etc   p+i+u+g+sha256
/bin   p+i+u+g+sha256
/sbin  p+i+u+g+sha256
/usr/bin  p+i+u+g+sha256
/usr/sbin p+i+u+g+sha256

# Exclusiones
!/var/log
!/var/cache
!/tmp
```

Atributos monitorizados: `p` (permisos), `i` (inodo), `u` (usuario), `g` (grupo), `s` (tamaño), `sha256` (hash), `m` (mtime).

### Tripwire

Tripwire funciona de manera similar a AIDE pero usa un esquema de claves para proteger la configuración y la base de datos.

```bash
# Inicializar base de datos
tripwire --init

# Verificar integridad
tripwire --check

# Actualizar base de datos
tripwire --update

# Actualizar política
tripwire --update-policy
```

> **Para el examen:** Tanto AIDE como Tripwire deben inicializarse en un sistema limpio (recién instalado). La base de datos debe almacenarse en un medio de solo lectura o externo para evitar que un atacante la modifique.

## Detección de rootkits

### chkrootkit

```bash
# Escaneo básico
chkrootkit

# Modo silencioso (solo alertas)
chkrootkit -q

# Especificar directorio de binarios alternativos
chkrootkit -p /media/usb/bin
```

### rkhunter (Rootkit Hunter)

```bash
# Actualizar base de datos de firmas
rkhunter --update

# Establecer propiedades del sistema como referencia
rkhunter --propupd

# Escaneo completo
rkhunter --check

# Escaneo sin preguntas interactivas
rkhunter --check --skip-keypress

# Ver solo advertencias
rkhunter --check --report-warnings-only
```

Archivo de configuración: `/etc/rkhunter.conf`

> **Para el examen:** rkhunter debe actualizarse regularmente con `--update` y ejecutar `--propupd` después de actualizaciones legítimas del sistema para evitar falsos positivos.

## Auditoría de puertos y conexiones de red

### nmap: escaneo de puertos

```bash
# Escaneo TCP básico
nmap 192.168.1.1

# Escaneo de puertos específicos
nmap -p 22,80,443 192.168.1.1

# Escaneo de rango de puertos
nmap -p 1-1024 192.168.1.1

# Escaneo SYN (sigiloso, requiere root)
nmap -sS 192.168.1.1

# Escaneo de red completa
nmap -sn 192.168.1.0/24

# Detección de servicios y versiones
nmap -sV 192.168.1.1

# Detección de sistema operativo
nmap -O 192.168.1.1
```

### netstat y ss: conexiones locales

```bash
# Listar puertos en escucha con proceso (netstat)
netstat -tlnp

# Equivalente con ss (más moderno y rápido)
ss -tlnp

# Todas las conexiones TCP
ss -ta

# Conexiones UDP en escucha
ss -ulnp

# Filtrar por puerto
ss -tlnp sport = :22

# Mostrar estadísticas de sockets
ss -s
```

| Opción | Descripción |
|--------|-------------|
| `-t` | Solo TCP |
| `-u` | Solo UDP |
| `-l` | Solo en escucha (listening) |
| `-n` | No resolver nombres |
| `-p` | Mostrar proceso asociado |
| `-a` | Todas las conexiones |

> **Para el examen:** `ss` es el reemplazo moderno de `netstat`. Ambos con las opciones `-tlnp` muestran los puertos TCP en escucha con el proceso asociado.

## Límites de recursos: ulimit y limits.conf

### ulimit (límites de shell)

```bash
# Ver todos los límites del usuario actual
ulimit -a

# Límite de archivos abiertos (soft)
ulimit -Sn 4096

# Límite de archivos abiertos (hard)
ulimit -Hn 65536

# Límite de tamaño de archivos core
ulimit -c unlimited

# Límite de procesos por usuario
ulimit -u 1024

# Límite de tamaño de archivo (bloques de 512 bytes)
ulimit -f 100000
```

### /etc/security/limits.conf

Configuración permanente de límites por usuario o grupo:

```bash
# Formato: dominio  tipo  recurso  valor
# dominio: usuario, @grupo, *
# tipo: soft, hard, -  (- = ambos)

# Límite de archivos abiertos para todos
*               soft    nofile          4096
*               hard    nofile          65536

# Límite de procesos para el grupo developers
@developers     soft    nproc           2048
@developers     hard    nproc           4096

# Sin límite de core para admin
admin           -       core            unlimited

# Prioridad máxima de nice para el grupo audio
@audio          -       rtprio          99
```

> **Para el examen:** Los límites `soft` pueden ser aumentados por el usuario hasta el valor `hard`. Solo root puede aumentar los límites `hard`. El tipo `-` establece ambos simultáneamente.

## Configuración de sudo

### Archivo /etc/sudoers y visudo

**Siempre** editar con `visudo` para validar la sintaxis:

```bash
# Formato: usuario  host=(ejecutar_como)  comando
root    ALL=(ALL:ALL) ALL

# Grupo admin puede ejecutar cualquier comando
%admin  ALL=(ALL:ALL) ALL

# Usuario backup puede ejecutar solo tar sin contraseña
backup  ALL=(root) NOPASSWD: /usr/bin/tar, /usr/bin/rsync

# Alias de comandos
Cmnd_Alias NETWORKING = /sbin/ifconfig, /sbin/route, /usr/bin/ip
%netadmin ALL=(root) NETWORKING

# Configuración por defecto
Defaults    env_reset
Defaults    mail_badpass
Defaults    secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Defaults    logfile="/var/log/sudo.log"
Defaults    passwd_timeout=2
Defaults    timestamp_timeout=5
```

### Directorio /etc/sudoers.d/

```bash
# Configuración modular
# Archivo: /etc/sudoers.d/backup
backup ALL=(root) NOPASSWD: /usr/bin/rsync, /usr/bin/tar
```

> **Para el examen:** Nunca editar `/etc/sudoers` directamente con un editor de texto. `visudo` valida la sintaxis antes de guardar, evitando dejar el archivo en un estado inválido que podría bloquear el acceso sudo.

## Sistema de auditoría (auditd)

El demonio `auditd` registra eventos del sistema para cumplimiento normativo y detección de intrusiones.

### Configuración de reglas

```bash
# Monitorizar cambios en /etc/passwd
auditctl -w /etc/passwd -p wa -k passwd_changes

# Monitorizar ejecución de comandos privilegiados
auditctl -w /usr/bin/sudo -p x -k sudo_exec

# Monitorizar acceso a directorio de configuración
auditctl -w /etc/ssh/ -p rwa -k ssh_config

# Regla de llamada al sistema (syscall)
auditctl -a always,exit -F arch=b64 -S execve -k command_exec

# Listar reglas activas
auditctl -l

# Eliminar todas las reglas
auditctl -D
```

Permisos monitorizados: `r` (lectura), `w` (escritura), `x` (ejecución), `a` (atributos).

### Consulta de registros

```bash
# Buscar eventos por clave
ausearch -k passwd_changes

# Buscar por usuario
ausearch -ua 1000

# Buscar por tipo de evento
ausearch -m USER_LOGIN

# Generar informe resumido
aureport

# Informe de autenticaciones
aureport -au

# Informe de modificaciones de archivos
aureport -f

# Informe de eventos fallidos
aureport --failed
```

### Reglas persistentes

Las reglas se almacenan en `/etc/audit/rules.d/audit.rules`:

```bash
# Reglas permanentes
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudo_rules
-a always,exit -F arch=b64 -S execve -k commands
```

## Lynis: auditoría de seguridad

Lynis es una herramienta de auditoría de seguridad que evalúa la configuración del sistema.

```bash
# Auditoría completa del sistema
lynis audit system

# Auditoría con perfil específico
lynis audit system --profile /etc/lynis/custom.prf

# Solo verificar actualizaciones
lynis update info

# Ver pruebas disponibles
lynis show tests
```

Lynis genera un informe con puntuación de "hardening index" y sugerencias de mejora. Los resultados se almacenan en `/var/log/lynis.log` y `/var/log/lynis-report.dat`.

> **Para el examen:** Lynis es una herramienta de auditoría no intrusiva que solo analiza y reporta. No modifica la configuración del sistema automáticamente.
