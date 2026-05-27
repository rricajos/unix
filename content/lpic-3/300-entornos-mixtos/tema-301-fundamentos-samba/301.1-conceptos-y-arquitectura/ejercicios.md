---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.1"
titulo: "Conceptos y Arquitectura - Ejercicios"
peso: 2
tags:
  - lpic-3
  - tema-301
  - ejercicios
---

# Ejercicios - 301.1 Conceptos y Arquitectura

### Pregunta 1
¿Cuál es el demonio de Samba responsable de la resolución de nombres NetBIOS?

a) smbd
b) winbindd
c) nmbd
d) samba

<details><summary>Respuesta</summary>

**c) nmbd**

El demonio `nmbd` es el responsable de la resolución de nombres NetBIOS sobre TCP/IP. También puede actuar como servidor WINS y participa en las elecciones de navegador maestro. Utiliza los puertos UDP 137 y 138.
</details>

### Pregunta 2
¿En qué puerto escucha SMB cuando funciona directamente sobre TCP/IP sin NetBIOS?

a) 137
b) 138
c) 139
d) 445

<details><summary>Respuesta</summary>

**d) 445**

El puerto TCP 445 se utiliza para SMB directo sobre TCP/IP, sin necesidad de la capa NetBIOS. El puerto 139 es SMB sobre NetBIOS Session Service. Los puertos 137 y 138 son UDP para el servicio de nombres y datagramas NetBIOS respectivamente.
</details>

### Pregunta 3
¿Cuál de las siguientes afirmaciones sobre Samba 4 es CORRECTA?

a) No puede actuar como controlador de dominio Active Directory
b) Solo soporta el protocolo SMB1
c) Incluye un servidor Kerberos (Heimdal KDC) integrado
d) Requiere un servidor LDAP externo obligatoriamente

<details><summary>Respuesta</summary>

**c) Incluye un servidor Kerberos (Heimdal KDC) integrado**

Samba 4 incluye un KDC Kerberos basado en Heimdal, un servidor LDAP interno y opcionalmente un servidor DNS interno. Puede actuar como controlador de dominio AD completo y soporta SMB1, SMB2 y SMB3.
</details>

### Pregunta 4
¿Qué función realiza el demonio `winbindd`?

a) Comparte archivos e impresoras
b) Resuelve nombres NetBIOS
c) Mapea usuarios y grupos de Windows a UIDs/GIDs de Linux
d) Gestiona el servicio DNS de Samba

<details><summary>Respuesta</summary>

**c) Mapea usuarios y grupos de Windows a UIDs/GIDs de Linux**

El demonio `winbindd` se encarga de la integración con dominios Windows, mapeando usuarios y grupos de Windows/AD a UIDs y GIDs del sistema Linux. Utiliza NSS y PAM para la integración y se comunica a través de un socket UNIX local.
</details>

### Pregunta 5
¿Cuál es la longitud máxima de un nombre NetBIOS (sin contar el sufijo de tipo)?

a) 8 caracteres
b) 15 caracteres
c) 16 caracteres
d) 255 caracteres

<details><summary>Respuesta</summary>

**b) 15 caracteres**

Los nombres NetBIOS están limitados a 15 caracteres para el nombre propiamente dicho, más 1 byte (el 16º carácter) que se usa como sufijo de tipo de servicio. Por ejemplo, el sufijo `<20>` indica un servidor de archivos.
</details>

### Pregunta 6
Cuando Samba 4 se configura como controlador de dominio Active Directory, ¿qué demonio se debe iniciar?

a) smbd y nmbd
b) winbindd únicamente
c) El demonio unificado `samba`
d) smbd, nmbd y winbindd simultáneamente

<details><summary>Respuesta</summary>

**c) El demonio unificado `samba`**

En modo AD DC, Samba 4 utiliza un demonio unificado llamado `samba` que integra todas las funcionalidades necesarias: servidor LDAP, DNS, Kerberos KDC, SMB y RPC. Se inicia con `systemctl start samba-ad-dc`. Los demonios individuales smbd/nmbd/winbindd se usan en modo servidor de archivos o miembro de dominio.
</details>

### Pregunta 7
¿Qué parámetro de smb.conf se utiliza para activar el servidor WINS en Samba?

a) `wins server = yes`
b) `wins support = yes`
c) `enable wins = true`
d) `name resolve order = wins`

<details><summary>Respuesta</summary>

**b) `wins support = yes`**

El parámetro `wins support = yes` en la sección `[global]` de smb.conf activa el servicio WINS en el servidor Samba. El parámetro `wins server` se usa en los clientes para especificar la IP del servidor WINS. Ambos parámetros son mutuamente excluyentes en el mismo servidor.
</details>

### Pregunta 8
¿Cuál es el sufijo NetBIOS que identifica a un controlador de dominio?

a) `<00>`
b) `<20>`
c) `<1B>`
d) `<1C>`

<details><summary>Respuesta</summary>

**d) `<1C>`**

El sufijo `<1C>` es un registro de grupo que identifica a los controladores de dominio. El sufijo `<1B>` identifica al Domain Master Browser (único), `<20>` al servidor de archivos y `<00>` a la estación de trabajo.
</details>

### Pregunta 9
¿Qué protocolo SMB es considerado inseguro y está deshabilitado por defecto en Windows 10 y posteriores?

a) SMB2
b) SMB3
c) SMB1/CIFS
d) SMB3.1.1

<details><summary>Respuesta</summary>

**c) SMB1/CIFS**

SMB1 (también conocido como CIFS) es considerado inseguro debido a múltiples vulnerabilidades, incluyendo la explotada por WannaCry. Microsoft lo deshabilita por defecto en Windows 10+ y recomienda usar SMB2 o superior. En Samba, se puede limitar con `server min protocol = SMB2`.
</details>

### Pregunta 10
¿Cuál es la diferencia fundamental entre un grupo de trabajo (workgroup) y un dominio?

a) Los grupos de trabajo permiten más usuarios que los dominios
b) Los dominios proporcionan autenticación centralizada; los grupos de trabajo no
c) Los grupos de trabajo usan Kerberos para autenticación
d) Los dominios solo funcionan con sistemas Windows

<details><summary>Respuesta</summary>

**b) Los dominios proporcionan autenticación centralizada; los grupos de trabajo no**

En un grupo de trabajo, cada equipo mantiene su propia base de datos de usuarios local (modelo peer-to-peer). En un dominio, existe un controlador de dominio centralizado que gestiona la autenticación y las políticas para todos los equipos miembros. Samba puede funcionar en ambos modelos.
</details>
