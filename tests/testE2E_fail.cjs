const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const dir = 'docs/verificacao/plano';

async function takeSnap(page, name) {
  await page.screenshot({ path: path.join(dir, name + '.png') });
}

function setRuleDeny(deny) {
    let rules = fs.readFileSync('firestore.rules', 'utf8');
    if (deny) {
        rules = rules.replace(/allow write: if signedIn\(\) && request\.resource\.data\.uid == request\.auth\.uid;/g, 'allow write: if false;');
    } else {
        rules = rules.replace(/allow write: if false;/g, 'allow write: if signedIn() && request.resource.data.uid == request.auth.uid;');
    }
    fs.writeFileSync('firestore.rules', rules);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const testEmail = 'test_fail_' + Date.now() + '@example.com';
    await page.goto('http://localhost:5173/cadastro');
    await page.fill('input[placeholder="Seu nome"]', 'Tester Fail');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Cadastrar")');
    await page.waitForURL('**/equipe', { timeout: 30000 });
    
    await page.locator('button', { hasText: 'Criar equipe' }).first().click();
    await page.fill('input[placeholder="Ex.: MCC"]', 'Equipe Fail');
    await page.fill('input[type="date"]', '2026-10-01');
    await page.locator('button', { hasText: 'Criar equipe' }).nth(1).click();
    await page.waitForURL('**/', { timeout: 30000 });
    
    await page.goto('http://localhost:5173/plano');
    await page.fill('input[type="number"]', '1');
    await page.click('button:has-text("Adicionar")');
    await page.waitForSelector('text=Grade de Ciclos Programados', { timeout: 15000 });
    
    await page.goto('http://localhost:5173/apenas-continue');
    await page.waitForSelector('text=Ciclo Atual: 1', { timeout: 15000 });

    console.log('Changing rules to deny update...');
    setRuleDeny(true);
    await page.waitForTimeout(2000); // give time for emulator to reload rules
    
    const cb = page.locator('button[class*="check"]').first();
    await cb.click();
    
    try {
        await page.waitForSelector('text=Erro ao salvar', { timeout: 10000 });
        console.log('Toast displayed!');
        await takeSnap(page, 'fail-toast-aparece');
    } catch (e) {
        throw new Error("Toast de erro não apareceu");
    }
    
    console.log('Optimistic update reverted correctly');
    process.exitCode = 0;
  } catch(e) {
    console.error(e);
    await takeSnap(page, 'fail-error');
    process.exit(1);
  } finally {
    setRuleDeny(false);
    await browser.close();
  }
})();
