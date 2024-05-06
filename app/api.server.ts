type MessageType = {
  code: number
  message: string
  stage: string
}

export const healthCheck = async (): Promise<MessageType> => {
  const token = await getGoogleToken()

  const res = await fetch(`${process.env.SERVER_URL}/health`, {
    headers: {
      'X-Serverless-Authorization': `Bearer ${token}`,
    },
  })
  return await res.json()
}

export const getGoogleToken = async () => {
  const metadataServerTokenURL =
    'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience='
  const res = await fetch(metadataServerTokenURL + process.env.SERVER_URL, {
    headers: {
      'Content-Type': 'application/json',
      'Metadata-Flavor': 'Google',
    },
  })
  if (!res.ok) {
    throw new Error('Failed to get Google token')
  }

  const token = await res.text()
  console.log('token', token)
  return token
}
