---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "333 - Control de Acceso"
tema: "333.2 - Control de acceso obligatorio"
subtema: "333.2"
peso: 4
tags:
  - lpic-3
  - tema-333
  - selinux
  - apparmor
  - mac
---

# Ejercicios - 333.2 Control de Acceso Obligatorio

### Pregunta 1
¿Que comando muestra el modo actual de SELinux?

a) `sestatus --mode`
b) `getenforce`
c) `selinux --status`
d) `getselinux`

<details><summary>Respuesta</summary>

**b)** `getenforce`

`getenforce` muestra el modo actual de SELinux: Enforcing, Permissive o Disabled. `sestatus` proporciona informacion mas detallada incluyendo la politica cargada.
</details>

### Pregunta 2
Un administrador ejecuta `chcon -t httpd_sys_content_t /datos/web/index.html`. ¿Que ocurre si posteriormente se ejecuta `restorecon /datos/web/index.html`?

a) El contexto establecido por chcon se mantiene
b) El contexto vuelve al valor por defecto del sistema de archivos
c) Se produce un error porque el archivo ya tiene un contexto personalizado
d) restorecon no afecta a archivos modificados con chcon

<details><summary>Respuesta</summary>

**b)** El contexto vuelve al valor por defecto del sistema de archivos

`chcon` establece contextos temporales que se pierden con `restorecon` o un reetiquetado del sistema. Para cambios permanentes se debe usar `semanage fcontext` seguido de `restorecon`.
</details>

### Pregunta 3
¿Que comando establece permanentemente un booleano de SELinux?

a) `setsebool httpd_can_network_connect on`
b) `setsebool -P httpd_can_network_connect on`
c) `semanage bool --permanent httpd_can_network_connect on`
d) `setbool -permanent httpd_can_network_connect=1`

<details><summary>Respuesta</summary>

**b)** `setsebool -P httpd_can_network_connect on`

La opcion `-P` (Persistent/Permanent) hace que el cambio del booleano sobreviva a reinicios. Sin `-P`, el cambio es solo temporal.
</details>

### Pregunta 4
¿Que herramienta de AppArmor se utiliza para crear un perfil de forma interactiva, monitorizando los accesos de la aplicacion?

a) `aa-logprof`
b) `aa-enforce`
c) `aa-genprof`
d) `aa-autodep`

<details><summary>Respuesta</summary>

**c)** `aa-genprof`

`aa-genprof` inicia un proceso interactivo: pone la aplicacion en modo complain, permite ejecutarla en otra terminal, y luego analiza los logs para construir el perfil basandose en los accesos reales.
</details>

### Pregunta 5
¿Donde se almacenan los perfiles de AppArmor?

a) `/etc/security/apparmor/`
b) `/etc/apparmor.d/`
c) `/var/lib/apparmor/profiles/`
d) `/usr/share/apparmor/`

<details><summary>Respuesta</summary>

**b)** `/etc/apparmor.d/`

Los perfiles de AppArmor se almacenan en `/etc/apparmor.d/`. Los nombres siguen la convencion de reemplazar `/` por `.` en la ruta del ejecutable (ej: `usr.sbin.apache2`).
</details>

### Pregunta 6
¿Que comando genera un modulo de politica SELinux a partir de las denegaciones registradas en el log de auditoria?

a) `semanage module -create`
b) `sealert --generate-policy`
c) `audit2allow -a -M mi_modulo`
d) `semodule --create mi_modulo`

<details><summary>Respuesta</summary>

**c)** `audit2allow -a -M mi_modulo`

`audit2allow` lee las denegaciones AVC del log de auditoria. Con `-a` lee todo el log, y `-M mi_modulo` genera un modulo compilado (.pp) listo para instalar con `semodule -i mi_modulo.pp`.
</details>

### Pregunta 7
¿Cual es la diferencia fundamental entre el modelo de etiquetado de SELinux y AppArmor?

a) SELinux usa etiquetas en el inodo del archivo; AppArmor usa rutas de archivo
b) AppArmor usa etiquetas en el inodo; SELinux usa rutas
c) Ambos usan etiquetas en el inodo pero con diferente formato
d) Ambos usan rutas pero con diferente sintaxis

<details><summary>Respuesta</summary>

**a)** SELinux usa etiquetas en el inodo del archivo; AppArmor usa rutas de archivo

SELinux almacena contextos de seguridad como atributos extendidos en el inodo (xattr), lo que los hace persistentes e independientes de la ruta. AppArmor define permisos basados en rutas de archivos, lo cual es mas simple pero no protege contra accesos mediante hardlinks o renombrados.
</details>

### Pregunta 8
Un proceso Apache en un sistema con SELinux intenta conectarse a una base de datos remota pero la conexion es denegada. ¿Cual es la solucion mas probable?

a) Deshabilitar SELinux
b) Ejecutar `setsebool -P httpd_can_network_connect on`
c) Cambiar el contexto de Apache a unconfined_t
d) Crear una excepcion en el firewall

<details><summary>Respuesta</summary>

**b)** Ejecutar `setsebool -P httpd_can_network_connect on`

El booleano `httpd_can_network_connect` controla si Apache puede iniciar conexiones de red salientes. Por defecto esta desactivado por seguridad. Activarlo con `-P` resuelve el problema de forma permanente y correcta.
</details>

### Pregunta 9
¿Que comando de AppArmor pone un perfil existente en modo complain para depuracion?

a) `apparmor_parser --complain perfil`
b) `aa-complain /etc/apparmor.d/perfil`
c) `aa-status --complain perfil`
d) `aa-disable --mode=complain perfil`

<details><summary>Respuesta</summary>

**b)** `aa-complain /etc/apparmor.d/perfil`

`aa-complain` cambia el modo del perfil especificado a complain, donde las violaciones se registran pero no se bloquean. Es el equivalente al modo permissive de SELinux para un perfil individual.
</details>

### Pregunta 10
¿Que ventaja principal tiene MAC (SELinux/AppArmor) sobre DAC?

a) MAC es mas facil de configurar
b) MAC protege incluso si root esta comprometido
c) MAC permite a los usuarios definir sus propios permisos
d) MAC no requiere configuracion

<details><summary>Respuesta</summary>

**b)** MAC protege incluso si root esta comprometido

En DAC, root tiene acceso completo a todos los recursos. En MAC, las politicas son aplicadas por el kernel independientemente del usuario. Un proceso con UID 0 (root) sigue estando confinado por la politica MAC, limitando el daño que un atacante puede hacer incluso con acceso root.
</details>
