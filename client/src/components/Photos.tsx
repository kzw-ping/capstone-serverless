import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'

import { createPhoto, deletePhoto, getPhotos, patchPhoto } from '../api/photos-api'
import Auth from '../auth/Auth'
import { Photo } from '../types/Photo'

interface PhotosProps {
  auth: Auth
  history: History
}

interface PhotosState {
  photos: Photo[]
  newPhotoName: string
  newPhotoDescription: string
  loadingPhotos: boolean
}


export class Photos extends React.PureComponent<PhotosProps, PhotosState> {
  state: PhotosState = {
    photos: [],
    newPhotoName: '',
    newPhotoDescription: '',
    loadingPhotos: true
  }
  
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ 
      newPhotoName: event.target.value,
      newPhotoDescription: event.target.value })
  }

  // handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({ newPhotoDescription: event.target.value })
  // }

  onEditButtonClick = (photoId: string) => {
    this.props.history.push(`/photos/${photoId}/edit`)
  }

  onPhotoCreate = async () => {

    try {
      
      const description = this.state.newPhotoDescription
      // alert('Photo creation ' + this.state.newPhotoName + description + this.state.photos)
      const newPhoto = await createPhoto(this.props.auth.getIdToken(), {
        name: this.state.newPhotoName,
        description
        
      })
      // console.log('New photo creation ' + name + description)
      this.setState({
        photos: [...this.state.photos, newPhoto],
        newPhotoName: '',
        newPhotoDescription: ''
      })

      // alert('Photo creation success ' + name + description)
    } catch (e){
      alert('Photo creation failed ' + e.message)
    }
  }


  onPhotoDelete = async (photoId: string) => {
    try {
      await deletePhoto(this.props.auth.getIdToken(), photoId)
      this.setState({
        photos: this.state.photos.filter(photo => photo.photoId != photoId)
      })
    } catch {
      alert('Photo deletion failed')
    }
  }

  // onPhotoCheck = async (pos: number) => {
  //   try {
  //     const photo = this.state.photos[pos]
  //     await patchPhoto(this.props.auth.getIdToken(), photo.photoId, {
  //       name: photo.name,
  //       description: photo.description,
  //       done: !photo.done
  //     })
  //     this.setState({
  //       photos: update(this.state.photos, {
  //         [pos]: { done: { $set: !photo.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Photo deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const photos = await getPhotos(this.props.auth.getIdToken())
      this.setState({
        photos,
        loadingPhotos: false
      })
    } catch (e) {
      alert(`Failed to fetch photos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Photo Gallery</Header>

        {this.renderCreatePhotoInput()}

        {this.renderPhotos()}
      </div>
    )
  }

  renderCreatePhotoInput() {
    return (
      // <Form onSubmit={e =>this.onPhotoCreate}>
      //   <Form.Field>
      //     <label>Photo Name</label>
      //     <input
      //     id='photoName'
      //     placeholder='Photo Name'
      //     // value={this.state.newPhotoName}
      //     onChange={this.handleNameChange}
      //     />
      //   </Form.Field>
      //   <Form.Field>
      //     <label>Photo Description</label>
      //     <input
      //     id='photoDes'
      //     placeholder='Photo Description'
      //     // value={this.state.newPhotoDescription}
      //     onChange={this.handleDescriptionChange}
      //     />
      //   </Form.Field>
      //   <Button
      //     icon
      //     color="teal"
      //     onClick={this.onPhotoCreate}
      //     >New Photo
      //   </Button>
      // </Form>
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New photo',
              onClick: this.onPhotoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Photo name"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPhotos() {
    if (this.state.loadingPhotos) {
      return this.renderLoading()
    }

    return this.renderPhotosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Photos
        </Loader>
      </Grid.Row>
    )
  }

  renderPhotosList() {
    return (
      <Grid padded>
        {this.state.photos.map((photo, pos) => {
          return (
            <Grid.Row key={photo.photoId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onPhotoCheck(pos)}
                  checked={photo.done}
                />
              </Grid.Column> */}
              <Grid.Column width={7} verticalAlign="middle">
                {photo.name}
              </Grid.Column>
              <Grid.Column width={5} floated="right">
                {photo.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(photo.photoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPhotoDelete(photo.photoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {photo.attachmentUrl && (
                <Image src={photo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
