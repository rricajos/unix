# 109.2 Configuracion persistente de red - Ejercicios

## Ejercicio 1
¿Cual es la diferencia entre `ip addr` e `ifconfig`? ¿Cual se recomienda usar actualmente?

<details><summary>Respuesta</summary>

Ambos muestran y configuran interfaces de red, pero:

- **`ifconfig`** pertenece al paquete `net-tools` y esta **deprecado**. No soporta todas las funcionalidades modernas.
- **`ip addr`** pertenece al paquete `iproute2` y es la herramienta **recomendada**. Soporta IPv6 completo, multiples direcciones por interfaz y mas opciones.

Equivalencias:
- `ifconfig` -> `ip addr show` / `ip link show`
- `route` -> `ip route`
- `arp` -> `ip neigh`

</details>

## Ejercicio 2
Explica que significa la linea `hosts: files dns myhostname` en `/etc/nsswitch.conf`.

<details><summary>Respuesta</summary>

Esta linea define el **orden de busqueda** para resolver nombres de host:

1. **files**: Primero busca en `/etc/hosts`
2. **dns**: Si no lo encuentra, consulta los servidores DNS definidos en `/etc/resolv.conf`
3. **myhostname**: Como ultimo recurso, resuelve el nombre del propio host

Esto significa que las entradas en `/etc/hosts` tienen **prioridad** sobre las respuestas DNS.

</details>

## Ejercicio 3
¿Como configurarias una IP estatica 192.168.1.50/24 con gateway 192.168.1.1 en la interfaz eth0 usando el comando `ip`?

<details><summary>Respuesta</summary>

```bash
ip addr add 192.168.1.50/24 dev eth0
ip link set eth0 up
ip route add default via 192.168.1.1
```

**Importante**: Esta configuracion es **temporal** y se perdera al reiniciar. Para hacerla persistente se debe usar la configuracion de la distribucion (archivos de configuracion, NetworkManager o systemd-networkd).

</details>

## Ejercicio 4
Escribe un archivo de configuracion de `/etc/network/interfaces` (Debian) para la interfaz eth0 con IP estatica 10.0.0.5/24, gateway 10.0.0.1 y DNS 8.8.8.8.

<details><summary>Respuesta</summary>

```
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static
    address 10.0.0.5
    netmask 255.255.255.0
    gateway 10.0.0.1
    dns-nameservers 8.8.8.8
```

Aplicar cambios:
```bash
ifdown eth0 && ifup eth0
# o bien:
systemctl restart networking
```

</details>

## Ejercicio 5
¿Como crearias una conexion de red con NetworkManager usando `nmcli` con IP estatica 192.168.1.100/24 y DNS 1.1.1.1?

<details><summary>Respuesta</summary>

```bash
nmcli connection add type ethernet con-name mi-red ifname eth0 \
    ip4 192.168.1.100/24 gw4 192.168.1.1

nmcli connection modify mi-red ipv4.dns "1.1.1.1"

nmcli connection up mi-red
```

Para verificar:
```bash
nmcli connection show mi-red
```

</details>

## Ejercicio 6
¿Que contiene `/etc/resolv.conf`? ¿Cuantos servidores DNS se pueden definir como maximo?

<details><summary>Respuesta</summary>

`/etc/resolv.conf` define la configuracion DNS del cliente:

```
nameserver 192.168.1.1      # Servidor DNS primario
nameserver 8.8.8.8          # Servidor DNS secundario
nameserver 8.8.4.4          # Servidor DNS terciario
domain ejemplo.com          # Dominio local
search ejemplo.com test.com # Dominios de busqueda
```

Se pueden definir un **maximo de 3** servidores `nameserver`. Las directivas `domain` y `search` son mutuamente excluyentes (se usa la ultima).

</details>

## Ejercicio 7
¿Como escribirias un archivo de configuracion basico de systemd-networkd para que eth0 obtenga su IP por DHCP?

<details><summary>Respuesta</summary>

Archivo `/etc/systemd/network/20-wired.network`:
```ini
[Match]
Name=eth0

[Network]
DHCP=yes
```

Activar el servicio:
```bash
systemctl enable systemd-networkd
systemctl start systemd-networkd
```

Verificar:
```bash
networkctl status eth0
```

</details>

## Ejercicio 8
¿Cual es el equivalente moderno de `route -n`? ¿Como agregarias una ruta estatica a la red 172.16.0.0/12 via el gateway 192.168.1.1?

<details><summary>Respuesta</summary>

El equivalente moderno de `route -n` es:
```bash
ip route show
# o abreviado:
ip r
```

Para agregar la ruta estatica:
```bash
ip route add 172.16.0.0/12 via 192.168.1.1
```

Con legacy `route`:
```bash
route add -net 172.16.0.0 netmask 255.240.0.0 gw 192.168.1.1
```

Para hacerla persistente en RHEL, crear `/etc/sysconfig/network-scripts/route-eth0`:
```
172.16.0.0/12 via 192.168.1.1
```

</details>
