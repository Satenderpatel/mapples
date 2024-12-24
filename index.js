const axios = require('axios');

// Your client credentials
const clientId = '96dHZVzsAutDNLvvyz9GaRR3ryDPqtJgmLNwgd7KlOO8gvdqzRpv1VNtWBE1HEoEzm1mFofmLh9RJKbIFjzjNg==';
const clientSecret = 'lrFxI-iSEg868ZwMXfyCQwYcdwEfEQVYWsuGBfLgNynr5zJR3BhoW5VrH-UD-nIKsO9xqLOgCr9or9Sk6e7WQWEv-sT8EFIg';

const tokenUrl = 'https://outpost.mappls.com/api/security/oauth/token';
const geocodeUrl = 'https://atlas.mappls.com/api/places/geocode';

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

// ✅ Step 2: Get Latitude and Longitude from Address
const getLatLongFromAddress = async (accessToken, address) => {
    try {
        const response = await axios.get(geocodeUrl, {
            params: { address },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const results = response.data;
        if (results) {
            const { formattedAddress } = results.copResults;
            console.log(`✅ Address: ${formattedAddress}`);
            // console.log(`✅ Latitude: ${latitude}, Longitude: ${longitude}`);
        } else {
            console.log('❌ No results found for the provided address.');
        }
    } catch (error) {
        if (error.response) {
            console.error('❌ Error with Geo-Code API:', error.response.data);
        } else {
            console.error('❌ Error with Geo-Code API:', error.message);
        }
    }
};

// ✅ Step 3: Main Function
const main = async () => {
    try {
        const accessToken = await getAccessToken();
        console.log('✅ Access Token:', accessToken);

        const address = 'D 215 D Block Devisha Business Park Sector 63 Noida 201301';
        await getLatLongFromAddress(accessToken, address);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

// Start the process
main();
