# LPIC & Hacking Vault

Plataforma interactiva de estudio para las certificaciones **LPIC-1, LPIC-2 y LPIC-3** del Linux Professional Institute, y base de conocimientos de **seguridad ofensiva y defensiva**.

**[Acceder al sitio web](https://rricajos.github.io/unix)**

## Caracteristicas

- **821 paginas de contenido** organizadas por certificacion y tema
- **143 subtemas** completos con teoria, comandos clave y ejercicios
- **2.100 flashcards** con repeticion espaciada (algoritmo SM-2, tipo Anki)
- **1.910+ preguntas de practica** con explicaciones detalladas
- **8 simulacros de examen** con temporizador y correccion automatica
- **4 laboratorios practicos** con escenarios reales
- **Grafo interactivo** de nodos conectados (estilo Obsidian)
- **Quizzes interactivos** con puntuacion y modo examen/practica
- **Dashboard de progreso** con estadisticas de estudio
- **Busqueda full-text** en todo el contenido
- **Dark mode** y diseno responsive
- **Exportar/importar progreso** en JSONL

## Estructura

```
content/
├── lpic-1/          42 subtemas (examenes 101-500 y 102-500)
├── lpic-2/          41 subtemas (examenes 201-450 y 202-450)
├── lpic-3/          60 subtemas en 4 especializaciones:
│   ├── 300/           Entornos mixtos (Samba, AD, LDAP)
│   ├── 303/           Seguridad (PKI, SELinux, IDS, VPN)
│   ├── 305/           Virtualizacion (KVM, Docker, Kubernetes)
│   └── 306/           Alta disponibilidad (Pacemaker, DRBD, Ceph)
├── hacking-vault/   Seguridad ofensiva, defensiva y laboratorios
├── simulacros/      4 simulacros de examen (101, 102, 201, 202)
└── recursos/        Glosario, cheatsheets, enlaces, libros
```

Cada subtema incluye:
- `teoria.md` — Contenido teorico detallado
- `comandos-clave.md` — Referencia rapida de comandos
- `ejercicios.md` — Preguntas de practica con respuestas
- `flashcards.md` — Tarjetas de repaso generadas automaticamente

## Tecnologia

Construido con [Quartz v5](https://quartz.jzhao.xyz/) y desplegado en GitHub Pages.

## Desarrollo local

```bash
npm install
npx quartz plugin install
npx quartz build --serve
```

Abrir `http://localhost:8080`

## Scripts de utilidad

```bash
# Generar flashcards desde ejercicios y teoria
node scripts/generate-flashcards.mjs

# Generar simulacros de examen
node scripts/generate-simulacros.mjs
```

## Licencia

El codigo fuente de esta plataforma se distribuye bajo licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para mas detalles.

## Aviso legal

### Marcas registradas

**LPIC**, **LPIC-1**, **LPIC-2**, **LPIC-3** y el logotipo de LPI son marcas registradas del [Linux Professional Institute](https://www.lpi.org/). Este proyecto **no esta afiliado, patrocinado ni avalado** por el Linux Professional Institute. Los nombres de las certificaciones se utilizan unicamente con fines de referencia e identificacion del contenido de estudio.

### Uso educativo

Este repositorio ha sido creado con fines exclusivamente **educativos y de estudio personal**. El contenido se ha elaborado de forma independiente y no reproduce textualmente material protegido por derechos de autor del LPI. Las preguntas de practica, flashcards y simulacros son **originales** y no provienen de examenes oficiales.

Para material oficial de preparacion, consulta los [materiales de estudio del LPI](https://www.lpi.org/our-certifications/).

### Contenido de seguridad informatica

La seccion **Hacking Vault** contiene informacion sobre tecnicas de seguridad ofensiva y defensiva destinada exclusivamente a:

- Preparacion de certificaciones de seguridad
- Practica en entornos de laboratorio autorizados (CTFs, maquinas virtuales)
- Comprension defensiva de vectores de ataque

**El uso de estas tecnicas contra sistemas sin autorizacion explicita es ilegal** y puede conllevar responsabilidades penales. El autor no se hace responsable del uso indebido de la informacion contenida en este repositorio. Respeta siempre la ley y obtiene permiso por escrito antes de realizar pruebas de seguridad.

## Autor

**Ricard Penin Honrubia** ([@rricajos](https://github.com/rricajos))
