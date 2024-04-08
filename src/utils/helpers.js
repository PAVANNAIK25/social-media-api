
//getting the local saved path of image
export const getLocalePath = (fileName) =>{
    return `public/images/${fileName}`
}

//getting statis URL
export const getStaticUrl = (req, fileName) =>{
    return `${req.protocol}://${req.get("host")}/images/${fileName}`
}

export const converToTitleCase = (text) => {
    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();

}