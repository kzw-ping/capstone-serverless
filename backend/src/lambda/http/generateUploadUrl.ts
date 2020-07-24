import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/photos'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const attachName = process.env.ATTACH_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photoId = event.pathParameters.photoId

  // Photo: Return a presigned URL to upload a file for a Photo with the provided id
  const attachId = uuid.v4()

  const url = getUploadUrl(attachId)
  const attachmentUrl = `https://${attachName}.s3.amazonaws.com/${attachId}`

  await generateUploadUrl(photoId, attachmentUrl)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      attachmentUrl: attachmentUrl,
      uploadUrl: url 
    })
  }
}

function getUploadUrl(attachId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: attachName,
    Key: attachId,
    Expires: parseInt(urlExpiration)
  })
}