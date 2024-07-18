exports.checkVotesIsNum = (inc_votes) => {
    if (inc_votes && isNaN(inc_votes)) {
        return Promise.reject({ status: 400, msg: "inc_votes is NaN" });
    } else {
        return Promise.resolve(true);
    }
};
