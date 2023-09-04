const app = require('../server.js');
const supertest = require('supertest');
const connectDatabase = require('../helpers/database/connectDatabase.js');
const User = require('../models/User.js');
const dummyQuestions = require('../dummy/questions.json');
const Answer = require('../models/Answer.js');
const Question = require('../models/Question.js');

// describe('API Register - End point /api/auth/register', () => {
//   try {
//     beforeAll(async () => {
//       // Ensure the database is connected before running tests
//       await connectDatabase();
//       return;
//     });

//     it(' Should register user successfully', async () => {
//       const timestamp = Date.now().toString();
//       const data = {
//         name: timestamp,
//         email: `${timestamp}@gmail.com`,
//         password: '123456',
//       };

//       await supertest(app)
//         .post('/api/auth/register')
//         .send(data)
//         .expect(201)
//         .then((res) => {
//           expect(!res.body.access_token).toBe(false);
//           expect(res.body.data.user).toEqual(data.name);
//           expect(res.body.data.email).toEqual(data.email);
//           return;
//         });
//     });

//     it(' Should not register user with already registered email.', async () => {
//       const timestamp = Date.now().toString();
//       const data = {
//         name: timestamp,
//         email: `${timestamp}@gmail.com`,
//         password: '123456',
//       };
//       await supertest(app).post('/api/auth/register').send(data).expect(201);

//       await supertest(app)
//         .post('/api/auth/register')
//         .send(data)
//         .expect(400)
//         .then((res) => {
//           expect(res.body.success).toBe(false);
//           return;
//         });
//     });
//     it(' Should not register user with missing infos.', async () => {
//       const timestamp = Date.now().toString();
//       const data = [
//         {
//           email: `${timestamp}@gmail.com`,
//           password: '123456',
//         },
//         {
//           name: timestamp,
//           password: '123456',
//         },
//         {
//           name: timestamp,
//           email: `${timestamp}@gmail.com`,
//         },
//       ];
//       const request = supertest(app).post('/api/auth/register');

//       await request.send(data[0]).expect(400);
//       await request.send(data[1]).expect(400);
//       await request.send(data[2]).expect(400);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });

// describe('API Register - End point /api/auth/login - /logout - / resetpassword - /forgotpassword- /profile', () => {
//   const request = supertest(app);
//   const timestamp = Date.now().toString();
//   const data = {
//     name: timestamp,
//     email: `${timestamp}@gmail.com`,
//     password: '123456',
//   };
//   try {
//     beforeAll(async () => {
//       // Ensure the database is connected before running tests
//       await connectDatabase();
//       await request.post('/api/auth/register').send(data).expect(201);
//     });

//     it(' Should login user successfully', async () => {
//       console.log(data);
//       await request
//         .post('/api/auth/login')
//         .send({ email: data.email, password: data.password })
//         .expect(200)
//         .then((res) => {
//           const access_token = decodeURIComponent(res.headers['set-cookie'])
//             .split(';')
//             .filter((cookie) => cookie.split('=')[0] === 'access_token')[0]
//             .split('=')[1];
//           expect(!access_token).toBe(false);
//           expect(res.body.data.user).toEqual(data.name);
//           expect(res.body.data.email).toEqual(data.email);
//           expect(!res.body.access_token).toBe(false);
//           data.access_token = res.body.access_token;

//           return;
//         });
//     });
//     it(' Should not login user with missing infos', async () => {
//       await request
//         .post('/api/auth/login')
//         .send({ email: data.email })
//         .expect(400);
//       await request
//         .post('/api/auth/login')
//         .send({ password: data.password })
//         .expect(400);
//     });
//     it(' Should logout user ', async () => {
//       await request
//         .get('/api/auth/logout')
//         .set('Authorization', data.access_token)
//         .expect(200)
//         .then((res) => {
//           const access_token = decodeURIComponent(res.headers['set-cookie'])
//             .split(';')
//             .filter((cookie) => cookie.split('=')[0] === 'access_token')[0]
//             .split('=')[1];
//           expect(access_token).toEqual('');
//           return;
//         });
//     });
//     it(' Should logout user fail due to authorization (missing token) ', async () => {
//       await request.get('/api/auth/logout').expect(401);
//     });
//     it(' Should forgotpassword operation success ', async () => {
//       await request
//         .post('/api/auth/forgotpassword')
//         .send({ email: data.email })
//         .expect(200)
//         .then(async () => {
//           const user = await User.findOne({ email: data.email }).select([
//             '+resetPasswordToken',
//             '+resetPasswordExpire',
//           ]);
//           expect(!(user.resetPasswordToken && user.resetPasswordExpire)).toBe(
//             false
//           );
//           data.resetPasswordToken = user.resetPasswordToken;
//           data.resetPasswordExpire = user.resetPasswordExpire;
//         });
//     });
//     it(' Should forgotpassword operation fail due to invalid email. ', async () => {
//       await request
//         .post('/api/auth/forgotpassword')
//         .send({ email: `xyz${data.email}` })
//         .expect(404);
//     });
//     it(' Should resetpassword operation success. ', async () => {
//       const resetPasswordQuery = `?resetPasswordToken=${data.resetPasswordToken}`;
//       const newPassword = '654321';
//       console.log(data.access_token, 'ikikk');
//       await request
//         .put(`/api/auth/resetpassword${resetPasswordQuery}`)
//         .send({ password: newPassword })
//         .expect(200)
//         .then(async () => {
//           await request
//             .post('/api/auth/login')
//             .send({ email: data.email, password: newPassword })
//             .expect(200)
//             .then((res) => {
//               data.password = newPassword;
//               data.access_token = res.body.access_token;
//             });
//         });
//     });
//     it(' Should resetpassword operation fail due to invalid token. ', async () => {
//       const resetPasswordQuery = `?resetPasswordToken=${data.resetPasswordToken}xyz`;
//       const newPassword = '654321';
//       await request
//         .post(`/api/auth/resetpassword${resetPasswordQuery}`)
//         .send({ password: newPassword })
//         .expect(404);
//     });
//     it(' Should user access profile page ', async () => {
//       await request
//         .get('/api/auth/profile')
//         .set('Authorization', data.access_token)
//         .expect(200);
//     });
//     it(' Should not user access profile page due to missing token', async () => {
//       await request.get('/api/auth/profile').expect(401);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });

// describe('API Register - End point /api/auth/login - /logout', () => {
//   const request = supertest(app);
//   const timestamp = Date.now().toString();
//   const data = {
//     name: timestamp,
//     email: `${timestamp}@gmail.com`,
//     password: '123456',
//   };
//   beforeAll(async () => {
//     // Ensure the database is connected before running tests
//     await connectDatabase();
//     await request.post('/api/auth/register').send(data).expect(201);
//   });
//   beforeEach(async () => {
//     await request
//       .post('/api/auth/login')
//       .send({ email: data.email, password: data.password })
//       .expect(200)
//       .then((res) => {
//         data.access_token = res.body.access_token;
//       });
//   });
//   it(' Should ask question process success', async () => {
//     const question = {
//       title: 'this is a test title',
//       content: 'this is a test content',
//     }(await request.post('/api/question/ask'))
//       .set('Authorization', data.access_token)
//       .send(question)
//       .expect(201)
//       .then((res) => {
//         expect(res.body.question.title).toEqual(question.title);
//         expect(res.body.question.content).toEqual(question.content);
//       });
//   });
//   it(' Should ask question process fail due to missing token', async () => {
//     const question = {
//       title: 'this is a test title',
//       content: 'this is a test content',
//     }(await request.post('/api/question/ask'))
//       .send(question)
//       .expect(401);
//   });
//   it(' Should ask question process fail due to missing argument', async () => {
//     const question = {
//       content: 'this is a test content',
//     }(await request.post('/api/question/ask'))
//       .send(question)
//       .expect(400);
//   });
//   it(' Should ask question process fail due to missing argument', async () => {
//     const question = {
//       title: 'this is a test title',
//     }(await request.post('/api/question/ask'))
//       .send(question)
//       .expect(400);
//   });
//   it(' Should ask question process fail due to invalid title min length', async () => {
//     const question = {
//       title: 'this is',
//       content: 'this is a test content',
//     }(await request.post('/api/question/ask'))
//       .send(question)
//       .expect(400);
//   });
//   it(' Should ask question process fail due to invalid content min length', async () => {
//     const question = {
//       title: 'this is a test title',
//       content: 'this is a ',
//     }(await request.post('/api/question/ask'))
//       .send(question)
//       .expect(400);
//   });
// });

describe('API Endpoint "/api/question/:id" GET single question', () => {
  const request = supertest(app);
  it(' Should get single question with provided id in params', async () => {
    await request
      .get(`/api/question/${dummyQuestions[0]._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body.data[0]._id).toEqual(dummyQuestions[0]._id);
        expect(res.body.data[0].user._id).toEqual(dummyQuestions[0].user);
      });
  });
  it('Should not get single question due to question id isnt exitst in db', async () => {
    const notExistId = '5e302a02685d0667c54d46ea';
    await request.get(`/api/question/${notExistId}`).expect(404);
  });
  it(' (CAST ERROR) Should not get single question due to invalid question id in req.params', async () => {
    const invalidIdFormat = 'asd${dummyQuestions[0]._id}';
    await request.get(`/api/question/${invalidIdFormat}`).expect(400);
  });
  it(' Should get single question with answers and correct pagination, by provided question id in params', async () => {
    const getQuestion = async (questionId) => {
      await request
        .get(`/api/question/${questionId}`)
        .expect(200)
        .then(async (res) => {
          const answerCount = (await Answer.find({ question: questionId }))
            .length;
          expect(res.body.answerCount).toEqual(answerCount);
          if (answerCount > 5) {
            expect(!res.body.pagination.next).toBe(false);
          } else {
            expect(!res.body.pagination.next).toBe(true);
          }
        });
    };
    await getQuestion(dummyQuestions[0]._id);
    await getQuestion(dummyQuestions[1]._id);
  });
  it(' Should get single question with answers and correct pagination, by provided question id in params and page limit quey params', async () => {
    const getQuestionByParams = async (questionId, limit, page) => {
      await request
        .get(`/api/question/${questionId}?limit=${limit}&page=${page}`)
        .expect(200)
        .then(async (res) => {
          const answerCount = (await Answer.find({ question: questionId }))
            .length;
          if (answerCount / limit > 1) {
            const totalPage = Math.ceil(answer / limit);
            if (totalPage > page && page === 1) {
              expect(!res.body.pagination.previous).toBe(true);
              expect(!res.body.pagination.next).toBe(false);
            }
            if (totalPage > page && page > 1) {
              expect(!res.body.pagination.previous).toBe(false);
              expect(!res.body.pagination.next).toBe(false);
            }
            if (totalPage === page) {
              expect(!res.body.pagination.previous).toBe(false);
              expect(!res.body.pagination.next).toBe(true);
            }

            expect(res.body.data.answer.length).toEqual(limit);
          }
        });
    };
    await getQuestionByParams(dummyQuestions[0]._id, 2, 2);
    await getQuestionByParams(dummyQuestions[0]._id, 2, 1);
    await getQuestionByParams(dummyQuestions[0]._id, 2, 3);
    await getQuestionByParams(dummyQuestions[0]._id, 6, 1);
    await getQuestionByParams(dummyQuestions[0]._id, 6, 2);
    await getQuestionByParams(dummyQuestions[0]._id, 3, 1);
    await getQuestionByParams(dummyQuestions[0]._id, 3, 3);
    await getQuestionByParams(dummyQuestions[0]._id, 3, 2);
  });
});
describe('API Endpoint "/api/question" GET all questions', () => {
  const request = supertest(app);
  it(' Should get all questions (default limit and page)', async () => {
    await request
      .get('api/question')
      .expect(200)
      .then(async (res) => {
        await connectDatabase();
        const questionCount = await Question.countDocuments();
        expect(res.body.questionCount).toEqual(questionCount);
        expect(res.body.data.length).toEqual(5);
      });
  });
  it(' Should get all questions by provided limit and page', async () => {
    const getAllQuestions = async (limit, page) => {
      await request
        .get(`api/question?limit=${limit}&page=${page}`)
        .expect(200)
        .then(async (res) => {
          const questionCount = await Question.countDocuments();
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const expectData = await Question.find()
            .skip(startIndex)
            .limit(limit);
          expect(res.body.data.length).toEqual(limit);
          expect(res.body.data).toEqual(expectData);
          if (startIndex > 0) {
            expect(!res.body.pagination.previous).toBe(false);
          } else {
            expect(!res.body.pagination.previous).toBe(true);
          }
          if (endIndex < questionCount) {
            expect(!res.body.pagination.next).toBe(false);
          } else {
            expect(!res.body.pagination.next).toBe(true);
          }
        });
    };
    getAllQuestions(1, 2);
    getAllQuestions(1, 3);
    getAllQuestions(2, 2);
    getAllQuestions(2, 3);
    getAllQuestions(2, 5);
  });
});
