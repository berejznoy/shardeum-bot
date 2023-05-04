import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {config} from 'dotenv'
import {hashSha256} from "../utils";

config()

class AxiosWithAuth {
    private instance: AxiosInstance;
    private token: string | null;
    private readonly apiUrl: string;
    private readonly tokenUrl: string;
    private readonly password: string;

    constructor() {
        this.apiUrl = process.env.BASE_URL || 'YOUR NODE IP WITH PORT';
        this.tokenUrl = `${process.env.BASE_URL}/auth/login`;
        this.password = process.env.DASHBOARD_PASSWORD || 'YOUR DASHBOARD PASSWORD'
        this.token = null;
        this.instance = axios.create({
            baseURL: this.apiUrl,
        });
        this.instance.interceptors.request.use(async (config) => {
            const requestConfig = await this.interceptRequest(config || {});
            return requestConfig;
        });
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => this.interceptResponse(response),
            async (error) => {
                if (error.response && error.response.status === 403 && error.config && !error.config.__isRetryRequest) {
                    return this.refreshTokenAndRetry(error.config);
                } else {
                    return Promise.reject(error);
                }
            }
        );
    }

    public async getToken(): Promise<string | null> {
        if (!this.token) {
            try {
                const sha256digest = await hashSha256(this.password)
                const response = await axios.post(this.tokenUrl, { password: sha256digest });
                this.token = response.data?.accessToken;
            } catch (error) {
                console.error(`Failed to get token: ${error}`);
                return null;
            }
        }
        return this.token;
    }

    public async refreshToken(): Promise<string | null> {
        try {
            const sha256digest = await hashSha256(this.password)
            const response = await axios.post(this.tokenUrl, { password: sha256digest });
            this.token = response.data.accessToken;
            return this.token;
        } catch (error) {
            console.error(`Failed to refresh token: ${error}`);
            return null;
        }
    }

    private async refreshTokenAndRetry(config: any): Promise<any> {
        try {
            const newToken = await this.refreshToken();
            if (newToken) {
                config.headers['X-Api-Token'] = newToken;
                config.__isRetryRequest = true;
                return axios.request(config);
            } else {
                console.error(`Failed to refresh token and retry request`);
                return Promise.reject('Failed to refresh token and retry request');
            }
        } catch (error) {
            console.error(`Failed to refresh token and retry request: ${error}`);
            return Promise.reject(error);
        }
    }

    private async interceptRequest(config: any): Promise<any> {
        const token = await this.getToken();
        if (token) {
            config.headers = {
                ...config.headers,
                'X-Api-Token': token,
            };
        }
        return config;
    }

    private interceptResponse(response: AxiosResponse): AxiosResponse {
        return response;
    }

    public async get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
        return this.instance.get(url, config);
    }

    public async post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
        return this.instance.post(url, data, config);
    }
}
export default AxiosWithAuth