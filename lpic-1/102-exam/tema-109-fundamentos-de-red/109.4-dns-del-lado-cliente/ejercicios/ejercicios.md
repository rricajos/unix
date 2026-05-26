# 109.4 Configurar DNS en el lado cliente - Ejercicios

## Ejercicio 1
¿Cual es la diferencia entre `dig ejemplo.com` y `getent hosts ejemplo.com`?

<details><summary>Respuesta</summary>

- **`dig ejemplo.com`**: Consulta **directamente** al servidor DNS configurado en `/etc/resolv.conf`. No tiene en cuenta `/etc/hosts` ni el orden definido en `/etc/nsswitch.conf`.

- **`getent hosts ejemplo.com`**: Usa el mecanismo completo de **NSS** (Name Service Switch), siguiendo el orden definido en `/etc/nsswitch.conf`. Si `hosts: files dns` esta configurado, primero buscara en `/etc/hosts` y solo si no encuentra el nombre alli consultara DNS.

En resumen: `dig` es una herramienta de diagnostico DNS, mientras que `getent` simula exactamente lo que haria una aplicacion al resolver un nombre.

</details>

## Ejercicio 2
¿Como consultarias los registros MX (servidores de correo) de `ejemplo.com` usando `dig`, `host` y `nslookup`?

<details><summary>Respuesta</summary>

```bash
# Con dig
dig ejemplo.com MX

# Con dig (solo respuesta)
dig ejemplo.com MX +short

# Con host
host -t MX ejemplo.com

# Con nslookup
nslookup -type=MX ejemplo.com
```

Los tres mostraran los servidores de correo y sus prioridades (cuanto menor el numero, mayor la prioridad).

</details>

## Ejercicio 3
Explica que hace la directiva `search` en `/etc/resolv.conf` con el siguiente ejemplo: `search empresa.com red.local`

<details><summary>Respuesta</summary>

La directiva `search` define una lista de dominios que se agregan automaticamente a nombres cortos (sin punto final).

Con `search empresa.com red.local`, si ejecutas `ping servidor`:

1. Primero intenta resolver `servidor.empresa.com`
2. Si falla, intenta `servidor.red.local`
3. Si falla, intenta `servidor` (sin dominio)

Esto es util para no tener que escribir el FQDN completo cada vez. La directiva `search` es mutuamente excluyente con `domain`; si ambas estan presentes, se usa la ultima definida.

</details>

## Ejercicio 4
¿Como harias una resolucion DNS inversa (de IP a nombre) usando `dig` y `host`?

<details><summary>Respuesta</summary>

```bash
# Con dig
dig -x 8.8.8.8

# Con dig (solo respuesta)
dig -x 8.8.8.8 +short

# Con host
host 8.8.8.8

# Con nslookup
nslookup 8.8.8.8
```

La resolucion inversa busca registros **PTR** en la zona inversa correspondiente. Para la IP `8.8.8.8`, dig internamente consulta `8.8.8.8.in-addr.arpa` buscando un registro PTR.

</details>

## Ejercicio 5
¿Que archivo controla el orden de resolucion de nombres? Si quisieras que DNS se consulte antes que `/etc/hosts`, ¿como lo configurarias?

<details><summary>Respuesta</summary>

El archivo es **`/etc/nsswitch.conf`**, en la linea `hosts`.

Configuracion por defecto (hosts primero):
```
hosts: files dns myhostname
```

Para que DNS se consulte primero:
```
hosts: dns files myhostname
```

Con esta configuracion, se consulta el servidor DNS antes de buscar en `/etc/hosts`. Esto es poco comun pero puede ser util en algunos entornos.

</details>

## Ejercicio 6
¿Que es systemd-resolved y en que direccion IP escucha su stub resolver?

<details><summary>Respuesta</summary>

**systemd-resolved** es un servicio de resolucion DNS integrado en systemd que:
- Actua como **cache DNS local**
- Proporciona un **stub resolver** que escucha en **127.0.0.53**
- Puede gestionar automaticamente `/etc/resolv.conf`
- Soporta DNS sobre TLS y DNSSEC

Cuando esta activo, `/etc/resolv.conf` contiene:
```
nameserver 127.0.0.53
```

Se gestiona con el comando `resolvectl`:
```bash
resolvectl status          # Ver estado
resolvectl flush-caches    # Limpiar cache
```

</details>

## Ejercicio 7
Indica los 6 tipos de registros DNS mas importantes y da un ejemplo de uso para cada uno.

<details><summary>Respuesta</summary>

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| **A** | Traducir nombre a IPv4 | `dig ejemplo.com A` -> 93.184.216.34 |
| **AAAA** | Traducir nombre a IPv6 | `dig ejemplo.com AAAA` -> 2606:2800:... |
| **MX** | Encontrar servidor de correo | `dig ejemplo.com MX` -> mail.ejemplo.com |
| **NS** | Encontrar servidores DNS autoritativos | `dig ejemplo.com NS` -> ns1.ejemplo.com |
| **CNAME** | Alias de un nombre a otro | `dig www.ejemplo.com CNAME` -> ejemplo.com |
| **PTR** | Resolucion inversa (IP a nombre) | `dig -x 8.8.8.8` -> dns.google |

</details>

## Ejercicio 8
¿Como consultarias un registro DNS usando un servidor DNS especifico (por ejemplo, 1.1.1.1) con `dig` y `host`?

<details><summary>Respuesta</summary>

```bash
# Con dig (usando @servidor)
dig @1.1.1.1 ejemplo.com

# Con dig (respuesta corta)
dig @1.1.1.1 ejemplo.com +short

# Con dig (tipo especifico)
dig @1.1.1.1 ejemplo.com MX

# Con host (servidor como ultimo argumento)
host ejemplo.com 1.1.1.1

# Con host (tipo especifico)
host -t MX ejemplo.com 1.1.1.1

# Con nslookup
nslookup ejemplo.com 1.1.1.1
```

Esto es util para:
- Diagnosticar problemas con el DNS local
- Comparar respuestas entre diferentes servidores DNS
- Verificar propagacion de cambios DNS

</details>
