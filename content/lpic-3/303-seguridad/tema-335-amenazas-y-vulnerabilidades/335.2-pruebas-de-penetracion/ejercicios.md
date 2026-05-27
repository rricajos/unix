---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "335 - Amenazas y Evaluacion de Vulnerabilidades"
tema: "335.2 - Pruebas de penetracion"
subtema: "335.2"
peso: 3
tags:
  - lpic-3
  - tema-335
  - pentesting
  - nmap
  - metasploit
---

# Ejercicios - 335.2 Pruebas de Penetracion

### Pregunta 1
¿Que tipo de escaneo nmap envia un paquete SYN pero no completa el handshake TCP de tres vias?

a) `nmap -sT` (Connect scan)
b) `nmap -sS` (SYN scan)
c) `nmap -sU` (UDP scan)
d) `nmap -sA` (ACK scan)

<details><summary>Respuesta</summary>

**b)** `nmap -sS` (SYN scan)

El SYN scan envia un paquete SYN y espera la respuesta (SYN-ACK = abierto, RST = cerrado). No completa el handshake (no envia ACK final), por lo que es mas sigiloso y rapido que el Connect scan.
</details>

### Pregunta 2
¿Cual es el primer y mas importante requisito antes de realizar cualquier prueba de penetracion?

a) Instalar Kali Linux
b) Tener autorizacion escrita del propietario del sistema
c) Configurar Metasploit
d) Realizar un escaneo de puertos preliminar

<details><summary>Respuesta</summary>

**b)** Tener autorizacion escrita del propietario del sistema

La autorizacion escrita es un requisito legal y etico fundamental. Sin ella, cualquier prueba de penetracion se considera actividad ilegal (acceso no autorizado a sistemas informaticos) en la mayoria de jurisdicciones.
</details>

### Pregunta 3
¿Que opcion de nmap detecta la version de los servicios que estan ejecutandose en los puertos abiertos?

a) `nmap -O`
b) `nmap -sV`
c) `nmap -A`
d) `nmap --version`

<details><summary>Respuesta</summary>

**b)** `nmap -sV`

La opcion `-sV` (service version) realiza deteccion de version de los servicios. `-O` detecta el sistema operativo. `-A` es agresivo e incluye tanto `-sV` como `-O`, scripts y traceroute.
</details>

### Pregunta 4
¿Que fase de la metodologia de pentesting incluye el uso de Metasploit para aprovechar vulnerabilidades encontradas?

a) Reconocimiento
b) Escaneo
c) Explotacion
d) Post-explotacion

<details><summary>Respuesta</summary>

**c)** Explotacion

La fase de explotacion es donde se utilizan herramientas como Metasploit para intentar aprovechar las vulnerabilidades descubiertas en las fases anteriores. La post-explotacion viene despues, cuando ya se tiene acceso.
</details>

### Pregunta 5
¿Que tipo de prueba de penetracion simula un atacante sin ningun conocimiento previo del sistema objetivo?

a) White box
b) Grey box
c) Black box
d) Crystal box

<details><summary>Respuesta</summary>

**c)** Black box

En una prueba black box, el pentester no tiene informacion previa sobre el sistema (como un atacante externo real). White box proporciona toda la informacion. Grey box proporciona informacion parcial.
</details>

### Pregunta 6
¿Que tipo de escaneo nmap es especifico para descubrir puertos UDP abiertos?

a) `nmap -sS`
b) `nmap -sT`
c) `nmap -sU`
d) `nmap -sN`

<details><summary>Respuesta</summary>

**c)** `nmap -sU`

El escaneo UDP (`-sU`) es el unico tipo diseñado especificamente para puertos UDP. Los demas (`-sS`, `-sT`, `-sN`, `-sF`, `-sX`) son escaneos TCP.
</details>

### Pregunta 7
En Metasploit, ¿que comando se usa para buscar un exploit especifico por su identificador CVE?

a) `find cve-2021-44228`
b) `search cve:2021-44228`
c) `lookup CVE-2021-44228`
d) `exploit search CVE-2021-44228`

<details><summary>Respuesta</summary>

**b)** `search cve:2021-44228`

El comando `search` en Metasploit acepta filtros como `cve:`, `type:`, `platform:`, `name:` para buscar modulos especificos en su base de datos.
</details>

### Pregunta 8
¿Que tecnica de evasion de nmap fragmenta los paquetes para intentar evitar la deteccion por IDS/IPS?

a) `nmap -D RND:5`
b) `nmap -f`
c) `nmap --source-port 53`
d) `nmap -T0`

<details><summary>Respuesta</summary>

**b)** `nmap -f`

La opcion `-f` fragmenta los paquetes IP en fragmentos mas pequeños, dificultando que los IDS/IPS reconstruyan y analicen los paquetes. `-D` usa señuelos (decoys), `--source-port` falsifica el puerto de origen, y `-T0` solo reduce la velocidad.
</details>

### Pregunta 9
¿Que documento define el alcance, tecnicas permitidas, ventana de tiempo y limites de una prueba de penetracion?

a) SLA (Service Level Agreement)
b) NDA (Non-Disclosure Agreement)
c) Rules of Engagement (Reglas de compromiso)
d) Informe de vulnerabilidades

<details><summary>Respuesta</summary>

**c)** Rules of Engagement (Reglas de compromiso)

Las reglas de compromiso son un documento formal que define todos los parametros de la prueba: alcance, sistemas incluidos/excluidos, tecnicas permitidas, ventana temporal, contactos de emergencia y tratamiento de datos sensibles.
</details>

### Pregunta 10
¿Que opcion de nmap ejecuta scripts NSE (Nmap Scripting Engine) diseñados para detectar vulnerabilidades conocidas?

a) `nmap --script=default`
b) `nmap --script=vuln`
c) `nmap --script=exploit`
d) `nmap --script=discovery`

<details><summary>Respuesta</summary>

**b)** `nmap --script=vuln`

La categoria `vuln` de NSE ejecuta scripts diseñados para detectar vulnerabilidades conocidas en los servicios encontrados. `default` ejecuta scripts basicos seguros, `discovery` busca informacion adicional.
</details>
