---
title: "210.1 - Configuración DHCP"
tags: [lpic-2, examen-202, tema-210, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.1"
---

# 210.1 - Ejercicios: Configuración DHCP

## Pregunta 1

¿En qué archivo se almacenan las concesiones activas del servidor ISC DHCP en IPv4?

a) /etc/dhcp/dhcpd.conf
b) /var/lib/dhcp/dhcpd.leases
c) /var/log/dhcp/leases.db
d) /run/dhcp/dhcpd.leases

<details><summary>Respuesta</summary>

**b) /var/lib/dhcp/dhcpd.leases**

El archivo `/var/lib/dhcp/dhcpd.leases` es la base de datos donde el servidor ISC DHCP registra todas las concesiones activas, expiradas y liberadas.
</details>

## Pregunta 2

¿Qué directiva en dhcpd.conf se utiliza para asignar siempre la misma IP a un cliente específico?

a) static-address
b) reserved-ip
c) fixed-address
d) permanent-address

<details><summary>Respuesta</summary>

**c) fixed-address**

La directiva `fixed-address` dentro de una declaración `host` permite asignar una IP fija a un cliente identificado por su dirección MAC mediante `hardware ethernet`.
</details>

## Pregunta 3

¿Cuáles son los puertos UDP que utiliza DHCPv4?

a) 53 (servidor) y 54 (cliente)
b) 67 (servidor) y 68 (cliente)
c) 546 (servidor) y 547 (cliente)
d) 69 (servidor) y 70 (cliente)

<details><summary>Respuesta</summary>

**b) 67 (servidor) y 68 (cliente)**

DHCPv4 utiliza el puerto UDP 67 para el servidor y el puerto UDP 68 para el cliente. Los puertos 546/547 corresponden a DHCPv6.
</details>

## Pregunta 4

¿Qué comando se utiliza para verificar la sintaxis del archivo de configuración de dhcpd sin iniciar el servicio?

a) dhcpd --check
b) dhcpd -t
c) dhcpd -verify
d) dhcpd -c

<details><summary>Respuesta</summary>

**b) dhcpd -t**

El comando `dhcpd -t` analiza el archivo de configuración y reporta errores de sintaxis sin iniciar el demonio. Se puede especificar el archivo con `-cf`: `dhcpd -t -cf /etc/dhcp/dhcpd.conf`.
</details>

## Pregunta 5

¿Qué utilidad se usa para retransmitir peticiones DHCP entre subredes cuando el servidor DHCP está en una red diferente?

a) dhcpforward
b) dhcproxy
c) dhcrelay
d) dhcpbridge

<details><summary>Respuesta</summary>

**c) dhcrelay**

`dhcrelay` es el agente relay de DHCP que retransmite mensajes DHCP entre clientes y servidores que se encuentran en subredes diferentes. Se usa con la sintaxis: `dhcrelay -i eth0 <IP_servidor_DHCP>`.
</details>

## Pregunta 6

En el siguiente fragmento de configuración, ¿cuántas direcciones IP puede asignar el servidor DHCP?

```
subnet 10.0.0.0 netmask 255.255.255.0 {
    range 10.0.0.50 10.0.0.60;
    option routers 10.0.0.1;
}
```

a) 10
b) 11
c) 60
d) 254

<details><summary>Respuesta</summary>

**b) 11**

El rango `range 10.0.0.50 10.0.0.60` incluye ambos extremos, por lo que son 11 direcciones disponibles: de 10.0.0.50 a 10.0.0.60 inclusive.
</details>

## Pregunta 7

¿Cuáles son los cuatro pasos del proceso de obtención de una dirección DHCP?

a) Request, Reply, Confirm, Accept
b) Discover, Offer, Request, Acknowledge
c) Query, Response, Accept, Confirm
d) Solicit, Advertise, Request, Reply

<details><summary>Respuesta</summary>

**b) Discover, Offer, Request, Acknowledge**

El proceso DORA de DHCP consiste en: **D**iscover (cliente busca servidores), **O**ffer (servidor ofrece IP), **R**equest (cliente acepta la oferta), **A**cknowledge (servidor confirma). La opción d) corresponde al proceso de DHCPv6.
</details>

## Pregunta 8

¿Qué directiva establece el tiempo máximo que un cliente puede mantener una concesión DHCP?

a) lease-time
b) default-lease-time
c) max-lease-time
d) timeout-lease

<details><summary>Respuesta</summary>

**c) max-lease-time**

`max-lease-time` establece el tiempo máximo (en segundos) que un cliente puede mantener una concesión, incluso si solicita un tiempo mayor. `default-lease-time` es el tiempo asignado cuando el cliente no solicita uno específico.
</details>

## Pregunta 9

¿Qué puertos utiliza DHCPv6?

a) 67 (cliente) y 68 (servidor)
b) 547 (cliente) y 546 (servidor)
c) 546 (cliente) y 547 (servidor)
d) 68 (cliente) y 67 (servidor)

<details><summary>Respuesta</summary>

**c) 546 (cliente) y 547 (servidor)**

DHCPv6 utiliza puertos diferentes a DHCPv4: el puerto UDP 546 para el cliente y el puerto UDP 547 para el servidor.
</details>

## Pregunta 10

¿Qué directiva en dhcpd.conf se usa para definir la puerta de enlace que se entregará a los clientes?

a) option gateway
b) option default-gateway
c) option routers
d) option next-hop

<details><summary>Respuesta</summary>

**c) option routers**

La directiva `option routers` especifica la puerta de enlace predeterminada que el servidor DHCP comunicará a los clientes. Puede incluir múltiples direcciones separadas por comas.
</details>
