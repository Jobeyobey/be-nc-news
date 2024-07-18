exports.checkNums = (input) => {
    for (let i = 0; i < input.length; i++) {
        if (input[i] && isNaN(input[i])) {
            return Promise.reject({ status: 400, msg: `"${input[i]}" is NaN` });
        }
    }
    return Promise.resolve(true);
};
