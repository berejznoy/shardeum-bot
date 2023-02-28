import express from 'express';
import {config} from 'dotenv'
import PushService from "./services/Pushover";
import {Pushover} from "pushover-js";

config();

// Disable SSL checking
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const app = express()

const port = process.env.PORT;


if(process.env.PUSHOVER_USER_ID && process.env.PUSHOVER_APP_TOKEN) {
    const pushService = new PushService(new Pushover(process.env.PUSHOVER_USER_ID || "", process.env.PUSHOVER_APP_TOKEN || ""))
    pushService.start()
}


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})