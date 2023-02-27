import {Pushover} from "pushover-js";
import {getNodeInfo} from "../../api";

export class ShardeumPushover {
    private prevStatus: 'offline' | 'active' | 'standby' | 'stopped'  = 'offline'
    private pushover = new Pushover(process.env.PUSHOVER_USER_ID || "", process.env.PUSHOVER_APP_TOKEN || "");

    private async sendNotification(message: string) {
        this.pushover
            .setSound('pushover')
        try {
            await this.pushover.send('Shardeum', message)
        } catch (error) {
            console.error(error)
        }
    }

    private status = async () => {
        try {
            const {state} = await getNodeInfo()
            if (state !== this.prevStatus) {
                await this.sendNotification(`Node is ${state}`)
                this.prevStatus = state
            }
        } catch (e) {
            //@ts-ignore
            if (this.prevStatus !== 'offline' && e.response!.status === 400) {
                await this.sendNotification('Node is not working')
                this.prevStatus = 'offline'
            }
        }
    }

    startPushover() {
        setInterval(this.status, 5000 * 60)
    }
}