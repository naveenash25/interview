const cheerio = require('cheerio');
const needle = require('needle'); 

module.exports = async function (context, req) {
    const url = req.body && req.body.url;
    let response;
    try{
        response = await scrape(url)
    }
    catch(err){
        response = err
    } 
    context.res = response;
    function scrape(url){
        return new Promise((resolve, reject) => {
            needle.get(encodeURI(url), function(err, res) {
                if (err){
                    reject(err)
                }
                const $ = cheerio.load(res.body)
                const meta = $('meta')
                const keys = Object.keys(meta)
                let properties = {};
                keys.forEach((key) => {
                    if (  meta[key].attribs && meta[key].attribs.property
                    && meta[key].attribs.property.match(/og.*/)) {
                        let property =  meta[key].attribs.property.replace(/.*og:/,'')
                        properties[property] = meta[key].attribs.content;  // adding each property into response object
                    }
                })
                resolve(properties)
            });
        })
    }
}
