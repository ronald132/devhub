const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if(!validator.isLength(data.handle, { min: 2, max: 40})){
    errors.handle = 'Handle needs to be between 2 and 40 characters'
  }

  if(validator.isEmpty(data.handle)){
    errors.handle = 'Handle is required';
  }
  if(validator.isEmpty(data.status)){
    errors.status = 'Status is required';
  }
  if(validator.isEmpty(data.skills)){
    errors.skills = 'Skills is required';
  }

  if(!isEmpty(data.website)){
    if(!validator.isURL(data.website)){
      errors.website = 'Not a valid website url';
    }
  }

  if(!isEmpty(data.facebook)){
    if(!validator.isURL(data.facebook)){
      errors.facebook = 'Not a valid facebook url';
    }
  }

  if(!isEmpty(data.youtube)){
    if(!validator.isURL(data.youtube)){
      errors.youtube = 'Not a valid youtube url';
    }
  }

  if(!isEmpty(data.twitter)){
    if(!validator.isURL(data.twitter)){
      errors.twitter = 'Not a valid twitter url';
    }
  }

  if(!isEmpty(data.linkedin)){
    if(!validator.isURL(data.linkedin)){
      errors.linkedin = 'Not a valid linkedin url';
    }
  }

  if(!isEmpty(data.instagram)){
    if(!validator.isURL(data.instagram)){
      errors.instagram = 'Not a valid instagram url';
    }
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}