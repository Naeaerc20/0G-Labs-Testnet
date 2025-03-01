#!/usr/bin/env node
const colors = require('colors');
const bestcaptchasolverapi = require('bestcaptchasolver');

let inSolving = false;

function log(txt) {
  console.log(txt);
}

function example_hcaptcha() {
  const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';
  let captcha_id;

  if (!inSolving) {
    inSolving = true;
  } else {
    return log("🚫 Already processing another task".red);
  }

  bestcaptchasolverapi.set_access_token(ACCESS_TOKEN);

  bestcaptchasolverapi.account_balance()
    .then((balance) => {
      log(("💰 Balance: $" + balance).green);
      log("🔍 Solving hCaptcha".blue);
      return bestcaptchasolverapi.submit_hcaptcha({
        page_url: 'https://hub.0g.ai/faucet',
        site_key: '1230eb62-f50c-4da4-a736-da5c3c342e8e'
      });
    })
    .then((id) => {
      captcha_id = id;
      log(("✅ Got ID " + id + ", waiting for completion ...").yellow);
      return bestcaptchasolverapi.retrieve_captcha(id);
    })
    .then((data) => {
      const solution = data.solution ? (data.solution.gRecaptchaResponse || data.solution) : "No solution";
      log(("🔑 response: \"" + solution + "\"").magenta);
      console.log("CAPTCHA_SOLUTION=" + solution);
    })
    .catch((err) => {
      log(("❌ Error: " + (err.message || err)).red);
    })
    .then(() => {
      inSolving = false;
    });
}

example_hcaptcha();
