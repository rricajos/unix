# 106.3 - Teoria: Accesibilidad

## 1. Introduccion a la accesibilidad en Linux

La accesibilidad (a11y - accessibility) en Linux se refiere al conjunto de tecnologias y configuraciones que permiten a personas con discapacidades utilizar el sistema operativo. Linux ofrece diversas herramientas para usuarios con discapacidades visuales, auditivas, motoras y cognitivas.

Las principales areas de accesibilidad son:
- **Visual:** Lectores de pantalla, lupa, alto contraste, fuentes grandes
- **Motora:** Modificaciones de teclado (sticky keys, slow keys, etc.), teclado en pantalla
- **Braille:** Soporte para pantallas Braille

---

## 2. Tecnologias de asistencia visual

### Orca - Lector de pantalla
**Orca** es el principal lector de pantalla para el escritorio Linux (especialmente GNOME).

- Lee en voz alta el contenido de la pantalla
- Usa el framework **AT-SPI** (Assistive Technology Service Provider Interface) para acceder a la informacion de las aplicaciones
- Soporta salida de voz mediante **Speech Dispatcher** (spd-say)
- Soporta salida Braille
- Integrado en GNOME; se activa con `Super + Alt + S` en muchas distribuciones
- Configurable para ajustar velocidad de voz, volumen y verbosidad

```bash
# Iniciar Orca
orca

# Configurar Orca
orca --setup
orca -s
```

**Funcionalidades de Orca:**
- Lectura de texto en pantalla
- Navegacion por elementos de la interfaz
- Soporte para tablas y formularios web
- Integracion con pantallas Braille
- Modos de navegacion plana y estructurada

### Lupa de pantalla (Screen Magnifier)
Herramienta que amplifica una porcion de la pantalla para usuarios con baja vision.

- **GNOME:** Integrada en la configuracion de accesibilidad (Configuracion > Accesibilidad > Zoom)
- **KMag:** Lupa de pantalla de KDE
- Permite configurar el nivel de zoom y el area ampliada
- Puede seguir al cursor del raton o al foco del teclado

### Temas de alto contraste
- Proporcionan esquemas de colores con alto contraste (tipicamente texto blanco o amarillo sobre fondo negro)
- Facilitan la lectura para usuarios con baja vision
- Disponibles en la configuracion de accesibilidad del entorno de escritorio
- **GNOME:** Configuracion > Accesibilidad > Alto contraste
- Tambien se pueden configurar fuentes de tamano grande

### Tamano de fuente grande
- Los entornos de escritorio permiten aumentar el tamano de las fuentes del sistema
- Factor de escala del texto (por ejemplo, 1.25x, 1.5x)
- Importante para usuarios con baja vision que no necesitan un lector de pantalla completo

---

## 3. Soporte Braille

### brltty - Braille TTY
**brltty** es el daemon que proporciona soporte para pantallas Braille en la consola de texto (tty) de Linux.

- Permite a usuarios ciegos leer la consola de texto mediante una pantalla Braille
- Funciona en la consola de texto (fuera del entorno grafico)
- Soporta multiples modelos de pantallas Braille (USB, serial, Bluetooth)
- Se integra con Orca para soporte Braille en el escritorio grafico

```bash
# brltty se ejecuta como daemon/servicio
systemctl status brltty
systemctl enable brltty

# Archivo de configuracion
/etc/brltty.conf
```

**Caracteristicas de brltty:**
- Soporte para mas de 50 modelos de pantallas Braille
- Funciona en consola (sin necesidad de X11)
- Puede integrarse con lectores de pantalla graficos (Orca)
- Soporta Braille de 6 y 8 puntos

---

## 4. Teclado en pantalla

### GOK (GNOME Onscreen Keyboard)
**GOK** era el teclado en pantalla original de GNOME (actualmente descontinuado y reemplazado por otros).

- Permitia escribir sin teclado fisico, usando solo el raton
- Util para usuarios con movilidad reducida
- Mostraba un teclado virtual en pantalla

En sistemas GNOME modernos, el teclado en pantalla esta integrado en GNOME Shell (se activa desde Configuracion > Accesibilidad > Teclado en pantalla). Otras alternativas incluyen **Onboard** y **Florence**.

---

## 5. Configuraciones de accesibilidad del teclado (AccessX)

**AccessX** es el conjunto de funciones de accesibilidad del teclado implementadas en X11. Estas funciones ayudan a usuarios con dificultades motoras.

### Sticky Keys (Teclas pegajosas)
- Permite pulsar combinaciones de teclas (como Ctrl+C) **una tecla a la vez** en lugar de simultaneamente
- Al pulsar una tecla modificadora (Ctrl, Alt, Shift), esta se "pega" y espera a que se pulse la siguiente tecla
- Ideal para usuarios que solo pueden pulsar una tecla a la vez
- Ejemplo: En lugar de pulsar Ctrl+C a la vez, se pulsa Ctrl (se queda activa) y luego C

### Slow Keys (Teclas lentas)
- Requiere que una tecla sea **mantenida pulsada durante un tiempo minimo** antes de ser aceptada
- Filtra pulsaciones accidentales o involuntarias
- Util para usuarios con temblores u otras condiciones que causan pulsaciones no intencionadas
- Se configura el tiempo minimo de pulsacion (retardo)

### Bounce Keys (Teclas de rebote)
- Establece un **retardo entre pulsaciones** de la misma tecla
- Si la misma tecla se pulsa de nuevo antes de que pase el retardo, la segunda pulsacion se ignora
- Evita repeticiones involuntarias de teclas
- Util para usuarios que "rebotan" accidentalmente las teclas al escribir
- Tambien conocida como "debounce"

### Mouse Keys (Teclas de raton)
- Permite controlar el **cursor del raton usando el teclado numerico**
- Las teclas del numpad mueven el cursor en las 8 direcciones
- La tecla 5 del numpad funciona como clic
- Util cuando no se puede usar un raton fisico

**Disposicion del teclado numerico como raton:**
```
7 = Arriba-izquierda   8 = Arriba    9 = Arriba-derecha
4 = Izquierda          5 = Clic      6 = Derecha
1 = Abajo-izquierda    2 = Abajo     3 = Abajo-derecha
```

### Resumen de funciones AccessX

| Funcion | Problema que resuelve | Comportamiento |
|---------|----------------------|----------------|
| Sticky Keys | No poder pulsar varias teclas a la vez | Modificadores se "pegan" temporalmente |
| Slow Keys | Pulsaciones accidentales | Requiere mantener la tecla un tiempo minimo |
| Bounce Keys | Repeticiones involuntarias | Ignora pulsaciones rapidas repetidas |
| Mouse Keys | No poder usar el raton | Controlar raton con teclado numerico |

---

## 6. Activacion de las funciones de accesibilidad

### En GNOME
- Configuracion > Accesibilidad (o Universal Access)
- Opciones: Alto contraste, tamano de texto, zoom, lector de pantalla, teclado en pantalla
- Sticky keys, slow keys y mouse keys en la seccion de teclado

### En KDE Plasma
- Preferencias del sistema > Accesibilidad
- Opciones similares a GNOME

### Desde la linea de comandos
```bash
# Activar sticky keys con xkbset
xkbset sticky -twokey

# Activar slow keys
xkbset slowkeys 300    # 300ms de retardo

# Activar bounce keys
xkbset bouncekeys 300

# Activar mouse keys
xkbset mousekeys

# Ver estado de AccessX
xkbset q
```

### Configuracion con gsettings (GNOME)
```bash
# Activar sticky keys
gsettings set org.gnome.desktop.a11y.keyboard stickykeys-enable true

# Activar lector de pantalla
gsettings set org.gnome.desktop.a11y.applications screen-reader-enabled true

# Alto contraste
gsettings set org.gnome.desktop.interface gtk-theme 'HighContrast'
```

---

## Resumen para el examen

1. **Orca** es el lector de pantalla principal de GNOME (usa AT-SPI y Speech Dispatcher)
2. **brltty** proporciona soporte Braille en la consola de texto (daemon)
3. **GOK** era el teclado en pantalla de GNOME (ahora integrado/reemplazado)
4. **Sticky Keys:** Pulsar combinaciones de teclas una a la vez
5. **Slow Keys:** Requiere mantener pulsada la tecla un tiempo minimo
6. **Bounce Keys:** Ignora repeticiones rapidas de la misma tecla
7. **Mouse Keys:** Controlar el raton con el teclado numerico
8. **AccessX** es el nombre del conjunto de funciones de accesibilidad del teclado en X11
9. El alto contraste y las fuentes grandes son configuraciones basicas de accesibilidad visual
