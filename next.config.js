/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    apiKey: "AIzaSyDeP_uV3Y5NEBy6bT1DfE_uwyKb1JAHG3g",
    authDomain: "tambran-smart-urban-village.firebaseapp.com",
    projectId: "tambran-smart-urban-village",
    storageBucket: "tambran-smart-urban-village.appspot.com",
    messagingSenderId: "402932538759",
    appId: "1:402932538759:web:307bf70d2c0633d8fd0722",
    measurementId: "G-JSGRG3H7W5",
    MAP_API_KEY: "AIzaSyBOck91hRudV6fWDk_g6K9o73eRCWrSrx8"
  },
  images : {
    unoptimized : true
  },
}

module.exports = nextConfig
