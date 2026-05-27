---
title: "207.3 - Seguridad DNS"
tags: [lpic-2, examen-202, tema-207, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.3"
---

# 207.3 - Ejercicios: Seguridad DNS

### Pregunta 1

¿Cual es la funcion principal de DNSSEC?

a) Cifrar las consultas DNS para garantizar confidencialidad
b) Proporcionar autenticacion e integridad de las respuestas DNS
c) Limitar la tasa de consultas DNS para prevenir ataques DDoS
d) Restringir el acceso al servidor DNS mediante ACLs

<details><summary>Respuesta</summary>

**b) Proporcionar autenticacion e integridad de las respuestas DNS**

DNSSEC garantiza que las respuestas DNS no han sido modificadas (integridad) y que provienen de una fuente legitima (autenticacion) mediante firmas criptograficas. DNSSEC NO proporciona cifrado ni confidencialidad. Para cifrar las consultas DNS se utilizan tecnologias como DNS over TLS (DoT) o DNS over HTTPS (DoH).

</details>

### Pregunta 2

¿Que tipo de clave DNSSEC se utiliza para firmar los registros de datos de una zona (A, MX, NS, etc.)?

a) KSK (Key Signing Key)
b) ZSK (Zone Signing Key)
c) TSK (Transfer Signing Key)
d) RSK (Record Signing Key)

<details><summary>Respuesta</summary>

**b) ZSK (Zone Signing Key)**

La ZSK (Zone Signing Key) se utiliza para firmar los registros de datos de la zona, como A, MX, NS, etc. La KSK (Key Signing Key) solo firma el conjunto de registros DNSKEY. Esta separacion permite rotar la ZSK con frecuencia sin necesidad de actualizar el registro DS en la zona padre.

</details>

### Pregunta 3

¿Que registro DNSSEC se publica en la zona PADRE para vincular la cadena de confianza con la zona hija?

a) DNSKEY
b) RRSIG
c) DS
d) NSEC

<details><summary>Respuesta</summary>

**c) DS (Delegation Signer)**

El registro DS se publica en la zona padre y contiene un hash de la KSK de la zona hija. Esto establece la cadena de confianza: el resolver verifica la firma de la zona padre, obtiene el DS, y lo usa para validar la DNSKEY de la zona hija.

</details>

### Pregunta 4

¿Que mejora aporta NSEC3 respecto a NSEC?

a) NSEC3 proporciona cifrado de las respuestas
b) NSEC3 impide la enumeracion de la zona (zone walking) usando hashes
c) NSEC3 es mas rapido en la verificacion de firmas
d) NSEC3 permite firmas mas pequenas

<details><summary>Respuesta</summary>

**b) NSEC3 impide la enumeracion de la zona (zone walking) usando hashes**

NSEC enumera los nombres existentes en la zona en orden, lo que permite a un atacante "caminar" la zona completa descubriendo todos los nombres. NSEC3 soluciona este problema reemplazando los nombres reales por hashes criptograficos salteados, haciendo impracticable la enumeracion.

</details>

### Pregunta 5

¿Que protocolo utiliza TSIG para autenticar las transacciones DNS?

a) Criptografia asimetrica (RSA)
b) Criptografia simetrica con clave compartida (HMAC)
c) Certificados X.509
d) Autenticacion basada en tokens OAuth

<details><summary>Respuesta</summary>

**b) Criptografia simetrica con clave compartida (HMAC)**

TSIG (Transaction Signatures) utiliza criptografia simetrica basada en HMAC (Hash-based Message Authentication Code) con una clave secreta compartida entre ambos servidores. Los algoritmos comunes son hmac-sha256 y hmac-sha512. La misma clave debe estar configurada en ambos extremos de la comunicacion.

</details>

### Pregunta 6

¿Cual es el proposito principal de ejecutar BIND en un entorno chroot?

a) Mejorar el rendimiento del servidor DNS
b) Habilitar DNSSEC automaticamente
c) Limitar el acceso del proceso named a un directorio restringido, reduciendo el impacto de vulnerabilidades
d) Permitir ejecutar multiples instancias de BIND simultaneamente

<details><summary>Respuesta</summary>

**c) Limitar el acceso del proceso named a un directorio restringido, reduciendo el impacto de vulnerabilidades**

El chroot confina el proceso `named` en un directorio aislado. Si un atacante explota una vulnerabilidad en BIND, solo tendria acceso a los archivos dentro del directorio chroot, no al resto del sistema de archivos. La opcion `-t` de named especifica el directorio chroot.

</details>

### Pregunta 7

En una configuracion de Split DNS con views en BIND, ¿que directiva determina que clientes son atendidos por cada vista?

a) `allow-query`
b) `match-clients`
c) `allow-recursion`
d) `client-filter`

<details><summary>Respuesta</summary>

**b) `match-clients`**

La directiva `match-clients` dentro de un bloque `view` determina que clientes seran atendidos por esa vista, basandose en su direccion IP. Las vistas se evaluan en orden y se usa la primera que coincida. Es importante recordar que cuando se usan views, TODAS las zonas deben estar dentro de una view.

</details>

### Pregunta 8

¿Que flag en la respuesta de `dig` indica que los datos han sido autenticados mediante DNSSEC?

a) `aa` (Authoritative Answer)
b) `tc` (Truncated)
c) `ad` (Authenticated Data)
d) `cd` (Checking Disabled)

<details><summary>Respuesta</summary>

**c) `ad` (Authenticated Data)**

El flag `ad` en la respuesta de dig indica que el resolver recursivo ha verificado satisfactoriamente la cadena de firmas DNSSEC para esa respuesta. El flag `aa` indica que la respuesta proviene de un servidor autoritativo (pero no necesariamente verificada por DNSSEC). El flag `cd` indica que la verificacion DNSSEC fue deshabilitada por el cliente.

</details>

### Pregunta 9

¿Que parametro de rate limiting en BIND permite que algunos clientes reciban una respuesta truncada (TC) en lugar de ser completamente bloqueados?

a) `window`
b) `responses-per-second`
c) `slip`
d) `threshold`

<details><summary>Respuesta</summary>

**c) `slip`**

El parametro `slip` determina con que frecuencia se envia una respuesta truncada (con el flag TC) a clientes afectados por el rate limiting, en lugar de simplemente descartar la consulta. Una respuesta TC indica al cliente que debe reintentar la consulta via TCP, lo que ayuda a los clientes legitimos a obtener sus respuestas mientras dificulta los ataques de amplificacion.

</details>

### Pregunta 10

¿Que comando genera una clave TSIG para autenticar transferencias de zona entre servidores BIND?

a) `dnssec-keygen -a hmac-sha256`
b) `tsig-keygen -a hmac-sha256 nombre-clave`
c) `rndc-keygen hmac-sha256`
d) `bind-keygen --tsig nombre-clave`

<details><summary>Respuesta</summary>

**b) `tsig-keygen -a hmac-sha256 nombre-clave`**

El comando `tsig-keygen` genera una clave TSIG en el formato listo para incluir en `named.conf`. La salida incluye el bloque `key` completo con el nombre, algoritmo y secreto en base64. Tambien se puede usar `ddns-confgen` para generar claves TSIG. `dnssec-keygen` se usa para claves DNSSEC (asimetricas), no para TSIG.

</details>
