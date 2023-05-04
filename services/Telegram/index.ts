import {Telegraf} from 'telegraf'
import {config} from "dotenv";
import Scheduler from "../Schedule";
import {isValid} from 'date-fns'
import {watch, cacheWrapper, formatSeconds} from './helpers'
import axios from "axios";

config()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'YOUR TG BOT ID')
let interval: NodeJS.Timer | null = null
const FAUCET_URL = 'https://get-shm.online'

export const startBot = () => {

    //Запускаем шедулер и сохраняем ответ в кеш
    const scheduler = new Scheduler(30, 300)
    scheduler.start()

    bot.start(ctx => {
        ctx.replyWithHTML(
            'Welcome to <b>Shardeum Status Bot</b>\n\n' +
            '/status - Get node status \n' +
            '/performance - Get server load information \n' +
            '/uptime - Get node uptime \n' +
            '/balance - Get wallet balance \n' +
            '/watch - Enable node watching \n' +
            '/gettokens - Request tokens from a faucet \n' +
            '/info - Available commands')
    })
    // Notification command group
    bot.command('info', ctx => {
        ctx.replyWithHTML(
            'Available commands \n' +
            '/status - Get node status \n' +
            '/performance - Get server load information \n' +
            '/uptime - Get node uptime \n' +
            '/balance - Get wallet balance \n' +
            '/watch - Enable node watching \n' +
            '/gettokens - Request tokens from a faucet' )
    })

    bot.command('status', async ctx => {
        cacheWrapper(scheduler.cacheData, ctx, async () => {
            if (scheduler.cacheData) {
                const {state, totalTimeValidating, lastActive, lockedStake, currentRewards, isAddressAlreadyUse  } = scheduler.cacheData
                await ctx.replyWithHTML(`Status: <b>${state}</b>\n` +
                    `Total time validating: ${totalTimeValidating} \n` +
                    `Time since last active: ${isValid(new Date(lastActive)) ? new Date(lastActive).toLocaleDateString() : ''} \n` +
                    `SHM staked: ${lockedStake ? Number(lockedStake).toFixed(2) : 0} SHM \n` +
                    `Earnings: ${currentRewards ? Number(currentRewards).toFixed(2) : 0} SHM \n` +
                    `<b>${isAddressAlreadyUse ? 'Error: This wallet already has an active stake on a different node. Remove your stake first if you wish to stake for the current node.' : ''}</b> \n \n` +
                    'Вступайте в нашу группу Shardeum - https://t.me/shardeumrus'
                )
            }
        }, scheduler.cacheError)
    })

    bot.command('performance', async ctx => {
        cacheWrapper(scheduler.cacheData, ctx, async () => {
            if (scheduler.cacheData) {
                const {performance} = scheduler.cacheData
                await ctx.replyWithHTML(
                    `CPU usage : ${performance?.cpuPercentage?.toFixed(2)} % \n` +
                    `RAM usage : ${performance?.memPercentage?.toFixed(2)} % \n` +
                    `Disk usage : ${performance?.diskPercentage?.toFixed(2)} % \n`
                )
            }
        }, scheduler.cacheError)
    })

    bot.command('uptime', ctx => {
            cacheWrapper(scheduler.cacheData, ctx, async () => {
                if (scheduler.cacheData) {
                    const {totalTimeRunning} = scheduler.cacheData
                    const helperDate = formatSeconds(totalTimeRunning);
                    ctx.reply(`Node total time running: ${helperDate.days} day(s) ${helperDate.hours} hour(s) ${helperDate.minutes} minute(s) ${helperDate.seconds} second(s)`)
                }
            }, scheduler.cacheError)
        }
    )
    bot.command('balance', async ctx => {
            try {
                const wallet = process.env.WALLET_ADDRESS
                if(!wallet){
                    ctx.reply('This command is not available. Enter your wallet address in the .env file and restart the bot')
                    return
                }
                ctx.reply('Sending a request. Please wait...')
                const response = await axios.get(`${FAUCET_URL}/api/balance`, {
                    params: {
                        address: wallet || ''
                    }
                })
                ctx.reply(`Balance: ${response?.data || 0} SHM`)
            } catch (e) {
                ctx.reply('Something went wrong. Try again')
            }
        }
    )
    //Action command group

    bot.command('watch', ctx => {
            if (interval) {
                ctx.reply('Node watching already enabled')
                return
            }
            interval = setInterval(() => watch(
                ctx, scheduler?.cacheData ? scheduler?.cacheData?.state : 'offline',
                scheduler?.cacheError
            ), Number(process.env.INTERVAL) || 5000 * 60)
            ctx.reply('Node watching enabled')
        }
    )

    bot.command('unwatch', ctx => {
            if(interval) {
                clearInterval(interval)
                ctx.reply('Node watching disabled')
                interval = null
            } else {
                ctx.reply('Node watching not running')
            }
        }
    )

    bot.command('gettokens', async ctx => {
            try {
                const wallet = process.env.WALLET_ADDRESS
                if(!wallet){
                    ctx.reply('This command is not available. Enter your wallet address in the .env file and restart the bot')
                    return
                }
                ctx.reply('Sending a request. Please wait...')
                const response: {data: {success: boolean, message: string}} = await axios.post(`${FAUCET_URL}/api/sendSHM`, null, {
                    params: {
                        address: wallet || ''
                    }
                })
                if (response?.data?.success) {
                    ctx.reply('Funds have been transferred to your address. Should reflect in your wallet shortly');
                } else {
                    ctx.reply(response.data.message);
                }
            } catch (e) {
                ctx.reply(e.message)
            }
        }
    )


    //Start bot
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}