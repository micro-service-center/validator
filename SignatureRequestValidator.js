const fs = require('fs')
const md5 = require('js-md5')
const ALLOWS_LAG_SECONDS = 30
const moment = require('moment')
const httpSignature = require('http-signature')
const RequestValidator = require('./RequestValidator')
const ENV = process.env.NODE_ENV || 'dev'


class SignatureRequestValidator extends RequestValidator {
    constructor(opt) {
        super(opt)
    }

    validate(request) {
        this.req = request
        return super.validate(request)
    }

    checkSignature() {
        try {
            let _parsed = httpSignature.parseRequest(this.req)
            let pub = fs.readFileSync(`./phoenix-conf-store/certificates/${ENV}/${_parsed.keyId}/public`, 'ascii')
            return httpSignature.verifySignature(_parsed, pub)
        } catch (e) {
            console.log(e)
            return false
        }
    }

    /**
     * check header date
     * @returns {boolean}
     */
    checkHeaderDate() {
        return moment(Date.parse(this.req.headers.date)).add(ALLOWS_LAG_SECONDS, 'seconds').isAfter(moment(new Date()))
    }
}


module.exports = SignatureRequestValidator
