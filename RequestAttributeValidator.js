/**
 * Created by jack on 12/6/16.
 */
const RequestValidator = require('./RequestValidator')

class RequestAttributeValidator extends RequestValidator {
    constructor(opt) {
        super(opt)
        this.status = true
    }
    /**
     * validate request params
     * @param request_param
     */
    validate_param(request_param) {
        this._isUndefinedOREmpty(request_param)
    }

    /**
     * check if param is undefined or empty
     * @param request_param
     * @returns {boolean}
     * @private.pem
     */
    _isUndefinedOREmpty(request_param) {
        for (let el of request_param) {
            if (typeof  el == "undefined" || el == '') {
                this.status = false
            }
        }
        return this.status
    }
}


module.exports = RequestAttributeValidator