import express from 'express';
import {config} from 'dotenv'
import {ShardeumPushover} from "./services/Pushover";
import {Auth} from "./api/service";

config();

//Отключаем проверку сертификата
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const index = express()

const port = process.env.PORT;

Auth.getAuth().then(() => {
    Auth.request().then(() => {
        const Pushover = new ShardeumPushover()
        Pushover.startPushover()
    })
}).catch(() => 'Error')



index.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})