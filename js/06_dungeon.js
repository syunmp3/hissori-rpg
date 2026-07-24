//
const NON_NORMAL_ENCOUNTER_IDS=new Set(['KOKOPI','KOKKORU','COCKATRICE','GLOW_SPIRIT','GLOW_ELEMENT','GLOW_CORE','GLOW_ORB']);
function dungeonEnemyPool(star){return M.filter(x=>x[4]===star&&!NON_NORMAL_ENCOUNTER_IDS.has(x[0])).map(x=>x[0])}
async function startDungeon(n,difficulty='normal'){
  if(!difficultyUnlocked(n,difficulty))return;
  if(n===4){
    if(difficulty!=='normal'||(state.items.KEY_CHAMPION_NORMAL||0)<1)return;
    state.items.KEY_CHAMPION_NORMAL--;
  }
  state.lastDungeonId=n;
  state.lastDungeonDifficulty=DIFFICULTIES[difficulty]?difficulty:'normal';
  saveGame({force:true});
  state.dungeonStartSnapshot=buildSaveData();
  state.dungeon=dungeonInfo(n);
  state.difficulty=state.lastDungeonDifficulty;
  state.carriedItemId=state.dungeonItemSelections[n]&&state.items[state.dungeonItemSelections[n]]>0?state.dungeonItemSelections[n]:null;
  state.battleItemUsed=false;
  state.floor=1;
  state.recruits=new Map();
  state.floorResult=null;
  state.restRecoveryUsed=false;
  state.dungeonObtainedItems={};
  state.clearRecorded=false;
  state.battleLogs=[];
  state.point=0;
  state.enemyPoint=0;
  party().forEach(x=>{x.hp=x.maxHp;clearTimedStatuses(x)});
  await showDungeonIntro();
  enterCurrentFloor();
}
async function showDungeonIntro(){
  state.screen='dungeonIntro';
  app.innerHTML=`<div class="transition-screen"><div class="transition-title">${state.dungeon.name}</div><div class="transition-sub">全${state.dungeon.max}層</div></div>`;
  skipBtn.style.display='none';
  backBtn.style.display='none';
  retireBtn.style.display='none';
  homeBtn.style.display='none';
  await waitForTransitionTap();
}
function waitForTransitionTap(){
  return new Promise(resolve=>{
    let finished=false;
    const finish=()=>{
      if(finished)return;
      finished=true;
      clearTimeout(timer);
      app.onclick=null;
      resolve();
    };
    const timer=setTimeout(finish,2000);
    app.onclick=finish;
  });
}
function enterCurrentFloor(){
  if(state.floor===state.dungeon?.restFloor)showRestFloor();
  else startFloor();
}
function showRestFloor(){
  state.screen='rest';
  const recoveryText=state.restRecoveryUsed?'回復済み':'戦闘不能：HP25%で復活／生存：最大HPの50%回復';
  app.innerHTML=`<div class="card result">
    <div class="title">第${state.floor}層　休息地点</div>
    <div class="listitem">${recoveryText}</div>
    <button class="wide" onclick="recoverAtRest()" ${state.restRecoveryUsed?'disabled':''}>回復する</button>
    <button class="wide btn-next" onclick="continueFromRest()">先へ進む</button>
    <button class="wide btn-cancel" onclick="confirmReturnFromRest()">帰還する</button>
  </div>`;
  skipBtn.style.display='none';
  backBtn.style.display='none';
  retireBtn.style.display='none';
  homeBtn.style.display='none';
  updateHeader();
}
function recoverAtRest(){
  if(state.restRecoveryUsed)return;
  for(const monster of party()){
    if(monster.hp<=0)monster.hp=Math.max(1,Math.round(monster.maxHp*.25));
    else monster.hp=Math.min(monster.maxHp,monster.hp+Math.round(monster.maxHp*.5));
    monster.fearTurns=0;
    monster.fearConsumed=false;
    monster.petrified=false;
    monster.petrifyTurns=0;
    clearTimedStatuses(monster);
  }
  state.restRecoveryUsed=true;
  showRestFloor();
}
async function continueFromRest(){
  if(state.floor>=state.dungeon.max)return;
  state.floor++;
  enterCurrentFloor();
}
function confirmReturnFromRest(){
  state.screen='restReturnConfirm';
  app.innerHTML=`<div class="card result">
    <div class="title">このダンジョンから帰還しますか？</div>
    <div class="muted">ここまでの報酬を持ち帰ることができます。</div>
    <div class="confirm-actions"><button class="wide btn-next" onclick="returnFromRest()">はい</button><button class="wide btn-cancel" onclick="showRestFloor()">いいえ</button></div>
  </div>`;
  skipBtn.style.display='none';
  backBtn.style.display='none';
  retireBtn.style.display='none';
  homeBtn.style.display='none';
}
function returnFromRest(){
  showRecruit(false);
}
function enemyIdsForFloor(){
  const d=state.dungeon,f=state.floor;
  state.battleType='normal';
  state.bossEnemyIndices=new Set();
  if(f===d.max){
    if(d.id===4){
      state.bossEnemyIndices.add(0);
      state.bossEnemyIndices.add(1);
      return ['GLOW_SPIRIT','GLOW_SPIRIT'];
    }
    if(d.id===1){
      const roll=Math.random()*5;
      if(roll<2){
        state.bossEnemyIndices.add(1);
        return ['WOLF','HIGH_WOLF','WOLF'];
      }
      state.bossEnemyIndices.add(0);
      return [roll<4?'ORC':'LIZARD'];
    }
    if(d.id===2){
      const roll=Math.random()*5;
      if(roll<2){
        state.bossEnemyIndices.add(0);
        return ['GOLEM'];
      }
      if(roll<4){
        state.bossEnemyIndices.add(1);
        return ['FLAME','FOX','FLAME'];
      }
      state.bossEnemyIndices.add(0);
      return ['DEMON'];
    }
    if(d.id===3){
      const roll=Math.random();
      if(roll<.2){
        state.bossEnemyIndices.add(0);
        return ['TRENT'];
      }
      if(roll<.6){
        state.bossEnemyIndices.add(1);
        return ['SERPENT','VIPER','SERPENT'];
      }
      state.bossEnemyIndices.add(0);
      return ['GREAT_BEAR'];
    }
    state.bossEnemyIndices.add(0);
    return [sample(dungeonEnemyPool(3),1)[0]];
  }
  const count=1+Math.floor(Math.random()*3);
  if(d.id===4){
    const pool=['SEED','MANDRAGORA','FLOWER_MAN'];
    const ids=Array.from({length:count},()=>sample(pool,1)[0]);
    if(Math.random()<.30)ids[Math.floor(Math.random()*ids.length)]='GLOW_SPIRIT';
    return ids;
  }
  if(d.id===1){
    if(Math.random()<difficultyConfig().rareRate){
      state.battleType='rare';
      return [RARE_ENCOUNTER_MONSTERS[1]];
    }
    return Array.from({length:count},()=>sample(STARTING_GRASSLAND_POOL,1)[0]);
  }
  if(d.id===2){
    if(f>=6&&f<=9&&Math.random()<difficultyConfig().rareRate){
      state.battleType='rare';
      return [RARE_ENCOUNTER_MONSTERS[2]];
    }
    const pool=f<=4?BEAST_CAVE_EARLY_POOL:BEAST_CAVE_LATE_POOL;
    return Array.from({length:count},()=>sample(pool,1)[0]);
  }
  if(d.id===3){
    const pool=f<=4?SPIRIT_FOREST_EARLY_POOL:SPIRIT_FOREST_LATE_POOL;
    return Array.from({length:count},()=>sample(pool,1)[0]);
  }
  const stars=f<=5?[1]:[1,2],ids=[];
  for(let i=0;i<count;i++){
    const star=stars[Math.floor(Math.random()*stars.length)];
    ids.push(sample(dungeonEnemyPool(star),1)[0]);
  }
  return ids;
}
function enemyLevelForFloor(){
  const baseLevel = state.dungeon.levelFunc(state.floor);
  return Math.min(100, baseLevel + difficultyConfig().levelBonus);
}
function enemyExperience(base,level,isBoss,soloBoss){
  const fixed={GLOW_SPIRIT:1000,GLOW_ELEMENT:5000,GLOW_CORE:10000,GLOW_ORB:100000}[base.id];
  if(fixed)return fixed;
  const levelExp=10+5*level+.5*level*level;
  const starRate=1+.1*((base.baseStar||1)-1);
  const bossRate=soloBoss?3:isBoss?1.2:1;
  return Math.max(1,Math.round(levelExp*starRate*bossRate*(base.expMultiplier||1)));
}
function enemyUnit(id,index){
  const b=monsterDB[id],level=enemyLevelForFloor();
  const levelStats=growthAtLevel(b,level);
  const rate=state.dungeon?.id===1&&state.difficulty==='normal' ? 0.9 : 1;
  const scaled=n=>Math.max(1,Math.round(n*rate));
  const isBoss=state.bossEnemyIndices.has(index);
  const soloBoss=isBoss&&state.soloBossBattle;
  const glowHp={GLOW_SPIRIT:5,GLOW_ELEMENT:10,GLOW_CORE:25,GLOW_ORB:50}[id];
  const hp=glowHp||Math.round(scaled(levelStats.maxHp)*(soloBoss?2.5:isBoss?2:1));
  const statRate=soloBoss?1.2:1;
  const escapeChance={GLOW_SPIRIT:.30,GLOW_ELEMENT:.20,GLOW_CORE:.20,GLOW_ORB:.20}[id]||0;
  return{...b,hp,maxHp:hp,atk:Math.round(scaled(levelStats.atk)*statRate),def:Math.round(scaled(levelStats.def)*statRate),spd:Math.round(scaled(levelStats.spd)*statRate),level,isBoss,isMidBoss:false,actionsPerTurn:soloBoss?2:1,fearTurns:0,fearConsumed:false,petrified:false,petrifyTurns:0,poisonTimers:[],atkBuffTimers:[],defBuffTimers:[],atkDebuffTimers:[],defDebuffTimers:[],spdBuffTimers:[],spdDebuffTimers:[],exp:enemyExperience(b,level,isBoss,soloBoss),glowArmor:Boolean(glowHp),escapeChance,recruitBonus:0};
}
function startFloor(){
  state.screen='battle';
  state.turn=1;
  state.point=Math.floor(state.point/2);
  state.enemyPoint=0;
  state.nextSpBonus=0;
  state.queue=[null,null,null];
  state.selectedAlly=0;
  state.selectedEnemy=0;
  state.pending=null;
  state.battleLogs=[];
  const enemyIds=enemyIdsForFloor();
  state.soloBossBattle=enemyIds.length===1&&state.bossEnemyIndices.size===1;
  state.enemies=enemyIds.map((id,index)=>enemyUnit(id,index));
  party().forEach(x=>{x.fearTurns=0;x.fearConsumed=false;x.petrified=false;x.petrifyTurns=0;clearTimedStatuses(x)});
  renderBattle();
  updateHeader();
}
