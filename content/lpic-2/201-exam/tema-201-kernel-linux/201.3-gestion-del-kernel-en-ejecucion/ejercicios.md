---
title: "201.3 - Gestion del kernel en ejecucion"
tags: [lpic-2, examen-201, tema-201, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.3"
---

# 201.3 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

Un administrador necesita habilitar el reenvio de paquetes IPv4 de forma permanente. ¿Cual es la forma correcta de hacerlo?

a) `echo 1 > /proc/sys/net/ipv4/ip_forward` y anadir `net.ipv4.ip_forward = 1` en `/etc/sysctl.conf`
b) Solo ejecutar `sysctl -w net.ipv4.ip_forward=1`
c) Solo editar `/etc/modprobe.d/ip_forward.conf`
d) Recompilar el kernel con CONFIG_IP_FORWARD=y

<details>
<summary>Respuesta</summary>

**a) `echo 1 > /proc/sys/net/ipv4/ip_forward` y anadir `net.ipv4.ip_forward = 1` en `/etc/sysctl.conf`**

Para que el cambio sea tanto inmediato como permanente, se necesitan dos acciones: aplicarlo en tiempo real (ya sea con `echo` o `sysctl -w`) y configurarlo en `/etc/sysctl.conf` para que persista tras el reinicio. Alternativamente, se puede editar `sysctl.conf` y ejecutar `sysctl -p` para aplicar ambos pasos.
</details>

---

### Pregunta 2

¿Que comando carga un modulo del kernel resolviendo automaticamente sus dependencias?

a) `insmod vfat`
b) `modprobe vfat`
c) `loadmod vfat`
d) `depmod vfat`

<details>
<summary>Respuesta</summary>

**b) `modprobe vfat`**

`modprobe` es la herramienta recomendada para cargar modulos porque resuelve y carga automaticamente las dependencias (por ejemplo, carga `fat` antes de `vfat`). `insmod` requiere la ruta completa y no resuelve dependencias. `depmod` genera el archivo de dependencias pero no carga modulos. `loadmod` no existe.
</details>

---

### Pregunta 3

¿Que archivo se debe editar para impedir permanentemente que un modulo se cargue automaticamente en el arranque?

a) `/etc/modules.deny`
b) Un archivo en `/etc/modprobe.d/` con la directiva `blacklist`
c) `/proc/sys/kernel/modules_disabled`
d) `/boot/config-$(uname -r)`

<details>
<summary>Respuesta</summary>

**b) Un archivo en `/etc/modprobe.d/` con la directiva `blacklist`**

Para impedir la carga automatica de un modulo, se crea un archivo en `/etc/modprobe.d/` (por ejemplo, `/etc/modprobe.d/blacklist-nouveau.conf`) con la linea `blacklist nouveau`. Esto impide la carga automatica pero aun permite la carga manual. Para bloquear completamente, se anade `install nouveau /bin/true`.
</details>

---

### Pregunta 4

Un administrador ejecuta `modprobe -r snd_hda_intel` y recibe el error "Module snd_hda_intel is in use". ¿Que significa esto?

a) El modulo no existe
b) El modulo esta en uso por otro modulo o proceso y no puede descargarse
c) El modulo ya fue descargado previamente
d) Se necesitan permisos de root

<details>
<summary>Respuesta</summary>

**b) El modulo esta en uso por otro modulo o proceso y no puede descargarse**

El error indica que el modulo tiene dependientes activos: otros modulos que dependen de el o procesos que estan utilizandolo. Se puede verificar con `lsmod` donde la columna "Used by" muestra que modulos dependen de el. Primero hay que descargar los modulos dependientes o detener los procesos que lo utilizan.
</details>

---

### Pregunta 5

¿Que comando muestra los parametros configurables disponibles para el modulo `e1000e`?

a) `modprobe -p e1000e`
b) `modinfo -p e1000e`
c) `sysctl -m e1000e`
d) `lsmod -p e1000e`

<details>
<summary>Respuesta</summary>

**b) `modinfo -p e1000e`**

La opcion `-p` (parameters) de `modinfo` muestra los parametros configurables de un modulo junto con su descripcion y tipo. Estos parametros se pueden pasar al cargar el modulo con `modprobe e1000e parametro=valor` o configurarse permanentemente en `/etc/modprobe.d/` con la directiva `options`.
</details>

---

### Pregunta 6

¿Cual es la diferencia entre `sysctl -p` y `sysctl --system`?

a) No hay diferencia, son identicos
b) `sysctl -p` carga solo `/etc/sysctl.conf`, `sysctl --system` carga desde todos los archivos de configuracion del sistema
c) `sysctl -p` es temporal, `sysctl --system` es permanente
d) `sysctl --system` reinicia el sistema despues de aplicar los cambios

<details>
<summary>Respuesta</summary>

**b) `sysctl -p` carga solo `/etc/sysctl.conf`, `sysctl --system` carga desde todos los archivos de configuracion del sistema**

`sysctl -p` carga la configuracion desde `/etc/sysctl.conf` por defecto (o un archivo especificado con `sysctl -p /ruta/archivo`). `sysctl --system` carga la configuracion desde todos los archivos de configuracion del sistema: `/etc/sysctl.conf`, `/etc/sysctl.d/*.conf`, `/run/sysctl.d/*.conf`, `/usr/lib/sysctl.d/*.conf`, etc.
</details>

---

### Pregunta 7

Un administrador necesita diagnosticar por que un dispositivo USB no es reconocido. ¿Que comando es el mas apropiado para ver los mensajes del kernel relacionados?

a) `sysctl -a | grep usb`
b) `modinfo usb`
c) `dmesg -T | grep -i usb`
d) `cat /etc/modprobe.d/usb.conf`

<details>
<summary>Respuesta</summary>

**c) `dmesg -T | grep -i usb`**

`dmesg` muestra el buffer de anillo del kernel que contiene mensajes sobre deteccion de hardware, carga de drivers y errores. La opcion `-T` muestra marcas de tiempo legibles. Filtrar con `grep -i usb` muestra solo los mensajes relacionados con dispositivos USB, facilitando el diagnostico.
</details>

---

### Pregunta 8

¿Que ocurre cuando se ejecuta `depmod` sin argumentos?

a) Descarga e instala modulos nuevos desde internet
b) Desinstala modulos que no se estan usando
c) Analiza los modulos del kernel actual y genera el archivo modules.dep con las dependencias
d) Carga todos los modulos disponibles

<details>
<summary>Respuesta</summary>

**c) Analiza los modulos del kernel actual y genera el archivo modules.dep con las dependencias**

`depmod` escanea todos los modulos en `/lib/modules/$(uname -r)/` y genera el archivo `modules.dep` (y su version binaria `modules.dep.bin`) que contiene el arbol de dependencias entre modulos. `modprobe` utiliza este archivo para resolver dependencias. Se debe ejecutar `depmod` despues de instalar modulos manualmente.
</details>

---

### Pregunta 9

¿Que parametro de sysctl controla la tendencia del sistema a mover paginas de memoria al area de swap?

a) `vm.swap_enabled`
b) `vm.swappiness`
c) `kernel.swap_ratio`
d) `fs.swap_usage`

<details>
<summary>Respuesta</summary>

**b) `vm.swappiness`**

`vm.swappiness` es un valor entre 0 y 100 que controla la agresividad con la que el kernel mueve paginas de la RAM al swap. Un valor de 0 minimiza el uso de swap (solo se usa cuando es absolutamente necesario), mientras que 100 hace que el kernel use swap agresivamente. El valor por defecto es 60. Para servidores de base de datos se suele reducir a 10.
</details>

---

### Pregunta 10

Un administrador quiere configurar el modulo `snd_hda_intel` para que siempre se cargue con el parametro `power_save=1`. ¿Donde y como debe configurarlo?

a) Editar `/proc/sys/kernel/modules/snd_hda_intel/power_save`
b) Crear un archivo en `/etc/modprobe.d/` con la linea `options snd_hda_intel power_save=1`
c) Editar `/lib/modules/$(uname -r)/kernel/sound/pci/hda/snd_hda_intel.ko`
d) Agregar `snd_hda_intel.power_save=1` en `/etc/sysctl.conf`

<details>
<summary>Respuesta</summary>

**b) Crear un archivo en `/etc/modprobe.d/` con la linea `options snd_hda_intel power_save=1`**

La directiva `options` en archivos de `/etc/modprobe.d/` permite definir parametros que se aplican automaticamente cada vez que se carga un modulo con `modprobe`. Por ejemplo, crear `/etc/modprobe.d/snd_hda_intel.conf` con `options snd_hda_intel power_save=1`. Los parametros de modulos no se gestionan con `sysctl`, que es para parametros del kernel en `/proc/sys/`.
</details>
