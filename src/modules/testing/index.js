const { ResponseHandler, CustomError } = require("../../utils");
const { sendEmail, sendEmailHttp } = require("../../utils/thirdParty/emailSender");
const { sendWhatsAppMessage } = require("../../utils/thirdParty/whatsappSender");
const fetch = require('node-fetch');

class TestingModule {
    async sendEmail(req, res, next) {
        try {
            if (!req.body.email || !req.body.subject || !req.body.message) {
                return next(new CustomError('required email/subject/message', 400))
            }

            const { email, subject, message } = req.body;

            const test = await sendEmail({ email, subject, message });
            console.log(test);

            return ResponseHandler.success(req, res, 'sukses kirim email', {}, 200);
        } catch (error) {
            return next(error)
        }
    }

    async sendwhatsapp(req, res, next) {
        try {
            if (!req.body.phone || !req.body.message) {
                return next(new CustomError('required to/message', 400))
            }

            const { phone, message } = req.body;

            const test = await sendWhatsAppMessage({ phone, message });
            console.log(test);

            return ResponseHandler.success(req, res, 'sukses kirim whatsapp', {}, 200);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = { testingModule: new TestingModule() }