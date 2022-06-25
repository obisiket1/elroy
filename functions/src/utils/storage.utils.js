import fs from 'fs'
import aws from 'aws-sdk'

/**
 * Defines helper functions for file upload
 */
export default class MediaFunctions {
  /**
   * Uploads images and videos
   * @param {*} file
   * @returns {string} uploded file data
   */
  static async uploadFile (file, key = 'test', name) {
    try {
      let key_ = `/${key.trim()}/${name ? name : file.originalname.trim()}`
      aws.config.setPromisesDependency()
      aws.config.update({
        secretAccessKey: process.env.S3_ACCESS_SECRET.trim(),
        accessKeyId: process.env.S3_ACCESS_KEY.trim(),
        region: process.env.S3_REGION.trim()
      })

      const s3 = new aws.S3()
      const params = {
        ACL: 'public-read',
        Bucket: 'elroi',
        Body: fs.createReadStream(file.path),
        Metadata: { fieldName: file.fieldname },
        Key: `${key.trim()}/${
          Date.now() + name ? name : file.originalname
        }`
      }
      let data = s3
        .upload(params)
        .promise()
        .catch(err => {
          throw err
        })
      return data
    } catch (err) {
      throw err
    }
  }

  static async deleteFiles (files, Bucket = process.env.S3_BUCKET_NAME.trim()) {
    const s3 = new aws.S3()
    aws.config.setPromisesDependency()
    aws.config.update({
      secretAccessKey: process.env.S3_ACCESS_SECRET,
      accessKeyId: process.env.S3_ACCESS_KEY,
      region: 'us-east-1'
    })

    const Objects = []
    files.forEach(Key => {
      Objects.push({
        Key: Key.slice(Key.indexOf('.com/') + 5).replace(/%20/g, ' ')
      })
    })

    const params = {
      Bucket,
      Delete: {
        Objects,
        Quiet: false
      }
    }
    await s3
      .deleteObjects(params)
      .promise()
      .catch(err => {
        throw err
      })
  }
}
