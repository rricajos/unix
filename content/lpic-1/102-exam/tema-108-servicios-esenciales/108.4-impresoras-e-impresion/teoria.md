---
title: "108.4 Gestionar impresoras e impresion - Teoria"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.4"
---

# 108.4 Gestionar impresoras e impresion - Teoria

## CUPS (Common UNIX Printing System)

### Descripcion general
- Sistema de impresion estandar en Linux y macOS
- Basado en el protocolo **IPP (Internet Printing Protocol)**
- Proporciona una interfaz web de administracion
- Compatible con comandos legacy de LPD (lpr, lpq, lprm)
- Demonio principal: `cupsd`

### Interfaz web
- Accesible en **`http://localhost:631`**
- Permite administrar impresoras, trabajos y configuracion
- Requiere autenticacion para operaciones administrativas

---

## Archivos de configuracion

### `/etc/cups/cupsd.conf`
Configuracion principal del demonio CUPS.

```
# Puerto de escucha
Listen localhost:631
Listen /run/cups/cups.sock

# Registro
LogLevel warn

# Acceso a la interfaz web
<Location />
  Order allow,deny
  Allow localhost
</Location>

<Location /admin>
  Order allow,deny
  Allow localhost
</Location>

# Compartir impresoras en la red
Browsing On
BrowseLocalProtocols dnssd
```

### `/etc/cups/printers.conf`
Contiene la definicion de las impresoras configuradas. **No editar manualmente** mientras CUPS este en ejecucion.

```
<Printer MiImpresora>
  UUID urn:uuid:xxxx-xxxx
  Info HP LaserJet
  Location Oficina
  DeviceURI ipp://192.168.1.50/ipp/print
  State Idle
  Accepting Yes
  Shared Yes
  JobSheets none none
  QuotaPeriod 0
  PageLimit 0
  KLimit 0
</Printer>
```

### Archivos PPD (PostScript Printer Description)
- Describen las capacidades de cada impresora
- Se almacenan en `/etc/cups/ppd/`
- Contienen opciones como tamano de papel, resolucion, bandejas
- Un archivo PPD por cada impresora configurada

---

## Administracion de impresoras: `lpadmin`

### Agregar una impresora
```bash
# Agregar impresora local USB
lpadmin -p MiImpresora -E -v usb://HP/LaserJet -m everywhere

# Agregar impresora de red IPP
lpadmin -p Impresora-Red -E -v ipp://192.168.1.50/ipp/print -m everywhere

# Agregar con PPD especifico
lpadmin -p MiImpresora -E -v socket://192.168.1.50:9100 -P /ruta/al/archivo.ppd

# Establecer como predeterminada
lpadmin -d MiImpresora
```

### Opciones de lpadmin
| Opcion | Descripcion |
|--------|-------------|
| `-p nombre` | Nombre de la impresora |
| `-E` | Habilitar la impresora y aceptar trabajos |
| `-v URI` | URI del dispositivo |
| `-m modelo` | Modelo/driver a usar (`everywhere` para IPP Everywhere) |
| `-P archivo.ppd` | Archivo PPD a usar |
| `-d nombre` | Establecer como impresora predeterminada |
| `-x nombre` | Eliminar una impresora |

### URIs de dispositivos comunes
| Tipo | Formato URI |
|------|-------------|
| USB | `usb://fabricante/modelo` |
| IPP (red) | `ipp://host/ipp/print` |
| Socket/JetDirect | `socket://host:9100` |
| LPD | `lpd://host/cola` |
| Paralelo | `parallel:/dev/lp0` |

---

## Comando `lpinfo`

Descubre impresoras y drivers disponibles.

```bash
lpinfo -v              # Listar URIs de dispositivos disponibles
lpinfo -m              # Listar modelos/drivers disponibles
lpinfo -m | grep -i hp # Buscar drivers de HP
```

---

## Imprimir archivos

### `lp` (System V style)
```bash
lp archivo.txt                  # Imprimir en impresora predeterminada
lp -d MiImpresora archivo.txt  # Imprimir en impresora especifica
lp -n 3 archivo.txt            # Imprimir 3 copias
lp -o landscape archivo.pdf    # Imprimir en horizontal
lp -o media=A4 archivo.pdf     # Tamano de papel A4
lp -o sides=two-sided-long-edge archivo.pdf  # Doble cara
```

### `lpr` (BSD style)
```bash
lpr archivo.txt                 # Imprimir en impresora predeterminada
lpr -P MiImpresora archivo.txt # Imprimir en impresora especifica
lpr -# 3 archivo.txt           # Imprimir 3 copias
cat archivo.txt | lpr           # Imprimir desde stdin
```

### Diferencias entre `lp` y `lpr`
| Caracteristica | lp (System V) | lpr (BSD) |
|---------------|--------------|-----------|
| Seleccionar impresora | `-d nombre` | `-P nombre` |
| Numero de copias | `-n 3` | `-# 3` |
| Origen | System V Unix | BSD Unix |

---

## Gestionar la cola de impresion

### `lpq` (ver cola - BSD style)
```bash
lpq                     # Ver cola de impresora predeterminada
lpq -P MiImpresora      # Ver cola de impresora especifica
lpq -a                  # Ver todas las colas
```

### `lpstat` (ver estado - System V style)
```bash
lpstat                  # Estado de trabajos del usuario
lpstat -a               # Impresoras que aceptan trabajos
lpstat -p               # Estado de las impresoras
lpstat -p -d            # Estado e impresora predeterminada
lpstat -t               # Estado completo del sistema de impresion
lpstat -o               # Trabajos en todas las colas
lpstat -s               # Resumen de impresoras y URIs
```

### Cancelar trabajos

#### `cancel` (System V style)
```bash
cancel MiImpresora-123    # Cancelar trabajo por ID
cancel -a                 # Cancelar todos los trabajos
cancel -a MiImpresora     # Cancelar todos los trabajos de una impresora
```

#### `lprm` (BSD style)
```bash
lprm 123                  # Cancelar trabajo por numero
lprm -P MiImpresora 123  # Cancelar de impresora especifica
lprm -                    # Cancelar todos los trabajos del usuario
```

---

## Gestion del estado de impresoras y colas

### `cupsenable` / `cupsdisable` - Habilitar/deshabilitar impresoras

Controlan si la impresora **procesa** los trabajos de su cola.

```bash
# Deshabilitar la impresora (deja de imprimir, pero sigue aceptando trabajos)
cupsdisable MiImpresora

# Deshabilitar con motivo
cupsdisable -r "En mantenimiento" MiImpresora

# Habilitar la impresora (reanuda la impresion)
cupsenable MiImpresora
```

### `cupsaccept` / `cupsreject` - Aceptar/rechazar trabajos

Controlan si la cola **acepta nuevos trabajos**.

```bash
# Rechazar nuevos trabajos (la cola no acepta mas trabajos)
cupsreject MiImpresora

# Rechazar con motivo
cupsreject -r "Fuera de servicio" MiImpresora

# Aceptar nuevos trabajos
cupsaccept MiImpresora
```

**Diferencia clave:**
- `cupsenable`/`cupsdisable`: Controla si la impresora **procesa** los trabajos existentes
- `cupsaccept`/`cupsreject`: Controla si la cola **acepta** nuevos trabajos

| Estado | Acepta trabajos | Imprime trabajos |
|--------|----------------|------------------|
| enable + accept | Si | Si (funcionamiento normal) |
| disable + accept | Si | No (acumula en cola) |
| enable + reject | No | Si (solo procesa los existentes) |
| disable + reject | No | No (completamente detenida) |

### `lpmove` - Mover trabajos entre colas

Permite mover trabajos de impresion de una cola a otra.

```bash
# Mover un trabajo especifico a otra impresora
lpmove MiImpresora-123 OtraImpresora

# Mover TODOS los trabajos de una impresora a otra
lpmove MiImpresora OtraImpresora
```

**Uso tipico:** Cuando una impresora se averia, se mueven los trabajos pendientes a otra impresora disponible.

---

## IPP (Internet Printing Protocol)

- Protocolo estandar para comunicacion con impresoras en red
- Base del sistema **CUPS**
- **Puerto:** 631/TCP (HTTP sobre el puerto 631)
- Soporta operaciones: enviar trabajo, consultar estado, cancelar trabajo, obtener atributos
- Las URI de impresoras IPP usan el formato: `ipp://host:631/printers/nombre`
- **IPP Everywhere:** Estandar moderno que permite imprimir sin necesidad de drivers especificos (la impresora describe sus capacidades via IPP)

```bash
# Ejemplo de URI IPP
ipp://192.168.1.50:631/printers/MiImpresora
ipps://192.168.1.50:631/printers/MiImpresora    # IPP sobre TLS (cifrado)
```

---

## `cupsctl`

Herramienta para configurar opciones del servidor CUPS.

```bash
cupsctl                          # Mostrar configuracion actual
cupsctl --share-printers         # Compartir impresoras en red
cupsctl --no-share-printers      # No compartir
cupsctl --remote-admin            # Permitir administracion remota
cupsctl --no-remote-admin         # Deshabilitar administracion remota
```

---

## `lpoptions`

Gestiona opciones de impresion del usuario.

```bash
lpoptions -d MiImpresora              # Establecer impresora predeterminada
lpoptions -l                           # Listar opciones disponibles
lpoptions -p MiImpresora -l           # Opciones de impresora especifica
lpoptions -o media=A4 -o sides=two-sided-long-edge  # Establecer opciones
```

---

## Legacy: LPD (Line Printer Daemon)

- Sistema de impresion clasico de BSD
- Demonio `lpd`, archivo de configuracion `/etc/printcap`
- CUPS proporciona compatibilidad con los comandos LPD
- En el contexto actual, los comandos `lpr`, `lpq`, `lprm` son proporcionados por CUPS

---

## Puntos clave para el examen

1. **CUPS** es el sistema de impresion estandar, interfaz web en **puerto 631**
2. **IPP** (Internet Printing Protocol) usa puerto **631/TCP**; es la base de CUPS
3. **lp** es System V (usa `-d`), **lpr** es BSD (usa `-P`) para seleccionar impresora
4. **lpadmin** administra impresoras: `-p` crear, `-x` eliminar, `-d` predeterminada
5. **`cupsenable`/`cupsdisable`** habilitan/deshabilitan la impresion; **`cupsaccept`/`cupsreject`** controlan la aceptacion de trabajos
6. **`lpmove`** mueve trabajos de una cola a otra
7. **lpstat -t** muestra el estado completo del sistema de impresion
8. **cancel** (System V) y **lprm** (BSD) cancelan trabajos
9. **lpinfo -v** lista dispositivos, **lpinfo -m** lista drivers
10. `/etc/cups/cupsd.conf` es la configuracion del demonio
11. `/etc/cups/printers.conf` define las impresoras (no editar manualmente con CUPS activo)
12. Los archivos **PPD** describen las capacidades de cada impresora
