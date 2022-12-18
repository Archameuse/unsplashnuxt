import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.DB_KEY),
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    })
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const range = process.env.DB_RANGE
    const { link, heading, delHash } = await readBody(event)
    if(!link || !heading || !delHash ) return createError({statusCode: 400, message: 'Not enough data'})
    const res = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.DB_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            "majorDimension": 'ROWS',
            "range": range,
            "values": [[
              heading,
              link,
              delHash
            ]]
        }
      });
    return res.status
})
