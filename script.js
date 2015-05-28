var http = require('http');
var _ = require('lodash');

var commentInput = document.getElementById('commentQuery');
var videoInput = document.getElementById('videoId');
var nextPage = document.getElementById('nextPage');

var httpOptions = {
  protocol: 'https://',
  port: 443,
  host: 'www.googleapis.com',
  path: `/youtube/v3/commentThreads?part=snippet&maxResults=100&textFormat=plainText&videoId=${videoInput.value || videoInput.getAttribute('placeholder')}&key=AIzaSyCUk1eKBhptKtXtQIZIhV7g0tIvV2J7YvU`
};

http.get(httpOptions, httpHandler);
renderVideo(videoInput.value || videoInput.getAttribute('placeholder'));

function httpHandler (response) {
  var responseData = '';
  var div = document.getElementById('result');

  response.on('data', function(buffer) {
    responseData = responseData + buffer;
  });

  response.on('end', function() {
    responseData = JSON.parse(responseData);

    var comments = _.map(responseData.items, function(data) {
      // should be an object with text and a link in it.
      return {
        text: data.snippet.topLevelComment.snippet.textDisplay.replace('\n', '').split('\\u')[0],
        link: data.snippet.topLevelComment.id,
        videoId: data.snippet.videoId
      };
    });

    for (var i = 0; i < comments.length; i++) {
      div.innerHTML += `
        <div class="atom atom--comment">
          ${comments[i].text}
          <a class="commentLink is-hidden" href="//youtube.com/watch?v=${comments[i].videoId}&lc=${comments[i].link}">#</a>
        </div>
      `;
    }

    handleInput();

    nextPage.textContent = 'Next Page';
    nextPage.setAttribute('data-nextToken', responseData.nextPageToken);

    if (responseData.nextPageToken === '') {
      nextPage.classList.add('is-hidden');
    }
    document.getElementById('loader').classList.add('is-hidden');
  });
}

function getVideoId(videoId) {
  var YOUTUBE = /(?:https?:\/\/)?(?:m\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;

  if (videoId.match(YOUTUBE) !== null) {
    videoId = videoId.match(YOUTUBE)[1];
  }

  return videoId;
}

nextPage.addEventListener('click', function(event) {
  document.getElementById('loader').classList.remove('is-hidden');

  videoId = getVideoId(videoInput.value || videoInput.getAttribute('placeholder'));

  var nextToken = nextPage.getAttribute('data-nextToken');

  http.get(_.assign({}, httpOptions, {path: `/youtube/v3/commentThreads?part=snippet&maxResults=100&textFormat=plainText&videoId=${videoId}&key=AIzaSyCUk1eKBhptKtXtQIZIhV7g0tIvV2J7YvU` + '&pageToken=' + nextToken}), httpHandler);
});

commentInput.addEventListener('input', handleInput);
videoInput.addEventListener('input', handleVideoChange);

function handleVideoChange(event) {
  var resultsEl = document.getElementById('result');

  videoId = getVideoId(videoInput.value || videoInput.getAttribute('placeholder'));

  http.get(_.assign({}, httpOptions, {path: `/youtube/v3/commentThreads?part=snippet&maxResults=100&textFormat=plainText&videoId=${videoId}&key=AIzaSyCUk1eKBhptKtXtQIZIhV7g0tIvV2J7YvU`}), httpHandler);

  while (resultsEl.firstChild) {
    resultsEl.removeChild(resultsEl.firstChild);
  }

  handleInput();
  renderVideo(videoId);
}

function renderVideo(videoId) {
  document.getElementById('videoFrame').setAttribute('src', `https://www.youtube.com/embed/${videoId}`);
}

function handleInput(event) {
  var commentQuery = commentInput.value || '';
  var items = document.querySelectorAll('.atom--comment');

  for (var i = 0; i < items.length; i++) {
    if (items[i].textContent.match(new RegExp(commentQuery, 'gim')) === null) {
      items[i].classList.add('is-hidden');
    } else {
      items[i].classList.remove('is-hidden');
    }
  }
}

document.getElementById('toggleLinks').addEventListener('click', function(event) {
  var links = document.querySelectorAll('.commentLink');

  for (var i = 0; i < links.length; i++) {
    links[i].classList.toggle('is-hidden');
  }
});
