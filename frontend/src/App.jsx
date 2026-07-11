import React, { useState, useEffect, useRef } from "react";
import { Input, Badge, ConfigProvider, message } from "antd";
import {
  SendOutlined,
  ReloadOutlined,
  LockFilled,
  SoundOutlined,
  HeartOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

// --- UI TRANSLATIONS ---
const TRANSLATIONS = {
  English: {
    title: "Theramind",
    subtitle: "Your Serene Digital Sanctuary & Journal",
    guestBadge: "Anonymous Guest",
    authBadge: "Journal Connected",
    guestCap: "Guest limit: {left} entries left",
    guestLocked: "Session limit reached",
    signInBtn: "Sign In",
    signOutBtn: "Sign Out",
    enterSession: "Enter as Guest",
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    loginHeader: "Unlock Your Sanctuary",
    loginSub:
      "To save your journal history, unlock unlimited conversations, and choose your animal companion, please sign in.",
    btnSignInAction: "Sign In & Connect",
    languageLabel: "Preferred Language",
    companionLabel: "Companion Animal",
    lockedTooltip: "Sign in to unlock customizations",
    typeThoughts: "Write down your thoughts in this safe space...",
    breathBtn: "Drift & Breathe",
    simulateBtn: "Simulate Session",
    resetBtn: "Reset Journal",
    koalaName: "Peaceful Koala",
    catName: "Serene Kitten",
    dogName: "Drifting Puppy",
    slothName: "Cozy Sloth",
    mouseName: "Dandelion Mouse",
    capybaraName: "Onsen Capybara",
    koalaDesc: "Resting weightlessly on a cloud",
    catDesc: "Floating asleep on a gentle leaf",
    dogDesc: "Drifting peacefully in the breeze",
    slothDesc: "Hanging from a weightless branch",
    mouseDesc: "Floating under a dandelion seed",
    capybaraDesc: "Soaking in a floating hot spring",
    breathingInhale: "Breathe in slowly... feel the light air...",
    breathingHold: "Hold... gently suspended in space...",
    breathingExhale: "Breathe out... let all gravity go...",
    breathingComplete: "Wonderful. Feel the lightness within you.",
    ambientLabel: "Ambient Background Sound",
    ambientNone: "Silent",
    ambientWaves: "Ocean Waves",
    ambientRain: "Soft Rain",
    ambientPurr: "Cat Purr",
    toneLabel: "Voice Articulation Style",
    toneDeep: "Deep & Grounding",
    toneWhisper: "Soft & Whispered",
    toneComfort: "Comforting & Warm",
    volumeLabel: "Background Mix Volume",
  },
  Spanish: {
    title: "Miteraputa",
    subtitle: "Tu Santuario Digital Sereno y Diario",
    guestBadge: "Invitado Anónimo",
    authBadge: "Diario Conectado",
    guestCap: "Límite: {left} entradas restantes",
    guestLocked: "Límite de sesión alcanzado",
    signInBtn: "Iniciar Sesión",
    signOutBtn: "Cerrar Sesión",
    enterSession: "Entrar como Invitado",
    emailPlaceholder: "Correo Electrónico",
    passwordPlaceholder: "Contraseña",
    loginHeader: "Desbloquea tu Santuario",
    loginSub:
      "Para guardar el historial de tu diario, desbloquear conversaciones ilimitadas y elegir tu compañero animal, inicia sesión.",
    btnSignInAction: "Iniciar Sesión y Conectar",
    languageLabel: "Idioma Preferido",
    companionLabel: "Animal de Compañía",
    lockedTooltip: "Inicia sesión para desbloquear",
    typeThoughts: "Escribe tus pensamientos en este espacio seguro...",
    breathBtn: "Flotar y Respirar",
    simulateBtn: "Simular Sesión",
    resetBtn: "Reiniciar Diario",
    koalaName: "Koala Pacífico",
    catName: "Gatito Sereno",
    dogName: "Cachorro Flotante",
    slothName: "Perezoso Acogedor",
    mouseName: "Ratón de Diente de León",
    capybaraName: "Carpincho de Onsen",
    koalaDesc: "Descansando sin gravedad sobre una nube",
    catDesc: "Flotando dormido en una hoja suave",
    dogDesc: "Derivando pacíficamente en la brisa",
    slothDesc: "Colgando de una rama ingrávida",
    mouseDesc: "Flotando bajo una semilla de diente de león",
    capybaraDesc: "Remojándose en una terma flotante",
    breathingInhale: "Inhala lentamente... siente el aire ligero...",
    breathingHold: "Mantén... suavemente suspendido en el espacio...",
    breathingExhale: "Exhala... deja ir toda la gravedad...",
    breathingComplete: "Maravilloso. Siente la ligereza dentro de ti.",
    ambientLabel: "Sonido de Fondo Ambiental",
    ambientNone: "Silencio",
    ambientWaves: "Olas del Océano",
    ambientRain: "Lluvia Suave",
    ambientPurr: "Ronroneo de Gato",
    toneLabel: "Estilo de Articulación Vocal",
    toneDeep: "Profundo y Conectado",
    toneWhisper: "Suave y Susurrado",
    toneComfort: "Cálido y Reconfortante",
    volumeLabel: "Volumen de Mezcla de Fondo",
  },
  Japanese: {
    title: "マイセラピスト",
    subtitle: "穏やかなデジタルの聖域と日記",
    guestBadge: "匿名のゲスト",
    authBadge: "ジャーナル接続中",
    guestCap: "残り {left} 回の入力まで",
    guestLocked: "セッション上限に達しました",
    signInBtn: "サインイン",
    signOutBtn: "サインアウト",
    enterSession: "ゲストとして入る",
    emailPlaceholder: "メールアドレス",
    passwordPlaceholder: "パスワード",
    loginHeader: "聖域をアンロックする",
    loginSub:
      "日記の履歴を保存し、無制限の対話をアンロックし、お気に入りの動物の仲間を選ぶには、サインインしてください。",
    btnSignInAction: "サインインして接続する",
    languageLabel: "優先言語",
    companionLabel: "コンパニオンアニマル",
    lockedTooltip: "サインインしてカスタマイズをアンロックする",
    typeThoughts: "この安全な空間にあなたの考えを書き留めてください...",
    breathBtn: "漂いながら呼吸する",
    simulateBtn: "対話のシミュレーション",
    resetBtn: "ジャーナルのリセット",
    koalaName: "穏やかなコアラ",
    catName: "静かな子猫",
    dogName: "漂う子犬",
    slothName: "のんびりナマケモノ",
    mouseName: "たんぽぽネズミ",
    capybaraName: "温泉カピバラ",
    koalaDesc: "ゲストは雲の上で休んでいます",
    catDesc: "優しい葉っぱの上で眠りながら浮いています",
    dogDesc: "そよ風に乗って穏やかに漂っています",
    slothDesc: "重力のない枝からぶら下がっています",
    mouseDesc: "たんぽぽの綿毛の下で浮かんでいます",
    capybaraDesc: "浮かぶ温泉に浸かっています",
    breathingInhale: "ゆっくり息を吸い込んで... 軽い空気を感じて...",
    breathingHold: "止めて... 空間に優しく浮遊するように...",
    breathingExhale: "息を吐き出して... すべての重力を手放して...",
    breathingComplete: "素晴らしいです。体の中の軽さを感じてください。",
    ambientLabel: "環境の背景音",
    ambientNone: "静音",
    ambientWaves: "海の波の音",
    ambientRain: "優しい雨音",
    ambientPurr: "猫のごろごろ音",
    toneLabel: "声の表現スタイル",
    toneDeep: "深みのあるグラウンディング",
    toneWhisper: "手厚い囁き音",
    toneComfort: "温かく快適な響き",
    volumeLabel: "BGMミックス音量",
  },
  French: {
    title: "Mon thérapeute",
    subtitle: "Votre sanctuaire numérique serein et journal",
    guestBadge: "Invité Anonyme",
    authBadge: "Journal Connecté",
    guestCap: "Limite : {left} entrées restantes",
    guestLocked: "Limite de session atteinte",
    signInBtn: "Se Connecter",
    signOutBtn: "Se Déconnecter",
    enterSession: "Entrer comme Invité",
    emailPlaceholder: "Adresse E-mail",
    passwordPlaceholder: "Mot de passe",
    loginHeader: "Déverrouillez votre Sanctuaire",
    loginSub:
      "Pour enregistrer l'historique de votre journal, déverrouiller des conversations illimitées et choisir votre compagnon animal, veuillez vous connecter.",
    btnSignInAction: "Se connecter & Lier",
    languageLabel: "Langue Préférée",
    companionLabel: "Animal Compagnon",
    lockedTooltip: "Connectez-vous pour déverrouiller",
    typeThoughts: "Écrivez vos pensées dans cet espace sécurisé...",
    breathBtn: "Flotter & Respirer",
    simulateBtn: "Simuler la Session",
    resetBtn: "Réinitialiser le Journal",
    koalaName: "Koala Paisible",
    catName: "Chaton Serein",
    dogName: "Chiot Dérivant",
    slothName: "Paresseux Douillet",
    mouseName: "Souris Pissenlit",
    capybaraName: "Capybara d'Onsen",
    koalaDesc: "Se repose en apesanteur sur un nuage",
    catDesc: "Flotte endormi sur une feuille délicate",
    dogDesc: "Dérive paisiblement dans la brise",
    slothDesc: "Suspendu à une branche sans gravité",
    mouseDesc: "Flotte sous une graine de pissenlit",
    capybaraDesc: "Se prélasse dans une source chaude flottante",
    breathingInhale: "Inspirez lentement... sentez l'air léger...",
    breathingHold: "Bloquez... doucement suspendu dans l'espace...",
    breathingExhale: "Expirez... laissez aller toute gravité...",
    breathingComplete: "Merveilleux. Sentez la légèreté en vous.",
    ambientLabel: "Son Ambiant d'Arrière-plan",
    ambientNone: "Silencieux",
    ambientWaves: "Vagues de l'Océan",
    ambientRain: "Pluie Douce",
    ambientPurr: "Ronronnement de Chat",
    toneLabel: "Style d'Articulation Vocale",
    toneDeep: "Profond & Ancré",
    toneWhisper: "Doux & Chuchoté",
    toneComfort: "Chaleureux & Réconfortant",
    volumeLabel: "Volume Mix Ambiant",
  },
  German: {
    title: "MeinTherapeut",
    subtitle: "Dein heilsames digitales Tagebuch & Zufluchtsort",
    guestBadge: "Anonymer Gast",
    authBadge: "Tagebuch Verbunden",
    guestCap: "Limit: {left} Einträge übrig",
    guestLocked: "Sitzungslimit erreicht",
    signInBtn: "Anmelden",
    signOutBtn: "Abmelden",
    enterSession: "Als Gast eintreten",
    emailPlaceholder: "E-Mail-Adresse",
    passwordPlaceholder: "Passwort",
    loginHeader: "Schütze deine Zuflucht",
    loginSub:
      "Melde dich an, um deinen Tagebuchverlauf zu sichern, unbegrenzte Gespräche freizuschalten und dein tierisches Begleitwesen zu wählen.",
    btnSignInAction: "Anmelden & Verbinden",
    languageLabel: "Bevorzugte Sprache",
    companionLabel: "Begleitertier",
    lockedTooltip: "Anmelden zum Freischalten",
    typeThoughts: "Schreibe deine Gedanken an diesem sicheren Ort auf...",
    breathBtn: "Schweben & Atmen",
    simulateBtn: "Sitzung Simulieren",
    resetBtn: "Tagebuch Zurücksetzen",
    koalaName: "Friedlicher Koala",
    catName: "Gelassenes Kätzchen",
    dogName: "Treibender Welpe",
    slothName: "Gemütliches Faultier",
    mouseName: "Löwenzahn-Maus",
    capybaraName: "Onsen-Wasserschwein",
    koalaDesc: "Ruht schwerelos auf einer weichen Wolke",
    catDesc: "Treibt schlafend auf einem sanften Blatt",
    dogDesc: "Treibt friedlich in der sanften Brise",
    slothDesc: "Hängt an einem schwerelosen Ast",
    mouseDesc: "Schwebt unter einem kleinen Löwenzahnsamen",
    capybaraDesc: "Badet in einer schwebenden heißen Quelle",
    breathingInhale: "Atme langsam ein... spüre die leichte Luft...",
    breathingHold: "Halte inne... sanft schwebend im Raum...",
    breathingExhale: "Atme aus... lass alle Schwerkraft los...",
    breathingComplete: "Wunderbar. Spüre die Leichtigkeit in dir.",
    ambientLabel: "Umgebende Hintergrundgeräusche",
    ambientNone: "Stumm",
    ambientWaves: "Meereswellen",
    ambientRain: "Sanfter Regen",
    ambientPurr: "Katzenschnurren",
    toneLabel: "Vokaler Artikulationsstil",
    toneDeep: "Tief & Erdend",
    toneWhisper: "Sanft & Geflüstert",
    toneComfort: "Beruhigend & Warm",
    volumeLabel: "Hintergrund Mix-Lautstärke",
  },
  Italian: {
    title: "Mioterapista",
    subtitle: "Il tuo santuario digitale sereno e diario",
    guestBadge: "Ospite Anonimo",
    authBadge: "Diario Connesso",
    guestCap: "Limite: {left} inserimenti rimasti",
    guestLocked: "Limite di sessione raggiunto",
    signInBtn: "Accedi",
    signOutBtn: "Esci",
    enterSession: "Entra come Ospite",
    emailPlaceholder: "Indirizzo E-mail",
    passwordPlaceholder: "Password",
    loginHeader: "Sblocca il tuo Santuario",
    loginSub:
      "Per salvare la cronologia del diario, sbloccare conversazioni illimitate e scegliere il tuo compagno animale, accedi.",
    btnSignInAction: "Accedi & Connetti",
    languageLabel: "Lingua Preferita",
    companionLabel: "Animale Compagno",
    lockedTooltip: "Accedi per sbloccare le modifiche",
    typeThoughts: "Scrivi i tuoi pensieri in questo spazio sicuro...",
    breathBtn: "Fluttua & Respira",
    simulateBtn: "Simula la Sessione",
    resetBtn: "Resetta il Diario",
    koalaName: "Koala Pacifico",
    catName: "Gattino Sereno",
    dogName: "Cucciolo Fluttuante",
    slothName: "Bradipo Accogliente",
    mouseName: "Topo Dente di Leone",
    capybaraName: "Capibara da Onsen",
    koalaDesc: "Riposa senza peso su una nuvola",
    catDesc: "Fluttua addormentato su una foglia leggera",
    dogDesc: "Deriva pacificamente nella brezza",
    slothDesc: "Appeso a un ramo privo di gravità",
    mouseDesc: "Fluttua sotto un seme di soffione",
    capybaraDesc: "Si rilassa in una fonte termale fluttuante",
    breathingInhale: "Inspira lentamente... senti l'aria leggera...",
    breathingHold: "Trattieni... sospeso dolcemente nello spazio...",
    breathingExhale: "Espira... lascia andare tutta la forza di gravità...",
    breathingComplete: "Meraviglioso. Senti la leggerezza dentro di te.",
    ambientLabel: "Suono Ambientale di Sottofondo",
    ambientNone: "Silenzioso",
    ambientWaves: "Onde dell'Oceano",
    ambientRain: "Pioggia Leggera",
    ambientPurr: "Fusa del Gatto",
    toneLabel: "Stile di Articolazione Vocale",
    toneDeep: "Profondo & Radicato",
    toneWhisper: "Soffice & Sussurrato",
    toneComfort: "Caldo & Rassicurante",
    volumeLabel: "Volume Mix Sottofondo",
  },
};

// --- ANIMAL SVG RENDERS ---

// 1. Koala (default, floating on cloud)
const SVGKoala = ({ isTalking }) => (
  <svg
    width="130"
    height="130"
    viewBox="0 0 100 100"
    style={{ overflow: "visible" }}
  >
    {/* Cloud */}
    <path
      d="M15,65 Q5,55 20,48 Q35,32 55,42 Q75,32 80,48 Q95,55 85,65 Q88,78 70,75 Q50,82 30,75 Q12,78 15,65 Z"
      fill="#ebf4f6"
      stroke="#c4dce0"
      strokeWidth="2"
      opacity="0.9"
    />

    {/* Koala Body */}
    <circle cx="50" cy="50" r="20" fill="#a4b0be" />
    <circle cx="50" cy="56" r="14" fill="#ffffff" opacity="0.25" />

    {/* Ears */}
    <circle cx="34" cy="38" r="8" fill="#a4b0be" />
    <circle cx="34" cy="38" r="5" fill="#f1f2f6" />
    <circle cx="66" cy="38" r="8" fill="#a4b0be" />
    <circle cx="66" cy="38" r="5" fill="#f1f2f6" />

    {/* Head */}
    <circle cx="50" cy="44" r="15" fill="#a4b0be" />

    {/* Inner Ears Tuft */}
    <path
      d="M30,36 Q34,32 35,38"
      stroke="#ffffff"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M70,36 Q66,32 65,38"
      stroke="#ffffff"
      strokeWidth="1.5"
      fill="none"
    />

    {/* Nose */}
    <ellipse cx="50" cy="46" rx="3.5" ry="6" fill="#2f3542" />

    {/* Closed eyes (Sleeping) */}
    <path
      d="M41,42 Q44,45 46,42"
      stroke="#2f3542"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M59,42 Q56,45 54,42"
      stroke="#2f3542"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Blushing */}
    <circle cx="38" cy="47" r="2.5" fill="#ff7f50" opacity="0.3" />
    <circle cx="62" cy="47" r="2.5" fill="#ff7f50" opacity="0.3" />

    {/* Arms waving slightly when talking */}
    <motion.path
      d="M32,54 Q25,52 28,47"
      stroke="#a4b0be"
      strokeWidth="4"
      strokeLinecap="round"
      animate={isTalking ? { rotate: [0, 10, 0] } : { rotate: 0 }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      style={{ originX: "32px", originY: "54px" }}
    />
    <motion.path
      d="M68,54 Q75,52 72,47"
      stroke="#a4b0be"
      strokeWidth="4"
      strokeLinecap="round"
      animate={isTalking ? { rotate: [0, -10, 0] } : { rotate: 0 }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      style={{ originX: "68px", originY: "54px" }}
    />
  </svg>
);

// 2. Cat (sleeping kitten on leaf)
const SVGCat = ({ isTalking }) => (
  <svg
    width="130"
    height="130"
    viewBox="0 0 100 100"
    style={{ overflow: "visible" }}
  >
    {/* Floating leaf */}
    <path
      d="M10,55 Q50,25 90,55 Q50,75 10,55 Z"
      fill="#b5cda3"
      stroke="#87a970"
      strokeWidth="2"
    />
    <path
      d="M10,55 Q50,45 90,55"
      stroke="#87a970"
      strokeWidth="1.5"
      fill="none"
      opacity="0.5"
    />

    {/* Sleeping Kitten */}
    {/* Body */}
    <ellipse cx="50" cy="50" rx="18" ry="12" fill="#fca311" />

    {/* Head */}
    <circle cx="38" cy="46" r="10" fill="#fca311" />

    {/* Ears */}
    <polygon points="30,40 32,30 38,38" fill="#e85d04" />
    <polygon points="46,40 44,30 38,38" fill="#e85d04" />

    {/* Tail curled */}
    <path
      d="M68,50 Q75,45 70,38 Q65,34 62,40"
      stroke="#fca311"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Closed eyes */}
    <path
      d="M32,47 Q35,49 37,47"
      stroke="#3d0066"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M43,47 Q41,49 39,47"
      stroke="#3d0066"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Nose & whiskers */}
    <polygon points="38,49 37,51 39,51" fill="#ffb703" />
    <path
      d="M28,48 L22,48 M28,50 L20,51 M48,48 L54,48 M48,50 L56,51"
      stroke="#ffffff"
      strokeWidth="0.8"
      opacity="0.7"
    />

    {/* Mewing / Breathing animation when talking */}
    {isTalking && (
      <motion.circle
        cx="38"
        cy="51"
        r="1.5"
        fill="#ffb703"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.0 }}
      />
    )}
  </svg>
);

// 3. Dog (drifting puppy)
const SVGDog = ({ isTalking }) => (
  <svg
    width="130"
    height="130"
    viewBox="0 0 100 100"
    style={{ overflow: "visible" }}
  >
    {/* Puffy Cloud Support */}
    <path
      d="M20,68 Q10,58 22,50 Q35,38 52,48 Q70,38 78,52 Q92,58 80,68 Q82,78 68,75 Q50,82 32,75 Q18,78 20,68 Z"
      fill="#fceade"
      stroke="#eabfa8"
      strokeWidth="1.5"
      opacity="0.8"
    />

    {/* Sleeping Puppy Body */}
    <ellipse
      cx="50"
      cy="52"
      rx="16"
      ry="20"
      fill="#dfb48c"
      transform="rotate(-15 50 52)"
    />

    {/* Puppy Head */}
    <circle cx="46" cy="40" r="12" fill="#dfb48c" />

    {/* Floppy Ears */}
    <path
      d="M35,36 Q28,42 32,48"
      stroke="#9f7853"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M57,36 Q64,42 60,48"
      stroke="#9f7853"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />

    {/* Muzzle */}
    <ellipse cx="46" cy="45" rx="5" ry="4" fill="#ffffff" opacity="0.6" />
    <circle cx="46" cy="43" r="2.2" fill="#2d2d2d" />

    {/* Closed eyes */}
    <path
      d="M38,39 Q41,41 42,39"
      stroke="#2d2d2d"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M54,39 Q51,41 50,39"
      stroke="#2d2d2d"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Paws */}
    <circle cx="36" cy="62" r="4.5" fill="#dfb48c" />
    <circle cx="64" cy="58" r="4.5" fill="#dfb48c" />

    {/* Small tail wagging when speaking */}
    <motion.path
      d="M58,68 Q64,74 61,78"
      stroke="#9f7853"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      animate={isTalking ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      style={{ originX: "58px", originY: "68px" }}
    />
  </svg>
);

// 4. Sloth (hanging on branch)
const SVGSloth = ({ isTalking }) => (
  <svg
    width="130"
    height="130"
    viewBox="0 0 100 100"
    style={{ overflow: "visible" }}
  >
    {/* Drifting Branch */}
    <path
      d="M10,42 Q50,48 90,42"
      stroke="#8c6239"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Tiny Leaf on Branch */}
    <path
      d="M78,43 Q82,34 86,41 Z"
      fill="#b5cda3"
      stroke="#87a970"
      strokeWidth="1"
    />

    {/* Sloth Body */}
    <ellipse cx="50" cy="54" rx="16" ry="13" fill="#ab917c" />

    {/* Sloth Head */}
    <circle cx="50" cy="63" r="10.5" fill="#ab917c" />

    {/* Face Mask */}
    <ellipse cx="50" cy="64" rx="8" ry="6.5" fill="#ebdcd9" />
    {/* Eyepatch details */}
    <ellipse
      cx="46"
      cy="63"
      rx="2.5"
      ry="3.5"
      fill="#8c6239"
      transform="rotate(-15 46 63)"
    />
    <ellipse
      cx="54"
      cy="63"
      rx="2.5"
      ry="3.5"
      fill="#8c6239"
      transform="rotate(15 54 63)"
    />

    {/* Closed eyes */}
    <circle cx="46" cy="63" r="1" fill="#ffffff" />
    <circle cx="54" cy="63" r="1" fill="#ffffff" />

    {/* Happy mouth */}
    <path
      d="M48,67 Q50,69 52,67"
      stroke="#2d2d2d"
      strokeWidth="1"
      fill="none"
    />

    {/* Hanging Arms */}
    <path
      d="M38,44 C36,48 38,54 44,53"
      stroke="#ab917c"
      strokeWidth="5.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M62,44 C64,48 62,54 56,53"
      stroke="#ab917c"
      strokeWidth="5.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Slow talking sway */}
    {isTalking && (
      <motion.g
        animate={{ y: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <path
          d="M48,67 Q50,70 52,67"
          stroke="#8c6239"
          strokeWidth="1.5"
          fill="none"
        />
      </motion.g>
    )}
  </svg>
);

// 5. Mouse (holding dandelion seed)
const SVGMouse = ({ isTalking }) => (
  <svg
    width="130"
    height="130"
    viewBox="0 0 100 100"
    style={{ overflow: "visible" }}
  >
    {/* Dandelion Fluff/Seed */}
    <path
      d="M50,45 L50,18"
      stroke="#8fa99c"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <g stroke="#e2eee8" strokeWidth="1.5" opacity="0.9">
      <line x1="50" y1="18" x2="35" y2="10" />
      <line x1="50" y1="18" x2="65" y2="10" />
      <line x1="50" y1="18" x2="50" y2="5" />
      <line x1="50" y1="18" x2="42" y2="7" />
      <line x1="50" y1="18" x2="58" y2="7" />
      <line x1="50" y1="18" x2="32" y2="18" />
      <line x1="50" y1="18" x2="68" y2="18" />
    </g>

    {/* Mouse Body */}
    <circle cx="50" cy="55" r="14" fill="#a4a4a4" />

    {/* Ears */}
    <circle cx="38" cy="44" r="7" fill="#a4a4a4" />
    <circle cx="38" cy="44" r="4.5" fill="#fcd3de" />
    <circle cx="62" cy="44" r="7" fill="#a4a4a4" />
    <circle cx="62" cy="44" r="4.5" fill="#fcd3de" />

    {/* Face/Head */}
    <circle cx="50" cy="51" r="11" fill="#a4a4a4" />

    {/* Nose */}
    <circle cx="50" cy="53" r="1.8" fill="#fcd3de" />

    {/* Closed sleeping eyes */}
    <path
      d="M44,49 Q47,51 47,49"
      stroke="#333333"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M56,49 Q53,51 53,49"
      stroke="#333333"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />

    {/* Holding hands */}
    <circle cx="48" cy="45" r="2.5" fill="#a4a4a4" />
    <circle cx="52" cy="45" r="2.5" fill="#a4a4a4" />

    {/* Whiskers twitch when talking */}
    <motion.g
      animate={isTalking ? { scaleY: [1, 1.1, 1] } : { scaleY: 1 }}
      transition={{ repeat: Infinity, duration: 0.6 }}
      style={{ originX: "50px", originY: "51px" }}
    >
      <path
        d="M44,52 L36,51 M44,54 L35,54 M56,52 L64,51 M56,54 L65,54"
        stroke="#ffffff"
        strokeWidth="0.8"
      />
    </motion.g>
  </svg>
);

// 6. Capybara (soaking in floating hot spring)
const SVGCapybara = ({ isTalking }) => (
  <svg
    width="130"
    height="130"
    viewBox="0 0 100 100"
    style={{ overflow: "visible" }}
  >
    {/* Cloud support under spring */}
    <path
      d="M15,62 Q2,58 12,48 Q22,35 48,45 Q70,35 78,48 Q95,58 85,65 Q88,78 70,75 Q50,82 30,75 Q12,78 15,62 Z"
      fill="#ebf4f6"
      stroke="#c4dce0"
      strokeWidth="1.5"
      opacity="0.6"
    />

    {/* Wooden Tub (Hot Spring) */}
    <path
      d="M 22,46 L 78,46 L 72,76 L 28,76 Z"
      fill="#c2a3d3"
      stroke="#492c58"
      strokeWidth="2.5"
    />
    <line x1="35" y1="46" x2="39" y2="76" stroke="#492c58" strokeWidth="1.5" />
    <line x1="50" y1="46" x2="50" y2="76" stroke="#492c58" strokeWidth="1.5" />
    <line x1="65" y1="46" x2="61" y2="76" stroke="#492c58" strokeWidth="1.5" />

    {/* Water */}
    <path d="M 23,49 L 77,49 Q 50,53 23,49 Z" fill="#1b7a90" opacity="0.8" />

    {/* Capybara Head peeking out */}
    <path
      d="M 36,49 C 36,36 43,26 53,26 C 60,26 64,32 64,49 Z"
      fill="#a07855"
    />
    <ellipse cx="64" cy="38" rx="3" ry="5" fill="#a07855" />

    {/* Ears */}
    <circle cx="40" cy="30" r="2.5" fill="#785030" />
    <circle cx="58" cy="28" r="2.5" fill="#785030" />

    {/* Nose/Snout */}
    <path d="M 52,26 Q 64,28 62,38 C 60,42 50,42 48,34 Z" fill="#785030" />

    {/* Closed eyes of absolute relaxation */}
    <path
      d="M 45,33 Q 48,35 49,33"
      stroke="#2a1508"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Lemon/Yuzu floating on head */}
    <circle
      cx="50"
      cy="22"
      r="4"
      fill="#ffc800"
      stroke="#e6b400"
      strokeWidth="1"
    />
    <path d="M50,18 L50,19" stroke="#1e352f" strokeWidth="1" />

    {/* Steam curls */}
    <motion.path
      d="M32,38 Q29,26 34,20"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
      animate={{ y: [-3, -10], opacity: [0.5, 0] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
    />
    <motion.path
      d="M66,35 Q69,22 66,16"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
      animate={{ y: [-3, -10], opacity: [0.5, 0] }}
      transition={{
        repeat: Infinity,
        duration: 2.2,
        ease: "easeOut",
        delay: 1.1,
      }}
    />
  </svg>
);

const CompanionRenderer = ({ animalId, isTalking }) => {
  switch (animalId) {
    case "koala":
      return <SVGKoala isTalking={isTalking} />;
    case "cat":
      return <SVGCat isTalking={isTalking} />;
    case "dog":
      return <SVGDog isTalking={isTalking} />;
    case "sloth":
      return <SVGSloth isTalking={isTalking} />;
    case "mouse":
      return <SVGMouse isTalking={isTalking} />;
    case "capybara":
      return <SVGCapybara isTalking={isTalking} />;
    default:
      return <SVGKoala isTalking={isTalking} />;
  }
};

export default function App() {
  const [userId, setUserId] = useState(null);

  const [language, setLanguage] = useState("English");
  const [companion, setCompanion] = useState("koala");

  // Therapist Voice Selection
  const [selectedVoice, setSelectedVoice] = useState("female"); // 'female' | 'male'

  // Calming Auditory Preferences
  const [voiceTone, setVoiceTone] = useState("comfort"); // 'deep' | 'whisper' | 'comfort'
  const [ambientSound, setAmbientSound] = useState("none"); // 'none' | 'waves' | 'rain' | 'purr'
  const [ambientVolume, setAmbientVolume] = useState(0.3); // Mix volume (0.0 to 1.0)
  const [isSoundSettingsOpen, setIsSoundSettingsOpen] = useState(false);

  // Web Audio Context refs for ambient synthesis
  const audioContextRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const purrOscRef = useRef(null);
  const purrLFORef = useRef(null);
  const gainNodeRef = useRef(null);
  const lfoGainRef = useRef(null);
  const waveLfoRef = useRef(null);

  // App details
  const [inputValue, setInputValue] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isOwlSpeaking, setIsOwlSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content:
        "Hello. I'm here. This is your safe digital sanctuary. Feel free to write down whatever is in your heart right now.",
      translation:
        "Hola. Estoy aquí. Este es tu santuario digital seguro. Siéntete libre de escribir lo que sea que esté en tu corazón en este momento.",
    },
  ]);

  // Breathing state
  const [breathingText, setBreathingText] = useState("");
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("theramindUserId");
    const savedVoice = localStorage.getItem("therapistVoice") || "female";

    if (savedUserId) {
      setUserId(savedUserId);
    }
    
    setSelectedVoice(savedVoice);
  }, []);

  const chatEndRef = useRef(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS["English"];

  const TONE_OPTIONS = [
    { id: "deep", label: "Deep & Grounding", value: t.toneDeep },
    { id: "whisper", label: "Soft & Whispered", value: t.toneWhisper },
    { id: "comfort", label: "Warm & Balanced", value: t.toneComfort },
  ];

  const AMBIENT_OPTIONS = [
    { id: "none", label: t.ambientNone },
    { id: "waves", label: t.ambientWaves },
    { id: "rain", label: t.ambientRain },
    { id: "purr", label: t.ambientPurr },
  ];

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTranslating, breathingText]);

  // Handle ambient sound playback on state changes
  useEffect(() => {
    updateAmbientSound(ambientSound);
    return () => stopAmbientSound();
  }, [ambientSound]);

  // Adjust volume gain node in real-time based on slider value
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const targetGain =
        ambientSound === "waves"
          ? ambientVolume * 0.08
          : ambientSound === "rain"
            ? ambientVolume * 0.04
            : ambientVolume * 0.03;
      // Smooth volume transitions to avoid digital audio pops
      gainNodeRef.current.gain.setTargetAtTime(
        targetGain,
        audioContextRef.current.currentTime,
        0.15,
      );
    }
  }, [ambientVolume, ambientSound]);

  const updateAmbientSound = (soundType) => {
    stopAmbientSound();
    if (soundType === "none") return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const volumeMix = ambientVolume;

      if (soundType === "waves") {
        // Wave synthesis: modulating white noise volume slowly
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        noiseSourceRef.current = source;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 400;
        filter.Q.value = 1.0;

        const gain = ctx.createGain();
        gain.gain.value = volumeMix * 0.08;
        gainNodeRef.current = gain;

        // Wave cycle LFO (8s cycle)
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12;
        waveLfoRef.current = lfo;

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = volumeMix * 0.02;
        lfoGainRef.current = lfoGain;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        lfo.start();
        source.start();
      } else if (soundType === "rain") {
        // Gentle soft rain
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        noiseSourceRef.current = source;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1500;
        filter.Q.value = 0.3;

        const gain = ctx.createGain();
        gain.gain.value = volumeMix * 0.04;
        gainNodeRef.current = gain;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start();
      } else if (soundType === "purr") {
        // Cat purring hum: low frequency oscillators
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = 95;
        purrOscRef.current = osc;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 130;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 25;
        purrLFORef.current = lfo;

        const gain = ctx.createGain();
        gain.gain.value = volumeMix * 0.03;
        gainNodeRef.current = gain;

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = volumeMix * 0.006;
        lfoGainRef.current = lfoGain;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();
      }
    } catch (err) {
      console.warn(
        "Audio synthesis error: User interaction required or context blocked",
        err,
      );
    }
  };

  const stopAmbientSound = () => {
    try {
      if (noiseSourceRef.current) {
        noiseSourceRef.current.stop();
        noiseSourceRef.current = null;
      }
      if (waveLfoRef.current) {
        waveLfoRef.current.stop();
        waveLfoRef.current = null;
      }
      if (purrOscRef.current) {
        purrOscRef.current.stop();
        purrOscRef.current = null;
      }
      if (purrLFORef.current) {
        purrLFORef.current.stop();
        purrLFORef.current = null;
      }
    } catch (e) {}
  };

  // Speech synthesis configuration with voice selection
  const speakText = (text, langName) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // Ensure Web Audio context resumes on user speak request
    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      audioContextRef.current.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const langCodes = {
      English: "en-US",
      Spanish: "es-ES",
      Japanese: "ja-JP",
      French: "fr-FR",
      German: "de-DE",
      Italian: "it-IT",
    };
    utterance.lang = langCodes[langName] || "en-US";

    // Voice selection: Female (calming, soothing) vs Male (grounding, warm)
    const voices = window.speechSynthesis.getVoices();
    
    if (selectedVoice === "female") {
      // Soothing Female Voice
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes("female") || 
        v.name.toLowerCase().includes("woman") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("victoria")
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      // Female voice profile: slightly higher pitch, gentle pace
      utterance.rate = 0.85;  // Slightly slower than normal
      utterance.pitch = 1.0;  // Natural pitch
    } else {
      // Grounding Male Voice
      const maleVoice = voices.find(v => 
        v.name.toLowerCase().includes("male") || 
        v.name.toLowerCase().includes("man") ||
        v.name.toLowerCase().includes("google uk english male") ||
        v.name.toLowerCase().includes("david")
      );
      if (maleVoice) utterance.voice = maleVoice;
      
      // Male voice profile: lower pitch, warm and deliberate
      utterance.rate = 0.9;   // Slightly slower than normal
      utterance.pitch = 0.95; // Warm, slightly deeper tone
    }

    // Apply tone-based adjustments (existing voice tone setting)
    if (voiceTone === "deep") {
      utterance.rate *= 0.85; // Make it even slower
      utterance.pitch *= 0.9; // Make it deeper
    } else if (voiceTone === "whisper") {
      utterance.rate *= 0.95; // Slightly slower
      utterance.pitch *= 1.1; // Slightly higher for whisper effect
    }

    utterance.onstart = () => setIsOwlSpeaking(true);
    utterance.onend = () => setIsOwlSpeaking(false);
    utterance.onerror = () => setIsOwlSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem("theramindToken");
    localStorage.removeItem("theramindUserId");
    setUserId(null);
    setCompanion("koala");
    setAmbientSound("none");
    setVoiceTone("comfort");
    setMessages([
      {
        id: 1,
        role: "ai",
        content:
          "Hello. I'm here. This is your safe digital sanctuary. Feel free to write down whatever is in your heart right now.",
        translation:
          "Hola. Estoy aquí. Este es tu santuario digital seguro. Siéntete libre de escribir lo que sea que esté en tu corazón en este momento.",
      },
    ]);
  };

  // Grounding breathing tempo exercise (4-7-8 rhythm)
  const triggerBreathingExercise = () => {
    if (isBreathingActive) return;
    setIsBreathingActive(true);
    setIsOwlSpeaking(true);

    const stages = [
      { text: t.breathingInhale, dur: 4000 },
      { text: t.breathingHold, dur: 7000 },
      { text: t.breathingExhale, dur: 8000 },
    ];

    let current = 0;
    const runStage = () => {
      if (current >= stages.length) {
        setBreathingText(t.breathingComplete);
        setIsOwlSpeaking(false);
        setTimeout(() => {
          setBreathingText("");
          setIsBreathingActive(false);
        }, 3000);
        return;
      }
      setBreathingText(stages[current].text);
      setTimeout(() => {
        current++;
        runStage();
      }, stages[current].dur);
    };

    runStage();
  };

  // Send message
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      audioContextRef.current.resume();
    }

    const userText = inputValue;
    setInputValue("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userText,
        translation:
          language === "Spanish" ? userText : `[Translated to ${language}]`,
      },
    ]);

    setIsTranslating(true);

    const panicWords = [
      "panic",
      "anxious",
      "scared",
      "stress",
      "ansioso",
      "miedo",
      "estrés",
      "angustia",
      "hilfe",
      "angst",
    ];
    const hasPanic = panicWords.some((w) => userText.toLowerCase().includes(w));

    const token = localStorage.getItem("theramindToken");
    const payload = {
      message: userText,
      language,
    };

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Chat request failed");
        }

        const aiText = data.reply || data.message || "I am here with you.";
        const translationText =
          language === "Spanish"
            ? "Siento la carga de tus pensamientos. Estoy aquí para escucharte."
            : "I feel the weight of your thoughts. I am here to listen.";

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "ai",
            content: aiText,
            translation: translationText,
          },
        ]);

        setIsTranslating(false);
        speakText(aiText, language);

        if (hasPanic) {
          setTimeout(() => {
            triggerBreathingExercise();
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Chat request failed:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "ai",
            content:
              "I am here with you. The connection is momentarily unavailable, but your words matter.",
            translation:
              "Estoy aquí contigo. La conexión está temporalmente indisponible, pero tus palabras importan.",
          },
        ]);
        setIsTranslating(false);
      });
  };

  const openSoundSettings = () => setIsSoundSettingsOpen(true);
  const closeSoundSettings = () => setIsSoundSettingsOpen(false);

  // UI Theme overrides for Ant Design components
  const themeConfig = {
    token: {
      colorPrimary: "#3f8880", // Muted Teal
      borderRadius: 16,
      fontFamily: "Nunito, sans-serif",
      colorBgContainer: "var(--card-bg)",
      colorText: "var(--evergreen)",
    },
    components: {
      Input: {
        activeBorderColor: "#3f8880",
        hoverBorderColor: "#3f8880",
        borderRadius: 12,
        controlHeight: 46,
      },
    },
  };

  // Soft long fades (800ms transition durations)
  const fadeTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      {/* Background drifting pebbles/leaves */}
      <div className="bg-floating-container">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          padding: "24px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        {/* Serene Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: "2px dashed var(--sage)",
            paddingBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "28px" }}>🌿</span>
            <div>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "var(--dark-amethyst)",
                  letterSpacing: "-0.5px",
                }}
              >
                {t.title}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "-2px",
                }}
              >
                {t.subtitle}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Badge
              status="success"
              text={
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "var(--text-muted)",
                  }}
                >
                  {t.authBadge}
                </span>
              }
            />
          </div>
        </div>

        {/* Transition Router */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
          }}
        >
          <AnimatePresence mode="wait">
            {/* VIEW A: SERENE WORKSPACE */}
            {step === "chat" && (
              <motion.div
                key="chat-workspace"
                {...fadeTransition}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "320px 1fr",
                  gap: "24px",
                  alignItems: "stretch",
                }}
              >
                {/* Left Panel: Companion & Customizer Controls */}
                <div
                  className="duo-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    justifyContent: "center",
                  }}
                >
                  {/* Co-regulation Breathing container (4-6 cycles/min + high damping sway) */}
                  <div className="swaying-avatar-wrapper">
                    <div
                      className="breathing-avatar-wrapper"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <CompanionRenderer
                        animalId={companion}
                        isTalking={isOwlSpeaking}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 900,
                        margin: "2px 0 2px 0",
                        color: "var(--dark-amethyst)",
                      }}
                    >
                      {t[`${companion}Name`]}
                    </h3>
                    <span
                      style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                      {t[`${companion}Desc`]}
                    </span>
                  </div>

                  {/* Soft pulsing breathing visualizer dot */}
                  <div
                    style={{
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(36, 76, 61, 0.04)",
                      borderRadius: "12px",
                      border: "1px solid var(--sage)",
                    }}
                  >
                    <motion.div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "var(--muted-teal)",
                        marginRight: "8px",
                      }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{
                        repeat: Infinity,
                        duration: 12,
                        ease: "easeInOut",
                      }} // 12-second rhythmic loop
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        fontWeight: 800,
                      }}
                    >
                      {isBreathingActive
                        ? "Breathing in sync..."
                        : "Rhythmic Breathing Sync"}
                    </span>
                  </div>

                  {/* Settings Panels */}
                  <div
                    style={{
                      borderTop: "2px dashed var(--sage)",
                      paddingTop: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* Preferred Language Select */}
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 800,
                          color: "var(--text-muted)",
                          marginBottom: "6px",
                        }}
                      >
                        {t.languageLabel}
                      </span>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "6px",
                        }}
                      >
                        {["English", "Spanish", "Japanese", "French"].map(
                          (lang) => (
                            <button
                              key={lang}
                              className={`duo-btn ${language === lang ? "duo-btn-green" : "duo-btn-grey"}`}
                              style={{
                                fontSize: "12px",
                                padding: "6px",
                                textTransform: "none",
                              }}
                              onClick={() => {
                                setLanguage(lang);
                              }}
                            >
                              {lang}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Companion animal Unlock Selector */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "var(--text-muted)",
                          }}
                        >
                          {t.companionLabel}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "6px",
                        }}
                      >
                        {[
                          "koala",
                          "cat",
                          "dog",
                          "sloth",
                          "mouse",
                          "capybara",
                        ].map((ani) => {
                          const isActive = companion === ani;
                          const labels = {
                            koala: "🐨",
                            cat: "🐱",
                            dog: "🐶",
                            sloth: "🦥",
                            mouse: "🐭",
                            capybara: "🦦",
                          };
                          return (
                            <button
                              key={ani}
                              className={`duo-btn ${isActive ? "duo-btn-green" : "duo-btn-grey"}`}
                              style={{
                                fontSize: "18px",
                                padding: "6px",
                              }}
                              onClick={() => {
                                setCompanion(ani);
                                message.info(`${t[`${ani}Name`]} chosen.`);
                              }}
                            >
                              {labels[ani]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Voice customization */}
                    <div
                      style={{
                        borderTop: "1px dashed var(--sage)",
                        paddingTop: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {/* Therapist Voice Selection */}
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "var(--text-muted)",
                            marginBottom: "6px",
                          }}
                        >
                          Therapist Voice
                        </span>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "4px",
                          }}
                        >
                          <button
                            className={`duo-btn ${selectedVoice === "female" ? "duo-btn-green" : "duo-btn-grey"}`}
                            style={{ fontSize: "11px", padding: "6px" }}
                            onClick={() => {
                              setSelectedVoice("female");
                              localStorage.setItem("therapistVoice", "female");
                            }}
                          >
                            ♀ Soothing Female
                          </button>
                          <button
                            className={`duo-btn ${selectedVoice === "male" ? "duo-btn-green" : "duo-btn-grey"}`}
                            style={{ fontSize: "11px", padding: "6px" }}
                            onClick={() => {
                              setSelectedVoice("male");
                              localStorage.setItem("therapistVoice", "male");
                            }}
                          >
                            ♂ Grounding Male
                          </button>
                        </div>
                      </div>

                      {/* Voice Tones */}
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "var(--text-muted)",
                            marginBottom: "6px",
                          }}
                        >
                          {t.toneLabel}
                        </span>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "4px",
                          }}
                        >
                          {[
                            { id: "deep", label: "Deep" },
                            { id: "whisper", label: "Whisper" },
                            { id: "comfort", label: "Comfort" },
                          ].map((tone) => (
                            <button
                              key={tone.id}
                              className={`duo-btn ${voiceTone === tone.id ? "duo-btn-green" : "duo-btn-grey"}`}
                              style={{ fontSize: "10px", padding: "4px" }}
                              onClick={() => setVoiceTone(tone.id)}
                            >
                              {tone.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Ambient Layering Selector */}
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "var(--text-muted)",
                            marginBottom: "6px",
                          }}
                        >
                          {t.ambientLabel}
                        </span>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "4px",
                            marginBottom: "8px",
                          }}
                        >
                          {[
                            { id: "none", label: "Silent" },
                            { id: "waves", label: "Ocean" },
                            { id: "rain", label: "Rain" },
                            { id: "purr", label: "Purr" },
                          ].map((noise) => (
                            <button
                              key={noise.id}
                              className={`duo-btn ${ambientSound === noise.id ? "duo-btn-blue" : "duo-btn-grey"}`}
                              style={{ fontSize: "10px", padding: "4px" }}
                              onClick={() => {
                                setAmbientSound(noise.id);
                                if (
                                  audioContextRef.current &&
                                  audioContextRef.current.state === "suspended"
                                ) {
                                  audioContextRef.current.resume();
                                }
                              }}
                            >
                              {noise.label}
                            </button>
                          ))}
                        </div>

                        {/* Ambient Mix Volume Slider */}
                        {ambientSound !== "none" && (
                          <div>
                            <span
                              style={{
                                display: "block",
                                fontSize: "11px",
                                color: "var(--text-muted)",
                              }}
                            >
                              {t.volumeLabel}: {Math.round(ambientVolume * 100)}
                              %
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={ambientVolume}
                              onChange={(e) =>
                                setAmbientVolume(parseFloat(e.target.value))
                              }
                              className="organic-slider"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginTop: "auto",
                    }}
                  >
                    <button
                      className={`duo-btn ${isBreathingActive ? "duo-btn-purple" : "duo-btn-blue"}`}
                      style={{ width: "100%" }}
                      onClick={triggerBreathingExercise}
                      disabled={isBreathingActive}
                    >
                      <HeartOutlined style={{ marginRight: "6px" }} />{" "}
                      {t.breathBtn}
                    </button>
                    <button
                      className="duo-btn duo-btn-grey"
                      style={{ width: "100%" }}
                      onClick={openSoundSettings}
                    >
                      <SoundOutlined style={{ marginRight: "6px" }} /> Sound
                      Settings
                    </button>
                    <button
                      className="duo-btn duo-btn-grey"
                      style={{ width: "100%" }}
                      onClick={handleSignOut}
                    >
                      <ReloadOutlined style={{ marginRight: "6px" }} />{" "}
                      {t.resetBtn}
                    </button>
                  </div>
                </div>

                {/* Right Panel: Calm analog paper chat journal */}
                <div
                  className="duo-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "620px",
                    padding: "24px",
                  }}
                >
                  {/* Header bar */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "2px dashed var(--sage)",
                      paddingBottom: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          color: "var(--dark-amethyst)",
                          fontWeight: 800,
                        }}
                      >
                        Personal Sanctuary Journal
                      </h4>
                      <span
                        style={{ fontSize: "11px", color: "var(--text-muted)" }}
                      >
                        Messages are not logged; session remains weightless.
                      </span>
                    </div>
                  </div>

                  {/* Chat Bubbles */}
                  <div
                    style={{
                      flexGrow: 1,
                      overflowY: "auto",
                      paddingRight: "6px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    {messages.map((msg) => {
                      const isAi = msg.role === "ai";
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{
                            display: "flex",
                            justifyContent: isAi ? "flex-start" : "flex-end",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                              maxWidth: "85%",
                              flexDirection: isAi ? "row" : "row-reverse",
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                border: "2px solid var(--sage)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: isAi
                                  ? "var(--mint)"
                                  : "var(--lavender-blush)",
                                flexShrink: 0,
                                fontSize: "15px",
                              }}
                            >
                              {isAi ? "🍃" : "✍️"}
                            </div>

                            {/* Paper Bubble - Meets AAA Text Contrast Requirements */}
                            <div
                              className="duo-card"
                              style={{
                                padding: "10px 16px",
                                borderRadius: isAi
                                  ? "20px 20px 20px 4px"
                                  : "20px 20px 4px 20px",
                                borderWidth: "2.5px",
                                borderColor: "var(--sage)",
                                backgroundColor: isAi
                                  ? "var(--mint)"
                                  : "var(--lavender-blush)",
                                color: isAi
                                  ? "var(--evergreen)"
                                  : "var(--dark-amethyst)" /* High-accessibility contrast */,
                                boxShadow: "none",
                                paddingLeft: "24px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "15px",
                                  fontWeight: 700,
                                  lineHeight: 1.4,
                                }}
                              >
                                {msg.content}
                              </div>
                              {isAi && (
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--text-muted)",
                                    borderTop: "1px dashed var(--sage)",
                                    paddingTop: "4px",
                                    marginTop: "6px",
                                    fontStyle: "italic",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "12px",
                                  }}
                                >
                                  <span style={{ color: "var(--text-muted)" }}>
                                    {msg.translation}
                                  </span>
                                  <Tooltip title="Listen">
                                    <SoundOutlined
                                      style={{
                                        cursor: "pointer",
                                        color: "var(--evergreen)",
                                      }}
                                      onClick={() =>
                                        speakText(msg.content, language)
                                      }
                                    />
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* 4-7-8 Breathing Overlay */}
                    {isBreathingActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          margin: "10px 0",
                        }}
                      >
                        <div
                          className="duo-card"
                          style={{
                            padding: "12px 24px",
                            backgroundColor: "var(--mint)",
                            border: "2.5px solid var(--sage)",
                            boxShadow: "none",
                            textAlign: "center",
                            maxWidth: "80%",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            🧘
                          </span>
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 800,
                              color: "var(--evergreen)",
                            }}
                          >
                            {breathingText}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Reflection thinking states */}
                    {isTranslating && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "2px solid var(--sage)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "var(--mint)",
                          }}
                        >
                          🍃
                        </div>
                        <div
                          className="duo-card"
                          style={{
                            padding: "10px 16px",
                            borderRadius: "20px 20px 20px 4px",
                            border: "2px solid var(--card-border)",
                            boxShadow: "none",
                            backgroundColor: "#fcfcfc",
                            paddingLeft: "24px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              color: "var(--text-muted)",
                              fontWeight: 800,
                            }}
                          >
                            {t[`${companion}Name`]} is reflecting
                            <motion.span
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: 0.1,
                              }}
                            >
                              .
                            </motion.span>
                            <motion.span
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: 0.3,
                              }}
                            >
                              .
                            </motion.span>
                            <motion.span
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: 0.5,
                              }}
                            >
                              .
                            </motion.span>
                          </span>
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  <Modal
                    wrapClassName="sound-settings-modal"
                    title={
                      <span
                        style={{
                          fontWeight: 900,
                          color: "var(--dark-amethyst)",
                        }}
                      >
                        Sound Settings
                      </span>
                    }
                    open={isSoundSettingsOpen}
                    onCancel={closeSoundSettings}
                    footer={null}
                  >
                    <div
                      style={{ display: "grid", gap: "18px", padding: "0 4px" }}
                    >
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "var(--text-muted)",
                            marginBottom: "8px",
                          }}
                        >
                          Voice tone
                        </span>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: "8px",
                          }}
                        >
                          {TONE_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              className={`duo-btn ${voiceTone === option.id ? "duo-btn-green" : "duo-btn-grey"}`}
                              style={{ fontSize: "11px", padding: "10px 8px" }}
                              onClick={() => setVoiceTone(option.id)}
                            >
                              {option.value}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "var(--text-muted)",
                            marginBottom: "8px",
                          }}
                        >
                          Ambient layering
                        </span>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: "8px",
                          }}
                        >
                          {AMBIENT_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              className={`duo-btn ${ambientSound === option.id ? "duo-btn-purple" : "duo-btn-grey"}`}
                              style={{ fontSize: "11px", padding: "10px 8px" }}
                              onClick={() => updateAmbientSound(option.id)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "var(--text-muted)",
                            marginBottom: "8px",
                          }}
                        >
                          Ambient volume
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            Low
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={ambientVolume}
                            onChange={(e) =>
                              setAmbientVolume(parseFloat(e.target.value))
                            }
                            className="organic-slider"
                            aria-label="Ambient volume mix"
                          />
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            {Math.round(ambientVolume * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Modal>

                  {/* Input form */}
                  <div
                    style={{
                      borderTop: "2px dashed var(--sage)",
                      paddingTop: "16px",
                    }}
                  >
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      style={{ display: "flex", gap: "12px" }}
                    >
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t.typeThoughts}
                        disabled={isTranslating}
                        style={{ flexGrow: 1 }}
                      />
                      <button
                        type="submit"
                        className="duo-btn duo-btn-green"
                        style={{ height: "46px", padding: "0 20px" }}
                        disabled={!inputValue.trim() || isTranslating}
                      >
                        <SendOutlined />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ConfigProvider>
  );
}
