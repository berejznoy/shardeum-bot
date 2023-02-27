import {Auth} from "./service";


type ResponseNodeInfo = {
    data: {
        state: 'active' | 'stopped' | 'standby' ,
        totalTimeRunning: number,
        totalTimeValidating: number,
        lastActive: number,
        lastRotationIndex: string,
        stakeRequirement: string,
        nominatorAddress: string,
        nomineeAddress: string,
        earnings: string,
        lastPayout: string,
        lifetimeEarnings: string,
        performance: {
            memPercentage: number,
            diskPercentage: number,
            cpuPercentage:number
        },
        currentRewards: string,
        lockedStake: string,
        nodeInfo: {
            id: string,
            publicKey: string,
            curvePublicKey: string,
            externalIp: string,
            externalPort: number,
            internalIp: string,
            internalPort: number,
            status: null | string
        }
    }

}

export const getNodeInfo = async(): Promise<ResponseNodeInfo["data"]> => {
    const response = await Auth.http.get('/api/node/status')
    return response?.data
}