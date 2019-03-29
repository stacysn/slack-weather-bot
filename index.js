const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: 'xoxb-592180736644-593315547991-nU0D0GkOpATNubkOwTjIqD5H',
  name: 'weatherbot'
});

// Start Handler
bot.on('start', () => {
  const params = {
    icon_emoji: ':sun:'
  }

  bot.postMessageToChannel(
    'general', 
    'Now about the weather...', 
    params
  );
});


// Error handler

bot.on('error', (err) => console.log(err));

// message handler

bot.on('message', (data) => {
  if (data.type!== 'message') {
    return;
  }
  handleMessage(data.text);
});

// responds to data
function handleMessage(city) {
  if (city) {
    weatherOfCity(city);
  } else {
    console.log('nope')
  }
}

function weatherOfCity(city) {
  console.log('weathers!', city)
  axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6445e9f2ba9cd2519ea35f84eda312d6`).then(res => {
    const highTemp = Math.round((res.data.main.temp_max - 273.15) * (9/5) + 32);
    const lowTemp = Math.round((res.data.main.temp_min - 273.15) * (9/5) + 32);
    const description = res.data.weather[0].description;
    const cityName = res.data.name;
    console.log('description', description)
    console.log('high temp:', highTemp);

    bot.postMessageToChannel('general', `${cityName} is at a high ${highTemp} and a low of ${lowTemp} with ${description}`)
  });
}

