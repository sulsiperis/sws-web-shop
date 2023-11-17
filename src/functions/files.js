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