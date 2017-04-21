const RequestValidator = require('./RequestValidator')


class LoginRequestValidator extends RequestValidator {
    constructor(opt) {
        super(opt)
    }

    /**
     * GET login status by Validate login info
     * @return {Boolean}
     */
    loginValidate(req) {
        let username = req.params["account"]
        return LoginRequestValidator.usernameValidate(username)
    }


    /**
     * check if login contains username
     * @params  {username}
     * @return {Boolean}
     */
    static usernameValidate(username) {
        if (username.length == 11) {
            return LoginRequestValidator._username_phone(username)
        } else {
            return LoginRequestValidator._username_email(username)
        }
    }

    /**
     *
     * @param username
     * @returns {*}
     * @private.pem
     */
    static _username_phone(username) {
        return /^(?!171|172|174|175|179)\d{11}$/i.test(username)
    }

    /**
     * validate email
     * @param username
     * @returns {*}
     * @private.pem
     */
    static _username_email(username) {
        return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(username)
    }
}

module.exports = LoginRequestValidator