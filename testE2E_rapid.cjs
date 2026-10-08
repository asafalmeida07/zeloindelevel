const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const dir = 'docs/verificacao/plano';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function takeSnap(page, name) {
  await page.screenshot({ path: path.join(dir, name + '.png') });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  try {
    const ts = Date.now();
    const testEmail = 'test_rapid_' + ts + '@example.com';

    await page.goto('http://localhost:5173/cadastro');
    await page.fill('input[placeholder="Seu nome"]', 'Tester Rapid');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Cadastrar")');
    await page.waitForURL('**/equipe', { timeout: 30000 });
    
    await page.locator('button', { hasText: 'Criar equipe' }).first().click();
    await page.fill('input[placeholder="Ex.: MCC"]', 'Equipe Rapid');
    await page.fill('input[type="date"]', '2026-10-01');
    await page.locator('button', { hasText: 'Criar equipe' }).nth(1).click();
    await page.waitForURL('**/', { timeout: 30000 });
    
    await page.goto('http://localhost:5173/plano');
    await page.fill('input[type="number"]', '1');
    await page.click('button:has-text("Adicionar")');
    await page.waitForSelector('text=Grade de Ciclos Programados', { timeout: 15000 });
    
    await page.goto('http://localhost:5173/apenas-continue');
    await page.waitForSelector('text=Ciclo Atual: 1', { timeout: 15000 });

    console.log('Clicking all tasks rapidly...');
    const checkboxes = page.locator('button[class*="check"], button[class*="subCheck"]');
    const count = await checkboxes.count();
    
    // Rapidly click without waiting
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).click({ force: true });
    }
    
    // Wait for all to process
    await page.waitForTimeout(2000);
    
    // Verify no double clicks issue, the Concluir Ciclo button should be available
    const concluirBtn = page.locator('button', { hasText: 'Concluir Ciclo' });
    if (await concluirBtn.isVisible()) {
        console.log('Rapid clicks test: PASSOU - Concluir Ciclo disponível');
        await takeSnap(page, 'rapid-clicks-passou');
    } else {
        throw new Error("Concluir ciclo not visible after rapid clicks");
    }

    process.exit(0);
  } catch (err) {
    console.error('Rapid test failed:', err);
    await takeSnap(page, 'rapid-error');
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
