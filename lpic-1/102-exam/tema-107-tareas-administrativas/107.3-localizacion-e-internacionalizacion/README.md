# 107.3 - Localizacion e internacionalizacion

## Peso: 3

## Objetivo del examen
Configurar la localizacion e internacionalizacion del sistema. Configurar la zona horaria y la codificacion de caracteres. Comprender las variables de entorno de locale y los archivos de configuracion asociados.

## Conocimientos clave
- Variables de locale y su orden de prioridad (LC_ALL > LC_* > LANG)
- Configuracion de la zona horaria
- Codificaciones de caracteres: ASCII, ISO-8859, UTF-8
- Conversion entre codificaciones con iconv
- Herramientas de configuracion: locale, localectl, timedatectl, tzselect

## Archivos, terminos y utilidades
- `LANG`, `LC_ALL`, `LC_CTYPE`, `LC_MESSAGES`, `LC_NUMERIC`, `LC_TIME`, `LC_COLLATE`, `LC_MONETARY`
- `locale`, `locale -a`
- `/etc/locale.conf`, `/etc/default/locale`
- `localectl`
- `iconv`
- `TZ`, `/etc/timezone`, `/etc/localtime`
- `/usr/share/zoneinfo/`
- `tzselect`, `timedatectl`
- `dpkg-reconfigure tzdata`
- `date`

## Contenido

| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completado |
| [Comandos clave](notas/comandos-clave.md) | Completado |
| [Ejercicios](ejercicios/ejercicios.md) | Completado |
