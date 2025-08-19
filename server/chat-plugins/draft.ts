import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const KEYFILEPATH = "./server/chat-plugins/draft/key/helical-sanctum-469023-h3-21c62c9383ae.json"; // path to your service account key
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Define the spreadsheet ID and range
const spreadsheetId: string = '1ULZxiOQhiN3on78qX3_lOs3vRQVMXTDQKOzXXqdQ1Xk'; 
const range: string = 'Teams!A2:A15'; 

// Function to get data from Google Sheets
async function getSheetData(): Promise<string[][] | null> {
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
            getSheetData().then((rows) => {
                if (rows) {
                    this.sendReply(rows[0][0]);
                }
                else {
                    this.sendReply("none");
                }
            })
        },
        help() {
            this.parse('/help draft')
        },
    },
    
    drafthelp: [
        `/draft test - tests the google sheets api`,
        `/draft help - Displays this help command`,
    ],
};
