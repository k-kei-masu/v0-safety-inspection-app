import type { WorkType, ChecklistCategory } from "./types"

export const defaultWorkTypes: WorkType[] = [
  {
    id: "crane",
    name: "クレーン作業",
    status: "not-started",
    categories: [],
  },
  {
    id: "excavation",
    name: "掘削作業",
    status: "not-started",
    categories: [],
  },
  {
    id: "utility-pole",
    name: "電柱作業",
    status: "not-started",
    categories: [],
  },
  {
    id: "manhole",
    name: "マンホール作業",
    status: "not-started",
    categories: [],
  },
  {
    id: "other",
    name: "その他現場作業",
    status: "not-started",
    categories: [],
  },
]

export const defaultCategories: ChecklistCategory[] = [
  {
    id: "basic",
    name: "基本装備",
    photos: [], // Photos moved to category level
    items: [
      {
        id: "helmet",
        name: "ヘルメット着用確認",
        rating: null,
        notes: "",
        tips: {
          text: "全作業員がヘルメットを正しく着用していることを確認してください。\n\n【確認ポイント】\n• ヘルメットが頭部にしっかりフィットしているか\n• あご紐が正しく締められているか\n• ヘルメットに亀裂や破損がないか\n• 使用期限が切れていないか（製造から3年以内）\n• 衝撃吸収ライナーが正しく装着されているか\n\n【注意事項】\n作業中は必ずヘルメットを着用し、脱いだり後ろ向きに被ったりしないこと。落下物による頭部への衝撃を防ぐため、正しい着用が重要です。",
          image: "/construction-worker-wearing-safety-helmet-correctl.jpg",
        },
      },
      {
        id: "gloves",
        name: "作業用手袋着用確認",
        rating: null,
        notes: "",
        tips: {
          text: "作業内容に適した手袋を使用しているか確認してください。\n\n【確認ポイント】\n• 作業内容に応じた手袋を選択しているか\n• 手袋に破れや穴がないか\n• サイズが適切で作業しやすいか\n• 滑り止め機能が有効か\n• 汚れや油で滑りやすくなっていないか\n\n【手袋の種類】\n• 一般作業用：綿・革製手袋\n• 重量物取扱：厚手の革手袋\n• 電気作業：絶縁手袋\n• 化学物質取扱：耐薬品手袋",
          image: "/different-types-of-construction-work-gloves.jpg",
        },
      },
      {
        id: "safety-shoes",
        name: "安全靴着用確認",
        rating: null,
        notes: "",
        tips: {
          text: "安全靴が破損していないか、正しく着用されているか確認してください。\n\n【確認ポイント】\n• 先芯入りの安全靴を着用しているか\n• 靴底の滑り止めが摩耗していないか\n• 靴紐がしっかり結ばれているか\n• 破れや穴がないか\n• 足首まで保護されているか（高所作業の場合）\n\n【注意事項】\n重量物の落下や釘の踏み抜きから足を守るため、必ず先芯入りの安全靴を着用すること。スニーカーやサンダルは厳禁です。",
          image: "/steel-toe-safety-boots-for-construction.jpg",
        },
      },
      {
        id: "protective-gear",
        name: "保護具着用確認",
        rating: null,
        notes: "",
        tips: {
          text: "作業内容に応じた適切な保護具を着用しているか確認してください。\n\n【確認ポイント】\n• 反射ベスト・安全チョッキの着用\n• 保護メガネ・ゴーグルの着用（粉塵・飛散物作業時）\n• 防塵マスク・呼吸用保護具の着用（必要時）\n• 耳栓・イヤーマフの着用（騒音作業時）\n• 溶接面・遮光メガネ（溶接作業時）\n\n【作業別保護具】\n各作業の危険性に応じて、適切な保護具を選択・着用することが重要です。",
          image: "/construction-worker-wearing-full-protective-equipm.jpg",
        },
      },
    ],
  },
  {
    id: "fall-prevention",
    name: "墜落防止対策",
    photos: [], // Photos moved to category level
    items: [
      {
        id: "harness",
        name: "安全帯・ハーネス装着確認",
        rating: null,
        notes: "",
        tips: {
          text: "安全帯が正しく装着され、フックが確実に掛けられているか確認してください。\n\n【確認ポイント】\n• フルハーネス型安全帯を使用しているか（2m以上の高所作業）\n• 肩・腰・股のベルトが正しく調整されているか\n• ランヤードが適切な長さか\n• フックが確実にライフラインに掛けられているか\n• ショックアブソーバーが正常に機能するか\n• 使用前点検を実施しているか\n\n【重要】\n墜落時の衝撃を分散させるため、必ずフルハーネス型を使用すること。一本吊り型は使用禁止です。",
          image: "/full-body-safety-harness-properly-worn-by-construc.jpg",
        },
      },
      {
        id: "lifeline",
        name: "ライフライン設置確認",
        rating: null,
        notes: "",
        tips: {
          text: "ライフラインが適切に設置されているか確認してください。\n\n【確認ポイント】\n• 親綱（ライフライン）が堅固な構造物に固定されているか\n• 適切な強度のロープ・ワイヤーを使用しているか\n• たるみや損傷がないか\n• 取付位置が適切か（作業範囲をカバー）\n• 複数人で使用する場合、強度は十分か\n• 垂直・水平ライフラインの区別と使用方法\n\n【設置基準】\n親綱の取付点は、作業者の墜落を確実に止められる強度（5kN以上）が必要です。",
          image: "/lifeline-safety-rope-system-on-construction-site.jpg",
        },
      },
      {
        id: "scaffolding",
        name: "足場の安全性確認",
        rating: null,
        notes: "",
        tips: {
          text: "足場が安定しており、手すりが設置されているか確認してください。\n\n【確認ポイント】\n• 足場板が適切に敷かれているか（隙間なし）\n• 手すり（上段・中段・下段）が設置されているか\n• 足場の揺れや傾きがないか\n• 昇降設備が安全に使用できるか\n• 足場板の固定が確実か\n• 作業床の幅が十分か（40cm以上）\n• 開口部に養生・手すりがあるか\n\n【点検頻度】\n毎日作業開始前に点検を実施し、異常があれば直ちに補修すること。",
          image: "/safe-scaffolding-with-guardrails-on-construction-s.jpg",
        },
      },
    ],
  },
  {
    id: "drop-prevention",
    name: "落下防止対策",
    photos: [], // Photos moved to category level
    items: [
      {
        id: "rigging",
        name: "玉掛け作業確認",
        rating: null,
        notes: "",
        tips: {
          text: "ワイヤーロープやスリングが適切に使用されているか確認してください。\n\n【確認ポイント】\n• 玉掛け用具に損傷・変形がないか\n• 荷の重量に対して適切な用具を選定しているか\n• 吊り角度が適切か（60度以内推奨）\n• 荷の重心位置を考慮しているか\n• 合図方法が明確か\n• 玉掛け作業者の資格確認\n• 吊り荷の下に人がいないか\n\n【安全係数】\nワイヤーロープは安全係数6以上、繊維スリングは安全係数7以上のものを使用すること。",
          image: "/proper-rigging-and-slinging-technique-with-wire-ro.jpg",
        },
      },
      {
        id: "equipment-check",
        name: "機材点検確認",
        rating: null,
        notes: "",
        tips: {
          text: "使用する機材に破損や異常がないか確認してください。\n\n【確認ポイント】\n• 始業前点検を実施しているか\n• 油圧・空圧系統に漏れがないか\n• ブレーキ・クラッチの作動確認\n• 警報装置・ランプの動作確認\n• ワイヤー・チェーンの摩耗・損傷確認\n• 点検記録の記入\n• 不具合機材の使用禁止措置\n\n【点検項目】\n日常点検・定期点検を確実に実施し、記録を保管すること。異常発見時は直ちに使用を中止し、責任者に報告。",
          image: "/construction-equipment-inspection-checklist.jpg",
        },
      },
      {
        id: "securing",
        name: "資材固定確認",
        rating: null,
        notes: "",
        tips: {
          text: "資材が適切に固定され、落下の危険がないか確認してください。\n\n【確認ポイント】\n• 資材が安定した場所に置かれているか\n• 積み重ねが適切な高さか（崩れない高さ）\n• ロープ・ネットで固定されているか\n• 風による飛散の危険はないか\n• 通路・作業エリアに支障がないか\n• 重量物が下、軽量物が上に配置されているか\n• 仮置き場の整理整頓\n\n【注意事項】\n高所からの資材落下は重大災害につながります。確実な固定と整理整頓を徹底すること。",
          image: "/construction-materials-properly-secured-and-organi.jpg",
        },
      },
    ],
  },
]
