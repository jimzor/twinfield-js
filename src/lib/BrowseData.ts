// import axios from "axios";
import { IGeneralLedgerTransactions, IGeneralLedgerTransactionsArgs } from "../types/interfaces";
import Twinfield from "./Twinfield";
import axios from "axios";

const CONFIG = {
    headers: {
        "Content-Type": "text/xml; charset=utf-8",
    }
}


export default class BrowseData {
    private parent: Twinfield;

    constructor(parent: Twinfield) {
        this.parent = parent;
    }


    async generalLedgerTransactions(version: 'v3', args: IGeneralLedgerTransactionsArgs): Promise<IGeneralLedgerTransactions> {
        await this.parent.oAuth.validateAccessToken()

        const body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:twin="http://www.twinfield.com/">
        <soapenv:Header>
            <twin:Header>
                <twin:AccessToken>${this.parent.accessToken}</twin:AccessToken>
                <twin:CompanyCode>${args.officeCode}</twin:CompanyCode>
            </twin:Header>
        </soapenv:Header>
        <soapenv:Body>
            <twin:ProcessXmlDocument>
                <twin:xmlRequest>
                    <columns code="030_3">
                    <column id="1">
                        <field>fin.trs.head.office</field>
                        <label>Administratie</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                    <column id="2">
                        <field>fin.trs.head.officename</field>
                        <label>Adm.naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                    <column id="3">
                        <field>fin.trs.head.year</field>
                        <label>Jaar</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                    <column id="4">
                        <field>fin.trs.head.period</field>
                        <label>Periode</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                    <column id="5">
                        <field>fin.trs.head.yearperiod</field>
                        <label>Jaar/periode (JJJJ/PP)</label>
                        <visible>false</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from>${args.fromDate}</from>
                        <to>${args.toDate}</to>
                        <finderparam></finderparam>
                    </column>
                    <column id="6">
                        <field>fin.trs.head.code</field>
                        <label>Dagboek</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                    <column id="7">
                        <field>fin.trs.head.number</field>
                        <label>Boekingsnummer</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                    <column id="15">
                        <field>fin.trs.head.username</field>
                        <label>Gebruikersnaam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                    <column id="16">
                        <field>fin.trs.line.dim1</field>
                        <label>Grootboekrek.</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from>${args.fromLedger}</from>
                        <to>${args.toLedger}</to>
                        <finderparam></finderparam>
                    </column>
                        <column id="37">
                        <field>fin.trs.line.dim1group2name</field>
                        <label>Groepnaam 2</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                    <column id="49">
                        <field>fin.trs.mng.type</field>
                        <label>transactie type groep</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>
                </columns>
                </twin:xmlRequest>
            </twin:ProcessXmlDocument>
        </soapenv:Body>
        </soapenv:Envelope>
        `


        const r = await axios.post(`${this.parent.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, body, CONFIG)

        const parsed = await this.parent.utils.xml2js(r.data)

        if (parsed.th && !Array.isArray(parsed.th)) {
            parsed.th = [parsed.th]
        }

        if (parsed.th[0].td && !Array.isArray(parsed.th[0].td)) {
            parsed.th.td = [parsed.th.td]
        }

        if (parsed.tr && !Array.isArray(parsed.tr)) {
            parsed.tr = [parsed.tr]
        }

        if (parsed.tr)
            for (let i = 0; i < parsed.tr.length; i++) {
                if (parsed.tr[i].td && !Array.isArray(parsed.tr[i].td)) {
                    parsed.tr[i].td = [parsed.tr[i].td]
                }
            }

        return parsed
    }


}