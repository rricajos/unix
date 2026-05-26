# 103.6 - Modificar prioridades de procesos: Comandos clave

## Valores nice - Referencia rapida

| Nice | Prioridad | Quien puede asignarlo |
|------|-----------|----------------------|
| -20 | Maxima (mas CPU) | Solo root |
| -10 | Alta | Solo root |
| 0 | Por defecto | Cualquier usuario |
| 10 | Baja | Cualquier usuario |
| 19 | Minima (menos CPU) | Cualquier usuario |

## nice - Iniciar proceso con prioridad modificada

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `nice comando` | Ejecuta con nice 10 (incremento por defecto) | `nice tar czf backup.tar.gz /home` |
| `nice -n VALOR comando` | Ejecuta con nice VALOR | `nice -n 15 make -j4` |
| `nice -n -VALOR comando` | Ejecuta con nice negativo (solo root) | `sudo nice -n -10 ./critico` |
| `nice -n 19 comando` | Ejecuta con minima prioridad | `nice -n 19 ./pesado.sh` |
| `nice -n -20 comando` | Ejecuta con maxima prioridad (solo root) | `sudo nice -n -20 ./urgente` |

## renice - Cambiar prioridad de proceso en ejecucion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `renice -n VALOR -p PID` | Cambiar nice de un proceso | `renice -n 10 -p 1234` |
| `renice VALOR PID` | Forma abreviada | `renice 10 1234` |
| `renice -n VALOR -u usuario` | Cambiar nice de todos los procesos de un usuario | `renice -n 5 -u sandra` |
| `renice -n VALOR -g grupo` | Cambiar nice de todos los procesos de un grupo | `renice -n 5 -g developers` |
| `renice -n -VALOR -p PID` | Subir prioridad (solo root) | `sudo renice -n -10 -p 1234` |

## Verificar prioridades con ps

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `ps -eo pid,ni,pri,comm` | Ver PID, nice, prioridad y comando | `ps -eo pid,ni,pri,comm` |
| `ps -eo pid,user,ni,pri,%cpu,comm` | Incluir usuario y CPU | `ps -eo pid,user,ni,pri,%cpu,comm` |
| `ps -eo pid,ni,comm --sort=-ni` | Ordenar por nice descendente | `ps -eo pid,ni,comm --sort=-ni` |
| `ps -eo pid,ni,comm --sort=ni` | Ordenar por nice ascendente | `ps -eo pid,ni,comm --sort=ni` |
| `ps -o pid,ni,pri,comm -p PID` | Ver nice de un PID concreto | `ps -o pid,ni,pri,comm -p 1234` |

## Prioridades en top

| Tecla/Columna | Descripcion |
|---------------|-------------|
| Columna **PR** | Prioridad del kernel (PR = 20 + NI) |
| Columna **NI** | Valor nice del proceso |
| Tecla `r` | Cambiar nice de un proceso (pide PID y nuevo valor) |

## Reglas de permisos - Resumen

| Accion | Usuario normal | Root |
|--------|---------------|------|
| Iniciar con nice 0 a 19 | Si | Si |
| Iniciar con nice -20 a -1 | No | Si |
| Subir nice de su proceso (bajar prioridad) | Si | Si |
| Bajar nice de su proceso (subir prioridad) | **No** | Si |
| Cambiar nice de procesos ajenos | **No** | Si |
| Revertir nice propio (ej: de 10 a 0) | **No** | Si |

## Formula de conversion

```
PR (priority) = 20 + NI (nice)

Ejemplos:
  NI = -20  -->  PR = 0   (maxima prioridad)
  NI =   0  -->  PR = 20  (prioridad por defecto)
  NI =  19  -->  PR = 39  (minima prioridad)
```
