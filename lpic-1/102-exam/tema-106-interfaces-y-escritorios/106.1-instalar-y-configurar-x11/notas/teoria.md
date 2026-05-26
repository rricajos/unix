# 106.1 - Teoria: Instalar y configurar X11

## 1. X Window System (X11 / Xorg)

### Que es X11
El **X Window System** (tambien llamado X11 o simplemente X) es el sistema grafico estandar en sistemas Unix/Linux. Proporciona el framework basico para dibujar y mover ventanas en pantalla y para interactuar con raton y teclado.

- **X11** es la version 11 del protocolo X (la mas usada desde 1987)
- **Xorg** (X.Org Server) es la implementacion mas comun del servidor X en Linux
- X11 proporciona la infraestructura, pero NO la apariencia visual (eso lo hacen los gestores de ventanas y entornos de escritorio)

### Arquitectura cliente-servidor

X11 utiliza una arquitectura **cliente-servidor**, pero con una particularidad: el **servidor** esta en la maquina local (donde esta la pantalla) y los **clientes** son las aplicaciones.

```
+-------------------+         +-------------------+
|  Cliente X        |  <--->  |  Servidor X       |
|  (aplicacion)     |   Red   |  (donde esta la   |
|  Ej: firefox,     |         |   pantalla, raton, |
|  xterm, gimp      |         |   teclado)         |
+-------------------+         +-------------------+
```

**Conceptos clave:**
- **Servidor X:** Gestiona la pantalla, teclado y raton. Se ejecuta en la maquina donde se muestra la interfaz grafica.
- **Cliente X:** Cualquier aplicacion grafica (firefox, xterm, etc.). Puede ejecutarse en la misma maquina o en una remota.
- La comunicacion se realiza a traves del **protocolo X11**, que puede funcionar por red.

Esta arquitectura permite ejecutar aplicaciones graficas en un servidor remoto y verlas en la pantalla local.

---

## 2. Variable DISPLAY

La variable `DISPLAY` indica al cliente X donde debe enviar su salida grafica.

### Formato
```
DISPLAY=[host]:display[.screen]
```

| Componente | Descripcion |
|-----------|-------------|
| `host` | Nombre o IP del servidor X. Vacio = localhost |
| `display` | Numero de display (generalmente 0) |
| `screen` | Numero de pantalla (generalmente 0, opcional) |

### Ejemplos
```bash
DISPLAY=:0           # Display local 0 (lo mas comun)
DISPLAY=:0.0         # Display local 0, pantalla 0
DISPLAY=:1           # Display local 1 (segundo servidor X)
DISPLAY=192.168.1.10:0    # Servidor X remoto en 192.168.1.10
DISPLAY=localhost:10.0    # Tipico de SSH X forwarding
```

### Uso practico
```bash
# Ver el DISPLAY actual
echo $DISPLAY

# Ejecutar aplicacion en otro display
DISPLAY=:0 firefox &

# Exportar para que todos los programas lo usen
export DISPLAY=:0
```

---

## 3. Control de acceso: xhost y xauth

### xhost - Control basado en host
`xhost` controla que maquinas pueden conectarse al servidor X. Es un metodo simple pero **inseguro** (permite/deniega por host completo).

```bash
# Ver estado actual
xhost

# Permitir acceso desde cualquier host (MUY INSEGURO)
xhost +

# Denegar acceso desde todos los hosts
xhost -

# Permitir acceso desde un host especifico
xhost +192.168.1.10
xhost +miservidor.dominio.com

# Revocar acceso de un host
xhost -192.168.1.10

# Permitir acceso a un usuario local
xhost +si:localuser:sandra
```

**IMPORTANTE para el examen:** `xhost +` desactiva toda verificacion de acceso, lo cual es un riesgo de seguridad significativo.

### xauth - Control basado en cookies (MIT-MAGIC-COOKIE)
`xauth` es un metodo mas seguro que usa "cookies" de autenticacion almacenadas en `~/.Xauthority`.

```bash
# Ver las cookies actuales
xauth list

# Agregar una cookie
xauth add :0 MIT-MAGIC-COOKIE-1 <hex-cookie>

# Generar y transferir cookie a otro host
xauth extract - :0 | ssh usuario@host xauth merge -

# Informacion del archivo de autoridad
echo $XAUTHORITY     # Normalmente ~/.Xauthority
```

**`~/.Xauthority`:** Archivo binario que almacena las cookies de autenticacion X. Cada sesion grafica genera una cookie unica que el cliente debe presentar para conectarse al servidor X.

---

## 4. Archivo de configuracion: /etc/X11/xorg.conf

### Estructura general
El archivo `xorg.conf` esta organizado en **secciones**. Cada seccion define un aspecto del servidor X.

**Nota:** En sistemas modernos, Xorg puede funcionar sin este archivo (autodeteccion). Los fragmentos de configuracion se colocan en `/etc/X11/xorg.conf.d/*.conf`.

### Secciones principales

#### InputDevice - Dispositivos de entrada
```
Section "InputDevice"
    Identifier  "Keyboard0"
    Driver      "kbd"
    Option      "XkbLayout" "es"
EndSection

Section "InputDevice"
    Identifier  "Mouse0"
    Driver      "mouse"
    Option      "Protocol" "auto"
    Option      "Device" "/dev/input/mice"
EndSection
```

#### Monitor - Configuracion del monitor
```
Section "Monitor"
    Identifier  "Monitor0"
    VendorName  "Samsung"
    ModelName   "SyncMaster"
    HorizSync   30-83
    VertRefresh 50-75
EndSection
```

#### Device - Tarjeta grafica (GPU)
```
Section "Device"
    Identifier  "VideoCard0"
    Driver      "intel"
    VendorName  "Intel"
    BusID       "PCI:0:2:0"
EndSection
```

#### Screen - Vincula Monitor + Device
```
Section "Screen"
    Identifier  "Screen0"
    Device      "VideoCard0"
    Monitor     "Monitor0"
    DefaultDepth 24
    SubSection "Display"
        Depth   24
        Modes   "1920x1080" "1280x1024"
    EndSubSection
EndSection
```

#### ServerLayout - Configuracion global
```
Section "ServerLayout"
    Identifier  "Layout0"
    Screen      "Screen0"
    InputDevice "Keyboard0" "CoreKeyboard"
    InputDevice "Mouse0"    "CorePointer"
EndSection
```

### Directorio /etc/X11/xorg.conf.d/
En sistemas modernos, se prefieren archivos de configuracion parciales en este directorio:
```
/etc/X11/xorg.conf.d/10-keyboard.conf
/etc/X11/xorg.conf.d/20-monitor.conf
/etc/X11/xorg.conf.d/50-nvidia.conf
```
Los archivos se procesan en orden numerico.

---

## 5. Utilidades de informacion

### xdpyinfo - Informacion del display
```bash
# Muestra informacion detallada del servidor X
xdpyinfo

# Informacion que muestra:
# - Nombre del display
# - Numero de pantallas
# - Resoluciones disponibles
# - Profundidad de color
# - Extensiones soportadas
```

### xwininfo - Informacion de ventanas
```bash
# Clic en una ventana para obtener informacion
xwininfo

# Informacion de la ventana raiz
xwininfo -root

# Muestra:
# - ID de la ventana
# - Posicion y tamano
# - Profundidad de color
# - Estado del mapa (mapeada/no mapeada)
```

---

## 6. Display Managers (gestores de inicio de sesion)

Un **Display Manager** (DM) proporciona la pantalla de inicio de sesion grafico (login screen). Inicia el servidor X y autentica al usuario.

| Display Manager | Entorno asociado | Notas |
|----------------|-------------------|-------|
| **GDM** (GNOME Display Manager) | GNOME | El mas completo, soporta Wayland |
| **SDDM** (Simple Desktop Display Manager) | KDE Plasma | Moderno, basado en QML |
| **LightDM** | Independiente | Ligero, soporta multiples interfaces (greeters) |
| **XDM** (X Display Manager) | Ninguno | El original, muy basico |

### Configuracion del Display Manager
```bash
# En sistemas systemd, el DM es un servicio
systemctl status gdm
systemctl enable lightdm
systemctl disable gdm

# Debian/Ubuntu: configurar DM por defecto
sudo dpkg-reconfigure lightdm

# Archivo de configuracion de LightDM
/etc/lightdm/lightdm.conf
```

### XDMCP (X Display Manager Control Protocol)
Protocolo que permite a un display manager gestionar sesiones X remotas. Un thin client puede conectarse al servidor XDMCP para obtener una pantalla de login remota.

---

## 7. Wayland

**Wayland** es un protocolo de display mas moderno que busca reemplazar a X11.

### Diferencias principales con X11

| Aspecto | X11 | Wayland |
|---------|-----|---------|
| Arquitectura | Cliente-servidor separados | Compositor integrado |
| Seguridad | Clientes pueden espiar a otros | Aislamiento entre clientes |
| Rendimiento | Overhead por protocolo de red | Comunicacion directa con hardware |
| Compatibilidad | Amplia, decades de soporte | En crecimiento, usa XWayland para apps X11 |
| Red transparente | Si (nativo) | No (requiere soluciones adicionales) |

### Conceptos clave de Wayland
- **Compositor:** En Wayland, el servidor y el gestor de ventanas son lo mismo (el compositor)
- **XWayland:** Capa de compatibilidad que permite ejecutar aplicaciones X11 dentro de Wayland
- **Compositors:** Mutter (GNOME), KWin (KDE), Sway (i3 compatible)

### Como saber si se usa Wayland o X11
```bash
echo $XDG_SESSION_TYPE     # wayland o x11
echo $WAYLAND_DISPLAY      # Si existe, se usa Wayland
```

---

## 8. X Forwarding con SSH

Permite ejecutar aplicaciones graficas en un servidor remoto y verlas en la pantalla local.

```bash
# Habilitar X forwarding (con restricciones de seguridad)
ssh -X usuario@servidor

# Habilitar X forwarding confiable (sin restricciones)
ssh -Y usuario@servidor

# Ejecutar una aplicacion grafica en el servidor remoto
ssh -X usuario@servidor firefox
```

### Configuracion necesaria

**En el servidor SSH** (`/etc/ssh/sshd_config`):
```
X11Forwarding yes
X11DisplayOffset 10
```

**En el cliente SSH** (`/etc/ssh/ssh_config` o `~/.ssh/config`):
```
ForwardX11 yes
```

**Diferencia entre -X y -Y:**
- `-X`: X forwarding con restricciones de seguridad (X11 SECURITY extension). Algunas aplicaciones pueden no funcionar correctamente.
- `-Y`: X forwarding confiable (trusted). Sin restricciones de seguridad. Necesario para algunas aplicaciones complejas.

Cuando se usa SSH X forwarding, la variable `DISPLAY` se configura automaticamente (generalmente a `localhost:10.0`).

---

## Resumen para el examen

1. **X11** usa arquitectura cliente-servidor: el servidor esta donde esta la pantalla
2. **DISPLAY=:0** es el display local por defecto; formato completo: `host:display.screen`
3. **xhost** controla acceso por host (inseguro); **xauth** usa cookies (seguro)
4. **xorg.conf** tiene secciones: InputDevice, Monitor, Device, Screen, ServerLayout
5. **Display Managers:** GDM (GNOME), SDDM (KDE), LightDM (ligero), XDM (basico)
6. **Wayland** es el reemplazo moderno de X11, con compositor integrado
7. **SSH -X** permite reenvio de X11; requiere `X11Forwarding yes` en el servidor
8. **~/.Xauthority** almacena las cookies MIT-MAGIC-COOKIE para autenticacion
