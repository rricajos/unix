# 103.6 - Modificar prioridades de procesos: Ejercicios

## Pregunta 1
Cual es el rango valido de valores nice en Linux y cual es el valor por defecto al iniciar un proceso normalmente?

A) -20 a 20, por defecto 0
B) -19 a 20, por defecto 10
C) -20 a 19, por defecto 0
D) 0 a 39, por defecto 20

<details>
<summary>Respuesta</summary>

**C) -20 a 19, por defecto 0**

El rango de valores nice en Linux va de **-20** (maxima prioridad) a **19** (minima prioridad). Cuando un proceso se inicia normalmente (sin usar el comando `nice`), se le asigna un valor nice de **0** por defecto. Los valores negativos (-20 a -1) solo pueden ser asignados por root. El rango 0 a 39 corresponde a la prioridad del kernel (PR), no al valor nice.
</details>

---

## Pregunta 2
Un usuario normal ejecuta el siguiente comando:
```bash
nice -n -5 ./mi_script.sh
```
Que ocurrira?

A) El script se ejecuta con nice -5 (alta prioridad)
B) El script se ejecuta con nice 5
C) El comando falla con un error de permisos
D) El script se ejecuta con nice 0

<details>
<summary>Respuesta</summary>

**C) El comando falla con un error de permisos**

Un usuario normal **no puede** asignar valores nice negativos. Los valores negativos (de -20 a -1) representan prioridades mas altas que la por defecto y solo **root** puede asignarlos. El sistema mostrara un error como "nice: cannot set niceness: Permission denied". Para ejecutar este comando correctamente, el usuario necesitaria usar `sudo nice -n -5 ./mi_script.sh`.
</details>

---

## Pregunta 3
Un administrador tiene un proceso con PID 5678 ejecutandose con nice 0. Quiere bajar su prioridad a nice 15. Cual es el comando correcto?

A) `nice -n 15 -p 5678`
B) `renice -n 15 -p 5678`
C) `renice -p 5678 -n 15`
D) Ambas B y C son correctas

<details>
<summary>Respuesta</summary>

**B) `renice -n 15 -p 5678`**

Para cambiar la prioridad de un proceso **ya en ejecucion**, se utiliza `renice`, no `nice`. `nice` solo se usa para **iniciar** un nuevo proceso con una prioridad especifica. La sintaxis correcta es `renice -n 15 -p 5678`. La opcion A es incorrecta porque `nice` no acepta `-p PID` (no trabaja con procesos existentes). Aunque el orden de opciones en `renice` puede variar en algunas implementaciones, la forma estandar es `-n VALOR -p PID`.
</details>

---

## Pregunta 4
Un usuario normal tiene un proceso con PID 3456 ejecutandose con nice 10. Ejecuta:
```bash
renice -n 5 -p 3456
```
Que sucede?

A) El nice del proceso cambia a 5
B) El nice del proceso cambia a 15
C) El comando falla porque el usuario no puede bajar el nice
D) El nice del proceso se mantiene en 10

<details>
<summary>Respuesta</summary>

**C) El comando falla porque el usuario no puede bajar el nice**

Un usuario normal **no puede disminuir** el valor nice de un proceso, ni siquiera si fue el quien lo subio. El proceso tiene nice 10 y el usuario intenta cambiarlo a 5, lo cual es **bajar el nice** (subir la prioridad). Esta operacion esta reservada para root. El usuario solo podria subir el nice a un valor mayor (por ejemplo, 15 o 19). Para cambiarlo a 5, necesitaria privilegios de root: `sudo renice -n 5 -p 3456`.
</details>

---

## Pregunta 5
Si un proceso tiene un valor nice de -10, cual sera su valor de prioridad (PR) mostrado en `top`?

A) -10
B) 10
C) 30
D) 20

<details>
<summary>Respuesta</summary>

**B) 10**

La relacion entre el valor nice (NI) y la prioridad del kernel (PR) es: **PR = 20 + NI**. Si NI = -10, entonces PR = 20 + (-10) = **10**. Un PR mas bajo significa mayor prioridad. Para referencia: NI = 0 da PR = 20 (por defecto), NI = -20 da PR = 0 (maxima prioridad normal), y NI = 19 da PR = 39 (minima prioridad).
</details>

---

## Pregunta 6
Que tecla se presiona en `top` para cambiar interactivamente la prioridad (nice) de un proceso?

A) `k`
B) `n`
C) `r`
D) `p`

<details>
<summary>Respuesta</summary>

**C) `r`**

En la interfaz interactiva de `top`, la tecla `r` (de "renice") permite cambiar el valor nice de un proceso. Al presionarla, `top` solicita el PID del proceso y luego el nuevo valor nice. La tecla `k` se usa para matar (kill) un proceso. Las teclas `n` y `p` no tienen esta funcion en top (`N` ordena por PID y `P` ordena por CPU).
</details>

---

## Pregunta 7
Un administrador quiere ejecutar una compilacion pesada sin que afecte el rendimiento del servidor. Cual es el comando mas apropiado?

A) `nice make -j4`
B) `nice -n -20 make -j4`
C) `nice -n 19 make -j4`
D) `renice -n 19 make -j4`

<details>
<summary>Respuesta</summary>

**C) `nice -n 19 make -j4`**

`nice -n 19` inicia el proceso con la **minima prioridad posible** (nice 19), lo que significa que el proceso solo usara CPU cuando ningun otro proceso la necesite. Esto es ideal para tareas pesadas que no son urgentes. La opcion A (`nice make -j4`) usaria nice 10, que es menor prioridad pero no la minima. La opcion B usaria nice -20 (maxima prioridad), que es lo contrario de lo deseado. La opcion D es incorrecta porque `renice` cambia la prioridad de procesos ya en ejecucion, no inicia nuevos procesos.
</details>

---

## Pregunta 8
Cual de los siguientes comandos muestra el PID, valor nice, prioridad y nombre de todos los procesos del sistema?

A) `ps aux`
B) `ps -eo pid,ni,pri,comm`
C) `ps -ef`
D) `top -n 1`

<details>
<summary>Respuesta</summary>

**B) `ps -eo pid,ni,pri,comm`**

`ps -eo pid,ni,pri,comm` usa la opcion `-e` para seleccionar todos los procesos y `-o` para personalizar las columnas de salida: PID (identificador), NI (valor nice), PRI (prioridad del kernel) y COMM (nombre del comando). `ps aux` y `ps -ef` muestran muchas columnas pero **no incluyen nice ni prioridad** en su formato estandar. `top -n 1` mostraria una captura de los procesos con NI y PR, pero no es un comando `ps` y su formato no es tan limpio para esta consulta especifica.
</details>
