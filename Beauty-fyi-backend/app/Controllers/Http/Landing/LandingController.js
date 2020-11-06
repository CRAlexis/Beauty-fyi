'use strict'

class LandingController {

  async getCSRF ({ request, auth, session, response }) {
    const { email, password, remember } = request.all()

    //get csrfField
    {{ csrfField() }}
    //Return csrfToken

    return {{ csrfField() }};
  }

}

module.exports = LandingController
