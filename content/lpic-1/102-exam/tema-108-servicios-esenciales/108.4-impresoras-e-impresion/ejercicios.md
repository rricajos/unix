---
title: "108.4 Gestionar impresoras e impresion - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.4"
---

# 108.4 Gestionar impresoras e impresion - Ejercicios

### Pregunta 1

En que puerto escucha la interfaz web de administracion de CUPS?

a) Puerto 80
b) Puerto 443
c) Puerto 515
d) Puerto 631

<details><summary>Respuesta</summary>

**d) Puerto 631**

CUPS (Common UNIX Printing System) proporciona una interfaz web de administracion accesible en `http://localhost:631`. El puerto 631 es tambien el puerto del protocolo IPP (Internet Printing Protocol), que es la base de CUPS. El puerto 80 es HTTP, el 443 es HTTPS y el 515 es LPD (Line Printer Daemon), el protocolo legacy de impresion BSD.

</details>

---

### Pregunta 2

Cual es la diferencia entre los comandos `lp -d Impresora archivo` y `lpr -P Impresora archivo`?

a) `lp` imprime en color y `lpr` en blanco y negro
b) `lp` es estilo System V y usa `-d`, mientras que `lpr` es estilo BSD y usa `-P` para seleccionar impresora
c) `lpr` permite multiples copias y `lp` no
d) `lp` envia a impresoras de red y `lpr` solo a impresoras locales

<details><summary>Respuesta</summary>

**b) `lp` es estilo System V y usa `-d`, mientras que `lpr` es estilo BSD y usa `-P` para seleccionar impresora**

Ambos comandos envian un archivo a imprimir, pero provienen de tradiciones Unix diferentes. `lp` es estilo System V y usa `-d` para especificar el destino y `-n` para el numero de copias. `lpr` es estilo BSD y usa `-P` para seleccionar la impresora y `-#` para el numero de copias. En CUPS, ambos son funcionales y producen el mismo resultado.

</details>

---

### Pregunta 3

Que comando se utiliza para agregar una impresora y establecerla como predeterminada en CUPS?

a) `cupsctl -p Oficina -d`
b) `lpadmin -p Oficina -E -v ipp://host/ipp/print` seguido de `lpadmin -d Oficina`
c) `cups-add -name Oficina -default`
d) `lpstat -p Oficina --set-default`

<details><summary>Respuesta</summary>

**b) `lpadmin -p Oficina -E -v ipp://host/ipp/print` seguido de `lpadmin -d Oficina`**

El comando `lpadmin` es la herramienta de administracion de impresoras en CUPS. La opcion `-p` define el nombre, `-E` habilita la impresora y la configura para aceptar trabajos, `-v` especifica el URI del dispositivo. Para establecerla como predeterminada se usa `lpadmin -d nombre`. La opcion `-x` eliminaria una impresora. Los comandos en las opciones A, C y D no existen con esa sintaxis.

</details>

---

### Pregunta 4

Que comando muestra el estado completo del sistema de impresion, incluyendo impresoras, trabajos en cola y dispositivos?

a) `lpq -a`
b) `lpstat -t`
c) `cupsctl status`
d) `lpadmin --list`

<details><summary>Respuesta</summary>

**b) `lpstat -t`**

El comando `lpstat -t` muestra el estado completo del sistema de impresion, incluyendo: estado del planificador, impresora predeterminada, dispositivos, impresoras que aceptan trabajos y trabajos en cola. `lpstat -d` muestra solo la impresora predeterminada, `lpstat -p` el estado de las impresoras y `lpstat -a` cuales aceptan trabajos. `lpq -a` muestra las colas de impresion en estilo BSD.

</details>

---

### Pregunta 5

Cual es la diferencia entre `cupsdisable` y `cupsreject`?

a) `cupsdisable` rechaza nuevos trabajos y `cupsreject` detiene la impresion
b) `cupsdisable` detiene la impresion de trabajos existentes y `cupsreject` impide que la cola acepte nuevos trabajos
c) Son equivalentes, ambos detienen la impresora completamente
d) `cupsdisable` elimina la impresora y `cupsreject` la pausa temporalmente

<details><summary>Respuesta</summary>

**b) `cupsdisable` detiene la impresion de trabajos existentes y `cupsreject` impide que la cola acepte nuevos trabajos**

`cupsenable`/`cupsdisable` controlan si la impresora procesa los trabajos de su cola. `cupsaccept`/`cupsreject` controlan si la cola acepta nuevos trabajos. Una impresora deshabilitada (disable) pero que acepta trabajos (accept) acumulara trabajos en la cola sin imprimirlos. Una impresora habilitada (enable) que rechaza trabajos (reject) procesara los existentes pero no aceptara nuevos.

</details>

---

### Pregunta 6

Que comando lista los URIs de dispositivos de impresion disponibles en el sistema?

a) `lpstat -v`
b) `lpinfo -v`
c) `lpadmin -l`
d) `cupsctl --list-devices`

<details><summary>Respuesta</summary>

**b) `lpinfo -v`**

El comando `lpinfo -v` lista los URIs de dispositivos de impresion disponibles (impresoras detectadas), como USB, IPP, Socket y LPD. `lpinfo -m` lista los modelos y drivers disponibles. `lpstat -v` muestra los URIs de las impresoras ya configuradas (no las disponibles para configurar). `lpadmin -l` y `cupsctl --list-devices` no son opciones validas.

</details>

---

### Pregunta 7

Cual de los siguientes es el archivo de configuracion del demonio CUPS que no debe editarse manualmente mientras el servicio esta en ejecucion?

a) `/etc/cups/cupsd.conf`
b) `/etc/cups/printers.conf`
c) `/etc/cups/ppd/impresora.ppd`
d) `/etc/cups/client.conf`

<details><summary>Respuesta</summary>

**b) `/etc/cups/printers.conf`**

El archivo `/etc/cups/printers.conf` contiene la definicion de las impresoras configuradas (nombre, URI, estado, opciones) y no debe editarse manualmente mientras CUPS esta en ejecucion, ya que el demonio lo sobrescribe. `/etc/cups/cupsd.conf` es la configuracion del demonio (puertos, permisos, comparticion) y se puede editar con precaucion. Los archivos PPD describen las capacidades de cada impresora y se almacenan en `/etc/cups/ppd/`.

</details>

---

### Pregunta 8

Que comando cancela un trabajo de impresion especifico con ID "Oficina-42" usando el estilo System V?

a) `lprm Oficina-42`
b) `cancel Oficina-42`
c) `lprm -P Oficina 42`
d) `cupsdisable Oficina-42`

<details><summary>Respuesta</summary>

**b) `cancel Oficina-42`**

El comando `cancel` es el comando estilo System V para cancelar trabajos de impresion, y acepta el ID completo del trabajo (nombre-numero). `lprm` es el equivalente BSD, que acepta el numero del trabajo (`lprm 42`) o `-P impresora numero` para especificar la impresora. `cancel -a` cancela todos los trabajos y `lprm -` cancela todos los trabajos del usuario actual. `cupsdisable` deshabilita la impresora, no cancela trabajos.

</details>

---

### Pregunta 9

Cual es el protocolo nativo de CUPS para la comunicacion con impresoras en red?

a) LPD (Line Printer Daemon)
b) SMB (Server Message Block)
c) IPP (Internet Printing Protocol)
d) JetDirect (Socket)

<details><summary>Respuesta</summary>

**c) IPP (Internet Printing Protocol)**

IPP (Internet Printing Protocol) es el protocolo nativo y base del sistema CUPS, usando el puerto 631/TCP. IPP Everywhere es el estandar moderno que permite imprimir sin necesidad de drivers especificos. LPD (puerto 515) es el protocolo legacy de BSD. Socket/JetDirect (puerto 9100) es comun en impresoras HP. SMB se usa para compartir impresoras en redes Windows.

</details>

---

### Pregunta 10

Como se mueve un trabajo de impresion de la cola "Oficina" a la cola "OtraImpresora"?

a) `lpmove Oficina-123 OtraImpresora`
b) `cancel Oficina-123 && lp -d OtraImpresora archivo`
c) `lpr -P OtraImpresora --from Oficina-123`
d) `cupsmove Oficina-123 OtraImpresora`

<details><summary>Respuesta</summary>

**a) `lpmove Oficina-123 OtraImpresora`**

El comando `lpmove` permite mover trabajos de impresion de una cola a otra. Se puede mover un trabajo especifico (`lpmove Oficina-123 OtraImpresora`) o todos los trabajos de una impresora (`lpmove Oficina OtraImpresora`). Esto es util cuando una impresora se averia y se necesitan redirigir los trabajos pendientes a otra impresora disponible. El comando `cupsmove` no existe.

</details>
