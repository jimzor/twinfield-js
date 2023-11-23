interface AttrKey {
    status?: string;
    result?: string;
    xmlns?: string;
    name?: string;
    shortname?: string;
    locked?: string;
    readonly?: string;
    order?: string;
    id?: string;
}

interface User {
    value: string;
    attrkey: AttrKey;
}

interface Currency {
    value: string;
    attrkey: AttrKey;
}

interface Address {
    field1?: string;
    field2?: string;
    field3?: string;
    field4?: string;
    field5?: string;
    field6?: string;
    city?: string;
    country?: Currency;
    postcode?: string;
    telephone?: string;
    fax?: string;
}

interface General {
    basecurrency: Currency;
    reportingcurrency: Currency;
    type: string;
    demo: string;
    vatnumber?: string;
    soletradervatnumber?: string;
    cocnumber?: string;
    currentyear?: string;
    currentperiod?: string;
    numberofperiods?: string;
    lastclosedyear?: string;
    creditoridentifier?: string;
    defaultbank: Currency;
    defaultmatching: Currency;
    region?: string;
    hierarchy?: string;
    template: Currency;
    templateoffice: {
        attrkey: AttrKey;
    };
    editdimensionname: string;
    allowmultiplecontrolaccounts: string;
    paymentdiscount: string;
    scheme: string;
    allowicmt940: string;
    lockwordinv: string;
    sicmajorgroup: Currency;
    address: Address;
}

interface SystemDimension {
    value: string;
    attrkey: AttrKey;
}

interface SystemDimensions {
    accountsreceivable: SystemDimension;
    accountspayable: SystemDimension;
    suspenceaccount: SystemDimension;
    workingprogress: SystemDimension;
    profitriseprojects: SystemDimension;
    turnover: SystemDimension;
    exchangedifference: {
        debit: SystemDimension;
        credit: SystemDimension;
    };
    paymentdifference: {
        debit: SystemDimension;
        credit: SystemDimension;
    };
    discount: {
        debit: SystemDimension;
        credit: SystemDimension;
    };
    teqcostcenter: SystemDimension;
    astcostcenter: {
        attrkey: AttrKey;
    };
    openingbalance: SystemDimension;
    closepnl: SystemDimension;
    forbalynd: SystemDimension;
}

interface SystemDimensionTypes {
    [key: string]: SystemDimension;
}

interface Prompt {
    value?: string;
    attrkey: AttrKey;
}

interface Field {
    value: string;
    attrkey: AttrKey;
}

interface CreditManagement {
    daysafterduedate: string;
    daysafterduedatevalue: string;
    daysafterpartpayment: string;
    invoicebrowse: SystemDimension;
    invoiceexplodebrowse: SystemDimension;
    prompts: {
        prompt: Prompt[];
    };
    sort: {
        field: Field[];
    };
}

interface VatManagement {
    txp: {
        cpid: string;
        cpid_st?: string;
        cpname: string;
        cptel: string;
    };
    int: {
        cpid: string;
        cpname: string;
        cptel: string;
    };
    seb: {
        cpid: string;
        cpname: string;
        cptel: string;
    };
    taxgroup: {
        attrkey: AttrKey;
    };
    decltimeframe: Currency;
    startingquarter: Currency;
    icptimeframe: string;
    mayestimate: string;
    includepurchaseorsalesprovisionaltransactions: string;
    includecashorbankprovisionaltransactions: string;
    includejournalprovisionaltransactions: string;
    vatrollover: string;
    defgwytype?: string;
    defgwycode?: string;
    accountingscheme: Currency;
}

interface FixedAssets {
    transaction: SystemDimension;
    browsepurchase: SystemDimension;
    browsedepreciate: SystemDimension;
    browsereconcile: SystemDimension;
}

interface Intercompany {
    attrkey: AttrKey;
    outs?: string;
    ins?: string;
}

interface Regional {
    dateformat: string;
    thousandsep: string;
    decimalsep: string;
}

export interface IOffice {
    attrkey: AttrKey;
    code: string;
    created: string;
    modified: string;
    name: string;
    shortname: string;
    touched: string;
    user: User;
    general: General;
    systemdimensions: SystemDimensions;
    systemdimensiontypes: SystemDimensionTypes;
    creditmanagement: CreditManagement;
    vatmanagement: VatManagement;
    fixedassets: FixedAssets;
    intercompany: Intercompany;
    regional: Regional;
}

export interface IOfficesList {
    attrkey: { result: string, xmlns: string },
    office: {
        value: string, attrkey: {
            name: string,
            shortname: string
        }
    }[]
}

export interface IGeneralLedgerTransactionsArgs {
    officeCode: string
    fromDate: string
    toDate: string
    fromLedger: string
    toLedger: string
}


export interface IGeneralLedgerTransaction {
    value: string
    attrkey: {
        label: string
        hideforuser: string
        type: string
    }
}[]

export interface IGeneralLedgerTransactions {
    attrkey: {
        result: number
        first: number
        last: number
        total: number
        xmlns: string
    }
    th?: [
        { td: IGeneralLedgerTransaction[] }
    ]
    tr?: [
        { td: IGeneralLedgerTransaction[] }
    ]

}