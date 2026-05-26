# 110.2 Configurar la seguridad del host - Ejercicios

## Ejercicio 1
¿Por que existen shadow passwords? ¿Cual es la diferencia entre `/etc/passwd` y `/etc/shadow` en cuanto a seguridad?

<details><summary>Respuesta</summary>

Shadow passwords existen porque `/etc/passwd` tiene permisos **644** (legible por todos los usuarios), y originalmente contenia los hashes de contrasenas. Esto permitia a cualquier usuario copiar los hashes y hacer ataques de fuerza bruta offline.

Con shadow passwords:
- **`/etc/passwd`** (644): Contiene `x` en el campo de contrasena (sin hash real). Informacion de usuarios legible por todos.
- **`/etc/shadow`** (640 o 000): Contiene los hashes reales de las contrasenas. **Solo root puede leerlo**.

Esto separa la informacion publica de los usuarios de la informacion sensible de contrasenas.

</details>

## Ejercicio 2
Explica el orden de evaluacion de TCP Wrappers. Si `/etc/hosts.allow` contiene `sshd: 192.168.1.0/24` y `/etc/hosts.deny` contiene `ALL: ALL`, ¿puede conectarse por SSH un equipo con IP 10.0.0.5?

<details><summary>Respuesta</summary>

Orden de evaluacion:
1. Se consulta `/etc/hosts.allow`: ¿Hay regla para sshd desde 10.0.0.5? **No** (solo permite 192.168.1.0/24)
2. Se consulta `/etc/hosts.deny`: ¿Hay regla? **Si** (`ALL: ALL` coincide con todo)
3. Resultado: **DENEGADO**

El equipo 10.0.0.5 **no puede** conectarse por SSH porque no esta en la red 192.168.1.0/24 permitida en hosts.allow, y la regla `ALL: ALL` en hosts.deny bloquea todo lo demas.

Un equipo con IP 192.168.1.50 si podria conectarse porque coincide con la regla en hosts.allow (y ya no se evalua hosts.deny).

</details>

## Ejercicio 3
¿Como deshabilitar completamente un servicio para que no pueda iniciarse de ninguna forma? ¿Cual es la diferencia entre `disable`, `stop` y `mask` en systemctl?

<details><summary>Respuesta</summary>

```bash
# Detener el servicio (solo ahora, no persiste tras reinicio)
systemctl stop servicio

# Deshabilitar (no inicia al arrancar, pero se puede iniciar manualmente)
systemctl disable servicio

# Enmascarar (bloquea completamente, ni manual ni automaticamente)
systemctl mask servicio
```

Diferencias:
- **`stop`**: Detiene el servicio ahora, pero puede reiniciarse al arrancar si esta enabled
- **`disable`**: No inicia al arrancar, pero se puede iniciar manualmente con `start`
- **`mask`**: Crea un enlace a `/dev/null`, haciendo **imposible** iniciar el servicio de cualquier forma

Para la maxima seguridad: `systemctl stop servicio && systemctl mask servicio`

</details>

## Ejercicio 4
¿Que hace el archivo `/etc/nologin`? ¿Como impedirias temporalmente el login de todos los usuarios normales?

<details><summary>Respuesta</summary>

Si el archivo `/etc/nologin` **existe**, el sistema impide el login de todos los usuarios normales. Solo **root** puede iniciar sesion. El contenido del archivo se muestra como mensaje al usuario que intenta conectarse.

Para impedir logins:
```bash
echo "Sistema en mantenimiento. Disculpe las molestias." > /etc/nologin
```

Para permitir logins de nuevo:
```bash
rm /etc/nologin
```

Usos tipicos: mantenimiento programado, actualizaciones criticas, incidentes de seguridad.

</details>

## Ejercicio 5
¿Como deshabilitarias un servicio en xinetd? ¿Y en inetd?

<details><summary>Respuesta</summary>

**En xinetd**: Editar el archivo del servicio en `/etc/xinetd.d/` y cambiar:
```
disable = yes
```

Luego reiniciar xinetd:
```bash
systemctl restart xinetd
```

**En inetd**: Comentar la linea del servicio en `/etc/inetd.conf` con `#`:
```
# telnet  stream  tcp  nowait  root  /usr/sbin/in.telnetd  in.telnetd
```

Luego reiniciar inetd:
```bash
systemctl restart inetd
# o enviar SIGHUP:
kill -HUP $(pidof inetd)
```

</details>

## Ejercicio 6
En `/etc/shadow`, ¿que significan los siguientes valores en el campo de hash: `$6$abc$xyz...`, `!!`, `*`, y un campo vacio?

<details><summary>Respuesta</summary>

| Valor | Significado |
|-------|-------------|
| `$6$abc$xyz...` | Contrasena valida cifrada con **SHA-512** ($6$ indica el algoritmo, `abc` es la sal, `xyz...` es el hash) |
| `!!` | Cuenta **bloqueada** (nunca ha tenido contrasena o ha sido bloqueada con `passwd -l`) |
| `*` | Login **deshabilitado** (cuenta del sistema, no permite autenticacion por contrasena) |
| (vacio) | **Sin contrasena** - el usuario puede hacer login sin introducir contrasena (riesgo de seguridad) |

Otros prefijos de hash: `$5$` = SHA-256, `$1$` = MD5 (inseguro, obsoleto).

</details>

## Ejercicio 7
Escribe reglas de TCP Wrappers para: a) permitir SSH solo desde la red 10.0.0.0/24 y desde el host 172.16.0.5, b) permitir todo desde localhost, c) denegar todo lo demas.

<details><summary>Respuesta</summary>

`/etc/hosts.allow`:
```
sshd: 10.0.0.0/24, 172.16.0.5
ALL: 127.0.0.1, [::1]
```

`/etc/hosts.deny`:
```
ALL: ALL
```

Esto implementa una **politica restrictiva**: todo esta denegado excepto lo expresamente permitido. SSH solo se permite desde la red 10.0.0.0/24 y el host 172.16.0.5, y todos los servicios estan disponibles desde localhost.

</details>

## Ejercicio 8
¿Cuales son las principales ventajas de xinetd sobre inetd?

<details><summary>Respuesta</summary>

Ventajas de xinetd:

1. **Control de acceso por servicio**: Directivas `only_from` y `no_access` para cada servicio
2. **Un archivo por servicio**: Configuracion modular en `/etc/xinetd.d/` (vs una sola linea en inetd.conf)
3. **Control horario**: Directiva `access_times` para limitar horarios de acceso
4. **Limites de conexiones**: Control de conexiones simultaneas y tasa de conexiones
5. **Mejor logging**: Registro detallado de intentos exitosos y fallidos
6. **Redireccion**: Capacidad de redirigir servicios a otros hosts
7. **Facil deshabilitar**: `disable = yes` en el archivo del servicio

Sin embargo, tanto inetd como xinetd estan en desuso en la mayoria de sistemas modernos, reemplazados por systemd socket activation.

</details>
