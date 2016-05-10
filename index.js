var express = require('express')
var app = express()
var request = require('request')
var path = require('path')
var apiKey = "5eb57e94-25e1-43d1-8d45-84423c2e7c0b"
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


app.use(allowCrossDomain)
app.use('/', express.static('public'));


app.get('/api/summonerinfo', function(req, res) {
    var name = req.query.name
    console.log("info for " + name + " requested.")
    var url = "https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/" + name + "?api_key="+apiKey
    request({
        url: url,
        json: true
    }, function(error, response, data) {
        if (!error) {
            console.log("No error encountered")
            res.end(JSON.stringify(data))
        } else {
            console.log(error)
        }
    })
})


app.get('/api/champinfo', function(req, res) {
    var id = req.query.id
    console.log("info for id " + id + " requested.")
    var nameUrl = "https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/" + id + "?api_key="+apiKey;
    request({
        url: nameUrl,
        json: true
    }, function(error, response, data) {
        var champName = data.name
        var infoUrl = "https://ddragon.leagueoflegends.com/cdn/6.9.1/data/en_US/champion/" + champName + ".json";
        request({
            url: infoUrl,
            json: true
        }, function(error, response, data) {
            if (!error) {
                console.log("No error encountered")
                res.end(JSON.stringify(data))
            } else {
                console.log(error)
            }

        })
    })
})

app.get('/api/champname', function(req, res) {
    var id = req.query.id
    console.log("name for id " + id + " requested.")
    var nameUrl = "https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/" + id + "?api_key="+apiKey
    request({
        url: nameUrl,
        json: true
    }, function(error, response, data) {
        if (!error) {
            console.log("No error encountered")
            res.end(data.name)
        } else {
            console.log(error)
        }
    })
})

app.get('/api/champmastery', function(req, res) {
    var name = req.query.name
    console.log("mastery info for " + name + " requested.")
    var url = "https://server-jdr972.c9users.io/api/summonerinfo?name="+name
    request({
        url: url,
        json: true
    }, function(error, response, data) {
        if (data) {
            console.log("No error encountered")
            var summonerId = data[name].id
            console.log("Summmoner id : " + JSON.stringify(summonerId))
            var reqUrl = "https://euw.api.pvp.net/championmastery/location/euw1/player/" + summonerId + "/champions?api_key="+apiKey
            request({
                url: reqUrl,
                json: true
            }, function(error, response, data) {
                if (!error) {
                    console.log("No error encountered")
                    //console.log(response)
                    res.end(JSON.stringify(data))
                } else {
                    console.log(error)
                }
            })

        } else {
            console.log(error)
        }
    })
})

app.get('/api/ranked', function(req, res) {
    var name = req.query.name
    console.log("ranked info for " + name + " requested.")
    var url = "https://server-jdr972.c9users.io/api/summonerinfo?name="+name
    request({
        url: url,
        json: true
    }, function(error, response, data) {
        if (data && !data.status) {
            console.log("No error encountered")
            var summonerId = data[name].id
            console.log("Summmoner id : " + JSON.stringify(summonerId))
            var reqUrl = "https://euw.api.pvp.net/api/lol/euw/v2.5/league/by-summoner/"+summonerId+"/entry?api_key="+apiKey
            request({
                url: reqUrl,
                json: true
            }, function(error, response, data) {
                if (!error) {
                    console.log("No error encountered")
                    //console.log(response)
                    res.end(JSON.stringify(data))
                } else {
                    console.log(error)
                }
            })

        } else {
            console.log(error)
        }
    })
})

app.get('/api/champskins', function(req, res) {
    var id = req.query.id
    console.log("skins for champion " + id + " requested.")
    var url = "https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/"+id+"?champData=skins&api_key="+apiKey
    request({
        url: url,
        json: true
    }, function(error, response, data) {
        if (data) {
            console.log("No error encountered")
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))

        } else {
            console.log(error)
        }
    })
})

app.listen(process.env.PORT || 3030)
