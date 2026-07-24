function dungeonInfo(id){
  switch(id){
    case 1:
      return {
        id:1,
        name:'始まりの草原',
        max:10,
        restFloor:5,
        levelFunc: floor=>{
          if(floor<=4) return Math.ceil(floor/2);
          return Math.ceil((floor-1)/2);
        },
        description:'...'
      };

    case 2:
      return {
        id:2,
        name:'獣の洞窟',
        max:10,
        restFloor:5,
        levelFunc: floor=>{
          if(floor<=4) return 5 + Math.ceil(floor/2);
          return 5 + Math.ceil((floor-1)/2);
        },
        description:'...'
      };

    case 3:
      return {
        id:3,
        name:'精霊の森',
        max:10,
        restFloor:5,
        levelFunc: floor=>{
          if(floor<=4) return 10 + Math.ceil(floor/2);
          return 10 + Math.ceil((floor-1)/2);
        },
        description:'...'
      };
    case 4:
      return {
        id:4,
        name:'強者への道',
        max:5,
        restFloor:null,
        levelFunc:()=>10,
        description:'カギを使って挑む、5層構成の特別なダンジョン。'
      };
  }
}
function showDungeons(){
  state.screen='dungeons';
  state.fusionLocked=false;
  app.innerHTML=`<div class="card"><div class="title">ダンジョン</div>
    ${[1,2,3,4].map(id=>{const d=dungeonInfo(id),p=state.dungeonProgress[id],unlocked=dungeonUnlocked(id);return`<div class="listitem choice ${unlocked?'':'locked'}" ${unlocked?`onclick="confirmDungeonEntry(${id})"`:''}><b>${d.name}</b>　全${d.max}層<div class="difficulty-counts">${id===4?`カギ ${state.items.KEY_CHAMPION_NORMAL||0}個　／　ノーマル ${p.normal}回`:(unlocked?`ノーマル ${p.normal}回　／　ハード ${p.hard}回　／　ベリーハード ${p.veryHard}回`:`始まりの草原・ノーマルを10回クリアで解放（${state.dungeonProgress[1]?.normal||0}/10）`)}</div></div>`}).join('')}
  </div>`;
  updateHeader();
}
function confirmDungeonEntry(id){
  const d=dungeonInfo(id);
  if(!d||!dungeonUnlocked(id)){showDungeons();return;}
  state.screen='dungeonConfirm';
  const p=state.dungeonProgress[id];
  app.innerHTML=`<div class="card result">
    <div class="title">${d.name}</div>
    <p><b>難易度を選択してください</b></p>
    <div class="muted">全${d.max}層</div>
    <div class="difficulty-list">
      ${Object.entries(DIFFICULTIES).filter(([key])=>id===4||key!=='expert').map(([key,cfg])=>{
        const unlocked=difficultyUnlocked(id,key);
        const condition=id===4
          ?key==='normal'?`カギを1個消費（所持 ${state.items.KEY_CHAMPION_NORMAL||0}個）`:'未実装'
          :key==='hard'
          ?`ノーマルを20回クリアで解放（${p.normal}/20）`
          :key==='veryHard'
            ?`ハードを30回クリアで解放（${p.hard}/30）`
            :id===3
              ?'始まりの草原・ノーマル10回クリアで解放済み'
              :'最初から選択可能';
        return`<button class="difficulty-btn ${unlocked?'':'locked'}" onclick="startDungeon(${id},'${key}')" ${unlocked?'':'disabled'}><b>${cfg.name}</b><small>${condition}</small></button>`;
      }).join('')}
      <div class="battle-item-select"><b>持ち込むアイテム（1種1個）</b>
      <button class="${!state.dungeonItemSelections[id]?'sel':''}" onclick="selectDungeonItem(${id},null)">持って行かない</button>
      ${BATTLE_ITEM_IDS.filter(itemId=>ITEM_DB[itemId].dungeons.includes(id)).map(itemId=>`<button class="${state.dungeonItemSelections[id]===itemId?'sel':''}" onclick="selectDungeonItem(${id},'${itemId}')" ${(state.items[itemId]||0)<1?'disabled':''}>${itemArtwork(itemId,'small')}<span>${ITEM_DB[itemId].name} ×${state.items[itemId]||0}</span></button>`).join('')}</div>
      <button class="btn-cancel" onclick="showDungeons()">戻る</button>
    </div>
  </div>`;
  updateHeader();
}
function selectDungeonItem(dungeonId,itemId){
  if(itemId&&(!ITEM_DB[itemId]?.battle||!ITEM_DB[itemId].dungeons.includes(dungeonId)||(state.items[itemId]||0)<1))return;
  if(itemId)state.dungeonItemSelections[dungeonId]=itemId;
  else delete state.dungeonItemSelections[dungeonId];
  saveGame({force:true});
  confirmDungeonEntry(dungeonId);
}
function showMonsters(){
  state.screen='monstersMenu';
  state.fusionLocked=false;
  app.innerHTML=`<div class="card">
    <div class="title">モンスター</div>
    <div class="grid menu">
      <button class="btn-next" onclick="showPartyFormation()">パーティ編成</button>
      <button class="btn-next" onclick="showMonsterList()">モンスター一覧</button>
    </div>
  </div>`;
  updateHeader();
}
function sortedOwnedMonsters(){
  const list=[...state.owned];
  const dir=state.monsterSortDir==='asc'?1:-1;
  if(state.monsterSort==='race'){
    const raceOrder=['物質','植物','獣','亜人','アンデッド','悪魔','精霊','龍'];
    list.sort((a,b)=>{
      const ra=raceOrder.indexOf(a.race),rb=raceOrder.indexOf(b.race);
      if(ra!==rb)return (ra-rb)*dir;
      return (dexNo(a.id)-dexNo(b.id))*dir;
    });
  }else if(state.monsterSort==='star'){
    list.sort((a,b)=>{
      if(a.star!==b.star)return (a.star-b.star)*dir;
      return (dexNo(a.id)-dexNo(b.id))*dir;
    });
  }else if(state.monsterSort==='level'){
    list.sort((a,b)=>{
      if(a.level!==b.level)return (a.level-b.level)*dir;
      return (dexNo(a.id)-dexNo(b.id))*dir;
    });
  }else{
    list.sort((a,b)=>{
      const ai=state.owned.indexOf(a),bi=state.owned.indexOf(b);
      return (ai-bi)*dir;
    });
  }
  return list;
}
function setMonsterSort(type){
  if(state.monsterSort===type){
    state.monsterSortDir=state.monsterSortDir==='asc'?'desc':'asc';
  }else{
    state.monsterSort=type;
    state.monsterSortDir='asc';
  }
  showMonsterList();
}
function sortLabel(type,label){
  if(state.monsterSort!==type)return label;
  return `${label}${state.monsterSortDir==='asc'?' ↑':' ↓'}`;
}
function sortedPartyCandidates(list=state.owned){
  const sorted=[...list],dir=state.partyCandidateSortDir==='asc'?1:-1;
  const raceOrder=['物質','植物','獣','亜人','アンデッド','悪魔','精霊','龍'];
  if(state.partyCandidateSort==='race')sorted.sort((a,b)=>((raceOrder.indexOf(a.race)-raceOrder.indexOf(b.race))||(dexNo(a.id)-dexNo(b.id)))*dir);
  else if(state.partyCandidateSort==='star')sorted.sort((a,b)=>((a.star-b.star)||(dexNo(a.id)-dexNo(b.id)))*dir);
  else if(state.partyCandidateSort==='level')sorted.sort((a,b)=>((a.level-b.level)||(dexNo(a.id)-dexNo(b.id)))*dir);
  else sorted.sort((a,b)=>(state.owned.indexOf(a)-state.owned.indexOf(b))*dir);
  return sorted;
}
function partyCandidateSortLabel(type,label){
  return state.partyCandidateSort===type?`${label}${state.partyCandidateSortDir==='asc'?' ↑':' ↓'}`:label;
}
function partyCandidateSortControls(){
  return `<div class="sort-row"><button onclick="setPartyCandidateSort('acquired')">${partyCandidateSortLabel('acquired','取得順')}</button><button onclick="setPartyCandidateSort('race')">${partyCandidateSortLabel('race','種族順')}</button><button onclick="setPartyCandidateSort('star')">${partyCandidateSortLabel('star','星順')}</button><button onclick="setPartyCandidateSort('level')">${partyCandidateSortLabel('level','レベル順')}</button></div>`;
}
function setPartyCandidateSort(type){
  if(state.partyCandidateSort===type)state.partyCandidateSortDir=state.partyCandidateSortDir==='asc'?'desc':'asc';
  else{state.partyCandidateSort=type;state.partyCandidateSortDir='asc'}
  if(state.screen==='singlePartyChange')showSinglePartyChange(state.partyEditSlot);
  else if(state.screen==='bulkPartySelection')renderBulkPartySelection();
}
function showMonsterList(){
  state.screen='monsterList';
  const list=sortedOwnedMonsters();
  app.innerHTML=`<div class="card">
    <div class="title">モンスター一覧</div>
    <div class="sort-row">
      <button onclick="setMonsterSort('acquired')">${sortLabel('acquired','取得順')}</button>
      <button onclick="setMonsterSort('race')">${sortLabel('race','種族順')}</button>
      <button onclick="setMonsterSort('star')">${sortLabel('star','星順')}</button>
      <button onclick="setMonsterSort('level')">${sortLabel('level','レベル順')}</button>
    </div>
    <div class="monster-list-heading" aria-hidden="true">
      <span>名前</span><span>レベル</span><span>星</span><span>＋値</span><span>属性</span><span>種族</span>
    </div>
    ${list.map(x=>`<button class="monster-list-card" onclick="showMonsterDetail('${x.uid}','list')">
      <span class="monster-list-name">${monsterArtwork(x,'tiny')}<b>${x.name}</b></span>
      <span class="monster-list-level">Lv${x.level}</span>
      <span class="monster-list-stars">${starDisplay(x,'compact')}</span>
      <span class="monster-list-plus">＋${x.plusValue||0}</span>
      <span class="monster-list-icon">${monsterIcon('attribute',x.attribute)}</span>
      <span class="monster-list-icon">${monsterIcon('race',x.race)}</span>
    </button>${appearanceAvailable(x.id)&&state.unlockedAppearances.has(x.id)
      ?`<div class="appearance-list-controls"><span>現在：${x.appearance==='alternate'?'別の見た目':'通常'}</span><button onclick="toggleMonsterAppearance('${x.uid}')">見た目変更</button></div>`
      :''}`).join('')}
    
  </div>`;
  updateHeader();
}
function showPartyFormation(){
  state.screen='partyFormation';
  app.innerHTML=`<div class="card">
    <div class="title">パーティ編成</div>
    <div class="muted">現在のパーティ</div>
    ${party().map((x,i)=>`<div class="party-slot">
      <button class="party-monster artwork-list-row" onclick="showMonsterDetail('${x.uid}','party')">
        ${monsterArtwork(x,'small')}<span><b>${i+1}. No.${dexNo(x.id)}　${x.name}</b> Lv${x.level} ${starDisplay(x)} ＋${x.plusValue||0}
        <span class="muted">${x.race} / ${x.attribute}　HP${x.maxHp} 攻${x.atk} 防${x.def} 速${x.spd}</span></span>
      </button>
      <div class="party-order-controls">
        <button onclick="movePartyMember(${i},-1)" ${i===0?'disabled':''}>←</button>
        <button onclick="movePartyMember(${i},1)" ${i===state.party.length-1?'disabled':''}>→</button>
      </div>
      <button class="btn-next change-btn" onclick="showSinglePartyChange(${i})">変更</button>
    </div>`).join('')}
    <button class="wide btn-next" onclick="showBulkPartySelection()">一括編成</button>
    
  </div>`;
  updateHeader();
}
function movePartyMember(index,direction){
  const target=index+direction;
  if(index<0||target<0||index>=state.party.length||target>=state.party.length)return;
  [state.party[index],state.party[target]]=[state.party[target],state.party[index]];
  saveGame();
  showPartyFormation();
}
function showSinglePartyChange(slot){
  state.screen='singlePartyChange';
  state.partyEditSlot=slot;
  const currentUid=state.party[slot];
  app.innerHTML=`<div class="card">
    <div class="title">${slot+1}体目を変更</div>
    <div class="muted">交代するモンスターを選んでください。</div>
    ${partyCandidateSortControls()}
    ${sortedPartyCandidates(state.owned.filter(x=>x.uid!==currentUid&&!state.party.includes(x.uid))).map(x=>`
      <button class="listitem artwork-list-row party-choice-button" onclick="confirmSinglePartyChange('${x.uid}')">
        ${monsterArtwork(x,'small')}<span><b>No.${dexNo(x.id)}　${x.name}</b> Lv${x.level} ${starDisplay(x)} ＋${x.plusValue||0}
        <span class="muted">${x.race} / ${x.attribute}</span></span>
      </button>`).join('')||'<div class="listitem">交代できる控えモンスターがいません。</div>'}
    
  </div>`;
  updateHeader();
}
function confirmSinglePartyChange(uid){
  const slot=state.partyEditSlot;
  if(slot===null||slot<0||slot>=state.party.length)return;
  state.party[slot]=uid;
  state.partyEditSlot=null;
  saveGame();
  showPartyFormation();
}
function showBulkPartySelection(){
  state.screen='bulkPartySelection';
  state.bulkPartySelection=[...state.party];
  renderBulkPartySelection();
}
function renderBulkPartySelection(){
  app.innerHTML=`<div class="card">
    <div class="title">一括編成</div>
    <div class="muted">所持モンスターから1～3体選んでください。選択中：${state.bulkPartySelection.length}/3</div>
    ${partyCandidateSortControls()}
    ${sortedPartyCandidates().map(x=>{
      const selected=state.bulkPartySelection.includes(x.uid);
      return `<button class="listitem artwork-list-row party-choice-button ${selected?'selected-party':''}" onclick="toggleBulkParty('${x.uid}')">
        ${monsterArtwork(x,'small')}<span><b>${selected?'✓ ':''}No.${dexNo(x.id)}　${x.name}</b> Lv${x.level} ${starDisplay(x)} ＋${x.plusValue||0}
        <span class="muted">${x.race} / ${x.attribute}</span></span>
      </button>`;
    }).join('')}
    <button class="wide btn-next" onclick="applyBulkParty()" ${state.bulkPartySelection.length<1?'disabled':''}>このメンバーで編成</button>
    
  </div>`;
  updateHeader();
}
function toggleBulkParty(uid){
  if(state.bulkPartySelection.includes(uid)){
    state.bulkPartySelection=state.bulkPartySelection.filter(x=>x!==uid);
  }else{
    if(state.bulkPartySelection.length>=3)return;
    state.bulkPartySelection.push(uid);
  }
  renderBulkPartySelection();
}
function applyBulkParty(){
  if(state.bulkPartySelection.length<1||state.bulkPartySelection.length>3)return;
  state.party=[...state.bulkPartySelection];
  state.bulkPartySelection=[];
  saveGame();
  showPartyFormation();
}
function monsterSkillIds(monster){
  return [...new Set([...(monster.skills||[]),monster.solid].filter(Boolean))];
}
function skillTypeLabel(skill){
  if(!skill)return '未実装';
  const labels={
    attack:'攻撃',
    debuff:'デバフ',
    heal:'回復',
    buffAtk:'攻撃バフ',
    buffDef:'防御バフ',
    debuffAtk:'攻撃デバフ',
    debuffDef:'防御デバフ',
    buffSpd:'素早さバフ',
    debuffSpd:'素早さデバフ',
    storeSp:'補助',
    charge:'SP獲得',
    passive:'パッシブ'
  };
  return labels[skill.type]||skill.type||'未設定';
}
function targetLabel(target){
  const labels={
    enemySingle:'敵単体',
    enemyRandom:'敵ランダム',
    enemyAll:'敵全体',
    allySingle:'味方単体',
    allyAll:'味方全体',
    self:'自身'
  };
  return labels[target]||target||'―';
}
function passiveDescription(skill){
  const p=skill?.passive;
  if(!p)return '';
  const texts=[];
  if(p.elementDamage)texts.push('属性攻撃の威力が上がる');
  if(p.damageTaken)texts.push('受けるダメージが少し減る');
  if(p.attributeDamage){
    for(const attr of Object.keys(p.attributeDamage)){
      texts.push(`${attr}属性攻撃の威力が上がる`);
    }
  }
  if(p.lifestealRate)texts.push(`攻撃時、与ダメージの${Math.round(p.lifestealRate*100)}%分HPを回復`);
  if(p.diesIfNoAttack)texts.push('敵を攻撃しなかったターンの終了時に戦闘不能になる');
  return texts.join(' / ');
}
function skillEffectDescription(skill){
  if(!skill)return '効果未実装';
  const texts=[];
  if(skill.type==='attack'){
    if(skill.target==='enemyAll')texts.push(`${skill.attribute||'無'}属性の全体攻撃`);
    else texts.push(`${skill.attribute||'無'}属性の単体攻撃`);
  }
  if(skill.randomMultiplier)texts.push(`攻撃倍率${skill.randomMultiplier.join('・')}から均等抽選`);
  if(skill.type==='storeSp')texts.push('次のターンに得られるスキルポイントが1増える');
  if(skill.type==='charge')texts.push(`SPを${skill.spGain||0}獲得（所持上限10）`);
  if(skill.fearChance)texts.push(`使用者よりレベルの低い相手に${Math.round(skill.fearChance*100)}%で恐怖を付与（1ターン行動不能／同レベル以上・中ボス・ボス無効）`);
  if(skill.petrify)texts.push('石化を付与（基礎85%／格上-85%／中ボス・ボス-80%／格下+30%）');
  if(skill.poisonStacks)texts.push(`毒を${skill.poisonStacks}層付与（5ターン／最大99層）`);
  if(skill.hits)texts.push(`${skill.hits}回攻撃`);
  if(skill.randomTarget)texts.push('対象ランダム');
  if(skill.healRate)texts.push(`最大HPの${Math.round(skill.healRate*100)}%回復`);
  if(skill.minHeal)texts.push(`最低${skill.minHeal}回復`);
  if(skill.selfHpCostRate)texts.push(`使用者HP${Math.round(skill.selfHpCostRate*100)}%消費`);
  if(skill.lifestealRate)texts.push(`与ダメージの${Math.round(skill.lifestealRate*100)}%分HPを回復`);
  const passive=passiveDescription(skill);
  if(passive)texts.push(passive);
  return texts.length?texts.join(' / '):'追加効果なし';
}
function showMonsterDetail(uid,from='list'){state.detailFrom=from;
  const x=state.owned.find(monster=>monster.uid===uid);
  if(!x){showMonsters();return}
  state.screen='monsterDetail';
  const skillIds=monsterSkillIds(x);
  const inherited=skillIds.filter(id=>INHERITABLE_SKILLS.has(id));
  const solidSkill=skills[x.solid];
  const expText=x.level>=100?'MAX':`${x.exp||0} / ${x.nextExp||0}`;
  const bonus=x.fusionBonus||{hp:0,atk:0,def:0,spd:0};

  app.innerHTML=`<div class="card monster-detail">
    <div class="detail-head">
      ${monsterArtwork(x,'large')}
      <div>
        <div class="title">${dexNo(x.id)===9999?'':`No.${dexNo(x.id)}　`}${x.name}</div>
        <div>Lv${x.level}　${starDisplay(x)}　＋${x.plusValue||0}</div>
        <div class="muted">${x.race} / ${x.attribute}</div>
        <div class="muted">能力成長：${x.growth}　経験値成長：${x.expGrowth||'通常型'}</div>
      </div>
    </div>

    <div class="detail-section">
      <b>経験値</b>
      <div>${expText}</div>
      ${state.mode==='development'?`<button class="dev-action" onclick="developerLevelUp('${x.uid}')" ${x.level>=100?'disabled':''}>レベルを1上げる</button>`:''}
    </div>

    <div class="detail-stat-grid">
      <div><span>HP</span><b>${x.maxHp}</b></div>
      <div><span>攻撃</span><b>${x.atk}</b></div>
      <div><span>防御</span><b>${x.def}</b></div>
      <div><span>素早さ</span><b>${x.spd}</b></div>
    </div>

    <div class="detail-section">
      <b>固有スキル</b>
      <div class="skill-detail">
        <strong>${solidSkill?.name||x.solid||'なし'}</strong>
        <div class="muted">${skillTypeLabel(solidSkill)} / ${targetLabel(solidSkill?.target)} / ${solidSkill?.cost??0}SP</div>
        <div>${skillEffectDescription(solidSkill)}</div>
      </div>
    </div>

    <div class="detail-section">
      <b>継承スキル</b>
      ${inherited.length?inherited.map(id=>{
        const s=skills[id];
        return `<div class="skill-detail">
          <strong>${s?.name||'未実装スキル'}</strong>
          <div class="muted">${skillTypeLabel(s)} / ${targetLabel(s?.target)} / ${s?.cost??0}SP</div>
          <div>${skillEffectDescription(s)}</div>
        </div>`;
      }).join(''):'<div class="muted">なし</div>'}
    </div>

    <div class="detail-section">
      <b>＋値ステータスボーナス</b>
      <div>HP +${bonus.hp||0} / 攻撃 +${bonus.atk||0} / 防御 +${bonus.def||0} / 素早さ +${bonus.spd||0}</div>
    </div>

    <div class="detail-section">
      <b>パーティ</b>
      <div>${state.party.includes(x.uid)?'編成中':'控え'}</div>
    </div>

    
  </div>`;
  updateHeader();
}
function toggleParty(uid){}
function developerLevelUp(uid){
  if(state.mode!=='development')return;
  const monster=state.owned.find(x=>x.uid===uid);
  if(!monster||monster.level>=100)return;
  const increase=growthDelta(monsterDB[monster.id],monster.level,monster.level+1);
  monster.level++;
  monster.exp=0;
  monster.nextExp=requiredExp(monster.level,monster.expGrowth,monster.star);
  monster.maxHp+=increase.maxHp;
  monster.hp=Math.min(monster.maxHp,monster.hp+increase.maxHp);
  monster.atk+=increase.atk;
  monster.def+=increase.def;
  monster.spd+=increase.spd;
  saveGame({force:true});
  showMonsterDetail(uid,state.detailFrom);
}

function monsterDungeonNames(id){
  const names=[];
  const grasslandIds=new Set([...STARTING_GRASSLAND_POOL,'KOKOPI','HIGH_WOLF','ORC','LIZARD']);
  const beastCaveIds=new Set([...BEAST_CAVE_LATE_POOL,'VAMPEEL','GOLEM','FOX','DEMON']);
  if(grasslandIds.has(id))names.push('始まりの草原');
  if(beastCaveIds.has(id))names.push('獣の洞窟');
  if(['SEED','MANDRAGORA','FLOWER_MAN','GLOW_SPIRIT'].includes(id))names.push('強者への道');
  return names;
}
function showBook(){
  state.screen='book';
  state.fusionLocked=false;
  const entries=sortedMonsterEntries();
  const got=new Set([...state.discovered,...state.owned.map(x=>x.id)]);
  app.innerHTML=`<div class="card"><div class="title">図鑑 ${got.size}/${entries.length}</div><div class="book-grid">${entries.map(([id,monster])=>{
    const known=got.has(id);
    return known
      ?`<button class="book-entry" onclick="showBookDetail('${id}')"><span class="book-no">No.${dexNo(id)}</span>${monsterArtwork(id,'small')}<span class="book-name">${monster.name}</span></button>`
      :`<div class="book-entry unknown"><span class="book-no">No.${dexNo(id)}</span>${monsterArtwork(null,'small')}<div class="book-name">？？？</div></div>`;
  }).join('')}</div></div>`;
  updateHeader();
}
function showBookDetail(id){
  if(!state.discovered.has(id)&&!state.owned.some(x=>x.id===id)){showBook();return}
  const monster=monsterDB[id],solid=skills[monster.solid],dungeons=monsterDungeonNames(id);
  state.screen='bookDetail';
  app.innerHTML=`<div class="card book-detail">
    <div class="book-detail-no">No.${dexNo(id)}</div>
    <div class="book-detail-art">${monsterArtwork(id,'large')}</div>
    <div class="book-detail-name">${monster.name}</div>
    <div class="book-detail-row"><span>種族</span><b>${monsterIcon('race',monster.race)}${monster.race}</b></div>
    <div class="book-detail-row"><span>属性</span><b>${monsterIcon('attribute',monster.attribute)}${monster.attribute}</b></div>
    <div class="book-detail-row"><span>星</span><b>${starDisplay(monster)}</b></div>
    <div class="detail-section"><b>固有スキル</b><div class="skill-detail"><strong>${solid?.name||'なし'}</strong><div class="muted">${solid?skillEffectDescription(solid):'―'}</div></div></div>
    <div class="detail-section"><b>主な入手場所</b><div>${dungeons.length?dungeons.join(' / '):'―'}</div></div>
    <div class="detail-section"><b>倒した回数</b><div class="result-value">${state.monsterDefeatCounts[id]||0}回</div></div>
    ${appearanceBookSection(id)}
    ${state.mode==='development'?`<button class="wide dev-action" onclick="developerAcquireMonster('${id}')">このモンスターを取得</button>`:''}
  </div>`;
  updateHeader();
}
function appearanceBookSection(id){
  if(!appearanceAvailable(id))return '';
  const unlocked=state.unlockedAppearances.has(id);
  return `<div class="detail-section appearance-book-section">
    <b>別の見た目</b>
    ${unlocked
      ?`<div class="appearance-preview">${monsterArtwork({id,appearance:'alternate'},'large')}<div><strong>入手済み</strong><div class="muted">所持個体の見た目はモンスター一覧からいつでも変更できます。</div></div></div>`
      :`<div class="muted">見た目変更チケットを1枚使うと、このモンスターの別の見た目を入手できます。</div>
        <div class="appearance-ticket-count">所持：${state.appearanceTickets}枚</div>
        <button class="wide btn-next" onclick="unlockMonsterAppearance('${id}')" ${state.appearanceTickets<1?'disabled':''}>チケットを使う</button>`}
  </div>`;
}
function unlockMonsterAppearance(id){
  if(!appearanceAvailable(id)||state.unlockedAppearances.has(id)||state.appearanceTickets<1)return;
  const name=monsterDB[id]?.name||id;
  if(!confirm(`見た目変更チケットを1枚使って、${name}の別の見た目を入手しますか？`))return;
  state.appearanceTickets--;
  state.unlockedAppearances.add(id);
  saveGame({force:true});
  alert(`${name}の別の見た目を入手しました。`);
  showBookDetail(id);
}
function developerAcquireMonster(id){
  if(state.mode!=='development'||!monsterDB[id])return;
  const monster=makeOwned(id,1);
  state.owned.push(monster);
  state.discovered.add(id);
  saveGame({force:true});
  alert(`${monster.name}を取得しました。`);
  showBookDetail(id);
}
function key(a,b){return[a,b].sort().join('|')}
//配合システム
function showFusion(){
  state.screen='fusion';
  state.fusionParents=[];
  state.fusionChoices=[];
  state.fusionSelected=null;
  state.inheritChoices=[];
  state.inheritSelected=[];
  state.fusionResult=null;
  state.fusionLocked=false;
  renderFusion();
}
function renderFusion(){
  const eligible=state.owned.filter(x=>x.level>=10);
  app.innerHTML=`<div class="card"><div class="title">配合</div>
  <div class="muted">Lv10以上の2体を選び、「配合開始」を押してください。</div>
  ${eligible.map(x=>`<div class="listitem choice artwork-list-row ${state.fusionParents.includes(x.uid)?'sel':''}" onclick="pickParent('${x.uid}')">${monsterArtwork(x,'small')}<div>${x.name} Lv${x.level} ${starDisplay(x)} ＋${x.plusValue||0}</div></div>`).join('')}
  <button class="wide" onclick="startFusion()" ${state.fusionParents.length!==2?'disabled':''}>配合開始</button></div>`;
  updateHeader();
}
function pickParent(uid){
  if(state.fusionLocked)return;
  if(state.fusionParents.includes(uid))state.fusionParents=state.fusionParents.filter(x=>x!==uid);
  else if(state.fusionParents.length<2)state.fusionParents.push(uid);
  renderFusion();
}
function sample(arr,n){
  const shuffled=[...arr];
  for(let i=shuffled.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
  }
  return shuffled.slice(0,n);
}
function startFusion(){
  if(state.fusionParents.length!==2)return;
  const p=state.fusionParents.map(u=>state.owned.find(x=>x.uid===u));
  app.innerHTML=`<div class="card result">
    <div class="title">親モンスター確認</div>
    <p>この2体で配合を開始しますか？</p>
    <div class="listitem artwork-list-row">${monsterArtwork(p[0],'small')}<div><b>親①：${p[0].name}</b> Lv${p[0].level} ${starDisplay(p[0])} ＋${p[0].plusValue||0}<div class="muted">${p[0].race} / ${p[0].attribute}</div></div></div>
    <div class="listitem artwork-list-row">${monsterArtwork(p[1],'small')}<div><b>親②：${p[1].name}</b> Lv${p[1].level} ${starDisplay(p[1])} ＋${p[1].plusValue||0}<div class="muted">${p[1].race} / ${p[1].attribute}</div></div></div>
    <div class="grid">
      <button class="btn-cancel" onclick="renderFusion()">親を選び直す</button>
      <button class="btn-next" onclick="beginFusion()">この2体で開始</button>
    </div>
  </div>`;
  updateHeader();
}
function beginFusion(){
  if(state.fusionParents.length!==2)return;
  const p=state.fusionParents.map(u=>state.owned.find(x=>x.uid===u));
  let ids=[p[0].id,p[1].id];
  const usedNormalGroups=new Set();
  for(const parent of p){
    const group=NORMAL_FUSION_GROUP_BY_MONSTER[parent.id];
    const groupKey=`${parent.baseStar}|${group??'none'}|${parent.race}`;
    if(usedNormalGroups.has(groupKey))continue;
    usedNormalGroups.add(groupKey);
    ids.push(...sample(normalFusionPool(parent),2));
  }
  ids=[...new Set(ids)];
  const sp=special[key(p[0].id,p[1].id)];
  if(sp)ids.push(sp);
  state.fusionChoices=[...new Set(ids)];
  state.fusionLocked=true;
  renderFusionCandidates();
}
function renderFusionCandidates(){
  app.innerHTML=`<div class="card result"><div class="title">配合候補</div>
  <div class="muted">配合は開始されています。生まれるモンスターを1体選んでください。</div>
  <div class="candidate-grid">${state.fusionChoices.map(id=>`<button class="btn-next artwork-candidate" onclick="confirmFusionChoice('${id}')">${monsterArtwork(id,'medium')}<span>${monsterDB[id].name}</span></button>`).join('')}</div>
  </div>`;
  updateHeader();
}
function confirmFusionChoice(id){
  if(!state.fusionLocked)return;
  state.fusionSelected=id;
  const child=monsterDB[id];
  const parents=state.fusionParents.map(uid=>state.owned.find(x=>x.uid===uid));
  app.innerHTML=`<div class="card result">
    <div class="title">配合確認</div>
    <div class="confirm-monster">
      ${monsterArtwork(child,'large')}
      <h2>${child.name}</h2>
      <div class="muted">${child.race} / ${child.attribute} / ${starDisplay(child)}</div>
    </div>
    <p><b>${child.name}</b>でよろしいですか？</p>
    <div class="listitem">親①：${parents[0].name} Lv${parents[0].level} ${starDisplay(parents[0])} ＋${parents[0].plusValue||0}</div>
    <div class="listitem">親②：${parents[1].name} Lv${parents[1].level} ${starDisplay(parents[1])} ＋${parents[1].plusValue||0}</div>
    <div class="listitem"><b>完成時の＋値：＋${fusionPlusValue(parents[0],parents[1])}</b></div>
    <div class="grid">
      <button class="btn-cancel" onclick="cancelFusionChoice()">候補へ戻る</button>
      <button class="btn-next" onclick="showInheritance('${id}')">このモンスターに決定</button>
    </div>
  </div>`;
  updateHeader();
}
function cancelFusionChoice(){
  if(!state.fusionLocked)return;
  state.fusionSelected=null;
  renderFusionCandidates();
}
function skillRank(skillId){
  const m=String(skillId).match(/_(\d)$/);
  return m?Number(m[1]):1;
}
function upgradedSkillId(skillId){
  const m=String(skillId).match(/^(.*)_(\d)$/);
  if(!m)return null;
  const next=Number(m[2])+1;
  if(next>5)return null;
  const candidate=`${m[1]}_${next}`;
  return skills[candidate]?candidate:null;
}
function skillDisplayName(skillId){
  return skills[skillId]?.name||skillId;
}
function showInheritance(id){
  if(!state.fusionLocked)return;
  state.fusionSelected=id;
  const parents=state.fusionParents.map(uid=>state.owned.find(x=>x.uid===uid));
  const child=monsterDB[id];
  const maxSkillStar=Math.min(5,(child.baseStar||1)+1);

  const parentSkills=parents.flatMap(p=>(p.skills||[]).filter(s=>INHERITABLE_SKILLS.has(s)));
  const counts={};
  parentSkills.forEach(s=>counts[s]=(counts[s]||0)+1);

  const choices=[];
  for(const skillId of Object.keys(counts)){
    if(skillRank(skillId)<=maxSkillStar)choices.push(skillId);
    if(counts[skillId]>=2){
      const up=upgradedSkillId(skillId);
      if(up&&skillRank(up)<=maxSkillStar)choices.push(up);
    }
  }

  state.inheritChoices=[...new Set(choices)];
  state.inheritSelected=[];
  state.selectedSkillBookId=null;

  renderInheritance();
}
function fusionGeneratedSkillIds(monsterId){return FUSION_GENERATED_SKILLS_BY_MONSTER[monsterId]||[]}
function maxSelectableInheritance(monsterId){return Math.max(0,2-fusionGeneratedSkillIds(monsterId).length)}
function renderInheritance(){
  const child=monsterDB[state.fusionSelected];
  const parents=state.fusionParents.map(uid=>state.owned.find(x=>x.uid===uid));
  const plusValue=fusionPlusValue(parents[0],parents[1]);
  const generated=fusionGeneratedSkillIds(state.fusionSelected);
  const maxInheritance=maxSelectableInheritance(state.fusionSelected);
  app.innerHTML=`<div class="card result">
    <div class="title">継承スキル選択</div>
    <div class="muted">${child.name}に継承するスキルを最大${maxInheritance}つ選んでください。</div>
    <div class="muted">固有スキルと通常攻撃は継承候補に含まれません。</div>
    ${generated.length?`<div class="listitem"><b>配合時生成スキル</b><br>${generated.map(skillDisplayName).join(' / ')}</div>`:''}
    <div class="listitem"><b>スキルの書（1冊まで）</b><div class="skill-book-list"><button class="${!state.selectedSkillBookId?'sel':''}" onclick="selectFusionSkillBook(null)">使わない</button>${['SKILL_BOOK_STONE_GAZE','SKILL_BOOK_BLOSSOM_GIFT'].map(itemId=>`<button class="${state.selectedSkillBookId===itemId?'sel':''}" onclick="selectFusionSkillBook('${itemId}')" ${(state.items[itemId]||0)<1?'disabled':''}>${ITEM_DB[itemId].name} ×${state.items[itemId]||0}</button>`).join('')}</div></div>
    <div class="inherit-list">
      ${state.inheritChoices.length
        ? state.inheritChoices.map(id=>`<button class="inherit-btn ${state.inheritSelected.includes(id)?'sel':''}" onclick="toggleInheritance('${id}')">${skillDisplayName(id)}${state.inheritSelected.includes(id)?' ✓':''}</button>`).join('')
        : '<div class="listitem">継承できるスキルはありません</div>'}
    </div>
    <div class="card preview">
      <b>完成予定</b>
      <div>${child.name} ${starDisplay(child)} ＋${plusValue}</div>
      <div>継承：${state.inheritSelected.length?state.inheritSelected.map(skillDisplayName).join(' / '):'なし'}</div>
      <div>固有：${skillDisplayName(child.solid)}</div>
    </div>
    <button class="wide btn-next" onclick="completeFusion('${state.fusionSelected}')">継承を決定</button>
  </div>`;
  updateHeader();
}
function selectFusionSkillBook(itemId){
  if(itemId&&(!ITEM_DB[itemId]?.bookSkill||(state.items[itemId]||0)<1))return;
  const oldSkill=ITEM_DB[state.selectedSkillBookId]?.bookSkill;
  if(oldSkill){
    state.inheritChoices=state.inheritChoices.filter(id=>id!==oldSkill);
    state.inheritSelected=state.inheritSelected.filter(id=>id!==oldSkill);
  }
  state.selectedSkillBookId=itemId||null;
  const newSkill=ITEM_DB[itemId]?.bookSkill;
  if(newSkill&&!state.inheritChoices.includes(newSkill))state.inheritChoices.push(newSkill);
  renderInheritance();
}
function toggleInheritance(id){
  if(state.inheritSelected.includes(id)){
    state.inheritSelected=state.inheritSelected.filter(x=>x!==id);
  }else{
    if(state.inheritSelected.length>=maxSelectableInheritance(state.fusionSelected))return;
    state.inheritSelected.push(id);
  }
  renderInheritance();
}
function fusionPlusValue(parentA,parentB){
  return Math.min(10,Math.max(parentA.plusValue||0,parentB.plusValue||0)+1);
}
function completeFusion(id){
  if(!state.fusionLocked)return;

  const parents=state.fusionParents.map(uid=>state.owned.find(x=>x.uid===uid));
  const inherited=[...state.inheritSelected];
  const generated=fusionGeneratedSkillIds(id);
  if(state.selectedSkillBookId){
    if((state.items[state.selectedSkillBookId]||0)<1)return;
    state.items[state.selectedSkillBookId]--;
  }

  const plusValue=fusionPlusValue(parents[0],parents[1]);
  const statBonus=fusionStatBonus(plusValue);

  const child=makeOwned(
    id,
    1,
    monsterDB[id].baseStar,
    ['NORMAL',...inherited,...generated,monsterDB[id].solid].slice(0,4)
  );

  child.plusValue=plusValue;
  child.maxHp+=statBonus.hp;
  child.hp=child.maxHp;
  child.atk+=statBonus.atk;
  child.def+=statBonus.def;
  child.spd+=statBonus.spd;
  child.fusionBonus={...statBonus};

  state.owned=state.owned.filter(x=>!state.fusionParents.includes(x.uid));
  state.party=state.party.filter(uid=>!state.fusionParents.includes(uid));
  state.owned.push(child);
  if(state.party.length<3)state.party.push(child.uid);

  state.fusionResult={
    childUid:child.uid,
    childId:id,
    childName:child.name,
    childStar:child.star,
    plusValue,
    inherited:[...inherited,...generated],
    usedSkillBook:state.selectedSkillBookId,
    solid:monsterDB[id].solid,
    statBonus
  };

  state.fusionLocked=true;
  state.discovered.add(id);
  saveGame({force:true});
  renderFusionResult();
}
function renderFusionResult(){
  const r=state.fusionResult;
  if(!r)return;
  const child=state.owned.find(x=>x.uid===r.childUid);
  app.innerHTML=`<div class="card result">
    <div class="title">配合完了！</div>
    <div class="confirm-monster">
      ${monsterArtwork(child,'large')}
      <h2>${child.name}</h2>
      <div class="muted">${child.race} / ${child.attribute}</div>
      <div class="star-result">${starDisplay(child)}　＋${child.plusValue}</div>
    </div>
    <div class="fusion-success">＋値が${r.plusValue}になった！</div>
    <div class="listitem"><b>＋値ステータスボーナス</b><br>HP +${r.statBonus.hp} / 攻撃 +${r.statBonus.atk} / 防御 +${r.statBonus.def} / 素早さ +${r.statBonus.spd}</div>
    <div class="listitem"><b>継承スキル</b><br>${r.inherited.length?r.inherited.map(skillDisplayName).join(' / '):'なし'}</div>
    <div class="listitem"><b>固有スキル</b><br>${skillDisplayName(r.solid)}</div>
    <button class="wide btn-next" onclick="finishFusionResult()">ホームへ進む</button>
  </div>`;
  updateHeader();
}
function finishFusionResult(){
  state.fusionLocked=false;
  state.fusionSelected=null;
  state.inheritChoices=[];
  state.inheritSelected=[];
  state.selectedSkillBookId=null;
  state.fusionResult=null;
  home();
}
