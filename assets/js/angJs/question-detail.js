app.controller('questionDetailCtrl', function (customFunc) {
    const thisObj = this,
            _base = "./assets/data/questions/",
            _questions = "_questions.json";
            
    this.Totalquestions = [];
    this.TotalforFilter = []; // 
    this.Meta_Description = "";
    this.Meta_Keywords = "";
    this.title = "";
    this.canonical = "";
    this.questionImg = "";
    this.questionDate = "";
    this.questionContent = ""; // 
    this.specFile = window.location.search.replace(/\?/, '').split('&')[0].split('=')[1] + '.json';

    customFunc.httpRequest(`${_base}${_questions}`, "GET")
    .then(res => {
        console.log(res);
        thisObj.Totalquestions = res.data.questions;
        thisObj.TotalforFilter = res.data.questions;

        thisObj.canonical = window.location.href;
        const questionCon = res.data.questions.find(e => e.file === this.specFile);
        thisObj.questionImg = questionCon.imgUrl;
        thisObj.questionDate = questionCon.date;
    })

    customFunc.httpRequest(`${_base}${this.specFile}`, "GET")
            .then(res => {
                thisObj.Meta_Description = res.data.Meta_Description;
                thisObj.Meta_Keywords = res.data.Meta_Keywords;
                thisObj.title = res.data.Meta_title;

                const questionCon = res.data.content;
                let questionHtml = "";
                 questionCon.forEach((que, index) => {
                    questionHtml += (questionCon.length > 1) ? `<p class="question-subject">${index + 1}. ${que.question}</p>` : '';
                    
                    que.answers.forEach(ans => {
                        questionHtml += angular.isString(ans) ? `<p>${ans}</p>` : `${this.liWrap(ans)}`;
                    })
                })
                thisObj.questionContent = questionHtml;
    })
    this.filterPostFunc = function() {
        this.Totalquestions = this.TotalforFilter.filter(e => (e.question.toLowerCase().search(this.filterPost) > -1 || e.shortName.toLowerCase().search(this.filterPost) > -1));
    }
    // function section 
    this.questionDetail = function (que, file = '') {

        let con = que.replace(/&/g, "and")
            .replace(/\?/g, "")
            .replace(/\s/g, "-").toLowerCase(),
            fi = file.replace(/.json/g, "");
        window.location.href = `./questions/question-detail.html?fi=${fi}&question=${con}`;
    }

    // function section 
    this.liWrap = function (con) {
        return angular.isString(con) ?
            `<p>${con}</p>`
            :
            `<p>${con.sub}</p>
                <ul>
                    ${con.subcontent.reduce((prev, curr, index) => (index === 1) ? `<li>${this.liWrap(prev)}</li><li>${this.liWrap(curr)}</li>` : `${this.liWrap(prev)}<li>${this.liWrap(curr)}</li>`)}
                </ul>`;
    }
}); 