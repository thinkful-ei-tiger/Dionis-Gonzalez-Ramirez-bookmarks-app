// import cuid from 'cuid';
import {store} from './data.js'

function createNewBookmark(bookmark) {
  store.bookmarks.push(bookmark);
}

function handleCancelBookmark() {
  $('.main-form').on('click', '.bookmark-form .button-cancel', function(evt) {
    $('.bookmark-info').html();
  })
}

function render() {
  $('.bookmarks-info').empty();
  let html = store.bookmarks.map(bookmark => `<div class="bookmark"><label>${bookmark}</label></div>`).join('');
  $('.bookmarks').html(html)
}

function handleNewBookmark() {
  $('.main-form').submit(function(evt) {
    evt.preventDefault();
    $('.bookmark-info').html(
      `<form class="bookmark-form">
        <label>URL</label>
        <input type="text">
        <label>Title</label>
        <input type="text">
        <button type="submit" class="button-save">Save</button>
        <button type="button" class="button-cancel">Cancel</button>
      </form>`
    )
  })
}

function handleSaveBookmark() {
  $('.bookmark-info').on('submit', 'form', function(evt) {
    evt.preventDefault();
    console.log('SUCCESS');
  })
}

function main() {
  handleNewBookmark();
  handleSaveBookmark();
}

$(main)
