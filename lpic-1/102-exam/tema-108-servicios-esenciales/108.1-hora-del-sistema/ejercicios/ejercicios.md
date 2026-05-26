# 108.1 Mantener la hora del sistema - Ejercicios

## Ejercicio 1
¿Cual es la diferencia entre el reloj hardware (RTC) y el reloj del sistema en Linux?

<details><summary>Respuesta</summary>

El **reloj hardware (RTC/CMOS)** es un chip fisico en la placa base alimentado por una pila que mantiene la hora incluso con el equipo apagado. El **reloj del sistema** es mantenido por el kernel en memoria, se inicializa al arrancar tomando la hora del RTC y puede sincronizarse via NTP. El reloj del sistema es mas preciso durante la ejecucion pero se pierde al apagar.

</details>

## Ejercicio 2
¿Que comando usarias para copiar la hora del sistema al reloj hardware? ¿Y para hacer lo contrario?

<details><summary>Respuesta</summary>

- Copiar hora del sistema al hardware: `hwclock --systohc`
- Copiar hora del hardware al sistema: `hwclock --hctosys`

Regla mnemotecnica: **systohc** = System TO Hardware Clock, **hctosys** = Hardware Clock TO System.

</details>

## Ejercicio 3
Escribe el comando para mostrar la fecha actual en formato `AAAA-MM-DD HH:MM:SS`.

<details><summary>Respuesta</summary>

```bash
date "+%Y-%m-%d %H:%M:%S"
```

Producira una salida como: `2024-01-15 14:30:45`

</details>

## Ejercicio 4
¿Que archivo determina si el reloj hardware esta configurado en UTC o en hora local? ¿Que linea contiene esta informacion?

<details><summary>Respuesta</summary>

El archivo es **`/etc/adjtime`**. La tercera linea contiene `UTC` o `LOCAL` indicando el modo del reloj hardware. Ejemplo:

```
0.000000 1705312245 0.000000
1705312245
UTC
```

</details>

## Ejercicio 5
Usando `timedatectl`, ¿como activarias la sincronizacion NTP y como cambiarias la zona horaria a America/Mexico_City?

<details><summary>Respuesta</summary>

```bash
timedatectl set-ntp true
timedatectl set-timezone America/Mexico_City
```

Nota: `set-ntp true` activa el servicio `systemd-timesyncd`, no ntpd.

</details>

## Ejercicio 6
En la salida de `ntpq -p`, ¿que significan los simbolos `*`, `+` y `-` al lado de los servidores? ¿Que indica el campo `reach` con valor 377?

<details><summary>Respuesta</summary>

- `*` = Servidor seleccionado actualmente como fuente de sincronizacion
- `+` = Candidato aceptable que podria ser seleccionado
- `-` = Servidor descartado por el algoritmo de seleccion

El campo `reach` con valor **377** (en octal) indica que las **ultimas 8 consultas** al servidor fueron exitosas. Es el valor maximo posible (11111111 en binario).

</details>

## Ejercicio 7
¿Cual es la diferencia principal entre ntpd, chrony y systemd-timesyncd?

<details><summary>Respuesta</summary>

- **ntpd**: Implementacion clasica completa de NTP. Puede actuar como cliente y servidor. Ideal para servidores permanentes.
- **chrony**: Alternativa moderna. Sincroniza mas rapido, ideal para VMs y equipos con conexion intermitente. Puede ser cliente y servidor.
- **systemd-timesyncd**: Cliente NTP ligero integrado en systemd. **Solo puede actuar como cliente**, no como servidor. Es la opcion mas simple.

</details>

## Ejercicio 8
¿Que puerto utiliza NTP? ¿Que protocolo de transporte usa? ¿Que es el sistema de estratos y cual es el estrato maximo valido?

<details><summary>Respuesta</summary>

- NTP usa el puerto **UDP 123**
- Usa el protocolo de transporte **UDP**
- El sistema de estratos define la jerarquia de servidores:
  - **Estrato 0**: Relojes atomicos, GPS (fuentes de referencia, no accesibles por red)
  - **Estrato 1**: Servidores conectados directamente a estrato 0
  - **Estrato 2-15**: Cada nivel se sincroniza con el anterior
  - **Estrato 16**: No sincronizado (invalido)
- El estrato maximo valido es **15**

</details>
