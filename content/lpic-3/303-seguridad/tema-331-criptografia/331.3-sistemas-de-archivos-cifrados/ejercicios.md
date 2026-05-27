---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "331 - Criptografía"
tema: "331.3 - Sistemas de archivos cifrados"
subtema: "331.3"
peso: 3
tags:
  - lpic-3
  - tema-331
  - luks
  - dm-crypt
  - ecryptfs
---

# Ejercicios - 331.3 Sistemas de Archivos Cifrados

### Pregunta 1
¿Qué comando formatea una partición con LUKS utilizando cifrado AES-XTS con clave de 512 bits?

a) `cryptsetup create --cipher aes-xts-plain64 --key-size 512 /dev/sdb1`
b) `cryptsetup luksFormat --cipher aes-xts-plain64 --key-size 512 /dev/sdb1`
c) `luks-setup --format aes-xts-512 /dev/sdb1`
d) `cryptsetup luksCreate --aes-xts 512 /dev/sdb1`

<details><summary>Respuesta</summary>

**b)** `cryptsetup luksFormat --cipher aes-xts-plain64 --key-size 512 /dev/sdb1`

`cryptsetup luksFormat` inicializa la partición con formato LUKS. `--cipher` especifica el algoritmo y `--key-size` el tamaño de clave en bits.
</details>

### Pregunta 2
¿Cuántos slots de clave soporta LUKS por defecto?

a) 4
b) 8
c) 16
d) Ilimitados

<details><summary>Respuesta</summary>

**b)** 8

LUKS soporta hasta 8 slots de clave (numerados del 0 al 7), permitiendo que múltiples contraseñas o archivos de clave puedan desbloquear el mismo volumen.
</details>

### Pregunta 3
¿Qué archivo se configura para desbloquear automáticamente volúmenes cifrados durante el arranque del sistema?

a) `/etc/fstab`
b) `/etc/luks.conf`
c) `/etc/crypttab`
d) `/etc/dm-crypt.conf`

<details><summary>Respuesta</summary>

**c)** `/etc/crypttab`

El archivo `/etc/crypttab` define los volúmenes cifrados que deben desbloquearse durante el arranque, incluyendo el nombre del mapeo, dispositivo, archivo de clave y opciones.
</details>

### Pregunta 4
Un administrador necesita hacer backup de la cabecera LUKS antes de una operación de mantenimiento. ¿Qué comando debe usar?

a) `cryptsetup luksDump /dev/sdb1 > backup.img`
b) `cryptsetup luksHeaderBackup /dev/sdb1 --header-backup-file backup.img`
c) `dd if=/dev/sdb1 of=backup.img bs=1M count=2`
d) `cryptsetup luksBackup --header /dev/sdb1 backup.img`

<details><summary>Respuesta</summary>

**b)** `cryptsetup luksHeaderBackup /dev/sdb1 --header-backup-file backup.img`

`luksHeaderBackup` es el método correcto y seguro para respaldar la cabecera LUKS. `luksDump` solo muestra información, no crea un backup restaurable.
</details>

### Pregunta 5
¿Cuál es la principal ventaja de dm-crypt en modo plano (plain mode) sobre LUKS?

a) Mayor rendimiento de cifrado
b) Soporte para múltiples contraseñas
c) Denegabilidad plausible (no hay cabecera identificable)
d) Mejor compatibilidad con sistemas de archivos

<details><summary>Respuesta</summary>

**c)** Denegabilidad plausible (no hay cabecera identificable)

En modo plano, no existe cabecera LUKS en el disco, por lo que no hay forma de probar que la partición contiene datos cifrados. Esto ofrece denegabilidad plausible, a costa de perder gestión de múltiples claves y cambio de contraseña.
</details>

### Pregunta 6
¿Qué diferencia principal existe entre eCryptfs y EncFS?

a) eCryptfs opera en el kernel, EncFS opera en espacio de usuario (FUSE)
b) eCryptfs cifra bloques, EncFS cifra archivos
c) eCryptfs no soporta cifrado de nombres de archivo, EncFS sí
d) EncFS es más seguro que eCryptfs

<details><summary>Respuesta</summary>

**a)** eCryptfs opera en el kernel, EncFS opera en espacio de usuario (FUSE)

eCryptfs es un sistema de archivos apilado que opera en el espacio del kernel, ofreciendo mejor rendimiento. EncFS usa FUSE (Filesystem in Userspace), siendo más fácil de configurar pero con menor rendimiento.
</details>

### Pregunta 7
¿Qué entrada en `/etc/crypttab` configura swap cifrado con clave aleatoria en cada arranque?

a) `swap_cifrado /dev/sdb2 none swap,luks`
b) `swap_cifrado /dev/sdb2 /dev/urandom swap,cipher=aes-xts-plain64,size=256`
c) `swap_cifrado /dev/sdb2 random swap`
d) `swap_cifrado /dev/sdb2 /dev/random luks,swap`

<details><summary>Respuesta</summary>

**b)** `swap_cifrado /dev/sdb2 /dev/urandom swap,cipher=aes-xts-plain64,size=256`

Se utiliza `/dev/urandom` como fuente de clave aleatoria. La opción `swap` indica que se formateará como swap tras abrir. La clave cambia en cada arranque, por lo que los datos de swap del arranque anterior son irrecuperables.
</details>

### Pregunta 8
¿Qué comando elimina el slot de clave número 3 de un volumen LUKS?

a) `cryptsetup luksRemoveKey --slot 3 /dev/sdb1`
b) `cryptsetup luksDeleteSlot /dev/sdb1 3`
c) `cryptsetup luksKillSlot /dev/sdb1 3`
d) `cryptsetup luksRemoveSlot 3 /dev/sdb1`

<details><summary>Respuesta</summary>

**c)** `cryptsetup luksKillSlot /dev/sdb1 3`

`luksKillSlot` elimina un slot de clave específico por su número. `luksRemoveKey` elimina una clave proporcionando la passphrase, sin necesidad de conocer el número de slot.
</details>

### Pregunta 9
¿Qué comando se necesita para regenerar el initramfs con soporte de cifrado en sistemas basados en RHEL?

a) `update-initramfs -u`
b) `mkinitcpio -p linux`
c) `dracut --force`
d) `initramfs-tools --update`

<details><summary>Respuesta</summary>

**c)** `dracut --force`

En sistemas RHEL/CentOS/Fedora, `dracut --force` regenera el initramfs. En Debian/Ubuntu se usa `update-initramfs -u`. En Arch Linux se usa `mkinitcpio`.
</details>

### Pregunta 10
Un administrador quiere crear la configuración "LVM sobre LUKS". ¿Cuál es el orden correcto de operaciones?

a) Crear PV -> Crear VG -> Crear LV -> Cifrar LV con LUKS
b) Cifrar partición con LUKS -> Abrir LUKS -> Crear PV sobre /dev/mapper -> Crear VG -> Crear LV
c) Crear VG -> Cifrar VG con LUKS -> Crear LV
d) Cifrar disco completo -> Particionar -> Crear LVM

<details><summary>Respuesta</summary>

**b)** Cifrar partición con LUKS -> Abrir LUKS -> Crear PV sobre /dev/mapper -> Crear VG -> Crear LV

En "LVM sobre LUKS", primero se cifra la partición con `luksFormat`, se abre con `luksOpen`, y luego se crean los componentes LVM (PV, VG, LV) sobre el dispositivo mapeado en `/dev/mapper/`. Todo el contenido LVM queda cifrado con una sola passphrase.
</details>
