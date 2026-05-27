---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "331 - Criptografía"
tema: "331.4 - DNS y criptografía"
subtema: "331.4"
peso: 5
tags:
  - lpic-3
  - tema-331
  - dnssec
  - dane
  - tsig
---

# Ejercicios - 331.4 DNS y Criptografía

### Pregunta 1
¿Qué comando genera una KSK (Key Signing Key) con algoritmo RSASHA256 de 4096 bits para la zona ejemplo.com?

a) `dnssec-keygen -a RSASHA256 -b 4096 -n ZONE ejemplo.com`
b) `dnssec-keygen -a RSASHA256 -b 4096 -n ZONE -f KSK ejemplo.com`
c) `dnssec-keygen -a RSASHA256 -b 4096 -n KSK ejemplo.com`
d) `dnssec-genkey -type KSK -algo RSASHA256 -bits 4096 ejemplo.com`

<details><summary>Respuesta</summary>

**b)** `dnssec-keygen -a RSASHA256 -b 4096 -n ZONE -f KSK ejemplo.com`

La opción `-f KSK` indica que se debe generar una Key Signing Key (con flags=257). Sin `-f KSK`, se genera una ZSK (flags=256). `-n ZONE` especifica que es una clave de zona.
</details>

### Pregunta 2
¿Qué registro DNSSEC se publica en la zona padre para establecer la cadena de confianza?

a) RRSIG
b) DNSKEY
c) DS
d) NSEC

<details><summary>Respuesta</summary>

**c)** DS (Delegation Signer)

El registro DS contiene el hash de la KSK de la zona hija y se publica en la zona padre. Es el enlace que conecta la cadena de confianza entre zonas padre e hija.
</details>

### Pregunta 3
¿Cuál es la principal ventaja de NSEC3 sobre NSEC?

a) NSEC3 cifra las respuestas DNS
b) NSEC3 protege contra la enumeración de zona (zone walking)
c) NSEC3 es más rápido de validar
d) NSEC3 no requiere firma digital

<details><summary>Respuesta</summary>

**b)** NSEC3 protege contra la enumeración de zona (zone walking)

NSEC lista los nombres de dominio en orden, permitiendo recorrer toda la zona. NSEC3 usa hashes de los nombres, haciendo impracticable la enumeración completa de la zona.
</details>

### Pregunta 4
¿Qué comando firma una zona DNS generando registros NSEC3 con salt?

a) `dnssec-signzone -nsec3 -salt "abc123" -o ejemplo.com db.ejemplo.com`
b) `dnssec-signzone -3 "abc123" -o ejemplo.com db.ejemplo.com`
c) `dnssec-signzone --nsec3-salt="abc123" -o ejemplo.com db.ejemplo.com`
d) `dnssec-signzone -N 3 -s "abc123" -o ejemplo.com db.ejemplo.com`

<details><summary>Respuesta</summary>

**b)** `dnssec-signzone -3 "abc123" -o ejemplo.com db.ejemplo.com`

La opción `-3` seguida del salt activa NSEC3 en lugar de NSEC. El salt es una cadena hexadecimal que se añade antes del hash para dificultar ataques de diccionario.
</details>

### Pregunta 5
¿Qué tipo de registro DANE/TLSA con uso=3 (DANE-EE) permite?

a) Validar el certificado del servidor solo mediante la cadena de CA tradicional
b) Autenticar el certificado del servidor directamente por DNS, sin necesidad de CA
c) Cifrar las consultas DNS con el certificado del servidor
d) Revocar certificados a través de DNS

<details><summary>Respuesta</summary>

**b)** Autenticar el certificado del servidor directamente por DNS, sin necesidad de CA

DANE-EE (uso=3) indica que el certificado o clave pública del endpoint está directamente asociado al registro DNS. La validación se realiza contra el registro TLSA en DNS, no contra una CA.
</details>

### Pregunta 6
¿Qué protocolo utiliza claves simétricas compartidas para autenticar transferencias de zona DNS?

a) DNSSEC
b) DANE
c) TSIG
d) DoT

<details><summary>Respuesta</summary>

**c)** TSIG (Transaction Signature)

TSIG utiliza claves simétricas compartidas (HMAC) para autenticar transacciones DNS como transferencias de zona (AXFR/IXFR) y actualizaciones dinámicas entre servidores DNS.
</details>

### Pregunta 7
¿En qué puerto estándar opera DNS-over-TLS (DoT)?

a) 53
b) 443
c) 853
d) 8853

<details><summary>Respuesta</summary>

**c)** 853

DNS-over-TLS utiliza el puerto TCP 853. DNS tradicional usa el puerto 53, y DNS-over-HTTPS usa el puerto 443 (el mismo que HTTPS).
</details>

### Pregunta 8
¿Qué comando se utiliza para generar un registro DS a partir de una clave KSK existente?

a) `dnssec-signzone -ds Kejemplo.com.+008+67890.key`
b) `dnssec-dsfromkey Kejemplo.com.+008+67890.key`
c) `dnssec-keygen -ds Kejemplo.com.+008+67890.key`
d) `dig -ds Kejemplo.com.+008+67890.key`

<details><summary>Respuesta</summary>

**b)** `dnssec-dsfromkey Kejemplo.com.+008+67890.key`

`dnssec-dsfromkey` genera registros DS (Delegation Signer) a partir de un archivo de clave DNSKEY. Estos registros DS deben publicarse en la zona padre.
</details>

### Pregunta 9
¿Qué directiva de Unbound activa la validación DNSSEC?

a) `dnssec-enable: yes`
b) `auto-trust-anchor-file: "/var/lib/unbound/root.key"`
c) `validate-dnssec: true`
d) `dnssec-validation auto`

<details><summary>Respuesta</summary>

**b)** `auto-trust-anchor-file: "/var/lib/unbound/root.key"`

En Unbound, la directiva `auto-trust-anchor-file` especifica el archivo del trust anchor raíz y activa la validación DNSSEC automáticamente. Se obtiene/actualiza con `unbound-anchor`.
</details>

### Pregunta 10
¿Cuál es la diferencia fundamental entre DNS-over-TLS (DoT) y DNS-over-HTTPS (DoH) desde la perspectiva de un firewall?

a) DoT es más seguro que DoH
b) DoT usa un puerto dedicado (853) fácilmente bloqueable; DoH usa el puerto 443, indistinguible del tráfico HTTPS
c) DoH no cifra las consultas DNS
d) DoT no soporta DNSSEC, DoH sí

<details><summary>Respuesta</summary>

**b)** DoT usa un puerto dedicado (853) fácilmente bloqueable; DoH usa el puerto 443, indistinguible del tráfico HTTPS

Un firewall puede bloquear DoT filtrando el puerto 853. DoH es más difícil de bloquear porque comparte el puerto 443 con todo el tráfico HTTPS, haciéndolo prácticamente indistinguible.
</details>
