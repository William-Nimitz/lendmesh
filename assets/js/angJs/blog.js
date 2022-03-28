app.controller('blogCtrl', function (customFunc) {
    // to bank information
    const paginationNumber = 9;
    const thisObj = this;
    const filename = "./assets/data/_categories.json"
    this.categories = [];
    this.TotalforFilter = [];
    this.paginationTotal = [];
    this.paginationView = [];
    this.totalPage = 0;
    this.currentPage = 1;
    this.popularPost = [];
    this.filterPost = '';
    customFunc.httpRequest(filename, "GET")
        .then(res => {

            thisObj.categories = res.data.categories;
            thisObj.popularPost = res.data.popular_post;
            res.data.categories.forEach(v => {
                const questions = v.questions.map(vv => ({
                    ...vv,
                    shortName: v.shortName,
                    folder: v.folder

                }))
                thisObj.TotalforFilter.push(...questions);
                thisObj.paginationTotal.push(...questions);
            })
            thisObj.paginationView = thisObj.paginationTotal.slice(0, paginationNumber);
            thisObj.totalPage = Math.ceil(thisObj.paginationTotal.length / paginationNumber);
        })

    // function section 
    this.BlogDetail = function (shortblog, folder = 'popular-post') {

        let con = shortblog.question.replace(/&/g, "and")
            .replace(/\?/g, "")
            .replace(/\s/g, "-"),
            fi = shortblog.file.replace(/.json/g, ""),
            popular = (folder === 'popular-post') ? 'popular' : '';
        window.location.href = `./blog/blog-detail.html?category=${folder}&fi=${fi}&question=${con}&popular=${popular}`;
    }

    this.filterPostFunc = function() {
        this.paginationTotal = this.TotalforFilter;
        this.paginationTotal = this.paginationTotal.filter(e => (e.question.search(this.filterPost) > -1));
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
