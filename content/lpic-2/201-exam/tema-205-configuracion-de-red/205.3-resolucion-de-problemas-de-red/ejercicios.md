---
title: "205.3 - Resolucion de problemas de red"
tags: [lpic-2, examen-201, tema-205, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.3"
---

# 205.3 - Ejercicios: Resolucion de problemas de red

### Pregunta 1
Un administrador puede hacer ping a 8.8.8.8 pero no puede acceder a ningun sitio web por nombre. Cual es la causa mas probable?

a) El gateway esta mal configurado
b) La interfaz de red esta desactivada
c) El servidor DNS no esta configurado o no responde
d) El firewall esta bloqueando todo el trafico

<details>
<summary>Respuesta</summary>

**c) El servidor DNS no esta configurado o no responde**

Si el ping a una IP publica (8.8.8.8) funciona, la conectividad de red esta operativa (interfaz, IP, gateway, enrutamiento). El problema es que no se pueden resolver nombres de dominio a direcciones IP, lo que indica un fallo en la configuracion DNS. Se debe verificar `/etc/resolv.conf` y probar con `dig` o `nslookup` para confirmar.
</details>

---

### Pregunta 2
Que comando muestra los puertos TCP que estan en modo escucha junto con el proceso propietario?

a) `ss -ulnp`
b) `ss -tlnp`
c) `ss -tanp`
d) `ss -s`

<details>
<summary>Respuesta</summary>

**b) `ss -tlnp`**

Las opciones significan: `-t` (TCP), `-l` (listening/escucha), `-n` (numerico, sin resolver nombres), `-p` (mostrar proceso). La opcion a) mostraria UDP (`-u`), la opcion c) mostraria todas las conexiones TCP (`-a` incluye establecidas y en escucha), y la opcion d) muestra un resumen de estadisticas.
</details>

---

### Pregunta 3
Que herramienta combina las funcionalidades de ping y traceroute en una monitorizacion interactiva continua?

a) tracepath
b) iptraf
c) mtr
d) nmap

<details>
<summary>Respuesta</summary>

**c) mtr**

`mtr` (My Traceroute) ejecuta continuamente un traceroute y muestra estadisticas en tiempo real de cada salto, incluyendo porcentaje de perdida de paquetes, latencia minima, media y maxima, y desviacion estandar. Es la herramienta ideal para diagnosticar problemas intermitentes de ruta. Se puede usar en modo interactivo o con `--report` para un informe no interactivo.
</details>

---

### Pregunta 4
Que comando de tcpdump captura todo el trafico HTTP hacia el host 192.168.1.100 y lo guarda en un archivo?

a) `tcpdump -i eth0 host 192.168.1.100 and port 80 -w /tmp/http.pcap`
b) `tcpdump -i eth0 http 192.168.1.100 -o /tmp/http.pcap`
c) `tcpdump -capture eth0 192.168.1.100:80 --save /tmp/http.pcap`
d) `tcpdump -i eth0 -filter "host=192.168.1.100 port=80" -w /tmp/http.pcap`

<details>
<summary>Respuesta</summary>

**a) `tcpdump -i eth0 host 192.168.1.100 and port 80 -w /tmp/http.pcap`**

La sintaxis de tcpdump usa filtros BPF (Berkeley Packet Filter): `host` filtra por IP, `port` filtra por puerto, y `and` combina condiciones. La opcion `-w` escribe la captura en formato pcap. La opcion `-i` especifica la interfaz. Los filtros son expresiones de texto libre, no formato clave=valor.
</details>

---

### Pregunta 5
Que opcion de dig muestra solo la respuesta a la consulta DNS, sin cabeceras ni informacion adicional?

a) `dig --brief`
b) `dig +noall`
c) `dig +short`
d) `dig -q`

<details>
<summary>Respuesta</summary>

**c) `dig +short`**

La opcion `+short` de dig muestra unicamente la respuesta a la consulta, omitiendo toda la informacion adicional (cabeceras, seccion de autoridad, seccion adicional, estadisticas). Por ejemplo, `dig +short ejemplo.com` mostraria solo la IP (como `93.184.216.34`). Es muy util para scripts y consultas rapidas.
</details>

---

### Pregunta 6
Un administrador ejecuta `nmap -sn 192.168.1.0/24`. Que hace este comando?

a) Escanea todos los puertos de todos los hosts en la red
b) Realiza un ping sweep para descubrir hosts activos sin escanear puertos
c) Escanea los puertos 1-1024 de toda la subred
d) Realiza un escaneo SYN stealth de la subred

<details>
<summary>Respuesta</summary>

**b) Realiza un ping sweep para descubrir hosts activos sin escanear puertos**

La opcion `-sn` (anteriormente `-sP`) indica a nmap que realice solo el descubrimiento de hosts, sin escanear puertos. Utiliza una combinacion de ICMP echo, TCP SYN al puerto 443, TCP ACK al puerto 80 y ICMP timestamp para determinar que hosts estan activos. Es util para obtener un inventario rapido de la red.
</details>

---

### Pregunta 7
Que informacion proporciona el comando `ethtool eth0`?

a) Las direcciones IP configuradas en la interfaz
b) Las rutas de red asociadas a la interfaz
c) La velocidad, duplex, autonegociacion y estado del enlace fisico
d) Las reglas de firewall aplicadas a la interfaz

<details>
<summary>Respuesta</summary>

**c) La velocidad, duplex, autonegociacion y estado del enlace fisico**

`ethtool` muestra informacion de la capa fisica de la interfaz de red: velocidad del enlace (100Mb/s, 1000Mb/s), modo duplex (Full/Half), estado de autonegociacion (on/off), y si hay enlace detectado (Link detected: yes/no). Es la primera herramienta a usar cuando se sospecha de problemas fisicos de red.
</details>

---

### Pregunta 8
Que comando se usa para verificar rapidamente si el puerto 443 de un servidor remoto esta abierto y aceptando conexiones?

a) `ping 192.168.1.100:443`
b) `traceroute -p 443 192.168.1.100`
c) `nc -zv 192.168.1.100 443`
d) `dig 192.168.1.100 443`

<details>
<summary>Respuesta</summary>

**c) `nc -zv 192.168.1.100 443`**

El comando `nc` (netcat) con las opciones `-z` (modo escaneo, sin enviar datos) y `-v` (verbose, mostrar resultado) intenta establecer una conexion TCP al puerto especificado. Si el puerto esta abierto, reporta "Connection succeeded" o "open"; si esta cerrado o filtrado, reporta un error. `ping` no puede verificar puertos y `dig` es para consultas DNS.
</details>

---

### Pregunta 9
En la salida de traceroute, que significa una linea con `* * *`?

a) El destino ha sido alcanzado
b) Hay una perdida total de paquetes en la ruta
c) El router en ese salto no responde a los sondeos (puede filtrar ICMP/UDP)
d) La conexion ha sido rechazada por un firewall

<details>
<summary>Respuesta</summary>

**c) El router en ese salto no responde a los sondeos (puede filtrar ICMP/UDP)**

Los asteriscos `* * *` indican que el router en ese salto no envio respuestas ICMP Time Exceeded. Esto puede deberse a que el router tiene configurado filtrar ese tipo de trafico, tiene limitacion de tasa para ICMP, o esta muy congestionado. No necesariamente indica un problema: muchos routers de Internet filtran deliberadamente estos paquetes por seguridad. Si los saltos siguientes responden, la ruta funciona correctamente.
</details>

---

### Pregunta 10
Un administrador necesita trazar la cadena completa de resolucion DNS de un dominio, desde los servidores raiz hasta el servidor autoritativo. Que comando debe usar?

a) `dig +recurse ejemplo.com`
b) `dig +trace ejemplo.com`
c) `nslookup -debug ejemplo.com`
d) `host -a ejemplo.com`

<details>
<summary>Respuesta</summary>

**b) `dig +trace ejemplo.com`**

La opcion `+trace` de dig realiza consultas iterativas empezando por los servidores raiz DNS (.), pasando por los servidores TLD (.com), hasta llegar al servidor autoritativo del dominio. Muestra cada paso de la cadena de delegacion, lo que es invaluable para diagnosticar problemas de resolucion DNS como delegaciones incorrectas o servidores autoritativos no respondiendo.
</details>

---
