app.controller('BankDetailCtrl', function (customFunc) {
    const thisObj = this,
        _base = "./assets/data/bankDetails/",
        _banks = "_bankDetails.json";

    this.baseImg = "./assets/images/bank/";
    this.bankShortName = window.location.search.replace(/\?/, '').split('&')[0].split('=')[1];
    this.bank = '';
    this.bankContent = {};

    this.activeTab = 0;
    this.tabContentHtml = '';

    this.homeLoans = [];
    this.autoLoans = [];
    this.personalLoans = [];
    this.studentLoans = [];

    //get all banks
    customFunc.httpRequest(`${_base}${_banks}`, "GET")
        .then(res => {
            const banklists = res.data.bankDetails;

            thisObj.bank = banklists.find(e => e.shortName === this.bankShortName);
            const allAvailableLoansUrl = customFunc.AllAvailableLoanUrl + `realTimeFetchBankLoan?bankName=${thisObj.bank.shortName}`;

            customFunc.httpRequest(`${_base}${thisObj.bank.file}`, "GET")
                .then(bank => {
                    thisObj.bankContent = bank.data;
                })
                .then(() => { thisObj.tabClick(0) })

            // get available all loan 
            this.allAvailableLoans(allAvailableLoansUrl);
        })

    // functions 
    this.tabClick = function (index) {
        this.activeTab = index;
        const tabContent = this.bankContent.content[index];

        let tabHtmlContent = `<ul class="${this.ulFormat(tabContent.format)}">`;

        tabContent.content.forEach(con => {
            tabHtmlContent += `<li>${this.subLi(con)}`;
        })

        tabHtmlContent += `${angular.isObject(tabContent.link) ? this.subLink(tabContent.link) : ''}</ul>`;
        this.tabContentHtml = tabHtmlContent;
    }
    this.subLi = function (con) {
        return angular.isString(con) ?
            `<p>${con}</p>`
            :
            `<p class="font-weight-bold">${con.header}</p>
            <ul class="${this.ulFormat(con.format)}">
                ${con.content.reduce((prev, curr, index) => (index === 1) ? `<li>${this.subLi(prev)}</li><li>${this.subLi(curr)}</li>` : `${prev}<li>${this.subLi(curr)}</li>`)}
            </ul>`;
    }
    this.subLink = function (link) {
        return `<a href="${link.url}" class="btn custom-btn-bg mt-2" target="_blank">${link.label}</a>`;
    }
    this.ulFormat = function (format) {
        let listStyleType = 'noneUl';

        switch (format) {
            case "none":
                listStyleType = 'noneUl';
                break;
            case "disc":
                listStyleType = 'discUl';
                break;
            case "circle":
                listStyleType = 'circleUl';
                break;
            case "1":
                listStyleType = 'decimalUl';
                break;
            default:
                listStyleType = 'noneUl';
                break;
        }
        return listStyleType;
    }
    this.allAvailableLoans = function (allAvailableLoansUrl) {
        //get all the available loans 
        customFunc.httpRequest(allAvailableLoansUrl, "GET")
            .then(res => {
                const parse = customFunc.customParse1(res.data);

                const homeLoans = parse.find(loan => loan.bankDetails.loanType === "mortgageLoan");
                this.homeLoans = homeLoans.bankDetails.itemType.map(loan => {
                    let rateBetween = (loan.rateTo !== "" && loan.rateTo !== undefined)?" - ":"",
                          rateRange = (loan.rateFrom == loan.rateTo) ? loan.rateFrom : loan.rateFrom + rateBetween + (loan.rateTo??''),
                          minPeriod = (loan.minPeriod === "" || loan.minPeriod === undefined) ? (personalLoans.personalMinTerm ?? "") : loan.minPeriod,
                          maxPeriod = (loan.maxPeriod === "" || loan.maxPeriod === undefined) ? (personalLoans.personalMaxTerm ?? "") : loan.maxPeriod,
                          periodBetween = (maxPeriod !== "" && minPeriod !== maxPeriod)?" - ":"";
                    maxPeriod = (minPeriod !== maxPeriod) ? maxPeriod : "";
                    return {
                        type: loan.type,
                        rateRange: customFunc.checkUndefined(rateRange),
                        PeriodRange: customFunc.checkUndefined(minPeriod + periodBetween + maxPeriod),
                        personalLoanMaxAmount: (loan.maxAmount)?loan.maxAmount:personalLoans.personalLoanMaxAmount,
                    }
                });

                const autoLoans = parse.find(loan => loan.bankDetails.loanType === "autoLoan");
                this.autoLoans = autoLoans.bankDetails.itemType.map(loan => {
                    let rateBetween = (loan.rateTo !== "" && loan.rateTo !== undefined)?" - ":"",
                          rateRange = (loan.rateFrom == loan.rateTo) ? loan.rateFrom : loan.rateFrom + rateBetween + (loan.rateTo??''),
                          minPeriod = (loan.minPeriod === "" || loan.minPeriod === undefined) ? (personalLoans.autoMinTerm ?? "") : loan.minPeriod,
                          maxPeriod = (loan.maxPeriod === "" || loan.maxPeriod === undefined) ? (personalLoans.autoMaxTerm ?? "") : loan.maxPeriod,
                          periodBetween = (maxPeriod !== "" && minPeriod !== maxPeriod)?" - ":"";
                    maxPeriod = (minPeriod !== maxPeriod) ? maxPeriod : "";
                    return {
                        type: loan.type,
                        rateRange: customFunc.checkUndefined(rateRange),
                        PeriodRange: customFunc.checkUndefined(minPeriod + periodBetween + maxPeriod),
                    }
                });

                const personalLoans = parse.find(loan => loan.bankDetails.loanType === "personalLoan");
                this.personalLoans = personalLoans.bankDetails.itemType.map(loan => {
                    let rateBetween = (loan.rateTo !== "" && loan.rateTo !== undefined)?" - ":"",
                          rateRange = (loan.rateFrom == loan.rateTo) ? loan.rateFrom : loan.rateFrom + rateBetween + (loan.rateTo??''),
                          minPeriod = (loan.minPeriod === "" || loan.minPeriod === undefined) ? (personalLoans.personalMinTerm ?? "") : loan.minPeriod,
                          maxPeriod = (loan.maxPeriod === "" || loan.maxPeriod === undefined) ? (personalLoans.personalMaxTerm ?? "") : loan.maxPeriod,
                          periodBetween = (maxPeriod !== "" && minPeriod !== maxPeriod)?" - ":"";
                    maxPeriod = (minPeriod !== maxPeriod) ? maxPeriod : "";
                    return {
                        type: loan.type,
                        rateRange: customFunc.checkUndefined(rateRange),
                        PeriodRange: customFunc.checkUndefined(minPeriod + periodBetween + maxPeriod),
                        personalLoanMaxAmount: (loan.maxAmount)?loan.maxAmount:personalLoans.personalLoanMaxAmount,
                    }
                });

                const studentLoans = parse.find(loan => loan.bankDetails.loanType === "studentLoan");
                this.studentLoans = [];

                console.log(homeLoans);
            })
    }

}); 