---
title: "106.3 - Ejercicios: Accesibilidad"
tags:
  - lpic-1
  - examen-102
  - tema-106
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "106"
subtema: "106.3"
---

# 106.3 - Ejercicios: Accesibilidad

## Ejercicio 1
Que es Orca y para que se utiliza? Que tecnologias subyacentes utiliza para funcionar?

<details>
<summary>Respuesta</summary>

**Orca** es el lector de pantalla principal para el escritorio Linux, especialmente integrado con GNOME. Se utiliza para que personas ciegas o con baja vision puedan interactuar con el sistema operativo.

Tecnologias subyacentes:
- **AT-SPI** (Assistive Technology Service Provider Interface): Framework que permite a Orca acceder a la informacion de las aplicaciones (que boton esta enfocado, que texto hay en pantalla, etc.)
- **Speech Dispatcher** (spd-say): Sistema de sintesis de voz que convierte el texto a voz audible
- Soporte para **salida Braille** (integrable con brltty)

Se inicia con el comando `orca` o con el atajo `Super + Alt + S` en muchas distribuciones. Se configura con `orca --setup`.
</details>

---

## Ejercicio 2
Cual es la diferencia entre brltty y Orca? En que contextos se usa cada uno?

<details>
<summary>Respuesta</summary>

**brltty:**
- Es un **daemon** que proporciona soporte para pantallas Braille
- Funciona en la **consola de texto** (tty), sin necesidad de entorno grafico (X11 o Wayland)
- Traduce el contenido de la consola a una pantalla Braille fisica conectada al equipo
- Se configura en `/etc/brltty.conf`
- Soporta mas de 50 modelos de pantallas Braille (conexion USB, serial, Bluetooth)

**Orca:**
- Es un **lector de pantalla** para el entorno grafico (GNOME principalmente)
- Lee en voz alta el contenido de las aplicaciones graficas
- Requiere un entorno de escritorio grafico para funcionar
- Puede integrarse con brltty para salida Braille en el escritorio grafico

**En resumen:** brltty funciona en la consola de texto (sin graficos), y Orca funciona en el escritorio grafico. Pueden complementarse: brltty para la consola y Orca para el escritorio, y ambos pueden trabajar juntos para proporcionar salida Braille en el escritorio.
</details>

---

## Ejercicio 3
Explica las cuatro funciones de accesibilidad del teclado (AccessX). Para cada una, describe el problema que resuelve y como funciona.

<details>
<summary>Respuesta</summary>

**1. Sticky Keys (Teclas pegajosas):**
- **Problema:** Usuarios que no pueden pulsar varias teclas simultaneamente (por ejemplo, Ctrl+C)
- **Solucion:** Al pulsar una tecla modificadora (Ctrl, Alt, Shift), esta se "pega" y espera la siguiente tecla. Se puede pulsar Ctrl, soltarlo, y luego pulsar C para obtener Ctrl+C

**2. Slow Keys (Teclas lentas):**
- **Problema:** Pulsaciones accidentales por temblores o falta de control motor fino
- **Solucion:** Una tecla solo se registra si se mantiene pulsada durante un tiempo minimo configurable (por ejemplo, 300ms). Las pulsaciones breves accidentales se ignoran

**3. Bounce Keys (Teclas de rebote):**
- **Problema:** Repeticiones involuntarias al soltar una tecla (el dedo "rebota" y la pulsa de nuevo)
- **Solucion:** Despues de pulsar una tecla, se establece un periodo de tiempo durante el cual una segunda pulsacion de la misma tecla se ignora. Evita las repeticiones no deseadas

**4. Mouse Keys (Teclas de raton):**
- **Problema:** Incapacidad de usar un raton fisico
- **Solucion:** Permite controlar el cursor del raton usando el teclado numerico. Las teclas 2, 4, 6, 8 mueven en las 4 direcciones principales; 1, 3, 7, 9 en diagonales; y 5 hace clic
</details>

---

## Ejercicio 4
Un usuario tiene temblores en las manos que le causan dos problemas: a veces pulsa teclas sin querer (pulsaciones muy breves) y a veces la misma tecla se registra dos veces cuando la suelta. Que funciones de accesibilidad le ayudarian con cada problema?

<details>
<summary>Respuesta</summary>

**Para las pulsaciones accidentales breves:** Se debe activar **Slow Keys** (teclas lentas). Esta funcion requiere que la tecla se mantenga pulsada durante un tiempo minimo (configurable, por ejemplo 300ms) antes de ser aceptada. Las pulsaciones breves involuntarias se filtran.

**Para las repeticiones al soltar la tecla:** Se debe activar **Bounce Keys** (teclas de rebote). Esta funcion establece un retardo entre pulsaciones de la misma tecla. Si la misma tecla se pulsa de nuevo dentro del periodo de retardo, la segunda pulsacion se ignora. Esto previene el efecto "rebote".

**Combinacion:** Ambas funciones pueden activarse simultaneamente para abordar ambos problemas. En GNOME se configuran desde Configuracion > Accesibilidad > Escritura, o desde la linea de comandos:
```bash
xkbset slowkeys 300    # Requiere 300ms de pulsacion minima
xkbset bouncekeys 300  # 300ms de retardo entre pulsaciones repetidas
```
</details>

---

## Ejercicio 5
Que es AccessX? Enumera todas las funciones que incluye y describe como se pueden activar desde la linea de comandos.

<details>
<summary>Respuesta</summary>

**AccessX** es el nombre del conjunto de funciones de accesibilidad del teclado implementadas en el servidor X11 (X Window System). Estas funciones estan disenadas para ayudar a usuarios con dificultades motoras.

**Funciones de AccessX:**
1. **Sticky Keys:** Teclas modificadoras se "pegan"
2. **Slow Keys:** Requiere pulsacion minima prolongada
3. **Bounce Keys:** Ignora repeticiones rapidas
4. **Mouse Keys:** Control del raton con teclado numerico

**Activacion desde la linea de comandos:**
```bash
# Activar sticky keys
xkbset sticky -twokey

# Activar slow keys con retardo de 300ms
xkbset slowkeys 300

# Activar bounce keys con retardo de 300ms
xkbset bouncekeys 300

# Activar mouse keys
xkbset mousekeys

# Consultar el estado de todas las funciones
xkbset q

# Desactivar una funcion (prefijo -)
xkbset -sticky
xkbset -slowkeys
```

Tambien se pueden configurar desde la interfaz grafica en GNOME (Configuracion > Accesibilidad) o KDE (Preferencias del sistema > Accesibilidad).
</details>

---

## Ejercicio 6
Que opciones de accesibilidad visual estan disponibles en Linux para usuarios con baja vision (no ciegos, pero con dificultad para ver)? Menciona al menos cuatro opciones diferentes.

<details>
<summary>Respuesta</summary>

Opciones de accesibilidad visual para baja vision:

1. **Temas de alto contraste:** Esquemas de colores con alto contraste entre texto y fondo (tipicamente texto claro sobre fondo oscuro o viceversa). Facilitan la lectura. Se activan desde la configuracion del entorno de escritorio.

2. **Fuentes de tamano grande:** Aumento del tamano base de todas las fuentes del sistema. Se puede configurar un factor de escala (1.25x, 1.5x, 2x). En GNOME: `gsettings set org.gnome.desktop.interface text-scaling-factor 1.5`.

3. **Lupa de pantalla (Screen Magnifier / Zoom):** Amplia una porcion de la pantalla. Puede seguir al cursor del raton o al foco del teclado. En GNOME esta integrada en la configuracion de accesibilidad. KMag es la alternativa de KDE.

4. **Cursor grande:** Aumento del tamano del cursor del raton para que sea mas visible. Configurable en las opciones de accesibilidad del entorno.

5. **Inversion de colores:** Invierte los colores de la pantalla (util para reducir el brillo).

6. **Orca en modo lupa:** Orca puede combinarse con la lupa para proporcionar ampliacion y lectura de voz simultaneamente.

Estas opciones pueden combinarse segun las necesidades del usuario. No requieren un lector de pantalla completo, a diferencia de los usuarios totalmente ciegos.
</details>
