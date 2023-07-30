const {kakao} = window;
const {daum} = window;

export function scrollToTop(){;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

export function getGeoLocation(){
    return new Promise(function (resolve) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                let loc = {
                    latitude,
                    longitude
                };

                resolve(loc);
            });
        }
    });
}

export function setMap(mapId, latitude, longitude, level){
    let imgSize = {x : 0, y: 0};

    if(level == null) level = 3;
    switch(level){
        case 7:
            imgSize.x = 20;
            imgSize.y = 20;
            break;
        default :
            imgSize.x = 40;
            imgSize.y = 40;
    }


    let mapContainer = document.getElementById(mapId),
        mapOption = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: level
        };

    let map = new kakao.maps.Map(mapContainer, mapOption);

    let imageSrc = require('../../src/img/location-pin.png'),
        imageSize = new kakao.maps.Size(imgSize.x, imgSize.y),
        imageOption = {offset : new kakao.maps.Point(imgSize.x/2, imgSize.x)};

    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    let markerPosition = new kakao.maps.LatLng(latitude, longitude);
    let marker = new kakao.maps.Marker({
        position: markerPosition,
        image : markerImage
    });

    marker.setMap(map);
    return {map, marker};
}

export function imgGend(sysCd){
    let img = '';
    let code = sysCd.lvl === 2 ? sysCd.sysCd : sysCd.upSysCd;
    switch(code){
        case 'SYS0000005' : // = FOOD
            img = 'sushi.png';
            break;
        case 'SYS0000006' : // = ACCOMODATION
            img = 'accomodation.png';
            break;
        case 'SYS0000007' : // = CAFE
            img = 'cafe.png';
            break;
        default : img = 'question.png';break;
    }

    return require(`../img/${img}`);
}

export function getDistanceMark(num){
    let distance = Math.round((Number(num) * 1000));
    let mark = 'm';
    if(distance > 999){
        distance = Math.round(distance / 100)/10;
        mark = 'km';
    }
    return distance + mark;
}
