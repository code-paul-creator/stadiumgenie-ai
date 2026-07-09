/**
 * i18n.js
 * Static UI string translations (fast, free, offline) + an optional
 * AI-powered path for translating arbitrary free text (e.g. a fan's
 * own question, or a volunteer announcement) into any language.
 */
const StadiumI18n = (() => {
  const STRINGS = {
    en: {
      appTitle: 'Stadium Companion',
      tagline: 'Your AI guide for FIFA World Cup 2026',
      navHome: 'Overview',
      navNavigate: 'Navigate',
      navCrowd: 'Crowd Watch',
      navAccess: 'Accessibility',
      navTransport: 'Transport',
      navSustain: 'Sustainability',
      navAssistant: 'Ask Anything',
      navOps: 'Ops Console',
      settings: 'Settings',
      askPlaceholder: 'Ask about gates, seats, food, transit...',
      send: 'Send',
      noKeyTitle: 'Add an API key to enable AI answers',
      noKeyBody: 'Static data (maps, crowd levels, transit options) works without a key. Add your own free API key in Settings to unlock AI-generated answers.',
    },
    es: {
      appTitle: 'Compañero de Estadio',
      tagline: 'Tu guía de IA para la Copa Mundial de la FIFA 2026',
      navHome: 'Resumen',
      navNavigate: 'Navegar',
      navCrowd: 'Aforo',
      navAccess: 'Accesibilidad',
      navTransport: 'Transporte',
      navSustain: 'Sostenibilidad',
      navAssistant: 'Preguntar',
      navOps: 'Consola de Operaciones',
      settings: 'Configuración',
      askPlaceholder: 'Pregunta sobre puertas, asientos, comida, transporte...',
      send: 'Enviar',
      noKeyTitle: 'Añade una clave de API para habilitar respuestas de IA',
      noKeyBody: 'Los datos estáticos funcionan sin clave. Añade tu propia clave gratuita en Configuración para desbloquear respuestas generadas por IA.',
    },
    fr: {
      appTitle: 'Compagnon de Stade',
      tagline: 'Votre guide IA pour la Coupe du Monde FIFA 2026',
      navHome: 'Aperçu',
      navNavigate: 'Naviguer',
      navCrowd: 'Affluence',
      navAccess: 'Accessibilité',
      navTransport: 'Transport',
      navSustain: 'Durabilité',
      navAssistant: 'Poser une question',
      navOps: 'Console Opérations',
      settings: 'Paramètres',
      askPlaceholder: 'Question sur les portes, sièges, restauration, transport...',
      send: 'Envoyer',
      noKeyTitle: "Ajoutez une clé API pour activer les réponses IA",
      noKeyBody: "Les données statiques fonctionnent sans clé. Ajoutez votre propre clé gratuite dans Paramètres pour débloquer les réponses générées par IA.",
    },
    pt: {
      appTitle: 'Companheiro de Estádio',
      tagline: 'Seu guia de IA para a Copa do Mundo FIFA 2026',
      navHome: 'Visão Geral',
      navNavigate: 'Navegar',
      navCrowd: 'Fluxo de Público',
      navAccess: 'Acessibilidade',
      navTransport: 'Transporte',
      navSustain: 'Sustentabilidade',
      navAssistant: 'Perguntar',
      navOps: 'Console de Operações',
      settings: 'Configurações',
      askPlaceholder: 'Pergunte sobre portões, assentos, comida, transporte...',
      send: 'Enviar',
      noKeyTitle: 'Adicione uma chave de API para ativar respostas de IA',
      noKeyBody: 'Os dados estáticos funcionam sem chave. Adicione sua própria chave gratuita em Configurações para desbloquear respostas geradas por IA.',
    },
    ar: {
      appTitle: 'رفيق الملعب',
      tagline: 'دليلك الذكي لكأس العالم فيفا 2026',
      navHome: 'نظرة عامة',
      navNavigate: 'التنقل',
      navCrowd: 'مراقبة الحشود',
      navAccess: 'إمكانية الوصول',
      navTransport: 'النقل',
      navSustain: 'الاستدامة',
      navAssistant: 'اسأل أي شيء',
      navOps: 'وحدة التشغيل',
      settings: 'الإعدادات',
      askPlaceholder: 'اسأل عن البوابات أو المقاعد أو الطعام أو النقل...',
      send: 'إرسال',
      noKeyTitle: 'أضف مفتاح API لتفعيل إجابات الذكاء الاصطناعي',
      noKeyBody: 'تعمل البيانات الثابتة بدون مفتاح. أضف مفتاحك المجاني الخاص في الإعدادات لفتح الإجابات المولدة بالذكاء الاصطناعي.',
    },
    de: {
      appTitle: 'Stadion-Begleiter',
      tagline: 'Ihr KI-Guide für die FIFA-Weltmeisterschaft 2026',
      navHome: 'Übersicht',
      navNavigate: 'Navigieren',
      navCrowd: 'Besucherstrom',
      navAccess: 'Barrierefreiheit',
      navTransport: 'Transport',
      navSustain: 'Nachhaltigkeit',
      navAssistant: 'Frag mich',
      navOps: 'Betriebskonsole',
      settings: 'Einstellungen',
      askPlaceholder: 'Frage zu Toren, Sitzen, Essen, Transport...',
      send: 'Senden',
      noKeyTitle: 'API-Schlüssel hinzufügen, um KI-Antworten zu aktivieren',
      noKeyBody: 'Statische Daten funktionieren ohne Schlüssel. Fügen Sie Ihren eigenen kostenlosen Schlüssel in den Einstellungen hinzu.',
    },
    ja: {
      appTitle: 'スタジアム・コンパニオン',
      tagline: 'FIFAワールドカップ2026のAIガイド',
      navHome: '概要',
      navNavigate: 'ナビ',
      navCrowd: '混雑状況',
      navAccess: 'アクセシビリティ',
      navTransport: '交通',
      navSustain: 'サステナビリティ',
      navAssistant: '質問する',
      navOps: '運営コンソール',
      settings: '設定',
      askPlaceholder: 'ゲート、座席、食事、交通について質問...',
      send: '送信',
      noKeyTitle: 'AI回答を有効にするにはAPIキーを追加してください',
      noKeyBody: '静的データはキーなしで利用できます。設定でご自身の無料キーを追加してください。',
    },
    hi: {
      appTitle: 'स्टेडियम साथी',
      tagline: 'फीफा वर्ल्ड कप 2026 के लिए आपका AI गाइड',
      navHome: 'अवलोकन',
      navNavigate: 'नेविगेट करें',
      navCrowd: 'भीड़ स्थिति',
      navAccess: 'सुगम्यता',
      navTransport: 'परिवहन',
      navSustain: 'स्थिरता',
      navAssistant: 'कुछ भी पूछें',
      navOps: 'ऑप्स कंसोल',
      settings: 'सेटिंग्स',
      askPlaceholder: 'गेट, सीट, भोजन, परिवहन के बारे में पूछें...',
      send: 'भेजें',
      noKeyTitle: 'AI उत्तर सक्षम करने के लिए API कुंजी जोड़ें',
      noKeyBody: 'स्थिर डेटा बिना कुंजी के काम करता है। AI उत्तर अनलॉक करने के लिए सेटिंग्स में अपनी नि:शुल्क कुंजी जोड़ें।',
    },
  };

  let currentLang = 'en';

  function t(key) {
    return STRINGS[currentLang]?.[key] ?? STRINGS.en[key] ?? key;
  }

  function setLang(code) {
    currentLang = STRINGS[code] ? code : 'en';
    try {
      localStorage.setItem('stadium_lang_v1', currentLang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  function initLang() {
    let saved = 'en';
    try {
      saved = localStorage.getItem('stadium_lang_v1') || 'en';
    } catch {
      /* ignore */
    }
    setLang(saved);
    return currentLang;
  }

  function getLang() {
    return currentLang;
  }

  /**
   * AI-powered translation for free text the static dictionary doesn't cover
   * (e.g. a volunteer's own announcement, or a fan's question echoed back
   * in another language). Falls back gracefully if no key is configured.
   */
  async function translateFreeText(text, targetLangLabel) {
    const clamped = window.StadiumUtils.clampInput(text, 800);
    const system = `You are a precise translator for a FIFA World Cup 2026 stadium assistant app. Translate the user's text into ${targetLangLabel}. Reply with ONLY the translation, no notes or quotation marks.`;
    return window.StadiumAI.ask(system, clamped);
  }

  return { t, setLang, initLang, getLang, STRINGS, translateFreeText };
})();

if (typeof window !== 'undefined') {
  window.StadiumI18n = StadiumI18n;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StadiumI18n;
}
