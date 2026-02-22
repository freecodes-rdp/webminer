const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Mis sur false pour voir les fenêtres
        userDataDir: './user_data',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // --- CONFIGURATION DES ADRESSES (VOS DONNÉES D'ORIGINE) ---
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
    ];

    // Fonction logique pour un onglet
    const runInstance = async (id, url) => {
        while (true) {
            // Création d'un contexte isolé pour chaque cycle
            const context = await browser.createBrowserContext();
            const page = await context.newPage();
            
            try {
                // --- NETTOYAGE DU CACHE ET DES COOKIES ---
                const client = await page.target().createCDPSession();
                await client.send('Network.clearBrowserCache');
                await client.send('Network.clearBrowserCookies');

                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

                console.log(`[Instance ${id}] --- ${new Date().toLocaleTimeString()} : Nettoyage & Nouveau cycle ---`);
                
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

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
                    await page.evaluate(() => {
                        const el = Array.from(document.querySelectorAll('a, button, div'))
                            .find(e => e.textContent.toLowerCase().trim().includes('enter'));
                        if (el) el.click();
                    });
                }

                console.log(`[Instance ${id}] Succès ! En cours pour 30 min.`);
                
                // Attendre 30 minutes
                await new Promise(r => setTimeout(r, 30 * 60 * 1000));

            } catch (error) {
                console.error(`[Instance ${id}] ERREUR : ${error.message}. Relance dans 1 min.`);
                await new Promise(r => setTimeout(r, 60000)); // Attendre 1 min avant de retenter en cas d'erreur
            } finally {
                // Fermeture propre pour libérer la RAM et le cache
                await page.close();
                await context.close();
            }
        }
    };

    // --- LANCEMENT PROGRESSIF DES 10 INSTANCES (5 SEC D'INTERVALLE) ---
    for (let i = 0; i < urls.length; i++) {
        console.log(`Lancement de l'onglet ${i + 1} / ${urls.length}...`);
        runInstance(i + 1, urls[i]); 
        
        // Pause de 5 secondes avant de lancer le prochain onglet
        if (i < urls.length - 1) {
            await new Promise(r => setTimeout(r, 5000));
        }
    }
})();
