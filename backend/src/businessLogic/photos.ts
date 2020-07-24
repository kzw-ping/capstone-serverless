import { CreatePhotoRequest } from '../requests/CreatePhotoRequest'
import { UpdatePhotoRequest } from "../requests/updatePhotoRequest"
import * as uuid from 'uuid'
import { PhotoAccess } from '../dataLayer/photoAccess'
import { PhotoItem } from '../models/PhotoItem'


const photoAccess = new PhotoAccess()

export async function getAllPhotoItems(userId: string): Promise<PhotoItem[]> {
  return photoAccess.getAllPhotoItems(userId)
}

export async function createPhotoItem(
    createPhotoRequest: CreatePhotoRequest,
    jwtToken: string
  ): Promise<PhotoItem> {
  
    const itemId = uuid.v4()
  
    return await photoAccess.createPhotoItem({
      photoId: itemId,
      userId: jwtToken,
      name: createPhotoRequest.name,
      description: createPhotoRequest.description,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    })
}

export async function updatePhotoItem(
    updatePhotoRequest: UpdatePhotoRequest,
    photoId: string
  ){
    
    return await photoAccess.UpdatePhotoItem(updatePhotoRequest, photoId)
}

export async function deletePhotoItem(
    photoId: string
  ){
    
    return await photoAccess.DeletePhotoItem(photoId)
}

export async function generateUploadUrl(
    photoId: string,
    attachmentUrl: string
  ){
    
    return await photoAccess.GenerateUploadUrl(photoId, attachmentUrl)
}