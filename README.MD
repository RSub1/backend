## Run
Make sure you have a node version 10+ installed on your machine.

```
$ npm i
```

For running the application:
Build the application
```
$ npm run build
$ npm start
```

The application should be available on port 80.

Information about the used framework check out  
https://www.npmjs.com/package/skeidjs

For the mongo db connection provide the following environment variables
- MONGO_URL
- MONGO_USR
- MONGO_PW


For the html test set you host env variable
- HOST

## Anonymized ids
Generate a RSA key pair
Provide the environment variables
- PUBLIC_ID with the absolute path to the public key
- PRIVATE_ID with the absolute path to the private key

make sure the toggle is active
- PATCH 'host:port/togglz' 
```
{
  "enable": ["ANONYMOUS_IDS"],
  "disable": []
}

```
The decryptor expects a base64, utf8 encrypted cipher text (id)


