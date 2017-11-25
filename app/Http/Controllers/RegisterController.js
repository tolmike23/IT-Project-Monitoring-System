'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')
const Hash = use('Hash')
const ExceptionParser = exports = module.exports = {}

class RegisterController {
    * index(request, response) {
        yield response.sendView('register')
    }

    * doRegister(request, response) {
		//set validation rules for registration form
		const rules = {
			userType: 'required',
      lastname: 'required|max:80',
      firstname: 'required|max:80',
      middlename: 'required|max:80',
			email: 'required|email|max:255|unique',
			personal_code: 'required|max:15|unique',
			password: 'required|min:6|max:30|confirmed'
		}

        try {
            // validate form input
            const validation = yield Validator.validate(request.all(), User.rules)

            // return back to registration form with error messages if validation fails.
            if (validation.fails()){
                response.json(validation.messages())
                return response.redirect('back')
            }

            // persist to database
            const user = yield User.create({
                type: request.input('userType'),
                lastname: request.input('lastname'),
                firstname: request.input('firstname'),
                middlename: request.input('middlename'),
                email: request.input('email'),
                personal_code: request.input('personal_code'),
                password: yield Hash.make(request.input('password'))
            })

            yield user.save()
            // redirect user to login page
            yield request.with({ success: "Account Successfully Created | Please Log In" }).flash()
            return response.redirect('/login')
        } catch(e) {
            console.log('Registration error: '+ e.message)
            yield request.with({ error: "Application is preventing you to register for duplicate entry for email or id" }).flash()
            return response.redirect('back')
        }
    }
}

module.exports = RegisterController
