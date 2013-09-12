App = Ember.Application.create({
    //LOG_TRANSITIONS: true
});


/*
  * make sure, only one popover appears at a time.
  * if the user hovers over another help button,
  * hide other popovers and display the new. Hide
  * all if not above a help button at all.
  */
$(document).ready(function () {  
    $('.popup-marker').popover({
	html: true,
	trigger: 'hover'
    }).click(function(e) {
	$('.popup-marker').not(this).popover('hide');
	$(this).popover('toggle');
    });
    $(document).click(function(e) {
	if (!$(e.target).is('.popup-marker, .popover-title, .popover-content')) {
            $('.popup-marker').popover('hide');
	}
    });
});

