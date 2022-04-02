app.controller('studentLoanCtrl', function(customFunc) {
    // to bank information
    const thisObj = this;
	var dmd1 = new Date();
	//var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate()+""+Math.random();
	var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate();

    this.specBank = []; // for detail information(how to join)
    // sort manage 
    this.sortObj = {
        fixedApr:false,
        variableApr:true,
        term:true,
        _name:true
    };
    this.selectedSort = 'fixedApr'; // sort type
    // filter manage 
    // this.loanAmountVal = ''; // Max loan amount
    this.creditScore = "700";
    // main data manage 
    this.maindata_source = []; // source information (for filter)
    this.maindataLoan = [];    // display information

    this.Showed = 1; // show *newLoan* type, false -> *refinance*
    
    //this.Showed = "studentLoan"; // show *newLoan* type, false -> *refinance*
    this.fetchData = function(zip, creditScore) {
		var url = "";
		var indexLendMesh = window.location.hostname.indexOf("lendmesh");
		if(indexLendMesh == -1)
			url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchStudentLoan?";
		else 
			url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchAllLoansData?loanType=studentLoan&";
        if(zip) {
			zip = zip.split(",").join("");
            url += "zipCode=" + zip + '&';
        }
        if(creditScore) {
			creditScore = creditScore.split(",").join("");
            url += "creditScore=" + creditScore + '&';
        }
		customFunc.httpRequest(url, "GET")
                  .then(function(res) {
        const parse = customFunc.customParse(res.data),
              personalInfo = [];
            parse.forEach((val) => {
                let newLoanObj = {},
                     refinanceObj = {};

                val.bankDetails.itemType.forEach((childVal) => {
                    if(childVal.type === "newLoan") {
                        
                        if(childVal.fixedAPR === true){
                            newLoanObj.fixedRateFrom = childVal.rateFrom ?? childVal.aprFrom;
                            newLoanObj.fixedRateTo = childVal.rateTo ?? childVal.aprTo;
                        } else {
                            newLoanObj.variablerateFrom = childVal.rateFrom ?? childVal.aprFrom;
                            newLoanObj.variablerateTo = childVal.rateTo ?? childVal.aprTo;
                        }
                        newLoanObj.minPeriod = (newLoanObj.minPeriod === undefined || newLoanObj.minPeriod === "") ? ((childVal.minPeriod === "" || childVal.minPeriod === undefined) ? (val.studentMinTerm ?? "") : childVal.minPeriod) : newLoanObj.minPeriod,
                        newLoanObj.maxPeriod = (newLoanObj.maxPeriod === undefined || newLoanObj.maxPeriod === "") ? ((childVal.maxPeriod === "" || childVal.maxPeriod === undefined) ? (val.studentMaxTerm ?? "") : childVal.maxPeriod) : newLoanObj.maxPeriod,
                        newLoanObj.maxPeriod = (newLoanObj.minPeriod !== newLoanObj.maxPeriod) ? newLoanObj.maxPeriod : "";
                        newLoanObj.urlLink = childVal.urlLink;
                        newLoanObj.type = childVal.type;
                    } else {
                        if(childVal.fixedAPR === true){
                            refinanceObj.fixedRateFrom = childVal.rateFrom ?? childVal.aprFrom;
                            refinanceObj.fixedRateTo = childVal.rateTo ?? childVal.aprTo;
                        } else {
                            refinanceObj.variablerateFrom = childVal.rateFrom ?? childVal.aprFrom;
                            refinanceObj.variablerateTo = childVal.rateTo ?? childVal.aprTo;
                        }
                        refinanceObj.minPeriod = (refinanceObj.minPeriod === undefined || refinanceObj.minPeriod === "") ? ((childVal.minPeriod === "" || childVal.minPeriod === undefined) ? (val.studentMinTerm ?? "") : childVal.minPeriod) :  refinanceObj.minPeriod,
                        refinanceObj.maxPeriod = (refinanceObj.maxPeriod === undefined || refinanceObj.maxPeriod === "") ? ((childVal.maxPeriod === "" || childVal.maxPeriod === undefined) ? (val.studentMaxTerm ?? "") : childVal.maxPeriod) : refinanceObj.maxPeriod,
                        refinanceObj.maxPeriod = (refinanceObj.minPeriod !== refinanceObj.maxPeriod) ? refinanceObj.maxPeriod : "";
                        refinanceObj.urlLink = childVal.urlLink;
                        refinanceObj.type = childVal.type;
                    }
                })

                if(!angular.equals(newLoanObj, {})) {

                    let fixedRateBetween = (newLoanObj.fixedRateTo !== "" && newLoanObj.fixedRateTo !== undefined)?" - ":"",
                        variableRateBetween = (newLoanObj.variablerateTo !== "" && newLoanObj.variablerateTo !== undefined)?" - ":"",
                        periodBetween = (newLoanObj.maxPeriod !== "" && newLoanObj.minPeriod !== newLoanObj.maxPeriod)?" - ":"";
                    personalInfo.push({
                        bankName: val.bankShortName??val.bankName,
                        bankUrl:val.bankUrl,

                        personalLoanUrl:newLoanObj.urlLink,
                        fixedrateFrom: newLoanObj.fixedRateFrom ? newLoanObj.fixedRateFrom: 0,
                        fixedrateRange: newLoanObj.fixedRateFrom + fixedRateBetween + newLoanObj.fixedRateTo,
                        variablerateFrom: newLoanObj.variablerateFrom ? newLoanObj.variablerateFrom: 0,
                        variablerateRange: customFunc.checkUndefined((newLoanObj.variablerateFrom ?? '') + variableRateBetween + (newLoanObj.variablerateTo ?? '')),
                        minPeriod: newLoanObj.minPeriod,
                        PeriodRange: customFunc.checkUndefined(newLoanObj.minPeriod + periodBetween + newLoanObj.maxPeriod),
                        type: newLoanObj.type,
                        bankId:val.bankID,
                        displayPriority:val.displayPriority,
						version:version,
                        lendmeshScore:val.lendmeshScore ?? 0,
                        allowBadCredit:val.allowBadCredit??false,
                        allowAverageCredit:val.allowAverageCredit??false,
                        allowGoodCredit:val.allowGoodCredit??false,
                        allowExcellentCredit:val.allowExcellentCredit??false,
                        joinDetails:val.joinDetails ?? '',
                        joinLinkUrl:val.joinLinkUrl ?? ''
                    });
                }
                if(!angular.equals(refinanceObj, {})) {

                    let fixedRateBetween = (refinanceObj.fixedRateTo !== "" && refinanceObj.fixedRateTo !== undefined)?" - ":"",
                        variableRateBetween = (refinanceObj.variablerateTo !== "" && refinanceObj.variablerateTo !== undefined)?" - ":"",
                        periodBetween = (refinanceObj.maxPeriod !== "" && refinanceObj.minPeriod !== refinanceObj.maxPeriod)?" - ":"";
                    personalInfo.push({
                        bankName: val.bankShortName??val.bankName,
                        bankUrl:val.bankUrl,

                        personalLoanUrl:refinanceObj.urlLink,
                        fixedrateFrom: refinanceObj.fixedRateFrom ? refinanceObj.fixedRateFrom: 0,
                        fixedrateRange: refinanceObj.fixedRateFrom + fixedRateBetween + refinanceObj.fixedRateTo,
                        variablerateFrom: refinanceObj.variablerateFrom ? refinanceObj.variablerateFrom: 0,
                        variablerateRange: customFunc.checkUndefined(refinanceObj.variablerateFrom + variableRateBetween + refinanceObj.variablerateTo),
                        minPeriod: refinanceObj.minPeriod,
                        PeriodRange: customFunc.checkUndefined(refinanceObj.minPeriod + periodBetween + refinanceObj.maxPeriod),
                        type: refinanceObj.type,
                        bankId:val.bankID,
                        displayPriority:val.displayPriority,
                        version:version,
                        lendmeshScore:val.lendmeshScore ?? 0,
                        allowBadCredit:val.allowBadCredit??false,
                        allowAverageCredit:val.allowAverageCredit??false,
                        allowGoodCredit:val.allowGoodCredit??false,
                        allowExcellentCredit:val.allowExcellentCredit??false,
                        joinDetails:val.joinDetails ?? '',
                        joinLinkUrl:val.joinLinkUrl ?? ''
                    });
                }
            })

            personalInfo.sort(function(a, b) {
                let x = a.displayPriority,
                    y = b.displayPriority;
                    if(x !== y){ 
                        return x - y;
                    } else {
                        return  a.fixedrateFrom - b.fixedrateFrom;
                    }
            });
            thisObj.maindata_source = personalInfo;
            thisObj.maindataLoan = personalInfo;
            thisObj.Showed = 1;
            //thisObj.Showed = "studentLoan";
        })
    }
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
                    return  (thisObj.sortObj[sortType])?a.fixedrateFrom - b.fixedrateFrom:b.fixedrateFrom - a.fixedrateFrom;
                });
                break;
            case 'variableApr':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.variablerateFrom - b.variablerateFrom:b.variablerateFrom - a.variablerateFrom;
                });
                break;
            case 'term':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.minPeriod - b.minPeriod:b.minPeriod - a.minPeriod;
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
    // customer filter 
    this.customFilter = function() {
        if(this.zip && getState(this.zip) == false) {
            return;
        }
        this.fetchData(this.zip, this.creditScore);
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
    this.moreDetail = function(event) {

        const currentTr = event.currentTarget.closest("tr"),
              nextTr = angular.element(currentTr).next(),
              nextTrDisplay = nextTr.css('display');
        let displayCss = (nextTrDisplay === "none") ? "table-row" : "none";  
        nextTr.css({'display': displayCss});
    }
}); 
