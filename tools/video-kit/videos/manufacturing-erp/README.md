# Manufacturing ERP "Watch overview" video (source)

Source for `public/videos/manufacturing-erp-tour.mp4` (1280×720, played by the Watch overview button on
`/products/manufacturing-erp`, tour title "Manufacturing ERP Tour") and the 1920×1080 master
`video-exports/synax-manufacturing-erp-1080p.mp4` (git-ignored). Length **2:58**, 30 fps, two AI voices (Pip: Neerja,
Sage: Prabhat), synthesised music and sound design, **no subtitles or captions**.

Built with the shared engine and characters in `tools/video-kit/`, like the platform overview: every frame is an original
HTML/SVG illustration drawn as a pure function of time, nothing is screen-recorded, no portal screen is copied. Menu names
follow the portal sidebar (route JSON); product statements follow the Manufacturing ERP page and `app/erp/_data/live.ts`.
People, companies, documents and numbers are fictional sample data.

## Story: problem first, then the solution, then the AI bot

| Time | Part | What happens |
| --- | --- | --- |
| 0:00–0:52 | **The problem** ("A normal day at a machine shop") | Pip and Sage on a machine-shop floor. Four problem cards, each shrinking into an orange chip at the bottom: (1) whose material is on which rack: a rack with "?" tags and a spreadsheet full of #N/A and #REF!; (2) the machine knows, the office doesn't: a paper route card with tally marks, a person walking from the office to VMC-05 to ask; (3) records put together by hand: inspection report, FAIR and COC filled in by pen, "17:40, truck leaves at 18:00"; (4) typed again and again: the same invoice line typed into the invoice, the e-way bill and Tally. Pip: "That's the same work, three times!" |
| 0:52–1:05 | **The turn** | "Synax Manufacturing ERP, from the machine spindle to the GST invoice, in one workspace." The four chips flip from × to ✓ (material to the piece, counts from the machine, evidence from the work, one flow to Tally); the part passport (Customer PO line → Material lot → Route card → Machine and operator → COC → Invoice). |
| 1:05–2:19 | **The solution** ("One part, one passport") | Manufacturing window with the portal sidebar; the passport strip lights step by step. Customer PO with lines, revisions and open quantity; gate entry against the challan with the Material ID range, GRN, the customer-material ledger (inward 500, issued 500, consumed 1:1 498, returned 0, scrap 2, balance 0, ITC-04 data pack); route card against the BOM with material reserved, and a second job that cannot take the same stock; scan to start, the machine proposes 500, the operator confirms 498 with a variance reason, buy-offs; inspection, FAIR and COC with the machining record, packing, GST invoice, IRN, e-way bill, vouchers to Tally; Quality Genealogy tracing the part back to its PO. |
| 2:19–2:50 | **The AI bot** ("AI that keeps watch") | The scene turns dark; a friendly Synax agent bot floats in. Its scan beam moves over three watch cards (challans past their return date, an order ready to dispatch, a calibration due), then it makes a proposal (send return reminders). It waits for the stores manager's approval, nods when approved, and the event history is recorded. Pip: "Smart helpers, and people in charge." |
| 2:50–2:58 | **End card** | Manufacturing ERP, "From the machine spindle to the GST invoice.", Book a demo, synax.senwellgroup.com; the birds and the bot wave. |

**Claims and sources:** job-work customer material with Material ID ranges, consumption 1:1, returns, scrap and the ITC-04
pack; route cards released against the BOM with material reserved by RI unit; scan to start, machine cycle counts
proposed and confirmed by the operator with a variance reason; buy-offs; FAIR and a COC carrying the machining record;
packing, GST invoice, IRN and e-way bill in one flow; vouchers to Tally; agents for challan reconciliation, dispatch
readiness and quality compliance that only propose, with an approver and an event history. All of these are stated on
the Manufacturing ERP page or in `live.ts`. "OEE 82%" is labelled as a sample.

## Files and rebuild

Built with the shared engine in `tools/video-kit/` (see its README). This folder holds only what is specific to this video:
`video.json` (output name `manufacturing-erp-tour`, master file name, end card, music levels), `lines.json` (dialogue),
`director.js` (this video's scenes, including the AI bot), `style.css` (problem cards, spreadsheet, paper, bot) and the
generated `words.json`, `durations.json` and `icons.json`. From `tools/video-kit`:

```
node make.mjs manufacturing-erp audio   # only after changing lines.json
node make.mjs manufacturing-erp draft   # quick half-size check -> work/manufacturing-erp/draft.mp4
node make.mjs manufacturing-erp final   # publishes public/videos/manufacturing-erp-tour.mp4 and the poster
```

**Licence note:** the voices use the unofficial Edge text-to-speech client; regenerate them with licensed or recorded
voices before launch. Music and effects are synthesised here.
