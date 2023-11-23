// import axios from "axios";
import { Xml2js } from "../types";
import Twinfield from "./Twinfield";
import xml2js from 'xml2js';

export default class Utils {
    // private parent: Twinfield;

    constructor(parent: Twinfield) {
        // this.parent = parent;
    }



    async xml2js(xml: string, options?: Xml2js): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                try {

                    const parser = new xml2js.Parser({
                        async: true,
                        charkey: 'value',
                        attrkey: 'attrkey',
                        explicitArray: false,
                        ...options
                    });
                    parser.parseString(xml, (err: any, result: any) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        } else {
                            if (!options?.explicitArray) {
                                const obj = result['soap:Envelope']['soap:Body']['ProcessXmlDocumentResponse']['ProcessXmlDocumentResult'];
                                const keys = Object.keys(obj);
                                return resolve(obj[keys[0]]);
                            } else {
                                const obj = result['soap:Envelope']['soap:Body'][0]['ProcessXmlDocumentResponse'][0]['ProcessXmlDocumentResult'][0];
                                const keys = Object.keys(obj);
                                return resolve(obj[keys[0]]);
                            }
                        }
                    });
                } catch (err) {
                    console.error(err)
                    reject(err)
                }
            })
        }
        catch (err) {
            console.error(err)
            throw err
        }
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
}