export function getUrl() {
    var url = "http://192.168.35.138:21389";

    return url;
}
// Empty 체크
export function isEmptyValid(value) { 
    if (value === null) {
        return true
    }
    if (typeof value === 'undefined') {
        return true 
    }
    if (typeof value === 'string' && value === '') {
        return true
    }
    if (Array.isArray(value) && value.length < 1) {
        return true 
    }
    if (typeof value === 'object' && value.constructor.name === 'Object' && Object.keys(value).length < 1 && Object.getOwnPropertyNames(value) < 1){
        return true 
    }
    if (typeof value === 'object' && value.constructor.name === 'String' && Object.keys(value).length < 1) {
        return true // new String() 
    }
    
    return false 
};

export function dateToString(date) {
    var result;
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var day = date.getDate();

    result = `${year}${leadingZeros(month,2)}${leadingZeros(day, 2)}`;

    return result;
}

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }