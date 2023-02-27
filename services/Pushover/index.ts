import {Pushover} from "pushover-js";
import {Statuses} from "../../constansts";
import {getNodeInfo} from "../../api";


export class ShardeumPushover {
    private pushover = new Pushover(process.env.PUSHOVER_USER_ID || "", process.env.PUSHOVER_APP_TOKEN || "");
    private prevStatus = Statuses.Null

    private async sendNotification(message: string) {
        this.pushover
            .setSound('pushover')
        try {
            await this.pushover.send('Shardeum', message)
        } catch (error) {
            console.error(error)
        }
    }

    private notifications = {
        [Statuses.Active]: async () => await this.sendNotification('Node is active'),
        [Statuses.StandBy]: async () => await this.sendNotification('Node is standby'),
        [Statuses.Offline]: async () => await this.sendNotification('Node is not working'),
    }

    private status = async () => {
        try {
            const response = await getNodeInfo()
            const currentStatus = response?.status ? Statuses.Active : Statuses.StandBy
            if (currentStatus !== this.prevStatus) {
                await this.notifications[currentStatus]()
            }
            this.prevStatus = currentStatus
        } catch (e) {
            if (this.prevStatus !== Statuses.Offline) {
                await this.notifications[Statuses.Offline]()
                this.prevStatus = Statuses.Offline
            }
        }
    }

    startPushover() {
        setInterval(this.status, 1000 * 60)
    }
}