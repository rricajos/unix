---
title: "109.4 Configurar DNS en el lado cliente - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-109
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "109"
subtema: "109.4"
---

# 109.4 Configurar DNS en el lado cliente - Ejercicios

### Pregunta 1

Cual es la diferencia principal entre `dig ejemplo.com` y `getent hosts ejemplo.com`?

a) `dig` es mas rapido que `getent`
b) `dig` consulta directamente el servidor DNS, mientras que `getent` sigue el orden definido en `/etc/nsswitch.conf`
c) `getent` solo consulta DNS y `dig` consulta `/etc/hosts` primero
d) No hay diferencia, ambos usan el mismo mecanismo de resolucion

<details><summary>Respuesta</summary>

**b) `dig` consulta directamente el servidor DNS, mientras que `getent` sigue el orden definido en `/etc/nsswitch.conf`**

`dig` es una herramienta de diagnostico DNS que consulta directamente al servidor DNS configurado en `/etc/resolv.conf`, sin tener en cuenta `/etc/hosts` ni el orden de `/etc/nsswitch.conf`. `getent hosts` usa el mecanismo completo de NSS (Name Service Switch), siguiendo el orden definido en `/etc/nsswitch.conf`. Si `hosts: files dns` esta configurado, `getent` primero buscara en `/etc/hosts` y solo si no encuentra el nombre consultara DNS.

</details>

---

### Pregunta 2

Que comando realiza una resolucion DNS inversa (de IP a nombre) con `dig`?

a) `dig PTR 8.8.8.8`
b) `dig -x 8.8.8.8`
c) `dig --reverse 8.8.8.8`
d) `dig 8.8.8.8 -type=PTR`

<details><summary>Respuesta</summary>

**b) `dig -x 8.8.8.8`**

La opcion `-x` de `dig` realiza una consulta DNS inversa, buscando el registro PTR asociado a la direccion IP. Internamente, `dig -x 8.8.8.8` consulta `8.8.8.8.in-addr.arpa` buscando un registro PTR. Con `host` se puede hacer simplemente `host 8.8.8.8`. Con `nslookup` seria `nslookup 8.8.8.8`. Para obtener solo la respuesta: `dig -x 8.8.8.8 +short`.

</details>

---

### Pregunta 3

Que hace la directiva `search empresa.com red.local` en `/etc/resolv.conf` cuando se ejecuta `ping servidor`?

a) Busca `servidor` solo en el dominio `empresa.com`
b) Intenta resolver `servidor.empresa.com`, luego `servidor.red.local` y finalmente `servidor`
c) Realiza busquedas en paralelo en ambos dominios
d) Solo resuelve si el nombre contiene un punto al final

<details><summary>Respuesta</summary>

**b) Intenta resolver `servidor.empresa.com`, luego `servidor.red.local` y finalmente `servidor`**

La directiva `search` define una lista de dominios que se agregan automaticamente a nombres cortos (sin punto final). El sistema intenta resolver el nombre agregando cada dominio en orden: primero `servidor.empresa.com`, si falla `servidor.red.local`, y finalmente `servidor` sin dominio. La directiva `search` es mutuamente excluyente con `domain`; si ambas estan presentes, se usa la ultima definida.

</details>

---

### Pregunta 4

Como se consultan los registros MX (servidores de correo) de `ejemplo.com` con `dig`?

a) `dig ejemplo.com --type=mail`
b) `dig ejemplo.com MX`
c) `dig -mx ejemplo.com`
d) `dig ejemplo.com -t mail-exchange`

<details><summary>Respuesta</summary>

**b) `dig ejemplo.com MX`**

En `dig`, el tipo de registro se especifica como argumento despues del nombre de dominio. `dig ejemplo.com MX` consulta los registros MX que indican los servidores de correo del dominio. Para obtener solo la respuesta se agrega `+short`: `dig ejemplo.com MX +short`. Con `host` seria `host -t MX ejemplo.com` y con `nslookup` seria `nslookup -type=MX ejemplo.com`.

</details>

---

### Pregunta 5

Cual es la direccion IP en la que escucha el stub resolver de systemd-resolved?

a) 127.0.0.1
b) 127.0.0.53
c) 0.0.0.0
d) 127.0.1.1

<details><summary>Respuesta</summary>

**b) 127.0.0.53**

systemd-resolved proporciona un stub resolver que escucha en la direccion `127.0.0.53`. Cuando esta activo, `/etc/resolv.conf` contiene `nameserver 127.0.0.53`, redirigiendo todas las consultas DNS al stub resolver local. systemd-resolved actua como cache DNS local, soporta DNS sobre TLS y DNSSEC. Se gestiona con `resolvectl` (antes `systemd-resolve`).

</details>

---

### Pregunta 6

Que tipo de registro DNS se utiliza para resolver un nombre de dominio a una direccion IPv6?

a) A
b) AAAA
c) MX
d) PTR

<details><summary>Respuesta</summary>

**b) AAAA**

El registro AAAA (tambien llamado "quad-A") resuelve un nombre de dominio a una direccion IPv6. El registro A resuelve a IPv4. El registro MX indica los servidores de correo del dominio. El registro PTR se usa para resolucion inversa (IP a nombre). Otros registros importantes: NS (servidores DNS autoritativos), CNAME (alias de un nombre a otro), SOA (inicio de autoridad), TXT (texto libre).

</details>

---

### Pregunta 7

Como se consulta un registro DNS usando un servidor DNS especifico (1.1.1.1) con `dig`?

a) `dig ejemplo.com --server 1.1.1.1`
b) `dig ejemplo.com -dns 1.1.1.1`
c) `dig @1.1.1.1 ejemplo.com`
d) `dig ejemplo.com -s 1.1.1.1`

<details><summary>Respuesta</summary>

**c) `dig @1.1.1.1 ejemplo.com`**

En `dig`, el servidor DNS se especifica con la notacion `@servidor` antes del nombre de dominio. Esto es util para diagnosticar problemas con el DNS local, comparar respuestas entre diferentes servidores DNS y verificar la propagacion de cambios DNS. Con `host` el servidor se especifica como ultimo argumento: `host ejemplo.com 1.1.1.1`. Con `nslookup`: `nslookup ejemplo.com 1.1.1.1`.

</details>

---

### Pregunta 8

Que archivo controla el orden en que se resuelven los nombres de host en el sistema?

a) `/etc/resolv.conf`
b) `/etc/hosts`
c) `/etc/nsswitch.conf`
d) `/etc/hostname`

<details><summary>Respuesta</summary>

**c) `/etc/nsswitch.conf`**

El archivo `/etc/nsswitch.conf` define el orden de busqueda para distintas bases de datos del sistema, incluyendo la resolucion de nombres en la linea `hosts`. La configuracion tipica `hosts: files dns myhostname` indica que primero se busca en `/etc/hosts` (files), luego se consulta DNS y finalmente se resuelve el hostname local. `/etc/resolv.conf` define los servidores DNS pero no el orden de resolucion. `/etc/hosts` contiene las entradas estaticas.

</details>

---

### Pregunta 9

Cual de los siguientes comandos limpia la cache DNS de systemd-resolved?

a) `systemctl restart systemd-resolved`
b) `resolvectl flush-caches`
c) `dns-clean --flush`
d) `nscd -K`

<details><summary>Respuesta</summary>

**b) `resolvectl flush-caches`**

El comando `resolvectl flush-caches` limpia la cache DNS de systemd-resolved. `resolvectl status` muestra el estado completo de la resolucion DNS y `resolvectl statistics` muestra estadisticas de la cache. Si bien reiniciar el servicio (opcion A) tambien limparia la cache, `resolvectl flush-caches` es el metodo correcto y no interrumpe el servicio. `nscd` es un demonio de cache diferente (Name Service Cache Daemon).

</details>

---

### Pregunta 10

Que opcion de `dig` muestra solo la respuesta sin las secciones adicionales de la salida?

a) `dig ejemplo.com --brief`
b) `dig ejemplo.com +short`
c) `dig ejemplo.com -q`
d) `dig ejemplo.com --answer-only`

<details><summary>Respuesta</summary>

**b) `dig ejemplo.com +short`**

La opcion `+short` de `dig` muestra solo la respuesta (la IP o el valor del registro) sin las secciones QUESTION, AUTHORITY, ADDITIONAL, ni las estadisticas. Otras opciones utiles de dig son: `+noall +answer` para mostrar solo la seccion ANSWER con formato completo, `+trace` para trazar la resolucion completa desde los servidores raiz, y `+nssearch` para encontrar servidores SOA.

</details>
