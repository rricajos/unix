---
title: "109.3 Resolucion de problemas basicos de red - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-109
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "109"
subtema: "109.3"
---

# 109.3 Resolucion de problemas basicos de red - Ejercicios

### Pregunta 1

Cual es el orden correcto de la metodologia de troubleshooting de red de abajo hacia arriba?

a) DNS -> Gateway -> IP -> Enlace fisico -> Servicio
b) Servicio -> DNS -> Gateway -> IP -> Enlace fisico
c) Enlace fisico -> IP -> Gateway -> DNS -> Servicio
d) Gateway -> IP -> DNS -> Enlace fisico -> Servicio

<details><summary>Respuesta</summary>

**c) Enlace fisico -> IP -> Gateway -> DNS -> Servicio**

La resolucion de problemas de red se realiza de abajo hacia arriba, siguiendo las capas del modelo TCP/IP: 1) Verificar que la interfaz esta activa (enlace fisico), 2) Verificar que tiene IP correcta, 3) Verificar conectividad al gateway, 4) Verificar resolucion DNS, 5) Verificar que el servicio responde. Esto permite identificar sistematicamente en que capa se encuentra el problema.

</details>

---

### Pregunta 2

Que significan las flags `-tulnp` en el comando `ss -tulnp`?

a) TCP, UDP, log, nombres, procesos
b) TCP, UDP, listening, numerico, process
c) TCP, upstream, local, network, port
d) Total, UDP, listening, names, PID

<details><summary>Respuesta</summary>

**b) TCP, UDP, listening, numerico, process**

Las flags `-tulnp` son la combinacion mas comun de `ss` (y `netstat`): `-t` filtra solo conexiones TCP, `-u` filtra solo UDP, `-l` muestra solo puertos en escucha (listening), `-n` muestra direcciones y puertos en formato numerico (sin resolver nombres), y `-p` muestra el PID y nombre del proceso asociado. Esta combinacion muestra todos los servicios que estan escuchando en el sistema.

</details>

---

### Pregunta 3

Cual de las siguientes herramientas combina las funcionalidades de `ping` y `traceroute` en una interfaz interactiva en tiempo real?

a) `netcat`
b) `mtr`
c) `tcpdump`
d) `nmap`

<details><summary>Respuesta</summary>

**b) `mtr`**

`mtr` (My Traceroute) combina `ping` y `traceroute` en una herramienta interactiva en tiempo real, mostrando continuamente la ruta, latencia y perdida de paquetes en cada salto. Es muy util para diagnosticar problemas intermitentes de red. `mtr -r` genera un reporte puntual. `netcat` es para conexiones de red genericas. `tcpdump` captura trafico de red. `nmap` escanea puertos y hosts.

</details>

---

### Pregunta 4

Un usuario puede hacer ping a `8.8.8.8` pero no puede acceder a `www.ejemplo.com`. Cual es la causa mas probable?

a) El gateway esta mal configurado
b) La interfaz de red esta desactivada
c) Hay un problema de resolucion DNS
d) El firewall bloquea todo el trafico saliente

<details><summary>Respuesta</summary>

**c) Hay un problema de resolucion DNS**

Si el ping a una IP publica (8.8.8.8) funciona, la conectividad de red esta correcta (interfaz activa, IP correcta, gateway funcional, acceso a Internet). El hecho de que no pueda acceder a un nombre de dominio indica un problema de resolucion DNS. Se puede diagnosticar con `cat /etc/resolv.conf`, `dig www.ejemplo.com` o `dig @8.8.8.8 www.ejemplo.com` para probar con un DNS especifico.

</details>

---

### Pregunta 5

Que comando verifica si el puerto TCP 443 esta abierto en el servidor 192.168.1.50?

a) `ping -p 443 192.168.1.50`
b) `traceroute -p 443 192.168.1.50`
c) `nc -zv 192.168.1.50 443`
d) `ss -tulnp 192.168.1.50:443`

<details><summary>Respuesta</summary>

**c) `nc -zv 192.168.1.50 443`**

El comando `nc` (netcat) con las opciones `-z` (modo escaneo, sin enviar datos) y `-v` (modo verbose) intenta una conexion TCP al puerto especificado y reporta si esta abierto o cerrado. `ping` usa ICMP y no puede verificar puertos especificos. `traceroute -p` cambia el puerto usado para la traza pero no verifica la apertura de un servicio. `ss -tulnp` solo muestra los puertos locales, no de servidores remotos.

</details>

---

### Pregunta 6

Que significan los asteriscos `* * *` en la salida de `traceroute`?

a) El router de ese salto es el destino final
b) El router de ese salto no respondio dentro del tiempo limite
c) Hay perdida total de paquetes en la red
d) El router esta bloqueando todo el trafico

<details><summary>Respuesta</summary>

**b) El router de ese salto no respondio dentro del tiempo limite**

Los `* * *` en la salida de `traceroute` indican que el router de ese salto no envio una respuesta dentro del tiempo limite. Esto puede deberse a que el router tiene ICMP deshabilitado, el firewall filtra las respuestas, o el paquete fue descartado. No significa necesariamente que haya un problema de conectividad, ya que muchos routers en Internet estan configurados para no responder a estos paquetes.

</details>

---

### Pregunta 7

Cual es la herramienta moderna que reemplaza a `netstat`?

a) `ip`
b) `nmap`
c) `ss`
d) `nc`

<details><summary>Respuesta</summary>

**c) `ss`**

`ss` (socket statistics) del paquete iproute2 es el reemplazo moderno de `netstat` del paquete net-tools (deprecado). `ss` es mas rapido y ofrece mas funcionalidades, como filtrado por estado de conexion (`ss state established`) y por puerto (`ss sport = :22`). Las opciones comunes son compatibles: `ss -tulnp` muestra la misma informacion que `netstat -tulnp`. `ip` reemplaza a `ifconfig` y `route`, no a `netstat`.

</details>

---

### Pregunta 8

Que comando captura solo el trafico del puerto 80 en la interfaz eth0 y lo guarda en un archivo?

a) `tcpdump -i eth0 -p 80 -o captura.pcap`
b) `tcpdump -i eth0 port 80 -w captura.pcap`
c) `ss -i eth0 --capture port 80 > captura.pcap`
d) `netcat -i eth0 -l 80 > captura.pcap`

<details><summary>Respuesta</summary>

**b) `tcpdump -i eth0 port 80 -w captura.pcap`**

`tcpdump` captura trafico de red y requiere permisos de root. La opcion `-i eth0` especifica la interfaz, el filtro `port 80` captura solo trafico del puerto 80, y `-w captura.pcap` guarda la captura en un archivo. Para leer la captura posteriormente se usa `tcpdump -r captura.pcap`. Otras opciones utiles: `-n` (no resolver nombres), `-c 100` (capturar solo 100 paquetes), `-A` (mostrar contenido ASCII).

</details>

---

### Pregunta 9

Que diferencia hay entre `traceroute` y `tracepath`?

a) `traceroute` usa TCP y `tracepath` usa UDP
b) `traceroute` puede requerir root y `tracepath` no requiere root
c) `tracepath` es mas completo y tiene mas opciones que `traceroute`
d) No hay diferencia, son nombres alternativos del mismo comando

<details><summary>Respuesta</summary>

**b) `traceroute` puede requerir root y `tracepath` no requiere root**

`traceroute` es la herramienta clasica que puede requerir permisos de root (dependiendo del metodo de sondeo), usa UDP por defecto y tiene muchas opciones (como `-I` para ICMP, `-T` para TCP). `tracepath` es una alternativa mas simple que no requiere permisos de root y tiene menos opciones. Ambos muestran la ruta que siguen los paquetes hasta el destino (saltos/hops). Las versiones IPv6 son `traceroute6` y `tracepath6`.

</details>

---

### Pregunta 10

En la salida de `route -n`, que indican las flags `UG` en una entrada de la tabla de rutas?

a) La ruta esta inactiva y usa un gateway
b) La ruta esta activa y es una ruta directamente conectada
c) La ruta esta activa y usa un gateway
d) La ruta es una ruta de host que esta activa

<details><summary>Respuesta</summary>

**c) La ruta esta activa y usa un gateway**

En la tabla de rutas, la flag `U` indica que la ruta esta activa (Up) y la flag `G` indica que la ruta usa un gateway (no es directamente conectada). La combinacion `UG` es tipica de la ruta por defecto (0.0.0.0 con gateway). Otras flags: `H` indica que el destino es un host especifico (no una red), `!` indica una ruta de rechazo, `D` indica una ruta creada dinamicamente.

</details>
