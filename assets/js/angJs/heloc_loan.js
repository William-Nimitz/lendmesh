app.controller('HelocLoanCtrl', function (customFunc, $window) {
    // to bank information
    const thisObj = this;
    const appWindow = angular.element($window);
    var dmd1 = new Date();
    //var version=dmd1.getFullYear()+""+(dmd1.getMonth()+1)+""+dmd1.getDate()+""+Math.random();
    var version = dmd1.getFullYear() + "" + (dmd1.getMonth() + 1) + "" + dmd1.getDate();
    this.specBank = []; // for detail information(how to join)
    // sort manage 
    this.sortObj = {
        rate: false,
        term: true,
        maxLoanAmount: true,
        ltv: true,
        _name: true
    };
    this.selectedSort = 'rate'; // sort type
    // filter manage 
    this.loanAmountVal = ''; // Max loan amount
    this.creditScore = "700";
    // main data manage 
    this.maindata_source = []; // source information (for filter)
    this.maindataLoan = [];    // display information
    this.Showed = "helocLoan"; // show *helocLoan* type, false -> *homeEquity*
    this.detail = {};
    appWindow.bind('resize', function () {
        thisObj.getDevice();
    });
    this.getDevice = function () {
        const ScreenWidth = $window.innerWidth;
        const expandTrs = $(".expand-wrap-mobileView");
        if (ScreenWidth > 850) {
            expandTrs.css("display", "none");
        } else {
            expandTrs.css("display", "inline-block");
        }
    }
    this.fetchData = function (zip = 96720, creditScore, neededAmount) {
        //customFunc.httpRequest("https://us-east4-lendmesh.cloudfunctions.net/fetchPersonalLoanRates", "GET")
        var url = "";
        var indexLendMesh = window.location.hostname.indexOf("lendmesh");
        if (indexLendMesh == -1)
            url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchHelocLoan?";
        else
            url = "https://us-central1-lendmesh.cloudfunctions.net/realTimeFetchHelocLoan?";
        if (zip) {
            // zip = zip.split(",").join("");
            url += "zipCode=" + zip + '&';
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
            .then(function (res) {
                const parse = customFunc.customParse(res.data),
                    helocInfo = [];
                parse.forEach((val, index) => {
                    let bankItems = {};
                    val.bankDetails.itemType.forEach((childVal, childIndex) => {
                        let rateBetween = (childVal.rateFrom !== "" && childVal.rateTo !== "" && childVal.rateTo !== undefined) ? " - " : "",
                            rateRange = (childVal.rateFrom == childVal.rateTo) ? childVal.rateFrom : childVal.rateFrom + rateBetween + (childVal.rateTo ?? ''),
                            minPeriod = (childVal.minPeriod === "" || childVal.minPeriod === undefined) ? (val.personalMinTerm ?? "") : childVal.minPeriod,
                            maxPeriod = (childVal.maxPeriod === "" || childVal.maxPeriod === undefined) ? (val.personalMaxTerm ?? "") : childVal.maxPeriod,
                            periodBetween = (maxPeriod !== "" && minPeriod !== maxPeriod) ? " - " : "",
                            ltvBetween = (childVal.ltvFrom !== "" && childVal.ltvTo !== "" && childVal.ltvTo !== undefined) ? " - " : "",
                            ltvRange = (childVal.ltvFrom == childVal.ltvTo) ? childVal.ltvFrom : childVal.ltvFrom + ltvBetween + (childVal.ltvTo ?? '');
                        maxPeriod = (minPeriod !== maxPeriod) ? maxPeriod : "";

                        const helocEle = {
                            bankName: val.bankShortName ?? val.bankName,
                            bankShortName: val.bankShortName,
                            uniqueKey: val.bankShortName + '_' + index + '_' + childIndex,
                            bankUrl: val.bankUrl,
                            helocLoanUrl: childVal.urlLink,
                            minPeriod: minPeriod,
                            PeriodRange: customFunc.checkUndefined(minPeriod + periodBetween + maxPeriod),
                            rateFrom: childVal.rateFrom,
                            rateRange: customFunc.checkUndefined(rateRange),
                            ltvFrom: childVal.ltvFrom,
                            ltvRange: customFunc.checkUndefined(ltvRange),
                            type: childVal.type,
                            bankId: val.bankID,
                            helocLoanMaxAmount: (childVal.maxAmount) ? childVal.maxAmount : val.helocLoanMaxAmount,
                            lendmeshScore: val.lendmeshScore ?? 0,
                            displayPriority: val.displayPriority ?? 1000,
                            description: childVal.description,
                            allowBadCredit: val.allowBadCredit ?? false,
                            allowAverageCredit: val.allowAverageCredit ?? false,
                            allowGoodCredit: val.allowGoodCredit ?? false,
                            allowExcellentCredit: val.allowExcellentCredit ?? false,
                            joinDetails: val.joinDetails ?? '',
                            joinLinkUrl: val.joinLinkUrl ?? '',
                            version: version,
                            defaultStatus: childVal.default,
                            childs: []
                        };
                        if (childVal.default === true) {
                            bankItems = helocEle;
                        } else {
                            bankItems.childs.push(helocEle);
                        }
                    })
                    helocInfo.push(bankItems);
                })
                helocInfo.sort(function (a, b) {
                    let x = a.displayPriority,
                        y = b.displayPriority;
                    if (x !== y) {
                        return x - y;
                    } else {
                        return a.rateFrom - b.rateFrom;
                    }
                });
                thisObj.maindata_source = helocInfo;
                thisObj.maindataLoan = helocInfo;
                thisObj.Showed = "helocLoan";
                console.log(helocInfo)
            })

        $(".set > a").on("click", function () {
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
    this.make_loan_tab_active = function (type) {
        if (type == 'p-l-r') {
            document.getElementById("bar-tab").classList.remove("--is-active");
            document.getElementById("foo-tab").classList.add("--is-active");
            this.Showed = "helocLoan";
        } else if (type === 'p-p-l') {
            document.getElementById("foo-tab").classList.remove("--is-active");
            document.getElementById("bar-tab").classList.add("--is-active");
            this.Showed = "homeEquity";
        }
    }
    this.usNumber10 = function () {
        let midNum = customFunc.strToNum(this.loanAmountVal);
        this.loanAmountVal = customFunc.UsNumberFormat.format(midNum);
    }
    this.customSort = function (sortType) {

        switch (sortType) {
            case 'rate':
                this.maindataLoan.sort(function (a, b) {
                    return (thisObj.sortObj[sortType]) ? a.rateFrom - b.rateFrom : b.rateFrom - a.rateFrom;
                });
                break;
            case 'term':
                this.maindataLoan.sort(function (a, b) {
                    return (thisObj.sortObj[sortType]) ? a.minPeriod - b.minPeriod : b.minPeriod - a.minPeriod;
                });
                break;
            case 'maxLoanAmount':
                this.maindataLoan.sort(function (a, b) {
                    let x = a.helocLoanMaxAmount,
                        y = b.helocLoanMaxAmount;
                    return (thisObj.sortObj[sortType]) ? x - y : y - x;
                });
                break;
            case 'ltv':
                this.maindataLoan.sort(function (a, b) {
                    return (thisObj.sortObj[sortType]) ? a.ltvRange - b.ltvRange : b.ltvRange - a.ltvRange;
                });
                break;
            case '_name':
                this.maindataLoan.sort(function (a, b) {
                    if (thisObj.sortObj[sortType]) {
                        if (a.bankName < b.bankName) { return 1; }
                        if (a.bankName > b.bankName) { return -1; }
                        return 0;
                    } else {
                        if (a.bankName < b.bankName) { return -1; }
                        if (a.bankName > b.bankName) { return 1; }
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
        this.maindataLoan = this.maindataLoan.filter(e => e.helocLoanMaxAmount >= customFunc.strToNum(this.loanAmountVal));
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
    this.customFilter = function () {
        if (this.zip && getState(this.zip) == false) {
            return;
        }
        this.fetchData(this.zip, this.creditScore, this.loanAmountVal);
    }

    this.moreDetail = function (uniqueKey) {
        const _detail = this.detail
        this.detail = {
            ..._detail,
            [uniqueKey]: !this.detail?.[uniqueKey]
        }
        // this.detail = !
        // const currentTbody = event.currentTarget.closest("tbody"),
        //     Trs = angular.element(currentTbody).children(),
        //     nextTrDisplay = Trs[2].style.display;
        // let displayCss = (nextTrDisplay === "none") ? "table-row" : "none";

        // for (let i = 2; i < Trs.length; i++) {
        //     const ele = Trs[i];
        //     ele.style.display = displayCss;
        // }
    }
}); 
