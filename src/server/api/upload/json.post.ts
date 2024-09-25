import multer from 'multer'
import md5 from 'md5'

const uploadImage = multer({ 
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './dist/upload')
    },
    filename: function(req, file, cb) {
      const hash = md5(file.originalname + '-' + Date.now())
      const type = file.originalname.split('.')[file.originalname.split('.').length -1]
      const name = `json-${hash}.${type}`
      cb(null, name)
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const acceptedTypes = file.mimetype.split('/')
    if(acceptedTypes[1] === 'json') cb(null, true)
    else cb(new Error('Chỉ hỗ trợ file json'))
  }
})

export default defineEventHandler(async (event) => {
  try{
    // @ts-expect-error
    await callNodeListener(uploadImage.single('json'), event.node.req, event.node.res)
    // @ts-expect-error
    const file = event.node.req.file
    const url = `/upload/${file.filename}`
    return resp(event, { message: 'Tải file thành công', result: url })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})