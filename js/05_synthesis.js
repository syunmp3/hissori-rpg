//
//合成システム
const SYNTHESIS_EXP_RATE = 0.3;
const SYNTHESIS_BASE_EXP = 500;
function totalEarnedExp(monster){
  let total = monster.exp || 0;
  for(let lv = 1; lv < monster.level; lv++)total += requiredExp(lv,monster.expGrowth,monster.star);
  return total;
}
function synthesisMaterialExp(monster){
  const totalExp = totalEarnedExp(monster);
  return Math.floor((SYNTHESIS_BASE_EXP+totalExp)*SYNTHESIS_EXP_RATE*monster.star);
}
function showSynthesis(){
  state.screen='synthesis';
  state.synthesisStep='base';
  state.synthesisBase=null;
  state.synthesisMaterials=[];
  state.synthesisItemAmounts=emptyItemInventory();
  state.synthesisMaterialTab='monster';
  renderSynthesis();
}
function pickSynthesisBase(uid){
  state.synthesisBase=uid;
  state.synthesisMaterials=[];
  state.synthesisItemAmounts=emptyItemInventory();
  renderSynthesis();
}
function confirmSynthesisBase(){
  if(!state.synthesisBase)return;
  state.synthesisStep='material';
  renderSynthesis();
}
function backToSynthesisBase(){
  state.synthesisStep='base';
  state.synthesisMaterials=[];
  state.synthesisItemAmounts=emptyItemInventory();
  renderSynthesis();
}
function setSynthesisMaterialTab(tab){
  if(tab!=='monster'&&tab!=='item')return;
  state.synthesisMaterialTab=tab;
  renderSynthesis();
}
function selectedSynthesisItemExp(){
  return EXP_ITEM_IDS.reduce((sum,id)=>sum+(state.synthesisItemAmounts?.[id]||0)*ITEM_DB[id].exp,0);
}
function selectedSynthesisMaterialExp(){
  const monsterExp=(state.synthesisMaterials||[]).reduce((sum,uid)=>{
    const monster=state.owned.find(x=>x.uid===uid);
    return sum+(monster?synthesisMaterialExp(monster):0);
  },0);
  return monsterExp+selectedSynthesisItemExp();
}
function selectedSynthesisCount(){
  return (state.synthesisMaterials?.length||0)+EXP_ITEM_IDS.reduce((sum,id)=>sum+(state.synthesisItemAmounts?.[id]||0),0);
}
function renderSynthesis(){
  const baseCandidates=state.owned.filter(x=>x.level<100);
  const materialCandidates=state.owned.filter(x=>x.level<100&&x.uid!==state.synthesisBase&&!party().includes(x));
  if(state.synthesisStep==='base'){
    app.innerHTML=`
      <div class="card" style="padding-bottom:70px;">
        <div class="title">モンスター合成</div>
        <div class="muted">合成元にするモンスターを1体選んでください。</div>
        ${baseCandidates.map(x=>`<div class="listitem choice artwork-list-row ${state.synthesisBase===x.uid?'sel':''}" onclick="pickSynthesisBase('${x.uid}')">${monsterArtwork(x,'small')}<div>${x.name} Lv${x.level} ${starDisplay(x)} ＋${x.plusValue||0}</div></div>`).join('')}
        <button class="wide bottom-button" onclick="confirmSynthesisBase()"${state.synthesisBase?'':' disabled'}>決定</button>
      </div>`;
  }else{
    const base=state.owned.find(x=>x.uid===state.synthesisBase);
    if(!base){showSynthesis();return}
    const gainedExp=selectedSynthesisMaterialExp();
    const itemAmounts=state.synthesisItemAmounts||emptyItemInventory();
    const monsterPanel=materialCandidates.length
      ?materialCandidates.map(x=>`<div class="listitem choice artwork-list-row ${state.synthesisMaterials.includes(x.uid)?'sel':''}" onclick="pickSynthesisMaterial('${x.uid}')">${monsterArtwork(x,'small')}<div>${x.name} Lv${x.level} ${starDisplay(x)}<div class="muted">獲得EXP：${synthesisMaterialExp(x)}</div></div></div>`).join('')
      :'<div class="listitem muted">使用できるモンスター素材がいません。</div>';
    const itemPanel=EXP_ITEM_IDS.map(id=>{
      const item=ITEM_DB[id],owned=state.items[id]||0,amount=Math.min(itemAmounts[id]||0,owned);
      return `<div class="listitem synthesis-item-row">
        <div class="synthesis-item-info"><div class="item-star">${itemStarDisplay(item)}</div><div><b>${item.name}</b><div class="muted">1個：${item.exp}EXP　所持：${owned}個</div></div></div>
        <div class="item-amount-controls">
          <button class="mini" onclick="changeSynthesisItemAmount('${id}',-1)" ${amount<=0?'disabled':''}>－</button>
          <button class="item-amount-value" onclick="setSynthesisItemAmount('${id}',${owned})" ${owned<=0?'disabled':''}>${amount}</button>
          <button class="mini" onclick="changeSynthesisItemAmount('${id}',1)" ${amount>=owned?'disabled':''}>＋</button>
        </div>
      </div>`;
    }).join('');
    app.innerHTML=`
      <div class="card synthesis-material-card">
        <div class="title">素材選択</div>
        <div class="muted">合成元</div>
        <div class="listitem artwork-list-row">${monsterArtwork(base,'small')}<div>${base.name} Lv${base.level} ${starDisplay(base)} ＋${base.plusValue||0}</div></div>
        <div class="synthesis-tabs">
          <button class="${state.synthesisMaterialTab==='monster'?'active':''}" onclick="setSynthesisMaterialTab('monster')">モンスター<span>${state.synthesisMaterials.length}体</span></button>
          <button class="${state.synthesisMaterialTab==='item'?'active':''}" onclick="setSynthesisMaterialTab('item')">アイテム<span>${EXP_ITEM_IDS.reduce((sum,id)=>sum+(itemAmounts[id]||0),0)}個</span></button>
        </div>
        <div class="muted">${state.synthesisMaterialTab==='monster'?'合成素材にするモンスターを選んでください。':'使用する個数を選んでください。数字を押すと所持数を一括選択します。'}</div>
        ${state.synthesisMaterialTab==='monster'?monsterPanel:itemPanel}
        <div class="synthesis-material-footer app-chrome app-chrome-bottom">
          <div class="result synthesis-material-exp"><div class="title">獲得経験値</div><div style="font-size:22px;font-weight:bold;">＋${gainedExp} EXP</div></div>
          <button class="wide synthesis-button" onclick="startSynthesis()" ${selectedSynthesisCount()?'':'disabled'}>合成する</button>
        </div>
      </div>`;
  }
  updateHeader();
}
function pickSynthesisMaterial(uid){
  const i=state.synthesisMaterials.indexOf(uid);
  if(i>=0)state.synthesisMaterials.splice(i,1);else state.synthesisMaterials.push(uid);
  renderSynthesis();
}
function setSynthesisItemAmount(id,amount){
  if(!ITEM_DB[id])return;
  if(!state.synthesisItemAmounts)state.synthesisItemAmounts=emptyItemInventory();
  state.synthesisItemAmounts[id]=Math.max(0,Math.min(state.items[id]||0,Math.floor(Number(amount)||0)));
  renderSynthesis();
}
function changeSynthesisItemAmount(id,delta){
  setSynthesisItemAmount(id,(state.synthesisItemAmounts?.[id]||0)+delta);
}
function startSynthesis(){
  const base=state.owned.find(x=>x.uid===state.synthesisBase);
  if(!base)return;
  const validMonsterIds=(state.synthesisMaterials||[]).filter(uid=>state.owned.some(x=>x.uid===uid&&x.uid!==base.uid&&!party().includes(x)));
  let gainedExp=validMonsterIds.reduce((sum,uid)=>{
    const monster=state.owned.find(x=>x.uid===uid);
    return sum+(monster?synthesisMaterialExp(monster):0);
  },0);
  const usedItems={};
  for(const id of EXP_ITEM_IDS){
    const amount=Math.max(0,Math.min(state.items[id]||0,Math.floor(Number(state.synthesisItemAmounts?.[id])||0)));
    usedItems[id]=amount;
    gainedExp+=amount*ITEM_DB[id].exp;
  }
  if(gainedExp<=0)return;
  const levelUps=addMonsterExp(base,gainedExp);
  for(const uid of validMonsterIds){
    const index=state.owned.findIndex(x=>x.uid===uid);
    if(index>=0)state.owned.splice(index,1);
  }
  for(const id of EXP_ITEM_IDS)state.items[id]=Math.max(0,(state.items[id]||0)-usedItems[id]);
  state.synthesisBase=null;
  state.synthesisMaterials=[];
  state.synthesisItemAmounts=emptyItemInventory();
  saveGame({force:true});
  alert(`${base.name}に${gainedExp}EXP！
`+(levelUps.length?`Lv${levelUps.join(' → Lv')}にレベルアップ！`:''));
  showSynthesis();
}
