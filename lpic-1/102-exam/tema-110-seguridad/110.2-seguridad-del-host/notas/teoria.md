# 110.2 Configurar la seguridad del host - Teoria

## Shadow passwords

### El problema original
Historicamente, las contrasenas encriptadas se almacenaban en `/etc/passwd`, que es legible por todos los usuarios. Esto permitia ataques de fuerza bruta offline.

### La solucion: shadow passwords
Las contrasenas encriptadas se mueven a `/etc/shadow`, que solo es legible por root.

### `/etc/passwd`
Formato (7 campos separados por `:`):
```
usuario:x:UID:GID:comentario:home:shell
```

```
root:x:0:0:root:/root:/bin/bash
juan:x:1000:1000:Juan Garcia:/home/juan:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
```

- La `x` en el campo de contrasena indica que esta en `/etc/shadow`
- Permisos: `644` (legible por todos)

### `/etc/shadow`
Formato (9 campos separados por `:`):
```
usuario:hash:lastchanged:min:max:warn:inactive:expire:reserved
```

```
root:$6$sal$hash...:19372:0:99999:7:::
juan:$6$sal$hash...:19372:7:90:14:30:19723:
daemon:*:19372:0:99999:7:::
```

| Campo | Descripcion |
|-------|-------------|
| usuario | Nombre de usuario |
| hash | Contrasena encriptada ($tipo$sal$hash) |
| lastchanged | Dias desde epoch del ultimo cambio |
| min | Dias minimos entre cambios |
| max | Dias maximos de validez |
| warn | Dias de aviso antes de expiracion |
| inactive | Dias de gracia tras expiracion |
| expire | Fecha de expiracion de la cuenta (dias desde epoch) |
| reserved | Reservado |

#### Valores especiales del campo hash
| Valor | Significado |
|-------|-------------|
| `$6$...` | Contrasena con SHA-512 |
| `$5$...` | Contrasena con SHA-256 |
| `$1$...` | Contrasena con MD5 (inseguro) |
| `!` o `!!` | Cuenta bloqueada |
| `*` | Cuenta sin contrasena (login deshabilitado) |
| (vacio) | Sin contrasena (login sin contrasena) |

- Permisos: `640` o `000` (solo root puede leer)

### Comandos relacionados
```bash
pwconv              # Convertir a shadow passwords (crear /etc/shadow)
pwunconv            # Revertir shadow passwords (volver a /etc/passwd)
grpconv             # Shadow para grupos (/etc/gshadow)
grpunconv           # Revertir shadow de grupos
```

---

## Deshabilitar servicios innecesarios

### Principio de seguridad
**Solo deben estar activos los servicios estrictamente necesarios**. Cada servicio en ejecucion es una potencial superficie de ataque.

### Usando systemctl
```bash
# Listar servicios activos
systemctl list-units --type=service --state=running

# Detener un servicio
systemctl stop servicio

# Deshabilitar (no inicia al arrancar)
systemctl disable servicio

# Detener y deshabilitar
systemctl stop servicio && systemctl disable servicio

# Enmascarar (impedir que se inicie de cualquier forma)
systemctl mask servicio

# Desenmascarar
systemctl unmask servicio

# Ver si un servicio esta habilitado
systemctl is-enabled servicio
```

### Servicios comunes a considerar deshabilitar
- `cups` (si no se necesita impresion)
- `avahi-daemon` (descubrimiento de red mDNS)
- `bluetooth`
- `rpcbind` (si no se usa NFS)
- `vsftpd` (FTP si no es necesario)
- `telnet` (inseguro, usar SSH)

---

## inetd y xinetd (super-demonios)

### Concepto
En lugar de tener cada servicio escuchando permanentemente, un "super-demonio" escucha en multiples puertos y lanza el servicio correspondiente solo cuando llega una conexion.

### inetd (Internet daemon - clasico)

#### `/etc/inetd.conf`
```
# servicio  tipo_socket  protocolo  flags  usuario  programa  argumentos
ftp     stream  tcp  nowait  root  /usr/sbin/in.ftpd  in.ftpd
telnet  stream  tcp  nowait  root  /usr/sbin/in.telnetd  in.telnetd
```

Para deshabilitar un servicio: **comentar la linea** con `#`
```
# ftp     stream  tcp  nowait  root  /usr/sbin/in.ftpd  in.ftpd
```

### xinetd (Extended Internet daemon)

Reemplazo mas moderno y flexible de inetd.

#### `/etc/xinetd.conf` (configuracion global)
```
defaults
{
    instances       = 60
    log_type        = SYSLOG authpriv
    log_on_success  = HOST PID
    log_on_failure  = HOST
    cps             = 25 30
}

includedir /etc/xinetd.d
```

#### `/etc/xinetd.d/` (un archivo por servicio)
Ejemplo `/etc/xinetd.d/telnet`:
```
service telnet
{
    flags           = REUSE
    socket_type     = stream
    wait            = no
    user            = root
    server          = /usr/sbin/in.telnetd
    log_on_failure  += USERID
    disable         = yes        # Servicio deshabilitado
    only_from       = 192.168.1.0/24
    no_access       = 192.168.1.100
    access_times    = 08:00-18:00
}
```

Para deshabilitar: cambiar `disable = no` a `disable = yes`

Ventajas de xinetd sobre inetd:
- Control de acceso por servicio (only_from, no_access)
- Limites de conexiones
- Control horario (access_times)
- Mejor registro de logs
- Un archivo de configuracion por servicio

---

## TCP Wrappers

### Descripcion
Sistema de control de acceso basado en host para servicios de red. Funciona como una capa de filtrado antes de que la conexion llegue al servicio.

### Archivos de configuracion
- **`/etc/hosts.allow`**: Reglas de **permiso**
- **`/etc/hosts.deny`**: Reglas de **denegacion**

### Orden de evaluacion (MUY IMPORTANTE para el examen)
1. Se consulta **primero** `/etc/hosts.allow`
2. Si hay coincidencia, se **permite** la conexion (y se deja de evaluar)
3. Si no hay coincidencia, se consulta `/etc/hosts.deny`
4. Si hay coincidencia, se **deniega** la conexion
5. Si no hay coincidencia en ninguno, se **permite** por defecto

### Formato
```
servicio: host [: accion]
```

### Comodines
| Comodin | Significado |
|---------|-------------|
| `ALL` | Todos los servicios o todos los hosts |
| `LOCAL` | Hosts sin punto en el nombre (hosts locales) |
| `KNOWN` | Hosts que se pueden resolver |
| `UNKNOWN` | Hosts que no se pueden resolver |
| `PARANOID` | Hosts cuyo DNS directo e inverso no coinciden |
| `EXCEPT` | Exclusion |

### Estrategia recomendada (politica restrictiva)

**1. Denegar todo por defecto** en `/etc/hosts.deny`:
```
ALL: ALL
```

**2. Permitir solo lo necesario** en `/etc/hosts.allow`:
```
sshd: 192.168.1.0/24
sshd: 10.0.0.0/255.0.0.0
httpd: ALL
ALL: localhost
```

### Ejemplos de reglas

`/etc/hosts.allow`:
```
# Permitir SSH desde la red local
sshd: 192.168.1.0/24

# Permitir SSH desde un host especifico
sshd: 10.0.0.50

# Permitir todo desde localhost
ALL: 127.0.0.1, [::1]

# Permitir FTP desde red local excepto una IP
vsftpd: 192.168.1.0/24 EXCEPT 192.168.1.100

# Permitir SSH desde un dominio
sshd: .ejemplo.com

# Multiples servicios
sshd, httpd: 192.168.1.0/24
```

`/etc/hosts.deny`:
```
# Denegar todo (usar con hosts.allow para politica restrictiva)
ALL: ALL

# Denegar solo telnet
in.telnetd: ALL

# Denegar desde una red especifica
ALL: 10.0.0.0/8
```

> **Nota**: TCP Wrappers solo funciona con servicios compilados con soporte para **libwrap** o lanzados via inetd/xinetd. Muchos servicios modernos no lo soportan.

---

## `/usr/sbin/nologin` vs `/etc/nologin` (DISTINCION CRITICA)

Es fundamental distinguir entre estos dos elementos con nombre similar pero funcion completamente diferente:

### `/usr/sbin/nologin` - Shell asignado a cuentas del sistema

Es un **programa** (un shell falso) que se asigna como shell de login a cuentas de servicio/sistema para **impedir el acceso interactivo de esa cuenta especifica**.

```bash
# En /etc/passwd, las cuentas de sistema usan nologin como shell:
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
mysql:x:27:27:MySQL Server:/var/lib/mysql:/usr/sbin/nologin

# Si alguien intenta hacer login como esa cuenta:
$ su - www-data
This account is currently not available.

# Se puede ubicar tambien en /sbin/nologin
```

- Afecta **solo a las cuentas** que lo tienen asignado como shell en `/etc/passwd`
- Los servicios que corren bajo esas cuentas siguen funcionando (no necesitan shell interactivo)
- El mensaje mostrado se puede personalizar en `/etc/nologin.txt`

### `/etc/nologin` - Archivo que bloquea TODOS los logins no-root

Es un **archivo** cuya mera existencia impide que **cualquier usuario normal** (no root) inicie sesion en el sistema. Se muestra el contenido del archivo como mensaje.

```bash
# Crear para impedir logins de TODOS los usuarios (excepto root)
echo "Sistema en mantenimiento. Vuelva mas tarde." > /etc/nologin

# Eliminar para permitir logins nuevamente
rm /etc/nologin
```

- Afecta a **TODOS los usuarios normales** del sistema
- **Solo root** puede seguir iniciando sesion
- Se usa durante mantenimiento del sistema, antes de reinicios planificados o emergencias de seguridad
- Es verificado por el modulo PAM `pam_nologin`

### Resumen de la distincion

| Concepto | `/usr/sbin/nologin` | `/etc/nologin` |
|----------|--------------------|--------------|
| Tipo | Programa (shell falso) | Archivo |
| Ambito | Una cuenta especifica | Todos los usuarios no-root |
| Ubicacion | Campo shell en `/etc/passwd` | Presencia del archivo en `/etc/` |
| Proposito | Impedir login interactivo de cuentas de servicio | Bloquear acceso al sistema temporalmente |
| Permanencia | Permanente mientras este asignado | Temporal (se elimina el archivo para restaurar) |

---

## `/etc/securetty` - Terminales seguras para root

`/etc/securetty` es un archivo que lista las **terminales (TTY) desde las cuales root puede iniciar sesion directamente**. Es verificado por el modulo PAM `pam_securetty`.

```bash
# Contenido tipico de /etc/securetty
tty1
tty2
tty3
tty4
tty5
tty6
# console
```

### Comportamiento
- Si el archivo **existe**: root solo puede hacer login directo desde las TTY listadas
- Si el archivo **no existe** o esta **vacio**: el comportamiento depende de la distribucion (puede permitir o denegar todo)
- Agregar/eliminar lineas controla en que consolas puede hacer login root
- **NO afecta** al acceso via SSH (eso se controla con `PermitRootLogin` en `sshd_config`)
- **NO afecta** a `su` o `sudo` (solo afecta al login directo)

```bash
# Restringir root a solo tty1
echo "tty1" > /etc/securetty

# Archivo vacio = root no puede hacer login en ninguna TTY
> /etc/securetty
```

**Para el examen:** `/etc/securetty` solo controla el login directo de root en terminales. No afecta a SSH, su ni sudo.

---

## Desactivar login de root directo

### Metodos
```bash
# 1. Cambiar shell de root a nologin
usermod -s /usr/sbin/nologin root

# 2. Bloquear contrasena de root
passwd -l root

# 3. Deshabilitar en SSH (/etc/ssh/sshd_config)
PermitRootLogin no

# 4. Limitar consolas donde root puede hacer login (/etc/securetty)
# Solo permitir en tty1 y tty2 (editar el archivo)
tty1
tty2
```

---

## Seguridad de contrasenas

### Buenas practicas
- Usar shadow passwords (ya es lo predeterminado)
- Establecer politicas de caducidad con `chage`
- Requerir contrasenas fuertes (PAM: pam_pwquality)
- Bloquear cuentas tras intentos fallidos (pam_tally2, faillock)
- Usar `NOPASSWD` con precaucion en sudoers

---

## Puntos clave para el examen

1. **Shadow passwords**: Contrasenas en `/etc/shadow` (solo root), no en `/etc/passwd` (legible por todos)
2. **TCP Wrappers**: Se evalua primero `hosts.allow`, luego `hosts.deny`. Si no hay match, se permite.
3. **Politica restrictiva**: `ALL: ALL` en `hosts.deny` + reglas especificas en `hosts.allow`
4. **xinetd**: Un archivo por servicio en `/etc/xinetd.d/`; `disable = yes` para deshabilitar
5. **inetd**: Comentar linea con `#` en `/etc/inetd.conf` para deshabilitar
6. **`systemctl disable servicio`** evita que inicie al arrancar; **`mask`** lo bloquea completamente
7. **`/usr/sbin/nologin`**: Shell asignado a cuentas de sistema para impedir su login interactivo
8. **`/etc/nologin`**: Si el archivo existe, bloquea el login de TODOS los usuarios excepto root
9. **`/etc/securetty`**: Lista las TTY donde root puede hacer login directo (no afecta SSH ni su/sudo)
10. **`$6$`** = SHA-512, **`$5$`** = SHA-256, **`$1$`** = MD5 en /etc/shadow
11. **`!`** en el campo hash de shadow = cuenta bloqueada
12. La seguridad basica incluye: deshabilitar servicios innecesarios, shadow passwords, TCP wrappers, politicas de contrasenas
