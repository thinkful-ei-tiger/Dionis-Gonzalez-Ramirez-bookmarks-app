import {store} from './data'

const baseURL = `https://thinkful-list-api.herokuapp.com/dionisggr/bookmarks`;

function getBookmarks() {
   return (
      fetch(baseURL)
      .then(res => res.json())
      .then(bookmarks => {
        store.bookmarks = bookmarks.map(bookmark => bookmark)
      })
   )
}

function createNewBookmark(bookmark) {
	let [title, rating, desc, url] = bookmark;
	const body = JSON.stringify({
		title: title,
		rating: rating,
		url: url,
		desc: desc,
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

function editBookmark(id, title, url, desc, rating) {
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
    if (res.ok) return res.json()
    throw new Error(res.statusText)
  })
}

export default {
	getBookmarks,
	createNewBookmark,
	editBookmark,
	deleteBookmark
};