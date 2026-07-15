const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  
  try {
      // 1. Home
      console.log("Capturing Home...");
      await page.goto('https://rentit-marketplace.vercel.app/', { waitUntil: 'networkidle2' });
      await page.screenshot({ path: 'home.png' });

      // 2. Search
      console.log("Capturing Search...");
      await page.goto('https://rentit-marketplace.vercel.app/search?query=tents', { waitUntil: 'networkidle2' });
      await page.screenshot({ path: 'search.png' });

      // 3. Login Screen
      console.log("Capturing Login...");
      await page.goto('https://rentit-marketplace.vercel.app/login', { waitUntil: 'networkidle2' });
      await page.screenshot({ path: 'login.png' });

      // --- RENTER WORKFLOW ---
      console.log("Logging in as Renter...");
      await page.type('input[type="email"]', 'renter@example.in');
      await page.type('input[type="password"]', '123456789');
      await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          page.click('button[type="submit"]')
      ]);

      console.log("Capturing Renter Dashboard...");
      await page.goto('https://rentit-marketplace.vercel.app/dashboard', { waitUntil: 'networkidle2' });
      await page.screenshot({ path: 'renter_dash.png' });

      console.log("Capturing Item Details & Booking...");
      await page.goto('https://rentit-marketplace.vercel.app/', { waitUntil: 'networkidle2' });
      // Click the first item
      const itemLinks = await page.$$('a[href^="/item/"]');
      if (itemLinks.length > 0) {
          await Promise.all([
              page.waitForNavigation({ waitUntil: 'networkidle2' }),
              itemLinks[0].click()
          ]);
          await page.screenshot({ path: 'item_details.png' });
          
          // Scroll down to booking section
          await page.evaluate(() => window.scrollBy(0, 500));
          await page.screenshot({ path: 'booking.png' });
      }

      // Logout
      console.log("Logging out...");
      const logoutBtn = await page.$x("//button[contains(text(), 'Logout')]");
      if (logoutBtn.length > 0) {
          await Promise.all([
              page.waitForNavigation({ waitUntil: 'networkidle2' }),
              logoutBtn[0].click()
          ]);
      }

      // --- OWNER WORKFLOW ---
      console.log("Logging in as Owner...");
      await page.goto('https://rentit-marketplace.vercel.app/login', { waitUntil: 'networkidle2' });
      await page.type('input[type="email"]', 'owner@example.in');
      await page.type('input[type="password"]', '123456789');
      await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          page.click('button[type="submit"]')
      ]);

      console.log("Capturing Owner Dashboard...");
      await page.goto('https://rentit-marketplace.vercel.app/dashboard', { waitUntil: 'networkidle2' });
      await page.screenshot({ path: 'owner_dash.png' });

      console.log("Capturing Add Item...");
      await page.goto('https://rentit-marketplace.vercel.app/add-item', { waitUntil: 'networkidle2' });
      await page.screenshot({ path: 'add_item.png' });

  } catch(e) {
      console.error(e);
  } finally {
      await browser.close();
      console.log("Done.");
  }
})();
