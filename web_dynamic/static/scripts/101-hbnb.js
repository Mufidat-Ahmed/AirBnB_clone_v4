$(document).ready(function () {
  let selectedStates = [];
  let selectedCities = [];
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
  $('input[type="checkbox"]').change(function () {
    selectedStates = [];
    selectedCities = [];
    selectedAmenities = [];

    $('input[type="checkbox"]:checked').each(function () {
      if ($(this).data('id') && $(this).data('name')) {
        if ($(this).data('id').startsWith('state')) {
          selectedStates.push({ id: $(this).data('id'), name: $(this).data('name') });
        } else if ($(this).data('id').startsWith('city')) {
          selectedCities.push({ id: $(this).data('id'), name: $(this).data('name') });
        }
      } else {
        selectedAmenities.push($(this).data('id'));
      }
    });

    let locationsText = '';
    if (selectedStates.length > 0) {
      locationsText += 'States: ';
      locationsText += selectedStates.map(state => state.name).join(', ');
    }
    if (selectedCities.length > 0) {
      locationsText += (locationsText ? ' | ' : '') + 'Cities: ';
      locationsText += selectedCities.map(city => city.name).join(', ');
    }
    $('.popover h4').html(locationsText);
  });

  $('button').click(function () {
    const selectedAmenities = [];
    $('input[type="checkbox"]:checked').each(function () {
      selectedAmenities.push($(this).data('id'));
    });
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: selectedAmenities,
        states: selectedStates,
        cities: selectedCities
      }),
      success: function (data) {
        $('.places article').remove();
      }
    });
  });

  $('#toggle-reviews').click(function () {
    const buttonText = $(this).text();
    if (buttonText === 'show') {
      $.ajax({
        type: 'GET',
        url: 'http://0.0.0.0:5001/api/v1/reviews',
        success: function (data) {
          const reviewsContainer = $('#reviews-container');
          reviewsContainer.empty();
			 for (const review of data) {
            const reviewElement = $("<div class='review'>");
            reviewElement.append(`<b>${review.user}</b>: ${review.text}`);
            reviewsContainer.append(reviewElement);
          }
        }
      });
      $(this).text('hide');
    } else {
      $('#reviews-container').empty();
      $(this).text('show');
    }
  });

  updateApiStatus();
  setInterval(updateApiStatus, 5000);
  loadPlaces();
  setInterval(loadPlaces, 10000);
});
