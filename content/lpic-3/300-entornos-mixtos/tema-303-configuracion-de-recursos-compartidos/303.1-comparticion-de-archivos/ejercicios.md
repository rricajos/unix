---
title: "303.1 - Ejercicios: Compartición de Archivos"
description: "Ejercicios de práctica para compartición de archivos en Samba"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 303 - Configuración de Recursos Compartidos"
subtema: "303.1"
peso: 4
tags:
  - lpic-3
  - tema-303
  - samba
  - ejercicios
---

# 303.1 Ejercicios - Compartición de Archivos

### Pregunta 1
¿Cuál es el valor por defecto del parámetro `read only` en smb.conf?

a) no
b) yes
c) auto
d) inherit

<details><summary>Respuesta</summary>

**b) yes**

Por defecto, todos los recursos compartidos en Samba son de solo lectura (`read only = yes`). Es necesario establecer explícitamente `writable = yes` o `read only = no` para permitir la escritura.
</details>

### Pregunta 2
Un recurso compartido tiene `browseable = no`. ¿Qué efecto tiene esto?

a) Los usuarios no pueden acceder al recurso bajo ninguna circunstancia
b) Solo los administradores pueden ver el recurso
c) El recurso no aparece en la lista al navegar, pero es accesible si se conoce el nombre
d) El recurso se elimina del servidor

<details><summary>Respuesta</summary>

**c) El recurso no aparece en la lista al navegar, pero es accesible si se conoce el nombre**

`browseable = no` solo oculta el recurso del listado de red. Los usuarios pueden acceder directamente escribiendo la ruta UNC completa (por ejemplo, `\\servidor\recurso`).
</details>

### Pregunta 3
¿Qué parámetro permite a ciertos usuarios escribir en un share que tiene `read only = yes`?

a) valid users
b) read list
c) write list
d) force user

<details><summary>Respuesta</summary>

**c) write list**

`write list` define usuarios o grupos que tienen permisos de escritura incluso cuando el share está configurado como solo lectura (`read only = yes`). `write list` sobrescribe la restricción de solo lectura para los usuarios especificados.
</details>

### Pregunta 4
Dada la siguiente configuración, ¿cuáles serán los permisos de un archivo nuevo creado con permisos solicitados 0777?

```ini
create mask = 0664
force create mode = 0640
```

a) 0664
b) 0640
c) 0777
d) 0664

<details><summary>Respuesta</summary>

**a) 0664**

El cálculo es: primero se aplica `create mask` (AND): 0777 AND 0664 = 0664. Luego se aplica `force create mode` (OR): 0664 OR 0640 = 0664. El resultado final es 0664.
</details>

### Pregunta 5
¿Cuál es la diferencia principal entre `hide files` y `veto files`?

a) No hay diferencia, son sinónimos
b) `hide files` oculta visualmente; `veto files` bloquea el acceso completamente
c) `hide files` es para directorios; `veto files` es para archivos
d) `veto files` solo funciona en Windows; `hide files` en Linux

<details><summary>Respuesta</summary>

**b) `hide files` oculta visualmente; `veto files` bloquea el acceso completamente**

`hide files` solo oculta los archivos del listado de directorio, pero siguen siendo accesibles si se conoce el nombre. `veto files` impide completamente el acceso a los archivos que coinciden con los patrones especificados.
</details>

### Pregunta 6
¿Qué hace la sección especial `[homes]` en smb.conf?

a) Define el directorio home del servicio Samba
b) Proporciona automáticamente un share con el directorio personal de cada usuario
c) Configura el directorio de instalación de Samba
d) Define la ruta base para todos los shares

<details><summary>Respuesta</summary>

**b) Proporciona automáticamente un share con el directorio personal de cada usuario**

`[homes]` es una sección especial que crea dinámicamente un recurso compartido para cada usuario que se conecta, mapeándolo a su directorio personal en el sistema Linux.
</details>

### Pregunta 7
Para activar el módulo de papelera de reciclaje en un share, ¿qué parámetro se utiliza?

a) recycle = yes
b) trash = on
c) vfs objects = recycle
d) enable recycle = true

<details><summary>Respuesta</summary>

**c) vfs objects = recycle**

El módulo de reciclaje se activa mediante `vfs objects = recycle`. VFS (Virtual File System) es el sistema de módulos extensibles de Samba, y `recycle` es uno de los módulos disponibles.
</details>

### Pregunta 8
¿Qué valor de `map to guest` convierte en acceso de invitado las conexiones de usuarios que no existen en Samba?

a) Never
b) Bad Password
c) Bad User
d) Always

<details><summary>Respuesta</summary>

**c) Bad User**

`map to guest = Bad User` mapea a invitado las conexiones realizadas con nombres de usuario que no existen en Samba. `Never` rechaza la conexión, `Bad Password` mapea cuando la contraseña es incorrecta.
</details>

### Pregunta 9
¿Cuál de las siguientes configuraciones permite que el grupo `editores` tenga acceso de escritura mientras el resto solo puede leer?

a) `writable = yes` y `read list = @editores`
b) `read only = yes` y `write list = @editores`
c) `writable = no` y `valid users = @editores`
d) `guest ok = yes` y `write list = @editores`

<details><summary>Respuesta</summary>

**b) `read only = yes` y `write list = @editores`**

Con `read only = yes`, el share es de solo lectura por defecto. `write list = @editores` otorga permisos de escritura específicamente a los miembros del grupo `editores`, sobrescribiendo la restricción de solo lectura para ellos.
</details>

### Pregunta 10
¿Qué parámetro del módulo VFS recycle controla si se mantiene la estructura de directorios original al mover archivos a la papelera?

a) recycle:versions
b) recycle:repository
c) recycle:keeptree
d) recycle:touch

<details><summary>Respuesta</summary>

**c) recycle:keeptree**

`recycle:keeptree = yes` mantiene la estructura de directorios original dentro de la papelera de reciclaje. Esto facilita encontrar archivos eliminados ya que conservan su ubicación relativa.
</details>
