import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllPhotoItems } from '../../businessLogic/photos'
import { getUserId } from '../../lambda/utils'


const logger = createLogger('photos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Photo: Get all Photo for a current user
  logger.info('Processing event: ', event)

  const userId = getUserId(event)
  const photoitems = await getAllPhotoItems(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items:photoitems
    })
  }
}
