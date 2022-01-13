export const BdsButton = (id, name) => {
  return `
    <div><button id="${id}" class="btn-small  darken-2">${name}</button></div>
  `;
};

export const BdsAddDelButtons = (id, name) => {
  return `
    <div class="row">
      <div class="col s6 push-s1">${BdsButton("add" + id, "Add " + name)}</div>
      <div class="col s6">${BdsButton("del" + id, "Remove " + name)}</div>
    </div>        
  `;
};

export const BdsText = (val) => {
  const value = val.data ? val.data : "";
  return `
    <div class="input-field" id=${val.name}>
      <input id="${val.id}" type="text" class="validate" value="${value}">
      <label for="${val.name}" class="active">${val.name}</label>
    </div>
`;
};

export const BdsSelect = (typ, cl) => {
  let sel = `
    <div class="input-field small" id="${typ.name}">
      <select id="${typ.id}">
        <option value="" disabled selected>Choose a ${typ.name}</option>
  `;
  cl.forEach((l) => {
    sel += `<option value=${l.code} ${l.code === typ.data ? "selected" : ""}>${l.desc}</option>`;
  });
  sel += `
      </select>
      <label>${typ.name}</label>
    </div>
  `;
  return sel;
};

export const BdsSelect2 = (list, item) => {
  let sel = `
    <div class="input-field">
      <select id="onixrecs">
        <option value="" disabled selected>Choose a Record</option>
      `;
  list.forEach((t) => {
    sel += `<option value=${t} ${t === item ? "selected" : ""}>${t}</option>`;
  });
  sel += `
      </select>
      <label>Choose Title</label>
    </div>
  `;
  return sel;
};

export const BdsCombo = (lbl, typ1, typ2, cl) => {
  let combo = `
    <div id=${lbl}>
    <h6 class="center">${lbl}</h6>
      ${BdsSelect(typ1, cl)}
      ${BdsText(typ2)}
    </div>
  `;
  return combo;
};
