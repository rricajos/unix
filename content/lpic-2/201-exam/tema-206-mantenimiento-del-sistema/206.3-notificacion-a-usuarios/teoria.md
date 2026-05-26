---
title: "206.3 - Notificacion a usuarios"
tags: [lpic-2, examen-201, tema-206, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.3"
---

# 206.3 - Notificacion a usuarios

## Introduccion

La comunicacion con los usuarios del sistema es una tarea fundamental del administrador. Ya sea para notificar un mantenimiento programado, advertir sobre politicas de uso o enviar mensajes urgentes, Linux proporciona varias herramientas y mecanismos para la notificacion a usuarios.

Este subtema tiene un **peso de 1** en el examen LPIC-2 201, lo que indica que es un tema breve pero importante.

## Mensajes de bienvenida y banners

### /etc/motd - Mensaje del dia

El archivo `/etc/motd` (Message of the Day) muestra un mensaje a todos los usuarios despues de un inicio de sesion exitoso.

```bash
# Editar el mensaje del dia
sudo nano /etc/motd
```

Contenido de ejemplo:

```
=============================================
  Servidor de produccion - empresa.com
  Mantenimiento programado: Sabado 3:00 AM
  Contacto admin: admin@empresa.com
=============================================
```

En muchas distribuciones modernas, el archivo `/etc/motd` se genera dinamicamente. En Ubuntu, por ejemplo, se usan scripts en `/etc/update-motd.d/`:

```bash
# Listar scripts que generan el motd
ls /etc/update-motd.d/
# 00-header  10-help-text  50-motd-news  90-updates-available

# Deshabilitar un componente del motd dinamico
sudo chmod -x /etc/update-motd.d/50-motd-news
```

> **Para el examen:** `/etc/motd` se muestra despues del login exitoso. No confundir con `/etc/issue` que se muestra antes del login.

### /etc/issue - Banner antes del login local

El archivo `/etc/issue` muestra un mensaje en la consola local **antes** de que el usuario introduzca su nombre de usuario.

```bash
sudo nano /etc/issue
```

Contenido de ejemplo:

```
Servidor Linux \n - \l
Acceso restringido. Solo personal autorizado.
```

#### Secuencias de escape de /etc/issue

| Secuencia | Descripcion |
|-----------|-------------|
| `\d` | Fecha actual |
| `\t` | Hora actual |
| `\n` | Nombre de host (hostname) |
| `\l` | Nombre de la terminal (tty) |
| `\s` | Nombre del sistema operativo |
| `\r` | Version del kernel |
| `\m` | Arquitectura de la maquina |
| `\o` | Nombre de dominio |
| `\U` | Numero de usuarios conectados |

```
# Ejemplo con secuencias de escape
Sistema: \s \r (\m)
Hostname: \n.\o
Terminal: \l
Fecha: \d \t
Usuarios conectados: \U
```

### /etc/issue.net - Banner antes del login remoto

El archivo `/etc/issue.net` es la version de `/etc/issue` para conexiones remotas (por ejemplo, SSH o Telnet).

```bash
sudo nano /etc/issue.net
```

**Importante:** Para que SSH muestre el contenido de `/etc/issue.net`, se debe configurar en `/etc/ssh/sshd_config`:

```bash
# En /etc/ssh/sshd_config
Banner /etc/issue.net
```

```bash
# Reiniciar SSH despues de modificar la configuracion
sudo systemctl restart sshd
```

> **Para el examen:** `/etc/issue` es para consolas locales, `/etc/issue.net` es para conexiones remotas. Las secuencias de escape (`\n`, `\l`, etc.) generalmente solo funcionan en `/etc/issue`, no en `/etc/issue.net`.

### Avisos legales en banners

Es una buena practica incluir avisos legales en los banners de login:

```
*********************************************************
AVISO: Este sistema es propiedad de Empresa S.A.
El acceso no autorizado esta prohibido y sera
perseguido conforme a la legislacion vigente.
Todas las actividades son monitorizadas y registradas.
*********************************************************
```

> **Para el examen:** Los banners legales son importantes por razones de cumplimiento normativo. Pueden ser necesarios para que acciones legales contra accesos no autorizados sean validas.

## Envio de mensajes a usuarios conectados

### wall - Escribir a todos los usuarios

El comando `wall` (Write to ALL) envia un mensaje a todas las terminales de todos los usuarios conectados.

```bash
# Enviar un mensaje directamente
wall "El servidor se reiniciara en 10 minutos. Guarden su trabajo."

# Enviar un mensaje desde un archivo
wall < /etc/mensaje-mantenimiento.txt

# Enviar un mensaje con heredoc
wall << EOF
AVISO DE MANTENIMIENTO
El sistema se reiniciara a las 23:00
para aplicar actualizaciones de seguridad.
Por favor, guarden su trabajo.
EOF
```

El mensaje aparece en la terminal de cada usuario con un formato como:

```
Broadcast message from root@servidor (pts/0) (Mon Jan 15 14:30:00 2024):

El servidor se reiniciara en 10 minutos. Guarden su trabajo.
```

### write - Escribir a un usuario especifico

El comando `write` permite enviar un mensaje a un usuario concreto en una terminal especifica.

```bash
# Enviar mensaje a un usuario
write usuario

# Enviar a un usuario en una terminal especifica
write usuario pts/2

# El mensaje se escribe linea por linea y se termina con Ctrl+D
```

### mesg - Controlar recepcion de mensajes

El comando `mesg` permite a un usuario controlar si puede recibir mensajes de `write` y `wall`.

```bash
# Ver el estado actual
mesg
# is y  (mensajes habilitados)
# is n  (mensajes deshabilitados)

# Deshabilitar recepcion de mensajes
mesg n

# Habilitar recepcion de mensajes
mesg y
```

> **Para el examen:** `mesg n` bloquea mensajes de `write` pero generalmente NO bloquea mensajes de `wall` enviados por root. Solo root puede enviar mensajes a usuarios que tengan `mesg n`.

## Mensajes durante el apagado del sistema

### shutdown con mensaje

El comando `shutdown` puede incluir un mensaje que se envia a todos los usuarios conectados:

```bash
# Apagar en 10 minutos con mensaje
shutdown -h +10 "El servidor se apagara en 10 minutos por mantenimiento."

# Reiniciar a una hora especifica con mensaje
shutdown -r 23:00 "Reinicio programado a las 23:00 para actualizaciones."

# Cancelar un shutdown programado
shutdown -c "El reinicio programado ha sido cancelado."

# Apagar inmediatamente con mensaje
shutdown -h now "Apagado de emergencia."
```

El mensaje de shutdown se envia automaticamente mediante `wall` a todos los usuarios conectados.

> **Para el examen:** `shutdown` envia mensajes automaticamente a los usuarios. La opcion `-c` cancela un apagado programado y puede incluir un mensaje explicativo.

## systemd-ask-password

`systemd-ask-password` es una herramienta de systemd para solicitar contrasenas de forma segura al usuario, tipicamente durante el arranque del sistema (por ejemplo, para desbloquear particiones LUKS).

```bash
# Solicitar una contrasena en la consola
systemd-ask-password "Introduce la contrasena de descifrado:"

# Solicitar contrasena con timeout
systemd-ask-password --timeout=60 "Contrasena:"

# Listar solicitudes de contrasena pendientes
systemd-ask-password --list
```

Esta herramienta interactua con el sistema de agentes de contrasena de systemd:

- **Plymouth**: Muestra la solicitud en la pantalla de arranque grafica
- **Console**: Muestra la solicitud en la consola de texto
- **Wall**: Envia la solicitud como mensaje wall a los usuarios

```bash
# Ver las solicitudes de contrasena pendientes en el directorio de systemd
ls /run/systemd/ask-password/
```

> **Para el examen:** `systemd-ask-password` se usa para solicitar contrasenas durante el arranque, como claves de descifrado LUKS. No es una herramienta de notificacion general, sino de interaccion segura con el usuario.

## Resumen de archivos y comandos

| Mecanismo | Momento | Alcance |
|-----------|---------|---------|
| `/etc/issue` | Antes del login local | Todos los usuarios en consola local |
| `/etc/issue.net` | Antes del login remoto | Usuarios que conectan por SSH/Telnet |
| `/etc/motd` | Despues del login exitoso | Todos los usuarios autenticados |
| `wall` | En cualquier momento | Todos los usuarios conectados |
| `write` | En cualquier momento | Un usuario especifico |
| `shutdown` | Al programar un apagado | Todos los usuarios conectados |
| `systemd-ask-password` | Arranque del sistema | Consola/Plymouth |

## Buenas practicas

- **Mantener los mensajes breves y claros**: Los usuarios tienden a ignorar mensajes largos
- **Incluir informacion temporal**: Indicar cuando ocurrira el evento y su duracion estimada
- **Avisar con anticipacion suficiente**: Enviar notificaciones con tiempo para que los usuarios guarden su trabajo
- **Usar banners legales**: Proteger legalmente a la organizacion con avisos en `/etc/issue` y `/etc/issue.net`
- **Mantener `/etc/motd` actualizado**: Informacion desactualizada reduce la confianza en las comunicaciones del sistema
- **Documentar los procedimientos**: Tener scripts estandarizados para notificaciones de mantenimiento
