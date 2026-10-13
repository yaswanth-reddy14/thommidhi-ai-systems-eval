const fs = require('node:fs');
const path = require('node:path');

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else {
      if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
      else field += ch;
    }
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  return rows.filter(r => r.some(v => v.trim() !== ''));
}

const input = process.argv[2] || 'results.csv';
if (!fs.existsSync(input)) {
  console.error(`Cannot find ${input}. Copy results_template.csv to results.csv and record actual test runs.`);
  process.exit(1);
}
const rows = parseCsv(fs.readFileSync(input, 'utf8'));
if (rows.length < 2) {
  console.error('CSV has no result rows.');
  process.exit(1);
}
const headers = rows[0].map(h => h.trim().toLowerCase());
const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
if (idx.result === undefined || idx.case_id === undefined) {
  console.error('CSV must include case_id and result columns.');
  process.exit(1);
}
const data = rows.slice(1).map(r => ({
  case_id: (r[idx.case_id] || '').trim(),
  result: (r[idx.result] || '').trim().toUpperCase()
})).filter(r => r.case_id);
const counts = { PASS: 0, FAIL: 0, INCONCLUSIVE: 0, INVALID: 0 };
for (const r of data) {
  if (['PASS', 'FAIL', 'INCONCLUSIVE'].includes(r.result)) counts[r.result]++;
  else counts.INVALID++;
}
const decided = counts.PASS + counts.FAIL;
const uniqueCases = new Set(data.map(r => r.case_id));
const allCasesPath = path.join(path.dirname(path.resolve(input)), 'test_cases.csv');
let totalCases = null;
if (fs.existsSync(allCasesPath)) totalCases = Math.max(0, parseCsv(fs.readFileSync(allCasesPath, 'utf8')).length - 1);
const summary = {
  input_file: path.resolve(input),
  rows_recorded: data.length,
  unique_case_ids_recorded: uniqueCases.size,
  counts,
  task_success_rate: decided ? Number((counts.PASS / decided).toFixed(4)) : null,
  coverage: totalCases ? Number((uniqueCases.size / totalCases).toFixed(4)) : null,
  total_suggested_cases: totalCases,
  caveat: 'Metrics are only as reliable as your manual scoring and evidence. This script does not verify whether PASS/FAIL labels are correct.'
};
fs.writeFileSync('evaluation-summary.json', JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
console.log('\nSaved evaluation-summary.json');
