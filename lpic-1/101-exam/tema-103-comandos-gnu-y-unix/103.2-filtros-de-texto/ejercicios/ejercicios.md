# 103.2 - Procesar flujos de texto con filtros: Ejercicios

## Pregunta 1
Un administrador necesita ver en tiempo real las nuevas lineas que se van anadiendo a un archivo de log. Cual de los siguientes comandos es el mas adecuado?

A) `head -f /var/log/syslog`
B) `cat -f /var/log/syslog`
C) `tail -f /var/log/syslog`
D) `less -f /var/log/syslog`

<details>
<summary>Respuesta</summary>

**C) `tail -f /var/log/syslog`**

La opcion `-f` (follow) de `tail` permite monitorizar un archivo en tiempo real, mostrando las nuevas lineas a medida que se escriben. Es el metodo estandar para seguir archivos de log. `head` no tiene opcion `-f`. `cat -f` no es una opcion valida para este proposito. `less` se usa para visualizacion interactiva paginada, no para seguimiento en tiempo real.
</details>

---

## Pregunta 2
Dado el archivo `datos.txt` con el siguiente contenido:
```
manzana
naranja
manzana
pera
naranja
manzana
```
Que comando muestra cada fruta unica con su numero de ocurrencias, ordenado de mayor a menor frecuencia?

A) `uniq -c datos.txt | sort -rn`
B) `sort datos.txt | uniq -c | sort -rn`
C) `cat datos.txt | uniq -c | sort -n`
D) `sort -u datos.txt | wc -l`

<details>
<summary>Respuesta</summary>

**B) `sort datos.txt | uniq -c | sort -rn`**

`uniq` solo elimina duplicados **adyacentes**, por lo que primero debemos ordenar con `sort` para que las lineas identicas queden juntas. Luego `uniq -c` cuenta las ocurrencias de cada linea. Finalmente `sort -rn` ordena numericamente en orden reverso (de mayor a menor). La opcion A fallaria porque `uniq` sin `sort` previo no eliminaria todos los duplicados. La opcion C tiene el mismo problema. La opcion D solo contaria cuantas frutas unicas hay, sin dar la frecuencia.

La salida seria:
```
      3 manzana
      2 naranja
      1 pera
```
</details>

---

## Pregunta 3
Cual de los siguientes comandos extrae correctamente los nombres de usuario (primer campo) del archivo `/etc/passwd`?

A) `cut -f 1 /etc/passwd`
B) `cut -d ":" -f 1 /etc/passwd`
C) `cut -c 1 /etc/passwd`
D) `cut -d " " -f 1 /etc/passwd`

<details>
<summary>Respuesta</summary>

**B) `cut -d ":" -f 1 /etc/passwd`**

El archivo `/etc/passwd` usa `:` como delimitador de campos. La opcion `-d ":"` define el delimitador y `-f 1` selecciona el primer campo (nombre de usuario). La opcion A usa el delimitador por defecto (TAB), que no es correcto para `/etc/passwd`. La opcion C extrae solo el primer caracter de cada linea, no el primer campo. La opcion D usa espacio como delimitador, que tampoco es correcto.
</details>

---

## Pregunta 4
Que hace el siguiente comando?
```bash
sed -i.bak 's/error/ERROR/g' registro.log
```

A) Muestra las lineas que contienen "error" en registro.log
B) Reemplaza la primera ocurrencia de "error" por "ERROR" y crea un backup
C) Reemplaza todas las ocurrencias de "error" por "ERROR" en el archivo, guardando una copia del original como registro.log.bak
D) Borra todas las lineas que contienen "error" en registro.log

<details>
<summary>Respuesta</summary>

**C) Reemplaza todas las ocurrencias de "error" por "ERROR" en el archivo, guardando una copia del original como registro.log.bak**

El comando `sed` con la opcion `-i.bak` modifica el archivo in-place (directamente en el archivo) y guarda una copia del archivo original con la extension `.bak` (registro.log.bak). El patron `s/error/ERROR/g` sustituye (`s`) todas (`g` = global) las ocurrencias de "error" por "ERROR". Sin la `g` al final, solo se reemplazaria la primera ocurrencia en cada linea.
</details>

---

## Pregunta 5
Un usuario tiene un archivo con lineas de texto que contienen retornos de carro de Windows (`\r\n`) y necesita convertirlo al formato Linux (`\n`). Cual es el comando correcto?

A) `sed 's/\n/\r\n/g' archivo.txt`
B) `tr -d '\r' < archivo.txt > archivo_limpio.txt`
C) `cut -d '\r' archivo.txt`
D) `fmt -w 80 archivo.txt`

<details>
<summary>Respuesta</summary>

**B) `tr -d '\r' < archivo.txt > archivo_limpio.txt`**

El comando `tr -d '\r'` elimina todos los caracteres de retorno de carro (`\r`, que es el caracter adicional que Windows usa en los finales de linea). La entrada se redirige desde el archivo con `<` (ya que `tr` no acepta nombres de archivo como argumento, solo lee de stdin) y la salida limpia se redirige a un nuevo archivo. La opcion A haria lo contrario (anadira retornos de carro). Las opciones C y D no estan disenadas para este proposito.
</details>

---

## Pregunta 6
Que comando se utilizaria para dividir un archivo de 10 GB en partes de 500 MB cada una con el prefijo "parte_"?

A) `split -l 500 archivo.bin parte_`
B) `cut -b 500M archivo.bin parte_`
C) `split -b 500M archivo.bin parte_`
D) `dd if=archivo.bin bs=500M`

<details>
<summary>Respuesta</summary>

**C) `split -b 500M archivo.bin parte_`**

`split -b 500M` divide el archivo en partes de 500 megabytes cada una. El prefijo "parte_" se usa para nombrar los archivos resultantes (parte_aa, parte_ab, parte_ac, etc.). La opcion A divide por lineas (-l), no por tamanho. La opcion B usa `cut` que es para extraer columnas/campos, no para dividir archivos. La opcion D usa `dd` que puede copiar bloques pero no divide automaticamente en multiples archivos con nombres secuenciales.
</details>

---

## Pregunta 7
Dado el siguiente archivo `numeros.txt`:
```
5
3
8
3
1
5
```
Cual sera la salida del comando `sort -n numeros.txt | uniq -d`?

A) `3` y `5` (las lineas duplicadas)
B) `1` y `8` (las lineas unicas)
C) `1 3 3 5 5 8`
D) Solo `3`

<details>
<summary>Respuesta</summary>

**A) `3` y `5` (las lineas duplicadas)**

Primero `sort -n` ordena numericamente: 1, 3, 3, 5, 5, 8. Luego `uniq -d` muestra **solo las lineas que aparecen mas de una vez** (duplicadas). Como 3 y 5 aparecen dos veces cada una, esas son las que se muestran. La opcion `-d` de uniq es lo contrario de `-u` (que mostraria solo las unicas: 1 y 8).

La salida seria:
```
3
5
```
</details>

---

## Pregunta 8
Un administrador necesita verificar que un archivo ISO descargado no se ha corrompido. Dispone del hash SHA-256 proporcionado por el sitio web. Cual de los siguientes comandos genera el hash SHA-256 del archivo descargado para compararlo?

A) `md5sum ubuntu.iso`
B) `sha256sum ubuntu.iso`
C) `checksum -sha256 ubuntu.iso`
D) `sha512sum ubuntu.iso`

<details>
<summary>Respuesta</summary>

**B) `sha256sum ubuntu.iso`**

`sha256sum` genera el hash SHA-256 de un archivo, que se puede comparar con el hash proporcionado por la fuente original para verificar la integridad del archivo. La opcion A genera un hash MD5, que es un algoritmo diferente y su hash no coincidiria con un SHA-256. La opcion C no es un comando valido en Linux. La opcion D genera un hash SHA-512, que tampoco coincidiria con un SHA-256. Tambien se puede verificar automaticamente con `sha256sum -c archivo.sha256` si se tiene un archivo con el hash esperado.
</details>
