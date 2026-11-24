/* ==========================================================================
   Utilities — Pure-JS SHA-256 (works on file:// & https://), Escaping,
   Export/Download Helpers, Date Formatting, Sound Gong (60s timer)
   ========================================================================== */

window.ZakovatApp = window.ZakovatApp || {};

(function (App) {
  'use strict';

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDateUz(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  function formatDateTimeUz(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return String(isoStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
  }

  function generateId(prefix) {
    const rand = Math.random().toString(36).slice(2, 7);
    const ts = Date.now().toString(36).slice(-4);
    return `${prefix}_${ts}${rand}`;
  }

  function bumpPatchVersion(ver) {
    const match = String(ver || '1.0.0').match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) return '1.0.1';
    return `${match[1]}.${match[2]}.${parseInt(match[3], 10) + 1}`;
  }

  /* Pure synchronous UTF-8 SHA-256 (FIPS 180-4) — works identically on file:// and https:// */
  function sha256(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }

    const utf8 = unescape(encodeURIComponent(String(ascii)));
    const maxWord = Math.pow(2, 32);
    const iMax = utf8.length;
    const words = [];
    const asciiBitLength = iMax * 8;

    const hash = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let str = utf8 + '\x80';
    while ((str.length % 64) - 56) str += '\x00';
    for (let i = 0; i < str.length; i++) {
      const j = str.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (let j = 0; j < words.length;) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash.slice(0);

      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0);
        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

        hash.unshift((temp1 + temp2) | 0);
        hash[4] = (hash[4] + temp1) | 0;
        hash.pop();
      }

      for (let i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    let result = '';
    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  }

  function buildDeployJsContent(dataObj) {
    const clean = JSON.parse(JSON.stringify(dataObj));
    const jsonText = JSON.stringify(clean, null, 2);
    return (
      `/**\n` +
      ` * Universitet Zakovat Klubi — Statik ma'lumotlar bazasi\n` +
      ` * Versiya: ${clean.version || '1.0.0'}\n` +
      ` * Yangilangan sana: ${clean.updatedAt || new Date().toISOString()}\n` +
      ` * Qayta deploy qilish uchun ushbu faylni data/zakovat-data.js o'rniga joylashtiring.\n` +
      ` */\n` +
      `window.ZAKOVAT_DATA = ${jsonText};\n`
    );
  }

  function buildPrintablePacketHtml(title, subtitle, questions, includeAnswers) {
    const rows = questions
      .map((q, idx) => {
        const num = q.number || idx + 1;
        const handout = q.handoutText
          ? `<div class="handout"><strong>Tarqatma material:</strong><br>${escapeHtml(q.handoutText).replace(/\n/g, '<br>')}</div>`
          : '';
        const ansBlock = includeAnswers
          ? `<div class="ans">
              <div><strong>JAVOB:</strong> ${escapeHtml(q.answer)}</div>
              ${q.accepted ? `<div><strong>QABUL QILINADI:</strong> ${escapeHtml(q.accepted)}</div>` : ''}
              ${q.comment ? `<div><strong>IZOH:</strong> ${escapeHtml(q.comment).replace(/\n/g, '<br>')}</div>` : ''}
              ${q.author || q.source ? `<div class="meta">${q.author ? `Muallif: ${escapeHtml(q.author)}` : ''}${q.author && q.source ? ' &nbsp;|&nbsp; ' : ''}${q.source ? `Manba: ${escapeHtml(q.source)}` : ''}</div>` : ''}
            </div>`
          : '';
        return `
          <div class="q-item">
            <div class="q-head"><span class="q-num">${num}-savol</span>${q.topic ? `<span class="q-topic">${escapeHtml(q.topic)}</span>` : ''}</div>
            ${handout}
            <div class="q-body">${escapeHtml(q.question).replace(/\n/g, '<br>')}</div>
            ${ansBlock}
          </div>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: 'Segoe UI', Inter, Arial, sans-serif; color: #111; max-width: 820px; margin: 32px auto; padding: 0 24px; line-height: 1.55; }
    .doc-head { border-bottom: 2px solid #cba672; padding-bottom: 14px; margin-bottom: 24px; }
    .doc-head h1 { margin: 0 0 6px; font-size: 22px; }
    .doc-head p { margin: 0; color: #555; font-size: 13px; }
    .q-item { border: 1px solid #e2e2e8; border-radius: 12px; padding: 16px 20px; margin-bottom: 14px; page-break-inside: avoid; }
    .q-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .q-num { display: inline-block; background: #fffaf3; border: 1px solid #cba672; color: #8c6836; font-weight: 700; font-size: 13px; padding: 3px 12px; border-radius: 100px; }
    .q-topic { font-size: 12px; color: #666; }
    .handout { background: #fffaf3; border-left: 3px solid #cba672; padding: 10px 12px; margin-bottom: 10px; font-size: 13.5px; }
    .q-body { font-size: 15px; margin-bottom: 10px; }
    .ans { border-top: 1px dashed #ccc; padding-top: 10px; margin-top: 10px; font-size: 14px; }
    .ans > div { margin-bottom: 5px; }
    .meta { font-size: 12px; color: #666; margin-top: 6px; }
    @media print { body { margin: 12px; } }
  </style>
</head>
<body>
  <div class="doc-head">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(subtitle)} &bull; Jami: ${questions.length} ta savol</p>
  </div>
  ${rows}
</body>
</html>`;
  }

  function buildPlainTextPacket(title, subtitle, questions, includeAnswers) {
    const lines = [
      title.toUpperCase(),
      subtitle,
      `Jami savollar: ${questions.length} ta`,
      '='.repeat(60),
      ''
    ];
    questions.forEach((q, idx) => {
      const num = q.number || idx + 1;
      lines.push(`${num}-SAVOL${q.topic ? ` [${q.topic}]` : ''}`);
      if (q.handoutText) {
        lines.push(`Tarqatma: ${q.handoutText}`);
      }
      lines.push(q.question);
      if (includeAnswers) {
        lines.push(`Javob: ${q.answer}`);
        if (q.accepted) lines.push(`Qabul qilinadi: ${q.accepted}`);
        if (q.comment) lines.push(`Izoh: ${q.comment}`);
        if (q.author) lines.push(`Muallif: ${q.author}`);
        if (q.source) lines.push(`Manba: ${q.source}`);
      }
      lines.push('-'.repeat(50));
      lines.push('');
    });
    return lines.join('\n');
  }

  /* Subtle authentic Zakovat bell / chime via Web Audio API */
  function playTimerTone(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type === 'end' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(type === 'end' ? 523.25 : 880, ctx.currentTime);
      if (type === 'end') {
        osc.frequency.exponentialRampToValueAtTime(392, ctx.currentTime + 0.45);
      }
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (type === 'end' ? 0.65 : 0.2));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (type === 'end' ? 0.68 : 0.22));
    } catch (_) {
      /* ignore audio errors */
    }
  }

  /* Toast system */
  function showToast(message, type) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type || ''}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast(successMsg || 'Nusxalandi!', 'success'),
        () => fallbackCopy(text, successMsg)
      );
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Nusxalandi!', 'success');
    } catch (_) {
      showToast('Nusxalashda xatolik yuz berdi', 'error');
    }
    document.body.removeChild(ta);
  }

  /* Smart Bulk Question Parser for Uzbek Zakovat formats */
  function parseBulkQuestions(rawText, defaults) {
    const text = String(rawText || '').trim();
    if (!text) return [];

    // Split by explicit "---" separators or numbered question starts ("1-savol", "Savol 1", "1.")
    let blocks = [];
    if (/^\s*---+\s*$/m.test(text)) {
      blocks = text.split(/^\s*---+\s*$/m).map((b) => b.trim()).filter(Boolean);
    } else {
      // Split before lines starting with "1-savol", "Savol 1", "1)" etc. when followed later by "Javob"
      const splitPattern = /(?=^(?:\d+\s*[-.)]\s*(?:savol)?|savol\s*#?\d*)\s*[:.]?)/gim;
      const parts = text.split(splitPattern).map((p) => p.trim()).filter(Boolean);
      blocks = parts.length > 1 ? parts : text.split(/\n{2,}(?=\d+\s*[-.)]|savol)/i).map((p) => p.trim()).filter(Boolean);
    }

    const parsed = [];
    let nextNum = (defaults && defaults.startNumber) || 1;

    blocks.forEach((block) => {
      const lines = block.split(/\r?\n/);
      let number = nextNum;
      let questionLines = [];
      let answer = '';
      let accepted = '';
      let comment = '';
      let author = '';
      let source = '';
      let handoutText = '';
      let currentField = 'question';

      lines.forEach((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) return;

        // First line number detection
        if (idx === 0) {
          const numMatch = line.match(/^(\d+)\s*[-.)]\s*(?:savol)?\s*[:.]?\s*(.*)$/i) ||
                           line.match(/^savol\s*#?(\d+)\s*[:.)-]?\s*(.*)$/i);
          if (numMatch) {
            number = parseInt(numMatch[1], 10) || nextNum;
            if (numMatch[2]) questionLines.push(numMatch[2]);
            return;
          }
          const plainSavol = line.match(/^savol\s*[:.]\s*(.*)$/i);
          if (plainSavol) {
            if (plainSavol[1]) questionLines.push(plainSavol[1]);
            return;
          }
        }

        const fieldMatch = line.match(
          /^(javob|to['‘’`]g['‘’`]ri javob|qabul qilinadi|hisobga olinadi|izoh|sharh|muallif|manba|tarqatma(?:\s+material)?)\s*[:.\-]\s*(.*)$/i
        );
        if (fieldMatch) {
          const key = fieldMatch[1].toLowerCase();
          const val = fieldMatch[2].trim();
          if (key.includes('javob')) {
            currentField = 'answer';
            answer = val;
          } else if (key.includes('qabul') || key.includes('hisob')) {
            currentField = 'accepted';
            accepted = val;
          } else if (key.includes('izoh') || key.includes('sharh')) {
            currentField = 'comment';
            comment = val;
          } else if (key.includes('muallif')) {
            currentField = 'author';
            author = val;
          } else if (key.includes('manba')) {
            currentField = 'source';
            source = val;
          } else if (key.includes('tarqatma')) {
            currentField = 'handoutText';
            handoutText = val;
          }
          return;
        }

        if (currentField === 'question') questionLines.push(line);
        else if (currentField === 'answer') answer = answer ? `${answer} ${line}` : line;
        else if (currentField === 'accepted') accepted = accepted ? `${accepted} ${line}` : line;
        else if (currentField === 'comment') comment = comment ? `${comment}\n${line}` : line;
        else if (currentField === 'author') author = author ? `${author} ${line}` : line;
        else if (currentField === 'source') source = source ? `${source} ${line}` : line;
        else if (currentField === 'handoutText') handoutText = handoutText ? `${handoutText}\n${line}` : line;
      });

      const qText = questionLines.join('\n').trim();
      if (qText) {
        parsed.push({
          id: generateId('q'),
          gameId: (defaults && defaults.gameId) || '',
          number: number,
          topic: (defaults && defaults.topic) || 'Umumiy',
          difficulty: (defaults && defaults.difficulty) || "O'rta",
          question: qText,
          handoutText: handoutText,
          handoutImage: '',
          answer: answer || '(Javob kiritilmagan)',
          accepted: accepted,
          comment: comment,
          author: author,
          source: source,
          solvedBy: '',
          likes: 0,
          published: true
        });
        nextNum = number + 1;
      }
    });

    return parsed;
  }

  App.Utils = {
    escapeHtml,
    formatDateUz,
    formatDateTimeUz,
    generateId,
    bumpPatchVersion,
    sha256,
    downloadFile,
    buildDeployJsContent,
    buildPrintablePacketHtml,
    buildPlainTextPacket,
    playTimerTone,
    showToast,
    copyToClipboard,
    parseBulkQuestions
  };
})(window.ZakovatApp);
