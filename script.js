// ─── Simple type catalogue ────────────────────────────────────────────────────
const SIMPLE_TYPES = [
  '<filename 1..80 without-vers with-wild>',
  '<partial-filename 2..79 with-wild>',
  '<composed-name 1..64 with-under>',
  '<filename 1..54 without-gen-vers>',
  '<cat-id>',
  '<time>',
  '<date with-compl>',
  '<filename 1..22 without-cat-gen-vers>',
  '<integer -99999..0 days>',
  '<device>',
  '<name 1..8>',
  '<text 1..60>',
  '<integer 1..16>',
  '<c-string 1..1>'
];

// ─── Model ────────────────────────────────────────────────────────────────────
// Operand : { id, name, values:[Value] }
// keyword : { id, kind:'keyword', label }
// simple  : { id, kind:'simple',  simpleType }          ← no label, no user input
// nested  : { id, kind:'nested',  label, children:[Operand] }
// list    : { id, kind:'list',    simpleType, maxItems } ← auto-label list-poss(N)

let idCounter = 1;
const uid = () => 'n' + (idCounter++);

function makeOperand(name) { return { id: uid(), name: name || 'NEW-OPERAND', values: [] }; }
function makeValue(kind) {
  const v = { id: uid(), kind: kind || 'keyword' };
  if (kind === 'keyword') { v.label = '*NEW-VALUE'; }
  if (kind === 'simple') { v.simpleType = SIMPLE_TYPES[0]; }
  if (kind === 'nested') { v.label = '*NEW-VALUE'; v.children = []; }
  if (kind === 'list') { v.simpleType = SIMPLE_TYPES[0]; v.maxItems = 20; }
  return v;
}

// display label used in dropdowns and collapse summaries
function valueLabel(v) {
  if (v.kind === 'keyword') return v.label || '(keyword)';
  if (v.kind === 'simple') return v.simpleType;
  if (v.kind === 'nested') return (v.label || '(nested)') + '(...)';
  if (v.kind === 'list') return 'list-poss(' + (v.maxItems || 20) + ')';
  return '?';
}

let schema = [];

// collapse state: separate for builder and form
let bCollapsed = {};   // builder:  opId → bool
let fCollapsed = {};   // form:     opId → bool

// ─── Find helpers ─────────────────────────────────────────────────────────────
function findOperand(list, id) {
  for (const op of list) {
    if (op.id === id) return op;
    for (const v of op.values)
      if (v.kind === 'nested') { const f = findOperand(v.children, id); if (f) return f; }
  }
  return null;
}
function findOperandParentList(list, id) {
  for (const op of list) {
    if (op.id === id) return list;
    for (const v of op.values)
      if (v.kind === 'nested') { const f = findOperandParentList(v.children, id); if (f) return f; }
  }
  return null;
}
function findValue(list, id) {
  for (const op of list) {
    for (const v of op.values) {
      if (v.id === id) return v;
      if (v.kind === 'nested') { const f = findValue(v.children, id); if (f) return f; }
    }
  }
  return null;
}

// ─── Mutations ────────────────────────────────────────────────────────────────
function addOperand(targetList) { targetList.push(makeOperand()); renderAll(); }
function removeOperand(id) {
  const list = findOperandParentList(schema, id);
  if (!list) return;
  list.splice(list.findIndex(op => op.id === id), 1);
  renderAll();
}
function addValue(opId, kind) {
  const op = findOperand(schema, opId);
  if (op) { op.values.push(makeValue(kind)); renderAll(); }
}
function removeValue(valId) {
  function rem(list) {
    for (const op of list) {
      const i = op.values.findIndex(v => v.id === valId);
      if (i > -1) { op.values.splice(i, 1); return true; }
      for (const v of op.values) if (v.kind === 'nested' && rem(v.children)) return true;
    }
    return false;
  }
  rem(schema); renderAll();
}
function addNestedOperand(valId) {
  const v = findValue(schema, valId);
  if (v && v.kind === 'nested') { v.children.push(makeOperand()); renderAll(); }
}

// text-only mutations — don't rebuild the builder, just refresh form+output
function setOperandName(id, val) { const op = findOperand(schema, id); if (op) op.name = val; renderFormAndOutput(); }
function setValueLabel(id, val) { const v = findValue(schema, id); if (v) v.label = val; renderFormAndOutput(); }
function setValueSimpleType(id, val) { const v = findValue(schema, id); if (v) v.simpleType = val; renderFormAndOutput(); }
function setValueMaxItems(id, val) { const v = findValue(schema, id); if (v) v.maxItems = Math.max(1, parseInt(val) || 1); renderFormAndOutput(); }
function changeValueKind(id, kind) {
  const v = findValue(schema, id);
  if (!v) return;
  v.kind = kind;
  if (kind === 'keyword' && !v.label) v.label = '*NEW-VALUE';
  if (kind === 'simple' && !v.simpleType) v.simpleType = SIMPLE_TYPES[0];
  if (kind === 'list' && !v.simpleType) { v.simpleType = SIMPLE_TYPES[0]; v.maxItems = v.maxItems || 20; }
  if (kind === 'nested' && !v.children) v.children = [];
  renderAll();
}

function toggleBCollapse(id) {
  bCollapsed[id] = !bCollapsed[id];
  // rebuild just the builder (form stays intact)
  renderBuilder();
}
function toggleFCollapse(id) {
  fCollapsed[id] = !fCollapsed[id];
  renderForm();
  renderOutput();
}

// ─── Builder render ───────────────────────────────────────────────────────────
function renderBuilder() {
  const root = document.getElementById('builder');
  root.innerHTML = '';
  schema.forEach(op => root.appendChild(buildOperandEl(op)));
}

function buildOperandEl(op) {
  const collapsed = !bCollapsed[op.id];
  const wrap = document.createElement('div'); wrap.className = 'op-block';

  // ── header (always visible, clickable) ──
  const head = document.createElement('div'); head.className = 'op-head';
  head.innerHTML = `
    <span class="op-toggle">${collapsed ? '▶' : '▼'}</span>
    <span class="op-head-name">${esc(op.name)}</span>
    <button class="danger" onclick="event.stopPropagation();removeOperand('${op.id}')">✕ Delete</button>
  `;
  head.onclick = () => toggleBCollapse(op.id);
  wrap.appendChild(head);

  // ── body (collapsible) ──
  const body = document.createElement('div');
  body.className = 'op-body' + (collapsed ? ' hidden' : '');

  // name input
  const nameRow = document.createElement('div'); nameRow.className = 'row';
  nameRow.innerHTML = `<span>Name:</span>
    <input type="text" value="${esc(op.name)}" oninput="setOperandName('${op.id}',this.value)" size="22">`;
  body.appendChild(nameRow);

  // values
  const vWrap = document.createElement('div'); vWrap.style.marginTop = '4px';
  op.values.forEach(v => vWrap.appendChild(buildValueEl(op, v)));
  body.appendChild(vWrap);

  // add-value buttons
  const addRow = document.createElement('div'); addRow.className = 'row'; addRow.style.marginTop = '4px';
  addRow.innerHTML = `
    <span class="hint">Add value:</span>
    <button class="add" onclick="addValue('${op.id}','keyword')">+ keyword</button>
    <button class="add" onclick="addValue('${op.id}','simple')">+ simple</button>
    <button class="add" onclick="addValue('${op.id}','nested')">+ nested</button>
    <button class="add" onclick="addValue('${op.id}','list')">+ list</button>
  `;
  body.appendChild(addRow);
  wrap.appendChild(body);
  return wrap;
}

function buildValueEl(parentOp, v) {
  const box = document.createElement('div'); box.className = 'val-box';

  const kindTag = `<span class="tag-kind ${v.kind}">${v.kind}</span>`;
  const kindOpts = ['keyword', 'simple', 'nested', 'list'].map(k =>
    `<option value="${k}" ${v.kind === k ? 'selected' : ''}>${k}</option>`
  ).join('');

  const topRow = document.createElement('div'); topRow.className = 'row';

  if (v.kind === 'keyword') {
    topRow.innerHTML = `
      ${kindTag}
      <input type="text" value="${esc(v.label)}" oninput="setValueLabel('${v.id}',this.value)" size="16" placeholder="*KEYWORD">
      kind: <select onchange="changeValueKind('${v.id}',this.value)">${kindOpts}</select>
      <button class="danger" onclick="removeValue('${v.id}')">✕</button>`;

  } else if (v.kind === 'simple') {
    const opts = SIMPLE_TYPES.map(t =>
      `<option value="${esc(t)}" ${v.simpleType === t ? 'selected' : ''}>${esc(t)}</option>`).join('');
    topRow.innerHTML = `
      ${kindTag}
      <select onchange="setValueSimpleType('${v.id}',this.value)">${opts}</select>
      kind: <select onchange="changeValueKind('${v.id}',this.value)">${kindOpts}</select>
      <button class="danger" onclick="removeValue('${v.id}')">✕</button>`;

  } else if (v.kind === 'list') {
    const opts = SIMPLE_TYPES.map(t =>
      `<option value="${esc(t)}" ${v.simpleType === t ? 'selected' : ''}>${esc(t)}</option>`).join('');
    topRow.innerHTML = `
      ${kindTag}
      <span style="color:#536;font-weight:bold">list-poss(<input type="number" value="${v.maxItems || 20}"
        min="1" max="999" onchange="setValueMaxItems('${v.id}',this.value)">)</span>
      <select onchange="setValueSimpleType('${v.id}',this.value)">${opts}</select>
      kind: <select onchange="changeValueKind('${v.id}',this.value)">${kindOpts}</select>
      <button class="danger" onclick="removeValue('${v.id}')">✕</button>`;

  } else if (v.kind === 'nested') {
    topRow.innerHTML = `
      ${kindTag}
      <input type="text" value="${esc(v.label)}" oninput="setValueLabel('${v.id}',this.value)" size="16" placeholder="*LABEL">
      kind: <select onchange="changeValueKind('${v.id}',this.value)">${kindOpts}</select>
      <button class="danger" onclick="removeValue('${v.id}')">✕</button>`;
  }
  box.appendChild(topRow);

  if (v.kind === 'nested') {
    const cw = document.createElement('div'); cw.className = 'node';
    (v.children || []).forEach(cop => cw.appendChild(buildOperandEl(cop)));
    box.appendChild(cw);
    const btn = document.createElement('button'); btn.className = 'add';
    btn.textContent = '+ Add nested operand';
    btn.onclick = () => addNestedOperand(v.id);
    box.appendChild(btn);
  }
  return box;
}

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Selections state ─────────────────────────────────────────────────────────
let selections = {};
function getSel(op) {
  if (!selections[op.id])
    selections[op.id] = { choiceId: op.values.length ? op.values[0].id : null };
  if (op.values.length && !op.values.find(v => v.id === selections[op.id].choiceId))
    selections[op.id].choiceId = op.values[0].id;
  return selections[op.id];
}

// ─── Form render ──────────────────────────────────────────────────────────────
function renderForm() {
  const root = document.getElementById('form');
  root.innerHTML = '';
  if (!schema.length) { root.innerHTML = '<div class="hint">No operands defined yet.</div>'; return; }
  schema.forEach(op => root.appendChild(buildFormOperandEl(op)));
}

function buildFormOperandEl(op) {
  const collapsed = !fCollapsed[op.id];
  const sel = getSel(op);
  const chosenVal = op.values.find(v => v.id === sel.choiceId) || op.values[0];
  const summary = chosenVal ? valueLabel(chosenVal) : '(no values)';

  const wrap = document.createElement('div'); wrap.className = 'form-op';

  // ── header ──
  const head = document.createElement('div'); head.className = 'form-head';
  head.innerHTML = `
    <span class="form-toggle">${collapsed ? '▶' : '▼'}</span>
    <span class="form-name">${esc(op.name)}</span>
    ${collapsed ? `<span class="form-static">= ${esc(summary)}</span>` : ''}
  `;
  head.onclick = () => toggleFCollapse(op.id);
  wrap.appendChild(head);

  if (collapsed) return wrap;

  // ── body ──
  const body = document.createElement('div'); body.className = 'form-body';

  if (!op.values.length) {
    body.innerHTML = '<span class="hint">(no values defined)</span>';
  } else {
    const lineRow = document.createElement('div'); lineRow.className = 'row';

    // dropdown if multiple values, static text if one
    if (op.values.length > 1) {
      const dd = document.createElement('select');
      op.values.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = valueLabel(v);
        if (v.id === sel.choiceId) opt.selected = true;
        dd.appendChild(opt);
      });
      dd.onchange = function () { sel.choiceId = this.value; renderForm(); renderOutput(); };
      lineRow.appendChild(dd);
    } else {
      const tag = document.createElement('span'); tag.className = 'form-static';
      tag.textContent = valueLabel(op.values[0]);
      sel.choiceId = op.values[0].id;
      lineRow.appendChild(tag);
    }
    body.appendChild(lineRow);

    // nested children
    if (chosenVal && chosenVal.kind === 'nested' && chosenVal.children && chosenVal.children.length) {
      const cw = document.createElement('div'); cw.className = 'form-indent';
      chosenVal.children.forEach(cop => cw.appendChild(buildFormOperandEl(cop)));
      body.appendChild(cw);
    }
  }

  wrap.appendChild(body);
  return wrap;
}

// ─── Statement output ─────────────────────────────────────────────────────────
function buildStmt(list, depth) {
  depth = depth || 1;
  const pad = '  '.repeat(depth);
  return list.map(op => buildOperandOut(op, depth)).filter(Boolean).join(',\n' + pad);
}

function buildOperandOut(op, depth) {
  depth = depth || 1;
  const pad = '  '.repeat(depth);
  const innerPad = '  '.repeat(depth + 1);
  if (!op.values.length) return op.name + '=<no values>';
  const sel = getSel(op);
  const v = op.values.find(x => x.id === sel.choiceId) || op.values[0];

  let valStr;
  if (v.kind === 'keyword') {
    valStr = v.label;
  } else if (v.kind === 'simple') {
    valStr = v.simpleType;
  } else if (v.kind === 'list') {
    valStr = 'list-poss(' + (v.maxItems || 20) + '): ' + v.simpleType;
  } else if (v.kind === 'nested') {
    const inner = (v.children && v.children.length) ? buildStmt(v.children, depth + 1) : '';
    valStr = inner
      ? v.label + '(\n' + innerPad + inner + '\n' + pad + ')'
      : v.label + '()';
  }
  return op.name + '=' + valStr;
}

function renderOutput() {
  const out = document.getElementById('output');
  const name = (document.getElementById('stmtName').value || 'STATEMENT').trim();
  if (!schema.length) { out.textContent = ''; return; }
  out.textContent = name + '\n  ' + buildStmt(schema, 1);
}

// ─── Top-level renders ────────────────────────────────────────────────────────
function renderFormAndOutput() { renderForm(); renderOutput(); }
function renderAll() { renderBuilder(); renderForm(); renderOutput(); }

// ─── Example schema ───────────────────────────────────────────────────────────
function exampleSchema() {
  idCounter = 1;
  const fileNames = makeOperand('FILE-NAMES');
  fileNames.values.push(makeValue('keyword')); fileNames.values[0].label = '*OWN';
  fileNames.values.push(makeValue('keyword')); fileNames.values[1].label = '*ALL';
  const vFromFile = makeValue('nested'); vFromFile.label = '*FROM-FILE';
  const opLFN = makeOperand('LIST-FILE-NAME');
  const sv = makeValue('simple'); sv.simpleType = '<filename 1..54 without-gen-vers>';
  opLFN.values.push(sv);
  vFromFile.children = [opLFN];
  fileNames.values.push(vFromFile);
  const vList = makeValue('list'); vList.simpleType = SIMPLE_TYPES[0]; vList.maxItems = 20;
  fileNames.values.push(vList);

  const env = makeOperand('ENVIRONMENT');
  env.values.push(makeValue('keyword')); env.values[0].label = '*STD';
  const vSM = makeValue('nested'); vSM.label = '*SYSTEM-MANAGED';
  const opCat = makeOperand('CATALOG-ID');
  const sv2 = makeValue('simple'); sv2.simpleType = '<cat-id>';
  opCat.values.push(sv2);
  vSM.children = [opCat];
  env.values.push(vSM);

  return [fileNames, env];
}

function resetSchema() { schema = exampleSchema(); selections = {}; bCollapsed = {}; fCollapsed = {}; renderAll(); }
function clearSchema() { idCounter = 1; schema = []; selections = {}; bCollapsed = {}; fCollapsed = {}; renderAll(); }

// ─── Save / Load ──────────────────────────────────────────────────────────────
function saveToFile() {
  const name = (document.getElementById('stmtName').value || 'STATEMENT').trim();
  const blob = new Blob([JSON.stringify({ stmtName: name, schema, selections }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name + '.json' });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function loadFromFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      schema = data.schema || [];
      selections = data.selections || {};
      document.getElementById('stmtName').value = data.stmtName || 'STATEMENT';
      let max = 0;
      const scan = list => list.forEach(op => {
        const m = /^n(\d+)$/.exec(op.id || ''); if (m) max = Math.max(max, +m[1]);
        op.values.forEach(v => {
          const m2 = /^n(\d+)$/.exec(v.id || ''); if (m2) max = Math.max(max, +m2[1]);
          if (v.kind === 'nested' && v.children) scan(v.children);
        });
      });
      scan(schema); idCounter = max + 1;
      bCollapsed = {}; fCollapsed = {};
      renderAll();
    } catch (e) { alert('Could not load: invalid JSON.'); }
  };
  reader.readAsText(file);
  document.getElementById('loadInput').value = '';
}

// ─── DOCX Export ──────────────────────────────────────────────────────────────
function operandPfx(L) { return L === 0 ? '' : expansionPfx(L - 1) + '|    '; }
function expansionPfx(L) { return L === 0 ? '    ' : expansionPfx(L - 1) + '|        '; }

function schemaToDocLines(operands, opLevel) {
  const opP = operandPfx(opLevel), exP = expansionPfx(opLevel);
  const lines = [];
  operands.forEach((op, idx) => {
    lines.push({ type: 'operand', prefix: opP, comma: idx > 0, name: op.name, values: op.values });
    // lines.push({ type: 'blank' });
    op.values.filter(v => v.kind === 'nested').forEach(v => {
      lines.push({ type: 'nested-hdr', prefix: exP, label: v.label });
      // lines.push({ type: 'blank' });
      if (v.children && v.children.length)
        lines.push(...schemaToDocLines(v.children, opLevel + 1));
    });
  });
  return lines;
}

function xmlEsc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function wRpr(bold, italic, size) {
  size = size || 20;
  return `<w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New" w:cs="Courier New"/>` +
    `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>` +
    (bold ? '<w:b/><w:bCs/>' : '') + (italic ? '<w:i/><w:iCs/>' : '') + `</w:rPr>`;
}
function wRun(text, bold, italic, size) {
  if (!text && text !== ' ') return '';
  const sp = /^\s|\s$/.test(text) ? ' xml:space="preserve"' : '';
  return `<w:r>${wRpr(bold, italic, size)}<w:t${sp}>${xmlEsc(text)}</w:t></w:r>`;
}
function wPara(runs, sa) {
  return `<w:p><w:pPr><w:spacing w:before="0" w:after="${sa || 0}"/></w:pPr>${runs}</w:p>`;
}
function valueRunsXml(v) {
  if (v.kind === 'keyword') return wRun(v.label, true, true);
  if (v.kind === 'simple') return wRun(v.simpleType);
  if (v.kind === 'nested') return wRun(v.label, true, true) + wRun('(...)');
  if (v.kind === 'list') return wRun('list-poss(' + (v.maxItems || 20) + '): ') + wRun(v.simpleType);
  return '';
}
function lineToDocXml(line) {
  if (line.type === 'blank') return wPara(wRun(' '));
  if (line.type === 'title') return wPara(wRun(line.name, true, false, 28), 120);
  if (line.type === 'nested-hdr') {
    return wPara((line.prefix ? wRun(line.prefix) : '') + wRun(line.label, true, true) + wRun('(...)'));
  }
  if (line.type === 'operand') {
    let r = (line.prefix ? wRun(line.prefix) : '') +
      (line.comma ? wRun(',', true) : '') +
      wRun(line.name, true) + wRun(' = ');
    line.values.forEach((v, i) => { if (i > 0) r += wRun(' / '); r += valueRunsXml(v); });
    return wPara(r);
  }
  return wPara('');
}

async function exportDocx() {
  const name = (document.getElementById('stmtName').value || 'STATEMENT').trim();
  const lines = [{ type: 'title', name }, { type: 'blank' }, ...schemaToDocLines(schema, 0)];
  const bodyXml = lines.map(lineToDocXml).join('\n');
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
${bodyXml}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/>
<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701"/></w:sectPr>
</w:body></w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml"
  ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1"
  Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
  Target="word/document.xml"/></Relationships>`);
  zip.file('word/document.xml', documentXml);
  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`);

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name + '.docx' });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

resetSchema();
