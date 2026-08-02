import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as docxMod from "docx";
import { writeFileSync } from "fs";
import { buildExportDocument } from "./src/utils/export/buildDocument";
import { renderPdf } from "./src/utils/export/pdfExporter";
import { buildDocx } from "./src/utils/export/wordExporter";

const md = `# Notice Reply — Section 143(2) Scrutiny

Dear Sir/Madam,

This is in response to the notice dated **12 March 2025** issued under _section 143(2)_ of the Income-tax Act, 1961. We submit as under:

## 1. Factual background

The assessee, a resident individual, filed the return of income for AY 2024-25 declaring total income of Rs. 42,50,000. Interest of ₹1,25,000 was claimed under section 24(b), and a deduction of ₹1,50,000 under section 80C. See [the CBDT circular](https://incometaxindia.gov.in) for the applicable threshold.

### 1.1 Documents enclosed

- Form 16 issued by the employer
- Bank interest certificates for FY 2023-24
  - HDFC Bank — savings interest
  - SBI — fixed deposit interest
- Home loan interest certificate ~~(not applicable)~~ (enclosed)

1. Computation of total income
2. Copy of the acknowledgement (ITR-V)
3. Reconciliation of AIS with the return

- [x] Reconciliation completed
- [ ] Awaiting bank confirmation

## 2. Comparative table

| Particulars | As per AIS | As per return | Difference | Remarks |
| --- | ---: | ---: | ---: | :---: |
| Salary income | 38,00,000 | 38,00,000 | Nil | Matched |
| Interest income | 2,10,000 | 1,95,000 | 15,000 | TDS credit timing difference; reconciled in Annexure A with the deductor statement |
| Capital gains | 4,15,000 | 4,15,000 | Nil | Matched |

> The Hon'ble Supreme Court in *CIT v. Excel Industries Ltd.* held that income which has not accrued cannot be brought to tax merely on the basis of a book entry.

## 3. Statutory computation

\`\`\`
Total income as per return   : 42,50,000
Add: unreconciled interest   :     15,000
Less: 80C deduction          :  (1,50,000)
Revised total income         : 41,15,000
\`\`\`

Please refer to \`section 143(3)\` before finalising the assessment.

---

#### 4. Prayer

In view of the above, it is prayed that the return filed be accepted. We remain available for any further clarification.
`;

const model = buildExportDocument({
  message: {
    id: "m1",
    role: "assistant",
    content: md,
    createdAt: new Date().toISOString(),
    citations: [
      { id: "c1", heading: "Section 143(2), Income-tax Act, 1961", documentType: "Act", link: "https://example.com/143", snippet: "Where a return has been furnished under section 139, the Assessing Officer may serve a notice…", sourceNo: 1 },
      { id: "c2", heading: "CIT v. Excel Industries Ltd. (2013) 358 ITR 295 (SC)", documentType: "Judgement", link: "https://example.com/excel", sourceNo: 2 },
    ] as never,
  } as never,
  question: "Draft a reply to a scrutiny notice under section 143(2) for AY 2024-25 with a reconciliation table.",
  subtitle: "Notice Reply Draft",
});

const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
renderPdf(doc, autoTable, model);
writeFileSync("/tmp/qa/out.pdf", Buffer.from(doc.output("arraybuffer")));

const buf = await docxMod.Packer.toBuffer(buildDocx(docxMod, model));
writeFileSync("/tmp/qa/out.docx", buf);
console.log("ok");
