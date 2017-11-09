
class UserController{

    * passwordNotMatch (request, response){
        yield response.sendView('passwordNotMatch')

    }

    * registerSuccess (request, response){
        yield response.sendView('')
    }



}