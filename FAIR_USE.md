# Fair Use — Question Banks

Evaluación con el Fair Use Checklist (UChicago Copyright Information Center,
adaptado de Columbia/Kenneth Crews): 4 factores, el peso acumulado decide.
Referencias: UChicago fair-use checklist, Columbia, UC, Edutopia, Pitt, USU,
Common Sense Media (ver URLs en el historial de la sesión).

## Caso A — Bancos propios (`soa-c02-bank-01`, contenido original)

Obra: preguntas de muestra redactadas para este repo (no reproduce exámenes
reales ni contenido de terceros). Uso: autoestudio personal sin fines
comerciales. **Veredicto: likely-fair** (registrado en el YAML como
`fair_use`, evaluado el 2026-09-08).

| Factor | A favor | En contra |
|---|---|---|
| Purpose | Research, Scholarship, uso transformativo (preguntas y explicaciones originales) | — |
| Nature | Obra publicada, factual (escenarios operativos) | — |
| Amount | Cantidad pequeña (6 muestras, no el examen) | — |
| Market effect | Sin efecto significativo (contenido propio, no sustituye el examen) | — |

## Caso B — Importación masiva de ExamTopics (Q&A verbatim)

Obra: preguntas/respuestas de exámenes reales aportadas por usuarios.
**Veredicto: avoid** — NO se importa contenido verbatim al repo.

| Factor | A favor | En contra |
|---|---|---|
| Purpose | Estudio/investigación | Sustituye material pago (paywall Contributor Access) |
| Nature | Factual | Consumible (hecho para el examen), creado para ese uso |
| Amount | — | Porción grande y central (bancos de 100-1000 preguntas) |
| Market effect | — | Reemplaza la venta/suscripción; existe mecanismo de licencia; uso repetido y público |

## Política del proyecto

1. Los bancos del repo son de **autoría propia** con `fair_use: likely-fair` y citas a documentación oficial por respuesta (`sources:` con URL + fechas).
2. De ExamTopics solo se enlazan **metadatos verificados** (URL + conteo por examen, `src/infrastructure/examTopics.ts`); el contenido queda fuera del repo.
3. Cada banco nuevo debe traer su bloque `fair_use` (el validador lo exige estructurado); sin él, el editor muestra advertencia.
4. Ante duda, enlazar la fuente oficial en vez de copiar (criterio UChicago para recursos licenciados).
