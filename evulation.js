const axios = require('axios');

// ✅ Your client credentials
const clientId = '96dHZVzsAutDNLvvyz9GaRR3ryDPqtJgmLNwgd7KlOO8gvdqzRpv1VNtWBE1HEoEzm1mFofmLh9RJKbIFjzjNg==';
const clientSecret = 'lrFxI-iSEg868ZwMXfyCQwYcdwEfEQVYWsuGBfLgNynr5zJR3BhoW5VrH-UD-nIKsO9xqLOgCr9or9Sk6e7WQWEv-sT8EFIg';

// ✅ API URLs
const tokenUrl = 'https://outpost.mappls.com/api/security/oauth/token';
const geocodeUrl = 'https://atlas.mappls.com/api/places/geocode';
const reverseGeocodeUrl = 'https://explore.mappls.com/apis/O2O/entity';
const elevationUrl = 'https://apis.mappls.com/advancedmaps/v1';

// ✅ Step 1: Generate Access Token
const getAccessToken = async () => {
    try {
        const requestBody = new URLSearchParams();
        requestBody.append('grant_type', 'client_credentials');
        requestBody.append('client_id', clientId);
        requestBody.append('client_secret', clientSecret);

        const response = await axios.post(tokenUrl, requestBody);
        // console.log('✅ Access Token Generated');
        return response.data.access_token;
    } catch (error) {
        console.error('❌ Error generating token:', error.response ? error.response.data : error.message);
        throw new Error('Unable to generate access token');
    }
};

// ✅ Step 2: Get eLoc from Address (Geocode API)
const getElocFromAddress = async (accessToken, address) => {
    try {
        const response = await axios.get(geocodeUrl, {
            params: { address },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const result = response.data?.copResults;
        if (result?.eLoc) {
            console.log(`✅ eLoc Found: ${result.eLoc}`);
            return result.eLoc;
        } else {
            console.error('❌ No eLoc found for the provided address.');
            return null;
        }
    } catch (error) {
        console.error('❌ Error with Geocode API:', error.response ? error.response.data : error.message);
        return null;
    }
};

// ✅ Step 3: Get Latitude and Longitude from eLoc (Reverse Geocode API)
const getLatLongFromEloc = async (accessToken, eLoc) => {
    try {
        const response = await axios.get(`${reverseGeocodeUrl}/${eLoc}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log("response======",response.data)

        const result = response.data?.copResults;
        
        if (result?.latitude && result?.longitude) {
            console.log(`✅ Latitude: ${result.latitude}, Longitude: ${result.longitude}`);
            return { latitude: result.latitude, longitude: result.longitude };
        } else {
            console.error('❌ Latitude and Longitude not found in response.');
            return null;
        }
    } catch (error) {
        console.error('❌ Error with Reverse Geocode API:', error.response ? error.response.data : error.message);
        return null;
    }
};

// ✅ Step 4: Get Elevation from Latitude and Longitude (Elevation API)
const getElevationData = async (latitude, longitude, apiKey) => {

    console.log("let");
    // try {
    const response = await axios.get(`${elevationUrl}/${apiKey}/elevation`, {
        params: {
            locations: `${latitude},${longitude}`
        },
        headers: {
            'Accept': 'application/json'
        }
    });
    console.log("response", response.data);
    const elevation = response.data?.results?.[0]?.elevation;
    if (elevation) {
        console.log(`✅ Elevation: ${elevation} meters`);
    } else {
        console.error('❌ Elevation data not available.');
    }
    // } catch (error) {
    //     console.error('❌ Error with Elevation API:', error.response ? error.response.data : error.message);
    // }
};

// ✅ Step 5: Main Function
const main = async () => {
    try {
        const accessToken = await getAccessToken();
        const address = '237, Okhla Industrial Estate Phase 3, Near Modi Mill, New Delhi, Delhi, 110020';

        // Fetch eLoc from address
        const eLoc = await getElocFromAddress(accessToken, address);
        if (!eLoc) return;

        // Fetch Latitude and Longitude using eLoc
        const location = await getLatLongFromEloc(accessToken, eLoc);
        if (!location) return;

        // Fetch Elevation using Latitude and Longitude
        const apiKey = '6791f15f-aa82-4455-86c6-7856bbad4bd9'; // Replace with your Elevation API key
        await getElevationData(location.latitude, location.longitude, apiKey);

    } catch (error) {
        console.error('❌ Error in main process:', error.message);
    }
};

// ✅ Start the Process
main();
