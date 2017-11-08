'use strict'

const User = use('App/Model/User')
const Hash = use('Hash')
const Database = use('Database')

class AuthController {

    * index(request, response) {
        yield response.sendView('login')
    }

    * login(request, response) {
        const userType = request.input('userType')
        const email = request.input('email')
        const password = request.input('password')

        const loginMessage = {
            success: 'Logged-in Successfully!',
            error: 'Invalid Credentials'
        }

        try {

            console.log('User type : ' + userType)
            const qryUser = yield Database.schema.raw("select * from users where email='" + email + "' and type='" + userType + "'")
            const rsUser = JSON.stringify(qryUser)
            const logUser = JSON.parse(rsUser)
            if (userType.toLowerCase() === 's') {
                console.log('Student info '+logUser[0].length)
                if (logUser[0].length === 1) {
                    const authCheckGrp = yield request.auth.attempt(email, password, userType)
                    if (authCheckGrp)
                        return response.redirect('/dashboard')
                }
                else {
                    console.log('Invalid student account')
                    //yield request.with({loginMessage: "Not a Group account"}).flash()
                    yield response.sendView('login', {
                        loginMessage: loginMessage.error
                    })
                    //response.redirect('back')
                }
               
            } else {
                console.log('Faculty info '+logUser[0].length)
                if (logUser[0].length === 1){
                    const authCheckFlty = yield request.auth.attempt(email, password, userType)
                    if (authCheckFlty)
                        return response.redirect('/adviserDashboard')
                }
                else {
                    console.log('Non Faculty member')
                    //yield request.with({loginMessage: "Not a Group account"}).flash()
                    yield response.sendView('login', {
                        loginMessage: loginMessage.error
                    })
                    //response.redirect('back')
                }

            }
            
        } catch (e) {
            //response.location('back')
            yield response.sendView('login', {
                loginMessage: e.message
            })
        }

        /*
			if (userType.toLowerCase() === 'group'){
				const isGroup = yield Database.table('groups').where('email', email).count()
				const stringGrp = JSON.stringify(isGroup)
				const noOfGrp = stringGrp.substr(stringGrp.indexOf(':')+1,1)
				console.log('isGroup : '+noOfGrp)							
				if (parseInt(noOfGrp) > 0){					
					// Attempt to login with email and password
					const authCheckGrp = yield request.auth.attempt(email, password)
					if (authCheckGrp){
						return response.redirect('/dashboard')	
					}					
				} else {
					response.location('back')
					yield response.sendView('login', {loginMessage: "That was not a Group account"})
				}
			}
			else{
				const isAdviser = yield Database.table('advisers').where('email', email).count()
				const stringAdv = JSON.stringify(isAdviser)
				const noOfAdv = stringAdv.substr(stringAdv.indexOf(':')+1,1)
                console.log('isAdviser : '+noOfAdv)
				if (parseInt(noOfAdv) > 0){
					// Attempt to login with email and password
					const authCheckAdv = yield request.auth.attempt(email, password)
					if (authCheckAdv)
						return response.redirect('/adviserDashboard')	
				} else {
					response.location('back')
					yield response.sendView('login', {loginMessage:"That was not an Adviser account"})
				}
			}*/

    }


    * logout(request, response) {
        yield request.auth.logout()

        return response.redirect('/')
    }
}

module.exports = AuthController
