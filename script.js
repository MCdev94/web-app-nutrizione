// script.js
const CONSTANTS = {
    DEVINE: {
      maleBase: 50,
      femaleBase: 45.5,
      heightFactor: 2.3,
      baseHeight: 152.4,
      inch: 2.54
    },
    DEMISPAN_MULTIPLIER: {
      m: 1.35,
      f: 1.32
    },
    MIFLIN: {
      maleOffset: 5,
      femaleOffset: -161
    },
    KCAL_FACTOR: 25
  };
  
  function calcolaPesoIdeale(sex, height_cm) {
    const base = sex.toLowerCase() === 'm' ? CONSTANTS.DEVINE.maleBase : CONSTANTS.DEVINE.femaleBase;
    return base + CONSTANTS.DEVINE.heightFactor * ((height_cm - CONSTANTS.DEVINE.baseHeight) / CONSTANTS.DEVINE.inch);
  }
  
  function stimaAltezzaDaDemispan(sex, demispan_cm) {
    return demispan_cm * CONSTANTS.DEMISPAN_MULTIPLIER[sex.toLowerCase()];
  }
  
  function calcolaMifflin(sex, peso, altezza_cm, eta) {
    const offset = sex.toLowerCase() === 'm' ? CONSTANTS.MIFLIN.maleOffset : CONSTANTS.MIFLIN.femaleOffset;
    return (10 * peso) + (6.25 * altezza_cm) - (5 * eta) + offset;
  }
  
  document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const sex = document.getElementById("sex").value.trim();
    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const heightInput = parseFloat(document.getElementById("height").value);
    const demispan = parseFloat(document.getElementById("demispan").value);
  
    let height_cm = heightInput;
    let altezzaStimata = false;
  
    if (!height_cm && demispan) {
      height_cm = stimaAltezzaDaDemispan(sex, demispan);
      altezzaStimata = true;
    }
  
    if (!height_cm || isNaN(weight) || isNaN(age)) {
      document.getElementById("results").innerHTML = "<p>Dati insufficienti per il calcolo.</p>";
      return;
    }
  
    const pesoIdeale = calcolaPesoIdeale(sex, height_cm);
    const eccesso = weight - pesoIdeale;
    const quota25 = eccesso > 0 ? eccesso * 0.25 : 0;
    const pesoCorretto = pesoIdeale + quota25;
    const mifflin = calcolaMifflin(sex, pesoCorretto, height_cm, age);
    const kcal25 = pesoCorretto * CONSTANTS.KCAL_FACTOR;
  
    document.getElementById("results").innerHTML = `
      <h2>📊 Risultati Nutrizionali</h2>
  
      <p><strong>Altezza utilizzata:</strong> ${height_cm.toFixed(1)} cm <br>
      <span class="explanation">${altezzaStimata ? "(Calcolata a partire dal demispan)" : "(Inserita manualmente)"}</span></p>
  
      <p><strong>Peso ideale:</strong> ${pesoIdeale.toFixed(2)} kg<br>
      <span class="explanation">Stimato con la formula di Devine in base all’altezza e al sesso.</span></p>
  
      <p><strong>Quanto sopra il peso ideale?</strong> ${eccesso.toFixed(2)} kg<br>
      <span class="explanation">Peso attuale - peso ideale.</span></p>
  
      <p><strong>Quota extra del 25%:</strong> ${quota25.toFixed(2)} kg<br>
      <span class="explanation">Usata per bilanciare il calcolo del fabbisogno.</span></p>
  
      <p><strong>Peso corretto per calcolo:</strong> ${pesoCorretto.toFixed(2)} kg<br>
      <span class="explanation">Peso ideale + 25% dell’eccesso.</span></p>
  
      <p><strong>🔥 Fabbisogno calorico (Mifflin):</strong> ${mifflin.toFixed(0)} kcal/giorno<br>
      <span class="explanation">Formula: 10×peso + 6.25×altezza - 5×età ± sesso.</span></p>
  
      <p><strong>⚡ Stima rapida: 25 kcal/kg:</strong> ${kcal25.toFixed(0)} kcal/giorno<br>
      <span class="explanation">Peso corretto × 25.</span></p>
    `;
  });