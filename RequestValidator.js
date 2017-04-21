const url = require('url')
const jwt = require('jwt-simple')
const BaseValidator = require('./base')
// const BaseValidator = require('cyanide-validator').BaseValidator

/** the Request Validator */
class RequestValidator extends BaseValidator {
	/**
	 * Initialize Request Policy
	 * @param  {Object} opt Configuration Objects
	 */
	constructor(opt) {
		super(opt)
		this.request = null
		this.headers = {}
	}	

	get policy_conf() {
		try {
			return this.target.policy[this.constructor.name]	
		} catch(e){
			return ["path_policy"]
		}
	}

	/**
	 * Parse Request URL 
	 * @private.pem
	 */
	get parsed_url()	{
		return RequestValidator._parseRequestURL(this.request.url)
	}

	/**
	 * Parse Request URL 
	 * @public.pem.pub
	 * @return { Object } Parsed URL
	 */
	static _parseRequestURL(_url) {
		return url.parse(_url)
	}

	/**
	 * Determin request service type with path
	 * @private.pem
	 * @return { target } Service Name
	 */
	get target() {
		return RequestValidator._getTarget(this.conf, this.pathRoot)
	}

	validate(request) {
		this.request = request
		return super.validate(request)
	}

	/**
	 * Determin request service type with path
	 * @param  {request}
	 * @return {service_name}
	 */
	static _getTarget(conf, pathRoot)	{
		return conf.SERVICES.find((service) => {
			return service.path == pathRoot
		})
	}

	/**
	 * Get Paths from configuration file
	 * @param  {conf}
	 * @return {Array}
	 */
	get pathRoot()	{
		return `/${this.parsed_url.pathname.split('/')[1]}`
	}

	get ip() {

	}

	/**
	 * Get Paths from configuration file
	 * @param  {conf}
	 * @return {Array}
	 */
	get paths() {
		return this.conf.SERVICES.map((service) => {
			return service.path
		})
	}

	/**
	 * Get Paths from configuration file
	 * @attribute hasAuthKey
	 * @param  {conf}
	 * @return {Array}
	 */
	get hasAuthKey() {
		return RequestValidator._hasAuthKey(this.request, this.target.auth_header)	
	}

	/**
	 * check if request needs authentication
	 * @param  {request}
	 * @param  {AUTH_KEY_NAME}
	 * @return {Boolean}
	 */
	static _hasAuthKey(request, auth_key_name) {
		return Object.keys(request.headers).indexOf(auth_key_name) > -1
	}

	/**
	 * Whether user has header key other than the auth key
	 * @param  Object  args arguments 
	 * @return {Boolean} True or False
	 */
	hasHeaderKey(args) {
		return Object.keys(args)
			.map((e)=>{ return args[e] })
			.map((key)=>{ 
				this.headers[key] = this.request.headers[key]
				return RequestValidator._hasAuthKey(this.request, key) 
			})
			.reduce((cur, next)=>{ return cur && next}, 1)
	}

	decodeJWTHeader() {
		let payload = RequestValidator._decodeJWTHeader(this.request, this.target.auth_header, this.target.secret)
		this.payload = payload
		return payload
	}

	static _decodeJWTHeader(request, auth_key_name, secret) {
		return jwt.decode(request.headers[auth_key_name], secret)
	}

	/**
	 * check if request needs authentication
	 * @param  {request}
	 * @return {this}
	 */
	done()	{
		this.resolve({ 
			headers: this.headers,
			payload: this.payload,
			request: this.request,
			target: this.target
		})
	}


}

module.exports = RequestValidator
