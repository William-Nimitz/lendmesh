app.controller('indexCtrl', function(customFunc) {

    const filename = "./assets/data/_categories.json";
    const thisObj = this;

    this.highlightedBlogs = [];

    customFunc.httpRequest(filename, "GET")
    .then(res => {
        res.data.categories.forEach(v => {
            let questions = v.questions.filter(vv => vv.highlight === true)
            questions = questions.map(vv => ({
                ...vv,
                shortName: v.shortName,
                folder: v.folder
            }))
            thisObj.highlightedBlogs.push(...questions);
        })
    })

    this.BlogDetail = function (shortblog, folder = 'popular-post') {

        let con = shortblog.question.replace(/&/g, "and")
            .replace(/\?/g, "")
            .replace(/\s/g, "-"),
            fi = shortblog.file.replace(/.json/g, ""),
            popular = (folder === 'popular-post') ? 'popular' : '';
        window.location.href = `./blog/blog-detail.html?category=${folder}&fi=${fi}&question=${con}&popular=${popular}`;
    }
})