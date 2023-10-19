const iterateJSON = require('./libs/iterate-json')
const generateRequestAndResponsePayload = require('./libs/generate-request-and-response-payload')
const generateTransportPayload = require('./libs/generate-transport-payload')
const sendDashboardData = require('./libs/send-dashboard-data')

module.exports = function (req, res) {
    const { credentials } = req._sails.config.treblle
    const { mask, debug } = req._sails.config.custom.treblle

    const startTime = performance.now()
    let responseBody = []

    const requestMetadata = {
        protocol: req.protocol,
        httpVersion: req.httpVersion
    }

    const responseJSONFn = res.json
    res.json = function (body) {
        responseJSONFn.apply(res, [body])
        responseBody = body
    }


    const requestResponsePayload = generateRequestAndResponsePayload(req, res, startTime, responseBody)
    const maskedRequestResponsePayload = iterateJSON(requestResponsePayload, undefined, mask)
    const transportPayload = generateTransportPayload(maskedRequestResponsePayload, credentials, requestMetadata)
    console.log(JSON.stringify(transportPayload))
    sendDashboardData(credentials.apiKey, transportPayload, debug)
}