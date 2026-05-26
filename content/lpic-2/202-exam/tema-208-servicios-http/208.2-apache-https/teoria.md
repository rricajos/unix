---
title: "208.2 - Apache HTTPS"
tags: [lpic-2, examen-202, tema-208, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.2"
---

# 208.2 - Apache HTTPS

## Peso: 3

## Introducción

HTTPS (HTTP sobre SSL/TLS) proporciona comunicación cifrada entre el cliente y el servidor web. La configuración de SSL/TLS en Apache es una competencia esencial para cualquier administrador de sistemas Linux. Este subtema cubre la gestión de certificados, la configuración de `mod_ssl` y las mejores prácticas de seguridad.

## Conceptos de SSL/TLS

### Diferencias entre SSL y TLS

- **SSL** (Secure Sockets Layer): Protocolo original, versiones 2.0 y 3.0 (ambas obsoletas e inseguras).
- **TLS** (Transport Layer Security): Sucesor de SSL. Versiones 1.0, 1.1 (obsoletas), 1.2 y 1.3 (actuales y recomendadas).

> **Para el examen:** Aunque coloquialmente se sigue hablando de "SSL", en la práctica se usa TLS. Las versiones seguras son TLS 1.2 y TLS 1.3. SSLv2 y SSLv3 deben estar deshabilitados siempre.

### Funcionamiento del handshake TLS

1. El cliente se conecta al servidor y envía las versiones de TLS y cipher suites soportadas.
2. El servidor selecciona la versión de TLS y el cipher suite, y envía su certificado.
3. El cliente verifica el certificado contra las CAs de confianza.
4. Se establece el intercambio de claves y se genera una clave de sesión simétrica.
5. La comunicación se cifra con la clave de sesión.

## Tipos de certificados

### Certificado autofirmado (self-signed)

```bash
# Generar clave privada y certificado autofirmado en un solo paso
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/servidor.key \
    -out /etc/ssl/certs/servidor.crt

# Generar clave privada por separado
openssl genrsa -out /etc/ssl/private/servidor.key 2048
```

### Solicitud de firma de certificado (CSR)

```bash
# Generar CSR a partir de una clave privada existente
openssl req -new -key /etc/ssl/private/servidor.key \
    -out /etc/ssl/certs/servidor.csr

# Generar clave privada y CSR simultáneamente
openssl req -new -newkey rsa:2048 -nodes \
    -keyout /etc/ssl/private/servidor.key \
    -out /etc/ssl/certs/servidor.csr
```

### Verificar certificados y claves

```bash
# Ver información del certificado
openssl x509 -in servidor.crt -text -noout

# Verificar que la clave privada coincide con el certificado
openssl x509 -noout -modulus -in servidor.crt | openssl md5
openssl rsa -noout -modulus -in servidor.key | openssl md5

# Ver información del CSR
openssl req -in servidor.csr -text -noout
```

> **Para el examen:** Un CSR (Certificate Signing Request) contiene la clave pública y la información del solicitante. Se envía a una CA para que lo firme y emita el certificado. La clave privada nunca se envía a la CA.

## Configuración de mod_ssl en Apache

### Habilitar mod_ssl

```bash
# Debian/Ubuntu
a2enmod ssl
systemctl restart apache2

# Red Hat/CentOS
yum install mod_ssl
systemctl restart httpd
```

### Configuración de VirtualHost HTTPS

```apache
<VirtualHost *:443>
    ServerName www.ejemplo.com
    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/servidor.crt
    SSLCertificateKeyFile /etc/ssl/private/servidor.key
    SSLCACertificateFile /etc/ssl/certs/ca-bundle.crt

    # Protocolos permitidos
    SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1

    # Cipher suites
    SSLCipherSuite HIGH:!aNULL:!MD5:!3DES
    SSLHonorCipherOrder on

    # Cabeceras de seguridad
    Header always set Strict-Transport-Security "max-age=63072000"
</VirtualHost>
```

### Directivas SSL principales

| Directiva | Descripción |
|---|---|
| `SSLEngine on` | Activa SSL/TLS para el VirtualHost |
| `SSLCertificateFile` | Ruta al certificado del servidor |
| `SSLCertificateKeyFile` | Ruta a la clave privada del servidor |
| `SSLCACertificateFile` | Ruta al certificado de la CA (cadena de confianza) |
| `SSLCertificateChainFile` | Certificados intermedios (obsoleto en Apache 2.4.8+) |
| `SSLProtocol` | Versiones de protocolo SSL/TLS permitidas |
| `SSLCipherSuite` | Lista de cipher suites permitidos |
| `SSLHonorCipherOrder` | El servidor determina el cipher suite preferido |

> **Para el examen:** `SSLCertificateChainFile` fue eliminado en Apache 2.4.8. Desde esa versión, los certificados intermedios se incluyen en el mismo archivo referenciado por `SSLCertificateFile`.

## Let's Encrypt y Certbot

Let's Encrypt es una autoridad certificadora gratuita y automatizada. Certbot es el cliente oficial para obtener y renovar certificados.

### Instalación y uso de Certbot

```bash
# Instalar certbot
apt install certbot python3-certbot-apache

# Obtener certificado y configurar Apache automáticamente
certbot --apache -d www.ejemplo.com -d ejemplo.com

# Obtener solo el certificado sin modificar la configuración
certbot certonly --webroot -w /var/www/html -d www.ejemplo.com

# Renovar todos los certificados
certbot renew

# Probar la renovación sin aplicarla
certbot renew --dry-run
```

### Ubicación de certificados de Let's Encrypt

```
/etc/letsencrypt/live/www.ejemplo.com/
├── cert.pem        # Certificado del servidor
├── chain.pem       # Certificados intermedios
├── fullchain.pem   # Certificado + intermedios (usar este en SSLCertificateFile)
└── privkey.pem     # Clave privada
```

### Renovación automática

```bash
# Certbot instala un temporizador systemd o tarea cron
systemctl list-timers | grep certbot

# O en /etc/cron.d/certbot
0 */12 * * * root certbot renew --quiet
```

## SNI (Server Name Indication)

SNI es una extensión de TLS que permite al cliente indicar el nombre de host al que se conecta durante el handshake. Esto permite alojar múltiples sitios HTTPS en una sola dirección IP.

```apache
# Múltiples VirtualHosts HTTPS en la misma IP gracias a SNI
<VirtualHost *:443>
    ServerName sitio1.ejemplo.com
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/sitio1.crt
    SSLCertificateKeyFile /etc/ssl/private/sitio1.key
</VirtualHost>

<VirtualHost *:443>
    ServerName sitio2.ejemplo.com
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/sitio2.crt
    SSLCertificateKeyFile /etc/ssl/private/sitio2.key
</VirtualHost>
```

> **Para el examen:** SNI es necesario para alojar múltiples sitios HTTPS con diferentes certificados en una misma dirección IP. Sin SNI, solo se podía tener un certificado por IP. Todos los navegadores modernos soportan SNI.

## HSTS (HTTP Strict Transport Security)

HSTS indica al navegador que siempre debe usar HTTPS para conectarse al sitio.

```apache
# Habilitar HSTS
<VirtualHost *:443>
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
</VirtualHost>
```

- **max-age**: Tiempo en segundos que el navegador recordará usar HTTPS (63072000 = 2 años).
- **includeSubDomains**: Aplica también a todos los subdominios.
- **preload**: Permite incluir el dominio en la lista de precarga HSTS de los navegadores.

## Redirección HTTP a HTTPS

```apache
# Método 1: Con mod_rewrite
<VirtualHost *:80>
    ServerName www.ejemplo.com
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

# Método 2: Con Redirect
<VirtualHost *:80>
    ServerName www.ejemplo.com
    Redirect permanent / https://www.ejemplo.com/
</VirtualHost>
```

## OCSP Stapling

OCSP Stapling permite al servidor obtener y enviar la respuesta OCSP junto con el certificado, evitando que el cliente tenga que contactar a la CA para verificar la revocación del certificado.

```apache
SSLUseStapling on
SSLStaplingCache shmcb:/tmp/stapling_cache(128000)
SSLStaplingResponderTimeout 5
SSLStaplingReturnResponderErrors off
```

> **Para el examen:** OCSP Stapling mejora el rendimiento y la privacidad. Sin stapling, el navegador del cliente debe contactar directamente al servidor OCSP de la CA, lo que añade latencia y revela al CA qué sitios visita el usuario.

## Cipher Suites y protocolos

### Configuración recomendada para seguridad

```apache
# Deshabilitar protocolos inseguros
SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1

# Solo permitir cipher suites fuertes
SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384

# TLS 1.3 tiene sus propios cipher suites
SSLCipherSuite TLSv1.3 TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256

# El servidor decide el orden de preferencia de cipher suites
SSLHonorCipherOrder on
```

### Verificar la configuración SSL

```bash
# Probar conexión SSL desde la línea de comandos
openssl s_client -connect www.ejemplo.com:443 -servername www.ejemplo.com

# Verificar protocolos soportados
openssl s_client -connect www.ejemplo.com:443 -tls1_2
openssl s_client -connect www.ejemplo.com:443 -tls1_3
```

## Autenticación con certificado de cliente

```apache
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/servidor.crt
    SSLCertificateKeyFile /etc/ssl/private/servidor.key
    SSLCACertificateFile /etc/ssl/certs/ca-clientes.crt

    # Requerir certificado de cliente
    SSLVerifyClient require
    SSLVerifyDepth 2
</VirtualHost>
```

> **Para el examen:** La autenticación con certificado de cliente proporciona autenticación mutua (mTLS). El servidor verifica el certificado del cliente contra la CA especificada en `SSLCACertificateFile`.
