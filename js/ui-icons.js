/* ==========================================================================
   SVG Icons, Heraldic ZAKOVAT Crest Logo (Gold & Monochrome),
   Luxury Dark-Wood & Molten-Gold Animated Hourglass, and Golden Trophy
   ========================================================================== */

window.ZakovatApp = window.ZakovatApp || {};

(function (App) {
  'use strict';

  /* Heraldic ZAKOVAT Crest Logo inspired by zakovatklubi.uz */
  function zakovatLogoSvg(variant) {
    const isMono = variant === 'mono';
    const uid = isMono ? 'zkMono' : 'zkGold';
    const g1 = isMono ? '#4a4a4a' : '#fae8a9';
    const g2 = isMono ? '#1f1f1f' : '#cba672';
    const g3 = isMono ? '#0d0d0d' : '#886830';
    const fillInner = isMono ? '#f5f5f7' : '#120e08';
    const textFill = isMono ? '#111111' : 'url(#' + uid + 'Grad)';

    return `<svg class="brand-logo-svg" viewBox="0 0 156 84" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Zakovat logotipi">
      <defs>
        <linearGradient id="${uid}Grad" x1="12" y1="6" x2="144" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${g1}" />
          <stop offset="50%" stop-color="${g2}" />
          <stop offset="100%" stop-color="${g3}" />
        </linearGradient>
      </defs>
      <!-- Radiating Crown Sunburst -->
      <g stroke="url(#${uid}Grad)" stroke-width="1.8" stroke-linecap="round" opacity="0.9">
        <line x1="78" y1="4" x2="78" y2="18" />
        <line x1="66" y1="6" x2="71" y2="19" />
        <line x1="90" y1="6" x2="85" y2="19" />
        <line x1="55" y1="10" x2="64" y2="20" />
        <line x1="101" y1="10" x2="92" y2="20" />
        <line x1="46" y1="16" x2="57" y2="22" />
        <line x1="110" y1="16" x2="99" y2="22" />
      </g>
      <path d="M48 24 C56 14, 100 14, 108 24" stroke="url(#${uid}Grad)" stroke-width="2.2" fill="none"/>
      <!-- Heraldic Ribbon Shield Frame -->
      <path d="M12 24 H144 L138 35 V55 L144 66 H104 L78 78 L52 66 H12 L18 55 V35 L12 24 Z"
            fill="${fillInner}" stroke="url(#${uid}Grad)" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M20 29 H136 L132 37 V53 L136 61 H102 L78 71.5 L54 61 H20 L24 53 V37 L20 29 Z"
            fill="none" stroke="url(#${uid}Grad)" stroke-width="1" opacity="0.55"/>
      <!-- Bold ZAKOVAT Wordmark -->
      <text x="78" y="53" text-anchor="middle" fill="${textFill}"
            font-family="Inter, Georgia, serif" font-weight="800" font-size="22.5" letter-spacing="2.2">ZAKOVAT</text>
    </svg>`;
  }

  /* Dramatic Luxury Dark-Wood & Molten-Gold Animated Hourglass (zakovatklubi.uz Hero Motif) */
  function heroHourglassSvg() {
    return `<svg class="hero-hourglass-svg" viewBox="0 0 420 460" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zakovat oltin qum soati">
      <defs>
        <radialGradient id="hgAura" cx="50%" cy="54%" r="48%">
          <stop offset="0%" stop-color="#cba672" stop-opacity="0.34"/>
          <stop offset="55%" stop-color="#886830" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="woodDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1b120b"/>
          <stop offset="28%" stop-color="#4e3522"/>
          <stop offset="55%" stop-color="#352214"/>
          <stop offset="85%" stop-color="#5d4029"/>
          <stop offset="100%" stop-color="#170f09"/>
        </linearGradient>
        <linearGradient id="woodDisc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6b4b32"/>
          <stop offset="45%" stop-color="#392516"/>
          <stop offset="100%" stop-color="#180f09"/>
        </linearGradient>
        <linearGradient id="goldMolten" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="#fff4c4"/>
          <stop offset="28%" stop-color="#e7c37c"/>
          <stop offset="65%" stop-color="#b88435"/>
          <stop offset="100%" stop-color="#6e4b16"/>
        </linearGradient>
        <radialGradient id="goldPile" cx="42%" cy="32%" r="65%">
          <stop offset="0%" stop-color="#fff6cf"/>
          <stop offset="35%" stop-color="#dfba72"/>
          <stop offset="72%" stop-color="#9e6d24"/>
          <stop offset="100%" stop-color="#4f330d"/>
        </radialGradient>
        <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.30"/>
          <stop offset="22%" stop-color="#ffffff" stop-opacity="0.06"/>
          <stop offset="75%" stop-color="#cba672" stop-opacity="0.04"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.20"/>
        </linearGradient>
        <filter id="softGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Warm Golden Ambient Aura -->
      <circle cx="215" cy="240" r="195" fill="url(#hgAura)"/>

      <!-- Tilted Hourglass Assembly -->
      <g transform="rotate(-7 210 230)">
        <!-- Back Wooden Pillar -->
        <rect x="200" y="92" width="20" height="278" rx="7" fill="#21150d" opacity="0.75"/>

        <!-- Bottom Wood Base -->
        <ellipse cx="210" cy="390" rx="124" ry="26" fill="#0d0805" opacity="0.8"/>
        <path d="M96 364 C96 346, 324 346, 324 364 V382 C324 401, 96 401, 96 382 Z" fill="url(#woodDisc)" stroke="#7c5a3d" stroke-width="1.2"/>
        <ellipse cx="210" cy="364" rx="114" ry="21" fill="#462f1d" stroke="#8b6645" stroke-width="1.2"/>
        <ellipse cx="210" cy="364" rx="94" ry="15" fill="#281a10" stroke="#694b31" stroke-width="1"/>

        <!-- Glass Chamber Outer Contour -->
        <path d="M138 110 C138 178, 198 214, 203 232 C198 250, 134 288, 134 356 C134 368, 286 368, 286 356 C286 288, 222 250, 217 232 C222 214, 282 178, 282 110 Z"
              fill="url(#glassShine)" stroke="rgba(255,244,218,0.34)" stroke-width="2"/>

        <!-- Upper Remaining Gold Sand Cone -->
        <path d="M168 176 C188 186, 232 186, 252 176 C240 202, 218 220, 210 230 C202 220, 180 202, 168 176 Z"
              fill="url(#goldMolten)" opacity="0.92"/>
        <ellipse cx="210" cy="176" rx="42" ry="7" fill="#fae8a9" opacity="0.85"/>

        <!-- Flowing Molten Gold Stream -->
        <line x1="210" y1="229" x2="210" y2="302" stroke="url(#goldMolten)" stroke-width="3.2" stroke-linecap="round" filter="url(#softGoldGlow)">
          <animate attributeName="opacity" values="0.78;1;0.82" dur="1.8s" repeatCount="indefinite"/>
        </line>
        <!-- Falling Sparkles -->
        <circle cx="210" cy="245" r="2.2" fill="#fff6cf">
          <animate attributeName="cy" values="232;300" dur="1.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.3" dur="1.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="210" cy="268" r="1.8" fill="#fae8a9">
          <animate attributeName="cy" values="232;300" dur="1.4s" begin="0.7s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.2" dur="1.4s" begin="0.7s" repeatCount="indefinite"/>
        </circle>

        <!-- Bottom Molten Gold Sphere/Mound (Iconic zakovatklubi.uz glow) -->
        <path d="M144 352 C144 304, 184 282, 210 278 C236 282, 276 304, 276 352 C276 364, 144 364, 144 352 Z"
              fill="url(#goldPile)" filter="url(#softGoldGlow)"/>
        <!-- Specular Molten Highlight -->
        <ellipse cx="192" cy="316" rx="22" ry="12" transform="rotate(-18 192 316)" fill="#fffbe0" opacity="0.48"/>

        <!-- Glass Specular Reflections -->
        <path d="M150 124 C150 168, 178 196, 194 214" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.32"/>
        <path d="M148 340 C148 300, 172 272, 192 252" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.28"/>
        <path d="M268 128 C268 164, 246 192, 229 212" stroke="#fae8a9" stroke-width="2" stroke-linecap="round" opacity="0.25"/>

        <!-- Left Turned Wooden Pillar -->
        <g>
          <rect x="108" y="96" width="24" height="268" rx="9" fill="url(#woodDark)"/>
          <ellipse cx="120" cy="126" rx="16" ry="7" fill="url(#woodDark)" stroke="#7a583b" stroke-width="0.8"/>
          <ellipse cx="120" cy="140" rx="14" ry="5" fill="url(#woodDark)"/>
          <ellipse cx="120" cy="322" rx="14" ry="5" fill="url(#woodDark)"/>
          <ellipse cx="120" cy="336" rx="16" ry="7" fill="url(#woodDark)" stroke="#7a583b" stroke-width="0.8"/>
        </g>

        <!-- Right Turned Wooden Pillar -->
        <g>
          <rect x="288" y="96" width="24" height="268" rx="9" fill="url(#woodDark)"/>
          <ellipse cx="300" cy="126" rx="16" ry="7" fill="url(#woodDark)" stroke="#7a583b" stroke-width="0.8"/>
          <ellipse cx="300" cy="140" rx="14" ry="5" fill="url(#woodDark)"/>
          <ellipse cx="300" cy="322" rx="14" ry="5" fill="url(#woodDark)"/>
          <ellipse cx="300" cy="336" rx="16" ry="7" fill="url(#woodDark)" stroke="#7a583b" stroke-width="0.8"/>
        </g>

        <!-- Top Carved Wood Crown Cap -->
        <path d="M98 78 C98 59, 322 59, 322 78 V97 C322 116, 98 116, 98 97 Z" fill="url(#woodDisc)" stroke="#8b6645" stroke-width="1.3"/>
        <ellipse cx="210" cy="78" rx="112" ry="20" fill="#593d27" stroke="#9b7552" stroke-width="1.2"/>
        <ellipse cx="210" cy="78" rx="88" ry="13" fill="#3a2617" stroke="#755539" stroke-width="1"/>
        <!-- Subtle Brass Ring Collar -->
        <path d="M138 111 Q210 121 282 111" stroke="#cba672" stroke-width="2.2" fill="none" opacity="0.72"/>
      </g>
    </svg>`;
  }

  /* Golden Trophy with Floating Coins (Search Pill Left Accent like zakovatklubi.uz) */
  function trophyAccentSvg() {
    return `<svg class="hero-search-trophy" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="trGold" x1="10" y1="8" x2="54" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fff4c4"/>
          <stop offset="45%" stop-color="#cba672"/>
          <stop offset="100%" stop-color="#7c5a24"/>
        </linearGradient>
      </defs>
      <circle cx="11" cy="14" r="3.5" fill="#fae8a9" opacity="0.85"/>
      <circle cx="53" cy="19" r="2.8" fill="#cba672" opacity="0.9"/>
      <ellipse cx="12" cy="54" rx="5.5" ry="3" transform="rotate(-30 12 54)" fill="#e7cca5"/>
      <path d="M18 18 H46 V29 C46 39, 39 45, 32 45 C25 45, 18 39, 18 29 V18 Z" fill="url(#trGold)"/>
      <path d="M18 21 H11 C11 30, 14 34, 19 34" stroke="url(#trGold)" stroke-width="3" stroke-linecap="round"/>
      <path d="M46 21 H53 C53 30, 50 34, 45 34" stroke="url(#trGold)" stroke-width="3" stroke-linecap="round"/>
      <rect x="29" y="45" width="6" height="10" fill="url(#trGold)"/>
      <rect x="21" y="54" width="22" height="5" rx="2.5" fill="url(#trGold)"/>
      <rect x="17" y="59" width="30" height="7" rx="3" fill="#2a241c" stroke="#cba672" stroke-width="1.2"/>
    </svg>`;
  }

  /* Crisp Lucide-style UI Icons */
  const ICONS = {
    mail: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    send: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
    search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    cap: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    book: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    helpCircle: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
    trophy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
    bookmark: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    bookmarkFilled: `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    thumbUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>`,
    download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    upload: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
    copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    sliders: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>`,
    timer: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`,
    arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    menu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
    x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    plus: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    chart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`,
    settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    sparkle: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    check: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    layers: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    rocket: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    users: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    fileText: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    refresh: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`
  };

  App.Icons = {
    zakovatLogoSvg,
    heroHourglassSvg,
    trophyAccentSvg,
    get: (name) => ICONS[name] || ''
  };
})(window.ZakovatApp);
