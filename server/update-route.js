'use strict';
const fs = require('fs');
let modificationTime = 0;

function getBannerModificationTime() {
    return new Promise(
        (resolve, reject) => fs.stat('./dist/banner.html', (err, stats) => err ? reject(err) : resolve(stats.mtime))
    );
}

getBannerModificationTime().then(time => {
    modificationTime = time;
});

module.exports = function(req, res) {
    getBannerModificationTime().then(
        time => res.json(time.getTime()),
        error => {
            console.error(error);
            res.json(0);
        }
    );
};
