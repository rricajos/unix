---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "331 - Criptografía"
tema: "331.2 - Certificados para cifrado, firma y autenticación"
subtema: "331.2"
peso: 4
tags:
  - lpic-3
  - tema-331
  - gnupg
  - gpg
  - cifrado
  - firma-digital
---

# Ejercicios - 331.2 Certificados para Cifrado, Firma y Autenticación

### Pregunta 1
¿Qué comando exporta la clave pública de un usuario en formato ASCII (blindado)?

a) `gpg2 --output pub.asc --export-public usuario@ej.com`
b) `gpg2 --export --armor usuario@ej.com > pub.asc`
c) `gpg2 --export --text usuario@ej.com > pub.asc`
d) `gpg2 --dump-key --ascii usuario@ej.com > pub.asc`

<details><summary>Respuesta</summary>

**b)** `gpg2 --export --armor usuario@ej.com > pub.asc`

La opción `--armor` (o `-a`) produce salida en formato ASCII Base64, adecuada para enviar por correo electrónico o publicar en texto plano.
</details>

### Pregunta 2
En el modelo Web of Trust de GPG, ¿cuántas firmas de confianza "marginal" se necesitan por defecto para considerar una clave como válida?

a) 1
b) 2
c) 3
d) 5

<details><summary>Respuesta</summary>

**c)** 3

Por defecto, GPG requiere al menos 3 firmas de claves con confianza "marginal" o 1 firma de una clave con confianza "full" para considerar una clave como válida.
</details>

### Pregunta 3
¿Qué comando crea una firma separada (detached) de un archivo sin modificar el original?

a) `gpg2 --sign archivo.txt`
b) `gpg2 --clearsign archivo.txt`
c) `gpg2 --detach-sign archivo.txt`
d) `gpg2 --separate-sign archivo.txt`

<details><summary>Respuesta</summary>

**c)** `gpg2 --detach-sign archivo.txt`

`--detach-sign` crea un archivo de firma separado (archivo.txt.sig) sin modificar el archivo original. Esto es ideal para distribuir software con su firma.
</details>

### Pregunta 4
¿Cuál es la principal diferencia entre GPG/OpenPGP y S/MIME?

a) GPG solo permite cifrado simétrico, S/MIME solo asimétrico
b) GPG usa un modelo de confianza descentralizado (Web of Trust), S/MIME usa jerárquico (PKI/CA)
c) S/MIME no soporta firmas digitales
d) GPG es más rápido que S/MIME en todos los casos

<details><summary>Respuesta</summary>

**b)** GPG usa un modelo de confianza descentralizado (Web of Trust), S/MIME usa jerárquico (PKI/CA)

GPG/OpenPGP utiliza la Web of Trust donde los usuarios se firman mutuamente las claves. S/MIME se basa en certificados X.509 emitidos por Autoridades de Certificación en una estructura jerárquica.
</details>

### Pregunta 5
¿Qué archivo almacena la configuración del agente GPG, incluyendo el tiempo de caché de passphrases?

a) `~/.gnupg/gpg.conf`
b) `~/.gnupg/gpg-agent.conf`
c) `/etc/gpg/agent.conf`
d) `~/.gnupg/agent.conf`

<details><summary>Respuesta</summary>

**b)** `~/.gnupg/gpg-agent.conf`

El archivo `gpg-agent.conf` contiene directivas como `default-cache-ttl` y `max-cache-ttl` que controlan cuánto tiempo el agente mantiene las passphrases en caché.
</details>

### Pregunta 6
Un administrador necesita cifrar un archivo para dos destinatarios diferentes. ¿Qué comando es correcto?

a) `gpg2 --encrypt --multi-recipient user1@ej.com,user2@ej.com archivo.txt`
b) `gpg2 --encrypt -r user1@ej.com -r user2@ej.com archivo.txt`
c) `gpg2 --encrypt --recipients "user1@ej.com user2@ej.com" archivo.txt`
d) `gpg2 --encrypt --to user1@ej.com --to user2@ej.com archivo.txt`

<details><summary>Respuesta</summary>

**b)** `gpg2 --encrypt -r user1@ej.com -r user2@ej.com archivo.txt`

Se utiliza la opción `-r` (o `--recipient`) múltiples veces, una por cada destinatario. GPG cifrará el archivo de forma que cualquiera de los destinatarios pueda descifrarlo con su clave privada.
</details>

### Pregunta 7
¿Qué algoritmo hash se considera actualmente como el estándar mínimo recomendado para firmas digitales?

a) MD5
b) SHA-1
c) SHA-256
d) CRC32

<details><summary>Respuesta</summary>

**c)** SHA-256

SHA-256 es el estándar mínimo recomendado actualmente. MD5 está completamente roto, SHA-1 se considera obsoleto. SHA-256 y SHA-512 son las opciones recomendadas.
</details>

### Pregunta 8
¿Qué comando publica una clave pública en un servidor de claves?

a) `gpg2 --keyserver hkps://keys.openpgp.org --upload-key ID`
b) `gpg2 --keyserver hkps://keys.openpgp.org --send-keys ID`
c) `gpg2 --keyserver hkps://keys.openpgp.org --publish ID`
d) `gpg2 --push-key hkps://keys.openpgp.org ID`

<details><summary>Respuesta</summary>

**b)** `gpg2 --keyserver hkps://keys.openpgp.org --send-keys ID`

`--send-keys` envía la clave pública identificada por su ID al servidor de claves especificado con `--keyserver`. El protocolo `hkps://` utiliza HTTPS.
</details>

### Pregunta 9
¿Qué opción de `gpg2 --clearsign` produce un archivo que permite leer el texto original sin necesidad de GPG?

a) Es una característica inherente de `--clearsign`; el texto es legible dentro del archivo firmado
b) Se necesita la opción adicional `--readable`
c) `--clearsign` no permite ver el texto original sin GPG
d) Se debe usar `--clearsign --plaintext`

<details><summary>Respuesta</summary>

**a)** Es una característica inherente de `--clearsign`; el texto es legible dentro del archivo firmado

`--clearsign` produce una firma "en claro" donde el texto original es visible directamente, enmarcado por cabeceras PGP. La firma se añade al final, permitiendo verificar la integridad sin perder legibilidad.
</details>

### Pregunta 10
¿Qué comando de OpenSSL se utiliza para firmar un correo electrónico con S/MIME?

a) `openssl cms -sign -in msg.txt -signer cert.pem -inkey key.pem`
b) `openssl smime -sign -in msg.txt -signer cert.pem -inkey key.pem -out firmado.eml`
c) `openssl email -sign -cert cert.pem -key key.pem msg.txt`
d) `openssl sign -smime -in msg.txt -certificate cert.pem`

<details><summary>Respuesta</summary>

**b)** `openssl smime -sign -in msg.txt -signer cert.pem -inkey key.pem -out firmado.eml`

El subcomando `smime` de OpenSSL con la opción `-sign` firma un mensaje. Se necesita el certificado (`-signer`) y la clave privada (`-inkey`). La opción `a)` con `cms` también es válida técnicamente pero `smime` es la respuesta más directa para el examen.
</details>
