import { extraQuestions } from "@/data/bank";

export type Choice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  subjectId: string;
  topic: string;
  year?: number;
  difficulty: 1 | 2 | 3;
  stem: string;
  choices: Choice[];
  correctId: string;
  explanation: string;
  pearl?: string;
  officialNumber?: number;
  annulled?: boolean;
  source?: "demo" | "official" | string;
  needsPlantilla?: boolean;
};

const baseQuestions: Question[] = [
  {
    id: "q-cardio-01",
    subjectId: "cardio",
    topic: "Síndromes coronarios",
    year: 2024,
    difficulty: 2,
    stem: "Varón de 62 años con dolor torácico opresivo de 2 horas de evolución. ECG: elevación del ST en II, III y aVF. ¿Cuál es la actitud más adecuada?",
    choices: [
      { id: "a", text: "Trombólisis inmediata en el centro de salud" },
      { id: "b", text: "Activar código IAM y angioplastia primaria urgente" },
      { id: "c", text: "Prueba de esfuerzo al día siguiente" },
      { id: "d", text: "Alta con AAS y control ambulatorio" },
    ],
    correctId: "b",
    explanation:
      "El IAMCEST inferior requiere reperfusión urgente. La angioplastia primaria es de elección cuando el tiempo puerta-balón es adecuado.",
    pearl: "II, III, aVF = cara inferior (coronaria derecha en la mayoría).",
  },
  {
    id: "q-cardio-02",
    subjectId: "cardio",
    topic: "Insuficiencia cardíaca",
    year: 2023,
    difficulty: 2,
    stem: "Mujer de 74 años con IC-FEr. Está en tratamiento con IECA, betabloqueante y diurético. ¿Qué fármaco ha demostrado reducir mortalidad al añadirse?",
    choices: [
      { id: "a", text: "Digoxina" },
      { id: "b", text: "Antagonista del receptor mineralocorticoide" },
      { id: "c", text: "Amlodipino" },
      { id: "d", text: "Ivabradina como primera opción sin FC elevada" },
    ],
    correctId: "b",
    explanation:
      "Los ARM (espironolactona/eplerenona) forman parte del tratamiento modificador de pronóstico en IC-FEr, junto con IECA/ARNI, BB e iSGLT2.",
    pearl: "Cuádruple terapia: ARNI/IECA + BB + ARM + iSGLT2.",
  },
  {
    id: "q-cardio-03",
    subjectId: "cardio",
    topic: "Arritmias",
    year: 2022,
    difficulty: 3,
    stem: "Paciente estable con taquicardia de QRS ancho regular a 180 lpm. ¿Cuál es el tratamiento de elección inicial?",
    choices: [
      { id: "a", text: "Verapamilo IV" },
      { id: "b", text: "Adenosina o procainamida / cardioversión eléctrica programada" },
      { id: "c", text: "Digoxina oral" },
      { id: "d", text: "Observación sin tratamiento" },
    ],
    correctId: "b",
    explanation:
      "Taquicardia de QRS ancho se trata como TV hasta demostrar lo contrario. En estable: antiarrítmicos o cardioversión sincronizada.",
  },
  {
    id: "q-neumo-01",
    subjectId: "neumo",
    topic: "EPOC",
    year: 2024,
    difficulty: 1,
    stem: "Paciente fumador con disnea de esfuerzo y espirometría FEV1/FVC < 0,7 postbroncodilatador. Diagnóstico más probable:",
    choices: [
      { id: "a", text: "Asma" },
      { id: "b", text: "EPOC" },
      { id: "c", text: "Fibrosis pulmonar idiopática" },
      { id: "d", text: "Bronquiectasias" },
    ],
    correctId: "b",
    explanation:
      "La obstrucción no completamente reversible (FEV1/FVC < 0,7 postbroncodilatador) en fumador define EPOC.",
    pearl: "Diagnóstico de EPOC = clínica + espirometría obstructiva irreversible.",
  },
  {
    id: "q-neumo-02",
    subjectId: "neumo",
    topic: "TEP",
    year: 2023,
    difficulty: 2,
    stem: "Mujer de 45 años con disnea súbita, taquicardia y saturación 88%. Dímero D elevado. Angio-TC: trombo en arteria pulmonar derecha. Tratamiento inicial:",
    choices: [
      { id: "a", text: "AAS 100 mg" },
      { id: "b", text: "Anticoagulación" },
      { id: "c", text: "Antibiótico empírico" },
      { id: "d", text: "Corticoides inhalados" },
    ],
    correctId: "b",
    explanation:
      "El TEP confirmado se trata con anticoagulación. Fibrinolisis solo en inestabilidad hemodinámica.",
  },
  {
    id: "q-neumo-03",
    subjectId: "neumo",
    topic: "Neumonías",
    year: 2021,
    difficulty: 2,
    stem: "Neumonía adquirida en la comunidad en paciente joven sin comorbilidades. Tratamiento ambulatorio de elección:",
    choices: [
      { id: "a", text: "Vancomicina" },
      { id: "b", text: "Amoxicilina o macrólido según guías locales" },
      { id: "c", text: "Meropenem" },
      { id: "d", text: "Anfotericina B" },
    ],
    correctId: "b",
    explanation:
      "En NAC de bajo riesgo sin comorbilidad, amoxicilina (o macrólido si atípicas) es la opción habitual.",
  },
  {
    id: "q-digestivo-01",
    subjectId: "digestivo",
    topic: "Cirrosis",
    year: 2024,
    difficulty: 2,
    stem: "Paciente cirrótico con ascitis a tensión y disnea. Paracentesis evacuadora de 6 L. ¿Qué debe administrarse?",
    choices: [
      { id: "a", text: "Suero salino 0,9%" },
      { id: "b", text: "Albúmina IV" },
      { id: "c", text: "Furosemida sola" },
      { id: "d", text: "Nada, no requiere reposición" },
    ],
    correctId: "b",
    explanation:
      "Tras paracentesis > 5 L se administra albúmina para prevenir disfunción circulatoria postparacentesis.",
    pearl: "Albúmina 8 g por cada litro evacuado (>5 L).",
  },
  {
    id: "q-digestivo-02",
    subjectId: "digestivo",
    topic: "Páncreas",
    year: 2022,
    difficulty: 2,
    stem: "Dolor abdominal intenso en cinturón, lipasa elevada x5 y litiasis biliar. Diagnóstico:",
    choices: [
      { id: "a", text: "Úlcera perforada" },
      { id: "b", text: "Pancreatitis aguda biliar" },
      { id: "c", text: "Infarto mesentérico" },
      { id: "d", text: "Cólico nefrítico" },
    ],
    correctId: "b",
    explanation:
      "Clínica típica + elevación enzimática (>3x) diagnostican pancreatitis. La litiasis es la causa más frecuente junto al alcohol.",
  },
  {
    id: "q-digestivo-03",
    subjectId: "digestivo",
    topic: "IBD",
    year: 2023,
    difficulty: 3,
    stem: "Paciente joven con diarrea sanguinolenta, tenesmo y afectación continua desde el recto en colonoscopia. Más probable:",
    choices: [
      { id: "a", text: "Enfermedad de Crohn" },
      { id: "b", text: "Colitis ulcerosa" },
      { id: "c", text: "Celiaquía" },
      { id: "d", text: "Síndrome de intestino irritable" },
    ],
    correctId: "b",
    explanation:
      "La colitis ulcerosa afecta de forma continua desde el recto. Crohn es transmural y puede ser discontinua.",
  },
  {
    id: "q-neuro-01",
    subjectId: "neuro",
    topic: "Ictus",
    year: 2024,
    difficulty: 2,
    stem: "Hemiparesia derecha y afasia de 90 minutos de evolución. TAC sin hemorragia. ¿Tratamiento?",
    choices: [
      { id: "a", text: "Heparina a dosis plenas" },
      { id: "b", text: "Trombólisis IV con rTPA si no hay contraindicaciones" },
      { id: "c", text: "Aspirina y alta" },
      { id: "d", text: "Cirugía inmediata siempre" },
    ],
    correctId: "b",
    explanation:
      "En ventana de 4,5 h sin hemorragia ni contraindicaciones, la trombólisis IV es de elección. Valorar trombectomía si oclusión de gran vaso.",
    pearl: "Tiempo es cerebro: puerta-aguja < 60 min.",
  },
  {
    id: "q-neuro-02",
    subjectId: "neuro",
    topic: "Epilepsia",
    year: 2021,
    difficulty: 2,
    stem: "Status epiléptico convulsivo. Tras benzodiacepinas IV sin cese. Siguiente fármaco habitual:",
    choices: [
      { id: "a", text: "Carbamazepina oral" },
      { id: "b", text: "Fosfenitoína / valproato / levetiracetam IV" },
      { id: "c", text: "Gabapentina" },
      { id: "d", text: "Litio" },
    ],
    correctId: "b",
    explanation:
      "Tras BZD, se usa un anticomicial IV (fosfenitoína, VPA o LEV) según protocolo.",
  },
  {
    id: "q-neuro-03",
    subjectId: "neuro",
    topic: "Cefaleas",
    year: 2023,
    difficulty: 1,
    stem: "Cefalea unilateral pulsátil con náuseas y fotofobia, duración 12 h, sin aura. Diagnóstico:",
    choices: [
      { id: "a", text: "Cefalea tensional" },
      { id: "b", text: "Migraña sin aura" },
      { id: "c", text: "Cefalea en racimos" },
      { id: "d", text: "HSA" },
    ],
    correctId: "b",
    explanation:
      "Criterios de migraña: unilateral, pulsátil, náuseas/fotofobia, duración 4-72 h.",
  },
  {
    id: "q-endo-01",
    subjectId: "endo",
    topic: "Diabetes",
    year: 2024,
    difficulty: 2,
    stem: "DM2 con ERC (FG 45) e IC. ¿Qué fármaco aporta beneficio cardiorrenal adicional?",
    choices: [
      { id: "a", text: "Glibenclamida" },
      { id: "b", text: "iSGLT2" },
      { id: "c", text: "Repaglinida" },
      { id: "d", text: "Acarbosa" },
    ],
    correctId: "b",
    explanation:
      "Los iSGLT2 reducen eventos cardiovasculares y progresión de ERC, con beneficio también en IC.",
    pearl: "iSGLT2: beneficio cardiorrenal independiente de la HbA1c.",
  },
  {
    id: "q-endo-02",
    subjectId: "endo",
    topic: "Tiroides",
    year: 2022,
    difficulty: 2,
    stem: "Mujer joven con temblor, pérdida de peso y TSH suprimida con T4 libre alta. Bocio difuso. Causa más frecuente:",
    choices: [
      { id: "a", text: "Tiroiditis de Hashimoto" },
      { id: "b", text: "Enfermedad de Graves" },
      { id: "c", text: "Adenoma tóxico" },
      { id: "d", text: "Hipotiroidismo primario" },
    ],
    correctId: "b",
    explanation:
      "En jóvenes con bocio difuso e hipertiroidismo, Graves es la causa más frecuente.",
  },
  {
    id: "q-endo-03",
    subjectId: "endo",
    topic: "Suprarrenal",
    year: 2021,
    difficulty: 3,
    stem: "Hipertensión, hipopotasemia y aldosterona elevada con renina baja. Sospecha:",
    choices: [
      { id: "a", text: "Feocromocitoma" },
      { id: "b", text: "Hiperaldosteronismo primario" },
      { id: "c", text: "Síndrome de Cushing" },
      { id: "d", text: "Hipotiroidismo" },
    ],
    correctId: "b",
    explanation:
      "HTA + hipoK + aldosterona alta/renina baja = hiperaldosteronismo primario (Conn o hiperplasia).",
  },
  {
    id: "q-nefro-01",
    subjectId: "nefro",
    topic: "IRA",
    year: 2024,
    difficulty: 2,
    stem: "Paciente con vómitos, hipotensión y creatinina elevada. Sodio urinario bajo y fracción de excreción de Na < 1%. Tipo de IRA:",
    choices: [
      { id: "a", text: "Nefritis intersticial" },
      { id: "b", text: "Prerrenal" },
      { id: "c", text: "Necrosis tubular aguda establecida" },
      { id: "d", text: "Postrenal" },
    ],
    correctId: "b",
    explanation:
      "FeNa < 1% y NaU bajo sugieren IRA prerrenal con conservación de sodio.",
    pearl: "FeNa <1% prerrenal; >2% NTA (salvo excepciones).",
  },
  {
    id: "q-nefro-02",
    subjectId: "nefro",
    topic: "Trastornos hidroelectrolíticos",
    year: 2023,
    difficulty: 3,
    stem: "Hiponatremia grave sintomática (convulsiones). Tratamiento inicial:",
    choices: [
      { id: "a", text: "Suero hipotónico" },
      { id: "b", text: "Bolos de suero salino hipertónico 3%" },
      { id: "c", text: "Restricción hídrica sola" },
      { id: "d", text: "Desmopresina de entrada" },
    ],
    correctId: "b",
    explanation:
      "En hiponatremia sintomática grave se usan bolos de NaCl 3% para subir 4-6 mmol/L rápidamente.",
  },
  {
    id: "q-nefro-03",
    subjectId: "nefro",
    topic: "ERC",
    year: 2022,
    difficulty: 1,
    stem: "FG 28 ml/min/1,73m² persistente. Estadio de ERC:",
    choices: [
      { id: "a", text: "G2" },
      { id: "b", text: "G3a" },
      { id: "c", text: "G4" },
      { id: "d", text: "G5" },
    ],
    correctId: "c",
    explanation: "G4 corresponde a FG 15-29 ml/min/1,73m².",
  },
  {
    id: "q-infec-01",
    subjectId: "infec",
    topic: "Sepsis",
    year: 2024,
    difficulty: 2,
    stem: "Sospecha de sepsis. Prioridad en la primera hora:",
    choices: [
      { id: "a", text: "Esperar cultivos negativos" },
      { id: "b", text: "Hemocultivos + antibiótico empírico precoz + reanimación hídrica" },
      { id: "c", text: "Solo antipiréticos" },
      { id: "d", text: "Corticoides siempre de entrada" },
    ],
    correctId: "b",
    explanation:
      "Bundle de sepsis: cultivos, antibiótico precoz, fluidos y control del foco.",
    pearl: "Cada hora de retraso antibiótico aumenta mortalidad.",
  },
  {
    id: "q-infec-02",
    subjectId: "infec",
    topic: "VIH",
    year: 2023,
    difficulty: 2,
    stem: "Paciente VIH con CD4 80 y neumonía intersticial. Patógeno más probable:",
    choices: [
      { id: "a", text: "Streptococcus pneumoniae típico lobar" },
      { id: "b", text: "Pneumocystis jirovecii" },
      { id: "c", text: "Mycobacterium tuberculosis siempre cavitado" },
      { id: "d", text: "Candida albicans pulmonar primaria" },
    ],
    correctId: "b",
    explanation:
      "Con CD4 < 200, la neumonía intersticial sugiere PCP (Pneumocystis).",
  },
  {
    id: "q-infec-03",
    subjectId: "infec",
    topic: "TB",
    year: 2021,
    difficulty: 2,
    stem: "Tuberculosis pulmonar sensible. Tratamiento estándar inicial:",
    choices: [
      { id: "a", text: "Isoniazida sola 6 meses" },
      { id: "b", text: "HRZE 2 meses + HR 4 meses" },
      { id: "c", text: "Solo rifampicina 2 semanas" },
      { id: "d", text: "Etambutol indefinido" },
    ],
    correctId: "b",
    explanation:
      "Pauta estándar: 2 meses HRZE + 4 meses HR en TB sensible.",
  },
  {
    id: "q-heme-01",
    subjectId: "heme",
    topic: "Anemias",
    year: 2024,
    difficulty: 1,
    stem: "Anemia microcítica hipocrómica en mujer joven con menorragias. Causa más frecuente:",
    choices: [
      { id: "a", text: "Déficit de B12" },
      { id: "b", text: "Ferropenia" },
      { id: "c", text: "Anemia de enfermedades crónicas siempre" },
      { id: "d", text: "Aplasia medular" },
    ],
    correctId: "b",
    explanation:
      "La ferropenia es la causa más frecuente de anemia microcítica, especialmente con pérdidas menstruales.",
  },
  {
    id: "q-heme-02",
    subjectId: "heme",
    topic: "Coagulación",
    year: 2022,
    difficulty: 3,
    stem: "Alargamiento de TTPa corregido con mezcla, sangrado. Sospecha más probable:",
    choices: [
      { id: "a", text: "Anticoagulante lúpico" },
      { id: "b", text: "Déficit de factor VIII (hemofilia A)" },
      { id: "c", text: "Trombocitopenia aislada" },
      { id: "d", text: "Déficit de vitamina K solo con TTPa" },
    ],
    correctId: "b",
    explanation:
      "TTPa alargado que corrige con mezcla sugiere déficit de factor. En varones: hemofilia A/B.",
  },
  {
    id: "q-heme-03",
    subjectId: "heme",
    topic: "Leucemias",
    year: 2023,
    difficulty: 2,
    stem: "Blastos con bastones de Auer y coagulopatía. Sospecha:",
    choices: [
      { id: "a", text: "LLC" },
      { id: "b", text: "LMA (pensar en promielocítica si CID)" },
      { id: "c", text: "Linfoma Hodgkin" },
      { id: "d", text: "Mieloma múltiple" },
    ],
    correctId: "b",
    explanation:
      "Bastones de Auer = LMA. Si CID, sospechar LPA (t(15;17)).",
  },
  {
    id: "q-reuma-01",
    subjectId: "reuma",
    topic: "AR",
    year: 2024,
    difficulty: 2,
    stem: "Poliartritis simétrica de manos, rigidez matutina >1 h, FR y anti-CCP positivos. Diagnóstico:",
    choices: [
      { id: "a", text: "Artrosis" },
      { id: "b", text: "Artritis reumatoide" },
      { id: "c", text: "Gota" },
      { id: "d", text: "Fibromialgia" },
    ],
    correctId: "b",
    explanation:
      "Clínica típica + serología (FR/anti-CCP) orientan a AR.",
  },
  {
    id: "q-reuma-02",
    subjectId: "reuma",
    topic: "LES",
    year: 2021,
    difficulty: 2,
    stem: "Mujer joven con eritema malar, artralgias, ANA y anti-DNAds positivos. Diagnóstico:",
    choices: [
      { id: "a", text: "Esclerodermia" },
      { id: "b", text: "Lupus eritematoso sistémico" },
      { id: "c", text: "Dermatomiositis" },
      { id: "d", text: "Síndrome de Sjögren primario solo" },
    ],
    correctId: "b",
    explanation:
      "Anti-DNAds es muy específico de LES junto a clínica compatible.",
  },
  {
    id: "q-reuma-03",
    subjectId: "reuma",
    topic: "Vasculitis",
    year: 2023,
    difficulty: 3,
    stem: "Hemorragia alveolar + glomerulonefritis rápidamente progresiva. Anticuerpo más asociado a granulomatosis con poliangeítis:",
    choices: [
      { id: "a", text: "Anti-Jo1" },
      { id: "b", text: "c-ANCA (anti-PR3)" },
      { id: "c", text: "Anti-centrómero" },
      { id: "d", text: "Anti-Scl70" },
    ],
    correctId: "b",
    explanation:
      "GPA se asocia a c-ANCA/PR3. Clínica clásica: vía aérea superior, pulmón y riñón.",
  },
  {
    id: "q-gine-01",
    subjectId: "gine",
    topic: "Gestación",
    year: 2024,
    difficulty: 2,
    stem: "Gestante de 28 semanas con PA 160/100, proteinuria y cefalea. Conducta:",
    choices: [
      { id: "a", text: "Alta y control en 1 mes" },
      { id: "b", text: "Valorar preeclampsia y manejo hospitalario" },
      { id: "c", text: "Solo dieta hiposódica" },
      { id: "d", text: "Inducir siempre a las 28 semanas sin valorar" },
    ],
    correctId: "b",
    explanation:
      "HTA + proteinuria tras semana 20 = preeclampsia. Requiere evaluación y manejo especializado.",
  },
  {
    id: "q-gine-02",
    subjectId: "gine",
    topic: "SOP",
    year: 2022,
    difficulty: 1,
    stem: "Oligomenorrea, hirsutismo y ovarios micropoliquísticos. Diagnóstico más probable:",
    choices: [
      { id: "a", text: "Insuficiencia ovárica primaria" },
      { id: "b", text: "Síndrome de ovario poliquístico" },
      { id: "c", text: "Hiperprolactinemia sola" },
      { id: "d", text: "Embarazo" },
    ],
    correctId: "b",
    explanation:
      "Criterios de Rotterdam: oligoanovulación, hiperandrogenismo y morfología ovárica poliquística.",
  },
  {
    id: "q-gine-03",
    subjectId: "gine",
    topic: "Parto",
    year: 2023,
    difficulty: 2,
    stem: "Dilatation completa, presentación cefálica, bradicardia fetal mantenida. Actitud:",
    choices: [
      { id: "a", text: "Observar 2 horas sin intervención" },
      { id: "b", text: "Parto instrumental o cesárea según condiciones" },
      { id: "c", text: "Tocolisis y alta" },
      { id: "d", text: "Solo oxitocina sin valorar bienestar fetal" },
    ],
    correctId: "b",
    explanation:
      "Pérdida de bienestar fetal en expulsivo indica finalizar el parto de forma inmediata.",
  },
  {
    id: "q-pedia-01",
    subjectId: "pedia",
    topic: "Neonatología",
    year: 2024,
    difficulty: 2,
    stem: "Recién nacido a término con taquipnea precoz, buena saturación con O2 mínimo y RX con líquido en cisuras. Sospecha:",
    choices: [
      { id: "a", text: "Enfermedad de membrana hialina típica" },
      { id: "b", text: "Taquipnea transitoria del RN" },
      { id: "c", text: "Hernia diafragmática" },
      { id: "d", text: "Atresia de esófago" },
    ],
    correctId: "b",
    explanation:
      "La TTRN es frecuente en cesáreas: dificultad respiratoria precoz autolimitada con líquido retenido.",
  },
  {
    id: "q-pedia-02",
    subjectId: "pedia",
    topic: "Vacunas",
    year: 2021,
    difficulty: 1,
    stem: "Vacuna contraindicada en inmunodeprimido grave:",
    choices: [
      { id: "a", text: "Hepatitis B" },
      { id: "b", text: "Triple vírica (sarampión-rubéola-parotiditis)" },
      { id: "c", text: "Tétanos" },
      { id: "d", text: "Antigripal inactivada" },
    ],
    correctId: "b",
    explanation:
      "Las vacunas vivas atenuadas (TV, varicela) están contraindicadas en inmunodepresión grave.",
  },
  {
    id: "q-pedia-03",
    subjectId: "pedia",
    topic: "Infecciones pediátricas",
    year: 2023,
    difficulty: 2,
    stem: "Lactante febril con petequias y mal estado general. Actitud prioritaria:",
    choices: [
      { id: "a", text: "Alta con antitérmicos" },
      { id: "b", text: "Sospechar sepsis/meningococemia y tratar urgentemente" },
      { id: "c", text: "Solo observación 24 h en domicilio" },
      { id: "d", text: "Ecografía abdominal" },
    ],
    correctId: "b",
    explanation:
      "Fiebre + púrpura + afectación = emergencia. Antibiótico precoz y soporte.",
  },
  {
    id: "q-psiquiatria-01",
    subjectId: "psiquiatria",
    topic: "Depresión",
    year: 2024,
    difficulty: 1,
    stem: "Ánimo bajo >2 semanas, anhedonia, insomnio y culpa. Sin psicosis. Tratamiento de primera línea habitual:",
    choices: [
      { id: "a", text: "Haloperidol" },
      { id: "b", text: "ISRS" },
      { id: "c", text: "Benzodiacepina indefinida sola" },
      { id: "d", text: "Litio como monoterapia inicial siempre" },
    ],
    correctId: "b",
    explanation:
      "En depresión mayor sin psicosis, ISRS son primera línea farmacológica junto a psicoterapia.",
  },
  {
    id: "q-psiquiatria-02",
    subjectId: "psiquiatria",
    topic: "Esquizofrenia",
    year: 2022,
    difficulty: 2,
    stem: "Alucinaciones auditivas, delirios de persecución y aplanamiento afectivo >6 meses. Diagnóstico:",
    choices: [
      { id: "a", text: "Trastorno bipolar tipo I" },
      { id: "b", text: "Esquizofrenia" },
      { id: "c", text: "Trastorno de pánico" },
      { id: "d", text: "TOC" },
    ],
    correctId: "b",
    explanation:
      "Síntomas positivos y negativos con duración >6 meses orientan a esquizofrenia.",
  },
  {
    id: "q-psiquiatria-03",
    subjectId: "psiquiatria",
    topic: "Urgencias",
    year: 2023,
    difficulty: 2,
    stem: "Ideación suicida activa con plan. Actitud correcta:",
    choices: [
      { id: "a", text: "Citar en 1 mes" },
      { id: "b", text: "Evaluación urgente y garantizar seguridad (posible ingreso)" },
      { id: "c", text: "Solo aumentar ISRS sin valoración" },
      { id: "d", text: "Dar el alta inmediata" },
    ],
    correctId: "b",
    explanation:
      "Riesgo suicida con plan requiere contención, evaluación urgente y posible hospitalización.",
  },
];

/** Banco completo PuertoMir: demo + alta rentabilidad ampliado. */
export const questions: Question[] = [...baseQuestions, ...extraQuestions];
