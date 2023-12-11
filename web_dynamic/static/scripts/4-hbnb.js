$(document).ready(function () {
  function updateApiStatus () {
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  }

  function loadPlaces () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function (data) {
        $('.places article').remove();
        for (const place of data) {
          const article = $('<article>');
          article.append(`<div class="title_box"><h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div></div>`);
          article.append(`<div class="information"><div class="max_guest">${place.max_guest}
                            Guest${place.max_guest !== 1 ? 's' : ''}</div><div class="number_rooms">${place.number_rooms}
                            Bedroom${place.number_rooms !== 1 ? 's' : ''}</div><div class="number_bathrooms">${place.number_bathrooms}
                            Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div></div>`);
          article.append(`<div class="description">${place.description || ''}</div>`);
          $('.places').append(article);
        }
      }
    });
  }
  $('button').click(function () {
    const selectedAmenities = [];
    $('input[type="checkbox"]:checked').each(function () {
      selectedAmenities.push($(this).data('id'));
    });
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: selectedAmenities }),
      success: function (data) {
        $('.places article').remove();
      }
    });
  });

  updateApiStatus();
  setInterval(updateApiStatus, 5000);
  loadPlaces();
  setInterval(loadPlaces, 10000);
});
