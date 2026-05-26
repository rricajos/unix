---
title: "106.3 - Comandos clave: Accesibilidad"
tags:
  - lpic-1
  - examen-102
  - tema-106
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "106"
subtema: "106.3"
---

# 106.3 - Comandos clave: Accesibilidad

## Herramientas de asistencia

| Herramienta | Funcion | Tipo |
|-------------|---------|------|
| **Orca** | Lector de pantalla | Visual (ceguera/baja vision) |
| **brltty** | Soporte pantalla Braille | Visual (ceguera) |
| **GOK** | Teclado en pantalla (GNOME) | Motora |
| **Lupa/Zoom** | Ampliacion de pantalla | Visual (baja vision) |
| **Alto contraste** | Temas de alto contraste | Visual (baja vision) |

## Orca - Lector de pantalla

| Comando | Descripcion |
|---------|-------------|
| `orca` | Iniciar Orca |
| `orca --setup` / `orca -s` | Configurar Orca |
| `Super + Alt + S` | Atajo comun para activar/desactivar Orca |

- Usa **AT-SPI** (Assistive Technology Service Provider Interface)
- Usa **Speech Dispatcher** para la salida de voz
- Integrado en GNOME

## brltty - Soporte Braille

| Comando/Archivo | Descripcion |
|-----------------|-------------|
| `brltty` | Daemon de soporte Braille |
| `/etc/brltty.conf` | Archivo de configuracion |
| `systemctl status brltty` | Ver estado del servicio |
| `systemctl enable brltty` | Habilitar al inicio |

- Funciona en consola de texto (tty), no requiere X11
- Soporta mas de 50 modelos de pantallas Braille
- Se integra con Orca para escritorio grafico

## Funciones AccessX del teclado

| Funcion | Problema que resuelve | Efecto |
|---------|----------------------|--------|
| **Sticky Keys** | No poder pulsar teclas simultaneamente | Modificadores (Ctrl, Alt, Shift) se "pegan" |
| **Slow Keys** | Pulsaciones accidentales | Requiere mantener tecla un tiempo minimo |
| **Bounce Keys** | Repeticiones involuntarias de tecla | Ignora pulsaciones rapidas repetidas |
| **Mouse Keys** | No poder usar raton | Controla cursor con teclado numerico |

## Mouse Keys - Mapa del teclado numerico

| Tecla | Movimiento |
|-------|------------|
| 7 | Arriba-izquierda |
| 8 | Arriba |
| 9 | Arriba-derecha |
| 4 | Izquierda |
| **5** | **Clic** |
| 6 | Derecha |
| 1 | Abajo-izquierda |
| 2 | Abajo |
| 3 | Abajo-derecha |

## Configuracion por linea de comandos

| Comando | Descripcion |
|---------|-------------|
| `xkbset sticky` | Activar sticky keys |
| `xkbset slowkeys 300` | Activar slow keys (300ms retardo) |
| `xkbset bouncekeys 300` | Activar bounce keys (300ms retardo) |
| `xkbset mousekeys` | Activar mouse keys |
| `xkbset q` | Ver estado de AccessX |

## Configuracion en GNOME (gsettings)

| Comando | Descripcion |
|---------|-------------|
| `gsettings set org.gnome.desktop.a11y.keyboard stickykeys-enable true` | Activar sticky keys |
| `gsettings set org.gnome.desktop.a11y.applications screen-reader-enabled true` | Activar lector de pantalla |
| `gsettings set org.gnome.desktop.interface gtk-theme 'HighContrast'` | Tema alto contraste |
| `gsettings set org.gnome.desktop.interface text-scaling-factor 1.5` | Ampliar texto 150% |

## Accesibilidad visual

| Configuracion | Descripcion |
|---------------|-------------|
| Alto contraste | Temas con colores contrastantes (texto claro sobre fondo oscuro) |
| Fuente grande | Aumento del tamano base de las fuentes del sistema |
| Lupa/Zoom | Ampliacion de una zona de la pantalla |
| Cursor grande | Aumento del tamano del cursor del raton |
