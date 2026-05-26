---
title: "212.2 - Servidores FTP: Ejercicios"
tags: [lpic-2, examen-202, tema-212, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.2"
---

# 212.2 - Servidores FTP: Ejercicios

### Pregunta 1

¿Qué directiva de vsftpd.conf confina a todos los usuarios locales dentro de su directorio home?

a) `jail_enable=YES`
b) `chroot_local_user=YES`
c) `restrict_home=YES`
d) `user_home_lock=YES`

<details>
<summary>Respuesta</summary>

**b) `chroot_local_user=YES`**

La directiva `chroot_local_user=YES` hace que vsftpd ejecute un chroot para cada usuario local, confinándolo a su directorio home sin posibilidad de navegar al resto del sistema de archivos.
</details>

---

### Pregunta 2

¿Cuál es la diferencia principal entre FTPS y SFTP?

a) FTPS usa el puerto 22 y SFTP el puerto 21
b) FTPS es FTP sobre TLS/SSL, SFTP es un subsistema de SSH
c) SFTP es más lento que FTPS
d) FTPS no requiere certificados

<details>
<summary>Respuesta</summary>

**b) FTPS es FTP sobre TLS/SSL, SFTP es un subsistema de SSH**

FTPS añade una capa de cifrado TLS/SSL al protocolo FTP tradicional (puerto 21 o 990), mientras que SFTP es un protocolo completamente diferente que funciona como subsistema de SSH (puerto 22) y no tiene relación con FTP.
</details>

---

### Pregunta 3

En el modo FTP pasivo, ¿quién inicia la conexión de datos?

a) El servidor desde el puerto 20
b) El servidor desde un puerto aleatorio
c) El cliente hacia un puerto indicado por el servidor
d) El firewall intermedio

<details>
<summary>Respuesta</summary>

**c) El cliente hacia un puerto indicado por el servidor**

En modo pasivo (PASV), el servidor informa al cliente de un puerto alto donde escuchará, y el cliente inicia la conexión de datos hacia ese puerto. Esto facilita el funcionamiento a través de firewalls y NAT.
</details>

---

### Pregunta 4

¿Qué archivo del sistema impide por defecto que el usuario root acceda por FTP?

a) /etc/vsftpd.conf
b) /etc/pam.d/vsftpd
c) /etc/ftpusers
d) /etc/ssh/sshd_config

<details>
<summary>Respuesta</summary>

**c) /etc/ftpusers**

El archivo `/etc/ftpusers` contiene una lista de usuarios que NO pueden acceder al servicio FTP. Es procesado por el módulo PAM `pam_listfile` y típicamente incluye root, daemon, bin y otros usuarios del sistema.
</details>

---

### Pregunta 5

Si en vsftpd se configura `chroot_local_user=YES` y `chroot_list_enable=YES`, ¿qué ocurre con los usuarios listados en el archivo `chroot_list_file`?

a) Quedan doblemente confinados
b) Son los únicos que quedan confinados
c) No quedan confinados (son la excepción)
d) Se les deniega el acceso FTP

<details>
<summary>Respuesta</summary>

**c) No quedan confinados (son la excepción)**

Cuando `chroot_local_user=YES` está activo, todos los usuarios quedan confinados. Si además `chroot_list_enable=YES`, los usuarios en la lista son la excepción y NO quedan confinados. La lógica de la lista se invierte respecto a cuando `chroot_local_user=NO`.
</details>

---

### Pregunta 6

¿Qué directivas de vsftpd configuran el rango de puertos para el modo pasivo?

a) `passive_port_start` y `passive_port_end`
b) `pasv_min_port` y `pasv_max_port`
c) `data_port_range`
d) `ftp_data_port` y `ftp_data_port_max`

<details>
<summary>Respuesta</summary>

**b) `pasv_min_port` y `pasv_max_port`**

Las directivas `pasv_min_port` y `pasv_max_port` definen el rango de puertos que vsftpd utilizará para las conexiones de datos en modo pasivo. Es necesario abrir este rango de puertos en el firewall.
</details>

---

### Pregunta 7

¿Qué directiva de ProFTPD es equivalente a `chroot_local_user=YES` de vsftpd?

a) `ChrootHome on`
b) `DefaultRoot ~`
c) `RootLogin off`
d) `UserHome /`

<details>
<summary>Respuesta</summary>

**b) `DefaultRoot ~`**

En ProFTPD, la directiva `DefaultRoot ~` confina a cada usuario dentro de su directorio home, funcionando de manera equivalente a `chroot_local_user=YES` en vsftpd.
</details>

---

### Pregunta 8

Un administrador quiere que solo los usuarios listados en `/etc/vsftpd.userlist` puedan conectarse por FTP. ¿Qué configuración necesita?

a) `userlist_enable=YES` y `userlist_deny=YES`
b) `userlist_enable=YES` y `userlist_deny=NO`
c) `userlist_enable=NO` y `allow_list=YES`
d) `user_whitelist=/etc/vsftpd.userlist`

<details>
<summary>Respuesta</summary>

**b) `userlist_enable=YES` y `userlist_deny=NO`**

Con `userlist_enable=YES` se activa el control por lista. Cuando `userlist_deny=NO`, la lista funciona como lista blanca: solo los usuarios que aparecen en ella tienen permitido el acceso. Con `userlist_deny=YES` (valor por defecto), la lista actúa como lista negra.
</details>

---

### Pregunta 9

¿Qué comando de Pure-FTPd se usa para regenerar la base de datos de usuarios virtuales después de realizar cambios?

a) `pure-pw rebuild`
b) `pure-pw update`
c) `pure-pw mkdb`
d) `pure-ftpd --rebuild-db`

<details>
<summary>Respuesta</summary>

**c) `pure-pw mkdb`**

Después de añadir, eliminar o modificar usuarios virtuales con `pure-pw`, es necesario ejecutar `pure-pw mkdb` para regenerar el archivo de base de datos binario (`pureftpd.pdb`) que utiliza Pure-FTPd.
</details>

---

### Pregunta 10

¿Qué directiva de vsftpd.conf fuerza a que las credenciales de los usuarios locales se transmitan cifradas mediante TLS?

a) `ssl_enable=YES`
b) `force_local_logins_ssl=YES`
c) `require_ssl_reuse=YES`
d) `encrypt_passwords=YES`

<details>
<summary>Respuesta</summary>

**b) `force_local_logins_ssl=YES`**

Aunque `ssl_enable=YES` habilita el soporte TLS, no obliga su uso. La directiva `force_local_logins_ssl=YES` fuerza a que la autenticación de usuarios locales se realice obligatoriamente sobre una conexión cifrada con TLS. Complementariamente, `force_local_data_ssl=YES` fuerza el cifrado de los datos transferidos.
</details>
