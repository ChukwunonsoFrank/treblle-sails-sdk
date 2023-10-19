module.exports = function (request, response, startTime, body) {
    const isoTimestamp = new Date().toISOString()
    const requestPayload = {
        timestamp: `${isoTimestamp.substring(0, 10)} ${isoTimestamp.substring(11, 19)}` ,
        ip: request.ip,
        url: `${request.protocol}://${request.get('host')}${request.url}`,
        user_agent: request.headers['user-agent'] || 'Unknown',
        method: request.method,
        headers: request.headers,
        body: request.body
    }

    const responsePayload = {
        headers: response.getHeaders(),
        code: response.statusCode,
        size: Buffer.byteLength(JSON.stringify(body), 'utf8'),
        load_time: (performance.now() - startTime) / 1e6,
        body: body.length ? body : null
    }
    

    return {
        request: requestPayload,
        response: responsePayload
    }
}