// The AI-300 Army roster.
//
// Ported from the classic "Bot Battlr" exercise (data/db.json) and re-typed for
// the animationdictionary.xyz barracks theme. Every bot is an AI animation unit
// you can recruit on /ai300. Avatars are robohash.org robot renders.
//
// NOTE: generated from the source db.json — edit there and re-run if you need to
// refresh the roster.

export type BotClass =
  | "Assault"
  | "Defender"
  | "Support"
  | "Medic"
  | "Witch"
  | "Captain";

export interface Bot {
  id: number;
  name: string;
  bot_class: BotClass;
  health: number;
  damage: number;
  armor: number;
  catchphrase: string;
  avatar_url: string;
}

export const BOT_CLASSES: BotClass[] = [
  "Assault",
  "Defender",
  "Support",
  "Medic",
  "Witch",
  "Captain",
];

export const BOTS: Bot[] = [
    {
        "id":  111,
        "name":  "ya-81",
        "bot_class":  "Defender",
        "health":  56,
        "damage":  22,
        "armor":  92,
        "catchphrase":  "100000011001011111110100110001010101100111001100",
        "avatar_url":  "https://robohash.org/similiquereprehenderitet.png?size=300x300\u0026set=set1"
    },
    {
        "id":  118,
        "name":  "s-96",
        "bot_class":  "Witch",
        "health":  56,
        "damage":  92,
        "armor":  38,
        "catchphrase":  "110001011001010111010010110110000011110011100",
        "avatar_url":  "https://robohash.org/autearem.png?size=300x300\u0026set=set1"
    },
    {
        "id":  119,
        "name":  "GQ-40",
        "bot_class":  "Defender",
        "health":  78,
        "damage":  37,
        "armor":  95,
        "catchphrase":  "00010100111100110110111001011111010011001",
        "avatar_url":  "https://robohash.org/repellendusporrosint.png?size=300x300\u0026set=set1"
    },
    {
        "id":  121,
        "name":  "wa-81",
        "bot_class":  "Assault",
        "health":  49,
        "damage":  81,
        "armor":  39,
        "catchphrase":  "1010100000001001101101111100100011000010",
        "avatar_url":  "https://robohash.org/adipisciconsequaturnostrum.png?size=300x300\u0026set=set1"
    },
    {
        "id":  122,
        "name":  "xa-49",
        "bot_class":  "Assault",
        "health":  67,
        "damage":  95,
        "armor":  26,
        "catchphrase":  "01011110101110001100111011110011100",
        "avatar_url":  "https://robohash.org/iddolormaxime.png?size=300x300\u0026set=set1"
    },
    {
        "id":  123,
        "name":  "^z-24",
        "bot_class":  "Defender",
        "health":  41,
        "damage":  21,
        "armor":  99,
        "catchphrase":  "0001001101001110100110000010000",
        "avatar_url":  "https://robohash.org/verotemporecorrupti.png?size=300x300\u0026set=set1"
    },
    {
        "id":  124,
        "name":  "b-75",
        "bot_class":  "Support",
        "health":  84,
        "damage":  30,
        "armor":  40,
        "catchphrase":  "10110100111001100100100110100111000011101",
        "avatar_url":  "https://robohash.org/ducimusquiaut.png?size=300x300\u0026set=set1"
    },
    {
        "id":  125,
        "name":  "cx-59",
        "bot_class":  "Assault",
        "health":  68,
        "damage":  97,
        "armor":  39,
        "catchphrase":  "11111011111110000110101011110000101",
        "avatar_url":  "https://robohash.org/quisrationeerror.png?size=300x300\u0026set=set1"
    },
    {
        "id":  126,
        "name":  "l_]-00",
        "bot_class":  "Defender",
        "health":  75,
        "damage":  22,
        "armor":  100,
        "catchphrase":  "000111001010000110111010111110101010011",
        "avatar_url":  "https://robohash.org/consequunturetquis.png?size=300x300\u0026set=set1"
    },
    {
        "id":  127,
        "name":  "QM-22",
        "bot_class":  "Defender",
        "health":  48,
        "damage":  34,
        "armor":  90,
        "catchphrase":  "100001000111111101101000100101111100011111100110",
        "avatar_url":  "https://robohash.org/delenitipraesentiumaut.png?size=300x300\u0026set=set1"
    },
    {
        "id":  128,
        "name":  "qT-53",
        "bot_class":  "Assault",
        "health":  72,
        "damage":  80,
        "armor":  29,
        "catchphrase":  "10011000110110001111011111110110110010",
        "avatar_url":  "https://robohash.org/quidoloresit.png?size=300x300\u0026set=set1"
    },
    {
        "id":  129,
        "name":  "E-88",
        "bot_class":  "Medic",
        "health":  95,
        "damage":  37,
        "armor":  50,
        "catchphrase":  "0110011010100100010110100011000001110001001111",
        "avatar_url":  "https://robohash.org/beataequisaut.png?size=300x300\u0026set=set1"
    },
    {
        "id":  130,
        "name":  "Qz-38",
        "bot_class":  "Assault",
        "health":  63,
        "damage":  99,
        "armor":  23,
        "catchphrase":  "01111111011110101100110110111000101111010",
        "avatar_url":  "https://robohash.org/repellendusasperioresdolor.png?size=300x300\u0026set=set1"
    },
    {
        "id":  131,
        "name":  "Q_n-34",
        "bot_class":  "Witch",
        "health":  92,
        "damage":  40,
        "armor":  44,
        "catchphrase":  "0111110010100110101111100011001001",
        "avatar_url":  "https://robohash.org/quodremnihil.png?size=300x300\u0026set=set1"
    },
    {
        "id":  132,
        "name":  "Q-27",
        "bot_class":  "Defender",
        "health":  44,
        "damage":  24,
        "armor":  93,
        "catchphrase":  "00111100011001000010010011000100000001001",
        "avatar_url":  "https://robohash.org/isteoptiodolorem.png?size=300x300\u0026set=set1"
    },
    {
        "id":  133,
        "name":  "ed-84",
        "bot_class":  "Defender",
        "health":  54,
        "damage":  22,
        "armor":  93,
        "catchphrase":  "01111001010100000000111111110110100",
        "avatar_url":  "https://robohash.org/vitaeutporro.png?size=300x300\u0026set=set1"
    },
    {
        "id":  134,
        "name":  "xG-91",
        "bot_class":  "Defender",
        "health":  40,
        "damage":  33,
        "armor":  81,
        "catchphrase":  "11101000001100011110000010000111101",
        "avatar_url":  "https://robohash.org/oditdoloresullam.png?size=300x300\u0026set=set1"
    },
    {
        "id":  135,
        "name":  "yLH-96",
        "bot_class":  "Captain",
        "health":  89,
        "damage":  40,
        "armor":  66,
        "catchphrase":  "101100000111010111111101010111101101100101101111",
        "avatar_url":  "https://robohash.org/doloretqui.png?size=300x300\u0026set=set1"
    },
    {
        "id":  136,
        "name":  "U-01",
        "bot_class":  "Assault",
        "health":  67,
        "damage":  97,
        "armor":  33,
        "catchphrase":  "111010011011101000101011100110000",
        "avatar_url":  "https://robohash.org/dolorumnumquamratione.png?size=300x300\u0026set=set1"
    },
    {
        "id":  137,
        "name":  "D-04",
        "bot_class":  "Medic",
        "health":  86,
        "damage":  27,
        "armor":  55,
        "catchphrase":  "01000001001000001101011100100001100110100010",
        "avatar_url":  "https://robohash.org/sitvoluptatemipsa.png?size=300x300\u0026set=set1"
    },
    {
        "id":  138,
        "name":  "z-43",
        "bot_class":  "Assault",
        "health":  54,
        "damage":  98,
        "armor":  20,
        "catchphrase":  "1000001010000010100010110101100001111001110",
        "avatar_url":  "https://robohash.org/essesaepeeaque.png?size=300x300\u0026set=set1"
    },
    {
        "id":  139,
        "name":  "T-30",
        "bot_class":  "Support",
        "health":  91,
        "damage":  20,
        "armor":  56,
        "catchphrase":  "0011111011110111010101100111111011110",
        "avatar_url":  "https://robohash.org/quinatuset.png?size=300x300\u0026set=set1"
    },
    {
        "id":  140,
        "name":  "O-89",
        "bot_class":  "Medic",
        "health":  86,
        "damage":  32,
        "armor":  57,
        "catchphrase":  "10100010100100010001011010001100101101",
        "avatar_url":  "https://robohash.org/quivelitdolores.png?size=300x300\u0026set=set1"
    },
    {
        "id":  141,
        "name":  "ak-68",
        "bot_class":  "Defender",
        "health":  74,
        "damage":  39,
        "armor":  94,
        "catchphrase":  "10101000001010101110000010100010010101100111101",
        "avatar_url":  "https://robohash.org/quascumqueaut.png?size=300x300\u0026set=set1"
    },
    {
        "id":  142,
        "name":  "s-88",
        "bot_class":  "Captain",
        "health":  91,
        "damage":  30,
        "armor":  48,
        "catchphrase":  "1011000100100010001011101110000",
        "avatar_url":  "https://robohash.org/adrecusandaevoluptatem.png?size=300x300\u0026set=set1"
    },
    {
        "id":  143,
        "name":  "Un-19",
        "bot_class":  "Medic",
        "health":  80,
        "damage":  22,
        "armor":  51,
        "catchphrase":  "101100011111101001101011111101110100",
        "avatar_url":  "https://robohash.org/facerenequevoluptas.png?size=300x300\u0026set=set1"
    },
    {
        "id":  144,
        "name":  "ziP-34",
        "bot_class":  "Support",
        "health":  87,
        "damage":  23,
        "armor":  80,
        "catchphrase":  "110000000100101110010011001000",
        "avatar_url":  "https://robohash.org/quisuntest.png?size=300x300\u0026set=set1"
    },
    {
        "id":  145,
        "name":  "v[U-90",
        "bot_class":  "Support",
        "health":  82,
        "damage":  35,
        "armor":  69,
        "catchphrase":  "0010100000000000011000110010001111001010111001100",
        "avatar_url":  "https://robohash.org/laborumteneturquos.png?size=300x300\u0026set=set1"
    },
    {
        "id":  146,
        "name":  "ERJ-02",
        "bot_class":  "Assault",
        "health":  64,
        "damage":  96,
        "armor":  21,
        "catchphrase":  "0001111111101111001010110111010011",
        "avatar_url":  "https://robohash.org/quosolutaprovident.png?size=300x300\u0026set=set1"
    },
    {
        "id":  147,
        "name":  "o-26",
        "bot_class":  "Captain",
        "health":  88,
        "damage":  20,
        "armor":  53,
        "catchphrase":  "11001001101000100000101000001110010010011000111001",
        "avatar_url":  "https://robohash.org/eosrerumin.png?size=300x300\u0026set=set1"
    },
    {
        "id":  148,
        "name":  "xVP-90",
        "bot_class":  "Witch",
        "health":  79,
        "damage":  36,
        "armor":  97,
        "catchphrase":  "10111001100010001100111011111110101010110",
        "avatar_url":  "https://robohash.org/maioresofficiisrepellat.png?size=300x300\u0026set=set1"
    },
    {
        "id":  149,
        "name":  "I-18",
        "bot_class":  "Support",
        "health":  98,
        "damage":  33,
        "armor":  51,
        "catchphrase":  "0011010000110100010110011001001010101000100001101",
        "avatar_url":  "https://robohash.org/sedofficiadeserunt.png?size=300x300\u0026set=set1"
    },
    {
        "id":  150,
        "name":  "St-74",
        "bot_class":  "Support",
        "health":  89,
        "damage":  29,
        "armor":  44,
        "catchphrase":  "011000011111000111001100101111110000",
        "avatar_url":  "https://robohash.org/necessitatibusquisunt.png?size=300x300\u0026set=set1"
    },
    {
        "id":  151,
        "name":  "Fd-25",
        "bot_class":  "Defender",
        "health":  53,
        "damage":  27,
        "armor":  89,
        "catchphrase":  "01100010001101100101101011011011100101100110111",
        "avatar_url":  "https://robohash.org/repellatdistinctioitaque.png?size=300x300\u0026set=set1"
    },
    {
        "id":  152,
        "name":  "Mx-73",
        "bot_class":  "Defender",
        "health":  60,
        "damage":  24,
        "armor":  97,
        "catchphrase":  "01000111011001110101110100000111110111",
        "avatar_url":  "https://robohash.org/autnesciunteos.png?size=300x300\u0026set=set1"
    },
    {
        "id":  153,
        "name":  "B-94",
        "bot_class":  "Medic",
        "health":  82,
        "damage":  33,
        "armor":  45,
        "catchphrase":  "11001011011101010110101100111100010110001010001000",
        "avatar_url":  "https://robohash.org/maximedelenitiveritatis.png?size=300x300\u0026set=set1"
    },
    {
        "id":  154,
        "name":  "Jpf-48",
        "bot_class":  "Defender",
        "health":  63,
        "damage":  37,
        "armor":  86,
        "catchphrase":  "11001011101101110000110000110110000001",
        "avatar_url":  "https://robohash.org/aliquidvoluptatemperspiciatis.png?size=300x300\u0026set=set1"
    },
    {
        "id":  155,
        "name":  "E-26",
        "bot_class":  "Support",
        "health":  95,
        "damage":  30,
        "armor":  70,
        "catchphrase":  "101110100000101000101110110000001101011101001001",
        "avatar_url":  "https://robohash.org/temporibusavel.png?size=300x300\u0026set=set1"
    },
    {
        "id":  156,
        "name":  "mzl-89",
        "bot_class":  "Defender",
        "health":  41,
        "damage":  25,
        "armor":  95,
        "catchphrase":  "0000110100110001000101011011110110000100101110",
        "avatar_url":  "https://robohash.org/ututquasi.png?size=300x300\u0026set=set1"
    },
    {
        "id":  157,
        "name":  "_\\-20",
        "bot_class":  "Assault",
        "health":  78,
        "damage":  85,
        "armor":  38,
        "catchphrase":  "0011010110001111110000000000011011111010011101101",
        "avatar_url":  "https://robohash.org/omnisidnumquam.png?size=300x300\u0026set=set1"
    },
    {
        "id":  158,
        "name":  "tkB-34",
        "bot_class":  "Captain",
        "health":  92,
        "damage":  36,
        "armor":  59,
        "catchphrase":  "0000100000010100100101001000000000",
        "avatar_url":  "https://robohash.org/fugasuntiure.png?size=300x300\u0026set=set1"
    },
    {
        "id":  159,
        "name":  "Dq-39",
        "bot_class":  "Assault",
        "health":  60,
        "damage":  89,
        "armor":  39,
        "catchphrase":  "111101111111011011111111001001100010011010",
        "avatar_url":  "https://robohash.org/voluptatemquasest.png?size=300x300\u0026set=set1"
    },
    {
        "id":  160,
        "name":  "VwZ-65",
        "bot_class":  "Assault",
        "health":  73,
        "damage":  84,
        "armor":  35,
        "catchphrase":  "10101001000101001111010001111000",
        "avatar_url":  "https://robohash.org/eumdelenitivoluptas.png?size=300x300\u0026set=set1"
    },
    {
        "id":  161,
        "name":  "X-77",
        "bot_class":  "Assault",
        "health":  76,
        "damage":  94,
        "armor":  40,
        "catchphrase":  "1011110110000001111100010101001101111110",
        "avatar_url":  "https://robohash.org/adeseruntnatus.png?size=300x300\u0026set=set1"
    },
    {
        "id":  162,
        "name":  "iSh-78",
        "bot_class":  "Defender",
        "health":  46,
        "damage":  27,
        "armor":  92,
        "catchphrase":  "011101110111001100001010011100111101100",
        "avatar_url":  "https://robohash.org/dolormolestiascorrupti.png?size=300x300\u0026set=set1"
    },
    {
        "id":  163,
        "name":  "Y-81",
        "bot_class":  "Medic",
        "health":  87,
        "damage":  29,
        "armor":  50,
        "catchphrase":  "110110000001000110110100100101011001100111",
        "avatar_url":  "https://robohash.org/etipsumsed.png?size=300x300\u0026set=set1"
    },
    {
        "id":  164,
        "name":  "Gz-50",
        "bot_class":  "Support",
        "health":  93,
        "damage":  33,
        "armor":  42,
        "catchphrase":  "001100000010111000011110101001110000",
        "avatar_url":  "https://robohash.org/ametsitqui.png?size=300x300\u0026set=set1"
    },
    {
        "id":  165,
        "name":  "ZSt-34",
        "bot_class":  "Support",
        "health":  81,
        "damage":  38,
        "armor":  64,
        "catchphrase":  "1100111000111001100000100110011",
        "avatar_url":  "https://robohash.org/exquisat.png?size=300x300\u0026set=set1"
    },
    {
        "id":  166,
        "name":  "K`-65",
        "bot_class":  "Captain",
        "health":  90,
        "damage":  36,
        "armor":  50,
        "catchphrase":  "1101001111111101010101110001001",
        "avatar_url":  "https://robohash.org/seddoloremest.png?size=300x300\u0026set=set1"
    },
    {
        "id":  167,
        "name":  "S-96",
        "bot_class":  "Support",
        "health":  84,
        "damage":  29,
        "armor":  77,
        "catchphrase":  "0101001000001101000110010001011010000001100",
        "avatar_url":  "https://robohash.org/aperiamautemconsectetur.png?size=300x300\u0026set=set1"
    },
    {
        "id":  168,
        "name":  "Ar-02",
        "bot_class":  "Defender",
        "health":  76,
        "damage":  33,
        "armor":  85,
        "catchphrase":  "1010010110100101010101101010110110001101111111110",
        "avatar_url":  "https://robohash.org/nobisdoloremad.png?size=300x300\u0026set=set1"
    },
    {
        "id":  169,
        "name":  "h-71",
        "bot_class":  "Support",
        "health":  89,
        "damage":  40,
        "armor":  41,
        "catchphrase":  "0100101110100101011110000110111101110110",
        "avatar_url":  "https://robohash.org/quibusdamveritatisquaerat.png?size=300x300\u0026set=set1"
    },
    {
        "id":  170,
        "name":  "Qv-45",
        "bot_class":  "Medic",
        "health":  41,
        "damage":  38,
        "armor":  95,
        "catchphrase":  "010001001110010010111110101101001110100110000",
        "avatar_url":  "https://robohash.org/inearumrerum.png?size=300x300\u0026set=set1"
    },
    {
        "id":  171,
        "name":  "`ux-06",
        "bot_class":  "Assault",
        "health":  49,
        "damage":  100,
        "armor":  35,
        "catchphrase":  "0010011110010110000100111001100111011001",
        "avatar_url":  "https://robohash.org/inventoreisteut.png?size=300x300\u0026set=set1"
    },
    {
        "id":  172,
        "name":  "^zW-05",
        "bot_class":  "Assault",
        "health":  43,
        "damage":  99,
        "armor":  37,
        "catchphrase":  "10011100101000000011001100101100011011011",
        "avatar_url":  "https://robohash.org/velitfacerequo.png?size=300x300\u0026set=set1"
    },
    {
        "id":  173,
        "name":  "o-93",
        "bot_class":  "Support",
        "health":  82,
        "damage":  22,
        "armor":  78,
        "catchphrase":  "00100101111111101000101110011101110",
        "avatar_url":  "https://robohash.org/delenitietqui.png?size=300x300\u0026set=set1"
    },
    {
        "id":  174,
        "name":  "Ayc-42",
        "bot_class":  "Support",
        "health":  89,
        "damage":  27,
        "armor":  66,
        "catchphrase":  "00011011100110100111110100101000011",
        "avatar_url":  "https://robohash.org/exeaut.png?size=300x300\u0026set=set1"
    },
    {
        "id":  175,
        "name":  "ef-95",
        "bot_class":  "Defender",
        "health":  44,
        "damage":  38,
        "armor":  85,
        "catchphrase":  "001111111101111100100100100010010001010001111",
        "avatar_url":  "https://robohash.org/sedincidunteos.png?size=300x300\u0026set=set1"
    },
    {
        "id":  176,
        "name":  "tL-53",
        "bot_class":  "Assault",
        "health":  65,
        "damage":  100,
        "armor":  25,
        "catchphrase":  "110001010000010100100110001001010010011",
        "avatar_url":  "https://robohash.org/eosquasiblanditiis.png?size=300x300\u0026set=set1"
    },
    {
        "id":  177,
        "name":  "u-94",
        "bot_class":  "Defender",
        "health":  47,
        "damage":  26,
        "armor":  92,
        "catchphrase":  "001010111011001001110010110110110",
        "avatar_url":  "https://robohash.org/quiaesserepudiandae.png?size=300x300\u0026set=set1"
    },
    {
        "id":  178,
        "name":  "Cc-34",
        "bot_class":  "Defender",
        "health":  49,
        "damage":  27,
        "armor":  98,
        "catchphrase":  "0111000100001110011100101001001001",
        "avatar_url":  "https://robohash.org/quoassumendadolorem.png?size=300x300\u0026set=set1"
    },
    {
        "id":  179,
        "name":  "qX-29",
        "bot_class":  "Assault",
        "health":  49,
        "damage":  88,
        "armor":  30,
        "catchphrase":  "000000001000011111101101011101101010111011000110",
        "avatar_url":  "https://robohash.org/quolaborumnisi.png?size=300x300\u0026set=set1"
    },
    {
        "id":  180,
        "name":  "\\-94",
        "bot_class":  "Defender",
        "health":  75,
        "damage":  40,
        "armor":  99,
        "catchphrase":  "010001011110101110011011101001010100010010111110",
        "avatar_url":  "https://robohash.org/invelitmaiores.png?size=300x300\u0026set=set1"
    },
    {
        "id":  181,
        "name":  "J-87",
        "bot_class":  "Support",
        "health":  97,
        "damage":  40,
        "armor":  72,
        "catchphrase":  "1111000010010001110101100101010",
        "avatar_url":  "https://robohash.org/architectocorruptiaccusantium.png?size=300x300\u0026set=set1"
    },
    {
        "id":  182,
        "name":  "p-44",
        "bot_class":  "Defender",
        "health":  70,
        "damage":  31,
        "armor":  82,
        "catchphrase":  "111101011000001011001011001001101000",
        "avatar_url":  "https://robohash.org/vitaeporrovoluptas.png?size=300x300\u0026set=set1"
    },
    {
        "id":  183,
        "name":  "yDg-64",
        "bot_class":  "Defender",
        "health":  58,
        "damage":  37,
        "armor":  87,
        "catchphrase":  "1101001101000111110101010010000100010011011010",
        "avatar_url":  "https://robohash.org/rationeducimusveritatis.png?size=300x300\u0026set=set1"
    },
    {
        "id":  184,
        "name":  "u-40",
        "bot_class":  "Defender",
        "health":  41,
        "damage":  27,
        "armor":  99,
        "catchphrase":  "011010000100010111000000111011011010111111010",
        "avatar_url":  "https://robohash.org/consecteturinventoredolor.png?size=300x300\u0026set=set1"
    },
    {
        "id":  185,
        "name":  "hin-85",
        "bot_class":  "Assault",
        "health":  63,
        "damage":  80,
        "armor":  32,
        "catchphrase":  "00000010101001101010001101011010010101111100",
        "avatar_url":  "https://robohash.org/culpavoluptatemdeleniti.png?size=300x300\u0026set=set1"
    },
    {
        "id":  186,
        "name":  "G-17",
        "bot_class":  "Defender",
        "health":  50,
        "damage":  20,
        "armor":  98,
        "catchphrase":  "1001111001000111010111110010111101111",
        "avatar_url":  "https://robohash.org/isteaeos.png?size=300x300\u0026set=set1"
    },
    {
        "id":  187,
        "name":  "ef-27",
        "bot_class":  "Defender",
        "health":  74,
        "damage":  38,
        "armor":  87,
        "catchphrase":  "1111011100100111110111100111010010100001",
        "avatar_url":  "https://robohash.org/ipsumsedrecusandae.png?size=300x300\u0026set=set1"
    },
    {
        "id":  188,
        "name":  "]W-40",
        "bot_class":  "Captain",
        "health":  80,
        "damage":  35,
        "armor":  75,
        "catchphrase":  "001010010010111000011110101111000110111010",
        "avatar_url":  "https://robohash.org/doloribusetsint.png?size=300x300\u0026set=set1"
    },
    {
        "id":  189,
        "name":  "yXB-04",
        "bot_class":  "Defender",
        "health":  48,
        "damage":  26,
        "armor":  100,
        "catchphrase":  "111110111100011000000000111011101",
        "avatar_url":  "https://robohash.org/quiomniset.png?size=300x300\u0026set=set1"
    },
    {
        "id":  190,
        "name":  "c-38",
        "bot_class":  "Medic",
        "health":  93,
        "damage":  35,
        "armor":  44,
        "catchphrase":  "01000110010101110000101101100110000110000110011000",
        "avatar_url":  "https://robohash.org/nobissimiliquequae.png?size=300x300\u0026set=set1"
    },
    {
        "id":  191,
        "name":  "h-74",
        "bot_class":  "Medic",
        "health":  53,
        "damage":  23,
        "armor":  85,
        "catchphrase":  "11001111001000101000111000110100",
        "avatar_url":  "https://robohash.org/cumomnisautem.png?size=300x300\u0026set=set1"
    },
    {
        "id":  192,
        "name":  "Dls-86",
        "bot_class":  "Assault",
        "health":  49,
        "damage":  86,
        "armor":  29,
        "catchphrase":  "110100100001001011011010011100000010111100100",
        "avatar_url":  "https://robohash.org/nullaconsequatursuscipit.png?size=300x300\u0026set=set1"
    },
    {
        "id":  193,
        "name":  "M-28",
        "bot_class":  "Assault",
        "health":  40,
        "damage":  93,
        "armor":  21,
        "catchphrase":  "00000101111111110101111000010101",
        "avatar_url":  "https://robohash.org/eumdoloredoloribus.png?size=300x300\u0026set=set1"
    },
    {
        "id":  194,
        "name":  "rw-63",
        "bot_class":  "Assault",
        "health":  60,
        "damage":  98,
        "armor":  26,
        "catchphrase":  "11101101111011101001100000011100101110",
        "avatar_url":  "https://robohash.org/molestiaenihilautem.png?size=300x300\u0026set=set1"
    },
    {
        "id":  195,
        "name":  "^-52",
        "bot_class":  "Medic",
        "health":  81,
        "damage":  32,
        "armor":  48,
        "catchphrase":  "0111111001000010010100010110010",
        "avatar_url":  "https://robohash.org/aliasquoest.png?size=300x300\u0026set=set1"
    },
    {
        "id":  196,
        "name":  "obm-92",
        "bot_class":  "Support",
        "health":  93,
        "damage":  23,
        "armor":  67,
        "catchphrase":  "011011110001101100011000100111010100011000010",
        "avatar_url":  "https://robohash.org/nulladoloratque.png?size=300x300\u0026set=set1"
    },
    {
        "id":  197,
        "name":  "LvH-26",
        "bot_class":  "Support",
        "health":  84,
        "damage":  26,
        "armor":  55,
        "catchphrase":  "11111100001011110000010011111100111100",
        "avatar_url":  "https://robohash.org/commodiidasperiores.png?size=300x300\u0026set=set1"
    },
    {
        "id":  198,
        "name":  "wr-00",
        "bot_class":  "Assault",
        "health":  67,
        "damage":  84,
        "armor":  32,
        "catchphrase":  "111110001100001011101010110011111001000001",
        "avatar_url":  "https://robohash.org/dictasolutanatus.png?size=300x300\u0026set=set1"
    },
    {
        "id":  199,
        "name":  "z-06",
        "bot_class":  "Defender",
        "health":  41,
        "damage":  27,
        "armor":  81,
        "catchphrase":  "0101101100101100001100110000101001111010111",
        "avatar_url":  "https://robohash.org/sedhicquo.png?size=300x300\u0026set=set1"
    },
    {
        "id":  200,
        "name":  "fb-83",
        "bot_class":  "Captain",
        "health":  88,
        "damage":  38,
        "armor":  68,
        "catchphrase":  "0111100000101111011000110101110111110000",
        "avatar_url":  "https://robohash.org/teneturquaereiciendis.png?size=300x300\u0026set=set1"
    }
];
