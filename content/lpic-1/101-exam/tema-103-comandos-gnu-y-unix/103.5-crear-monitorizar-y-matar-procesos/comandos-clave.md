---
title: "103.5 - Crear, monitorizar y matar procesos: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.5"
---

# 103.5 - Crear, monitorizar y matar procesos: Comandos clave

## Visualizar procesos con ps

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `ps aux` | Todos los procesos, formato BSD detallado | `ps aux` |
| `ps -ef` | Todos los procesos, formato UNIX (incluye PPID) | `ps -ef` |
| `ps -eo campos` | Seleccionar columnas especificas | `ps -eo pid,user,%cpu,comm` |
| `ps -eo ... --sort=campo` | Ordenar por campo (- para descendente) | `ps -eo pid,%mem,comm --sort=-%mem` |
| `ps -u usuario` | Procesos de un usuario | `ps -u sandra` |
| `ps -p PID` | Informacion de un PID concreto | `ps -p 1234` |
| `ps -ef --forest` | Arbol de procesos | `ps -ef --forest` |
| `ps aux \| grep nombre` | Buscar proceso por nombre | `ps aux \| grep apache` |

## Monitorizar en tiempo real

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `top` | Monitor de procesos en tiempo real | `top` |
| `top -d N` | Actualizar cada N segundos | `top -d 5` |
| `top -p PID` | Monitorizar solo un PID | `top -p 1234` |
| `top -u usuario` | Filtrar por usuario | `top -u sandra` |
| `top -b -n 1` | Modo batch, una iteracion (para scripts) | `top -b -n 1 > salida.txt` |
| `htop` | Monitor interactivo mejorado (colores, raton) | `htop` |

## Teclas interactivas de top

| Tecla | Accion |
|-------|--------|
| `k` | Matar proceso (pide PID y senal) |
| `r` | Cambiar prioridad (renice) |
| `q` | Salir |
| `P` | Ordenar por CPU |
| `M` | Ordenar por memoria |
| `N` | Ordenar por PID |
| `T` | Ordenar por tiempo |
| `u` | Filtrar por usuario |
| `c` | Mostrar ruta completa |
| `1` | Ver cada CPU por separado |
| `d` | Cambiar intervalo de refresco |
| `Space` | Refrescar ahora |
| `W` | Guardar configuracion |

## Buscar procesos

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `pgrep nombre` | Buscar PIDs por nombre de proceso | `pgrep apache` |
| `pgrep -l nombre` | PIDs con nombre del proceso | `pgrep -l ssh` |
| `pgrep -a nombre` | PIDs con linea de comandos completa | `pgrep -a python` |
| `pgrep -u usuario` | PIDs por usuario | `pgrep -u root` |
| `pgrep -c nombre` | Contar procesos que coinciden | `pgrep -c apache` |
| `pgrep -x nombre` | Coincidencia exacta del nombre | `pgrep -x cron` |
| `pgrep -f patron` | Buscar en la linea de comandos completa | `pgrep -f "python app.py"` |

## Senales principales

| Numero | Nombre | Descripcion | Notas |
|--------|--------|-------------|-------|
| 1 | SIGHUP | Colgar / recargar configuracion | Daemons la usan para recargar config |
| 2 | SIGINT | Interrumpir (Ctrl+C) | El proceso puede capturarla |
| 9 | SIGKILL | Matar forzosamente | **No puede ser capturada ni ignorada** |
| 15 | SIGTERM | Terminar limpiamente | **Senal por defecto de kill** |
| 18 | SIGCONT | Continuar proceso detenido | Reanuda tras SIGSTOP/SIGTSTP |
| 19 | SIGSTOP | Detener (pausar) | **No puede ser capturada ni ignorada** |
| 20 | SIGTSTP | Detener desde terminal (Ctrl+Z) | Puede ser capturada |

## Enviar senales

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `kill PID` | Enviar SIGTERM (por defecto) | `kill 1234` |
| `kill -9 PID` | Enviar SIGKILL (forzar terminacion) | `kill -9 1234` |
| `kill -1 PID` | Enviar SIGHUP (recargar config) | `kill -1 1234` |
| `kill -TERM PID` | SIGTERM por nombre | `kill -TERM 1234` |
| `kill -l` | Listar todas las senales | `kill -l` |
| `kill -0 PID` | Verificar si proceso existe | `kill -0 1234` |
| `killall nombre` | SIGTERM a todos con ese nombre exacto | `killall apache2` |
| `killall -9 nombre` | SIGKILL a todos con ese nombre | `killall -9 firefox` |
| `killall -u usuario` | Matar procesos de un usuario | `killall -u sandra` |
| `killall -i nombre` | Modo interactivo (pide confirmacion) | `killall -i apache2` |
| `pkill patron` | SIGTERM por patron (coincidencia parcial) | `pkill apach` |
| `pkill -9 patron` | SIGKILL por patron | `pkill -9 fire` |
| `pkill -f patron` | Buscar en linea de comandos completa | `pkill -f "python app"` |
| `pkill -u usuario` | Matar por usuario | `pkill -u sandra` |

## Gestion de trabajos (jobs)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `comando &` | Ejecutar en segundo plano | `sleep 300 &` |
| `jobs` | Listar trabajos del shell | `jobs` |
| `jobs -l` | Listar con PIDs | `jobs -l` |
| `jobs -p` | Solo PIDs | `jobs -p` |
| `bg` | Reanudar trabajo actual en background | `bg` |
| `bg %N` | Reanudar trabajo N en background | `bg %2` |
| `fg` | Traer trabajo actual a foreground | `fg` |
| `fg %N` | Traer trabajo N a foreground | `fg %1` |
| `Ctrl+Z` | Suspender proceso de primer plano | (teclado) |
| `Ctrl+C` | Interrumpir proceso de primer plano | (teclado) |

## nohup y persistencia

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `nohup comando &` | Ejecutar inmune a SIGHUP | `nohup ./backup.sh &` |
| `nohup cmd > archivo 2>&1 &` | nohup con redireccion personalizada | `nohup ./script.sh > log.txt 2>&1 &` |

## Multiplexores de terminal

| Comando | Descripcion |
|---------|-------------|
| `screen` | Iniciar nueva sesion screen |
| `screen -S nombre` | Sesion con nombre |
| `screen -ls` | Listar sesiones |
| `screen -r nombre` | Reconectar a sesion |
| `Ctrl+a d` | Desconectar de screen |
| `tmux` | Iniciar nueva sesion tmux |
| `tmux new -s nombre` | Sesion con nombre |
| `tmux ls` | Listar sesiones |
| `tmux attach -t nombre` | Reconectar a sesion |
| `Ctrl+b d` | Desconectar de tmux |

## Otros comandos de monitorizacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `watch comando` | Ejecutar cada 2 seg (por defecto) | `watch df -h` |
| `watch -n N comando` | Ejecutar cada N segundos | `watch -n 5 free -m` |
| `watch -d comando` | Resaltar diferencias | `watch -d ls -la` |
| `uptime` | Tiempo de actividad y load average | `uptime` |
| `free -m` | Uso de memoria en megabytes | `free -m` |
| `free -h` | Uso de memoria formato legible | `free -h` |
| `free -s N` | Actualizar cada N segundos | `free -s 3` |
