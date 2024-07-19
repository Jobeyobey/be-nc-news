const {
    convertTimestampToDate,
    createRef,
    formatComments,
} = require("../db/seeds/utils");
const {
    checkArticleExists,
    checkUsernameExists,
    checkCommentExists,
    checkTopicExists,
    countArticles,
    countComments,
} = require("../models/model-utils");
const db = require("../db/connection");
const { checkNums } = require("../controllers/controller-utils");

afterAll(() => {
    db.end();
});

describe("convertTimestampToDate", () => {
    test("returns a new object", () => {
        const timestamp = 1557572706232;
        const input = { created_at: timestamp };
        const result = convertTimestampToDate(input);
        expect(result).not.toBe(input);
        expect(result).toBeObject();
    });
    test("converts a created_at property to a date", () => {
        const timestamp = 1557572706232;
        const input = { created_at: timestamp };
        const result = convertTimestampToDate(input);
        expect(result.created_at).toBeDate();
        expect(result.created_at).toEqual(new Date(timestamp));
    });
    test("does not mutate the input", () => {
        const timestamp = 1557572706232;
        const input = { created_at: timestamp };
        convertTimestampToDate(input);
        const control = { created_at: timestamp };
        expect(input).toEqual(control);
    });
    test("ignores includes any other key-value-pairs in returned object", () => {
        const input = { created_at: 0, key1: true, key2: 1 };
        const result = convertTimestampToDate(input);
        expect(result.key1).toBe(true);
        expect(result.key2).toBe(1);
    });
    test("returns unchanged object if no created_at property", () => {
        const input = { key: "value" };
        const result = convertTimestampToDate(input);
        const expected = { key: "value" };
        expect(result).toEqual(expected);
    });
});

describe("createRef", () => {
    test("returns an empty object, when passed an empty array", () => {
        const input = [];
        const actual = createRef(input);
        const expected = {};
        expect(actual).toEqual(expected);
    });
    test("returns a reference object when passed an array with a single items", () => {
        const input = [{ title: "title1", article_id: 1, name: "name1" }];
        let actual = createRef(input, "title", "article_id");
        let expected = { title1: 1 };
        expect(actual).toEqual(expected);
        actual = createRef(input, "name", "title");
        expected = { name1: "title1" };
        expect(actual).toEqual(expected);
    });
    test("returns a reference object when passed an array with many items", () => {
        const input = [
            { title: "title1", article_id: 1 },
            { title: "title2", article_id: 2 },
            { title: "title3", article_id: 3 },
        ];
        const actual = createRef(input, "title", "article_id");
        const expected = { title1: 1, title2: 2, title3: 3 };
        expect(actual).toEqual(expected);
    });
    test("does not mutate the input", () => {
        const input = [{ title: "title1", article_id: 1 }];
        const control = [{ title: "title1", article_id: 1 }];
        createRef(input);
        expect(input).toEqual(control);
    });
});

describe("formatComments", () => {
    test("returns an empty array, if passed an empty array", () => {
        const comments = [];
        expect(formatComments(comments, {})).toEqual([]);
        expect(formatComments(comments, {})).not.toBe(comments);
    });
    test("converts created_by key to author", () => {
        const comments = [{ created_by: "ant" }, { created_by: "bee" }];
        const formattedComments = formatComments(comments, {});
        expect(formattedComments[0].author).toEqual("ant");
        expect(formattedComments[0].created_by).toBe(undefined);
        expect(formattedComments[1].author).toEqual("bee");
        expect(formattedComments[1].created_by).toBe(undefined);
    });
    test("replaces belongs_to value with appropriate id when passed a reference object", () => {
        const comments = [{ belongs_to: "title1" }, { belongs_to: "title2" }];
        const ref = { title1: 1, title2: 2 };
        const formattedComments = formatComments(comments, ref);
        expect(formattedComments[0].article_id).toBe(1);
        expect(formattedComments[1].article_id).toBe(2);
    });
    test("converts created_at timestamp to a date", () => {
        const timestamp = Date.now();
        const comments = [{ created_at: timestamp }];
        const formattedComments = formatComments(comments, {});
        expect(formattedComments[0].created_at).toEqual(new Date(timestamp));
    });
});

describe("checkTopicExists", () => {
    test("Returns true if topic exists", () => {
        return checkTopicExists("mitch").then((result) => {
            expect(result).toBe(true);
        });
    });
    test("Throws a 404 error if topic does not exist", () => {
        return checkTopicExists("forbidden-topics").catch((err) => {
            expect(err).toEqual({
                status: 404,
                msg: "topic not found",
            });
        });
    });
});

describe("checkArticleExists", () => {
    test("Returns true if article exists", () => {
        return checkArticleExists(1).then((result) => {
            expect(result).toBe(true);
        });
    });
    test("Throws a 404 error if article does not exist", () => {
        return checkArticleExists(9995).catch((err) => {
            expect(err).toEqual({
                status: 404,
                msg: "article id not found",
            });
        });
    });
});

describe("checkUsernameExists", () => {
    test("Returns true if username exists", () => {
        return checkUsernameExists("butter_bridge").then((result) => {
            expect(result).toBe(true);
        });
    });
    test("Throws a 404 error if username does not exist", () => {
        return checkUsernameExists("not-a-user").catch((err) => {
            expect(err).toEqual({
                status: 404,
                msg: "username not found",
            });
        });
    });
});

describe("checkCommentExists", () => {
    test("Returns true if comment exists", () => {
        return checkCommentExists(1).then((result) => {
            expect(result).toBe(true);
        });
    });
    test("Throws a 404 error if comment does not exist", () => {
        return checkCommentExists(897).catch((err) => {
            expect(err).toEqual({
                status: 404,
                msg: "comment not found",
            });
        });
    });
});

describe("checkNums", () => {
    test("Returns true if input is a number", () => {
        return checkNums([1, 2, 3]).then((result) => {
            expect(result).toBe(true);
        });
    });
    test("Returns a rejected promise if votes is not a number", () => {
        return checkNums([1, "one"]).catch((err) => {
            expect(err).toEqual({ status: 400, msg: '"one" is NaN' });
        });
    });
});

describe("countArticles", () => {
    test("returns count of all articles when not given a topic to filter by", () => {
        return countArticles().then((articleCount) => {
            expect(articleCount).toBe(13);
        });
    });
    test("returns correct count of articles when given a topic to filter by", () => {
        return countArticles("mitch").then((articleCount) => {
            expect(articleCount).toBe(12);
        });
    });
});

describe("countComments", () => {
    test("returns count of all comments of given article", () => {
        return countComments(1).then((commentCount) => {
            expect(commentCount).toBe(11);
        });
    });
});
