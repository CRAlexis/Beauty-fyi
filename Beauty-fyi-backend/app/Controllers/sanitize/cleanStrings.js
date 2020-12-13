


exports.cleanStrings = function(variable, type) {
    type = type.toLowerCase();
    //Sanitization Rules
    const sanitizationStringRules = {
      comment: 'escape',
      tweet: 'strip_tags'
    }
    const sanitizationEmailRules = {
      email: 'normalize_email'
    }
    const sanitizationIntegerRules = {
      age: 'to_int'
    }
    const sanitizationBooleanRules = {
      isAdmin: 'to_boolean'
    }

    if(type === "string"){
      return Validator.sanitize(variable, sanitizationStringRules)
    }
    if(type === "email"){
      return Validator.sanitize(variable, sanitizationEmailRules)
    }
    if(type === "int"){
      return Validator.sanitize(variable, sanitizationIntegerRules)
    }
    if(type === "boolean"){
      return Validator.sanitize(variable, sanitizationBooleanRules)
    }
  }

