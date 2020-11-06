import $ from 'jquery';
import {store} from './data.js';
import api from './api.js';
import './index.css';

function handleNewBookmark() {
  const mainForm = $('.main-form');
  const newForm = $('.bookmark-info')
	mainForm.submit(function(evt) {
		evt.preventDefault();
		newForm.empty();  // Using .html() instead didn't work, troubleshooted with a TA
		newForm.append(   // Using .html() instead didn't work, troubleshooted with a TA
			`<form class="bookmark-form">
        <label for="title">Title</label>
        <input type="text" class="title" name="title" required>
        <label for="url">URL</label>
        <input type="text" class="url" name="url" required>
        <label for="description">Description</label>
        <input type="text" class="desc" name="description">
        <label for="rating">Rating</label>
        <div>
          ${renderRating(5)}
          <button type="submit" class="button-save">Save</button>
          <button type="button" class="button-cancel">Cancel</button>
        </div>
      </form>`
		);
	});
}

function handleCreateBookmark() {
  const newForm = $('.bookmark-info');
	newForm.on('submit', 'form', function(evt) {
		evt.preventDefault();
		api.createNewBookmark(getNewValues())
			.then(function() {
				$('.bookmark-info').empty();
				render();
      })
      .catch(error => renderError('create bookmark'));
	});
}

function handleCancelNew() {
	$('.bookmark-info').on('click', 'form .button-cancel', function() {
    const newForm = $('.bookmark-info');
		newForm.empty();
	});
}

function handleEditBookmark() {
  const bookmarkList = $('.bookmarks');
	bookmarkList.on('click', '.bookmark', function() {
    const eachBookmark = $('.bookmark');
    const allBookmarkDIV = $('.bookmark div')
    const allBookmarkInputs = $('.bookmark input')
    const newValueForm = $(this);

		eachBookmark.addClass('hidden-color').removeClass('expanded-color');
		allBookmarkDIV.addClass('hidden');
		allBookmarkInputs.removeClass('input-expanded').addClass('input-hidden');
		newValueForm.removeClass('hidden-color').addClass('expanded-color');
		newValueForm.find('div').removeClass('hidden');
		newValueForm.find('input').addClass('input-expanded');
	});
}

function handleEditSave() {
  const bookmarkList = $('.bookmarks');
	bookmarkList.on('submit', '.bookmark form', function(evt) {
    const submittedForm = $(this)
		evt.preventDefault();
		let id = submittedForm.parent().data('item-id');
		let title = submittedForm.find('.edit-title').val();
		let desc = submittedForm.find('.edit-desc').val();
		let rating = submittedForm.find('.edit-rating').val();
		let url = submittedForm.find('.edit-url').val();
		api.editBookmark(id, title, url, desc, rating)
    .then(function() {
      render();
    })
    .catch(error => renderError('edit the bookmark'));
	});
}

function handleCancelEdit() {
  const bookmarkList = $('.bookmarks');
	bookmarkList.on('click', '.edit-cancel', function() {
    const clickedButton = $(this);
		clickedButton.parent().parent().addClass('hidden');
		render();
	});
}

function handleDelete() {
  const bookmarkList = $('.bookmarks');
	bookmarkList.on('click', '.delete', function(evt) {
    const clickedButton = $(this);
		evt.preventDefault();
		let id = clickedButton.closest('.bookmark').data('item-id');
		api.deleteBookmark(id)
			.then(function() {
				render();
      })
      .catch(error => renderError('delete the bookmark'));
	});
}

function handleFilterBookmarks() {
  const ratingsFilter = $('select');
  const bookmarkList = $('.bookmarks');
	ratingsFilter.on('change', function() {
		api.getBookmarks()
			.then(res => res.json())
			.then(function(array) {
				let html = '';
				array
					.filter(bookmark => bookmark.rating >= ratingsFilter.val())
					.forEach(bookmark => {
						html +=
              `<div class="bookmark hidden-color" data-item-id="${bookmark.id}">
                <form>
                  <input type="text" value="${bookmark.title}" class="edit-title input-hidden" name="edition-title" placeholder="Title" required>
                  <input type=text" value="${bookmark.url}"  class="edit-url input-hidden" name="edition-url" placeholder="URL" required>
                  <div class="hidden">
                    <div>
                      <input type="text" value="${bookmark.desc}"  class="edit-desc input-hidden" name="edition-description" placeholder="Description">
                    </div>
                    <div>
                      ${renderRating(bookmark.rating)}
                    </div>
                    <div class="hidden">
                      <button type="submit" class="edit-save">Save</button>
                      <button type="button" class="visit-site">Visit Site</button>
                      <button type="reset" class="edit-cancel"> Cancel </button>
                      <button type="button" class="delete"> X </button>
                    </div>
                  </div>
                </form>
              </div>`;
					});
				bookmarkList.empty();
				bookmarkList.append(html);
      })
      .catch(error => renderError('filter bookmarks'));
	});
}

function handleLiveValues() { 
  const newBookmarkForm = $('.bookmark-info');
  const bookmarkList = $('.bookmarks');
	newBookmarkForm.on('blur', '.title', function() {
		$('.url').val(`https://www.${($('.title').val().split('').filter(val => val !== ' ')).join('').toLowerCase()}.com`);
  });
  newBookmarkForm.one('blur', '.title', function() {
		$(this).parent().find('.desc').val(`${$(this).val().slice(0, 1).toUpperCase() + $(this).val().slice(1).toLowerCase()} Homepage`);
	});
  bookmarkList.on('blur', '.edit-title', function() {
		$(this).parent().find('.edit-url').val(`https://www.${($(this).val().split('').filter(val => val !== ' ')).join('').toLowerCase()}.com`);
  });
  bookmarkList.one('blur', '.edit-title', function() {
		$(this).parent().find('.edit-desc').val(`${$(this).val().slice(0, 1).toUpperCase()}${$(this).val().slice(1).toLowerCase()} Homepage`);
	});
}

function handleVisitSite() {
  const bookmarkList = $('.bookmarks');
  bookmarkList.on('click', '.visit-site', function() {
    window.open($(this).closest('form').find('.edit-url').val())
  })
}

function getNewValues() {
	const url = $('.url').val();
	let title = $('.title').val();
  let rating = $('.edit-rating').val();
	title = title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase();
	if (rating === '') rating = 5;
	const desc = $('.desc').val();
	return [title, rating, desc, url];
}

function handleError(error) {
  const main = $('main');
  main.on('submit', '#try-again', function(evt) {
    evt.preventDefault();
    render();
  })
}

function renderRating(num) {
	let html = '';
	let selected = '';
	for (let i = 1; i <= 5; i++) {
		selected = (num === i) ? selected = ' selected' : '';
		html += `<option value="${i}"${selected}>${'&#127775;'.repeat(i)}</option>`;
	}
	return (
    `<select class="edit-rating input-hidden" name="edition-rating" required>
      <option value="" disabled>Rating &#127775;</option>
      ${html}
    </select>`
  )
}

function renderError(error) {
  const errorDiv = $('.error');
  errorDiv.empty();
  errorDiv.append(
    `<form id="try-again">
      <label>Something went wrong. Could not ${error}.</label>
      <button type="submit">Try again</button>
    </form>`
  )
}

function render() {
	api.getBookmarks()
  .then(res => res.json())
  .then(function(array) {
    let html = '';
    array.forEach(bookmark => {
      store.bookmarks.push(bookmark);
      html +=
        `<div class="bookmark hidden-color" data-item-id="${bookmark.id}">
          <form>
            <input type="text" value="${bookmark.title}" class="edit-title input-hidden" name="edition-title" placeholder="Title" required>
            <input type=text" value="${bookmark.url}"  class="edit-url input-hidden" name="edition-url" placeholder="URL" required>
            <div class="hidden">
              <div>
                <input type="text" value="${bookmark.desc}"  class="edit-desc input-hidden" name="edition-description" placeholder="Description">
              </div>
              <div>
                ${renderRating(bookmark.rating)}
              </div>
              <div class="hidden">
                <button type="submit" class="edit-save">Save</button>
                <button type="button" class="visit-site">Visit Site</button>
                <button type="reset" class="edit-cancel"> Cancel </button>
                <button type="button" class="delete"> X </button>
              </div>
            </div>
          </form>
        </div>`;
    });
    $('.bookmarks').empty();
    $('.bookmarks').append(html);
  })
  .catch(error => renderError('render the bookmarks'));;
}

function renderStart() {
  const main = $('main');
  main.append(
    `<form class="main-form">
      <h2>My Bookmarks</h2>
      <div class="options">
        <button type="submit">New Bookmark</button>
        <select name="rating-stars">
          <option value="" disabled selected>Rating &#127775;</option>
          <option value="1">&#127775;</option>
          <option value="2">&#127775;&#127775;</option>
          <option value="3">&#127775;&#127775;&#127775;</option>
          <option value="4">&#127775;&#127775;&#127775;&#127775;</option>
          <option value="5">&#127775;&#127775;&#127775;&#127775;&#127775;</option>
        </select>
      </div>
      <div class="bookmark-info"></div>
      <div class="error"></div>
      <div class="bookmarks"></div>
    </form>`
  )
}

function main() {
  renderStart();
  render();
  handleNewBookmark();
  handleCreateBookmark();
  handleLiveValues();
  handleCancelNew();
  handleCancelEdit();
  handleEditBookmark();
  handleEditSave();
  handleVisitSite();
  handleDelete();
  handleFilterBookmarks();
  handleError();
}

$(main);