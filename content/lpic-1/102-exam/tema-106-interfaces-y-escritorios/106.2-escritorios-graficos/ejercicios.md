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

## Ejercicio 1
Cual es la diferencia entre un entorno de escritorio y un gestor de ventanas? Da un ejemplo de cada uno.

<details>
<summary>Respuesta</summary>

**Entorno de escritorio:** Es un conjunto completo de software que proporciona una experiencia de usuario grafica integrada. Incluye gestor de ventanas, panel/barra de tareas, gestor de archivos, aplicaciones integradas, sistema de notificaciones y temas unificados. Ejemplo: **GNOME**, KDE Plasma, Xfce.

**Gestor de ventanas:** Es un componente mas simple que solo gestiona las ventanas: dibuja bordes, permite mover/redimensionar, gestiona el enfoque. No incluye panel, gestor de archivos ni aplicaciones propias. Ejemplo: **Openbox**, i3, Fluxbox.

Un entorno de escritorio siempre incluye un gestor de ventanas como componente, pero un gestor de ventanas puede usarse de forma independiente para un sistema mas ligero y personalizable.
</details>

---

## Ejercicio 2
Clasifica los siguientes entornos de escritorio segun el toolkit que utilizan (GTK+ o Qt): GNOME, KDE Plasma, Xfce, LXQt, MATE, Cinnamon, LXDE.

<details>
<summary>Respuesta</summary>

**GTK+ (escrito en C):**
- GNOME
- Xfce
- MATE (fork de GNOME 2)
- Cinnamon (fork de GNOME Shell)
- LXDE

**Qt (escrito en C++):**
- KDE Plasma
- LXQt (sucesor de LXDE portado a Qt)

**Regla mnemotecnica:** La mayoria de entornos usan GTK+. Solo los que tienen "K" o "Q" en su nombre usan Qt (KDE y LXQt).
</details>

---

## Ejercicio 3
Un usuario necesita un entorno de escritorio muy ligero para un ordenador antiguo con poca RAM. Que dos opciones le recomendarias y que toolkit usa cada una? Cual es el sucesor de cual?

<details>
<summary>Respuesta</summary>

Las dos opciones mas ligeras son:

1. **LXDE** (Lightweight X11 Desktop Environment)
   - Toolkit: GTK+ 2
   - Gestor de ventanas: Openbox
   - Muy bajo consumo de recursos

2. **LXQt**
   - Toolkit: Qt
   - Gestor de ventanas: Openbox (por defecto)
   - Tambien muy bajo consumo de recursos

**LXQt es el sucesor de LXDE.** El proyecto LXDE fue portado de GTK+ 2 a Qt, resultando en LXQt. LXDE usaba GTK+ 2 y nunca migro a GTK+ 3, por lo que se considero obsoleto. LXQt combina el enfoque ligero de LXDE con el toolkit Qt moderno.

**Xfce** tambien seria una opcion razonable si se quiere un poco mas de funcionalidad con un consumo de recursos moderado (usa GTK+).
</details>

---

## Ejercicio 4
Que son MATE y Cinnamon? De que proyectos derivan y por que se crearon?

<details>
<summary>Respuesta</summary>

**MATE:**
- Es un **fork de GNOME 2**
- Se creo cuando GNOME paso de la version 2 a la version 3 (GNOME Shell), cambiando radicalmente la interfaz
- Muchos usuarios preferían la interfaz clasica de GNOME 2, asi que MATE continuo su desarrollo
- Usa GTK+ y su gestor de ventanas es Marco (fork de Metacity)
- Gestor de archivos: Caja (fork de Nautilus de GNOME 2)

**Cinnamon:**
- Es un **fork de GNOME Shell** (GNOME 3)
- Creado por el equipo de Linux Mint como alternativa a GNOME Shell
- Proporciona un escritorio mas tradicional (panel inferior, menu de inicio, bandeja del sistema) sobre la base tecnologica de GNOME 3
- Usa GTK+ y su gestor de ventanas es Muffin (fork de Mutter)
- Gestor de archivos: Nemo (fork de Nautilus)

Ambos surgen de la insatisfaccion con los cambios de interfaz introducidos por GNOME 3.
</details>

---

## Ejercicio 5
Un administrador necesita configurar acceso remoto al escritorio de un servidor Linux. Describe las tres opciones principales (VNC, RDP, XDMCP) indicando puerto, seguridad y caso de uso ideal.

<details>
<summary>Respuesta</summary>

**VNC (Virtual Network Computing):**
- Puerto: 5900 + numero de display (5901 para :1, 5902 para :2)
- Seguridad: No cifra por defecto. Se debe usar un tunel SSH (`ssh -L 5901:localhost:5901 servidor`)
- Caso de uso: Acceso remoto multiplataforma. Ideal cuando se necesita acceder desde cualquier SO
- Servidores: TigerVNC, TightVNC, x11vnc

**RDP (xrdp):**
- Puerto: 3389
- Seguridad: Cifrado nativo integrado
- Caso de uso: Ideal cuando los clientes usan Windows, ya que el cliente RDP (mstsc.exe) viene preinstalado. xrdp permite a Windows conectarse a Linux

**XDMCP (X Display Manager Control Protocol):**
- Puerto: 177 UDP
- Seguridad: Sin cifrado (INSEGURO). Envía datos en texto plano
- Caso de uso: Thin clients en red local. En la practica esta obsoleto por su falta de seguridad
- Proporciona una pantalla de login completa del Display Manager

**Recomendacion:** VNC con tunel SSH o xrdp son las opciones mas utilizadas hoy en dia. XDMCP esta practicamente en desuso.
</details>

---

## Ejercicio 6
Indica el gestor de ventanas y el gestor de archivos asociado a cada uno de los siguientes entornos de escritorio: GNOME, KDE Plasma, Xfce, MATE.

<details>
<summary>Respuesta</summary>

| Entorno | Gestor de ventanas | Gestor de archivos |
|---------|--------------------|--------------------|
| **GNOME** | Mutter | Nautilus (tambien llamado Files) |
| **KDE Plasma** | KWin | Dolphin |
| **Xfce** | Xfwm4 | Thunar |
| **MATE** | Marco (fork de Metacity) | Caja (fork de Nautilus) |

Adicionalmente:
| Entorno | Gestor de ventanas | Gestor de archivos |
|---------|--------------------|--------------------|
| **Cinnamon** | Muffin (fork de Mutter) | Nemo (fork de Nautilus) |
| **LXDE** | Openbox | PCManFM |
| **LXQt** | Openbox (por defecto) | PCManFM-Qt |
</details>

---

## Ejercicio 7
Que tipo de gestores de ventanas son Openbox e i3? Explica la diferencia entre ambos tipos. En que entornos de escritorio se usa Openbox como gestor de ventanas por defecto?

<details>
<summary>Respuesta</summary>

**Openbox** es un gestor de ventanas de tipo **stacking** (apilamiento):
- Las ventanas se comportan como papeles en un escritorio: se pueden superponer unas sobre otras
- El usuario mueve y redimensiona las ventanas libremente con el raton
- Es el modelo clasico y familiar para la mayoria de usuarios
- Se usa como WM por defecto en **LXDE** y **LXQt**

**i3** es un gestor de ventanas de tipo **tiling** (mosaico):
- Las ventanas se organizan automaticamente ocupando todo el espacio disponible sin solaparse
- Cuando se abre una nueva ventana, las existentes se redimensionan para hacer sitio
- Se controla principalmente con el teclado (atajos)
- Popular entre desarrolladores y usuarios avanzados que buscan eficiencia

**Diferencia fundamental:** En un WM stacking las ventanas se solapan (como en Windows/macOS). En un WM tiling las ventanas se organizan automaticamente en un mosaico sin solaparse, maximizando el uso del espacio.
</details>
