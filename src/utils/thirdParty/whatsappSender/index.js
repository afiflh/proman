const { TOKEN_SEND } = require('../../../config/env');
const fetch = require('node-fetch');

async function sendWhatsAppMessage({ phone, message }) {
    try {
        const urlApi = "https://cxt.co.id:4841/api/sender/whatsapp";

        const bodyToEncode = {
            phone,
            message
        };
        const bodyEncoded = Buffer.from(JSON.stringify(bodyToEncode)).toString('base64');

        const headerApiWhatsApp = new fetch.Headers();
        headerApiWhatsApp.append("Authorization", `Bearer ${TOKEN_SEND}`);
        headerApiWhatsApp.append("Content-Type", "application/json");

        const request = new fetch.Request(urlApi, {
            method: "POST",
            headers: headerApiWhatsApp,
            body: JSON.stringify({ data: bodyEncoded })
        });

        const response = await fetch(request);
        console.log('[INFO]: Server sending WhatsApp message...');
        const dataResponse = await response.json();

        if (response.status == 200) {
            console.log(`[INFO]: success send Whatsapp message to ${phone}`);
        }

        return {
            statusCode: response.status,
            data: dataResponse ?? null
        };
    } catch (error) {
        console.error('Error sending WhatsApp message: ', error);
        throw error;
    }
}

module.exports = { sendWhatsAppMessage };
