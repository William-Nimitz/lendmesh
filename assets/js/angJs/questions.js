app.controller('QuestionsCtrl', function (customFunc) {
    // to bank information
    const paginationNumber = 9;
    const thisObj = this;
    const filename = "./assets/data/questions/_questions.json"
    this.questions = [];
    this.TotalforFilter = [];
    this.paginationTotal = [];
    this.paginationView = [];
    this.totalPage = 0;
    this.currentPage = 1;
    this.filterPost = '';
    customFunc.httpRequest(filename, "GET")
        .then(res => {
            thisObj.paginationTotal = res.data.questions;
            thisObj.TotalforFilter = res.data.questions;
            thisObj.paginationView = thisObj.paginationTotal.slice(0, paginationNumber);
            thisObj.totalPage = Math.ceil(thisObj.paginationTotal.length / paginationNumber);
        })

    // function section 
    this.questionDetail = function (que, file = '') {

        let con = que.replace(/&/g, "and")
            .replace(/\?/g, "")
            .replace(/\s/g, "-").toLowerCase(),
            fi = file.replace(/.json/g, "");
        window.location.href = `./questions/question-detail.html?fi=${fi}&question=${con}`;
    }

    this.filterPostFunc = function() {
        this.paginationTotal = this.TotalforFilter;
        this.paginationTotal = this.paginationTotal.filter(e => (e.question.toLowerCase().search(this.filterPost) > -1 || e.shortName.toLowerCase().search(this.filterPost) > -1));
        this.paginationView = this.paginationTotal.slice(0, paginationNumber);
        this.totalPage = Math.ceil(this.paginationTotal.length / paginationNumber);
    }
    // pagination section
    this.current = function () {
        this.currentPage = (this.currentPage >= this.totalPage) ? this.totalPage : this.currentPage;
        this.currentPage = (this.currentPage <= 0) ? 1 : this.currentPage;

        thisObj.paginationView = this.paginationTotal.slice((this.currentPage - 1) * paginationNumber, this.currentPage * paginationNumber);
    }
    this.prev = function () {
        this.currentPage = (this.currentPage <= 1) ? 1 : this.currentPage - 1;

        thisObj.paginationView = this.paginationTotal.slice((this.currentPage - 1) * paginationNumber, this.currentPage * paginationNumber);
    }
    this.next = function () {
        this.currentPage = (this.currentPage >= this.totalPage) ? this.totalPage : this.currentPage + 1;

        thisObj.paginationView = this.paginationTotal.slice((this.currentPage - 1) * paginationNumber, this.currentPage * paginationNumber);
    }
    this.firstPage = function () {
        this.currentPage = 1;

        thisObj.paginationView = this.paginationTotal.slice((this.currentPage - 1) * paginationNumber, this.currentPage * paginationNumber);
    }
    this.lastPage = function () {
        this.currentPage = this.totalPage;

        thisObj.paginationView = this.paginationTotal.slice((this.currentPage - 1) * paginationNumber, this.currentPage * paginationNumber);
    }
}); 
