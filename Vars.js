let _accessToken 
let _refreshToken

function Vars() {
    
    const setAccToken = (accT) => { _accessToken = accT }
    
    const setRefreshToken = (refT) => { _refreshToken = refT }
    
    const getRefreshToken = () => _refreshToken

    const getAccToken = () => _accessToken
    
    return {
        setAccToken,
        setRefreshToken,
        getRefreshToken,
        getAccToken
    }
}


module.exports = Vars()