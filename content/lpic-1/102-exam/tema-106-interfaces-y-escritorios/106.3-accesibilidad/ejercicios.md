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

### Pregunta 1

Que es Orca y que tecnologia subyacente utiliza para acceder a la informacion de las aplicaciones graficas?

a) Es un navegador web accesible que usa WebKit para renderizar paginas
b) Es el lector de pantalla principal de GNOME que usa AT-SPI para acceder a la informacion de las aplicaciones
c) Es un gestor de ventanas accesible que usa GTK+ para dibujar interfaces
d) Es un sintetizador de voz que usa ALSA para generar audio

<details><summary>Respuesta</summary>

**b) Es el lector de pantalla principal de GNOME que usa AT-SPI para acceder a la informacion de las aplicaciones**

**Orca** es el lector de pantalla principal para el escritorio Linux, especialmente integrado con GNOME. Utiliza **AT-SPI** (Assistive Technology Service Provider Interface) como framework para acceder a la informacion de las aplicaciones (que boton esta enfocado, que texto hay en pantalla, etc.). Tambien usa **Speech Dispatcher** (spd-say) para la sintesis de voz y puede integrarse con brltty para salida Braille. Se inicia con el comando `orca` o con el atajo `Super + Alt + S` en muchas distribuciones.

</details>

---

### Pregunta 2

Cual es la diferencia principal entre brltty y Orca?

a) brltty funciona en el escritorio grafico y Orca en la consola de texto
b) brltty proporciona soporte Braille en la consola de texto (sin graficos) y Orca es un lector de pantalla para el entorno grafico
c) brltty es un sintetizador de voz y Orca es un controlador de pantallas Braille
d) brltty funciona solo en KDE y Orca solo en GNOME

<details><summary>Respuesta</summary>

**b) brltty proporciona soporte Braille en la consola de texto (sin graficos) y Orca es un lector de pantalla para el entorno grafico**

**brltty** es un daemon que proporciona soporte para pantallas Braille en la consola de texto (tty), sin necesidad de entorno grafico. Traduce el contenido de la consola a una pantalla Braille fisica y se configura en `/etc/brltty.conf`. **Orca** es un lector de pantalla para el entorno grafico (GNOME principalmente) que lee en voz alta el contenido de las aplicaciones graficas. Ambos pueden complementarse: brltty para la consola y Orca para el escritorio, y pueden trabajar juntos para salida Braille en el escritorio grafico.

</details>

---

### Pregunta 3

Un usuario no puede pulsar varias teclas simultaneamente (por ejemplo, Ctrl+C). Que funcion de accesibilidad del teclado le ayudaria?

a) Slow Keys
b) Bounce Keys
c) Sticky Keys
d) Mouse Keys

<details><summary>Respuesta</summary>

**c) Sticky Keys**

**Sticky Keys** (teclas pegajosas) permite pulsar combinaciones de teclas una a la vez en lugar de simultaneamente. Al pulsar una tecla modificadora (Ctrl, Alt, Shift), esta se "pega" y espera a la siguiente tecla. El usuario puede pulsar Ctrl, soltarlo, y luego pulsar C para obtener Ctrl+C. Es ideal para personas que solo pueden pulsar una tecla a la vez. Se activa con `xkbset sticky -twokey` o desde la configuracion de accesibilidad del entorno de escritorio.

</details>

---

### Pregunta 4

Un usuario tiene temblores en las manos que causan pulsaciones accidentales muy breves en el teclado. Que funcion de accesibilidad resuelve este problema?

a) Sticky Keys
b) Slow Keys
c) Bounce Keys
d) Toggle Keys

<details><summary>Respuesta</summary>

**b) Slow Keys**

**Slow Keys** (teclas lentas) requiere que una tecla sea mantenida pulsada durante un tiempo minimo configurable (por ejemplo, 300ms) antes de ser aceptada por el sistema. Las pulsaciones breves accidentales se filtran e ignoran. Es util para usuarios con temblores u otras condiciones que causan pulsaciones no intencionadas. Se activa con `xkbset slowkeys 300`. **Bounce Keys** resuelve un problema diferente: repeticiones involuntarias al soltar una tecla (el dedo "rebota").

</details>

---

### Pregunta 5

Que funcion de accesibilidad ignora las repeticiones rapidas de la misma tecla causadas por el "rebote" del dedo al soltar una tecla?

a) Sticky Keys
b) Slow Keys
c) Bounce Keys
d) Mouse Keys

<details><summary>Respuesta</summary>

**c) Bounce Keys**

**Bounce Keys** (teclas de rebote) establece un retardo entre pulsaciones de la misma tecla. Si la misma tecla se pulsa de nuevo antes de que pase el retardo configurado, la segunda pulsacion se ignora. Esto previene las repeticiones involuntarias causadas cuando el dedo "rebota" accidentalmente al soltar una tecla. Se activa con `xkbset bouncekeys 300` (300ms de retardo). **Slow Keys** resuelve un problema diferente: pulsaciones accidentales breves. Ambas funciones pueden activarse simultaneamente.

</details>

---

### Pregunta 6

Que permite hacer la funcion Mouse Keys y como se controla el cursor?

a) Permite controlar el brillo del monitor con el teclado numerico
b) Permite controlar el cursor del raton usando el teclado numerico, donde las teclas 2/4/6/8 mueven en las 4 direcciones y la tecla 5 hace clic
c) Permite configurar los botones del raton desde la linea de comandos
d) Permite usar gestos del trackpad como alternativa al teclado

<details><summary>Respuesta</summary>

**b) Permite controlar el cursor del raton usando el teclado numerico, donde las teclas 2/4/6/8 mueven en las 4 direcciones y la tecla 5 hace clic**

**Mouse Keys** permite controlar el cursor del raton usando el teclado numerico cuando no se puede usar un raton fisico. Las teclas 2, 4, 6 y 8 mueven el cursor en las 4 direcciones principales (abajo, izquierda, derecha, arriba), las teclas 1, 3, 7 y 9 mueven en diagonales, y la tecla 5 funciona como clic. Se activa con `xkbset mousekeys` o desde la configuracion de accesibilidad del entorno de escritorio.

</details>

---

### Pregunta 7

Que es AccessX en el contexto de X11?

a) Una extension de X11 para acelerar el renderizado grafico
b) El nombre del conjunto de funciones de accesibilidad del teclado implementadas en X11
c) Un protocolo para compartir pantalla entre usuarios
d) Un driver de video para tarjetas graficas accesibles

<details><summary>Respuesta</summary>

**b) El nombre del conjunto de funciones de accesibilidad del teclado implementadas en X11**

**AccessX** es el nombre del conjunto de funciones de accesibilidad del teclado implementadas en el servidor X11. Incluye: Sticky Keys (teclas pegajosas), Slow Keys (teclas lentas), Bounce Keys (teclas de rebote), Mouse Keys (teclas de raton) y Toggle Keys (retroalimentacion audible). Estas funciones estan disenadas para ayudar a usuarios con dificultades motoras. Se pueden gestionar desde la linea de comandos con `xkbset` y consultar su estado con `xkbset q`.

</details>

---

### Pregunta 8

Que funcion de accesibilidad proporciona retroalimentacion audible al activar o desactivar Caps Lock, Num Lock o Scroll Lock?

a) Sticky Keys
b) Bounce Keys
c) Toggle Keys
d) Mouse Keys

<details><summary>Respuesta</summary>

**c) Toggle Keys**

**Toggle Keys** (teclas de alternancia) proporciona retroalimentacion audible (un pitido o sonido) al pulsar teclas de alternancia como Caps Lock, Num Lock y Scroll Lock. Emite un sonido al activar y otro diferente al desactivar. Es especialmente util para usuarios con discapacidad visual que no pueden ver los indicadores LED del teclado, evitando escribir accidentalmente texto con mayusculas sin darse cuenta. Se activa desde la configuracion de accesibilidad del entorno de escritorio.

</details>

---

### Pregunta 9

Que es eSpeak-NG y como se relaciona con Orca?

a) Es un gestor de ventanas accesible que reemplaza a Orca
b) Es un motor de sintesis de voz (TTS) compacto que puede ser usado como backend por Orca y Speech Dispatcher
c) Es un driver de pantalla Braille que compite con brltty
d) Es un teclado en pantalla que complementa a Orca

<details><summary>Respuesta</summary>

**b) Es un motor de sintesis de voz (TTS) compacto que puede ser usado como backend por Orca y Speech Dispatcher**

**eSpeak-NG** (Next Generation) es un motor de sintesis de voz (Text-to-Speech) compacto y de codigo abierto, sucesor de eSpeak. Genera voz a partir de texto, soporta multiples idiomas (incluido espanol) y tiene un tamano muy reducido comparado con otros motores TTS. Puede ser usado como backend por **Orca** y **Speech Dispatcher** para la lectura en voz alta del contenido de la pantalla. Se puede usar directamente con `espeak-ng "texto"` o especificar idioma con `-v es`.

</details>

---

### Pregunta 10

Que opciones de accesibilidad visual estan disponibles para usuarios con baja vision (no ciegos) en Linux?

a) Solo el lector de pantalla Orca, que funciona en modo reducido
b) Temas de alto contraste, fuentes de tamano grande, lupa de pantalla (zoom) y cursor grande
c) Unicamente la inversion de colores mediante la linea de comandos
d) Solo brltty configurado en modo visual

<details><summary>Respuesta</summary>

**b) Temas de alto contraste, fuentes de tamano grande, lupa de pantalla (zoom) y cursor grande**

Linux ofrece varias opciones de accesibilidad visual para usuarios con baja vision: **temas de alto contraste** (esquemas de colores con alto contraste entre texto y fondo), **fuentes de tamano grande** (configurables con factor de escala, por ejemplo `gsettings set org.gnome.desktop.interface text-scaling-factor 1.5`), **lupa de pantalla** (zoom integrado en GNOME o KMag en KDE), **cursor grande** y **inversion de colores**. Estas opciones no requieren un lector de pantalla completo y pueden combinarse segun las necesidades del usuario.

</details>
