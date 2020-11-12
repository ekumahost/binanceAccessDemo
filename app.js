const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();

const CryptoJS = require("crypto-js");
const axios = require('axios');
const SHA256 = require("crypto-js/sha256");

const port = 30044;
app.use(cors());


   encodeDataToURL = (data) => {
    return Object
        .keys(data)
        .map(value => `${value}=${encodeURIComponent(data[value])}`)
        .join('&');
};



//let base_url = 'https://api.binance.com';
let base_url = 'https://accounts.sdtaop.com';
let api_keys = {
    'key' : process.env.APIKEY,
    'secret' : process.env.APISECRET
};

// we have crreated a user in demo: response.data things..
// data: { respCode: 'SUCCESS', respMsg: '', userId: 350867884 }




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

            // user registered!!
            // response_data.response.data =  { respCode: 'SUCCESS', respMsg: '', userId: 350867884 }


            // user already exist error
            // data: {
            //     respCode: 'USER_HAS_BIND',
            //     respMsg: 'user has bound',
            //     userId: 350867884
            //   }



           // bind user: not valid redirect url yet..
           // https://accounts.sdtaop.com?merchantCode=Xend&merchantUserAccount=testuser@xend.finance&redirect=https://xend.finance


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


// show all running node app: ps aux | grep node
async function getBindStatus(user_email){

    let endpoint = '/gateway-api/v1/public/ocbs/user/bindingStatus';
    let url = base_url + endpoint;

    let api_signature_default_string = 'merchantCode='+process.env.merchantCode + '&timestamp='+Date.now()+'&x-api-key='+process.env.APIKEY+'&secret='+process.env.APISECRET;
    let payload = 'merchantUserAccount='+user_email+'&';
    let signature_text = payload + api_signature_default_string;

    let requestSignature = SHA256(signature_text);

    let request_body = {
        merchantUserAccount : user_email,
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

            // binded user
        /*    data: {
                respCode: 'SUCCESS',
                    respMsg: '',
                    status: 'WAIT_AUTH',
                    userId: '350867884',
                    merchantUserAccount: 'testuser@xend.finance',
                    merchantCode: 'Xend',
                    bindingTime: 1605192648000
            } */




        // not found

            /*
            data: {
    respCode: 'NOT_FIND_BIND_USER',
    respMsg: 'could not find bound user',
    status: null,
    userId: null,
    merchantUserAccount: null,
    merchantCode: null,
    bindingTime: null
  }
             */




        })
        .catch(function (error) {
            console.log("ERROR BURN", error);
        });


}




async function getTradeQuote(user_email){

    let endpoint = '/gateway-api/v1/public/ocbs/trade/getQuote';
    let url = base_url + endpoint;

    let api_signature_default_string = 'merchantCode='+process.env.merchantCode + '&timestamp='+Date.now()+'&x-api-key='+process.env.APIKEY+'&secret='+process.env.APISECRET;

    let request_body = {
        cryptoCurrency : 'BTC',
        //  baseCurrency : 'NGN',
        baseCurrency : 'RUB',
        requestedCurrency : 'RUB',
        requestedAmount : parseFloat('2.002'),
        payType : 0,
        binanceUserId : '350867884',
        merchantUserAccount : user_email
    };



    let payload = encodeDataToURL(request_body)+'&';
    let signature_text = payload + api_signature_default_string;

    let requestSignature = SHA256(signature_text);


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

            // success

            /*
             data: {
    respCode: 'SUCCESS',
    respMsg: null,
    quoteId: '73da1138babb49c987165fffd02731dc',
    quotePrice: 1001000,
    totalAmount: 0.000002,
    quotationTime: 1605199027157,
    quotationExpiredTime: 1605199087150
  }
             */




            // if user not exist:
            /*
             data: {
    respCode: 'NOT_FIND_BIND_USER',
    respMsg: 'could not find bound user',
    quoteId: null,
    quotePrice: null,
    totalAmount: null,
    quotationTime: null,
    quotationExpiredTime: null
  }
             */


            // an error

            /*
            data: {
    respCode: 'SYSTEM_ERROR',
    respMsg: 'Failed to getQuote：Division by zero',
    quoteId: null,
    quotePrice: null,
    totalAmount: null,
    quotationTime: null,
    quotationExpiredTime: null
  }
             */




        })
        .catch(function (error) {
            console.log("ERROR BURN", error);
        });


}



async function buyCrypto(user_email){

    let endpoint = '/gateway-api/v1/public/ocbs/trade/getQuote';
    let url = base_url + endpoint;

    let api_signature_default_string = 'merchantCode='+process.env.merchantCode + '&timestamp='+Date.now()+'&x-api-key='+process.env.APIKEY+'&secret='+process.env.APISECRET;

    let request_body = {
        binanceUserId : '350867884',
        merchantUserAccount : user_email,
        quoteId : '73da1138babb49c987165fffd02731dc',
        orderId : '73da1138babb4',
        note : 'just talking',
    };


    let payload = encodeDataToURL(request_body)+'&';
    let signature_text = payload + api_signature_default_string;

    let requestSignature = SHA256(signature_text);


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


}











app.get('/', (req, res) => {


           // retrieve api user open orders: comment out when not in use..
            //   getAccountOpenOrders();

               // create member account on Binance:
               let user_email = 'testuser@xend.finance';
                 //  createMemberAccount(user_email); // to register user
                // getBindStatus(user_email); // see if user is bind to us
                 // getTradeQuote(user_email);
                 buyCrypto(user_email);



                    res.send('Hello World!')
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
