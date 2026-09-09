# AI Policy — CloudCerts SelfStudy Hub

> AI assistance is welcome here — this project is built with it. What is not welcome is
> unverified output. Adapted from community AI-contribution policies to fit a
> study-content desktop app; this is our own text, not a copy.

## The one rule: disclose

If you used **any AI assistance** (agents, chat models, code completion) for a pull
request, issue, or content change, **say so** in the PR/issue body, with the extent
(e.g. “scaffolded by an agent, reviewed and tested by me” vs “typo fixes only”).
Trivial whitespace/typo-only edits need no disclosure.

Example:

> Drafted with an AI coding agent (subagent workflow); I verified all exam weights
> against the vendor PDFs linked in `sources` and ran `npm run build` clean.

Failure to disclose is grounds for closing the submission — it prevents reviewers from
applying the right level of scrutiny.

## The second rule: verify-before-invent (exam facts)

This app teaches real certification exams. AI models hallucinate exam-domain weights,
objectives, and URLs with total confidence. Therefore:

- Every exam fact (domain name, weight %, objective, source URL, badge link) MUST be
  checked against the **official vendor page or PDF** before it lands, and recorded in
  the guide's `sources[]` with a fetch date.
- If official data is insufficient (as with CCAR-P / CCAO-F today), the content does NOT
  ship — it goes on the roadmap (`PRD.md` §3.7), not into the catalog.
- Reviewers spot-check sources; a PR with invented or stale exam facts is rejected even
  if the code is perfect.

## Expected workflow for AI-assisted work

1. **Schema-first YAML**: new content fields start in the validator
   (`src/domain/guideSchema.ts`, `mockSchema.ts`), then forms/editor — so AI-generated
   YAML fails loudly instead of silently.
2. **Subagents for parallel exploration**, one owner for the final diff; the human
   contributor must personally understand every line submitted.
3. **Verify-before-invent** for all exam facts (rule above).
4. **Build + stories**: `npm run build` (tsc strict) passes; UI changes include Storybook
   stories; behavior changes update `PRD.md` IDs and `CHANGELOG.md`.
5. **Disclose** per the rule above, including generated review replies.

## What gets closed

- Undisclosed AI output (labeled and closed after one warning).
- Exam content without verifiable official sources.
- Diffs the author cannot explain or did not test.
- Bulk auto-generated guides/banks that bypass schema validation or review.

## Scope

This policy covers code, tests, study content (guides, banks, mocks), translations, and
documentation in this repository.
