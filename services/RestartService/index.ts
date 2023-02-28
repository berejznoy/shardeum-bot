import {getNodeInfo, startNode} from "../../api";

export default class RestartService{
    private restartNode = async () => {
        const {state} = await getNodeInfo()
        if(state === 'stopped') {
            await startNode()
        }
    }
    start() {
        setInterval(this.restartNode, Number(process.env.INTERVAL) || 5000 * 60)
    }
}