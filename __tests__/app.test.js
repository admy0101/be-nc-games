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
        expect(body.review).toMatchObject({
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

describe("GET /api/reviews", () => {
  test("status code : 200 and responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            owner: expect.any(String),
            designer: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: responds with a not found message when given an incorrect route", () => {
    return request(app)
      .get("/api/notAValidPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET/api/reviews/:review_id/comments", () => {
  test("status code 200 : responds with an array of comments for the given review_id", () => {
    const review_id = 3;
    return request(app)
      .get(`/api/reviews/${review_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: 3,
            created_at: expect.any(String),
          });
        });
      });
  });

  test("404: responds with a message if it's a valid number but no review with that id", () => {
    return request(app)
      .get("/api/reviews/99999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Number not found");
      });
  });
  test("400: responds with a bad request when another data type is provided", () => {
    return request(app)
      .get("/api/reviews/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("200: found the review but there are no comments to show so returns an empty array", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("request body accepts an object with username and body and responds with the posted comment", () => {
    const review_id = 1;
    const newPost = {
      username: "mallionaire",
      body: "Slightly more fun than watching paint dry",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newPost)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 7,
          body: "Slightly more fun than watching paint dry",
          author: "mallionaire",
          review_id: 1,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("400, responds with a bad request when body does not contain both mandatory keys", () => {
    const review_id = 1;
    const newPost = {
      body: "Slightly more fun than watching paint dry",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("404, valid number in path but review_id doesn't exist", () => {
    const newPost = {
      username: "mallionaire",
      body: "Slightly more fun than watching paint dry",
    };
    return request(app)
      .post(`/api/reviews/999999/comments`)
      .send(newPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Number not found");
      });
  });
  test("404, a user not in the database tries to post", () => {
    const review_id = 1;
    const newPost = {
      username: "jasperpickett",
      body: "Absolutely loved it!",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
  test("400: responds with a bad request when another data type is provided", () => {
    const newPost = {
      username: "mallionaire",
      body: "Slightly more fun than watching paint dry",
    };
    return request(app)
      .post(`/api/reviews/not-an-id/comments`)
      .send(newPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/reviews (queries)", () => {
  test("200, sorts the reviews by default to date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200, sort the reviews by any valid column", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("designer", { descending: true });
      });
  });
  test("400, when user enters non valid sort query", () => {
    return request(app)
      .get("/api/reviews?sort_by=not-a-valid-sort-query")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query");
      });
  });
  test("200, sort the reviews by ascending order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("400, when user enters non valid order_by query", () => {
    return request(app)
      .get("/api/reviews?order=not-a-valid-sort-query")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
  test("200, filters results by category", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(11);
      });
  });
  test("404, user tries to enter a non-existent category", () => {
    return request(app)
      .get("/api/reviews?category=thinking")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Category doesn't exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204, deletes the given comment by comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: comment_id in path doesn't exist", () => {
    return request(app)
      .delete("/api/comments/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Number not found");
      });
  });
  test("400: responds with a bad request when another data type is provided", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET/api", () => {
  test("200, returns JSON object with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((body) => {
        expect(JSON.parse(body.res.text)).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/categories": {
            description: "serves an array of all categories",
            queries: [],
            exampleResponse: {
              categories: [
                {
                  description:
                    "Players attempt to uncover each other's hidden role",
                  slug: "Social deduction",
                },
              ],
            },
          },
          "GET /api/reviews": {
            description: "serves an array of all reviews",
            queries: ["category", "sort_by", "order"],
            exampleResponse: {
              reviews: [
                {
                  title: "One Night Ultimate Werewolf",
                  designer: "Akihisa Okui",
                  owner: "happyamy2016",
                  review_img_url:
                    "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  category: "hidden-roles",
                  created_at: 1610964101251,
                  votes: 5,
                },
              ],
            },
          },
          "GET /api/users": {
            description: "serves an array of all users",
            queries: [],
            exampleResponse: {
              users: [
                {
                  username: "tickle122",
                  name: "Tom Tickle",
                  avatar_url:
                    "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
                },
              ],
            },
          },
          "GET /api/reviews/:review_id": {
            description: "serves review by individual review id",
            queries: ["review_id"],
            exampleReponse: {
              review: {
                review_id: 3,
                title: "Karma Karma Chameleon",
                category: "hidden-roles",
                designer: "Rikki Tahta",
                owner: "happyamy2016",
                review_body:
                  "Try to trick your friends. If you find yourself being dealt the Chamelean card then the aim of the game is simple; blend in... Meanwhile the other players aim to be as vague as they can to not give the game away ",
                review_img_url:
                  "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                created_at: "2021-01-18T10:01:42.151Z",
                votes: 5,
                comment_count: 5,
              },
            },
          },
          "PATCH /api/reviews/:review_id": {
            description: "serves an a review with the votes updated",
            queries: ["review_id", "votes"],
            exampleResponse: {
              review: {
                review_id: 3,
                title: "Karma Karma Chameleon",
                category: "hidden-roles",
                designer: "Rikki Tahta",
                owner: "happyamy2016",
                review_body:
                  "Try to trick your friends. If you find yourself being dealt the Chamelean card then the aim of the game is simple; blend in... Meanwhile the other players aim to be as vague as they can to not give the game away ",
                review_img_url:
                  "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                created_at: "2021-01-18T10:01:42.151Z",
                votes: 8,
                comment_count: 5,
              },
            },
          },
          "GET /api/reviews/:review_id/comments": {
            description: "serves an array of comments for the given review_id",
            queries: ["review_id"],
            exampleResponse: {
              comments: {
                comment_id: 19,
                body: "Quis duis mollit ad enim deserunt.",
                review_id: 3,
                author: "jessjelly",
                votes: 3,
                created_at: "2021-03-27T19:48:58.110Z",
              },
            },
          },
          "POST /api/reviews/:reviews_id/comments": {
            description: "posts a comment for the given review_id",
          },
          "DELETE /api/comments/:comment_id": {
            description: "deletes the given comment by comment_id",
          },
        });
      });
  });
});
