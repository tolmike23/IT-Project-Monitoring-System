'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')
const Hash = use('Hash')

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
                //yield request.withOnly('name','email').andWith({ registerMessage : validation.messages()}).flash()
                response.json(validation.messages())
                return response.redirect('back')
                //console.log('Registration failed. '+validation.messages())
                //yield request.withAll()
                //    .andWith({registerMessage : validation.messages()})
                //    .flash()

                //return response.redirect('back')
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
            response.redirect('/login')		
        } catch(e) {
            console.log('Registration error '+e.message)
            //yield request.andWith({registerMessage: e.message})
            return response.redirect('back')
        }
		/*
		
        const user = new User()
        user.username = request.input('name')
        user.email = request.input('email')
        var p1 = request.input('password1')
        var p2 = request.input('password2')

        var registerMessage = {
                success: 'Registration Successful! Now go ahead and login',
                error: 'User already exist'
            }

        try {
             if (p1 == p2){

                user.password = yield Hash.make(request.input('password2'))
                yield user.save()

                //yield response.sendView('register', { registerMessage : registerMessage.success })
                yield response.sendView('login')

            } else {

                //yield response.sendView('errors.passwordNotMatch', { registerMessage : registerMessage.error })

                yield response.sendView('register', {registerMessage : registerMessage.error})
            }
        } catch (e) {
            yield response.sendView('register', {registerMessage: registerMessage.error})
        }
		*/
       
    }
}

module.exports = RegisterController