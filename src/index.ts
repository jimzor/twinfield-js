import xml2js from 'xml2js';
import fetch from 'node-fetch';
import { Dimension, ExchangeCode, Xml2js } from './types';

export default class Twinfield {
    clientId: string;
    authorization: string;
    redirectUrl: string;
    refreshToken?: string;
    accessToken?: string;
    expiresAt?: Date;
    tokenInfo?: any;

    constructor(clientId: string, clientSecret: string, redirectUrl: string, refreshToken?: string, accessToken?: string) {
        if (!clientId || !clientSecret) {
            throw new Error('clientId and clientSecret are required')
        }

        this.clientId = clientId;

        //base64 encode the client id and secret
        this.authorization = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        this.redirectUrl = redirectUrl;

        if (refreshToken)
            this.refreshToken = refreshToken;
        if (accessToken) {
            this.accessToken = accessToken;
        }
    }


    twinfieldLogin() {
        try {
            const url = `https://login.twinfield.com/auth/authentication/connect/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUrl}&response_type=code&scope=openid+twf.organisationUser+twf.user+twf.organisation+offline_access&state=48fe85e4-41b0-447c-8e5c-3a23a7e835a4&nonce=6d4b4f16-8069-4ad0-88ee-49952043e68d`

            return url


        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async validateAccessToken() {
        try {
            if (!this.accessToken || !this.expiresAt || this.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
                const accessToken = await this.renewAccessToken()
                this.accessToken = accessToken
                this.expiresAt = new Date(Date.now() + 3600 * 1000)
            }

            const response = await fetch('https://login.twinfield.com/auth/authentication/connect/accesstokenvalidation?token=' + this.accessToken, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': this.authorization
                },
            })

            const json: any = await response.json()
            this.expiresAt = new Date(parseInt(json.exp) * 1000)

            //if time is less than 5 minutes, renew token
            if (this.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
                const accessToken = await this.renewAccessToken()
                this.accessToken = accessToken
                return accessToken
            }

            this.tokenInfo = json
            return
        } catch (error) {
            console.error(error)
            throw error
        }
    }


    async exchangeCode(code: string): Promise<ExchangeCode> {
        try {
            const response = await fetch('https://login.twinfield.com/auth/authentication/connect/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': this.authorization
                },
                body: `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUrl}`
            })

            const json: any = await response.json()
            this.accessToken = json.access_token;
            this.refreshToken = json.refresh_token;
            this.expiresAt = new Date(Date.now() + json.expires_in * 1000)
            return json;

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async renewAccessToken() {
        try {
            const response = await fetch('https://login.twinfield.com/auth/authentication/connect/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': this.authorization
                },
                body: `grant_type=refresh_token&refresh_token=${this.refreshToken}&redirect_uri=${this.redirectUrl}`
            })

            const json: any = await response.json()
            this.accessToken = json.access_token
            this.expiresAt = new Date(Date.now() + json.expires_in * 1000)
            return this.accessToken
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async listOffices() {
        await this.validateAccessToken()
        const response = await fetch(`${this.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, {
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
            },
            method: "POST",
            body: `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:twin="http://www.twinfield.com/">
            <soapenv:Header>
                <twin:Header>
                    <twin:AccessToken>${this.accessToken}</twin:AccessToken>
                    <twin:CompanyId>${this.tokenInfo['twf.organisationId']}</twin:CompanyId>
                </twin:Header>
            </soapenv:Header>
            <soapenv:Body>
            <twin:ProcessXmlDocument>
                <twin:xmlRequest>
                    <list xmlns="">
                        <type>offices</type>
                    </list>
                </twin:xmlRequest>
            </twin:ProcessXmlDocument>
            </soapenv:Body>
        </soapenv:Envelope>`
        });

        return response.text()
    }


    async readOffice(officeCode: string) {
        await this.validateAccessToken()
        const response = await fetch(`${this.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, {
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
            },
            method: "POST",
            body: `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:twin="http://www.twinfield.com/">
            <soapenv:Header>
                <twin:Header>
                    <twin:AccessToken>${this.accessToken}</twin:AccessToken>
                    <twin:CompanyCode>${officeCode}</twin:CompanyCode>
                </twin:Header>
            </soapenv:Header>
            <soapenv:Body>
            <twin:ProcessXmlDocument>
                <twin:xmlRequest>
                <read>
                    <type>office</type>
                    <code>${officeCode}</code>
                </read>
            </twin:xmlRequest>
            </twin:ProcessXmlDocument>
            </soapenv:Body>
        </soapenv:Envelope>`
        });

        return response.text()
    }

    async readDimension(officeCode: string, code: string, dimType: string, raw?: boolean) {
        await this.validateAccessToken()
        let xml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:twin="http://www.twinfield.com/">
            <soapenv:Header>
                <twin:Header>
                    <twin:AccessToken>${this.accessToken}</twin:AccessToken>
                    <twin:CompanyCode>${officeCode}</twin:CompanyCode>
                </twin:Header>
            </soapenv:Header>
            <soapenv:Body>
            <twin:ProcessXmlDocument>
                <twin:xmlRequest>
                    <dimension>
                        <office>${officeCode}</office>
                        <type>${dimType}</type>
                        <code>${code}</code>
                    </dimension>
                </twin:xmlRequest>
                </twin:ProcessXmlDocument>
                </soapenv:Body>
            </soapenv:Envelope>`


        const response = await fetch(`${this.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, {
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
            },
            method: "POST",
            body: xml
        });

        const responseXML = await response.text()
        if (raw === true)
            return responseXML

        const js = await this.xml2js(responseXML, { explicitArray: false })
        // console.log(js)
        // if (js.dimension.addresses.address && !Array.isArray(js.dimension.addresses.address))
        // js.dimension.addresses = [js.dimension.addresses.address]

        return js['dimension']
    }


    async addOrModifyDimension(officeCode: string, dimension: Dimension, raw?: boolean) {
        await this.validateAccessToken()
        if (dimension.inuse)
            delete dimension.inuse

        if (Array.isArray(dimension.addresses.address)) {
            if (dimension.addresses.address[0].ictcountrycode)
                for (let i = 0; i < dimension.addresses.address.length; i++) {
                    delete dimension.addresses.address[i].ictcountrycode
                }
        } else {
            if (dimension.addresses.address.ictcountrycode)
                delete dimension.addresses.address.ictcountrycode
        }

        let dimensionXml = await this.js2xml(dimension,)

        let xml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:twin="http://www.twinfield.com/">
            <soapenv:Header>
                <twin:Header>
                    <twin:AccessToken>${this.accessToken}</twin:AccessToken>
                    <twin:CompanyCode>${officeCode}</twin:CompanyCode>
                </twin:Header>
            </soapenv:Header>
            <soapenv:Body>
                <twin:ProcessXmlDocument>
                    <twin:xmlRequest>
                            ${dimensionXml}
                    </twin:xmlRequest>
                </twin:ProcessXmlDocument>
            </soapenv:Body>
        </soapenv:Envelope>`

        const response = await fetch(`${this.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, {
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
            },
            method: "POST",
            body: xml
        });

        const responseXML = await response.text()
        console.log(responseXML)
        if (raw === true)
            return responseXML

        const js = await this.xml2js(responseXML, { explicitArray: false })
        return js['dimension']

    }


    async js2xml(js: any, options?: Xml2js): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const builder = new xml2js.Builder({
                    explicitArray: false,
                    charkey: 'value',
                    attrkey: 'attrkey',
                    rootName: 'dimension',
                    ...options
                });
                let xml = builder.buildObject(js);
                xml = xml.split('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')[1]

                resolve(xml)
            } catch (error) {
                reject(error)
            }
        })
    }


    async xml2js(xml: string, options?: Xml2js): Promise<any> {
        return new Promise((resolve, reject) => {
            const parser = new xml2js.Parser({
                async: true,
                charkey: 'value',
                attrkey: 'attrkey',
                ...options
            });
            parser.parseString(xml, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    if (options?.explicitArray === false)
                        resolve(result['soap:Envelope']['soap:Body']['ProcessXmlDocumentResponse']['ProcessXmlDocumentResult'])
                    else
                        resolve(result['soap:Envelope']['soap:Body'][0]['ProcessXmlDocumentResponse'][0]['ProcessXmlDocumentResult'][0])
                }
            });
        })
    }

}