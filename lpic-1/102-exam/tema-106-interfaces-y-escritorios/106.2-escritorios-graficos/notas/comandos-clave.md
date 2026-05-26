# 106.2 - Comandos clave: Escritorios graficos

## Entornos de escritorio y toolkits

| Entorno | Toolkit | Gestor de ventanas | Gestor de archivos |
|---------|---------|--------------------|--------------------|
| GNOME | GTK+ | Mutter | Nautilus/Files |
| KDE Plasma | Qt | KWin | Dolphin |
| Xfce | GTK+ | Xfwm4 | Thunar |
| MATE | GTK+ | Marco | Caja |
| LXDE | GTK+ 2 | Openbox | PCManFM |
| LXQt | Qt | Openbox | PCManFM-Qt |
| Cinnamon | GTK+ | Muffin | Nemo |

## Clasificacion por toolkit

| Toolkit | Entornos |
|---------|----------|
| **GTK+** (C) | GNOME, Xfce, MATE, Cinnamon, LXDE |
| **Qt** (C++) | KDE Plasma, LXQt |

## Gestores de ventanas independientes

| WM | Tipo | Caracteristica principal |
|----|------|-------------------------|
| Openbox | Stacking | Menu por clic derecho, WM de LXDE/LXQt |
| i3 | Tiling | Controlado por teclado, ventanas sin solapar |
| Fluxbox | Stacking | Derivado de Blackbox, ligero |

## Protocolos de acceso remoto

| Protocolo | Puerto | Cifrado | Descripcion |
|-----------|--------|---------|-------------|
| VNC (RFB) | 5900+ | No* | Acceso remoto al framebuffer |
| RDP (xrdp) | 3389 | Si | Protocolo de Microsoft, xrdp en Linux |
| XDMCP | 177/UDP | No | Login remoto via Display Manager (obsoleto) |
| SSH -X/-Y | 22 | Si | Reenvio de aplicaciones X individuales |

*VNC se debe tunelizar con SSH para cifrar

## VNC

| Comando | Descripcion |
|---------|-------------|
| `vncserver :1` | Iniciar servidor VNC en display :1 (puerto 5901) |
| `vncserver -kill :1` | Detener servidor VNC |
| `vncviewer host:1` | Conectar a servidor VNC |
| `vncpasswd` | Establecer contrasena VNC |

## RDP (xrdp)

| Comando | Descripcion |
|---------|-------------|
| `apt install xrdp` | Instalar servidor xrdp |
| `systemctl enable xrdp` | Habilitar xrdp |
| `systemctl start xrdp` | Iniciar xrdp |

## Relaciones clave para el examen

```
Entorno de escritorio = WM + panel + apps + file manager + temas
Gestor de ventanas = solo gestion de ventanas (bordes, mover, enfocar)

GNOME --> GTK+ --> Mutter
KDE   --> Qt   --> KWin
Xfce  --> GTK+ --> Xfwm4
MATE  --> GTK+ --> Marco     (fork de GNOME 2)
Cinnamon -> GTK+ -> Muffin   (fork de GNOME Shell)
LXDE  --> GTK+ --> Openbox
LXQt  --> Qt   --> Openbox
```
