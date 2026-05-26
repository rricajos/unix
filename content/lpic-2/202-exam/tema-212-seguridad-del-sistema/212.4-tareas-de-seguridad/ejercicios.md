---
title: "212.4 - Tareas de seguridad: Ejercicios"
tags: [lpic-2, examen-202, tema-212, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.4"
---

# 212.4 - Tareas de seguridad: Ejercicios

### Pregunta 1

¿Qué archivo de fail2ban se debe crear o modificar para personalizar la configuración sin que las actualizaciones del paquete sobrescriban los cambios?

a) /etc/fail2ban/fail2ban.conf
b) /etc/fail2ban/jail.conf
c) /etc/fail2ban/jail.local
d) /etc/fail2ban/config.local

<details>
<summary>Respuesta</summary>

**c) /etc/fail2ban/jail.local**

El archivo `jail.local` sobrescribe los valores de `jail.conf`. Las actualizaciones del paquete fail2ban pueden sobrescribir `jail.conf`, pero nunca tocan `jail.local`. Por eso, las personalizaciones siempre deben hacerse en `jail.local`.
</details>

---

### Pregunta 2

¿Qué comando de AIDE se usa para crear la base de datos inicial de integridad de archivos?

a) `aide --create`
b) `aide --init`
c) `aide --baseline`
d) `aide --setup`

<details>
<summary>Respuesta</summary>

**b) `aide --init`**

El comando `aide --init` genera la base de datos inicial que contiene las huellas digitales de los archivos monitorizados. Después se debe mover el archivo generado (`aide.db.new`) a su ubicación definitiva (`aide.db`) para poder ejecutar verificaciones con `aide --check`.
</details>

---

### Pregunta 3

¿Qué comando de fail2ban desbloquea la IP 10.0.0.50 del jail sshd?

a) `fail2ban-client unban 10.0.0.50`
b) `fail2ban-client set sshd unbanip 10.0.0.50`
c) `fail2ban-client del sshd 10.0.0.50`
d) `fail2ban-client release sshd 10.0.0.50`

<details>
<summary>Respuesta</summary>

**b) `fail2ban-client set sshd unbanip 10.0.0.50`**

El comando `fail2ban-client set <jail> unbanip <IP>` elimina el bloqueo de una IP específica en el jail indicado. De forma complementaria, `set <jail> banip <IP>` permite bloquear una IP manualmente.
</details>

---

### Pregunta 4

¿Qué herramienta se usa para editar de forma segura el archivo `/etc/sudoers`?

a) `sudoedit`
b) `nano /etc/sudoers`
c) `visudo`
d) `sudo-config`

<details>
<summary>Respuesta</summary>

**c) `visudo`**

El comando `visudo` abre el archivo `/etc/sudoers` con un editor y valida la sintaxis antes de guardarlo. Esto evita dejar el archivo en un estado inválido que podría bloquear el acceso sudo para todos los usuarios del sistema.
</details>

---

### Pregunta 5

¿Qué comando de rkhunter se debe ejecutar después de una actualización legítima del sistema para evitar falsos positivos?

a) `rkhunter --update`
b) `rkhunter --propupd`
c) `rkhunter --refresh`
d) `rkhunter --reset`

<details>
<summary>Respuesta</summary>

**b) `rkhunter --propupd`**

El comando `rkhunter --propupd` actualiza las propiedades de los archivos del sistema almacenadas en la base de datos de referencia. Después de actualizaciones legítimas (apt upgrade, dnf update), los binarios cambian y sin ejecutar `--propupd`, rkhunter los reportaría como modificados. Nota: `--update` actualiza las firmas de rootkits conocidos, no las propiedades del sistema.
</details>

---

### Pregunta 6

¿Qué comando de `ss` muestra todos los puertos TCP en estado de escucha junto con el proceso asociado?

a) `ss -tap`
b) `ss -tlnp`
c) `ss -all --tcp`
d) `ss -ltp --numeric`

<details>
<summary>Respuesta</summary>

**b) `ss -tlnp`**

Las opciones son: `-t` (TCP), `-l` (listening/escucha), `-n` (numérico, sin resolver nombres), `-p` (mostrar proceso). Es el equivalente moderno de `netstat -tlnp`.
</details>

---

### Pregunta 7

En `/etc/security/limits.conf`, ¿qué tipo de límite puede el propio usuario aumentar hasta el valor hard?

a) hard
b) soft
c) max
d) default

<details>
<summary>Respuesta</summary>

**b) soft**

Los límites `soft` representan el valor actual que aplica al usuario, pero este puede aumentarlo con `ulimit` hasta alcanzar el valor `hard`. Solo root puede aumentar los límites `hard`. El tipo `-` establece ambos valores (soft y hard) simultáneamente.
</details>

---

### Pregunta 8

¿Qué comando de auditd crea una regla para vigilar cambios de escritura y atributos en el archivo `/etc/shadow`?

a) `auditctl -a /etc/shadow -p wa -k shadow`
b) `auditctl -w /etc/shadow -p wa -k shadow`
c) `auditctl --watch /etc/shadow --perms wa`
d) `auditctl -m /etc/shadow -t wa -k shadow`

<details>
<summary>Respuesta</summary>

**b) `auditctl -w /etc/shadow -p wa -k shadow`**

La opción `-w` define un archivo o directorio a vigilar, `-p wa` especifica los permisos a monitorizar (w=escritura, a=cambio de atributos), y `-k shadow` asigna una clave para facilitar la búsqueda posterior con `ausearch -k shadow`.
</details>

---

### Pregunta 9

¿Qué opción de nmap realiza un escaneo SYN (half-open) que requiere privilegios de root?

a) `nmap -sT`
b) `nmap -sS`
c) `nmap -sU`
d) `nmap -sP`

<details>
<summary>Respuesta</summary>

**b) `nmap -sS`**

El escaneo SYN (`-sS`) envía paquetes SYN pero no completa el handshake TCP, lo que lo hace más sigiloso y rápido. Requiere privilegios de root porque necesita crear paquetes raw. `-sT` es el escaneo TCP connect (no requiere root), `-sU` es para UDP, y `-sP`/`-sn` es para descubrimiento de hosts.
</details>

---

### Pregunta 10

¿Qué comando de aureport genera un informe de todos los intentos de autenticación registrados por el sistema de auditoría?

a) `aureport --login`
b) `aureport -au`
c) `aureport --auth-report`
d) `aureport -p`

<details>
<summary>Respuesta</summary>

**b) `aureport -au`**

El comando `aureport -au` genera un informe de eventos de autenticación. Otras opciones útiles incluyen: `aureport -f` (acceso a archivos), `aureport --failed` (eventos fallidos), `aureport -l` (logins), y `aureport` sin opciones para un resumen general.
</details>
