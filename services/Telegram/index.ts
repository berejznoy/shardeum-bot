import {Telegraf} from 'telegraf'
import {startNode} from "../../api";
import {config} from "dotenv";
import Scheduler from "../Schedule";
import {NodeStatuses} from "../../constansts";

config()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'YOUR TG BOT ID')
let prevStatus: keyof typeof NodeStatuses | 'offline' | null = null
let interval: NodeJS.Timer | null= null

const notify = async (ctx: any, state: typeof prevStatus, error: Error | null) => {
        if (state !== 'offline' && state !== prevStatus) {
            ctx.reply(`Status: ${state}${state === 'stopped' ? '. Try to restart...' : ''}`)
            prevStatus = state
        }
        if(state === 'stopped') {
            await startNode()
        }
        if (error && prevStatus !== 'offline') {
            ctx.reply('Status: offline. Check your node')
            prevStatus = 'offline'
        }
}
export const startBot = () => {

    //Запускаем шедулер и сохраняем ответ в кеш
    const scheduler = new Scheduler(60, 60)
    scheduler.start()

    bot.start(ctx => {
        ctx.replyWithHTML(
            'Welcome to <b>Shardeum Status Bot</b>\n\n'+
            '/status - Get node status \n'+
            '/performance - Get server load information \n'+
            '/notify - Enable node status notifications and restart the node if it is stopped \n' +
            '/info - Available commands')
    })

    bot.command('info', ctx => {
        ctx.replyWithHTML(
            'Available commands \n'+
            '/status - Get node status \n'+
            '/performance - Get server load information \n'+
            '/notify - Enable node status notifications and restart the node if it is stopped')
    })

    bot.command('status', async ctx => {
            if(scheduler.cacheError) {
                ctx.reply('Status: offline. Check your node')
                return
            }
            if(scheduler.cacheData) {
                const {state, totalTimeValidating, lastActive, lockedStake, currentRewards} = scheduler.cacheData
                await ctx.replyWithHTML(`Status: ${state}\n`+
                    `Total time validating: ${totalTimeValidating} \n`+
                    `Time since last active: - ${lastActive} \n` +
                    `SHM staked: ${lockedStake} SHM \n` +
                    `Earnings: ${currentRewards} SHM \n \n` +
                    'Вступайте в нашу группу Shardeum - https://t.me/shardeumrus'
                )
            } else {
                ctx.reply('Wait one minute and try again.')
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
                ctx.reply('Wait one minute and try again.')
            }
    })

    bot.command('notify',   ctx => {
            if(interval) {
                ctx.reply('Notifications and node restart already enabled')
                return
            }
            interval = setInterval(() => notify(
                ctx, scheduler?.cacheData?.state || 'offline',
                scheduler?.cacheError
            ), Number(process.env.INTERVAL) || 5000 * 60)
            ctx.reply('Notifications and node restart enabled')
        }
    )

    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}