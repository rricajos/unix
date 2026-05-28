---
title: "106.2 - Ejercicios: Escritorios graficos"
tags:
  - lpic-1
  - examen-102
  - tema-106
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "106"
subtema: "106.2"
---

# 106.2 - Ejercicios: Escritorios graficos

### Pregunta 1

Cual es la diferencia entre un entorno de escritorio y un gestor de ventanas?

a) Son equivalentes; ambos terminos se refieren al mismo tipo de software
b) Un entorno de escritorio incluye gestor de ventanas, panel, gestor de archivos y aplicaciones integradas; un gestor de ventanas solo gestiona las ventanas
c) Un gestor de ventanas es mas completo que un entorno de escritorio
d) Un entorno de escritorio funciona solo en Wayland y un gestor de ventanas solo en X11

<details><summary>Respuesta</summary>

**b) Un entorno de escritorio incluye gestor de ventanas, panel, gestor de archivos y aplicaciones integradas; un gestor de ventanas solo gestiona las ventanas**

Un entorno de escritorio es un conjunto completo de software que proporciona una experiencia de usuario grafica integrada: gestor de ventanas, panel/barra de tareas, gestor de archivos, aplicaciones, sistema de notificaciones y temas unificados (por ejemplo, GNOME, KDE Plasma). Un gestor de ventanas es un componente mas simple que solo gestiona las ventanas: dibujar bordes, mover, redimensionar y gestionar el enfoque (por ejemplo, Openbox, i3). Un entorno de escritorio siempre incluye un gestor de ventanas, pero un gestor de ventanas puede usarse de forma independiente.

</details>

---

### Pregunta 2

Cuales de los siguientes entornos de escritorio utilizan el toolkit Qt?

a) GNOME y Xfce
b) KDE Plasma y LXQt
c) MATE y Cinnamon
d) LXDE y Xfce

<details><summary>Respuesta</summary>

**b) KDE Plasma y LXQt**

Solo KDE Plasma y LXQt utilizan el toolkit Qt (escrito en C++). Todos los demas entornos principales usan GTK+ (escrito en C): GNOME, Xfce, MATE (fork de GNOME 2), Cinnamon (fork de GNOME Shell) y LXDE. Una regla mnemotecnica util: los entornos con "K" o "Q" en su nombre usan Qt (KDE, LXQt). LXQt es el sucesor de LXDE, portado de GTK+ 2 a Qt.

</details>

---

### Pregunta 3

Cual es el gestor de ventanas y el gestor de archivos que utiliza GNOME?

a) KWin y Dolphin
b) Mutter y Nautilus
c) Marco y Caja
d) Xfwm4 y Thunar

<details><summary>Respuesta</summary>

**b) Mutter y Nautilus**

GNOME utiliza **Mutter** como gestor de ventanas (y compositor Wayland) y **Nautilus** (tambien llamado Files) como gestor de archivos. KWin y Dolphin corresponden a KDE Plasma. Marco y Caja corresponden a MATE (que son forks de Metacity y Nautilus de GNOME 2, respectivamente). Xfwm4 y Thunar corresponden a Xfce.

</details>

---

### Pregunta 4

Que son MATE y Cinnamon y de que proyectos derivan?

a) MATE es un fork de KDE 4 y Cinnamon es un fork de Xfce
b) MATE es un fork de GNOME 2 y Cinnamon es un fork de GNOME Shell (GNOME 3)
c) Ambos son forks de KDE Plasma con diferentes interfaces de usuario
d) MATE es el sucesor de LXDE y Cinnamon es el sucesor de LXQt

<details><summary>Respuesta</summary>

**b) MATE es un fork de GNOME 2 y Cinnamon es un fork de GNOME Shell (GNOME 3)**

Ambos surgieron de la insatisfaccion con los cambios de interfaz introducidos por GNOME 3. **MATE** continuo el desarrollo de la interfaz clasica de GNOME 2, con su gestor de ventanas Marco (fork de Metacity) y gestor de archivos Caja (fork de Nautilus). **Cinnamon** fue creado por el equipo de Linux Mint como alternativa a GNOME Shell, proporcionando un escritorio mas tradicional (panel inferior, menu de inicio) sobre la base tecnologica de GNOME 3, con Muffin (fork de Mutter) y Nemo (fork de Nautilus).

</details>

---

### Pregunta 5

Cual es el puerto por defecto de VNC y cual es su principal limitacion de seguridad?

a) Puerto 3389, no soporta cifrado nativo
b) Puerto 5900 + numero de display, no cifra el trafico por defecto
c) Puerto 22, requiere configuracion adicional para autenticacion
d) Puerto 177/UDP, transmite datos en texto plano

<details><summary>Respuesta</summary>

**b) Puerto 5900 + numero de display, no cifra el trafico por defecto**

VNC usa el puerto 5900 mas el numero de display (5901 para :1, 5902 para :2, etc.). Su principal limitacion es que **no cifra el trafico por defecto**, lo que significa que las pulsaciones de teclado y las imagenes de pantalla se transmiten sin proteccion. Se recomienda usar un tunel SSH para cifrar la conexion: `ssh -L 5901:localhost:5901 servidor`. El puerto 3389 corresponde a RDP (xrdp). El puerto 177/UDP corresponde a XDMCP.

</details>

---

### Pregunta 6

Un administrador necesita que usuarios con Windows puedan conectarse al escritorio de un servidor Linux. Que protocolo y software deberia instalar en el servidor Linux para aprovechar el cliente RDP nativo de Windows?

a) VNC con TigerVNC
b) RDP con xrdp
c) XDMCP con XDM
d) SPICE con virt-viewer

<details><summary>Respuesta</summary>

**b) RDP con xrdp**

**xrdp** es la implementacion de servidor RDP para Linux que permite a clientes Windows conectarse usando el cliente RDP nativo (`mstsc.exe`), que viene preinstalado en Windows. RDP usa el puerto 3389 y soporta cifrado nativo. VNC funcionaria pero requiere instalar un cliente VNC en las maquinas Windows. XDMCP esta obsoleto y es inseguro. SPICE esta optimizado para entornos de virtualizacion (QEMU/KVM), no para acceso remoto general.

</details>

---

### Pregunta 7

Que tipo de gestor de ventanas es i3 y como se diferencia de Openbox?

a) i3 es un WM stacking y Openbox es un WM tiling
b) i3 es un WM tiling donde las ventanas se organizan sin solaparse; Openbox es un WM stacking donde las ventanas se pueden superponer
c) Ambos son WM tiling que organizan las ventanas automaticamente
d) Ambos son WM stacking que funcionan de manera identica

<details><summary>Respuesta</summary>

**b) i3 es un WM tiling donde las ventanas se organizan sin solaparse; Openbox es un WM stacking donde las ventanas se pueden superponer**

En un WM **tiling** como i3, las ventanas se organizan automaticamente ocupando todo el espacio disponible sin solaparse; se controla principalmente con atajos de teclado. En un WM **stacking** como Openbox, las ventanas se comportan como papeles en un escritorio: se pueden superponer, mover y redimensionar libremente con el raton. Openbox se usa como WM por defecto en LXDE y LXQt. i3 es popular entre desarrolladores y usuarios avanzados que buscan eficiencia.

</details>

---

### Pregunta 8

Que comando de xdg-utils se utiliza para abrir un archivo con la aplicacion predeterminada del sistema, independientemente del entorno de escritorio?

a) `xdg-mime`
b) `xdg-settings`
c) `xdg-open`
d) `xdg-desktop-menu`

<details><summary>Respuesta</summary>

**c) `xdg-open`**

`xdg-open` abre un archivo o URL con la aplicacion predeterminada del sistema, funcionando de forma independiente del entorno de escritorio (GNOME, KDE, Xfce, etc.). Ejemplos: `xdg-open documento.pdf` abre con el visor de PDF, `xdg-open https://ejemplo.com` abre en el navegador. `xdg-mime` consulta y configura las asociaciones de tipos MIME. `xdg-settings` configura parametros del escritorio como el navegador predeterminado. `xdg-desktop-menu` gestiona entradas del menu.

</details>

---

### Pregunta 9

Que protocolo de acceso remoto esta optimizado especificamente para entornos de virtualizacion como QEMU/KVM?

a) VNC
b) RDP
c) XDMCP
d) SPICE

<details><summary>Respuesta</summary>

**d) SPICE**

**SPICE** (Simple Protocol for Independent Computing Environments) es un protocolo de acceso remoto optimizado para entornos de virtualizacion. Desarrollado originalmente por Qumranet (adquirida por Red Hat), ofrece mejor rendimiento que VNC para maquinas virtuales y soporta audio bidireccional, video acelerado, USB compartido y portapapeles compartido. Esta integrado en soluciones como QEMU/KVM, oVirt y RHEV. Soporta cifrado TLS nativo. Los clientes incluyen `virt-viewer` y `remote-viewer`.

</details>

---

### Pregunta 10

Un usuario necesita un entorno de escritorio muy ligero para un ordenador antiguo con poca RAM. Cuales son las dos opciones mas ligeras y que relacion tienen entre si?

a) GNOME y KDE Plasma, que ofrecen modos de bajo consumo
b) Xfce y MATE, que son forks de GNOME optimizados
c) LXDE (GTK+) y LXQt (Qt), donde LXQt es el sucesor de LXDE portado a Qt
d) Cinnamon y Xfce, ambos basados en GTK+ y muy ligeros

<details><summary>Respuesta</summary>

**c) LXDE (GTK+) y LXQt (Qt), donde LXQt es el sucesor de LXDE portado a Qt**

LXDE y LXQt son los entornos de escritorio mas ligeros. LXDE (Lightweight X11 Desktop Environment) usa GTK+ 2 y Openbox como gestor de ventanas. LXQt es su sucesor, portado de GTK+ 2 a Qt, tambien usando Openbox por defecto. LXDE usaba GTK+ 2 y nunca migro a GTK+ 3, por lo que se considero obsoleto. Ambos tienen un consumo de RAM muy bajo. Xfce tambien es ligero pero consume algo mas de recursos. GNOME y KDE Plasma son los entornos mas pesados.

</details>
