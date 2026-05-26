# 101.1 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1
Que comando muestra los modulos del kernel que estan actualmente cargados?

a) `modinfo`
b) `insmod`
c) `lsmod`
d) `modprobe -l`

<details>
<summary>Respuesta</summary>

**c) `lsmod`**

`lsmod` muestra una lista de todos los modulos del kernel cargados, su tamano y las dependencias. Equivale a leer `/proc/modules`.

</details>

---

### Pregunta 2
Cual es la diferencia principal entre `modprobe` e `insmod`?

a) `modprobe` solo funciona como root
b) `insmod` gestiona dependencias automaticamente
c) `modprobe` gestiona dependencias automaticamente
d) No hay diferencia, son alias

<details>
<summary>Respuesta</summary>

**c) `modprobe` gestiona dependencias automaticamente**

`modprobe` resuelve y carga automaticamente las dependencias del modulo. `insmod` requiere que especifiques la ruta completa del modulo y no maneja dependencias.

</details>

---

### Pregunta 3
En que directorio se encuentran las reglas personalizadas de udev?

a) `/etc/udev/`
b) `/etc/udev/rules.d/`
c) `/dev/udev/`
d) `/sys/udev/rules/`

<details>
<summary>Respuesta</summary>

**b) `/etc/udev/rules.d/`**

Las reglas personalizadas se colocan en `/etc/udev/rules.d/`. Las reglas del sistema estan en `/lib/udev/rules.d/`. Las reglas en `/etc/` tienen prioridad sobre las de `/lib/`.

</details>

---

### Pregunta 4
Que archivo de /proc contiene informacion sobre las interrupciones (IRQs) del sistema?

a) `/proc/irq`
b) `/proc/interrupts`
c) `/proc/dma`
d) `/proc/ioports`

<details>
<summary>Respuesta</summary>

**b) `/proc/interrupts`**

`/proc/interrupts` muestra el conteo de interrupciones por CPU y por dispositivo. `/proc/dma` muestra los canales DMA y `/proc/ioports` los puertos de E/S.

</details>

---

### Pregunta 5
Que sistema de archivos virtual expone la informacion de dispositivos y drivers del kernel de forma jerarquica?

a) procfs (/proc)
b) devfs (/dev)
c) sysfs (/sys)
d) tmpfs (/tmp)

<details>
<summary>Respuesta</summary>

**c) sysfs (/sys)**

`/sys` (sysfs) expone informacion de dispositivos, buses y drivers de forma jerarquica. `/proc` contiene principalmente informacion de procesos y del kernel, aunque tambien tiene algo de info de hardware.

</details>

---

### Pregunta 6
Que comando usarias para ver los dispositivos PCI junto con los modulos del kernel que los manejan?

a) `lspci -v`
b) `lspci -k`
c) `lspci -t`
d) `lsmod -p`

<details>
<summary>Respuesta</summary>

**b) `lspci -k`**

La opcion `-k` de `lspci` muestra el driver del kernel en uso y los modulos del kernel disponibles para cada dispositivo PCI.

</details>

---

### Pregunta 7
UEFI utiliza una particion especial para almacenar los cargadores de arranque. Como se llama y donde se monta normalmente?

<details>
<summary>Respuesta</summary>

**ESP (EFI System Partition)**. Se monta normalmente en `/boot/efi`. Debe estar formateada con FAT32 (vfat). Contiene los archivos `.efi` de los cargadores de arranque.

</details>

---

### Pregunta 8
Que comando permite monitorizar en tiempo real los eventos de conexion/desconexion de dispositivos?

a) `dmesg -w`
b) `udevadm monitor`
c) `lsdev --watch`
d) `udevadm info`

<details>
<summary>Respuesta</summary>

**b) `udevadm monitor`**

`udevadm monitor` muestra los eventos de udev y del kernel en tiempo real. Es util para depurar problemas de hardware. `dmesg -w` tambien muestra mensajes del kernel en tiempo real pero no es especifico de udev.

</details>

---

### Pregunta 9
Que comando descarga un modulo del kernel incluyendo sus dependencias no utilizadas?

a) `rmmod modulo`
b) `insmod -r modulo`
c) `modprobe -r modulo`
d) `modunload modulo`

<details>
<summary>Respuesta</summary>

**c) `modprobe -r modulo`**

`modprobe -r` descarga el modulo y sus dependencias que no esten siendo utilizadas por otros modulos. `rmmod` solo descarga el modulo especificado sin manejar dependencias.

</details>

---

### Pregunta 10
Que archivo contendria una blacklist para evitar que un modulo se cargue automaticamente?

a) `/etc/modules`
b) `/etc/modprobe.d/blacklist.conf`
c) `/sys/module/blacklist`
d) `/proc/modules.deny`

<details>
<summary>Respuesta</summary>

**b) `/etc/modprobe.d/blacklist.conf`**

Los archivos en `/etc/modprobe.d/` pueden contener directivas `blacklist nombre_modulo` para evitar que se carguen automaticamente. El nombre del archivo puede ser cualquiera con extension `.conf`.

</details>

---

## Ejercicios practicos

### Ejercicio 1: Explorar hardware
Ejecuta los siguientes comandos y observa la salida:
```bash
lspci
lsusb
lsblk
lscpu
cat /proc/cpuinfo
cat /proc/meminfo
```

### Ejercicio 2: Modulos del kernel
```bash
# Listar modulos cargados
lsmod

# Buscar un modulo especifico
lsmod | grep ext4

# Ver informacion de un modulo
modinfo ext4

# Ver dependencias de un modulo
modprobe --show-depends ext4
```

### Ejercicio 3: Monitorizar eventos de hardware
```bash
# En una terminal, ejecuta:
udevadm monitor

# En otra terminal, conecta/desconecta un USB
# Observa los eventos que aparecen
```
