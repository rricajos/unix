---
title: "208.2 - Apache HTTPS"
tags: [lpic-2, examen-202, tema-208, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.2"
---

# 208.2 - Ejercicios: Apache HTTPS

### Pregunta 1
¿Qué directiva de Apache especifica la ubicación de la clave privada del servidor SSL/TLS?

a) SSLPrivateKey
b) SSLCertificateKeyFile
c) SSLKeyFile
d) SSLServerKey

<details>
<summary>Respuesta</summary>

**b) SSLCertificateKeyFile**

La directiva `SSLCertificateKeyFile` indica la ruta al archivo que contiene la clave privada del servidor. Esta clave debe corresponder al certificado especificado en `SSLCertificateFile`.
</details>

---

### Pregunta 2
¿Qué comando de OpenSSL genera una solicitud de firma de certificado (CSR) a partir de una clave privada existente?

a) openssl csr -new -key servidor.key -out servidor.csr
b) openssl req -new -key servidor.key -out servidor.csr
c) openssl x509 -req -key servidor.key -out servidor.csr
d) openssl genrsa -csr -key servidor.key -out servidor.csr

<details>
<summary>Respuesta</summary>

**b) openssl req -new -key servidor.key -out servidor.csr**

El subcomando `req` de OpenSSL se utiliza para crear y procesar solicitudes de certificado. La opción `-new` indica que se genera una nueva solicitud, y `-key` especifica la clave privada existente a utilizar.
</details>

---

### Pregunta 3
¿Qué extensión de TLS permite alojar múltiples sitios HTTPS con diferentes certificados en una misma dirección IP?

a) ALPN
b) OCSP
c) SNI
d) HSTS

<details>
<summary>Respuesta</summary>

**c) SNI**

SNI (Server Name Indication) es una extensión de TLS que permite al cliente indicar el nombre de host durante el handshake TLS. Esto permite al servidor seleccionar el certificado correcto antes de completar la conexión, posibilitando múltiples sitios HTTPS en una sola IP.
</details>

---

### Pregunta 4
¿Cuál de los siguientes protocolos se considera seguro para uso en producción en la actualidad?

a) SSLv3
b) TLSv1.0
c) TLSv1.1
d) TLSv1.2

<details>
<summary>Respuesta</summary>

**d) TLSv1.2**

TLS 1.2 y TLS 1.3 son las únicas versiones consideradas seguras actualmente. SSLv2, SSLv3, TLS 1.0 y TLS 1.1 están obsoletos y contienen vulnerabilidades conocidas. Deben deshabilitarse en la configuración de Apache.
</details>

---

### Pregunta 5
¿Qué archivo de Let's Encrypt debe usarse en la directiva `SSLCertificateFile` de Apache?

a) cert.pem
b) chain.pem
c) fullchain.pem
d) privkey.pem

<details>
<summary>Respuesta</summary>

**c) fullchain.pem**

El archivo `fullchain.pem` contiene el certificado del servidor junto con los certificados intermedios de la CA. Desde Apache 2.4.8, se recomienda usar este archivo en `SSLCertificateFile` en lugar de especificar los certificados intermedios por separado.
</details>

---

### Pregunta 6
¿Qué hace la directiva `SSLHonorCipherOrder on` en Apache?

a) Ordena los cipher suites alfabéticamente
b) Permite al cliente elegir el cipher suite preferido
c) Hace que el servidor determine el cipher suite a utilizar según su orden de preferencia
d) Deshabilita los cipher suites débiles automáticamente

<details>
<summary>Respuesta</summary>

**c) Hace que el servidor determine el cipher suite a utilizar según su orden de preferencia**

Cuando `SSLHonorCipherOrder` está habilitado, el servidor elige el primer cipher suite de su lista que sea compatible con el cliente, en lugar de dejar que el cliente elija. Esto permite al administrador priorizar los cipher suites más seguros.
</details>

---

### Pregunta 7
¿Qué comando de Certbot simula el proceso de renovación de certificados sin aplicar cambios reales?

a) certbot renew --test
b) certbot renew --simulate
c) certbot renew --dry-run
d) certbot test-renew

<details>
<summary>Respuesta</summary>

**c) certbot renew --dry-run**

La opción `--dry-run` ejecuta el proceso de renovación de forma simulada, verificando que la configuración y la comunicación con los servidores de Let's Encrypt funcionan correctamente, sin modificar los certificados reales.
</details>

---

### Pregunta 8
¿Cuál es el propósito principal de HSTS (HTTP Strict Transport Security)?

a) Cifrar las cookies del navegador
b) Indicar al navegador que siempre debe conectarse mediante HTTPS
c) Redirigir automáticamente las peticiones HTTP a HTTPS en el servidor
d) Verificar la validez del certificado SSL del servidor

<details>
<summary>Respuesta</summary>

**b) Indicar al navegador que siempre debe conectarse mediante HTTPS**

HSTS es una cabecera HTTP que instruye al navegador a conectarse siempre mediante HTTPS durante el período especificado en `max-age`. A diferencia de una redirección del servidor, HSTS funciona en el lado del cliente, evitando incluso la primera petición HTTP insegura en visitas posteriores.
</details>

---

### Pregunta 9
¿Qué ventaja proporciona OCSP Stapling respecto a la verificación OCSP tradicional?

a) Elimina la necesidad de usar certificados firmados por una CA
b) Permite usar certificados autofirmados en producción
c) El servidor envía la respuesta OCSP junto con el certificado, evitando que el cliente contacte a la CA
d) Cifra la comunicación entre el cliente y el servidor OCSP

<details>
<summary>Respuesta</summary>

**c) El servidor envía la respuesta OCSP junto con el certificado, evitando que el cliente contacte a la CA**

Con OCSP Stapling, el servidor web obtiene periódicamente la respuesta OCSP de la CA y la envía al cliente durante el handshake TLS. Esto mejora el rendimiento (menos latencia), la privacidad del usuario y la fiabilidad (no depende de la disponibilidad del servidor OCSP).
</details>

---

### Pregunta 10
Un administrador necesita redirigir todo el tráfico HTTP a HTTPS usando mod_rewrite. ¿Cuál es la configuración correcta dentro de un VirtualHost en el puerto 80?

a) `RewriteRule ^(.*)$ https://%{SERVER_NAME}$1 [R=302,L]`
b) `RewriteEngine On` seguido de `RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]`
c) `Redirect https://%{HTTP_HOST}`
d) `SSLRedirect On`

<details>
<summary>Respuesta</summary>

**b) `RewriteEngine On` seguido de `RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]`**

Para usar mod_rewrite es necesario primero activar el motor con `RewriteEngine On`. La regla utiliza `%{HTTP_HOST}` para mantener el nombre de host original, `R=301` para una redirección permanente y `L` para que sea la última regla procesada. El código 301 es preferible al 302 para redirecciones permanentes de HTTP a HTTPS.
</details>

---
