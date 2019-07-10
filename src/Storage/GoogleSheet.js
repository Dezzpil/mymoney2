const GoogleSpreadsheet = require('google-spreadsheet');
const Storage = require('../Storage');
const fs = require('fs');

let defaultEmail = process.env.GOOGLE_EMAIL;
let defaultPrivate = process.env.GOOGLE_PRIVATE_KEY;
let defaultSheetId = process.env.GOOGLE_SHEET_ID;

const accDataPath = '../../google_account.json';
let accountData = null;
if (fs.existsSync(accDataPath)) {
    accountData = require(accDataPath);
    defaultEmail = defaultEmail || accountData.client_email;
    defaultPrivate = defaultPrivate || accountData.private_key;
    defaultSheetId = defaultSheetId || accountData.sheet_id;
}

class GoogleSheet extends Storage {

    constructor(options) {
        super(options);
        this.sheetId = defaultSheetId;
        this.creds = {
            client_email: defaultEmail,
            private_key: defaultPrivate
        };
        if (options) {
            if ('client_email' in options) {
                this.creds.client_email = options.client_email;
            }
            if ('private_key' in options) {
                this.creds.private_key = options.private_key;
            }
            if ('sheet_id' in options) {
                this.sheetId = options.sheet_id;
            }
        }
    }

    async connect() {
        // spreadsheet key is the long id in the sheets URL
        const doc = new GoogleSpreadsheet(this.sheetId);
        return new Promise((resolve, reject) => {
            doc.useServiceAccountAuth(this.creds, (err, info) => {
                if (err) reject(err);
                resolve(doc, info);
            });
        });
    }

    async store(target, data, raw = false) {
        return new Promise((resolve, reject) => {
            target.addRow(1, data, (err, row) => {
                if (err) reject(err);
                if (raw) resolve(row);
                resolve(data['value']);
            });
        })

    }

    async close() {}

}

module.exports = GoogleSheet;
