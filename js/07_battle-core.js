function hpRate(x){return Math.max(0,x.hp/x.maxHp)}function eclass(x){return hpRate(x)<=.2?'danger':hpRate(x)<=.4?'warn':''}
function gauge(){return Array.from({length:9},(_,i)=>`<div class="cell ${i<Math.min(9,state.point)?'on':''}"></div>`).join('')}
function pointDisplay(){return state.point>9?`9+${state.point-9}/9`:`${state.point}/9`}
function confirmRetire(){
  if(state.isProcessing)return;
  state.screen='retireConfirm';
  app.innerHTML=`<div class="card result">
    <div class="title">リタイア確認</div>
    <p>ダンジョンからリタイアしますか？</p>
    <div class="muted">リタイアすると敗北扱いになり、今回の仲間候補を失います。</div>
    <div class="choice-stack">
      <button class="btn-cancel" onclick="retireDungeon()">リタイアする</button>
      <button class="btn-next" onclick="returnToBattle()">戦闘へ戻る</button>
    </div>
  </div>`;
  skipBtn.style.display='none';
  retireBtn.style.display='none';
  homeBtn.style.display='none';
}
function returnToBattle(){
  state.screen='battle';
  renderBattle();
  updateHeader();
}
function retireDungeon(){
  showDefeat(true);
}
function selectEnemy(i){
  if(state.isProcessing||state.enemies[i].hp<=0)return;
  state.selectedEnemy=i;
  if(state.pendingItem==='MONSTER_FOOD_1'){
    state.enemies[i].recruitBonus=(state.enemies[i].recruitBonus||0)+.10;
    consumeBattleItem();
    state.pendingItem=null;
    log(`${state.enemies[i].name}にモンスターの餌を使った！ 仲間候補率が10%上がった。`);
    renderBattle();
    return;
  }
  if(state.pending&&state.pending.side==='enemy'){
    const s=skills[state.pending.skillId],a=state.pending.actor;
    state.queue[a]={skillId:s.id,name:s.name,cost:s.cost,target:i};
    state.pending=null;
    nextActor();
  }
  renderBattle();
}
function consumeBattleItem(){
  const id=state.carriedItemId;
  if(!id||state.battleItemUsed||(state.items[id]||0)<1)return false;
  state.items[id]--;
  if(state.dungeonStartSnapshot?.items)state.dungeonStartSnapshot.items[id]=Math.max(0,(state.dungeonStartSnapshot.items[id]||0)-1);
  state.battleItemUsed=true;
  return true;
}
function useBattleItem(){
  const id=state.carriedItemId;
  if(state.isProcessing||state.battleItemUsed||!id||(state.items[id]||0)<1)return;
  if(id==='HEAL_POTION'){
    if(!consumeBattleItem())return;
    for(const ally of party().filter(x=>x.hp>0))ally.hp=Math.min(ally.maxHp,ally.hp+Math.round(ally.maxHp*.20));
    log('回復薬を使った！ 味方全体のHPが20%回復した。');
    renderBattle();
  }else if(id==='RETURN_SCROLL'){
    if(!consumeBattleItem())return;
    state.isProcessing=false;
    state.pending=null;
    state.queue=[null,null,null];
    showRecruit(false);
  }else if(id==='MONSTER_FOOD_1'){
    state.pendingItem=id;
    state.pending=null;
    log('モンスターの餌を使う敵を選択してください。');
    renderBattle();
  }
}
function selectAlly(i){
  if(state.isProcessing)return;
  if(state.pending&&state.pending.side==='ally'){
    confirmAllyTarget(i);
    return;
  }
  if(party()[i].hp>0){
    state.selectedAlly=i;
    renderBattle();
  }
}
function reserved(except=-1){return state.queue.reduce((s,q,i)=>s+(i===except?0:q?.cost||0),0)}
function chooseSkill(id){
  const s=skills[id],i=state.pending?.actor??state.selectedAlly;
  if(!s||s.active===false||s.type==='passive')return;
  if(state.point-reserved(i)<s.cost){log('SP不足');return}
  state.selectedAlly=i;
  state.pending=null;
  if(s.target==='allySingle'){
    state.pending={skillId:id,actor:i,side:'ally'};
    renderBattle();
    return;
  }
  if(s.target==='enemySingle'){
    state.pending={skillId:id,actor:i,side:'enemy'};
    renderBattle();
    return;
  }
  state.queue[i]={skillId:id,name:s.name,cost:s.cost,target:null};
  nextActor();
  renderBattle();
}
function confirmAllyTarget(i){
  if(!state.pending||state.pending.side!=='ally'||party()[i].hp<=0)return;
  const s=skills[state.pending.skillId],a=state.pending.actor;
  state.queue[a]={skillId:s.id,name:s.name,cost:s.cost,target:i};
  state.pending=null;
  nextActor();
  renderBattle();
}
function nextActor(){const a=party();let n=a.findIndex((x,i)=>x.hp>0&&!state.queue[i]);if(n>=0)state.selectedAlly=n}
function log(x){
  state.battleLogs.push(`<div class="log-line">${x}</div>`);
  state.battleLogs=state.battleLogs.slice(-12);
  const l=document.getElementById('log');
  if(l){
    l.innerHTML=state.battleLogs.join('');
    l.scrollTop=l.scrollHeight;
  }
}
function wait(ms){if(state.skip)return Promise.resolve();return new Promise(r=>{let t=setTimeout(r,ms),p=setInterval(()=>{if(state.skip){clearTimeout(t);clearInterval(p);r()}},25)})}
function matchupMultiplier(sa,ta){
  const strong={火:'自然',自然:'雷',雷:'水',水:'火',光:'闇',闇:'光'};
  const resist={火:'水',自然:'火',雷:'自然',水:'雷'};
  let m=1;
  if(strong[sa]===ta)m*=1.2;
  if(resist[sa]===ta)m*=.8;
  return m;
}
function adv(aa,sa,ta){
  const offAttribute={火:'水',自然:'火',雷:'自然',水:'雷'};
  let m=1;
  if(aa===sa)m*=1.1;
  if(offAttribute[aa]===sa)m*=.9;
  return m*matchupMultiplier(sa,ta);
}
function unitSkillIds(unit){return[...(unit.skills||[]),unit.solid].filter((id,i,a)=>id&&a.indexOf(id)===i)}
function passiveAttackMultiplier(unit,attribute){
  let m=1;
  for(const id of unitSkillIds(unit)){
    const p=skills[id]?.passive;
    if(!p)continue;
    if(p.elementDamage&&attribute!=='無')m*=p.elementDamage;
    if(p.attributeDamage?.[attribute])m*=p.attributeDamage[attribute];
  }
  return m;
}
function passiveDamageTakenMultiplier(unit){
  let m=1;
  for(const id of unitSkillIds(unit)){
    const p=skills[id]?.passive;
    if(p?.damageTaken)m*=p.damageTaken;
  }
  return m;
}
const TIMED_STATUS_CONFIG={
  atkBuff:{timers:'atkBuffTimers',max:5,turns:3,label:'攻撃UP'},
  defBuff:{timers:'defBuffTimers',max:5,turns:3,label:'防御UP'},
  atkDebuff:{timers:'atkDebuffTimers',max:5,turns:3,label:'攻撃DOWN'},
  defDebuff:{timers:'defDebuffTimers',max:5,turns:3,label:'防御DOWN'},
  spdBuff:{timers:'spdBuffTimers',max:5,turns:3,label:'素早さUP'},
  spdDebuff:{timers:'spdDebuffTimers',max:5,turns:3,label:'素早さDOWN'}
};
function timedStatusCount(unit,kind){
  const config=TIMED_STATUS_CONFIG[kind];
  if(!config)return 0;
  return Math.min(config.max,Array.isArray(unit[config.timers])?unit[config.timers].length:0);
}
function clearTimedStatuses(unit){
  unit.poisonTimers=[];
  for(const config of Object.values(TIMED_STATUS_CONFIG))unit[config.timers]=[];
}
function applyTimedStatus(target,kind,count=1){
  const config=TIMED_STATUS_CONFIG[kind];
  if(!config||target.hp<=0)return 0;
  if(!Array.isArray(target[config.timers]))target[config.timers]=[];
  const add=Math.min(Math.max(0,Math.floor(count||1)),config.max-target[config.timers].length);
  for(let i=0;i<add;i++)target[config.timers].push(config.turns);
  if(add>0)log(`<span class="status-log">${target.name} に${config.label}が${add}層付与された！（${config.label}×${timedStatusCount(target,kind)}）</span>`);
  else log(`<span class="status-log">${target.name} の${config.label}は最大まで重なっている！</span>`);
  return add;
}
function attackStatMultiplier(unit){return Math.max(.05,1+.25*timedStatusCount(unit,'atkBuff')-.05*timedStatusCount(unit,'atkDebuff'))}
function damageTakenStatusMultiplier(unit){return Math.max(.05,1-.10*timedStatusCount(unit,'defBuff')+.05*timedStatusCount(unit,'defDebuff'))}
function speedStatMultiplier(unit){return Math.max(.05,1+.05*timedStatusCount(unit,'spdBuff')-.05*timedStatusCount(unit,'spdDebuff'))}
function effectiveSpeed(unit){return unit.spd*speedStatMultiplier(unit)}
async function processTimedStatusTurn(){
  for(const unit of [...party(),...state.enemies]){
    if(unit.hp<=0)continue;
    for(const [kind,config] of Object.entries(TIMED_STATUS_CONFIG)){
      const before=timedStatusCount(unit,kind);
      if(before<=0)continue;
      unit[config.timers]=unit[config.timers].map(turns=>turns-1).filter(turns=>turns>0);
      const after=timedStatusCount(unit,kind);
      if(after<before){
        const lost=before-after;
        if(after>0)log(`<span class="status-log">${unit.name} の${config.label}が${lost}層消えた。（${config.label}×${after}）</span>`);
        else log(`<span class="status-log">${unit.name} の${config.label}が切れた。</span>`);
      }
    }
  }
}
function skillStatusKind(skill){
  return ({buffAtk:'atkBuff',buffDef:'defBuff',debuffAtk:'atkDebuff',debuffDef:'defDebuff',buffSpd:'spdBuff',debuffSpd:'spdDebuff'})[skill.type]||null;
}
function dmg(a,d,s){
  if(d.glowArmor)return Math.random()<.5?1:0;
  const attackPassive=passiveAttackMultiplier(a,s.attribute);
  const defensePassive=passiveDamageTakenMultiplier(d);
  const multiplier=s.randomMultiplier
    ?s.randomMultiplier[Math.floor(Math.random()*s.randomMultiplier.length)]
    :(s.multiplier??1);
  if(multiplier===0)return 0;
  const randomRate=.9+Math.random()*.2;
  const base=a.atk*attackStatMultiplier(a)*multiplier*attackPassive*adv(a.attribute,s.attribute,d.attribute)*100/(100+d.def);
  return Math.max(1,Math.round(base*defensePassive*damageTakenStatusMultiplier(d)*randomRate))
}
function attackResult(a,d,s){
  const isNormal=s.id==='NORMAL';
  if(isNormal&&Math.random()<.02)return{damage:0,miss:true,critical:false};
  if(d.glowArmor)return{damage:Math.random()<.5?1:0,miss:false,critical:false};
  const critical=Math.random()<.02;
  const base=dmg(a,d,s);
  return{damage:critical?Math.max(1,Math.round(base*1.5)):base,miss:false,critical};
}
function passiveLifestealRate(unit){
  let rate=0;
  for(const id of unitSkillIds(unit)){
    rate=Math.max(rate,skills[id]?.passive?.lifestealRate||0);
  }
  return rate;
}
function hasNoAttackDeathPassive(unit){
  return unitSkillIds(unit).some(id=>skills[id]?.passive?.diesIfNoAttack);
}
function recordAttackRecovery(attacker,dealt,skill,side){
  attacker.attackedThisTurn=true;
  const rate=Math.max(skill.lifestealRate||0,passiveLifestealRate(attacker));
  if(rate<=0||dealt<=0||attacker.hp<=0)return;
  const recovered=Math.min(attacker.maxHp-attacker.hp,Math.round(dealt*rate));
  if(recovered<=0)return;
  attacker.hp+=recovered;
  log(`${attacker.name} はHPを ${recovered}回復！`);
  updateBattleHp(side,attacker);
}
function resetAttackTracking(){
  for(const unit of [...party(),...state.enemies])unit.attackedThisTurn=false;
}
function applyNoAttackDeaths(){
  for(const [side,units] of [['ally',party()],['enemy',state.enemies]]){
    for(const unit of units){
      if(unit.hp<=0||!hasNoAttackDeathPassive(unit)||unit.attackedThisTurn)continue;
      unit.hp=0;
      log(`${unit.name} は血を得られず倒れた！`);
      updateBattleHp(side,unit);
    }
  }
}
function applySelfCost(unit,skill){
  if(!skill.selfHpCostRate)return;
  const cost=Math.max(1,Math.round(unit.maxHp*skill.selfHpCostRate));
  unit.hp=Math.max(0,unit.hp-cost);
  log(`${unit.name}は反動で${cost}ダメージ`);
}
function processFearRecovery(){
  for(const unit of [...party(),...state.enemies]){
    if(!unit.fearConsumed)continue;
    unit.fearTurns=0;
    unit.fearConsumed=false;
    refreshBattleStatusIcons(unit);
  }
}
async function allyAct(a,q){
  const s=skills[q.skillId]||skills.NORMAL;
  if(s.type==='attack'){
    let targets;
    if(s.target==='enemyAll'){
      targets=state.enemies.filter(x=>x.hp>0);
    }else if(s.randomTarget){
      const alive=state.enemies.filter(x=>x.hp>0);
      targets=alive.length?[alive[Math.floor(Math.random()*alive.length)]]:[];
    }else{
      targets=[state.enemies[q.target]?.hp>0?state.enemies[q.target]:state.enemies.find(x=>x.hp>0)];
    }
    log(`${a.name}の${s.name}！`);
    await wait(DELAY);
    for(const t of targets.filter(Boolean)){
      const hits=s.hits||1;
      for(let h=0;h<hits;h++){
        if(t.hp<=0)break;
        const n=dmg(a,t,s);
        t.hp=Math.max(0,t.hp-n);
        log(`${t.name}に${n}ダメージを与えた。`);
      }
    }
    applySelfCost(a,s);
    renderBattle();
    await wait(DELAY);
  }else if(s.type==='heal'){
    const selected=party()[q.target];
    const targets=s.target==='allyAll'
      ?party().filter(x=>x.hp>0)
      :[(selected&&selected.hp>0)?selected:party().find(x=>x.hp>0)];
    log(`${a.name}の${s.name}！`);
    for(const t of targets.filter(Boolean)){
      const rate=s.healRate??(.3*(s.multiplier||1));
      const n=Math.max(s.minHeal||0,Math.round(t.maxHp*rate));
      const actual=Math.min(n,t.maxHp-t.hp);
      t.hp=Math.min(t.maxHp,t.hp+n);
      log(`${t.name}のHPが${actual}回復した。`);
    }
    renderBattle();
    await wait(DELAY);
  }else if(skillStatusKind(s)){
    const kind=skillStatusKind(s),isBuff=kind.endsWith('Buff');
    const candidates=isBuff?party().filter(x=>x.hp>0):state.enemies.filter(x=>x.hp>0);
    const selected=s.target==='self'?a:(isBuff?party()[q.target]:state.enemies[q.target]);
    const targets=s.target==='allyAll'||s.target==='enemyAll'?candidates:[selected?.hp>0?selected:candidates[0]];
    log(`${a.name}の${s.name}！`);
    for(const target of targets.filter(Boolean))applyTimedStatus(target,kind,s.statusStacks||1);
    await wait(DELAY);
  }else if(s.type==='charge'){
    state.point=Math.min(10,state.point+(s.spGain||0));
    log(`${a.name}の${s.name}！ ${s.spGain||0}SP獲得。`);
    renderBattle();
    await wait(DELAY);
  }
}
async function enemyAct(e){
  if(e.escapeChance&&Math.random()<e.escapeChance){
    e.escaped=true;
    e.hp=0;
    log(`${e.name}は逃走した！`);
    renderBattle();
    await wait(DELAY);
    return;
  }
  const solidSkill=skills[e.solid];
  const usable=solidSkill&&solidSkill.active!==false&&solidSkill.type!=='passive'&&solidSkill.type!=='storeSp';
  let s=skills.NORMAL;
  if(usable&&state.enemyPoint>=solidSkill.cost&&Math.random()<0.5){
    if(solidSkill.type==='heal'){
      const needHeal=state.enemies.some(x=>x.hp>0&&x.hp/x.maxHp<=0.7);
      if(needHeal)s=solidSkill;
    }else if(solidSkill.type==='status'){
      const aliveTargets=party().filter(x=>x.hp>0);
      const status=solidSkill.status;
      if(aliveTargets.some(x=>!(x.status&&x.status[status]>0)))s=solidSkill;
    }else{
      s=solidSkill;
    }
  }
  if(s!==skills.NORMAL)state.enemyPoint-=s.cost;

  if(s.type==='heal'){
    const living=state.enemies.filter(x=>x.hp>0&&x.hp/x.maxHp<=0.7);
    if(!living.length)return;
    const target=[...living].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
    log(`${e.name}の${s.name}！`);
    await wait(DELAY);
    const rate=s.healRate??(.3*(s.multiplier||1));
    const n=Math.max(s.minHeal||0,Math.round(target.maxHp*rate));
    const actual=Math.min(n,target.maxHp-target.hp);
    target.hp=Math.min(target.maxHp,target.hp+n);
    log(`${target.name}のHPが${actual}回復した。`);
    renderBattle();
    await wait(DELAY);
    return;
  }

  const alive=party().map((x,i)=>({x,i})).filter(z=>z.x.hp>0);
  if(!alive.length)return;
  let targetPool=alive.map(z=>z.x);
  if(s.type==='status'&&s.status){
    const cand=targetPool.filter(x=>!(x.status&&x.status[s.status]>0));
    if(cand.length)targetPool=cand;
  }
  const targets=s.target==='enemyAll'
    ?targetPool
    :[targetPool[Math.floor(Math.random()*targetPool.length)]];

  log(`${e.name}の${s.name}！`);
  await wait(DELAY);

  for(const target of targets){
    const hits=s.hits||1;
    for(let h=0;h<hits;h++){
      if(target.hp<=0)break;
      const n=dmg(e,target,s);
      target.hp=Math.max(0,target.hp-n);
      log(`${target.name}は${n}ダメージを受けた。`);
    }
  }
  applySelfCost(e,s);
  renderBattle();
  await wait(DELAY);
}
async function executeTurn(){if(state.isProcessing)return;if(state.pending){state.queue[state.pending.actor]=null;state.pending=null}state.isProcessing=true;state.skip=false;updateHeader();const allies=party();resetAttackTracking();allies.forEach((a,i)=>{if(a.hp>0&&!state.queue[i])state.queue[i]={skillId:'NORMAL',name:'通常攻撃',cost:0,target:state.selectedEnemy}});state.point-=reserved();const acts=[];allies.forEach((a,i)=>{if(a.hp>0)acts.push({side:'a',i,spd:effectiveSpeed(a)+Math.random()*.001})});state.enemies.forEach((e,i)=>{if(e.hp>0)for(let action=0;action<(e.actionsPerTurn||1);action++)acts.push({side:'e',i,spd:effectiveSpeed(e)+Math.random()*.001})});acts.sort((x,y)=>y.spd-x.spd);log(`<b>ターン${state.turn}</b>`);for(const x of acts){if(x.side==='a'){if(allies[x.i].hp>0)await allyAct(allies[x.i],state.queue[x.i])}else if(state.enemies[x.i].hp>0)await enemyAct(state.enemies[x.i]);if(state.enemies.every(e=>e.hp<=0)||allies.every(a=>a.hp<=0))break}applyNoAttackDeaths();await processPoisonTurn();await processTimedStatusTurn();skipBtn.disabled=true;if(state.enemies.every(e=>e.hp<=0)){await winFloor();return}if(allies.every(a=>a.hp<=0)){
  log('<b>敗北……</b>');
  state.isProcessing=false;
  showDefeat();
  return
}processPetrifyRecovery();processFearRecovery();state.turn++;const skillUsers=state.queue.filter(q=>q?.used&&(q.cost||0)>0).length;
const gainedPoints=Math.max(0,3-skillUsers)+state.nextSpBonus;
state.nextSpBonus=0;
state.point=Math.min(10,state.point+gainedPoints);
if(gainedPoints>0)log(`${gainedPoints}SP獲得`);
state.enemyPoint=Math.min(9,state.enemyPoint+2);state.queue=[null,null,null];state.selectedAlly=allies.findIndex(a=>a.hp>0);state.selectedEnemy=state.enemies.findIndex(e=>e.hp>0);state.isProcessing=false;renderBattle();updateHeader()}
function rollBattleDrops(){
  const drops=[];
  if(Math.random()<GACHA_TICKET_DROP_RATE){
    state.gachaTickets++;
    drops.push('ガチャチケット ×1');
  }
  if([1,2,3].includes(state.dungeon?.id)&&Math.random()<.10){
    state.items.BRONZE_COIN++;
    drops.push('銅のコイン ×1');
  }
  return drops;
}
async function winFloor(){
  for(const enemy of state.enemies.filter(enemy=>!enemy.escaped)){
    state.monsterDefeatCounts[enemy.id]=(state.monsterDefeatCounts[enemy.id]||0)+1;
  }
  saveMonsterDefeatCounts();
  const gainedExp=state.enemies.filter(enemy=>!enemy.escaped).reduce((sum,e)=>sum+e.exp,0);
  const memberResults=[];
  for(const member of party()){
    const before={
      level:member.level,
      exp:member.exp||0,
      nextExp:member.nextExp||1,
      maxHp:member.maxHp,
      atk:member.atk,
      def:member.def,
      spd:member.spd
    };
    let levelUps=[];
    if(member.hp>0){
      levelUps=addMonsterExp(member,gainedExp);
    }
    memberResults.push({
      uid:member.uid,
      name:member.name,
      beforeLevel:before.level,
      beforeExp:before.exp,
      beforeNextExp:before.nextExp,
      afterLevel:member.level,
      afterExp:member.exp||0,
      afterNextExp:member.nextExp||1,
      gained:member.hp>0 ? gainedExp : 0,
      levelUps,
      statGains:{
        maxHp:member.maxHp-before.maxHp,
        atk:member.atk-before.atk,
        def:member.def-before.def,
        spd:member.spd-before.spd
      }
    });
  }
  // 各層で獲得した経験値だけは、敗北・リタイア時にも失われないよう記録する。
  // HP、ドロップ、仲間候補などは開始時点のままなので、経験値以外は従来どおり失われる。
  preserveDungeonExperienceInSnapshot();
  const newCandidates=[];
  const rates=difficultyConfig();
  for(const enemy of state.enemies.filter(enemy=>!enemy.escaped)){
    const recruitChance=state.dungeon?.id===4?0:(enemy.isBoss
      ? rates.bossRecruitRate
      : rates.recruitRate)+(enemy.recruitBonus||0);
    if(Math.random()<recruitChance){
      if(!state.recruits.has(enemy.id)){
        const candidate={id:enemy.id,level:enemy.level};
        newCandidates.push(candidate);
        state.recruits.set(enemy.id,enemy.level);
      }
    }
  }
  state.floorResult={
    floor:state.floor,
    gainedExp,
    members:memberResults,
    drops:rollBattleDrops(),
    newCandidates
  };
  state.isProcessing=false;
  showFloorResult();
}
function expGaugePercent(member){
  if(member.afterLevel>=100)return 100;
  return Math.max(0,Math.min(100,member.afterExp/member.afterNextExp*100));
}
function showFloorResult(){
  const r=state.floorResult;
  state.screen='floorResult';
  app.innerHTML=`<div class="card result">
    <div class="victory-title">VICTORY!</div><div class="title">第${r.floor}層　戦闘勝利！</div>
    <div class="result-section"><b>獲得経験値</b><div class="result-value">+${r.gainedExp} EXP</div></div>
    <div class="result-section"><b>仲間の経験値</b>
      ${r.members.map(m=>`<div class="exp-result">
        <div class="exp-head"><span>${m.name} Lv${m.afterLevel}</span><span>${m.afterLevel>=100?'MAX':`${m.afterExp} / ${m.afterNextExp}`}</span></div>
        <div class="exp-gauge"><span style="width:${expGaugePercent(m)}%"></span></div>
        <div class="muted">獲得 +${m.gained} EXP</div>
        ${m.levelUps.length?`<div class="level-notice"><b>レベルアップ！ Lv${m.levelUps.join(' → Lv')}</b><div class="level-stats">HP +${m.statGains.maxHp}　攻撃 +${m.statGains.atk}<br>防御 +${m.statGains.def}　素早さ +${m.statGains.spd}</div></div>`:''}
      </div>`).join('')}
    </div>
    ${r.drops.length?`<div class="result-section"><b>ドロップ</b><div>${r.drops.join(' / ')}</div></div>`:''}
    ${r.newCandidates.length?`<div class="result-section"><b>仲間候補</b><div>${r.newCandidates.map(candidate=>`${monsterDB[candidate.id].name} Lv${candidate.level}が仲間候補になった！`).join('<br>')}</div></div>`:''}
    <button class="wide btn-next" onclick="continueAfterResult()">次へ</button>
  </div>`;
  skipBtn.style.display='none';
  homeBtn.style.display='none';
}
async function continueAfterResult(){
  if(state.floor<state.dungeon.max){
    state.floor++;
    enterCurrentFloor();
  }else{
    showRecruit(true);
  }
}
function showDefeat(retired=false){
  restoreDungeonStartSnapshot();
  state.screen='defeat';
  state.recruits=new Map();
  state.floor=0;
  state.dungeon=null;
  state.enemies=[];
  state.queue=[null,null,null];
  state.pending=null;
  state.skip=false;

  app.innerHTML=`<div class="card result">
    <div class="title">敗北……</div>
    <div class="muted">${retired?'リタイアしました。敗北扱いになります。':'ダンジョン攻略に失敗しました。'}</div>
    <p>勝利した層で獲得した経験値は保持されます。仲間候補やドロップは失われます。</p>
    <button class="wide btn-next" onclick="returnHomeAfterDefeat()">ホームへ戻る</button>
  </div>`;
  skipBtn.style.display='none';
  homeBtn.style.display='none';
}
function returnHomeAfterDefeat(){
  home();
}
function showRecruit(cleared=true){
  state.screen='recruit';
  if(cleared&&!state.clearRecorded&&state.dungeon){
    const dungeonProgress=state.dungeonProgress[state.dungeon.id]||(state.dungeonProgress[state.dungeon.id]={normal:0,hard:0,veryHard:0});
    dungeonProgress[state.difficulty]=(dungeonProgress[state.difficulty]||0)+1;
    state.clearRecorded=true;
    saveDungeonProgress();
  }
  state.dungeonStartSnapshot=null;
  saveGame({force:true});
  const candidates=[...state.recruits.entries()].map(([id,level])=>({id,level}));
  app.innerHTML=`<div class="card result"><div class="title">${cleared?'ダンジョンクリア！':'途中帰還'}</div>
  <div class="muted">${cleared?`${difficultyConfig().name}をクリアしました（累計${state.dungeonProgress[state.dungeon.id][state.difficulty]}回）。`:'ボス撃破・ダンジョンクリアにはカウントされません。'}</div>
  <div class="muted">${candidates.length?'仲間候補から1体選択してください。':'今回は仲間候補なし'}</div>
  ${candidates.length?`<div class="candidate-grid">${candidates.map(candidate=>`<button class="artwork-candidate" onclick="takeRecruit('${candidate.id}',${candidate.level})">${monsterArtwork(candidate.id,'medium')}<span>${monsterDB[candidate.id].name}</span><span class="muted">Lv${candidate.level}</span></button>`).join('')}</div>`:'<button class="wide" onclick="home()">ホームへ戻る</button>'}
  </div>`;
  homeBtn.style.display=candidates.length?'none':'inline-block';
  skipBtn.style.display='none';
}
function takeRecruit(id,level=1){const joinLevel=Math.max(1,Math.min(100,Math.floor(Number(level)||1)));state.owned.push(makeOwned(id,joinLevel));state.discovered.add(id);saveGame({force:true});alert(`${monsterDB[id].name} Lv${joinLevel}が仲間になった！`);home()}
skipBtn.onclick=()=>{state.skip=true;skipBtn.disabled=true};homeBtn.onclick=()=>{if(!state.fusionLocked&&state.screen!=='battle')home()};window.home=home;window.retryLastDungeon=retryLastDungeon;window.showDungeons=showDungeons;window.showMonsters=showMonsters;window.showFusion=showFusion;window.showBook=showBook;window.showBookDetail=showBookDetail;window.showModeSelection=showModeSelection;window.selectGameMode=selectGameMode;window.showDataManagement=showDataManagement;window.forceGameUpdate=forceGameUpdate;window.manualSave=manualSave;window.exportSaveData=exportSaveData;window.importSaveData=importSaveData;window.deleteSaveData=deleteSaveData;window.developerAcquireMonster=developerAcquireMonster;window.developerLevelUp=developerLevelUp;window.startDungeon=startDungeon;window.pickParent=pickParent;window.startFusion=startFusion;window.beginFusion=beginFusion;window.confirmFusionChoice=confirmFusionChoice;window.cancelFusionChoice=cancelFusionChoice;window.showInheritance=showInheritance;window.toggleInheritance=toggleInheritance;window.completeFusion=completeFusion;window.finishFusionResult=finishFusionResult;window.toggleParty=toggleParty;window.showMonsterDetail=showMonsterDetail;window.selectEnemy=selectEnemy;window.selectAlly=selectAlly;window.chooseSkill=chooseSkill;window.executeTurn=executeTurn;window.takeRecruit=takeRecruit;
window.addEventListener('beforeunload',()=>saveGame());
window.addEventListener('pagehide',()=>saveGame());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveGame()});
if(loadedExistingSave)home();
else if(state.saveDataDetected)showModeSelection();
else if(BUILD_MODE==='normal'||BUILD_MODE==='development')selectGameMode(BUILD_MODE);
else showModeSelection();
showVersionUpdateNotice();
window.returnHomeAfterDefeat=returnHomeAfterDefeat;

window.confirmDungeonEntry=confirmDungeonEntry;
window.confirmRetire=confirmRetire;
window.returnToBattle=returnToBattle;
window.retireDungeon=retireDungeon;
window.continueAfterResult=continueAfterResult;
window.recoverAtRest=recoverAtRest;
window.continueFromRest=continueFromRest;
window.returnFromRest=returnFromRest;

retireBtn.onclick=confirmRetire;

window.showPartyFormation=showPartyFormation;
window.showMonsterList=showMonsterList;
window.setMonsterSort=setMonsterSort;
window.showSinglePartyChange=showSinglePartyChange;
window.confirmSinglePartyChange=confirmSinglePartyChange;
window.showBulkPartySelection=showBulkPartySelection;
window.toggleBulkParty=toggleBulkParty;
window.applyBulkParty=applyBulkParty;
window.renderBulkPartySelection=renderBulkPartySelection;
