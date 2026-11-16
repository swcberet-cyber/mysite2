import { mkdir, copyFile, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile('index.html', 'utf8');
const css = await readFile('styles.css', 'utf8');
const script = await readFile('script.js', 'utf8');
for (const section of ['about', 'services', 'contact']) {
  assert(html.includes(`id="${section}"`), `필수 영역 누락: ${section}`);
}
assert.equal((html.match(/class="service-card"/g) || []).length, 3, '서비스는 3개여야 합니다.');
assert(html.includes('href="mailto:') && html.includes('href="tel:'), '이메일/전화 문의 링크가 필요합니다.');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
  assert(html.includes(`id="${id}"`), `대상 없는 메뉴 링크: ${id}`);
}
assert(css.includes('@media(max-width:760px)'), '모바일 레이아웃이 필요합니다.');
assert(script.includes("setMenu(false)"), '모바일 메뉴 초기화가 필요합니다.');
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js']) {
  await copyFile(file, `dist/${file}`);
}
console.log('Build complete: HTML, CSS, JavaScript → dist/');
console.log('Verified: navigation targets, 3 services, email/phone links, mobile layout.');
