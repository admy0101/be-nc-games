const data = require("../db/data/test-data/index.js");

const seed = require("../db/seeds/seed");

const request = require("supertest");

const app = require("../app");

const db = require("../db/connection.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/categories", () => {
  test("status code 200, responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: responds with a not found message when given an incorrect route", () => {
    return request(app)
      .get("/api/categoriess")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status 200, should respond with object containing: review_id, title, review_body, designer,review_img_url, votes, category, owner, created at", () => {
    const reviewId = 1;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: reviewId,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: new Date(1610964020514).toISOString(),
          votes: 1,
        });
      });
  });
  test("404: responds with a message if it's a valid number but no review with that id", () => {
    return request(app)
      .get("/api/reviews/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Number not found");
      });
  });
  test("400: responds with a bad request when another data type is provided", () => {
    return request(app)
      .get("/api/reviews/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("status code 200, responds with review with number of votes updated", () => {
    const increaseVotes = { inc_votes: 15 };
    return request(app)
      .patch("/api/reviews/1")
      .send(increaseVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: new Date(1610964020514).toISOString(),
          votes: 16,
        });
      });
  });
  test("404, valid number in path but doesn't match a review", () => {
    const increaseVotes = { inc_votes: 15 };
    return request(app)
      .patch("/api/reviews/9999999")
      .send(increaseVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Number not found");
      });
  });
  test("400: responds with an invalid input when another data type is provided", () => {
    const increaseVotes = { inc_votes: 15 };
    return request(app)
      .patch("/api/reviews/notAnId")
      .send(increaseVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400 : responds with a bad request when a user passes something not a number in inc_votes", () => {
    const wrongDataVotes = { inc_votes: true };
    return request(app)
      .patch("/api/reviews/1")
      .send(wrongDataVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/users", () => {
  test("status code 200 : returns an array of objects, with properties username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: responds with a not found message when given an incorrect route", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/reviews/:review_id(comment count)", () => {
  test("status code 200, responds with a review object that also includes comment count", () => {
    const reviewId = 2;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: reviewId,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: new Date(1610964101251).toISOString(),
          votes: 5,
          comment_count: 3,
        });
      });
  });
});
