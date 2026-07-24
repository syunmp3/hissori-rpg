const GAME_VERSION='Ver1.76';
const VERSION_NOTICE_KEY='hissoriRpgLastShownVersion';
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
const FUSION_GENERATED_INHERITABLE_SKILL_IDS=['STONE_GAZE','BLOSSOM_GIFT'];
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
DARK_2:{id:'DARK_2',name:'ハイダーク',star:2,type:'attack',attribute:'闇',cost:1,multiplier:1.2,target:'enemySingle'},
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
FANG:{id:'FANG',name:'ファング',star:1,type:'attack',attribute:'無',cost:1,multiplier:1.4,target:'enemySingle'},
PIERCE:{id:'PIERCE',name:'ピアース',star:1,type:'attack',attribute:'無',cost:1,multiplier:1.4,target:'enemySingle'},
SACRIFICE:{id:'SACRIFICE',name:'生贄',star:2,type:'attack',attribute:'闇',cost:2,multiplier:2.5,target:'enemySingle',selfHpCostRate:.1},
STONE_BODY:{id:'STONE_BODY',name:'ストーンボディ',star:1,type:'passive',attribute:'無',cost:0,target:'self',active:false,passive:{damageTaken:.95}},
HEAVY_SMASH:{id:'HEAVY_SMASH',name:'ヘビースマッシュ',star:3,type:'attack',attribute:'無',cost:2,multiplier:2.4,target:'enemySingle'},
HELL_CALL:{id:'HELL_CALL',name:'地獄の呼び声',star:3,type:'passive',attribute:'火',cost:0,target:'self',active:false,passive:{attributeDamage:{火:1.1,闇:1.1}}},
WATER_MAGIC:{id:'WATER_MAGIC',name:'ウォーターマジック',star:1,type:'attack',attribute:'水',cost:1,multiplier:1.2,target:'enemySingle'},
FLOWER_SWORD:{id:'FLOWER_SWORD',name:'フラワーソード',star:1,type:'attack',attribute:'自然',cost:1,multiplier:1.2,target:'enemySingle'},
BOLT_STRIKE:{id:'BOLT_STRIKE',name:'ボルト',star:1,type:'attack',attribute:'雷',cost:1,multiplier:1.2,target:'enemySingle'},
CHICKEN_SCREAM:{id:'CHICKEN_SCREAM',name:'チキンスクリーム',star:3,type:'attack',attribute:'火',cost:3,multiplier:1.4,target:'enemyAll',fearChance:.3},
COCKA_ROAR:{id:'COCKA_ROAR',name:'コカロアー',star:5,type:'attack',attribute:'火',cost:4,multiplier:2,target:'enemyAll',fearChance:.3},
STONE_GAZE:{id:'STONE_GAZE',name:'ストーンゲイズ',star:4,type:'debuff',attribute:'無',cost:3,multiplier:0,target:'enemySingle',petrify:true},
STORE_SP:{id:'STORE_SP',name:'たくわえる',star:1,type:'storeSp',attribute:'無',cost:0,target:'self'},
BLOOD_CRAVING:{id:'BLOOD_CRAVING',name:'血を欲するも者',star:3,type:'passive',attribute:'闇',cost:0,target:'self',active:false,passive:{lifestealRate:.5,diesIfNoAttack:true}},
BLOOD_DRAIN:{id:'BLOOD_DRAIN',name:'ブラッドドレイン',star:3,type:'attack',attribute:'闇',cost:2,multiplier:2.2,target:'enemySingle',lifestealRate:.75},
BIND:{id:'BIND',name:'バインド',star:1,type:'attack',attribute:'無',cost:1,multiplier:1.3,target:'enemySingle'},
VENOM_FANG:{id:'VENOM_FANG',name:'ヴェノムファング',star:2,type:'attack',attribute:'無',cost:2,multiplier:1.7,target:'enemySingle',poisonStacks:1},
WIND_CUTTER:{id:'WIND_CUTTER',name:'ウィンドカッター',star:2,type:'attack',attribute:'自然',cost:1,multiplier:1.4,target:'enemySingle'},
ROOT_IMPACT:{id:'ROOT_IMPACT',name:'ルートインパクト',star:3,type:'attack',attribute:'自然',cost:3,multiplier:1.4,target:'enemyAll'},
FOREST_VEIL:{id:'FOREST_VEIL',name:'フォレストベール',star:3,type:'heal',attribute:'自然',cost:2,target:'allyAll',healRate:.1,minHeal:50},
ANCIENT_BLOSSOM:{id:'ANCIENT_BLOSSOM',name:'エンシェントブロッサム',star:4,type:'heal',attribute:'自然',cost:3,target:'allyAll',healRate:.2,minHeal:100},
BLOSSOM_GIFT:{id:'BLOSSOM_GIFT',name:'ブロッサムギフト',star:3,type:'heal',attribute:'自然',cost:2,target:'allySingle',healRate:.25,minHeal:100,randomBuff:true}
,
CHARGE:{id:'CHARGE',name:'チャージ',star:2,type:'charge',attribute:'無',cost:0,target:'self',spGain:1},
HIGH_CHARGE:{id:'HIGH_CHARGE',name:'ハイチャージ',star:3,type:'charge',attribute:'無',cost:1,target:'self',spGain:3},
SUPER_CHARGE:{id:'SUPER_CHARGE',name:'スーパーチャージ',star:4,type:'charge',attribute:'無',cost:2,target:'self',spGain:5},
OVER_CHARGE:{id:'OVER_CHARGE',name:'オーバーチャージ',star:5,type:'charge',attribute:'無',cost:9,target:'self',spGain:10}
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
["WILD_BOAR","ワイルドボア","獣","無",2,"FANG",130,68,52,34,"攻撃型"],
["SHAMAN","シャーマン","亜人","光",2,"SACRIFICE",105,52,58,46,"防御型"],
["STONE","ストーン","物質","無",1,"STONE_BODY",120,36,70,18,"防御型"],
["CRYSTAL","クリスタル","物質","光",2,"STONE_BODY",105,58,68,38,"防御型"],
["IRON","アイアン","物質","無",2,"STONE_BODY",135,48,82,20,"防御型"],
["GOLEM","ゴーレム","物質","無",3,"HEAVY_SMASH",195,92,118,22,"防御型"],
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
["RAT","ラット","獣","無",1,"FANG",66,42,27,84,"速度型"],
["SPIDER","スパイダー","植物","闇",1,"PIERCE",88,52,40,58,"攻撃型"],
["VAMPEEL","ヴァンピール","アンデッド","闇",2,"BLOOD_CRAVING",115,68,42,82,"速度型"],
["VAMPIRE","ヴァンパイア","アンデッド","闇",3,"BLOOD_DRAIN",185,112,68,92,"攻撃型"],
["TRENT","トレント","植物","自然",2,"ROOT_IMPACT",165,88,98,48,"防御型"],
["SYLPH","シルフ","精霊","自然",1,"WIND_CUTTER",90,48,42,82,"速度型"],
["NYMPH","ニンフ","精霊","光",2,"MAGIC_COLLECTOR",135,72,78,68,"防御型"],
["DRYAD","ドライアド","精霊","自然",3,"FOREST_VEIL",182,98,92,88,"防御型"],
["DRYS","ドリュス","精霊","自然",1,"STORE_SP",102,52,46,74,"速度型"],
["HAMADRYAD","ハマドリュアス","精霊","自然",4,"ANCIENT_BLOSSOM",255,132,122,108,"防御型"],
["HORNET","ホーネット","植物","無",1,"PIERCE",94,58,40,78,"速度型"],
["NOCTUA","ノクトゥア","獣","闇",1,"NIGHT_VISION",96,54,42,80,"速度型"],
["SERPENT","サーペント","獣","無",1,"BIND",112,60,46,64,"防御型"],
["VIPER","ヴァイパー","獣","闇",2,"VENOM_FANG",148,92,58,86,"速度型"],
["GREAT_BEAR","グレートベア","獣","自然",2,"HEAVY_SMASH",172,102,82,58,"攻撃型"],
["GLOW_SPIRIT","グロウスピリット","物質","無",1,"CHARGE",18,18,95,35,"硬質型",null,1],
["GLOW_ELEMENT","グロウエレメント","物質","無",2,"HIGH_CHARGE",28,28,155,42,"硬質型",null,1],
["GLOW_CORE","グロウコア","物質","無",3,"SUPER_CHARGE",40,40,230,48,"硬質型",null,1],
["GLOW_ORB","グロウオーブ","物質","無",4,"OVER_CHARGE",55,55,340,55,"硬質型",null,1],
];
const monsterDB=Object.fromEntries(M.map(x=>[x[0],{id:x[0],name:x[1],race:x[2],attribute:x[3],baseStar:x[4],solid:x[5],hp:x[6],atk:x[7],def:x[8],spd:x[9],growth:x[10],expGrowth:x[11]||'通常型',expMultiplier:x[12]||1}]));
const monsterDexNo={"SLIME_BLUE":1,"SLIME_RED":2,"SLIME_YELLOW":3,"SLIME_GREEN":4,"MINIC":5,"MIMIC":6,"STONE":7,"MANDRAGORA":8,"SEED":9,"FLOWER_MAN":10,"WOLF":11,"HIGH_WOLF":12,"BEAR":13,"KOKOPI":14,"KOKKORU":15,"COCKATRICE":16,"GOBLIN":17,"HIGH_GOBLIN":18,"KOBOLD":19,"ORC":20,"HIGH_ORC":21,"THIEF":22,"DEMON_KID":23,"MINI_FAIRY":24,"FAIRY":25,"LIZARD_KID":26,"LIZARD":27,"HIGH_LIZARD":28,"CRYSTAL":29,"IRON":30,"GOLEM":31,"SPIDER":32,"BAT":33,"BLOOD_BAT":34,"HORN_RABBIT":35,"RAT":36,"FOX":37,"WILD_BOAR":38,"WITCH":39,"SHAMAN":40,"ZOMBIE":41,"SKELETON":42,"GHOST":43,"VAMPEEL":44,"VAMPIRE":45,"MINI_DEMON":46,"DEMON":47,"IMP":48,"GARGOYLE":49,"HELL_HOUND":50,"FLAME":51,"AQUA_SPIRIT":52,"BOLT_SPIRIT":53,"LEAF_SPIRIT":54,"SHADOW_SPIRIT":55,
  "TRENT":56,"HORNET":57,"NOCTUA":58,"SERPENT":59,"VIPER":60,"GREAT_BEAR":61,"SYLPH":62,"NYMPH":63,"DRYS":64,"DRYAD":65,"HAMADRYAD":66,
  "GLOW_SPIRIT":67,"GLOW_ELEMENT":68,"GLOW_CORE":69,"GLOW_ORB":70};
const RARE_ENCOUNTER_MONSTERS={1:'KOKOPI',2:'VAMPEEL',3:'DRYS'};
// レア表示は出現枠とは独立して、モンスターごとに定義する。
const RARE_MONSTER_IDS=new Set(['KOKOPI','KOKKORU','COCKATRICE','VAMPEEL','VAMPIRE',"DRYS","DRYAD","HAMADRYAD"]);

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
// 通常配合グループ。今後追加するモンスターは、ここへ明示的に追加した場合だけ通常配合に参加する。
const NORMAL_FUSION_GROUP_BY_MONSTER={
  // 現時点の★1・★2はすべて「グループ1」に所属する。
  // レア・特殊配合限定モンスターも親としてはグループ1を参照するが、通常候補からは除外する。
  ...Object.fromEntries([
    'SLIME_BLUE','SLIME_RED','SLIME_YELLOW','SLIME_GREEN','GOBLIN','KOBOLD','WOLF','BAT','WITCH',
    'DEMON_KID','MINI_DEMON','LIZARD_KID','MINI_FAIRY','MANDRAGORA','SEED','FLOWER_MAN','ZOMBIE',
    'SKELETON','GHOST','MINIC','BEAR','STONE','THIEF','IMP','FLAME','AQUA_SPIRIT','BOLT_SPIRIT',
    'LEAF_SPIRIT','SHADOW_SPIRIT','KOKOPI','HORN_RABBIT','RAT','SPIDER',
    'HIGH_GOBLIN','HIGH_WOLF','BLOOD_BAT','ORC','DEMON','LIZARD','MIMIC','FOX','WILD_BOAR',
    'SHAMAN','CRYSTAL','IRON','GARGOYLE','FAIRY','KOKKORU','VAMPEEL'
  ].map(id=>[id,1]))
};
const NORMAL_FUSION_EXCLUDED_IDS=new Set([
  'KOKOPI','KOKKORU','VAMPEEL','DEMON','HIGH_GOBLIN','LIZARD','FAIRY'
]);
function normalFusionPool(parent){
  const group=NORMAL_FUSION_GROUP_BY_MONSTER[parent.id];
  if(group==null)return [];
  return M.filter(x=>{
    const [id,,race,,star]=x;
    return star===parent.baseStar
      && race===parent.race
      && NORMAL_FUSION_GROUP_BY_MONSTER[id]===group
      && !NORMAL_FUSION_EXCLUDED_IDS.has(id);
  }).map(x=>x[0]);
}
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
const SPIRIT_FOREST_EARLY_POOL=[
  'HORNET','NOCTUA','SERPENT','SYLPH','LEAF_SPIRIT','BEAR','MANDRAGORA'
];
const SPIRIT_FOREST_LATE_POOL=[
  ...SPIRIT_FOREST_EARLY_POOL,'GOLEM','NYMPH','FAIRY'
];
const special={
  ['GOBLIN|KOBOLD']:'HIGH_GOBLIN',
  ['KOBOLD|ORC']:'HIGH_ORC',
  ['KOKOPI|MANDRAGORA']:'KOKKORU',
  ['KOKKORU|VIPER']:'COCKATRICE',
  ['DEMON_KID|MINI_DEMON']:'DEMON',
  ['BLOOD_BAT|VAMPEEL']:'VAMPIRE',
  ['FLAME|LIZARD_KID']:'LIZARD',
  ['MINI_FAIRY|MINI_FAIRY']:'FAIRY',
  ['IRON|STONE']:'GOLEM',
  ['DRYS|NYMPH']:'DRYAD'
};
const FUSION_GENERATED_SKILLS_BY_MONSTER={COCKATRICE:['STONE_GAZE'],HAMADRYAD:['BLOSSOM_GIFT']};
const STAT_GROWTH_BASE={hp:10,atk:5,def:3,spd:2};
const STAT_GROWTH_TYPES={
  通常型:{hp:1,atk:1,def:1,spd:1},
  攻撃型:{hp:.9,atk:1.2,def:.7,spd:1},
  防御型:{hp:1.2,atk:.8,def:1.3,spd:.5},
  速度型:{hp:.9,atk:.8,def:.7,spd:2},
  硬質型:{hp:.35,atk:.6,def:2.4,spd:.55}
};
const STAR_STAT_GROWTH_MULTIPLIERS={1:1,2:1.2,3:1.4,4:1.6,5:1.8};
const STAR_EXP_MULTIPLIERS={1:1,2:1.1,3:1.2,4:1.3,5:1.4};
const BASE_REQUIRED_EXP_RATE=.75;
const DIFFICULTIES={
  normal:{name:'ノーマル',levelBonus:0,rareRate:.01,recruitRate:.05,bossRecruitRate:.025},
  hard:{name:'ハード',levelBonus:20,rareRate:.02,recruitRate:.075,bossRecruitRate:.05},
  veryHard:{name:'ベリーハード',levelBonus:50,rareRate:.03,recruitRate:.10,bossRecruitRate:.075},
  expert:{name:'エキスパート',levelBonus:80,rareRate:.04,recruitRate:.125,bossRecruitRate:.10}
};
const DUNGEON_PROGRESS_KEY='hissoriRpgDungeonProgressV1';
const MONSTER_DEFEAT_COUNTS_KEY='hissoriRpgMonsterDefeatCountsV1';
const GAME_SAVE_KEY='hissoriRpgSaveV1';
const GAME_SAVE_VERSION=7;
const GACHA_TICKET_DROP_RATE=.01;
const GACHA_RATES={EXP_DROP:.50,EXP_CRYSTAL:.10,EXP_ORB:.05,APPEARANCE_TICKET:.05,SKILL_TICKET:.03,MISS:.27};
const APPEARANCE_CHANGE_MONSTER_IDS=new Set(['VAMPIRE','COCKATRICE']);
// 配布時に normal / development へ固定する。selector は共通開発元用。
const BUILD_MODE='normal';
function defaultDungeonProgress(){return Object.fromEntries([1,2,3,4].map(id=>[id,Object.fromEntries(Object.keys(DIFFICULTIES).map(key=>[key,0]))]))}
function loadDungeonProgress(){
  const base=defaultDungeonProgress();
  try{
    const saved=JSON.parse(localStorage.getItem(DUNGEON_PROGRESS_KEY)||'{}');
    for(const id of [1,2,3,4])for(const difficulty of Object.keys(DIFFICULTIES)){
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
function dungeonUnlocked(dungeonId){
  if(dungeonId===4)return true;
  if(dungeonId===3)return (state.dungeonProgress[1]?.normal||0)>=10;
  return true;
}
function difficultyUnlocked(dungeonId,difficulty){
  if(!dungeonUnlocked(dungeonId))return false;
  if(dungeonId===4)return difficulty==='normal'&&(state.items?.KEY_CHAMPION_NORMAL||0)>0;
  if(difficulty==='normal')return true;
  if(difficulty==='hard')return (state.dungeonProgress[dungeonId]?.normal||0)>=20;
  if(difficulty==='veryHard')return (state.dungeonProgress[dungeonId]?.hard||0)>=30;
  return false;
}
//経験値関連
function difficultyConfig(){return DIFFICULTIES[state.difficulty]||DIFFICULTIES.normal}
function expGrowthMultiplier(type,level){
  if(type==='早熟型')return .8+.4*(Math.max(1,Math.min(99,level))-1)/98;
  if(type==='晩成型')return 1.2-.4*(Math.max(1,Math.min(99,level))-1)/98;
  return 1;
}
function requiredExp(level,type='通常型',star=1){
  const lv=Math.max(1,Math.min(99,level));
  const starMultiplier=STAR_EXP_MULTIPLIERS[Math.max(1,Math.min(5,Number(star)||1))]||1;
  return Math.round((50+30*lv+23*lv*lv)*BASE_REQUIRED_EXP_RATE*expGrowthMultiplier(type,lv)*starMultiplier);
}
function growthAtLevel(base,level){
  const gain=Math.max(0,level-1);
  const rates=STAT_GROWTH_TYPES[base.growth]||STAT_GROWTH_TYPES.通常型;
  const starMultiplier=STAR_STAT_GROWTH_MULTIPLIERS[Math.max(1,Math.min(5,Number(base.baseStar)||1))]||1;
  return{
    maxHp:base.hp+Math.round(STAT_GROWTH_BASE.hp*rates.hp*starMultiplier*gain),
    atk:base.atk+Math.round(STAT_GROWTH_BASE.atk*rates.atk*starMultiplier*gain),
    def:base.def+Math.round(STAT_GROWTH_BASE.def*rates.def*starMultiplier*gain),
    spd:base.spd+Math.round(STAT_GROWTH_BASE.spd*rates.spd*starMultiplier*gain)
  };
}
function growthDelta(base,fromLevel,toLevel){
  const from=growthAtLevel(base,fromLevel),to=growthAtLevel(base,toLevel);
  return{maxHp:to.maxHp-from.maxHp,atk:to.atk-from.atk,def:to.def-from.def,spd:to.spd-from.spd};
}
function addMonsterExp(member, gainedExp){
  const levelUps = [];
  member.exp += gainedExp;
  while(member.exp >= member.nextExp && member.level < 100){
    member.exp -= member.nextExp;
    const increase = growthDelta(
      monsterDB[member.id],
      member.level,
      member.level + 1
    );
    member.level++;
    levelUps.push(member.level);
    member.maxHp += increase.maxHp;
    member.atk += increase.atk;
    member.def += increase.def;
    member.spd += increase.spd;
    member.nextExp = requiredExp(
      member.level,
      member.expGrowth,
      member.star
    );
  }
  return levelUps;
}
//
