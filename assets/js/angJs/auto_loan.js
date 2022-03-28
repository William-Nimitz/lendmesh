app.controller('autoLoanCtrl', function(customFunc) {
    // to bank information
    const thisObj = this;
	var dmd1 = new Date();
	//var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate()+""+Math.random();
	var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate();

    this.specBank = []; // for detail information(how to join)
    // sort manage 
    this.sortObj = {
        apr:false,
        term:true,
        _name:true
    };
    this.selectedSort = 'apr'; // sort type
    // filter manage 
    this.creditScore = "700";
    // main data manage 
    this.maindata_source = []; // source information (for filter)
    this.maindataLoan = [];    // display information
    this.Showed = 1; // // show *new* type, false -> *used*
    //this.Showed = "autoLoan"; // // show *new* type, false -> *used*

    this.fetchData = function(zip, creditScore){
        let url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchAutoLoan?";
        if(zip) {
			zip = zip.split(",").join("");
            url += "zipCode=" + zip  + '&';
        }
        if(creditScore) {
            creditScore = creditScore.split(",").join("");
            url += "creditScore=" + creditScore  + '&';
        }
    
        //customFunc.httpRequest("https://us-east4-lendmesh.cloudfunctions.net/fetchAutoLoanRates", "GET")
		customFunc.httpRequest(url, "GET")
                  .then(function(res) {
        const parse = customFunc.customParse(res.data),
              personalInfo = [];
            parse.forEach((val) => {
                val.bankDetails.itemType.forEach((childVal) => {
                    let rateBetween = (childVal.rateTo !== "" && childVal.rateTo !== undefined)?" - ":"",
                        minPeriod = (childVal.minPeriod === "" || childVal.minPeriod === undefined) ? (val.autoMinTerm ?? "") : childVal.minPeriod,
                        maxPeriod = (childVal.maxPeriod === "" || childVal.maxPeriod === undefined) ? (val.autoMaxTerm ?? "") : childVal.maxPeriod,
                        periodBetween = (maxPeriod !== "" && minPeriod !== maxPeriod)?" - ":"";
                    maxPeriod = (minPeriod !== maxPeriod) ? maxPeriod : "";
                    personalInfo.push({
                        bankName: val.bankShortName??val.bankName,
                        bankUrl:val.bankUrl,
                        personalLoanUrl:childVal.urlLink,
                        minPeriod: minPeriod,
                        PeriodRange: checkUndefined(minPeriod + periodBetween + maxPeriod),
                        rateFrom:childVal.rateFrom,
                        rateRange: checkUndefined(childVal.rateFrom + rateBetween + (childVal.rateTo??'')),
                        type:childVal.type,
                        bankId:val.bankID,
                        // personalLoanMaxAmount: (childVal.maxAmount !== '')?childVal.maxAmount:val.personalLoanMaxAmount,
                        lendmeshScore:val.lendmeshScore ?? 0,
                        displayPriority:val.displayPriority??1000,
						version:version,
                        allowBadCredit:val.allowBadCredit??false,
                        allowAverageCredit:val.allowAverageCredit??false,
                        allowGoodCredit:val.allowGoodCredit??false,
                        allowExcellentCredit:val.allowExcellentCredit??false,
                        joinDetails:val.joinDetails ?? '',
                        joinLinkUrl:val.joinLinkUrl ?? ''
                    });
                })
            })
            personalInfo.sort(function(a, b) {
                let x = a.displayPriority,
                    y = b.displayPriority;
                    if(x !== y){ 
                        return x - y;
                    } else {
                        return  a.rateFrom - b.rateFrom;
                    }
            });
            thisObj.maindata_source = personalInfo;
            thisObj.maindataLoan = personalInfo;
            //thisObj.Showed = "autoLoan";
            thisObj.Showed = 1;
        })
    };
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
            case 'apr':
                this.maindataLoan.sort(function(a, b) {
                    return  (thisObj.sortObj[sortType])?a.rateFrom - b.rateFrom:b.rateFrom - a.rateFrom;
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
        this.fetchData(this.zip, this.creditScore)
        this.maindataLoan = this.maindata_source;
        // this.maindataLoan = this.maindataLoan.filter(e => e.personalLoanMaxAmount >= customFunc.strToNum(this.loanAmountVal));
        /*
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
        */
    }
	
	 function checkUndefined(value) {
		//console.log (value)
		let result = value.indexOf("undefined");
		//console.log (result)
		if(result >= 0) {
            return "";
        } else {
			return value;	
		}
		
    }
    this.moreDetail = function(event) {

        const currentTr = event.currentTarget.closest("tr"),
                nextTr = angular.element(currentTr).next(),
                nextTrDisplay = nextTr.css('display');
        let displayCss = (nextTrDisplay === "none") ? "table-row" : "none";  
        nextTr.css({'display': displayCss});
    }
}); 
