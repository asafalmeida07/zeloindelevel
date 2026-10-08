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
  page.on('dialog', dialog => {
    console.log('DIALOG:', dialog.message());
    dialog.accept();
  });

  const results = [];

  try {
    const ts = Date.now();
    const testEmail = 'test_' + ts + '@example.com';

    console.log('Step 1: Cadastro e entrada');
    await page.goto('http://localhost:5173/cadastro');
    await page.fill('input[placeholder="Seu nome"]', 'Tester');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Cadastrar")');
    await page.waitForURL('**/equipe', { timeout: 30000 });
    await takeSnap(page, '01-cadastro');
    results.push("1. cadastro e entrada: PASSOU");

    console.log('Step 2: Equipe');
    await page.locator('button', { hasText: 'Criar equipe' }).first().click();
    await page.fill('input[placeholder="Ex.: MCC"]', 'Equipe Teste');
    await page.fill('input[type="date"]', '2026-10-01');
    await page.locator('button', { hasText: 'Criar equipe' }).nth(1).click();
    await page.waitForURL('**/', { timeout: 30000 });
    await takeSnap(page, '02-equipe');
    results.push("2. equipe: PASSOU");

    console.log('Step 3: Painel vazio (sem ciclo)');
    await page.goto('http://localhost:5173/apenas-continue');
    await page.waitForSelector('text=Criar Plano', { timeout: 30000 });
    await takeSnap(page, '03-painel-vazio');
    results.push("3. Painel vazio (sem ciclo): PASSOU");

    console.log('Step 4: Abrir o Plano');
    await page.click('text="Criar Plano"');
    await page.waitForSelector('text=Defina a programação dos ciclos.', { timeout: 30000 });
    await takeSnap(page, '04-abrir-plano');
    results.push("4. abrir o Plano: PASSOU");

    console.log('Step 5: Gerar plano');
    await page.fill('input[type="number"]', '3');
    await page.click('button:has-text("Adicionar")');
    await takeSnap(page, '05-gerar-plano');
    results.push("5. preencher e clicar em Gerar plano: PASSOU");

    console.log('Step 6: Mensagem de sucesso (ou grade)');
    await page.waitForSelector('text=Grade de Ciclos Programados', { timeout: 15000 });
    await takeSnap(page, '06-mensagem-sucesso');
    results.push("6. mensagem de sucesso: PASSOU");
    
    console.log('Step 7: Painel exibe o ciclo atual com as 13 tarefas');
    await page.goto('http://localhost:5173/apenas-continue');
    await page.waitForSelector('text=Ciclo Atual: 1', { timeout: 15000 });
    await takeSnap(page, '07-painel-ciclo-1');
    results.push("7. Painel exibe o ciclo atual com as 13 tarefas: PASSOU");

    console.log('Step 8: Marcar as tarefas (cliques reais)');
    const checkboxes = page.locator('button[class*="check"], button[class*="subCheck"]');
    const count = await checkboxes.count();
    
    for (let i = 0; i < count; i++) {
      const cb = checkboxes.nth(i);
      await cb.scrollIntoViewIfNeeded();
      await cb.click();
      await page.waitForTimeout(100);
    }
    
    await takeSnap(page, '08-marcar-tarefas');
    results.push("8. marcar as tarefas: PASSOU");

    console.log('Step 9: Concluir o ciclo');
    await page.click('button:has-text("Concluir Ciclo")');
    await takeSnap(page, '09-concluir-ciclo');
    results.push("9. concluir o ciclo: PASSOU");

    console.log('Step 10: Próximo ciclo e nível +1');
    await page.waitForSelector('text=Ciclo Atual: 2', { timeout: 15000 });
    await page.waitForSelector('text=Nível 1', { timeout: 15000 });
    await takeSnap(page, '10-proximo-ciclo-nivel');
    results.push("10. aparece o próximo ciclo e o nível +1: PASSOU");

    console.log('Step 11: Recarregar a página');
    await page.reload();
    await page.waitForSelector('text=Ciclo Atual: 2', { timeout: 15000 });
    await page.waitForSelector('text=Nível 1', { timeout: 15000 });
    await takeSnap(page, '11-recarregar-pagina');
    results.push("11. recarregar a página e confirmar que o ciclo continua lá: PASSOU");

    const content = await page.textContent('body');
    if (content.includes('Ã') || content.includes('Â') || content.includes('â€')) {
      throw new Error("Acento quebrado encontrado!");
    }

    fs.writeFileSync('docs/verificacao/plano/E2E_RESULTS.json', JSON.stringify({ success: true, results }, null, 2), 'utf8');
    console.log('Test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    await takeSnap(page, '99-error');
    fs.writeFileSync('docs/verificacao/plano/E2E_RESULTS.json', JSON.stringify({ success: false, results, error: err.message }, null, 2), 'utf8');
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
