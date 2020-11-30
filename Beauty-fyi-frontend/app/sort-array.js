const arraySort = require('array-sort');
exports.sortArray = function(array, comparisonArgs, reverse) {
    console.log(1)
    return new Promise((resolve, reject) => {
        try {
            console.log(2)
            const result = arraySort(array, comparisonArgs, {reverse: reverse})
            console.log(3)
            //console.log(result);
            resolve(result);
        } catch (error) {
            console.log(5)
            reject(error);
        }
    });
}