const multer = require('multer')
const path = require('path');
 
const storage = multer.diskStorage({

        // Setting directory on disk to save uploaded files
        destination: './../../uploadedFiles/',
    
        // Setting name of file saved
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname))
        }
    })
    
    
const upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 20MBs
        fileSize: 20000000
    },
    fileFilter: function(request,file,cb){
        console.log('checking filter')
        checkFileType(file,cb);
    }
})

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    console.log('checking from filestorage file')

    if(mimetype && extname){
        return cb(null,true)
    }
    else{
        cb('Error:Images only')
    }

}

module.exports = {upload}


