//// Initalize js file
console.log('Hello');


//// fetch weather information, needs to decide get today date or tomorrow date
async function fetchWeather(region, day){
    let url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-281D376F-126F-4682-B710-E57FE26A8431&locationName=${region}`;
    let accurateDate;

    const response = await fetch(url);
    const rawData = await response.json();

    const records = rawData['records']['location'][0]['weatherElement'];
    const Wx1 = records[0]['time'][day];
    const PoP1 = records[1]['time'][day];
    const MinT1 = records[2]['time'][day];
    const CI1 = records[3]['time'][day];
    const MaxT1 = records[4]['time'][day];

    const regionWeather = [Wx1, PoP1, MinT1, CI1, MaxT1];

    const wetherData = regionWeather.map((item) => {
        const {startTime, endTime, parameter} = item;
        accurateDate = day===0? startTime.slice(0,10):endTime.slice(0,10);
        return parameter
    })
    
    const weatherInfo = {
        "region": region,
        "date": accurateDate,
        "Wx": wetherData[0],
        "PoP": wetherData[1],
        "MinT": wetherData[2],
        "CI": wetherData[3],
        "MaxT": wetherData[4],
    }

    return weatherInfo
}
////


////  calculate GoB value to decide going out or not
function calculateGoB(weatherInfo){
    const wx = Number(weatherInfo['Wx']['parameterValue']) * 4;
    const diff = Number(weatherInfo['MaxT']['parameterName'] - weatherInfo['MinT']['parameterName']) * 1;
    const pop = Number(weatherInfo['PoP']['parameterName']) / 10 * 5;
    const GoB = (wx + diff + pop) / 10;

    if(GoB <= 4){
        recommendation = {
            "good": ["一日遊", "外出吃美食", "欣賞歷史古蹟", "外出購物振興經濟", "到南部玩", "洗衣曬被"],
            "bad": ["睡一整天", "叫 food panda", "在家寫程式", "在家吃泡麵", "網購逛蝦皮", "看 Netflix"],
        }
    }else if(GoB >4 && GoB <7){
        recommendation = {
            "good": ["睡到十點", "超市買泡麵", "看彭彭 YouTube 教學", "素顏出門", "不洗頭", ""],
            "bad": ["睡到中午", "出門太久", "", "", "", ""],
        }
    }else{
        recommendation = {
            "good": ["叫 food panda", "躺在床上一整天", "睡到自然醒", "什麼事都不做", "看 Netflix", "熬夜寫程式"],
            "bad": ["外出覓食", "換下睡衣", "3C 產品沒電", "離開床超過一小時", "", ""],
        }
    }
    return recommendation
}
////


//// controller ONLY needs to call this function to get all weather info
async function getViewData(region, day){
    const weatherData = await fetchWeather(region, day);
    const GoB = calculateGoB(weatherData);

    const weatherInfo = {
        "regionWeather": {
            "region": weatherData['region'],
            "Wx": weatherData['Wx']['parameterName'],
            "MaxT": Number(weatherData['MaxT']['parameterName']),
            "MinT": Number(weatherData['MinT']['parameterName']),
            "PoP": Number(weatherData['PoP']['parameterName']),
            "confort": weatherData['CI']['parameterName'],
            "date": {
                "month": Number(weatherData['date'].slice(5,7)),
                "date": Number(weatherData['date'].slice(8,10))
            },
            "GoB": GoB
        }
    }
    return weatherInfo
}
////


//// update information while user press any other region
function changeReigon() {
    let region = document.querySelector("#region-list").value;

    let weatherData = {
        regionWeather: null,
        GoB: null
    };

    // weatherData.regionWeather = fetchWeather(region);
    // weatherData.GoB = calculateGoB(weatherInfo);

    // render(weatherData);
}
////
