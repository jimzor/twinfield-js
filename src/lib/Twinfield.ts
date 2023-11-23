// import xml2js from 'xml2js';
// import fetch from 'node-fetch';
// import { Dimension, Xml2js } from '../types';
import BrowseData from './BrowseData';
import OAuth from './OAuth';
import Office from './Offices';
import Utils from './Utils';

export default class Twinfield {
    oAuth: OAuth;
    office: Office;
    utils: Utils;
    browseData: BrowseData;
    clientId: string;
    clientSecret: string;
    authorization: string;
    redirectUrl: string;
    refreshToken?: string;
    accessToken?: string;
    expiresAt?: Date;
    tokenInfo?: any;


    constructor(clientId: string, clientSecret: string, redirectUrl: string, refreshToken?: string, accessToken?: string) {

        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
        this.authorization = '';
        this.redirectUrl = redirectUrl;

        if (refreshToken)
            this.refreshToken = refreshToken;
        if (accessToken) {
            this.accessToken = accessToken;
        }

        this.oAuth = new OAuth(this)
        this.utils = new Utils(this)
        this.office = new Office(this)
        this.browseData = new BrowseData(this)
    }

//     async readDimension(officeCode: string, code: string, dimType: string, raw?: boolean): Promise<Dimension> {
//         await this.validateAccessToken()
//         let xml = `
//         <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//         xmlns:twin="http://www.twinfield.com/">
//             <soapenv:Header>
//                 <twin:Header>
//                     <twin:AccessToken>${this.accessToken}</twin:AccessToken>
//                     <twin:CompanyCode>${officeCode}</twin:CompanyCode>
//                 </twin:Header>
//             </soapenv:Header>
//             <soapenv:Body>
//             <twin:ProcessXmlDocument>
//                 <twin:xmlRequest>
//                     <dimension>
//                         <office>${officeCode}</office>
//                         <type>${dimType}</type>
//                         <code>${code}</code>
//                     </dimension>
//                 </twin:xmlRequest>
//                 </twin:ProcessXmlDocument>
//                 </soapenv:Body>
//             </soapenv:Envelope>`


//         const response = await fetch(`${this.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, {
//             headers: {
//                 "Content-Type": "text/xml; charset=utf-8",
//             },
//             method: "POST",
//             body: xml
//         });

//         const responseXML = await response.text()
//         // if (raw === true)
//         //     return responseXML

//         const js = await this.xml2js(responseXML, { explicitArray: false })
//         // console.log(js)
//         // if (js.dimension.addresses.address && !Array.isArray(js.dimension.addresses.address))
//         // js.dimension.addresses = [js.dimension.addresses.address]

//         return js['dimension']
//     }


//     async addOrModifyDimension(officeCode: string, dimension: Dimension, raw?: boolean) {
//         await this.validateAccessToken()
//         if (dimension.inuse)
//             delete dimension.inuse

//         if (Array.isArray(dimension.addresses.address)) {
//             if (dimension.addresses.address[0].ictcountrycode)
//                 for (let i = 0; i < dimension.addresses.address.length; i++) {
//                     delete dimension.addresses.address[i].ictcountrycode
//                 }
//         } else {
//             if (dimension.addresses.address.ictcountrycode)
//                 delete dimension.addresses.address.ictcountrycode
//         }

//         let dimensionXml = await this.js2xml(dimension,)

//         let xml = `
//         <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//         xmlns:twin="http://www.twinfield.com/">
//             <soapenv:Header>
//                 <twin:Header>
//                     <twin:AccessToken>${this.accessToken}</twin:AccessToken>
//                     <twin:CompanyCode>${officeCode}</twin:CompanyCode>
//                 </twin:Header>
//             </soapenv:Header>
//             <soapenv:Body>
//                 <twin:ProcessXmlDocument>
//                     <twin:xmlRequest>
//                             ${dimensionXml}
//                     </twin:xmlRequest>
//                 </twin:ProcessXmlDocument>
//             </soapenv:Body>
//         </soapenv:Envelope>`

//         const response = await fetch(`${this.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, {
//             headers: {
//                 "Content-Type": "text/xml; charset=utf-8",
//             },
//             method: "POST",
//             body: xml
//         });

//         const responseXML = await response.text()
//         console.log(responseXML)
//         if (raw === true)
//             return responseXML

//         const js = await this.xml2js(responseXML, { explicitArray: false })
//         return js['dimension']

//     }


}