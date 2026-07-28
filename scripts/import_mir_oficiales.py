#!/usr/bin/env python3
"""Import official MIR exam PDFs (Mirial mirrors) into JSON banks.

Usage:
  pip install pymupdf
  python scripts/import_mir_oficiales.py

Downloads cuadernillos from Mirial and (optionally) plantillas from public mirrors,
then writes src/data/oficiales/mir-YYYY.json for the Next.js app.
"""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

try:
    import fitz
except ImportError as exc:  # pragma: no cover
    raise SystemExit("Install pymupdf: pip install pymupdf") from exc

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "oficiales"
OUT_DIR = ROOT / "src" / "data" / "oficiales"

MIRIAL_PDFS = {
    2025: "https://mirial.es/images/examen-mir/Examen%20MIR%202025/Examen%20MIR%202025.pdf",
    2024: "https://mirial.es/images/examen-mir/Examen%20MIR%202024/Examen%20MIR%202024.pdf",
    2023: "https://mirial.es/images/examen-mir/Examen%20MIR%202023/Examen%20MIR%202023.pdf",
    2022: "https://mirial.es/images/examen-mir/Examen%20MIR%202022/Examen%20MIR%202022.pdf",
    2021: "https://mirial.es/images/examen-mir/Examen%20MIR%202021/Examen%20MIR%202021.pdf",
    2020: "https://mirial.es/images/examen-mir/Examen%20MIR%202020/Examen%20MIR%202020.pdf",
}

# Pruebas selectivas 2025 (cuadernillo MEDICINA 2025) = examen de enero 2026.
PLANTILLA_2025_BOOKLET = (
    "https://blog.promir.es/wp-content/uploads/2026/02/"
    "Respuestas-definitivas-MIR-2026-Version-de-examen-0.pdf"
)
ANNULLED_2025_BOOKLET = {13, 50, 64, 139, 142, 161, 208}


def download(url: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000:
        return dest
    print(f"Downloading {url}")
    urllib.request.urlretrieve(url, dest)
    return dest


def page_columns(page):
    mid = page.rect.width / 2
    left, right = [], []
    for b in page.get_text("blocks"):
        x0, y0, x1, y1, text = b[:5]
        t = (text or "").strip()
        if not t or re.fullmatch(r"\d{1,3}", t):
            continue
        cx = (x0 + x1) / 2
        (left if cx < mid else right).append((y0, x0, t))
    left.sort(key=lambda x: (round(x[0], 1), x[1]))
    right.sort(key=lambda x: (round(x[0], 1), x[1]))
    return "\n".join(x[2] for x in left), "\n".join(x[2] for x in right)


def extract_body(path: Path, start_page: int = 2) -> str:
    doc = fitz.open(path)
    chunks = []
    for i in range(start_page, doc.page_count):
        l, r = page_columns(doc[i])
        chunks += [l, r]
    text = "\n".join(chunks)
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)
    text = re.sub(r"[ \t]+", " ", text)
    return re.sub(r"\n{3,}", "\n\n", text)


def clean(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


QUESTION_RE = re.compile(
    r"(?ms)^(?P<num>\d{1,3})\.\s+(?P<stem>.*?(?:\?|:))\s*\n(?P<opts>(?:^\s*[1-4]\.\s+.*?(?:\n|\Z)){4,})",
)


def parse_options(opt_text: str):
    matches = list(
        re.finditer(r"(?ms)^\s*([1-4])\.\s+(.*?)(?=^\s*[1-4]\.\s+|\Z)", opt_text)
    )
    for i in range(len(matches) - 3):
        seq = [matches[i + j].group(1) for j in range(4)]
        if seq == ["1", "2", "3", "4"]:
            return [clean(matches[i + j].group(2)) for j in range(4)]
    return None


def parse_questions(text: str):
    qs = []
    for m in QUESTION_RE.finditer(text):
        num = int(m.group("num"))
        if num < 1 or num > 210:
            continue
        stem = clean(m.group("stem"))
        if len(stem) < 25:
            continue
        opts = parse_options(m.group("opts"))
        if not opts:
            continue
        qs.append(
            {
                "number": num,
                "stem": stem,
                "choices": [
                    {"id": "abcd"[i], "text": t, "officialNum": i + 1}
                    for i, t in enumerate(opts)
                ],
                "hasImage": "IMAGEN" in stem.upper(),
            }
        )
    seen = {}
    for q in qs:
        seen.setdefault(q["number"], q)
    return [seen[k] for k in sorted(seen)]


def parse_plantilla(path: Path) -> dict[int, int | None]:
    text = "\n".join(p.get_text() for p in fitz.open(path))
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    skip_prefixes = (
        "V0",
        "RC",
        "Consulta",
        "Respuestas",
        "Titulación",
        "MINISTERIO",
        "Página",
        "versión",
        "Nº",
    )
    tokens = [
        ln
        for ln in lines
        if ln not in {"V0", "RC"} and not any(ln.startswith(s) for s in skip_prefixes)
    ]
    answers: dict[int, int | None] = {}
    i = 0
    while i < len(tokens):
        tok = tokens[i]
        if re.fullmatch(r"\d{1,3}", tok):
            qn = int(tok)
            if 1 <= qn <= 210:
                if i + 1 < len(tokens) and re.fullmatch(r"[1-4]", tokens[i + 1]):
                    answers[qn] = int(tokens[i + 1])
                    i += 2
                else:
                    answers[qn] = None
                    i += 1
                continue
        i += 1
    return answers


def to_app_questions(qs, year: int, plantilla: dict[int, int | None] | None, annulled: set[int]):
    out = []
    for q in qs:
        ans = plantilla.get(q["number"]) if plantilla else None
        is_annulled = q["number"] in annulled or (plantilla is not None and ans is None and q["number"] in plantilla)
        correct_id = None
        if plantilla and ans in (1, 2, 3, 4) and not is_annulled:
            correct_id = "abcd"[ans - 1]
        out.append(
            {
                "id": f"mir{year}-{q['number']:03d}",
                "subjectId": "oficial",
                "topic": f"Oficial MIR · pregunta {q['number']}",
                "year": year,
                "difficulty": 2,
                "stem": q["stem"]
                + (" [Imagen en cuadernillo oficial]" if q["hasImage"] else ""),
                "choices": [{"id": c["id"], "text": c["text"]} for c in q["choices"]],
                "correctId": correct_id or "",
                "explanation": (
                    "Pregunta anulada en la plantilla definitiva del Ministerio."
                    if is_annulled
                    else (
                        "Respuesta según plantilla oficial definitiva (versión 0)."
                        if correct_id
                        else "Plantilla no vinculada. Corrige con el PDF oficial del Ministerio."
                    )
                ),
                "pearl": "Fuente: cuadernillo oficial (espejo Mirial) + plantilla pública.",
                "officialNumber": q["number"],
                "annulled": bool(is_annulled),
                "source": "official",
                "needsPlantilla": not bool(correct_id) and not is_annulled,
            }
        )
    return out


def build_year(booklet_year: int, plantilla_url: str | None = None, annulled: set[int] | None = None):
    pdf = download(MIRIAL_PDFS[booklet_year], RAW_DIR / f"mir-{booklet_year}.pdf")
    qs = parse_questions(extract_body(pdf))
    plantilla = None
    if plantilla_url:
        ppath = download(plantilla_url, RAW_DIR / f"plantilla-mir-{booklet_year}-v0.pdf")
        plantilla = parse_plantilla(ppath)
        for n in annulled or set():
            plantilla[n] = None
    app_qs = to_app_questions(qs, booklet_year, plantilla, annulled or set())
    meta = {
        "label": f"MIR oficial (cuadernillo MEDICINA {booklet_year})",
        "pdfUrl": MIRIAL_PDFS[booklet_year],
        "sourcePage": "https://mirial.es/examen-mir/24-examen-mir/174-descarga-todos-los-examen-mir-en-pdf",
        "parsed": len(app_qs),
        "gradable": sum(1 for q in app_qs if q["correctId"]),
        "annulled": sorted(annulled or []),
        "missingNumbers": [
            i for i in range(1, 211) if i not in {q["officialNumber"] for q in app_qs}
        ],
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"mir-{booklet_year}.json"
    out.write_text(json.dumps({"meta": meta, "questions": app_qs}, ensure_ascii=False, indent=2))
    print(json.dumps(meta, ensure_ascii=False, indent=2))
    print(f"Wrote {out}")


def main():
    build_year(2025, PLANTILLA_2025_BOOKLET, ANNULLED_2025_BOOKLET)
    build_year(2024)


if __name__ == "__main__":
    main()
