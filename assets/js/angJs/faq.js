app.controller('faqCtrl', function($translate, customFunc) {
    // to bank information
    const thisObj = this;

    // Lanuage
    this.langImg = "en";
    // function section 
    this.mobileFilter = function() {
        document.getElementById('abcdef').style.transform = "translateY(0)";
    }
    this.closeFilter = function() {
        document.getElementById('abcdef').style.transform = "";// translateY(calc(100% + 1.88889rem))
    };
    this.openModal = function(bankId) {
        this.specBank = this.maindataLoan.find(e => e.bankId == bankId);
        document.getElementById("detail-modal").style.display = "block";
    }
    this.closeModal = function() {
        document.getElementById("detail-modal").style.display = "none";
    }
    this.changeLanguage = function(lang) {
        $translate.use(lang);
        this.langImg = lang;
    }
})