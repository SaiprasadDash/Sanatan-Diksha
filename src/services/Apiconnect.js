'use client';
import Axios from 'axios';
import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';

const ENC_KEY = "d0baramatpuchhnakip@55w0rdky@h@1";
const API_URL = 'https://api.sanatandiksha.com/';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
}

class Apiconnect {
  encrypt = (txt) => CryptoAES.encrypt(txt, ENC_KEY).toString();
  encrypt_obj = (txt) => CryptoAES.encrypt(JSON.stringify(txt), ENC_KEY).toString();
  decrypt = (ciphertext) => CryptoAES.decrypt(ciphertext.toString(), ENC_KEY).toString(CryptoENC);
  decrypt_obj = (ciphertext) => JSON.parse(CryptoAES.decrypt(ciphertext.toString(), ENC_KEY).toString(CryptoENC));

  getData(urlpart) {
    const tkn = getToken();
    return Axios.get(API_URL + urlpart, { headers: { authorization: tkn } });
  }

  getDataAuth(urlpart) {
    const tkn = getToken();
    return Axios.get(API_URL + urlpart, { headers: { Authorization: `Bearer ${tkn}` } });
  }

  getData_arr(urlpart, data) {
    const tkn = getToken();
    return Axios.get(API_URL + urlpart, data, { headers: { authorization: tkn } });
  }

  postData(urlpart, data) {
    const tkn = getToken();
    return Axios.post(API_URL + urlpart, data, { headers: { authorization: `Bearer ${tkn}` } });
  }

  getDataNoauth(urlpart) {
    return Axios.get(API_URL + urlpart);
  }

  postDataNoauth(urlpart, data) {
    return Axios.post(API_URL + urlpart, data);
  }

  postDataWithToken(urlpart, token, data) {
    return Axios.post(API_URL + urlpart, data, {
      headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
  }

  postDataAuth(urlpart, data) {
    return Axios.post(API_URL + urlpart, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteData(urlpart) {
    const tkn = getToken();
    return Axios.delete(API_URL + urlpart, { headers: { authorization: tkn } });
  }
}

const api = new Apiconnect();
export default api;
