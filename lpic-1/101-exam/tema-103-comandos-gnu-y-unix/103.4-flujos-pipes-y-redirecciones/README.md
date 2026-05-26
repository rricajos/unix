# 103.4 - Flujos, pipes y redirecciones

## Peso: 4

## Objetivo del examen
Redirigir flujos y conectarlos entre si para procesar datos de texto de forma eficiente. Incluye redirigir la entrada estandar, la salida estandar y la salida de error estandar, canalizar la salida de un comando a la entrada de otro, usar la salida de un comando como argumento de otro, y enviar la salida a stdout y a un archivo simultaneamente.

## Conocimientos clave
- Redirigir la entrada estandar, la salida estandar y la salida de error estandar
- Canalizar (pipe) la salida de un comando a la entrada de otro comando
- Usar la salida de un comando como argumento de otro comando
- Enviar la salida a stdout y a un archivo simultaneamente

## Archivos, terminos y utilidades
- `tee`
- `xargs`
- Descriptores de archivo: `stdin (0)`, `stdout (1)`, `stderr (2)`
- Redirecciones: `>`, `>>`, `<`, `2>`, `2>>`, `&>`, `2>&1`
- Pipes: `|`
- `/dev/null`
- Here documents: `<< EOF`
- Here strings: `<<<`
- Named pipes (FIFOs): `mkfifo`

## Contenido
| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completado |
| [Comandos clave](notas/comandos-clave.md) | Completado |
| [Ejercicios](ejercicios/ejercicios.md) | Completado |
