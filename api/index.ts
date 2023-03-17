import AxiosWithAuth from "./AxiosWithAuth";


export type ResponseNodeInfo = {
    data: {
        state: 'active' | 'stopped' | 'standby' ,
        totalTimeRunning: number,
        totalTimeValidating: string | boolean,
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


const axiosWithAuth = new AxiosWithAuth();


export const getNodeInfo = async(): Promise<ResponseNodeInfo["data"]> => {
    const response = await axiosWithAuth.get('/api/node/status')
    return response?.data
}

export const startNode = async(): Promise<void> => {
    await axiosWithAuth.post('/api/node/start')
}
export const stopNode = async(): Promise<void> => {
    await axiosWithAuth.post('/api/node/stop')
}