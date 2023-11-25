import DOMPurify from 'dompurify'

export function isUrl(string) {
    if(/(http(s?)):\/\//i.test(string)) {
        return true
    }
}
export function imageExists(url) {
    return new Promise(resolve => {
      var img = new Image()
      img.src = url
      img.addEventListener('load', () => resolve(true))
      img.addEventListener('error', () => resolve(false))
      
    })
}
export function getImgUrl(url) {
    if (isUrl(url)) {
        return url
    } else {
        return `./img/products/${url}`
        
    }
}
export function getJsxFromStr(str) {
    const sanitizedContent = DOMPurify.sanitize(str, {ADD_ATTR: ['target']})
    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}