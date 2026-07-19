const MAX_POINT=9, DELAY=500;
const ATTRS=['火','水','雷','自然','闇','光'];
const skills={NORMAL:{id:'NORMAL',name:'通常攻撃',type:'attack',attribute:'無',cost:0,multiplier:.8,target:'enemySingle'}};
const INHERITABLE_SKILL_IDS=[
  'FIRE_1','FIRE_2','FIRE_3','FIRE_4','FIRE_5',
  'WATER_1','WATER_2','WATER_3','WATER_4','WATER_5',
  'THUNDER_1','THUNDER_2','THUNDER_3','THUNDER_4','THUNDER_5',
  'NATURE_1','NATURE_2','NATURE_3','NATURE_4','NATURE_5',
  'DARK_1','DARK_2','DARK_3','DARK_4','DARK_5',
  'LIGHT_1','LIGHT_2','LIGHT_3','LIGHT_4','LIGHT_5',
  'NEUTRAL_1','NEUTRAL_2','NEUTRAL_3','NEUTRAL_4','NEUTRAL_5'
];
const FUSION_GENERATED_INHERITABLE_SKILL_IDS=['STONE_GAZE'];
const INHERITABLE_SKILLS=new Set([...INHERITABLE_SKILL_IDS,...FUSION_GENERATED_INHERITABLE_SKILL_IDS]);
Object.assign(skills,{
FIRE_1:{id:'FIRE_1',name:'フレア',star:1,type:'attack',attribute:'火',cost:1,multiplier:1,target:'enemySingle'},
FIRE_2:{id:'FIRE_2',name:'ハイフレア',star:2,type:'attack',attribute:'火',cost:1,multiplier:1.3,target:'enemySingle'},
FIRE_3:{id:'FIRE_3',name:'グランドフレア',star:3,type:'attack',attribute:'火',cost:3,multiplier:2.6,target:'enemySingle'},
FIRE_4:{id:'FIRE_4',name:'ヒートブラスト',star:4,type:'attack',attribute:'火',cost:2,multiplier:2.2,target:'enemySingle'},
FIRE_5:{id:'FIRE_5',name:'ラヴァ',star:5,type:'attack',attribute:'火',cost:5,multiplier:2.2,target:'enemyAll'},
WATER_1:{id:'WATER_1',name:'アクア',star:1,type:'attack',attribute:'水',cost:1,multiplier:1,target:'enemySingle'},
WATER_2:{id:'WATER_2',name:'ハイアクア',star:2,type:'attack',attribute:'水',cost:1,multiplier:1.3,target:'enemySingle'},
WATER_3:{id:'WATER_3',name:'グランドアクア',star:3,type:'attack',attribute:'水',cost:3,multiplier:2.6,target:'enemySingle'},
WATER_4:{id:'WATER_4',name:'アイスストーム',star:4,type:'attack',attribute:'水',cost:4,multiplier:1.9,target:'enemyAll'},
WATER_5:{id:'WATER_5',name:'ブリザード',star:5,type:'attack',attribute:'水',cost:5,multiplier:2.2,target:'enemyAll'},
THUNDER_1:{id:'THUNDER_1',name:'プラズマ',star:1,type:'attack',attribute:'雷',cost:1,multiplier:1,target:'enemySingle'},
THUNDER_2:{id:'THUNDER_2',name:'ハイプラズマ',star:2,type:'attack',attribute:'雷',cost:1,multiplier:1.3,target:'enemySingle'},
THUNDER_3:{id:'THUNDER_3',name:'グランドプラズマ',star:3,type:'attack',attribute:'雷',cost:3,multiplier:2.6,target:'enemySingle'},
THUNDER_4:{id:'THUNDER_4',name:'スパークバースト',star:4,type:'attack',attribute:'雷',cost:4,multiplier:1.9,target:'enemyAll'},
THUNDER_5:{id:'THUNDER_5',name:'サンダー',star:5,type:'attack',attribute:'雷',cost:4,multiplier:3.5,target:'enemySingle'},
NATURE_1:{id:'NATURE_1',name:'ヴァイン',star:1,type:'attack',attribute:'自然',cost:1,multiplier:1,target:'enemySingle'},
NATURE_2:{id:'NATURE_2',name:'ハイヴァイン',star:2,type:'attack',attribute:'自然',cost:1,multiplier:1.3,target:'enemySingle'},
NATURE_3:{id:'NATURE_3',name:'グランドヴァイン',star:3,type:'attack',attribute:'自然',cost:3,multiplier:2.6,target:'enemySingle'},
NATURE_4:{id:'NATURE_4',name:'フォレストレイジ',star:4,type:'attack',attribute:'自然',cost:4,multiplier:3,target:'enemySingle'},
NATURE_5:{id:'NATURE_5',name:'ストーム',star:5,type:'attack',attribute:'自然',cost:5,multiplier:2.2,target:'enemyAll'},
DARK_1:{id:'DARK_1',name:'ダーク',star:1,type:'attack',attribute:'闇',cost:1,multiplier:1.2,target:'enemySingle'},
DARK_2:{id:'DARK_2',name:'ハイダーク',star:2,type:'attack',attribute:'闇',cost:1,multiplier:1.5,target:'enemySingle'},
DARK_3:{id:'DARK_3',name:'グランドダーク',star:3,type:'attack',attribute:'闇',cost:3,multiplier:2.8,target:'enemySingle'},
DARK_4:{id:'DARK_4',name:'ファントムアタック',star:4,type:'attack',attribute:'闇',cost:2,multiplier:2.4,target:'enemySingle'},
DARK_5:{id:'DARK_5',name:'カオス',star:5,type:'attack',attribute:'闇',cost:6,multiplier:2.7,target:'enemyAll'},
LIGHT_1:{id:'LIGHT_1',name:'ライト',star:1,type:'attack',attribute:'光',cost:2,multiplier:1.1,target:'enemyAll'},
LIGHT_2:{id:'LIGHT_2',name:'ハイライト',star:2,type:'attack',attribute:'光',cost:2,multiplier:1.3,target:'enemyAll'},
LIGHT_3:{id:'LIGHT_3',name:'グランドライト',star:3,type:'attack',attribute:'光',cost:3,multiplier:1.7,target:'enemyAll'},
LIGHT_4:{id:'LIGHT_4',name:'シャイン',star:4,type:'heal',attribute:'光',cost:3,target:'allyAll',healRate:.1,minHeal:50},
LIGHT_5:{id:'LIGHT_5',name:'デイブレイク',star:5,type:'attack',attribute:'光',cost:6,multiplier:2.7,target:'enemyAll'},
NEUTRAL_1:{id:'NEUTRAL_1',name:'アタック',star:1,type:'attack',attribute:'無',cost:1,multiplier:1,target:'enemySingle'},
NEUTRAL_2:{id:'NEUTRAL_2',name:'ハイアタック',star:2,type:'attack',attribute:'無',cost:1,multiplier:1.2,target:'enemySingle'},
NEUTRAL_3:{id:'NEUTRAL_3',name:'グランドアタック',star:3,type:'attack',attribute:'無',cost:3,multiplier:2.5,target:'enemySingle'},
NEUTRAL_4:{id:'NEUTRAL_4',name:'ラッシュアタック',star:4,type:'attack',attribute:'無',cost:4,multiplier:1.7,target:'enemyAll'},
NEUTRAL_5:{id:'NEUTRAL_5',name:'ラッキーパンチ',star:5,type:'attack',attribute:'無',cost:3,multiplier:0,target:'enemySingle',randomMultiplier:[0,1,2,3,4,5]}
});
Object.assign(skills,{
DOUBLE_ATTACK:{id:'DOUBLE_ATTACK',name:'ダブルアタック',star:1,type:'attack',attribute:'無',cost:1,multiplier:.6,target:'enemyRandom',hits:2,randomEachHit:true},
POWER_ATTACK:{id:'POWER_ATTACK',name:'パワーアタック',star:2,type:'attack',attribute:'無',cost:2,multiplier:2.1,target:'enemySingle'},
SLIME_ATTACK:{id:'SLIME_ATTACK',name:'スライムアタック',star:1,type:'attack',attribute:'無',cost:1,multiplier:1.2,target:'enemySingle'},
NIGHT_VISION:{id:'NIGHT_VISION',name:'ナイトビジョン',star:2,type:'attack',attribute:'闇',cost:2,multiplier:2.0,target:'enemySingle',passive:{attributeDamage:{闇:1.05}}},
MAGIC_COLLECTOR:{id:'MAGIC_COLLECTOR',name:'マジックコレクター',star:2,type:'passive',attribute:'無',cost:0,target:'self',active:false,passive:{elementDamage:1.1}},
BREATH:{id:'BREATH',name:'ブレス',star:2,type:'attack',attribute:'火',cost:2,multiplier:1.3,target:'enemyAll'},

FAIRY_POWDER:{id:'FAIRY_POWDER',name:'妖精の粉',star:2,type:'heal',attribute:'光',cost:2,target:'allySingle',healRate:.2,minHeal:60},
SCREAM:{id:'SCREAM',name:'叫び声',star:1,type:'attack',attribute:'無',cost:1,multiplier:.7,target:'enemyAll'},
GHOST_ATTACK:{id:'GHOST_ATTACK',name:'ゴースト',star:1,type:'attack',attribute:'闇',cost:1,multiplier:1.4,target:'enemySingle'},
SURPRISE_BOX:{id:'SURPRISE_BOX',name:'サプライズボックス',star:2,type:'attack',attribute:'無',cost:2,multiplier:2.2,target:'enemySingle',randomTarget:true},
FIRE_PLAY:{id:'FIRE_PLAY',name:'火遊び',star:1,type:'attack',attribute:'火',cost:1,multiplier:1.2,target:'enemySingle'},
BITE:{id:'BITE',name:'かみつく',star:1,type:'attack',attribute:'無',cost:1,multiplier:1.4,target:'enemySingle'},
PIERCE:{id:'PIERCE',name:'ピアース',star:1,type:'attack',attribute:'無',cost:1,multiplier:1.4,target:'enemySingle'},
SACRIFICE:{id:'SACRIFICE',name:'生贄',star:2,type:'attack',attribute:'闇',cost:2,multiplier:2.5,target:'enemySingle',selfHpCostRate:.1},
STONE_BODY:{id:'STONE_BODY',name:'ストーンボディ',star:1,type:'passive',attribute:'無',cost:0,target:'self',active:false,passive:{damageTaken:.95}},
GIANT_STRIKE:{id:'GIANT_STRIKE',name:'巨大な一撃',star:3,type:'attack',attribute:'無',cost:2,multiplier:2.4,target:'enemySingle'},
HELL_CALL:{id:'HELL_CALL',name:'地獄の呼び声',star:3,type:'passive',attribute:'火',cost:0,target:'self',active:false,passive:{attributeDamage:{火:1.1,闇:1.1}}},
WATER_MAGIC:{id:'WATER_MAGIC',name:'ウォーターマジック',star:1,type:'attack',attribute:'水',cost:1,multiplier:1.2,target:'enemySingle'},
FLOWER_SWORD:{id:'FLOWER_SWORD',name:'フラワーソード',star:1,type:'attack',attribute:'自然',cost:1,multiplier:1.2,target:'enemySingle'},
BOLT_STRIKE:{id:'BOLT_STRIKE',name:'ボルト',star:1,type:'attack',attribute:'雷',cost:1,multiplier:1.2,target:'enemySingle'},
CHICKEN_SCREAM:{id:'CHICKEN_SCREAM',name:'チキンスクリーム',star:3,type:'attack',attribute:'火',cost:3,multiplier:1.4,target:'enemyAll',fearChance:.3},
COCKA_ROAR:{id:'COCKA_ROAR',name:'コカロアー',star:5,type:'attack',attribute:'火',cost:4,multiplier:2,target:'enemyAll',fearChance:.3},
STONE_GAZE:{id:'STONE_GAZE',name:'ストーンゲイズ',star:4,type:'debuff',attribute:'無',cost:3,multiplier:0,target:'enemySingle',petrify:true},
STORE_SP:{id:'STORE_SP',name:'たくわえる',star:1,type:'storeSp',attribute:'無',cost:0,target:'self'},
BLOOD_CRAVING:{id:'BLOOD_CRAVING',name:'血を欲するも者',star:3,type:'passive',attribute:'闇',cost:0,target:'self',active:false,passive:{lifestealRate:.5,diesIfNoAttack:true}},
BLOOD_DRAIN:{id:'BLOOD_DRAIN',name:'ブラッドドレイン',star:3,type:'attack',attribute:'闇',cost:2,multiplier:2.2,target:'enemySingle',lifestealRate:.75}
});
const M=[
["SLIME_BLUE","ブルースライム","物質","水",1,"SLIME_ATTACK",95,35,50,30,"防御型"],
["SLIME_RED","レッドスライム","物質","火",1,"SLIME_ATTACK",80,50,35,35,"攻撃型"],
["SLIME_YELLOW","イエロースライム","物質","雷",1,"SLIME_ATTACK",75,40,35,55,"速度型"],
["SLIME_GREEN","グリーンスライム","物質","自然",1,"SLIME_ATTACK",90,38,48,32,"防御型"],
["GOBLIN","ゴブリン","亜人","無",1,"DOUBLE_ATTACK",90,52,35,45,"攻撃型"],
["KOBOLD","コボルト","亜人","無",1,"DOUBLE_ATTACK",80,42,35,60,"速度型"],
["HIGH_GOBLIN","ハイゴブリン","亜人","無",2,"POWER_ATTACK",120,70,50,55,"攻撃型"],
["WOLF","ウルフ","獣","自然",1,"DOUBLE_ATTACK",85,45,35,65,"速度型"],
["HIGH_WOLF","ハイウルフ","獣","自然",2,"POWER_ATTACK",120,60,45,85,"速度型"],
["BAT","バット","獣","闇",1,"DOUBLE_ATTACK",70,35,30,70,"速度型"],
["BLOOD_BAT","ブラッドバット","獣","闇",2,"NIGHT_VISION",100,55,45,95,"速度型"],
["ORC","オーク","亜人","無",2,"DOUBLE_ATTACK",160,65,85,25,"防御型"],
["HIGH_ORC","ハイオーク","亜人","無",3,"POWER_ATTACK",220,90,120,32,"防御型"],
["WITCH","ウィッチ","亜人","水",1,"MAGIC_COLLECTOR",75,45,35,50,"速度型"],
["DEMON_KID","デーモンキッズ","悪魔","闇",1,"DOUBLE_ATTACK",90,55,35,40,"攻撃型"],
["MINI_DEMON","ミニデーモン","悪魔","闇",1,"DOUBLE_ATTACK",100,58,40,35,"攻撃型"],
["DEMON","デーモン","悪魔","闇",2,"NIGHT_VISION",150,90,60,45,"攻撃型"],
["LIZARD_KID","リザードキッズ","龍","火",1,"DOUBLE_ATTACK",95,60,40,35,"攻撃型"],
["LIZARD","リザード","龍","火",2,"BREATH",140,90,60,40,"攻撃型"],
["HIGH_LIZARD","ハイリザード","龍","火",3,"BREATH",200,120,85,55,"攻撃型"],
["MINI_FAIRY","ミニフェアリー","精霊","光",1,"FAIRY_POWDER",65,32,28,72,"速度型"],
["MANDRAGORA","マンドラゴラ","植物","自然",1,"SCREAM",105,34,52,28,"防御型"],
["SEED","シード","植物","自然",1,"DOUBLE_ATTACK",55,22,24,58,"速度型"],
["FLOWER_MAN","フラワーマン","植物","自然",1,"DOUBLE_ATTACK",78,38,32,56,"速度型"],
["ZOMBIE","ゾンビ","アンデッド","無",1,"DOUBLE_ATTACK",115,55,38,22,"攻撃型"],
["SKELETON","スケルトン","アンデッド","無",1,"DOUBLE_ATTACK",72,46,30,62,"速度型"],
["GHOST","ゴースト","アンデッド","闇",1,"GHOST_ATTACK",68,44,26,70,"速度型"],
["MINIC","ミニック","物質","無",1,"DOUBLE_ATTACK",100,40,55,24,"防御型"],
["MIMIC","ミミック","物質","闇",2,"SURPRISE_BOX",125,72,52,38,"攻撃型"],
["BEAR","ベア","獣","自然",1,"POWER_ATTACK",115,58,44,32,"攻撃型"],
["FOX","フォックス","獣","火",2,"FIRE_PLAY",92,60,38,72,"速度型"],
["WILD_BOAR","ワイルドボア","獣","無",2,"BITE",130,68,52,34,"攻撃型"],
["SHAMAN","シャーマン","亜人","光",2,"SACRIFICE",105,52,58,46,"防御型"],
["STONE","ストーン","物質","無",1,"STONE_BODY",120,36,70,18,"防御型"],
["CRYSTAL","クリスタル","物質","光",2,"STONE_BODY",105,58,68,38,"防御型"],
["IRON","アイアン","物質","無",2,"STONE_BODY",135,48,82,20,"防御型"],
["GOLEM","ゴーレム","物質","無",3,"GIANT_STRIKE",195,92,118,22,"防御型"],
["THIEF","シーフ","亜人","無",1,"DOUBLE_ATTACK",78,48,30,74,"速度型"],
["IMP","インプ","悪魔","闇",1,"SCREAM",76,50,30,66,"速度型"],
["GARGOYLE","ガーゴイル","悪魔","無",2,"POWER_ATTACK",135,72,78,42,"防御型"],
["HELL_HOUND","ヘルハウンド","悪魔","火",3,"HELL_CALL",165,108,66,64,"攻撃型"],
["FAIRY","フェアリー","精霊","光",2,"FAIRY_POWDER",95,50,42,88,"速度型"],
["FLAME","フレイム","精霊","火",1,"FIRE_PLAY",72,54,28,60,"攻撃型"],
["AQUA_SPIRIT","アクア","精霊","水",1,"WATER_MAGIC",86,42,44,52,"防御型"],
["BOLT_SPIRIT","ボルト","精霊","雷",1,"BOLT_STRIKE",68,48,26,78,"速度型"],
["LEAF_SPIRIT","リーフ","精霊","自然",1,"FLOWER_SWORD",90,40,48,54,"防御型"],
["SHADOW_SPIRIT","シャドウ","精霊","闇",1,"GHOST_ATTACK",70,52,28,72,"速度型"],
["KOKOPI","ココピ","獣","無",1,"STORE_SP",80,40,40,55,"速度型"],
["KOKKORU","コッコル","獣","火",2,"CHICKEN_SCREAM",125,72,50,62,"攻撃型"],
["COCKATRICE","コカトリス","獣","火",4,"COCKA_ROAR",240,130,95,80,"攻撃型"],
["HORN_RABBIT","ホーンラビット","獣","無",1,"PIERCE",78,50,30,76,"速度型"],
["RAT","ラット","獣","無",1,"BITE",66,42,27,84,"速度型"],
["SPIDER","スパイダー","植物","闇",1,"PIERCE",88,52,40,58,"攻撃型"],
["VAMPEEL","ヴァンピール","アンデッド","闇",2,"BLOOD_CRAVING",115,68,42,82,"速度型"],
["VAMPIRE","ヴァンパイア","アンデッド","闇",3,"BLOOD_DRAIN",185,112,68,92,"攻撃型"]
];
const monsterDB=Object.fromEntries(M.map(x=>[x[0],{id:x[0],name:x[1],race:x[2],attribute:x[3],baseStar:x[4],solid:x[5],hp:x[6],atk:x[7],def:x[8],spd:x[9],growth:x[10],expGrowth:x[11]||'通常型',expMultiplier:x[12]||1}]));
const monsterDexNo={"SLIME_BLUE":1,"SLIME_RED":2,"SLIME_YELLOW":3,"SLIME_GREEN":4,"MINIC":5,"MIMIC":6,"STONE":7,"MANDRAGORA":8,"SEED":9,"FLOWER_MAN":10,"WOLF":11,"HIGH_WOLF":12,"BEAR":13,"KOKOPI":14,"KOKKORU":15,"COCKATRICE":16,"GOBLIN":17,"HIGH_GOBLIN":18,"KOBOLD":19,"ORC":20,"HIGH_ORC":21,"THIEF":22,"DEMON_KID":23,"MINI_FAIRY":24,"FAIRY":25,"LIZARD_KID":26,"LIZARD":27,"HIGH_LIZARD":28,"CRYSTAL":29,"IRON":30,"GOLEM":31,"SPIDER":32,"BAT":33,"BLOOD_BAT":34,"HORN_RABBIT":35,"RAT":36,"FOX":37,"WILD_BOAR":38,"WITCH":39,"SHAMAN":40,"ZOMBIE":41,"SKELETON":42,"GHOST":43,"VAMPEEL":44,"VAMPIRE":45,"MINI_DEMON":46,"DEMON":47,"IMP":48,"GARGOYLE":49,"HELL_HOUND":50,"FLAME":51,"AQUA_SPIRIT":52,"BOLT_SPIRIT":53,"LEAF_SPIRIT":54,"SHADOW_SPIRIT":55};
const RARE_ENCOUNTER_MONSTERS={1:'KOKOPI',2:'VAMPEEL'};
// レア表示は出現枠とは独立して、モンスターごとに定義する。
const RARE_MONSTER_IDS=new Set(['KOKOPI','KOKKORU','COCKATRICE','VAMPEEL','VAMPIRE']);

function dexNo(id){return monsterDexNo[id]??9999}
function starDisplay(monster,mode='full'){
  const id=typeof monster==='string'?monster:monster?.id;
  const star=typeof monster==='object'?(monster.star??monster.baseStar):monsterDB[id]?.baseStar;
  const count=Math.max(0,star||0);
  const text=mode==='symbol'
    ?'★'
    :mode==='compact'
      ?`<span class="star-mark">★</span><span class="star-count">${count}</span>`
      :count===5
        ?'<span class="star-five-top">★★★</span><span class="star-five-bottom">★★</span>'
        :'★'.repeat(count);
  return `<span class="star-display ${mode==='compact'?'star-compact':'star-full'}${count===5&&mode==='full'?' star-five':''}${RARE_MONSTER_IDS.has(id)?' rare-star':''}">${text}</span>`;
}
function sortedMonsterEntries(){
  return Object.entries(monsterDB).sort((a,b)=>dexNo(a[0])-dexNo(b[0]));
}
const normalTables={"物質":["SLIME_BLUE","SLIME_RED","SLIME_YELLOW","SLIME_GREEN","MINIC","STONE"],"獣":["WOLF","BAT","BEAR","HORN_RABBIT","RAT"],"亜人":["GOBLIN","KOBOLD","ORC","WITCH","THIEF"],"悪魔":["DEMON_KID","MINI_DEMON","IMP"],"龍":["LIZARD_KID"],"植物":["MANDRAGORA","SEED","FLOWER_MAN","SPIDER"],"アンデッド":["ZOMBIE","SKELETON","GHOST"],"精霊":["MINI_FAIRY","FLAME","AQUA_SPIRIT","BOLT_SPIRIT","LEAF_SPIRIT","SHADOW_SPIRIT"]};
const STARTING_GRASSLAND_POOL=[
  'SLIME_BLUE','SLIME_RED','SLIME_YELLOW','SLIME_GREEN',
  'MINIC','STONE','MANDRAGORA','SEED','FLOWER_MAN',
  'GOBLIN','KOBOLD','WOLF','BEAR','THIEF','DEMON_KID',
  'MINI_FAIRY','LIZARD_KID'
];
const BEAST_CAVE_EARLY_POOL=[
  'MINIC','STONE','BAT','HORN_RABBIT','RAT','WITCH',
  'MINI_DEMON','SPIDER','ZOMBIE','SKELETON','GHOST','FLAME'
];
const BEAST_CAVE_LATE_POOL=[
  ...BEAST_CAVE_EARLY_POOL,'CRYSTAL','IRON','BLOOD_BAT'
];
const special={
  ['GOBLIN|KOBOLD']:'HIGH_GOBLIN',
  ['KOBOLD|ORC']:'HIGH_ORC',
  ['KOKOPI|KOKOPI']:'KOKKORU',
  ['KOKKORU|KOKKORU']:'COCKATRICE',
  ['DEMON_KID|MINI_DEMON']:'DEMON',
  ['BLOOD_BAT|VAMPEEL']:'VAMPIRE',
  ['FLAME|LIZARD_KID']:'LIZARD',
  ['MINI_FAIRY|MINI_FAIRY']:'FAIRY',
  ['IRON|STONE']:'GOLEM'
};
const FUSION_GENERATED_SKILLS_BY_MONSTER={COCKATRICE:['STONE_GAZE']};
const STAT_GROWTH_BASE={hp:10,atk:5,def:3,spd:2};
const STAT_GROWTH_TYPES={
  攻撃型:{hp:.9,atk:1.2,def:.7,spd:1},
  防御型:{hp:1.2,atk:.8,def:1.3,spd:.5},
  速度型:{hp:.9,atk:.8,def:.7,spd:2}
};
const DIFFICULTIES={
  normal:{name:'ノーマル',levelBonus:0,rareRate:.01,recruitRate:.05,bossRecruitRate:.025},
  hard:{name:'ハード',levelBonus:20,rareRate:.02,recruitRate:.075,bossRecruitRate:.05},
  veryHard:{name:'ベリーハード',levelBonus:50,rareRate:.03,recruitRate:.10,bossRecruitRate:.075}
};
const DUNGEON_PROGRESS_KEY='hissoriRpgDungeonProgressV1';
const MONSTER_DEFEAT_COUNTS_KEY='hissoriRpgMonsterDefeatCountsV1';
const GAME_SAVE_KEY='hissoriRpgSaveV1';
const GAME_SAVE_VERSION=4;
const GACHA_TICKET_DROP_RATE=.01;
const GACHA_APPEARANCE_TICKET_RATE=.5;
const APPEARANCE_CHANGE_MONSTER_IDS=new Set(['VAMPIRE','COCKATRICE']);
// 配布時に normal / development へ固定する。selector は共通開発元用。
const BUILD_MODE='normal';
function defaultDungeonProgress(){return{1:{normal:0,hard:0,veryHard:0},2:{normal:0,hard:0,veryHard:0}}}
function loadDungeonProgress(){
  const base=defaultDungeonProgress();
  try{
    const saved=JSON.parse(localStorage.getItem(DUNGEON_PROGRESS_KEY)||'{}');
    for(const id of [1,2])for(const difficulty of Object.keys(DIFFICULTIES)){
      base[id][difficulty]=Math.max(0,Number(saved?.[id]?.[difficulty])||0);
    }
  }catch{}
  return base;
}
function saveDungeonProgress(){
  try{localStorage.setItem(DUNGEON_PROGRESS_KEY,JSON.stringify(state.dungeonProgress))}catch{}
}
function loadMonsterDefeatCounts(){
  try{
    const saved=JSON.parse(localStorage.getItem(MONSTER_DEFEAT_COUNTS_KEY)||'{}');
    return Object.fromEntries(Object.entries(saved).map(([id,count])=>[id,Math.max(0,Number(count)||0)]));
  }catch{return{}}
}
function saveMonsterDefeatCounts(){
  try{localStorage.setItem(MONSTER_DEFEAT_COUNTS_KEY,JSON.stringify(state.monsterDefeatCounts))}catch{}
}
function difficultyUnlocked(dungeonId,difficulty){
  if(difficulty==='normal')return true;
  if(difficulty==='hard')return (state.dungeonProgress[dungeonId]?.normal||0)>=20;
  return (state.dungeonProgress[dungeonId]?.hard||0)>=30;
}
function difficultyConfig(){return DIFFICULTIES[state.difficulty]||DIFFICULTIES.normal}
function expGrowthMultiplier(type,level){
  if(type==='早熟型')return .8+.4*(Math.max(1,Math.min(99,level))-1)/98;
  if(type==='晩成型')return 1.2-.4*(Math.max(1,Math.min(99,level))-1)/98;
  return 1;
}
function requiredExp(level,type='通常型'){
  const lv=Math.max(1,Math.min(99,level));
  return Math.round((50+30*lv+23*lv*lv)*expGrowthMultiplier(type,lv));
}
function growthAtLevel(base,level){
  const gain=Math.max(0,level-1),rates=STAT_GROWTH_TYPES[base.growth]||STAT_GROWTH_TYPES.攻撃型;
  return{
    maxHp:base.hp+Math.round(STAT_GROWTH_BASE.hp*rates.hp*gain),
    atk:base.atk+Math.round(STAT_GROWTH_BASE.atk*rates.atk*gain),
    def:base.def+Math.round(STAT_GROWTH_BASE.def*rates.def*gain),
    spd:base.spd+Math.round(STAT_GROWTH_BASE.spd*rates.spd*gain)
  };
}
function growthDelta(base,fromLevel,toLevel){
  const from=growthAtLevel(base,fromLevel),to=growthAtLevel(base,toLevel);
  return{maxHp:to.maxHp-from.maxHp,atk:to.atk-from.atk,def:to.def-from.def,spd:to.spd-from.spd};
}
const app=document.getElementById('app'),skipBtn=document.getElementById('skipBtn'),retireBtn=document.getElementById('retireBtn'),backBtn=document.getElementById('backBtn'),homeBtn=document.getElementById('homeBtn'),headerActions=document.getElementById('headerActions');
const state={screen:'modeSelect',mode:null,gachaTickets:0,appearanceTickets:0,unlockedAppearances:new Set(),point:0,enemyPoint:0,nextSpBonus:0,battleType:'normal',turn:1,isProcessing:false,skip:false,selectedAlly:0,selectedEnemy:0,pending:null,queue:[null,null,null],floor:0,dungeon:null,difficulty:'normal',dungeonProgress:loadDungeonProgress(),monsterDefeatCounts:loadMonsterDefeatCounts(),clearRecorded:false,bossEnemyIndices:new Set(),soloBossBattle:false,recruits:new Set(),floorResult:null,restRecoveryUsed:false,battleLogs:[],monsterSort:'acquired',monsterSortDir:'asc',partyEditSlot:null,bulkPartySelection:[],detailFrom:'list',fusionParents:[],fusionChoices:[],fusionSelected:null,inheritChoices:[],inheritSelected:[],fusionResult:null,fusionLocked:false,owned:[],discovered:new Set(),party:[],dungeonStartSnapshot:null,lastSavedAt:null,saveLoadError:null,saveBlocked:false};
function makeOwned(id,level=1,_star=null,skills2=null){const b=monsterDB[id],lv=Math.max(1,level),stats=growthAtLevel(b,lv);return{uid:crypto.randomUUID?.()||Math.random().toString(36),...b,star:b.baseStar,plusValue:0,appearance:'default',level:lv,exp:0,nextExp:requiredExp(lv,b.expGrowth),maxHp:stats.maxHp,hp:stats.maxHp,atk:stats.atk,def:stats.def,spd:stats.spd,skills:skills2??defaultSkills(b),buffAtk:1,buffDef:1,buffAtkTurns:0,buffDefTurns:0}}
function defaultSkills(b){const prefix={火:'FIRE',水:'WATER',雷:'THUNDER',自然:'NATURE',闇:'DARK',光:'LIGHT',無:'NEUTRAL'}[b.attribute];const own=`${prefix}_1`;return['NORMAL',own,'LIGHT_1',b.solid].filter((id,i,a)=>skills[id]&&a.indexOf(id)===i)}
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
    skills:[...(monster.skills||[])],
    hp:monster.hp
  };
}
function buildSaveData(){
  return{
    version:GAME_SAVE_VERSION,
    savedAt:new Date().toISOString(),
    mode:state.mode,
    gachaTickets:state.gachaTickets,
    appearanceTickets:state.appearanceTickets,
    unlockedAppearances:[...state.unlockedAppearances],
    owned:state.owned.map(persistentMonster),
    party:[...state.party],
    discovered:[...state.discovered],
    dungeonProgress:structuredCloneSafe(state.dungeonProgress),
    monsterDefeatCounts:{...state.monsterDefeatCounts}
  };
}
function structuredCloneSafe(value){
  return JSON.parse(JSON.stringify(value));
}
function normalizeDungeonProgress(value){
  const normalized=defaultDungeonProgress();
  for(const id of [1,2])for(const difficulty of Object.keys(DIFFICULTIES)){
    normalized[id][difficulty]=Math.max(0,Math.floor(Number(value?.[id]?.[difficulty])||0));
  }
  return normalized;
}
function restoreOwnedMonster(raw,usedUids){
  if(!raw||!monsterDB[raw.id])return null;
  const level=Math.round(clampNumber(raw.level,1,100,1));
  const validSkills=Array.isArray(raw.skills)
    ?[...new Set(raw.skills.filter(id=>skills[id]))].slice(0,4)
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
  monster.nextExp=requiredExp(monster.level,monster.expGrowth);
  monster.appearance=raw.appearance==='alternate'&&APPEARANCE_CHANGE_MONSTER_IDS.has(monster.id)?'alternate':'default';
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
  state.monsterDefeatCounts=Object.fromEntries(
    Object.entries(raw.monsterDefeatCounts||{})
      .filter(([id])=>monsterDB[id])
      .map(([id,count])=>[id,Math.max(0,Math.floor(Number(count)||0))])
  );
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
    localStorage.setItem(GAME_SAVE_KEY,JSON.stringify(data));
    state.lastSavedAt=data.savedAt;
    state.saveLoadError=null;
    state.saveBlocked=false;
    return true;
  }catch(error){
    state.saveLoadError=`保存できませんでした：${error.message||error}`;
    return false;
  }
}
function loadGame(){
  const text=localStorage.getItem(GAME_SAVE_KEY);
  if(!text)return false;
  try{
    applySaveData(JSON.parse(text));
    return true;
  }catch(error){
    state.saveLoadError=`セーブデータを読み込めませんでした：${error.message||error}`;
    state.saveBlocked=true;
    return false;
  }
}
function restoreDungeonStartSnapshot(){
  if(!state.dungeonStartSnapshot)return;
  const snapshot=state.dungeonStartSnapshot;
  state.dungeonStartSnapshot=null;
  applySaveData(snapshot);
  saveGame({force:true});
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
  VAMPIRE:'vampire.png'
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
  else if(state.screen==='dungeons')handler=()=>home();
  else if(state.screen==='dungeonConfirm')handler=()=>showDungeons();
  else if(state.screen==='book')handler=()=>home();
  else if(state.screen==='bookDetail')handler=()=>showBook();
  else if(state.screen==='gacha')handler=()=>home();
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
    <div class="save-warning">モードはセーブデータごとに固定されます。変更する場合はデータ管理からセーブを削除してください。</div>
  </div>`;
  updateHeader();
}
function selectGameMode(mode){
  if(mode!=='normal'&&mode!=='development')return;
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
state.screen='home';state.fusionLocked=false;saveGame();app.innerHTML=`<div class="card"><div class="title">ホーム</div><div class="muted">${state.mode==='development'?'開発用':'通常プレイ'}</div>${state.saveLoadError?`<div class="save-warning">${state.saveLoadError}</div>`:''}</div><div class="grid menu"><button onclick="showDungeons()">ダンジョン</button><button onclick="showMonsters()">モンスター</button><button onclick="showFusion()">配合</button><button onclick="showBook()">図鑑</button><button onclick="showGacha()">ガチャ<small>チケット ${state.gachaTickets}枚</small></button><button onclick="showDataManagement()">データ管理</button></div><div class="card"><div class="title">現在のパーティ</div>${party().map(x=>`<div class="listitem artwork-list-row">${monsterArtwork(x,'small')}<div><b>${x.name}</b> Lv${x.level} ${starDisplay(x)} ＋${x.plusValue||0}<div class="muted">HP${x.maxHp} 攻${x.atk} 防${x.def} 速${x.spd}</div></div></div>`).join('')}</div>`;updateHeader()}
function showGacha(message='',won=false){
  state.screen='gacha';
  state.fusionLocked=false;
  app.innerHTML=`<div class="card gacha-card">
    <div class="title">ガチャ</div>
    <div class="gacha-ticket-count">ガチャチケット <b>${state.gachaTickets}枚</b></div>
    <div class="muted">1回につきガチャチケットを1枚使用します。</div>
    <div class="gacha-rate">
      <div><b>5%</b><span>見た目変更チケット ×1</span></div>
      <div><b>95%</b><span>はずれ（何もなし）</span></div>
    </div>
    ${message?`<div class="gacha-result ${won?'win':'miss'}">${message}</div>`:''}
    <button class="wide btn-next" onclick="drawGacha()" ${state.gachaTickets<1?'disabled':''}>1回引く</button>
    <div class="appearance-ticket-count">見た目変更チケット：<b>${state.appearanceTickets}枚</b></div>
    <div class="muted">図鑑のヴァンパイアまたはコカトリスに使用できます。</div>
    ${state.mode==='development'?'<button class="wide dev-action" onclick="developerAddGachaTickets()">開発用：ガチャチケットを10枚追加</button>':''}
  </div>`;
  updateHeader();
}
function drawGacha(){
  if(state.gachaTickets<1)return;
  state.gachaTickets--;
  const won=Math.random()<GACHA_APPEARANCE_TICKET_RATE;
  if(won)state.appearanceTickets++;
  saveGame({force:true});
  showGacha(won?'見た目変更チケット ×1 を入手！':'はずれ。何も出ませんでした。',won);
}
function developerAddGachaTickets(){
  if(state.mode!=='development')return;
  state.gachaTickets+=10;
  saveGame({force:true});
  showGacha('開発用ガチャチケットを10枚追加しました。');
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
  </div>`;
  updateHeader();
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
  localStorage.removeItem(DUNGEON_PROGRESS_KEY);
  localStorage.removeItem(MONSTER_DEFEAT_COUNTS_KEY);
  location.reload();
}
function dungeonInfo(id){
  return id===1
    ?{id:1,name:'始まりの草原',max:10,restFloor:5,description:'1～4層・6～9層 戦闘 / 5層 休息 / 10層 ボス'}
    :{id:2,name:'獣の洞窟',max:10,restFloor:5,description:'1～4層・6～9層 戦闘 / 5層 休息 / 10層 ボス'};
}
function showDungeons(){
  state.screen='dungeons';
  state.fusionLocked=false;
  app.innerHTML=`<div class="card"><div class="title">ダンジョン</div>
    ${[1,2].map(id=>{const d=dungeonInfo(id),p=state.dungeonProgress[id];return`<div class="listitem choice" onclick="confirmDungeonEntry(${id})"><b>${d.name}</b>　全${d.max}層<div class="difficulty-counts">ノーマル ${p.normal}回　／　ハード ${p.hard}回　／　ベリーハード ${p.veryHard}回</div></div>`}).join('')}
  </div>`;
  updateHeader();
}
function confirmDungeonEntry(id){
  const d=dungeonInfo(id);
  state.screen='dungeonConfirm';
  const p=state.dungeonProgress[id];
  app.innerHTML=`<div class="card result">
    <div class="title">${d.name}</div>
    <p><b>難易度を選択してください</b></p>
    <div class="muted">全${d.max}層</div>
    <div class="difficulty-list">
      ${Object.entries(DIFFICULTIES).map(([key,cfg])=>{
        const unlocked=difficultyUnlocked(id,key);
        const condition=key==='hard'
          ?`ノーマルを20回クリアで解放（${p.normal}/20）`
          :key==='veryHard'
            ?`ハードを30回クリアで解放（${p.hard}/30）`
            :'最初から選択可能';
        return`<button class="difficulty-btn ${unlocked?'':'locked'}" onclick="startDungeon(${id},'${key}')" ${unlocked?'':'disabled'}><b>${cfg.name}</b><small>${condition}</small></button>`;
      }).join('')}
      <button class="btn-cancel" onclick="showDungeons()">戻る</button>
    </div>
  </div>`;
  updateHeader();
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
      <button class="btn-next change-btn" onclick="showSinglePartyChange(${i})">変更</button>
    </div>`).join('')}
    <button class="wide btn-next" onclick="showBulkPartySelection()">一括編成</button>
    
  </div>`;
  updateHeader();
}
function showSinglePartyChange(slot){
  state.screen='singlePartyChange';
  state.partyEditSlot=slot;
  const currentUid=state.party[slot];
  app.innerHTML=`<div class="card">
    <div class="title">${slot+1}体目を変更</div>
    <div class="muted">交代するモンスターを選んでください。</div>
    ${state.owned.filter(x=>x.uid!==currentUid&&!state.party.includes(x.uid)).map(x=>`
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
    ${state.owned.map(x=>{
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
    storeSp:'補助',
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
  if(skill.fearChance)texts.push(`使用者よりレベルの低い相手に${Math.round(skill.fearChance*100)}%で恐怖を付与（1ターン行動不能／同レベル以上・中ボス・ボス無効）`);
  if(skill.petrify)texts.push('石化を付与（基礎85%／格上-85%／中ボス・ボス-80%／格下+30%）');
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
  monster.nextExp=requiredExp(monster.level,monster.expGrowth);
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
  const eligible=state.owned.filter(x=>x.level>=20);
  app.innerHTML=`<div class="card"><div class="title">配合</div>
  <div class="muted">Lv20以上の2体を選び、「配合開始」を押してください。</div>
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
  for(const race of new Set(p.map(x=>x.race)))ids.push(...sample(normalTables[race]||[],2));
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
  return Math.min(20,Math.max(parentA.plusValue||0,parentB.plusValue||0)+1);
}
function fusionStatBonus(plusValue){
  return {hp:plusValue*5,atk:plusValue*2,def:plusValue*2,spd:plusValue};
}
function completeFusion(id){
  if(!state.fusionLocked)return;

  const parents=state.fusionParents.map(uid=>state.owned.find(x=>x.uid===uid));
  const inherited=[...state.inheritSelected];
  const generated=fusionGeneratedSkillIds(id);

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
  state.fusionResult=null;
  home();
}
const NON_NORMAL_ENCOUNTER_IDS=new Set(['KOKOPI','KOKKORU','COCKATRICE']);
function dungeonEnemyPool(star){return M.filter(x=>x[4]===star&&!NON_NORMAL_ENCOUNTER_IDS.has(x[0])).map(x=>x[0])}
async function startDungeon(n,difficulty='normal'){
  if(!difficultyUnlocked(n,difficulty))return;
  saveGame({force:true});
  state.dungeonStartSnapshot=buildSaveData();
  state.dungeon=dungeonInfo(n);
  state.difficulty=DIFFICULTIES[difficulty]?difficulty:'normal';
  state.floor=1;
  state.recruits=new Set();
  state.floorResult=null;
  state.restRecoveryUsed=false;
  state.clearRecorded=false;
  state.battleLogs=[];
  state.point=0;
  state.enemyPoint=0;
  party().forEach(x=>{x.hp=x.maxHp;x.buffAtk=1;x.buffDef=1});
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
    <div class="muted">ここまでに獲得した経験値と仲間候補を保持しています。</div>
    <div class="listitem">${recoveryText}</div>
    <button class="wide" onclick="recoverAtRest()" ${state.restRecoveryUsed?'disabled':''}>回復する</button>
    <button class="wide btn-next" onclick="continueFromRest()">先へ進む</button>
    <button class="wide btn-cancel" onclick="returnFromRest()">帰還する</button>
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
    monster.petrified=false;
    monster.petrifyTurns=0;
  }
  state.restRecoveryUsed=true;
  showRestFloor();
}
async function continueFromRest(){
  if(state.floor>=state.dungeon.max)return;
  state.floor++;
  enterCurrentFloor();
}
function returnFromRest(){
  showRecruit(false);
}
function enemyIdsForFloor(){
  const d=state.dungeon,f=state.floor;
  state.battleType='normal';
  state.bossEnemyIndices=new Set();
  if(f===d.max){
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
    state.bossEnemyIndices.add(0);
    return [sample(dungeonEnemyPool(3),1)[0]];
  }
  const count=1+Math.floor(Math.random()*3);
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
  const stars=f<=5?[1]:[1,2],ids=[];
  for(let i=0;i<count;i++){
    const star=stars[Math.floor(Math.random()*stars.length)];
    ids.push(sample(dungeonEnemyPool(star),1)[0]);
  }
  return ids;
}
function enemyLevelForFloor(){
  let baseLevel;
  if(state.dungeon?.id!==1)baseLevel=state.floor;
  else if(state.floor<=4)baseLevel=Math.ceil(state.floor/2);
  else baseLevel=Math.ceil((state.floor-1)/2);
  return Math.min(100,baseLevel+difficultyConfig().levelBonus);
}
function enemyExperience(base,level,isBoss,soloBoss){
  const levelExp=10+5*level+.5*level*level;
  const starRate=1+.1*((base.baseStar||1)-1);
  const bossRate=soloBoss?3:isBoss?1.5:1;
  return Math.max(1,Math.round(levelExp*starRate*bossRate*(base.expMultiplier||1)));
}
function enemyUnit(id,index){
  const b=monsterDB[id],level=enemyLevelForFloor();
  const levelStats=growthAtLevel(b,level);
  const rate=state.dungeon?.id===1&&state.difficulty==='normal' ? 0.9 : 1;
  const scaled=n=>Math.max(1,Math.round(n*rate));
  const isBoss=state.bossEnemyIndices.has(index);
  const soloBoss=isBoss&&state.soloBossBattle;
  const hp=scaled(levelStats.maxHp)*(soloBoss?3:isBoss?2:1);
  const statRate=soloBoss?1.5:1;
  return{...b,hp,maxHp:hp,atk:Math.round(scaled(levelStats.atk)*statRate),def:Math.round(scaled(levelStats.def)*statRate),spd:Math.round(scaled(levelStats.spd)*statRate),level,isBoss,isMidBoss:false,actionsPerTurn:soloBoss?2:1,fearTurns:0,petrified:false,petrifyTurns:0,exp:enemyExperience(b,level,isBoss,soloBoss),buffDef:1};
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
  enemyIds.forEach(id=>state.discovered.add(id));
  state.soloBossBattle=enemyIds.length===1&&state.bossEnemyIndices.size===1;
  state.enemies=enemyIds.map((id,index)=>enemyUnit(id,index));
  party().forEach(x=>{x.buffAtk=1;x.buffDef=1;x.fearTurns=0;x.petrified=false;x.petrifyTurns=0});
  renderBattle();
  updateHeader();
}
function hpRate(x){return Math.max(0,x.hp/x.maxHp)}function eclass(x){return hpRate(x)<=.2?'danger':hpRate(x)<=.4?'warn':''}
function gauge(){return Array.from({length:9},(_,i)=>`<div class="cell ${i<state.point?'on':''}"></div>`).join('')}
function renderBattle(){const allies=party();app.innerHTML=`<div class="status"><span>FLOOR ${state.floor}/${state.dungeon.max}　TURN ${state.turn}</span><span>${state.point}/9SP</span></div><div class="gauge">${gauge()}</div><div class="card"><div class="unitrow">${state.enemies.map((e,i)=>`<div class="unit ${state.pending?.side==='enemy'&&i===state.selectedEnemy?'target':''} ${e.hp<=0?'dead':''}" onclick="selectEnemy(${i})"><div class="orb" style="background:${color(e.attribute)}"></div><div class="name ename ${eclass(e)}">${e.name}</div><div class="sub">${e.hp<=0?'撃破':''}</div></div>`).join('')}</div></div><div id="log" class="log">${state.battleLogs.join('<br>')}</div><div class="card"><div class="unitrow">${allies.map((a,i)=>`<div class="unit ${i===state.selectedAlly?'sel':''} ${a.hp<=0?'dead':''}" onclick="selectAlly(${i})"><div class="orb" style="background:${color(a.attribute)}"></div><div class="name">${a.name}</div><div class="hp"><span style="width:${hpRate(a)*100}%"></span></div><div class="sub">${a.hp}/${a.maxHp}</div><div class="action">${state.queue[i]?.name||'待機中'}</div></div>`).join('')}</div></div><div class="card"><div class="muted">${state.pending?(state.pending.side==='enemy'?'対象の敵を選択':'対象の味方を選択'):'行動を選択'}</div><div class="grid commands">${allies[state.selectedAlly].skills.filter(id=>skills[id]&&skills[id].active!==false&&skills[id].type!=='passive').map(id=>{const s=skills[id];return`<button onclick="chooseSkill('${id}')">${s.name}<small>${s.cost}SP / ${targetLabel(s.target)}</small></button>`}).join('')}</div><button class="wide btn-next" onclick="executeTurn()">選択完了</button></div>`;updateHeader();const l=document.getElementById('log');if(l)l.scrollTop=l.scrollHeight}
function confirmRetire(){
  if(state.isProcessing)return;
  state.screen='retireConfirm';
  app.innerHTML=`<div class="card result">
    <div class="title">リタイア確認</div>
    <p>ダンジョンからリタイアしますか？</p>
    <div class="muted">リタイアすると敗北扱いになり、今回の仲間候補を失います。</div>
    <div class="choice-stack">
      <button class="btn-next" onclick="retireDungeon()">リタイアする</button>
      <button class="btn-cancel" onclick="returnToBattle()">戦闘へ戻る</button>
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
  if(state.pending&&state.pending.side==='enemy'){
    const s=skills[state.pending.skillId],a=state.pending.actor;
    state.queue[a]={skillId:s.id,name:s.name,cost:s.cost,target:i};
    state.pending=null;
    nextActor();
  }
  renderBattle();
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
function dmg(a,d,s){
  const attackPassive=passiveAttackMultiplier(a,s.attribute);
  const defensePassive=passiveDamageTakenMultiplier(d);
  const multiplier=s.randomMultiplier
    ?s.randomMultiplier[Math.floor(Math.random()*s.randomMultiplier.length)]
    :(s.multiplier??1);
  if(multiplier===0)return 0;
  return Math.max(1,Math.round(a.atk*(a.buffAtk||1)*multiplier*attackPassive*adv(a.attribute,s.attribute,d.attribute)*100/(100+d.def*(d.buffDef||1))*defensePassive))
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
  }else if(s.type==='buffAtk'){
    party().forEach(x=>x.buffAtk=s.multiplier);
    log('味方全体の攻撃力アップ');
    await wait(DELAY);
  }else if(s.type==='buffDef'){
    const target=party()[q.target]||party().find(x=>x.hp>0);
    if(target){
      target.buffDef=s.multiplier;
      log(`${target.name}の防御力アップ`);
    }
    await wait(DELAY);
  }
}
async function enemyAct(e){
  const solidSkill=skills[e.solid];
  const usable=solidSkill&&solidSkill.active!==false&&solidSkill.type!=='passive'&&solidSkill.type!=='storeSp';
  let s=usable&&state.enemyPoint>=solidSkill.cost?solidSkill:skills.NORMAL;
  if(s!==skills.NORMAL)state.enemyPoint-=s.cost;

  if(s.type==='heal'){
    const living=state.enemies.filter(x=>x.hp>0);
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
  const targets=s.target==='enemyAll'
    ?alive.map(z=>z.x)
    :[alive[Math.floor(Math.random()*alive.length)].x];

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
async function executeTurn(){if(state.isProcessing)return;if(state.pending){state.queue[state.pending.actor]=null;state.pending=null}state.isProcessing=true;state.skip=false;updateHeader();const allies=party();resetAttackTracking();allies.forEach((a,i)=>{if(a.hp>0&&!state.queue[i])state.queue[i]={skillId:'NORMAL',name:'通常攻撃',cost:0,target:state.selectedEnemy}});state.point-=reserved();const acts=[];allies.forEach((a,i)=>{if(a.hp>0)acts.push({side:'a',i,spd:a.spd+Math.random()*.001})});state.enemies.forEach((e,i)=>{if(e.hp>0)for(let action=0;action<(e.actionsPerTurn||1);action++)acts.push({side:'e',i,spd:e.spd+Math.random()*.001})});acts.sort((x,y)=>y.spd-x.spd);log(`<b>ターン${state.turn}</b>`);for(const x of acts){if(x.side==='a'){if(allies[x.i].hp>0)await allyAct(allies[x.i],state.queue[x.i])}else if(state.enemies[x.i].hp>0)await enemyAct(state.enemies[x.i]);if(state.enemies.every(e=>e.hp<=0)||allies.every(a=>a.hp<=0))break}applyNoAttackDeaths();skipBtn.disabled=true;if(state.enemies.every(e=>e.hp<=0)){await winFloor();return}if(allies.every(a=>a.hp<=0)){
  log('<b>敗北……</b>');
  state.isProcessing=false;
  showDefeat();
  return
}processPetrifyRecovery();state.turn++;const skillUsers=state.queue.filter(q=>q?.used&&(q.cost||0)>0).length;
const gainedPoints=Math.max(0,3-skillUsers)+state.nextSpBonus;
state.nextSpBonus=0;
state.point=Math.min(9,state.point+gainedPoints);
if(gainedPoints>0)log(`${gainedPoints}SP獲得`);
state.enemyPoint=Math.min(9,state.enemyPoint+2);state.queue=[null,null,null];state.selectedAlly=allies.findIndex(a=>a.hp>0);state.selectedEnemy=state.enemies.findIndex(e=>e.hp>0);state.isProcessing=false;renderBattle();updateHeader()}
function rollBattleDrops(){
  const drops=[];
  if(Math.random()<GACHA_TICKET_DROP_RATE){
    state.gachaTickets++;
    drops.push('ガチャチケット ×1');
  }
  return drops;
}
async function winFloor(){
  for(const enemy of state.enemies){
    state.monsterDefeatCounts[enemy.id]=(state.monsterDefeatCounts[enemy.id]||0)+1;
  }
  saveMonsterDefeatCounts();
  const gainedExp=state.enemies.reduce((sum,e)=>sum+e.exp,0);
  const memberResults=[];
  for(const member of party()){
    const before={level:member.level,exp:member.exp||0,nextExp:member.nextExp||1,maxHp:member.maxHp,atk:member.atk,def:member.def,spd:member.spd};
    const levelUps=[];
    if(member.hp>0){
      member.exp+=gainedExp;
      while(member.exp>=member.nextExp&&member.level<100){
      member.exp-=member.nextExp;
        const increase=growthDelta(monsterDB[member.id],member.level,member.level+1);
        member.level++;
        levelUps.push(member.level);
        member.maxHp+=increase.maxHp;
        member.atk+=increase.atk;
        member.def+=increase.def;
        member.spd+=increase.spd;
        member.nextExp=requiredExp(member.level,member.expGrowth);
      }
    }
    memberResults.push({
      uid:member.uid,name:member.name,
      beforeLevel:before.level,beforeExp:before.exp,beforeNextExp:before.nextExp,
      afterLevel:member.level,afterExp:member.exp||0,afterNextExp:member.nextExp||1,
      gained:member.hp>0?gainedExp:0,levelUps,statGains:{maxHp:member.maxHp-before.maxHp,atk:member.atk-before.atk,def:member.def-before.def,spd:member.spd-before.spd}
    });
  }

  const newCandidates=[];
  const rates=difficultyConfig();
  for(const enemy of state.enemies){
    const recruitChance=enemy.isBoss ? rates.bossRecruitRate : rates.recruitRate;
    if(Math.random()<recruitChance){
      if(!state.recruits.has(enemy.id))newCandidates.push(enemy.id);
      state.recruits.add(enemy.id);
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
    ${r.newCandidates.length?`<div class="result-section"><b>仲間候補</b><div>${r.newCandidates.map(id=>`${monsterDB[id].name}が仲間候補になった！`).join('<br>')}</div></div>`:''}
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
  state.recruits=new Set();
  state.floor=0;
  state.dungeon=null;
  state.enemies=[];
  state.queue=[null,null,null];
  state.pending=null;
  state.skip=false;

  app.innerHTML=`<div class="card result">
    <div class="title">敗北……</div>
    <div class="muted">${retired?'リタイアしました。敗北扱いになります。':'ダンジョン攻略に失敗しました。'}</div>
    <p>今回の仲間候補は失われます。</p>
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
  const ids=[...state.recruits];
  app.innerHTML=`<div class="card result"><div class="title">${cleared?'ダンジョンクリア！':'途中帰還'}</div>
  <div class="muted">${cleared?`${difficultyConfig().name}をクリアしました（累計${state.dungeonProgress[state.dungeon.id][state.difficulty]}回）。`:'ボス撃破・ダンジョンクリアにはカウントされません。'}</div>
  <div class="muted">${ids.length?'仲間候補から1体選択してください。':'今回は仲間候補なし'}</div>
  ${ids.length?`<div class="candidate-grid">${ids.map(id=>`<button class="artwork-candidate" onclick="takeRecruit('${id}')">${monsterArtwork(id,'medium')}<span>${monsterDB[id].name}</span></button>`).join('')}</div>`:'<button class="wide" onclick="home()">ホームへ戻る</button>'}
  </div>`;
  homeBtn.style.display=ids.length?'none':'inline-block';
  skipBtn.style.display='none';
}
function takeRecruit(id){state.owned.push(makeOwned(id,1));state.discovered.add(id);saveGame({force:true});alert(`${monsterDB[id].name}が仲間になった！`);home()}
skipBtn.onclick=()=>{state.skip=true;skipBtn.disabled=true};homeBtn.onclick=()=>{if(!state.fusionLocked&&state.screen!=='battle')home()};window.home=home;window.showDungeons=showDungeons;window.showMonsters=showMonsters;window.showFusion=showFusion;window.showBook=showBook;window.showBookDetail=showBookDetail;window.showModeSelection=showModeSelection;window.selectGameMode=selectGameMode;window.showDataManagement=showDataManagement;window.manualSave=manualSave;window.exportSaveData=exportSaveData;window.importSaveData=importSaveData;window.deleteSaveData=deleteSaveData;window.developerAcquireMonster=developerAcquireMonster;window.developerLevelUp=developerLevelUp;window.startDungeon=startDungeon;window.pickParent=pickParent;window.startFusion=startFusion;window.beginFusion=beginFusion;window.confirmFusionChoice=confirmFusionChoice;window.cancelFusionChoice=cancelFusionChoice;window.showInheritance=showInheritance;window.toggleInheritance=toggleInheritance;window.completeFusion=completeFusion;window.finishFusionResult=finishFusionResult;window.toggleParty=toggleParty;window.showMonsterDetail=showMonsterDetail;window.selectEnemy=selectEnemy;window.selectAlly=selectAlly;window.chooseSkill=chooseSkill;window.executeTurn=executeTurn;window.takeRecruit=takeRecruit;
window.addEventListener('beforeunload',()=>saveGame());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveGame()});
if(loadedExistingSave)home();
else if(BUILD_MODE==='normal'||BUILD_MODE==='development')selectGameMode(BUILD_MODE);
else showModeSelection();
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
/* β0.4-15 戦闘画面演出 */
function battleUnit(unit,side,index,selected,action=''){const statuses=[unit.fearTurns>0?'恐怖':'',unit.petrified?'石化':''].filter(Boolean).join(' / ');return `<div class="unit battle-unit ${selected} ${unit.hp<=0?'dead':''}" data-side="${side}" data-index="${index}" onclick="${side==='enemy'?`selectEnemy(${index})`:`selectAlly(${index})`}"><div class="battle-visual">${monsterArtwork(unit,'battle')}</div><div class="name ${side==='enemy'?`ename ${eclass(unit)}`:''}">${unit.name}</div>${side==='ally'?`<div class="hp"><span style="width:${hpRate(unit)*100}%"></span></div><div class="sub hp-text">${unit.hp}/${unit.maxHp}</div>`:''}<div class="action">${side==='ally'?`${action||'待機中'}${statuses?' / '+statuses:''}`:(unit.hp<=0?'撃破':statuses)}</div></div>`}
function renderBattle(){const allies=party(),selected=allies[state.selectedAlly]||allies.find(a=>a.hp>0)||allies[0];app.innerHTML=`<div class="status"><span>${difficultyConfig().name}　FLOOR ${state.floor}/${state.dungeon.max}　TURN ${state.turn}</span><span>${state.point}/9SP</span></div><div class="gauge">${gauge()}</div><div class="card battle-side"><div class="unitrow ${state.enemies.length===1?'single-enemy':''}">${state.enemies.map((e,i)=>battleUnit(e,'enemy',i,state.pending?.side==='enemy'&&e.hp>0?'target-option-enemy':'')).join('')}</div></div><div id="log" class="log">${state.battleLogs.join('')}</div><div class="card battle-side"><div class="unitrow">${allies.map((a,i)=>battleUnit(a,'ally',i,`${i===state.selectedAlly?'sel ':''}${state.pending?.side==='ally'&&a.hp>0?'target-option-ally':''}`,state.queue[i]?.name)).join('')}</div></div><div class="card"><div class="muted">${state.pending?(state.pending.side==='enemy'?'対象の敵を選択':'対象の味方を選択'):'行動を選択'}</div><div class="grid commands">${selected.skills.filter(id=>skills[id]&&skills[id].active!==false&&skills[id].type!=='passive').map(id=>{const s=skills[id];return`<button onclick="chooseSkill('${id}')" ${state.isProcessing?'disabled':''}>${s.name}<small>${s.cost}SP / ${targetLabel(s.target)}</small></button>`}).join('')}</div><button class="wide btn-next" onclick="executeTurn()" ${state.isProcessing?'disabled':''}>選択完了</button></div>`;updateHeader();const l=document.getElementById('log');if(l)l.scrollTop=l.scrollHeight}
function effectiveness(sa,ta){const r=matchupMultiplier(sa,ta);return r>1?'weak':r<1?'resist':'normal'}
function battleEl(side,u){const i=side==='enemy'?state.enemies.indexOf(u):party().indexOf(u);return document.querySelector(`.battle-unit[data-side="${side}"][data-index="${i}"]`)}
async function attackMotion(side,u){const e=battleEl(side,u);if(!e||state.skip)return;e.classList.add(side==='ally'?'attack-up':'attack-down');await wait(240);e.classList.remove('attack-up','attack-down')}
function updateBattleHp(side,u){const e=battleEl(side,u);if(!e)return;const bar=e.querySelector('.hp span'),text=e.querySelector('.hp-text');if(bar)requestAnimationFrame(()=>bar.style.width=`${hpRate(u)*100}%`);if(text)text.textContent=`${u.hp}/${u.maxHp}`;if(u.hp<=0)e.classList.add('dead')}
async function damageEffect(side,u,n,s){const e=battleEl(side,u),type=effectiveness(s.attribute,u.attribute);if(e){e.classList.remove('hit-shake');void e.offsetWidth;e.classList.add('hit-shake');const p=document.createElement('div'),icon=s.attribute!=='無'?attributeIconFiles[s.attribute]:null;p.className=`damage-popup ${type}`;p.innerHTML=`${icon?`<img src="assets/icons/${icon}" alt="">`:''}<span>${n}</span>`;e.appendChild(p);setTimeout(()=>p.remove(),850)}updateBattleHp(side,u);log(`<span class="damage-log ${type}">${u.name} に ${n}ダメージ！${type==='weak'?' 弱点！':type==='resist'?' 耐性':''}</span>`);await wait(360)}
function canReceiveFear(source,target){
  const sourceLevel=source.level||1,targetLevel=target.level||1;
  return !target.isBoss&&!target.isMidBoss&&targetLevel<sourceLevel;
}
function tryApplyFear(source,target,skill){
  if(!skill.fearChance||target.hp<=0||!canReceiveFear(source,target))return false;
  if(Math.random()>=skill.fearChance)return false;
  target.fearTurns=Math.max(target.fearTurns||0,1);
  log(`<span class="status-log fear">${target.name} は恐怖で動けなくなった！</span>`);
  return true;
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
  unit.fearTurns--;
  log(`<span class="status-log fear">${unit.name} は恐怖で行動できない！</span>`);
  await wait(DELAY);
  return true;
}
async function allyAct(a,q){
  q.used=true;
  const s=skills[q.skillId]||skills.NORMAL;
  if(await consumeFearTurn(a)){state.point=Math.min(MAX_POINT,state.point+(q.cost||0));q.used=false;return}
  if(s.type==='storeSp'){
    state.nextSpBonus++;
    log(`<b>${a.name} の ${s.name}！</b>`);
    log('次のターンに得られるSPが1増えた！');
    await wait(DELAY);
    return;
  }
  if(s.type==='attack'){
    log(`<b>${a.name} の ${s.name}！</b>`);await attackMotion('ally',a);
    if(s.randomEachHit){
      for(let h=0;h<(s.hits||1);h++){
        const alive=state.enemies.filter(x=>x.hp>0);
        if(!alive.length)break;
        const t=alive[Math.floor(Math.random()*alive.length)],before=t.hp,n=dmg(a,t,s);
        t.hp=Math.max(0,t.hp-n);
        await damageEffect('enemy',t,n,s);
        recordAttackRecovery(a,before-t.hp,s,'ally');
        tryApplyFear(a,t,s);
      }
    }else{
      const ts=s.target==='enemyAll'?state.enemies.filter(x=>x.hp>0):s.randomTarget?[sample(state.enemies.filter(x=>x.hp>0),1)[0]]:[state.enemies[q.target]?.hp>0?state.enemies[q.target]:state.enemies.find(x=>x.hp>0)];
      for(const t of ts.filter(Boolean)){for(let h=0;h<(s.hits||1)&&t.hp>0;h++){const before=t.hp,n=dmg(a,t,s);t.hp=Math.max(0,t.hp-n);await damageEffect('enemy',t,n,s);recordAttackRecovery(a,before-t.hp,s,'ally')}tryApplyFear(a,t,s)}
    }
    applySelfCost(a,s);await wait(DELAY);
  }else if(s.type==='debuff'){
    const t=state.enemies[q.target]?.hp>0?state.enemies[q.target]:state.enemies.find(x=>x.hp>0);
    log(`<b>${a.name} の ${s.name}！</b>`);
    if(t)tryApplyPetrify(a,t,s);
    await wait(DELAY);
  }else if(s.type==='heal'){
    const z=party()[q.target],ts=s.target==='allyAll'?party().filter(x=>x.hp>0):[(z&&z.hp>0)?z:party().find(x=>x.hp>0)];
    log(`<b>${a.name} の ${s.name}！</b>`);
    for(const t of ts.filter(Boolean)){const n=Math.max(s.minHeal||0,Math.round(t.maxHp*(s.healRate??(.3*(s.multiplier||1))))),actual=Math.min(n,t.maxHp-t.hp);t.hp+=actual;log(`${t.name} のHPが ${actual}回復！`);updateBattleHp('ally',t)}
    await wait(DELAY);
  }else if(s.type==='buffAtk'){party().forEach(x=>x.buffAtk=s.multiplier);log('味方全体の攻撃力アップ');await wait(DELAY)}
  else if(s.type==='buffDef'){const t=party()[q.target]||party().find(x=>x.hp>0);if(t){t.buffDef=s.multiplier;log(`${t.name} の防御力アップ`)}await wait(DELAY)}
}
async function enemyAct(e){
  if(await consumeFearTurn(e))return;
  const ss=skills[e.solid];
  const usable=ss&&ss.active!==false&&ss.type!=='passive'&&ss.type!=='storeSp';
  const s=usable&&state.enemyPoint>=ss.cost?ss:skills.NORMAL;
  if(s!==skills.NORMAL)state.enemyPoint-=s.cost;
  if(s.type==='heal'){
    const ts=state.enemies.filter(x=>x.hp>0),t=[...ts].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
    if(!t)return;
    log(`<b>${e.name} の ${s.name}！</b>`);
    const n=Math.min(Math.max(s.minHeal||0,Math.round(t.maxHp*(s.healRate??(.3*(s.multiplier||1))))),t.maxHp-t.hp);
    t.hp+=n;
    log(`${t.name} のHPが ${n}回復！`);
    updateBattleHp('enemy',t);
    await wait(DELAY);
    return;
  }
  const alive=party().filter(x=>x.hp>0);
  if(!alive.length)return;
  if(s.type==='debuff'){
    const t=alive[Math.floor(Math.random()*alive.length)];
    log(`<b>${e.name} の ${s.name}！</b>`);
    tryApplyPetrify(e,t,s);
    await wait(DELAY);
    return;
  }
  log(`<b>${e.name} の ${s.name}！</b>`);
  await attackMotion('enemy',e);
  if(s.randomEachHit){
    for(let h=0;h<(s.hits||1);h++){
      const currentAlive=party().filter(x=>x.hp>0);
      if(!currentAlive.length)break;
      const t=currentAlive[Math.floor(Math.random()*currentAlive.length)],before=t.hp,n=dmg(e,t,s);
      t.hp=Math.max(0,t.hp-n);
      await damageEffect('ally',t,n,s);
      recordAttackRecovery(e,before-t.hp,s,'enemy');
      tryApplyFear(e,t,s);
    }
  }else{
    const ts=s.target==='enemyAll'?alive:[alive[Math.floor(Math.random()*alive.length)]];
    for(const t of ts){
      for(let h=0;h<(s.hits||1)&&t.hp>0;h++){
        const before=t.hp,n=dmg(e,t,s);
        t.hp=Math.max(0,t.hp-n);
        await damageEffect('ally',t,n,s);
        recordAttackRecovery(e,before-t.hp,s,'enemy');
      }
      tryApplyFear(e,t,s);
    }
  }
  applySelfCost(e,s);
  await wait(DELAY);
}
