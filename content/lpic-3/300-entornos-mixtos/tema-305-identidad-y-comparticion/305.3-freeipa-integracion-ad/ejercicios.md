---
title: "305.3 - Ejercicios: FreeIPA Integración AD"
description: "Ejercicios de práctica para integración FreeIPA con Active Directory"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 305 - Identidad y Compartición"
subtema: "305.3"
peso: 2
tags:
  - lpic-3
  - tema-305
  - freeipa
  - active-directory
  - ejercicios
---

# 305.3 Ejercicios - FreeIPA Integración AD

### Pregunta 1
¿Qué comando prepara un servidor FreeIPA existente para establecer relaciones de confianza con Active Directory?

a) `ipa trust-prepare`
b) `ipa-adtrust-install`
c) `ipa-server-install --trust-ad`
d) `samba-tool trust setup`

<details><summary>Respuesta</summary>

**b) `ipa-adtrust-install`**

`ipa-adtrust-install` configura los componentes necesarios en FreeIPA para soportar relaciones de confianza con Active Directory, incluyendo Samba y el servicio de trust. Se ejecuta una sola vez después de la instalación del servidor FreeIPA.
</details>

### Pregunta 2
¿Cuál es la diferencia principal entre un forest trust y un external trust?

a) Forest trust es más rápido; external trust es más seguro
b) Forest trust cubre todo el bosque AD; external trust cubre un solo dominio
c) Forest trust es unidireccional; external trust es bidireccional
d) Forest trust requiere SSL; external trust no

<details><summary>Respuesta</summary>

**b) Forest trust cubre todo el bosque AD; external trust cubre un solo dominio**

Un forest trust establece confianza con todo el bosque de Active Directory (incluyendo todos sus dominios y subdominios) y es transitivo. Un external trust es más limitado y solo cubre un dominio específico sin transitividad.
</details>

### Pregunta 3
¿Qué comando crea una relación de confianza entre FreeIPA y Active Directory?

a) `ipa ad-connect empresa.local`
b) `ipa trust-add empresa.local --type=ad --admin=Administrador --password`
c) `samba-tool trust create empresa.local`
d) `ipa-trust-install empresa.local`

<details><summary>Respuesta</summary>

**b) `ipa trust-add empresa.local --type=ad --admin=Administrador --password`**

`ipa trust-add` crea la relación de confianza especificando el dominio AD, el tipo de trust (`--type=ad`) y las credenciales del administrador de AD para establecer el trust.
</details>

### Pregunta 4
¿Qué enfoque se recomienda para integrar FreeIPA con AD: trust o winsync?

a) Winsync es siempre preferible
b) Trust es el enfoque recomendado; winsync está obsoleto
c) Ambos son equivalentes
d) Depende del número de usuarios

<details><summary>Respuesta</summary>

**b) Trust es el enfoque recomendado; winsync está obsoleto**

Las relaciones de confianza (trust) son el enfoque recomendado porque no duplican datos, son más escalables y más fáciles de mantener. Winsync sincroniza datos de usuario entre AD e IPA, lo que genera duplicación y problemas de mantenimiento.
</details>

### Pregunta 5
¿Cómo se mapean los SIDs de AD a UIDs POSIX con el tipo de rango `ipa-ad-trust`?

a) Manualmente por el administrador
b) Mediante atributos POSIX definidos en AD
c) Algorítmicamente a partir del SID
d) Mediante una tabla de traducción en LDAP

<details><summary>Respuesta</summary>

**c) Algorítmicamente a partir del SID**

El tipo de rango `ipa-ad-trust` genera UIDs y GIDs automáticamente aplicando un algoritmo determinista al SID de Windows. Esto no requiere que los usuarios AD tengan atributos POSIX configurados. `ipa-ad-trust-posix` usaría los atributos POSIX de AD.
</details>

### Pregunta 6
¿Cuál es el proceso correcto para que un grupo de AD tenga acceso a recursos Linux gestionados por FreeIPA?

a) Añadir el grupo AD directamente a las reglas HBAC
b) Crear grupo externo, añadir grupo AD, vincular a grupo POSIX de IPA
c) Sincronizar el grupo AD a IPA con winsync
d) Crear un usuario espejo en IPA para cada miembro del grupo AD

<details><summary>Respuesta</summary>

**b) Crear grupo externo, añadir grupo AD, vincular a grupo POSIX de IPA**

El proceso es: 1) Crear un grupo externo en IPA (`--external`), 2) Añadir el grupo AD como miembro externo, 3) Vincular el grupo externo a un grupo POSIX de IPA. Solo los grupos POSIX pueden usarse en reglas HBAC y sudo.
</details>

### Pregunta 7
¿Qué parámetro de `ipa-adtrust-install` genera SIDs para los usuarios y grupos IPA existentes?

a) `--generate-sids`
b) `--add-sids`
c) `--create-sids`
d) `--enable-sids`

<details><summary>Respuesta</summary>

**b) `--add-sids`**

`--add-sids` genera Security Identifiers (SIDs) para los usuarios y grupos de FreeIPA que fueron creados antes de configurar el trust. Los SIDs son necesarios para que las entidades IPA sean visibles en el contexto de Active Directory.
</details>

### Pregunta 8
¿Cómo se referencia un usuario de AD desde un sistema inscrito en FreeIPA con trust configurado?

a) `DOMINIO\usuario`
b) `usuario@dominio.ad`
c) `ad:usuario`
d) `usuario (AD)`

<details><summary>Respuesta</summary>

**b) `usuario@dominio.ad`**

Con trust configurado, los usuarios de Active Directory se referencian con el formato `usuario@dominio.ad` (ej: `juan@empresa.local`). SSSD descubre automáticamente los subdominios de confianza y resuelve los usuarios AD.
</details>

### Pregunta 9
¿Qué requisito DNS es necesario antes de establecer un trust entre FreeIPA y AD?

a) Ambos dominios deben usar el mismo servidor DNS
b) Ambos dominios deben poder resolver mutuamente sus registros DNS
c) Solo FreeIPA necesita resolver el dominio AD
d) DNS no es necesario; se usan direcciones IP

<details><summary>Respuesta</summary>

**b) Ambos dominios deben poder resolver mutuamente sus registros DNS**

La resolución DNS bidireccional es un requisito previo. FreeIPA debe resolver registros del dominio AD y viceversa. Se configuran zonas de reenvío DNS en FreeIPA para resolver el dominio AD.
</details>

### Pregunta 10
¿Qué diferencia fundamental hay entre winsync y trust en cuanto al almacenamiento de datos de usuario?

a) Winsync almacena datos en la nube; trust los almacena localmente
b) Con winsync los datos se copian a IPA; con trust permanecen en AD
c) Con trust los datos se copian a AD; con winsync permanecen en IPA
d) Ambos almacenan datos de la misma manera

<details><summary>Respuesta</summary>

**b) Con winsync los datos se copian a IPA; con trust permanecen en AD**

Winsync sincroniza (copia) datos de usuario de AD a FreeIPA, creando duplicación. Con trust, los datos permanecen en su sistema original: los usuarios AD se quedan en AD y los usuarios IPA se quedan en IPA. SSSD consulta el dominio correspondiente cuando necesita resolver una identidad.
</details>
