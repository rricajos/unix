---
title: "212.1 - Configuración de router: Ejercicios"
tags: [lpic-2, examen-202, tema-212, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.1"
---

# 212.1 - Configuración de router: Ejercicios

### Pregunta 1

¿Qué archivo se debe modificar para habilitar el reenvío de paquetes IPv4 de forma permanente en Linux?

a) /etc/network/interfaces
b) /etc/sysctl.conf
c) /etc/iptables.conf
d) /etc/forwarding.conf

<details>
<summary>Respuesta</summary>

**b) /etc/sysctl.conf**

Se debe establecer `net.ipv4.ip_forward = 1` en `/etc/sysctl.conf` (o en un archivo dentro de `/etc/sysctl.d/`) para que el reenvío de paquetes persista tras un reinicio. Después se aplica con `sysctl -p`.
</details>

---

### Pregunta 2

¿Qué tabla de iptables se utiliza por defecto cuando no se especifica la opción `-t`?

a) nat
b) mangle
c) raw
d) filter

<details>
<summary>Respuesta</summary>

**d) filter**

La tabla `filter` es la tabla por defecto de iptables. Contiene las cadenas INPUT, OUTPUT y FORWARD, y se usa para el filtrado básico de paquetes.
</details>

---

### Pregunta 3

Un administrador necesita redirigir el tráfico entrante en el puerto 443 hacia un servidor interno 10.0.0.5 en el puerto 8443. ¿Qué regla de iptables es correcta?

a) `iptables -A FORWARD -p tcp --dport 443 -j DNAT --to-destination 10.0.0.5:8443`
b) `iptables -t nat -A POSTROUTING -p tcp --dport 443 -j DNAT --to-destination 10.0.0.5:8443`
c) `iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 10.0.0.5:8443`
d) `iptables -t nat -A INPUT -p tcp --dport 443 -j DNAT --to-destination 10.0.0.5:8443`

<details>
<summary>Respuesta</summary>

**c) `iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 10.0.0.5:8443`**

DNAT (Destination NAT) se configura en la cadena PREROUTING de la tabla nat, ya que la traducción de la dirección de destino debe ocurrir antes de la decisión de enrutamiento.
</details>

---

### Pregunta 4

¿Cuál es la diferencia principal entre los objetivos MASQUERADE y SNAT en iptables?

a) MASQUERADE es más seguro que SNAT
b) SNAT se usa solo para IPv6
c) MASQUERADE determina la IP de origen dinámicamente, SNAT usa una IP fija
d) MASQUERADE funciona en la cadena PREROUTING y SNAT en POSTROUTING

<details>
<summary>Respuesta</summary>

**c) MASQUERADE determina la IP de origen dinámicamente, SNAT usa una IP fija**

MASQUERADE consulta la IP actual de la interfaz de salida para cada paquete, lo que lo hace adecuado para conexiones con IP dinámica. SNAT es más eficiente cuando la IP de salida es estática porque no necesita esta consulta.
</details>

---

### Pregunta 5

¿Qué comando de nftables lista todas las reglas activas del sistema?

a) `nft show all`
b) `nft list ruleset`
c) `nft -L`
d) `nft rules --list`

<details>
<summary>Respuesta</summary>

**b) `nft list ruleset`**

El comando `nft list ruleset` muestra todas las tablas, cadenas y reglas configuradas actualmente en nftables.
</details>

---

### Pregunta 6

En firewalld, ¿qué ocurre si se ejecuta `firewall-cmd --add-service=http` sin la opción `--permanent`?

a) El cambio no se aplica hasta hacer reload
b) El comando falla con un error
c) El cambio se aplica inmediatamente pero se pierde al reiniciar
d) El cambio se aplica y persiste automáticamente

<details>
<summary>Respuesta</summary>

**c) El cambio se aplica inmediatamente pero se pierde al reiniciar**

Sin `--permanent`, los cambios se aplican en la configuración en ejecución (runtime) de forma inmediata, pero no se guardan en la configuración persistente. Al reiniciar firewalld o el sistema, estos cambios se pierden.
</details>

---

### Pregunta 7

¿Qué cadena de iptables se usa para filtrar paquetes que atraviesan el router Linux hacia otra red?

a) INPUT
b) OUTPUT
c) FORWARD
d) PREROUTING

<details>
<summary>Respuesta</summary>

**c) FORWARD**

La cadena FORWARD de la tabla filter se encarga de los paquetes que no son para el propio host ni generados por él, sino que están siendo reenviados entre interfaces de red.
</details>

---

### Pregunta 8

¿Qué comando guarda las reglas actuales de iptables para restaurarlas en el futuro?

a) `iptables --save > /etc/iptables.rules`
b) `iptables-save > /etc/iptables/rules.v4`
c) `iptables -S > /etc/iptables.rules`
d) `iptables --export /etc/iptables/rules.v4`

<details>
<summary>Respuesta</summary>

**b) `iptables-save > /etc/iptables/rules.v4`**

El comando `iptables-save` volcará todas las reglas actuales en formato que puede ser leído por `iptables-restore`. La opción `-S` de iptables lista las reglas en formato de comandos, pero no es el método estándar de persistencia.
</details>

---

### Pregunta 9

¿Qué ventaja ofrece la familia `inet` en nftables?

a) Mayor velocidad de procesamiento
b) Compatibilidad con iptables legacy
c) Permite crear reglas que aplican tanto a IPv4 como a IPv6 simultáneamente
d) Soporte para filtrado a nivel de aplicación (capa 7)

<details>
<summary>Respuesta</summary>

**c) Permite crear reglas que aplican tanto a IPv4 como a IPv6 simultáneamente**

La familia `inet` en nftables unifica el manejo de IPv4 e IPv6 en una sola tabla, evitando la necesidad de mantener reglas duplicadas como ocurre con iptables (iptables + ip6tables).
</details>

---

### Pregunta 10

Un administrador ejecuta `iptables -I INPUT 1 -s 10.0.0.50 -j ACCEPT`. ¿Qué efecto tiene este comando?

a) Añade la regla al final de la cadena INPUT
b) Inserta la regla en la primera posición de la cadena INPUT
c) Reemplaza la primera regla de la cadena INPUT
d) Crea una nueva cadena llamada INPUT con esta regla

<details>
<summary>Respuesta</summary>

**b) Inserta la regla en la primera posición de la cadena INPUT**

La opción `-I` (insert) con el número 1 coloca la regla en la primera posición de la cadena, con lo cual será evaluada antes que cualquier otra regla existente. Esto es diferente de `-A` (append), que añade al final.
</details>
