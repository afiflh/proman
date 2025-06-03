const { ResponseHandler } = require("../../utils")



exports.otorisasi = async (req, res, next) => {
    const { auth } = req
    if (auth) {
        const payload = {
            middeware_02: 'auhtorization',
            data_otorisasi: 'token otorisasi'
        }
        req.otorisasi = { ...auth, ...payload }
        next()
    } else {
        return ResponseHandler.error(res, 'andan tidak punya otoritas hak akses')
    }
}