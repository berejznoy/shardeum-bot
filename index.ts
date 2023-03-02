import express from 'express';
import {config} from 'dotenv'
import PushService from "./services/PushoverService";
import {Pushover} from "pushover-js";
import RestartService from "./services/RestartService";
import {startBot} from "./services/TelegramService";

config();

// Disable SSL checking
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const app = express()

const port = process.env.PORT;


// if(process.env.PUSHOVER_USER_ID && process.env.PUSHOVER_APP_TOKEN && process.env.MODE === 'PUSH_AND_RESTART') {
//     const pushService = new PushService(new Pushover(process.env.PUSHOVER_USER_ID || "", process.env.PUSHOVER_APP_TOKEN || ""))
//     pushService.start()
// }
// if(process.env.MODE === 'RESTART_ONLY') {
//     const restartService = new RestartService()
//     restartService.start()
// }

startBot()


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})