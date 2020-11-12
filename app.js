const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();

const CryptoJS = require("crypto-js");
const axios = require('axios');
const SHA256 = require("crypto-js/sha256");

const port = 30044;
app.use(cors());

//let base_url = 'https://api.binance.com';
let base_url = 'https://accounts.sdtaop.com';
let api_keys = {
    'key' : process.env.APIKEY,
    'secret' : process.env.APISECRET
};



 async function getAccountOpenOrders(){

     //let endpoint = '/api/v3/account';
     let endpoint = '/api/v3/openOrders';
     //  let queryString = 'recWindow=20000&timestamp=' + Date.now();
     let queryString = 'timestamp=' + Date.now();
     /// encoding totalParameters(body and query) and secret key usd HMAC SHA256
     let requestSignature = CryptoJS.HmacSHA256(queryString, api_keys['secret']).toString(CryptoJS.enc.Hex);
     let url = base_url + endpoint + '?' + queryString + '&signature=' + requestSignature;



     axios({
         url: url,
         method: 'get',
         headers: {'X-MBX-APIKEY': process.env.APIKEY}
     }).then(async (response) => {

         // log the response.
         console.log(response)

     }).catch(function (error) {

         console.log('ERROR FOUND', error);
     });







 }


async function createMemberAccount(user_email){

    let endpoint = '/gateway-api/v1/public/ocbs/user/register';
    //  let queryString = 'recWindow=20000&timestamp=' + Date.now();
    //let queryString = 'timestamp=' + Date.now();
   // let requestSignature = CryptoJS.HmacSHA256(queryString, api_keys['secret']).toString(CryptoJS.enc.Hex);
  //  let url = base_url + endpoint + '?' + queryString + '&signature=' + requestSignature;
    let url = base_url + endpoint;

let api_signature_default_string = 'merchantCode='+process.env.merchantCode + '&timestamp='+Date.now()+'&x-api-key='+process.env.APIKEY+'&secret='+process.env.APISECRET;
let payload = 'merchantUserAccount='+user_email+'&userIp=197.210.227.177&';
let signature_text = payload + api_signature_default_string;
// and then do a SHA256, put the result into the signature field.
   /// let requestSignature = CryptoJS.HmacSHA256(signature_text, process.env.APISECRET).toString(CryptoJS.enc.Hex);
    let requestSignature = SHA256(signature_text);

    let request_body = {
        merchantUserAccount : user_email,
        userIp: '197.210.227.177',
    };

    let request_headers = {
        'Content-Type': 'application/json',
        'merchantCode': process.env.merchantCode,
        'x-api-key': process.env.APIKEY,
        'x-api-signature': requestSignature,
        'timestamp': Date.now(),
    };


    axios.post(url, request_body, {
            headers: request_headers
        }
    )
        .then(function (response_data) {
            console.log(response_data);
        })
        .catch(function (error) {
            console.log("ERROR BURN", error);
        });





/*
    axios({
        url: url,
        method: 'post',
        headers: {
            'X-MBX-APIKEY': process.env.APIKEY,

        }
    }).then(async (response) => {

        // log the response.
        console.log(response)

    }).catch(function (error) {

        console.log('ERROR FOUND', error);
    });
*/


}



       app.get('/', (req, res) => {


           // retrieve api user open orders: comment out when not in use..
            //   getAccountOpenOrders();

               // create member account on Binance:
               let user_email = 'testuser@xend.finance';
                createMemberAccount(user_email);



                    res.send('Hello World!')
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
