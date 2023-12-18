// import axios from "axios";
import { IAnnualReportMultiCurrencyArgs, IAnnualReportYTD, IAnnualReportYTDArgs, IAnnualReportYTDConfig, IGeneralLedger000Config, IGeneralLedger030Config, IGeneralLedger060Config, IGeneralLedgerTransactions, IGeneralLedgerTransactionsArgs } from '../types/interfaces';
import Twinfield from './Twinfield';
import axios from 'axios';

const CONFIG = {
    headers: {
        'Content-Type': 'text/xml; charset=utf-8'
    }
};

export default class BrowseData {
    private parent: Twinfield;

    constructor(parent: Twinfield) {
        this.parent = parent;
    }

    async generalLedgersDetailsV3(args: IGeneralLedgerTransactionsArgs, config?: IGeneralLedger030Config): Promise<IGeneralLedgerTransactions> {
        await this.parent.oAuth.validateAccessToken();

        let body = `
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
                `

        if (config?.office)
            body += `<column id="1">
                        <field>fin.trs.head.office</field>
                        <label>Administratie</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                        </column>`
        if (config?.officeName)
            body += `<column id="2">
                        <field>fin.trs.head.officename</field>
                        <label>Adm.naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                        </column>`
        if (config?.year)
            body += `<column id="3">
                        <field>fin.trs.head.year</field>
                        <label>Jaar</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                        </column>`
        if (config?.period)
            body += `<column id="4">
                        <field>fin.trs.head.period</field>
                        <label>Periode</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        body += `<column id="5">
                        <field>fin.trs.head.yearperiod</field>
                        <label>Jaar/periode (JJJJ/PP)</label>
                        <visible>false</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from>${args.fromDate}</from>
                        <to>${args.toDate}</to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.code)
            body += `<column id="6">
                        <field>fin.trs.head.code</field>
                        <label>Dagboek</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.number)
            body += `<column id="7">
                        <field>fin.trs.head.number</field>
                        <label>Boekingsnummer</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.status)
            body += `<column id="8">
                        <field>fin.trs.head.status</field>
                        <label>Status</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from>normal</from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.date || args.fromTransactionDate)
            body += `<column id="9">
                        <field>fin.trs.head.date</field>
                        <label>Boekdatum</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from>${args.fromTransactionDate ? args.fromTransactionDate : ''}</from>
                        <to>${args.toTransactionDate ? args.toTransactionDate : ''}</to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.curCode)
            body += `<column id="10">
                        <field>fin.trs.head.curcode</field>
                        <label>Valuta</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.relation)
            body += `<column id="11">
                        <field>fin.trs.head.relation</field>
                        <label>Relatie</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.relationName)
            body += `<column id="12">
                        <field>fin.trs.head.relationname</field>
                        <label>Relatienaam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.inpDate)
            body += `<column id="13">
                        <field>fin.trs.head.inpdate</field>
                        <label>Invoerdatum</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.modified)
            body += `<column id="14">
                        <field>fin.trs.head.modified</field>
                        <label>Wijzigingsdatum</label>
                        <visible>false</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.username)
            body += `<column id="15">
                        <field>fin.trs.head.username</field>
                        <label>Gebruikersnaam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        body += `<column id="16">
                        <field>fin.trs.line.dim1</field>
                        <label>Grootboekrek.</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from>${args.fromLedger}</from>
                        <to>${args.toLedger}</to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim1Name)
            body += `<column id="17">
                        <field>fin.trs.line.dim1name</field>
                        <label>Grootboekrek.naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Type)
            body += `<column id="18">
                        <field>fin.trs.line.dim1type</field>
                        <label>Dimensietype 1</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim2)
            body += `<column id="19">
                        <field>fin.trs.line.dim2</field>
                        <label>Kpl./rel.</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim2Name)
            body += `<column id="20">
                        <field>fin.trs.line.dim2name</field>
                        <label>Kpl.-/rel.naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim2Type)
            body += `<column id="21">
                        <field>fin.trs.line.dim2type</field>
                        <label>Dimensietype 2</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim3)
            body += `<column id="22">
                        <field>fin.trs.line.dim3</field>
                        <label>Act./proj.</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim3Name)
            body += `<column id="23">
                        <field>fin.trs.line.dim3name</field>
                        <label>Act.-/proj.naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim3Type)
            body += `  <column id="24">
                        <field>fin.trs.line.dim3type</field>
                        <label>Dimensietype 3</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.valueSigned)
            body += `     <column id="25">
                        <field>fin.trs.line.valuesigned</field>
                        <label>Bedrag</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.baseValueSigned)
            body += `<column id="26">
                        <field>fin.trs.line.basevaluesigned</field>
                        <label>Basisbedrag</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.repValueSigned)
            body += `<column id="27">
                        <field>fin.trs.line.repvaluesigned</field>
                        <label>Rapportagebedrag</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.debitCredit)
            body += `<column id="28">
                        <field>fin.trs.line.debitcredit</field>
                        <label>D/C</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.vatCode)
            body += `<column id="29">
                        <field>fin.trs.line.vatcode</field>
                        <label>Btw-code</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.vatBaseValueSigned)
            body += `<column id="30">
                        <field>fin.trs.line.vatbasevaluesigned</field>
                        <label>Btw-bedrag</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.quantity)
            body += `<column id="31">
                        <field>fin.trs.line.quantity</field>
                        <label>Aantal</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.chequeNumber)
            body += `<column id="32">
                        <field>fin.trs.line.chequenumber</field>
                        <label>Cheque</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.description)
            body += `<column id="33">
                        <field>fin.trs.line.description</field>
                        <label>Omschrijving</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.invnumber)
            body += `<column id="34">
                        <field>fin.trs.line.invnumber</field>
                        <label>Factuurnummer</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1group1)
            body += `<column id="35">
                        <field>fin.trs.line.dim1group1</field>
                        <label>Groep 1</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group1Name)
            body += `<column id="36">
                        <field>fin.trs.line.dim1group1name</field>
                        <label>Groepnaam 1</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group2)
            body += `<column id="37">
                        <field>fin.trs.line.dim1group2</field>
                        <label>Groep 2</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group2Name)
            body += `<column id="38">
                        <field>fin.trs.line.dim1group2name</field>
                        <label>Groepnaam 2</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group3)
            body += `<column id="39">
                        <field>fin.trs.line.dim1group3</field>
                        <label>Groep 3</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group3Name)
            body += `<column id="40">
                        <field>fin.trs.line.dim1group3name</field>
                        <label>Groepnaam 3</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group4)
            body += `<column id="41">
                        <field>fin.trs.line.dim1group4</field>
                        <label>Groep 4</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group4Name)
            body += `<column id="42">
                        <field>fin.trs.line.dim1group4name</field>
                        <label>Groepnaam 4</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group5)
            body += `<column id="43">
                        <field>fin.trs.line.dim1group5</field>
                        <label>Groep 5</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.dim1Group5Name)
            body += `<column id="44">
                        <field>fin.trs.line.dim1group5name</field>
                        <label>Groepnaam 5</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.freeText1)
            body += `<column id="45">
                        <field>fin.trs.line.freetext1</field>
                        <label>Vrij tekstveld 1</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.freeText2)
            body += `<column id="46">
                        <field>fin.trs.line.freetext2</field>
                        <label>Vrij tekstveld 2</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.freeText3)
            body += `<column id="47">
                        <field>fin.trs.line.freetext3</field>
                        <label>Vrij tekstveld 3</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.origin)
            body += `<column id="48">
                        <field>fin.trs.head.origin</field>
                        <label>Boekingsoorsprong</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.type)
            body += `<column id="49">
                        <field>fin.trs.mng.type</field>
                        <label>transactie type groep</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        // if (config?.regime)
        body += `<column id="50">
                        <field>fin.trs.head.regime</field>
                        <label>Regime</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from>fiscal</from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        if (config?.reportingStructure)
            body += `<column id="51">
                        <field>fin.trs.head.reportingstructure</field>
                        <label>Rapportagestructuur</label>
                        <visible>false</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        body += `   </columns>
                </twin:xmlRequest>
                </twin:ProcessXmlDocument>
                </soapenv:Body>
                </soapenv:Envelope>`;

        const r = await axios.post(`${this.parent.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, body, CONFIG);

        const parsed = await this.parent.utils.xml2js(r.data);

        if (parsed.th && !Array.isArray(parsed.th)) {
            parsed.th = [parsed.th];
        }

        if (parsed.th[0].td && !Array.isArray(parsed.th[0].td)) {
            parsed.th.td = [parsed.th.td];
        }

        if (parsed.tr && !Array.isArray(parsed.tr)) {
            parsed.tr = [parsed.tr];
        }

        if (parsed.tr)
            for (let i = 0; i < parsed.tr.length; i++) {
                if (parsed.tr[i].td && !Array.isArray(parsed.tr[i].td)) {
                    parsed.tr[i].td = [parsed.tr[i].td];
                }
            }

        return parsed;
    }



    async GeneralLedgerTransactions(args: IGeneralLedgerTransactionsArgs, config?: IGeneralLedger000Config): Promise<any> {
        await this.parent.oAuth.validateAccessToken();


        let body = `
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
                <columns code="000">
                `

        body += `<column id="1">
                    <field>fin.trs.head.yearperiod</field>
                    <label>Periode</label>
                    <visible>true</visible>
                    <ask>true</ask>
                    <operator>between</operator>
                    <from>${args.fromDate}</from>
                    <to>${args.toDate}</to>
                    <finderparam></finderparam>
                </column>`

        if (config?.code)
            body += `<column id="2">
                        <field>fin.trs.head.code</field>
                        <label>Dagboek</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from></from>
                        <to></to>
                        <finderparam>hidden=1</finderparam>
                    </column>`

        if (config?.shortname)
            body += `<column id="3">
                        <field>fin.trs.head.shortname</field>
                        <label>Naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.number)
            body += `<column id="4">
                        <field>fin.trs.head.number</field>
                        <label>Boekst.nr.</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.status)
            body += `<column id="5">
                        <field>fin.trs.head.status</field>
                        <label>Status</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from>normal</from>
                        <to></to>
                        <finderparam></finderparam>
                    </column`

        body += `<column id="6">
                    <field>fin.trs.line.dim1</field>
                    <label>Grootboek</label>
                    <visible>true</visible>
                    <ask>true</ask>
                    <operator>between</operator>
                    <from>${args.fromLedger ? args.fromLedger : ''}</from>
                    <to>${args.toLedger ? args.toLedger : ''}</to>
                    <finderparam></finderparam>
                </column>`

        if (config?.dim1Name)
            body += `<column id="7">
                        <field>fin.trs.line.dim1name</field>
                        <label>Naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.curCode)
            body += `<column id="8">
                        <field>fin.trs.head.curcode</field>
                        <label>Valuta</label>
                        <visible>false</visible>
                        <ask>false</ask>
                        <operator>equal</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.valueSigned)
            body += `<column id="9">
                        <field>fin.trs.line.valuesigned</field>
                        <label>Bedrag</label>
                        <visible>false</visible>
                        <ask>false</ask>
                        <operator>between</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.baseValueSigned)
            body += `<column id="10">
                        <field>fin.trs.line.basevaluesigned</field>
                        <label>Euro</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.repValueSigned)
            body += `<column id="11">
                        <field>fin.trs.line.repvaluesigned</field>
                        <label></label>
                        <visible>false</visible>
                        <ask>false</ask>
                        <operator>between</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.description)
            body += `<column id="12">
                        <field>fin.trs.line.description</field>
                        <label>Omschrijving</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        body += `<column id="13">
                        <field>fin.trs.head.browseregime</field>
                        <label>Regime</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from>fiscal</from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        body += `   </columns>
                    </twin:xmlRequest>
                    </twin:ProcessXmlDocument>
                    </soapenv:Body>
                    </soapenv:Envelope>`;



        const r = await axios.post(`${this.parent.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, body, CONFIG);

        const parsed = await this.parent.utils.xml2js(r.data);

        if (parsed.th && !Array.isArray(parsed.th)) {
            parsed.th = [parsed.th];
        }

        if (parsed.th[0].td && !Array.isArray(parsed.th[0].td)) {
            parsed.th.td = [parsed.th.td];
        }

        if (parsed.tr && !Array.isArray(parsed.tr)) {
            parsed.tr = [parsed.tr];
        }

        if (parsed.tr)
            for (let i = 0; i < parsed.tr.length; i++) {
                if (parsed.tr[i].td && !Array.isArray(parsed.tr[i].td)) {
                    parsed.tr[i].td = [parsed.tr[i].td];
                }
            }

        return parsed;
    }

    async AnnualReportYTD(args: IAnnualReportYTDArgs, config?: IAnnualReportYTDConfig): Promise<IAnnualReportYTD> {
        await this.parent.oAuth.validateAccessToken();

        let body = `
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
                <columns code="050_1">
                `


        body += `
            <column id="1">
                <field>fin.trs.head.office</field>
                <label>Administratie</label>
                <visible>${!config?.office ? 'false' : 'true'}</visible>
                <ask>false</ask>
                <operator>none</operator>
                <from></from>
                <to></to>
                <finderparam></finderparam>
            </column>`

        body += `<column id="2">
                <field>fin.trs.head.officename</field>
                <label>Adm.naam</label>
                 <visible>${!config?.officeName ? 'false' : 'true'}</visible>
                <ask>false</ask>
                <operator>none</operator>
                <from></from>
                <to></to>
                <finderparam></finderparam>
            </column>`

        body += `<column id="3">
                <field>fin.trs.head.yearperiod</field>
                <label>Jaar/periode (JJJJ/PP)</label>
                <visible>${!config?.yearperiod ? 'false' : 'true'}</visible>
                <ask>true</ask>
                <operator>between</operator>
                <from>${args?.fromDate ? args?.fromDate : ''}</from>
                <to>${args?.toDate ? args?.toDate : ''}</to>
                <finderparam></finderparam>
            </column>`


        body += `<column id="4">
                <field>fin.trs.head.status</field>
                <label>Status</label>
                 <visible>${!config?.status ? 'false' : 'true'}</visible>
                <ask>true</ask>
                <operator>equal</operator>
                <from>normal</from>
                <to></to>
                <finderparam></finderparam>
            </column>`


        body += `<column id="5">
                <field>fin.trs.line.dim1</field>
                <label>Grootboekrek.</label>
                 <visible>${!config?.dim1 ? 'false' : 'true'}</visible>
                <ask>true</ask>
                <operator>between</operator>
                <from></from>
                <to></to>
                <finderparam></finderparam>
            </column>`

        body += `<column id="6">
                <field>fin.trs.line.dim1name</field>
                <label>Grootboekrek.naam</label>
                 <visible>${!config?.dim1Name ? 'false' : 'true'}</visible>
                <ask>false</ask>
                <operator>none</operator>
                <from></from>
                <to></to>
                <finderparam></finderparam>
            </column>`


        body += `<column id="7">
                <field>fin.trs.line.dim1type</field>
                <label>Dimensietype 1</label>
                 <visible>${!config?.dim1Type ? 'false' : 'true'}</visible>
                <ask>false</ask>
                <operator>none</operator>
                <from></from>
                <to></to>
                <finderparam></finderparam>
            </column>`


        body += `<column id="8">
                <field>fin.trs.line.valuesigned</field>
                <label>Bedrag</label>
                 <visible>${!config?.valueSigned ? 'false' : 'true'}</visible>
                <ask>false</ask>
                <operator>none</operator>
                <from></from>
                <to></to>
                <finderparam></finderparam>
            </column>`


        body += `<column id="9">
                <field>fin.trs.line.basevaluesigned</field>
                <label>Basisbedrag</label>
                 <visible>${!config?.baseValueSigned ? 'false' : 'true'}</visible>
                <ask>false</ask>
                <operator>none</operator>
                <from></from>
                <to></to>
                <finderparam></finderparam>
            </column>`

        body += `<column id="10">
                <field>fin.trs.line.repvaluesigned</field>
                <label>Rapportagebedrag</label>
                 <visible>${!config?.repValueSigned ? 'false' : 'true'}</visible>
                <ask>false</ask>
                <operator>none</operator>
                <from></from>
                <to></to>
                <finderparam></finderparam>
            </column>`


        body += `<column id="11">
                <field>fin.trs.head.balanceregimeprompt</field>
                <label>Regime</label>
                <visible>${!config?.balanceRegimePrompt ? 'false' : 'true'}</visible>
                <ask>true</ask>
                <operator>equal</operator>
                <from>fiscal</from>
                <to></to>
                <finderparam></finderparam>
            </column>`


        body += `   </columns>
            </twin:xmlRequest>
            </twin:ProcessXmlDocument>
            </soapenv:Body>
            </soapenv:Envelope>`;


        const r = await axios.post(`${this.parent.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, body, CONFIG);

        const parsed = await this.parent.utils.xml2js(r.data);

        if (parsed.th && !Array.isArray(parsed.th)) {
            parsed.th = [parsed.th];
        }

        if (parsed.th[0].td && !Array.isArray(parsed.th[0].td)) {
            parsed.th.td = [parsed.th.td];
        }

        if (parsed.tr && !Array.isArray(parsed.tr)) {
            parsed.tr = [parsed.tr];
        }

        if (parsed.tr)
            for (let i = 0; i < parsed.tr.length; i++) {
                if (parsed.tr[i].td && !Array.isArray(parsed.tr[i].td)) {
                    parsed.tr[i].td = [parsed.tr[i].td];
                }
            }

        return parsed;



    }

    async AnnualReportMultiCurrency(args: IAnnualReportMultiCurrencyArgs, config?: IGeneralLedger060Config): Promise<IGeneralLedgerTransactions> {
        await this.parent.oAuth.validateAccessToken();

        let body = `
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
                <columns code="060">
                `

        if (config?.office)
            body += `<column id="1">
                        <field>fin.trs.head.office</field>
                        <label>Administratie</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                        </column>`

        if (config?.officeName)
            body += `<column id="2">
                        <field>fin.trs.head.officename</field>
                        <label>Adm.naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`
        body += `<column id="3">
                        <field>fin.trs.head.yearperiod</field>
                        <label>Jaar/periode (JJJJ/PP)</label>
                        <visible>false</visible>
                        <ask>true</ask>
                        <operator>between</operator>
                        <from>${args.fromDate ? args.fromDate : ''}</from>
                        <to>${args.toDate ? args.toDate : ''}</to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.year)
            body += `  <column id="4">
                        <field>fin.trs.head.year</field>
                        <label>Jaar</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.period)
            body += `<column id="5">
                    <field>fin.trs.head.period</field>
                    <label>Periode</label>
                    <visible>true</visible>
                    <ask>false</ask>
                    <operator>none</operator>
                    <from></from>
                    <to></to>
                    <finderparam></finderparam>
                </column>`

        if (config?.dim1Type)
            body += `<column id="6">
                    <field>fin.trs.line.dim1type</field>
                    <label>Type</label>
                    <visible>true</visible>
                    <ask>false</ask>
                    <operator>none</operator>
                    <from></from>
                    <to></to>
                    <finderparam></finderparam>
                </column>`

        body += `<column id="7">
                <field>fin.trs.line.dim1</field>
                <label>Grootboekrek.</label>
                <visible>true</visible>
                <ask>true</ask>
                <operator>between</operator>
                <from>${args.fromLedger ? args.fromLedger : ''}</from>
                <to>${args.toLedger ? args.toLedger : ''}</to>
                <finderparam></finderparam>
            </column>`

        if (config?.dim1Name)
            body += `<column id="8">
                        <field>fin.trs.line.dim1name</field>
                        <label>Grootboekrek.naam</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.curCode)
            body += `<column id="9">
                        <field>fin.trs.head.curcode</field>
                        <label>Valuta</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.valueSigned)
            body += `<column id="10">
                        <field>fin.trs.line.valuesigned</field>
                        <label>Bedrag</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.baseValueSigned)
            body += `<column id="11">
                        <field>fin.trs.line.basevaluesigned</field>
                        <label>Basisbedrag</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.repValueSigned)
            body += `<column id="12">
                        <field>fin.trs.line.repvaluesigned</field>
                        <label>Rapportagebedrag</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.debitCredit)
            body += `<column id="13">
                        <field>fin.trs.line.debitcredit</field>
                        <label>D/C</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.status)
            body += `<column id="14">
                        <field>fin.trs.head.status</field>
                        <label>Status</label>
                        <visible>true</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from>normal</from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim1group1)
            body += `<column id="15">
                        <field>fin.trs.line.dim1group1</field>
                        <label>Groep 1</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.dim1Group1Name)
            body += `<column id="16">
                        <field>fin.trs.line.dim1group1name</field>
                        <label>Groepnaam 1</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim1Group2)
            body += `<column id="17">
                        <field>fin.trs.line.dim1group2</field>
                        <label>Groep 2</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim1Group2Name)
            body += `<column id="18">
                        <field>fin.trs.line.dim1group2name</field>
                        <label>Groepnaam 2</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim1Group3)
            body += `<column id="19">
                        <field>fin.trs.line.dim1group3</field>
                        <label>Groep 3</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.dim1Group3Name)
            body += `<column id="20">
                        <field>fin.trs.line.dim1group3name</field>
                        <label>Groepnaam 3</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        // if (config?.balanceRegimePrompt)
        body += `<column id="21">
                        <field>fin.trs.head.balanceregimeprompt</field>
                        <label>Regime</label>
                        <visible>false</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from>fiscal</from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.dim1Group4)
            body += `<column id="22">
                        <field>fin.trs.line.dim1group4</field>
                        <label>Groep 4</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.dim1Group4Name)
            body += `<column id="23">
                        <field>fin.trs.line.dim1group4name</field>
                        <label>Groepnaam 4</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`


        if (config?.dim1Group5)
            body += `<column id="24">
                    <field>fin.trs.line.dim1group5</field>
                    <label>Groep 5</label>
                    <visible>true</visible>
                    <ask>false</ask>
                    <operator>none</operator>
                    <from></from>
                    <to></to>
                    <finderparam></finderparam>
                </column>`


        if (config?.dim1Group5Name)
            body += `<column id="25">
                        <field>fin.trs.line.dim1group5name</field>
                        <label>Groepnaam 5</label>
                        <visible>true</visible>
                        <ask>false</ask>
                        <operator>none</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        if (config?.reportingStructure)
            body += `<column id="26">
                        <field>fin.trs.head.reportingstructure</field>
                        <label>Rapportagestructuur</label>
                        <visible>false</visible>
                        <ask>true</ask>
                        <operator>equal</operator>
                        <from></from>
                        <to></to>
                        <finderparam></finderparam>
                    </column>`

        body += `   </columns>
                    </twin:xmlRequest>
                    </twin:ProcessXmlDocument>
                    </soapenv:Body>
                    </soapenv:Envelope>`;

        const r = await axios.post(`${this.parent.tokenInfo['twf.clusterUrl']}/webservices/processxml.asmx?wsdl`, body, CONFIG);

        const parsed = await this.parent.utils.xml2js(r.data);

        if (parsed.th && !Array.isArray(parsed.th)) {
            parsed.th = [parsed.th];
        }

        if (parsed.th[0].td && !Array.isArray(parsed.th[0].td)) {
            parsed.th.td = [parsed.th.td];
        }

        if (parsed.tr && !Array.isArray(parsed.tr)) {
            parsed.tr = [parsed.tr];
        }

        if (parsed.tr)
            for (let i = 0; i < parsed.tr.length; i++) {
                if (parsed.tr[i].td && !Array.isArray(parsed.tr[i].td)) {
                    parsed.tr[i].td = [parsed.tr[i].td];
                }
            }


        if (!parsed.th) {
            parsed.th = [];
        }

        if (!parsed.tr) {
            parsed.tr = [];
        }

        return parsed;
    }
}
