import express from 'express';
import {config} from 'dotenv'
import {ShardeumPushover} from "./services/Pushover";

config();

//Отключаем проверку сертификата
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const app = express()

const port = process.env.PORT;


const Pushover = new ShardeumPushover()
Pushover.startPushover()




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})