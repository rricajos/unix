---
title: "Teoria: Niveles de Ejecucion y Targets de Systemd (101.3)"
tags:
  - lpic-1
  - examen-101
  - tema-101
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "101"
tema: "101"
subtema: "101.3"
---

# Teoria: Niveles de Ejecucion y Targets de Systemd (101.3)

## Indice
1. [SysVinit y niveles de ejecucion (runlevels)](#1-sysvinit-y-niveles-de-ejecucion-runlevels)
2. [Systemd y targets](#2-systemd-y-targets)
3. [Tabla de equivalencia: runlevels y targets](#3-tabla-de-equivalencia-runlevels-y-targets)
4. [Gestion de servicios con systemctl](#4-gestion-de-servicios-con-systemctl)
5. [Comandos de apagado y reinicio](#5-comandos-de-apagado-y-reinicio)
6. [El comando wall](#6-el-comando-wall)
7. [acpid: daemon de gestion de energia](#7-acpid-daemon-de-gestion-de-energia)

---

## 1. SysVinit y niveles de ejecucion (runlevels)

### Que son los runlevels

Los **niveles de ejecucion** (runlevels) son estados predefinidos del sistema que determinan que servicios se ejecutan. SysVinit define 7 runlevels (0-6), cada uno con un proposito especifico.

### Tabla de runlevels

| Runlevel | Descripcion | Uso tipico |
|----------|-------------|------------|
| **0** | Apagado (halt) | Apagar el sistema |
| **1** | Modo monousuario (single-user) | Mantenimiento, reparacion, cambio de contrasena de root |
| **2** | Multiusuario sin red (Debian: multiusuario completo) | Varia segun distribucion |
| **3** | Multiusuario con red (modo texto) | Servidores, sin entorno grafico |
| **4** | No definido / personalizable | Reservado para uso personalizado |
| **5** | Multiusuario con red y entorno grafico | Escritorios, uso normal con GUI |
| **6** | Reinicio (reboot) | Reiniciar el sistema |

> **Importante para el examen:** Los runlevels 2, 3 y 4 pueden variar entre distribuciones. En Debian/Ubuntu, los runlevels 2-5 son identicos (multiusuario con red). En Red Hat/CentOS, el runlevel 3 es multiusuario texto y el 5 es multiusuario grafico. Los runlevels **0** (apagado), **1** (monousuario) y **6** (reinicio) son **universales** en todas las distribuciones.

### Archivo /etc/inittab

El archivo `/etc/inittab` es el archivo de configuracion principal de SysVinit. Define el runlevel por defecto y las acciones para cada runlevel.

```bash
# Formato de las lineas:
# id:runlevels:accion:proceso

# Ejemplo de /etc/inittab
id:3:initdefault:                          # Runlevel por defecto: 3
si::sysinit:/etc/init.d/rcS                # Script de inicializacion del sistema
l0:0:wait:/etc/init.d/rc 0                 # Acciones para runlevel 0
l1:1:wait:/etc/init.d/rc 1                 # Acciones para runlevel 1
l2:2:wait:/etc/init.d/rc 2                 # Acciones para runlevel 2
l3:3:wait:/etc/init.d/rc 3                 # Acciones para runlevel 3
l4:4:wait:/etc/init.d/rc 4                 # Acciones para runlevel 4
l5:5:wait:/etc/init.d/rc 5                 # Acciones para runlevel 5
l6:6:wait:/etc/init.d/rc 6                 # Acciones para runlevel 6
ca::ctrlaltdel:/sbin/shutdown -r now       # Accion al presionar Ctrl+Alt+Del
```

**Campos del archivo:**
- **id**: Identificador unico de la linea (1-4 caracteres).
- **runlevels**: Lista de runlevels en los que se aplica la accion.
- **accion**: Tipo de accion (initdefault, sysinit, wait, respawn, ctrlaltdel, etc.).
- **proceso**: Comando o script a ejecutar.

> **Para el examen:** En sistemas con systemd, `/etc/inittab` **no se utiliza**. systemd usa targets en su lugar. Sin embargo, es importante conocer este archivo para el examen.

### Scripts de inicio en SysVinit

#### Directorio /etc/init.d/

Contiene los scripts de inicio de los servicios. Cada script acepta parametros como `start`, `stop`, `restart`, `status`.

```bash
# Ejemplos de uso
/etc/init.d/apache2 start       # Iniciar Apache
/etc/init.d/ssh stop            # Detener SSH
/etc/init.d/networking restart  # Reiniciar la red
service apache2 start           # Equivalente usando el comando service
```

#### Directorios /etc/rc.d/rc[0-6].d/ (o /etc/rc[0-6].d/)

Cada runlevel tiene un directorio que contiene enlaces simbolicos a los scripts en `/etc/init.d/`. Los enlaces siguen una convencion de nombres:

```
/etc/rc3.d/
  S01networking -> ../init.d/networking     # S = Start (iniciar)
  S02ssh -> ../init.d/ssh                   # Numero = orden de ejecucion
  S03apache2 -> ../init.d/apache2
  K01apache2 -> ../init.d/apache2           # K = Kill (detener)
```

**Convencion de nombres:**
- **S** (Start): El servicio se **inicia** al entrar en este runlevel. Se ejecuta con el parametro `start`.
- **K** (Kill): El servicio se **detiene** al entrar en este runlevel. Se ejecuta con el parametro `stop`.
- **Numero** (01-99): Define el **orden** de ejecucion. Los numeros mas bajos se ejecutan primero.

> **Para el examen:** Los scripts S se ejecutan en orden ascendente (S01, S02, S03...) y los scripts K se ejecutan en orden ascendente antes que los S al cambiar de runlevel.

#### Cabeceras LSB (Linux Standard Base) en scripts de init

Los scripts de inicio en `/etc/init.d/` deben incluir un bloque de **cabeceras LSB** (Linux Standard Base) que define las dependencias y el comportamiento del script. Estas cabeceras son utilizadas por herramientas como `insserv` para determinar el orden correcto de arranque.

```bash
### BEGIN INIT INFO
# Provides:          apache2
# Required-Start:    $local_fs $remote_fs $network $syslog
# Required-Stop:     $local_fs $remote_fs $network $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Servidor web Apache
# Description:       Inicia el servidor web Apache 2
### END INIT INFO
```

| Cabecera | Descripcion |
|----------|-------------|
| `Provides` | Nombre del servicio que proporciona el script |
| `Required-Start` | Servicios o facilidades que deben estar iniciados **antes** de que este servicio arranque |
| `Required-Stop` | Servicios o facilidades que deben estar disponibles durante la detencion del servicio |
| `Default-Start` | Runlevels en los que el servicio debe **iniciarse** por defecto |
| `Default-Stop` | Runlevels en los que el servicio debe **detenerse** por defecto |
| `Short-Description` | Descripcion breve del servicio |
| `Description` | Descripcion completa del servicio |

**Facilidades especiales** (variables con `$`) que se pueden usar en `Required-Start` / `Required-Stop`:

| Facilidad | Significado |
|-----------|-------------|
| `$local_fs` | Sistemas de archivos locales montados |
| `$remote_fs` | Sistemas de archivos remotos montados |
| `$network` | Red basica disponible |
| `$syslog` | Sistema de registro de logs disponible |
| `$all` | Todos los demas scripts de inicio |

> **Para el examen:** Las cabeceras LSB son esenciales para que las herramientas de gestion de SysVinit calculen automaticamente el orden correcto de inicio y parada de los servicios.

### Upstart

**Upstart** fue un sistema de inicio desarrollado por **Canonical** (la empresa detras de Ubuntu) como reemplazo de SysVinit. Se utilizo principalmente en **Ubuntu** desde la version 6.10 (2006) hasta la version 14.10, cuando fue sustituido por systemd en Ubuntu 15.04.

**Caracteristicas principales:**
- Basado en **eventos** (event-driven): los servicios se inician o detienen en respuesta a eventos del sistema
- Podia iniciar servicios en **paralelo**, mejorando el tiempo de arranque
- Compatible con scripts de SysVinit (ejecutaba scripts de `/etc/init.d/`)
- Archivos de configuracion propios en `/etc/init/` (archivos `.conf`)

```bash
# Ejemplo de archivo de configuracion de Upstart: /etc/init/ssh.conf
description "OpenSSH server"
start on filesystem or runlevel [2345]
stop on runlevel [!2345]
respawn
exec /usr/sbin/sshd -D
```

**Comandos de Upstart:**
```bash
initctl list               # Listar servicios y su estado
initctl status ssh         # Estado de un servicio
start ssh                  # Iniciar un servicio
stop ssh                   # Detener un servicio
restart ssh                # Reiniciar un servicio
```

> **Para el examen:** Upstart ya no se utiliza en distribuciones principales, pero es importante saber que existio y fue el sistema de inicio de Ubuntu durante varios anos. Chromium OS tambien lo utilizo. Actualmente, systemd es el estandar en practicamente todas las distribuciones principales.

### Comandos de SysVinit para cambiar runlevel

```bash
# Ver el runlevel actual
runlevel
# Salida ejemplo: N 3  (N = runlevel anterior, 3 = runlevel actual)
# Si N aparece, significa que no hubo runlevel previo (arranque directo)

# Cambiar al runlevel 5 (entorno grafico)
init 5
# o
telinit 5

# Cambiar al modo monousuario
init 1
# o
telinit 1

# Apagar el sistema
init 0

# Reiniciar el sistema
init 6
```

> **Nota:** `telinit` es funcionalmente identico a `init` para cambiar runlevels. En muchos sistemas, `telinit` es un enlace simbolico a `init`.

---

## 2. Systemd y targets

### Que son los targets

En systemd, los **targets** (objetivos) reemplazan a los runlevels de SysVinit. Un target es una unidad (unit) que agrupa otros servicios y targets, definiendo un estado del sistema.

### Targets principales

| Target | Descripcion | Equivalente runlevel |
|--------|-------------|---------------------|
| `poweroff.target` | Apaga el sistema | Runlevel 0 |
| `rescue.target` | Modo de rescate (monousuario) | Runlevel 1 |
| `multi-user.target` | Multiusuario con red, sin entorno grafico | Runlevel 3 |
| `graphical.target` | Multiusuario con red y entorno grafico | Runlevel 5 |
| `reboot.target` | Reinicia el sistema | Runlevel 6 |
| `emergency.target` | Modo de emergencia (sistema minimo) | No tiene equivalente directo |

### Targets adicionales importantes

| Target | Descripcion |
|--------|-------------|
| `default.target` | Enlace simbolico al target por defecto |
| `network.target` | La red esta disponible |
| `network-online.target` | La red esta completamente configurada |
| `local-fs.target` | Sistemas de archivos locales montados |
| `remote-fs.target` | Sistemas de archivos remotos montados |
| `sound.target` | El sistema de sonido esta disponible |
| `hibernate.target` | Hibernar el sistema |
| `suspend.target` | Suspender el sistema |
| `halt.target` | Detener el sistema (sin apagar la alimentacion) |

### Estructura de archivos de systemd

| Directorio | Descripcion | Prioridad |
|------------|-------------|-----------|
| `/lib/systemd/system/` (o `/usr/lib/systemd/system/`) | Archivos de unidad proporcionados por los paquetes del sistema | Baja |
| `/etc/systemd/system/` | Archivos de unidad del administrador (personalizaciones) | **Alta** (sobreescribe los anteriores) |
| `/run/systemd/system/` | Archivos de unidad generados en tiempo de ejecucion | Media |

> **Para el examen:** Los archivos en `/etc/systemd/system/` tienen **prioridad** sobre los de `/lib/systemd/system/`. Para personalizar un servicio, se copian o crean archivos en `/etc/systemd/system/`.

### Tipos de unidades de systemd

| Tipo | Extension | Descripcion |
|------|-----------|-------------|
| Service | `.service` | Define un servicio del sistema |
| Target | `.target` | Agrupa unidades (equivalente a runlevel) |
| Mount | `.mount` | Define un punto de montaje |
| Socket | `.socket` | Define un socket para activacion bajo demanda |
| Timer | `.timer` | Equivalente a cron, programacion de tareas |
| Device | `.device` | Dispositivo del sistema |
| Path | `.path` | Monitoriza cambios en archivos/directorios |
| Automount | `.automount` | Montaje automatico |
| Swap | `.swap` | Espacio de intercambio |
| Slice | `.slice` | Grupo de recursos (cgroups) |
| Scope | `.scope` | Procesos externos gestionados por systemd |

---

## 3. Tabla de equivalencia: runlevels y targets

Esta tabla es **fundamental para el examen**:

| SysVinit Runlevel | Systemd Target | Descripcion |
|-------------------|---------------|-------------|
| 0 | `poweroff.target` | Apagado del sistema |
| 1 | `rescue.target` | Modo monousuario / rescate |
| 2 | `multi-user.target` (*) | Multiusuario sin red (varia) |
| 3 | `multi-user.target` | Multiusuario con red, modo texto |
| 4 | `multi-user.target` (*) | No definido / personalizable |
| 5 | `graphical.target` | Multiusuario con entorno grafico |
| 6 | `reboot.target` | Reinicio del sistema |

(*) En la practica, systemd no distingue entre runlevels 2, 3 y 4; todos se mapean a `multi-user.target`.

### Enlaces simbolicos de compatibilidad

systemd mantiene enlaces simbolicos de compatibilidad con runlevels:

```bash
# Estos enlaces existen para compatibilidad
runlevel0.target -> poweroff.target
runlevel1.target -> rescue.target
runlevel2.target -> multi-user.target
runlevel3.target -> multi-user.target
runlevel4.target -> multi-user.target
runlevel5.target -> graphical.target
runlevel6.target -> reboot.target
```

---

## 4. Gestion de servicios con systemctl

`systemctl` es la herramienta principal para gestionar servicios y targets en systemd.

### Gestionar el target por defecto

```bash
# Ver el target por defecto actual
systemctl get-default
# Ejemplo de salida: graphical.target

# Cambiar el target por defecto a modo texto
systemctl set-default multi-user.target

# Cambiar el target por defecto a modo grafico
systemctl set-default graphical.target
```

> **Para el examen:** `systemctl set-default` crea un enlace simbolico `/etc/systemd/system/default.target` que apunta al target deseado.

### Cambiar de target en tiempo real

```bash
# Cambiar al target de rescate (equivalente a init 1)
systemctl isolate rescue.target

# Cambiar al modo multiusuario (equivalente a init 3)
systemctl isolate multi-user.target

# Cambiar al modo grafico (equivalente a init 5)
systemctl isolate graphical.target
```

> **Nota:** El subcomando `isolate` detiene todos los servicios que no son necesarios para el target especificado e inicia los que faltan. Solo los targets que tienen `AllowIsolate=yes` pueden ser aislados.

### Gestionar servicios individuales

```bash
# Ver el estado de un servicio
systemctl status sshd.service

# Iniciar un servicio
systemctl start sshd.service

# Detener un servicio
systemctl stop sshd.service

# Reiniciar un servicio
systemctl restart sshd.service

# Recargar la configuracion de un servicio (sin detenerlo)
systemctl reload sshd.service

# Habilitar un servicio para que arranque automaticamente
systemctl enable sshd.service

# Deshabilitar un servicio del arranque automatico
systemctl disable sshd.service

# Verificar si un servicio esta habilitado
systemctl is-enabled sshd.service

# Verificar si un servicio esta activo (en ejecucion)
systemctl is-active sshd.service

# Enmascarar un servicio (impide su inicio por completo)
systemctl mask sshd.service

# Desenmascarar un servicio
systemctl unmask sshd.service
```

### Listar unidades

```bash
# Listar todas las unidades activas
systemctl list-units

# Listar solo servicios
systemctl list-units --type=service

# Listar todos los servicios (activos e inactivos)
systemctl list-units --type=service --all

# Listar solo targets
systemctl list-units --type=target

# Listar archivos de unidad instalados
systemctl list-unit-files

# Listar archivos de unidad de tipo servicio
systemctl list-unit-files --type=service
```

### Dependencias entre unidades

```bash
# Ver las dependencias de un target
systemctl list-dependencies multi-user.target

# Ver las dependencias inversas (quien depende de esta unidad)
systemctl list-dependencies --reverse sshd.service
```

---

## 5. Comandos de apagado y reinicio

### El comando shutdown

`shutdown` es el comando mas completo y seguro para apagar o reiniciar el sistema. Permite programar el apagado, notificar a los usuarios y cancelar un apagado programado.

```bash
# Apagar el sistema inmediatamente
shutdown -h now

# Apagar el sistema en 10 minutos
shutdown -h +10

# Apagar el sistema a una hora especifica
shutdown -h 23:00

# Reiniciar el sistema inmediatamente
shutdown -r now

# Reiniciar el sistema en 5 minutos con un mensaje
shutdown -r +5 "El sistema se reiniciara en 5 minutos para mantenimiento"

# Cancelar un apagado/reinicio programado
shutdown -c

# Cancelar con un mensaje explicativo
shutdown -c "Se ha cancelado el reinicio programado"

# Solo enviar un mensaje de advertencia (sin apagar)
shutdown -k +10 "ATENCION: El sistema se apagara en 10 minutos"
# La opcion -k (kick) solo envia el aviso, NO apaga realmente
```

**Opciones importantes de shutdown:**

| Opcion | Descripcion |
|--------|-------------|
| `-h` | Halt: apagar el sistema (equivale a poweroff) |
| `-r` | Reboot: reiniciar el sistema |
| `-c` | Cancel: cancelar un apagado programado |
| `-k` | Solo avisa a los usuarios, NO apaga |
| `now` | Ejecutar inmediatamente |
| `+minutos` | Programar en N minutos |
| `HH:MM` | Programar a una hora especifica |

### Otros comandos de apagado y reinicio

| Comando | Descripcion | Equivalencia en systemd |
|---------|-------------|------------------------|
| `shutdown -h now` | Apaga el sistema inmediatamente | `systemctl poweroff` |
| `shutdown -r now` | Reinicia el sistema inmediatamente | `systemctl reboot` |
| `poweroff` | Apaga el sistema | `systemctl poweroff` |
| `reboot` | Reinicia el sistema | `systemctl reboot` |
| `halt` | Detiene el sistema (sin apagar alimentacion) | `systemctl halt` |
| `init 0` | Apaga el sistema (SysVinit) | `systemctl poweroff` |
| `init 6` | Reinicia el sistema (SysVinit) | `systemctl reboot` |
| `telinit 0` | Apaga el sistema (SysVinit) | `systemctl poweroff` |
| `telinit 6` | Reinicia el sistema (SysVinit) | `systemctl reboot` |
| `systemctl poweroff` | Apaga el sistema (systemd) | - |
| `systemctl reboot` | Reinicia el sistema (systemd) | - |
| `systemctl halt` | Detiene el sistema (systemd) | - |
| `systemctl suspend` | Suspende el sistema (systemd) | - |
| `systemctl hibernate` | Hiberna el sistema (systemd) | - |

> **Para el examen:** `shutdown` es el metodo preferido porque permite programar el apagado, avisar a los usuarios y cancelar la operacion. Los comandos `poweroff`, `reboot` y `halt` son inmediatos y no avisan a los usuarios.

### Diferencia entre halt y poweroff

- **`halt`**: Detiene todos los procesos y el kernel, pero **no envia la senal de apagado** al hardware. La maquina se queda "colgada" (pantalla congelada). El usuario debe apagar fisicamente.
- **`poweroff`**: Detiene el sistema **y envia la senal ACPI** para apagar la alimentacion electrica del hardware.

---

## 6. El comando wall

`wall` (write all) envia un mensaje a todos los usuarios conectados al sistema. Es util para avisar de mantenimientos, reinicios u otras acciones que afecten a los usuarios.

```bash
# Enviar un mensaje a todos los usuarios
wall "El sistema se reiniciara en 15 minutos para mantenimiento"

# Enviar un mensaje desde un archivo
wall < /ruta/al/mensaje.txt

# Enviar un mensaje por pipe
echo "Atencion: mantenimiento programado" | wall
```

> **Nota:** `shutdown` con un tiempo de espera envia automaticamente mensajes tipo `wall` a los usuarios conectados. Pero `wall` se puede usar independientemente en cualquier momento.

### Ejemplo de uso combinado

```bash
# 1. Avisar a los usuarios
wall "ATENCION: El servidor se reiniciara en 30 minutos para actualizaciones"

# 2. Programar el reinicio
shutdown -r +30 "Reinicio programado para actualizaciones del sistema"

# 3. Si es necesario cancelar
shutdown -c
wall "El reinicio programado ha sido cancelado"
```

---

## 7. acpid: daemon de gestion de energia

### Que es acpid

**acpid** (Advanced Configuration and Power Interface Daemon) es un demonio que gestiona eventos de energia ACPI. ACPI es el estandar que permite al sistema operativo gestionar la alimentacion del hardware.

### Funciones de acpid

- Detecta eventos como:
  - Presionar el **boton de encendido** (power button)
  - Cerrar la **tapa del portatil** (lid close)
  - Conectar/desconectar el **cable de alimentacion** (AC adapter)
  - Presionar los **botones de suspension** o hibernacion
- Ejecuta acciones configuradas en respuesta a estos eventos.

### Archivos de configuracion

| Archivo / Directorio | Descripcion |
|----------------------|-------------|
| `/etc/acpi/` | Directorio principal de configuracion de acpid |
| `/etc/acpi/events/` | Reglas de eventos: que accion ejecutar ante cada evento |
| `/etc/acpi/actions/` | Scripts de acciones que se ejecutan en respuesta a eventos |
| `/proc/acpi/` | Interfaz del kernel para informacion ACPI (legacy) |
| `/sys/firmware/acpi/` | Interfaz moderna del kernel para ACPI |

### Ejemplo de regla de evento

```bash
# /etc/acpi/events/powerbtn
# Cuando se presiona el boton de encendido, ejecutar el script de apagado
event=button/power
action=/etc/acpi/actions/power.sh
```

### Gestion de acpid

```bash
# Ver el estado de acpid
systemctl status acpid

# Iniciar acpid
systemctl start acpid

# Habilitar acpid en el arranque
systemctl enable acpid

# Ver eventos ACPI en tiempo real
acpi_listen
```

> **Para el examen:** Es suficiente saber que acpid es el demonio que gestiona eventos de energia ACPI, como el boton de encendido y la tapa del portatil. No se requiere un conocimiento profundo de su configuracion.

---

## Resumen para el examen

1. **Runlevels de SysVinit:** 0 (apagado), 1 (monousuario), 2 (multi sin red), 3 (multi con red), 4 (personalizable), 5 (grafico), 6 (reinicio).
2. **Targets de systemd:** `poweroff.target` (0), `rescue.target` (1), `multi-user.target` (3), `graphical.target` (5), `reboot.target` (6).
3. **Configuracion SysVinit:** `/etc/inittab` (runlevel por defecto), `/etc/init.d/` (scripts), `/etc/rc[0-6].d/` (enlaces S/K).
4. **systemctl:** `get-default`, `set-default`, `isolate`, `start`, `stop`, `enable`, `disable`, `status`, `list-units`.
5. **Apagado:** `shutdown -h now`, `poweroff`, `init 0`, `systemctl poweroff`. **Reinicio:** `shutdown -r now`, `reboot`, `init 6`, `systemctl reboot`.
6. **wall:** Envia mensajes a todos los usuarios conectados. `shutdown` con tiempo envia avisos automaticamente.
7. **acpid:** Demonio que gestiona eventos de energia (boton de encendido, tapa del portatil, etc.).
8. **Cambiar runlevel/target:** `init N` / `telinit N` (SysVinit) o `systemctl isolate target` (systemd).
9. **Scripts S y K:** S = Start (iniciar servicio), K = Kill (detener servicio). El numero indica el orden.
10. **Prioridad de archivos systemd:** `/etc/systemd/system/` sobreescribe `/lib/systemd/system/`.
