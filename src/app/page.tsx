import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,33,43,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(18,33,43,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 78%)",
        }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand)] text-sm font-extrabold text-white">
            S
          </span>
          <div>
            <p className="display text-xl leading-none">Señal MIR</p>
            <p className="text-xs text-[var(--muted)]">Campus de preparación</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--ink-soft)] md:flex">
          <a href="#metodo">Método</a>
          <a href="#herramientas">Herramientas</a>
          <Link href="/campus" className="btn btn-primary !py-2.5 !px-4 text-sm">
            Entrar al campus
          </Link>
        </nav>
        <Link href="/campus" className="btn btn-primary !py-2.5 !px-4 text-sm md:hidden">
          Campus
        </Link>
      </header>

      <main className="relative z-10">
        <section className="relative mx-auto grid min-h-[78vh] w-full max-w-6xl items-end gap-10 px-5 pb-16 pt-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 md:pb-24">
          <div className="animate-rise">
            <p className="chip mb-5">4 vueltas · calendario dictado · percentil</p>
            <h1 className="display mb-5 max-w-xl text-5xl leading-[1.02] text-[var(--ink)] md:text-6xl lg:text-7xl">
              Señal MIR
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">
              Replica el modelo CTO: la plataforma dicta el estudio diario,
              evalúa con simulacros idénticos al MIR y te empuja con netos y
              percentil de cohorte.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/campus" className="btn btn-primary">
                Abrir campus
              </Link>
              <a href="#herramientas" className="btn btn-secondary">
                Ver herramientas
              </a>
            </div>
          </div>

          <div className="relative animate-rise animate-delay-1">
            <div className="hero-sheen" />
            <div className="panel relative overflow-hidden p-6 md:p-8">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(11,95,99,0.92), rgba(8,69,72,0.88) 48%, rgba(196,92,38,0.55))",
                }}
              />
              <div
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, white 0 1px, transparent 1.5px), radial-gradient(circle at 80% 40%, white 0 1px, transparent 1.5px)",
                  backgroundSize: "18px 18px, 22px 22px",
                }}
              />
              <div className="relative text-white">
                <p className="mb-2 text-sm uppercase tracking-[0.18em] text-white/70">
                  Hoy en tu plan
                </p>
                <h2 className="display mb-6 text-3xl md:text-4xl">
                  2ª Vuelta · Neurología
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="font-semibold">Guía del día</p>
                    <p className="text-white/75">Ictus + epilepsia · 50 + 50 preguntas</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="font-semibold">Simulacro 25</p>
                    <p className="text-white/75">Miércoles · 210 preguntas · 4h 30m</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="font-semibold">Puntos débiles</p>
                    <p className="text-white/75">Nefro · Infecciosas · Hematología</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="metodo" className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
          <div className="mb-10 max-w-2xl animate-fade">
            <p className="chip mb-4">Metodología</p>
            <h2 className="display text-3xl md:text-4xl">Cuatro vueltas. Una plaza.</h2>
            <p className="mt-3 text-[var(--ink-soft)]">
              Hiperestructurado y directivo: contacto, intensivo, repaso y cierre.
              El alumno no decide qué estudiar; el calendario milimétrico lo marca.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "1ª Vuelta",
                text: "Contacto con el material y clases de base. Simulacros mensuales.",
              },
              {
                title: "2ª Vuelta",
                text: "Estudio intensivo, esquemas y memorización. Simulacros quincenales.",
              },
              {
                title: "3ª Vuelta",
                text: "Repaso de alta rentabilidad y fallos crónicos. Arranque semanal.",
              },
              {
                title: "4ª Vuelta",
                text: "Cierre fotográfico pre-MIR. Simulacros semanales (sábados).",
              },
            ].map((item, i) => (
              <article
                key={item.title}
                className={`panel p-6 animate-rise animate-delay-${Math.min(i + 1, 3)}`}
              >
                <p className="mb-3 text-sm font-bold text-[var(--accent)]">0{i + 1}</p>
                <h3 className="display mb-2 text-2xl">{item.title}</h3>
                <p className="text-[var(--ink-soft)]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="herramientas" className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="chip mb-4">Herramientas</p>
            <h2 className="display text-3xl md:text-4xl">
              Todo lo que usas en un campus serio
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Calendario dictado", "Qué estudiar hoy, con horas según rentabilidad."],
              ["Simulacros MIR", "210 ítems, 4h30, +3/−1, percentil de cohorte."],
              ["Netos + percentil", "Te ubica frente a miles de alumnos, no frente a un 10."],
              ["Informe por asignatura", "Fuerte en Pediatría, débil en Neuro: el repaso se personaliza."],
              ["Test a la carta", "30/50 preguntas del tema del día para afianzar."],
              ["Desgloses oficiales", "Preguntas reales de convocatorias anteriores."],
            ].map(([title, text]) => (
              <article key={title} className="panel p-5">
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm text-[var(--ink-soft)]">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/campus" className="btn btn-accent">
              Empezar en el campus
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] px-5 py-8 text-sm text-[var(--muted)] md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="display text-lg text-[var(--ink)]">Señal MIR</p>
          <p>Plataforma demo de preparación MIR · estilo campus CTO</p>
        </div>
      </footer>
    </div>
  );
}
