const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: 'xoxb-592180736644-593315547991-nU0D0GkOpATNubkOwTjIqD5H',
  name: 'weatherbot'
});

// Start Handler
bot.on('start', () => {
  bot.postMessage(
    'general', 
    'Welcome to Weather Bot! Type \'@Weather Bot\' followed by the name of a city to get weather conditions.'
  );
  botId = bot.self.id;
});

// Error handler
bot.on('error', (err) => console.log('ERROR', err));

// Message Handler
bot.on('message', (data) => {
  if (data.type !== 'message') { // will return if data.type is 'error' or 'desktop_notification'
    return;
  }
  if (data.subtype == 'bot_message') { 
    return;
  }
  if (!data.text.includes(botId)) {
    return;
  }
  let message = data.text;
  let channel = data.channel;

  if (data.text.includes('help')) {
    askForHelp(channel);
    return;
  }
  handleMessage(message.replace(/\s*\<.*?\>\s*/g, ''), channel);
});

// response to data
function handleMessage(city, channel) {
  axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6445e9f2ba9cd2519ea35f84eda312d6`).then(res => {
    const highTemp = Math.round((res.data.main.temp_max - 273.15) * (9/5) + 32);
    const lowTemp = Math.round((res.data.main.temp_min - 273.15) * (9/5) + 32);
    const description = res.data.weather[0].description;
    const cityName = res.data.name;
    const country = res.data.sys.country;
    let emoji = ':thermometer:'; // default
    let weatherNote = 'Thanks for using Weather Bot!';

    if (description.includes('clear sky')) {
      emoji = ':sunny: :sunglasses:';
      weatherNote = ':sunglasses: Be prepared with your sunglasses! :sunglasses:';
    } else if (description.includes('few clouds')) {
      emoji = ':sun_behind_cloud:';
      weatherNote = ':cloud: It might be a bit chilly! :cloud:';
    } else if (description.includes('scattered') || description.includes('broken')) {
      emoji = ':cloud:';
      weatherNote = ':cloud: :cloud: :cloud:';
    } else if (description.includes('shower')) {
      emoji = ':shower:';
      weatherNote = ':umbrella: You might want to bring that umbrella with you! :umbrella:';
    } else if (description.includes('rain')) {
      emoji = ':rain_cloud:';
      weatherNote = ':umbrella: Bring that umbrella! :umbrella:';
    } else if (description.includes('thunderstorm')) {
      emoji = ':thunder_cloud_and_rain:';
      weatherNote = ':coffee: Hot chocolate by the fireplace type of weather :coffee:';
    } else if (description.includes('snow')) {
      emoji = ':snowflake:';
      weatherNote = ':gloves: Time to bundle up! :scarf:'
    } else if (description.includes('mist')){
      emoji = ':cloud:';
      weatherNote = ':cloud: :cloud: :cloud:'
    }

    if (cityName) {
      bot.postMessage(
        channel,
        `${cityName}, ${country} is at a high ${highTemp}°F and a low of ${lowTemp}°F with ${description} ${emoji}
        ${weatherNote}`
      );
    }
  }).catch(function () {
    const params = {
      icon_emoji: ':speak_no_evil:'
    };
    bot.postMessage(
      channel,
      `Invalid city. Please check spelling or type in another city.`,
      params
    )
  })
}

function askForHelp (channel) {
  const params = {
    icon_emoji: ':sos:'
  }
  bot.postMessage (
    channel,
    `Don't fret! Type \'@Weather Bot\' followed by the name of the city.`, 
    params
  );
}
