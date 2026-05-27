---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "335 - Amenazas y Evaluacion de Vulnerabilidades"
tema: "335.1 - Vulnerabilidades comunes y amenazas"
subtema: "335.1"
peso: 2
tags:
  - lpic-3
  - tema-335
  - cve
  - cvss
  - vulnerabilidades
---

# Ejercicios - 335.1 Vulnerabilidades Comunes y Amenazas

### Pregunta 1
¿Que rango de puntuacion CVSS v3.1 se considera severidad "Critica"?

a) 7.0 - 8.9
b) 8.0 - 9.9
c) 9.0 - 10.0
d) 10.0

<details><summary>Respuesta</summary>

**c)** 9.0 - 10.0

En CVSS v3.1, la severidad critica corresponde a puntuaciones de 9.0 a 10.0. Alta es 7.0-8.9, Media es 4.0-6.9, Baja es 0.1-3.9.
</details>

### Pregunta 2
¿Que tipo de vulnerabilidad permite a un atacante inyectar scripts maliciosos que se ejecutan en el navegador de otros usuarios?

a) SQL Injection
b) Buffer Overflow
c) XSS (Cross-Site Scripting)
d) CSRF (Cross-Site Request Forgery)

<details><summary>Respuesta</summary>

**c)** XSS (Cross-Site Scripting)

XSS permite inyectar codigo JavaScript malicioso en paginas web que luego se ejecuta en el navegador de otros usuarios. Puede ser reflected, stored o DOM-based.
</details>

### Pregunta 3
¿Que mecanismo de proteccion del kernel Linux aleatoriza la posicion en memoria de segmentos como stack, heap y librerias?

a) NX bit
b) ASLR (Address Space Layout Randomization)
c) Stack canaries
d) PIE

<details><summary>Respuesta</summary>

**b)** ASLR (Address Space Layout Randomization)

ASLR aleatoriza las direcciones de memoria donde se cargan el stack, heap, librerias compartidas y otros segmentos, dificultando ataques de buffer overflow. Se controla con `kernel.randomize_va_space`.
</details>

### Pregunta 4
¿Que comando aplica solo actualizaciones de seguridad en un sistema Red Hat/CentOS?

a) `yum update --critical`
b) `yum update --security`
c) `yum patch --security-only`
d) `yum upgrade --security-patches`

<details><summary>Respuesta</summary>

**b)** `yum update --security`

La opcion `--security` filtra las actualizaciones para aplicar solo aquellas clasificadas como parches de seguridad, evitando actualizaciones de funcionalidad que podrian introducir cambios no deseados.
</details>

### Pregunta 5
¿Que formato tiene un identificador CVE?

a) CVE:2021:44228
b) CVE-2021-44228
c) CVE/2021/44228
d) CVE.2021.44228

<details><summary>Respuesta</summary>

**b)** CVE-2021-44228

El formato estandar es CVE-AÑO-NUMERO, con guiones como separadores. El año indica cuando se asigno el CVE, y el numero es un identificador secuencial unico.
</details>

### Pregunta 6
Segun OWASP Top 10, ¿que posicion ocupa "Injection" (inyeccion SQL, OS, LDAP)?

a) A01
b) A03
c) A05
d) A07

<details><summary>Respuesta</summary>

**b)** A03

En la version actual del OWASP Top 10, Injection ocupa la posicion A03. A01 es Broken Access Control y A02 es Cryptographic Failures.
</details>

### Pregunta 7
¿Que tipo de escalada de privilegios se produce cuando un usuario normal obtiene acceso root?

a) Escalada horizontal
b) Escalada vertical
c) Escalada lateral
d) Escalada transversal

<details><summary>Respuesta</summary>

**b)** Escalada vertical

La escalada vertical implica obtener privilegios superiores a los que el usuario tiene asignados (ej: de usuario normal a root). La escalada horizontal implica acceder a recursos de otro usuario del mismo nivel de privilegios.
</details>

### Pregunta 8
¿Que comando verifica la integridad de todos los paquetes instalados en un sistema RHEL?

a) `rpm --verify-all`
b) `rpm -Va`
c) `yum verify all`
d) `rpm -checksums`

<details><summary>Respuesta</summary>

**b)** `rpm -Va`

`rpm -Va` (verify all) compara los archivos de cada paquete instalado con la informacion almacenada en la base de datos RPM, mostrando diferencias en tamaño, permisos, propietario, MD5, etc.
</details>

### Pregunta 9
¿Que metrica CVSS indica si la vulnerabilidad puede explotarse remotamente a traves de la red?

a) Attack Complexity: Low
b) Attack Vector: Network
c) Scope: Changed
d) Privileges Required: None

<details><summary>Respuesta</summary>

**b)** Attack Vector: Network

Attack Vector (AV) con valor Network (N) indica que la vulnerabilidad puede explotarse remotamente a traves de la red. Adjacent (A) requiere estar en la misma red, Local (L) requiere acceso local, y Physical (P) requiere acceso fisico.
</details>

### Pregunta 10
¿Que es una condicion de carrera (race condition) en el contexto de seguridad?

a) Un ataque que compite con el antivirus para ejecutar malware
b) Una vulnerabilidad que explota el tiempo entre la verificacion y el uso de un recurso (TOCTOU)
c) Un ataque de fuerza bruta que intenta multiples contraseñas simultaneamente
d) Una vulnerabilidad que solo aparece bajo alta carga del sistema

<details><summary>Respuesta</summary>

**b)** Una vulnerabilidad que explota el tiempo entre la verificacion y el uso de un recurso (TOCTOU)

TOCTOU (Time of Check, Time of Use) es un tipo de race condition donde un atacante modifica un recurso entre el momento en que se verifica su estado y el momento en que se usa, explotando esa ventana temporal.
</details>
