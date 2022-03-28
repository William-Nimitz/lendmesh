app.controller('BankDetailCtrl', function (customFunc) {
    const thisObj = this,
            _base = "./assets/data/bankDetails/",
            _banks = "_bankDetails.json";

    this.baseImg = "./assets/images/bank/";
    this.bankShortName = window.location.search.replace(/\?/, '').split('&')[0].split('=')[1];
    this.bank = '';
    this.bankContent = {};
    //get all banks
    customFunc.httpRequest(`${_base}${_banks}`, "GET")
        .then(res => {
            const banklists = res.data.bankDetails;

            thisObj.bank = banklists.find(e => e.shortName === this.bankShortName);

            customFunc.httpRequest(`${_base}${thisObj.bank.file}`, "GET")
                .then(bank => {
                    thisObj.bankContent = bank.data;
                    console.log(thisObj.bankContent.content);
                })
        
        })
}); 