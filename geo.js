const axios = require('axios');

// Your client credentials
const clientId = '96dHZVzsAutDNLvvyz9GaRR3ryDPqtJgmLNwgd7KlOO8gvdqzRpv1VNtWBE1HEoEzm1mFofmLh9RJKbIFjzjNg==';
const clientSecret = 'lrFxI-iSEg868ZwMXfyCQwYcdwEfEQVYWsuGBfLgNynr5zJR3BhoW5VrH-UD-nIKsO9xqLOgCr9or9Sk6e7WQWEv-sT8EFIg';

// The URL for the Geo-location API
const tokenUrl = 'https://outpost.mappls.com/api/security/oauth/token';
// const geoLocationUrl = 'https://atlas.mappls.com/api/places/geo-location';
const geoLocationUrl = 'https://atlas.mappls.com/api/places/geo-location/v2';

// ✅ Step 1: Generate Access Token
const getAccessToken = async () => {
    // try {
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'client_credentials');
    requestBody.append('client_id', clientId);
    requestBody.append('client_secret', clientSecret);

    const response = await axios.post(tokenUrl, requestBody);
    return response.data.access_token;
    // } catch (error) {
    //     console.error('❌ Error generating token:', error.response ? error.response.data : error.message);
    //     throw new Error('Unable to generate access token');
    // }
};

// Request Data (as given in the curl)
const requestData = {
    cellTowers: [
        {
            cellId: 900372,
            locationAreaCode: 57,
            mobileCountryCode: 405,
            mobileNetworkCode: "872"
        }
    ]
};

// Axios Request to call the Geo-location API

const callGeoLocationApi = async (accessToken) => {
    // try {
    console.log("✅ Access Token:", accessToken);
    console.log("✅ Geo-location URL:", geoLocationUrl);

    const response = await axios.post(geoLocationUrl, requestData, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    // Handle the API response
    console.log('✅ Geo-location API Response:', response.data);
    return response.data;
    // } catch (error) {
    //     console.error('❌ Error with Geo-location API:', error.response ? error.response.data : error.message);
    //     throw new Error('Failed to fetch Geo-location data');
    // }
};

// ✅ Step 4: Main Function
const main = async () => {
    // try {
    const accessToken = await getAccessToken(); // Get the access token
    console.log('✅ Access Token:', accessToken);

    // Now call the Geo-location API with the access token
    await callGeoLocationApi(accessToken);

    // } catch (error) {
    //     console.error('❌ Error:', error.message);
    // }
};

// Start the process
main();
