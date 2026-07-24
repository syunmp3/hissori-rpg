/* β0.4-15 戦闘画面演出 */
const battleStatusIconFiles={
  atkBuff:'atk_up.png',
  defBuff:'def_up.png',
  spdBuff:'spd_up.png',
  atkDebuff:'atk_down.png',
  defDebuff:'def_down.png',
  spdDebuff:'spd_down.png',
  poison:'poison.png',
  petrify:'petrify.png',
  fear:'fear.png'
};
function battleStatusIcons(unit){
  const poisonStacks=Math.min(99,Array.isArray(unit.poisonTimers)?unit.poisonTimers.length:0);
  const statuses=[
    {key:'atkBuff',count:timedStatusCount(unit,'atkBuff'),label:'攻撃UP'},
    {key:'defBuff',count:timedStatusCount(unit,'defBuff'),label:'防御UP'},
    {key:'spdBuff',count:timedStatusCount(unit,'spdBuff'),label:'素早さUP'},
    {key:'atkDebuff',count:timedStatusCount(unit,'atkDebuff'),label:'攻撃DOWN'},
    {key:'defDebuff',count:timedStatusCount(unit,'defDebuff'),label:'防御DOWN'},
    {key:'spdDebuff',count:timedStatusCount(unit,'spdDebuff'),label:'素早さDOWN'},
    {key:'poison',count:poisonStacks,label:'毒',showCount:true},
    {key:'petrify',count:unit.petrified?1:0,label:'石化',showCount:false},
    {key:'fear',count:unit.fearTurns>0?1:0,label:'恐怖',showCount:false}
  ].filter(status=>status.count>0);
  if(!statuses.length)return '<div class="battle-status-icons empty"></div>';
  return `<div class="battle-status-icons">${statuses.map(status=>`<span class="battle-status-icon" title="${status.label}"><img src="assets/icons/${battleStatusIconFiles[status.key]}" alt="${status.label}">${status.showCount===false?'':`<b>${status.count}</b>`}</span>`).join('')}</div>`;
}
function battleUnit(unit,side,index,selected,action=''){
  const statusIcons=battleStatusIcons(unit);
  return `<div class="unit battle-unit ${selected} ${unit.hp<=0?'dead':''}" data-side="${side}" data-index="${index}" onclick="${side==='enemy'?`selectEnemy(${index})`:`selectAlly(${index})`}"><div class="battle-visual">${monsterArtwork(unit,'battle')}</div><div class="name ${side==='enemy'?`ename ${eclass(unit)}`:''}">${unit.name}</div>${side==='ally'?`<div class="hp"><span style="width:${hpRate(unit)*100}%"></span></div><div class="sub hp-text">${unit.hp}/${unit.maxHp}</div>${statusIcons}<div class="action ally-action">${action||'待機中'}</div>`:`${unit.hp<=0?'<div class="action enemy-result">撃破</div>':statusIcons}`}</div>`;
}
function renderBattle(){const allies=party(),selected=allies[state.selectedAlly]||allies.find(a=>a.hp>0)||allies[0],itemId=state.carriedItemId,item=ITEM_DB[itemId];app.innerHTML=`<div class="status"><span>${difficultyConfig().name}　FLOOR ${state.floor}/${state.dungeon.max}　TURN ${state.turn}</span><span>${pointDisplay()}SP</span></div><div class="gauge">${gauge()}</div><div class="card battle-side"><div class="unitrow ${state.enemies.length===1?'single-enemy':''}">${state.enemies.map((e,i)=>battleUnit(e,'enemy',i,(state.pending?.side==='enemy'||state.pendingItem)&&e.hp>0?'target-option-enemy':'')).join('')}</div></div><div id="log" class="log">${state.battleLogs.join('')}</div><div class="card battle-side"><div class="unitrow">${allies.map((a,i)=>battleUnit(a,'ally',i,`${i===state.selectedAlly?'sel ':''}${state.pending?.side==='ally'&&a.hp>0?'target-option-ally':''}`,state.queue[i]?.name)).join('')}</div></div><div class="card"><div class="muted">${state.pendingItem?'アイテムを使う敵を選択':state.pending?(state.pending.side==='enemy'?'対象の敵を選択':'対象の味方を選択'):'行動を選択'}</div><div class="grid commands">${selected.skills.filter(id=>skills[id]&&skills[id].active!==false&&skills[id].type!=='passive').map(id=>{const s=skills[id];return`<button onclick="chooseSkill('${id}')" ${state.isProcessing?'disabled':''}>${s.name}<small>${s.cost}SP / ${targetLabel(s.target)}</small></button>`}).join('')}</div><div class="battle-actions"><button class="wide btn-next" onclick="executeTurn()" ${state.isProcessing?'disabled':''}>選択完了</button>${item?`<button class="battle-item-button" onclick="useBattleItem()" ${state.isProcessing||state.battleItemUsed?'disabled':''}>${itemArtwork(itemId,'small')}<small>${state.battleItemUsed?'使用済み':item.name}</small></button>`:''}</div></div>`;updateHeader();const l=document.getElementById('log');if(l)l.scrollTop=l.scrollHeight}
function effectiveness(sa,ta){const r=matchupMultiplier(sa,ta);return r>1?'weak':r<1?'resist':'normal'}
function battleEl(side,u){const i=side==='enemy'?state.enemies.indexOf(u):party().indexOf(u);return document.querySelector(`.battle-unit[data-side="${side}"][data-index="${i}"]`)}
async function attackMotion(side,u){const e=battleEl(side,u);if(!e||state.skip)return;e.classList.add(side==='ally'?'attack-up':'attack-down');await wait(240);e.classList.remove('attack-up','attack-down')}
function updateBattleHp(side,u){const e=battleEl(side,u);if(!e)return;const bar=e.querySelector('.hp span'),text=e.querySelector('.hp-text');if(bar)requestAnimationFrame(()=>bar.style.width=`${hpRate(u)*100}%`);if(text)text.textContent=`${u.hp}/${u.maxHp}`;if(u.hp<=0)e.classList.add('dead')}
function refreshBattleStatusIcons(unit){const side=state.enemies.includes(unit)?'enemy':'ally',e=battleEl(side,unit);if(!e)return;const current=e.querySelector('.battle-status-icons'),html=battleStatusIcons(unit),box=document.createElement('div');box.innerHTML=html;const next=box.firstElementChild;if(current&&next)current.replaceWith(next)}
async function damageEffect(side,u,result,s){const e=battleEl(side,u),type=effectiveness(s.attribute,u.attribute),n=result.damage;if(e){const p=document.createElement('div'),icon=!result.miss&&s.attribute!=='無'?attributeIconFiles[s.attribute]:null;if(!result.miss){e.classList.remove('hit-shake');void e.offsetWidth;e.classList.add('hit-shake')}p.className=`damage-popup ${result.miss?'miss':result.critical?'critical':type}`;p.innerHTML=result.miss?'<span>MISS</span>':`${icon?`<img src="assets/icons/${icon}" alt="">`:''}<span>${result.critical?'会心！ ':''}${n}</span>`;e.appendChild(p);setTimeout(()=>p.remove(),850)}updateBattleHp(side,u);if(result.miss)log(`<span class="damage-log miss">${u.name} への攻撃は外れた！</span>`);else log(`<span class="damage-log ${result.critical?'critical':type}">${result.critical?'会心の一撃！ ':''}${u.name} に ${n}ダメージ！${type==='weak'?' 弱点！':type==='resist'?' 耐性':''}</span>`);await wait(360)}
function canReceiveFear(source,target){
  const sourceLevel=source.level||1,targetLevel=target.level||1;
  return !target.isBoss&&!target.isMidBoss&&targetLevel<sourceLevel;
}
function tryApplyFear(source,target,skill){
  if(!skill.fearChance||target.hp<=0||!canReceiveFear(source,target))return false;
  if(Math.random()>=skill.fearChance)return false;
  target.fearTurns=Math.max(target.fearTurns||0,1);
  target.fearConsumed=false;
  refreshBattleStatusIcons(target);
  log(`<span class="status-log fear">${target.name} は恐怖で動けなくなった！</span>`);
  return true;
}
function poisonStackCount(unit){
  return Math.min(99,Array.isArray(unit.poisonTimers)?unit.poisonTimers.length:0);
}
function tryApplyPoison(source,target,skill){
  const addCount=Math.max(0,Math.floor(skill.poisonStacks||0));
  if(addCount<=0||target.hp<=0||target.poisonImmune)return false;
  if(!Array.isArray(target.poisonTimers))target.poisonTimers=[];
  const actual=Math.min(addCount,99-target.poisonTimers.length);
  for(let i=0;i<actual;i++)target.poisonTimers.push(5);
  if(actual<=0){
    log(`<span class="status-log poison">${target.name} の毒は最大まで重なっている！</span>`);
    return false;
  }
  log(`<span class="status-log poison">${target.name} に毒が${actual}層付与された！（毒×${poisonStackCount(target)}）</span>`);
  return true;
}
async function processPoisonTurn(){
  for(const [side,units] of [['ally',party()],['enemy',state.enemies]]){
    for(const unit of units){
      const stacks=poisonStackCount(unit);
      if(unit.hp<=0||stacks<=0)continue;
      const rate=(unit.isBoss||unit.isMidBoss)?.005:.01;
      const damage=Math.max(1,Math.floor(unit.maxHp*rate*stacks));
      unit.hp=Math.max(0,unit.hp-damage);
      log(`<span class="status-log poison">${unit.name} は毒で ${damage}ダメージ！（毒×${stacks}）</span>`);
      updateBattleHp(side,unit);
      await wait(250);
      unit.poisonTimers=unit.poisonTimers.map(turns=>turns-1).filter(turns=>turns>0);
      const remaining=poisonStackCount(unit);
      if(remaining<stacks&&remaining>0)log(`<span class="status-log poison">${unit.name} の毒が${stacks-remaining}層弱まった。（毒×${remaining}）</span>`);
      else if(remaining===0)log(`<span class="status-log poison">${unit.name} の毒が消えた。</span>`);
    }
  }
}
function petrifyChance(source,target){
  const sourceLevel=source.level||1,targetLevel=target.level||1;
  let chance=.85;
  if(targetLevel>sourceLevel)chance-=.85;
  else if(targetLevel<sourceLevel)chance+=.30;
  if(target.isBoss||target.isMidBoss)chance-=.80;
  return Math.max(0,Math.min(1,chance));
}
function tryApplyPetrify(source,target,skill){
  if(!skill.petrify||target.hp<=0)return false;
  const chance=petrifyChance(source,target);
  if(Math.random()>=chance){log(`<span class="status-log petrify">${target.name} は石化を免れた！</span>`);return false}
  target.petrified=true;
  target.petrifyTurns=0;
  log(`<span class="status-log petrify">${target.name} は石化した！</span>`);
  return true;
}
function processPetrifyRecovery(){
  for(const unit of [...party(),...state.enemies]){
    if(!unit.petrified||unit.hp<=0)continue;
    unit.petrifyTurns=(unit.petrifyTurns||0)+1;
    const chance=1-Math.pow(.5,unit.petrifyTurns);
    if(Math.random()<chance){
      unit.petrified=false;
      unit.petrifyTurns=0;
      log(`<span class="status-log petrify">${unit.name} の石化が解けた！</span>`);
    }
  }
}
async function consumeFearTurn(unit){
  if(unit.petrified){
    log(`<span class="status-log petrify">${unit.name} は石化していて行動できない！</span>`);
    await wait(DELAY);
    return true;
  }
  if((unit.fearTurns||0)<=0)return false;
  unit.fearConsumed=true;
  log(`<span class="status-log fear">${unit.name} は恐怖で行動できない！</span>`);
  await wait(DELAY);
  return true;
}
async function allyAct(a,q){
  q.used=true;
  const s=skills[q.skillId]||skills.NORMAL;
  if(await consumeFearTurn(a)){state.point=Math.min(10,state.point+(q.cost||0));q.used=false;return}
  if(s.type==='storeSp'){
    state.nextSpBonus++;
    log(`<b>${a.name} の ${s.name}！</b>`);
    log('次のターンに得られるSPが1増えた！');
    await wait(DELAY);
    return;
  }
  if(s.type==='charge'){
    state.point=Math.min(10,state.point+(s.spGain||0));
    log(`<b>${a.name} の ${s.name}！</b>`);
    log(`${s.spGain||0}SP獲得！`);
    await wait(DELAY);
    return;
  }
  if(s.type==='attack'){
    log(`<b>${a.name} の ${s.name}！</b>`);await attackMotion('ally',a);
    if(s.randomEachHit){
      const poisonTargets=new Set();
      for(let h=0;h<(s.hits||1);h++){
        const alive=state.enemies.filter(x=>x.hp>0);
        if(!alive.length)break;
        const t=alive[Math.floor(Math.random()*alive.length)],before=t.hp,result=attackResult(a,t,s);
        t.hp=Math.max(0,t.hp-result.damage);
        await damageEffect('enemy',t,result,s);
        recordAttackRecovery(a,before-t.hp,s,'ally');
        if(!result.miss){tryApplyFear(a,t,s);poisonTargets.add(t)}
      }
      poisonTargets.forEach(t=>tryApplyPoison(a,t,s));
    }else{
      const ts=s.target==='enemyAll'?state.enemies.filter(x=>x.hp>0):s.randomTarget?[sample(state.enemies.filter(x=>x.hp>0),1)[0]]:[state.enemies[q.target]?.hp>0?state.enemies[q.target]:state.enemies.find(x=>x.hp>0)];
      for(const t of ts.filter(Boolean)){let landed=false;for(let h=0;h<(s.hits||1)&&t.hp>0;h++){const before=t.hp,result=attackResult(a,t,s);t.hp=Math.max(0,t.hp-result.damage);await damageEffect('enemy',t,result,s);recordAttackRecovery(a,before-t.hp,s,'ally');if(!result.miss)landed=true}if(landed){tryApplyFear(a,t,s);tryApplyPoison(a,t,s)}}
    }
    applySelfCost(a,s);await wait(DELAY);
  }else if(s.type==='debuff'){
    const t=state.enemies[q.target]?.hp>0?state.enemies[q.target]:state.enemies.find(x=>x.hp>0);
    log(`<b>${a.name} の ${s.name}！</b>`);
    if(t){tryApplyPetrify(a,t,s);tryApplyPoison(a,t,s);}
    await wait(DELAY);
  }else if(s.type==='heal'){
    const z=party()[q.target],ts=s.target==='allyAll'?party().filter(x=>x.hp>0):[(z&&z.hp>0)?z:party().find(x=>x.hp>0)];
    log(`<b>${a.name} の ${s.name}！</b>`);
    for(const t of ts.filter(Boolean)){const n=Math.max(s.minHeal||0,Math.round(t.maxHp*(s.healRate??(.3*(s.multiplier||1))))),actual=Math.min(n,t.maxHp-t.hp);t.hp+=actual;log(`${t.name} のHPが ${actual}回復！`);updateBattleHp('ally',t);if(s.randomBuff){const kind=['atkBuff','defBuff','spdBuff'][Math.floor(Math.random()*3)];applyTimedStatus(t,kind,1);refreshBattleStatusIcons(t)}}
    await wait(DELAY);
  }else if(skillStatusKind(s)){
    const kind=skillStatusKind(s),isBuff=kind.endsWith('Buff');
    const candidates=isBuff?party().filter(x=>x.hp>0):state.enemies.filter(x=>x.hp>0);
    const selected=s.target==='self'?a:(isBuff?party()[q.target]:state.enemies[q.target]);
    const targets=s.target==='allyAll'||s.target==='enemyAll'?candidates:[selected?.hp>0?selected:candidates[0]];
    log(`<b>${a.name} の ${s.name}！</b>`);
    for(const t of targets.filter(Boolean))applyTimedStatus(t,kind,s.statusStacks||1);
    await wait(DELAY);
  }
}
async function enemyAct(e){
  if(await consumeFearTurn(e))return;
  if(e.escapeChance&&Math.random()<e.escapeChance){
    e.escaped=true;e.hp=0;
    log(`<b>${e.name}は逃走した！</b>`);
    renderBattle();
    await wait(DELAY);
    return;
  }
  const ss=skills[e.solid];
  const usable=ss&&ss.active!==false&&ss.type!=='passive'&&ss.type!=='storeSp';
  const s=usable&&state.enemyPoint>=ss.cost?ss:skills.NORMAL;
  if(s!==skills.NORMAL)state.enemyPoint-=s.cost;
  if(s.type==='charge'){
    state.enemyPoint=Math.min(10,state.enemyPoint+(s.spGain||0));
    log(`<b>${e.name} の ${s.name}！</b>`);
    log(`${e.name}は${s.spGain||0}SP獲得！`);
    await wait(DELAY);
    return;
  }
  if(s.type==='heal'){
    const aliveEnemies=state.enemies.filter(x=>x.hp>0),lowest=[...aliveEnemies].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
    const targets=s.target==='allyAll'?aliveEnemies:[lowest];
    if(!targets.filter(Boolean).length)return;
    log(`<b>${e.name} の ${s.name}！</b>`);
    for(const t of targets.filter(Boolean)){
      const n=Math.min(Math.max(s.minHeal||0,Math.round(t.maxHp*(s.healRate??(.3*(s.multiplier||1))))),t.maxHp-t.hp);
      t.hp+=n;
      log(`${t.name} のHPが ${n}回復！`);
      updateBattleHp('enemy',t);
      if(s.randomBuff){const kind=['atkBuff','defBuff','spdBuff'][Math.floor(Math.random()*3)];applyTimedStatus(t,kind,1);refreshBattleStatusIcons(t)}
    }
    await wait(DELAY);
    return;
  }
  const alive=party().filter(x=>x.hp>0);
  if(!alive.length)return;
  if(skillStatusKind(s)){
    const kind=skillStatusKind(s),isBuff=kind.endsWith('Buff');
    const candidates=isBuff?state.enemies.filter(x=>x.hp>0):alive;
    const targets=s.target==='self'?[e]:s.target==='allyAll'||s.target==='enemyAll'?candidates:[candidates[Math.floor(Math.random()*candidates.length)]];
    log(`<b>${e.name} の ${s.name}！</b>`);
    for(const t of targets.filter(Boolean))applyTimedStatus(t,kind,s.statusStacks||1);
    await wait(DELAY);
    return;
  }
  if(s.type==='debuff'){
    const t=alive[Math.floor(Math.random()*alive.length)];
    log(`<b>${e.name} の ${s.name}！</b>`);
    tryApplyPetrify(e,t,s);
    tryApplyPoison(e,t,s);
    await wait(DELAY);
    return;
  }
  log(`<b>${e.name} の ${s.name}！</b>`);
  await attackMotion('enemy',e);
  if(s.randomEachHit){
    const poisonTargets=new Set();
    for(let h=0;h<(s.hits||1);h++){
      const currentAlive=party().filter(x=>x.hp>0);
      if(!currentAlive.length)break;
      const t=currentAlive[Math.floor(Math.random()*currentAlive.length)],before=t.hp,result=attackResult(e,t,s);
      t.hp=Math.max(0,t.hp-result.damage);
      await damageEffect('ally',t,result,s);
      recordAttackRecovery(e,before-t.hp,s,'enemy');
      if(!result.miss){tryApplyFear(e,t,s);poisonTargets.add(t)}
    }
    poisonTargets.forEach(t=>tryApplyPoison(e,t,s));
  }else{
    const ts=s.target==='enemyAll'?alive:[alive[Math.floor(Math.random()*alive.length)]];
    for(const t of ts){
      let landed=false;
      for(let h=0;h<(s.hits||1)&&t.hp>0;h++){
        const before=t.hp,result=attackResult(e,t,s);
        t.hp=Math.max(0,t.hp-result.damage);
        await damageEffect('ally',t,result,s);
        recordAttackRecovery(e,before-t.hp,s,'enemy');
        if(!result.miss)landed=true;
      }
      if(landed){tryApplyFear(e,t,s);tryApplyPoison(e,t,s);}
    }
  }
  applySelfCost(e,s);
  await wait(DELAY);
}
