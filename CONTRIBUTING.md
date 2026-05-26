# Guia de Contribucion

## Idioma

Todo el contenido debe estar en **espanol**. Los terminos tecnicos pueden mantenerse en ingles cuando no exista una traduccion clara (e.g., "kernel", "pipe", "socket").

## Nombrado de archivos y directorios

- Minusculas con guiones: `101.1-configuracion-de-hardware/`
- Sin tildes ni caracteres especiales en nombres de archivo
- Los subtemas llevan el numero del objetivo LPI: `XXX.X-nombre/`

## Estructura de cada subtema

```
XXX.X-nombre/
├── README.md           # Objetivo, peso, conocimientos clave
├── notas/
│   ├── teoria.md       # Apuntes teoricos completos
│   └── comandos-clave.md  # Referencia rapida de comandos
├── scripts/
│   └── ejemplo.sh      # Scripts de practica (usar template)
└── ejercicios/
    └── ejercicios.md   # Preguntas tipo examen
```

## Formato de notas (teoria.md)

```markdown
# XXX.X - Nombre del tema

## Conceptos

### Concepto 1
Explicacion...

### Concepto 2
Explicacion...

## Comandos importantes

### `comando`
- **Funcion**: Que hace
- **Sintaxis**: `comando [opciones] argumento`
- **Opciones comunes**:
  - `-a`: descripcion
  - `-b`: descripcion
- **Ejemplo**:
  ```bash
  comando -a argumento
  ```

## Archivos de configuracion

| Archivo | Proposito |
|---------|-----------|
| `/etc/archivo` | Descripcion |
```

## Formato de ejercicios

Usar etiquetas `<details>` para ocultar respuestas:

```markdown
### Pregunta 1
Enunciado de la pregunta

a) Opcion A
b) Opcion B
c) Opcion C
d) Opcion D

<details>
<summary>Respuesta</summary>
c) Opcion C - Explicacion de por que es correcta.
</details>
```

## Scripts

- Usar la plantilla de `assets/templates/script-template.sh`
- Incluir `set -euo pipefail` siempre
- Comentar en espanol
- Incluir header con tema, descripcion y certificacion
- Incluir advertencia de entorno de pruebas

## Cross-referencias

Cuando un tema LPIC se relaciona con el hacking vault (o viceversa), incluir una seccion al final:

```markdown
## Referencias cruzadas
- Ver tambien: [Hardening Linux](../../../hacking-vault/defensivo/hardening/)
```

## Commits

- Mensajes en espanol o ingles (consistente dentro de un PR)
- Formato: `tipo(seccion): descripcion`
  - `feat(lpic-1/101.1): agregar teoria de configuracion de hardware`
  - `feat(hacking/recon): agregar notas de nmap`
  - `fix(lpic-1/103.2): corregir ejemplo de sed`
  - `docs(readme): actualizar tracker de progreso`
