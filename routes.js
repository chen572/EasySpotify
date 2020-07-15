const express = require('express')
const axios = require('axios').default
const queryString = require('querystring')
require('dotenv').config()
const Auth = express.Router()
const Vars = require('./Vars')

const { CLIENTID, CLIENTSECRET, REDIRECT_URI, SCOPES } = process.env
const stateKey = 'spotify_auth_state'

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


Auth.get('/login', (req, res) => {
    const state = generateRandomString(16)
    res.cookie(stateKey, state)

    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: CLIENTID,
            scope: SCOPES,
            redirect_uri: REDIRECT_URI,
            state: state
        })
    )
})



Auth.get('/callback/', (req, res) => {
    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies[stateKey] : null
    if (state === null || state !== storedState) {
        res.redirect('/errorStateMismatch')
    }
    else {
        res.clearCookie(stateKey)
        const authOptions = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            data: queryString.stringify({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            }),
            headers: {
                'Authorization': `Basic ${Buffer.from(`${CLIENTID}:${CLIENTSECRET}`).toString('base64')}`,
                'content-type': 'application/x-www-form-urlencoded'
            },
            json: true
        }

        axios(authOptions)
            .then((response) => {
                Vars.setAccToken(response.data.access_token)
                Vars.setRefreshToken(response.data.refresh_token)
            }).catch(e => { console.log(e) })
        res.redirect('/')
    }
})


Auth.get('/refreshToken', (req, res) => {

    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        data: queryString.stringify({
            grant_type: 'refresh_token',
            refresh_token: Vars.getRefreshToken()
        }),
        headers: {
            'Authorization': `Basic ${Buffer.from(`${CLIENTID}:${CLIENTSECRET}`).toString('base64')}`,
            'content-type': 'application/x-www-form-urlencoded'
        },
        json: true
    }

    axios(authOptions).then(response => {
        Vars.setAccToken(response.data.access_token)
        res.redirect('/')
    })
})


module.exports = Auth