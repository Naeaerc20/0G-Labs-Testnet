const bestcaptchasolverapi = require('bestcaptchasolver');
bestcaptchasolverapi.set_access_token('YOUR_ACCESS_TOKEN');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pollCaptcha(captchaId, interval = 500) {
  while (true) {
    try {
      const result = await bestcaptchasolverapi.retrieve_captcha(captchaId);
      if (result.solution && result.solution.gRecaptchaResponse) {
        return result;
      }
    } catch (e) {
      // ignore errors while polling
    }
    await sleep(interval);
  }
}

(async () => {
  try {
    const proxy = process.argv[2] || '';
    console.log('⚙️  Submitting hCaptcha...');
    const captchaId = await bestcaptchasolverapi.submit_hcaptcha({
      page_url: 'https://hub.0g.ai/faucet',
      site_key: '1230eb62-f50c-4da4-a736-da5c3c342e8e',
      proxy: proxy
    });
    console.log(`🔎 Captcha submitted. ID: ${captchaId}`);
    console.log('⌛ Waiting for solution...');
    const result = await pollCaptcha(captchaId, 500);
    console.log('✅ Captcha Solved!'.blue);
    // This line is used by request.js to capture the token.
    console.log(`CAPTCHA_SOLUTION=${result.solution.gRecaptchaResponse}`);
  } catch (error) {
    console.error(`❌ Error solving hCaptcha: ${error.message}`.blue);
    process.exit(1);
  }
})();
