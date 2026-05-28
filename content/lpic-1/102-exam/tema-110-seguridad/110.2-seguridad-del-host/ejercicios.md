---
title: "110.2 Configurar la seguridad del host - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-110
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "110"
subtema: "110.2"
---

# 110.2 Configurar la seguridad del host - Ejercicios

### Pregunta 1

Por que existen las shadow passwords en Linux?

a) Para cifrar las contrasenas con un algoritmo mas fuerte
b) Para separar los hashes de contrasenas del archivo `/etc/passwd` que es legible por todos los usuarios
c) Para permitir multiples contrasenas por usuario
d) Para almacenar las contrasenas en texto plano de forma segura

<details><summary>Respuesta</summary>

**b) Para separar los hashes de contrasenas del archivo `/etc/passwd` que es legible por todos los usuarios**

Shadow passwords resuelven el problema de que `/etc/passwd` tiene permisos 644 (legible por todos). Originalmente, este archivo contenia los hashes de contrasenas, lo que permitia a cualquier usuario copiarlos y hacer ataques de fuerza bruta offline. Con shadow passwords, los hashes se mueven a `/etc/shadow` que solo es legible por root (permisos 640 o 000), mientras que `/etc/passwd` muestra una `x` en el campo de contrasena.

</details>

---

### Pregunta 2

En TCP Wrappers, si `/etc/hosts.allow` contiene `sshd: 192.168.1.0/24` y `/etc/hosts.deny` contiene `ALL: ALL`, puede conectarse por SSH un equipo con IP 10.0.0.5?

a) Si, porque `/etc/hosts.deny` se evalua primero y luego se buscan excepciones en `/etc/hosts.allow`
b) No, porque la IP no esta en la red permitida en `/etc/hosts.allow` y la regla en `/etc/hosts.deny` deniega todo lo demas
c) Si, porque la regla `ALL: ALL` solo se aplica a servicios diferentes de SSH
d) Depende del orden de las lineas dentro de cada archivo

<details><summary>Respuesta</summary>

**b) No, porque la IP no esta en la red permitida en `/etc/hosts.allow` y la regla en `/etc/hosts.deny` deniega todo lo demas**

El orden de evaluacion de TCP Wrappers es: 1) Se consulta primero `/etc/hosts.allow`, 2) Si hay coincidencia se permite, 3) Si no hay coincidencia se consulta `/etc/hosts.deny`, 4) Si hay coincidencia se deniega, 5) Si no hay coincidencia en ninguno se permite por defecto. La IP 10.0.0.5 no coincide con 192.168.1.0/24 en hosts.allow, y la regla `ALL: ALL` en hosts.deny la deniega.

</details>

---

### Pregunta 3

Cual es la diferencia entre `systemctl disable` y `systemctl mask` para un servicio?

a) `disable` detiene el servicio y `mask` lo elimina del sistema
b) `disable` evita que inicie al arrancar pero permite inicio manual, y `mask` bloquea completamente cualquier inicio
c) `mask` es temporal y `disable` es permanente
d) No hay diferencia practica entre ambos

<details><summary>Respuesta</summary>

**b) `disable` evita que inicie al arrancar pero permite inicio manual, y `mask` bloquea completamente cualquier inicio**

`systemctl disable` elimina los enlaces simbolicos de arranque, por lo que el servicio no inicia automaticamente pero aun se puede iniciar manualmente con `systemctl start`. `systemctl mask` crea un enlace simbolico a `/dev/null`, haciendo imposible iniciar el servicio de cualquier forma (ni manual ni automaticamente). Para la maxima seguridad se usa `systemctl stop servicio && systemctl mask servicio`. Para revertir: `systemctl unmask servicio`.

</details>

---

### Pregunta 4

Que ocurre cuando existe el archivo `/etc/nologin` en el sistema?

a) Se deshabilita la cuenta root
b) Se impide el login de todos los usuarios excepto root
c) Se deshabilitan todas las cuentas del sistema
d) Se bloquean las conexiones SSH pero no las locales

<details><summary>Respuesta</summary>

**b) Se impide el login de todos los usuarios excepto root**

Si el archivo `/etc/nologin` existe, el sistema impide el login de todos los usuarios normales. Solo root puede iniciar sesion. El contenido del archivo se muestra como mensaje al usuario que intenta conectarse. Es util durante mantenimiento del sistema. Para restaurar el acceso, simplemente se elimina el archivo con `rm /etc/nologin`. No confundir con `/usr/sbin/nologin`, que es un shell falso asignado a cuentas de servicio individuales.

</details>

---

### Pregunta 5

En `/etc/shadow`, que indica el prefijo `$6$` en el campo de hash de la contrasena?

a) La contrasena esta cifrada con MD5
b) La contrasena esta cifrada con SHA-256
c) La contrasena esta cifrada con SHA-512
d) La contrasena esta cifrada con Blowfish

<details><summary>Respuesta</summary>

**c) La contrasena esta cifrada con SHA-512**

Los prefijos del hash en `/etc/shadow` indican el algoritmo utilizado: `$6$` = SHA-512, `$5$` = SHA-256, `$1$` = MD5 (inseguro y obsoleto), `$2b$` o `$2y$` = Blowfish/bcrypt. SHA-512 es el algoritmo predeterminado en la mayoria de distribuciones modernas. El formato completo es `$tipo$sal$hash`, donde la sal (salt) es un valor aleatorio que impide ataques con tablas precomputadas.

</details>

---

### Pregunta 6

Como se deshabilita un servicio en xinetd?

a) Comentando la linea con `#` en `/etc/xinetd.conf`
b) Cambiando `disable = no` a `disable = yes` en el archivo del servicio en `/etc/xinetd.d/`
c) Ejecutando `xinetd --disable servicio`
d) Eliminando el archivo del servicio de `/etc/xinetd.d/`

<details><summary>Respuesta</summary>

**b) Cambiando `disable = no` a `disable = yes` en el archivo del servicio en `/etc/xinetd.d/`**

En xinetd, cada servicio tiene su propio archivo de configuracion en `/etc/xinetd.d/`. Para deshabilitar un servicio, se cambia la directiva `disable = no` a `disable = yes` dentro del archivo correspondiente, y luego se reinicia xinetd con `systemctl restart xinetd`. En inetd (el predecesor), se deshabilita un servicio comentando su linea con `#` en `/etc/inetd.conf`.

</details>

---

### Pregunta 7

Cual es la diferencia entre `/usr/sbin/nologin` y `/etc/nologin`?

a) Son el mismo archivo, solo cambia la ruta
b) `/usr/sbin/nologin` es un shell asignado a cuentas individuales y `/etc/nologin` es un archivo que bloquea todos los logins no-root
c) `/etc/nologin` se usa en Debian y `/usr/sbin/nologin` en Red Hat
d) `/usr/sbin/nologin` bloquea SSH y `/etc/nologin` bloquea logins locales

<details><summary>Respuesta</summary>

**b) `/usr/sbin/nologin` es un shell asignado a cuentas individuales y `/etc/nologin` es un archivo que bloquea todos los logins no-root**

`/usr/sbin/nologin` es un programa (shell falso) que se asigna como shell de login a cuentas de servicio en `/etc/passwd` para impedir el acceso interactivo de esas cuentas especificas. `/etc/nologin` es un archivo cuya mera existencia impide que cualquier usuario normal (no root) inicie sesion en el sistema. El primero es permanente para cuentas individuales; el segundo es temporal y afecta a todos los usuarios.

</details>

---

### Pregunta 8

Que indica el valor `!!` en el campo de hash de contrasena en `/etc/shadow`?

a) La contrasena esta cifrada con doble hash
b) La cuenta esta bloqueada o nunca ha tenido contrasena
c) La contrasena ha expirado
d) El usuario tiene autenticacion de dos factores

<details><summary>Respuesta</summary>

**b) La cuenta esta bloqueada o nunca ha tenido contrasena**

En `/etc/shadow`, el valor `!!` indica que la cuenta esta bloqueada o nunca ha tenido una contrasena establecida. Un solo `!` tambien indica cuenta bloqueada (puede aparecer cuando se bloquea con `passwd -l`). El valor `*` indica que el login esta deshabilitado (tipico de cuentas del sistema). Un campo vacio significa sin contrasena (el usuario puede hacer login sin introducir contrasena, lo cual es un riesgo de seguridad).

</details>

---

### Pregunta 9

Que archivo en el sistema lista las terminales (TTY) desde las cuales root puede iniciar sesion directamente?

a) `/etc/login.defs`
b) `/etc/securetty`
c) `/etc/pam.d/login`
d) `/etc/security/access.conf`

<details><summary>Respuesta</summary>

**b) `/etc/securetty`**

El archivo `/etc/securetty` lista las terminales (TTY) desde las cuales root puede hacer login directo. Es verificado por el modulo PAM `pam_securetty`. Si el archivo existe, root solo puede hacer login desde las TTY listadas. Este archivo no afecta al acceso via SSH (eso se controla con `PermitRootLogin` en `/etc/ssh/sshd_config`) ni a `su` o `sudo` (solo afecta al login directo en consola).

</details>

---

### Pregunta 10

Cual es el orden de evaluacion de las reglas en TCP Wrappers cuando un cliente intenta conectarse?

a) Se evalua `/etc/hosts.deny` primero, luego `/etc/hosts.allow`, y si no hay coincidencia se deniega
b) Se evaluan ambos archivos simultaneamente y el mas especifico gana
c) Se evalua `/etc/hosts.allow` primero; si hay coincidencia se permite; si no, se evalua `/etc/hosts.deny`; si no hay coincidencia en ninguno, se permite
d) Se evalua `/etc/hosts.allow` primero; si hay coincidencia se permite; si no, se evalua `/etc/hosts.deny`; si no hay coincidencia en ninguno, se deniega

<details><summary>Respuesta</summary>

**c) Se evalua `/etc/hosts.allow` primero; si hay coincidencia se permite; si no, se evalua `/etc/hosts.deny`; si no hay coincidencia en ninguno, se permite**

El orden de evaluacion de TCP Wrappers es: 1) Se consulta `/etc/hosts.allow`: si hay coincidencia, se permite la conexion y se detiene la evaluacion. 2) Se consulta `/etc/hosts.deny`: si hay coincidencia, se deniega la conexion. 3) Si no hay coincidencia en ninguno de los dos archivos, la conexion se permite por defecto. Por eso la estrategia recomendada es poner `ALL: ALL` en hosts.deny y solo permitir lo necesario en hosts.allow.

</details>
