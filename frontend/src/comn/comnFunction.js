const {kakao} = window;

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

export async function setMap(mapId, latitude, longitude, markerYn, level){
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

    const mapComp = document.getElementById(mapId);
    if(!mapComp){
        return false;
    } else {
        let mapContainer = mapComp,
            mapOption = {
                center: new kakao.maps.LatLng(latitude, longitude),
                level: level
            };

        let map = new kakao.maps.Map(mapContainer, mapOption);
        let marker;

        if(markerYn){
            let imageSrc = require('../img/location-pin.png'),
                imageSize = new kakao.maps.Size(imgSize.x, imgSize.y),
                imageOption = {offset : new kakao.maps.Point(imgSize.x/2, imgSize.x)};

            let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            let markerPosition = new kakao.maps.LatLng(latitude, longitude);
            marker = new kakao.maps.Marker({
                position: markerPosition,
                image : markerImage
            });

            await marker.setMap(map);
        }
        return {map, marker};
    }
}

export function mapLevelRadiusMatcher(radius){
    let level;
    if(radius < 2){
        level = 6;
    } else if(radius < 4){
        level = 7;
    } else if(radius < 6){
        level = 8;
    } else if(radius < 11){
        level = 9;
    } else if(radius < 23){
        level = 10;
    } else if(radius < 46){
        level = 11;
    } else if(radius < 200){
        level = 13;
    } else {
        level = 14;
    }

    return level;
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

export function getRegionFill(region) {
    let regionClass;
    switch(region){
        case '서울' :
            regionClass = 'region_fill_seoul';
            break;
        case '경기' :
            regionClass = 'region_fill_gynggi';
            break;
        case '제주' :
            regionClass = 'region_fill_jeju';
            break;
        case '강원' :
            regionClass = 'region_fill_kangwon';
            break;
        default : regionClass = 'region_fill_default';
    }

    return regionClass;
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


export function blockUI(){
    let bodyHeight = document.body.scrollHeight;
    const block = window.document.getElementById('blockUI');
    block.style.height = bodyHeight + 'px';
    block.style.display = 'block';
}

export function unBlockUI(){
    const block = window.document.getElementById('blockUI');
    block.style.display = 'none';
}