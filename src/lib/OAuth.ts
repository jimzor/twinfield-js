// import Twinfield from "./Twinfield";

import { ExchangeCode } from "../types";
import Twinfield from "./Twinfield";
import axios from 'axios'

export default class OAuth {
    private parent: Twinfield;

    constructor(parent: Twinfield) {
        this.parent = parent;


        if (!this.parent.clientId || !this.parent.clientSecret) {
            throw new Error('clientId and clientSecret are required')
        }

        //base64 encode the client id and secret
        this.parent.authorization = 'Basic ' + Buffer.from(`${this.parent.clientId}:${this.parent.clientSecret}`).toString('base64');
      
    }



    //Twinfield Login URL
    twinfieldLogin() {
        try {
            const url = `https://login.twinfield.com/auth/authentication/connect/authorize?client_id=${this.parent.clientId}&redirect_uri=${this.parent.redirectUrl}&response_type=code&scope=openid+twf.organisationUser+twf.user+twf.organisation+offline_access&state=48fe85e4-41b0-447c-8e5c-3a23a7e835a4&nonce=6d4b4f16-8069-4ad0-88ee-49952043e68d`

            return url


        } catch (error) {
            console.error(error)
            throw error
        }
    }



    //Exchange Code for Token
    async exchangeCode(code: string): Promise<ExchangeCode> {
        try {
            const r = await axios.post('https://login.twinfield.com/auth/authentication/connect/token', {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.parent.redirectUrl
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': this.parent.authorization
                }
            })

            this.parent.accessToken = r.data.access_token;
            this.parent.refreshToken = r.data.refresh_token;
            this.parent.expiresAt = new Date(Date.now() + r.data.expires_in * 1000)
            return r.data;

        } catch (error) {
            console.error(error)
            throw error
        }
    }





    //Validate Token
    async validateAccessToken() {
        try {
            if (!this.parent.accessToken || !this.parent.expiresAt || this.parent.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
                const accessToken = await this.renewAccessToken()
                this.parent.accessToken = accessToken
                this.parent.expiresAt = new Date(Date.now() + 3600 * 1000)
            }

            const response = await axios.get('https://login.twinfield.com/auth/authentication/connect/accesstokenvalidation?token=' + this.parent.accessToken, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': this.parent.authorization
                },
            })

            this.parent.expiresAt = new Date(parseInt(response.data.exp) * 1000)

            //if time is less than 5 minutes, renew token
            if (this.parent.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
                const accessToken = await this.renewAccessToken()
                this.parent.accessToken = accessToken
                return accessToken
            }

            this.parent.tokenInfo = response.data
            return
        } catch (error) {
            console.error(error)
            throw error
        }
    }



    //renewAccessToken

    async renewAccessToken() {
        try {
            const r = await axios.post('https://login.twinfield.com/auth/authentication/connect/token', {
                grant_type: 'refresh_token',
                refresh_token: this.parent.refreshToken,
                redirect_uri: this.parent.redirectUrl
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': this.parent.authorization
                }
            })

            this.parent.accessToken = r.data.access_token
            this.parent.expiresAt = new Date(Date.now() + r.data.expires_in * 1000)
            return this.parent.accessToken
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

