const TelegramBot = require('node-telegram-bot-api');
const { getUserPlayRecord} = require("./netease");

// replace the value below with the Telegram token you receive from @BotFather
const token = '@:@@';
const uid = '11111'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/song(\/.*)?/, function onEditableText(msg, match) {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Week',
                        // we shall check for this value when we listen
                        // for "callback_query"
                        callback_data: 'Week'
                    }
                ],
                [
                    {
                        text: 'All',
                        // we shall check for this value when we listen
                        // for "callback_query"
                        callback_data: 'All'
                    }
                ]
            ]
        }
    };
    if (match[1] !== undefined) {
        let type = match[1] === '/week' ? 1 : 0;
        let song_name = `< ${type === 1 ? "Week" : "All"} > \r\n`;

        getUserPlayRecord(type, uid).then((record) => {
            let {allData, weekData} = JSON.parse(record)

            if (type === 1) {
                song_name += weekData.slice(0, 40).map(item => {
                    return `${item.song.name} - ${item.score}`
                }).join('\r\n')
            } else {
                song_name += allData.slice(0, 40).map(item => {
                    return `${item.song.name} - ${item.score}`
                }).join('\r\n')
            }
            bot.sendMessage(msg.chat.id, song_name);
        })
    } else {
        bot.sendMessage(msg.chat.id, 'query song list', opts);
    }

});


// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };

    let type = action === 'Week' ? 1 : 0;
    let song_name = `< ${type === 1 ? "Week" : "All"} > \r\n`;

    getUserPlayRecord(type, uid).then((record) => {
        let { allData, weekData} = JSON.parse(record)

        if (type === 1) {
            song_name += weekData.slice(0, 40).map(item => {
                return `${item.song.name} - ${item.score}`
            }).join('\r\n')
        } else {
            song_name += allData.slice(0, 40).map(item => {
                return `${item.song.name} - ${item.score}`
            }).join('\r\n')
        }
        bot.editMessageText(song_name, opts);
    }).catch(() => {
        bot.editMessageText("fetch user list error", opts);
    });
});
