# Señal MIR

Plataforma de estudios MIR con estilo campus CTO: dashboard por vueltas, generador de exámenes, simulacros, desgloses, guías por asignatura, estadísticas y calendario semanal.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El campus está en `/campus`.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Notas

- Banco demo interno + **preguntas oficiales MIR** importadas desde los PDF de
  [Mirial](https://mirial.es/examen-mir/24-examen-mir/174-descarga-todos-los-examen-mir-en-pdf)
  (cuadernillos del Ministerio de Sanidad).
- El scoring sigue la lógica MIR (+3 / −1 / 0). El progreso se guarda en `localStorage`.
- Para regenerar oficiales: `pip install pymupdf && python scripts/import_mir_oficiales.py`
