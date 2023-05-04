import node_geocoder from 'node-geocoder';

const geocoder = node_geocoder(
    {
        provider: 'mapquest',
        apiKey: 'meLLUvw3Sl1o4ZYKYiGSxk1EhdVTuUeU',
        formatter: null
    }
);

export default geocoder;