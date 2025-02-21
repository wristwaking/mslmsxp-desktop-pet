const axios = require('axios')
const { config } = require('dotenv')
config()

let client = {
    grant_type: "client_credentials",
    client_id: "KETWiffMGbXHCyXn3XNSDDY1",
    client_secret: "s5hayHI3izVD7kWBmVQNbbEnBOwSF8Lj"
}

let axiosconfig = {
    headers: {
        "Content-Type": "application/json"
    }
}

let getAccessToken = async () => {
    try {
        let res = await axios.get(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${client.client_id}&client_secret=${client.client_secret}`, axiosconfig)
        return res.data.access_token ? res.data.access_token : false
    } catch {
        return false;
    }
}

module.exports = getAccessToken

