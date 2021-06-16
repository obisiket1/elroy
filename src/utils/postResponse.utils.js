import fs from 'fs'
// import StorageUtils from '../utils/storage.utils'

const postResponse = (req, res, next) => {
  const afterResponse = async () => {
    res.removeListener('finish', afterResponse)
    try {
      if (req.files || req.file) {
        if (req.files) {
          const keys = Object.keys(req.files)

          keys.forEach(key => {
            req.files[key].forEach(file => {
              fs.unlinkSync(file.path)
            })
          })
        } else fs.unlinkSync(req.file.path)
      }
      //   if (req.body.deleteMedia) {
      //     let deleteMedia = req.body.deleteMedia
      //     if (typeof deleteMedia === 'string') deleteMedia = [deleteMedia]
      //     await Media.deleteFiles(deleteMedia)
      //   }
    } catch (err) {
      // console.log(err);
    }
  }
  res.on('finish', afterResponse)
  next()
}

export default postResponse
