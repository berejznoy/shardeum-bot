import express from 'express';
import {config} from 'dotenv'

import {startBot} from "./services/Telegram";

config();

// Disable SSL checking
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const app = express()

const port = process.env.PORT;

startBot()


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})