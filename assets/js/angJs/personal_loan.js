app.controller('personalLoanCtrl', function(customFunc, $window) {
    // to bank information
    const thisObj = this;
    const appWindow = angular.element($window);
	var dmd1 = new Date();
	//var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate()+""+Math.random();
	var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate();
    this.specBank = []; // for detail information(how to join)
    // sort manage 
    this.sortObj = {
        apr:false,
        term:true,
        maxLoanAmount:true,
        _name:true
    };
    this.selectedSort = 'apr'; // sort type
    // filter manage 
    this.loanAmountVal = ''; // Max loan amount
    this.creditScore = "700";
    // main data manage 
    this.maindata_source = []; // source information (for filter)
    this.maindataLoan = [];    // display information
    
    this.Showed = "personalLoan"; // show *personalLoan* type, false -> *consolidateLoan*
    appWindow.bind('resize', function () {
        thisObj.getDevice();
    });
    this.getDevice = function() {
        const ScreenWidth = $window.innerWidth;
        const expandTrs = $(".expand-wrap-mobileView");
        if(ScreenWidth >= 800) {
            expandTrs.css("display", "none");
        } else {
            expandTrs.css("display", "inline-block");
        }
    }
    this.fetchData = function(zip, creditScore, neededAmount) {
        //customFunc.httpRequest("https://us-east4-lendmesh.cloudfunctions.net/fetchPersonalLoanRates", "GET")
		console.log("hostname" + window.location.hostname);
		var url = "";
		var indexLendMesh = window.location.hostname.indexOf("lendmesh");
		if(indexLendMesh == -1)
			url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchPersonalLoan?";
		else 
			url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchAllLoansData?loanType=personalLoan&";
        if (zip) {
			zip = zip.split(",").join("");
            url += "zipCode=" + zip  + '&';
        }
        if (creditScore) {
			creditScore = creditScore.split(",").join("");
            url += "creditScore=" + creditScore + '&';
        }
        if (neededAmount) {
			neededAmount = neededAmount.split(",").join("");
            url += "neededAmount=" + neededAmount + '&';
        }
		customFunc.httpRequest(url, "GET")
                  .then(function(res) {
        const parse = customFunc.customParse(res.data),
              personalInfo = [];
            parse.forEach((val, index) => {
                let consolidatePerLoan = val.bankDetails.itemType.some((childVal) => {
                    return childVal.type === "consolidateLoan";
                })
                val.bankDetails.itemType.forEach((childVal) => {
                    let rateBetween = (childVal.rateTo !== "" && childVal.rateTo !== undefined)?" - ":"",
                        rateRange = (childVal.rateFrom == childVal.rateTo) ? childVal.rateFrom : childVal.rateFrom + rateBetween + (childVal.rateTo??''),
                        minPeriod = (childVal.minPeriod === "" || childVal.minPeriod === undefined) ? (val.personalMinTerm ?? "") : childVal.minPeriod,
                        maxPeriod = (childVal.maxPeriod === "" || childVal.maxPeriod === undefined) ? (val.personalMaxTerm ?? "") : childVal.maxPeriod,
                        periodBetween = (maxPeriod !== "" && minPeriod !== maxPeriod)?" - ":"";
                    maxPeriod = (minPeriod !== maxPeriod) ? maxPeriod : "";
					/*
					if (typeof(rateRange) === "undefined" && rateRange === null ) {
						rateRange = "undefined";
					}
					*/
					console.log(val.bankShortName)
                    console.log(val.rateRange)
                    personalInfo.push({
                        bankName: val.bankShortName??val.bankName,
                        bankShortName: val.bankShortName,
                        bankUrl:val.bankUrl,
                        personalLoanUrl:childVal.urlLink,
                        minPeriod:minPeriod,
                        PeriodRange: customFunc.checkUndefined(minPeriod + periodBetween + maxPeriod),
                        rateFrom:childVal.rateFrom,
                        rateRange: customFunc.checkUndefined(rateRange),
                        type:childVal.type,
                        bankId:val.bankID,
                        personalLoanMaxAmount: (childVal.maxAmount)?childVal.maxAmount:val.personalLoanMaxAmount,
                        lendmeshScore:val.lendmeshScore ?? 0,
                        // personalLoanMaxAmount:customFunc.UsNumberFormat.format(val.personalLoanMaxAmount??0),
                        displayPriority:val.displayPriority??1000,

                        allowBadCredit:val.allowBadCredit??false,
                        allowAverageCredit:val.allowAverageCredit??false,
                        allowGoodCredit:val.allowGoodCredit??false,
                        allowExcellentCredit:val.allowExcellentCredit??false,
                        joinDetails:val.joinDetails ?? '',
                        joinLinkUrl:val.joinLinkUrl ?? '',
						version:version,
                        consolidatePerLoan:!consolidatePerLoan && (val.consolidatePerLoan ?? false)
                    });
					console.log(personalInfo)
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
            thisObj.Showed = "personalLoan";
        })
		
		$(".set > a").on("click", function () {
			console.log("inside Angular");
			if ($(this).hasClass("active")) {
				$(this).removeClass("active");
				$(this)
					.siblings(".content")
					.slideUp(200);
				$(".set > a i")
					.removeClass("fa-minus")
					.addClass("fa-plus");
			} else {
				$(".set > a i")
					.removeClass("fa-minus")
					.addClass("fa-plus");
				$(this)
					.find("i")
					.removeClass("fa-plus")
					.addClass("fa-minus");
				$(".set > a").removeClass("active");
				$(this).addClass("active");
				$(".content").slideUp(200);
				$(this)
					.siblings(".content")
					.slideDown(200);
			}
		});
    }
	
    this.fetchData();
    // function section 
    this.make_loan_tab_active = function(type) {
        if(type == 'p-l-r'){
                document.getElementById("bar-tab").classList.remove("--is-active");
                document.getElementById("foo-tab").classList.add("--is-active");
                this.Showed = "personalLoan";
        } else if(type === 'p-p-l'){
            document.getElementById("foo-tab").classList.remove("--is-active");
            document.getElementById("bar-tab").classList.add("--is-active");
            this.Showed = "consolidateLoan";
        }
    }
    this.usNumber10 = function() {
        let midNum = customFunc.strToNum(this.loanAmountVal);
        this.loanAmountVal = customFunc.UsNumberFormat.format(midNum);
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
            case 'maxLoanAmount':
                this.maindataLoan.sort(function(a, b) {
                    let x = a.personalLoanMaxAmount,
                        y = b.personalLoanMaxAmount;
                    return  (thisObj.sortObj[sortType])?x - y:y - x;
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
    /* 
    this.customFilter = function() {
        this.maindataLoan = this.maindata_source;
        this.maindataLoan = this.maindataLoan.filter(e => e.personalLoanMaxAmount >= customFunc.strToNum(this.loanAmountVal));
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
		
    // customer filter 
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
