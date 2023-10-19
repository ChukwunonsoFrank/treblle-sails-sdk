const fs = require('fs')
const path = require('path')
const axios = require('axios').default

module.exports = function (api_key, payload, debug) {
    const endpoints = [
        'https://rocknrolla.treblle.com',
        'https://punisher.treblle.com',
        'https://sicario.treblle.com',
    ]

    const headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'
    }

    const debugEndpoint = "https://debug.treblle.com"
    if (debug === true) {
        axios.post(debugEndpoint, JSON.stringify(payload), { headers })
            .then(response => {
                console.log('Debug Output:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        const filePath = path.resolve(__dirname, './store/index.json')
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
            }

            let storedData = JSON.parse(data)
            let index = storedData.serverIndex;
            let currentEndpoint = endpoints[index];
            index = (index + 1) % endpoints.length;

            const newServerIndex = {
                serverIndex: index
            }

            fs.writeFile(filePath, JSON.stringify(newServerIndex), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                }
            });

            axios.post(currentEndpoint, JSON.stringify(payload), { headers })
                .then(response => {
                    console.log('Response:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    }

}