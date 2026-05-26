---
title: "103.5 - Crear, monitorizar y matar procesos: Teoria"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.5"
---

# 103.5 - Crear, monitorizar y matar procesos: Teoria

## 1. Conceptos fundamentales de procesos

### Que es un proceso
Un **proceso** es una instancia de un programa en ejecucion. Cada proceso tiene:
- **PID** (Process ID): Identificador unico numerico
- **PPID** (Parent Process ID): PID del proceso padre que lo creo
- **UID/GID**: Usuario y grupo propietarios del proceso
- **Estado**: Running, Sleeping, Stopped, Zombie, etc.
- **Prioridad**: Determina la asignacion de CPU

### Proceso init/systemd
El primer proceso que se ejecuta en el sistema es `init` (o `systemd` en distribuiones modernas) con **PID 1**. Todos los demas procesos descienden de el formando un arbol de procesos.

### Tipos de procesos
| Tipo | Descripcion |
|------|-------------|
| **Foreground** (primer plano) | Ocupa la terminal, el usuario debe esperar a que termine |
| **Background** (segundo plano) | Se ejecuta sin bloquear la terminal |
| **Daemon** | Proceso de servicio que se ejecuta en segundo plano sin terminal asociada |
| **Zombie** | Proceso que ha terminado pero su padre aun no ha recogido su codigo de salida |
| **Orphan** | Proceso cuyo padre ha terminado; es adoptado por init/systemd |

---

## 2. Monitorizar procesos con `ps`

### Estilos de opciones
`ps` soporta tres estilos de opciones:
- **UNIX/POSIX**: con guion (`-e`, `-f`, `-u`)
- **BSD**: sin guion (`aux`, `x`)
- **GNU largo**: con doble guion (`--forest`, `--sort`)

> **Importante para el examen**: `ps aux` (BSD) y `ps -ef` (UNIX) son los dos formatos mas preguntados.

### `ps aux` - Estilo BSD
```bash
ps aux
```
Muestra **todos** los procesos del sistema con formato detallado:

| Columna | Significado |
|---------|-------------|
| USER | Usuario propietario del proceso |
| PID | Identificador del proceso |
| %CPU | Porcentaje de CPU usado |
| %MEM | Porcentaje de memoria usada |
| VSZ | Memoria virtual en KB |
| RSS | Memoria fisica (residente) en KB |
| TTY | Terminal asociada (? = sin terminal) |
| STAT | Estado del proceso |
| START | Hora de inicio |
| TIME | Tiempo de CPU acumulado |
| COMMAND | Comando que inicio el proceso |

### Codigos de estado (STAT)
| Codigo | Significado |
|--------|-------------|
| `R` | Running (ejecutandose o en cola de ejecucion) |
| `S` | Sleeping (durmiendo, esperando un evento) |
| `D` | Uninterruptible sleep (esperando I/O de disco) |
| `T` | Stopped (detenido por una senal) |
| `Z` | Zombie (terminado pero no recogido por el padre) |
| `s` | Lider de sesion |
| `l` | Multi-hilo |
| `+` | En el grupo de procesos de primer plano |
| `<` | Alta prioridad |
| `N` | Baja prioridad (nice) |

### `ps -ef` - Estilo UNIX
```bash
ps -ef
```

| Columna | Significado |
|---------|-------------|
| UID | Usuario propietario |
| PID | Identificador del proceso |
| PPID | PID del proceso padre |
| C | Uso de CPU |
| STIME | Hora de inicio |
| TTY | Terminal asociada |
| TIME | Tiempo de CPU acumulado |
| CMD | Comando |

> **Nota**: `ps -ef` muestra el PPID, `ps aux` no lo muestra por defecto.

### Personalizar la salida con `-o`
```bash
# Seleccionar columnas especificas
ps -eo pid,ppid,user,%cpu,%mem,stat,comm

# Ordenar por uso de memoria (descendente)
ps -eo pid,user,%mem,comm --sort=-%mem

# Ordenar por uso de CPU (descendente)
ps -eo pid,user,%cpu,comm --sort=-%cpu

# Mostrar arbol de procesos
ps -ef --forest

# Ver procesos de un usuario especifico
ps -u sandra

# Ver un proceso por PID
ps -p 1234
```

### Combinar con grep
```bash
# Buscar procesos de apache
ps aux | grep apache

# Evitar que aparezca el propio grep
ps aux | grep [a]pache
```

---

## 3. Monitorizar procesos con `top`

### Uso basico
```bash
top
```
`top` muestra los procesos en tiempo real, actualizandose periodicamente (por defecto cada 3 segundos).

### Cabecera de top
La cabecera muestra informacion del sistema:
- **Linea 1**: Hora actual, uptime, usuarios conectados, load average (1, 5, 15 min)
- **Linea 2**: Total de tareas y sus estados (running, sleeping, stopped, zombie)
- **Linea 3**: Uso de CPU (us=usuario, sy=sistema, ni=nice, id=idle, wa=I/O wait)
- **Linea 4**: Uso de memoria fisica
- **Linea 5**: Uso de swap

### Teclas interactivas de top

| Tecla | Accion |
|-------|--------|
| `k` | Kill: pide PID y senal para matar un proceso |
| `r` | Renice: cambia la prioridad de un proceso |
| `q` | Salir de top |
| `P` | Ordenar por uso de CPU (por defecto) |
| `M` | Ordenar por uso de memoria |
| `N` | Ordenar por PID |
| `T` | Ordenar por tiempo de CPU |
| `h` o `?` | Mostrar ayuda |
| `d` o `s` | Cambiar intervalo de actualizacion |
| `u` | Filtrar por usuario |
| `c` | Mostrar ruta completa del comando |
| `1` | Mostrar cada CPU individualmente |
| `l` | Alternar visualizacion de la linea de uptime |
| `t` | Alternar visualizacion de lineas de CPU |
| `m` | Alternar visualizacion de lineas de memoria |
| `W` | Guardar configuracion actual |
| `Space` | Refrescar inmediatamente |

### Campos principales de top
| Campo | Descripcion |
|-------|-------------|
| PID | Identificador del proceso |
| USER | Propietario |
| PR | Prioridad del kernel |
| NI | Valor nice |
| VIRT | Memoria virtual total |
| RES | Memoria fisica residente |
| SHR | Memoria compartida |
| S | Estado (R, S, D, T, Z) |
| %CPU | Porcentaje de CPU |
| %MEM | Porcentaje de memoria |
| TIME+ | Tiempo de CPU acumulado |
| COMMAND | Nombre del comando |

### Opciones de linea de comandos
```bash
top -d 5          # Actualizar cada 5 segundos
top -p 1234       # Monitorizar solo el PID 1234
top -u sandra     # Mostrar solo procesos de sandra
top -b            # Modo batch (para redirigir a archivo)
top -n 3          # Ejecutar solo 3 iteraciones (util con -b)
top -b -n 1 > top_output.txt   # Guardar una captura
```

---

## 4. htop

`htop` es una version mejorada e interactiva de `top` con interfaz en colores, barras graficas y soporte de raton.

Caracteristicas principales:
- Barras de colores para CPU, memoria y swap
- Navegacion con teclas de flechas
- Busqueda de procesos con `F3` o `/`
- Filtrar con `F4`
- Ordenar con `F6`
- Enviar senales con `F9`
- Arbol de procesos con `F5`
- Se puede desplazar horizontal y verticalmente

> **Nota**: `htop` no siempre esta instalado por defecto, pero puede aparecer en el examen.

---

## 5. Buscar procesos con `pgrep`

`pgrep` busca procesos por nombre u otros atributos y devuelve sus PIDs.

```bash
pgrep apache         # PIDs de procesos cuyo nombre contiene "apache"
pgrep -u root        # PIDs de procesos del usuario root
pgrep -l apache      # PIDs con nombre del proceso
pgrep -a apache      # PIDs con linea de comandos completa
pgrep -c apache      # Cuenta de procesos que coinciden
pgrep -x cron        # Coincidencia exacta del nombre
pgrep -f "python script.py"  # Buscar en toda la linea de comandos
pgrep -P 1           # Procesos hijos de PID 1
```

---

## 6. Enviar senales a procesos

### Que son las senales
Las senales son mecanismos de comunicacion entre procesos (IPC) en Unix/Linux. Permiten notificar a un proceso de un evento o solicitarle una accion.

### Senales mas importantes para el examen

| Numero | Nombre | Descripcion | Comportamiento |
|--------|--------|-------------|----------------|
| 1 | SIGHUP | Hangup | Recarga configuracion o termina. Los daemons suelen recargar su config |
| 2 | SIGINT | Interrupt | Interrumpe el proceso (como Ctrl+C) |
| 3 | SIGQUIT | Quit | Termina con core dump |
| 9 | SIGKILL | Kill | Termina inmediatamente. **No puede ser capturada ni ignorada** |
| 15 | SIGTERM | Terminate | Termina de forma limpia (senal por defecto de `kill`) |
| 18 | SIGCONT | Continue | Reanuda un proceso detenido |
| 19 | SIGSTOP | Stop | Detiene (pausa) un proceso. **No puede ser capturada ni ignorada** |
| 20 | SIGTSTP | Terminal Stop | Como SIGSTOP pero desde terminal (Ctrl+Z). **Puede ser capturada** |

> **Clave para el examen**: SIGKILL (9) y SIGSTOP (19) son las unicas senales que **no pueden ser capturadas, bloqueadas ni ignoradas** por el proceso. SIGTERM (15) es la senal por defecto de `kill` y permite al proceso terminar limpiamente.

### `kill` - Enviar senales por PID
```bash
kill PID             # Envia SIGTERM (15) por defecto
kill -15 PID         # Equivalente al anterior
kill -SIGTERM PID    # Equivalente al anterior
kill -TERM PID       # Equivalente al anterior
kill -9 PID          # Envia SIGKILL (fuerza terminacion inmediata)
kill -KILL PID       # Equivalente al anterior
kill -1 PID          # Envia SIGHUP (recarga configuracion)
kill -HUP PID        # Equivalente al anterior
kill -l              # Lista todas las senales disponibles
kill -0 PID          # Verifica si el proceso existe (no envia senal)

# Matar multiples procesos
kill 1234 5678 9012
kill -9 1234 5678
```

### `killall` - Enviar senales por nombre
```bash
killall apache2       # SIGTERM a todos los procesos llamados "apache2"
killall -9 firefox    # SIGKILL a todos los procesos llamados "firefox"
killall -u sandra     # Mata todos los procesos del usuario sandra
killall -i apache2    # Modo interactivo: pide confirmacion
killall -w apache2    # Espera a que todos los procesos terminen
killall -v apache2    # Modo verbose
```

> **Importante**: `killall` usa el nombre **exacto** del proceso.

### `pkill` - Enviar senales por patron
```bash
pkill apache          # SIGTERM a procesos cuyo nombre contiene "apache"
pkill -9 firefox      # SIGKILL a procesos cuyo nombre contiene "firefox"
pkill -u sandra       # Mata procesos del usuario sandra
pkill -f "python script.py"  # Busca en la linea de comandos completa
pkill -t pts/0        # Mata procesos de una terminal especifica
pkill -P 1234         # Mata procesos hijos del PID 1234
```

> **Diferencia**: `pkill` hace coincidencia parcial (patron), `killall` requiere nombre exacto.

### Atajos de teclado para senales
| Combinacion | Senal | Efecto |
|-------------|-------|--------|
| `Ctrl+C` | SIGINT (2) | Interrumpe el proceso en primer plano |
| `Ctrl+Z` | SIGTSTP (20) | Suspende el proceso en primer plano |
| `Ctrl+\` | SIGQUIT (3) | Termina el proceso con core dump |

---

## 7. Gestion de trabajos (jobs)

### Primer plano y segundo plano
Cuando ejecutas un comando en la terminal:
- **Primer plano (foreground)**: La terminal queda bloqueada hasta que termine
- **Segundo plano (background)**: La terminal queda libre para seguir trabajando

### Ejecutar en segundo plano con `&`
```bash
sleep 300 &           # Ejecuta en segundo plano
# [1] 12345           # Muestra: [numero_job] PID
```

### Suspender y mover procesos
```bash
# 1. Ejecutar un proceso largo
find / -name "*.log" 2>/dev/null

# 2. Suspenderlo con Ctrl+Z
# [1]+ Stopped    find / -name "*.log" 2>/dev/null

# 3. Ver trabajos
jobs
# [1]+  Stopped    find / -name "*.log" 2>/dev/null

# 4. Reanudar en segundo plano
bg %1

# 5. Traer a primer plano
fg %1
```

### El comando `jobs`
```bash
jobs              # Lista trabajos del shell actual
jobs -l           # Lista con PIDs
jobs -p           # Solo muestra PIDs
jobs -r           # Solo trabajos en ejecucion (running)
jobs -s           # Solo trabajos detenidos (stopped)
```

### Indicadores de jobs
| Simbolo | Significado |
|---------|-------------|
| `+` | Trabajo actual (el mas reciente, usado por defecto con `fg` y `bg`) |
| `-` | Trabajo anterior |
| (sin simbolo) | Otros trabajos |

### Referencia a trabajos
```bash
fg %1             # Trabajo numero 1
fg %+             # Trabajo actual (el del +)
fg %-             # Trabajo anterior (el del -)
fg %%             # Igual que %+
fg %nombre        # Trabajo cuyo comando empieza por "nombre"
fg %?cadena       # Trabajo cuyo comando contiene "cadena"
```

### `bg` y `fg`
```bash
bg                # Reanuda el trabajo actual en segundo plano
bg %2             # Reanuda el trabajo 2 en segundo plano
fg                # Trae el trabajo actual a primer plano
fg %2             # Trae el trabajo 2 a primer plano
```

---

## 8. `nohup` - Inmunidad a SIGHUP

Cuando cierras una terminal o sesion SSH, el shell envia **SIGHUP** a todos sus procesos hijos, lo que normalmente los termina. `nohup` hace que un proceso ignore la senal SIGHUP.

```bash
nohup comando &
```

Comportamiento de `nohup`:
- El proceso ignora SIGHUP
- La salida estandar y de error se redirige a `nohup.out` (si no se redirige explicitamente)
- El proceso continua ejecutandose despues de cerrar la terminal

```bash
# Ejemplo tipico
nohup ./backup.sh &

# Redirigir salida a un archivo especifico
nohup ./backup.sh > /var/log/backup.log 2>&1 &
```

> **Para el examen**: `nohup` protege contra SIGHUP, pero el proceso **si puede ser matado** con SIGKILL o SIGTERM. `nohup` NO convierte un proceso en daemon.

---

## 9. Multiplexores de terminal: `screen` y `tmux`

### `screen`
`screen` permite crear multiples sesiones de terminal virtuales que persisten incluso si cierras la conexion.

```bash
screen                    # Inicia nueva sesion
screen -S nombre          # Inicia sesion con nombre
screen -ls                # Lista sesiones activas
screen -r nombre          # Reconectar a sesion
screen -r PID             # Reconectar por PID
screen -d -r nombre       # Desconectar de otro lugar y reconectar aqui
```

Atajos dentro de screen (prefijo `Ctrl+a`):
| Atajo | Accion |
|-------|--------|
| `Ctrl+a d` | Desconectar (detach) de la sesion |
| `Ctrl+a c` | Crear nueva ventana |
| `Ctrl+a n` | Siguiente ventana |
| `Ctrl+a p` | Ventana anterior |
| `Ctrl+a "` | Lista de ventanas |
| `Ctrl+a k` | Matar ventana actual |
| `Ctrl+a ?` | Ayuda |

### `tmux`
`tmux` es un multiplexor mas moderno que `screen`.

```bash
tmux                      # Inicia nueva sesion
tmux new -s nombre        # Inicia sesion con nombre
tmux ls                   # Lista sesiones
tmux attach -t nombre     # Reconectar a sesion
tmux kill-session -t nombre  # Matar sesion
```

Atajos dentro de tmux (prefijo `Ctrl+b`):
| Atajo | Accion |
|-------|--------|
| `Ctrl+b d` | Desconectar de la sesion |
| `Ctrl+b c` | Crear nueva ventana |
| `Ctrl+b n` | Siguiente ventana |
| `Ctrl+b p` | Ventana anterior |
| `Ctrl+b %` | Dividir panel verticalmente |
| `Ctrl+b "` | Dividir panel horizontalmente |
| `Ctrl+b o` | Cambiar de panel |
| `Ctrl+b x` | Cerrar panel actual |

> **Clave para el examen**: La diferencia principal entre `screen` y `tmux` es el prefijo de teclas: `Ctrl+a` para screen, `Ctrl+b` para tmux. Ambos permiten que las sesiones persistan al desconectar.

---

## 10. Otros comandos de monitorizacion

### `watch` - Ejecutar comandos periodicamente
```bash
watch comando             # Ejecuta cada 2 segundos (por defecto)
watch -n 5 df -h          # Ejecuta cada 5 segundos
watch -d ls -la           # Resalta diferencias entre ejecuciones
watch -d=cumulative ls -la  # Acumula los cambios resaltados
watch -t df -h            # Sin cabecera (titulo)
watch "ps aux | grep apache"  # Usar comillas para comandos con pipes
```

### `uptime` - Tiempo de actividad del sistema
```bash
uptime
# 14:30:25 up 45 days, 3:22, 2 users, load average: 0.15, 0.10, 0.05
```

Informacion que muestra:
- Hora actual
- Tiempo que lleva el sistema encendido
- Numero de usuarios conectados
- **Load average**: Carga media del sistema en 1, 5 y 15 minutos

> **Load average**: Un valor de 1.0 en un sistema con 1 CPU significa que la CPU esta al 100%. En un sistema con 4 CPUs, un load average de 4.0 seria el 100%.

### `free` - Uso de memoria
```bash
free                # Muestra en kilobytes
free -m             # Muestra en megabytes
free -g             # Muestra en gigabytes
free -h             # Formato legible (human-readable)
free -s 3           # Actualizar cada 3 segundos
free -t             # Muestra total de RAM + swap
```

Columnas de `free`:
| Columna | Descripcion |
|---------|-------------|
| total | Memoria total instalada |
| used | Memoria usada |
| free | Memoria libre (completamente sin usar) |
| shared | Memoria compartida (tmpfs) |
| buff/cache | Memoria usada por buffers y cache |
| available | Memoria disponible para nuevos procesos (free + cache liberable) |

> **Importante**: `available` es mas relevante que `free` para saber cuanta memoria puede usar un nuevo proceso, porque Linux usa agresivamente la memoria libre como cache.

---

## 11. Comandos adicionales de procesos

### `pstree` - Arbol de procesos

`pstree` muestra los procesos del sistema en formato de arbol, visualizando la relacion padre-hijo entre procesos.

```bash
pstree                    # Muestra el arbol completo desde init/systemd
pstree -p                 # Muestra PIDs junto a los nombres
pstree -u                 # Muestra cambios de usuario entre procesos
pstree -a                 # Muestra argumentos de linea de comandos
pstree -h                 # Resalta el proceso actual y sus ancestros
pstree -H PID             # Resalta un PID especifico y sus ancestros
pstree sandra             # Muestra solo procesos del usuario sandra
pstree -p 1234            # Muestra el arbol a partir del PID 1234
pstree -s 1234            # Muestra los ancestros del PID 1234
```

Ejemplo de salida:
```
systemd─┬─NetworkManager───2*[{NetworkManager}]
        ├─sshd───sshd───bash───pstree
        ├─cron
        └─rsyslogd───3*[{rsyslogd}]
```

> **Para el examen**: `pstree` es util para visualizar la jerarquia de procesos. La opcion `-p` para ver PIDs es la mas preguntada.

### `pidof` - Obtener PID por nombre de programa

`pidof` devuelve el PID de un programa en ejecucion buscando por su nombre exacto.

```bash
pidof sshd                # Devuelve el/los PID(s) del proceso sshd
pidof -s sshd             # Devuelve solo UN PID (single shot)
pidof -x script.sh        # Busca tambien en scripts
```

Diferencia con `pgrep`:
| Comando | Coincidencia | Tipo |
|---------|-------------|------|
| `pidof` | Nombre exacto del programa | Comando externo |
| `pgrep` | Patron parcial (regex) | Comando externo |

```bash
# pidof busca por nombre exacto del ejecutable
pidof bash                # Devuelve PIDs de todos los procesos bash

# pgrep permite patrones parciales
pgrep -l bas              # Encuentra bash, basename, etc.
```

### Directorio `/proc/PID/`

El sistema de archivos virtual `/proc` contiene un subdirectorio por cada proceso en ejecucion, nombrado con su PID. Estos directorios contienen informacion detallada del proceso en forma de archivos virtuales.

```bash
# Ver informacion del proceso con PID 1 (init/systemd)
ls /proc/1/
```

**Archivos mas importantes dentro de `/proc/PID/`:**

| Archivo | Descripcion |
|---------|-------------|
| `/proc/PID/cmdline` | Linea de comandos con la que se inicio el proceso |
| `/proc/PID/status` | Estado del proceso (nombre, estado, PID, PPID, UIDs, memoria, etc.) |
| `/proc/PID/fd/` | Directorio con enlaces simbolicos a los descriptores de archivo abiertos |
| `/proc/PID/environ` | Variables de entorno del proceso |
| `/proc/PID/cwd` | Enlace simbolico al directorio de trabajo actual del proceso |
| `/proc/PID/exe` | Enlace simbolico al ejecutable del proceso |
| `/proc/PID/maps` | Regiones de memoria mapeadas |
| `/proc/PID/stat` | Informacion de estado en formato numerico (usado por `ps`) |
| `/proc/PID/io` | Estadisticas de entrada/salida del proceso |

```bash
# Ver la linea de comandos de un proceso
cat /proc/1234/cmdline | tr '\0' ' '

# Ver el estado de un proceso
cat /proc/1234/status

# Ver los descriptores de archivo abiertos
ls -la /proc/1234/fd/

# Ver el directorio de trabajo de un proceso
readlink /proc/1234/cwd

# Ver el ejecutable de un proceso
readlink /proc/1234/exe
```

> **Para el examen**: `/proc/PID/` es una fuente fundamental de informacion sobre procesos. Los archivos `cmdline`, `status` y `fd/` son los mas relevantes. Toda la informacion que muestra `ps` proviene de `/proc`.

---

## 12. Resumen de flujo de trabajo tipico

```
1. Ejecutar proceso:        comando &     (background)
2. Ver trabajos:            jobs -l
3. Buscar procesos:         ps aux | grep nombre
                            pgrep -l nombre
4. Monitorizar en vivo:     top / htop
5. Suspender proceso:       Ctrl+Z
6. Reanudar background:     bg %n
7. Traer a foreground:      fg %n
8. Terminar limpiamente:    kill PID       (SIGTERM)
9. Forzar terminacion:      kill -9 PID    (SIGKILL)
10. Matar por nombre:       killall nombre / pkill patron
11. Proteger de logout:     nohup comando &
12. Sesion persistente:     screen / tmux
```
