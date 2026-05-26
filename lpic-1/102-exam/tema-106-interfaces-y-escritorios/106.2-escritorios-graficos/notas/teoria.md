# 106.2 - Teoria: Escritorios graficos

## 1. Entornos de escritorio vs Gestores de ventanas

### Entorno de escritorio (Desktop Environment)
Un entorno de escritorio es un conjunto completo de software que proporciona una interfaz grafica coherente. Incluye:
- Gestor de ventanas
- Panel/barra de tareas
- Gestor de archivos
- Aplicaciones integradas (editor de texto, terminal, configuracion)
- Notificaciones
- Temas y apariencia unificada

### Gestor de ventanas (Window Manager)
Un gestor de ventanas es un componente mas simple que solo se encarga de:
- Dibujar bordes y barras de titulo de las ventanas
- Mover, redimensionar, minimizar y maximizar ventanas
- Gestionar el enfoque (que ventana esta activa)

Un gestor de ventanas puede usarse solo (sin entorno de escritorio) para un sistema mas ligero.

---

## 2. Toolkit Libraries (Bibliotecas de interfaz grafica)

Las toolkit libraries son frameworks que proporcionan los widgets (botones, menus, cuadros de texto) para construir interfaces graficas.

### GTK+ (GIMP Toolkit)
- Originalmente creado para GIMP
- Escrito en **C**
- Base de GNOME, Xfce, MATE, Cinnamon, LXDE
- Usa el lenguaje CSS para temas
- Version actual: GTK 4 (GTK 3 aun ampliamente usado)

### Qt
- Desarrollado por la empresa Qt (anteriormente Trolltech/Nokia)
- Escrito en **C++**
- Base de KDE/Plasma y LXQt
- Licencia dual: GPL y comercial
- Version actual: Qt 6

**Para el examen:** Es fundamental saber que toolkit usa cada entorno de escritorio.

---

## 3. Principales entornos de escritorio

### GNOME
- **Toolkit:** GTK+
- **Gestor de ventanas:** Mutter
- **Gestor de archivos:** Nautilus (ahora llamado Files)
- **Compositor Wayland:** Mutter
- **Caracteristicas:** Interfaz moderna y minimalista, busqueda integrada, extensiones
- **Distribucion:** Por defecto en Fedora, Ubuntu (con personalizaciones)
- Es el entorno de escritorio mas popular en Linux

### KDE Plasma
- **Toolkit:** Qt
- **Gestor de ventanas:** KWin
- **Gestor de archivos:** Dolphin
- **Compositor Wayland:** KWin
- **Caracteristicas:** Altamente personalizable, widgets en escritorio, aspecto similar a Windows
- **Distribucion:** Por defecto en openSUSE, Kubuntu, KDE neon

### Xfce
- **Toolkit:** GTK+
- **Gestor de ventanas:** Xfwm4
- **Gestor de archivos:** Thunar
- **Caracteristicas:** Ligero, rapido, bajo consumo de recursos. Buen equilibrio entre funcionalidad y rendimiento
- **Distribucion:** Popular en Xubuntu, MX Linux

### MATE
- **Toolkit:** GTK+
- **Gestor de ventanas:** Marco
- **Gestor de archivos:** Caja
- **Caracteristicas:** Fork de GNOME 2. Escritorio clasico tradicional. Para usuarios que preferian GNOME 2 sobre GNOME 3
- **Distribucion:** Por defecto en Ubuntu MATE, Linux Mint MATE

### LXDE (Lightweight X11 Desktop Environment)
- **Toolkit:** GTK+ (version 2)
- **Gestor de ventanas:** Openbox
- **Gestor de archivos:** PCManFM
- **Caracteristicas:** Muy ligero, ideal para hardware antiguo. Bajo consumo de RAM
- **Distribucion:** Lubuntu (versiones antiguas)

### LXQt
- **Toolkit:** Qt
- **Gestor de ventanas:** Openbox (por defecto)
- **Gestor de archivos:** PCManFM-Qt
- **Caracteristicas:** Sucesor de LXDE portado a Qt. Ligero y modular
- **Distribucion:** Lubuntu (versiones modernas)

### Cinnamon
- **Toolkit:** GTK+
- **Gestor de ventanas:** Muffin (fork de Mutter)
- **Gestor de archivos:** Nemo (fork de Nautilus)
- **Caracteristicas:** Fork de GNOME Shell. Escritorio tradicional con panel inferior, menu de aplicaciones y bandeja del sistema
- **Distribucion:** Por defecto en Linux Mint

---

## 4. Resumen de entornos y toolkits

| Entorno | Toolkit | WM | Peso (recursos) |
|---------|---------|-----|------------------|
| GNOME | GTK+ | Mutter | Pesado |
| KDE Plasma | Qt | KWin | Pesado |
| Xfce | GTK+ | Xfwm4 | Ligero |
| MATE | GTK+ | Marco | Medio |
| LXDE | GTK+ 2 | Openbox | Muy ligero |
| LXQt | Qt | Openbox | Muy ligero |
| Cinnamon | GTK+ | Muffin | Medio-pesado |

**Regla mnemotecnica:**
- **GTK+:** GNOME, Xfce, MATE, Cinnamon, LXDE
- **Qt:** KDE Plasma, LXQt

---

## 5. Gestores de ventanas independientes

Estos WM se pueden usar sin entorno de escritorio completo:

### Openbox
- **Tipo:** Stacking (apilamiento clasico de ventanas)
- Menu activado por clic derecho en el escritorio
- Configuracion mediante archivos XML
- Muy ligero, usado como WM por defecto en LXDE y LXQt

### i3
- **Tipo:** Tiling (las ventanas se organizan automaticamente sin solaparse)
- Controlado principalmente por teclado
- Configuracion mediante archivo de texto plano
- Popular entre usuarios avanzados y desarrolladores

### Fluxbox
- **Tipo:** Stacking
- Derivado de Blackbox
- Barra de tareas integrada
- Configuracion mediante archivos de texto
- Ligero y personalizable

---

## 6. Protocolos de acceso remoto al escritorio

### VNC (Virtual Network Computing)
- Protocolo para acceso remoto al escritorio grafico
- **RFB (Remote Framebuffer):** Protocolo subyacente
- Transmite los cambios en el framebuffer (pantalla) al cliente
- **Servidores VNC en Linux:** TigerVNC, TightVNC, x11vnc
- **Puerto por defecto:** 5900 + numero de display (5900 para :0, 5901 para :1)
- **No cifra el trafico por defecto** (se recomienda usar tunel SSH)
- Multiplataforma (conectar desde Windows, Mac, Linux)

```bash
# Iniciar servidor VNC
vncserver :1

# Conectar desde cliente
vncviewer servidor:1
```

### RDP (Remote Desktop Protocol)
- Protocolo desarrollado por Microsoft para acceso remoto a escritorios Windows
- **xrdp:** Implementacion de servidor RDP para Linux
- Permite conectar desde clientes RDP de Windows a un escritorio Linux
- **Puerto por defecto:** 3389
- Soporta cifrado nativo

```bash
# Instalar xrdp en Linux
sudo apt install xrdp
sudo systemctl enable xrdp

# Conectar desde Windows
mstsc.exe    # Cliente RDP de Windows
```

### SPICE (Simple Protocol for Independent Computing Environments)
- Protocolo de acceso remoto optimizado para **entornos de virtualizacion**
- Desarrollado originalmente por Qumranet (adquirida por Red Hat)
- Ofrece mejor rendimiento que VNC para maquinas virtuales
- Soporta: audio bidireccional, video acelerado, USB compartido, portapapeles compartido
- **Puerto por defecto:** 5900 (configurable)
- **Clientes:** virt-viewer, remote-viewer, SPICE HTML5 client
- Integrado en soluciones como **QEMU/KVM**, oVirt, RHEV
- Soporta cifrado TLS nativo

```bash
# Conectar a una VM con SPICE usando remote-viewer
remote-viewer spice://servidor:5900
```

### XDMCP (X Display Manager Control Protocol)
- Protocolo nativo de X11 para gestionar sesiones remotas
- Un cliente ligero (thin client) solicita una sesion al Display Manager remoto
- El DM muestra la pantalla de login
- **Puerto:** 177 UDP
- **INSEGURO:** No cifra el trafico. Enviar datos de pantalla y teclado sin cifrar
- **Obsoleto** en la practica, reemplazado por VNC y RDP
- Requiere configurar el Display Manager para aceptar conexiones XDMCP

---

## 7. xdg-utils: Herramientas de escritorio estandar

**xdg-utils** es un conjunto de herramientas de linea de comandos que proporcionan funciones de integracion con el escritorio de forma independiente del entorno (GNOME, KDE, Xfce, etc.). Forman parte del estandar **freedesktop.org**.

### Comandos principales

| Comando | Descripcion |
|---------|-------------|
| `xdg-open` | Abre un archivo o URL con la aplicacion predeterminada |
| `xdg-mime` | Consulta y configura las asociaciones de tipos MIME |
| `xdg-settings` | Configura parametros del escritorio (navegador predeterminado, etc.) |
| `xdg-desktop-menu` | Instala/desinstala entradas del menu de escritorio |
| `xdg-desktop-icon` | Instala/desinstala iconos en el escritorio |
| `xdg-screensaver` | Controla el salvapantallas |
| `xdg-email` | Abre el cliente de correo predeterminado |

### Ejemplos de uso
```bash
# Abrir un archivo con la aplicacion predeterminada
xdg-open documento.pdf         # Abre con el visor de PDF configurado
xdg-open foto.jpg              # Abre con el visor de imagenes
xdg-open https://ejemplo.com   # Abre en el navegador predeterminado
xdg-open /home/sandra/         # Abre en el gestor de archivos

# Consultar el tipo MIME de un archivo
xdg-mime query filetype documento.pdf
# Resultado: application/pdf

# Consultar la aplicacion predeterminada para un tipo MIME
xdg-mime query default application/pdf
# Resultado: evince.desktop

# Establecer la aplicacion predeterminada para un tipo MIME
xdg-mime default firefox.desktop text/html

# Consultar el navegador predeterminado
xdg-settings get default-web-browser
```

**Para el examen:** `xdg-open` es la herramienta clave para abrir archivos con la aplicacion predeterminada independientemente del entorno de escritorio. `xdg-mime` permite consultar y modificar las asociaciones de tipos de archivo.

---

## 8. Comparativa de protocolos de acceso remoto

| Protocolo | Puerto | Cifrado | Uso tipico |
|-----------|--------|---------|------------|
| VNC | 5900+ | No (usar SSH tunnel) | Acceso remoto multiplataforma |
| RDP (xrdp) | 3389 | Si (nativo) | Conectar desde Windows a Linux |
| SPICE | 5900 (configurable) | Si (TLS) | Maquinas virtuales (QEMU/KVM) |
| XDMCP | 177/UDP | No | Thin clients (obsoleto) |
| SSH -X | 22 | Si (SSH) | Aplicaciones individuales remotas |

---

## Resumen para el examen

1. **GTK+** es usado por: GNOME, Xfce, MATE, Cinnamon, LXDE
2. **Qt** es usado por: KDE Plasma, LXQt
3. **Xfce** es la opcion ligera basada en GTK+; **LXQt** es la opcion ligera basada en Qt
4. **MATE** es un fork de GNOME 2; **Cinnamon** es un fork de GNOME Shell
5. **VNC** usa puerto 5900+; **RDP** usa puerto 3389; **SPICE** optimizado para VMs; **XDMCP** usa puerto 177/UDP
6. **VNC** y **XDMCP** no cifran por defecto; **RDP** y **SPICE** si cifran
7. **xdg-open** abre archivos con la aplicacion predeterminada; **xdg-mime** gestiona asociaciones de tipos MIME
8. **Openbox** es un WM stacking; **i3** es un WM tiling
9. Un entorno de escritorio incluye un gestor de ventanas, pero un gestor de ventanas puede usarse solo
