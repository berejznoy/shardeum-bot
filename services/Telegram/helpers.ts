import {ResponseNodeInfo, startNode} from "../../api";
import {NodeStatuses} from "../../constansts";
import {format, intervalToDuration, Duration} from 'date-fns';
let prevStatus: keyof typeof NodeStatuses | 'offline' | null = null

export const watch = async (ctx: any, state: typeof prevStatus, error: Error | null) => {
    if (state !== 'offline' && state !== prevStatus) {
        ctx.reply(`Status: ${state}${state === 'stopped' ? '. Try to restart...' : ''}`)
        prevStatus = state
    }
    if (state === 'stopped') {
        await startNode()
    }
    if (error && prevStatus !== 'offline') {
        ctx.reply('Status: offline. Check your node')
        prevStatus = 'offline'
    }
}

export const formatSeconds = (seconds: number) => {
    return intervalToDuration({ start: 0, end: seconds * 1000 }) as Duration;
}

export const cacheWrapper = (cacheData: ResponseNodeInfo['data'] | undefined, ctx: any, cb: () => void, error: Error | null) => {
    if (error) {
        ctx.reply('Status: offline. Check your node')
        return
    }
    if (cacheData) {
        return cb()
    } else {
        ctx.reply('Wait one 30 seconds and try again.')
    }
}