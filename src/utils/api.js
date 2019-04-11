import { getQueryString } from './helpers'

export const url = 'https://www.forverkliga.se/JavaScript/api/crud.php'

export function clearApiKey() {
  localStorage.removeItem('apiKey');
}

const requestApiKey = async () => {
  const cachedKey = localStorage.getItem('apiKey')

  if (cachedKey) {
    console.log('Cached key ' + cachedKey + ' used!')
    return cachedKey
  } else {
    try {
      const apiKey = await fetch(`${url}?requestKey`)
        .then(response => response.json())
        .then(result => result.key)

      localStorage.setItem('apiKey', apiKey)
      console.log('New key ' + apiKey + ' used!')
      return apiKey
    } catch (err) {
      console.log('Error fetching API key!')
      return err
    }
  }
}

const sendRequest = async (params, limit = 10, tryCount = 1) => {
  const key = await requestApiKey()
  const qs = getQueryString({
    ...params,
    key
  })

  const fullUrl = `${url}?${qs}`;
  console.log('Request URL: ' + fullUrl);
  const { status, message, ...response } = await fetch(fullUrl).then(
    response => response.json()
  )

  if (status === 'success') {
    return { ...response, status, tryCount }
  } else if (limit > 0 && status === 'error') {
    console.log('Retrying request. Limit=' + limit + ' Message=' + message);
    return sendRequest(params, limit - 1, tryCount + 1)
  } else {
    return { status, message }
  }
}

export const fetchBooks = async () => {
  const params = {
    op: 'select'
  }

  return await sendRequest(params)
}

export const addBook = async (title, author) => {
  const params = {
    op: 'insert',
    title,
    author
  }

  return await sendRequest(params)
}

export const removeBook = async id => {
  const params = {
    id,
    op: 'delete'
  }

  return await sendRequest(params)
}

export const updateBook = async (id, title, author) => {
  const params = {
    id,
    title,
    author,
    op: 'update'
  }

  return await sendRequest(params)
}
