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

## Ejercicio 1
¿En que puerto escucha la interfaz web de CUPS? ¿Como se accede a ella?

<details><summary>Respuesta</summary>

CUPS escucha en el **puerto 631**. Se accede mediante un navegador web en la URL:

```
http://localhost:631
```

Desde ahi se pueden administrar impresoras, ver trabajos y modificar la configuracion. Las operaciones administrativas requieren autenticacion.

</details>

## Ejercicio 2
¿Cual es la diferencia entre `lp -d Impresora archivo` y `lpr -P Impresora archivo`?

<details><summary>Respuesta</summary>

Ambos imprimen un archivo en una impresora especifica, pero provienen de tradiciones diferentes:

- **`lp -d`**: Estilo **System V**. Usa `-d` para especificar destino y `-n` para copias.
- **`lpr -P`**: Estilo **BSD**. Usa `-P` para especificar impresora y `-#` para copias.

En CUPS, ambos son funcionales y producen el mismo resultado.

</details>

## Ejercicio 3
¿Como agregarias una impresora de red llamada "Oficina" con URI `ipp://192.168.1.50/ipp/print` y la establecerias como predeterminada?

<details><summary>Respuesta</summary>

```bash
lpadmin -p Oficina -E -v ipp://192.168.1.50/ipp/print -m everywhere
lpadmin -d Oficina
```

- `-p Oficina`: nombre de la impresora
- `-E`: habilitar e aceptar trabajos
- `-v`: URI del dispositivo
- `-m everywhere`: usar IPP Everywhere (driver generico)
- `-d Oficina`: establecer como predeterminada

</details>

## Ejercicio 4
¿Que comando muestra el estado completo del sistema de impresion? ¿Y cual muestra solo la impresora predeterminada?

<details><summary>Respuesta</summary>

```bash
lpstat -t     # Estado completo del sistema de impresion
lpstat -d     # Solo la impresora predeterminada
```

`lpstat -t` incluye: estado del planificador, impresoras predeterminadas, dispositivos, impresoras que aceptan trabajos y trabajos en cola.

</details>

## Ejercicio 5
¿Como cancelarias un trabajo de impresion con ID "Oficina-42"? Indica al menos dos formas.

<details><summary>Respuesta</summary>

```bash
cancel Oficina-42          # System V style
lprm 42                    # BSD style (por numero)
```

Para cancelar todos los trabajos:
```bash
cancel -a                  # System V - todos los trabajos
lprm -                     # BSD - todos los trabajos del usuario
```

</details>

## Ejercicio 6
¿Cual es la diferencia entre `/etc/cups/cupsd.conf` y `/etc/cups/printers.conf`? ¿Que son los archivos PPD?

<details><summary>Respuesta</summary>

- **`/etc/cups/cupsd.conf`**: Configuracion del **demonio CUPS** (puertos, permisos de acceso, comparticion en red, nivel de log).
- **`/etc/cups/printers.conf`**: Contiene la **definicion de las impresoras** configuradas (nombre, URI, estado, opciones). No debe editarse manualmente con CUPS en ejecucion.
- **Archivos PPD** (PostScript Printer Description): Describen las **capacidades de cada impresora** (resoluciones, tamanos de papel, bandejas, opciones de acabado). Se almacenan en `/etc/cups/ppd/`.

</details>

## Ejercicio 7
¿Como descubririas los dispositivos de impresion disponibles en el sistema y los drivers instalados?

<details><summary>Respuesta</summary>

```bash
lpinfo -v     # Listar URIs de dispositivos disponibles (impresoras detectadas)
lpinfo -m     # Listar modelos/drivers disponibles
```

Para buscar un driver especifico:
```bash
lpinfo -m | grep -i "hp laserjet"
```

</details>

## Ejercicio 8
¿Que protocolos de red soporta CUPS para conectarse a impresoras remotas? Indica el formato URI de cada uno.

<details><summary>Respuesta</summary>

| Protocolo | URI | Puerto |
|-----------|-----|--------|
| **IPP** (Internet Printing Protocol) | `ipp://host/ipp/print` | 631 |
| **Socket/JetDirect** | `socket://host:9100` | 9100 |
| **LPD** (Line Printer Daemon) | `lpd://host/cola` | 515 |

IPP es el protocolo preferido en CUPS, ya que es su protocolo nativo. Socket/JetDirect es comun en impresoras HP. LPD es el protocolo legacy de BSD.

</details>
