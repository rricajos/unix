---
title: "303.3 - Ejercicios: DFS"
description: "Ejercicios de práctica sobre DFS en Samba"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 303 - Configuración de Recursos Compartidos"
subtema: "303.3"
peso: 1
tags:
  - lpic-3
  - tema-303
  - samba
  - dfs
  - ejercicios
---

# 303.3 Ejercicios - DFS

### Pregunta 1
¿Qué dos parámetros son necesarios para configurar un share como raíz DFS en Samba?

a) `dfs root = yes` en [global] y `dfs enable = yes` en el share
b) `host msdfs = yes` en [global] y `msdfs root = yes` en el share
c) `enable dfs = yes` en [global] y `dfs share = yes` en el share
d) `msdfs root = yes` en [global] y `host msdfs = yes` en el share

<details><summary>Respuesta</summary>

**b) `host msdfs = yes` en [global] y `msdfs root = yes` en el share**

Se necesitan dos parámetros: `host msdfs = yes` en la sección `[global]` para habilitar el soporte DFS en el servidor, y `msdfs root = yes` en la sección del share que actuará como raíz DFS.
</details>

### Pregunta 2
¿Cuál es el formato correcto de un enlace simbólico DFS en Samba?

a) `dfs://servidor/share`
b) `\\servidor\share`
c) `msdfs:servidor\share`
d) `smb://servidor/share`

<details><summary>Respuesta</summary>

**c) `msdfs:servidor\share`**

Los enlaces DFS en Samba se crean como enlaces simbólicos con el prefijo `msdfs:` seguido del servidor y share destino separados por una barra invertida.
</details>

### Pregunta 3
¿Cómo se configura un enlace DFS con failover a dos servidores?

a) `ln -s "msdfs:srv1\share" "msdfs:srv2\share" /dfs/enlace`
b) `ln -s "msdfs:srv1\share+srv2\share" /dfs/enlace`
c) `ln -s "msdfs:srv1\share,srv2\share" /dfs/enlace`
d) `ln -s "msdfs:srv1\share|srv2\share" /dfs/enlace`

<details><summary>Respuesta</summary>

**c) `ln -s "msdfs:srv1\share,srv2\share" /dfs/enlace`**

Los destinos múltiples en un enlace DFS se separan con comas dentro de la misma cadena del enlace simbólico. Esto permite failover automático entre los servidores especificados.
</details>

### Pregunta 4
¿Qué hace el parámetro `msdfs proxy` en un share de Samba?

a) Configura un servidor proxy para acceso DFS
b) Redirige el share completo a otro servidor sin necesidad de enlaces simbólicos
c) Habilita el caché de DFS en el proxy
d) Configura la autenticación proxy para DFS

<details><summary>Respuesta</summary>

**b) Redirige el share completo a otro servidor sin necesidad de enlaces simbólicos**

`msdfs proxy` redirige transparentemente un share completo a otro servidor. A diferencia de `msdfs root`, no requiere crear enlaces simbólicos en el sistema de archivos; la redirección se configura directamente en smb.conf.
</details>

### Pregunta 5
¿Cuál es el principal beneficio de DFS para los usuarios finales?

a) Mayor velocidad de transferencia de archivos
b) Un espacio de nombres unificado que oculta la ubicación física de los datos
c) Cifrado automático de los datos compartidos
d) Compresión de archivos en la red

<details><summary>Respuesta</summary>

**b) Un espacio de nombres unificado que oculta la ubicación física de los datos**

DFS permite crear una estructura virtual donde los usuarios acceden a una ruta única, independientemente del servidor físico donde residan los datos. Esto proporciona transparencia de ubicación y facilita la reorganización de datos sin impacto para los usuarios.
</details>

### Pregunta 6
¿Qué sucede cuando un cliente accede a un enlace DFS con múltiples destinos y el primer servidor no está disponible?

a) El acceso falla inmediatamente
b) El cliente intenta conectar al siguiente destino de la lista
c) DFS espera indefinidamente a que el primer servidor responda
d) El enlace DFS se elimina automáticamente

<details><summary>Respuesta</summary>

**b) El cliente intenta conectar al siguiente destino de la lista**

Cuando un enlace DFS tiene múltiples destinos (failover), si el primer servidor no está disponible, el cliente automáticamente intenta conectar con el siguiente destino de la lista.
</details>

### Pregunta 7
¿En qué sección de smb.conf se debe colocar el parámetro `host msdfs`?

a) En la sección del share DFS
b) En la sección [homes]
c) En la sección [global]
d) En cualquier sección

<details><summary>Respuesta</summary>

**c) En la sección [global]**

`host msdfs = yes` es un parámetro global que habilita el soporte DFS en todo el servidor Samba. Debe estar en la sección `[global]` de smb.conf.
</details>

### Pregunta 8
¿Cómo se implementan físicamente los enlaces DFS en el sistema de archivos Linux?

a) Como archivos de configuración .dfs
b) Como enlaces simbólicos con formato especial
c) Como entradas en una base de datos
d) Como archivos .lnk de Windows

<details><summary>Respuesta</summary>

**b) Como enlaces simbólicos con formato especial**

Los enlaces DFS se implementan como enlaces simbólicos en el directorio raíz DFS. El contenido del enlace simbólico tiene el formato `msdfs:servidor\share` que Samba interpreta para redirigir al cliente.
</details>

### Pregunta 9
¿Qué comando se puede utilizar para verificar los enlaces DFS existentes en el directorio raíz DFS?

a) `testparm --dfs`
b) `smbclient -L //servidor --dfs`
c) `ls -la /srv/samba/dfs/`
d) `net dfs list`

<details><summary>Respuesta</summary>

**c) `ls -la /srv/samba/dfs/`**

Dado que los enlaces DFS son enlaces simbólicos en el sistema de archivos, `ls -la` muestra los enlaces y sus destinos. Esto permite verificar que los enlaces DFS están correctamente configurados.
</details>

### Pregunta 10
¿Cuál es la diferencia entre `msdfs root` y `msdfs proxy`?

a) No hay diferencia, son sinónimos
b) `msdfs root` crea una raíz DFS con enlaces simbólicos; `msdfs proxy` redirige un share completo
c) `msdfs root` es para Windows; `msdfs proxy` es para Linux
d) `msdfs proxy` requiere `msdfs root = yes` para funcionar

<details><summary>Respuesta</summary>

**b) `msdfs root` crea una raíz DFS con enlaces simbólicos; `msdfs proxy` redirige un share completo**

`msdfs root = yes` convierte un share en un contenedor de enlaces DFS (implementados como enlaces simbólicos). `msdfs proxy` simplemente redirige un share completo a otro servidor sin necesidad de crear enlaces simbólicos.
</details>
