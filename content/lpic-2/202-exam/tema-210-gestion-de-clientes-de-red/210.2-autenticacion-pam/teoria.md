---
title: "210.2 - Autenticación PAM"
tags: [lpic-2, examen-202, tema-210, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.2"
---

# 210.2 - Autenticación PAM

## Peso: 3

## Introducción a PAM

PAM (Pluggable Authentication Modules) es un framework que permite a las aplicaciones de Linux delegar la autenticación a módulos configurables de forma independiente. Gracias a PAM, las aplicaciones no necesitan implementar su propia lógica de autenticación.

### Ventajas de PAM

- **Modularidad**: se pueden añadir o cambiar mecanismos de autenticación sin modificar las aplicaciones
- **Flexibilidad**: cada servicio puede tener su propia política de autenticación
- **Centralización**: la configuración se gestiona desde un único punto

## Arquitectura de PAM

PAM organiza la autenticación en cuatro tipos de módulos (grupos funcionales):

| Tipo | Descripción |
|------|-------------|
| **auth** | Verifica la identidad del usuario (contraseña, token, biometría) |
| **account** | Verifica si la cuenta tiene permiso de acceso (caducidad, restricciones horarias) |
| **password** | Gestiona el cambio de contraseñas (complejidad, historial) |
| **session** | Configura el entorno de la sesión del usuario (montaje, logs, límites) |

> **Para el examen:** Memoriza los cuatro tipos de módulos PAM y qué función cumple cada uno. Es una de las preguntas más frecuentes del tema.

## Archivos de configuración

### Directorio /etc/pam.d/

Cada servicio tiene su propio archivo de configuración en `/etc/pam.d/`. El nombre del archivo corresponde al nombre del servicio:

```
/etc/pam.d/login      # Configuración PAM para login
/etc/pam.d/sshd       # Configuración PAM para SSH
/etc/pam.d/su         # Configuración PAM para su
/etc/pam.d/sudo       # Configuración PAM para sudo
/etc/pam.d/passwd     # Configuración PAM para passwd
```

### Formato de las líneas de configuración

```
tipo    control    módulo    [argumentos]
```

Ejemplo:

```
auth    required    pam_unix.so    nullok
account required    pam_unix.so
password required   pam_cracklib.so retry=3
session required    pam_unix.so
```

### Archivos common (Debian/Ubuntu)

```
/etc/pam.d/common-auth       # Reglas de autenticación comunes
/etc/pam.d/common-account    # Reglas de cuenta comunes
/etc/pam.d/common-password   # Reglas de contraseña comunes
/etc/pam.d/common-session    # Reglas de sesión comunes
```

En RHEL/CentOS se utiliza el archivo `/etc/pam.d/system-auth` y `/etc/pam.d/password-auth`.

## Flags de control

Los flags de control determinan cómo se comporta la pila PAM cuando un módulo tiene éxito o falla:

| Flag | Comportamiento en caso de fallo |
|------|-------------------------------|
| **required** | El fallo se registra pero se continúan evaluando los demás módulos. El resultado final será fallo |
| **requisite** | El fallo es inmediato: se detiene la evaluación y se devuelve fallo al instante |
| **sufficient** | Si tiene éxito y ningún `required` previo ha fallado, se devuelve éxito inmediato. Si falla, se ignora |
| **optional** | El resultado solo importa si es el único módulo en la pila para ese tipo |

> **Para el examen:** La diferencia entre `required` y `requisite` es clave. `required` continúa evaluando (para no revelar qué módulo falló), mientras que `requisite` detiene inmediatamente.

### Sintaxis extendida de control

Además de las palabras clave simples, PAM soporta una sintaxis extendida con corchetes:

```
auth [success=2 default=ignore] pam_unix.so
auth [success=1 default=ignore] pam_ldap.so
auth requisite                  pam_deny.so
auth required                   pam_permit.so
```

## Módulos PAM más importantes

### pam_unix.so

Módulo fundamental que realiza la autenticación estándar contra `/etc/passwd` y `/etc/shadow`.

```
auth     required  pam_unix.so nullok
account  required  pam_unix.so
password required  pam_unix.so sha512 shadow
session  required  pam_unix.so
```

### pam_ldap.so

Permite la autenticación contra un servidor LDAP externo:

```
auth     sufficient pam_ldap.so
account  sufficient pam_ldap.so
password sufficient pam_ldap.so
session  optional   pam_ldap.so
```

### pam_wheel.so

Restringe el uso de `su` a los miembros del grupo `wheel`:

```
# /etc/pam.d/su
auth required pam_wheel.so
```

### pam_limits.so

Aplica los límites definidos en `/etc/security/limits.conf`:

```
session required pam_limits.so
```

### pam_deny.so y pam_permit.so

- `pam_deny.so`: **siempre deniega** el acceso. Se usa como política por defecto restrictiva
- `pam_permit.so`: **siempre permite** el acceso. Se usa con precaución

```
# Denegar por defecto
auth required pam_deny.so

# Permitir siempre (usar con cuidado)
auth required pam_permit.so
```

### pam_cracklib.so / pam_pwquality.so

Verifican la calidad de las contraseñas. `pam_pwquality.so` es el sucesor moderno de `pam_cracklib.so`:

```
password required pam_pwquality.so retry=3 minlen=8 dcredit=-1 ucredit=-1
```

| Parámetro | Descripción |
|-----------|-------------|
| `retry` | Número de intentos permitidos |
| `minlen` | Longitud mínima de la contraseña |
| `dcredit` | Crédito por dígitos (negativo = requeridos) |
| `ucredit` | Crédito por mayúsculas (negativo = requeridas) |
| `lcredit` | Crédito por minúsculas |
| `ocredit` | Crédito por caracteres especiales |

### pam_tally2.so / pam_faillock.so

Bloquean cuentas tras intentos fallidos de autenticación. `pam_faillock` es el sucesor de `pam_tally2`:

```
# Con pam_tally2 (obsoleto)
auth required pam_tally2.so deny=5 unlock_time=900

# Con pam_faillock (moderno)
auth required pam_faillock.so preauth deny=5 unlock_time=900
auth required pam_faillock.so authfail deny=5 unlock_time=900
```

### pam_nologin.so

Impide el inicio de sesión de usuarios no root cuando existe el archivo `/etc/nologin`:

```
auth required pam_nologin.so
```

> **Para el examen:** Si existe `/etc/nologin`, solo root puede iniciar sesión. El contenido del archivo se muestra como mensaje a los usuarios rechazados.

### pam_time.so

Restringe el acceso según reglas temporales definidas en `/etc/security/time.conf`:

```
account required pam_time.so
```

### pam_access.so

Controla el acceso basándose en reglas de `/etc/security/access.conf`:

```
account required pam_access.so
```

### pam_sss.so (SSSD)

Integra PAM con SSSD (System Security Services Daemon) para autenticación centralizada:

```
auth     sufficient pam_sss.so
account  sufficient pam_sss.so
password sufficient pam_sss.so
session  optional   pam_sss.so
```

## Archivo /etc/security/limits.conf

Define límites de recursos para usuarios y grupos. Es leído por `pam_limits.so`.

### Formato

```
# <dominio>  <tipo>  <elemento>  <valor>
@estudiantes  hard    nproc       50
admin         soft    nofile      4096
admin         hard    nofile      8192
*             soft    core        0
@desarrollo   hard    maxlogins   4
```

| Campo | Valores posibles |
|-------|-----------------|
| **dominio** | usuario, @grupo, * (todos) |
| **tipo** | `soft` (límite suave, el usuario puede aumentar hasta hard), `hard` (límite absoluto), `-` (ambos) |
| **elemento** | `nproc`, `nofile`, `core`, `maxlogins`, `memlock`, `as`, etc. |

| Elemento | Descripción |
|----------|-------------|
| `nproc` | Número máximo de procesos |
| `nofile` | Número máximo de archivos abiertos |
| `core` | Tamaño máximo de archivo core (KB) |
| `maxlogins` | Máximo número de sesiones simultáneas |
| `memlock` | Memoria bloqueada máxima (KB) |
| `as` | Límite de espacio de direcciones (KB) |

> **Para el examen:** `limits.conf` requiere que `pam_limits.so` esté habilitado en la sesión PAM correspondiente. Sin la línea `session required pam_limits.so`, los límites no se aplicarán.

## Orden de evaluación

PAM evalúa los módulos de arriba hacia abajo dentro de cada tipo. El resultado final depende de la combinación de los flags de control:

1. Se evalúan todos los módulos `required` (aunque uno falle, se continúa)
2. Un módulo `requisite` que falla detiene la evaluación inmediatamente
3. Un módulo `sufficient` que tiene éxito detiene la evaluación (si no hay `required` previos fallidos)
4. Los módulos `optional` solo afectan si son los únicos en la pila

## Depuración de PAM

```bash
# Ver qué módulos PAM usa un servicio
cat /etc/pam.d/sshd

# Listar módulos PAM instalados
ls /lib/x86_64-linux-gnu/security/    # Debian
ls /lib64/security/                     # RHEL

# Habilitar depuración (añadir debug al módulo)
auth required pam_unix.so debug

# Revisar logs de autenticación
tail -f /var/log/auth.log       # Debian
tail -f /var/log/secure         # RHEL
```
