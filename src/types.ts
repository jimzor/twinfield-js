export interface ExchangeCode {
    id_token: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface Xml2js {
    explicitArray?: boolean
    charkey?: string,
    attrkey?: string,
    rootName?: string,
}

export interface AddressConfig {
    id: string
    default: boolean
    type: 'invoice' | 'postal' | 'contact'
}

export interface Address {
    $: AddressConfig
    default: boolean
    name: string
    //country codes
    country: {
        value: 'NL' | 'BE' | 'DE' | 'FR' | 'GB' | 'ES' | 'IT' | 'AT' | 'DK' | 'SE' | 'NO' | 'FI' | 'PT' | 'LU' | 'IE' | 'CH' | 'PL' | 'CZ' | 'HU' | 'RO' | 'BG' | 'GR' | 'HR' | 'EE' | 'LV' | 'LT' | 'SK' | 'SI' | 'CY' | 'MT' | 'US' | 'CA' | 'AU' | 'NZ' | 'JP' | 'CN' | 'HK' | 'SG' | 'AE' | 'ZA' | 'BR' | 'MX' | 'AR' | 'CL' | 'CO' | 'CR' | 'DO' | 'EC' | 'GT' | 'HN' | 'NI' | 'PA' | 'PE' | 'PY' | 'SV' | 'UY' | 'VE' | 'IN' | 'RU' | 'TR' | 'UA' | 'BY' | 'KZ' | 'AZ' | 'AM' | 'GE' | 'MD' | 'AL' | 'BA' | 'MK' | 'ME' | 'RS' | 'XK' | 'TW' | 'KR' | 'TH' | 'VN' | 'PH' | 'ID' | 'MY' | 'IL' | 'EG' | 'MA' | 'TN' | 'DZ' | 'LY' | 'IQ' | 'SA' | 'LB' | 'JO' | 'KW' | 'BH' | 'OM' | 'QA' | 'SY' | 'YE' | 'AF' | 'BD' | 'BT' | 'BN' | 'KH' | 'LA' | 'MV' | 'MM' | 'NP' | 'PK' | 'LK' | 'KP' | 'IR' | 'ET' | 'GH' | 'KE' | 'NG' | 'SN' | 'TZ' | 'UG' | 'ZM' | 'ZW' | 'CD' | 'AO' | 'BJ' | 'BW' | 'BF' | 'BI' | 'CV' | 'CF' | 'TD' | 'KM' | 'CG' | 'CI' | 'DJ' | 'ER' | 'SZ' | 'GM' | 'GN' | 'GW' | 'LS' | 'LR' | 'MG' | 'MW' | 'ML' | 'MR' | 'MZ' | 'NA' | 'NE' | 'RW' | 'ST' | 'SC' | 'SL' | 'SO' | 'SS' | 'SD' | 'TG' | 'TN' | 'ZM' | 'ZW' | 'CD' | 'AO' | 'BJ' | 'BW' | 'BF' | 'BI' | 'CV' | 'CF' | 'TD' | 'KM' | 'CG' | 'CI' | 'DJ' | 'ER' | 'SZ' | 'GM' | 'GN' | 'GW' | 'LS' | 'LR' | 'MG' | 'MW' | 'ML' | 'MR' | 'MZ' | 'NA' | 'NE' | 'RW' | 'ST' | 'SC' | 'SL' | 'SO' | 'SS' | 'SD' | 'TG'
        attrkey: { name: string, shortname: string }
    }
    ictcountrycode?: string
    city: string
    postcode: string
    telephone: string
    telefax: string
    email: string
    contact: string
    field1?: string
    field2?: string
    field3?: string
    field4?: string // vatNumber
    field5?: string // cocNumber
    field6?: string
}

export interface Dimension {
    name: string;
    code?: string;
    type: 'DEB'
    cocNumber?: string;
    inuse?: any
    addresses: {
        address: Address | Address[]
    }
}
