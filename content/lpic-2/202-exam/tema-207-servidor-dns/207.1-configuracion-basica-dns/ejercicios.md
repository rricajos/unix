---
title: "207.1 - Configuracion basica DNS"
tags: [lpic-2, examen-202, tema-207, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.1"
---

# 207.1 - Ejercicios: Configuracion basica DNS

## Pregunta 1

¿Que tipo de zona contiene la lista de servidores raiz DNS y es necesaria para que BIND pueda resolver consultas recursivas?

a) `master`
b) `slave`
c) `hint`
d) `forward`

<details><summary>Respuesta</summary>

**c) `hint`**

La zona de tipo `hint` contiene las direcciones de los servidores raiz DNS (root servers). Es necesaria para que BIND pueda iniciar el proceso de resolucion recursiva, comenzando desde la raiz del arbol DNS. El archivo asociado suele llamarse `db.root`, `named.ca` o `root.hints`.

</details>

## Pregunta 2

¿Que comando se utiliza para verificar la sintaxis del archivo `named.conf` antes de recargar BIND?

a) `bind-checkconf`
b) `named-checkconf`
c) `rndc checkconf`
d) `dns-verify`

<details><summary>Respuesta</summary>

**b) `named-checkconf`**

`named-checkconf` analiza la sintaxis del archivo `named.conf` y sus archivos incluidos, reportando errores de configuracion. Es una practica esencial ejecutarlo antes de recargar o reiniciar BIND para evitar que el servidor se detenga por errores de sintaxis.

</details>

## Pregunta 3

¿Que directiva en el bloque `options` de `named.conf` define los servidores DNS a los que se reenviaran las consultas que BIND no pueda resolver?

a) `dns-servers`
b) `upstream`
c) `forwarders`
d) `resolvers`

<details><summary>Respuesta</summary>

**c) `forwarders`**

La directiva `forwarders` dentro del bloque `options` especifica una lista de servidores DNS a los que BIND reenviara las consultas que no pueda resolver localmente. Ejemplo: `forwarders { 8.8.8.8; 8.8.4.4; };`.

</details>

## Pregunta 4

¿Cual es la diferencia entre `forward only` y `forward first`?

a) `forward only` usa el primer forwarder; `forward first` los usa todos
b) `forward only` solo consulta forwarders y falla si no responden; `forward first` intenta forwarders y luego resolucion recursiva
c) No hay diferencia funcional
d) `forward first` solo reenvia la primera consulta; `forward only` reenvia todas

<details><summary>Respuesta</summary>

**b) `forward only` solo consulta forwarders y falla si no responden; `forward first` intenta forwarders y luego resolucion recursiva**

Con `forward only`, si los forwarders no responden, la consulta falla. Con `forward first`, BIND intenta primero los forwarders, pero si no responden, intenta resolver la consulta por si mismo de forma recursiva a traves de los servidores raiz.

</details>

## Pregunta 5

¿Que comando de `rndc` vacia completamente la cache del servidor DNS?

a) `rndc clear`
b) `rndc flush`
c) `rndc purge`
d) `rndc cache-clear`

<details><summary>Respuesta</summary>

**b) `rndc flush`**

El comando `rndc flush` elimina toda la informacion almacenada en la cache del servidor BIND, forzandolo a resolver nuevamente todas las consultas desde cero. Esto es util cuando se han realizado cambios en zonas externas y se quiere que el servidor obtenga la informacion actualizada.

</details>

## Pregunta 6

¿Que opcion de `dig` permite rastrear paso a paso el proceso completo de resolucion DNS desde los servidores raiz?

a) `dig +debug`
b) `dig +trace`
c) `dig +recursive`
d) `dig +verbose`

<details><summary>Respuesta</summary>

**b) `dig +trace`**

La opcion `+trace` hace que `dig` muestre cada paso del proceso de resolucion recursiva, comenzando desde los servidores raiz, pasando por los TLD y llegando al servidor autoritativo del dominio consultado. Es muy util para diagnosticar problemas de delegacion.

</details>

## Pregunta 7

¿Que ACL predefinida de BIND representa todas las redes directamente conectadas al servidor?

a) `any`
b) `localhost`
c) `localnets`
d) `internal`

<details><summary>Respuesta</summary>

**c) `localnets`**

La ACL predefinida `localnets` incluye automaticamente todas las redes que estan directamente conectadas a las interfaces de red del servidor. `localhost` se refiere unicamente a las direcciones de las propias interfaces. `any` coincide con cualquier direccion y `none` no coincide con ninguna.

</details>

## Pregunta 8

En una configuracion de zona esclava (slave), ¿que directiva indica la direccion IP del servidor maestro?

a) `primary`
b) `master-server`
c) `masters`
d) `source`

<details><summary>Respuesta</summary>

**c) `masters`**

En una zona de tipo `slave`, la directiva `masters` especifica la lista de servidores maestros de los que se obtendran los datos de zona mediante transferencia. Ejemplo: `masters { 192.168.1.10; };`. En versiones recientes de BIND, tambien se acepta el sinonimo `primaries`.

</details>

## Pregunta 9

¿Que comando de `dig` realiza una consulta DNS inversa (de IP a nombre)?

a) `dig PTR 192.168.1.100`
b) `dig -x 192.168.1.100`
c) `dig --reverse 192.168.1.100`
d) `dig -r 192.168.1.100`

<details><summary>Respuesta</summary>

**b) `dig -x 192.168.1.100`**

La opcion `-x` de `dig` realiza una consulta inversa, traduciendo una direccion IP a su nombre de dominio asociado. Internamente, `dig` convierte la IP al formato de zona inversa apropiado (por ejemplo, `100.1.168.192.in-addr.arpa`) y consulta el registro PTR.

</details>

## Pregunta 10

¿Que directiva de `named.conf` restringe que hosts pueden realizar transferencias de zona?

a) `allow-query`
b) `allow-recursion`
c) `allow-transfer`
d) `allow-update`

<details><summary>Respuesta</summary>

**c) `allow-transfer`**

La directiva `allow-transfer` controla que servidores pueden solicitar una transferencia de zona completa (AXFR) o incremental (IXFR). Por seguridad, debe restringirse unicamente a los servidores secundarios autorizados. Ejemplo: `allow-transfer { 192.168.1.11; };`. Establecer `allow-transfer { none; };` desactiva completamente las transferencias.

</details>
