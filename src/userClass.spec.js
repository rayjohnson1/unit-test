const sinon = require('sinon');
const User = require('./userClass');
const database = require('./db');


describe("User Class", () => {

    const user = new User({
        firstname: "John",
        lastname: "Doe",
        username: "jonny_boy12_",
        email: "johnd@gmail.com",
        password: "hello:)"
    }, database, new Date());

    describe("register()", () => {

        afterEach(() => {
            sinon.restore();
        });

        it("should make a call to user.database.query()", async () => {

            //arrange
            //..

            //stub
            sinon.stub(user, 'registrationValidation').returns(true);
            sinon.stub(user.dateTime, 'toLocaleString');
            const databaseQuerySpy = sinon.stub(user.database, 'query');

            //act
            await user.register();

            //assert
            sinon.assert.calledOnce(databaseQuerySpy);
            sinon.assert.calledWith(databaseQuerySpy, {
                text: sinon.match.typeOf("string"),
                values: [user.firstname, user.lastname, user.username, user.email, user.password, user.createdAt]
            });

        });

        it("should make a call to user.date.toLocaleString()", async () => {

            //arrange
            //..

            //stub
            sinon.stub(user, 'registrationValidation').returns(true);
            sinon.stub(user.database, 'query');
            const dateTimeStub = sinon.stub(user.dateTime, 'toLocaleString');

            //act
            await user.register();

            //assert
            sinon.assert.calledOnce(dateTimeStub);

        });

        it("should return a copy of the user model when all required fields are not null", async () => {

            //arrange
            //..

            //stub
            sinon.stub(user.dateTime, 'toLocaleString');
            sinon.stub(user, 'registrationValidation').returns(true);
            sinon.stub(user.database, 'query').resolves({
                rows: [{
                    id: 1,
                    firstname: "John",
                    lastname: "Doe",
                    username: "jonny_boy12_",
                    email: "johnd@gmail.com",
                    created_at: 'Jan. 20, 2018'
                }]
            });

            //act
            const createdUser = await user.register();

            expect.assertions(12);
            //assert
            expect(createdUser).toHaveProperty('id');
            expect(createdUser).toHaveProperty('firstname');
            expect(createdUser).toHaveProperty('lastname');
            expect(createdUser).toHaveProperty('username');
            expect(createdUser).toHaveProperty('email');
            expect(createdUser).toHaveProperty('createdAt');
            expect(createdUser.id).toBe(1);
            expect(createdUser.firstname).toBe('John');
            expect(createdUser.lastname).toBe('Doe');
            expect(createdUser.username).toBe('jonny_boy12_');
            expect(createdUser.email).toBe('johnd@gmail.com');
            expect(createdUser.createdAt).toBe('Jan. 20, 2018');

        });

        it('should throw an error when required values are not provided', async () => {

            //arrange
            //..

            //stub
            sinon.stub(user.dateTime, 'toLocaleString');
            sinon.stub(user, 'registrationValidation').returns(false);
            sinon.stub(user.database, 'query');

            expect.assertions(1);
            try {

                //act
                await user.register();

            } catch(e) {

                //assert
                expect(e).not.toBeNull();

            }
        
        });

    });

    describe('delete()', () => {

        it("should make a call to database.delete()", async () => {

            //arrange
            const user = new User({
                id: 1
            }, database, new Date());

            //stub
            const deleteQueryStub = sinon.stub(user.database, 'query').resolves();

            //act
            await user.delete();

            //assert
            sinon.assert.calledOnce(deleteQueryStub)

        });

    });

        

});