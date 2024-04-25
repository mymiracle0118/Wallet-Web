export type uploadKeysType = {
  fileId: string
  folderId: string
}

export interface GoogleUserProfile {
  kind: string
  displayName: string
  emailAddress: string
  me: boolean
  permissionId: string
  photoLink: string
}

export function getAuthTokenAsync() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else {
        resolve(token)
      }
    })
  })
}
export function getProfileUserInfo(): Promise<GoogleUserProfile> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      }
      fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => response.json())
        .then((profileInfo) => {
          const userInfo: GoogleUserProfile = { ...profileInfo.user }
          resolve(userInfo)
        })
        .catch((error) => {
          reject('Error fetching user profile information:')
        })
    })
  })
}

export function uploadFileToDrive(fileName: string, fileContent: any): Promise<uploadKeysType> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }

      const folderName = 'DO NOT DELETE STAR KEY'

      const folderId = await createFolder(token, folderName)
      if (!folderId) {
        reject('Folder creation failed')
      }
      const fileId = await uploadFile(token, folderId, fileName, fileContent)
      if (!fileId) {
        reject('File upload failed')
      }
      resolve({ fileId: fileId, folderId: folderId })
    })
  })
}

export function createFolder(token: string, folderName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if the folder already exists
    searchFolder(token, folderName)
      .then((existingFolderId) => {
        if (existingFolderId) {
          resolve(existingFolderId)
        } else {
          // If the folder doesn't exist, create a new one
          const metadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
          }

          fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: new Headers({
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(metadata),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('search folder', data)
              if (data && data.id) {
                resolve(data.id)
              } else {
                reject('Folder creation failed')
              }
            })
            .catch((error) => {
              reject(error)
            })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function uploadFile(token: string, folderId: any, fileName: string, fileContent: any): Promise<string> {
  return new Promise((resolve, reject) => {
    var metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: 'application/json',
    }
    var form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    form.append('file', new Blob([fileContent], { type: 'application/json' }))

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: new Headers({ Authorization: 'Bearer ' + token }),
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.id) {
          resolve(data.id)
        } else {
          reject('File upload failed')
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Function to search for a folder by name
const searchFolder = async (token: string, folderName: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const queryParams = `q=mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`
    fetch(`https://www.googleapis.com/drive/v3/files?${queryParams}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.files && data.files.length > 0) {
          // If folder found, return its ID
          resolve(data.files[0].id)
        } else {
          // If folder not found, return null
          resolve(null)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function revokeGoogleDriveAPIToken() {
  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError)
      return
    }
    chrome.identity.removeCachedAuthToken({ token }, () => {
      fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`).then(() => {})
    })
  })
}

export function getCurrentGoogleTokenStatus() {
  chrome.identity.getAuthToken({ interactive: false }, (token) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError)
      return
    }
    if (token) {
      console.log('Token found:', token)
    } else {
      console.log('No token found. User is not authenticated.')
    }
  })
}
