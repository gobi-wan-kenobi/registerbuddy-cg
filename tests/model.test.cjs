const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const el = {innerHTML:'', addEventListener(){}, classList:{add(){},remove(){}},textContent:''};
const context = vm.createContext({structuredClone, setTimeout, clearTimeout, URL, Blob,
 document:{querySelector(){return el},querySelectorAll(){return []},addEventListener(){}},
 window:{addEventListener(){},scrollTo(){}}, history:{replaceState(){}},location:{hash:''},
 localStorage:{getItem(){return null},setItem(){}},console});
vm.runInContext(source,context);
const run = s => vm.runInContext(s,context);
let cases=0;
for (const stage of ['early','open','late']) for(const risk of ['expected','higher']) {
 run(`state.stage='${stage}';state.risk='${risk}'`);
 for(const resource of ['seats','rooms','readers']) for(let day=0;day<5;day++) {
  const b=run(`breakdown('${resource}',${day})`);
  assert.equal(b.booked+b.known+b.additional,b.expected);
  assert.ok(b.booked>=0&&b.known>=0&&b.additional>=0&&b.high>=b.expected);
  if(stage==='early')assert.equal(b.booked,0);
  cases++;
 }
 const best=run('bestPlan()');assert.ok(best);assert.equal(best.shortfall,0);assert.equal(best.unused,0);
 for(let r=0;r<=3;r++)for(let s=0;s<=3;s++)for(let h=0;h<=2;h++){
  const p=run(`scenario(${r},${s},${h})`);
  assert.equal(p.capacity,Math.min(p.physical,p.coverage));
  if(p.shortfall===0&&p.unused===0)assert.ok(best.cost<=p.cost);
 }
}
run("state.stage='late';state.risk='expected'");
assert.equal(run('scenario(0,0,0).shortfall'),23);
assert.equal(run('scenario(1,0,0).capacity'),24);
assert.equal(run('scenario(1,1,0).capacity'),32);
assert.equal(run('scenario(1,1,0).cost'),1320);
assert.equal(run('bestPlan().cost'),2090);
run("state.risk='higher'");assert.equal(run('bestPlan().cost'),3550);
run('state.capacities.rooms=8');assert.equal(run('bestPlan()'),null);
assert.ok(run('recommendations()').includes('No feasible recommendation'));
run('state=structuredClone(DEFAULT);state.materialReceived=true');assert.equal(run('scenario(0,0,0).shortfall'),23);
run("state.sparse=true;state.resource='rooms';state.view='scenarios';render()");assert.ok(el.innerHTML.includes('Room demand has been withheld'));
assert.throws(()=>run("changeNumber('extraRooms',-1)"));
assert.equal(run('state.extraRooms'),0);
console.log(`PASS: ${cases} demand decompositions; scenario costs; staff bottlenecks; minimum-cost recommendations; no feasible plan; missing-data propagation; materials independence; invalid input.`);
