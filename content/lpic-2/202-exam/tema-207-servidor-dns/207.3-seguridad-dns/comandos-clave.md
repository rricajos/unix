---
title: "207.3 - Seguridad DNS"
tags: [lpic-2, examen-202, tema-207, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.3"
---

# 207.3 - Comandos clave: Seguridad DNS

## DNSSEC - Registros y claves

| Registro | Descripcion | Flag/Uso |
|----------|-------------|----------|
| `DNSKEY` | Clave publica de la zona | Flag 256 = ZSK, Flag 257 = KSK |
| `RRSIG` | Firma digital de un conjunto de registros | Contiene firma, algoritmo, fechas |
| `DS` | Delegation Signer (en zona padre) | Hash de la KSK de la zona hija |
| `NSEC` | Prueba de no-existencia (permite zone walking) | Lista el siguiente nombre en la zona |
| `NSEC3` | Prueba de no-existencia con hash (evita zone walking) | Usa hashes en lugar de nombres |

## DNSSEC - Tipos de claves

| Clave | Descripcion | Caracteristicas |
|-------|-------------|-----------------|
| **KSK** (Key Signing Key) | Firma las claves DNSKEY | Mas larga (2048-4096 bits), rotacion infrecuente |
| **ZSK** (Zone Signing Key) | Firma los registros de datos | Mas corta (1024-2048 bits), rotacion frecuente |

## DNSSEC - Comandos de generacion y firma

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `dnssec-keygen -f KSK` | Generar KSK | `dnssec-keygen -a RSASHA256 -b 2048 -n ZONE -f KSK ejemplo.com` |
| `dnssec-keygen` | Generar ZSK | `dnssec-keygen -a RSASHA256 -b 1024 -n ZONE ejemplo.com` |
| `dnssec-signzone` | Firmar una zona | `dnssec-signzone -o ejemplo.com db.ejemplo.com` |

## DNSSEC - Verificacion con dig

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `dig +dnssec DOMINIO` | Consulta con info DNSSEC | `dig +dnssec ejemplo.com A` |
| `dig DOMINIO DNSKEY` | Ver claves publicas | `dig ejemplo.com DNSKEY` |
| `dig DOMINIO DS` | Ver registro DS | `dig ejemplo.com DS` |
| Flag `ad` en respuesta | Indica datos autenticados por DNSSEC | `flags: qr rd ra ad;` |

## DNSSEC - Configuracion en BIND

| Directiva | Descripcion | Ejemplo |
|-----------|-------------|---------|
| `dnssec-validation auto` | Validacion automatica con claves raiz | En bloque `options {}` |
| `dnssec-validation yes` | Validacion con trusted-keys manuales | En bloque `options {}` |

## TSIG - Autenticacion de transacciones

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `tsig-keygen` | Generar clave TSIG | `tsig-keygen -a hmac-sha256 mi-clave > tsig.key` |
| `dig -k KEYFILE` | Consulta autenticada con TSIG | `dig @ns1 ejemplo.com AXFR -k tsig.key` |

### Configuracion TSIG en named.conf

```
key "nombre-clave" {
    algorithm hmac-sha256;
    secret "base64Secret==";
};

server IP {
    keys { nombre-clave; };
};

zone "ejemplo.com" {
    allow-transfer { key nombre-clave; };
};
```

## Chroot

| Configuracion | Descripcion | Ejemplo |
|---------------|-------------|---------|
| Paquete RHEL | bind-chroot | `dnf install bind-chroot` |
| Directorio chroot | `/var/named/chroot` | Contiene etc/, var/, dev/ |
| Opcion named | `-t DIR` para especificar chroot | `named -t /var/named/chroot` |
| Servicio systemd | `named-chroot.service` | `systemctl start named-chroot` |
| Configuracion Debian | `/etc/default/named` | `OPTIONS="-u bind -t /var/lib/named"` |

## Restriccion de acceso

| Directiva | Descripcion | Ejemplo |
|-----------|-------------|---------|
| `allow-query` | Quien puede consultar | `allow-query { 192.168.0.0/16; };` |
| `allow-recursion` | Quien puede usar recursion | `allow-recursion { localnets; };` |
| `allow-transfer` | Quien puede transferir zonas | `allow-transfer { 192.168.1.11; };` |
| `allow-update` | Quien puede actualizar dinamicamente | `allow-update { key dhcp-key; };` |
| `recursion no` | Deshabilitar recursion (servidor autoritativo) | En bloque `options {}` |
| `version "none"` | Ocultar version de BIND | En bloque `options {}` |

## Rate limiting

| Parametro | Descripcion | Ejemplo |
|-----------|-------------|---------|
| `responses-per-second` | Limite de respuestas identicas/s | `responses-per-second 10;` |
| `nxdomains-per-second` | Limite de NXDOMAIN/s | `nxdomains-per-second 5;` |
| `errors-per-second` | Limite de errores/s | `errors-per-second 5;` |
| `window` | Ventana de tiempo | `window 5;` |
| `slip` | Frecuencia de respuestas truncadas (TC) | `slip 2;` |

## Split DNS (Views)

```
view "interna" {
    match-clients { 192.168.0.0/16; };
    recursion yes;
    zone "ejemplo.com" { type master; file "interna.db"; };
};

view "externa" {
    match-clients { any; };
    recursion no;
    zone "ejemplo.com" { type master; file "externa.db"; };
};
```

## DNS sobre TLS/HTTPS (conceptos)

| Protocolo | Puerto | RFC | Descripcion |
|-----------|--------|-----|-------------|
| DNS over TLS (DoT) | 853 | RFC 7858 | Cifrado TLS de consultas DNS |
| DNS over HTTPS (DoH) | 443 | RFC 8484 | Consultas DNS encapsuladas en HTTPS |
