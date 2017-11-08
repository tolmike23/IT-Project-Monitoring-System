'use strict'

const Schema = use('Schema')

class GroupsTableSchema extends Schema {

  up () {
    this.create('groups', (table) => {
        table.increments();
        table.integer('groupId').unsigned().notNullable();
        table.string('email', 254).notNullable();
        table.string('firstname', 50).notNullable();
        table.string('middlename', 50).notNullable();
        table.string('lastname', 50).notNullable();
        table.string('status', 20);
        table.integer('projectId').unsigned().notNullable();
        table.timestamps();
    })
  }

  down () {
    this.drop('groups')
  }

}

module.exports = GroupsTableSchema
