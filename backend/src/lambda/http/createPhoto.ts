import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreatePhotoRequest } from '../../requests/CreatePhotoRequest'
import { createPhotoItem } from '../../businessLogic/photos'
import { getUserId } from '../utils'

// Create new photo
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newPhoto: CreatePhotoRequest = JSON.parse(event.body)

  const userId = getUserId(event)
  const newPhotoItem = await createPhotoItem(newPhoto, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newPhotoItem
    })
  }
}
