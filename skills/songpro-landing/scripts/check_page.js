#!/usr/bin/env node
/**
 * 랜딩페이지 자동 점검 (SKILL.md 5단계 "확인"용)
 *
 * 사용법:
 *   node check_page.js <index.html 경로 또는 URL> [--out 폴더] [--links]
 *
 *   --out    스크린샷 저장 폴더 (기본: ./check-result)
 *   --links  외부 링크에 실제로 접속해 응답 코드까지 확인 (네트워크 필요)
 *
 * 점검 항목:
 *   1. 375 / 768 / 1280px 스크린샷 (전체 페이지)
 *   2. 가로 스크롤, 화면 밖으로 넘친 요소
 *   3. 폰트 로딩: document.fonts에서 실제로 불러온 폰트, 실패한 폰트
 *   4. 글자 대비: 보이는 글자마다 WCAG AA 기준(4.5:1, 큰 글자 3:1) 미달 여부
 *   5. 링크: 빈 링크, "#"만 있는 링크, (--links) 깨진 외부 링크
 *   6. <head>: title, description, og:*, theme-color, viewport
 *
 * 필요한 것: Node.js 18+, Playwright
 *   npm i -D playwright && npx playwright install chromium
 *
 * 결과: 문제가 없으면 종료 코드 0, 문제가 있으면 1
 */
const fs = require('fs');
const path = require('path');

// ── 인자 읽기 ─────────────────────────────────────────────
const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
const outDir = path.resolve(outIdx >= 0 ? args[outIdx + 1] : 'check-result');
const checkLinks = args.includes('--links');

if (!target) {
  console.log('사용법: node check_page.js <index.html 또는 URL> [--out 폴더] [--links]');
  process.exit(2);
}

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright가 없습니다. 먼저 설치하세요:\n  npm i -D playwright\n  npx playwright install chromium');
  process.exit(2);
}

const url = /^https?:\/\//.test(target)
  ? target
  : 'file://' + path.resolve(target).replace(/\\/g, '/');

const WIDTHS = [375, 768, 1280];
const problems = [];
const warn = (msg) => problems.push(msg);

// ── 페이지 안에서 실행되는 검사 (브라우저 컨텍스트) ─────────────
function inspectLayout() {
  const vw = document.documentElement.clientWidth;
  const hScroll = document.documentElement.scrollWidth > vw + 1;
  const overflow = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      // 부모가 overflow를 잘라 주면 실제로는 안 보이므로 제외
      let clipped = false;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') { clipped = true; break; }
      }
      if (!clipped) {
        const name = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
          (el.classList[0] ? '.' + el.classList[0] : '');
        overflow.push(`${name} (left ${Math.round(r.left)}, right ${Math.round(r.right)})`);
      }
    }
  }
  return { hScroll, scrollWidth: document.documentElement.scrollWidth, vw, overflow: overflow.slice(0, 10) };
}

function inspectContrast() {
  // 색 문자열 → [r,g,b,a]
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const blend = (top, bottom) => {
    const a = top[3];
    return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a)).concat(1);
  };
  // 요소 뒤에 깔린 배경색을 위로 거슬러 올라가며 합성 (그라데이션·이미지는 판단 불가로 표시)
  const bgOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { unknown: true };
      const c = parse(cs.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
    }
    let color = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) color = blend(layers[i], color);
    return { color };
  };

  const fails = [];
  let unknown = 0;
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim()) continue;
    const el = node.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const fg = parse(cs.color);
    const bg = bgOf(el);
    if (!fg) continue;
    if (bg.unknown) { unknown++; continue; }
    const fgc = blend(fg, bg.color);
    const L1 = lum(fgc), L2 = lum(bg.color);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3 : 4.5;
    if (ratio < need) {
      fails.push(`${ratio.toFixed(2)}:1 (기준 ${need}) "${node.textContent.trim().slice(0, 30)}" ${cs.color} / ${size}px`);
    }
  }
  return { fails: fails.slice(0, 15), total: fails.length, unknown };
}

async function inspectFonts() {
  await document.fonts.ready;
  const faces = [...document.fonts];
  const loaded = [...new Set(faces.filter((f) => f.status === 'loaded').map((f) => f.family.replace(/["']/g, '')))];
  const failed = [...new Set(faces.filter((f) => f.status === 'error').map((f) => f.family.replace(/["']/g, '')))];
  // 실제로 쓰겠다고 선언한 첫 번째 폰트
  const used = [...new Set([...document.querySelectorAll('body, h1, h2, h3, p, a, button')]
    .map((el) => getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/["']/g, '')))];
  const notLoaded = used.filter((u) =>
    !loaded.some((l) => l.toLowerCase() === u.toLowerCase()) &&
    !/^(sans-serif|serif|monospace|system-ui|-apple-system|inherit)$/i.test(u));
  return { loaded, failed, used, notLoaded };
}

function inspectHead() {
  const q = (s) => document.querySelector(s);
  const missing = [];
  if (!document.title.trim()) missing.push('<title>');
  if (!q('meta[name="description"]')?.content) missing.push('meta description');
  if (!q('meta[name="viewport"]')) missing.push('meta viewport');
  if (!q('meta[name="theme-color"]')) missing.push('meta theme-color');
  for (const p of ['og:title', 'og:description', 'og:image']) {
    if (!q(`meta[property="${p}"]`)?.content) missing.push(p);
  }
  return missing;
}

function inspectLinks() {
  const bad = [];
  const external = [];
  for (const a of document.querySelectorAll('a')) {
    const raw = a.getAttribute('href');
    const label = (a.textContent.trim() || a.getAttribute('aria-label') || '(텍스트 없음)').slice(0, 30);
    if (raw === null || raw.trim() === '') bad.push(`href 없음: "${label}"`);
    else if (raw.trim() === '#') bad.push(`"#"만 있음: "${label}"`);
    else if (raw.startsWith('#') && !document.getElementById(decodeURIComponent(raw.slice(1)))) bad.push(`없는 위치로 이동: ${raw} "${label}"`);
    else if (/^https?:/.test(a.href)) external.push(a.href);
  }
  return { bad, external: [...new Set(external)] };
}

// ── 실행 ──────────────────────────────────────────────────
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  console.log(`점검 대상: ${url}\n`);

  try {
    for (const w of WIDTHS) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      await page.emulateMedia({ reducedMotion: 'reduce' }); // 애니메이션 중간 상태 캡처 방지
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(outDir, `screenshot-${w}.png`);
      await page.screenshot({ path: file, fullPage: true });

      const layout = await page.evaluate(inspectLayout);
      if (layout.hScroll) warn(`[${w}px] 가로 스크롤 생김 (페이지 폭 ${layout.scrollWidth}px > 화면 ${layout.vw}px)`);
      layout.overflow.forEach((o) => warn(`[${w}px] 화면 밖으로 넘침: ${o}`));
      console.log(`✓ ${w}px 스크린샷: ${file}`);

      // 폰트·대비·head·링크는 화면 폭과 상관없으므로 1280px에서 한 번만
      if (w === 1280) {
        const fonts = await page.evaluate(inspectFonts);
        console.log(`\n폰트 불러옴: ${fonts.loaded.join(', ') || '(없음)'}`);
        console.log(`페이지가 쓰는 폰트: ${fonts.used.join(', ')}`);
        fonts.failed.forEach((f) => warn(`폰트 불러오기 실패: ${f}`));
        fonts.notLoaded.forEach((f) => warn(`선언했지만 불러오지 않은 폰트 (시스템 폰트로 대체됐을 수 있음): ${f}`));

        const contrast = await page.evaluate(inspectContrast);
        contrast.fails.forEach((f) => warn(`대비 부족 ${f}`));
        if (contrast.total > contrast.fails.length) warn(`대비 부족 ${contrast.total - contrast.fails.length}건 더 있음`);
        if (contrast.unknown) console.log(`(배경이 그라데이션·이미지라 대비를 계산하지 못한 글자 ${contrast.unknown}곳: 스크린샷으로 직접 확인)`);

        (await page.evaluate(inspectHead)).forEach((m) => warn(`<head>에 없음: ${m}`));

        const links = await page.evaluate(inspectLinks);
        links.bad.forEach((b) => warn(`링크 ${b}`));
        console.log(`외부 링크 ${links.external.length}개`);
        if (checkLinks) {
          for (const href of links.external) {
            try {
              let res = await fetch(href, { method: 'HEAD', redirect: 'follow' });
              if (res.status >= 400) res = await fetch(href, { redirect: 'follow' }); // HEAD 거부하는 사이트 대비
              if (res.status >= 400) warn(`깨진 링크 ${res.status}: ${href}`);
            } catch (e) {
              warn(`접속 실패: ${href} (${e.cause?.code || e.message})`);
            }
          }
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log('\n──────── 결과 ────────');
  if (problems.length === 0) {
    console.log('문제 없음. 스크린샷으로 디자인을 한 번 더 눈으로 확인하세요.');
    process.exit(0);
  }
  problems.forEach((p) => console.log('✗ ' + p));
  console.log(`\n문제 ${problems.length}건`);
  process.exit(1);
})().catch((e) => {
  console.error('점검 중 오류:', e.message);
  process.exit(2);
});
