'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', table => {
      table.increments()
      table.string('firstname', 80).notNullable()
      table.string('lastname', 80).notNullable()
      table.string('middlename', 80)
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('personal_code',15).notNullable().unique()
      table.string('type', 1)
      table.integer('is_admin').unsigned().default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
