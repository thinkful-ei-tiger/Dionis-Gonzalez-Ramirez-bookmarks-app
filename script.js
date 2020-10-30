import {store} from './data.js'
import api from './api.js'

function handleNewBookmark() {
  $('.main-form').submit(function(evt) {
    evt.preventDefault();
    $('.bookmark-info').empty(); // Using .html() instead didn't work, troubleshooted with a TA
    $('.bookmark-info').append(
      `<form class="bookmark-form">
        <label>Title</label>
        <input type="text" class="title">
        <label>URL</label>
        <input type="text" class="url">
        <label>Description</label>
        <input type="text" class="desc">
        <label>Rating</label>
        <input type="number" class="rating">
        <button type="submit" class="button-save">Save</button>
        <button type="button" class="button-cancel">Cancel</button>
      </form>`
    )
  })
}

function handleCreateBookmark() {
  $('.bookmark-info').on('submit', 'form', function(evt) {
    evt.preventDefault();
    api.createNewBookmark(getNewValues())
    .then(function() {
      $('.bookmark-info').empty()
      render();
    })
  })
}

function handleCancelNew() {
  $('.bookmark-info').on('click', 'form .button-cancel', function(evt) {
    $('.bookmark-info').empty();
  })
}

function handleEditBookmark() {
  $('.bookmarks').on('click', '.bookmark', function(evt) {
    $('.bookmark div').addClass('hidden');
    $(this).find('div').removeClass('hidden');
  })
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
    })
  })
}

function handleDelete() {
  $('.bookmarks').on('click', '.delete', function(evt) {
    evt.preventDefault();
    let id = $(this).closest('.bookmark').data('item-id');
    console.log(id)
    api.deleteBookmark(id)
    .then(function() {
      render();
    })
  })
}

function handleFilterBookmarks() {
  $('select').change(function(evt) {
    api.getBookmarks()
    .then(res => res.json())
    .then(function(array) {
      let html = ''
      array
      .filter(bookmark => bookmark.rating >= $('select').val())
      .forEach(bookmark => {
        html +=
          `<div class="bookmark" data-item-id="${bookmark.id}">
            <form>
              <input type="text" value="${bookmark.title}" class="edit-title">
              <input type=text" value="${bookmark.url}"  class="edit-url">
              <div class="hidden">
                <input type="text" value="${bookmark.desc}"  class="edit-desc">
                <input type="number" value="${bookmark.rating}"  class="edit-rating">
                <button type="submit" class="edit-save">Save</button>
                <button type="button" class="delete"> X </button>
              </div>
            </form>
          </div>`
      })
      $('.bookmarks').empty();
      $('.bookmarks').append(html);
    })
  })
}

function handleLiveValues() {
  $('.bookmark-info').on('blur', '.title', function(evt) {
    $('.url').val(`https://www.${$('.title').val().toLowerCase()}.com`)
  })
  $('.bookmark-info').one('focus', '.rating', function(evt) {
    $('.rating').val(5)
  })
  $('.bookmarks').on('blur', '.edit-title', function(evt) {
    $(this).parent().find('.edit-url').val(`https://www.${$(this).val().toLowerCase()}.com`)
  })
}

function render() {
  api.getBookmarks()
  .then(res => res.json())
  .then(function(array) {
    let html = ''
    array.forEach(bookmark => {
      store.bookmarks.push(bookmark)
      html +=
        `<div class="bookmark" data-item-id="${bookmark.id}">
          <form>
            <input type="text" value="${bookmark.title}" class="edit-title">
            <input type=text" value="${bookmark.url}"  class="edit-url">
            <div class="hidden">
              <input type="text" value="${bookmark.desc}"  class="edit-desc">
              <input type="number" value="${bookmark.rating}"  class="edit-rating">
              <button type="submit" class="edit-save">Save</button>
              <button type="button" class="delete"> X </button>
            </div>
          </form>
        </div>`
    })
    $('.bookmarks').empty();
    $('.bookmarks').append(html);
  })
}

function getNewValues() {
  const url = $('.url').val();
  let title = $('.title').val();
  let rating = $('.rating').val();
  title =  title.slice(0,1).toUpperCase() + title.slice(1).toLowerCase()
  if (rating === '') rating = 5;
  const desc = $('.desc').val();
  return [title, rating, desc, url]
}

function main() {
  render();
  handleNewBookmark()
  handleCreateBookmark()
  handleLiveValues();
  handleCancelNew();
  handleEditBookmark();
  handleEditSave();
  handleDelete();
  handleFilterBookmarks();
}

$(main)
