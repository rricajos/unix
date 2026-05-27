---
title: "304.3 - Ejercicios: Clientes Windows"
description: "Ejercicios de práctica para integración de clientes Windows con Samba AD"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 304 - Configuración de Clientes Samba"
subtema: "304.3"
peso: 2
tags:
  - lpic-3
  - tema-304
  - samba
  - windows
  - ejercicios
---

# 304.3 Ejercicios - Clientes Windows

### Pregunta 1
¿Cuáles son los requisitos fundamentales para unir un cliente Windows a un dominio Samba AD?

a) Solo se necesita la dirección IP del servidor
b) DNS funcional, sincronización de tiempo y credenciales de administrador
c) Solo se necesita el nombre del dominio y la contraseña de administrador
d) VPN configurada y certificado SSL del servidor

<details><summary>Respuesta</summary>

**b) DNS funcional, sincronización de tiempo y credenciales de administrador**

Para unir un cliente Windows a un dominio Samba AD se requiere: DNS correctamente configurado (el cliente debe resolver el DC), sincronización de tiempo (Kerberos tolera máximo 5 minutos de diferencia) y credenciales con privilegios de unión al dominio.
</details>

### Pregunta 2
¿Qué comando de Windows mapea una unidad de red Z: de forma persistente?

a) `net share Z: \\servidor\share /persistent`
b) `net use Z: \\servidor\share /persistent:yes`
c) `mount Z: \\servidor\share -o persistent`
d) `net map Z: \\servidor\share /auto`

<details><summary>Respuesta</summary>

**b) `net use Z: \\servidor\share /persistent:yes`**

`net use` con la opción `/persistent:yes` crea una conexión que se restaura automáticamente en cada inicio de sesión del usuario. Sin esta opción, la conexión solo dura hasta que el usuario cierra sesión.
</details>

### Pregunta 3
¿Dónde se almacenan las plantillas administrativas ADMX en SYSVOL para que estén disponibles centralmente?

a) `\\dominio\sysvol\dominio\Policies\Templates\`
b) `\\dominio\sysvol\dominio\Policies\PolicyDefinitions\`
c) `\\dominio\sysvol\dominio\ADMX\`
d) `\\dominio\sysvol\dominio\Policies\Administrative\`

<details><summary>Respuesta</summary>

**b) `\\dominio\sysvol\dominio\Policies\PolicyDefinitions\`**

El almacén central de plantillas ADMX se encuentra en `PolicyDefinitions` dentro del directorio de políticas de SYSVOL. Los archivos ADMX van en este directorio y los archivos ADML (traducciones) van en subdirectorios por idioma (ej: `es-ES/`).
</details>

### Pregunta 4
¿Qué comando de Windows fuerza la actualización inmediata de las políticas de grupo?

a) `gpo /refresh`
b) `gpresult /force`
c) `gpupdate /force`
d) `secedit /refreshpolicy`

<details><summary>Respuesta</summary>

**c) `gpupdate /force`**

`gpupdate /force` fuerza al cliente Windows a descargar y aplicar todas las políticas de grupo del dominio, independientemente de si han cambiado desde la última actualización. `gpresult` solo muestra las políticas aplicadas.
</details>

### Pregunta 5
¿Qué herramienta RSAT se utiliza para gestionar usuarios y grupos en un dominio Samba AD?

a) `gpmc.msc`
b) `dnsmgmt.msc`
c) `dsa.msc`
d) `compmgmt.msc`

<details><summary>Respuesta</summary>

**c) `dsa.msc`**

`dsa.msc` (Active Directory Users and Computers) es la herramienta RSAT para gestionar usuarios, grupos, equipos y unidades organizativas en el dominio. `gpmc.msc` es para GPOs, `dnsmgmt.msc` para DNS.
</details>

### Pregunta 6
¿Qué comando de samba-tool lista todas las políticas de grupo del dominio?

a) `samba-tool gpo list`
b) `samba-tool gpo listall`
c) `samba-tool gpo show`
d) `samba-tool policy list`

<details><summary>Respuesta</summary>

**b) `samba-tool gpo listall`**

`samba-tool gpo listall` muestra todas las GPOs del dominio con sus GUIDs y nombres. `samba-tool gpo list usuario` muestra las GPOs aplicadas a un usuario específico.
</details>

### Pregunta 7
¿Qué archivo dentro de una GPO contiene las configuraciones de registro que se aplican a los equipos?

a) `Machine\Settings.xml`
b) `Machine\Registry.pol`
c) `Computer\Policies.reg`
d) `Machine\GPT.INI`

<details><summary>Respuesta</summary>

**b) `Machine\Registry.pol`**

`Machine\Registry.pol` es el archivo binario que contiene las configuraciones de registro que la GPO aplica a los equipos (Computer Configuration). Para configuraciones de usuario, el archivo equivalente está en `User\Registry.pol`.
</details>

### Pregunta 8
¿Qué comando de Windows permite verificar que el canal seguro con el controlador de dominio está funcionando?

a) `netstat /dc`
b) `nslookup _ldap._tcp.dominio`
c) `nltest /sc_query:dominio`
d) `ping dc.dominio`

<details><summary>Respuesta</summary>

**c) `nltest /sc_query:dominio`**

`nltest /sc_query:dominio` verifica el estado del canal seguro entre el equipo y el controlador de dominio. Un canal seguro funcional es necesario para la autenticación y la aplicación de políticas de grupo.
</details>

### Pregunta 9
¿Qué protocolo de autenticación usan los clientes Windows unidos al dominio Samba AD para Single Sign-On?

a) NTLM v1
b) LDAP bind
c) Kerberos
d) RADIUS

<details><summary>Respuesta</summary>

**c) Kerberos**

Los clientes Windows unidos al dominio utilizan Kerberos automáticamente para Single Sign-On (SSO). Al iniciar sesión, obtienen un TGT del KDC y lo usan para solicitar tickets de servicio al acceder a recursos del dominio.
</details>

### Pregunta 10
Un administrador quiere desplegar una impresora compartida desde Samba a todos los equipos Windows del dominio. ¿Cuál es el método más eficiente?

a) Instalar manualmente la impresora en cada equipo
b) Usar una GPO para desplegar la impresora automáticamente
c) Enviar un correo con instrucciones de instalación
d) Usar un script que ejecute `net use` en cada equipo

<details><summary>Respuesta</summary>

**b) Usar una GPO para desplegar la impresora automáticamente**

Las GPOs permiten desplegar impresoras de forma centralizada a equipos o usuarios. La configuración se realiza en Computer Configuration > Policies > Windows Settings > Deployed Printers (o mediante Preferences > Control Panel Settings > Printers).
</details>
