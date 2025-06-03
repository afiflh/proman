const { TOKEN_SEND } = require('../../../config/env');
const fetch = require('node-fetch');

async function sendEmail({ email, subject, message }) {
    try {
        const urlApi = "https://cxt.co.id:4841/api/sender/email"

        const bodyToEncode = {
            email,
            subject,
            message
        };
        const bodyEncoded = btoa(JSON.stringify(bodyToEncode));

        const headerApiEmail = new fetch.Headers();
        headerApiEmail.append("Authorization", `Bearer ${TOKEN_SEND}`)
        headerApiEmail.append("Content-Type", "application/json");

        const request = new fetch.Request(urlApi, {
            method: "POST",
            headers: headerApiEmail,
            body: JSON.stringify({ data: bodyEncoded })
        });

        const response = await fetch(request);
        console.log('[INFO]: Server sending email to user...');
        const dataResponse = await response.json();

        if (response.status == 200) {
            console.log(`[INFO]: success send email to ${email}`);
        }

        const decodeResponseData = atob(dataResponse);
        const dataJSON = JSON.parse(decodeResponseData);

        return {
            statusCode: response.status,
            data: dataJSON ?? null
        };
    } catch (error) {
        console.error('error send email: ', error)
        throw error;
    }
}



module.exports = { sendEmail };



