// La stratégie d'école (leçon 16, variante A du test forex) rejouée sur l'or, la crypto et les indices (H1, Yahoo).
// Mêmes règles que Modules/_generateur/strategie.js :
//   sens = clôture daily de la veille au-dessus (achat) ou au-dessous (vente) de l'EMA 200 ;
//   mèche au-delà du dernier sommet (creux) H1 intact, clôture en deçà ;
//   ordre stop au-delà du dernier creux (sommet) H1 qui précède la mèche ; stop au-delà de la mèche ; objectif 2R ;
//   décisions à 8 h, 12 h 30 et 18 h 30 (Paris), en semaine ; ordre annulé après 24 h, ou si le prix touche le stop avant.
// Deux différences, pour passer d'un actif à l'autre :
//   - la marge du stop (5 pips) et le décalage de l'ordre (1 pip) deviennent des fractions de l'ATR 14 H1,
//     calibrées sur l'EUR/USD : la même règle, en proportion de ce que l'actif bouge ;
//   - un gap au-delà de l'entrée ou du stop s'exécute à l'ouverture, et les frais se comptent en prix.
// Lancer : node test_actifs.js
const fs = require('fs'), path = require('path');
const FX = path.join(__dirname, '../../../Modules/_generateur/data');

const ny = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false });
const pa = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' });
// séance forex, or et futures US : la journée se termine à 17 h, heure de New York
function dayNY(t) {
  const p = Object.fromEntries(ny.formatToParts(new Date(t * 1000)).map(x => [x.type, x.value]));
  let d = new Date(Date.UTC(+p.year, +p.month - 1, +p.day));
  if (+p.hour % 24 >= 17) d = new Date(d.getTime() + 86400000);
  return d.toISOString().slice(0, 10);
}
const dayUTC = t => new Date(t * 1000).toISOString().slice(0, 10);
const dayParis = t => pa.format(new Date(t * 1000));

// Bougies H4, alignées comme sur TradingView : sur le début de séance (17 h New York pour le forex, 18 h pour les
// futures du CME), sur minuit UTC pour la crypto, sur 9 h à Paris pour le DAX au comptant.
const nyH = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: '2-digit', hour12: false });
const paH = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', hour: '2-digit', hour12: false });
const h4NY = debut => t => dayNY(t) + '#' + Math.floor(((+nyH.format(new Date(t * 1000)) % 24) - debut + 24) % 24 / 4);
const h4UTC = t => dayUTC(t) + '#' + Math.floor(new Date(t * 1000).getUTCHours() / 4);
const h4DAX = t => dayParis(t) + '#' + Math.floor(Math.max(0, (+paH.format(new Date(t * 1000)) % 24) - 9) / 4);

// cout : aller-retour en prix (écart et commission) ; pct : en part du prix
const ACTIFS = {
  GC:  { nom: 'Or (futures COMEX)',      jour: dayNY,    semaine: true,  cout: 0.30, h4: h4NY(18) },
  BTC: { nom: 'Bitcoin',                 jour: dayUTC,   semaine: false, pct: 0.001, h4: h4UTC },
  ETH: { nom: 'Ether',                   jour: dayUTC,   semaine: false, pct: 0.001, h4: h4UTC },
  ES:  { nom: 'S&P 500 (futures)',       jour: dayNY,    semaine: true,  cout: 0.5,  h4: h4NY(18) },
  NQ:  { nom: 'Nasdaq 100 (futures)',    jour: dayNY,    semaine: true,  cout: 1.2,  h4: h4NY(18) },
  DAX: { nom: 'DAX (séance au comptant)', jour: dayParis, semaine: true,  cout: 1.2,  h4: h4DAX },
};
const PAIRES = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCHF', 'USDCAD', 'NZDUSD', 'EURJPY'];

function lire(p) {
  const r = JSON.parse(fs.readFileSync(p)).chart.result[0], q = r.indicators.quote[0];
  return r.timestamp.map((t, i) => ({ t, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i] })).filter(b => b.o != null && b.h != null && b.l != null && b.c != null && b.h >= b.l);
}
function charger(sym) {
  if (PAIRES.includes(sym)) {
    const f = sym === 'EURUSD' ? ['h1.json', 'd1.json'] : [`fx/${sym}_h1.json`, `fx/${sym}_d1.json`];
    const pip = sym.endsWith('JPY') ? 0.01 : 1e-4;
    return { h1: lire(path.join(FX, f[0])), d1: lire(path.join(FX, f[1])), jour: dayNY, semaine: true, pip, cout: pip, h4: h4NY(17) };
  }
  const a = ACTIFS[sym];
  return { h1: lire(path.join(__dirname, 'data', `${sym}_h1.json`)), d1: lire(path.join(__dirname, 'data', `${sym}_d1.json`)), ...a };
}
function grouper(bars, cle) {
  const out = [];
  for (const b of bars) { const k = cle(b.t), last = out.at(-1); if (last && last.k === k) { last.h = Math.max(last.h, b.h); last.l = Math.min(last.l, b.l); last.c = b.c; } else out.push({ k, t: b.t, o: b.o, h: b.h, l: b.l, c: b.c }); }
  return out;
}
const fmtP = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false });
const parisHM = t => { const p = fmtP.formatToParts(new Date(t * 1000)).reduce((o, x) => (o[x.type] = x.value, o), {}); return { h: +p.hour % 24, m: +p.minute, wd: p.weekday }; };
function routine(t) {
  for (let x = Math.ceil(t / 1800) * 1800; x < t + 5 * 86400; x += 1800) { const { h, m, wd } = parisHM(x); if (['sam.', 'dim.'].includes(wd)) continue; if ((h === 8 && m === 0) || (h === 12 && m === 30) || (h === 18 && m === 30)) return x; }
}

function preparer(sym) {
  const A = charger(sym), { h1 } = A;
  let D = grouper(h1, A.jour);
  if (A.semaine) D = D.filter(d => { const wd = new Date(d.k + 'T12:00:00Z').getUTCDay(); return wd >= 1 && wd <= 5; });
  // EMA 200 : clôtures daily de Yahoo avant le H1, puis clôtures reconstruites
  const yd = A.d1.map(b => ({ k: new Date((b.t + 43200) * 1000).toISOString().slice(0, 10), c: b.c }));
  const closes = [...yd.filter(x => x.k < D[0].k).map(x => x.c), ...D.map(x => x.c)], off = closes.length - D.length;
  const k = 2 / 201; let e = closes[0]; const ema = closes.map(c => (e = c * k + e * (1 - k))).slice(off);
  // ATR 14 H1 (Wilder)
  const atr = []; let a = null;
  h1.forEach((b, i) => { const tr = i ? Math.max(b.h - b.l, Math.abs(b.h - h1[i - 1].c), Math.abs(b.l - h1[i - 1].c)) : b.h - b.l; a = a == null ? tr : (a * 13 + tr) / 14; atr.push(i >= 14 ? a : null); });
  const H4 = [];
  for (const b of h1) { const key = A.h4(b.t), last = H4.at(-1); if (last && last.key === key) { last.h = Math.max(last.h, b.h); last.l = Math.min(last.l, b.l); last.c = b.c; last.end = b.t + 3600; } else H4.push({ key, t: b.t, end: b.t + 3600, o: b.o, h: b.h, l: b.l, c: b.c }); }
  return { sym, A, h1, D, ema, atr, H4, dayIdx: new Map(D.map((b, i) => [b.k, i])) };
}

// Zones H4, comme la variante D de strategie.js et comme l'indicateur : le FVG entre la bougie 1 et la 3, et l'order
// block, la dernière bougie contraire, de la bougie 1 aux quatre qui la précèdent. Une zone naît à la clôture de la
// bougie 3, meurt à la première clôture H4 au-delà de son autre bord, et compte 30 jours au plus.
function zonesH4(H4, sg) {
  const hi = b => sg * (sg > 0 ? b.h : b.l), lo = b => sg * (sg > 0 ? b.l : b.h), cl = b => sg * b.c;
  const zones = [];
  for (let i = 2; i < H4.length; i++) {
    const c1 = H4[i - 2], c3 = H4[i];
    if (lo(c1) > hi(c3)) {
      zones.push({ a: hi(c3), b: lo(c1), from: c3.end, broken: Infinity });
      for (let j = i - 2; j >= Math.max(0, i - 6); j--) if (sg > 0 ? H4[j].c > H4[j].o : H4[j].c < H4[j].o) { zones.push({ a: lo(H4[j]), b: hi(H4[j]), from: c3.end, broken: Infinity }); break; }
    }
  }
  for (const z of zones) for (const b of H4) if (b.t >= z.from && cl(b) > z.b) { z.broken = b.end; break; }
  return zones;
}

// marge et décalage : en pips (le test d'origine) ou en ATR (kM et kO calibrés sur l'EUR/USD)
function jouer(P, sens, opt) {
  const { A, h1, D, ema, atr, dayIdx } = P, sg = sens === 'achat' ? -1 : 1;
  const hi = b => sg * (sg > 0 ? b.h : b.l), lo = b => sg * (sg > 0 ? b.l : b.h), cl = b => sg * b.c, op = b => sg * b.o;
  const isTop = (arr, i, f) => i >= 2 && i + 2 < arr.length && [i - 2, i - 1, i + 1, i + 2].every(j => f(arr[j]) < f(arr[i]));
  const out = [], vus = new Set(), from = Date.parse(opt.from) / 1000, to = Date.parse(opt.to) / 1000;
  const zones = opt.zone ? zonesH4(P.H4, sg) : null;
  for (let s = 5; s < h1.length - 2; s++) {
    const bs = h1[s]; if (bs.t < from || bs.t >= to || atr[s] == null) continue;
    const di = dayIdx.get(A.jour(bs.t)); if (di == null || di < 30) continue;
    if (!(cl(D[di - 1]) < sg * ema[di - 1])) continue;
    let i0 = -1; for (let i = s - 3; i >= Math.max(2, s - 72); i--) if (isTop(h1, i, hi)) { let ok = true; for (let x = i + 1; x < s; x++) if (hi(h1[x]) > hi(h1[i])) { ok = false; break; } if (ok) { i0 = i; break; } }
    if (i0 < 0) continue;
    const lvl = hi(h1[i0]); if (!(hi(bs) > lvl && cl(bs) < lvl)) continue;
    if (vus.has(i0)) continue; vus.add(i0);
    // condition 2 : la mèche touche une zone H4 vivante, et la clôture ne la traverse pas
    if (zones && !zones.some(z => z.from <= bs.t && z.broken > bs.t && bs.t - z.from < 30 * 86400 && hi(bs) >= z.a && cl(bs) <= z.b)) continue;
    let c = -1; for (let x = s - 1; x > i0; x--) if (isTop(h1, x, b => -lo(b))) { c = x; break; }
    if (c < 0) continue;
    const marge = opt.pips ? 5 * A.pip : opt.kM * atr[s], decal = opt.pips ? A.pip : opt.kO * atr[s];
    const entry = lo(h1[c]) - decal, stop = hi(bs) + marge, risk = stop - entry, target = entry - 2 * risk;
    // Le plan est connu à la clôture de la mèche si la bougie d'avant ne peut plus devenir un creux ;
    // sinon, il faut attendre la bougie suivante pour savoir lequel est le dernier creux.
    const canPiv = s >= 3 && [s - 3, s - 2, s].every(j => lo(h1[s - 1]) < lo(h1[j]));
    const ready = h1[c + 2 > s || canPiv ? s + 1 : s].t + 3600, place = routine(ready);
    let etat = 'attente', fill = null, R = null;
    for (let x = s + 1; x < h1.length; x++) {
      const b = h1[x], end = b.t + 3600;
      if (etat === 'attente') {
        if (end <= place) { if (lo(b) <= entry) { etat = 'raté'; break; } if (hi(b) >= stop) { etat = 'annulé'; break; } continue; }
        if (b.t >= place + 86400) { etat = 'expiré'; break; }
        if (hi(b) >= stop) { etat = 'annulé'; break; }
        if (lo(b) <= entry) { etat = 'en cours'; fill = Math.min(entry, op(b)); if (hi(b) >= stop) { R = (fill - stop) / risk; break; } }
      } else {
        if (hi(b) >= stop) { R = (fill - Math.max(stop, op(b))) / risk; break; }
        if (lo(b) <= target) { R = (fill - target) / risk; break; }
      }
    }
    const cout = A.pct ? A.pct * Math.abs(entry) : A.cout;
    out.push({ sym: P.sym, sens, t: bs.t, etat, R, Rnet: R == null ? null : R - cout / risk, risque: risk / Math.abs(entry) });
  }
  return out;
}

const bilan = rows => {
  const d = rows.filter(r => r.R != null), n = d.length, w = d.filter(r => r.R > 0).length, Rn = d.reduce((a, r) => a + r.Rnet, 0);
  return { n, w, Rn, parTrade: n ? Rn / n : 0 };
};
const ligne = (nom, rows) => { const b = bilan(rows); return `${nom.padEnd(26)} ${String(b.n).padStart(4)} trades  ${String(Math.round(b.n ? 100 * b.w / b.n : 0)).padStart(3)} % gagnants  ${(b.Rn >= 0 ? '+' : '') + b.Rn.toFixed(1).padStart(5)}R net  ${(b.parTrade >= 0 ? '+' : '') + b.parTrade.toFixed(2)}R/trade`; };

// calibrage : 5 pips et 1 pip en ATR 14 H1 médian de l'EUR/USD sur la période du test d'origine
const E = preparer('EURUSD');
const vals = E.h1.map((b, i) => [b.t, E.atr[i]]).filter(([t, v]) => v != null && t >= Date.parse('2024-04-01') / 1000 && t < Date.parse('2026-10-27') / 1000).map(([, v]) => v).sort((a, b) => a - b);
const med = vals[Math.floor(vals.length / 2)], kM = 5e-4 / med, kO = 1e-4 / med;
console.log(`ATR 14 H1 médian de l'EUR/USD : ${(med * 1e4).toFixed(1)} pips, donc 5 pips = ${kM.toFixed(2)} ATR et 1 pip = ${kO.toFixed(2)} ATR\n`);

const tous = (sym, opt) => { const P = preparer(sym); return [...jouer(P, 'achat', opt), ...jouer(P, 'vente', opt)]; };
const FXP = { from: '2024-04-01', to: '2026-10-27' };
const fxPips = PAIRES.flatMap(s => tous(s, { ...FXP, pips: true })), fxAtr = PAIRES.flatMap(s => tous(s, { ...FXP, kM, kO }));
console.log('Forex, 8 paires, avril 2024 à octobre 2026');
console.log(ligne('  marge en pips', fxPips));
console.log(ligne('  marge en ATR', fxAtr));

const resultats = {};
console.log('\nAutres actifs, marge en ATR, du premier mois complet à novembre 2026');
for (const sym of Object.keys(ACTIFS)) {
  const P = preparer(sym), from = new Date((P.h1[0].t + 31 * 86400) * 1000).toISOString().slice(0, 10), to = '2026-11-05';
  const rows = [...jouer(P, 'achat', { from, to, kM, kO }), ...jouer(P, 'vente', { from, to, kM, kO })];
  resultats[sym] = { ...bilan(rows), from, to, risqueMedian: rows.map(r => r.risque).sort((a, b) => a - b)[Math.floor(rows.length / 2)], annees: {} };
  console.log(ligne(`  ${ACTIFS[sym].nom}`, rows) + `   depuis ${from}, stop médian ${(100 * resultats[sym].risqueMedian).toFixed(2)} % du prix`);
  for (const y of ['2024', '2025', '2026']) { const r = rows.filter(x => new Date(x.t * 1000).getUTCFullYear() == y); if (r.length) { resultats[sym].annees[y] = bilan(r); console.log(ligne(`      ${y}`, r)); } }
}
const autres = Object.keys(ACTIFS).flatMap(sym => { const P = preparer(sym), from = new Date((P.h1[0].t + 31 * 86400) * 1000).toISOString().slice(0, 10); return [...jouer(P, 'achat', { from, to: '2026-11-05', kM, kO }), ...jouer(P, 'vente', { from, to: '2026-11-05', kM, kO })]; });
console.log(ligne('\n  Les six ensemble', autres));
// écart-type d'un trade gagné à +2R ou perdu à −1R, avec 34 % de gagnants : environ 1,4R
const n = bilan(autres).n;
console.log(`  Avec ${n} trades, le hasard seul fait varier le résultat d'environ ±${(2 * 1.42 / Math.sqrt(n)).toFixed(2)}R par trade (2 écarts-types).`);

// La condition 2 en plus, telle que l'indicateur la vérifie : la mèche sur un order block ou un FVG H4 encore intact.
const fxZone = PAIRES.flatMap(s => tous(s, { ...FXP, pips: true, zone: true }));
const zoneRes = {};
for (const sym of Object.keys(ACTIFS)) { const P = preparer(sym), { from, to } = resultats[sym]; zoneRes[sym] = bilan([...jouer(P, 'achat', { from, to, kM, kO, zone: true }), ...jouer(P, 'vente', { from, to, kM, kO, zone: true })]); }
const autresZone = Object.keys(ACTIFS).flatMap(sym => { const P = preparer(sym), { from, to } = resultats[sym]; return [...jouer(P, 'achat', { from, to, kM, kO, zone: true }), ...jouer(P, 'vente', { from, to, kM, kO, zone: true })]; });
console.log('\nAvec la zone H4 (order block ou FVG)');
console.log(ligne('  Forex, marge en pips', fxZone));
for (const sym of Object.keys(ACTIFS)) console.log(`  ${ACTIFS[sym].nom.padEnd(24)} ${zoneRes[sym].n} trades  ${zoneRes[sym].parTrade >= 0 ? '+' : ''}${zoneRes[sym].parTrade.toFixed(2)}R/trade`);
console.log(ligne('  Les six ensemble', autresZone));
fs.writeFileSync(path.join(__dirname, 'resultats.json'), JSON.stringify({ calibrage: { atrMedianPips: med * 1e4, kM, kO }, forex: { pips: bilan(fxPips), atr: bilan(fxAtr) }, actifs: resultats, ensemble: bilan(autres), zone: { forex: bilan(fxZone), actifs: zoneRes, ensemble: bilan(autresZone) } }, null, 2));

// Le tableau lisible, en français : écrit par le test, jamais recopié à la main.
const v = (x, d) => x.toFixed(d).replace('.', ',').replace('-', '−');
const sR = x => (Math.abs(x) < 0.005 ? '' : x > 0 ? '+' : '') + v(Math.abs(x) < 0.005 ? 0 : x, 2) + 'R';
const mois = d => new Date(d + 'T12:00:00Z').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
const marge = b => `±${v(2 * 1.42 / Math.sqrt(b.n), 2)}R`;
const lg = (nom, b, extra = '') => b.n ? `| ${nom} | ${b.n} | ${Math.round(100 * b.w / b.n)} % | ${sR(b.parTrade)} | ${marge(b)} |${extra}` : `| ${nom} | 0 | | | |${extra}`;
const md = [
  '# Ce que disent les tests',
  '',
  `La stratégie d'école de la leçon 16, rejouée en H1 sur les données horaires de Yahoo par \`test_actifs.js\`. Chaque trade gagne environ 2R ou perd environ 1R, frais déduits. La marge du hasard est de deux écarts-types : un résultat qui reste dans cette marge n'est pas un avantage démontré. Le premier tableau laisse de côté la zone H4 (condition 2), rejouée plus bas.`,
  '',
  '| Marché | Trades | Gagnants | Par trade | Marge du hasard |',
  '|---|---|---|---|---|',
  lg('Forex, 8 paires, marge en pips (la leçon 16)', bilan(fxPips)),
  lg('Forex, 8 paires, marge en ATR', bilan(fxAtr)),
  ...Object.keys(ACTIFS).map(s => lg(`${ACTIFS[s].nom}, depuis ${mois(resultats[s].from)}`, resultats[s])),
  lg('**Or, crypto et indices, ensemble**', bilan(autres)),
  '',
  '## Année par année',
  '',
  '| Marché | 2024 | 2025 | 2026 |',
  '|---|---|---|---|',
  ...Object.keys(ACTIFS).map(s => `| ${ACTIFS[s].nom} | ${['2024', '2025', '2026'].map(y => resultats[s].annees[y] ? `${sR(resultats[s].annees[y].parTrade)} (${resultats[s].annees[y].n})` : '').join(' | ')} |`),
  '',
  'Entre parenthèses, le nombre de trades.',
  '',
  '## Avec la zone H4',
  '',
  `La condition 2 en plus, telle que l'indicateur la vérifie : la mèche touche un order block ou un FVG H4 encore intact, de moins de 30 jours, et la clôture ne le traverse pas. Les supports, jugés à l'œil, n'y sont pas.`,
  '',
  '| Marché | Trades | Gagnants | Par trade | Marge du hasard |',
  '|---|---|---|---|---|',
  lg('Forex, 8 paires, marge en pips', bilan(fxZone)),
  ...Object.keys(ACTIFS).map(s => lg(ACTIFS[s].nom, zoneRes[s])),
  lg('**Or, crypto et indices, ensemble**', bilan(autresZone)),
  '',
  '## Les règles du test',
  '',
  `- **Les mêmes que la leçon 16** : sens donné par l'EMA 200 daily, mèche au-delà du dernier swing H1 intact, ordre stop au-delà du swing qui la précède, stop au-delà de la mèche, objectif 2R. Ordre posé à 8 h, 12 h 30 ou 18 h 30 (Paris), en semaine, au premier passage après le moment où le plan est connu : la clôture de la mèche, ou la bougie suivante si celle d'avant la mèche peut encore devenir le dernier swing. Annulé après 24 h ou si le prix touche le stop avant.`,
  `- **Deux approximations**, faute de voir dans une bougie H1 : la bougie qui contient l'heure de pose compte comme après la pose ; pendant l'attente, une bougie qui touche l'entrée et le stop compte comme annulée ; une bougie qui touche le stop et l'objectif compte comme perdante.`,
  `- **La marge du stop et le décalage de l'ordre** passent en ATR 14 H1 hors du forex : ${v(kM, 2)} ATR et ${v(kO, 2)} ATR valent 5 pips et 1 pip sur l'EUR/USD, dont l'ATR médian est de ${v(med * 1e4, 1)} pips.`,
  '- **Les bougies H4** sont alignées comme sur TradingView : 17 h à New York pour le forex, 18 h pour les futures du CME, minuit UTC pour la crypto, 9 h à Paris pour le DAX.',
  '- **Un gap** au-delà de l\'entrée ou du stop s\'exécute à l\'ouverture.',
  '- **Les frais**, aller-retour : 1 pip sur le forex, 0,30 $ sur l\'or, 0,1 % du prix sur la crypto, 0,5 point sur le S&P 500, 1,2 point sur le Nasdaq 100 et le DAX.',
  '- **Les limites** : deux à trois ans de données horaires seulement, la limite de Yahoo ; l\'or, le S&P 500 et le Nasdaq sont rejoués sur les futures, dont les changements d\'échéance créent de petits sauts ; le DAX sur sa seule séance au comptant, de 9 h à 17 h 30.',
  '',
].join('\n');
fs.writeFileSync(path.join(__dirname, 'Résultats.md'), md);
