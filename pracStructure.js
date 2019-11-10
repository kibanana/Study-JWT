/* eslint-disable quotes */
/* eslint-disable quote-props */

import * as crypto from 'crypto';

// Header = typ + alg

const header = {
  "typ": "JWT",
  "alg": "HS256",
};

let encodedHeader = Buffer.from(JSON.stringify(header));
encodedHeader = encodedHeader.toString('base64');
encodedHeader = encodedHeader.replace(/=/g, '');
console.log(encodedHeader);

// Payload = 토큰에 담을 정보 = claim(name : value) * n
// 등록된 registered 클레임, 공개 public 클레임, 비공개 private 클레임

const payload = {
  "iss": "woni",
  "sub": "prac",
  "aud": "you",
  "exp": new Date().getTime(),
  "https://naver.com": true,
  "userid": "woni's id",
  "username": "woni's name",
};

const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');
console.log(encodedPayload);

// Signature
// 헤더의 인코딩값과 정보의 인코딩값을 합친 후 주어진 비밀키로 해쉬를 생성한다

const signature = crypto.createHmac('sha256', 'secret')
  .update(`${encodedHeader}.${encodedPayload}`)
  .digest('base64')
  .replace(/=/g, '');
console.log(signature);

console.log('===== Result =====');
console.log(`${encodedHeader}.${encodedPayload}.${signature}`);
