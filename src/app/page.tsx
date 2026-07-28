import Link from "next/link";
import { questions } from "@/data/questions";
import { getGradableOfficialQuestions } from "@/data/oficiales";

const bankSize = questions.length + getGradableOfficialQuestions().length;

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <section className="landing-hero">
        <div className="noise" />
        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 md:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--signal)] text-sm font-extrabold text-white">
              P
            </span>
            <p className="display text-xl leading-none text-white">PuertoMir</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost !border-white/20 !py-2.5 !px-4 text-sm !text-white">
              Login
            </Link>
            <Link href="/campus" className="btn btn-primary !py-2.5 !px-4 text-sm">
              Entrar al campus
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5.5rem)] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-10 md:justify-center md:px-8 md:pb-24">
          <div className="absolute right-[-8%] top-[18%] hidden h-[420px] w-[420px] rounded-full border border-white/10 md:block">
            <div className="signal-orb absolute inset-[18%] rounded-full border border-[var(--signal)]/40 bg-[var(--signal)]/10" />
            <div className="absolute inset-[34%] rounded-full bg-[var(--signal)]/25 blur-2xl" />
          </div>

          <div className="relative max-w-2xl animate-rise">
            <h1 className="display mb-5 text-[clamp(3.4rem,11vw,6.8rem)] text-white">
              PuertoMir
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/72 md:text-xl">
              El puerto de llegada a tu plaza MIR: calendario dictado, {bankSize}+
              preguntas evaluables, simulacros oficiales y percentil de cohorte.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/campus" className="btn btn-primary sweep-shine">
                Abrir campus
              </Link>
              <a href="#metodo" className="btn btn-ghost !border-white/20 !text-white">
                Ver el método
              </a>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section id="metodo" className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8">
          <div className="mb-12 max-w-2xl animate-fade">
            <p className="chip mb-4">Metodología por vueltas</p>
            <h2 className="display text-3xl md:text-5xl">
              Cuatro vueltas. Cero improvisación.
            </h2>
            <p className="mt-4 text-lg text-[var(--ink-soft)]">
              Contacto, intensivo, repaso y cierre. El calendario milimétrico
              marca qué estudiar; tú ejecutas.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "1ª Vuelta", "Contacto con el material. Simulacros mensuales."],
              ["02", "2ª Vuelta", "Estudio intensivo y esquemas. Evaluación quincenal."],
              ["03", "3ª Vuelta", "Alta rentabilidad y fallos crónicos. Ritmo semanal."],
              ["04", "4ª Vuelta", "Cierre fotográfico pre-MIR. Simulacros de sábado."],
            ].map(([n, title, text], i) => (
              <article
                key={title}
                className={`animate-rise animate-delay-${Math.min(i + 1, 3)} border-t border-[var(--line)] pt-5`}
              >
                <p className="text-sm font-bold text-[var(--signal)]">{n}</p>
                <h3 className="display mt-2 text-2xl">{title}</h3>
                <p className="mt-2 text-[var(--ink-soft)]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[rgba(255,255,255,0.35)] py-20">
          <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
            <div className="mb-12 max-w-2xl">
              <p className="chip mb-4">Lo que decide la plaza</p>
              <h2 className="display text-3xl md:text-5xl">
                Dictado. Simulacro. Percentil.
              </h2>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {[
                [
                  "Banco masivo",
                  `${bankSize}+ ítems corregibles: oficiales MIR 2024/2025 + banco de alta rentabilidad por asignatura.`,
                ],
                [
                  "Simulacros oficiales",
                  "Entra al arena con cuadernillos reales, scoring +3/−1/0 y temporizador de examen.",
                ],
                [
                  "Panel admin",
                  "Crea alumnos, sigue netos y percentiles de cada evaluación desde el panel.",
                ],
              ].map(([title, text], i) => (
                <div key={title} className={`animate-rise animate-delay-${i + 1}`}>
                  <h3 className="display text-2xl">{title}</h3>
                  <p className="mt-3 text-[var(--ink-soft)]">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href="/campus" className="btn btn-accent">
                Empezar en el campus
              </Link>
              <Link href="/login" className="btn btn-secondary">
                Acceso admin / alumnos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-10 text-sm text-[var(--muted)] md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="display text-lg text-[var(--ink)]">PuertoMir</p>
          <p>Preparación MIR · método por vueltas · métricas competitivas</p>
        </div>
      </footer>
    </div>
  );
}
