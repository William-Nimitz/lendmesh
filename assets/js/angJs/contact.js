app.controller('contactCtrl', function(customFunc) {
    
    this.contact = {
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerMessage: "",
    }
    this.contactUsSendEmail = function() {
        
        const contactUrl = customFunc.serverUrl + "contact-us-send-email";
        console.log(this.contact, contactUrl);
        customFunc.httpRequest(contactUrl, 'post', this.contact)
                  .then(function(res) {
                     console.log(res);
                  })
                  .catch(function(err){
                      console.log(err);
                  })
    }
})