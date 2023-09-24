# Twinfield Node.js SDK

## Project Status

**Alpha:** This project is currently in the alpha phase of development. It's actively being developed, tested, and improved. Please note that it may contain bugs or incomplete features.

## Introduction

Welcome to the Twinfield Node.js SDK, a community-driven project aimed at providing a Node.js SDK for Twinfield, a leading accounting software. Twinfield primarily supports SOAP XML API requests for most of its functionalities, while its OAuth authentication supports RESTful requests. This package facilitates the conversion of XML data to JSON and vice versa, making it easier for Node.js developers to interact with Twinfield's SOAP API.

As of now, there is no official Twinfield SDK for Node.js, and we wanted to give something back to the community by starting this project. Below, you'll find a table indicating the supported actions and their status.

[Twinfield API Documentation ](https://accounting.twinfield.com/webservices/documentation/#/ApiReference)
## Supported Actions

| Action                            | API                | Status            |
| --------------------------------- | ------------------- | ---------------- |
| Authentication                    |                    |                   |
| OpenID Connect Authentication     | Master Data        | Testing           |
| Master Data                       |                    |                   |
| Customers                         | Master Data        | Testing           |
| Suppliers                         | Master Data        | Not Yet Developed |
| General Ledger                    | Master Data        | Not Yet Developed |
| Cost Centers                      | Master Data        | Not Yet Developed |
| Fixed Assets                      | Master Data        | Not Yet Developed |
| Projects                          | Master Data        | Not Yet Developed |
| Activities                        | Master Data        | Not Yet Developed |
| Dimension Groups                  | Master Data        | Not Yet Developed |
| Dimension Types                   | Master Data        | Not Yet Developed |
| Asset Methods                     | Master Data        | Not Yet Developed |
| Offices                           | Master Data        | Not Yet Developed |
| Users                             | Master Data        | Not Yet Developed |
| Articles                          | Master Data        | Not Yet Developed |
| Currencies                        | Master Data        | Not Yet Developed |
| Rates                             | Master Data        | Not Yet Developed |
| Budget                            | Master Data        | Not Yet Developed |
| Bank Book                         | Master Data        | Not Yet Developed |
| Cash Book                         | Master Data        | Not Yet Developed |
| VAT                               | Master Data        | Not Yet Developed |
| Transaction Data                  |                    |                   |
| Bank Transactions                 | Transaction Data   | Not Yet Developed |
| Cash Transactions                 | Transaction Data   | Not Yet Developed |
| Electronic Bank Statements         | Transaction Data   | Not Yet Developed |
| Journal Transactions               | Transaction Data   | Not Yet Developed |
| Purchase Transactions             | Transaction Data   | Not Yet Developed |
| Sales Invoices                    | Transaction Data   | Not Yet Developed |
| Sales Transactions                | Transaction Data   | Not Yet Developed |
| Reversal Transactions             | Transaction Data   | Not Yet Developed |
| Spread Transactions               | Transaction Data   | Not Yet Developed |
| Time                              |                    |                   |
| Deleted Transactions              | Time               | Not Yet Developed |
| Transaction Blocked Value         | Time               | Not Yet Developed |
| Request Data                      |                    |                   |
| Electronic Bank Statements         | Request Data       | Not Yet Developed |
| Browse Data                       | Request Data       | Not Yet Developed |
| Miscellaneous                     |                    |                   |
| Declarations                      | Miscellaneous      | Not Yet Developed |
| Finder                            | Miscellaneous      | Not Yet Developed |
| Hierarchies                        | Miscellaneous      | Not Yet Developed |
| Matching                          | Miscellaneous      | Not Yet Developed |
| Undo Match                        | Miscellaneous      | Not Yet Developed |
| Pay & Collect                     | Miscellaneous      | Not Yet Developed |
| Periods                           | Miscellaneous      | Not Yet Developed |


## Getting Started

To get started with the Twinfield Node.js SDK, follow these steps:


#### Installation: Install the SDK in your Node.js project using either npm or yarn:

```bash
npm install twinfield
```

#### Import Twinfield: Import the Twinfield module into your code:
```javascript
import Twinfield from "twinfield"
```

#### Obtaining a Twinfield Access Token:
To obtain a Twinfield Access Token, start by referring to the Twinfield API documentation. 
There, you'll find instructions on acquiring a clientId and clientSecret, as well as guidance on configuring the redirect API. You can access the documentation [here](https://accounting.twinfield.com/webservices/documentation/#/ApiReference/Authentication/OpenIdConnect#General-information).

Initialize the Twinfield client:
```javascript
    const clientId = 'xxxxxxxxxxxxxxxxxxxxxxxx'
    const clientSecret= 'xxxxxxxxxxxxxxxxxxxxxxxx'
    const redirectUrl = 'http://localhost/redirect'


    const twf = new Twinfield(clientId, clientSecret, redirectUrl)
```

Retrieve the login URL to direct the user to log in.
Implement the logic to redirect the end-user to the login URL.
```javascript
    //get the login url to get the user to login to
    const loginUrl = twf.twinfieldLogin()
```
```bash
example output: "https://login.twinfield.com/auth/authentication/connect/authorize
?client_id=clientId
&redirect_uri=http://localhost/redirect
&response_type=code&scope=openid+twf.organisationUser+twf.user+twf.organisation+offline_access
&state=48fe85e4-41b0-447c-8e5c-3a23a7e835a4&nonce=6d4b4f16-8069-4ad0-88ee-49952043e68d"
```

#### Exchange the code for an access token.

```javascript
    //exchange the code for a accessToken
    twf.exchangeCode('code')
```

#### You shouled now be authenticated with Twinfield via oAuth.
```javascript
console.log(twf.accessToken)
console.log(twf.refreshToken)
```



#### Example: Reading a Dimension:
Here's an example of how to read a dimension using the SDK:

```javascript

//In case you had stored the accessToken or refreshToken somehwere, then you can initialise by passing through the refreshtoken and the accessToken

const twf = new Twinfield(clientId, clientSecret, redirectUrl, refreshToken, accessToken)

const office = 'NLA001234'
const dimensionCode = '1001'
const dimType = 'DEB'

const dimension = await twf.readDimension(office, dimensionCode, dimTyp)
```

## Contact

If you encounter any issues or have questions, please [open an issue](https://github.com/jimzor/twinfield-js/issues) on our GitHub repository.

## License

[MIT](LICENSE.md)