# 102.4 - Gestion de paquetes Debian: Ejercicios

## Ejercicio 1
**Cual es la diferencia entre `dpkg -r paquete` y `dpkg -P paquete`? Cual seria el equivalente con apt?**

<details>
<summary>Ver respuesta</summary>

- **`dpkg -r paquete`** (remove): Desinstala el paquete pero **conserva los archivos de configuracion**. Esto permite reinstalar el paquete mas tarde y recuperar la configuracion anterior.

- **`dpkg -P paquete`** (purge): **Elimina todo**: archivos del programa Y archivos de configuracion. Es una desinstalacion completa.

Equivalentes con apt:
- `dpkg -r` equivale a **`apt remove paquete`**
- `dpkg -P` equivale a **`apt purge paquete`**

Un paquete eliminado con `-r` aparecera con estado `rc` en `dpkg -l` (removed, config-files). Un paquete purgado desaparecera completamente o mostrara `pn`/`un`.
</details>

---

## Ejercicio 2
**Necesitas saber que paquete instalo el archivo `/usr/bin/vim`. Escribe el comando que usarias. Que comando usarias si el paquete NO esta instalado y quieres buscar en los repositorios?**

<details>
<summary>Ver respuesta</summary>

Para buscar en **paquetes instalados**:
```bash
dpkg -S /usr/bin/vim
```

Para buscar en **todos los repositorios** (paquete instalado o no):
```bash
apt-file search /usr/bin/vim
```

Nota: `apt-file` requiere tener actualizada su base de datos:
```bash
sudo apt-file update
```

La diferencia clave:
- `dpkg -S` solo busca entre los paquetes **instalados** en el sistema
- `apt-file search` busca en **todos los paquetes disponibles** en los repositorios configurados
</details>

---

## Ejercicio 3
**Explica la diferencia entre `apt update`, `apt upgrade` y `apt full-upgrade`. En que orden se ejecutan normalmente?**

<details>
<summary>Ver respuesta</summary>

- **`apt update`**: Descarga la lista actualizada de paquetes disponibles desde los repositorios configurados en `/etc/apt/sources.list`. **No instala ni actualiza nada**, solo actualiza la informacion de que paquetes existen y en que versiones.

- **`apt upgrade`**: Actualiza todos los paquetes instalados a su version mas reciente. Es una actualizacion **segura**: nunca elimina paquetes existentes ni instala paquetes nuevos. Si una actualizacion requiere eliminar algo, la omite.

- **`apt full-upgrade`** (equivalente a `apt-get dist-upgrade`): Actualizacion **completa** que puede eliminar paquetes obsoletos e instalar nuevas dependencias si es necesario para completar la actualizacion.

**Orden normal de ejecucion:**
```bash
sudo apt update          # 1. Actualizar listas
sudo apt upgrade         # 2. Actualizar paquetes (seguro)
# o
sudo apt full-upgrade    # 2. Actualizacion completa (si es necesario)
```

Siempre se ejecuta `apt update` primero para tener la informacion actualizada.
</details>

---

## Ejercicio 4
**Tienes un paquete `.deb` descargado manualmente y al intentar instalarlo con `dpkg -i paquete.deb` falla porque faltan dependencias. Como solucionas el problema?**

<details>
<summary>Ver respuesta</summary>

Cuando `dpkg -i` falla por dependencias faltantes, el paquete queda en estado "parcialmente instalado". Para resolverlo:

**Opcion 1** (recomendada):
```bash
# Primero intentar instalar el paquete
sudo dpkg -i paquete.deb

# Si falla por dependencias, reparar con apt
sudo apt --fix-broken install
# o equivalentemente:
sudo apt-get install -f
```

Esto descargara e instalara las dependencias faltantes de los repositorios y completara la instalacion del paquete.

**Opcion 2** (mas directa, si el .deb es local):
```bash
# Usar apt para instalar el .deb local (resuelve dependencias automaticamente)
sudo apt install ./paquete.deb
```

El prefijo `./` es importante para que apt interprete la ruta como un archivo local y no como un nombre de paquete del repositorio.
</details>

---

## Ejercicio 5
**Describe la estructura del archivo `/etc/apt/sources.list`. Escribe una linea de ejemplo para un repositorio de Ubuntu y explica cada campo.**

<details>
<summary>Ver respuesta</summary>

Estructura de una linea:
```
tipo  URI  distribucion  componente1 [componente2 ...]
```

Ejemplo:
```
deb http://archive.ubuntu.com/ubuntu jammy main restricted universe multiverse
```

Explicacion de cada campo:

| Campo | Valor | Significado |
|-------|-------|-------------|
| Tipo | `deb` | Paquetes binarios compilados (usar `deb-src` para codigo fuente) |
| URI | `http://archive.ubuntu.com/ubuntu` | Direccion del servidor del repositorio |
| Distribucion | `jammy` | Nombre en clave de la version (Ubuntu 22.04) |
| Componente 1 | `main` | Software libre soportado oficialmente por Canonical |
| Componente 2 | `restricted` | Controladores propietarios soportados |
| Componente 3 | `universe` | Software libre mantenido por la comunidad |
| Componente 4 | `multiverse` | Software propietario/no libre |

Los repositorios adicionales de terceros se pueden anadir en archivos individuales dentro de `/etc/apt/sources.list.d/` con extension `.list`.
</details>

---

## Ejercicio 6
**Que comando usarias para listar todos los archivos instalados por el paquete `openssh-server`? Y para ver sus dependencias?**

<details>
<summary>Ver respuesta</summary>

Para **listar archivos** instalados por el paquete:
```bash
dpkg -L openssh-server
```

Esto mostrara la lista completa de archivos que el paquete instalo en el sistema (binarios, archivos de configuracion, paginas de manual, etc.).

Para ver las **dependencias** del paquete:
```bash
apt-cache depends openssh-server
```

Esto mostrara todos los paquetes de los que depende `openssh-server`.

Para ver las **dependencias inversas** (que paquetes dependen de este):
```bash
apt-cache rdepends openssh-server
```

Para ver el **estado completo** del paquete (version, dependencias, descripcion):
```bash
dpkg -s openssh-server
# o
apt show openssh-server
```
</details>

---

## Ejercicio 7
**Despues de instalar un paquete, necesitas reconfigurar la zona horaria del sistema. Que comando usarias? Que hace exactamente `dpkg-reconfigure`?**

<details>
<summary>Ver respuesta</summary>

Para reconfigurar la zona horaria:
```bash
sudo dpkg-reconfigure tzdata
```

**`dpkg-reconfigure`** vuelve a ejecutar los **scripts de configuracion post-instalacion** de un paquete que ya esta instalado. Es como si el paquete se estuviera configurando por primera vez despues de la instalacion.

Esto es util cuando:
- Se necesita cambiar la configuracion de un paquete (zona horaria, locales, teclado)
- La configuracion original se ha corrompido
- Se quiere volver a los valores por defecto

Otros ejemplos comunes:
```bash
sudo dpkg-reconfigure locales           # Reconfigurar idiomas del sistema
sudo dpkg-reconfigure keyboard-configuration  # Reconfigurar teclado
sudo dpkg-reconfigure console-setup     # Reconfigurar consola
```

No confundir con `dpkg --configure -a`, que intenta **completar la configuracion** de paquetes que quedaron en estado parcialmente configurado (por ejemplo, tras una instalacion interrumpida).
</details>

---

## Ejercicio 8
**En la salida de `dpkg -l`, un paquete aparece con el estado `rc`. Que significa esto y como lo eliminarias completamente del sistema?**

<details>
<summary>Ver respuesta</summary>

El estado **`rc`** significa:
- **`r`** (desired: Remove) - Se solicito la eliminacion del paquete
- **`c`** (status: Config-files) - Los archivos de configuracion aun estan en el sistema

Es decir, el paquete fue desinstalado con `dpkg -r` o `apt remove`, que eliminaron los archivos del programa pero **dejaron los archivos de configuracion**.

Para eliminar completamente el paquete (incluyendo la configuracion residual):

```bash
# Purgar un paquete especifico
sudo dpkg -P nombre_paquete
# o
sudo apt purge nombre_paquete
```

Para purgar todos los paquetes en estado `rc`:
```bash
dpkg -l | grep '^rc' | awk '{print $2}' | xargs sudo dpkg -P
```

Este comando:
1. Lista todos los paquetes (`dpkg -l`)
2. Filtra los que estan en estado `rc` (`grep '^rc'`)
3. Extrae el nombre del paquete (`awk '{print $2}'`)
4. Los purga (`xargs sudo dpkg -P`)
</details>
