'use strict'

const Lucid = use('Lucid')
const Hash = use('Hash')

class User extends Lucid {

  //static boot () {
  //  super.boot()

    /**
     * Hashing password before storing to the
     * database.
     */
  //  this.addHook('beforeCreate', function * (next) {
      //this.password = yield Hash.make(this.password)
      //yield next
  //  })
 // }

  //apiTokens () {
  //  return this.hasMany('App/Model/Token')
  //}

  //static get rules() {

	//  return {
	//	  username: 'required|unique:users|min:6',
	//	  email: 'required|email|unique:users',
	//	  password: 'required|confirmed|min:6|max:30',
	//  }
  //}

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

}

module.exports = User
