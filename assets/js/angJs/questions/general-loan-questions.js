app.controller('generalLoanQuestionsCtrl', function (customFunc) {
    const thisObj = this,
            _base = "./assets/data/",
            _spec_file = "questions/general-loan-questions.json",
            _categories = "_categories.json";
            
    this.question = null;
    this.categories = []; // catogories
    this.questionContent = ""; // questions

    customFunc.httpRequest(`${_base}${_categories}`, "GET")
    .then(res => {
        thisObj.categories = res.data.categories;
        thisObj.popularPost = res.data.popular_post;
    });
    customFunc.httpRequest(`${_base}${_spec_file}`, "GET")
            .then(res => {
                thisObj.Meta_Description = res.data.Meta_Description;
                thisObj.Meta_Keywords = res.data.Meta_Keywords;
                thisObj.title = res.data.Meta_title;
                thisObj.canonical = window.location.href;
                thisObj.questionImg = res.data.img_url;
                thisObj.questionDate = res.data.date;

                const questionCon = res.data.content;
                let questionHtml = "";
                 questionCon.forEach((que, index) => {
                    questionHtml += `<p class="question-subject">${index + 1}. ${que.question}</p>`
                    
                    que.answers.forEach(ans => {
                        questionHtml += angular.isString(ans) ? `<p>${ans}</p>` : `${this.liWrap(ans)}`;
                    })
                })
                thisObj.questionContent = questionHtml;
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