---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "334 - Seguridad de Red"
tema: "334.2 - Deteccion de intrusiones en la red"
subtema: "334.2"
peso: 4
tags:
  - lpic-3
  - tema-334
  - snort
  - suricata
  - tcpdump
  - nids
---

# Ejercicios - 334.2 Deteccion de Intrusiones en la Red

### Pregunta 1
¿Cual es la diferencia principal entre un IDS y un IPS?

a) IDS es mas rapido que IPS
b) IDS detecta y alerta; IPS detecta y bloquea el trafico malicioso
c) IPS solo funciona en modo offline
d) IDS analiza solo encabezados; IPS analiza el contenido completo

<details><summary>Respuesta</summary>

**b)** IDS detecta y alerta; IPS detecta y bloquea el trafico malicioso

Un IDS (Intrusion Detection System) monitoriza el trafico de forma pasiva y genera alertas. Un IPS (Intrusion Prevention System) se coloca en linea (inline) y puede bloquear o descartar trafico malicioso activamente.
</details>

### Pregunta 2
¿Que comando ejecuta Snort en modo NIDS utilizando un archivo de configuracion?

a) `snort -v -i eth0`
b) `snort -c /etc/snort/snort.conf -l /var/log/snort`
c) `snort --nids -config /etc/snort/snort.conf`
d) `snort -dev -l /var/log/snort`

<details><summary>Respuesta</summary>

**b)** `snort -c /etc/snort/snort.conf -l /var/log/snort`

La opcion `-c` especifica el archivo de configuracion que incluye las reglas de deteccion, activando el modo NIDS. `-l` indica el directorio de logs. Sin `-c`, Snort opera como sniffer o logger.
</details>

### Pregunta 3
¿Que filtro de tcpdump captura solo paquetes TCP con el flag SYN activado (sin ACK)?

a) `tcpdump -i eth0 'tcp syn'`
b) `tcpdump -i eth0 'tcp[tcpflags] == tcp-syn'`
c) `tcpdump -i eth0 'tcp flags syn'`
d) `tcpdump -i eth0 -syn`

<details><summary>Respuesta</summary>

**b)** `tcpdump -i eth0 'tcp[tcpflags] == tcp-syn'`

El filtro `tcp[tcpflags] == tcp-syn` captura paquetes donde SOLO el flag SYN esta activo. Usar `& tcp-syn != 0` capturaria cualquier paquete con SYN, incluyendo SYN-ACK.
</details>

### Pregunta 4
¿Que ventaja principal tiene Suricata sobre Snort?

a) Suricata es gratuito y Snort es de pago
b) Suricata soporta multi-hilo nativo
c) Suricata no necesita reglas
d) Suricata solo funciona en modo IPS

<details><summary>Respuesta</summary>

**b)** Suricata soporta multi-hilo nativo

Suricata fue diseñado desde el inicio con soporte multi-hilo, permitiendo aprovechar multiples nucleos de CPU para mejor rendimiento. Snort clasico es mono-hilo. Ambos son open source.
</details>

### Pregunta 5
¿Que archivo de log de Zeek contiene informacion sobre todas las conexiones de red observadas?

a) `http.log`
b) `notice.log`
c) `conn.log`
d) `network.log`

<details><summary>Respuesta</summary>

**c)** `conn.log`

`conn.log` registra un resumen de cada conexion observada, incluyendo IPs de origen y destino, puertos, protocolo, duracion, bytes transferidos y servicio detectado.
</details>

### Pregunta 6
En una regla de Snort, ¿que opcion especifica el patron de contenido a buscar en el payload del paquete?

a) `pattern:`
b) `match:`
c) `content:`
d) `payload:`

<details><summary>Respuesta</summary>

**c)** `content:`

La opcion `content:` especifica una cadena o patron hexadecimal que Snort buscara en el payload del paquete. Puede combinarse con `nocase` para busqueda insensible a mayusculas y con `http_uri` para limitar la busqueda a la URI HTTP.
</details>

### Pregunta 7
¿Que comando de tshark extrae solo las direcciones IP de origen y destino de un archivo PCAP?

a) `tshark -r captura.pcap -Y "ip.src and ip.dst"`
b) `tshark -r captura.pcap -T fields -e ip.src -e ip.dst`
c) `tshark -r captura.pcap --extract ip.src ip.dst`
d) `tshark -r captura.pcap -f "ip.src ip.dst"`

<details><summary>Respuesta</summary>

**b)** `tshark -r captura.pcap -T fields -e ip.src -e ip.dst`

`-T fields` cambia el formato de salida a campos, y `-e campo` especifica que campos extraer. Esto permite obtener datos estructurados para analisis posterior.
</details>

### Pregunta 8
¿Que tipo de deteccion de intrusiones es mas eficaz contra ataques zero-day?

a) Basada en firmas
b) Basada en anomalias
c) Basada en listas negras
d) Basada en protocolos

<details><summary>Respuesta</summary>

**b)** Basada en anomalias

La deteccion basada en anomalias establece una linea base del comportamiento normal y alerta cuando se detectan desviaciones. Esto permite detectar ataques nuevos (zero-day) que no tienen firma conocida, aunque genera mas falsos positivos.
</details>

### Pregunta 9
¿Que opcion de tcpdump captura paquetes sin truncar el contenido?

a) `tcpdump -i eth0 -full`
b) `tcpdump -i eth0 -s 0`
c) `tcpdump -i eth0 -complete`
d) `tcpdump -i eth0 -l 65535`

<details><summary>Respuesta</summary>

**b)** `tcpdump -i eth0 -s 0`

La opcion `-s 0` (snaplen 0) captura el paquete completo sin truncar. Por defecto, tcpdump puede truncar paquetes grandes. El valor 0 significa capturar el maximo posible (65535 bytes).
</details>

### Pregunta 10
¿Que herramienta proporciona monitorizacion de trafico de red en tiempo real con interfaz web?

a) Snort
b) Zeek
c) ntopng
d) tcpdump

<details><summary>Respuesta</summary>

**c)** ntopng

ntopng proporciona una interfaz web (por defecto en el puerto 3000) que muestra estadisticas de trafico en tiempo real, flujos de red, hosts activos y alertas. Snort y Zeek no tienen interfaz web nativa; tcpdump es solo linea de comandos.
</details>
