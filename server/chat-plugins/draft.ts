import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const KEYFILEPATH = "./server/chat-plugins/draft/key/helical-sanctum-469023-h3-21c62c9383ae.json"; // path to your service account key
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Define the spreadsheet ID and range
// let spreadsheetId: string = '1ULZxiOQhiN3on78qX3_lOs3vRQVMXTDQKOzXXqdQ1Xk'; 
// const range: string = 'Teams!A2:A15'; 

// Function to get data from Google Sheets
async function getSheetData(spreadsheetId: string, range: string): Promise<string[][] | null> {
    try {
        const auth: GoogleAuth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: SCOPES,
        });

        const client = await auth.getClient();
        
        const sheets: sheets_v4.Sheets = google.sheets({
            version: "v4",
            auth: client,
        });

        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = res.data.values;
        if (rows && rows.length) { // Ensure rows is not null or undefined
            console.log('Data retrieved from Google Sheets:');
            rows.forEach((row: string[]) => { // Type row as string array
                console.log(row);
            });
        } else {
            console.log('No data found.');
        }
        return rows as string[][];
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
};

export const commands: Chat.ChatCommands = {
    draft: {
        test() {
            getSheetData('1ULZxiOQhiN3on78qX3_lOs3vRQVMXTDQKOzXXqdQ1Xk', 'Teams!A2:A15').then((rows) => {
                if (rows) {
                    this.sendReply(rows[0][0]);
                }
                else {
                    this.sendReply("none");
                }
            })
        },
        teams(sheet) {
            getSheetData(sheet, 'Teams').then((rows) => {
                if(!sheet) return this.parse('/help draft');
                if (rows) {
                    this.sendReply(JSON.stringify(rows));
                }
                else {
                    this.sendReply("none");
                }
            })
        },
        // page(target) {
        //     const [sheet, range] = this.splitOne(target);
        //     var data;
        //     getSheetData(sheet, range).then((rows) => {
        //         if(!sheet || !range) return this.parse('/help draft');
        //         if (rows) {
        //             data = rows;
        //         }
        //     })
        //     return data;
        // },
        help() {
            this.parse('/help draft')
        },
    },
    
    drafthelp: [
        `/draft test - tests the google sheets api`,
        `/draft help - Displays this help command`,
        `/draft teams [Sheet ID] - returns the teams sheet`,
        `/draft page [Sheet ID], [Range] - returns sheet data for the range specified`,
    ],
};
