import express from 'express';
import {Pushover} from 'pushover-js'
import {Statuses} from "./constansts";
import {config} from 'dotenv'
import {getNodeInfo} from "./api";

config();

const index = express()

const port = process.env.PORT;

const pushover = new Pushover(process.env.PUSHOVER_USER_ID || "", process.env.PUSHOVER_APP_TOKEN || "")


let prevStatus = Statuses.Null

const sendNotification = async (message: string) => {
    pushover
        .setSound('cashregister')
    try {
        await pushover.send('Shardeum', message)
    } catch (error) {
        console.error(error)
    }
}


const notifications = {
    [Statuses.Active]: async() => await sendNotification('Node is active'),
    [Statuses.StandBy]: async() => await sendNotification('Node is standby'),
    [Statuses.Offline]: async() => await sendNotification('Node is not working'),
}


const status = async() => {
    try {
        const response = await getNodeInfo()
        const currentStatus = response?.status ? Statuses.Active : Statuses.StandBy
        if(currentStatus !== prevStatus) {
            await notifications[currentStatus]()
        }
        prevStatus = currentStatus
    }  catch (e) {
        if(prevStatus !== Statuses.Offline) {
            await notifications[Statuses.Offline]()
            prevStatus = Statuses.Offline
        }
    }

}
setInterval(status, 1000 * 60);

index.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})