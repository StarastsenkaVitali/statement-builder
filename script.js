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

// ─── Model ───────────────────────────────────────────────────────────────────
// Operand: { id, name, values: [Value] }
// Value:
//   kind='keyword' → { id, kind, label }
//   kind='simple'  → { id, kind, label, simpleType }
//   kind='nested'  → { id, kind, label, children: [Operand] }
//   kind='list'    → { id, kind, label, simpleType, maxItems }

let idCounter = 1;
const uid = () => 'n' + (idCounter++);

function makeOperand(name) {
  return { id: uid(), name: name || 'NEW-OPERAND', values: [] };
}
function makeValue(kind, label) {
  const v = { id: uid(), kind: kind || 'keyword', label: label || '*NEW-VALUE' };
  if (v.kind === 'simple') { v.simpleType = SIMPLE_TYPES[0]; }
  if (v.kind === 'nested') { v.children = []; }
  if (v.kind === 'list') { v.simpleType = SIMPLE_TYPES[0]; v.maxItems = 20; }
  return v;
}

let schema = [];

// ─── Find helpers ────────────────────────────────────────────────────────────
function findOperand(list, id) {
  for (const op of list) {
    if (op.id === id) return op;
    for (const v of op.values) {
      if (v.kind === 'nested') {
        const f = findOperand(v.children, id);
        if (f) return f;
      }
    }
  }
  return null;
}
function findOperandParentList(list, id) {
  for (const op of list) {
    if (op.id === id) return list;
    for (const v of op.values) {
      if (v.kind === 'nested') {
        const f = findOperandParentList(v.children, id);
        if (f) return f;
      }
    }
  }
  return null;
}
function findValue(list, id) {
  for (const op of list) {
    for (const v of op.values) {
      if (v.id === id) return v;
      if (v.kind === 'nested') {
        const f = findValue(v.children, id);
        if (f) return f;
      }
    }
  }
  return null;
}
function findValueParent(list, id) { // returns { op, v }
  for (const op of list) {
    for (const v of op.values) {
      if (v.id === id) return { op };
      if (v.kind === 'nested') {
        const f = findValueParent(v.children, id);
        if (f) return f;
      }
    }
  }
  return null;
}

// ─── Mutations ───────────────────────────────────────────────────────────────
function addOperand(targetList) {
  targetList.push(makeOperand());
  renderAll();
}
function removeOperand(id) {
  const list = findOperandParentList(schema, id);
  if (!list) return;
  list.splice(list.findIndex(op => op.id === id), 1);
  renderAll();
}
function addValue(opId, kind) {
  const op = findOperand(schema, opId);
  if (!op) return;
  op.values.push(makeValue(kind));
  renderAll();
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
  rem(schema);
  renderAll();
}
function addNestedOperand(valId) {
  const v = findValue(schema, valId);
  if (!v || v.kind !== 'nested') return;
  v.children.push(makeOperand());
  renderAll();
}

// text-only mutations (no rebuild needed)
function setOperandName(id, val) {
  const op = findOperand(schema, id);
  if (op) op.name = val;
  renderFormAndOutput();
}
function setValueLabel(id, val) {
  const v = findValue(schema, id);
  if (v) v.label = val;
  renderFormAndOutput();
}
function setValueSimpleType(id, val) {
  const v = findValue(schema, id);
  if (v) v.simpleType = val;
  renderFormAndOutput();
}
function setValueMaxItems(id, val) {
  const v = findValue(schema, id);
  if (v) v.maxItems = Math.max(1, parseInt(val) || 1);
  renderFormAndOutput();
}
function changeValueKind(id, kind) {
  const v = findValue(schema, id);
  if (!v) return;
  v.kind = kind;
  if (kind === 'simple' && !v.simpleType) v.simpleType = SIMPLE_TYPES[0];
  if (kind === 'list' && !v.simpleType) { v.simpleType = SIMPLE_TYPES[0]; v.maxItems = v.maxItems || 20; }
  if (kind === 'nested' && !v.children) v.children = [];
  renderAll();
}

// ─── Builder render ──────────────────────────────────────────────────────────
function renderBuilder() {
  const root = document.getElementById('builder');
  root.innerHTML = '';
  schema.forEach(op => root.appendChild(buildOperandEl(op)));
}

function buildOperandEl(op) {
  const fs = document.createElement('fieldset');
  const lg = document.createElement('legend');
  lg.textContent = 'Operand';
  fs.appendChild(lg);

  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `
    <span>Name:</span>
    <input type="text" value="${esc(op.name)}" oninput="setOperandName('${op.id}',this.value)" size="20">
    <button class="danger" onclick="removeOperand('${op.id}')">✕ Delete</button>
  `;
  fs.appendChild(row);

  const vWrap = document.createElement('div');
  vWrap.className = 'indent';
  op.values.forEach(v => vWrap.appendChild(buildValueEl(op, v)));
  fs.appendChild(vWrap);

  // add-value buttons
  const addRow = document.createElement('div');
  addRow.className = 'row';
  addRow.style.marginTop = '4px';
  addRow.innerHTML = `
    <span class="hint">Add value:</span>
    <button class="add" onclick="addValue('${op.id}','keyword')">+ keyword</button>
    <button class="add" onclick="addValue('${op.id}','simple')">+ simple</button>
    <button class="add" onclick="addValue('${op.id}','nested')">+ nested</button>
    <button class="add" onclick="addValue('${op.id}','list')">+ list</button>
  `;
  fs.appendChild(addRow);

  return fs;
}

function buildValueEl(parentOp, v) {
  const box = document.createElement('div');
  box.className = 'val-box';

  const kindTag = `<span class="tag-kind ${v.kind}">${v.kind}</span>`;

  let extra = '';
  if (v.kind === 'simple' || v.kind === 'list') {
    const opts = SIMPLE_TYPES.map(t =>
      `<option value="${esc(t)}" ${v.simpleType === t ? 'selected' : ''}>${esc(t)}</option>`
    ).join('');
    extra = `<select onchange="setValueSimpleType('${v.id}',this.value)">${opts}</select>`;
    if (v.kind === 'list') {
      extra += ` max items:<input type="number" value="${v.maxItems || 20}" min="1" max="100"
        onchange="setValueMaxItems('${v.id}',this.value)">`;
    }
  }

  const kindOpts = ['keyword', 'simple', 'nested', 'list'].map(k =>
    `<option value="${k}" ${v.kind === k ? 'selected' : ''}>${k}</option>`
  ).join('');

  const topRow = document.createElement('div');
  topRow.className = 'row';
  topRow.innerHTML = `
    ${kindTag}
    <input type="text" value="${esc(v.label)}" oninput="setValueLabel('${v.id}',this.value)" size="18">
    <span class="hint">kind:</span>
    <select onchange="changeValueKind('${v.id}',this.value)">${kindOpts}</select>
    ${extra}
    <button class="danger" onclick="removeValue('${v.id}')">✕</button>
  `;
  box.appendChild(topRow);

  if (v.kind === 'nested') {
    const childWrap = document.createElement('div');
    childWrap.className = 'node';
    (v.children || []).forEach(cop => childWrap.appendChild(buildOperandEl(cop)));
    box.appendChild(childWrap);

    const addBtn = document.createElement('button');
    addBtn.className = 'add';
    addBtn.textContent = '+ Add nested operand';
    addBtn.onclick = () => addNestedOperand(v.id);
    box.appendChild(addBtn);
  }

  return box;
}

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Selections state ────────────────────────────────────────────────────────
// selections[operandId] = {
//   choiceId: <selected value id>   (for operands with >1 value)
//   text: string                    (for chosen simple value)
//   listItems: string[]             (for chosen list value)
// }
let selections = {};

function getSel(op) {
  if (!selections[op.id]) selections[op.id] = { choiceId: op.values.length ? op.values[0].id : null, text: '', listItems: [''] };
  // keep choiceId valid
  if (op.values.length && !op.values.find(v => v.id === selections[op.id].choiceId)) {
    selections[op.id].choiceId = op.values[0].id;
  }
  return selections[op.id];
}

// ─── Form render ─────────────────────────────────────────────────────────────
function renderForm() {
  const root = document.getElementById('form');
  root.innerHTML = '';
  if (!schema.length) { root.innerHTML = '<div class="hint">No operands defined yet.</div>'; return; }
  schema.forEach(op => root.appendChild(buildFormOperandEl(op)));
}

function buildFormOperandEl(op) {
  const wrap = document.createElement('div');
  wrap.className = 'form-operand';
  if (!op.values.length) {
    wrap.innerHTML = `<span class="form-label">${esc(op.name)}</span><span class="hint">(no values)</span>`;
    return wrap;
  }

  const sel = getSel(op);
  const label = document.createElement('span');
  label.className = 'form-label';
  label.textContent = op.name;
  wrap.appendChild(label);

  // if multiple values → show dropdown
  if (op.values.length > 1) {
    const dd = document.createElement('select');
    op.values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = v.label;
      if (v.id === sel.choiceId) opt.selected = true;
      dd.appendChild(opt);
    });
    dd.onchange = function () {
      sel.choiceId = this.value;
      renderForm(); renderOutput();
    };
    wrap.appendChild(dd);
  } else {
    // single value — show the label as static text
    const tag = document.createElement('span');
    tag.textContent = op.values[0].label;
    tag.style.color = '#555';
    wrap.appendChild(tag);
    sel.choiceId = op.values[0].id;
  }

  const chosenVal = op.values.find(v => v.id === sel.choiceId) || op.values[0];
  if (!chosenVal) return wrap;

  // extra input depending on value kind
  if (chosenVal.kind === 'simple') {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.size = 28;
    inp.placeholder = chosenVal.simpleType;
    inp.value = sel.text || '';
    inp.oninput = function () { sel.text = this.value; renderOutput(); };
    wrap.appendChild(document.createTextNode(' '));
    wrap.appendChild(inp);
  }

  if (chosenVal.kind === 'list') {
    if (!sel.listItems || !sel.listItems.length) sel.listItems = [''];
    const listWrap = document.createElement('div');
    sel.listItems.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'form-list-item';
      if (idx > 0) {
        const sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = ',';
        row.appendChild(sep);
      }
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.size = 24;
      inp.placeholder = chosenVal.simpleType;
      inp.value = item;
      inp.oninput = function () { sel.listItems[idx] = this.value; renderOutput(); };
      row.appendChild(inp);
      if (idx === sel.listItems.length - 1 && idx < (chosenVal.maxItems || 20) - 1) {
        const addBtn = document.createElement('button');
        addBtn.textContent = '+';
        addBtn.className = 'add';
        addBtn.onclick = () => { sel.listItems.push(''); renderForm(); renderOutput(); };
        row.appendChild(addBtn);
      }
      if (sel.listItems.length > 1) {
        const delBtn = document.createElement('button');
        delBtn.textContent = '−';
        delBtn.className = 'danger';
        delBtn.onclick = () => { sel.listItems.splice(idx, 1); renderForm(); renderOutput(); };
        row.appendChild(delBtn);
      }
      listWrap.appendChild(row);
    });
    wrap.appendChild(listWrap);
  }

  if (chosenVal.kind === 'nested' && chosenVal.children && chosenVal.children.length) {
    const childWrap = document.createElement('div');
    childWrap.className = 'indent';
    chosenVal.children.forEach(cop => childWrap.appendChild(buildFormOperandEl(cop)));
    wrap.appendChild(childWrap);
  }

  return wrap;
}

// ─── Output generation ───────────────────────────────────────────────────────
function buildStmt(list) {
  return list.map(op => buildOperandOut(op)).filter(Boolean).join(',\n  ');
}

function buildOperandOut(op) {
  if (!op.values.length) return `${op.name}=<?>`;
  const sel = getSel(op);
  const v = op.values.find(x => x.id === sel.choiceId) || op.values[0];

  let valStr;
  if (v.kind === 'keyword') {
    valStr = v.label;
  } else if (v.kind === 'simple') {
    valStr = sel.text || v.simpleType;
  } else if (v.kind === 'list') {
    const items = (sel.listItems || ['']).filter(x => x.trim() !== '');
    valStr = items.length ? '(' + items.join(',') + ')' : '(' + v.simpleType + ')';
  } else if (v.kind === 'nested') {
    const inner = v.children && v.children.length ? buildStmt(v.children) : '';
    valStr = inner ? `${v.label}(\n    ${inner}\n  )` : v.label + '()';
  }

  return `${op.name}=${valStr}`;
}

function renderOutput() {
  const out = document.getElementById('output');
  const name = (document.getElementById('stmtName').value || 'STATEMENT').trim();
  if (!schema.length) { out.textContent = ''; return; }
  out.textContent = name + '\n  ' + buildStmt(schema);
}

// ─── Top-level render ────────────────────────────────────────────────────────
function renderFormAndOutput() { renderForm(); renderOutput(); }
function renderAll() { renderBuilder(); renderForm(); renderOutput(); }

// ─── Example schema ──────────────────────────────────────────────────────────
function exampleSchema() {
  idCounter = 1;
  // FILE-NAMES operand: keyword *OWN, keyword *ALL, nested *FROM-FILE, list
  const fileNames = makeOperand('FILE-NAMES');
  const vOwn = makeValue('keyword', '*OWN');
  const vAll = makeValue('keyword', '*ALL');
  const vFromFile = makeValue('nested', '*FROM-FILE');
  const vList = makeValue('list', '');
  vList.simpleType = SIMPLE_TYPES[0]; vList.maxItems = 20; vList.label = '';
  const opListFileName = makeOperand('LIST-FILE-NAME');
  opListFileName.values.push(makeValue('simple', ''));
  opListFileName.values[0].simpleType = '<filename 1..54 without-gen-vers>';
  vFromFile.children = [opListFileName];
  fileNames.values = [vOwn, vAll, vFromFile, vList];

  // ENVIRONMENT operand
  const env = makeOperand('ENVIRONMENT');
  const vStd = makeValue('keyword', '*STD');
  const vSysMng = makeValue('nested', '*SYSTEM-MANAGED');
  const opCatId = makeOperand('CATALOG-ID');
  opCatId.values.push(makeValue('simple', ''));
  opCatId.values[0].simpleType = '<cat-id>';
  vSysMng.children = [opCatId];
  env.values = [vStd, vSysMng];

  return [fileNames, env];
}

function resetSchema() { schema = exampleSchema(); selections = {}; renderAll(); }
function clearSchema() { idCounter = 1; schema = []; selections = {}; renderAll(); }

// ─── Save / Load ─────────────────────────────────────────────────────────────
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
      // recalculate idCounter
      let max = 0;
      const scan = list => list.forEach(op => {
        const m = /^n(\d+)$/.exec(op.id || ''); if (m) max = Math.max(max, +m[1]);
        op.values.forEach(v => {
          const m2 = /^n(\d+)$/.exec(v.id || ''); if (m2) max = Math.max(max, +m2[1]);
          if (v.kind === 'nested' && v.children) scan(v.children);
        });
      });
      scan(schema);
      idCounter = max + 1;
      renderAll();
    } catch (e) { alert('Could not load: invalid JSON.'); }
  };
  reader.readAsText(file);
  document.getElementById('loadInput').value = '';
}

resetSchema();