const app=document.getElementById('app'),skipBtn=document.getElementById('skipBtn'),retireBtn=document.getElementById('retireBtn'),backBtn=document.getElementById('backBtn'),homeBtn=document.getElementById('homeBtn'),headerActions=document.getElementById('headerActions');
const ITEM_DB={
  EXP_DROP:{id:'EXP_DROP',name:'経験のしずく',star:1,exp:1000,image:'exp_drop.png',description:'合成素材として使用すると、1個につき1000EXPを獲得する。'},
  EXP_CRYSTAL:{id:'EXP_CRYSTAL',name:'経験の結晶',star:2,exp:5000,image:'exp_crystal.png',description:'合成素材として使用すると、1個につき5000EXPを獲得する。'},
  EXP_ORB:{id:'EXP_ORB',name:'経験の宝珠',star:3,exp:10000,image:'exp_jewel.png',description:'合成素材として使用すると、1個につき10000EXPを獲得する。'},
  HEAL_POTION:{id:'HEAL_POTION',name:'回復薬',image:'heel_portion.png',battle:true,dungeons:[1,2,3,4],description:'戦闘中、味方全体のHPを20%回復する。'},
  RETURN_SCROLL:{id:'RETURN_SCROLL',name:'帰還スクロール',image:'return.png',battle:true,dungeons:[1,2,3,4],description:'戦闘を終了し、前層までの報酬を持ち帰る。'},
  MONSTER_FOOD_1:{id:'MONSTER_FOOD_1',name:'モンスターの餌（1）',image:'monster_food.png',battle:true,dungeons:[1,2,3],description:'選択した敵が仲間候補になる確率を10%加算する。'},
  BRONZE_COIN:{id:'BRONZE_COIN',name:'銅のコイン',image:'bronze_coin.png',description:'ショップで使用する通貨。'},
  SILVER_COIN:{id:'SILVER_COIN',name:'銀のコイン',image:'silver_coin.png',description:'ショップで使用する通貨。'},
  GOLD_COIN:{id:'GOLD_COIN',name:'金のコイン',image:'gold_coin.png',description:'ショップで使用する通貨。'},
  SKILL_TICKET:{id:'SKILL_TICKET',name:'スキル交換チケット',image:'skill_ticket.png',description:'スキルの書との交換に使用する。'},
  SKILL_BOOK_STONE_GAZE:{id:'SKILL_BOOK_STONE_GAZE',name:'スキルの書：ストーンゲイズ',image:'skill_book.png',bookSkill:'STONE_GAZE',description:'配合時、ストーンゲイズを継承候補へ追加する。'},
  SKILL_BOOK_BLOSSOM_GIFT:{id:'SKILL_BOOK_BLOSSOM_GIFT',name:'スキルの書：ブロッサムギフト',image:'skill_book.png',bookSkill:'BLOSSOM_GIFT',description:'配合時、ブロッサムギフトを継承候補へ追加する。'},
  KEY_CHAMPION_NORMAL:{id:'KEY_CHAMPION_NORMAL',name:'強者への道（ノーマル）のカギ',image:'kyosya_normal_key.png',description:'強者への道・ノーマルへの挑戦に使用する。'}
};
const ITEM_IDS=Object.keys(ITEM_DB);
const EXP_ITEM_IDS=ITEM_IDS.filter(id=>Number.isFinite(ITEM_DB[id].exp));
const BATTLE_ITEM_IDS=ITEM_IDS.filter(id=>ITEM_DB[id].battle);
function itemArtwork(itemId,size='normal'){const item=ITEM_DB[itemId],file=item?.image;return file?`<img class="item-artwork item-artwork-${size}" src="assets/items/${file}" alt="${item.name}">`:'<span class="item-artwork-placeholder">◆</span>'}
function emptyItemInventory(){return Object.fromEntries(ITEM_IDS.map(id=>[id,0]))}
function normalizeItems(value){
  const items=emptyItemInventory();
  for(const id of ITEM_IDS)items[id]=Math.max(0,Math.floor(Number(value?.[id])||0));
  return items;
}
function itemStarDisplay(item){return '★'.repeat(item.star)}
const state={screen:'modeSelect',mode:null,gachaTickets:0,appearanceTickets:0,items:emptyItemInventory(),itemFilter:'all',dungeonItemSelections:{},carriedItemId:null,battleItemUsed:false,selectedSkillBookId:null,unlockedSkillExchange:new Set(),shopTab:'coin',unlockedAppearances:new Set(),point:0,enemyPoint:0,nextSpBonus:0,battleType:'normal',turn:1,isProcessing:false,skip:false,selectedAlly:0,selectedEnemy:0,pending:null,queue:[null,null,null],floor:0,dungeon:null,difficulty:'normal',lastDungeonId:null,lastDungeonDifficulty:null,dungeonProgress:loadDungeonProgress(),monsterDefeatCounts:loadMonsterDefeatCounts(),clearRecorded:false,bossEnemyIndices:new Set(),soloBossBattle:false,recruits:new Map(),floorResult:null,restRecoveryUsed:false,dungeonObtainedItems:{},battleLogs:[],monsterSort:'acquired',monsterSortDir:'asc',partyCandidateSort:'acquired',partyCandidateSortDir:'asc',monsterFilters:{favorite:false,stars:new Set(),attributes:new Set(),races:new Set()},partyEditSlot:null,bulkPartySelection:[],detailFrom:'list',fusionParents:[],fusionChoices:[],fusionSelected:null,inheritChoices:[],inheritSelected:[],fusionResult:null,fusionLocked:false,owned:[],discovered:new Set(),party:[],dungeonStartSnapshot:null,lastSavedAt:null,saveLoadError:null,saveBlocked:false,saveDataDetected:false,loadedFromBackup:false};
function makeOwned(id,level=1,_star=null,skills2=null){const b=monsterDB[id],lv=Math.max(1,level),stats=growthAtLevel(b,lv);return{uid:crypto.randomUUID?.()||Math.random().toString(36),...b,star:b.baseStar,plusValue:0,appearance:'default',favorite:false,level:lv,exp:0,nextExp:requiredExp(lv,b.expGrowth,b.baseStar),maxHp:stats.maxHp,hp:stats.maxHp,atk:stats.atk,def:stats.def,spd:stats.spd,skills:skills2??defaultSkills(b),poisonTimers:[],atkBuffTimers:[],defBuffTimers:[],atkDebuffTimers:[],defDebuffTimers:[],spdBuffTimers:[],spdDebuffTimers:[]}}
function defaultSkills(b){const prefix={火:'FIRE',水:'WATER',雷:'THUNDER',自然:'NATURE',闇:'DARK',光:'LIGHT',無:'NEUTRAL'}[b.attribute];const own=`${prefix}_1`;return['NORMAL',own,b.solid].filter((id,i,a)=>skills[id]&&a.indexOf(id)===i)}
function initialSlimes(){
  return['SLIME_BLUE','SLIME_RED','SLIME_YELLOW','SLIME_GREEN'].map(id=>makeOwned(id,1));
}
state.owned=initialSlimes();state.party=state.owned.slice(0,3).map(x=>x.uid);

function clampNumber(value,min,max,fallback=min){
  const number=Number(value);
  return Number.isFinite(number)?Math.max(min,Math.min(max,number)):fallback;
}
function persistentMonster(monster){
  return{
    uid:monster.uid,
    id:monster.id,
    level:monster.level,
    exp:monster.exp||0,
    plusValue:monster.plusValue||0,
    appearance:monster.appearance==='alternate'?'alternate':'default',
    favorite:Boolean(monster.favorite),
    skills:[...(monster.skills||[])],
    hp:monster.hp
  };
}
function buildSaveData(){
  recordOwnedSkillsForExchange();
  return{
    version:GAME_SAVE_VERSION,
    savedAt:new Date().toISOString(),
    mode:state.mode,
    gachaTickets:state.gachaTickets,
    appearanceTickets:state.appearanceTickets,
    items:{...state.items},
    dungeonItemSelections:{...state.dungeonItemSelections},
    unlockedSkillExchange:[...state.unlockedSkillExchange],
    unlockedAppearances:[...state.unlockedAppearances],
    owned:state.owned.map(persistentMonster),
    party:[...state.party],
    discovered:[...state.discovered],
    dungeonProgress:structuredCloneSafe(state.dungeonProgress),
    monsterDefeatCounts:{...state.monsterDefeatCounts},
    lastDungeonId:state.lastDungeonId,
    lastDungeonDifficulty:state.lastDungeonDifficulty
  };
}
function recordOwnedSkillsForExchange(){
  for(const monster of state.owned)for(const skillId of monster.skills||[]){
    if(skillId==='STONE_GAZE'||skillId==='BLOSSOM_GIFT')state.unlockedSkillExchange.add(skillId);
  }
}
function structuredCloneSafe(value){
  return JSON.parse(JSON.stringify(value));
}
function normalizeDungeonProgress(value){
  const normalized=defaultDungeonProgress();
  for(const id of [1,2,3,4])for(const difficulty of Object.keys(DIFFICULTIES)){
    normalized[id][difficulty]=Math.max(0,Math.floor(Number(value?.[id]?.[difficulty])||0));
  }
  return normalized;
}
const LEGACY_SKILL_ID_MAP={BITE:'FANG',GIANT_STRIKE:'HEAVY_SMASH'};
function migrateSkillId(id){return LEGACY_SKILL_ID_MAP[id]||id}
function restoreOwnedMonster(raw,usedUids){
  if(!raw||!monsterDB[raw.id])return null;
  const level=Math.round(clampNumber(raw.level,1,100,1));
  const validSkills=Array.isArray(raw.skills)
    ?[...new Set(raw.skills.map(migrateSkillId).filter(id=>skills[id]))].slice(0,4)
    :null;
  const monster=makeOwned(raw.id,level,null,validSkills?.length?validSkills:null);
  if(!monster.skills.includes('NORMAL'))monster.skills.unshift('NORMAL');
  if(skills[monster.solid]&&!monster.skills.includes(monster.solid)){
    if(monster.skills.length>=4)monster.skills.pop();
    monster.skills.push(monster.solid);
  }
  monster.skills=[...new Set(monster.skills.filter(id=>skills[id]))].slice(0,4);
  let uid=typeof raw.uid==='string'&&raw.uid&&!usedUids.has(raw.uid)?raw.uid:monster.uid;
  while(usedUids.has(uid))uid=`${monster.uid}-${Math.random().toString(36).slice(2)}`;
  usedUids.add(uid);
  monster.uid=uid;
  monster.plusValue=Math.round(clampNumber(raw.plusValue,0,20,0));
  const bonus=fusionStatBonus(monster.plusValue);
  monster.maxHp+=bonus.hp;
  monster.atk+=bonus.atk;
  monster.def+=bonus.def;
  monster.spd+=bonus.spd;
  monster.fusionBonus={...bonus};
  monster.hp=Math.round(clampNumber(raw.hp,0,monster.maxHp,monster.maxHp));
  monster.exp=Math.max(0,Math.floor(Number(raw.exp)||0));
  monster.nextExp=requiredExp(monster.level,monster.expGrowth,monster.star);
  monster.appearance=raw.appearance==='alternate'&&APPEARANCE_CHANGE_MONSTER_IDS.has(monster.id)?'alternate':'default';
  monster.favorite=Boolean(raw.favorite);
  return monster;
}
function applySaveData(raw){
  if(!raw||typeof raw!=='object')throw new Error('セーブデータの形式が正しくありません。');
  const version=Math.floor(Number(raw.version)||1);
  if(version>GAME_SAVE_VERSION)throw new Error('このゲームより新しい形式のセーブデータです。');
  if(!Array.isArray(raw.owned)||!raw.owned.length)throw new Error('所持モンスターデータがありません。');
  const usedUids=new Set();
  const owned=raw.owned.map(x=>restoreOwnedMonster(x,usedUids)).filter(Boolean);
  if(!owned.length)throw new Error('読み込める所持モンスターがありません。');
  const ownedUids=new Set(owned.map(x=>x.uid));
  let partyIds=Array.isArray(raw.party)?raw.party.filter(uid=>ownedUids.has(uid)).slice(0,3):[];
  if(!partyIds.length)partyIds=owned.slice(0,3).map(x=>x.uid);
  state.owned=owned;
  state.mode=BUILD_MODE==='normal'||BUILD_MODE==='development'
    ?BUILD_MODE
    :raw.mode==='normal'||raw.mode==='development'
      ?raw.mode
      :version<2?'development':'normal';
  state.party=[...new Set(partyIds)];
  state.gachaTickets=Math.max(0,Math.floor(Number(raw.gachaTickets)||0));
  state.appearanceTickets=Math.max(0,Math.floor(Number(raw.appearanceTickets)||0));
  state.items=normalizeItems(raw.items);
  state.dungeonItemSelections=Object.fromEntries(Object.entries(raw.dungeonItemSelections||{}).filter(([dungeonId,itemId])=>ITEM_DB[itemId]?.battle&&ITEM_DB[itemId].dungeons.includes(Number(dungeonId))));
  state.unlockedSkillExchange=new Set((Array.isArray(raw.unlockedSkillExchange)?raw.unlockedSkillExchange:[]).filter(id=>id==='STONE_GAZE'||id==='BLOSSOM_GIFT'));
  state.unlockedAppearances=new Set(
    (Array.isArray(raw.unlockedAppearances)?raw.unlockedAppearances:[])
      .filter(id=>APPEARANCE_CHANGE_MONSTER_IDS.has(id))
  );
  for(const monster of state.owned){
    if(!state.unlockedAppearances.has(monster.id))monster.appearance='default';
  }
  state.discovered=new Set([
    ...(Array.isArray(raw.discovered)?raw.discovered.filter(id=>monsterDB[id]):[]),
    ...owned.map(x=>x.id)
  ]);
  if(BUILD_MODE==='development')state.discovered=new Set(Object.keys(monsterDB));
  state.dungeonProgress=normalizeDungeonProgress(raw.dungeonProgress);
  const savedDungeonId=Number(raw.lastDungeonId);
  const savedDifficulty=typeof raw.lastDungeonDifficulty==='string'?raw.lastDungeonDifficulty:null;
  state.lastDungeonId=[1,2,3,4].includes(savedDungeonId)?savedDungeonId:null;
  state.lastDungeonDifficulty=state.lastDungeonId&&DIFFICULTIES[savedDifficulty]?savedDifficulty:null;
  state.monsterDefeatCounts=Object.fromEntries(
    Object.entries(raw.monsterDefeatCounts||{})
      .filter(([id])=>monsterDB[id])
      .map(([id,count])=>[id,Math.max(0,Math.floor(Number(count)||0))])
  );
  recordOwnedSkillsForExchange();
  state.lastSavedAt=typeof raw.savedAt==='string'?raw.savedAt:null;
  state.saveLoadError=null;
  state.saveBlocked=false;
}
function dungeonSessionActive(){
  return Boolean(state.dungeonStartSnapshot);
}
function saveGame({force=false}={}){
  if(!state.mode)return false;
  if(dungeonSessionActive()&&!force)return false;
  if(state.saveBlocked&&!force)return false;
  try{
    const data=buildSaveData();
    const text=JSON.stringify(data);
    const previous=localStorage.getItem(GAME_SAVE_KEY);
    if(previous){
      try{
        const previousData=JSON.parse(previous);
        if(previousData&&Array.isArray(previousData.owned)&&previousData.owned.length){
          localStorage.setItem(GAME_SAVE_BACKUP_KEY,previous);
        }
      }catch(_error){}
    }
    localStorage.setItem(GAME_SAVE_KEY,text);
    if(localStorage.getItem(GAME_SAVE_KEY)!==text)throw new Error('ブラウザに保存内容を確認できませんでした。');
    localStorage.setItem(GAME_SAVE_BACKUP_KEY,text);
    state.lastSavedAt=data.savedAt;
    state.saveLoadError=null;
    state.saveBlocked=false;
    state.saveDataDetected=true;
    state.loadedFromBackup=false;
    return true;
  }catch(error){
    state.saveLoadError=`保存できませんでした：${error.message||error}`;
    return false;
  }
}
function loadGame(){
  let primaryText=null;
  let backupText=null;
  try{
    primaryText=localStorage.getItem(GAME_SAVE_KEY);
    backupText=localStorage.getItem(GAME_SAVE_BACKUP_KEY);
  }catch(error){
    state.saveLoadError=`ブラウザの保存領域を使用できません：${error.message||error}`;
    state.saveBlocked=true;
    return false;
  }
  state.saveDataDetected=Boolean(primaryText||backupText);
  if(!state.saveDataDetected)return false;
  const candidates=[
    {text:primaryText,backup:false},
    {text:backupText,backup:true}
  ].filter((candidate,index,array)=>candidate.text&&array.findIndex(other=>other.text===candidate.text)===index);
  const errors=[];
  for(const candidate of candidates){
    try{
      applySaveData(JSON.parse(candidate.text));
      state.loadedFromBackup=candidate.backup;
      if(candidate.backup){
        localStorage.setItem(GAME_SAVE_KEY,candidate.text);
        state.saveLoadError='予備セーブから復旧しました。';
      }
      return true;
    }catch(error){
      errors.push(error.message||String(error));
    }
  }
  state.saveLoadError=`セーブデータを読み込めませんでした：${errors.join(' / ')}`;
  state.saveBlocked=true;
  return false;
}
function restoreDungeonStartSnapshot(){
  if(!state.dungeonStartSnapshot)return;
  const snapshot=state.dungeonStartSnapshot;
  state.dungeonStartSnapshot=null;
  applySaveData(snapshot);
  saveGame({force:true});
}
function preserveDungeonExperienceInSnapshot(){
  if(!state.dungeonStartSnapshot?.owned)return;
  const currentByUid=new Map(state.owned.map(monster=>[monster.uid,monster]));
  for(const savedMonster of state.dungeonStartSnapshot.owned){
    const current=currentByUid.get(savedMonster.uid);
    if(!current)continue;
    savedMonster.level=current.level;
    savedMonster.exp=current.exp||0;
  }
  state.dungeonStartSnapshot.savedAt=new Date().toISOString();
}
const loadedExistingSave=loadGame();
const party=()=>state.party.map(u=>state.owned.find(x=>x.uid===u)).filter(Boolean);
function color(a){return({火:'#e55b50',水:'#45aee8',雷:'#e5d14a',自然:'#59b765',闇:'#7752aa',光:'#eee6a8',無:'#999'})[a]}
const attributeIconFiles={火:'attr_fire.png',水:'attr_water.png',自然:'attr_nature.png',雷:'attr_thunder.png',闇:'attr_dark.png',光:'attr_light.png',無:'attr_none.png'};
const raceIconFiles={物質:'race_material.png',獣:'race_beast.png',亜人:'race_demi.png',植物:'race_plant.png',アンデッド:'race_undead.png',悪魔:'race_demon.png',精霊:'race_spirit.png',龍:'race_dragon.png'};
const monsterArtworkFiles={
  SLIME_BLUE:'blue_slime.png',
  SLIME_RED:'red_slime.png',
  SLIME_YELLOW:'yellow_slime.png',
  SLIME_GREEN:'green_slime.png',
  MINIC:'minic.png',
  MIMIC:'mimic.png',
  STONE:'stone.png',
  CRYSTAL:'crystal.png',
  IRON:'iron.png',
  GOLEM:'golem.png',
  MANDRAGORA:'mandragora.png',
  SEED:'seed.png',
  FLOWER_MAN:'flower_man.png',
  GOBLIN:'goblin.png',
  KOBOLD:'kobold.png',
  HIGH_GOBLIN:'high_goblin.png',
  ORC:'orc.png',
  HIGH_ORC:'high_orc.png',
  WOLF:'wolf.png',
  HIGH_WOLF:'high_wolf.png',
  BAT:'bat.png',
  BLOOD_BAT:'blood_bat.png',
  BEAR:'bear.png',
  FOX:'fox.png',
  WILD_BOAR:'wild_boar.png',
  WITCH:'witch.png',
  SHAMAN:'shaman.png',
  THIEF:'thief.png',
  ZOMBIE:'zombie.png',
  SKELETON:'skeleton.png',
  GHOST:'ghost.png',
  DEMON_KID:'demon_kid.png',
  MINI_DEMON:'mini_demon.png',
  DEMON:'demon.png',
  IMP:'imp.png',
  GARGOYLE:'gargoyle.png',
  HELL_HOUND:'hellhound.png',
  MINI_FAIRY:'mini_fairy.png',
  FAIRY:'fairy.png',
  FLAME:'flame.png',
  AQUA_SPIRIT:'aqua.png',
  BOLT_SPIRIT:'bolt.png',
  LEAF_SPIRIT:'leaf.png',
  SHADOW_SPIRIT:'shadow.png',
  LIZARD_KID:'lizard_kid.png',
  LIZARD:'lizard.png',
  HIGH_LIZARD:'high_lizard.png',
  KOKOPI:'kokopi.png',
  KOKKORU:'kokkoru.png',
  COCKATRICE:'cockatrice.png',
  HORN_RABBIT:'horn_rabbit.png',
  RAT:'rat.png',
  SPIDER:'spider.png',
  VAMPEEL:'vampeel.png',
  VAMPIRE:'vampire.png',
  TRENT:'trent.png',
  SYLPH:'sylph.png',
  NYMPH:'nymph.png',
  DRYAD:'dryad.png',
  DRYS:'drys.png',
  HAMADRYAD:'hamadryad.png',
  HORNET:'hornet.png',
  NOCTUA:'noctua.png',
  SERPENT:'serpent.png',
  VIPER:'viper.png',
  GREAT_BEAR:'great_bear.png',
  GLOW_SPIRIT:'glow_spirit.png',
  GLOW_ELEMENT:'glow_element.png',
  GLOW_CORE:'glow_core.png',
  GLOW_ORB:'glow_orb.png',
};
const monsterAlternateArtworkFiles={
  VAMPIRE:'vampire_female.png',
  COCKATRICE:'cockatrice_female.png'
};
function monsterIcon(kind,value){
  const file=kind==='attribute'?attributeIconFiles[value]:raceIconFiles[value];
  if(!file)return '<span class="monster-icon monster-icon-empty" aria-hidden="true"></span>';
  return `<img class="monster-icon" src="assets/icons/${file}" alt="" title="${value}">`;
}
function monsterArtwork(monster,size='normal'){
  const id=typeof monster==='string'?monster:monster?.id;
  const alternate=typeof monster==='object'
    &&monster?.appearance==='alternate'
    &&state.unlockedAppearances.has(id);
  const file=alternate?monsterAlternateArtworkFiles[id]:monsterArtworkFiles[id];
  if(!file)return `<div class="orb artwork-fallback artwork-${size}" style="background:${color(monster?.attribute||monsterDB[id]?.attribute)||'#555'}"></div>`;
  return `<img class="monster-artwork artwork-${size}" src="assets/monsters/${file}" alt="${monsterDB[id]?.name||monster?.name||''}">`;
}
function appearanceAvailable(id){
  return Boolean(monsterAlternateArtworkFiles[id]);
}
function setMonsterAppearance(uid,appearance){
  const monster=state.owned.find(x=>x.uid===uid);
  if(!monster||!appearanceAvailable(monster.id))return;
  if(appearance==='alternate'&&!state.unlockedAppearances.has(monster.id))return;
  monster.appearance=appearance==='alternate'?'alternate':'default';
  saveGame({force:true});
  if(state.screen==='monsterList')showMonsterList();
  else if(state.screen==='monsterDetail')showMonsterDetail(uid,state.detailFrom);
}
