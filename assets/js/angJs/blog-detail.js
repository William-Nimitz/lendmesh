app.controller('blogDetailCtrl', function (customFunc) {
    const thisObj = this,
        paramsObject = {},
        _base = "./assets/data/",
        _categories = "_categories.json";

    this.categories = []; // catogories
    this.canonical = '';
    this.question = null;
    this.questionContent = "";
    this.questionImg = "";
    this.questionDate = "";
    this.popularPost = [];

    window.location.search.replace(/\?/, '')
        .split('&')
        .forEach(params => paramsObject[params.split('=')[0]] = params.split('=')[1]);

    const fileName = `${paramsObject.fi}.json`,
          destination = `${paramsObject.category}/${fileName}`;
    customFunc.httpRequest(`${_base}${_categories}`, "GET")
        .then(res => {
            thisObj.categories = res.data.categories;
            thisObj.popularPost = res.data.popular_post;
            thisObj.canonical = window.location.href;
            if (paramsObject.popular === 'popular') {
                const blog = res.data.popular_post.find(v => v.file === fileName);
                    thisObj.questionImg = blog.imgUrl;
                    thisObj.questionDate = blog.date;
            } else {
                const folder = thisObj.categories.find(v => v.folder === paramsObject.category),
                    blog = folder.questions.find(v => v.file === fileName);
                thisObj.questionImg = blog.imgUrl;
                thisObj.questionDate = blog.date;
            }
        });
    customFunc.httpRequest(`${_base}${destination}`, "GET")
        .then(response => response.data)
        .then(data => {

            thisObj.question = data;
            const questionCon = thisObj.question.content;
            let questionHtml = "";
            questionCon.forEach(line => {

                questionHtml += angular.isString(line) ?
                    `<p>${line}</p>`
                    :
                    `<p>${line.sub}</p>
                                <ol>
                                    ${line.subcontent.reduce((prev, curr, index) => (index === 1) ? `<li>${this.liWrap(prev)}</li><li>${this.liWrap(curr)}</li>` : `${this.liWrap(prev)}<li>${this.liWrap(curr)}</li>`)}
                                </ol>`;
            })
            thisObj.questionContent = questionHtml;
        });
    // });

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