app.controller('BankDetailCtrl', function (customFunc) {
    const thisObj = this,
            _base = "./assets/data/bankDetails/",
            _banks = "_bankDetails.json";

    this.baseImg = "./assets/images/bank/";
    this.bankShortName = window.location.search.replace(/\?/, '').split('&')[0].split('=')[1];
    this.canonical = window.location.href;
    this.backUrl = "";
    this.bank = '';
    this.bankContent = {};

    this.activeTab = 0;
    this.tabContentHtml = '';

    this.homeLoans = [];
    this.autoLoans = [];
    this.personalLoans = [];
    this.studentLoans = [];

    // this.backUrl = 
    if(document.referrer) {
        this.backUrl = document.referrer;
        sessionStorage.setItem(this.bankShortName, document.referrer);
    } else {
        this.backUrl = sessionStorage.getItem(this.bankShortName);
    }
    //get all banks
    //console.log(`${_base}${_banks}`);
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
                //console.log(res.data)
                const parse = customFunc.customParse(res.data);
                const homeLoans = parse.find(loan => loan.bankDetails.loanType === "mortgageLoan");
                if (homeLoans) {
                    const purchaseObj = {}, refinanceObj = {};
                    homeLoans.bankDetails.itemType.forEach((loan) => {
                        if (loan.type === "purchase") {
                            if (loan.fixedAPR === true) {
                                purchaseObj.fixedRateFrom = loan.rateFrom;
                                purchaseObj.fixedRateTo = loan.rateTo;
                                purchaseObj.fixedAprFrom = loan.aprFrom;
                                purchaseObj.fixedAprTo = loan.aprTo;
                            } else {
                                purchaseObj.variableRateFrom = loan.rateFrom;
                                purchaseObj.variableRateTo = loan.rateTo;
                                purchaseObj.variableAprFrom = loan.aprFrom;
                                purchaseObj.variableAprTo = loan.aprTo;
                            }
                            purchaseObj.minPeriod = purchaseObj.minPeriod ?? loan.minPeriod;
                            purchaseObj.maxPeriod = purchaseObj.maxPeriod ?? loan.maxPeriod;
                            purchaseObj.type = loan.type;
                        } else {
                            if (loan.fixedAPR === true) {
                                refinanceObj.fixedRateFrom = loan.rateFrom;
                                refinanceObj.fixedRateTo = loan.rateTo;
                                refinanceObj.fixedAprFrom = loan.aprFrom;
                                refinanceObj.fixedAprTo = loan.aprTo;
                            } else {
                                refinanceObj.variableRateFrom = loan.rateFrom;
                                refinanceObj.variableRateTo = loan.rateTo;
                                refinanceObj.variableAprFrom = loan.aprFrom;
                                refinanceObj.variableAprTo = loan.aprTo;
                            }
                            refinanceObj.minPeriod = refinanceObj.minPeriod ?? loan.minPeriod;
                            refinanceObj.maxPeriod = refinanceObj.maxPeriod ?? loan.maxPeriod;
                            refinanceObj.type = loan.type;
                        }
                    })

                    if (!angular.equals(purchaseObj, {})) {

                        let fixedRateBetween = (purchaseObj.fixedRateTo !== "" && purchaseObj.fixedRateTo !== undefined) ? " - " : "",
                            fixedAprBetween = (purchaseObj.fixedAprTo !== "" && purchaseObj.fixedAprTo !== undefined) ? " - " : "",
                            variableRateBetween = (purchaseObj.variableRateTo !== "" && purchaseObj.variableRateTo !== undefined) ? " - " : "",
                            variableAprBetween = (purchaseObj.variableAprTo !== "" && purchaseObj.variableAprTo !== undefined) ? " - " : "",
                            periodBetween = (purchaseObj.minPeriod !== "" && purchaseObj.maxPeriod !== "" && purchaseObj.maxPeriod !== undefined) ? " - " : "";
                        this.homeLoans.push({
                            fixedRateRange: customFunc.checkUndefined(purchaseObj.fixedRateFrom + fixedRateBetween + purchaseObj.fixedRateTo),
                            fixedAprRange: customFunc.checkUndefined((purchaseObj.fixedAprFrom ?? "") + fixedAprBetween + (purchaseObj.fixedAprTo ?? "")),
                            variableRateRange: customFunc.checkUndefined((purchaseObj.variableRateFrom ?? '') + variableRateBetween + (purchaseObj.variableRateTo ?? '')),
                            variableAprRange: customFunc.checkUndefined((purchaseObj.variableAprFrom ?? '') + variableAprBetween + (purchaseObj.variableAprTo ?? '')),
                            PeriodRange: customFunc.checkUndefined(purchaseObj.minPeriod + periodBetween + purchaseObj.maxPeriod),
                            type: purchaseObj.type,
                        });
                    }
                    if (!angular.equals(refinanceObj, {})) {

                        let fixedRateBetween = (refinanceObj.fixedRateTo !== "" && refinanceObj.fixedRateTo !== undefined) ? " - " : "",
                            fixedAprBetween = (refinanceObj.fixedAprTo !== "" && refinanceObj.fixedAprTo !== undefined) ? " - " : "",
                            variableRateBetween = (refinanceObj.variableRateTo !== "" && refinanceObj.variableRateTo !== undefined) ? " - " : "",
                            variableAprBetween = (refinanceObj.variableAprTo !== "" && refinanceObj.variableAprTo !== undefined) ? " - " : "",
                            periodBetween = (refinanceObj.minPeriod !== "" && refinanceObj.maxPeriod !== "" && refinanceObj.maxPeriod !== undefined) ? " - " : "";
                        this.homeLoans.push({
                            fixedRateRange: customFunc.checkUndefined(refinanceObj.fixedRateFrom + fixedRateBetween + refinanceObj.fixedRateTo),
                            fixedAprRange: customFunc.checkUndefined((refinanceObj.fixedAprFrom ?? "") + fixedAprBetween + (refinanceObj.fixedAprTo ?? "")),
                            variableRateRange: customFunc.checkUndefined((refinanceObj.variableRateFrom ?? '') + variableRateBetween + (refinanceObj.variableRateTo ?? '')),
                            variableAprRange: customFunc.checkUndefined((refinanceObj.variableAprFrom ?? '') + variableAprBetween + (refinanceObj.variableAprTo ?? '')),
                            PeriodRange: customFunc.checkUndefined(refinanceObj.minPeriod + periodBetween + refinanceObj.maxPeriod),
                            type: refinanceObj.type,
                        });
                    }
                }

                const autoLoans = parse.find(loan => loan.bankDetails.loanType === "autoLoan");
                if (autoLoans) {
                    this.autoLoans = autoLoans.bankDetails.itemType.map(loan => {
                        let rateBetween = (loan.rateTo !== "" && loan.rateTo !== undefined) ? " - " : "",
                            rateRange = (loan.rateFrom == loan.rateTo) ? loan.rateFrom : loan.rateFrom + rateBetween + (loan.rateTo ?? ''),
                            minPeriod = (loan.minPeriod === "" || loan.minPeriod === undefined) ? (autoLoans.autoMinTerm ?? "") : loan.minPeriod,
                            maxPeriod = (loan.maxPeriod === "" || loan.maxPeriod === undefined) ? (autoLoans.autoMaxTerm ?? "") : loan.maxPeriod,
                            periodBetween = (maxPeriod !== "" && minPeriod !== maxPeriod) ? " - " : "";
                        maxPeriod = (minPeriod !== maxPeriod) ? maxPeriod : "";
                        return {
                            type: loan.type,
                            rateRange: customFunc.checkUndefined(rateRange),
                            PeriodRange: customFunc.checkUndefined(minPeriod + periodBetween + maxPeriod),
                        }
                    });
                }

                const personalLoans = parse.find(loan => loan.bankDetails.loanType === "personalLoan");
                if (personalLoans) {
                    this.personalLoans = personalLoans.bankDetails.itemType.map(loan => {
                        let rateBetween = (loan.rateTo !== "" && loan.rateTo !== undefined) ? " - " : "",
                            rateRange = (loan.rateFrom == loan.rateTo) ? loan.rateFrom : loan.rateFrom + rateBetween + (loan.rateTo ?? ''),
                            minPeriod = (loan.minPeriod === "" || loan.minPeriod === undefined) ? (personalLoans.personalMinTerm ?? "") : loan.minPeriod,
                            maxPeriod = (loan.maxPeriod === "" || loan.maxPeriod === undefined) ? (personalLoans.personalMaxTerm ?? "") : loan.maxPeriod,
                            periodBetween = (maxPeriod !== "" && minPeriod !== maxPeriod) ? " - " : "";
                        maxPeriod = (minPeriod !== maxPeriod) ? maxPeriod : "";
                        return {
                            type: loan.type,
                            rateRange: customFunc.checkUndefined(rateRange),
                            PeriodRange: customFunc.checkUndefined(minPeriod + periodBetween + maxPeriod),
                            personalLoanMaxAmount: (loan.maxAmount) ? loan.maxAmount : personalLoans.personalLoanMaxAmount,
                        }
                    });
                }

                const studentLoans = parse.find(loan => loan.bankDetails.loanType === "studentLoan");
                if (studentLoans) {
                    const newLoanObj = {}, studentRefinanceObj = {};
                    studentLoans.bankDetails.itemType.forEach((loan) => {
                        if (loan.type === "newLoan") {
                            if (loan.fixedAPR === true) {
                                newLoanObj.fixedRateFrom = loan.rateFrom ?? loan.aprFrom;
                                newLoanObj.fixedRateTo = loan.rateTo ?? loan.aprTo;
                            } else {
                                newLoanObj.variablerateFrom = loan.rateFrom ?? loan.aprFrom;
                                newLoanObj.variablerateTo = loan.rateTo ?? loan.aprTo;
                            }
                            newLoanObj.minPeriod = (newLoanObj.minPeriod === undefined || newLoanObj.minPeriod === "") ? ((loan.minPeriod === "" || loan.minPeriod === undefined) ? (studentLoans.studentMinTerm ?? "") : loan.minPeriod) : newLoanObj.minPeriod,
                                newLoanObj.maxPeriod = (newLoanObj.maxPeriod === undefined || newLoanObj.maxPeriod === "") ? ((loan.maxPeriod === "" || loan.maxPeriod === undefined) ? (studentLoans.studentMaxTerm ?? "") : loan.maxPeriod) : newLoanObj.maxPeriod,
                                newLoanObj.maxPeriod = (newLoanObj.minPeriod !== newLoanObj.maxPeriod) ? newLoanObj.maxPeriod : "";
                            newLoanObj.type = loan.type;
                        } else {
                            if (loan.fixedAPR === true) {
                                studentRefinanceObj.fixedRateFrom = loan.rateFrom ?? loan.aprFrom;
                                studentRefinanceObj.fixedRateTo = loan.rateTo ?? loan.aprTo;
                            } else {
                                studentRefinanceObj.variablerateFrom = loan.rateFrom ?? loan.aprFrom;
                                studentRefinanceObj.variablerateTo = loan.rateTo ?? loan.aprTo;
                            }
                            studentRefinanceObj.minPeriod = (studentRefinanceObj.minPeriod === undefined || studentRefinanceObj.minPeriod === "") ? ((loan.minPeriod === "" || loan.minPeriod === undefined) ? (studentLoans.studentMinTerm ?? "") : loan.minPeriod) : studentRefinanceObj.minPeriod,
                                studentRefinanceObj.maxPeriod = (studentRefinanceObj.maxPeriod === undefined || studentRefinanceObj.maxPeriod === "") ? ((loan.maxPeriod === "" || loan.maxPeriod === undefined) ? (studentLoans.studentMaxTerm ?? "") : loan.maxPeriod) : studentRefinanceObj.maxPeriod,
                                studentRefinanceObj.maxPeriod = (studentRefinanceObj.minPeriod !== studentRefinanceObj.maxPeriod) ? studentRefinanceObj.maxPeriod : "";
                            studentRefinanceObj.type = loan.type;
                        }
                    })

                    if (!angular.equals(newLoanObj, {})) {
                        let fixedRateBetween = (newLoanObj.fixedRateTo !== "" && newLoanObj.fixedRateTo !== undefined) ? " - " : "",
                            variableRateBetween = (newLoanObj.variablerateTo !== "" && newLoanObj.variablerateTo !== undefined) ? " - " : "",
                            periodBetween = (newLoanObj.maxPeriod !== "" && newLoanObj.minPeriod !== newLoanObj.maxPeriod) ? " - " : "";
                        this.studentLoans.push({
                            type: newLoanObj.type,
                            fixedrateRange: newLoanObj.fixedRateFrom + fixedRateBetween + newLoanObj.fixedRateTo,
                            variablerateRange: customFunc.checkUndefined((newLoanObj.variablerateFrom ?? '') + variableRateBetween + (newLoanObj.variablerateTo ?? '')),
                            PeriodRange: customFunc.checkUndefined(newLoanObj.minPeriod + periodBetween + newLoanObj.maxPeriod)
                        });
                    }
                    if (!angular.equals(studentRefinanceObj, {})) {

                        let fixedRateBetween = (studentRefinanceObj.fixedRateTo !== "" && studentRefinanceObj.fixedRateTo !== undefined) ? " - " : "",
                            variableRateBetween = (studentRefinanceObj.variablerateTo !== "" && studentRefinanceObj.variablerateTo !== undefined) ? " - " : "",
                            periodBetween = (studentRefinanceObj.maxPeriod !== "" && studentRefinanceObj.minPeriod !== studentRefinanceObj.maxPeriod) ? " - " : "";
                        this.studentLoans.push({
                            type: studentRefinanceObj.type,
                            fixedrateRange: studentRefinanceObj.fixedRateFrom + fixedRateBetween + studentRefinanceObj.fixedRateTo,
                            variablerateRange: customFunc.checkUndefined(studentRefinanceObj.variablerateFrom + variableRateBetween + studentRefinanceObj.variablerateTo),
                            PeriodRange: customFunc.checkUndefined(studentRefinanceObj.minPeriod + periodBetween + studentRefinanceObj.maxPeriod)
                        });
                    }
                }
            })
    }
    
}); 