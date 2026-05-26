# Hacking Vault

Base de conocimientos de seguridad ofensiva y defensiva. Complemento practico a las certificaciones LPIC.

## Mapa de Conocimientos

### Ofensivo (Red Team)

| Area | Descripcion | Temas LPIC relacionados |
|------|-------------|------------------------|
| [Reconocimiento](ofensivo/reconocimiento/) | Recopilacion de informacion pasiva y activa | LPIC-1: 109 (Fundamentos de red) |
| [Enumeracion](ofensivo/enumeracion/) | Descubrimiento de servicios y vulnerabilidades | LPIC-2: 207-210 (Servicios de red) |
| [Explotacion](ofensivo/explotacion/) | Tecnicas de explotacion de vulnerabilidades | LPIC-3 303: 335 (Amenazas y vulnerabilidades) |
| [Post-Explotacion](ofensivo/post-explotacion/) | Persistencia, movimiento lateral, exfiltracion | LPIC-3 303: 332 (Seguridad del host) |
| [CTF](ofensivo/ctf/) | Writeups y metodologias para CTFs | Transversal |
| [Ingenieria Social](ofensivo/ingenieria-social/) | Tecnicas de manipulacion y phishing | - |

### Defensivo (Blue Team)

| Area | Descripcion | Temas LPIC relacionados |
|------|-------------|------------------------|
| [Hardening](defensivo/hardening/) | Securizacion de sistemas y servicios | LPIC-3 303: 332 (Seguridad del host) |
| [Blue Team](defensivo/blue-team/) | Deteccion, respuesta a incidentes, forense | LPIC-1: 110, LPIC-2: 212, LPIC-3 303 |
| [Firewalls y Filtrado](defensivo/firewalls-y-filtrado/) | iptables, nftables, firewalld | LPIC-3 303: 334.3 (Filtrado de paquetes) |
| [Criptografia Aplicada](defensivo/criptografia-aplicada/) | GPG, SSL/TLS, LUKS | LPIC-1: 110.3, LPIC-3 303: 331 |

### Laboratorios

| Lab | Descripcion |
|-----|-------------|
| [Lab 01 - Reconocimiento](laboratorios/escenarios/lab-01-reconocimiento/) | Escaneo y enumeracion de redes |
| [Lab 02 - Explotacion Web](laboratorios/escenarios/lab-02-explotacion-web/) | OWASP Top 10 en practica |
| [Lab 03 - Escalada de Privilegios](laboratorios/escenarios/lab-03-escalada-privilegios/) | Privesc en Linux |
| [Lab 04 - Hardening de Servidor](laboratorios/escenarios/lab-04-hardening-servidor/) | Securizar un servidor desde cero |

## Como usar este vault

1. Estudia los temas LPIC relacionados primero para tener la base teorica
2. Lee las notas de la seccion correspondiente del vault
3. Practica con los scripts y herramientas
4. Pon a prueba tus conocimientos con los laboratorios y CTFs
