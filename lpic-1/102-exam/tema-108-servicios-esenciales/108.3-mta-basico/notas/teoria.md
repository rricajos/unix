# 108.3 Fundamentos de MTA - Teoria

## Conceptos fundamentales del correo electronico

### Componentes del sistema de correo

| Componente | Nombre completo | Funcion | Ejemplos |
|-----------|----------------|---------|----------|
| **MUA** | Mail User Agent | Cliente de correo (leer/escribir) | Thunderbird, mutt, mail/mailx, Evolution |
| **MTA** | Mail Transfer Agent | Transfiere correo entre servidores | sendmail, postfix, exim |
| **MDA** | Mail Delivery Agent | Entrega correo al buzon local | procmail, maildrop, dovecot-lda |

### Flujo del correo
```
Remitente (MUA) --> MTA local --> MTA remoto --> MDA --> Buzon --> Destinatario (MUA)
```

1. El usuario escribe un correo con su **MUA**
2. El MUA entrega al **MTA** local (puerto 25 SMTP)
3. El MTA local envia al **MTA** del servidor destino
4. El MTA destino pasa el correo al **MDA**
5. El MDA deposita el correo en el buzon del usuario
6. El destinatario lee el correo con su **MUA**

### SMTP (Simple Mail Transfer Protocol)
- Protocolo estandar para envio de correo
- Puerto **25** (SMTP clasico)
- Puerto **587** (submission, con autenticacion)
- Puerto **465** (SMTPS, SMTP sobre SSL/TLS)

---

## MTAs principales

### sendmail
- MTA mas antiguo y historicamente el mas usado
- Configuracion compleja (`/etc/mail/sendmail.cf`)
- Todavia presente en muchos sistemas como compatible
- Todos los demas MTAs proporcionan un comando `sendmail` compatible

### Postfix
- MTA moderno, seguro y facil de configurar
- Creado por Wietse Venema como reemplazo de sendmail
- Configuracion principal: `/etc/postfix/main.cf`
- Parametros basicos de `main.cf`:

```
# Nombre del host
myhostname = mail.ejemplo.com

# Dominio
mydomain = ejemplo.com

# Origen del correo saliente
myorigin = $mydomain

# Interfaces en las que escuchar
inet_interfaces = all

# Destinos locales
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain

# Redes confiables
mynetworks = 127.0.0.0/8, 192.168.1.0/24

# Buzon del usuario
home_mailbox = Maildir/
```

### Exim
- MTA predeterminado en distribuciones Debian
- Muy configurable y flexible
- Configuracion: `/etc/exim4/`

> **Para el examen LPIC-1**: No se requiere configurar un servidor de correo completo. El foco esta en aliases, reenvio y comandos basicos.

---

## Comando `mail` / `mailx`

Utilidad de linea de comandos para enviar y leer correo.

### Enviar correo
```bash
# Forma interactiva
mail usuario@ejemplo.com
Subject: Asunto del mensaje
Cuerpo del mensaje aqui
.                            # Punto solo en una linea para terminar

# Forma no interactiva (pipe)
echo "Cuerpo del mensaje" | mail -s "Asunto" usuario@ejemplo.com

# Con archivo adjunto (usando mailx)
mail -s "Reporte" -a /tmp/reporte.txt usuario@ejemplo.com < /dev/null
```

### Leer correo
```bash
mail                    # Abrir buzon del usuario actual
```

Dentro de mail:
- Numero del mensaje para leerlo
- `d` para borrar
- `q` para salir guardando cambios
- `x` para salir sin cambios
- `h` para listar mensajes

---

## Aliases de correo: `/etc/aliases`

Los aliases permiten redirigir correo destinado a un usuario a otro usuario, multiples usuarios o un comando.

### Formato
```
alias: destino1, destino2, ...
```

### Ejemplo de `/etc/aliases`
```
# Aliases obligatorios
postmaster: root
mailer-daemon: postmaster

# Redirigir correo de root a un usuario real
root: admin

# Alias a multiples usuarios
webmaster: juan, maria

# Alias a una direccion externa
soporte: soporte@empresa.com

# Alias a un archivo (agregar correo)
registro: /var/log/correo-registro

# Alias a un comando (pipe)
tickets: |/usr/local/bin/procesar-ticket.sh

# Alias a un archivo include
desarrolladores: :include:/etc/mail/lista-devs
```

### Activar cambios
Despues de modificar `/etc/aliases`, se **debe** ejecutar:
```bash
newaliases
```

Este comando reconstruye la base de datos de aliases (normalmente `/etc/aliases.db`). Sin ejecutar `newaliases`, los cambios **no tendran efecto**.

> **Importante para el examen**: Siempre ejecutar `newaliases` despues de editar `/etc/aliases`.

---

## Redireccion personal: `~/.forward`

Cada usuario puede crear un archivo `~/.forward` en su directorio home para redirigir su correo sin necesidad de permisos de root.

### Formato
```
usuario@otro-servidor.com
```

### Ejemplos de `~/.forward`
```bash
# Redirigir todo el correo a otra direccion
usuario@gmail.com

# Redirigir y mantener copia local
\usuario, otrousuario@gmail.com

# Redirigir a multiples destinos
admin@empresa.com, backup@empresa.com
```

- La barra invertida `\usuario` evita la expansion recursiva del alias y entrega localmente
- Sin `\`, el correo solo se reenvia (no se guarda copia local)

---

## Comando `mailq`

Muestra la cola de correo pendiente de envio.

```bash
mailq                   # Ver cola de correo
```

Salida tipica:
```
-Queue ID-  --Size-- ----Arrival Time---- -Sender/Recipient-------
A1B2C3D4E5      1234 Mon Jan 15 14:30:00  usuario@ejemplo.com
      (host remoto no disponible)
                                           destino@otro.com
-- 1 Kbytes in 1 Request.
```

Equivalente en postfix:
```bash
postqueue -p            # Igual que mailq
postqueue -f            # Forzar reenvio de la cola
postsuper -d ALL        # Eliminar toda la cola
```

---

## Comando `sendmail` (interfaz compatible)

Todos los MTAs proporcionan un comando `sendmail` compatible en `/usr/sbin/sendmail` o `/usr/lib/sendmail`.

```bash
# Enviar correo
sendmail usuario@ejemplo.com < mensaje.txt

# Procesar la cola
sendmail -q

# Ver la cola (equivalente a mailq)
sendmail -bp
```

Opciones comunes:
| Opcion | Descripcion |
|--------|-------------|
| `-q` | Procesar la cola de correo |
| `-bp` | Mostrar la cola (como `mailq`) |
| `-bi` | Reconstruir aliases (como `newaliases`) |
| `-t` | Leer destinatarios del encabezado del mensaje |

---

## Buzones de correo

### Formatos de buzon
| Formato | Descripcion | Ubicacion tipica |
|---------|-------------|-----------------|
| **mbox** | Un archivo por usuario con todos los mensajes | `/var/spool/mail/usuario` o `/var/mail/usuario` |
| **Maildir** | Un directorio por usuario, un archivo por mensaje | `~/Maildir/` |

### Estructura de Maildir
```
~/Maildir/
    cur/        # Mensajes leidos
    new/        # Mensajes nuevos
    tmp/        # Mensajes en proceso de entrega
```

---

## Puntos clave para el examen

1. **MUA** = cliente, **MTA** = transferencia, **MDA** = entrega local
2. **SMTP** usa el puerto **25** (o 587 para submission)
3. **`/etc/aliases`** define aliases del sistema; despues de editarlo ejecutar **`newaliases`**
4. **`~/.forward`** permite redireccion personal sin ser root
5. **`mailq`** muestra la cola de correo pendiente
6. El comando **`sendmail`** esta disponible como interfaz compatible en todos los MTAs
7. **Postfix** se configura en `/etc/postfix/main.cf`
8. La barra invertida en `~/.forward` (`\usuario`) mantiene copia local
9. `sendmail -bi` equivale a `newaliases`
10. `sendmail -bp` equivale a `mailq`
