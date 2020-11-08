import $ from 'jquery';
import { store } from './data.js';
import api from './api.js';
import './index.css';

const start = {
  renderStart: function() {
    $('main').empty();
    $('main').append(
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
            <option value="5" selected>&#127775;&#127775;&#127775;&#127775;&#127775;</option>
          </select>
        </div>
        <div class="bookmark-info"></div>
        <div class="error"></div>
        <div class="bookmarks"></div>
      </form>`
    )
    bookmarkList.renderBookmarkList();
  }
}

const bookmarkList = {
  generateBookmarkHTML: function(bookmark) {
    return (
      `<div class="bookmark hidden-color" data-item-id="${bookmark.id}">
        <form>
          <input type="text" value="${bookmark.title}" class="edit-title input-hidden" name="edition-title" placeholder="Title" required>
          <input type=text" value="${bookmark.url}"  class="edit-url input-hidden" name="edition-url" placeholder="URL" required>
          <div class="hidden">
            <div>
              <input type="text" value="${bookmark.desc}"  class="edit-desc input-hidden" name="edition-description" placeholder="Description">
            </div>
            <div>
              ${rating.renderRating(bookmark.rating)}
            </div>
            <div class="hidden">
              <button type="submit" class="edit-save">Save</button>
              <button type="button" class="visit-site">Visit Site</button>
              <button type="reset" class="edit-cancel"> Cancel </button>
              <button type="button" class="delete"> X </button>
            </div>
          </div>
        </form>
      </div>`
    )
  }
  ,
  generateBookmarks: function(store) {
    return api.getBookmarks(store)
    .then(() => {
      const filtered = store.bookmarks.filter(bookmark => bookmark.rating >= store.filter)
      const html = filtered.map(bookmark => this.generateBookmarkHTML(bookmark));
      return html.join("");
    })
  }
  ,
  renderBookmarkList: function() {
    this.generateBookmarks(store)
    .then(html => {
      $('.bookmarks').empty();
      $('.bookmarks').append(html);
    })
  }
}

const newBookmark = {
  renderNewBookmarkForm: function() {
    $('.bookmark-info').empty();
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
            ${rating.renderRating(5)}
            <button type="submit" class="button-save">Create</button>
            <button type="button" class="button-cancel">Cancel</button>
          </div>
        </form>`
    )
  }
  ,
  handleNewBookmarkForm: function() {
    $('.main-form').on('submit', (evt) => {
      evt.preventDefault();
      this.renderNewBookmarkForm();
    })
  }
  ,
  handleCreateBookmark: function() {
    $('.bookmark-info').on('submit', 'form', (evt) => {
      evt.preventDefault();
      const title = $(evt.target).find('.title').val();
      const url = $(evt.target).find('.url').val();
      const description = $(evt.target).find('.desc').val();
      const rating = $('.edit-rating').val();
      // this.checkValidLink(url);
      const bookmark = {title, url, description, rating}
      this.createBookmark(bookmark)
    });
  }
  ,
  createBookmark: function(bookmark) {
    store.bookmarks.push({...bookmark, expanded: true})
    api.createNewBookmark(bookmark)
    .then(() => {
      $('.bookmark-info').empty();
      bookmarkList.renderBookmarkList();
    })
    .catch(err => error.renderErrorForm('create bookmark'));
  }
  ,
  handleCancelNewBookmark: () => {
    $('.bookmark-info').on('click', 'form .button-cancel', function () {
      $('.bookmark-info').empty()
    });
  }
}

const deleteBookmark = {
  handleDeleteBookmark: function() {
    $('.bookmarks').on('click', '.delete', (evt) => {
      const id = $(evt.target).closest('.bookmark').data('item-id');
      this.deleteBookmark(id)
    })
  }
  ,
  deleteBookmark: function(id) {
    store.bookmarks.splice(extras.findBookmarkIndex(id), 1);
    api.deleteBookmark(id)
    .then(() => {
      bookmarkList.renderBookmarkList();
    })
    .catch(err => error.renderErrorForm('delete the bookmark'));
  }
}

const extras = {
  checkValidLink: function(url) {
    if (!(url.includes('http://') || url.includes('https://'))) error.renderErrorForm(`add url without 'http://' or 'https://'`);
  }
  ,
  findBookmarkIndex: (id) => {
    const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
    return store.bookmarks.indexOf(bookmark);
  }
  ,
  handleLiveValues: function() {
    const newBookmarkForm = $('.bookmark-info');
    const bookmarks = $('.bookmarks');
    newBookmarkForm.on('blur', '.title', function () {
      $('.url').val(`https://www.${($('.title').val().split('').filter(val => val !== ' ')).join('').toLowerCase()}.com`);
    });
    newBookmarkForm.one('blur', '.title', function () {
      $(this).parent().find('.desc').val(`${$(this).val().slice(0, 1).toUpperCase() + $(this).val().slice(1).toLowerCase()} Homepage`);
    });
    bookmarks.on('blur', '.edit-title', function () {
      $(this).parent().find('.edit-url').val(`https://www.${($(this).val().split('').filter(val => val !== ' ')).join('').toLowerCase()}.com`);
    });
    bookmarks.one('blur', '.edit-title', function () {
      $(this).parent().find('.edit-desc').val(`${$(this).val().slice(0, 1).toUpperCase()}${$(this).val().slice(1).toLowerCase()} Homepage`);
    });
  }
}

const editBookmark = {
  handleShowEdit: function() {
    $('.bookmarks').on('click', '.bookmark', function () {
      $('.bookmark').addClass('hidden-color').removeClass('expanded-color');
      $('.bookmark div').addClass('hidden');
      $('.bookmark input').removeClass('input-expanded').addClass('input-hidden');
      $(this).removeClass('hidden-color').addClass('expanded-color');
      $(this).find('div').removeClass('hidden');
      $(this).find('input').addClass('input-expanded');
    });
  }
  ,
  handleSaveEdit: function() {
    $('.bookmarks').on('submit', '.bookmark form', (evt) => {
      evt.preventDefault();
      let id = $(evt.target).parent().data('item-id');
      let title = $(evt.target).find('.edit-title').val();
      let desc = $(evt.target).find('.edit-desc').val();
      let rating = Number($(evt.target).find('.edit-rating').val());
      let url = $(evt.target).find('.edit-url').val();
      const bookmark = {id, title, url, desc, rating}
      this.editBookmark(bookmark)
    })
  }
  ,
  editBookmark: function(bookmark) {
    Object.assign(store.bookmarks[extras.findBookmarkIndex(bookmark.id)], bookmark)
    api.editBookmark(bookmark)
    .then(() => {
      // this.checkValidLink(bookmark.url);
      bookmarkList.renderBookmarkList();
    })
    .catch(err => error.renderErrorForm('edit the bookmark'))
  }
  ,
  handleCancelEdit: function() {
    $('.bookmarks').on('click', '.edit-cancel', (evt) => {
      $(evt.target).parent().parent().toggleClass('hidden');
      bookmarkList.renderBookmarkList();
    });
  }
  ,
  handleVisitSite: function() {
    $('.bookmarks').on('click', '.visit-site', function () {
      window.open($(this).closest('form').find('.edit-url').val())
    })
  }
}

const rating = {
  handleFilterBookmarks: function() {
    $('select').on('change', () => {
      store.filter = $('select').val();
      bookmarkList.renderBookmarkList();
    })
  }
  ,
  generateRatingHTML: (num) => {
    let html = '';
    let selected = '';
    for (let i = 1; i <= 5; i++) {
      selected = (num === i) ? selected = ' selected' : '';
      html += `<option value="${i}"${selected}>${'&#127775;'.repeat(i)}</option>`;
    }
    return html;
  }
  ,
  renderRating: function(num) {
    return (
      `<select class="edit-rating input-hidden" name="edition-rating" required>
        <option value="" disabled>Rating &#127775;</option>
        ${this.generateRatingHTML(num)}
      </select>`
    )
  }
}

const error = {
  renderErrorForm: (error) => {
    $('.error').empty();
    $('.error').append(
      `<form id="try-again">
        <label>Something went wrong. Could not ${error}.</label>
        <button type="submit">Try again</button>
      </form>`
    )
  }
  ,
  handleError: function() {
    $('main').on('submit', '#try-again', function (evt) {
      evt.preventDefault();
      bookmarkList.renderBookmarkList();
    })
  }
}

function main() {
  start.renderStart();
  bookmarkList.renderBookmarkList();
  newBookmark.handleNewBookmarkForm();
  newBookmark.handleCreateBookmark();
  newBookmark.handleCancelNewBookmark();
  editBookmark.handleSaveEdit();
  editBookmark.handleShowEdit();
  editBookmark.handleCancelEdit();
  editBookmark.handleVisitSite();
  deleteBookmark.handleDeleteBookmark();
  extras.handleLiveValues();
  rating.handleFilterBookmarks();
  error.handleError();
}

$(main);