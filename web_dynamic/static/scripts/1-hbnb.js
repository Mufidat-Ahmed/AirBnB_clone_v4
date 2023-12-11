// static/scripts/1-hbnb.js

$(document).ready(function() {
        $('input[type="checkbox"]').change(function() {
    var selectedAmenities = [];
                 $('input[type="checkbox"]:checked').each(function() {
                         selectedAmenities.push($(this).data('id'));
    });
                $('.popover h4').html(selectedAmenities.join(', '));
  });
});
