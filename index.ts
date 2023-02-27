import express from 'express';
import {config} from 'dotenv'
import {ShardeumPushover} from "./services/Pushover";

config();

const index = express()

const port = process.env.PORT;

const Pushover = new ShardeumPushover()

Pushover.startPushover()

index.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})