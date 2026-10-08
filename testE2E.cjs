const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  if (!fs.existsSync('docs/verificacao/plano')) {
    fs.mkdirSync('docs/verificacao/plano', { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const ts = Date.now();
    const testEmail = `test_${ts}@example.com`;

    console.log('Navigating to Register...');
    await page.goto('http://localhost:5173/cadastro');
    await page.screenshot({ path: 'docs/verificacao/plano/01-cadastro.png' });

    console.log('Registering user...');
    await page.fill('input[placeholder="Seu nome"]', 'Tester');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Cadastrar")');

    console.log('Waiting for TeamGate...');
    await page.waitForURL('**/equipe');
    await page.screenshot({ path: 'docs/verificacao/plano/01b-teamgate.png' });

    console.log('Creating Team...');
    // Click the "Criar equipe" tab
    await page.locator('button', { hasText: 'Criar equipe' }).first().click();
    // fill team name
    await page.fill('input[placeholder="Ex.: MCC"]', 'Equipe Teste');
    // fill date (needs format maybe? just put a date string)
    await page.fill('input[type="date"]', '2026-10-01');
    // fill task 1
    await page.fill('input[placeholder="Tarefa 1"]', 'Ler a Bíblia');
    // click submit button "Criar equipe"
    await page.locator('button', { hasText: 'Criar equipe' }).nth(1).click();
    
    console.log('Waiting for Home...');
    await page.waitForURL('**/');

    console.log('Going to Apenas Continue dashboard...');
    await page.goto('http://localhost:5173/apenas-continue');
    
    await page.waitForSelector('text=Criar Plano');
    await page.screenshot({ path: 'docs/verificacao/plano/02-painel-vazio.png' });
    await page.click('text="Criar Plano"');

    console.log('Going to Plano...');
    await page.waitForSelector('text=Defina a programação dos ciclos.');
    await page.screenshot({ path: 'docs/verificacao/plano/03-plano.png' });

    console.log('Generating Plano...');
    await page.fill('input[type="number"]', '3'); // set to 3 cycles
    await page.click('button:has-text("Adicionar")');
    await page.waitForSelector('text=Grade de Ciclos Programados');
    await page.screenshot({ path: 'docs/verificacao/plano/04-plano-gerado.png' });
    
    console.log('Going back to Painel...');
    await page.goto('http://localhost:5173/apenas-continue');
    await page.waitForSelector('text=Ciclo Atual: 1');
    await page.screenshot({ path: 'docs/verificacao/plano/05-painel-ciclo-1.png' });

    console.log('Checking off tasks...');
    const checkboxes = await page.$$('input[type="checkbox"]');
    for (const box of checkboxes) {
      await box.check();
      await page.waitForTimeout(100);
    }
    await page.screenshot({ path: 'docs/verificacao/plano/06-painel-marcado.png' });

    console.log('Concluding cycle...');
    await page.click('button:has-text("Concluir Ciclo")');
    await page.waitForSelector('text=Ciclo Atual: 2');
    await page.screenshot({ path: 'docs/verificacao/plano/07-ciclo-concluido.png' });
    
    console.log('Going to Feed...');
    await page.click('text="Feed"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'docs/verificacao/plano/08-feed.png' });

    console.log('Going to Estatutos...');
    await page.click('text="Códice"'); // assuming the tab is Códice or Estatutos
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'docs/verificacao/plano/09-estatutos-1280.png' });

    // mobile viewport for Estatutos
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'docs/verificacao/plano/10-estatutos-390.png' });
    
    console.log('Test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    await page.screenshot({ path: 'docs/verificacao/plano/error.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
