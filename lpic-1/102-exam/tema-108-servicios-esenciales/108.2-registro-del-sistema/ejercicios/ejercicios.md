# 108.2 Registro del sistema - Ejercicios

## Ejercicio 1
¿Que significa la regla `mail.warning /var/log/mail.warn` en rsyslog? ¿Registraria un mensaje con prioridad `info` de la facility `mail`?

<details><summary>Respuesta</summary>

Esta regla envia todos los mensajes de la facility `mail` con prioridad `warning` **y todas las prioridades superiores** (warning, err, crit, alert, emerg) al archivo `/var/log/mail.warn`.

**No** registraria un mensaje con prioridad `info` porque `info` tiene menor severidad que `warning`. Para registrar solo la prioridad exacta se usaria `mail.=warning`.

</details>

## Ejercicio 2
¿Cual es el comando para ver los logs del servicio `sshd` desde hace 2 horas usando journalctl?

<details><summary>Respuesta</summary>

```bash
journalctl -u sshd --since "2 hours ago"
```

Se puede combinar con otras opciones:
```bash
journalctl -u sshd --since "2 hours ago" -p err    # Solo errores y superiores
journalctl -u sshd --since "2 hours ago" -f         # Seguir en tiempo real
```

</details>

## Ejercicio 3
Enumera las 8 prioridades de syslog en orden de mayor a menor severidad.

<details><summary>Respuesta</summary>

1. `emerg` (0) - Sistema inutilizable
2. `alert` (1) - Accion inmediata necesaria
3. `crit` (2) - Condicion critica
4. `err` (3) - Error
5. `warning` (4) - Advertencia
6. `notice` (5) - Normal pero significativo
7. `info` (6) - Informativo
8. `debug` (7) - Depuracion

</details>

## Ejercicio 4
¿Como enviar un mensaje personalizado a syslog con facility `local0` y prioridad `info` desde un script bash?

<details><summary>Respuesta</summary>

```bash
logger -p local0.info -t miscript "Mensaje desde mi script"
```

- `-p local0.info` especifica facility y prioridad
- `-t miscript` agrega una etiqueta al mensaje
- El mensaje se registrara segun las reglas configuradas en rsyslog para `local0.info`

</details>

## Ejercicio 5
¿Cual es la diferencia entre `/var/log/wtmp` y `/var/log/btmp`? ¿Como se leen?

<details><summary>Respuesta</summary>

- **`/var/log/wtmp`**: Registra los **logins exitosos** del sistema. Se lee con el comando `last`.
- **`/var/log/btmp`**: Registra los **intentos de login fallidos**. Se lee con el comando `lastb`.

Ambos son archivos **binarios**, no se pueden leer con `cat` o `less`. Se necesitan los comandos especializados.

</details>

## Ejercicio 6
En logrotate, ¿que diferencia hay entre `compress` y `delaycompress`? ¿Para que sirve `copytruncate`?

<details><summary>Respuesta</summary>

- **`compress`**: Comprime los archivos rotados inmediatamente (normalmente con gzip).
- **`delaycompress`**: Retrasa la compresion hasta la **siguiente** rotacion. Util porque algunos programas pueden seguir escribiendo en el archivo recien rotado.
- **`copytruncate`**: En lugar de mover el archivo y crear uno nuevo, **copia** el contenido al archivo rotado y luego **trunca** el original a cero. Util para aplicaciones que mantienen el archivo abierto y no pueden ser senalizadas para reabrir.

</details>

## Ejercicio 7
¿Como limitar el espacio en disco del journal de systemd a un maximo de 200MB? Indica tanto el metodo por comando como por configuracion.

<details><summary>Respuesta</summary>

**Por comando** (limpieza inmediata):
```bash
journalctl --vacuum-size=200M
```

**Por configuracion** (limite permanente) en `/etc/systemd/journald.conf`:
```ini
[Journal]
SystemMaxUse=200M
```

Luego reiniciar el servicio:
```bash
systemctl restart systemd-journald
```

Tambien se puede limitar por tiempo: `journalctl --vacuum-time=2weeks`

</details>

## Ejercicio 8
En la configuracion de rsyslog, ¿que diferencia hay entre `*.* @192.168.1.100:514` y `*.* @@192.168.1.100:514`?

<details><summary>Respuesta</summary>

- `@192.168.1.100:514` - Envia los logs al servidor remoto usando **UDP** (un solo `@`)
- `@@192.168.1.100:514` - Envia los logs al servidor remoto usando **TCP** (doble `@@`)

TCP es mas fiable porque garantiza la entrega, pero genera mas overhead. UDP es mas rapido pero puede perder mensajes.

</details>
