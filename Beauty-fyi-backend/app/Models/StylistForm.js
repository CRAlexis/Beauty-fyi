'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StylistForm extends Model {

  User () {
    return this.hasOne('App/Models/User')
  }

}

module.exports = StylistForm
