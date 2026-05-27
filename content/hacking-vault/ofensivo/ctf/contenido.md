---
title: "CTF - Capture The Flag"
tags:
  - hacking
  - ofensivo
  - ctf
  - hacking-ofensivo
tipo: hacking-ofensivo
certificacion: hacking-vault
---

# CTF - Capture The Flag

## Que es un CTF

Un **Capture The Flag** es una competicion de seguridad informatica donde los participantes resuelven desafios tecnicos para obtener "flags" (cadenas de texto ocultas). Es la forma mas practica y divertida de aprender hacking y seguridad.

Formato tipico de flag:
```
flag{esto_es_una_flag_de_ejemplo}
CTF{otro_formato_comun}
picoCTF{formato_picoctf}
```

## Tipos de CTF

### Jeopardy (el mas comun)

Desafios individuales organizados por categorias con puntuacion variable segun dificultad. Cada reto tiene una flag unica.

| Categoria | Descripcion | Herramientas tipicas |
|-----------|-------------|---------------------|
| **Web** | Explotar vulnerabilidades web | Burp Suite, curl, DevTools |
| **Crypto** | Romper o analizar criptografia | CyberChef, Python, SageMath |
| **Forensics** | Analizar archivos, imagenes, memoria | Autopsy, Volatility, binwalk |
| **Reverse** | Ingenieria inversa de binarios | Ghidra, IDA Free, radare2 |
| **Pwn** | Explotacion de binarios (buffer overflow) | GDB + pwndbg, pwntools |
| **Misc** | Variados: OSINT, programacion, logica | Python, Google, creatividad |
| **Steganografia** | Datos ocultos en imagenes/audio | steghide, zsteg, stegsolve |

### Attack-Defense

Equipos defienden sus servicios mientras atacan los de otros equipos. Mas avanzado, requiere equipo coordinado.

### King of the Hill

Controlar un servidor el mayor tiempo posible. Combina ataque y defensa en tiempo real.

> **Nota de seguridad:** Los CTFs son entornos legales y controlados para practicar. Las tecnicas aprendidas solo deben usarse en plataformas autorizadas o con permiso explicito.

## Herramientas esenciales por categoria

### Web

```bash
# Burp Suite - proxy HTTP para interceptar y modificar peticiones
# Descargar de: https://portswigger.net/burp/communitydownload

# curl para peticiones manuales
curl -X POST http://target/login -d "user=admin&pass=' OR 1=1--" -v

# SQLMap para inyeccion SQL automatizada
sqlmap -u "http://target/page?id=1" --dbs --batch

# Gobuster para descubrimiento de directorios
gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt

# ffuf para fuzzing web (mas rapido que gobuster)
ffuf -u http://target/FUZZ -w /usr/share/wordlists/dirb/common.txt
```

### Crypto

```bash
# CyberChef - navaja suiza de decodificacion (web)
# https://gchq.github.io/CyberChef/

# Decodificar Base64
echo "ZmxhZ3twcnVlYmF9" | base64 -d

# Identificar tipo de hash
hashid "5f4dcc3b5aa765d61d8327deb882cf99"
hash-identifier

# Python para scripts de crypto
python3 -c "
from Crypto.Cipher import AES
# ... script personalizado
"

# ROT13
echo "synt{ebg13}" | tr 'a-zA-Z' 'n-za-mN-ZA-M'

# Fuerza bruta con John The Ripper
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```

### Forensics

```bash
# binwalk - analizar y extraer archivos embebidos
binwalk archivo_sospechoso.png
binwalk -e archivo_sospechoso.png  # extraer

# exiftool - metadatos de archivos
exiftool imagen.jpg

# strings - buscar texto legible en binarios
strings -n 8 archivo.bin | grep -i flag

# file - identificar tipo real de archivo
file misterio.dat

# Volatility - analisis de volcados de memoria
volatility -f memory.dump imageinfo
volatility -f memory.dump --profile=Win7SP1x64 pslist
volatility -f memory.dump --profile=Win7SP1x64 filescan | grep flag

# foremost / scalpel - recuperar archivos borrados
foremost -i disk.img -o output/

# Wireshark / tshark para capturas de red
tshark -r capture.pcap -Y "http.request" -T fields -e http.request.uri
tshark -r capture.pcap -Y "tcp contains flag" -x
```

### Reverse Engineering

```bash
# Ghidra - decompilador (la herramienta principal)
# Descargar de: https://ghidra-sre.org/

# GDB con pwndbg para depuracion
gdb ./binario
# En GDB:
# disas main
# break *main+42
# run
# x/20x $esp

# ltrace/strace - trazar llamadas
ltrace ./binario
strace ./binario

# objdump - desensamblado rapido
objdump -d ./binario | grep -A 20 "<main>"

# radare2 - framework de RE
r2 ./binario
# aaa     (analizar todo)
# pdf @main  (imprimir funcion main)
```

### Pwn (Explotacion de binarios)

```python
# pwntools - framework de explotacion en Python
from pwn import *

# Conectar a servicio remoto
r = remote('challenge.ctf.com', 1337)

# O ejecutar binario local
r = process('./vulnerable')

# Generar padding
payload = b'A' * 64  # offset al return address

# Direccion de funcion win (little-endian)
payload += p64(0x00401234)

r.sendline(payload)
r.interactive()
```

```bash
# Encontrar offset exacto
cyclic 200          # generar patron
cyclic -l 0x61616168  # buscar offset

# Checksec - verificar protecciones del binario
checksec ./binario
# CANARY, NX, PIE, RELRO
```

### Steganografia

```bash
# steghide - ocultar/extraer datos en imagenes JPEG
steghide extract -sf imagen.jpg
steghide extract -sf imagen.jpg -p ""  # sin password

# zsteg - analizar PNG/BMP
zsteg imagen.png
zsteg -a imagen.png  # todos los modos

# stegsolve - analisis visual de planos de bits
# java -jar stegsolve.jar

# Comprobar LSB (Least Significant Bit)
python3 -c "
from PIL import Image
img = Image.open('imagen.png')
pixels = list(img.getdata())
bits = ''.join([str(p[0] & 1) for p in pixels[:800]])
text = ''.join([chr(int(bits[i:i+8], 2)) for i in range(0, len(bits), 8)])
print(text)
"
```

## Metodologia general para resolver retos

### Paso 1: Reconocimiento

```
1. Leer el enunciado con atencion (las pistas estan ahi)
2. Descargar y examinar los archivos proporcionados
3. Identificar la categoria real (a veces no es la etiquetada)
4. file, strings, xxd, binwalk como primer analisis
```

### Paso 2: Analisis

```
1. Aplicar herramientas especificas de la categoria
2. Buscar patrones conocidos (Base64, hex, ROT13, XOR)
3. Consultar writeups de retos similares anteriores
4. No descartar lo obvio (a veces la flag esta en los metadatos)
```

### Paso 3: Explotacion / Resolucion

```
1. Desarrollar exploit o procedimiento
2. Probar en local primero si es posible
3. Ejecutar contra el target
4. Capturar la flag
```

### Paso 4: Documentacion

Escribir un writeup aunque sea breve. Es la mejor forma de consolidar lo aprendido.

## Plantilla de Writeup

```markdown
# [Nombre del reto] - [Puntos] pts

## Categoria
Web / Crypto / Forensics / Reverse / Pwn / Misc

## Enunciado
(Copiar el enunciado original)

## Archivos
- archivo1.bin
- archivo2.png

## Solucion

### Reconocimiento
(Que observaste al principio)

### Analisis
(Herramientas usadas y hallazgos)

### Explotacion
(Pasos para obtener la flag)

## Flag
`flag{la_flag_encontrada}`

## Lecciones aprendidas
(Que aprendiste nuevo)
```

## Plataformas de practica

| Plataforma | Nivel | Gratuito | Tipo |
|------------|-------|----------|------|
| [PicoCTF](https://picoctf.org/) | Principiante | Si | Jeopardy permanente |
| [OverTheWire](https://overthewire.org/) | Principiante | Si | Wargames SSH |
| [TryHackMe](https://tryhackme.com/) | Principiante-Medio | Parcial | Labs guiados |
| [HackTheBox](https://www.hackthebox.com/) | Medio-Avanzado | Parcial | Labs + CTF |
| [CryptoHack](https://cryptohack.org/) | Principiante-Medio | Si | Solo Crypto |
| [pwnable.kr](http://pwnable.kr/) | Medio-Avanzado | Si | Solo Pwn |
| [Root-Me](https://www.root-me.org/) | Medio | Si | Variado |
| [CTFtime](https://ctftime.org/) | Todos | Si | Calendario de CTFs |

## Consejos para competiciones

1. **Empieza por los retos faciles** - Los puntos son puntos, suma rapido
2. **Lee todos los enunciados** antes de empezar - quizas hay uno facil que otros ignoran
3. **Trabaja en equipo** - Divide por especialidades (web, crypto, pwn...)
4. **Toma notas** de todo lo que intentas, incluso si falla
5. **No te atasques** - Si llevas 30 min sin avanzar, cambia de reto
6. **Busca patrones** - Muchos CTFs repiten conceptos con variaciones
7. **Automatiza** lo repetitivo con scripts Python
8. **Duerme** en CTFs de 48h - Un cerebro descansado resuelve mas

## Cheatsheet rapido

```bash
# Identificar archivos
file *
xxd archivo.bin | head
binwalk archivo

# Buscar flags
grep -r "flag{" .
grep -r "CTF{" .
strings archivo | grep -iE "(flag|ctf)\{"

# Decodificar rapido
echo "base64string" | base64 -d
python3 -c "print(bytes.fromhex('hex_string'))"
python3 -c "import binascii; print(binascii.unhexlify('hex'))"

# Web rapido
curl -s http://target | grep flag
curl -s http://target/robots.txt
curl -s http://target/.git/HEAD

# Crypto rapido
# ROT bruteforce
for i in $(seq 1 25); do echo "texto" | tr "$(echo {a..z} | tr -d ' ')" "$(echo {a..z} | tr -d ' ' | cut -c$((i+1))-26; echo {a..z} | tr -d ' ' | cut -c1-$i)"; done
```
