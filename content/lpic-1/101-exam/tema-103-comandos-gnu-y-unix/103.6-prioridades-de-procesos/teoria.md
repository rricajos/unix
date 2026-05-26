---
title: "103.6 - Modificar prioridades de procesos: Teoria"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.6"
---

# 103.6 - Modificar prioridades de procesos: Teoria

## 1. Conceptos de prioridad en Linux

### Como gestiona Linux la CPU
Linux es un sistema operativo **multitarea** que puede ejecutar multiples procesos aparentemente al mismo tiempo. El **planificador del kernel** (scheduler) decide que proceso se ejecuta en cada momento y durante cuanto tiempo. La prioridad determina cuanto tiempo de CPU recibe cada proceso en comparacion con los demas.

### Dos valores de prioridad
En Linux existen dos valores relacionados con la prioridad de un proceso:

| Concepto | Rango | Descripcion |
|----------|-------|-------------|
| **Nice value (NI)** | -20 a 19 | Valor que el usuario puede modificar. Menor = mas prioridad |
| **Priority (PR/PRI)** | 0 a 139 | Prioridad real del kernel. El usuario no la modifica directamente |

### Valor nice (niceness)
El **valor nice** representa la "amabilidad" del proceso con los demas:
- Un proceso **mas nice** (valor alto) cede CPU a otros procesos = **menor prioridad**
- Un proceso **menos nice** (valor bajo/negativo) acapara CPU = **mayor prioridad**

| Nice | Significado | Quien puede asignarlo |
|------|-------------|----------------------|
| -20 | **Maxima prioridad** (menos amable) | Solo root |
| 0 | **Prioridad por defecto** | Cualquier usuario |
| 19 | **Minima prioridad** (mas amable) | Cualquier usuario |

> **Regla fundamental para el examen**: Un usuario normal solo puede **subir** el valor nice (bajar prioridad, rango 0 a 19). Solo **root** puede **bajar** el valor nice (subir prioridad, valores negativos de -20 a -1).

### Relacion entre nice y priority
La prioridad real del kernel (PR) se calcula a partir del nice value:

```
PR = 20 + NI
```

| Nice (NI) | Priority (PR) | Prioridad real |
|-----------|---------------|----------------|
| -20 | 0 | Maxima prioridad |
| 0 | 20 | Prioridad por defecto |
| 19 | 39 | Minima prioridad |

> **Nota**: Los valores de PR 0-39 son para procesos normales. Los valores de PR por debajo de 0 (mostrados como "rt" en top) son para procesos en tiempo real, que no se gestionan con nice.

---

## 2. `nice` - Iniciar un proceso con prioridad modificada

### Sintaxis
```bash
nice [OPCION] [COMANDO]
```

### Uso basico
```bash
# Ejecutar con prioridad por defecto (nice 0)
comando

# Ejecutar con nice 10 (prioridad por defecto de nice si no se especifica valor)
nice comando

# Ejecutar con nice 15
nice -n 15 comando

# Ejecutar con nice -5 (solo root)
nice -n -5 comando

# Ejecutar con nice -20 (maxima prioridad, solo root)
nice -n -20 comando

# Ejecutar con nice 19 (minima prioridad)
nice -n 19 ./proceso_pesado.sh
```

### Comportamiento por defecto
```bash
nice comando
```
Sin especificar un valor, `nice` usa un incremento de **10**. Es decir, el proceso se inicia con nice value de 10.

### Ejemplos practicos
```bash
# Compilacion pesada con baja prioridad para no afectar al sistema
nice -n 19 make -j4

# Proceso critico con alta prioridad (solo root)
sudo nice -n -10 ./proceso_critico

# Backup con prioridad baja
nice -n 15 tar czf /backup/datos.tar.gz /home/
```

### Sintaxis alternativa (obsoleta pero valida)
```bash
nice -15 comando      # Equivale a nice -n 15 comando
nice --15 comando     # Equivale a nice -n -15 comando (solo root)
```

> **Para el examen**: La forma recomendada y mas clara es `nice -n VALOR comando`.

---

## 3. `renice` - Cambiar la prioridad de un proceso en ejecucion

### Sintaxis
```bash
renice [-n] PRIORIDAD [-p PID] [-u USUARIO] [-g GRUPO]
```

### Uso basico
```bash
# Cambiar nice de un proceso por PID
renice -n 10 -p 1234

# Forma abreviada (PID por defecto)
renice 10 1234

# Cambiar nice de todos los procesos de un usuario
renice -n 5 -u sandra

# Cambiar nice de todos los procesos de un grupo
renice -n 5 -g developers

# Dar maxima prioridad a un proceso (solo root)
renice -n -20 -p 1234

# Cambiar multiples procesos
renice -n 10 -p 1234 -p 5678
```

### Restricciones de usuario
| Accion | Usuario normal | Root |
|--------|---------------|------|
| Subir nice (bajar prioridad) | Si, solo sus propios procesos | Si, cualquier proceso |
| Bajar nice (subir prioridad) | **NO** | Si, cualquier proceso |
| Revertir un cambio de nice | **NO** (no puede bajar el nice una vez subido) | Si |
| Modificar procesos de otros usuarios | **NO** | Si |

> **Muy importante para el examen**: Un usuario normal que sube el nice de su proceso a 15 **no puede** volver a bajarlo a 0. Solo root puede hacerlo. Esto es una restriccion de seguridad.

---

## 4. Verificar prioridades con `ps`

### Columnas relevantes
```bash
# Ver nice y prioridad de todos los procesos
ps -eo pid,ni,pri,comm

# Formato completo con nice
ps -eo pid,user,ni,pri,%cpu,%mem,comm --sort=-ni

# Ver nice de un proceso especifico
ps -o pid,ni,pri,comm -p 1234
```

| Columna | Significado |
|---------|-------------|
| `NI` o `ni` | Valor nice (-20 a 19) |
| `PRI` o `pri` | Prioridad del kernel |

### Ejemplo de salida
```
  PID  NI PRI COMMAND
    1   0  20 systemd
  523 -10  30 proceso_critico
 1234  10  10 backup
 5678  19   1 compilacion
```

---

## 5. Verificar y cambiar prioridades con `top`

### Ver prioridades en top
En `top`, las columnas relevantes son:
- **PR**: Prioridad del kernel (menor = mas prioridad)
- **NI**: Valor nice del proceso

### Cambiar prioridad desde top
1. Ejecutar `top`
2. Presionar `r` (renice)
3. Introducir el PID del proceso
4. Introducir el nuevo valor nice

> **Para el examen**: Recuerda que la tecla `r` en `top` sirve para cambiar el nice (renice) de un proceso interactivamente.

---

## 6. Resumen de reglas clave para el examen

### Valores nice
```
Rango nice:      -20 ........... 0 ........... 19
                 |                |              |
                 Maxima          Default         Minima
                 prioridad                       prioridad
                 (solo root)     (todos)         (todos)
```

### Reglas de permisos
1. **Por defecto**, todos los procesos se inician con nice **0**
2. `nice comando` (sin valor) inicia con nice **10**
3. Un usuario normal **solo puede subir** el nice de sus propios procesos (0 a 19)
4. Un usuario normal **no puede bajar** el nice (no puede poner valores negativos)
5. Un usuario normal **no puede revertir** un cambio de nice (si subio a 10, no puede volver a 0)
6. **Solo root** puede asignar valores nice negativos (-20 a -1)
7. **Solo root** puede cambiar el nice de procesos de otros usuarios
8. La relacion es: **PR = 20 + NI**

### Diferencia entre nice y renice
| Aspecto | `nice` | `renice` |
|---------|--------|----------|
| Cuando se usa | Al **iniciar** un proceso | Con un proceso **ya en ejecucion** |
| Argumento | Un comando a ejecutar | Un PID, usuario o grupo |
| Sintaxis | `nice -n 10 comando` | `renice -n 10 -p PID` |
| Valor por defecto | 10 (si no se especifica) | No tiene default |
