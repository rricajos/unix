# 108.3 Fundamentos de MTA - Ejercicios

## Ejercicio 1
¿Cual es la diferencia entre MUA, MTA y MDA? Da un ejemplo de cada uno.

<details><summary>Respuesta</summary>

- **MUA (Mail User Agent)**: Cliente de correo que usa el usuario para leer y escribir. Ejemplos: Thunderbird, mutt, mail/mailx.
- **MTA (Mail Transfer Agent)**: Transfiere correo entre servidores mediante SMTP. Ejemplos: sendmail, postfix, exim.
- **MDA (Mail Delivery Agent)**: Entrega el correo al buzon local del usuario. Ejemplos: procmail, maildrop, dovecot-lda.

Flujo: MUA -> MTA (local) -> MTA (remoto) -> MDA -> Buzon -> MUA (destinatario)

</details>

## Ejercicio 2
Has editado `/etc/aliases` para agregar `webmaster: juan, maria`. ¿Que comando debes ejecutar para que el cambio tenga efecto?

<details><summary>Respuesta</summary>

```bash
newaliases
```

Este comando reconstruye la base de datos de aliases (`/etc/aliases.db`). Sin ejecutarlo, los cambios en `/etc/aliases` **no tendran efecto**. Alternativamente se puede usar `sendmail -bi`.

</details>

## Ejercicio 3
¿Como configurarias tu correo personal para que se reenvie a `micuenta@gmail.com` manteniendo una copia local?

<details><summary>Respuesta</summary>

Crear el archivo `~/.forward` con el siguiente contenido:
```
\miusuario, micuenta@gmail.com
```

La barra invertida `\miusuario` indica que se debe mantener una copia local (evita la expansion recursiva del alias). Sin la barra invertida, el correo solo se reenviaria sin guardar copia local.

</details>

## Ejercicio 4
¿Que comando muestra la cola de correo pendiente de envio? Indica al menos dos formas de hacerlo.

<details><summary>Respuesta</summary>

```bash
mailq                # Forma estandar
sendmail -bp         # Equivalente usando sendmail
postqueue -p         # Especifico de Postfix
```

Las tres formas muestran los mensajes pendientes en la cola de correo, incluyendo ID, tamano, fecha y remitente/destinatario.

</details>

## Ejercicio 5
¿Cual es el puerto estandar de SMTP? ¿Que otros puertos se usan para correo?

<details><summary>Respuesta</summary>

- **Puerto 25**: SMTP clasico (transferencia entre servidores)
- **Puerto 587**: SMTP submission (envio de correo con autenticacion)
- **Puerto 465**: SMTPS (SMTP sobre SSL/TLS)

Para el examen, el mas importante es el **puerto 25** como puerto estandar de SMTP.

</details>

## Ejercicio 6
Escribe un ejemplo de `/etc/aliases` que: a) redirija el correo de root al usuario `admin`, b) cree un alias `equipo` que envie a tres usuarios, y c) cree un alias que pase el correo a un script.

<details><summary>Respuesta</summary>

```
# Redirigir correo de root
root: admin

# Alias a multiples usuarios
equipo: juan, maria, pedro

# Alias a un script (pipe)
alertas: |/usr/local/bin/procesar-alerta.sh
```

Despues de guardar, ejecutar `newaliases` para aplicar los cambios.

</details>

## Ejercicio 7
¿Cual es la diferencia entre los formatos de buzon `mbox` y `Maildir`?

<details><summary>Respuesta</summary>

- **mbox**: Almacena todos los mensajes de un usuario en un **unico archivo** (tipicamente `/var/spool/mail/usuario` o `/var/mail/usuario`). Mas simple pero problemas de bloqueo con acceso concurrente.

- **Maildir**: Usa un **directorio** con tres subdirectorios (`new/`, `cur/`, `tmp/`), con un archivo individual por mensaje. Mejor rendimiento, sin problemas de bloqueo y mas robusto ante fallos.

</details>

## Ejercicio 8
¿Como enviarias un correo desde la linea de comandos a `admin@ejemplo.com` con asunto "Reporte diario" y el contenido del archivo `/tmp/reporte.txt`?

<details><summary>Respuesta</summary>

```bash
mail -s "Reporte diario" admin@ejemplo.com < /tmp/reporte.txt
```

Alternativa con pipe:
```bash
cat /tmp/reporte.txt | mail -s "Reporte diario" admin@ejemplo.com
```

Alternativa con sendmail:
```bash
sendmail admin@ejemplo.com < /tmp/reporte.txt
```

</details>
