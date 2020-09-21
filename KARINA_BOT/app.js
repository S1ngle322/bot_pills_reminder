const Telegraf = require('telegraf')
const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
dayjs.extend(utc)

const BOT_TOKEN = process.env.BOT_TOKEN.toString()
const TARGET_ID = process.env.TARGET_ID.toString()

const bot = new Telegraf(BOT_TOKEN)
const listOfTimes = ['8:00', '10:20', '11:40', '13:00', '15:10', '17:00', '18:30', '19:20', '20:20', '22:00']

const getNow = ()=> dayjs().utcOffset(3)

const messageText = {
    RESPONSE: 'Я буду тебе напоминать о том, что тебе нужно пить таблетки',
    GET_PILLS: 'Выпей таблетку! Уже '
}

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
    bot.telegram.sendMessage(TARGET_ID, 'started').then(r => console.log(r))
    console.log(botInfo)
})

bot.on('message', (ctx) => {
    ctx.reply(messageText.RESPONSE)
})

setInterval(() => {
    const dateNow = getNow()
    for (const time of listOfTimes) {
        const [hour, minute] = time.split(':').map(val => Number(val))
        if (hour === dateNow.hour() && minute === dateNow.minute()) {
            bot.telegram.sendMessage(TARGET_ID, messageText.GET_PILLS + time).then(r => console.log(r))
        }
    }
    console.log(dateNow.hour(), dateNow.minute())

}, 60000)

bot.launch()