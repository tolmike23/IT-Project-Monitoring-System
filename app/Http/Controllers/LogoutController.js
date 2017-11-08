'use strict'

class LogoutController {

    * index(request, response) {
        yield request.auth.logout()
        yield response.sendView('welcome')
    }

    * logout(request, response) {
        yield request.auth.logout()

        return response.redirect('/')
    }

}

module.exports = LogoutController
