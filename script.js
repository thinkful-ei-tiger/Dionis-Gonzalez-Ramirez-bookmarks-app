import {
	store
}
from './data.js';
import api from './api.js';

function handleNewBookmark() {
	$('.main-form').submit(function(evt) {
		evt.preventDefault();
		$('.bookmark-info').empty(); // Using .html() instead didn't work, troubleshooted with a TA
		$('.bookmark-info').append(
			`<form class="bookmark-form">
        <label for="title">Title</label>
        <input type="text" class="title" name="title" required>
        <label for="url">URL</label>
        <input type="text" class="url" name="url" required>
        <label for="description">Description</label>
        <input type="text" class="desc" name="description">
        <label for="rating">Rating</label>
        <div>
          <input type="number" class="rating" min="1" max="5" name="rating">
          <button type="submit" class="button-save">Save</button>
          <button type="button" class="button-cancel">Cancel</button>
        </div>
      </form>`
		);
	});
}

function handleCreateBookmark() {
	$('.bookmark-info').on('submit', 'form', function(evt) {
		evt.preventDefault();
		api.createNewBookmark(getNewValues())
			.then(function() {
				$('.bookmark-info').empty();
				render();
			});
	});
}

function handleCancelNew() {
	$('.bookmark-info').on('click', 'form .button-cancel', function() {
		$('.bookmark-info').empty();
	});
}

function handleEditBookmark() {
	$('.bookmarks').on('click', '.bookmark', function() {
		$('.bookmark').addClass('hidden-color').removeClass('expanded-color');
		$('.bookmark div').addClass('hidden');
		$('.bookmark input').removeClass('input-expanded').addClass('input-hidden');
		$(this).removeClass('hidden-color').addClass('expanded-color');
		$(this).find('div').removeClass('hidden');
		$(this).find('input').addClass('input-expanded');
	});
}

function handleEditSave() {
	$('.bookmarks').on('submit', '.bookmark form', function(evt) {
		evt.preventDefault();
		let id = $(this).parent().data('item-id');
		let title = $(this).find('.edit-title').val();
		let desc = $(this).find('.edit-desc').val();
		let rating = $(this).find('.edit-rating').val();
		let url = $(this).find('.edit-url').val();
		api.editBookmark(id, title, url, desc, rating)
			.then(function() {
				render();
			});
	});
}

function handleCancelEdit() {
	$('.bookmarks').on('click', '.edit-cancel', function() {
		$(this).parent().parent().addClass('hidden');
		render();
	});
}

function handleDelete() {
	$('.bookmarks').on('click', '.delete', function(evt) {
		evt.preventDefault();
		let id = $(this).closest('.bookmark').data('item-id');
		console.log(id);
		api.deleteBookmark(id)
			.then(function() {
				render();
			});
	});
}

function handleFilterBookmarks() {
	$('select').change(function() {
		api.getBookmarks()
			.then(res => res.json())
			.then(function(array) {
				let html = '';
				array
					.filter(bookmark => bookmark.rating >= $('select').val())
					.forEach(bookmark => {
						html +=
							`<div class="bookmark hidden-color" data-item-id="${bookmark.id}">
          <form>
            <input type="text" value="${bookmark.title}" class="edit-title input-hidden" name="edition-title" placeholder="Title" required>
            <input type=text" value="${bookmark.url}"  class="edit-url input-hidden" name="edition-url" placeholder="URL" required>
            <div class="hidden">
              <input type="text" value="${bookmark.desc}"  class="edit-desc input-hidden" name="edition-description" placeholder="Description">
              <input type="number" value="${bookmark.rating}"  class="edit-rating input-hidden" name="edition-rating" placeholder="Rating" required>
              <div class="hidden">
                <button type="submit" class="edit-save">Save</button>
                <button type="reset" class="edit-cancel"> Cancel </button>
                <button type="button" class="delete"> X </button>
              </div>
            </div>
          </form>
        </div>`;
					});
				$('.bookmarks').empty();
				$('.bookmarks').append(html);
			});
	});
}

function handleLiveValues() {
	$('.bookmark-info').on('blur', '.title', function() {
		$('.url').val(`https://www.${$('.title').val().toLowerCase()}.com`);
	});
	$('.bookmark-info').one('focus', '.rating', function() {
		$('.rating').val(5);
	});
	$('.bookmarks').on('blur', '.edit-title', function() {
		$(this).parent().find('.edit-url').val(`https://www.${$(this).val().toLowerCase()}.com`);
	});
	$('.bookmarks').on('blur', '.edit-rating', function() {
		$(this).parent().find('.edit-url').val(`https://www.${$(this).val().toLowerCase()}.com`);
	});
}

function renderRating(num) {
	let html = '';
	let selected = '';
	for (let i = 1; i <= 5; i++) {
		selected = (num === i) ? selected = ' selected' : '';
		html += `<option value="${i}"${selected}>${'&#127775;'.repeat(i)}</option>`;
	}
	return `<select class="edit-rating input-hidden" name="edition-rating" required>
            <option value="" disabled>Rating &#127775;</option>
            ${html}
          </select>`;
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
            <input type="text" value="${bookmark.desc}"  class="edit-desc input-hidden" name="edition-description" placeholder="Description">
            ${renderRating(bookmark.rating)}
            <div class="hidden">
              <button type="submit" class="edit-save">Save</button>
              <button type="reset" class="edit-cancel"> Cancel </button>
              <button type="button" class="delete"> X </button>
            </div>
          </div>
        </form>
      </div>`;
			});
			$('.bookmarks').empty();
			$('.bookmarks').append(html);
		});
}

function getNewValues() {
	const url = $('.url').val();
	let title = $('.title').val();
	let rating = $('.rating').val();
	title = title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase();
	if (rating === '') rating = 5;
	const desc = $('.desc').val();
	return [title, rating, desc, url];
}

function main() {
	render();
	handleNewBookmark();
	handleCreateBookmark();
	handleLiveValues();
	handleCancelNew();
	handleCancelEdit();
	handleEditBookmark();
	handleEditSave();
	handleDelete();
	handleFilterBookmarks();
}

$(main);