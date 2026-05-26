---
title: "Ejercicios: Niveles de Ejecucion y Targets de Systemd (101.3)"
tags:
  - lpic-1
  - examen-101
  - tema-101
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "101"
subtema: "101.3"
---

# Ejercicios: Niveles de Ejecucion y Targets de Systemd (101.3)

Preguntas tipo examen LPIC-1 sobre niveles de ejecucion (runlevels), targets de systemd y gestion del estado del sistema. Intenta responder cada pregunta antes de revelar la respuesta.

---

## Pregunta 1: Equivalencia de runlevels y targets

**Cual de los siguientes targets de systemd es equivalente al runlevel 3 de SysVinit?**

a) `graphical.target`
b) `rescue.target`
c) `multi-user.target`
d) `network.target`

<details>
<summary>Respuesta</summary>

**c) `multi-user.target`**

Tabla de equivalencia:

| Runlevel | Target de systemd |
|----------|------------------|
| 0 | `poweroff.target` |
| 1 | `rescue.target` |
| 3 | `multi-user.target` |
| 5 | `graphical.target` |
| 6 | `reboot.target` |

El runlevel 3 corresponde al modo multiusuario con red pero sin entorno grafico, que se mapea a `multi-user.target`. La opcion (a) `graphical.target` corresponde al runlevel 5. La opcion (b) `rescue.target` corresponde al runlevel 1. La opcion (d) `network.target` no es un target de equivalencia con runlevels, sino un target auxiliar que indica que la red esta disponible.
</details>

---

## Pregunta 2: Cambiar el target por defecto

**Un administrador quiere que un servidor Linux arranque siempre en modo texto (sin entorno grafico). Cual es el comando correcto?**

a) `systemctl isolate multi-user.target`
b) `systemctl set-default multi-user.target`
c) `systemctl enable multi-user.target`
d) `systemctl start multi-user.target`

<details>
<summary>Respuesta</summary>

**b) `systemctl set-default multi-user.target`**

Explicacion de cada opcion:
- **b) `systemctl set-default`**: Establece el target **por defecto** de forma permanente. Crea un enlace simbolico `/etc/systemd/system/default.target` que apunta a `multi-user.target`. Este es el comando correcto para cambiar el target de arranque.
- **a) `systemctl isolate`**: Cambia al target indicado **inmediatamente**, pero NO cambia el target por defecto. Al reiniciar, el sistema volvera al target anterior.
- **c) `systemctl enable`**: Se usa para habilitar servicios en el arranque, no para establecer el target por defecto.
- **d) `systemctl start`**: Inicia un servicio o target, pero no cambia la configuracion por defecto.
</details>

---

## Pregunta 3: El archivo /etc/inittab

**En un sistema con SysVinit, que linea en `/etc/inittab` establece el runlevel por defecto a 5 (modo grafico)?**

a) `id:5:default:`
b) `id:5:initdefault:`
c) `default:5:start:`
d) `runlevel:5:boot:`

<details>
<summary>Respuesta</summary>

**b) `id:5:initdefault:`**

El formato de las lineas en `/etc/inittab` es:
```
id:runlevels:accion:proceso
```

La accion `initdefault` especifica el runlevel por defecto del sistema. No necesita un proceso asociado (el campo proceso queda vacio). La linea correcta es:
```
id:5:initdefault:
```

Las opciones (a), (c) y (d) usan acciones que no existen en la sintaxis de `/etc/inittab`. Las acciones validas incluyen: `initdefault`, `sysinit`, `wait`, `respawn`, `once`, `ctrlaltdel`, entre otras.

> **Nota:** En sistemas con systemd, `/etc/inittab` no se utiliza. Se usa `systemctl set-default` en su lugar.
</details>

---

## Pregunta 4: Comandos de apagado

**Cual de los siguientes comandos programa un reinicio del sistema en 10 minutos y envia un mensaje de aviso a los usuarios?**

a) `reboot +10 "Sistema se reinicia"`
b) `shutdown -r +10 "Sistema se reinicia para mantenimiento"`
c) `systemctl reboot --delay=10m "Sistema se reinicia"`
d) `init 6 --timer 10`

<details>
<summary>Respuesta</summary>

**b) `shutdown -r +10 "Sistema se reinicia para mantenimiento"`**

El comando `shutdown` es el unico de las opciones que permite:
- **Programar** un reinicio en el futuro con `+minutos` o `HH:MM`
- **Enviar un mensaje** a todos los usuarios conectados
- **Cancelar** la operacion con `shutdown -c`

Opciones de `shutdown`:
- `-r`: Reiniciar (reboot)
- `-h`: Apagar (halt/poweroff)
- `-c`: Cancelar un apagado programado
- `-k`: Solo avisa, no apaga realmente
- `+N`: En N minutos
- `now`: Inmediatamente

Las opciones (a), (c) y (d) no son sintaxis validas. `reboot` y `init 6` se ejecutan inmediatamente sin opcion de programar un retraso.
</details>

---

## Pregunta 5: Scripts de inicio SysVinit

**En el directorio `/etc/rc3.d/`, que significan los prefijos "S" y "K" en los nombres de los enlaces simbolicos?**

a) S = System, K = Kernel
b) S = Start (iniciar el servicio), K = Kill (detener el servicio)
c) S = Service, K = Keep
d) S = Startup, K = Keepalive

<details>
<summary>Respuesta</summary>

**b) S = Start (iniciar el servicio), K = Kill (detener el servicio)**

En los directorios `/etc/rc[0-6].d/`, los enlaces simbolicos siguen la convencion:
- **S** (Start): El servicio se **inicia** al entrar en ese runlevel. El script se ejecuta con el parametro `start`.
- **K** (Kill): El servicio se **detiene** al entrar en ese runlevel. El script se ejecuta con el parametro `stop`.
- El **numero** despues de S o K (01-99) determina el **orden de ejecucion**. Numeros mas bajos se ejecutan primero.

Ejemplo:
```
S01networking  -> Se inicia primero (prioridad 01)
S20ssh         -> Se inicia despues (prioridad 20)
K80apache2     -> Se detiene con prioridad 80
```

Al cambiar de runlevel, primero se ejecutan todos los scripts K (detener) y luego todos los scripts S (iniciar), ambos en orden numerico ascendente.
</details>

---

## Pregunta 6: systemctl isolate

**Que hace el comando `systemctl isolate rescue.target`?**

a) Establece `rescue.target` como el target por defecto para el proximo arranque
b) Cambia inmediatamente al target de rescate, deteniendo todos los servicios que no pertenecen a ese target
c) Crea una copia de seguridad del sistema antes de entrar en modo rescate
d) Muestra las dependencias del target de rescate

<details>
<summary>Respuesta</summary>

**b) Cambia inmediatamente al target de rescate, deteniendo todos los servicios que no pertenecen a ese target**

El subcomando `isolate` de systemctl:
- Cambia al target especificado **inmediatamente**.
- **Detiene** todos los servicios y unidades que **no** son necesarios para el target destino.
- **Inicia** todos los servicios que son necesarios para el target destino.
- Es equivalente a cambiar de runlevel con `init N` o `telinit N` en SysVinit.
- **NO** cambia el target por defecto. Al reiniciar, el sistema arrancara en el target configurado por defecto.

Solo los targets que tienen la propiedad `AllowIsolate=yes` pueden ser aislados. Los targets principales (`poweroff`, `rescue`, `multi-user`, `graphical`, `reboot`) tienen esta propiedad habilitada.

Para cambiar el target por defecto, se usa `systemctl set-default`. Para ver dependencias, se usa `systemctl list-dependencies`.
</details>

---

## Pregunta 7: Comando wall

**Cual es el proposito del comando `wall` en Linux?**

a) Instalar un firewall en el sistema
b) Enviar un mensaje a todos los usuarios conectados al sistema
c) Mostrar los muros de texto del sistema de archivos
d) Cambiar los permisos de escritura en todo el sistema

<details>
<summary>Respuesta</summary>

**b) Enviar un mensaje a todos los usuarios conectados al sistema**

`wall` (write all) envia un mensaje a las terminales de **todos los usuarios** que estan conectados al sistema. Es especialmente util para:
- Avisar a los usuarios antes de un apagado o reinicio programado.
- Comunicar informacion importante sobre mantenimiento del sistema.
- Notificar sobre cambios de configuracion que afecten a los usuarios.

Ejemplos de uso:
```bash
wall "El sistema se apagara en 15 minutos"
wall < /tmp/mensaje.txt
echo "Mantenimiento urgente" | wall
```

> **Nota:** El comando `shutdown` con un tiempo de espera (por ejemplo, `shutdown -r +10 "mensaje"`) envia automaticamente mensajes a todos los usuarios, similar a `wall`.
</details>

---

## Pregunta 8: Diferencia entre halt y poweroff

**Cual es la diferencia principal entre los comandos `halt` y `poweroff`?**

a) `halt` reinicia el sistema, `poweroff` lo apaga
b) `halt` detiene el sistema sin apagar la alimentacion, `poweroff` detiene el sistema y envia la senal de apagado al hardware
c) `halt` es para SysVinit y `poweroff` es para systemd
d) No hay diferencia, son sinonimos exactos

<details>
<summary>Respuesta</summary>

**b) `halt` detiene el sistema sin apagar la alimentacion, `poweroff` detiene el sistema y envia la senal de apagado al hardware**

Diferencias:
- **`halt`**: Detiene todos los procesos y el kernel, pero **no envia la senal ACPI** para apagar la alimentacion electrica. El hardware se queda encendido con el sistema detenido. El usuario debe apagar fisicamente la maquina.
- **`poweroff`**: Detiene todos los procesos, el kernel **y envia la senal ACPI** al hardware para que se apague la alimentacion electrica. La maquina se apaga completamente.

En la practica, en muchos sistemas modernos, `halt` se comporta igual que `poweroff` porque detecta la capacidad ACPI. Sin embargo, para el examen es importante conocer la diferencia conceptual.

Equivalencias en systemd:
- `halt` = `systemctl halt`
- `poweroff` = `systemctl poweroff`
</details>

---

## Pregunta 9: Gestion de servicios con systemctl

**Un administrador quiere que el servicio `nginx` se inicie automaticamente cada vez que el sistema arranque, y ademas quiere iniciarlo inmediatamente. Cuales son los comandos correctos?**

a) `systemctl start nginx && systemctl default nginx`
b) `systemctl enable nginx && systemctl start nginx`
c) `systemctl activate nginx`
d) `systemctl auto nginx && systemctl run nginx`

<details>
<summary>Respuesta</summary>

**b) `systemctl enable nginx && systemctl start nginx`**

Explicacion de los subcomandos de systemctl:
- **`enable`**: Configura el servicio para que se **inicie automaticamente** en el arranque. Crea los enlaces simbolicos necesarios en el directorio del target correspondiente. Pero **no** inicia el servicio inmediatamente.
- **`start`**: **Inicia** el servicio inmediatamente, pero **no** lo configura para arranque automatico.
- Se necesitan ambos comandos para lograr los dos objetivos.

Tambien existe un atajo que combina ambas acciones:
```bash
systemctl enable --now nginx.service
```
La opcion `--now` hace que `enable` tambien inicie el servicio inmediatamente.

Las opciones (a), (c) y (d) usan subcomandos que no existen en systemctl (`default`, `activate`, `auto`, `run`).
</details>

---

## Pregunta 10: acpid

**Cual es la funcion principal del demonio acpid?**

a) Gestionar las actualizaciones automaticas del sistema
b) Controlar el acceso de usuarios al sistema
c) Gestionar eventos de energia como el boton de encendido y la tapa del portatil
d) Monitorizar el rendimiento de la CPU

<details>
<summary>Respuesta</summary>

**c) Gestionar eventos de energia como el boton de encendido y la tapa del portatil**

**acpid** (Advanced Configuration and Power Interface Daemon) es un demonio que escucha y responde a eventos ACPI del hardware. Eventos que gestiona:
- Presionar el **boton de encendido** (power button)
- **Cerrar o abrir la tapa** del portatil (lid switch)
- Conectar o desconectar el **adaptador de corriente** (AC adapter)
- Presionar botones de **suspension** o **hibernacion**
- Eventos de **bateria** (nivel bajo, carga completa)

Los archivos de configuracion estan en:
- `/etc/acpi/events/` - Reglas que asocian eventos con acciones
- `/etc/acpi/actions/` - Scripts que se ejecutan en respuesta a los eventos

Ejemplo de regla:
```bash
# /etc/acpi/events/powerbtn
event=button/power
action=/etc/acpi/actions/power.sh
```

Para el examen LPIC-1, es suficiente saber que acpid gestiona eventos de energia ACPI. No se requiere conocimiento profundo de su configuracion.
</details>
