import axios from "axios";

export class Auth {
    private static token: string;
    static http: any
    static async getAuth() {

        const {data: {accessToken}} = await axios.post(`${process.env.BASE_URL}/auth/login`, {
            password: 'S32069257b'
        })
        this.token = accessToken
    }
    public static async request() {
        const request = await axios.create({
            baseURL: `${process.env.BASE_URL}`,
        })

        request.interceptors.request.use(
            request => {
                if (Auth.token) {
                    request.headers['X-Api-Token'] = this.token
                }
                return request
            },
            error => {
                return Promise.reject(error)
            }
        )
        Auth.http = request
    }
}