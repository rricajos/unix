---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "331 - Criptografía"
tema: "331.1 - Certificados X.509 y PKI"
subtema: "331.1"
peso: 5
tags:
  - lpic-3
  - tema-331
  - x509
  - pki
  - openssl
---

# Ejercicios - 331.1 Certificados X.509 y PKI

### Pregunta 1
¿Qué comando genera una clave RSA de 4096 bits cifrada con AES-256?

a) `openssl rsa -genkey -aes256 -bits 4096 -out clave.key`
b) `openssl genrsa -aes256 -out clave.key 4096`
c) `openssl genpkey -rsa -aes256 4096 -out clave.key`
d) `openssl key -generate -rsa 4096 -cipher aes256 -out clave.key`

<details><summary>Respuesta</summary>

**b)** `openssl genrsa -aes256 -out clave.key 4096`

`openssl genrsa` es el subcomando para generar claves RSA. `-aes256` cifra la clave con una passphrase, y el tamaño en bits se indica al final.
</details>

### Pregunta 2
¿Qué componente de la PKI es responsable de verificar la identidad del solicitante antes de emitir un certificado?

a) CA (Autoridad de Certificación)
b) RA (Autoridad de Registro)
c) CRL (Lista de Revocación de Certificados)
d) OCSP (Online Certificate Status Protocol)

<details><summary>Respuesta</summary>

**b)** RA (Autoridad de Registro)

La Autoridad de Registro (RA) verifica la identidad de los solicitantes antes de que la CA emita el certificado. Es el intermediario entre el usuario y la CA.
</details>

### Pregunta 3
¿Qué comando se utiliza para verificar el estado de revocación de un certificado en tiempo real?

a) `openssl crl -check -cert servidor.pem`
b) `openssl verify -crl_check -CAfile ca.pem cert.pem`
c) `openssl ocsp -issuer ca.pem -cert servidor.pem -url http://ocsp.ejemplo.com`
d) `openssl revoke -status servidor.pem`

<details><summary>Respuesta</summary>

**c)** `openssl ocsp -issuer ca.pem -cert servidor.pem -url http://ocsp.ejemplo.com`

OCSP permite verificar en tiempo real el estado de revocación de un certificado individual, a diferencia de las CRL que son listas completas descargadas periódicamente.
</details>

### Pregunta 4
¿Qué formato de certificado es binario (ASN.1) y no utiliza codificación Base64?

a) PEM
b) DER
c) PKCS#7
d) PFX

<details><summary>Respuesta</summary>

**b)** DER

DER (Distinguished Encoding Rules) es el formato binario nativo ASN.1. PEM es la versión Base64 de DER con cabeceras `-----BEGIN CERTIFICATE-----`.
</details>

### Pregunta 5
¿Qué comando convierte un certificado PEM y su clave privada a formato PKCS#12?

a) `openssl x509 -export -in cert.pem -inkey clave.key -out cert.p12`
b) `openssl pkcs12 -convert -in cert.pem -key clave.key -out cert.p12`
c) `openssl pkcs12 -export -in cert.pem -inkey clave.key -out cert.p12`
d) `openssl p12 -create -cert cert.pem -key clave.key -out cert.p12`

<details><summary>Respuesta</summary>

**c)** `openssl pkcs12 -export -in cert.pem -inkey clave.key -out cert.p12`

El subcomando `pkcs12` con la opción `-export` crea un archivo PKCS#12 que contiene tanto el certificado como la clave privada.
</details>

### Pregunta 6
Un administrador necesita diagnosticar la cadena de certificados de un servidor web. ¿Qué comando mostrará todos los certificados de la cadena?

a) `openssl s_client -connect servidor:443 -showcerts`
b) `openssl x509 -chain -in servidor:443`
c) `openssl verify -show_chain servidor:443`
d) `openssl s_client -connect servidor:443 -certchain`

<details><summary>Respuesta</summary>

**a)** `openssl s_client -connect servidor:443 -showcerts`

`openssl s_client` con `-showcerts` muestra todos los certificados de la cadena enviados por el servidor durante el handshake TLS.
</details>

### Pregunta 7
¿En qué directorio se almacenan las CAs de confianza adicionales en sistemas Red Hat/CentOS para que `update-ca-trust` las incorpore?

a) `/etc/ssl/certs/`
b) `/etc/pki/ca-trust/source/anchors/`
c) `/usr/share/ca-certificates/`
d) `/etc/pki/CA/certs/`

<details><summary>Respuesta</summary>

**b)** `/etc/pki/ca-trust/source/anchors/`

En sistemas RHEL/CentOS, se colocan los certificados CA adicionales en `/etc/pki/ca-trust/source/anchors/` y luego se ejecuta `update-ca-trust` para actualizar el almacén del sistema.
</details>

### Pregunta 8
¿Qué extensión X.509 v3 indica si un certificado puede actuar como Autoridad de Certificación?

a) Key Usage
b) Subject Alternative Name (SAN)
c) Basic Constraints
d) CRL Distribution Points

<details><summary>Respuesta</summary>

**c)** Basic Constraints

La extensión `basicConstraints` con el valor `CA:TRUE` indica que el certificado puede actuar como CA y firmar otros certificados. Cuando es `CA:FALSE`, es un certificado de entidad final.
</details>

### Pregunta 9
¿Qué archivo de la CA contiene la base de datos de todos los certificados emitidos?

a) `/etc/pki/CA/serial`
b) `/etc/pki/CA/index.txt`
c) `/etc/pki/CA/crlnumber`
d) `/etc/pki/CA/database.db`

<details><summary>Respuesta</summary>

**b)** `/etc/pki/CA/index.txt`

El archivo `index.txt` es la base de datos de texto plano que contiene información sobre todos los certificados emitidos por la CA, incluyendo su estado (válido, revocado, expirado).
</details>

### Pregunta 10
Un administrador ejecuta: `openssl req -x509 -newkey rsa:4096 -keyout clave.key -out cert.pem -days 365 -nodes`. ¿Qué efecto tiene la opción `-nodes`?

a) No incluye extensiones de nodo en el certificado
b) No cifra la clave privada con passphrase
c) Genera el certificado sin número de serie
d) Omite la verificación de DNS del nombre común

<details><summary>Respuesta</summary>

**b)** No cifra la clave privada con passphrase

La opción `-nodes` (no DES) indica que la clave privada generada no será cifrada con passphrase. Esto es útil para servicios que arrancan automáticamente, pero reduce la seguridad de la clave.
</details>
