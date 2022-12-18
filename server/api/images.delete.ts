import axios from 'axios';
import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.DB_KEY),
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    })
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const range = process.env.DB_RANGE
    const { id, delhash } = await readBody(event)
    if(id === undefined ) return createError('No id')
    if(!delhash) return createError('No hash')
    const parsedId = Number.parseInt(id)
    const imgurRes = await axios.delete(`https://api.imgur.com/3/image/${delhash}`, {
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMGUR_ID
      }
    })
    const res = await sheets.spreadsheets.batchUpdate({
        auth: auth,
        spreadsheetId: process.env.DB_ID,
        requestBody: {
          "requests": [{
            "deleteDimension": {
              "range": {
                "sheetId": 0,
                "dimension": "ROWS",
                "startIndex": parsedId,
                "endIndex": parsedId + 1
              }
            }
          }]
        }
      })
    return res.status
})
