---
title: "207.2 - Zonas DNS"
tags: [lpic-2, examen-202, tema-207, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.2"
---

# 207.2 - Ejercicios: Zonas DNS

### Pregunta 1

En un registro SOA, ¿que formato se recomienda para el numero de serie (serial)?

a) Un numero secuencial simple (1, 2, 3...)
b) El formato YYYYMMDDNN (ano, mes, dia, revision)
c) Un timestamp Unix
d) La version del software BIND

<details><summary>Respuesta</summary>

**b) El formato YYYYMMDDNN (ano, mes, dia, revision)**

El formato recomendado para el serial del SOA es `YYYYMMDDNN`, donde YYYY es el ano, MM el mes, DD el dia y NN un numero de revision diario (01, 02, etc.). Por ejemplo, `2024011502` indica la segunda revision del 15 de enero de 2024. Este formato facilita el seguimiento de cambios y garantiza que el numero siempre sea creciente.

</details>

### Pregunta 2

¿Que ocurre si un nombre en un archivo de zona NO termina en punto (`.`)?

a) Se produce un error de sintaxis
b) El nombre se trata como un FQDN completo
c) Se le anade automaticamente el valor de `$ORIGIN` al final
d) Se ignora el registro

<details><summary>Respuesta</summary>

**c) Se le anade automaticamente el valor de `$ORIGIN` al final**

En los archivos de zona BIND, los nombres que no terminan en punto se consideran relativos y se les anade el valor de `$ORIGIN`. Por ejemplo, si `$ORIGIN` es `ejemplo.com.`, el nombre `www` se interpreta como `www.ejemplo.com.`. Los nombres que terminan en punto se consideran FQDN y se usan tal cual.

</details>

### Pregunta 3

¿Cual es la zona inversa correcta para la red `10.20.30.0/24`?

a) `10.20.30.in-addr.arpa`
b) `30.20.10.in-addr.arpa`
c) `0.30.20.10.in-addr.arpa`
d) `10.20.30.rev-addr.arpa`

<details><summary>Respuesta</summary>

**b) `30.20.10.in-addr.arpa`**

Las zonas inversas IPv4 se construyen invirtiendo los octetos de la red y anadiendo `.in-addr.arpa`. Para la red `10.20.30.0/24`, se invierten los tres primeros octetos (correspondientes a la parte de red), resultando en `30.20.10.in-addr.arpa`.

</details>

### Pregunta 4

¿Que restriccion importante tiene el registro CNAME?

a) Solo puede apuntar a direcciones IP
b) No puede coexistir con otros registros del mismo nombre
c) Solo puede usarse para subdominios
d) Requiere un registro A adicional

<details><summary>Respuesta</summary>

**b) No puede coexistir con otros registros del mismo nombre**

Un registro CNAME no puede compartir un nombre con ningun otro tipo de registro. Ademas, la raiz de la zona (`@`) nunca puede tener un CNAME, ya que necesita registros NS y SOA. Los registros MX y NS tampoco deben apuntar a nombres que tengan registros CNAME.

</details>

### Pregunta 5

En un registro MX, ¿que significa un valor de prioridad mas bajo?

a) Menor prioridad (se intenta ultimo)
b) Mayor prioridad (se intenta primero)
c) El servidor esta deshabilitado
d) El servidor solo acepta correo local

<details><summary>Respuesta</summary>

**b) Mayor prioridad (se intenta primero)**

En los registros MX, un valor numerico menor indica mayor prioridad. El correo se intenta entregar primero al servidor con el numero mas bajo. Por ejemplo, con `MX 10 mail1` y `MX 20 mail2`, el correo se enviara primero a `mail1`. Si `mail1` no responde, se intentara con `mail2`.

</details>

### Pregunta 6

En el registro SOA, ¿que representa el campo "Expire"?

a) El tiempo que tarda en propagarse un cambio
b) El tiempo maximo que un servidor esclavo puede servir datos sin contactar al maestro
c) El tiempo de vida de la cache DNS
d) El tiempo tras el cual se elimina la zona automaticamente

<details><summary>Respuesta</summary>

**b) El tiempo maximo que un servidor esclavo puede servir datos sin contactar al maestro**

El campo Expire del SOA define el periodo maximo durante el cual un servidor esclavo seguira respondiendo consultas con sus datos locales si no puede contactar al servidor maestro. Una vez transcurrido este tiempo sin contacto, el esclavo deja de responder consultas para esa zona. Un valor tipico es 604800 segundos (1 semana).

</details>

### Pregunta 7

¿Que tipo de transferencia de zona envia solo los cambios realizados desde un serial determinado?

a) AXFR
b) IXFR
c) NOTIFY
d) DXFR

<details><summary>Respuesta</summary>

**b) IXFR**

IXFR (Incremental Zone Transfer) transfiere unicamente los cambios realizados en la zona desde un numero de serie determinado, en lugar de enviar toda la zona. Esto es mas eficiente que AXFR (Full Zone Transfer) para zonas grandes con pocos cambios. Si el servidor no puede proporcionar una IXFR, se recurre automaticamente a AXFR.

</details>

### Pregunta 8

¿Que campo del registro SOA se debe utilizar para indicar la direccion de correo del administrador de la zona `admin@ejemplo.com`?

a) `admin@ejemplo.com.`
b) `admin.ejemplo.com.`
c) `admin\@ejemplo.com.`
d) `mailto:admin@ejemplo.com.`

<details><summary>Respuesta</summary>

**b) `admin.ejemplo.com.`**

En el registro SOA, el campo RNAME (email del administrador) reemplaza el simbolo `@` por un punto (`.`). Asi, `admin@ejemplo.com` se escribe como `admin.ejemplo.com.` en el archivo de zona. Si el nombre de usuario contiene puntos, estos deben escaparse con barra invertida (por ejemplo, `nombre\.apellido.ejemplo.com.`).

</details>

### Pregunta 9

¿Que son los "glue records" en una delegacion de subdominio?

a) Registros CNAME que unen subdominios
b) Registros A para los servidores NS que estan dentro del subdominio delegado
c) Registros MX que conectan el correo del subdominio
d) Registros TXT que validan la delegacion

<details><summary>Respuesta</summary>

**b) Registros A para los servidores NS que estan dentro del subdominio delegado**

Los glue records son registros A necesarios cuando un servidor NS de un subdominio delegado tiene un nombre que pertenece a ese mismo subdominio. Sin ellos, se produciria una dependencia circular: para resolver el NS se necesitaria consultar al NS mismo. Ejemplo: si `sub.ejemplo.com` tiene `ns1.sub.ejemplo.com` como NS, se necesita un glue record con la IP de `ns1.sub.ejemplo.com` en la zona padre.

</details>

### Pregunta 10

¿Cual es el formato correcto de un registro SRV para un servicio LDAP en TCP con prioridad 10, peso 0, puerto 389?

a) `_ldap._tcp IN SRV 389 10 0 ldap.ejemplo.com.`
b) `_ldap._tcp IN SRV 10 0 389 ldap.ejemplo.com.`
c) `ldap.tcp IN SRV 10 0 389 ldap.ejemplo.com.`
d) `SRV _ldap._tcp 10 0 389 ldap.ejemplo.com.`

<details><summary>Respuesta</summary>

**b) `_ldap._tcp IN SRV 10 0 389 ldap.ejemplo.com.`**

El formato del registro SRV es: `_servicio._protocolo IN SRV prioridad peso puerto destino`. El nombre del servicio y el protocolo van precedidos por guion bajo (`_`). Los campos numericos van en orden: prioridad (10), peso (0), puerto (389), y finalmente el nombre del servidor destino.

</details>
