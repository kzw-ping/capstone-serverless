import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdatePhotoRequest } from '../../requests/UpdatePhotoRequest'
import { updatePhotoItem } from '../../businessLogic/photos'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photoId = event.pathParameters.photoId
  const updatedPhoto: UpdatePhotoRequest = JSON.parse(event.body)

  // Photo: Update a Photo with the provided id using values in the "updatedPhoto" object
  await updatePhotoItem(updatedPhoto, photoId)
  
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      body:''
    })
  }
}
