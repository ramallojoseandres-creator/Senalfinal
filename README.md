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

Los contenidos médicos son de demostración (banco reducido). El scoring sigue la lógica MIR (+3 / −1 / 0) y el progreso se guarda en `localStorage`.
