---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.2"
titulo: "Resolución de Nombres AD - Ejercicios"
peso: 2
tags:
  - lpic-3
  - tema-302
  - ejercicios
---

# Ejercicios - 302.2 Resolución de Nombres en Active Directory

### Pregunta 1
¿Qué tipo de registro DNS utilizan los clientes de Active Directory para localizar los controladores de dominio?

a) Registros A
b) Registros MX
c) Registros SRV
d) Registros CNAME

<details><summary>Respuesta</summary>

**c) Registros SRV**

Los registros SRV (Service) son el mecanismo fundamental por el cual los clientes de AD localizan servicios como LDAP (`_ldap._tcp.dominio.com`) y Kerberos (`_kerberos._tcp.dominio.com`). Estos registros incluyen el puerto, prioridad, peso y el nombre del host que proporciona el servicio.
</details>

### Pregunta 2
¿Qué registro SRV deben consultar los clientes para localizar el servicio LDAP del dominio?

a) `_ldap._udp.dominio.com`
b) `_ldap._tcp.dominio.com`
c) `_dc._tcp.dominio.com`
d) `_ad._tcp.dominio.com`

<details><summary>Respuesta</summary>

**b) `_ldap._tcp.dominio.com`**

El registro `_ldap._tcp.dominio.com` de tipo SRV indica a los clientes dónde encontrar los servicios LDAP del dominio (puerto 389). Para localizar específicamente los DCs, se consulta `_ldap._tcp.dc._msdcs.dominio.com`. El servicio Kerberos se localiza con `_kerberos._tcp.dominio.com`.
</details>

### Pregunta 3
¿Qué comando añade un registro A para el host "servidor" con IP 192.168.1.50 en el DNS de Samba?

a) `samba-tool dns create localhost empresa.com servidor A 192.168.1.50`
b) `samba-tool dns add localhost empresa.com servidor A 192.168.1.50 -U administrator`
c) `nsupdate add servidor.empresa.com A 192.168.1.50`
d) `samba-tool dns insert servidor A 192.168.1.50`

<details><summary>Respuesta</summary>

**b) `samba-tool dns add localhost empresa.com servidor A 192.168.1.50 -U administrator`**

La sintaxis de `samba-tool dns add` requiere: el servidor DNS (localhost), la zona (empresa.com), el nombre del registro (servidor), el tipo (A) y el dato (IP). Se necesita autenticación con `-U administrator` o un ticket Kerberos válido.
</details>

### Pregunta 4
¿Qué archivo debe configurarse para que BIND9 cargue las zonas AD de Samba mediante DLZ?

a) `/etc/samba/smb.conf`
b) `/etc/bind/named.conf.local`
c) `/etc/bind/db.empresa.com`
d) `/var/lib/samba/dns.conf`

<details><summary>Respuesta</summary>

**b) `/etc/bind/named.conf.local`**

Para integrar BIND9 con Samba AD vía DLZ, se debe agregar la directiva `dlz "AD DNS Zone" { database "dlopen /path/to/dlz_bind9_12.so"; };` en el archivo de configuración de BIND, típicamente `/etc/bind/named.conf.local`. También se debe configurar el keytab en `named.conf.options`.
</details>

### Pregunta 5
¿Qué herramienta permite realizar actualizaciones dinámicas de DNS usando autenticación Kerberos?

a) `samba-tool dns update`
b) `nsupdate -g`
c) `dig +update`
d) `host -u`

<details><summary>Respuesta</summary>

**b) `nsupdate -g`**

`nsupdate -g` utiliza autenticación GSS-TSIG (Kerberos) para realizar actualizaciones dinámicas de DNS. Requiere un ticket Kerberos válido (obtenido con `kinit`). `samba-tool dns add/update/delete` también puede modificar registros pero con su propia autenticación.
</details>

### Pregunta 6
¿Qué comando crea una zona inversa para la red 192.168.1.0/24 en el DNS de Samba?

a) `samba-tool dns zonecreate localhost 192.168.1.0 -U administrator`
b) `samba-tool dns add localhost reverse 192.168.1 -U administrator`
c) `samba-tool dns zonecreate localhost 1.168.192.in-addr.arpa -U administrator`
d) `samba-tool dns createreverse localhost 192.168.1.0/24 -U administrator`

<details><summary>Respuesta</summary>

**c) `samba-tool dns zonecreate localhost 1.168.192.in-addr.arpa -U administrator`**

Las zonas inversas en DNS siguen la convención de invertir los octetos de la dirección IP seguido de `.in-addr.arpa`. Para la red 192.168.1.0/24, el nombre de la zona es `1.168.192.in-addr.arpa`. Se crea con `samba-tool dns zonecreate`.
</details>

### Pregunta 7
¿Cuál es la función del parámetro `dns forwarder` en smb.conf?

a) Definir el servidor DNS primario del dominio
b) Reenviar consultas DNS que no pueden resolverse localmente a otro servidor
c) Configurar la replicación DNS entre DCs
d) Especificar el servidor DNS para BIND9

<details><summary>Respuesta</summary>

**b) Reenviar consultas DNS que no pueden resolverse localmente a otro servidor**

`dns forwarder` define un servidor DNS externo al que Samba reenviará las consultas que no puede resolver con sus zonas locales (por ejemplo, nombres de Internet). Es equivalente a la directiva `forwarders` de BIND9. Ejemplo: `dns forwarder = 8.8.8.8`.
</details>

### Pregunta 8
¿Qué script de Samba actualiza automáticamente los registros SRV y otros registros necesarios para AD?

a) `samba-tool dns refresh`
b) `samba_dnsupdate`
c) `samba-tool drs update`
d) `samba_upgradedns`

<details><summary>Respuesta</summary>

**b) `samba_dnsupdate`**

`samba_dnsupdate` es un script que verifica y actualiza los registros DNS necesarios para el correcto funcionamiento de Active Directory (registros SRV para LDAP, Kerberos, GC, etc.). Se puede ejecutar manualmente con `--verbose` para ver qué registros se actualizan. Samba lo ejecuta automáticamente de forma periódica.
</details>

### Pregunta 9
¿Cuál es la ventaja principal de usar BIND9_DLZ frente al DNS interno de Samba?

a) Es más fácil de configurar
b) No requiere autenticación
c) Ofrece funcionalidades avanzadas como vistas, ACLs y zonas adicionales
d) Es más rápido en todos los casos

<details><summary>Respuesta</summary>

**c) Ofrece funcionalidades avanzadas como vistas, ACLs y zonas adicionales**

BIND9 con DLZ proporciona todas las funcionalidades avanzadas de BIND: vistas (split-horizon DNS), ACLs de consulta, TSIG, zonas maestras/esclavas adicionales no relacionadas con AD, logging detallado y mayor madurez del código. El DNS interno de Samba es más simple de configurar pero tiene menos funcionalidades.
</details>

### Pregunta 10
Un cliente no puede unirse al dominio AD y los logs muestran errores de resolución DNS. ¿Qué se debe verificar primero?

a) Que el cliente tenga una IP estática
b) Que el cliente apunte al DC como servidor DNS y que los registros SRV existan
c) Que el firewall del cliente esté deshabilitado
d) Que el cliente tenga instalado BIND9

<details><summary>Respuesta</summary>

**b) Que el cliente apunte al DC como servidor DNS y que los registros SRV existan**

Para unirse a un dominio AD, el cliente debe poder resolver los registros SRV del dominio. Esto requiere que el cliente use el DC (o un servidor DNS que conozca las zonas AD) como su servidor DNS (`/etc/resolv.conf` debe apuntar al DC). Se debe verificar con `dig _ldap._tcp.dominio.com SRV` que los registros existen.
</details>
