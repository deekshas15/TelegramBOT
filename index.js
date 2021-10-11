require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');

const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

const app = express()
app.use(bodyParser.json())

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const re1 = /^\d{10}$/;
let times=4
let message = "";

const text = "Enter your Name"
 async () => {
await axios.post(`${TELEGRAM_API}/sendMessage`, {
  chat_id: chatId,
    text: text
})
}
const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
}

app.post(URI, async (req, res) => {
    console.log(req.body)

    const chatId = req.body.message.chat.id
    const text = req.body.message.text
    if(text == "/start"){
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: "Enter your:\n name\n location\n mobile number \n e-mail address."
    })
    times=4;
    }else{
        let text = req.body.message.text
        if(times == 4){
            message += "Name : "+text+"\n";
        }
        else if(times == 3){
            message += "Location: "+text+"\n";
        }else if(times == 2){
            if(!re1.test(text))text="INVALID";
             message += "Mobile No: "+text+"\n";
        }else{
            if(!re.test(String(text).toLowerCase())) text="INVALID"
            message += "E-Mail Address: " + text+"\n";
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatId,
                text: message
            })
            times=5;
            message="";
        }
        times --;
    }
    return res.send()
})

app.listen(process.env.PORT || 5000, async () => {
    console.log('app running on port', process.env.PORT || 5000)
    await init()
})