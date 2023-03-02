import {Telegraf} from 'telegraf'
import {getNodeInfo, startNode, stopNode} from "../../api";
import { fromUnixTime, format, millisecondsToHours  } from 'date-fns'
import RestartService from "../RestartService";
import {config} from "dotenv";

config()
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'YOUR TG BOT ID')
let prevStatus: 'offline' | 'active' | 'standby' | 'stopped' = 'offline'
let interval: any = null

const notifyNode = async (ctx: any) => {
    try {
        const {state} = await getNodeInfo()
        if (state !== prevStatus) {
            ctx.reply(`Статус: ${state}${state === 'stopped' ? '. Пытаюсь перезапустить...' : ''}`)
            prevStatus = state
        }
        if(state === 'stopped') {
            await startNode()
        }
    } catch (error) {
        if (prevStatus !== 'offline' && error.response?.status !== 400) {
            ctx.reply('Статус: нода не работает')
            prevStatus = 'offline'
        } else {
            ctx.reply('Что-то пошло не так')
        }}
}
export const startBot = () => {
    bot.start(ctx => {
        ctx.replyWithHTML(
            'Приветсвую в <b>Shardeum Status</b>\n\n'+
            '/status - Получение информации о ноде \n'+
            //'/startNode - Запустить ноду \n'+
            //'/stopNode - Остановить ноду \n'+
            // '/autoRestart - Включить автоматический перезапуск ноды \n' +
            '/notify - Включить уведомления о статусе ноды \n' +
            //'/stopNotify - Включить уведомления о статусе ноды \n' +
            '/info - повтор доступных команд')
    })
    bot.command('info', ctx => {
        ctx.replyWithHTML(
            'Приветсвую в <b>Shardeum Status</b>\n\n'+
            '/status - Получение информации о ноде \n'+
            //'/startNode - Запустить ноду \n'+
            //'/stopNode - Остановить ноду \n'+
            // '/autoRestart - Включить автоматический перезапуск ноды \n' +
            //'/stopNotify - Включить уведомления о статусе ноды \n' +
            '/notify - Включить уведомления о статусе ноды и перезапустить ноду если она остановлена')
    })
    bot.command('status', async ctx => {
        try{
            ctx.reply('Отправляю запрос, подождите...')
            const {state, totalTimeValidating, lastActive} = await getNodeInfo()
            const lastNodeActive = String(lastActive).replace(/0*$/,"")
            await ctx.replyWithHTML(`Status: ${state}\n`+
                `Total time validating - ${totalTimeValidating ? millisecondsToHours(totalTimeValidating) : ''}h \n`+
                `Time since last active: - ${lastActive ? format(fromUnixTime(Number(lastNodeActive)), 'dd.MM.yyyy: HH:mm') : ''}`
            )
        } catch (e) {
            ctx.reply('Что-то пошло не так')
        } finally {
            ctx.reply('Наша группа Shardeum - https://t.me/shardeum_rus')
        }

    })
    // bot.command('startNode', async ctx => {
    //     try {
    //         ctx.reply('Отправляю запрос, подождите...')
    //         const {state} = await getNodeInfo()
    //         if(state !== 'stopped') {
    //             ctx.reply('Нода уже запущена')
    //         } else {
    //             await startNode()
    //             ctx.reply('Нода запущена, проверьте статус отправив /status')
    //         }
    //     } catch (e) {
    //         ctx.reply('Что-то пошло не так')
    //     }
    // })
    // bot.command('stopNode', async ctx => {
    //     try {
    //         ctx.reply('Отправляю запрос, подождите...')
    //         const {state} = await getNodeInfo()
    //         if(state === 'stopped') {
    //             ctx.reply('Нода уже остановлена')
    //         } else {
    //             await stopNode()
    //             ctx.reply('Нода остановлена')
    //         }
    //     } catch (e) {
    //         ctx.reply('Что-то пошло не так')
    //     }
    // })

    // bot.command('autoRestart',  ctx => {
    //     try {
    //         ctx.reply('Отправляю запрос, подождите...')
    //         const restartService = new RestartService()
    //         restartService.start()
    //         ctx.reply('Автозапуск ноды включен')
    //     } catch (e) {
    //         ctx.reply('Что-то пошло не так')
    //     }
    // })

    bot.command('notify',  async ctx => {
            if(interval) {
                ctx.reply('Уведомления и перезапуск уже включены')
                return
            }
            await ctx.reply('Отправляю запрос, подождите...')
            interval = setInterval(() => notifyNode(ctx), Number(process.env.INTERVAL) || 5000 * 60)
            await ctx.reply('Уведомления и перезапуск включены')
        }
    )

    // bot.command('stopNotify',  async ctx => {
    //         clearInterval(interval)
    //         ctx.reply('Уведомления и перезапуск выключены')
    //         interval = null
    //     }
    // )

    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}