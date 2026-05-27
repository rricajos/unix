---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "332 - Seguridad del Host"
tema: "332.1 - Hardening del host"
subtema: "332.1"
peso: 5
tags:
  - lpic-3
  - tema-332
  - hardening
  - sysctl
  - pam
---

# Ejercicios - 332.1 Hardening del Host

### Pregunta 1
¿Que valor de `kernel.randomize_va_space` activa ASLR completo (incluyendo heap, stack, mmap y VDSO)?

a) 0
b) 1
c) 2
d) 3

<details><summary>Respuesta</summary>

**c)** 2

El valor 2 activa ASLR completo. El valor 0 lo desactiva completamente, y el valor 1 activa una version parcial que no incluye el heap.
</details>

### Pregunta 2
¿Que comando impide completamente que un servicio sea iniciado, incluso manualmente?

a) `systemctl disable servicio`
b) `systemctl stop servicio`
c) `systemctl mask servicio`
d) `systemctl kill servicio`

<details><summary>Respuesta</summary>

**c)** `systemctl mask servicio`

`systemctl mask` crea un enlace simbolico del archivo de unidad a `/dev/null`, impidiendo que el servicio se inicie de cualquier forma. `disable` solo lo quita del arranque automatico.
</details>

### Pregunta 3
En la configuracion de `pam_pwquality`, ¿que significa `dcredit = -1`?

a) Se resta 1 punto si la contraseña contiene digitos
b) Se requiere al menos 1 digito en la contraseña
c) Se permite maximo 1 digito en la contraseña
d) Los digitos no cuentan para la longitud minima

<details><summary>Respuesta</summary>

**b)** Se requiere al menos 1 digito en la contraseña

En pam_pwquality, valores negativos en `dcredit`, `ucredit`, `lcredit` y `ocredit` indican el numero minimo requerido de ese tipo de caracter. Un valor de -1 significa que se requiere al menos 1.
</details>

### Pregunta 4
¿Que parametro sysctl restringe el acceso a la informacion de dmesg solo al usuario root?

a) `kernel.kptr_restrict = 1`
b) `kernel.dmesg_restrict = 1`
c) `kernel.syslog_restrict = 1`
d) `kernel.log_restrict = 1`

<details><summary>Respuesta</summary>

**b)** `kernel.dmesg_restrict = 1`

Cuando `kernel.dmesg_restrict` esta establecido a 1, solo los procesos con la capacidad `CAP_SYSLOG` (normalmente root) pueden leer el buffer de mensajes del kernel con `dmesg`.
</details>

### Pregunta 5
¿Que comando genera un hash de contraseña para proteger el bootloader GRUB?

a) `grub2-setpassword`
b) `grub2-mkpasswd-pbkdf2`
c) `grub-password --generate`
d) `openssl passwd -grub`

<details><summary>Respuesta</summary>

**b)** `grub2-mkpasswd-pbkdf2`

Este comando genera un hash PBKDF2 que se incluye en la configuracion de GRUB (`/etc/grub.d/40_custom`) junto con la directiva `password_pbkdf2`.
</details>

### Pregunta 6
¿Que archivo de configuracion establece los limites globales de envejecimiento de contraseñas para nuevos usuarios?

a) `/etc/pam.d/system-auth`
b) `/etc/security/pwquality.conf`
c) `/etc/login.defs`
d) `/etc/shadow`

<details><summary>Respuesta</summary>

**c)** `/etc/login.defs`

`/etc/login.defs` contiene las configuraciones por defecto como `PASS_MAX_DAYS`, `PASS_MIN_DAYS`, `PASS_WARN_AGE` que se aplican a los nuevos usuarios. Para usuarios existentes se usa `chage`.
</details>

### Pregunta 7
¿Que comando de `faillock` desbloquea una cuenta que fue bloqueada por intentos fallidos?

a) `faillock --user usuario --unlock`
b) `faillock --user usuario --reset`
c) `pam_tally2 --user usuario --reset`
d) `faillock --clear usuario`

<details><summary>Respuesta</summary>

**b)** `faillock --user usuario --reset`

`faillock --reset` limpia los registros de intentos fallidos del usuario, desbloqueando la cuenta. `pam_tally2` es la herramienta antigua, reemplazada por `faillock`.
</details>

### Pregunta 8
¿Que opcion en `/etc/security/limits.conf` deshabilita completamente los core dumps?

a) `* hard nocore 1`
b) `* hard core 0`
c) `* soft core disabled`
d) `* hard coredump 0`

<details><summary>Respuesta</summary>

**b)** `* hard core 0`

Establecer el limite hard de `core` a 0 para todos los usuarios (`*`) impide la generacion de core dumps. Complementariamente, `fs.suid_dumpable = 0` en sysctl previene core dumps de procesos SUID.
</details>

### Pregunta 9
¿Que herramienta permite controlar que dispositivos USB pueden conectarse a un sistema Linux?

a) ufw
b) USBGuard
c) firewalld
d) SELinux

<details><summary>Respuesta</summary>

**b)** USBGuard

USBGuard es un framework que permite crear politicas de control de acceso para dispositivos USB, permitiendo o bloqueando dispositivos segun criterios como ID de fabricante, tipo de interfaz, etc.
</details>

### Pregunta 10
Segun las guias CIS Benchmark, ¿cual de las siguientes es una recomendacion para particionamiento seguro?

a) Usar una sola particion para todo el sistema
b) Montar /tmp con las opciones noexec, nosuid y nodev
c) Cifrar solo la particion /boot
d) Usar el sistema de archivos FAT32 para todas las particiones

<details><summary>Respuesta</summary>

**b)** Montar /tmp con las opciones noexec, nosuid y nodev

CIS Benchmark recomienda particiones separadas para /tmp, /var, /var/log, /var/tmp y /home, con opciones restrictivas como `noexec` (no ejecutar binarios), `nosuid` (ignorar bits SUID) y `nodev` (no interpretar dispositivos).
</details>
