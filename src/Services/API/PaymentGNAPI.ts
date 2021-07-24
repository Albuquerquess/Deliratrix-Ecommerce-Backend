import axios from 'axios'
import { AGENT } from '../../Consts/GNConsts'

import dotenv from 'dotenv'
dotenv.config()

import { CONTENT_TYPE, CREDENTIALS } from '../../Consts/GNConsts'

async function PaymentGNAPI() {
    console.log('>> Started GN API')
    const authToken = await axios({
        method: 'POST',
        url: `${process.env.GN_ENDPOINT}/oauth/token`,
        headers: {
            Authorization: `Basic ${CREDENTIALS}`,
            'Content-Type': 'application/json'
        },
        httpsAgent: AGENT,
        data: {
            'grant_type': 'client_credentials'
        }
    })

    console.log('>> Run GN API')

     
    return axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpAgent: AGENT,
        headers: {
            Authorization: `Bearer ${authToken.data.access_token}`,
            'Content-Type': CONTENT_TYPE
        },
        httpsAgent: AGENT
    })
}

export default PaymentGNAPI