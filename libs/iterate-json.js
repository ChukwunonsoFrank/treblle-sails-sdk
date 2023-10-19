module.exports = function iterateJSON(obj, result = {}, fieldsToMask) {
  const defaultFields = [
    'authorization',
    'password',
    'pwd',
    'secret',
    'password_confirmation',
    'passwordConfirmation',
    'cc',
    'card_number',
    'cardNumber',
    'ccv',
    'ssn',
    'credit_score',
    'creditScore',
  ]
  fieldsToMask = defaultFields.concat(fieldsToMask)

  function multiplyString(string, multiplier) {
    let result = ""
    for (let i = 0; i < multiplier; i++) {
      result += string
    }
    return result
  }

  for (let key in obj) {
    if (Array.isArray(obj[key]) && typeof obj[key][0] !== 'string' && typeof obj[key][0] !== 'number') {
      result[key] = obj[key].map((element) => iterateJSON(element, {}, fieldsToMask));
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      result[key] = {};
      iterateJSON(obj[key], result[key], fieldsToMask);
    } else {
      if (fieldsToMask.includes(key) && key !== 'authorization') {
        result[key] = '[*** FIELD_MASKED ***]';
      } else if (fieldsToMask.includes(key) && key === 'authorization' && obj[key].substring(0, 6) === "Bearer") {
        const apiKeyLength = obj[key].substring(7).length
        result[key] = `${obj[key].substring(0, 6)} ${multiplyString('*', apiKeyLength)}`;
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}