import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
            callback(null, true);
        } else {
            callback(new Error('Only image and audio files are allowed'), false);
        }
    }
})

export default upload
