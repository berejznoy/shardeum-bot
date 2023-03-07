import {Telegraf} from 'telegraf'
import {startNode} from "../../api";
import { fromUnixTime, format, millisecondsToHours  } from 'date-fns'
import {config} from "dotenv";
import Scheduler from "../Schedule";
import {dictionaries, NodeStatuses} from "../../constansts";

config()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'YOUR TG BOT ID')
let prevStatus: keyof typeof NodeStatuses | 'offline' | null = null
let interval: NodeJS.Timer | null= null
const lang = process.env.lang  || 'en'
const notify = async (ctx: any, state: typeof prevStatus, error: Error | null) => {
        if (state && state !== 'offline' && state !== prevStatus) {
            // @ts-ignore
            ctx.reply(dictionaries.statuses[state][lang])
            prevStatus = state
        }
        if(state === 'stopped') {
            await startNode()
        }
        if (error && prevStatus !== 'offline') {
            // @ts-ignore
            ctx.reply(dictionaries.statuses.offline[lang])
            prevStatus = 'offline'
        }
}
export const startBot = () => {

    //Запускаем шедулер и сохраняем ответ в кеш
    const scheduler = new Scheduler(60, 60)
    scheduler.start()

    bot.start(ctx => {
        // @ts-ignore
        ctx.replyWithHTML(dictionaries.commands[lang])
    })

    bot.command('info', ctx => {
        // @ts-ignore
        ctx.replyWithHTML(dictionaries.commands[lang])
    })

    bot.command('status', async ctx => {
            if(scheduler.cacheError) {
                // @ts-ignore
                ctx.reply(dictionaries.statuses.offline[lang])
                return
            }
            if(scheduler.cacheData) {
                const {state, totalTimeValidating, lastActive, lockedStake, currentRewards} = scheduler.cacheData
                const lastNodeActive = String(lastActive).replace(/0*$/,"")
                await ctx.replyWithHTML(`Status: ${state}\n`+
                    `Total time validating: ${totalTimeValidating ? millisecondsToHours(totalTimeValidating) : ''}h \n`+
                    `Time since last active: - ${lastActive ? format(fromUnixTime(Number(lastNodeActive)), 'dd.MM.yyyy: HH:mm') : ''} \n` +
                    `SHM staked: ${lockedStake} SHM \n` +
                    `Earnings: ${currentRewards} SHM \n \n` +
                    'Вступайте в нашу группу Shardeum - https://t.me/shardeumrus'
                )
            } else {
                // @ts-ignore
                ctx.reply(dictionaries.waiting[lang])
            }
    })

    bot.command('performance', async ctx => {
            if(scheduler.cacheData) {
                const {performance} = scheduler.cacheData
                await ctx.replyWithHTML(
                    `CPU usage : ${performance?.cpuPercentage?.toFixed(2)} % \n`+
                    `RAM usage : ${performance?.memPercentage?.toFixed(2)} % \n`+
                    `Disk usage : ${performance?.diskPercentage?.toFixed(2)} % \n`
                )
            } else {
                // @ts-ignore
                ctx.reply(dictionaries.waiting[lang])
            }
    })

    bot.command('notify',   ctx => {
            if(interval) {
                // @ts-ignore
                ctx.reply(dictionaries.notify.exist[lang])
                return
            }
            interval = setInterval(() => notify(
                ctx, scheduler?.cacheData?.state || 'offline',
                scheduler?.cacheError
            ), Number(process.env.INTERVAL) || 5000 * 60)
            // @ts-ignore
        ctx.reply(dictionaries.notify.new[lang])
        }
    )

    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}