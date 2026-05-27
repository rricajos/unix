---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "332 - Seguridad del Host"
tema: "332.2 - Deteccion de intrusiones en el host"
subtema: "332.2"
peso: 4
tags:
  - lpic-3
  - tema-332
  - aide
  - auditd
  - hids
---

# Ejercicios - 332.2 Deteccion de Intrusiones en el Host

### Pregunta 1
Despues de ejecutar `aide --init`, ¿que paso es necesario antes de poder ejecutar `aide --check`?

a) Ejecutar `aide --validate`
b) Copiar/renombrar `aide.db.new.gz` a `aide.db.gz`
c) Reiniciar el servicio aided
d) Ejecutar `aide --activate`

<details><summary>Respuesta</summary>

**b)** Copiar/renombrar `aide.db.new.gz` a `aide.db.gz`

`aide --init` genera la base de datos como `aide.db.new.gz`. Se debe copiar o renombrar a `aide.db.gz` (la ubicacion definida en `database_in` de aide.conf) antes de poder realizar verificaciones.
</details>

### Pregunta 2
¿Que regla de auditd monitoriza escrituras y cambios de atributos en el archivo `/etc/passwd`?

a) `auditctl -w /etc/passwd -p rx -k identity`
b) `auditctl -w /etc/passwd -p wa -k identity`
c) `auditctl -a /etc/passwd -p wa -k identity`
d) `auditctl -f /etc/passwd -m wa -k identity`

<details><summary>Respuesta</summary>

**b)** `auditctl -w /etc/passwd -p wa -k identity`

La opcion `-w` define una vigilancia sobre un archivo, `-p wa` monitoriza escrituras (w) y cambios de atributos (a), y `-k identity` asigna una etiqueta para facilitar busquedas posteriores.
</details>

### Pregunta 3
¿Que comando de auditoria busca todos los eventos marcados con la etiqueta "network"?

a) `aureport -k network`
b) `ausearch -k network`
c) `auditctl --search network`
d) `audit-find -key network`

<details><summary>Respuesta</summary>

**b)** `ausearch -k network`

`ausearch -k` busca eventos en los logs de auditoria filtrados por la clave (key) especificada. Las claves se asignan con `-k` al crear las reglas con `auditctl -w`.
</details>

### Pregunta 4
En la configuracion de AIDE, ¿que significa la regla `NORMAL = p+i+n+u+g+s+m+c+sha256`?

a) Define una regla que solo verifica el hash SHA-256
b) Define un grupo de verificacion que incluye permisos, inodo, enlaces, usuario, grupo, tamaño, tiempos y hash SHA-256
c) Es un alias para el nivel de severidad normal
d) Configura el nivel de logging normal

<details><summary>Respuesta</summary>

**b)** Define un grupo de verificacion que incluye permisos (p), inodo (i), numero de enlaces (n), usuario (u), grupo (g), tamaño (s), mtime (m), ctime (c) y hash SHA-256

AIDE permite definir grupos de reglas personalizados que combinan multiples verificaciones. Luego se aplican a directorios: `/etc/ NORMAL`.
</details>

### Pregunta 5
¿Que comando genera un informe de todos los intentos de autenticacion fallidos registrados por auditd?

a) `ausearch --failed --auth`
b) `aureport --auth --failed`
c) `aureport --failed`
d) `auditctl --report failed`

<details><summary>Respuesta</summary>

**c)** `aureport --failed`

`aureport --failed` genera un informe de todos los eventos fallidos registrados por auditd. Se puede combinar con `--auth` para filtrar solo autenticacion: `aureport --auth --failed`.
</details>

### Pregunta 6
¿Que herramienta de deteccion de intrusiones incluye capacidades de analisis de logs, integridad de archivos, deteccion de rootkits y respuesta activa?

a) AIDE
b) Tripwire
c) OSSEC/Wazuh
d) Samhain

<details><summary>Respuesta</summary>

**c)** OSSEC/Wazuh

OSSEC (y su fork Wazuh) es un HIDS completo que combina multiples capacidades: analisis de logs en tiempo real, verificacion de integridad de archivos, deteccion de rootkits, respuesta activa automatizada y arquitectura cliente-servidor.
</details>

### Pregunta 7
¿Que comando muestra los ultimos comandos ejecutados por un usuario especifico usando process accounting?

a) `sa -u usuario`
b) `lastcomm usuario`
c) `acct --user usuario`
d) `psacct -l usuario`

<details><summary>Respuesta</summary>

**b)** `lastcomm usuario`

`lastcomm` muestra los comandos ejecutados recientemente en el sistema. Cuando se especifica un nombre de usuario, filtra solo los comandos de ese usuario.
</details>

### Pregunta 8
¿Que archivo contiene las reglas persistentes de auditoria que se cargan al iniciar el sistema?

a) `/etc/audit/auditd.conf`
b) `/etc/audit/rules.d/audit.rules`
c) `/var/log/audit/audit.rules`
d) `/etc/auditctl.conf`

<details><summary>Respuesta</summary>

**b)** `/etc/audit/rules.d/audit.rules`

Las reglas persistentes se almacenan en `/etc/audit/rules.d/`. El archivo principal es `audit.rules`. Se cargan con `augenrules --load`. El archivo `/etc/audit/auditd.conf` es la configuracion del demonio, no de las reglas.
</details>

### Pregunta 9
¿Cual es la diferencia principal entre `aide --check` y `aide --update`?

a) `--check` modifica la base de datos, `--update` solo verifica
b) `--check` solo verifica sin modificar; `--update` verifica y genera una nueva base de datos
c) `--check` es mas rapido, `--update` es mas exhaustivo
d) No hay diferencia, son alias del mismo comando

<details><summary>Respuesta</summary>

**b)** `--check` solo verifica sin modificar; `--update` verifica y genera una nueva base de datos

`aide --check` compara el estado actual con la base de datos existente sin modificarla. `aide --update` hace lo mismo pero ademas genera una nueva base de datos que refleja el estado actual, util tras cambios legitimos del sistema.
</details>

### Pregunta 10
¿Que herramienta analiza logs del sistema y genera informes diarios resumidos por correo electronico?

a) swatch
b) logwatch
c) aureport
d) rsyslog

<details><summary>Respuesta</summary>

**b)** logwatch

Logwatch es un analizador de logs que genera informes resumidos (diarios por defecto) y puede enviarlos por correo electronico. Swatch monitorea en tiempo real; aureport se centra en logs de auditoria; rsyslog es el demonio de logging.
</details>
