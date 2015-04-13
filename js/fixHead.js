function fixScroller() {
	var fixIt = function() {
		var ot = $("#scroller-anchor").offset().top;
		if($(window).scrollTop() > ot) {
			$("#scroller").css({
				position: "fixed",
				top: "0px"
			});
			$(".edit-exhibit").css('padding-top', '108px')
		} else {
			if($(window).scrollTop() <= ot) {
				$("#scroller").css({
					position: "relative",
					top: ""
				});
				$(".edit-exhibit").css('padding-top', '0px')
			}
		}
	};
	$(window).scroll(fixIt);
	fixIt();
}

$(function() {
	fixScroller();
});