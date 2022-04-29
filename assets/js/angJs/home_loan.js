app.controller('homeLoanCtrl', function(customFunc, $window) {
    // to bank information
    const thisObj = this;
    const appWindow = angular.element($window);
	var dmd1 = new Date();
	//var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate()+""+Math.random();
	var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate();

    this.specBank = []; // for detail information(how to join)
    // sort manage 
    this.sortObj = {
        fixedApr:false,
        fixedRate: true,
        variableApr:true,
        variableRate:true,
        term:true,
        variableTerm: true,
        _name:true
    };
    this.selectedSort = 'fixedApr'; // sort type
    // filter manage 
    this.creditScore = "700";
    // main data manage 
    this.maindata_source = []; // source information (for filter)
    this.maindataLoan = [];    // display information

    this.Showed = 1; // show *purchase* type, false -> *refinance*
    this.IsDesktop = 1;
    appWindow.bind('resize', function () {
        thisObj.getDevice();
    });
    this.getDevice = function() {
        const ScreenWidth = $window.innerWidth;
        const expandTrs = $(".expand-wrap-mobileView");
        if(ScreenWidth >= 1125) {
            expandTrs.css("display", "none");
        } else {
            expandTrs.css("display", "block");
        }

        if(ScreenWidth > 820) {
            this.IsDesktop = 1;
        } else {
            this.IsDesktop = 0;
        }
    }
    this.fetchData = function(zip, creditScore) {
		var url = "";
		var indexLendMesh = window.location.hostname.indexOf("lendmesh");
		
		if(indexLendMesh == -1)
			url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchMortgageLoan?";
		else 
			url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchAllLoansData?loanType=mortgageLoan&";
        if(zip) {
            zip = zip.split(",").join("");
            url += "zipCode=" + zip  + '&';
        }
        if(creditScore) {
            creditScore = creditScore.split(",").join("");
            url += "creditScore=" + creditScore  + '&';
        }
        //customFunc.httpRequest("https://us-east4-lendmesh.cloudfunctions.net/fetchHomeLoanRates", "GET")
        customFunc.httpRequest(url, "GET")
                  .then(function(res) {
        const parse = customFunc.customParse(res.data),
              personalInfo = [];
            parse.forEach((val) => {

                let purchaseObj = {},
                     refinanceObj = {};

                val.bankDetails.itemType.forEach((childVal) => {
                    
                    if(childVal.type === "purchase") {
                        
                        if(childVal.fixedAPR === true){
                            purchaseObj.fixedRateFrom = childVal.rateFrom;
                            purchaseObj.fixedRateTo = childVal.rateTo;
                            purchaseObj.fixedAprFrom = childVal.aprFrom;
                            purchaseObj.fixedAprTo = childVal.aprTo;
                        } else {
                            purchaseObj.variableRateFrom = childVal.rateFrom;
                            purchaseObj.variableRateTo = childVal.rateTo;
                            purchaseObj.variableAprFrom = childVal.aprFrom;
                            purchaseObj.variableAprTo = childVal.aprTo;
                            purchaseObj.variableMinPeriod = purchaseObj.variableMinPeriod ?? childVal.minPeriod;
                            purchaseObj.variableMaxPeriod = purchaseObj.variableMaxPeriod ?? childVal.maxPeriod;
                        }
                        purchaseObj.minPeriod = purchaseObj.minPeriod ?? childVal.minPeriod;
                        purchaseObj.maxPeriod = purchaseObj.maxPeriod ?? childVal.maxPeriod;
                        purchaseObj.urlLink = childVal.urlLink;
                        purchaseObj.type = childVal.type;
                    } else {
                        if(childVal.fixedAPR === true){
                            refinanceObj.fixedRateFrom = childVal.rateFrom;
                            refinanceObj.fixedRateTo = childVal.rateTo;
                            refinanceObj.fixedAprFrom = childVal.aprFrom;
                            refinanceObj.fixedAprTo = childVal.aprTo;
                        } else {
                            refinanceObj.variableRateFrom = childVal.rateFrom;
                            refinanceObj.variableRateTo = childVal.rateTo;
                            refinanceObj.variableAprFrom = childVal.aprFrom;
                            refinanceObj.variableAprTo = childVal.aprTo;
                            refinanceObj.variableMinPeriod = refinanceObj.variableMinPeriod ?? childVal.minPeriod;
                            refinanceObj.variableMaxPeriod = refinanceObj.variableMaxPeriod ?? childVal.maxPeriod;
                        }
                        refinanceObj.minPeriod = refinanceObj.minPeriod ?? childVal.minPeriod;
                        refinanceObj.maxPeriod = refinanceObj.maxPeriod ?? childVal.maxPeriod;
                        refinanceObj.urlLink = childVal.urlLink;
                        refinanceObj.type = childVal.type;
                    }
                })

                if(!angular.equals(purchaseObj, {})) {

                    let fixedRateBetween = (purchaseObj.fixedRateTo !== "" && purchaseObj.fixedRateTo !== undefined)?" - ":"",
                        fixedAprBetween = (purchaseObj.fixedAprTo !== "" && purchaseObj.fixedAprTo !== undefined)?" - ":"",
                        variableRateBetween = (purchaseObj.variableRateTo !== "" && purchaseObj.variableRateTo !== undefined)?" - ":"",
                        variableAprBetween = (purchaseObj.variableAprTo !== "" && purchaseObj.variableAprTo !== undefined)?" - ":"",
                        periodBetween = (purchaseObj.minPeriod !== ""  && purchaseObj.maxPeriod !== "" && purchaseObj.maxPeriod !== undefined)?" - ":"",
                        variablePeriodBetween = (purchaseObj.variableMinPeriod !== ""  && purchaseObj.variableMaxPeriod !== "" && purchaseObj.variableMaxPeriod !== undefined)?" - ":"";
                    personalInfo.push({
                        bankName: val.bankShortName??val.bankName,
                        bankUrl:val.bankUrl,

                        personalLoanUrl:purchaseObj.urlLink,
                        fixedRateFrom: customFunc.stringToNumber(purchaseObj.fixedRateFrom) ?? 0,
                        fixedRateRange: customFunc.checkUndefined(purchaseObj.fixedRateFrom + fixedRateBetween + purchaseObj.fixedRateTo),
                        fixedAprFrom: customFunc.stringToNumber(purchaseObj.fixedAprFrom) ?? 0,
                        fixedAprRange: customFunc.checkUndefined((purchaseObj.fixedAprFrom ?? "") + fixedAprBetween + (purchaseObj.fixedAprTo ?? "")),

                        variableRateFrom: customFunc.stringToNumber(purchaseObj.variableRateFrom) ?? 0,
                        variableRateRange: customFunc.checkUndefined((purchaseObj.variableRateFrom ?? '') + variableRateBetween + (purchaseObj.variableRateTo ?? '')),
                        variableAprFrom: customFunc.stringToNumber(purchaseObj.variableAprFrom) ?? 0,
                        variableAprRange: customFunc.checkUndefined((purchaseObj.variableAprFrom ?? '') + variableAprBetween + (purchaseObj.variableAprTo ?? '')),

                        minPeriod: customFunc.getMinTerm(purchaseObj.minPeriod),
                        PeriodRange: customFunc.checkUndefined(purchaseObj.minPeriod + periodBetween + purchaseObj.maxPeriod),
                        variableMinPeriod: customFunc.getMinTerm(purchaseObj.variableMinPeriod),
                        variablePeriodRange: customFunc.checkUndefined(purchaseObj.variableMinPeriod + variablePeriodBetween + purchaseObj.variableMaxPeriod),

                        type: purchaseObj.type,
                        bankId:val.bankID,
						version:version,
                        displayPriority:val.displayPriority,
                        lendmeshScore:val.lendmeshScore ?? 0,
                        allowBadCredit:val.allowBadCredit,
                        allowAverageCredit:val.allowAverageCredit,
                        allowGoodCredit:val.allowGoodCredit,
                        allowExcellentCredit:val.allowExcellentCredit,
                        joinDetails:val.joinDetails,
                        joinLinkUrl:val.joinLinkUrl
                    });
                }
                if(!angular.equals(refinanceObj, {})) {

                    let fixedRateBetween = (refinanceObj.fixedRateTo !== "" && refinanceObj.fixedRateTo !== undefined)?" - ":"",
                        fixedAprBetween = (refinanceObj.fixedAprTo !== "" && refinanceObj.fixedAprTo !== undefined)?" - ":"",
                        variableRateBetween = (refinanceObj.variableRateTo !== "" && refinanceObj.variableRateTo !== undefined)?" - ":"",
                        variableAprBetween = (refinanceObj.variableAprTo !== "" && refinanceObj.variableAprTo !== undefined)?" - ":"",
                        periodBetween = (refinanceObj.minPeriod !== ""  && refinanceObj.maxPeriod !== "" && refinanceObj.maxPeriod !== undefined)?" - ":"",
                        variablePeriodBetween = (refinanceObj.variableMinPeriod !== ""  && refinanceObj.variableMaxPeriod !== "" && refinanceObj.variableMaxPeriod !== undefined)?" - ":"";
                    personalInfo.push({
                        bankName: val.bankShortName??val.bankName,
                        bankUrl:val.bankUrl,
                        
                        personalLoanUrl:refinanceObj.urlLink,
                        fixedRateFrom: customFunc.stringToNumber(refinanceObj.fixedRateFrom) ?? 0,
                        fixedRateRange: customFunc.checkUndefined(refinanceObj.fixedRateFrom + fixedRateBetween + refinanceObj.fixedRateTo),
                        fixedAprFrom: customFunc.stringToNumber(refinanceObj.fixedAprFrom) ?? 0,
                        fixedAprRange: customFunc.checkUndefined((refinanceObj.fixedAprFrom ?? "") + fixedAprBetween + (refinanceObj.fixedAprTo ?? "")),
                        
                        variableRateFrom: customFunc.stringToNumber(refinanceObj.variableRateFrom) ?? 0,
                        variableRateRange: customFunc.checkUndefined((refinanceObj.variableRateFrom ?? '') + variableRateBetween + (refinanceObj.variableRateTo ?? '')),
                        variableAprFrom: customFunc.stringToNumber(refinanceObj.variableAprFrom) ?? 0,
                        variableAprRange: customFunc.checkUndefined((refinanceObj.variableAprFrom ?? '') + variableAprBetween + (refinanceObj.variableAprTo ?? '')),
                        
                        minPeriod: customFunc.getMinTerm(refinanceObj.minPeriod),
                        PeriodRange: customFunc.checkUndefined(refinanceObj.minPeriod + periodBetween + refinanceObj.maxPeriod),
                        variableMinPeriod: customFunc.getMinTerm(refinanceObj.variableMinPeriod),
                        variablePeriodRange: customFunc.checkUndefined(refinanceObj.variableMinPeriod + variablePeriodBetween + refinanceObj.variableMaxPeriod),

                        type: refinanceObj.type,
                        bankId:val.bankID,
						version:version,
                        displayPriority:val.displayPriority,
                        lendmeshScore:val.lendmeshScore ?? 0,
                        allowBadCredit:val.allowBadCredit,
                        allowAverageCredit:val.allowAverageCredit,
                        allowGoodCredit:val.allowGoodCredit,
                        allowExcellentCredit:val.allowExcellentCredit,
                        joinDetails:val.joinDetails,
                        joinLinkUrl:val.joinLinkUrl
                    });
                }
            })

            personalInfo.sort(function(a, b) {
                let x = a.displayPriority,
                    y = b.displayPriority;
                    if(x !== y){ 
                        return x - y;
                    } else {
                        return  a.fixedAprFrom - b.fixedAprFrom;
                    }
            });
            thisObj.maindata_source = personalInfo;
            thisObj.maindataLoan = personalInfo;
            thisObj.Showed = 1;
        })
    };
    this.getDevice();
    this.fetchData();
    // function section 
    this.make_loan_tab_active = function(type) {
        if(type == 'p-l-r'){
                document.getElementById("bar-tab").classList.remove("--is-active");
                document.getElementById("foo-tab").classList.add("--is-active");
                this.Showed = 1;
        } else if(type === 'p-p-l'){
            document.getElementById("foo-tab").classList.remove("--is-active");
            document.getElementById("bar-tab").classList.add("--is-active");
            this.Showed = 0;
        }
    }

    this.customSort = function(sortType) {
        switch (sortType) {
            case 'fixedApr':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.fixedAprFrom - b.fixedAprFrom:b.fixedAprFrom - a.fixedAprFrom;
                });
                break;
            case 'fixedRate':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.fixedRateFrom - b.fixedRateFrom:b.fixedRateFrom - a.fixedRateFrom;
                });
                break;
            case 'variableApr':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.variableAprFrom - b.variableAprFrom:b.variableAprFrom - a.variableAprFrom;
                });
                break;
            case 'variableRate':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.variableRateFrom - b.variableRateFrom:b.variableRateFrom - a.variableRateFrom;
                });
                break;
            case 'term':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.minPeriod - b.minPeriod:b.minPeriod - a.minPeriod;
                });
                break;
            case 'variableTerm':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.variableMinPeriod - b.variableMinPeriod:b.variableMinPeriod - a.variableMinPeriod;
                });
                break;
            case '_name':
                this.maindataLoan.sort(function(a, b) {
                    if(thisObj.sortObj[sortType]) {
                        if(a.bankName < b.bankName) { return 1; }
                        if(a.bankName > b.bankName) { return -1; }
                        return 0;
                    } else {
                        if(a.bankName < b.bankName) { return -1; }
                        if(a.bankName > b.bankName) { return 1; }
                        return 0;
                    }
                });
                break;
            default:
                break;
        }
        const mid = !this.sortObj[sortType];
        Object.keys(this.sortObj).forEach(key => this.sortObj[key] = true);

        this.sortObj[sortType] = mid;
        this.selectedSort = sortType;
    }
    /*
    // customer filter 
    this.customFilter = function() {
        this.maindataLoan = this.maindata_source;
        // this.maindataLoan = this.maindataLoan.filter(e => e.personalLoanMaxAmount >= customFunc.strToNum(this.loanAmountVal));
        switch (Number(this.creditScore)) {
            case 639:
                this.maindataLoan = this.maindataLoan.filter(e => {
                    let allowBadCredit = e.allowBadCredit;
                    return allowBadCredit;
                });
                break;
            case 640:
                this.maindataLoan = this.maindataLoan.filter(e => {
                    let allowAverageCredit = e.allowBadCredit || e.allowAverageCredit;
                    return allowAverageCredit;
                });
                break;
            case 700:
                this.maindataLoan = this.maindataLoan.filter(e => {
                    let allowBadCredit = e.allowBadCredit || e.allowAverageCredit || e.allowGoodCredit;
                    return allowBadCredit;
                });
                break;
            case 750:
                this.maindataLoan = this.maindataLoan.filter(e => {
                    let allowBadCredit = e.allowBadCredit || e.allowAverageCredit || e.allowGoodCredit || e.allowExcellentCredit;
                    return allowBadCredit;
                });
                break;
            default:
                break;
        }
    }
    */
    // 
	
	this.customFilter = function() {
        if(this.zip && getState(this.zip) == false) {
            return;
        }
        this.fetchData(this.zip, this.creditScore, this.loanAmountVal);
    }
    this.moreDetail = function(event) {
        const currentTr = event.currentTarget.closest("tr"),
              nextTr = angular.element(currentTr).next(),
              nextTrDisplay = nextTr.css('display');
        let displayCss = (nextTrDisplay === "none") ? "table-row" : "none"; 

        nextTr.css({'display': displayCss});
    }
}); 
