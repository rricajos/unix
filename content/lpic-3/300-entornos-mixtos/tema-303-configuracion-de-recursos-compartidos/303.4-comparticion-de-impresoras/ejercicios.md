---
title: "303.4 - Ejercicios: Compartición de Impresoras"
description: "Ejercicios de práctica para compartición de impresoras con Samba y CUPS"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 303 - Configuración de Recursos Compartidos"
subtema: "303.4"
peso: 2
tags:
  - lpic-3
  - tema-303
  - samba
  - cups
  - ejercicios
---

# 303.4 Ejercicios - Compartición de Impresoras

### Pregunta 1
¿Qué parámetros en la sección [global] de smb.conf son esenciales para la integración con CUPS?

a) `cups enable = yes` y `cups backend = local`
b) `printing = cups` y `printcap name = cups`
c) `printer system = cups` y `cups path = /etc/cups`
d) `use cups = yes` y `cups driver = generic`

<details><summary>Respuesta</summary>

**b) `printing = cups` y `printcap name = cups`**

`printing = cups` indica a Samba que use CUPS como sistema de impresión, y `printcap name = cups` le dice que obtenga la lista de impresoras directamente de CUPS en lugar de un archivo printcap tradicional.
</details>

### Pregunta 2
¿Qué parámetro distingue un share de impresora de un share de archivos?

a) `writable = no`
b) `browseable = no`
c) `printable = yes`
d) `printing = yes`

<details><summary>Respuesta</summary>

**c) `printable = yes`**

`printable = yes` es el parámetro que define un share como share de impresión, permitiendo que los clientes envíen trabajos de impresión. Sin este parámetro, el share solo funciona como recurso compartido de archivos.
</details>

### Pregunta 3
¿Cuál es el propósito del share [print$]?

a) Almacenar los trabajos de impresión en cola
b) Almacenar los drivers de impresora para distribución automática a clientes Windows
c) Configurar el servicio CUPS
d) Almacenar los logs de impresión

<details><summary>Respuesta</summary>

**b) Almacenar los drivers de impresora para distribución automática a clientes Windows**

El share `[print$]` contiene los drivers de impresora organizados por arquitectura (x64, W32X86, etc.). Cuando un cliente Windows se conecta a una impresora compartida, puede descargar automáticamente el driver adecuado desde este share (Point-and-Print).
</details>

### Pregunta 4
¿Qué efecto tiene `cups options = raw` en smb.conf?

a) Los trabajos de impresión se comprimen antes de enviarlos
b) CUPS no aplica filtros adicionales al trabajo de impresión
c) Se habilita la impresión bidireccional
d) Los trabajos se envían en formato PostScript

<details><summary>Respuesta</summary>

**b) CUPS no aplica filtros adicionales al trabajo de impresión**

Con `cups options = raw`, CUPS envía los datos de impresión directamente a la impresora sin procesamiento. Esto es apropiado cuando los clientes Windows ya generan los datos en el formato correcto de la impresora usando su driver local.
</details>

### Pregunta 5
¿Qué comando de rpcclient se usa para asociar un driver a una impresora?

a) `adddriver`
b) `setprinter`
c) `setdriver`
d) `linkdriver`

<details><summary>Respuesta</summary>

**c) `setdriver`**

`setdriver "NombreImpresora" "NombreDriver"` asocia un driver previamente subido al servidor con una impresora específica. `adddriver` sube el driver al servidor, pero no lo asocia a ninguna impresora.
</details>

### Pregunta 6
¿Qué directorio almacena los drivers de 64 bits para Windows en el share print$?

a) /var/lib/samba/drivers/WIN64/3/
b) /var/lib/samba/drivers/x64/3/
c) /var/lib/samba/drivers/AMD64/3/
d) /var/lib/samba/drivers/64bit/3/

<details><summary>Respuesta</summary>

**b) /var/lib/samba/drivers/x64/3/**

La estructura de directorios de drivers usa `x64` para drivers de Windows 64 bits, `W32X86` para 32 bits y `WIN40` para versiones antiguas. El subdirectorio `3` corresponde a la versión 3 del modelo de drivers.
</details>

### Pregunta 7
¿Qué parámetro de smb.conf hace que Samba cargue automáticamente todas las impresoras definidas en CUPS?

a) `auto printers = yes`
b) `cups auto = yes`
c) `load printers = yes`
d) `printcap name = auto`

<details><summary>Respuesta</summary>

**c) `load printers = yes`**

`load printers = yes` hace que Samba consulte CUPS (cuando `printcap name = cups`) y cree automáticamente un share para cada impresora definida en el sistema de impresión, usando la configuración de la sección `[printers]`.
</details>

### Pregunta 8
¿Cuál es el directorio de spool recomendado para trabajos de impresión en Samba y qué permisos necesita?

a) /var/spool/cups con permisos 0755
b) /var/spool/samba con permisos 1777
c) /tmp/samba-print con permisos 0777
d) /var/lib/samba/spool con permisos 0700

<details><summary>Respuesta</summary>

**b) /var/spool/samba con permisos 1777**

`/var/spool/samba` es el directorio de spool estándar para Samba. Los permisos `1777` (sticky bit + lectura/escritura para todos) permiten que cualquier usuario pueda escribir sus trabajos de impresión pero no eliminar los de otros.
</details>

### Pregunta 9
¿Qué protocolo RPC utiliza Windows para comunicarse con el servicio de impresión de Samba?

a) LDAP
b) SPOOLSS
c) NETLOGON
d) SAMR

<details><summary>Respuesta</summary>

**b) SPOOLSS**

SPOOLSS (Spooler Subsystem) es el protocolo RPC que Windows usa para la comunicación con servicios de impresión. Samba implementa las pipes SPOOLSS para soportar enumerar impresoras, gestionar drivers, enviar trabajos y configurar impresoras.
</details>

### Pregunta 10
Un administrador quiere que solo los miembros del grupo `printadmin` puedan subir drivers al share [print$]. ¿Qué configuración es correcta?

a) `valid users = @printadmin` y `writable = yes`
b) `read only = yes` y `write list = @printadmin`
c) `admin users = @printadmin` y `guest ok = no`
d) `printable = yes` y `printer admin = @printadmin`

<details><summary>Respuesta</summary>

**b) `read only = yes` y `write list = @printadmin`**

La configuración correcta para el share `[print$]` es `read only = yes` (todos pueden leer/descargar drivers) combinado con `write list = @printadmin` (solo los administradores de impresión pueden subir nuevos drivers).
</details>
