---
title: "106.1 - Ejercicios: Instalar y configurar X11"
tags:
  - lpic-1
  - examen-102
  - tema-106
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "106"
subtema: "106.1"
---

# 106.1 - Ejercicios: Instalar y configurar X11

## Ejercicio 1
En la arquitectura de X11, donde se ejecuta el servidor X y donde se ejecutan los clientes X? Que papel juega cada uno?

<details>
<summary>Respuesta</summary>

En X11, la terminologia es contraintuitiva:

- **Servidor X:** Se ejecuta en la maquina **local**, donde estan la pantalla, el teclado y el raton. Su funcion es gestionar el hardware grafico, dibujar en pantalla y recibir la entrada del usuario.

- **Clientes X:** Son las **aplicaciones graficas** (firefox, xterm, gimp, etc.). Pueden ejecutarse en la misma maquina local o en una maquina remota. Envian solicitudes de dibujo al servidor X y reciben eventos de entrada.

La comunicacion entre cliente y servidor se realiza mediante el protocolo X11, que puede funcionar a traves de la red. Esto permite ejecutar una aplicacion en un servidor remoto y ver su ventana en la pantalla local.
</details>

---

## Ejercicio 2
Explica que significa cada uno de estos valores de la variable DISPLAY:
- `DISPLAY=:0`
- `DISPLAY=:0.0`
- `DISPLAY=192.168.1.50:0`
- `DISPLAY=localhost:10.0`

<details>
<summary>Respuesta</summary>

El formato de DISPLAY es `[host]:display[.screen]`:

- **`:0`** - Display local numero 0. El host vacio indica la maquina local. Es el valor mas comun en estaciones de trabajo con un solo servidor X.

- **`:0.0`** - Display local 0, pantalla 0. Equivalente a `:0` cuando solo hay una pantalla. El `.0` especifica la pantalla dentro del display.

- **`192.168.1.50:0`** - Display 0 en el host remoto `192.168.1.50`. La aplicacion cliente enviara su salida grafica al servidor X que se ejecuta en esa IP.

- **`localhost:10.0`** - Display 10 en localhost, pantalla 0. Este es el valor tipico cuando se usa **SSH X forwarding**. El offset 10 viene de la directiva `X11DisplayOffset 10` en la configuracion de SSH. SSH tuneliza la conexion X11 a traves del canal seguro SSH.
</details>

---

## Ejercicio 3
Que diferencia hay entre `xhost` y `xauth` como metodos de control de acceso al servidor X? Cual es mas seguro y por que?

<details>
<summary>Respuesta</summary>

**xhost (control basado en host):**
- Permite o deniega acceso basandose en el **nombre de host o IP**
- Si se permite un host, CUALQUIER usuario de ese host puede acceder al servidor X
- `xhost +` desactiva toda verificacion (cualquiera puede conectarse)
- Es simple pero **inseguro**: no diferencia entre usuarios del mismo host

**xauth (control basado en cookies MIT-MAGIC-COOKIE):**
- Usa un token de autenticacion (cookie) almacenado en `~/.Xauthority`
- Solo quien posea la cookie correcta puede conectarse al servidor X
- Cada sesion genera una cookie unica
- Es el metodo usado por defecto en la mayoria de sistemas modernos
- Es **mas seguro** porque la autenticacion es por sesion y usuario, no por host

**xauth es mas seguro** porque requiere que el cliente presente un token secreto, mientras que xhost solo verifica la direccion del host, lo cual puede ser falsificado y no distingue entre usuarios.
</details>

---

## Ejercicio 4
Nombra las secciones principales del archivo `/etc/X11/xorg.conf` y describe brevemente que configura cada una. Que seccion vincula un monitor con una tarjeta grafica?

<details>
<summary>Respuesta</summary>

Las secciones principales de `xorg.conf` son:

| Seccion | Configura |
|---------|-----------|
| **ServerLayout** | Configuracion global: vincula las pantallas (Screen) con los dispositivos de entrada (InputDevice) |
| **InputDevice** | Dispositivos de entrada: teclado (driver kbd, layout) y raton (driver mouse, protocolo) |
| **Monitor** | Caracteristicas del monitor: frecuencias horizontal/vertical, modelo |
| **Device** | Tarjeta grafica (GPU): driver (intel, nvidia, amdgpu), BusID PCI |
| **Screen** | **Vincula un Monitor con un Device** (tarjeta grafica). Define profundidad de color y resoluciones disponibles |

La seccion **Screen** es la que vincula un monitor con una tarjeta grafica, referenciando ambos por su `Identifier`.

En sistemas modernos, Xorg puede funcionar sin `xorg.conf` (autodeteccion) y se prefiere usar archivos parciales en `/etc/X11/xorg.conf.d/`.
</details>

---

## Ejercicio 5
Que es un Display Manager? Nombra los cuatro principales mencionados en el examen LPIC-1 y asocia cada uno con su entorno de escritorio correspondiente.

<details>
<summary>Respuesta</summary>

Un **Display Manager** (DM) es el programa que proporciona la pantalla de inicio de sesion grafico (login screen). Inicia el servidor X (o Wayland), autentica al usuario y lanza la sesion de escritorio seleccionada.

| Display Manager | Entorno asociado | Descripcion |
|----------------|-------------------|-------------|
| **GDM** (GNOME Display Manager) | GNOME | Completo, soporta Wayland, es el DM por defecto de GNOME |
| **SDDM** (Simple Desktop Display Manager) | KDE Plasma | Moderno, basado en QML, DM por defecto de KDE |
| **LightDM** | Independiente | Ligero y flexible, soporta diferentes interfaces (greeters), muy usado en Xfce, MATE |
| **XDM** (X Display Manager) | Ninguno (basico) | El original, muy simple, sin dependencias de escritorio |

Para cambiar el DM en sistemas systemd: `systemctl enable --now lightdm` (despues de deshabilitar el anterior). En Debian/Ubuntu: `dpkg-reconfigure lightdm`.
</details>

---

## Ejercicio 6
Como se configura el reenvio de X11 (X forwarding) a traves de SSH? Que diferencia hay entre `ssh -X` y `ssh -Y`? Que configuracion se necesita en el servidor?

<details>
<summary>Respuesta</summary>

**Configuracion en el servidor SSH** (`/etc/ssh/sshd_config`):
```
X11Forwarding yes
X11DisplayOffset 10
```

**Uso desde el cliente:**
```bash
ssh -X usuario@servidor    # X forwarding con restricciones
ssh -Y usuario@servidor    # X forwarding confiable
```

**Diferencia entre -X y -Y:**
- **`-X` (Untrusted):** Habilita X forwarding con la extension X11 SECURITY, que restringe lo que la aplicacion remota puede hacer (por ejemplo, no puede capturar el teclado de otras ventanas). Es mas seguro pero algunas aplicaciones complejas pueden no funcionar.
- **`-Y` (Trusted):** Habilita X forwarding sin restricciones de seguridad. La aplicacion remota tiene acceso completo al servidor X local. Necesario para aplicaciones que requieren funciones avanzadas de X11.

Una vez conectado, SSH configura automaticamente la variable `DISPLAY` (generalmente a `localhost:10.0`) y gestiona las cookies de `xauth` automaticamente.
</details>

---

## Ejercicio 7
Que es Wayland y en que se diferencia de X11? Que es XWayland? Como puedes verificar si tu sesion actual usa Wayland o X11?

<details>
<summary>Respuesta</summary>

**Wayland** es un protocolo de display moderno que busca reemplazar a X11. Sus principales diferencias:

| Aspecto | X11 | Wayland |
|---------|-----|---------|
| Arquitectura | Servidor y compositor separados | Compositor integrado (servidor + gestor de ventanas) |
| Seguridad | Los clientes pueden acceder a otras ventanas | Aislamiento entre clientes |
| Rendimiento | Overhead por protocolo de red | Comunicacion directa, menos latencia |
| Transparencia de red | Nativa | No nativa (requiere pipewire, VNC u otras soluciones) |

**XWayland** es una capa de compatibilidad que ejecuta un servidor X11 dentro de Wayland, permitiendo que aplicaciones X11 antiguas funcionen en sesiones Wayland.

**Como verificar la sesion:**
```bash
echo $XDG_SESSION_TYPE     # Muestra "wayland" o "x11"
echo $WAYLAND_DISPLAY      # Si tiene valor (ej: wayland-0), se usa Wayland
```
</details>
