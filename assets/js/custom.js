// sticky header
/*
var dmd1 = new Date();
var version = dmd1.getFullYear() + "" + (dmd1.getMonth() + 1) + "" + dmd1.getDate();
$("head").append("<script src='./assets/js/gatag.js?ver=" + version + "'></script>");
*/
jQuery(window).scroll(function () {
    var st = jQuery(this).scrollTop();
    if (st > 90) {
        jQuery(".header-main").addClass("sticky");
    } else {
        jQuery(".header-main").removeClass("sticky");
    }
});

$(function () {
    $('.selectpicker').selectpicker();
	
    $("#included-home-faq-Content").load("home-loan-faq-internal.html"); 

	$(document).on('click', '.set > a', function(){ 
		console.log("inside");
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(this)
				.siblings(".content")
				.slideUp(200);
			$(".set > a i")
				.removeClass("fa-minus")
				.addClass("fa-plus");
		} else {
			$(".set > a i")
				.removeClass("fa-minus")
				.addClass("fa-plus");
			$(this)
				.find("i")
				.removeClass("fa-plus")
				.addClass("fa-minus");
			$(".set > a").removeClass("active");
			$(this).addClass("active");
			$(".content").slideUp(200);
			$(this)
				.siblings(".content")
				.slideDown(200);
		}
	});
	/*
	$(".set > a").on("click", function () {
		console.log("inside");
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(this)
				.siblings(".content")
				.slideUp(200);
			$(".set > a i")
				.removeClass("fa-minus")
				.addClass("fa-plus");
		} else {
			$(".set > a i")
				.removeClass("fa-minus")
				.addClass("fa-plus");
			$(this)
				.find("i")
				.removeClass("fa-plus")
				.addClass("fa-minus");
			$(".set > a").removeClass("active");
			$(this).addClass("active");
			$(".content").slideUp(200);
			$(this)
				.siblings(".content")
				.slideDown(200);
		}
	});
	*/
});

$(".testimonial-slider").owlCarousel({
    autoplay: false,
    margin: 30,
    autoplayTimeout: 2000,
    loop: true,
    nav: false,
    items: 1,
    dots: false
});

$(document).on("click", "#nav-icon", function() {
    jQuery(this).toggleClass("open");
    jQuery("body").toggleClass("menu-open");
});

$(document).on("click", ".overlay-close", function() {
    jQuery("#nav-icon").removeClass("open");
    jQuery("body").removeClass("menu-open");
});


$(document).on("click", ".dropdown-toggle", function(e) {
    $(this).toggleClass("t-open");
});

const folder = "assets/data/banks.json";
const fileextension = ".png";
$.ajax({
    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
    url: folder,
    success: function (data) {
        //List all .png file names in the page
        for(let i = 0; i < data.length; i++) {
            $("#bank-list").append('<div class="partner-box"><a href="' + data[i].link + '" target="_blank"><img src="./assets/images/bank/' + data[i].imgUrl + '" title="' + data[i].title + '"></a><a href="' + data[(i + Math.floor(data.length / 2)) % data.length].link + '" target="_blank"><img src="./assets/images/bank/' + data[(i + data.length / 2) % data.length].imgUrl + '" title="' + data[(i + data.length / 2) % data.length].title + '"></a></div>');
        }

        $('.partner-inr').owlCarousel({
            loop: true,
            margin: 30,
            autoplay: true,
            autoplayTimeout: 2000,
            autoplayHoverPause:true,
            items: 6,
            dots: false,
            responsive: {
                0: {
                    items: 2,
                    // nav: false
                },
                768: {
                    items: 3,
                    // nav: false
                },
                992: {
                    items: 6,
                    // nav: false,
                }
            },
        });
    }
});



$(".expand-toggle").click(function () {
    $(".expand-wrap").slideToggle("slow");
});


// ===== Scroll to Top ==== 
$(window).scroll(function () {
    if ($(this).scrollTop() >= 50) { // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200); // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200); // Else fade out the arrow
    }
});
$('#return-to-top').click(function () { // When arrow is clicked
    $('body,html').animate({
        scrollTop: 0 // Scroll to top of body
    }, 500);
});


// Listen for submit
// document.getElementById('loan-form').addEventListener('submit', calculateResults);

// Calculate Results
function calculateResults(e) {

    // Declare UI Variables

    const amount = document.getElementById('amount');
    const interest = document.getElementById('interest');
    const years = document.getElementById('years');
    const monthlyPayment = document.getElementById('monthly-payment');
    const totalPayment = document.getElementById('total-payment');
    const totalInterest = document.getElementById('total-interest');

    // Turn amount into decimal and store it into variable
    const principal = parseFloat(amount.value);
    const calculatedInterest = parseFloat(interest.value) / 100 / 12;
    const calculatedPayment = parseFloat(years.value) * 12;

    // Compute monthly payments
    const x = Math.pow(1 + calculatedInterest, calculatedPayment);
    const monthly = (principal * x * calculatedInterest) / (x - 1);


    // Check if value is finite

    if (isFinite(monthly)) {
        monthlyPayment.value = monthly.toFixed(2);
        totalPayment.value = (monthly * calculatedPayment).toFixed(2);
        totalInterest.value = ((monthly * calculatedPayment) - principal).toFixed(2);

    } else {
        showError("Please check your numbers")
    }

    e.preventDefault();
}

// Function to show error
function showError(error) {
    // create div
    const errorDiv = document.createElement('div');

    // Get card and heading in order to add new div to DOM. Parent element
    const card = document.querySelector('.card');
    const heading = document.querySelector('.heading');


    // Give div a class name
    errorDiv.className = 'alert alert-danger';

    // Create text and append div
    errorDiv.appendChild(document.createTextNode(error));

    // Insert error above heading. Insert above will take in the parent element which is the card in this case and for the parameters
    // It will take in the element you want to put in and the element you want to put it before, in this case errorDiv and the heading

    card.insertBefore(errorDiv, heading);

    // Clear error after 3 seconds

    setTimeout(clearError, 3000);

}


// Create clear error
function clearError() {
    document.querySelector('.alert').remove();
}

