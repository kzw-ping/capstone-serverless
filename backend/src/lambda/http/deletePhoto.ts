import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deletePhotoItem } from '../../businessLogic/photos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('photos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photoId = event.pathParameters.photoId
  logger.info('Delete in progress ' + photoId)
  // Photo: Remove a Photo by id

  await deletePhotoItem(photoId)

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
