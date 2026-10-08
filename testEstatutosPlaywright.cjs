const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const dir = 'docs/verificacao/estatutos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const dirTelas = 'docs/verificacao/telas';
if (!fs.existsSync(dirTelas)) fs.mkdirSync(dirTelas, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // 1280px
  const ctxDesktop = await browser.newContext({ viewport: { width: 1280, height: 1080 } });
  const pageDesktop = await ctxDesktop.newPage();
  
  // Create user
  const email = 'snap_' + Date.now() + '@example.com';
  await pageDesktop.goto('http://localhost:5173/cadastro');
  await pageDesktop.fill('input[placeholder="Seu nome"]', 'Snap User');
  await pageDesktop.fill('input[type="email"]', email);
  await pageDesktop.fill('input[type="password"]', 'password123');
  await pageDesktop.click('button:has-text("Cadastrar")');
  await pageDesktop.waitForSelector('text=Criar equipe');
  
  // Create team
  await pageDesktop.locator('button', { hasText: 'Criar equipe' }).first().click();
  await pageDesktop.fill('input[placeholder="Ex.: MCC"]', 'Snap Team');
  await pageDesktop.fill('input[type="date"]', '2026-10-01');
  await pageDesktop.locator('button', { hasText: 'Criar equipe' }).nth(1).click();
  await pageDesktop.waitForSelector(	ext=Estatutos);
  
  // Screens 1280
  await pageDesktop.goto('http://localhost:5173/');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(dirTelas, 'inicio_desktop.png'), fullPage: true });

  await pageDesktop.goto('http://localhost:5173/apenas-continue');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(dirTelas, 'painel_desktop.png'), fullPage: true });

  await pageDesktop.goto('http://localhost:5173/plano');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(dirTelas, 'plano_desktop.png'), fullPage: true });

  await pageDesktop.goto('http://localhost:5173/feed');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(dirTelas, 'feed_desktop.png'), fullPage: true });

  await pageDesktop.goto('http://localhost:5173/gestor');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(dirTelas, 'gestor_desktop.png'), fullPage: true });

  await pageDesktop.goto('http://localhost:5173/estatutos');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(dir, 'estatutos_desktop.png'), fullPage: true });

  // 390px
  const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageMobile = await ctxMobile.newPage();
  
  await pageMobile.goto('http://localhost:5173/login');
  await pageMobile.fill('input[type="email"]', email);
  await pageMobile.fill('input[type="password"]', 'password123');
  await pageMobile.click('button:has-text("Entrar")');
  await pageMobile.waitForSelector(	ext=Estatutos);

  // Screens 390
  await pageMobile.goto('http://localhost:5173/');
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(dirTelas, 'inicio_mobile.png'), fullPage: true });

  await pageMobile.goto('http://localhost:5173/apenas-continue');
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(dirTelas, 'painel_mobile.png'), fullPage: true });

  await pageMobile.goto('http://localhost:5173/plano');
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(dirTelas, 'plano_mobile.png'), fullPage: true });

  await pageMobile.goto('http://localhost:5173/feed');
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(dirTelas, 'feed_mobile.png'), fullPage: true });

  await pageMobile.goto('http://localhost:5173/gestor');
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(dirTelas, 'gestor_mobile.png'), fullPage: true });

  await pageMobile.goto('http://localhost:5173/estatutos');
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(dir, 'estatutos_mobile.png'), fullPage: true });


  await browser.close();
  console.log("Screenshots captured!");
})();

