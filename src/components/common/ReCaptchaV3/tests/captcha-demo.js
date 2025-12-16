/**
 * reCAPTCHA v3 Bot Protection Demo
 *
 * HOW TO RUN:
 * 1. Start the backend API: cd ../telemdnow-rest && yarn ias
 * 2. Start the frontend app: yarn start
 * 3. Run this test with credentials:
 *    node src/shared/components/ReCaptchaV3/tests/captcha-demo.js <email> <password>
 *
 * EXAMPLE:
 *    node src/shared/components/ReCaptchaV3/tests/captcha-demo.js user@example.com mypassword
 *
 * WHAT IT TESTS:
 * - Human-like behavior (should get high scores and login successfully)
 * - Bot behavior (should get low scores and be blocked)
 * - Obvious automation (should be immediately rejected)
 *
 * PREREQUISITES:
 * - Playwright installed as dev dependency
 * - IAS backend running (yarn ias in telemdnow-rest)
 * - Frontend running on http://localhost:3000
 * - Valid test credentials provided as arguments
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { chromium } = require('playwright');

// Get credentials from command line arguments
const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

// Validate credentials are provided
if (!email || !password) {
  console.log('❌ Please provide test credentials!');
  console.log(
    'Usage: node src/shared/components/ReCaptchaV3/tests/captcha-demo.js <email> <password>'
  );
  console.log(
    'Example: node src/shared/components/ReCaptchaV3/tests/captcha-demo.js user@example.com mypassword'
  );
  process.exit(1);
}

const TEST_CREDENTIALS = {
  email,
  password
};

async function runCaptchaDemo() {
  console.log('🛡️  reCAPTCHA Bot Protection Demo');
  console.log('='.repeat(50));
  console.log(
    'This demo shows how reCAPTCHA v3 protects against automated attacks\n'
  );

  console.log('📋 Testing Scenarios:');
  console.log('   ✅ Human-like behavior (should get HIGH scores ~0.9)');
  console.log('   ❌ Bot behavior (should get LOW scores or be blocked)');
  console.log('   🚫 Obvious automation (should be rejected immediately)\n');

  // Test 1: Human-like behavior (baseline)
  await demoHumanBehavior();

  // Test 2: Bot behavior that gets caught
  await demoBotBehavior();

  // Test 3: Obvious automation that gets blocked
  await demoObviousAutomation();

  console.log('\n🎯 DEMO SUMMARY:');
  console.log('━'.repeat(50));
  console.log('✅ Human behavior: High scores (0.7-1.0) → Login allowed');
  console.log('❌ Bot behavior: Low scores (0.0-0.3) → Login blocked');
  console.log('🚫 Automation markers: Immediate rejection');
  console.log('\n💡 This demonstrates multi-layer bot protection:');
  console.log('   1️⃣ reCAPTCHA v3 scoring (behavioral analysis)');
  console.log('   2️⃣ User agent filtering (known automation tools)');
  console.log('   3️⃣ Browser fingerprinting (automation detection)');
  console.log('   4️⃣ Rate limiting (repeated rapid attempts)');
}

async function demoHumanBehavior() {
  console.log('🧑 Demo 1: Human-like Behavior');
  console.log('-'.repeat(30));

  const browser = await chromium.launch({
    headless: false,
    slowMo: 200 // Visible with realistic delays
  });

  const page = await browser.newPage();

  try {
    console.log('   🌐 Loading login page...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000); // Human reads the page

    console.log('   👀 User examines the form...');
    await page.hover('input[placeholder*="email"], input[type="email"]');
    await page.waitForTimeout(800);

    console.log('   ⌨️  Typing email with natural rhythm...');
    await page.click('input[placeholder*="email"], input[type="email"]');
    await page.type(
      'input[placeholder*="email"], input[type="email"]',
      TEST_CREDENTIALS.email,
      {
        delay: Math.random() * 100 + 80 // Variable human typing speed
      }
    );

    await page.waitForTimeout(1500); // Human thinks before password

    console.log('   🔒 Entering password...');
    await page.hover('input[type="password"]');
    await page.waitForTimeout(400);
    await page.click('input[type="password"]');
    await page.type('input[type="password"]', TEST_CREDENTIALS.password, {
      delay: Math.random() * 120 + 60
    });

    await page.waitForTimeout(1000); // Human hesitates before submitting

    console.log('   🖱️  Clicking submit button...');
    await page.hover('button:has-text("Log In"), button[type="submit"]');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Log In"), button[type="submit"]');

    console.log('   ⏳ Processing login...');
    await page.waitForTimeout(5000);

    const url = page.url();
    const success = url !== 'http://localhost:3000/login';

    console.log(`   📊 Result: ${success ? '✅ SUCCESS' : '❌ BLOCKED'}`);
    console.log(`   📍 Final URL: ${url}`);
    console.log(`   🎯 Expected: High reCAPTCHA score → Login allowed\n`);
  } catch (error) {
    console.log(`   💥 Error: ${error.message}\n`);
  } finally {
    await browser.close();
  }
}

async function demoBotBehavior() {
  console.log('🤖 Demo 2: Automated Bot Behavior');
  console.log('-'.repeat(30));

  const browser = await chromium.launch({
    headless: true, // Bots often run headless
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-images', // Skip images like a bot
      '--disable-gpu'
    ]
  });

  const context = await browser.newContext({
    // Headless Chrome user agent (suspicious)
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.124 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('   🔄 Bot loading page instantly...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(100); // Minimal bot delay

    console.log('   ⚡ Filling form at inhuman speed...');
    await page.fill(
      'input[placeholder*="email"], input[type="email"]',
      TEST_CREDENTIALS.email
    );
    await page.fill('input[type="password"]', TEST_CREDENTIALS.password);

    console.log('   🚀 Submitting immediately...');
    await page.click('button:has-text("Log In"), button[type="submit"]');

    await page.waitForTimeout(5000);

    const url = page.url();
    const success = url !== 'http://localhost:3000/login';

    console.log(`   📊 Result: ${success ? '✅ SUCCESS' : '❌ BLOCKED'}`);
    console.log(`   📍 Final URL: ${url}`);
    console.log(`   🎯 Expected: Low reCAPTCHA score → May be blocked\n`);
  } catch (error) {
    console.log(`   💥 Error: ${error.message}\n`);
  } finally {
    await browser.close();
  }
}

async function demoObviousAutomation() {
  console.log('🚫 Demo 3: Obvious Automation (Should be Blocked)');
  console.log('-'.repeat(30));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    userAgent: 'Selenium/3.141.59 (Automated Testing Bot)' // Obviously suspicious
  });

  const page = await context.newPage();

  // Add automation markers
  await page.addInitScript(() => {
    // eslint-disable-next-line no-undef
    Object.defineProperty(navigator, 'webdriver', { get: () => true });
    // eslint-disable-next-line no-undef
    window.navigator.automation = true;
  });

  try {
    console.log('   🔍 Automation with suspicious user agent...');
    console.log('   🏷️  User Agent: Selenium/3.141.59 (Automated Testing Bot)');
    console.log('   🤖 Navigator.webdriver = true');

    await page.goto('http://localhost:3000');

    console.log('   ⚡ Attempting instant form submission...');
    await page.fill(
      'input[placeholder*="email"], input[type="email"]',
      TEST_CREDENTIALS.email
    );
    await page.fill('input[type="password"]', TEST_CREDENTIALS.password);
    await page.click('button:has-text("Log In"), button[type="submit"]');

    await page.waitForTimeout(5000);

    const url = page.url();
    const success = url !== 'http://localhost:3000/login';

    console.log(
      `   📊 Result: ${
        success ? '✅ SUCCESS (UNEXPECTED!)' : '❌ BLOCKED (EXPECTED)'
      }`
    );
    console.log(`   📍 Final URL: ${url}`);
    console.log(
      `   🎯 Expected: Immediate rejection due to automation markers\n`
    );
  } catch (error) {
    console.log(`   💥 Error: ${error.message}\n`);
  } finally {
    await browser.close();
  }
}

// Run the demo
runCaptchaDemo().catch(console.error);
