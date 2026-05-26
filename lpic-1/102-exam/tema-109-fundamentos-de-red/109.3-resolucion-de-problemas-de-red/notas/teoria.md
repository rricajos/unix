# 109.3 Resolucion de problemas basicos de red - Teoria

## Metodologia de troubleshooting de red

La resolucion de problemas de red se realiza de **abajo hacia arriba**, siguiendo las capas del modelo TCP/IP:

1. **Capa fisica / enlace**: ¿La interfaz esta activa? ¿Hay enlace fisico?
2. **Capa IP**: ¿Tiene direccion IP correcta? ¿La mascara es correcta?
3. **Gateway**: ¿Se puede alcanzar el gateway? ¿La ruta por defecto existe?
4. **DNS**: ¿Se resuelven los nombres correctamente?
5. **Servicio**: ¿El puerto del servicio esta abierto? ¿El servicio responde?

### Secuencia practica de diagnostico
```bash
# 1. Verificar interfaz activa
ip link show
ip addr show

# 2. Hacer ping a la propia IP
ping -c 3 192.168.1.100

# 3. Hacer ping al gateway
ping -c 3 192.168.1.1

# 4. Hacer ping a una IP externa
ping -c 3 8.8.8.8

# 5. Verificar DNS
ping -c 3 google.com
dig google.com

# 6. Verificar servicio
ss -tlnp
nc -zv servidor 80
```

---

## ping / ping6

Usa ICMP Echo Request/Reply para verificar conectividad.

```bash
ping host                       # Ping continuo (Ctrl+C para parar)
ping -c 5 host                  # Enviar solo 5 paquetes
ping -i 2 host                  # Intervalo de 2 segundos entre pings
ping -w 10 host                 # Timeout total de 10 segundos
ping -W 2 host                  # Timeout por paquete de 2 segundos
ping -s 1000 host               # Tamano del paquete (1000 bytes)
ping -I eth0 host               # Usar interfaz especifica
ping -4 host                    # Forzar IPv4
ping -6 host                    # Forzar IPv6
ping6 host                      # Ping IPv6 (comando legacy)
```

### Interpretacion de resultados
```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=11.8 ms

--- 8.8.8.8 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
rtt min/avg/max/mdev = 11.800/12.050/12.300/0.250 ms
```

- **ttl**: Time To Live (saltos restantes)
- **time**: Tiempo de ida y vuelta (latencia)
- **packet loss**: Porcentaje de paquetes perdidos

---

## traceroute / tracepath

Muestran la ruta que siguen los paquetes hasta el destino.

### traceroute
```bash
traceroute host                 # Trazar ruta (usa UDP por defecto)
traceroute -I host              # Usar ICMP en vez de UDP
traceroute -T host              # Usar TCP
traceroute -n host              # No resolver nombres (mas rapido)
traceroute -p 80 host           # Puerto especifico
```

### tracepath
```bash
tracepath host                  # Alternativa que no requiere root
tracepath -n host               # Sin resolucion DNS
```

- **traceroute** puede requerir permisos de root
- **tracepath** es una alternativa mas simple que no requiere root
- Ambos muestran los routers intermedios (saltos/hops)

### Versiones IPv6
```bash
# traceroute para IPv6
traceroute6 host
traceroute -6 host              # Equivalente con traceroute moderno

# tracepath para IPv6
tracepath6 host
tracepath -6 host               # Equivalente con tracepath moderno
```

### Interpretar la salida
```
 1  192.168.1.1 (192.168.1.1)  1.234 ms  1.123 ms  1.089 ms
 2  10.0.0.1 (10.0.0.1)  5.678 ms  5.432 ms  5.321 ms
 3  * * *
 4  8.8.8.8 (8.8.8.8)  12.345 ms  12.234 ms  12.123 ms
```

- Cada linea es un salto (router)
- Tres tiempos de respuesta por salto
- `* * *` = el router no responde (puede ser filtrado por firewall)

---

## mtr

Combina `ping` y `traceroute` en una herramienta interactiva en tiempo real.

```bash
mtr host                        # Modo interactivo
mtr -r host                     # Modo reporte (genera informe)
mtr -r -c 10 host               # Reporte con 10 ciclos
mtr -n host                     # Sin resolucion DNS
mtr -T host                     # Usar TCP en vez de ICMP
mtr -P 80 host                  # Puerto TCP especifico
```

### Salida tipica
```
                             My traceroute  [v0.95]
 Host                        Loss%   Snt   Last   Avg  Best  Wrst StDev
 1. 192.168.1.1               0.0%    10    1.2   1.3   1.0   1.5   0.2
 2. 10.0.0.1                  0.0%    10    5.4   5.5   5.2   5.9   0.3
 3. 8.8.8.8                   0.0%    10   12.1  12.3  11.8  12.9   0.4
```

- **Loss%**: Porcentaje de paquetes perdidos
- **Avg**: Latencia promedio
- Muy util para detectar donde hay perdida de paquetes o alta latencia

---

## Tabla de rutas y enrutamiento IPv6

### Ver tabla de rutas IPv6
```bash
# Con iproute2 (recomendado)
ip -6 route show
ip -6 route

# Con route (legacy)
route -6
route -A inet6
```

### Banderas (flags) de la tabla de rutas

Al ejecutar `route -n` o `netstat -rn`, la columna **Flags** muestra caracteres que describen cada ruta:

| Flag | Significado | Descripcion |
|------|-------------|-------------|
| `U` | Up | La ruta esta activa |
| `G` | Gateway | La ruta usa un gateway (no es directamente conectada) |
| `H` | Host | El destino es un host especifico (no una red) |
| `!` | Reject | La ruta rechaza los paquetes (ruta de rechazo) |
| `D` | Dynamic | Ruta creada dinamicamente (por ICMP redirect) |
| `M` | Modified | Ruta modificada dinamicamente |

```bash
# Ejemplo de salida de route -n
$ route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 eth0
192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0
10.0.0.5        192.168.1.1     255.255.255.255 UGH   0      0        0 eth0
```

En este ejemplo:
- `UG` = Ruta activa que usa gateway (ruta por defecto)
- `U` = Ruta activa directamente conectada
- `UGH` = Ruta activa, usa gateway, destino es un host especifico

---

## netstat (legacy - net-tools)

```bash
netstat -tulnp                  # Puertos TCP/UDP en escucha con PID
netstat -a                      # Todas las conexiones
netstat -r                      # Tabla de rutas (como route -n)
netstat -i                      # Estadisticas de interfaces
netstat -s                      # Estadisticas por protocolo
netstat -t                      # Solo TCP
netstat -u                      # Solo UDP
netstat -l                      # Solo en escucha (listening)
netstat -n                      # Numerico (no resolver nombres)
netstat -p                      # Mostrar PID/programa
```

### Opciones mas usadas combinadas: `-tulnp`
- **t**: TCP
- **u**: UDP
- **l**: Listening (en escucha)
- **n**: Numerico
- **p**: Programa/PID

> `netstat` esta **deprecado**. Se recomienda usar `ss`.

---

## ss (socket statistics)

Reemplazo moderno de `netstat`, mas rapido y con mas funcionalidades.

```bash
ss -tulnp                      # Puertos TCP/UDP en escucha con PID
ss -a                          # Todas las conexiones
ss -t                          # Solo TCP
ss -u                          # Solo UDP
ss -l                          # Solo en escucha
ss -n                          # Numerico
ss -p                          # Mostrar proceso
ss -s                          # Resumen estadistico
ss -o                          # Mostrar temporizadores
ss state established           # Solo conexiones establecidas
ss sport = :22                 # Filtrar por puerto origen 22
ss dport = :80                 # Filtrar por puerto destino 80
```

### Ejemplo de salida `ss -tulnp`
```
Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process
tcp    LISTEN  0       128      0.0.0.0:22            0.0.0.0:*          users:(("sshd",pid=1234,fd=3))
tcp    LISTEN  0       128      0.0.0.0:80            0.0.0.0:*          users:(("nginx",pid=5678,fd=6))
udp    UNCONN  0       0        0.0.0.0:68            0.0.0.0:*          users:(("dhclient",pid=910,fd=7))
```

---

## ip (para diagnostico)

```bash
ip addr show                    # Ver direcciones IP
ip link show                    # Ver estado de interfaces
ip route show                   # Ver tabla de rutas
ip neigh show                   # Ver tabla ARP
ip -s link show eth0            # Estadisticas de interfaz
```

---

## hostname

```bash
hostname                        # Nombre del host
hostname -f                     # FQDN
hostname -i                     # Direccion IP del host
hostname -I                     # Todas las IPs del host
```

---

## netcat / nc

Herramienta versatil para conexiones de red (la "navaja suiza" de las redes).

```bash
# Verificar si un puerto esta abierto
nc -zv host 80                  # Test de conexion al puerto 80
nc -zv host 20-25               # Escanear rango de puertos

# Escuchar en un puerto
nc -l 1234                      # Escuchar en puerto 1234

# Enviar datos
echo "GET / HTTP/1.0" | nc host 80   # Peticion HTTP manual

# Transferir archivos
nc -l 1234 > archivo.txt              # Receptor
nc host 1234 < archivo.txt            # Emisor
```

Opciones:
| Opcion | Descripcion |
|--------|-------------|
| `-z` | Solo escaneo (zero I/O, no enviar datos) |
| `-v` | Modo verbose |
| `-l` | Modo escucha (listen) |
| `-w N` | Timeout de N segundos |
| `-u` | Usar UDP en vez de TCP |

---

## tcpdump

Captura y analiza trafico de red (requiere root).

```bash
tcpdump                         # Capturar todo el trafico
tcpdump -i eth0                 # Capturar en interfaz especifica
tcpdump -n                      # No resolver nombres
tcpdump -c 10                   # Capturar solo 10 paquetes
tcpdump host 192.168.1.100      # Filtrar por host
tcpdump port 80                 # Filtrar por puerto
tcpdump src 192.168.1.100       # Filtrar por origen
tcpdump dst port 443            # Filtrar por puerto destino
tcpdump -w captura.pcap         # Guardar en archivo
tcpdump -r captura.pcap         # Leer archivo de captura
tcpdump -A                      # Mostrar contenido en ASCII
tcpdump icmp                    # Solo trafico ICMP
```

> **Para el examen**: Se espera conocimiento **basico** de tcpdump, no uso avanzado.

---

## Puntos clave para el examen

1. Metodologia de troubleshooting: **de abajo a arriba** (enlace -> IP -> gateway -> DNS -> servicio)
2. **ping** usa ICMP; `ping -c N` limita el numero de paquetes
3. **traceroute** muestra la ruta; **tracepath** no requiere root
4. **traceroute6** / **tracepath6** son las versiones para IPv6
5. **mtr** combina ping + traceroute en tiempo real
6. **ss** reemplaza a **netstat**; `-tulnp` es la combinacion mas comun
7. **nc -zv host puerto** verifica si un puerto esta abierto
8. **tcpdump** captura trafico; `-i` para interfaz, `-w` para guardar
9. **`ip addr`** muestra IPs, **`ip route`** muestra rutas, **`ip -6 route`** rutas IPv6
10. **Flags de rutas**: U=up, G=gateway, H=host, !=reject
11. `netstat -r` e `ip route` muestran la tabla de enrutamiento
12. **ping6** es el equivalente de ping para IPv6
