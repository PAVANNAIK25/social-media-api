import multer from "multer";

const storage = multer.diskStorage({
    
    destination:(req, file, cb)=>{
        cb(null, 'public/uploads')
    },
    filename:(req, file, cb)=>{
        const unique = Date.now().toString();
        cb(null, unique + file.originalname);
    }
    
})

export const upload = multer({storage:storage});
