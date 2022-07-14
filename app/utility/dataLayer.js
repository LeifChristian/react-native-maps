
import axios from 'axios';
export function postData(url, method, body) {
  console.log('BODY >>>>>>>>', body,url)
  return fetch(url, {
    method: method,
    headers: {
      // 'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: body
  });
}

export function SaveRawPost(url,method,body)
{
  return  axios({
    url: url,
    method: method,
    data: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export function SavePost(url, method, body) {
return  axios({
    url: url,
    method: method,
    data: body,
    headers: {
      'Content-Type':'multipart/form-data'
    }
  })
}
export function postImageData(url, method, body) {
  console.log('Image Body >>>>>>>>', body,url)
  var data = {
    "network_id": "5b04e881669ab6593f76a4d8",
    "user_id": "5b02a7de669ab6593f76a4a8",
    "post_text": "fgy7g"
  }
  return fetch(url, {
    
    method: method,
    body: body,
    
  })

}
export function sendParseData(url, method, body) {

  return fetch(url, {
    method: method,
    headers: {
      'X-Parse-Application-Id': '74363d626f35267b1a6910e6484e6bd2caee8231',
      'X-Parse-Master-Key': '22d2b1969dd63cac1c752fc467e44cccf8b621f8',
      'Content-Type': 'application/json',
    },
    body: body
  });
}
export function sendQuickBloxData(method, body) {
  let url = 'https://api.quickblox.com/users.json';
  return fetch(url, {
    method: 'POST',
    headers: {
      'X-Parse-Application-Id': '74363d626f35267b1a6910e6484e6bd2caee8231',
      'QuickBlox-REST-API-Version': '0.1.0',
      'Content-Type': 'application/json',
    },
    body: body
  });
}
export function logoutParseData(url, method, token) {
  return fetch(url, {
    method: method,
    headers: {
      'X-Parse-Application-Id': '74363d626f35267b1a6910e6484e6bd2caee8231',
      'X-Parse-Master-Key': '22d2b1969dd63cac1c752fc467e44cccf8b621f8',
      'X-Parse-Session-Token': token,
      'Content-Type': 'application/json',

    }
  });
}
export function getParseData(url, method) {
  return fetch(url, {
    method: method,
    headers: {
      'X-Parse-Application-Id': '74363d626f35267b1a6910e6484e6bd2caee8231',
      'X-Parse-Master-Key': '22d2b1969dd63cac1c752fc467e44cccf8b621f8',

    }
  });
}