const os = require('os')

module.exports = function (maskedPayloadData, credentials, metadata) {
    const { version } = require('../../package.json')

    const payload = {
        api_key: credentials.apiKey || process.env.apiKey,
        project_id: credentials.projectId || process.env.projectId,
        sdk: "Sails.js",
        version: version,
        data: {
            server: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                os: {
                    name: os.type(),
                    release: os.release(),
                    architecture: os.arch()
                },
                software: null,
                signature: null,
                protocol: `${metadata.protocol}/${metadata.httpVersion}`,
                encoding: 'utf-8'
            },
            language: {
                name: "Node.js",
                version: process.version
            },
            request: maskedPayloadData.request,
            response: maskedPayloadData.response,
            errors: []
        }
    }

    return payload
}