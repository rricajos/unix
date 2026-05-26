---
title: "110.1 Realizar tareas de administracion de seguridad - Teoria"
tags:
  - lpic-1
  - examen-102
  - tema-110
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "102"
tema: "110"
subtema: "110.1"
---

# 110.1 Realizar tareas de administracion de seguridad - Teoria

## Buscar archivos con permisos especiales: SUID, SGID y archivos sin propietario

### Permisos SUID y SGID

| Permiso | Valor | Efecto en archivos | Efecto en directorios |
|---------|-------|--------------------|-----------------------|
| **SUID** | 4000 | Se ejecuta con permisos del **propietario** | Sin efecto |
| **SGID** | 2000 | Se ejecuta con permisos del **grupo** | Archivos nuevos heredan el grupo del directorio |
| **Sticky bit** | 1000 | N/A | Solo el propietario puede borrar sus archivos |

### Buscar archivos con `find`

```bash
# Archivos con SUID
find / -perm -4000 -type f 2>/dev/null
find / -perm -u+s -type f 2>/dev/null

# Archivos con SGID
find / -perm -2000 -type f 2>/dev/null
find / -perm -g+s -type f 2>/dev/null

# Archivos con SUID o SGID
find / -perm /6000 -type f 2>/dev/null

# Archivos sin propietario (usuario eliminado)
find / -nouser 2>/dev/null

# Archivos sin grupo (grupo eliminado)
find / -nogroup 2>/dev/null

# Archivos con SUID o SGID (listar con detalles)
find / -perm /6000 -type f -ls 2>/dev/null
```

> **Seguridad**: Los archivos SUID son un riesgo de seguridad porque permiten escalada de privilegios. Es importante auditarlos regularmente.

### Diferencia entre `-perm -4000` y `-perm /4000`
- **`-perm -4000`**: Archivos que tienen **al menos** el bit SUID activado (AND)
- **`-perm /4000`**: Archivos que tienen **alguno** de los bits especificados (OR)
- **`-perm 4000`**: Archivos con **exactamente** esos permisos

---

## Gestion de contrasenas y caducidad

### `passwd`
```bash
passwd                          # Cambiar propia contrasena
passwd usuario                  # Cambiar contrasena de otro usuario (root)
passwd -l usuario               # Bloquear cuenta (lock)
passwd -u usuario               # Desbloquear cuenta (unlock)
passwd -e usuario               # Forzar cambio de contrasena en proximo login (expire)
passwd -S usuario               # Mostrar estado de la contrasena
passwd -d usuario               # Eliminar contrasena (dejar en blanco)
```

### Salida de `passwd -S`
```
usuario P 2024-01-15 0 99999 7 -1
```
Campos: usuario, estado (P=password, L=locked, NP=no password), fecha ultimo cambio, min dias, max dias, dias de aviso, dias de inactividad

### `chage` (Change Age)
Gestiona la politica de caducidad de contrasenas.

```bash
chage -l usuario                # Listar informacion de caducidad
chage usuario                   # Modo interactivo
chage -M 90 usuario            # Maximo 90 dias de validez
chage -m 7 usuario             # Minimo 7 dias entre cambios
chage -W 14 usuario            # Avisar 14 dias antes de caducidad
chage -E 2024-12-31 usuario    # Fecha de expiracion de la cuenta
chage -I 30 usuario            # Dias de inactividad tras caducidad
chage -d 0 usuario             # Forzar cambio en proximo login
```

### Salida de `chage -l`
```
Last password change                    : Jan 15, 2024
Password expires                        : Apr 14, 2024
Password inactive                       : May 14, 2024
Account expires                         : Dec 31, 2024
Minimum number of days between password change  : 7
Maximum number of days between password change  : 90
Number of days of warning before password expires: 14
```

---

## Limites de recursos: `ulimit` y `limits.conf`

### `ulimit` (limites de shell)
```bash
ulimit -a                       # Mostrar todos los limites
ulimit -u                       # Max procesos del usuario
ulimit -n                       # Max archivos abiertos
ulimit -f                       # Max tamano de archivo (bloques)
ulimit -v                       # Max memoria virtual
ulimit -c                       # Max tamano de core dump
ulimit -u 100                   # Establecer max 100 procesos
ulimit -n 4096                  # Establecer max 4096 archivos abiertos

# Limites soft vs hard
ulimit -Su                      # Limite soft de procesos
ulimit -Hu                      # Limite hard de procesos
```

#### Diferencia soft vs hard
- **Soft limit**: Limite actual que puede ser aumentado por el usuario (hasta el hard limit)
- **Hard limit**: Limite maximo que solo root puede aumentar

### `/etc/security/limits.conf`
Limites persistentes para usuarios y grupos (aplicados por PAM).

```
# Formato: dominio  tipo  recurso  valor
# dominio: usuario, @grupo, * (todos)
# tipo: soft, hard, - (ambos)

# Limitar procesos del usuario juan a 100
juan        hard    nproc           100
juan        soft    nproc           50

# Limitar archivos abiertos para el grupo developers
@developers soft    nofile          4096
@developers hard    nofile          8192

# Limitar tamano de core dumps para todos
*           hard    core            0

# Limitar memoria para un usuario
maria       hard    as              2097152

# Limitar el tamano maximo de archivo (KB)
*           soft    fsize           1048576
```

| Recurso | Descripcion |
|---------|-------------|
| `nproc` | Numero maximo de procesos |
| `nofile` | Numero maximo de archivos abiertos |
| `fsize` | Tamano maximo de archivo |
| `core` | Tamano maximo de core dump |
| `as` | Espacio maximo de direcciones (memoria virtual) |
| `memlock` | Memoria bloqueada maxima |
| `cpu` | Tiempo maximo de CPU (minutos) |

---

## `lsof` (List Open Files)

Lista archivos abiertos y los procesos que los usan.

```bash
lsof                            # Todos los archivos abiertos
lsof -i                         # Conexiones de red
lsof -i :80                     # Que proceso usa el puerto 80
lsof -i TCP                     # Solo conexiones TCP
lsof -i TCP:22                  # Conexiones TCP en puerto 22
lsof -u usuario                 # Archivos abiertos por usuario
lsof -p 1234                    # Archivos abiertos por PID
lsof /var/log/syslog            # Que proceso tiene abierto ese archivo
lsof +D /var/log/               # Archivos abiertos en un directorio
```

---

## `fuser`

Identifica procesos que usan archivos o sockets.

```bash
fuser archivo                    # PIDs que usan el archivo
fuser -v archivo                 # Modo verbose (detallado)
fuser -k archivo                 # Matar procesos que usan el archivo
fuser -i -k archivo              # Matar con confirmacion interactiva
fuser -n tcp 80                  # Que proceso usa el puerto TCP 80
fuser -v /mnt/usb                # Procesos que usan un punto de montaje
fuser -km /mnt/usb               # Matar procesos del punto de montaje
```

---

## `nmap` (Network Mapper)

Escaner de red y puertos.

```bash
nmap host                        # Escaneo basico de puertos
nmap -sT host                    # Escaneo TCP connect
nmap -sS host                    # Escaneo TCP SYN (stealth, requiere root)
nmap -sU host                    # Escaneo UDP
nmap -p 22,80,443 host           # Puertos especificos
nmap -p 1-1000 host              # Rango de puertos
nmap -O host                     # Detectar sistema operativo
nmap -sV host                    # Detectar version de servicios
nmap 192.168.1.0/24              # Escanear toda la subred
nmap -sn 192.168.1.0/24          # Ping scan (descubrir hosts)
```

> **Para el examen**: Se requiere conocimiento **basico** de nmap.

---

## `sudo` y `su`

### `su` (Switch User)
```bash
su                               # Cambiar a root (login shell)
su -                             # Cambiar a root (login shell con entorno)
su - usuario                     # Cambiar a otro usuario
su -c "comando" usuario          # Ejecutar comando como otro usuario
```

### `sudo` (Superuser Do)
```bash
sudo comando                     # Ejecutar como root
sudo -u usuario comando          # Ejecutar como otro usuario
sudo -l                          # Listar permisos sudo del usuario
sudo -i                          # Shell interactivo como root
sudo -s                          # Shell como root sin login
sudo -k                          # Invalidar credenciales en cache
```

### `/etc/sudoers` y `visudo`
**Siempre** editar con `visudo` (valida la sintaxis antes de guardar).

```bash
visudo                           # Editar /etc/sudoers de forma segura
```

#### Formato de reglas
```
usuario  host=(usuario_ejecutar:grupo_ejecutar)  comandos
```

#### Ejemplos
```
# Root puede hacer todo
root    ALL=(ALL:ALL) ALL

# Usuario juan puede ejecutar cualquier comando como root
juan    ALL=(ALL:ALL) ALL

# Usuario maria puede reiniciar apache sin contrasena
maria   ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart apache2

# Grupo admin puede hacer todo
%admin  ALL=(ALL:ALL) ALL

# Usuario backup solo puede ejecutar rsync
backup  ALL=(ALL) /usr/bin/rsync

# Alias
User_Alias ADMINS = juan, maria, pedro
Cmnd_Alias SERVICIOS = /usr/bin/systemctl restart *, /usr/bin/systemctl stop *
ADMINS  ALL=(ALL) SERVICIOS
```

#### Directorio `/etc/sudoers.d/`
Se pueden colocar archivos adicionales de configuracion (incluidos via `#includedir /etc/sudoers.d`).

---

## Verificar sesiones de usuarios

### `who`
```bash
who                              # Usuarios conectados actualmente
who -b                           # Ultimo arranque del sistema
who -r                           # Nivel de ejecucion actual
```

### `w`
```bash
w                                # Usuarios conectados y que estan haciendo
```

Muestra: usuario, terminal, host remoto, login, idle time, procesos, comando actual.

### `last`
```bash
last                             # Historico de logins (lee /var/log/wtmp)
last -n 10                       # Ultimos 10 logins
last usuario                     # Logins de un usuario especifico
last reboot                      # Historico de reinicios
```

### `lastb`
```bash
lastb                            # Intentos de login fallidos (lee /var/log/btmp)
lastb -n 10                      # Ultimos 10 intentos fallidos
```

---

## Puntos clave para el examen

1. **`find / -perm -4000`** busca archivos SUID; **`-perm -2000`** busca SGID
2. **`find / -nouser`** busca archivos sin propietario valido
3. **`passwd -l`** bloquea, **`-u`** desbloquea, **`-e`** fuerza cambio
4. **`chage -l`** muestra politica de contrasena; **`chage -M`** establece dias maximos
5. **`ulimit -a`** muestra limites; `/etc/security/limits.conf` para limites persistentes
6. **`lsof -i :80`** muestra que proceso usa el puerto 80
7. **`fuser -k archivo`** mata procesos que usan un archivo
8. **`nmap host`** escanea puertos abiertos
9. **`visudo`** es la forma segura de editar `/etc/sudoers`
10. **`who`** = conectados ahora, **`w`** = conectados + actividad, **`last`** = historico
