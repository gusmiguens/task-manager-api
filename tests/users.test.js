const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { signUpData } = require('./testData/users')
const { userOne, userOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send(signUpData)
        .expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(user.password).not.toBe('MyPass777')
    expect(response.body).toMatchObject({
        user: {
            name: signUpData.name,
            email: signUpData.email
        },
        token: user.tokens[0].token
    })
})

test('Should login existin user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
    const user = await User.findById(userOneId)

    expect(200)
    expect(response.body.token).toEqual(user.tokens[1].token)
})

test('Should not login user with bad credentials', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'sarasa@gmail.com',
            password: 'Garrafa9999'
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthorized user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
    expect(200)
})

test('Should not delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
    expect(200)
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Belen'
        })
    expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.name).toEqual(user.name)
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Belen'
        })
    expect(400)
})