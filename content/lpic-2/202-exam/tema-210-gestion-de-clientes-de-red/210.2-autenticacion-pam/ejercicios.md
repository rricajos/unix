---
title: "210.2 - Autenticación PAM"
tags: [lpic-2, examen-202, tema-210, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.2"
---

# 210.2 - Ejercicios: Autenticación PAM

### Pregunta 1

¿Cuáles son los cuatro tipos de módulos PAM?

a) login, logout, password, session
b) auth, account, password, session
c) user, group, password, access
d) verify, permit, deny, session

<details><summary>Respuesta</summary>

**b) auth, account, password, session**

Los cuatro tipos de módulos PAM son: `auth` (verificación de identidad), `account` (verificación de permisos de cuenta), `password` (gestión de cambios de contraseña) y `session` (configuración del entorno de sesión).
</details>

### Pregunta 2

¿Cuál es la diferencia principal entre el flag `required` y `requisite`?

a) `required` detiene la evaluación inmediatamente y `requisite` continúa
b) `required` continúa evaluando los demás módulos y `requisite` detiene la evaluación inmediatamente
c) No hay diferencia, son sinónimos
d) `required` es para auth y `requisite` es para session

<details><summary>Respuesta</summary>

**b) `required` continúa evaluando los demás módulos y `requisite` detiene la evaluación inmediatamente**

Cuando un módulo `required` falla, la pila sigue evaluando el resto de módulos (para no revelar qué paso falló), pero el resultado final será fallo. Con `requisite`, el fallo detiene inmediatamente la evaluación y devuelve fallo al instante.
</details>

### Pregunta 3

¿Qué módulo PAM se utiliza para restringir el uso de `su` a los miembros del grupo `wheel`?

a) pam_restrict.so
b) pam_group.so
c) pam_wheel.so
d) pam_su.so

<details><summary>Respuesta</summary>

**c) pam_wheel.so**

El módulo `pam_wheel.so` se configura en `/etc/pam.d/su` con la línea `auth required pam_wheel.so` para que solo los usuarios del grupo `wheel` puedan usar el comando `su`.
</details>

### Pregunta 4

¿En qué directorio se encuentran los archivos de configuración PAM por servicio?

a) /etc/pam/
b) /etc/security/pam/
c) /etc/pam.d/
d) /etc/auth/pam.d/

<details><summary>Respuesta</summary>

**c) /etc/pam.d/**

Los archivos de configuración PAM se encuentran en `/etc/pam.d/`. Cada archivo lleva el nombre del servicio que configura (login, sshd, su, sudo, etc.).
</details>

### Pregunta 5

¿Qué ocurre cuando existe el archivo `/etc/nologin` y se utiliza el módulo `pam_nologin.so`?

a) Ningún usuario puede iniciar sesión
b) Solo root puede iniciar sesión
c) Solo los usuarios del grupo wheel pueden iniciar sesión
d) El sistema se reinicia automáticamente

<details><summary>Respuesta</summary>

**b) Solo root puede iniciar sesión**

Cuando existe el archivo `/etc/nologin`, el módulo `pam_nologin.so` impide el inicio de sesión de todos los usuarios excepto root. El contenido del archivo se muestra como mensaje a los usuarios rechazados.
</details>

### Pregunta 6

En el archivo `/etc/security/limits.conf`, ¿qué línea limita a un máximo de 50 procesos para todos los miembros del grupo "desarrollo"?

a) desarrollo hard nproc 50
b) @desarrollo hard nproc 50
c) %desarrollo hard nproc 50
d) grupo:desarrollo hard nproc 50

<details><summary>Respuesta</summary>

**b) @desarrollo hard nproc 50**

En `limits.conf`, los grupos se indican con el prefijo `@`. La línea `@desarrollo hard nproc 50` establece un límite duro de 50 procesos para todos los miembros del grupo "desarrollo".
</details>

### Pregunta 7

¿Qué módulo PAM es el sucesor moderno de `pam_cracklib.so` para verificar la calidad de las contraseñas?

a) pam_quality.so
b) pam_pwcheck.so
c) pam_pwquality.so
d) pam_password.so

<details><summary>Respuesta</summary>

**c) pam_pwquality.so**

`pam_pwquality.so` es el reemplazo moderno de `pam_cracklib.so`. Ambos verifican la calidad de las contraseñas, pero `pam_pwquality.so` ofrece más opciones de configuración y es el estándar actual.
</details>

### Pregunta 8

¿Qué hace el flag de control `sufficient` cuando el módulo tiene éxito?

a) Continúa evaluando los demás módulos
b) Detiene la evaluación y devuelve éxito inmediato si ningún módulo required previo ha fallado
c) Registra el éxito pero siempre continúa evaluando
d) Siempre devuelve éxito, independientemente del resultado de módulos anteriores

<details><summary>Respuesta</summary>

**b) Detiene la evaluación y devuelve éxito inmediato si ningún módulo required previo ha fallado**

Cuando un módulo con flag `sufficient` tiene éxito y no hay módulos `required` previos que hayan fallado, la evaluación se detiene y se devuelve éxito. Si falla, simplemente se ignora y se continúa con el siguiente módulo.
</details>

### Pregunta 9

¿Qué módulo PAM permite la integración con SSSD para autenticación centralizada?

a) pam_sssd.so
b) pam_sss.so
c) pam_centrify.so
d) pam_remote.so

<details><summary>Respuesta</summary>

**b) pam_sss.so**

El módulo `pam_sss.so` integra PAM con SSSD (System Security Services Daemon), permitiendo autenticación centralizada contra múltiples backends como LDAP, Active Directory o FreeIPA.
</details>

### Pregunta 10

¿Qué módulo PAM se utiliza para bloquear cuentas después de múltiples intentos fallidos de autenticación en sistemas modernos?

a) pam_lockout.so
b) pam_tally2.so
c) pam_faillock.so
d) pam_block.so

<details><summary>Respuesta</summary>

**c) pam_faillock.so**

`pam_faillock.so` es el módulo moderno para bloquear cuentas tras intentos fallidos de autenticación. Reemplaza a `pam_tally2.so`, que está obsoleto. Se configura con parámetros como `deny=5` (bloquear tras 5 fallos) y `unlock_time=900` (desbloquear tras 900 segundos).
</details>
