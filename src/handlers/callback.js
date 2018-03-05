class CallbackHandler {
    constructor (attestationMgr) {
      this.attestationMgr = attestationMgr
    }

    async handle(event,context, cb) {

      //Parse body
      let body;
      try{ 
          body = JSON.parse(event.body) 
      } catch(e){
          cb({code:403, message:'no json body: '+e.toString()})
          return;
      }

      // Check empty body
      if (!body) {
        cb({code: 403, message: 'no body'})
        return
      }

      // Check empty access_token
      if (!body.access_token) {
        cb({code: 403, message: 'no access_token'})
        return
      }
      console.log("access_token:"+body.access_token);

      let profile=await this.attestationMgr.receiveAccessToken(body.access_token);
      console.log("<profile>");
      console.log(profile);
      console.log("</profile>");

      let sub=profile.address
      //Issue attestation
      console.log("Creating attestation for sub:" +sub)
      let attestation = await this.attestationMgr.attest(sub);
      console.log("Attestation:"+attestation);

      //Push attetation to pututu
      console.log("Pushing to pututu")
      await this.attestationMgr.push(profile.pushToken, profile.publicEncKey, attestation);
      console.log("Pushed")

      console.log("Full DONE.");
      cb(null,attestation)
    }

  }

  module.exports = CallbackHandler