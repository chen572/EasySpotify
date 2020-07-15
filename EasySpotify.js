const axios = require('axios').default
const queryString = require('querystring')
const authRouter = require('./routes')
const Vars = require('./Vars')

function EasySpotify() {

    const baseUrl = 'https://api.spotify.com/v1'

    const getAuthRouter = () => authRouter

    const search = (searchItemName, type) => {
        return axios({
            method: 'GET',
            url: baseUrl + '/search?' + queryString.stringify({ q: searchItemName, type: type, limit: 1 }),
            headers: {Authorization: `Bearer ${Vars.getAccToken()}`}
        
        }).then(data => data.data[type + 's'].items).catch((e) => { console.log(e) })
    }

    return {
        search,
        getAuthRouter
    }
}

module.exports = EasySpotify()