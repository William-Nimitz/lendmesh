app.controller('contactCtrl', function(customFunc) {
    
    this.contact = {
        name: "",
        emailId: "",
        phone: "",
        message: "",
    }
    this.contactUsSendEmail = function() {

        const contactUrl = customFunc.serverUrl + "contact-us-send-email";
        customFunc.httpRequest(contactUrl, 'post', this.contact)
                  .then(function(res) {
                     console.log(res);
                  })
                  .catch(function(err){
                      console.log(err);
                  })
    }
})