function toggleMonsterAppearance(uid){
  const monster=state.owned.find(x=>x.uid===uid);
  if(!monster||!state.unlockedAppearances.has(monster.id))return;
  setMonsterAppearance(uid,monster.appearance==='alternate'?'default':'alternate');
}
function updateBackButton(){
  let visible=true;
  let handler=null;
  if(state.screen==='monsterDetail')handler=()=>state.detailFrom==='party'?showPartyFormation():showMonsterList();
  else if(state.screen==='monstersMenu')handler=()=>home();
  else if(state.screen==='monsterList')handler=()=>showMonsters();
  else if(state.screen==='partyFormation')handler=()=>showMonsters();
  else if(state.screen==='singlePartyChange')handler=()=>showPartyFormation();
  else if(state.screen==='bulkPartySelection')handler=()=>showPartyFormation();
  else if(state.screen==='fusion'&&!state.fusionLocked)handler=()=>home();
  else if(state.screen==='synthesis')handler=()=>state.synthesisStep==='material'?backToSynthesisBase():home();
  else if(state.screen==='dungeons')handler=()=>home();
  else if(state.screen==='dungeonConfirm')handler=()=>showDungeons();
  else if(state.screen==='book')handler=()=>home();
  else if(state.screen==='bookDetail')handler=()=>showBook();
  else if(state.screen==='gacha')handler=()=>home();
  else if(state.screen==='items')handler=()=>home();
  else if(state.screen==='shop')handler=()=>home();
  else if(state.screen==='dataManagement')handler=()=>home();
  else visible=false;

  backBtn.style.display=visible?'inline-block':'none';
  backBtn.onclick=handler||(()=>{});
}
function updateHeader(){
  const inBattle=state.screen==='battle';
  const fusionLocked=state.screen==='fusion'&&state.fusionLocked;
  const choosingMode=state.screen==='modeSelect';
  skipBtn.style.display=inBattle?'inline-block':'none';
  retireBtn.style.display=(inBattle&&!state.isProcessing&&!state.pending)?'inline-block':'none';
  homeBtn.style.display=(inBattle||fusionLocked||choosingMode)?'none':'inline-block';
  skipBtn.disabled=!inBattle||!state.isProcessing;
  updateBackButton();
}
function showModeSelection(){
  state.screen='modeSelect';
  state.fusionLocked=false;
  app.innerHTML=`<div class="card mode-select">
    <div class="title">プレイモード選択</div>
    <div class="listitem">
      <b>通常プレイ</b>
      <div class="muted">スライム4体・Lv1で開始します。図鑑は入手したモンスターから登録されます。</div>
      <button class="wide btn-next" onclick="selectGameMode('normal')">通常プレイで開始</button>
    </div>
    <div class="listitem">
      <b>開発用</b>
      <div class="muted">スライム4体・Lv1で開始し、図鑑を全開放します。図鑑から取得、個体詳細からレベル上昇ができます。</div>
      <button class="wide" onclick="selectGameMode('development')">開発用で開始</button>
    </div>
    ${state.saveDataDetected&&state.saveBlocked?`<div class="save-warning">${state.saveLoadError}<br>既存データを保護するため、新規データでは上書きしていません。データを削除して最初から始める場合だけ、下の削除ボタンを押してください。</div><button class="wide btn-cancel" onclick="deleteSaveData()">読み込めないセーブデータを削除</button>`:'<div class="save-warning">モードはセーブデータごとに固定されます。変更する場合はデータ管理からセーブを削除してください。</div>'}
    <div class="title-version">${GAME_VERSION}</div>
  </div>`;
  updateHeader();
}
function selectGameMode(mode){
  if(mode!=='normal'&&mode!=='development')return;
  if(state.saveDataDetected&&state.saveBlocked){
    alert('読み込めないセーブデータが残っています。既存データを守るため、新規開始はできません。削除してよい場合は「読み込めないセーブデータを削除」を押してください。');
    return;
  }
  state.mode=mode;
  state.owned=initialSlimes();
  state.party=state.owned.slice(0,3).map(x=>x.uid);
  state.discovered=mode==='development'
    ?new Set(Object.keys(monsterDB))
    :new Set(state.owned.map(x=>x.id));
  state.dungeonProgress=defaultDungeonProgress();
  state.monsterDefeatCounts={};
  state.gachaTickets=0;
  state.appearanceTickets=0;
  state.items=emptyItemInventory();
  state.dungeonItemSelections={};
  state.unlockedSkillExchange=new Set();
  state.unlockedAppearances=new Set();
  state.lastSavedAt=null;
  state.saveLoadError=null;
  state.saveBlocked=false;
  saveGame({force:true});
  home();
}
function home(){
  if(state.fusionLocked)return;
  if(!state.mode){showModeSelection();return}
state.screen='home';state.fusionLocked=false;saveGame();const lastDungeon=state.lastDungeonId?dungeonInfo(state.lastDungeonId):null;const lastDifficulty=state.lastDungeonDifficulty&&DIFFICULTIES[state.lastDungeonDifficulty]?DIFFICULTIES[state.lastDungeonDifficulty]:null;app.innerHTML=`<div class="card"><div class="screen-title-row"><div><div class="title">ホーム</div><div class="muted">${state.mode==='development'?'開発用':'通常プレイ'}</div></div>${currencyStrip()}</div>${state.saveLoadError?`<div class="save-warning">${state.saveLoadError}</div>`:''}</div><div class="grid menu">${lastDungeon&&lastDifficulty?`<button class="last-dungeon-button" onclick="retryLastDungeon()">前回のダンジョンに挑戦<small>${lastDungeon.name}・${lastDifficulty.name}</small></button>`:''}<button onclick="showDungeons()">ダンジョン</button><button onclick="showMonsters()">モンスター</button><button onclick="showItems()">アイテム</button><button onclick="showShop()">ショップ</button><button onclick="showFusion()">配合</button><button onclick="showSynthesis()">モンスター合成</button><button onclick="showBook()">図鑑</button><button onclick="showGacha()">ガチャ<small>チケット ${state.gachaTickets}枚</small></button><button onclick="showDataManagement()">データ管理</button></div><div class="card"><div class="title">現在のパーティ</div>${party().map(x=>`<div class="listitem artwork-list-row">${monsterArtwork(x,'small')}<div><b>${x.name}</b> Lv${x.level} ${starDisplay(x)} ＋${x.plusValue||0}<div class="muted">HP${x.maxHp} 攻${x.atk} 防${x.def} 速${x.spd}</div></div></div>`).join('')}</div>`;updateHeader()}
function retryLastDungeon(){
  const id=state.lastDungeonId;
  const difficulty=state.lastDungeonDifficulty;
  if(!dungeonInfo(id)||!DIFFICULTIES[difficulty]){home();return}
  if(!difficultyUnlocked(id,difficulty)){confirmDungeonEntry(id);return}
  startDungeon(id,difficulty);
}
const ITEM_FILTERS={all:'すべて',dungeon:'ダンジョンアイテム',material:'配合・合成素材',ticket:'チケット・カギ',other:'その他'};
const ITEM_CATEGORIES={
  dungeon:new Set(['HEAL_POTION','RETURN_SCROLL','MONSTER_FOOD_1']),
  material:new Set(['EXP_DROP','EXP_CRYSTAL','EXP_ORB','SKILL_BOOK_STONE_GAZE','SKILL_BOOK_BLOSSOM_GIFT']),
  ticket:new Set(['GACHA_TICKET','APPEARANCE_TICKET','SKILL_TICKET','KEY_CHAMPION_NORMAL'])
};
function currencyStrip(){
  return `<div class="currency-strip">${['GOLD_COIN','SILVER_COIN','BRONZE_COIN'].map(id=>`<span>${itemArtwork(id,'tiny')}<b>${state.items[id]||0}</b></span>`).join('')}</div>`;
}
function ticketItemRows(){
  return [
    {id:'GACHA_TICKET',name:'ガチャチケット',count:state.gachaTickets,image:'capsule_ticket.png',description:'ガチャを1回引くために使用する。'},
    {id:'APPEARANCE_TICKET',name:'見た目変更チケット',count:state.appearanceTickets,image:'skin_ticket.png',description:'対象モンスターの別の見た目を解放するために使用する。'}
  ];
}
function itemCategory(id){
  for(const [category,ids] of Object.entries(ITEM_CATEGORIES))if(ids.has(id))return category;
  return 'other';
}
function showItems(message=''){
  state.screen='items';
  const virtual=ticketItemRows().filter(x=>x.count>0).map(x=>({...x,category:'ticket',html:`<img class="item-artwork item-artwork-small" src="assets/items/${x.image}" alt="${x.name}">`}));
  const inventory=ITEM_IDS.filter(id=>!['BRONZE_COIN','SILVER_COIN','GOLD_COIN'].includes(id)&&(state.items[id]||0)>0).map(id=>({id,name:ITEM_DB[id].name,count:state.items[id],description:ITEM_DB[id].description,category:itemCategory(id),html:itemArtwork(id,'small')}));
  const rows=[...virtual,...inventory].filter(x=>state.itemFilter==='all'||x.category===state.itemFilter);
  app.innerHTML=`<div class="card item-inventory-card">
    <div class="screen-title-row"><div class="title">所持アイテム</div><button class="compact-action" onclick="openItemFilterModal()">切り換え</button></div>
    <div class="muted">表示：${ITEM_FILTERS[state.itemFilter]||ITEM_FILTERS.all}</div>
    ${message?`<div class="save-message">${message}</div>`:''}
    ${rows.map(x=>`<div class="listitem item-list-row">${x.html}<div class="item-list-main"><b>${x.name}</b><div class="muted">${x.description}</div></div><div class="item-count">×${x.count}</div></div>`).join('')||'<div class="listitem muted">該当する所持アイテムはありません。</div>'}
    ${state.mode==='development'?'<button class="wide dev-action" onclick="developerAddExpItems()">開発用：経験値素材を各10個追加</button>':''}
  </div>`;
  updateHeader();
}
function openModal(title,content){
  closeModal();
  const modal=document.createElement('div');
  modal.id='uiModal';
  modal.className='modal-backdrop';
  modal.onclick=event=>{if(event.target===modal)closeModal()};
  modal.innerHTML=`<div class="ui-modal" role="dialog" aria-modal="true"><div class="screen-title-row"><div class="title">${title}</div><button class="modal-close" onclick="closeModal()">閉じる</button></div>${content}</div>`;
  document.body.appendChild(modal);
}
function closeModal(){document.getElementById('uiModal')?.remove()}
function openItemFilterModal(){
  openModal('アイテムの絞り込み',`<div class="modal-button-grid">${Object.entries(ITEM_FILTERS).map(([id,label])=>`<button class="${state.itemFilter===id?'active':''}" onclick="setItemFilter('${id}')">${label}</button>`).join('')}</div>`);
}
function setItemFilter(filter){state.itemFilter=ITEM_FILTERS[filter]?filter:'all';closeModal();showItems()}
function developerAddExpItems(){
  if(state.mode!=='development')return;
  for(const id of EXP_ITEM_IDS)state.items[id]=(state.items[id]||0)+10;
  saveGame({force:true});
  showItems('経験値素材を各10個追加しました。');
}
function showGacha(message='',won=false){
  state.screen='gacha';
  state.fusionLocked=false;
  app.innerHTML=`<div class="card gacha-card">
    <div class="title">ガチャ</div>
    <div class="gacha-ticket-count">ガチャチケット <b>${state.gachaTickets}枚</b></div>
    <div class="muted">1回につきガチャチケットを1枚使用します。</div>
    <div class="gacha-content-title">──────── ガチャ内容 ────────</div>
    <div class="gacha-rate-list">
      <div class="gacha-rate-row"><span>${itemArtwork('EXP_DROP','tiny')} ★1 経験のしずく</span><b>50%</b></div>
      <div class="gacha-rate-row"><span>${itemArtwork('EXP_CRYSTAL','tiny')} ★2 経験の結晶</span><b>10%</b></div>
      <div class="gacha-rate-row"><span>${itemArtwork('EXP_ORB','tiny')} ★3 経験の宝珠</span><b>5%</b></div>
      <div class="gacha-rate-gap"></div>
      <div class="gacha-rate-row"><span><img class="item-artwork item-artwork-tiny" src="assets/items/skin_ticket.png" alt=""> 見た目変更チケット</span><b>5%</b></div>
      <div class="gacha-rate-row"><span>${itemArtwork('SKILL_TICKET','tiny')} スキル交換チケット</span><b>3%</b></div>
      <div class="gacha-rate-row gacha-rate-miss"><span>はずれ</span><b>27%</b></div>
    </div>
    <div class="gacha-content-title">──────────────────────</div>
    ${message?`<div class="gacha-result ${won?'win':'miss'}">${message}</div>`:''}
    <button class="wide btn-next" onclick="drawGacha()" ${state.gachaTickets<1?'disabled':''}>1回引く</button>
    <div class="gacha-owned-summary">
      <span><img class="item-artwork item-artwork-tiny" src="assets/items/capsule_ticket.png" alt=""> ガチャ ${state.gachaTickets}枚</span>
      <span><img class="item-artwork item-artwork-tiny" src="assets/items/skin_ticket.png" alt=""> 見た目変更 ${state.appearanceTickets}枚</span>
    </div>
    ${state.mode==='development'?'<button class="wide dev-action" onclick="developerAddGachaTickets()">開発用：ガチャチケットを10枚追加</button>':''}
  </div>`;
  updateHeader();
}
function drawGacha(){
  if(state.gachaTickets<1)return;
  state.gachaTickets--;
  const roll=Math.random();
  let cursor=0,message='はずれ。何も出ませんでした。',won=false;
  cursor+=GACHA_RATES.EXP_DROP;
  if(roll<cursor){state.items.EXP_DROP++;message='経験のしずく ×1 を入手！';won=true;}
  else{
    cursor+=GACHA_RATES.EXP_CRYSTAL;
    if(roll<cursor){state.items.EXP_CRYSTAL++;message='経験の結晶 ×1 を入手！';won=true;}
    else{
      cursor+=GACHA_RATES.EXP_ORB;
      if(roll<cursor){state.items.EXP_ORB++;message='経験の宝珠 ×1 を入手！';won=true;}
      else{
        cursor+=GACHA_RATES.APPEARANCE_TICKET;
        if(roll<cursor){state.appearanceTickets++;message='見た目変更チケット ×1 を入手！';won=true;}
        else{
          cursor+=GACHA_RATES.SKILL_TICKET;
          if(roll<cursor){state.items.SKILL_TICKET++;message='スキル交換チケット ×1 を入手！';won=true;}
        }
      }
    }
  }
  saveGame({force:true});
  showGacha(message,won);
}
function developerAddGachaTickets(){
  if(state.mode!=='development')return;
  state.gachaTickets+=10;
  saveGame({force:true});
  showGacha('開発用ガチャチケットを10枚追加しました。');
}
const COIN_SHOP_OFFERS=[
  {get:'HEAL_POTION',getCount:1,cost:'BRONZE_COIN',costCount:5},
  {get:'RETURN_SCROLL',getCount:1,cost:'BRONZE_COIN',costCount:20},
  {get:'MONSTER_FOOD_1',getCount:1,cost:'BRONZE_COIN',costCount:10},
  {get:'BRONZE_COIN',getCount:100,cost:'SILVER_COIN',costCount:1},
  {get:'SILVER_COIN',getCount:1,cost:'BRONZE_COIN',costCount:100},
  {get:'SILVER_COIN',getCount:100,cost:'GOLD_COIN',costCount:1},
  {get:'GOLD_COIN',getCount:1,cost:'SILVER_COIN',costCount:100},
  {get:'KEY_CHAMPION_NORMAL',getCount:1,cost:'BRONZE_COIN',costCount:50}
];
const SKILL_EXCHANGE_OFFERS=[
  {get:'SKILL_BOOK_STONE_GAZE',getCount:1,cost:'SKILL_TICKET',costCount:1,requiredSkill:'STONE_GAZE'},
  {get:'SKILL_BOOK_BLOSSOM_GIFT',getCount:1,cost:'SKILL_TICKET',costCount:1,requiredSkill:'BLOSSOM_GIFT'}
];
function showShop(tab=state.shopTab||'coin',message=''){
  state.screen='shop';
  state.shopTab=tab==='skill'?'skill':'coin';
  recordOwnedSkillsForExchange();
  const offers=state.shopTab==='skill'?SKILL_EXCHANGE_OFFERS:COIN_SHOP_OFFERS;
  const shopCurrency=state.shopTab==='skill'?`<div class="currency-strip"><span>${itemArtwork('SKILL_TICKET','tiny')}<b>${state.items.SKILL_TICKET||0}</b></span></div>`:currencyStrip();
  app.innerHTML=`<div class="card"><div class="screen-title-row"><div class="title">ショップ</div>${shopCurrency}</div>
  <div class="shop-tabs"><button class="${state.shopTab==='coin'?'active':''}" onclick="showShop('coin')">コインショップ</button><button class="${state.shopTab==='skill'?'active':''}" onclick="showShop('skill')">スキル交換所</button></div>
  ${message?`<div class="save-message">${message}</div>`:''}
  ${state.shopTab==='skill'?`<div class="muted">一度入手したことがあるスキルの書を、スキル交換チケットで交換できます。</div>`:''}
  ${offers.map((offer,index)=>{const unlocked=!offer.requiredSkill||state.unlockedSkillExchange.has(offer.requiredSkill),canBuy=unlocked&&(state.items[offer.cost]||0)>=offer.costCount;return`<div class="listitem shop-row ${unlocked?'':'locked'}" onclick="showShopItemDetail('${offer.get}',${unlocked})">${itemArtwork(offer.get,'small')}<div class="item-list-main"><b>${unlocked?ITEM_DB[offer.get].name:'？？？'} ×${offer.getCount}</b><div class="muted">${unlocked?`${ITEM_DB[offer.cost].name} ×${offer.costCount}`:'？？？を一度入手すると解放'}</div></div><button onclick="event.stopPropagation();buyShopOffer('${state.shopTab}',${index})" ${canBuy?'':'disabled'}>交換</button></div>`}).join('')}</div>`;
  updateHeader();
}
function showShopItemDetail(itemId,unlocked=true){
  const item=ITEM_DB[itemId];
  if(!item)return;
  openModal(unlocked?item.name:'？？？',`<div class="modal-item-detail">${itemArtwork(itemId,'normal')}<p>${unlocked?item.description:'未解放のスキルの書です。対象スキルを一度入手すると詳細が解放されます。'}</p></div>`);
}
function buyShopOffer(tab,index){
  const offers=tab==='skill'?SKILL_EXCHANGE_OFFERS:COIN_SHOP_OFFERS;
  const offer=offers[index];
  if(!offer||(offer.requiredSkill&&!state.unlockedSkillExchange.has(offer.requiredSkill))||(state.items[offer.cost]||0)<offer.costCount)return;
  state.items[offer.cost]-=offer.costCount;
  state.items[offer.get]=(state.items[offer.get]||0)+offer.getCount;
  saveGame({force:true});
  showShop(tab,`${ITEM_DB[offer.get].name}を交換しました。`);
}
function saveDateLabel(){
  if(!state.lastSavedAt)return '未保存';
  const date=new Date(state.lastSavedAt);
  return Number.isNaN(date.getTime())?'日時不明':date.toLocaleString('ja-JP');
}
function showDataManagement(message=''){
  state.screen='dataManagement';
  state.fusionLocked=false;
  app.innerHTML=`<div class="card data-management">
    <div class="title">データ管理</div>
    ${message?`<div class="save-message">${message}</div>`:''}
    ${state.saveLoadError?`<div class="save-warning">${state.saveLoadError}</div>`:''}
    <div class="listitem">
      <b>端末内セーブ</b>
      <div class="muted">モード：${state.mode==='development'?'開発用':'通常プレイ'}</div>
      <div class="muted">最終保存：${saveDateLabel()}</div>
      <div class="muted">所持 ${state.owned.length}体 ／ 図鑑 ${state.discovered.size}/${Object.keys(monsterDB).length}</div>
      <div class="muted">ガチャチケット ${state.gachaTickets}枚</div>
      <div class="muted">見た目変更チケット ${state.appearanceTickets}枚 ／ 解放済み ${state.unlockedAppearances.size}種</div>
    </div>
    <button class="wide btn-next" onclick="manualSave()">今すぐ保存</button>
    <button class="wide" onclick="exportSaveData()">セーブデータを書き出す</button>
    <button class="wide" onclick="importSaveData()">セーブデータを読み込む</button>
    <button class="wide btn-cancel" onclick="deleteSaveData()">セーブデータを削除</button>
    <div class="muted save-note">通常は自動保存されます。書き出したJSONファイルは、別端末への移行やバックアップに利用できます。</div>
    <div class="game-update-panel">
      <div class="game-version-label">現在のバージョン：${GAME_VERSION}</div>
      <button class="wide btn-update" onclick="forceGameUpdate()">🔄 最新版に更新</button>
      <div class="muted update-note">キャッシュを削除して最新版を読み込み直します。セーブデータは消えません。</div>
    </div>
  </div>`;
  updateHeader();
}
async function forceGameUpdate(){
  const ok=confirm('最新版を取得します。\nセーブデータは消えません。\n\n更新しますか？');
  if(!ok)return;
  saveGame({force:true});
  try{
    if('caches' in window){
      const cacheNames=await caches.keys();
      await Promise.all(cacheNames.map(name=>caches.delete(name)));
    }
    if('serviceWorker' in navigator){
      const registrations=await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration=>registration.unregister()));
    }
  }catch(error){
    console.warn('キャッシュの削除に失敗しました。再読み込みを続行します。',error);
  }
  const url=new URL(location.href);
  url.searchParams.set('update',Date.now().toString());
  location.replace(url.toString());
}
function showVersionUpdateNotice(){
  try{
    const lastShown=localStorage.getItem(VERSION_NOTICE_KEY);
    if(lastShown===GAME_VERSION)return;
    localStorage.setItem(VERSION_NOTICE_KEY,GAME_VERSION);
    if(loadedExistingSave||lastShown){
      setTimeout(()=>alert(`${GAME_VERSION} に更新しました！`),120);
    }
  }catch(error){
    console.warn('バージョン通知を保存できませんでした。',error);
  }
}
function manualSave(){
  const success=saveGame({force:true});
  showDataManagement(success?'保存しました。':'保存に失敗しました。');
}
function exportSaveData(){
  if(!saveGame({force:true})){
    showDataManagement('書き出し前の保存に失敗しました。');
    return;
  }
  const data=localStorage.getItem(GAME_SAVE_KEY);
  const blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  link.href=url;
  link.download=`hissori-rpg-save-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showDataManagement('セーブデータを書き出しました。');
}
function importSaveData(){
  const input=document.createElement('input');
  input.type='file';
  input.accept='.json,application/json';
  input.onchange=async()=>{
    const file=input.files?.[0];
    if(!file)return;
    try{
      const data=JSON.parse(await file.text());
      applySaveData(data);
      state.dungeonStartSnapshot=null;
      saveGame({force:true});
      alert('セーブデータを読み込みました。');
      home();
    }catch(error){
      state.saveLoadError=`読み込みに失敗しました：${error.message||error}`;
      showDataManagement();
    }
  };
  input.click();
}
function deleteSaveData(){
  if(!confirm('端末内のセーブデータを削除して、新規状態へ戻しますか？\\nこの操作は取り消せません。'))return;
  localStorage.removeItem(GAME_SAVE_KEY);
  localStorage.removeItem(GAME_SAVE_BACKUP_KEY);
  localStorage.removeItem(DUNGEON_PROGRESS_KEY);
  localStorage.removeItem(MONSTER_DEFEAT_COUNTS_KEY);
  location.reload();
}
