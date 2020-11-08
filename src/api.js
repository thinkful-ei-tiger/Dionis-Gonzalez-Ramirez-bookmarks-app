const baseURL = `https://thinkful-list-api.herokuapp.com/dionisggr/bookmarks`;

function getBookmarks(store) {
  return (
    fetch(baseURL)
    .then(res => {
      if (res.ok) return res.json()
      throw new Error(res.statusText)
    })
    .then(newBookmarks => {
      store.bookmarks = newBookmarks;
    })
  )
}

function createNewBookmark(bookmark) {
  const {title, url, description, rating} = bookmark;
	const body = JSON.stringify({
		title: title,
		rating: rating,
		url: url,
		desc: description,
	});
	return fetch(baseURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: body
  })
  .then(res => {
    if (res.ok) return res.json()
    throw new Error(res.statusText)
  })
}

function editBookmark({id, title, url, desc, rating}) {
	const body = JSON.stringify({
		title: title,
		url: url,
		desc: desc,
		rating: rating
	});
	return fetch(`${baseURL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  })
  .then(res => {
    if (res.ok) return res.json()
    throw new Error(res.statusText)
  })
}

function deleteBookmark(id) {
	return fetch(`${baseURL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id
    })
  })
  .then(res => {
    if (!res.ok) throw new Error(res.statusText)
  })
}

export default {
	getBookmarks,
	createNewBookmark,
	editBookmark,
	deleteBookmark
};