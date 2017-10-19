import { decodeToken } from 'jsontokens'
import { Credentials, SimpleSigner } from 'uport'

class AttestationMgr {
    
    constructor(privateKey,appName,appMnid,callbackUrl) {
        this.privateKey=privateKey;
        this.appMnid=appMnid;

        const signer = SimpleSigner(this.privateKey)
        this.credentials = new Credentials({
          appName: appName,
          address: this.appMnid,
          signer: signer
        })

        this.callbackUrl=callbackUrl;
    }

    //Create Request
    requestToken(){
        let requestOpts={
            notifications: true,
            callbackUrl: this.callbackUrl,
            exp: 1509260400 //till Sunday, 29 de October de 2017 7:00:00 GMT / 0:00:00 PST (end of ethereal conf)
        }
        return this.credentials.createRequest(requestOpts);
    }

    //Extract iss from PNT
    receiveAccessToken(at){
        return this.credentials.receive(at); 
    }

    //Create attestation for the sub
    attest(sub){
        let att={
            sub: sub,
            claim: {
                attendance: {
                    event: "Ethereal",
                    date: Math.floor( Date.now() / 1000 ),
                    location: {
                        "@type": "Place",
                        "address": {
                          "@type": "PostalAddress",
                          "addressLocality": "San Francisco",
                          "addressRegion": "CA"
                        }
                    }
                }
            }
        }   
        return this.credentials.attest(att);
    }

    //Push notification to the user
    push(pushToken,attestation){
        let url='me.uport:add?attestation='+attestation
        return this.credentials.push(pushToken,{url})
    }
}    

module.exports = AttestationMgr;