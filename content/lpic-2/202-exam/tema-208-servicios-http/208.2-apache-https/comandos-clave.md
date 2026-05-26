---
title: "208.2 - Apache HTTPS"
tags: [lpic-2, examen-202, tema-208, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "208"
subtema: "208.2"
---

# 208.2 - Comandos clave: Apache HTTPS

## Comandos OpenSSL para certificados

| Comando | Descripción |
|---|---|
| `openssl genrsa -out clave.key 2048` | Genera una clave privada RSA de 2048 bits |
| `openssl req -new -key clave.key -out cert.csr` | Genera un CSR a partir de una clave existente |
| `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout clave.key -out cert.crt` | Genera clave y certificado autofirmado |
| `openssl x509 -in cert.crt -text -noout` | Muestra la información del certificado |
| `openssl req -in cert.csr -text -noout` | Muestra la información del CSR |
| `openssl rsa -in clave.key -check` | Verifica la integridad de la clave privada |
| `openssl s_client -connect host:443` | Prueba la conexión SSL/TLS al servidor |
| `openssl s_client -connect host:443 -servername host` | Prueba conexión SSL con SNI |

## Comandos Certbot (Let's Encrypt)

| Comando | Descripción |
|---|---|
| `certbot --apache -d dominio.com` | Obtiene certificado y configura Apache automáticamente |
| `certbot certonly --webroot -w /var/www/html -d dominio.com` | Obtiene certificado sin modificar configuración |
| `certbot certonly --standalone -d dominio.com` | Obtiene certificado usando servidor temporal (puerto 80) |
| `certbot renew` | Renueva todos los certificados próximos a expirar |
| `certbot renew --dry-run` | Simula la renovación sin aplicar cambios |
| `certbot certificates` | Lista todos los certificados gestionados |
| `certbot revoke --cert-path /ruta/cert.pem` | Revoca un certificado |
| `certbot delete --cert-name dominio.com` | Elimina un certificado del sistema |

## Directivas SSL principales de Apache

| Directiva | Ejemplo | Descripción |
|---|---|---|
| `SSLEngine` | `on` | Activa SSL/TLS en el VirtualHost |
| `SSLCertificateFile` | `/etc/ssl/certs/cert.crt` | Ruta al certificado del servidor |
| `SSLCertificateKeyFile` | `/etc/ssl/private/clave.key` | Ruta a la clave privada |
| `SSLCACertificateFile` | `/etc/ssl/certs/ca.crt` | Certificado de la CA (cadena de confianza) |
| `SSLProtocol` | `all -SSLv3 -TLSv1 -TLSv1.1` | Protocolos SSL/TLS permitidos |
| `SSLCipherSuite` | `HIGH:!aNULL:!MD5` | Cipher suites permitidos |
| `SSLHonorCipherOrder` | `on` | El servidor elige el cipher preferido |
| `SSLVerifyClient` | `require` | Exige certificado del cliente (mTLS) |
| `SSLVerifyDepth` | `2` | Profundidad de verificación de cadena de CAs |
| `SSLUseStapling` | `on` | Activa OCSP Stapling |
| `SSLStaplingCache` | `shmcb:/tmp/cache(128000)` | Cache para respuestas OCSP |

## Archivos de certificados Let's Encrypt

| Archivo | Descripción |
|---|---|
| `/etc/letsencrypt/live/dominio/cert.pem` | Certificado del servidor |
| `/etc/letsencrypt/live/dominio/privkey.pem` | Clave privada |
| `/etc/letsencrypt/live/dominio/chain.pem` | Certificados intermedios de la CA |
| `/etc/letsencrypt/live/dominio/fullchain.pem` | Certificado completo (cert + chain) |

## Cabecera HSTS

| Directiva | Descripción |
|---|---|
| `Header always set Strict-Transport-Security "max-age=63072000"` | HSTS básico (2 años) |
| `Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains"` | HSTS incluyendo subdominios |
| `Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"` | HSTS con precarga en navegadores |
