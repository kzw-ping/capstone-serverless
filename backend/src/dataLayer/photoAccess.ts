import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PhotoItem } from '../models/PhotoItem'
import { PhotoUpdate } from '../models/PhotoUpdate'


const XAWS = AWSXRay.captureAWS(AWS)

export class PhotoAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly photosTable = process.env.PHOTOS_TABLE,
      private readonly userIdIndex = process.env.USER_ID_INDEX) {
    }

    // Query all photo items for specific users
    async getAllPhotoItems(userId : string): Promise<PhotoItem[]> {
        console.log('Getting all groups')
    
        const result = await this.docClient.query({
            TableName : this.photosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
      
            ScanIndexForward: false
        }).promise()
    
        const items = result.Items
        return items as PhotoItem[]
      }
    
      async createPhotoItem(newPhotoItem: PhotoItem): Promise<PhotoItem> {
        
        await this.docClient.put({
          TableName: this.photosTable,
          Item: newPhotoItem
        }).promise()
    
        return newPhotoItem
      }

      async UpdatePhotoItem(updateItem: PhotoUpdate, photoId: string) {
        
        await this.docClient.update({
            TableName : this.photosTable,
            Key: {"photoId": photoId},
            UpdateExpression: "set #n=:n, description=:d, modifiedAt=:m",
            ExpressionAttributeValues:{
              ":n": updateItem.name,
              ":d": updateItem.description,
              ":m": updateItem.modifiedAt
            },
            ExpressionAttributeNames:{
              "#n": "name"
            },
            ReturnValues:"UPDATED_NEW"
          }).promise()
        }
    
        async DeletePhotoItem(photoId: string) {
        
            await this.docClient.delete ({
                TableName: this.photosTable,
                Key:{
                    "photoId": photoId
                }
            }).promise()
        }

        async GenerateUploadUrl(photoId: string, attachmentUrl: string) {
        
            await this.docClient.update({
                TableName : this.photosTable,
                Key: {"photoId": photoId},
                UpdateExpression: "set attachmentUrl=:a",
                ExpressionAttributeValues:{
                  ":a": attachmentUrl,
                },
                ReturnValues:"UPDATED_NEW"
            }).promise()
        }
    }

    function createDynamoDBClient() {
      if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'http://localhost:8000'
        })
      }
    
      return new XAWS.DynamoDB.DocumentClient()
}