const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Mis sur false pour que vous puissiez voir les fenêtres
        userDataDir: './user_data',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // --- CONFIGURATION DES ADRESSES ---
    // Vous pouvez entrer des URL différentes ici si besoin
    const urls = [
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370611%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370612%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370613%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370614%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370615%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370616%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370617%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370618%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F5370619%2FNewDocuments%2F%2FDigiminer.apk",
        "https://www.uptoplay.net/runapk/create-androidapk.html?app=android_blank&apk=%2Fvar%2Fwww%2Fhtml%2Fweboffice%2Fmydata%2F53706110%2FNewDocuments%2F%2FDigiminer.apk",
        // Ajoutez ou modifiez les 10 adresses ci-dessous...
    ];

    // Fonction logique pour un onglet
    const runInstance = async (id, url) => {
        // Crée un contexte "Incognito" (Privé)
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        while (true) {
            try {
                console.log(`[Instance ${id}] --- ${new Date().toLocaleTimeString()} : Nouveau cycle ---`);
                
                await page.goto(url, { waitUntil: 'networkidle2' });

                // CLIC 1 : Start emulator
                const startBtn = '#talpa-splash-button';
                await page.waitForSelector(startBtn, { timeout: 60000 });
                await page.click(startBtn);

                console.log(`[Instance ${id}] Attente chargement (30s)...`);
                await new Promise(r => setTimeout(r, 30000));

                // CLIC 2 : ENTER
                try {
                    await page.waitForSelector('#talpa-splash-button', { timeout: 10000 });
                    await page.click('#talpa-splash-button');
                } catch (e) {
                    // Recherche textuelle si l'ID échoue
                    await page.evaluate(() => {
                        const el = Array.from(document.querySelectorAll('a, button, div'))
                            .find(e => e.textContent.toLowerCase().trim().includes('enter'));
                        if (el) el.click();
                    });
                }

                console.log(`[Instance ${id}] Succès ! Pause de 30 min.`);
                await new Promise(r => setTimeout(r, 30 * 60 * 1000));

            } catch (error) {
                console.error(`[Instance ${id}] ERREUR :`, error.message);
                await new Promise(r => setTimeout(r, 60000));
            }
        }
    };

    // Lancement des 10 instances en parallèle
    const tasks = [];
    for (let i = 0; i < 10; i++) {
        // Utilise l'URL de la liste, ou la première par défaut
        const targetUrl = urls[i] || urls[0]; 
        tasks.push(runInstance(i + 1, targetUrl));
    }

    await Promise.all(tasks);
})();
