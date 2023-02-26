import axios from "axios";

type ResponseNodeInfo = {
    data: {
        nodeInfo:
            {
                publicKey: string,
                curvePublicKey:string,
                externalIp:string,
                externalPort:number,
                internalIp:string,
                internalPort:number,
                status: string | null,
                appData:
                    {
                        shardeumVersion: string,
                        minVersion: string,
                        activeVersion: string
                    }
            }
    }
}
export const getNodeInfo = async(): Promise<ResponseNodeInfo["data"]["nodeInfo"]> => {
    const response = await axios.get(`${process.env.BASE_URL}/nodeinfo`)
    return response?.data?.nodeInfo
}