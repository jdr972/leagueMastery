function main(){
  $("#masteryData").fadeOut(1)
  $(".btn").click(function(){
    var summonerName = document.getElementById('input').value;
    var name = summonerName.split(' ').join("")
    name = name.toLowerCase();
    fetchInfo(name)
  })
}
var count = 0;
var masteryData;
var summonerId;
var tier= "", division ="", leaguePoints= "", wins ="", losses ="";
var summonerName = undefined;
var level = undefined;
var icon = undefined;
var iconUrl = undefined;
var summonerId = undefined;
var champions = getChamps()


function getChamps(){
  var coolData
  $.ajax({
    url: "https://hidden-squid.herokuapp.com/champions.json",
    success: function(data){coolData = data},
    async: false
  })
  return coolData
}

function fetchInfo(sumName){
  var url = "https://hidden-squid.herokuapp.com/api/summonerinfo?name="+sumName
  $.getJSON(url, function(object){
    summonerId = object[sumName].id;
    summonerName = object[sumName].name;
    console.log(summonerName)
    level = object[sumName].summonerLevel;
    icon = object[sumName].profileIconId;
    iconUrl = "https://ddragon.leagueoflegends.com/cdn/6.8.1/img/profileicon/"+icon+".png"
    var rankedUrl = "https://hidden-squid.herokuapp.com/api/ranked?name="+sumName
    $.getJSON(rankedUrl, function(object){
      if(!object.hasOwnProperty('status')){
        console.log(object[summonerId])
          tier = object[summonerId][0].tier
          console.log(tier)
          $.each(object[summonerId][0].entries[0], function(key, value){
            if(key == "division"){division = value}
            if(key == "leaguePoints"){leaguePoints = value}
            if(key == "wins"){wins = value}
            if(key == "losses"){losses = value}
          })

        }
        else{
          tier= ""
          division =""
           leaguePoints= ""
            wins =""
            losses =""
        }
        displayInfo()
      })
})
}

function displayInfo(){
  var rank = "", lp = "", winlos ="", sumLink = "";
  $(".basic").fadeOut(600, function(){
    $("#profileimg").attr("src", iconUrl)
    $("#profileimg").attr("height", "128px")
    sumLink = "<a href='http://euw.op.gg/summoner/userName="+summonerName+"'>"+summonerName+"</a>"
    $('#sumName').html(sumLink)
    if(tier !== ""){
      rank = tier + " " + division
      $("#rank").html(rank)
      lp = leaguePoints + " LP"
      $("#lp").html(lp)
      winlos = wins+"W/"+losses+"L"
      $("#winlos").html(winlos)
    }
    else{
      $("#rank").html('Unranked')
      $("#lp").html('')
      $("#winlos").html('')
    }
    $(".basic").css("padding-top", "15px")
    $(".basic").css("padding-bottom", "15px")
    $(".basic").fadeIn(600, function(){
      displayMastery()
    })

  })
}


function displayMastery(){
  var sumName = document.getElementById('input').value;
  var name = summonerName.split(' ').join("")
  name = name.toLowerCase();
  masteryData = undefined;
  masteryData = getMasteryData(name);
  console.log(masteryData.length)
  var list1 = '';
  var list2 = '';
  var list3 = '';
  var list4 = '';
  $("#masteryData").fadeOut(500, function(){
    for(var i = 0; i<masteryData.length; i++){
      $.each(champions.data, function(key, value){
        $.each(champions.data[key], function(k, v){
          if(k == "key" && v == masteryData[i].championId){
            if(i == 0){
              var skinNumber = 0;
              var url = "https://hidden-squid.herokuapp.com/api/champskins?id="+masteryData[i].championId
              $.ajax({
                url: url,
                async: false,
                //dataType: 'json',
                success: function(data){skinNumber = data.skins.length}
              })
              var number = Math.floor(Math.random() * skinNumber)
              if(number){
                changeBg("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+key+"_"+number+".jpg")
              }
              else{
                changeBg("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+key+"_0.jpg")

                }
            }
            list1 += `<img src="https://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/`+key+`.png" alt="" height="49.5px"/>`
            $("#list1").html(list1)
            list2 += `<p>`+key+`</p>`
            $("#list2").html(list2)
            list3 += `<p>Level `+masteryData[i].championLevel+`</p>`
            $("#list3").html(list3)
            var spacedPoints = masteryData[i].championPoints
            spacedPoints = spacedPoints.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            list4 += `<p>`+spacedPoints+`</p>`
            $("#list4").html(list4)
            $("#masteryData").fadeIn(1000)
          }
        })
      })
    }
  })
}

function getMasteryData(dude){
  var url = "https://hidden-squid.herokuapp.com/api/champmastery?name="+dude
  var someData
  $.ajax({
    url: url,
    dataType: "json",
    success:  function(data){someData = data},
    async: false
  })
  return someData;
}

function changeBg(src){
  var img = new Image()
  img.onload = function(){
    $("body").css("background", '#1C1919 url("'+src+'") no-repeat right top')
    $("body").css("background-attachment", "fixed")
    $("body").css("background-size", "cover")
  }
  img.src = src
}

var defaultBg = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_0.jpg";
$.ajax({
  url: "https://hidden-squid.herokuapp.com/api/champskins?id=67",
  success: function(data){
    var number = Math.floor(Math.random() * data.skins.length)
    if(number){
      changeBg("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_"+number+".jpg")
    }
    else{
      changeBg(defaultBg)
    }
  }
})




$(document).ready(main)
