import axios from "axios";
import Twinfield from "./Twinfield";
import { IOffice, IOfficesList } from "../types/interfaces";

const CONFIG = {
    headers: {
        "Content-Type": "text/xml; charset=utf-8",
    }
}


export default class Office {
    private parent: Twinfield;

    constructor(parent: Twinfield) {
        this.parent = parent;
    }


    async list(): Promise<IOfficesList> {
        try {
            await this.parent.oAuth.validateAccessToken()
            const r = await axios.post(`${this.parent.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:twin="http://www.twinfield.com/">
            <soapenv:Header>
                <twin:Header>
                    <twin:AccessToken>${this.parent.accessToken}</twin:AccessToken>
                    <twin:CompanyId>${this.parent.tokenInfo['twf.organisationId']}</twin:CompanyId>
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
        </soapenv:Envelope>
            `, CONFIG)

            const parsed = await this.parent.utils.xml2js(r.data)
            return parsed
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async read(officeCode: string): Promise<IOffice> {
        try {
            await this.parent.oAuth.validateAccessToken()

            const body = `            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:twin="http://www.twinfield.com/">
            <soapenv:Header>
                <twin:Header>
                    <twin:AccessToken>${this.parent.accessToken}</twin:AccessToken>
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


            const r = await axios.post(`${this.parent.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, body, CONFIG)
            const parsed = await this.parent.utils.xml2js(r.data)
            return parsed
        }
        catch (err) {
            throw err
        }
    }

}