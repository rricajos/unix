---
title: "305.2 - Ejercicios: FreeIPA Gestión de Entidades"
description: "Ejercicios de práctica para gestión de entidades en FreeIPA"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 305 - Identidad y Compartición"
subtema: "305.2"
peso: 4
tags:
  - lpic-3
  - tema-305
  - freeipa
  - ejercicios
---

# 305.2 Ejercicios - FreeIPA Gestión de Entidades

### Pregunta 1
¿Cuál es el comando correcto para crear un usuario en FreeIPA?

a) `ipa adduser jgarcia --first=Juan --last=Garcia`
b) `ipa user-add jgarcia --first=Juan --last=Garcia`
c) `ipa user create jgarcia --firstname=Juan --lastname=Garcia`
d) `ipa-user-add jgarcia --first=Juan --last=Garcia`

<details><summary>Respuesta</summary>

**b) `ipa user-add jgarcia --first=Juan --last=Garcia`**

Los comandos de FreeIPA siguen el patrón `ipa ENTIDAD-ACCIÓN`. Para usuarios, el prefijo es `user-` seguido de la acción: `add`, `mod`, `del`, `find`, `show`, `enable`, `disable`, `unlock`.
</details>

### Pregunta 2
¿Qué se debe hacer antes de que las reglas HBAC personalizadas tengan efecto?

a) Reiniciar el servicio FreeIPA
b) Deshabilitar la regla `allow_all` con `ipa hbacrule-disable allow_all`
c) Ejecutar `ipa hbac-rebuild`
d) Crear al menos 5 reglas HBAC

<details><summary>Respuesta</summary>

**b) Deshabilitar la regla `allow_all` con `ipa hbacrule-disable allow_all`**

La regla `allow_all` está habilitada por defecto y permite el acceso de todos los usuarios a todos los hosts. Mientras esté activa, las reglas HBAC personalizadas no tienen efecto porque `allow_all` siempre permite el acceso.
</details>

### Pregunta 3
¿Qué comando permite verificar si un usuario tiene acceso a un host según las reglas HBAC?

a) `ipa hbacrule-test --user=jgarcia --host=srv1.empresa.local`
b) `ipa access-check jgarcia srv1.empresa.local`
c) `ipa hbactest --user=jgarcia --host=srv1.empresa.local --service=sshd`
d) `ipa hbac-verify jgarcia@srv1.empresa.local`

<details><summary>Respuesta</summary>

**c) `ipa hbactest --user=jgarcia --host=srv1.empresa.local --service=sshd`**

`ipa hbactest` simula la evaluación de reglas HBAC para determinar si un usuario tiene acceso a un host mediante un servicio específico, sin necesidad de intentar la conexión real.
</details>

### Pregunta 4
¿Cómo se inscribe un host en FreeIPA usando una contraseña de un solo uso (OTP)?

a) Se genera con `ipa host-add fqdn --random` y se usa con `ipa-client-install --password=OTP`
b) Se envía un correo con la contraseña temporal
c) Se genera con `ipa otp-generate fqdn`
d) Se usa el mismo comando `ipa host-add` desde el cliente

<details><summary>Respuesta</summary>

**a) Se genera con `ipa host-add fqdn --random` y se usa con `ipa-client-install --password=OTP`**

El administrador genera la OTP con `--random` al añadir el host al servidor IPA. Luego, en el cliente, se ejecuta `ipa-client-install --password=CONTRASEÑA_GENERADA` para completar la inscripción sin necesitar credenciales de administrador.
</details>

### Pregunta 5
¿Qué tipo de grupo de FreeIPA puede contener miembros de un dominio Active Directory?

a) Grupo POSIX
b) Grupo no-POSIX
c) Grupo externo
d) Grupo universal

<details><summary>Respuesta</summary>

**c) Grupo externo**

Los grupos externos (creados con `--external`) pueden contener SIDs de Active Directory como miembros. Se usan típicamente en relaciones de confianza cross-realm para mapear entidades AD a permisos FreeIPA.
</details>

### Pregunta 6
¿Qué componente de una regla sudo en FreeIPA define los comandos que el usuario puede ejecutar?

a) sudorule-add-user
b) sudorule-add-host
c) sudorule-add-allow-command
d) sudorule-add-service

<details><summary>Respuesta</summary>

**c) sudorule-add-allow-command**

`ipa sudorule-add-allow-command` asocia comandos (individuales o grupos de comandos sudo) a una regla sudo, definiendo qué comandos están permitidos ejecutar con sudo dentro de esa regla.
</details>

### Pregunta 7
¿Qué hacen las reglas de automember en FreeIPA?

a) Eliminan automáticamente usuarios inactivos
b) Asignan automáticamente usuarios o hosts a grupos basándose en atributos
c) Sincronizan automáticamente miembros con Active Directory
d) Crean copias de seguridad automáticas de los datos de usuario

<details><summary>Respuesta</summary>

**b) Asignan automáticamente usuarios o hosts a grupos basándose en atributos**

Las reglas de automember usan expresiones regulares sobre atributos de la entidad (como departamento, FQDN, etc.) para asignar automáticamente nuevos usuarios u hosts al grupo correspondiente al momento de su creación.
</details>

### Pregunta 8
¿Qué permite hacer un ID View en FreeIPA?

a) Ver la interfaz web de FreeIPA desde otro idioma
b) Sobrescribir atributos POSIX de usuarios y grupos para hosts específicos
c) Crear una vista de auditoría de cambios
d) Personalizar la vista del panel de administración

<details><summary>Respuesta</summary>

**b) Sobrescribir atributos POSIX de usuarios y grupos para hosts específicos**

ID Views permiten que un mismo usuario tenga diferentes atributos POSIX (UID, GID, home, shell) en diferentes hosts. Esto es útil para migración o para integrar servidores legacy que requieren UIDs diferentes.
</details>

### Pregunta 9
¿Qué comando obtiene un keytab Kerberos para un servicio desde el servidor FreeIPA?

a) `ipa keytab-get`
b) `kinit -k servicio`
c) `ipa-getkeytab -s servidor -p principal -k /ruta/keytab`
d) `ktutil add servicio`

<details><summary>Respuesta</summary>

**c) `ipa-getkeytab -s servidor -p principal -k /ruta/keytab`**

`ipa-getkeytab` contacta al servidor FreeIPA (`-s`), solicita el keytab para el principal Kerberos especificado (`-p`) y lo guarda en el archivo indicado (`-k`). Los keytabs permiten a los servicios autenticarse sin contraseña interactiva.
</details>

### Pregunta 10
Un administrador quiere que las contraseñas del grupo "desarrolladores" tengan una longitud mínima de 10 caracteres y expiren cada 180 días. ¿Qué comando es correcto?

a) `ipa pwpolicy-mod --group=desarrolladores --minlength=10 --maxlife=180`
b) `ipa pwpolicy-add desarrolladores --minlength=10 --maxlife=180 --priority=10`
c) `ipa password-policy desarrolladores --min=10 --expire=180`
d) `ipa user-mod --group=desarrolladores --password-policy="min:10,max:180"`

<details><summary>Respuesta</summary>

**b) `ipa pwpolicy-add desarrolladores --minlength=10 --maxlife=180 --priority=10`**

`ipa pwpolicy-add` crea una política de contraseñas para un grupo específico. Se requiere `--priority` para definir el orden de evaluación (menor número = mayor prioridad). Esta política se aplica a los miembros del grupo en lugar de la política global.
</details>
