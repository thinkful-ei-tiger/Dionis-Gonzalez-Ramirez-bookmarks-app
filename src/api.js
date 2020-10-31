const baseURL = `https://thinkful-list-api.herokuapp.com/dionisggr/bookmarks`;

function getBookmarks() {
	return fetch(baseURL);
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
  .catch(error => console.log(error.message));
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
  .catch(error => console.log(error.message));
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
  .catch(error => console.log(error.message));
}

export default {
	getBookmarks,
	createNewBookmark,
	editBookmark,
	deleteBookmark
};