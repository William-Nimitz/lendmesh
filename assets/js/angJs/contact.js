app.controller('contactCtrl', function(customFunc) {
    const thisObj = this;
    this.contact = {
        name: "",
        emailId: "",
        phone: "",
        message: "",
    }
    this.contactUsSendEmail = function() {
        const contactUrl = customFunc.serverUrl + "contact-us-send-email";
        customFunc.openLoading();

        customFunc.httpRequest(contactUrl, 'post', this.contact)
                  .then(function(res) {
                     customFunc.closeLoading();
                     const modalCon = `<p>Thanks for submitting the request!</p>`;
                     customFunc.openModal("customModal", modalCon, null, thisObj.clearForm);
                  })
                  .catch(function(err){
                      console.log(err);
                  })
    }
    this.clearForm = function() {
        this.contact = {
            name: "",
            emailId: "",
            phone: "",
            message: "",
        }
    }
})