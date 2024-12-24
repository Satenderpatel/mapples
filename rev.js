const axios = require('axios');

// Your client credentials
const clientId = '96dHZVzsAutDNLvvyz9GaRR3ryDPqtJgmLNwgd7KlOO8gvdqzRpv1VNtWBE1HEoEzm1mFofmLh9RJKbIFjzjNg==';
const clientSecret = 'lrFxI-iSEg868ZwMXfyCQwYcdwEfEQVYWsuGBfLgNynr5zJR3BhoW5VrH-UD-nIKsO9xqLOgCr9or9Sk6e7WQWEv-sT8EFIg';

const tokenUrl = 'https://outpost.mappls.com/api/security/oauth/token';
const geocodeUrl = 'https://atlas.mappls.com/api/places/geocode';
const reverseGeocodeUrl = 'https://explore.mappls.com/apis/O2O/entity';

// ✅ Step 1: Generate Access Token
const getAccessToken = async () => {
    try {
        const requestBody = new URLSearchParams();
        requestBody.append('grant_type', 'client_credentials');
        requestBody.append('client_id', clientId);
        requestBody.append('client_secret', clientSecret);

        const response = await axios.post(tokenUrl, requestBody);
        return response.data.access_token;
    } catch (error) {
        console.error('❌ Error generating token:', error.response ? error.response.data : error.message);
        throw new Error('Unable to generate access token');
    }
};

// ✅ Step 2: Get eLoc from Address
const getElocFromAddress = async (accessToken, address) => {
    try {
        const response = await axios.get(geocodeUrl, {
            params: { address },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const result = response.data.copResults;
        console.log("result", result.eLoc);
        if (result && result.eLoc) {
            console.log(`✅ eLoc: ${result.eLoc}`);
            return result.eLoc;
        } else {
            console.log('❌ No eLoc found for the provided address.');
            return null;
        }
    } catch (error) {
        console.error('❌ Error with Geocode API:', error.response ? error.response.data : error.message);
        return null;
    }
};

// ✅ Step 3: Get Latitude and Longitude using eLoc
const getLatLongFromEloc = async (accessToken, eLoc) => {
    try {
        const response = await axios.get(`${reverseGeocodeUrl}/${eLoc}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const result = response.data?.copResults;
        if (result && result.latitude && result.longitude) {
            console.log(`✅ Latitude: ${result.latitude}, Longitude: ${result.longitude}`);
        } else {
            console.log('❌ Latitude and Longitude not found in response.');
        }
    } catch (error) {
        console.error('❌ Error with Reverse Geocode API:', error.response ? error.response.data : error.message);
    }
};

// ✅ Step 4: Main Function
const main = async () => {
    try {
        const accessToken = await getAccessToken();
        console.log('✅ Access Token:', accessToken);

        const address = '237, Okhla Industrial Estate Phase 3, Near Modi Mill, New Delhi, Delhi, 110020';
        const eLoc = await getElocFromAddress(accessToken, address);

        if (eLoc) {
            await getLatLongFromEloc(accessToken, eLoc);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

// Start the process
main();
