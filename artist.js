$(document).on('ready', function() {
    $('#js-btn').on('click',handleArtistRequest);
});

function getArtistUrl() {
	return "https://api.spotify.com/v1/search?type=artist&query="+$('#js-artist').val();
}

function getAlbumUrl(artistId) {
	return "https://api.spotify.com/v1/artists/" + artistId + "/albums";
}

function getAlbumTracksUrl(albumId) {
	return "https://api.spotify.com/v1/albums/"+albumId+"/tracks";
}

function handleArtistRequest(event) {
	event.preventDefault();
	ajaxRequest(getArtistUrl(),showArtist);

}

function handleAlbumRequest(event) {
	var name = event.currentTarget;
	ajaxRequest(getAlbumUrl($(name).attr('data-id')),showAlbums);
}

function handleTracksRequest(event) {
	var name = event.currentTarget;
	console.log(this);
	ajaxRequest(getAlbumTracksUrl($(name).attr('data-id')),showTracks);
}
function ajaxRequest(url,callbackSuccess, method) {
	method = method || "GET";
	$.ajax({
		type: method,
        url: url,
		success: callbackSuccess,
		error: handleError
	});	
}

function createImgElement(src,className) {
	var img = document.createElement('img');
	$(img).attr("src",src);
	$(img).attr("class",className);
	return img;
}
function createLinkElement(href,name,id) {
	var a = document.createElement('a');
	$(a).attr("href", href);
	$(a).attr("data-id",id);
	$(a).append(name);
	return a;
}

function showArtist(response) {
	$('.js-show-artist').empty();
	$('#js-show-albums').empty();
	// $('#myModal').modal('show');
	response.artists.items.forEach(function(artist) {
		var li = document.createElement('li');
		var a = createLinkElement("#",artist.name,artist.id);
		$(a).attr('class','show-albums');
		// var a = "<p class= 'show-albums' data-id="+ artist.id+">"+artist.name+"</p>";
		$(li).append("Name: ");
		$(li).append(a);
		if (artist.images.length!==0) {
			$(li).append(createImgElement(artist.images[0].url,"artist-img"));
		}
		$('.js-show-artist').append(li);
	});	
	$('.show-albums').on('click',handleAlbumRequest);
}

function showAlbums(response) {
	$('#js-show-albums').empty();
	for (i in response.items) {
		var li = document.createElement('li');
		var text = document.createTextNode(response.items[i].name);	
		$(li).attr('class','show-tracks');
		$(li).attr('data-id',response.items[i].id);
		li.appendChild(text);
		$('#js-show-albums').append(li);	
	}
	$('.show-tracks').on('click',handleTracksRequest);
}

function showTracks(response) {

    $('#myModal').modal('show');
	$('#js-album-tracks').empty();
	for (i in response.items) {
		var li = document.createElement('li');
		// var ad = document.createElement('audio');
		// var t  = document.createElement('h3');
		// $(ad).attr('src',response.items[i].preview_url);
		// $(ad).attr('controls' + ' autoplay');
		// var text = document.createTextNode(response.items[i].name);
		var track = response.items[i].name+"<audio src="+response.items[i].preview_url+" controls></audio>";
		$(li).append(track);
		// $(ad).append(t);
		// $(li).append(ad);
		$('#js-album-tracks').append(li);
	}
}
function handleError(error) {
	alert("Error!!!");
}

