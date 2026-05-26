# LPIC & Hacking Vault

Plataforma interactiva de estudio para las certificaciones **LPIC-1, LPIC-2 y LPIC-3** del Linux Professional Institute, y base de conocimientos de **seguridad ofensiva y defensiva**.

**[Acceder al sitio web](https://rricajos.github.io/unix)**

## Caracteristicas

- **342 paginas de contenido** organizadas por certificacion y tema
- **Grafo interactivo** de nodos conectados (estilo Obsidian)
- **Quizzes interactivos** con puntuacion y modo examen/practica
- **Flashcards con repeticion espaciada** (algoritmo SM-2, tipo Anki)
- **Dashboard de progreso** con estadisticas de estudio
- **Busqueda full-text** en todo el contenido
- **Dark mode** y diseno responsive
- **Exportar/importar progreso** en JSONL

## Estructura

```
content/
├── lpic-1/          42 subtemas completos (teoria, comandos, ejercicios)
├── lpic-2/          Scaffolded (estructura lista para poblar)
├── lpic-3/          4 especializaciones (300, 303, 305, 306)
├── hacking-vault/   Ofensivo, defensivo, laboratorios
└── recursos/        Glosario, cheatsheets, enlaces, libros
```

## Tecnologia

Construido con [Quartz v5](https://quartz.jzhao.xyz/) y desplegado en GitHub Pages.

## Desarrollo local

```bash
npm install
npx quartz plugin install
npx quartz build --serve
```

Abrir `http://localhost:8080`

## Licencia

MIT
