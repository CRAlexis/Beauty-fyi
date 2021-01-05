'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ServiceAddon extends Model {

  User () {
    return this.hasOne('App/Models/User')
  }

  AddService () {
    return this.hasOne('App/Models/AddService')
  }

}

module.exports = ServiceAddon
