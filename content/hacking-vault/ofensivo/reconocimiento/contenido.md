---
title: "Reconocimiento y Recopilacion de Informacion"
tags:
  - hacking
  - ofensivo
  - reconocimiento
  - hacking-ofensivo
tipo: hacking-ofensivo
certificacion: hacking-vault
---

# Reconocimiento y Recopilacion de Informacion

El reconocimiento es la primera fase de cualquier prueba de penetracion. Consiste en recopilar la mayor cantidad de informacion posible sobre el objetivo antes de lanzar cualquier ataque. Una fase de reconocimiento exhaustiva marca la diferencia entre un pentest exitoso y uno fallido.

> **Nota de seguridad:** Toda actividad de reconocimiento debe realizarse unicamente contra sistemas para los cuales se posee autorizacion explicita por escrito. El reconocimiento no autorizado puede constituir un delito en la mayoria de jurisdicciones.

## Fases del Reconocimiento

| Fase | Tipo | Interaccion con el objetivo | Riesgo de deteccion |
|------|------|-----------------------------|---------------------|
| Reconocimiento pasivo | OSINT | Ninguna directa | Nulo |
| Reconocimiento semi-pasivo | Consultas DNS, WHOIS | Minima | Muy bajo |
| Reconocimiento activo | Escaneo de puertos, probing | Directa | Alto |

## OSINT - Open Source Intelligence

OSINT se refiere a la recopilacion de informacion a partir de fuentes publicamente disponibles. No implica interaccion directa con los sistemas del objetivo.

### theHarvester

Herramienta para recopilar correos electronicos, subdominios, hosts e IPs de multiples fuentes publicas.

```bash
# Busqueda basica de un dominio
theHarvester -d ejemplo.com -b google

# Usar multiples fuentes de datos
theHarvester -d ejemplo.com -b google,bing,linkedin,dnsdumpster,crtsh

# Guardar resultados en fichero XML
theHarvester -d ejemplo.com -b all -f resultados_ejemplo

# Limitar resultados
theHarvester -d ejemplo.com -b google -l 200 -S 0

# Buscar en Shodan
theHarvester -d ejemplo.com -b shodan
```

### Maltego

Maltego es una herramienta grafica de OSINT que permite mapear relaciones entre entidades (dominios, IPs, personas, organizaciones).

```
Flujo de trabajo tipico en Maltego:
1. Crear un nuevo grafo
2. Arrastrar la entidad "Domain" al canvas
3. Introducir el dominio objetivo
4. Ejecutar transforms:
   - "To DNS Name" -> subdominios
   - "To Email Addresses" -> correos asociados
   - "To IP Address" -> resoluciones DNS
   - "To Website" -> tecnologias web
5. Expandir cada nodo descubierto iterativamente
```

### Shodan

Shodan es un motor de busqueda que indexa dispositivos conectados a Internet.

```bash
# CLI de Shodan
shodan init TU_API_KEY

# Buscar servidores Apache en un rango
shodan search "apache country:ES"

# Informacion de un host especifico
shodan host 192.168.1.1

# Buscar webcams expuestas
shodan search "Server: webcam"

# Buscar servicios especificos por puerto
shodan search "port:3389 country:MX"

# Contar resultados sin mostrar detalles
shodan count "nginx port:443 country:AR"
```

**Filtros utiles de Shodan:**

| Filtro | Descripcion | Ejemplo |
|--------|-------------|---------|
| `country:` | Filtrar por pais (codigo ISO) | `country:ES` |
| `city:` | Filtrar por ciudad | `city:Madrid` |
| `port:` | Filtrar por puerto | `port:22` |
| `org:` | Filtrar por organizacion | `org:"Google"` |
| `hostname:` | Filtrar por hostname | `hostname:ejemplo.com` |
| `os:` | Filtrar por sistema operativo | `os:"Windows 10"` |
| `product:` | Filtrar por software | `product:nginx` |

### Censys

Similar a Shodan, Censys permite buscar hosts y certificados.

```bash
# Usando la CLI de Censys
censys search "services.service_name: HTTP AND location.country: Spain"

# Buscar certificados de un dominio
censys search "parsed.names: ejemplo.com" --index-type certificates

# Buscar hosts por tecnologia
censys search "services.software.product: Apache"
```

## Google Dorks

Los Google Dorks son consultas avanzadas que utilizan operadores especiales del motor de busqueda para encontrar informacion expuesta.

> **Nota de seguridad:** El uso de Google Dorks para encontrar informacion sensible sin autorizacion puede tener implicaciones legales. Usarlos unicamente en el contexto de un pentesting autorizado.

```
# Operadores fundamentales
site:ejemplo.com                    # Limitar a un dominio
inurl:admin                         # Buscar "admin" en la URL
intitle:"index of"                  # Buscar en titulos de pagina
filetype:pdf                        # Buscar tipo de archivo especifico
intext:"password"                   # Buscar texto en el cuerpo
cache:ejemplo.com                   # Version cacheada por Google
link:ejemplo.com                    # Paginas que enlazan al dominio

# Dorks compuestos para pentesting
site:ejemplo.com filetype:sql       # Archivos SQL expuestos
site:ejemplo.com filetype:env       # Archivos .env con credenciales
site:ejemplo.com inurl:wp-admin     # Panel de WordPress
site:ejemplo.com intitle:"index of" # Listados de directorio
site:ejemplo.com filetype:log       # Archivos de log expuestos
site:ejemplo.com ext:conf OR ext:cnf # Archivos de configuracion
inurl:"ViewerFrame?Mode="          # Webcams expuestas
intitle:"phpMyAdmin" inurl:phpmyadmin # Paneles phpMyAdmin
filetype:xls inurl:"email" site:ejemplo.com  # Hojas de calculo con correos

# Buscar archivos de backup
site:ejemplo.com filetype:bak OR filetype:old OR filetype:backup

# Buscar paginas de login
site:ejemplo.com inurl:login OR inurl:signin OR inurl:auth

# Excluir resultados
site:ejemplo.com -inurl:www         # Subdominios sin www
```

## Escaneo con Nmap

Nmap (Network Mapper) es la herramienta esencial de escaneo de redes y puertos.

### Descubrimiento de Hosts

```bash
# Ping sweep en una subred
nmap -sn 192.168.1.0/24

# Descubrimiento sin ping (evita firewalls que bloquean ICMP)
nmap -Pn 192.168.1.0/24

# Descubrimiento ARP (solo red local)
nmap -PR 192.168.1.0/24

# Descubrimiento TCP SYN al puerto 80
nmap -PS80 192.168.1.0/24

# Lista de objetivos sin escanear (validar scope)
nmap -sL 192.168.1.0/24
```

### Escaneo de Puertos

```bash
# SYN scan (sigiloso, requiere root) - por defecto
sudo nmap -sS 10.10.10.1

# TCP connect scan (sin root)
nmap -sT 10.10.10.1

# UDP scan
sudo nmap -sU 10.10.10.1

# Escanear puertos especificos
nmap -p 80,443,8080 10.10.10.1

# Escanear rango de puertos
nmap -p 1-1000 10.10.10.1

# Escanear TODOS los puertos (65535)
nmap -p- 10.10.10.1

# Escanear los puertos mas comunes
nmap --top-ports 100 10.10.10.1
```

### Deteccion de Versiones y SO

```bash
# Deteccion de version de servicios
nmap -sV 10.10.10.1

# Deteccion de sistema operativo
sudo nmap -O 10.10.10.1

# Scripts por defecto de NSE
nmap -sC 10.10.10.1

# Combo clasico de pentesting
sudo nmap -sC -sV -O 10.10.10.1

# Escaneo agresivo (incluye -sV -sC -O --traceroute)
nmap -A 10.10.10.1
```

### Temporizado (Timing)

| Template | Nombre | Uso |
|----------|--------|-----|
| `-T0` | Paranoico | Evasion de IDS, extremadamente lento |
| `-T1` | Astuto | Evasion de IDS, lento |
| `-T2` | Educado | Reduce carga en la red |
| `-T3` | Normal | Por defecto |
| `-T4` | Agresivo | Redes rapidas y fiables |
| `-T5` | Demente | Sacrifica precision por velocidad |

### Formatos de Salida

```bash
# Salida normal (legible)
nmap -oN resultado.txt 10.10.10.1

# Salida XML (para herramientas automatizadas)
nmap -oX resultado.xml 10.10.10.1

# Salida grepeable
nmap -oG resultado.gnmap 10.10.10.1

# Todos los formatos a la vez
nmap -oA resultado_completo 10.10.10.1
```

### Scripts NSE Utiles

```bash
# Enumerar vulnerabilidades conocidas
nmap --script vuln 10.10.10.1

# Scripts para HTTP
nmap --script http-enum,http-headers,http-methods -p 80 10.10.10.1

# Scripts para SMB
nmap --script smb-enum-shares,smb-os-discovery -p 445 10.10.10.1

# Escaneo completo tipico de CTF/pentesting
sudo nmap -sC -sV -p- -T4 -oA full_scan 10.10.10.1
```

## Enumeracion de Subdominios

### Subfinder

```bash
# Busqueda basica
subfinder -d ejemplo.com

# Guardar resultados
subfinder -d ejemplo.com -o subdominios.txt

# Modo silencioso (solo subdominios)
subfinder -d ejemplo.com -silent

# Usar todas las fuentes
subfinder -d ejemplo.com -all
```

### Amass

```bash
# Enumeracion pasiva
amass enum -passive -d ejemplo.com

# Enumeracion activa con brute force
amass enum -active -brute -d ejemplo.com

# Guardar resultados
amass enum -d ejemplo.com -o amass_resultados.txt

# Mostrar resumen del dominio
amass intel -whois -d ejemplo.com
```

### Dnsrecon y Fierce

```bash
# Dnsrecon - enumeracion DNS completa
dnsrecon -d ejemplo.com -t std

# Transferencia de zona
dnsrecon -d ejemplo.com -t axfr

# Fierce - busqueda de subdominios por fuerza bruta
fierce --domain ejemplo.com

# Fierce con wordlist personalizada
fierce --domain ejemplo.com --wordlist /usr/share/wordlists/subdomains.txt
```

## Fingerprinting Web

### WhatWeb

```bash
# Deteccion basica de tecnologias
whatweb ejemplo.com

# Modo agresivo para mayor detalle
whatweb -a 3 ejemplo.com

# Escanear multiples objetivos
whatweb -i urls.txt

# Salida verbose
whatweb -v ejemplo.com
```

### Wafw00f

```bash
# Detectar WAF (Web Application Firewall)
wafw00f ejemplo.com

# Probar todos los WAFs conocidos
wafw00f -a ejemplo.com

# Escanear lista de URLs
wafw00f -i urls.txt
```

### Nikto

```bash
# Escaneo basico de vulnerabilidades web
nikto -h http://ejemplo.com

# Escanear puerto especifico
nikto -h ejemplo.com -p 8080

# Guardar resultados en HTML
nikto -h ejemplo.com -o reporte.html -Format htm
```

## Reconocimiento DNS

```bash
# WHOIS - informacion de registro del dominio
whois ejemplo.com

# DIG - consultas DNS detalladas
dig ejemplo.com ANY           # Todos los registros
dig ejemplo.com MX            # Registros de correo
dig ejemplo.com NS            # Servidores de nombres
dig ejemplo.com TXT           # Registros TXT (SPF, DKIM)
dig @8.8.8.8 ejemplo.com     # Consultar DNS especifico
dig ejemplo.com AXFR @ns1.ejemplo.com  # Intentar transferencia de zona

# NSLOOKUP - consultas DNS interactivas
nslookup ejemplo.com
nslookup -type=MX ejemplo.com
nslookup -type=NS ejemplo.com

# Busqueda inversa
dig -x 93.184.216.34
nslookup 93.184.216.34
```

## Metodologia de Reconocimiento

```
FASE 1 - Reconocimiento Pasivo (sin tocar el objetivo):
  [1] WHOIS y registros DNS publicos
  [2] Google Dorks y motores de busqueda
  [3] Shodan / Censys
  [4] theHarvester / Maltego
  [5] Redes sociales y LinkedIn
  [6] Wayback Machine (archive.org)
  [7] Certificate Transparency logs (crt.sh)

FASE 2 - Reconocimiento Semi-pasivo:
  [1] Consultas DNS directas (dig, nslookup)
  [2] Enumeracion de subdominios pasiva (subfinder)
  [3] Busqueda de tecnologias (whatweb, Wappalyzer)

FASE 3 - Reconocimiento Activo:
  [1] Escaneo de puertos con Nmap
  [2] Enumeracion activa de subdominios (amass brute)
  [3] Fingerprinting agresivo (nikto)
  [4] Deteccion de WAF (wafw00f)
  [5] Escaneo de vulnerabilidades

Documentar CADA hallazgo con fecha, herramienta usada y evidencia.
```

> **Nota de seguridad:** La fase de reconocimiento activo genera trafico hacia el objetivo y puede ser detectada por sistemas IDS/IPS. Asegurate de que tu autorizacion cubre explicitamente las tecnicas que vas a emplear y respeta los limites del alcance definido.

## Recursos y Referencias

| Recurso | URL | Descripcion |
|---------|-----|-------------|
| crt.sh | https://crt.sh | Busqueda de certificados SSL |
| SecurityTrails | https://securitytrails.com | Datos DNS historicos |
| BuiltWith | https://builtwith.com | Tecnologias de un sitio web |
| Wayback Machine | https://web.archive.org | Versiones historicas de sitios |
| Hunter.io | https://hunter.io | Busqueda de correos corporativos |
| GHDB | https://www.exploit-db.com/google-hacking-database | Base de datos de Google Dorks |
