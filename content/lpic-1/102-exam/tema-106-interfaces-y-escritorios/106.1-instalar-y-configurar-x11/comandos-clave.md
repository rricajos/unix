---
title: "106.1 - Comandos clave: Instalar y configurar X11"
tags:
  - lpic-1
  - examen-102
  - tema-106
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "106"
subtema: "106.1"
---

# 106.1 - Comandos clave: Instalar y configurar X11

## Variable DISPLAY

| Valor | Significado |
|-------|-------------|
| `:0` | Display local 0 (el mas comun) |
| `:0.0` | Display local 0, pantalla 0 |
| `:1` | Display local 1 (segundo servidor X) |
| `host:0` | Display 0 en host remoto |
| `localhost:10.0` | Tipico de SSH X forwarding |

```bash
echo $DISPLAY              # Ver display actual
export DISPLAY=:0          # Establecer display
DISPLAY=:0 firefox &       # Ejecutar en display especifico
```

## xhost - Control de acceso por host

| Comando | Descripcion |
|---------|-------------|
| `xhost` | Mostrar estado actual de acceso |
| `xhost +` | Deshabilitar control de acceso (INSEGURO) |
| `xhost -` | Habilitar control de acceso |
| `xhost +hostname` | Permitir acceso desde un host |
| `xhost -hostname` | Revocar acceso de un host |
| `xhost +si:localuser:user` | Permitir acceso a un usuario local |

## xauth - Control de acceso por cookies

| Comando | Descripcion |
|---------|-------------|
| `xauth list` | Listar cookies de autenticacion |
| `xauth add display proto cookie` | Agregar una cookie |
| `xauth remove display` | Eliminar una cookie |
| `xauth extract - :0` | Exportar cookie del display :0 |
| `xauth merge -` | Importar cookies desde stdin |

**Archivo:** `~/.Xauthority` (almacena las cookies MIT-MAGIC-COOKIE)

## Utilidades de informacion

| Comando | Descripcion |
|---------|-------------|
| `xdpyinfo` | Informacion detallada del servidor X (resoluciones, extensiones, profundidad de color) |
| `xwininfo` | Informacion de una ventana (clic para seleccionar) |
| `xwininfo -root` | Informacion de la ventana raiz |

## /etc/X11/xorg.conf - Secciones

| Seccion | Contenido |
|---------|-----------|
| `ServerLayout` | Configuracion global, vincula screens e inputs |
| `InputDevice` | Teclado, raton (driver, opciones) |
| `Monitor` | Monitor (frecuencias, modelo) |
| `Device` | Tarjeta grafica (driver, BusID) |
| `Screen` | Vincula Monitor + Device, define resoluciones |

### Formato basico
```
Section "NombreSeccion"
    Identifier  "nombre"
    Option      "clave" "valor"
EndSection
```

### Directorio de fragmentos
```
/etc/X11/xorg.conf.d/*.conf    # Archivos parciales procesados en orden numerico
```

## Display Managers

| DM | Entorno | Paquete/servicio |
|----|---------|------------------|
| GDM | GNOME | `gdm`, `gdm3` |
| SDDM | KDE Plasma | `sddm` |
| LightDM | Independiente | `lightdm` |
| XDM | Basico/original | `xdm` |

```bash
systemctl status gdm           # Ver estado del DM
systemctl enable lightdm       # Habilitar DM
systemctl disable gdm          # Deshabilitar DM
dpkg-reconfigure lightdm       # Cambiar DM por defecto (Debian)
```

## SSH X Forwarding

| Comando | Descripcion |
|---------|-------------|
| `ssh -X user@host` | X forwarding con restricciones de seguridad |
| `ssh -Y user@host` | X forwarding confiable (sin restricciones) |

### Configuracion del servidor (`/etc/ssh/sshd_config`)
```
X11Forwarding yes
X11DisplayOffset 10
```

### Configuracion del cliente (`~/.ssh/config`)
```
ForwardX11 yes
```

## Wayland vs X11

| Comando | Descripcion |
|---------|-------------|
| `echo $XDG_SESSION_TYPE` | Muestra si se usa `wayland` o `x11` |
| `echo $WAYLAND_DISPLAY` | Si tiene valor, se usa Wayland |

| Aspecto | X11 | Wayland |
|---------|-----|---------|
| Arquitectura | Cliente-servidor | Compositor integrado |
| Seguridad | Menor (clientes pueden espiarse) | Mayor (aislamiento) |
| Red nativa | Si | No |
| Compatibilidad X | Nativa | Mediante XWayland |
