const RequestValidator = require('./RequestValidator')


class RegisterRequestValidator extends RequestValidator {
    constructor(opt) {
        super(opt)
    }

    /**
     * GET login status by Validate login info
     * @return {Boolean}
     */
    registerValidate(register_info) {
        let [username,old_password,new_password,captcha_key,captcha_value,email_token,phone_token]=register_info
        return this.usernameValidate(username) && this.passwordValidate(old_password, new_password)
    }


    /**
     * check if register contains username
     * @params  {username}
     * @return {Boolean}
     */
    usernameValidate(username) {
        if (!(username.indexOf('@') > -1)) {
            return RegisterRequestValidator._username_phone(username)
        } else {
            return RegisterRequestValidator._username_email(username)
        }
    }

    /**
     *
     * @param username
     * @returns {*}
     * @private.pem
     */
    static _username_phone(username) {
        let regex = /^1[34578]\d{9}$/
        return RegisterRequestValidator.regex(regex, username)
    }

    /**
     * validate email
     * @param username
     * @returns {*}
     * @private.pem
     */
    static _username_email(username) {
        // let regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        let regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        return RegisterRequestValidator.regex(regex, username)
    }


    /**
     * check if register contains password
     * @params  {ip_address}
     * @return {Boolean}
     */
    passwordValidate(oldPwd, newPwd) {
        if (oldPwd === newPwd) {
            return true
        } else {
            return false
        }
    }

    /**
     * regex utils
     * @param Regex
     * @param value
     * @returns {*}
     */
    static regex(Regex, value) {
        console.log(Regex)
        return Regex.test(value)
    }
}

module.exports = RegisterRequestValidator
