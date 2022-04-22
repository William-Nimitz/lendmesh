//Added Google Anyltics Tag Container Tracking - included here to min rebuilding DOM 
/*
function loadGoogleAnalytics(){
    var ga = document.createElement('script'); 
    ga.type = 'text/javascript'; 
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-B5QNT15YS6';
	
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
}
*/
<!-- Google Tag Manager -->
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5P3F53V');
<!-- End Google Tag Manager -->

//loadGoogleAnalytics(); //Create the script 

window.dataLayer = window.dataLayer || [];

function gtag(){dataLayer.push(arguments);}

gtag('js', new Date());

//gtag('config', 'G-B5QNT15YS6');
//Confirmed with Google tag Assistant