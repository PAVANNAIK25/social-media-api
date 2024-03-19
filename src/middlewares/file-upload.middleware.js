import multer from "multer";

const storage = multer.diskStorage({
    //setting up path to save files at
    destination:(req, file, cb)=>{
        cb(null, 'public/uploads')
    },
    //setting up unique file name
    filename:(req, file, cb)=>{
        const unique = Date.now().toString();
        cb(null, unique + file.originalname);
    }
    
})

export const upload = multer({storage:storage});
