---
title: "205.3 - Resolucion de problemas de red"
tags: [lpic-2, examen-201, tema-205, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.3"
---

# 205.3 - Resolucion de problemas de red

## Metodologia de diagnostico por capas

La resolucion de problemas de red se aborda sistematicamente siguiendo el modelo de capas (de abajo hacia arriba):

### Nivel 1 - Capa fisica y enlace

1. Verificar que el cable esta conectado y la interfaz esta activa
2. Comprobar velocidad y duplex de la interfaz
3. Verificar la tabla ARP

```bash
# Verificar estado fisico de la interfaz
ip link show eth0
ethtool eth0

# Verificar la tabla ARP
ip neigh show
arp -a
```

### Nivel 2 - Capa de red

4. Verificar la configuracion IP
5. Comprobar la puerta de enlace
6. Verificar la tabla de enrutamiento
7. Probar conectividad con ping

```bash
ip addr show
ip route show
ping -c 4 192.168.1.1
ping -c 4 8.8.8.8
```

### Nivel 3 - Capa de transporte

8. Verificar que los puertos estan abiertos
9. Comprobar que los servicios estan escuchando
10. Verificar conectividad a puertos especificos

```bash
ss -tlnp
nc -zv servidor 80
```

### Nivel 4 - Capa de aplicacion

11. Verificar resolucion DNS
12. Probar el servicio especifico
13. Revisar logs de la aplicacion

```bash
dig servidor.com
curl -v http://servidor.com
```

> **Para el examen:** Seguir un enfoque metodologico por capas es fundamental. Empieza siempre por lo basico (cable, IP, gateway) antes de investigar problemas mas complejos.

## ping - Prueba de conectividad basica

El comando `ping` envia paquetes ICMP Echo Request y espera ICMP Echo Reply para verificar la conectividad.

```bash
# Ping basico (4 paquetes)
ping -c 4 192.168.1.1

# Ping continuo (Ctrl+C para detener)
ping 192.168.1.1

# Ping con tamano de paquete especifico
ping -s 1500 -c 4 192.168.1.1

# Ping con intervalo personalizado (0.2 segundos)
ping -i 0.2 -c 10 192.168.1.1

# Ping sin resolver nombres (mas rapido)
ping -n -c 4 192.168.1.1

# Ping con TTL especifico
ping -t 10 -c 4 192.168.1.1

# Ping IPv6
ping6 2001:db8::1
ping -6 2001:db8::1

# Ping por una interfaz especifica
ping -I eth0 192.168.1.1
```

### Interpretacion de resultados

```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=11.8 ms

--- 8.8.8.8 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 11.800/12.050/12.300/0.250 ms
```

| Campo | Significado |
|---|---|
| `icmp_seq` | Numero de secuencia del paquete |
| `ttl` | Time To Live restante (saltos restantes) |
| `time` | Tiempo de ida y vuelta (RTT) |
| `packet loss` | Porcentaje de paquetes perdidos |
| `rtt min/avg/max/mdev` | Estadisticas de latencia |

## traceroute / tracepath - Trazar la ruta

### traceroute

Muestra cada salto (router) en la ruta hacia el destino.

```bash
# Traceroute basico
traceroute 8.8.8.8

# Traceroute usando ICMP (en lugar de UDP)
traceroute -I 8.8.8.8

# Traceroute usando TCP al puerto 80
traceroute -T -p 80 www.ejemplo.com

# Traceroute sin resolver nombres DNS
traceroute -n 8.8.8.8

# Traceroute con maximo de saltos
traceroute -m 20 8.8.8.8

# Traceroute IPv6
traceroute6 2001:db8::1
traceroute -6 2001:db8::1
```

### tracepath

Alternativa a traceroute que no requiere privilegios de root y detecta automaticamente la MTU del camino.

```bash
# Tracepath basico
tracepath 8.8.8.8

# Tracepath sin resolver nombres
tracepath -n 8.8.8.8

# Tracepath IPv6
tracepath6 2001:db8::1
```

### Interpretacion de la salida

```
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)     1.234 ms  1.100 ms  1.050 ms
 2  10.0.0.1 (10.0.0.1)           5.678 ms  5.432 ms  5.321 ms
 3  * * *                           (sin respuesta - firewall o filtro)
 4  8.8.8.8 (8.8.8.8)            12.345 ms  12.100 ms  11.987 ms
```

- Cada linea es un salto (router intermedio)
- Tres tiempos por salto (tres intentos)
- `* * *` indica que el router no responde (no necesariamente un problema)

## mtr - My Traceroute

`mtr` combina la funcionalidad de `ping` y `traceroute` en una herramienta interactiva de monitorizacion continua.

```bash
# mtr interactivo
mtr 8.8.8.8

# mtr con reporte (no interactivo)
mtr --report 8.8.8.8
mtr -r 8.8.8.8

# mtr con numero de ciclos
mtr -r -c 100 8.8.8.8

# mtr sin resolver DNS
mtr -n 8.8.8.8

# mtr con ICMP
mtr --icmp 8.8.8.8

# mtr mostrando ambas IP y hostname
mtr -b 8.8.8.8
```

### Columnas de mtr

| Columna | Significado |
|---|---|
| `Host` | Router en el salto |
| `Loss%` | Porcentaje de paquetes perdidos |
| `Snt` | Paquetes enviados |
| `Last` | Ultimo RTT medido |
| `Avg` | RTT promedio |
| `Best` | Mejor RTT (minimo) |
| `Wrst` | Peor RTT (maximo) |
| `StDev` | Desviacion estandar |

> **Para el examen:** `mtr` es la herramienta mas completa para diagnosticar problemas de ruta. La columna `Loss%` indica perdida de paquetes en cada salto, y `Avg` muestra la latencia media.

## ss / netstat - Conexiones y puertos

### ss (socket statistics) - Reemplazo moderno de netstat

```bash
# Ver todos los sockets TCP en escucha
ss -tlnp

# Ver todos los sockets (TCP y UDP) en escucha
ss -tulnp

# Ver todas las conexiones TCP establecidas
ss -tnp

# Ver conexiones a un puerto especifico
ss -tnp sport = :80

# Ver conexiones a una IP especifica
ss -tnp dst 192.168.1.100

# Ver estadisticas de sockets
ss -s

# Ver sockets Unix
ss -xlnp
```

### Opciones de ss

| Opcion | Significado |
|---|---|
| `-t` | Sockets TCP |
| `-u` | Sockets UDP |
| `-l` | Solo sockets en escucha (listening) |
| `-n` | No resolver nombres (numerico) |
| `-p` | Mostrar proceso propietario |
| `-a` | Todos los sockets (escucha + establecidos) |
| `-s` | Resumen de estadisticas |
| `-4` | Solo IPv4 |
| `-6` | Solo IPv6 |

### netstat (legacy)

```bash
# Equivalente a ss -tlnp
netstat -tlnp

# Ver todas las conexiones
netstat -anp

# Ver estadisticas de interfaces
netstat -i

# Ver tabla de enrutamiento (legacy)
netstat -rn
```

> **Para el examen:** `ss` es mas rapido y eficiente que `netstat`. La combinacion `-tlnp` (TCP, listening, numeric, process) es la mas utilizada para verificar servicios en escucha.

## tcpdump - Captura de paquetes

`tcpdump` es un analizador de paquetes de red en linea de comandos. Es esencial para diagnostico avanzado.

```bash
# Capturar trafico en una interfaz
tcpdump -i eth0

# Capturar con detalle y sin resolver nombres
tcpdump -i eth0 -nn -v

# Capturar trafico de/hacia un host
tcpdump -i eth0 host 192.168.1.100

# Capturar trafico a un puerto especifico
tcpdump -i eth0 port 80

# Capturar solo trafico TCP
tcpdump -i eth0 tcp

# Capturar trafico TCP al puerto 443 de un host
tcpdump -i eth0 tcp and host 192.168.1.100 and port 443

# Capturar solo paquetes SYN (inicio de conexion)
tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0'

# Guardar captura en archivo pcap
tcpdump -i eth0 -w /tmp/captura.pcap

# Leer un archivo pcap
tcpdump -r /tmp/captura.pcap

# Limitar a N paquetes
tcpdump -i eth0 -c 100

# Capturar sin truncar paquetes (contenido completo)
tcpdump -i eth0 -s 0

# Capturar en todas las interfaces
tcpdump -i any
```

### Filtros comunes de tcpdump

| Filtro | Descripcion | Ejemplo |
|---|---|---|
| `host IP` | Trafico de/hacia una IP | `tcpdump host 10.0.0.1` |
| `src IP` | Trafico desde una IP | `tcpdump src 10.0.0.1` |
| `dst IP` | Trafico hacia una IP | `tcpdump dst 10.0.0.1` |
| `port N` | Trafico en un puerto | `tcpdump port 80` |
| `net RED` | Trafico de una red | `tcpdump net 192.168.1.0/24` |
| `tcp/udp/icmp` | Por protocolo | `tcpdump icmp` |
| `and/or/not` | Operadores logicos | `tcpdump tcp and port 80` |

> **Para el examen:** Conoce las opciones `-i` (interfaz), `-w` (escribir pcap), `-r` (leer pcap), `-nn` (no resolver) y los filtros basicos de host, port y protocol.

## nmap - Escaneo de red

`nmap` escanea hosts y puertos para descubrir servicios y evaluar la seguridad.

```bash
# Escaneo basico de puertos TCP
nmap 192.168.1.100

# Escaneo de rango de IPs
nmap 192.168.1.0/24

# Escaneo rapido (puertos mas comunes)
nmap -F 192.168.1.100

# Escaneo de puertos especificos
nmap -p 22,80,443 192.168.1.100

# Escaneo de rango de puertos
nmap -p 1-1024 192.168.1.100

# Escaneo UDP
nmap -sU 192.168.1.100

# Escaneo SYN (stealth scan, requiere root)
nmap -sS 192.168.1.100

# Escaneo TCP connect (sin root)
nmap -sT 192.168.1.100

# Deteccion de sistema operativo
nmap -O 192.168.1.100

# Deteccion de version de servicios
nmap -sV 192.168.1.100

# Ping sweep (descubrir hosts activos)
nmap -sn 192.168.1.0/24

# Escaneo sin ping previo
nmap -Pn 192.168.1.100

# Escaneo completo y agresivo
nmap -A 192.168.1.100
```

### Estados de puertos en nmap

| Estado | Significado |
|---|---|
| `open` | Puerto aceptando conexiones |
| `closed` | Puerto accesible pero sin servicio |
| `filtered` | Firewall impide determinar el estado |
| `unfiltered` | Puerto accesible, estado no determinado |
| `open\|filtered` | No se puede determinar si abierto o filtrado |

## nc / ncat - Navaja suiza de red

`nc` (netcat) o `ncat` (version mejorada de nmap) permite crear conexiones TCP/UDP arbitrarias.

```bash
# Verificar si un puerto esta abierto
nc -zv 192.168.1.100 80

# Escaneo de rango de puertos
nc -zv 192.168.1.100 20-25

# Crear un listener TCP en un puerto
nc -l -p 8080

# Enviar datos a un puerto
echo "GET / HTTP/1.0" | nc 192.168.1.100 80

# Transferir un archivo
# Receptor:
nc -l -p 9999 > archivo_recibido
# Emisor:
nc 192.168.1.100 9999 < archivo_a_enviar

# Modo UDP
nc -u 192.168.1.100 53

# Timeout de conexion
nc -w 5 -zv 192.168.1.100 80
```

### Opciones de nc/ncat

| Opcion | Significado |
|---|---|
| `-z` | Modo escaneo (zero I/O, solo verificar) |
| `-v` | Modo verbose |
| `-l` | Modo escucha (listener) |
| `-p N` | Puerto local |
| `-u` | Modo UDP (por defecto es TCP) |
| `-w N` | Timeout en segundos |
| `-k` | Mantener listener activo tras desconexion |

## Herramientas DNS: dig, nslookup, host

### dig (Domain Information Groper)

```bash
# Consulta basica de un dominio
dig ejemplo.com

# Consultar un tipo de registro especifico
dig ejemplo.com MX
dig ejemplo.com NS
dig ejemplo.com AAAA
dig ejemplo.com TXT

# Consultar un servidor DNS especifico
dig @8.8.8.8 ejemplo.com

# Consulta inversa (IP a nombre)
dig -x 8.8.8.8

# Respuesta corta (solo la respuesta)
dig +short ejemplo.com

# Trazar la resolucion completa
dig +trace ejemplo.com

# Sin recursion
dig +norecurse ejemplo.com

# Consultar todos los registros
dig ejemplo.com ANY
```

### nslookup

```bash
# Consulta basica
nslookup ejemplo.com

# Consultar un servidor DNS especifico
nslookup ejemplo.com 8.8.8.8

# Consulta inversa
nslookup 8.8.8.8

# Cambiar tipo de registro (modo interactivo)
nslookup
> set type=MX
> ejemplo.com
> exit
```

### host

```bash
# Consulta basica
host ejemplo.com

# Consultar tipo especifico
host -t MX ejemplo.com
host -t NS ejemplo.com

# Consulta inversa
host 8.8.8.8

# Usar servidor DNS especifico
host ejemplo.com 8.8.8.8

# Modo verbose
host -v ejemplo.com
```

> **Para el examen:** `dig` es la herramienta DNS mas completa y preferida. Conoce `+short` para respuestas concisas, `+trace` para ver la cadena de resolucion completa, y `@servidor` para consultar un DNS especifico.

## ethtool - Informacion de la interfaz fisica

```bash
# Ver parametros de la interfaz
ethtool eth0
# Settings for eth0:
#   Speed: 1000Mb/s
#   Duplex: Full
#   Auto-negotiation: on
#   Link detected: yes

# Ver estadisticas del driver
ethtool -S eth0

# Ver informacion del driver
ethtool -i eth0

# Forzar velocidad y duplex
ethtool -s eth0 speed 100 duplex full autoneg off

# Identificar interfaz (parpadear LED)
ethtool -p eth0

# Ver offloading
ethtool -k eth0
```

## arp / ip neigh - Tabla de vecinos

```bash
# Ver tabla ARP (legacy)
arp -a
arp -n

# Ver tabla de vecinos (moderno)
ip neigh show

# Agregar entrada ARP estatica
arp -s 192.168.1.50 00:11:22:33:44:55
ip neigh add 192.168.1.50 lladdr 00:11:22:33:44:55 dev eth0

# Eliminar entrada
arp -d 192.168.1.50
ip neigh del 192.168.1.50 dev eth0

# Limpiar cache ARP
ip neigh flush all
```

### Estados de la tabla de vecinos

| Estado | Significado |
|---|---|
| `REACHABLE` | Entrada verificada recientemente |
| `STALE` | Entrada valida pero antigua |
| `DELAY` | Esperando confirmacion de accesibilidad |
| `PROBE` | Enviando solicitud de verificacion |
| `FAILED` | No se pudo resolver la direccion |
| `PERMANENT` | Entrada estatica configurada manualmente |

## iptraf-ng - Monitor de trafico interactivo

```bash
# Iniciar iptraf-ng (interfaz interactiva)
iptraf-ng

# Opciones del menu:
# - IP Traffic Monitor: Trafico por conexion
# - General Interface Statistics: Estadisticas generales
# - Detailed Interface Statistics: Estadisticas detalladas
# - Statistical Breakdowns: Analisis por tamano/protocolo
# - LAN Station Monitor: Actividad por MAC
```

## Escenarios comunes de diagnostico

### No hay conectividad a Internet

```bash
# 1. Verificar interfaz
ip link show
ethtool eth0

# 2. Verificar IP y gateway
ip addr show
ip route show

# 3. Ping al gateway
ping -c 4 192.168.1.1

# 4. Ping a IP publica
ping -c 4 8.8.8.8

# 5. Verificar DNS
dig google.com
cat /etc/resolv.conf

# 6. Si ping funciona pero no DNS:
# -> Problema de resolucion de nombres
```

### Un servicio no responde

```bash
# 1. Verificar que el servicio esta corriendo
systemctl status servicio

# 2. Verificar que escucha en el puerto correcto
ss -tlnp | grep :80

# 3. Verificar conectividad al puerto
nc -zv servidor 80

# 4. Verificar firewall
iptables -L -n
nft list ruleset

# 5. Capturar trafico para analisis
tcpdump -i eth0 port 80 -nn
```

### Latencia alta o perdida de paquetes

```bash
# 1. mtr para ver donde se produce el problema
mtr --report 8.8.8.8

# 2. Ping con tamanos variables (problema de MTU)
ping -s 1472 -M do -c 4 destino

# 3. Verificar errores en la interfaz
ip -s link show eth0
ethtool -S eth0

# 4. Verificar carga del sistema
top
ss -s
```
