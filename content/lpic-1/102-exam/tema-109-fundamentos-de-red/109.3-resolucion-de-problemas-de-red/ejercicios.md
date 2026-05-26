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

## Ejercicio 1
Describe la metodologia de troubleshooting de red de abajo hacia arriba. ¿Que comandos usarias en cada paso?

<details><summary>Respuesta</summary>

1. **Capa fisica/enlace**: Verificar que la interfaz esta activa
   ```bash
   ip link show
   ```
2. **Capa IP**: Verificar que tiene IP correcta
   ```bash
   ip addr show
   ping -c 3 MI_IP
   ```
3. **Gateway**: Verificar conectividad al gateway
   ```bash
   ip route show          # Ver ruta por defecto
   ping -c 3 GATEWAY
   ```
4. **Conectividad externa**: Ping a una IP publica
   ```bash
   ping -c 3 8.8.8.8
   ```
5. **DNS**: Verificar resolucion de nombres
   ```bash
   ping -c 3 google.com
   ```
6. **Servicio**: Verificar que el servicio responde
   ```bash
   ss -tulnp
   nc -zv host puerto
   ```

</details>

## Ejercicio 2
¿Cual es la diferencia entre `netstat` y `ss`? ¿Que significa la combinacion de flags `-tulnp`?

<details><summary>Respuesta</summary>

- **`netstat`** pertenece al paquete `net-tools` y esta **deprecado**
- **`ss`** (socket statistics) es su reemplazo moderno del paquete `iproute2`, mas rapido y con mas funcionalidades

Las flags `-tulnp` significan:
- **t**: TCP
- **u**: UDP
- **l**: Listening (solo conexiones en escucha)
- **n**: Numerico (no resolver nombres)
- **p**: Process (mostrar PID y nombre del programa)

Ejemplo: `ss -tulnp` muestra todos los puertos TCP y UDP en escucha con el proceso asociado.

</details>

## Ejercicio 3
¿Que diferencia hay entre `traceroute`, `tracepath` y `mtr`?

<details><summary>Respuesta</summary>

- **`traceroute`**: Muestra la ruta que siguen los paquetes hasta el destino. Usa UDP por defecto. Puede requerir permisos de root.
- **`tracepath`**: Similar a traceroute pero **no requiere root**. Es mas simple y no tiene tantas opciones.
- **`mtr`**: Combina `ping` + `traceroute` en una herramienta **interactiva en tiempo real**. Muestra continuamente la ruta, latencia y perdida de paquetes. Muy util para diagnosticar problemas intermitentes.

Para un informe puntual usa `traceroute/tracepath`. Para monitoreo continuo usa `mtr`.

</details>

## Ejercicio 4
¿Como verificarias si el puerto 443 (HTTPS) esta abierto en el servidor 192.168.1.50 usando `nc`?

<details><summary>Respuesta</summary>

```bash
nc -zv 192.168.1.50 443
```

- `-z`: Modo escaneo (no envia datos)
- `-v`: Modo verbose

Salida exitosa:
```
Connection to 192.168.1.50 443 port [tcp/https] succeeded!
```

Salida fallida:
```
nc: connect to 192.168.1.50 port 443 (tcp) failed: Connection refused
```

</details>

## Ejercicio 5
Un usuario reporta que no puede acceder a `www.ejemplo.com`. Puede hacer ping a 8.8.8.8 exitosamente. ¿Cual es probablemente el problema y como lo diagnosticarias?

<details><summary>Respuesta</summary>

Si el ping a una IP publica (8.8.8.8) funciona pero no puede acceder a un nombre de dominio, el problema es probablemente de **resolucion DNS**.

Diagnostico:
```bash
# Verificar configuracion DNS
cat /etc/resolv.conf

# Intentar resolver el nombre
dig www.ejemplo.com
nslookup www.ejemplo.com
host www.ejemplo.com

# Probar con un DNS especifico
dig @8.8.8.8 www.ejemplo.com

# Verificar nsswitch.conf
cat /etc/nsswitch.conf
```

Posibles causas:
- `/etc/resolv.conf` sin servidores DNS o con servidores incorrectos
- Servidor DNS no accesible (firewall bloqueando puerto 53)
- Error en la configuracion de `/etc/nsswitch.conf`

</details>

## Ejercicio 6
¿Como capturarias solo el trafico HTTP (puerto 80) en la interfaz eth0 usando `tcpdump` y lo guardarias en un archivo?

<details><summary>Respuesta</summary>

```bash
tcpdump -i eth0 port 80 -w captura_http.pcap
```

- `-i eth0`: Capturar en la interfaz eth0
- `port 80`: Solo trafico del puerto 80
- `-w captura_http.pcap`: Guardar en archivo

Para leer la captura posteriormente:
```bash
tcpdump -r captura_http.pcap
tcpdump -r captura_http.pcap -A    # Con contenido ASCII
```

Variantes utiles:
```bash
tcpdump -i eth0 port 80 -n -c 100      # 100 paquetes, sin DNS
tcpdump -i eth0 host 192.168.1.1 and port 80   # Filtro combinado
```

</details>

## Ejercicio 7
¿Que comando moderno usarias para ver todas las conexiones TCP establecidas en el sistema?

<details><summary>Respuesta</summary>

```bash
ss -tnp state established
```

O mas simple:
```bash
ss -tnp | grep ESTAB
```

- `-t`: Solo TCP
- `-n`: Numerico
- `-p`: Mostrar proceso
- `state established`: Solo conexiones establecidas

Con netstat legacy:
```bash
netstat -tnp | grep ESTABLISHED
```

</details>

## Ejercicio 8
¿Que significan los asteriscos `* * *` en la salida de `traceroute`? ¿Y un valor de TTL bajo en la respuesta de `ping`?

<details><summary>Respuesta</summary>

**Asteriscos en traceroute**:
Los `* * *` indican que el router de ese salto **no respondio** dentro del tiempo limite. Esto puede deberse a:
- El router tiene ICMP deshabilitado o filtrado por firewall
- El paquete fue descartado
- No significa necesariamente que haya un problema de conectividad

**TTL bajo en ping**:
El TTL (Time To Live) se decrementa en cada salto (router). Un TTL bajo indica que el paquete ha pasado por **muchos routers** para llegar al destino. Los valores tipicos iniciales son 64 (Linux), 128 (Windows) y 255 (algunos dispositivos de red). Si el TTL llega a 0, el paquete se descarta y se envia un mensaje ICMP "Time Exceeded".

</details>
