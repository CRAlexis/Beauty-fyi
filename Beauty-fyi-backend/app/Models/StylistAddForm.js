'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StylistAddForm extends Model {

  User () {
    return this.hasOne('App/Models/User')
  }

}

module.exports = StylistAddForm
