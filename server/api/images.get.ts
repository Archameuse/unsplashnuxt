import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.DB_KEY),
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    })
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const range = process.env.DB_RANGE
    const data:Post[] = []
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.DB_ID,
        range,
      }).then(res => res.data.values)
    res?.map((element, index) => {
        data.push({
            heading: element[0],
            link: element[1],
            delHash: element[2],
            id: index
        })
    })
    return data
})
