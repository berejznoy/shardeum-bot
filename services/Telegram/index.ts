import {Telegraf} from 'telegraf'
import {startNode} from "../../api";
import { fromUnixTime, format, millisecondsToHours  } from 'date-fns'
import {config} from "dotenv";
import Scheduler from "../Schedule";
import {NodeStatuses} from "../../constansts";

config()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'YOUR TG BOT ID')
let prevStatus: keyof typeof NodeStatuses | 'offline' | null = null
let interval: NodeJS.Timer | null= null

const notify = async (ctx: any, state: typeof prevStatus, error: Error | null) => {
        if (state !== 'offline' && state !== prevStatus) {
            ctx.reply(`Статус: ${state}${state === 'stopped' ? '. Пытаюсь перезапустить...' : ''}`)
            prevStatus = state
        }
        if(state === 'stopped') {
            await startNode()
        }
        if (error && prevStatus !== 'offline') {
            ctx.reply('Статус: offline. Проверьте что контейнер запущен')
            prevStatus = 'offline'
        }
}
export const startBot = () => {

    //Запускаем шедулер и сохраняем ответ в кеш
    const scheduler = new Scheduler(60, 60)
    scheduler.start()

    bot.start(ctx => {
        ctx.replyWithHTML(
            'Приветствую в <b>Shardeum Status</b>\n\n'+
            '/status - Получение информации о ноде \n'+
            '/notify - Включить уведомления о статусе ноды \n' +
            '/info - повтор доступных команд')
    })

    bot.command('info', ctx => {
        ctx.replyWithHTML(
            'Доступные команды \n'+
            '/status - Получение информации о ноде \n'+
            '/notify - Включить уведомления о статусе ноды и перезапустить ноду если она остановлена')
    })

    bot.command('status', async ctx => {
            if(scheduler.cacheError) {
                ctx.reply('Статус: offline. Проверьте что контейнер запущен')
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
                ctx.reply('Запрашиваем информацию, попробуйте снова через пару минут')
            }
    })

    bot.command('notify',   ctx => {
            if(interval) {
                ctx.reply('Уведомления и перезапуск уже включены')
                return
            }
            interval = setInterval(() => notify(
                ctx, scheduler?.cacheData?.state || 'offline',
                scheduler?.cacheError
            ), Number(process.env.INTERVAL) || 5000 * 60)
            ctx.reply('Уведомления и перезапуск включены')
        }
    )

    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}