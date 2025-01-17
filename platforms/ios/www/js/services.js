angular.module('MYGEOSS.services', [])

/** Species Factory
* Get all species and their data in a local json file
*/
.factory('$speciesFactory', ['$http', '$q', function($http, $q){
	var currentSpecie = ""; //object, the selected specie informations
	var obj = {};


	obj.sleep = function (milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
		    }
		}
	}

	obj.readSpeciesFile = function (file) {
		var stringData = $.ajax({
            url: file,
            async: false,
            cache: false,
            data: "timestamp=" + new Date().getTime()
        }).responseText;
		return stringData;
    }

	obj.getAll = function(area, realPath, languageCode){
	    var def = $q.defer();
        $(document).ready(function() {
          $.ajaxSetup({ cache: false });
        });
        if (area.length == 0) {
            var localSpeciesFile = realPath + "species-" + languageCode + ".json";
            return $.getJSON(localSpeciesFile).then(function(data) {
               console.log("Species loaded: " + data.species.length);
               return data;
            });
        } else {
            var localSpeciesFile = realPath + "species-" + languageCode + ".json";
            if (area.length == 1) {
                var areaSpeciesFile = realPath + "species_" + area[0].id + "-" + languageCode + ".json";
                return $.getJSON(localSpeciesFile).then(function(data1) {
                   return $.getJSON(areaSpeciesFile).then(function(data2) {
                      var generalSpeciesJSON = data1.species;
                      var areaSpeciesJSON = data2.species;
                      areaSpeciesJSON.forEach(function (element) {
                         element.area_name = area[0].name;
                         element.area_id = area[0].id;
                      });
                      temporarySpeciesList = generalSpeciesJSON.concat(areaSpeciesJSON);
                      console.log("Species loaded: " + temporarySpeciesList.length);
                      var finalSpeciesList = { "species" : temporarySpeciesList };
                      return finalSpeciesList;
                   },function(error){
                      var generalSpeciesJSON = data1.species;
                      console.log("Species loaded: " + generalSpeciesJSON.length);
                      var finalSpeciesList = { "species" : generalSpeciesJSON };
                      return finalSpeciesList;
                   });
                });
            }
            if (area.length == 2) {
                var areaSpeciesFile1 = realPath + "species_" + area[0].id + "-" + languageCode + ".json";
                var areaSpeciesFile2 = realPath + "species_" + area[1].id + "-" + languageCode + ".json";
                return $.getJSON(localSpeciesFile).then(function(data1) {
                   return $.getJSON(areaSpeciesFile1).then(function(data2) {
                      return $.getJSON(areaSpeciesFile2).then(function(data3) {
                         var generalSpeciesJSON = data1.species;
                         var areaSpeciesJSON1 = data2.species;
                         var areaSpeciesJSON2 = data3.species;
                         areaSpeciesJSON1.forEach(function (element) {
                            element.area_name = area[0].name;
                            element.area_id = area[0].id;
                         });
                         temporarySpeciesList = generalSpeciesJSON.concat(areaSpeciesJSON1);
                         areaSpeciesJSON2.forEach(function (element) {
                            element.area_name = area[1].name;
                            element.area_id = area[1].id;
                         });
                         temporarySpeciesList = temporarySpeciesList.concat(areaSpeciesJSON2);
                         console.log("Species loaded: " + temporarySpeciesList.length);
                         var finalSpeciesList = { "species" : temporarySpeciesList };
                         return finalSpeciesList;
                     },function(error){
                         // There is an error on the second local area, so I propose only the general catalogue + the first local area
                         var generalSpeciesJSON = data1.species;
                         var areaSpeciesJSON = data2.species;
                         areaSpeciesJSON.forEach(function (element) {
                            element.area_name = area[0].name;
                            element.area_id = area[0].id;
                         });
                         temporarySpeciesList = generalSpeciesJSON.concat(areaSpeciesJSON);
                         console.log("Species loaded: " + temporarySpeciesList.length);
                         var finalSpeciesList = { "species" : temporarySpeciesList };
                         return finalSpeciesList;
                     });
                   },function(error){
                        return $.getJSON(areaSpeciesFile2).then(function(data3) {
                           var generalSpeciesJSON = data1.species;
                           var areaSpeciesJSON = data3.species;
                           areaSpeciesJSON.forEach(function (element) {
                              element.area_name = area[1].name;
                              element.area_id = area[1].id;
                           });
                           temporarySpeciesList = generalSpeciesJSON.concat(areaSpeciesJSON);
                           console.log("Species loaded: " + temporarySpeciesList.length);
                           var finalSpeciesList = { "species" : temporarySpeciesList };
                           return finalSpeciesList;
                        },function(error){
                           var generalSpeciesJSON = data1.species;
                           console.log("Species loaded: " + generalSpeciesJSON.length);
                           var finalSpeciesList = { "species" : generalSpeciesJSON };
                           return finalSpeciesList;
                        });
                   });
                });
            }
            
        }
    }
    /*
    obj.getAll = function(area, realPath, languageCode){
	    var def = $q.defer();
	    var localSpeciesFile = realPath + "species-" + languageCode + ".json";
        var checkLocalSpeciesFile = $.getJSON(localSpeciesFile,
		//$http.get(localSpeciesFile).then(
	    		function(success) {
	    			var responseText = obj.readSpeciesFile(realPath + "species-" + languageCode + ".json");
	    			var generalSpeciesJSON = JSON.parse(responseText);
	    			var temporarySpeciesList = generalSpeciesJSON.species;
	    			if (area.length > 0) {
	    				area.forEach(function(entry, idx, array) {
	        				console.log("I try to verify if file for " + entry.id + " exists!");
                            console.log(realPath + "species_" + entry.id + "-" + languageCode + ".json");
	            			var responseText = obj.readSpeciesFile(realPath + "species_" + entry.id + "-" + languageCode + ".json");
	            			if ((responseText !== undefined) && (responseText != "")) {
	                			var localSpeciesJSON = JSON.parse(responseText);
	                			localSpeciesJSON = localSpeciesJSON.species;
	                			localSpeciesJSON.forEach(function (element) {
	                				element.area_name = entry.name;
	                				element.area_id = entry.id;
	                			});
	                			temporarySpeciesList = temporarySpeciesList.concat(localSpeciesJSON);
	                			generalSpeciesJSON = temporarySpeciesList;
	                			console.log("Species loaded: " + generalSpeciesJSON.length);
	                			var finalSpeciesList = { "species" : generalSpeciesJSON };
	                			if (idx == array.length-1) {
	                        		def.resolve(finalSpeciesList);
	                			}
	            			} else {
	            				console.log("File not found for " + entry.id);
	                			generalSpeciesJSON = temporarySpeciesList;
	                			console.log("Species loaded: " + generalSpeciesJSON.length);
	                			var finalSpeciesList = { "species" : generalSpeciesJSON };
	                			if (idx == array.length-1) {
	                        		def.resolve(finalSpeciesList);
	                			}
	            			}
	    				});
	    				generalSpeciesJSON = temporarySpeciesList;
	    			} else {
	    				generalSpeciesJSON = temporarySpeciesList;
	        			console.log("Species loaded: " + generalSpeciesJSON.length);
	        			var finalSpeciesList = { "species" : generalSpeciesJSON };
	            		def.resolve(finalSpeciesList);
	    			}
	    		},
	    		function(error) {
	        		def.reject(error);
	    		}
	    );
	    return def.promise;
	}
    */

	obj.setCurrentSpecie = function(specie){
		currentSpecie = specie;
	};
	obj.getCurrentSpecie = function(){
		return currentSpecie;
	};
	return obj;
}])



/* $easinFactoryREST
* Communicate with the EASIN REST API
*/
.factory('$easinFactoryREST', ['$resource','CONFIG', 'SERVER', '$cacheFactory', function ($resource, CONFIG, SERVER, $cacheFactory) {
  var customQueryCache = $cacheFactory('customQueryCache');
  return $resource(SERVER.serverApiUrl + "reports/:reportId", {reportId:'@id'},
			{
				'update': {method: 'PUT', timeout: 60000, headers:{'Content-Type': 'application/json'}},
				'get':    {method:'GET', timeout: 60000, cache: false},
				'save':   {method:'POST', timeout: 60000},
				'query':  {method:'GET', isArray:true, timeout: 90000, cache: false},
				'remove': {method:'DELETE', timeout: 10000},
				'delete': {method:'DELETE', timeout: 10000}
			}
  );
}])

.factory('$easinFactoryRESTProdHttp', ['$resource','CONFIG', 'SERVER', '$cacheFactory', function ($resource, CONFIG, SERVER, $cacheFactory) {
  var customQueryCache = $cacheFactory('customQueryCacheProdHttp');
  return $resource(CONFIG.serverProdApiUrlHttp + "reports/:reportId", {reportId:'@id'},
			{
				'update': {method: 'PUT', timeout: 60000, headers:{'Content-Type': 'application/json'}},
				'get':    {method:'GET', timeout: 60000, cache: false},
				'save':   {method:'POST', timeout: 60000},
				'query':  {method:'GET', isArray:true, timeout: 90000, cache: false},
				'remove': {method:'DELETE', timeout: 10000},
				'delete': {method:'DELETE', timeout: 10000}
			}
  );
}])

.factory('$easinFactoryRESTProdHttps', ['$resource','CONFIG', 'SERVER', '$cacheFactory', function ($resource, CONFIG, SERVER, $cacheFactory) {
  var customQueryCache = $cacheFactory('customQueryCacheProdHttps');
  return $resource(CONFIG.serverProdApiUrlHttps + "reports/:reportId", {reportId:'@id'},
			{
				'update': {method: 'PUT', timeout: 60000, headers:{'Content-Type': 'application/json'}},
				'get':    {method:'GET', timeout: 60000, cache: false},
				'save':   {method:'POST', timeout: 60000},
				'query':  {method:'GET', isArray:true, timeout: 90000, cache: false},
				'remove': {method:'DELETE', timeout: 10000},
				'delete': {method:'DELETE', timeout: 10000}
			}
  );
}])

.factory('$easinFactoryRESTTestHttp', ['$resource','CONFIG', 'SERVER', '$cacheFactory', function ($resource, CONFIG, SERVER, $cacheFactory) {
  var customQueryCache = $cacheFactory('customQueryCacheTestHttp');
  return $resource(CONFIG.serverTestApiUrlHttp + "reports/:reportId", {reportId:'@id'},
			{
				'update': {method: 'PUT', timeout: 60000, headers:{'Content-Type': 'application/json'}},
				'get':    {method:'GET', timeout: 60000, cache: false},
				'save':   {method:'POST', timeout: 60000},
				'query':  {method:'GET', isArray:true, timeout: 90000, cache: false},
				'remove': {method:'DELETE', timeout: 10000},
				'delete': {method:'DELETE', timeout: 10000}
			}
  );
}])

.factory('$easinFactoryRESTTestHttps', ['$resource','CONFIG', 'SERVER', '$cacheFactory', function ($resource, CONFIG, SERVER, $cacheFactory) {
  var customQueryCache = $cacheFactory('customQueryCacheTestHttps');
  return $resource(CONFIG.serverTestApiUrlHttps + "reports/:reportId", {reportId:'@id'},
			{
				'update': {method: 'PUT', timeout: 60000, headers:{'Content-Type': 'application/json'}},
				'get':    {method:'GET', timeout: 60000, cache: false},
				'save':   {method:'POST', timeout: 60000},
				'query':  {method:'GET', isArray:true, timeout: 90000, cache: false},
				'remove': {method:'DELETE', timeout: 10000},
				'delete': {method:'DELETE', timeout: 10000}
			}
  );
}])

/* $easinFactoryRESTUser
* Communicate with the EASIN REST API (user)
*/
.factory('$easinFactoryRESTUser', ['$resource','CONFIG', 'SERVER', '$cacheFactory', function ($resource, CONFIG, SERVER, $cacheFactory) {
  var customQueryCache = $cacheFactory('customQueryCacheUser');
  //console.log("CALL: " + SERVER.serverApiUrl + "reports/user/" + $scope.userLoggedMD5);
	return $resource(SERVER.serverApiUrl + "reports/user/:userId", {userId:'@id'},
		{
			'update': {method: 'PUT', timeout: 60000, headers:{'Content-Type': 'application/json'}},
			'get':    {method:'GET', timeout: 60000, cache: false},
			'save':   {method:'POST', timeout: 60000},
			'query':  {method:'GET', isArray:true, timeout: 90000, cache: false},
			'remove': {method:'DELETE', timeout: 10000},
			'delete': {method:'DELETE', timeout: 10000}
		}
	);
}])

/* $photoFactory
*
*/
.factory('$photoFactory', ['$q', '$cordovaCamera', '$cordovaFile', '$cordovaDevice', function($q, $cordovaCamera, $cordovaFile, $cordovaDevice){
  var obj = {};

  var optionsCameraCamera;
  var optionsCameraLibrary;

    //init option here, to avoid the Camera load in the injection before the device is ready
    obj.initOptionsCameraCamera = function(){
      optionsCameraCamera = {
        quality : 75,
        //destinationType : Camera.DestinationType.FILE_URI,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth : 800,
        targetHeight: 800,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        saveToPhotoAlbum: true, //true provok an error on android...
        allowEdit: false
      };
    };

    obj.initOptionsCameraLibrary = function(){
      optionsCameraLibrary = {
        quality : 75,
        //destinationType : Camera.DestinationType.FILE_URI,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth : 800,
        targetHeight: 800,
        correctOrientation: false,
        //sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false,
        allowEdit: false
      }
    };

    obj.photoCamera = function(){
      var def = $q.defer();
      ionic.Platform.ready(function() {
          $cordovaCamera.getPicture(optionsCameraCamera).then(
            function(imageData){
               console.log('success photoCamera');
               console.log(imageData);
               def.resolve(imageData);
            },
            function(error){
               console.error('error photoCamera');
               console.error(error);
               def.reject(error);
            }
          );
      });
      return def.promise;
    };

    obj.photoLibrary = function(){
      var def = $q.defer();
      ionic.Platform.ready(function() {
          $cordovaCamera.getPicture(optionsCameraLibrary).then(
           function(imageData){
              console.log('success photoLibrary');
              //console.log(imageData);
			  console.log("Image base64");
              def.resolve(imageData);
            },
            function(error){
               console.log('error photoLibrary');
               console.log(error);
               def.reject(error);
            }
          );
      });
      return def.promise;
    };

    obj.removePhoto = function(path, file){ //convert into BASE64
      var def = $q.defer();
      ionic.Platform.ready(function() {
          $cordovaFile.removeFile(path, file).then(
            function(success){
              //console.log("Success remove picture : "+path+file);
              def.resolve(success);
            },
            function(error){
              //console.error("Error remove picture : "+path+file);
              def.reject(error);
            }
          );
      });
      return def.promise;
    };

    obj.movePhoto = function(path, file, newPath, newFile){
      var def = $q.defer();
      ionic.Platform.ready(function() {
          $cordovaFile.moveFile(path, file, newPath, newFile).then(
            function(success){
              //console.log("Success move picture : "+path+file+" to "+newPath+newFile);
              def.resolve(success);
            },
            function(error){
              console.error(error);
              //console.error("Error move picture : "+path+file+" to "+newPath+newFile);
              def.reject(error);
            }
          );
      });
      return def.promise;
    };

    obj.readAsDataURL = function(path, file){ //convert into BASE64
      var def = $q.defer();
      ionic.Platform.ready(function() {
          $cordovaFile.readAsDataURL(path, file).then(
            function(success){
              console.log("Success read data as url");
              def.resolve(success);
            },
            function(error){
              console.log("Error read data as url");
              def.reject(error);
            }
          );
      });
      return def.promise;
    };

    obj.generateName = function(){
      var len = 15;
      var arr = "abcdefghilmnopqrstuvzwyjkx";
      var ans = "temp_";
      for (var i=len; i>0; i--) {
          ans+=
          arr[Math.floor(Math.random() * arr.length)];
      }
      return ans;
      //var date = new Date();
      //name = date.getTime();
      //return name;
    };

    obj.getLibraryPathAndroid = function(data){
      var deferred = $q.defer();
      ionic.Platform.ready(function() {
        if($cordovaDevice.getPlatform() === 'Android'){

          //plugin https://www.npmjs.com/package/cordova-plugin-filepath
          //deferred.resolve(data);
          window.FilePath.resolveNativePath(data, function(result) {
            //console.log("resolveNativePath");
            //console.log(result);
            deferred.resolve(result);
            //deferred.resolve('file://' + result);
          }, function (error) {
            console.error('resolveNativePath');
            console.error(error);
              deferred.reject('error convert uri android');
          });
          //deferred.resolve(data);
        }else{
          deferred.resolve(data);
        }
      });
      return deferred.promise;
    }

    return obj;
}])

/** $easinFactory
* Utils functions to manage data with the $easinFactoryREST
*
* @param {string} LSID - The specie LSID identifier
* @param {string} ICCID - Use device UUID
* @param {string} Abundance - Abundance of the specie, scale + number
* @param {string} Precision - Estimated or Measured count
* @param {string} Comment - Comment field + habitat radio button
* @param {Object[]} Images - Array of images
* @param {string} Images[].path - Path of the file in the system
* @param {string} Images[].file - File's name + extension
* @param {boolean} Anonymous - If the observation is sent anonymous or not
* @param {Object[]} coordinates - Array of coordinates
* @param {number} coordinates[0] - Latitude
* @param {number} coordinates[1] - Longitude
* @param {string} geometryType - Type of the geomtrique object (for the moment only Point)
*/
.factory('$easinFactory', ['$q', '$easinFactoryREST', '$easinFactoryRESTProdHttp', '$easinFactoryRESTProdHttps', '$easinFactoryRESTTestHttp', '$easinFactoryRESTTestHttps', 'SERVER', 'CONFIG', '$photoFactory', '$authenticationFactory', '$easinFactoryLocal', function($q, $easinFactoryREST, $easinFactoryRESTProdHttp, $easinFactoryRESTProdHttps, $easinFactoryRESTTestHttp, $easinFactoryRESTTestHttps, SERVER, CONFIG, $photoFactory, $authenticationFactory, $easinFactoryLocal){
  var obj = {};

  obj.sendObservation = function(LSID, ICCID, ObservedAt, Abundance, Precision, Comment, Images, Anonymous, coordinates, geometryType, pendingID){
    //config application/json!!!
    var def = $q.defer();
    var specieObservation = {
      "properties": "",
      "geometry": "",
      "type": "",
      "source": "",
      "observedAt": ""
    };
    var convertedBase64 = [];
    var promiseDeletePhoto = [];

    if (arguments.length < 9){
      def.reject('Missing parameters');
    }

    //Images conversion into array of base64 pictures
    var arrayPromise = [];
    var i = 0;
    while (i < Images.length){
      //console.log('images: '+Images[i].path+""+Images[i].file);
      if (Images[i].hasOwnProperty('content')) {
        arrayPromise.push(Images[i].content);
      } else {
        arrayPromise.push($photoFactory.readAsDataURL(cordova.file.dataDirectory, Images[i].file));
      }
      i++;
    }

                           //dataSuccess = arrayPromise;

    $q.all(arrayPromise).then(
      function(dataSuccess){
                           //console.log("Punto 1");
        var i = 0;
        while (i < dataSuccess.length){
          convertedBase64.push(dataSuccess[i]);
          i++;
        }
        var OAUTHID = $authenticationFactory.getUserEmailReport();
        var appVersion;
        var catVersion;

                           //console.log("Punto 2");
                           //'cdvfile://localhost/files/'
	  	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(entry) {
	  		var nativePath = entry.toURL();
                                         //console.log(nativePath);
			var dataJsonTable = $.getJSON(nativePath + "last_version.json", function (dataJSON){
				catVersion = dataJSON;
                                          //console.log(catVersion);
				var dataJsonTable = $.getJSON("data/appVersion.json", function (dataJSON){
					appVersion = dataJSON;
                                              //console.log(appVersion);
					//console.log(JSON.stringify(catVersion));
					//console.log(JSON.stringify(appVersion));

                                              //console.log("Punto 3");
				var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
					var hashOAUTHID = (MD5(OAUTHID));

                                              //console.log("Punto 4");
					specieObservation = {
			                "properties": {
			                  "LSID": LSID,
			                  "ICCID": ICCID,
			                  "OAUTHID": OAUTHID,
			                  "Abundance": Abundance,
			                  "Precision": Precision,
			                  "Comment": Comment,
			                  "Image": convertedBase64,
			                  "Status": "Submitted",
			                  "Anonymous": Anonymous,
			                  "hashOAUTHID": hashOAUTHID
			                },
			                "geometry" : {
			                  "coordinates": coordinates,
			                  "type": geometryType
			                },
			                "source" : {
			              	  "type" : 0,
			              	  "release" : appVersion.version,
			              	  "catalog" : catVersion.catalog,
			              	  "version" : catVersion.version
			                },
			                "type": "Feature",
			                "observedAt": ObservedAt
			              };

						  //console.log(SERVER.serverApiUrl);
						  //console.log("Punto 5");
						  var easinFactoryREST;
						  if (SERVER.serverApiUrl == CONFIG.serverProdApiUrlHttp) easinFactoryREST = $easinFactoryRESTProdHttp;
						  if (SERVER.serverApiUrl == CONFIG.serverProdApiUrlHttps) easinFactoryREST = $easinFactoryRESTProdHttps;
						  if (SERVER.serverApiUrl == CONFIG.serverTestApiUrlHttp) easinFactoryREST = $easinFactoryRESTTestHttp;
						  if (SERVER.serverApiUrl == CONFIG.serverTestApiUrlHttps) easinFactoryREST = $easinFactoryRESTTestHttps;
                          //console.log(SERVER.serverApiUrl);
                          //if (pendingID !== null) {
                          //   console.log("Pending observation sent. ID: " + pendingID);
                          //    $easinFactoryLocal.deleteObservation(pendingID);
                          //}
						  easinFactoryREST.save(specieObservation, function(){
                              if (pendingID !== null) $easinFactoryLocal.deleteObservation(pendingID);
					      	  def.resolve("Data sent to the server");
					      }, function(error){
					    	  console.error(error);
					          //console.error(angular.toJson(specieObservation));
					          def.reject("Error sending data to the server");
                          })
				});
			});
		});

//

      },
      function(error){
        def.reject(error[i]);
      }
    );

    return def.promise;
  };

  return obj;
}])

/** $easinFactoryLocal
* Utils functions to manage easin data in local
*/
.factory('$easinFactoryLocal', ['$q', '$cordovaSQLite', '$dataBaseFactory', '$photoFactory', function($q, $cordovaSQLite, $dataBaseFactory, $photoFactory){
  var obj = {};

  obj.saveObservation = function(specie, images, coordinates, date, abundance, habitat, comment, status){
    var def = $q.defer();

    //change position of the pictures
    var arrayPromise = [];
    var i = 0;
    while (i < images.length){
      //console.log('images: '+images[i].path+""+images[i].file);
      var newFile = $photoFactory.generateName()+".jpg";
      //var dataDirectory = cordova.file.dataDirectory;
      //dataDirectory = dataDirectory.replace("file://","");
      //images[i].path = dataDirectory;
      //console.log(dataDirectory);
      arrayPromise.push($photoFactory.movePhoto(cordova.file.dataDirectory, images[i].file, cordova.file.dataDirectory, newFile));
      images[i].file = newFile;
      i++;
    }

    $q.all(arrayPromise).then(
      function(success){
        var query = "INSERT INTO reports (specie, images, coordinates, date, abundance, habitat, comment, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $cordovaSQLite.execute($dataBaseFactory.get(), query, [angular.toJson(specie), angular.toJson(images), angular.toJson(coordinates), date, angular.toJson(abundance), habitat, comment, status]).then(
          function(success){
            def.resolve("Entry saved in the database");
          },
          function(error){
            def.reject("Error saving observation in the database");
          }
        );
      },
      function(error){
        def.reject(error);
      }
    );
    return def.promise;
  };

  obj.updateObservation = function(specie, images, coordinates, date, abundance, habitat, comment, status, id){
    var def = $q.defer();

    //change position of the pictures
    var arrayPromise = [];
    var i = 0;
    while (i < images.length){
    //console.log('images: '+images[i].path+""+images[i].file);
        var newFile = $photoFactory.generateName()+".jpg";
        //images[i].path = cordova.file.dataDirectory;
        arrayPromise.push($photoFactory.movePhoto(cordova.file.dataDirectory, images[i].file, cordova.file.dataDirectory, newFile));
        images[i].file = newFile;
        i++;
    }

    $q.all(arrayPromise).then(
      function(success){
        var query = "UPDATE reports SET specie = ?, images = ?, coordinates = ?, date = ?, abundance = ?, habitat = ?, comment = ?, status = ? WHERE id = '"+id+"'";
        $cordovaSQLite.execute($dataBaseFactory.get(), query, [angular.toJson(specie), angular.toJson(images), angular.toJson(coordinates), date, angular.toJson(abundance), habitat, comment, status]).then(function(res) {
            def.resolve("Report updated");
        }, function (err) {
            console.error(err);
            def.reject("Update report error : "+ err);
        });
      },
      function(error){
        def.reject(error);
      }
    );
    return def.promise;
  };

  obj.updateObservationStatus = function(id, status){
    var def = $q.defer();
    var query = "UPDATE reports SET status = ? WHERE id = '"+id+"'";

    $cordovaSQLite.execute($dataBaseFactory.get(), query, [status]).then(function(res) {
        def.resolve("Report updated");
    }, function (err) {
        console.error(err);
        def.reject("Update report error : "+ err);
    });
    return def.promise;
  };

  obj.getObservationByID = function(id){
    var def = $q.defer();
    var query = "SELECT * FROM reports WHERE id='"+id+"'";

    $cordovaSQLite.execute($dataBaseFactory.get(), query, []).then(function(res) {
        if(res.rows.length > 0) {
          var report = {};
            for(var i = 0; i < res.rows.length; i++) {
                report = {id: res.rows.item(i).id, specie: res.rows.item(i).specie, images: res.rows.item(i).images, coordinates: res.rows.item(i).coordinates, date: res.rows.item(i).date, abundance: res.rows.item(i).abundance, habitat: res.rows.item(i).habitat, comment: res.rows.item(i).comment, status: res.rows.item(i).status};
            }
            def.resolve(report);
        } else {
            console.log("No result found");
            def.reject("No result");
        }
    }, function (err) {
        console.error(err);
        def.reject("Request error : "+ err);
    });
    return def.promise;
  };

  obj.getObservationByIDStatus = function(id, status){
    var def = $q.defer();
    var query = "SELECT * FROM reports WHERE id='"+id+"' AND status='"+status+"'";

    $cordovaSQLite.execute($dataBaseFactory.get(), query, []).then(function(res) {
        if(res.rows.length > 0) {
          var report = {};
            for(var i = 0; i < res.rows.length; i++) {
                report = {id: res.rows.item(i).id, sob: res.rows.item(i).sob, status: res.rows.item(i).status};
            }
            def.resolve(report);
        } else {
            console.log("No result found");
            def.reject("No result");
        }
    }, function (err) {
        console.error(err);
        def.reject("Request error : "+ err);
    });
    return def.promise;
  };

  obj.getAllObservation = function(){
    var def = $q.defer();
    var query = "SELECT * FROM reports";
    var arrayObservation = [];

    $cordovaSQLite.execute($dataBaseFactory.get(), query, []).then(function(res) {
        if(res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {
                arrayObservation.push(res.rows.item(i));
            }
            def.resolve(arrayObservation);
        } else {
            def.reject("No result");
        }
    }, function (err) {
        console.error(err);
        def.reject("Request error : "+ err);
    });
    return def.promise;
  };

  obj.getAllObservationByStatus = function(status){
    var def = $q.defer();
    var query = "SELECT * FROM reports WHERE status = '"+status+"'";
    var arrayObservation = [];

    $cordovaSQLite.execute($dataBaseFactory.get(), query, []).then(function(res) {
        if(res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {
                arrayObservation.push(res.rows.item(i));
            }
            def.resolve(arrayObservation);
        } else {
            //console.log("No result found");
            def.reject("No result");
        }
    }, function (err) {
        console.error(err);
        def.reject("Request error : "+ err);
    });
    return def.promise;
  };

  obj.deleteObservation = function(id){
    //console.log("ID in cancellazione: " + id);
    var def = $q.defer();
    obj.getObservationByID(id).then(
      function(entryToDelete){
        var images = angular.fromJson(entryToDelete.images);
        var query = "DELETE FROM reports WHERE id='"+id+"'";

        $cordovaSQLite.execute($dataBaseFactory.get(), query, []).then(function(res) {
          //Entry removed, next photo to delete :
          var arrayPromise = [];
          var i = 0;
          while(i < images.length){
            arrayPromise.push($photoFactory.removePhoto(cordova.file.dataDirectory, images[i].file));
            i++;
          }
          if (arrayPromise.length > 0){
            $q.all(arrayPromise).then(
              function(success){
                console.log("entry + photo removed");
                def.resolve("Entry deleted");
              },
              function(err){
                console.log("entry removed , error photo removed");
                def.resolve("Entry deleted");
              }
            );
          }else{
             console.log("Entry deleted no photo");
            def.resolve("Entry deleted");
          }

        }, function (err) {
            console.error(err);
            def.reject("Delete entry error : "+ err);
        });
      },
      function(error){

      }
    );

    return def.promise;
  };

  return obj;
}])

/** $dataBaseFactory
* Utils functions to manage data in local db
*/
.factory('$dataBaseFactory', ['$q', '$cordovaSQLite', function($q, $cordovaSQLite){
  var obj = {};

  var db;

  obj.get = function(){
    return db;
  };

  obj.set = function(database){
    db = database;
  };

  return obj;
}])

/** $staticContent
* To retrieve the localised translated content from either the local file, database either form the server
*/
.factory('$staticContent', ['$q', '$dataBaseFactory', '$cordovaSQLite', '$http', 'CONFIG', 'SERVER', function($q, $dataBaseFactory, $cordovaSQLite, $http, CONFIG, SERVER){
  var obj = {};

  obj.getDatabaseContent = function(item, langCode){
    var def = $q.defer();

    var query = "SELECT * FROM static WHERE name = ? AND lang = ?";
    $cordovaSQLite.execute($dataBaseFactory.get(), query, [item, langCode]).then(function(success){
      if(success.rows.length > 0){
        def.resolve(success.rows.item(0));
      }else{
        def.resolve('no result');
      }
    }, function(error){
      def.reject(error);
    });

    return def.promise;
  };

  obj.setDatabaseContent = function(item, langCode, content){
    var def = $q.defer();
		// new Date().getTime()
    var query = "INSERT INTO static (name, lang, date, html) VALUES (?, ?, ?, ?)";
    $cordovaSQLite.execute($dataBaseFactory.get(), query, [item, langCode, CONFIG.staticFileTimestamp, content]).then(function(success){
      def.resolve('content added');
    }, function(error){
      def.reject(error);
    });

    return def.promise;
  };

	obj.updateDatabaseContent = function(item, langCode, content, dateupdate){
    var def = $q.defer();
	console.log(content);
    var query = "UPDATE static SET html = ?, date = ? WHERE name = ? AND lang = ?";
	var currTime = new Date().getTime();
    $cordovaSQLite.execute($dataBaseFactory.get(), query, [content, dateupdate, item, langCode]).then(function(success){
	  console.log("DATA UPDATED!");
      def.resolve('updated');
    }, function(error){
	  console.log("DATA NOT UPDATED! " + JSON.stringify(error));
      def.reject(error);
    });

    return def.promise;
  };

	function timeConverter(UNIX_timestamp){
	  var a = new Date(UNIX_timestamp);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	  return time;
	}

	obj.getStatic = function(item, lang){
    var def = $q.defer();
	console.log(CONFIG.staticFileContentURL+lang+"/"+item+".html");

    obj.getDatabaseContent(item, lang).then(function(dbEntry){
	  console.log("dbEntry: " + dbEntry);
      if (dbEntry == "no result"){ //if the entry does not exist yet in DB
        $http.get("./data/static/"+lang+"/"+item+".html", {cache: false, timeout: 5000}).then(function(success){
          obj.setDatabaseContent(item, lang, success.data);
          def.resolve(success.data);
        });
      }else{ // if entry already exist -> check with server date and update if needed.
        $http({method: 'HEAD',url: CONFIG.staticFileContentURL+lang+"/"+item+".html", cache: false, timeout: 5000}).then(
          function(serverHeader){
            var headers = serverHeader.headers();
            var lastmod = headers['last-modified'];

            //console.log("serverHeader", serverHeader);
            console.log("dbEntry.date", dbEntry.date);
            //console.log("lastmod", lastmod);

			dayLastMod = lastmod.substring(5,7);
			monthLastMod = lastmod.substring(8,11);
			yearLastMod = lastmod.substring(12,16);
			hourLastMod = lastmod.substring(17,19);
			minLastMod = lastmod.substring(20,22);
			secLastMod = lastmod.substring(23,25);
			if (monthLastMod == "Jan") monthLastMod = "00";
			if (monthLastMod == "Feb") monthLastMod = "01";
			if (monthLastMod == "Mar") monthLastMod = "02";
			if (monthLastMod == "Apr") monthLastMod = "03";
			if (monthLastMod == "May") monthLastMod = "04";
			if (monthLastMod == "Jun") monthLastMod = "05";
			if (monthLastMod == "Jul") monthLastMod = "06";
			if (monthLastMod == "Aug") monthLastMod = "07";
			if (monthLastMod == "Sep") monthLastMod = "08";
			if (monthLastMod == "Oct") monthLastMod = "09";
			if (monthLastMod == "Nov") monthLastMod = "10";
			if (monthLastMod == "Dec") monthLastMod = "11";
			var datum = new Date(Date.UTC(yearLastMod, monthLastMod, dayLastMod, hourLastMod, minLastMod, secLastMod));
			//datum.setHours(datum.getHours()+2);
            lastmod = datum.getTime();
			console.log(timeConverter(dbEntry.date));
			console.log("lastmod", lastmod);
			console.log(timeConverter(lastmod));
			var dateNow = new Date();
			console.log(dateNow.getTime());

            if (lastmod>dbEntry.date) {
			  console.log("Update '" + item + "' from the server");
              $http.get(CONFIG.staticFileContentURL+lang+"/"+item+".html", {cache: false, timeout: 5000}).then(function(success){
            	//console.log("ITEM: " + item);
            	//console.log("LANG: " + lang);
            	//console.log("DATA: " + success.data);
                obj.updateDatabaseContent(item, lang, success.data, lastmod);
                def.resolve(success.data);
              }, function(error){
                console.error("Error " + CONFIG.staticFileContentURL+lang+"/"+item+".html", error);
                // $http.get("./data/static/"+lang+"/"+item+".html", {cache: true, timeout: 5000}).then(function(success){
                //   def.resolve(success.data);
                // });
                def.resolve(dbEntry.html);
              });
            }else{
              def.resolve(dbEntry.html);
            }
          }, function(error){
            // $http.get("./data/static/"+lang+"/"+item+".html", {cache: true, timeout: 5000}).then(function(success){
            //   def.resolve(success.data);
            // });
            def.resolve(dbEntry.html);
          }
        );
      }
    }, function(error){
      // $http.get("./data/static/"+lang+"/"+item+".html", {cache: true, timeout: 5000}).then(function(success){
      //   def.resolve(success.data);
      // });
      def.resolve(dbEntry.html);
    })

    return def.promise;
  };


  return obj;
}])


/* $geolocationFactory
* Get device coordinates or by default center of EU
*/
.factory('$geolocationFactory', ['$cordovaGeolocation', '$q', '$localstorage', function($cordovaGeolocation, $q, $localstorage){
	var obj = {};

	//timeout	Number	Maximum length of time (milliseconds) that is allowed to pass
  //maximumAge	Number	Accept a cached position whose age is no greater than the specified time in milliseconds
  //enableHighAccuracy	Boolean	Provides a hint that the application needs the best possible results
	var posOptions = {timeout: 5000, maximumAge: 3600000, enableHighAccuracy: true};
	var defaultCoordinate = {longitude: 9.254419, latitude: 50.102223} //GeoHack - Geographical Centre of EU in Westerngrund (28 members including Mayotte since 10 May 2014)

	obj.get = function(){
		var def = $q.defer();
		ionic.Platform.ready(function() {
			$cordovaGeolocation.getCurrentPosition(posOptions).then(
				function(success){
					var coordinates = {longitude: success.coords.longitude, latitude: success.coords.latitude};
					def.resolve(coordinates);
				},
				function(error){
					def.reject(defaultCoordinate);
					//alert(error.code);
					//alert(error.message);
					$("#coord-icon").show();
				}
			);
		});

		return def.promise;
	};

	return obj;
}])

/* $dateFactory
* Device DatePicker
*/
.factory('$dateFactory', ['$q', '$cordovaDatePicker', function($q, $cordovaDatePicker){
	var obj = {};

	//var minDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();
	var dateOption = {
      date: new Date(),
      mode: 'date', // or 'time'
      //minDate: minDate,
      allowOldDates: true,
      allowFutureDates: false,
      doneButtonLabel: 'OK',
      doneButtonColor: '#000000',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };

    obj.datePicker = function(){
		var def = $q.defer();
      	ionic.Platform.ready(function() {
        	$cordovaDatePicker.show(dateOption).then(function(date){
        		dateOption.date = date || new Date(); //restart plugin to avoid string conversation the second time, who provok a bug on android
          		def.resolve(date);
       		}, function(error){
       			def.reject(new Date());
       		});
     	});
     	return def.promise;
    };

  return obj;

}])


/* $networkFactory
* Network states
*/
.factory('$networkFactory', ['$cordovaNetwork', function($cordovaNetwork){
  var obj = {};

  var online;

  obj.getNetworkState = function(){
    return online;
  };

  obj.setNetworkState = function(state){
    online = state;
  };

  return obj;

}])

.factory('$authenticationFactory', ['$q', '$http', '$localstorage', 'CONFIG', 'SERVER', function($q, $http, $localstorage, CONFIG, SERVER){
  var obj = {};

  // Public key should be generate into a pem file format, externally of the application, for more performance.
  // Generate public key from modulus and exponent
  obj.public_key = "";

  obj.getPublicKey = function(){
    if (obj.public_key === "" || obj.public_key === undefined){
      var crypt = new JSEncrypt();
      var publicKey = "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqZZI99xwooITwDRP/8BE\nvJ+nWIZj/h9a/HXTQAXSJ3k3GTzPQZWydcVjCs02QfoScMKVTojEvnMhDaEk7QBt\nw6l6pk7A2RQtePjF003zm0RKIHV9TYRgkq07v0ZFw5pBK0aa1oN5iFXnIlrkXmOk\nYea/QuZPKM2deKev+bdksTDsmVJIw4J5+J66AYCPY8/Lfocn/rvL/oCd+1xFx76u\nT0s9mK3K2izRsPpH+CFnVHYhqNyYPwtzX6ipOIDAAx3xsRisCcdpidp2teIGcaQN\nTg8RDBlffFxxJcv9ksPN6tK3xvfMyb0a/tihzle/abTKcKfQYu3HPCUfvbV1pZGu\n5gQKibInU61l0xu+Wpke5R8MNvOaa394YmVFZua2m7vrZm3Q9m6AA2OEmitivjvb\nZCAadivwFdN0feUuRdaD+kpuMfd/eqHD+fb1qJoTMqcRhFucSrW9ejB+Jvg4PdXu\n5GrDNEIVXrGeM3/CMYyMkPxOwT74cmPtHEdWRDa7IDB0Brq8Sy3nd40sjG6JuwNc\n4njRWDys5J7CUN+R0dcVUbC04IKuXJU2ODBLragBQRVyHA8TlC63JtwfPwTloiUF\n+B+w/Tl544poNgHTYDnA1L3+eZhs82JT1wf6jL6kW8i+K016+QOaNC8VJqOGOa5e\nhvRUTXhtiapvep3RsQrBpzMCAwEAAQ==\n-----END PUBLIC KEY-----";
      crypt.setKey(publicKey);
      obj.public_key = crypt;
    }
    return obj.public_key;
  };

  obj.encryptData = function(jsonData){
    var encrypt = obj.getPublicKey();
    var encrypted = encrypt.encrypt(jsonData);

    return encrypted;
  };

  obj.getSession = function(){
    if ($localstorage.get('sessionToken') === undefined || $localstorage.get('sessionToken') === 'undefined'){
      var session = {
        sessionToken: "",
        timestamp: 0,
        logged: false
      };
      obj.setSession(session);
    }
    return $localstorage.getObject('sessionToken');
  };

  obj.setSession = function(sessionToken){
    $localstorage.setObject('sessionToken', sessionToken);
    /*{
      sessionToken:
      timestamp:

    }*/
  };

  obj.updateSession = function(sessionToken, timestamp, logged){
    var session = {
      sessionToken: sessionToken,
      timestamp: timestamp, //maybe manually setup the timestamp wen logout
      logged: logged
    };
    obj.setSession(session);
    return session;
  };

  obj.setUser = function(user){
    $localstorage.setObject('user', user);
  };

  obj.getUser = function(){
    if ($localstorage.get('user') === undefined || $localstorage.get('user') === 'undefined'){
      var user = {
        username: "",
        firstname: "",
        lastname: "",
        email: ""
      };
      obj.setUser(user);
    }
    return $localstorage.getObject('user');
  };

  obj.updateUser = function(user){
    obj.setUser(user);
    return user;
  };

  obj.expiredTimestamp = function(sessionTimestamp){
    if ((new Date().getTime() -sessionTimestamp) < CONFIG.sessionExpirationTime){
      return false;
    }else{
      return true;
    }
  };

  obj.checkSessionLocal = function(){
    var session = obj.getSession();
    if (session.logged === false || obj.expiredTimestamp(session.timestamp) === true){
      obj.updateSession('', 0, false);
      return false;
    }else{
      return true;
    }
  };

  /* User's mail to send in the report, as of now it will be managed in the controller, this will be change when we will use/manage the user */
  obj.getUserEmailReport = function(){
    if ($localstorage.get('userEmailReport') === undefined || $localstorage.get('userEmailReport') === 'undefined'){
      obj.setUserEmailReport('');
    }
    return $localstorage.get('userEmailReport');
  };

  obj.setUserEmailReport = function(userEmail){
    $localstorage.set('userEmailReport', userEmail);
  };

  /* User's provider used to login */
  obj.getUserProviderLogin = function(){
    if ($localstorage.get('userProviderLogin') === undefined || $localstorage.get('userProviderLogin') === 'undefined'){
      obj.setUserProviderLogin('');
    }
    return $localstorage.get('userProviderLogin');
  };

  obj.setUserProviderLogin = function(userProviderLogin){
    $localstorage.set('userProviderLogin', userProviderLogin);
  };

  /* GetNonce
   * Nonce is the random number to exchange before each other call */
  obj.getNonce = function(){
    var def = $q.defer();
    var timestamp = new Date().getTime();
    var appSecret = "EASIN::MOBILE::APP::SECRET"; //find a secure way

    var postData = {
      TimeStamp:  timestamp,
      AppSecret: appSecret
    };

    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };


    //def.resolve(obj.encryptData(angular.toJson(postData)));
    $http.post(SERVER.authenticationBaseURL+"mobile/GenNonce", "\""+obj.encryptData(angular.toJson(postData))+"\"", config).then(
      function(success){
        def.resolve(success.data);
      },
      function(error){
        def.reject(error);
      }
    );
    return def.promise;
  };

  /* Registration
   * -- */
  obj.registration = function(email, username, name, surname, password, confirmPassword){
    var def = $q.defer();
    var appSecret = "EASIN::MOBILE::APP::SECRET"; //find a secure way

    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    obj.getNonce().then(
      function(success){
        var postData = {
          Email: email,
          UserName: username,
          Name: name,
          Surname: surname,
          Password: password,
          ConfirmPassword: confirmPassword,
          AppSecret: appSecret,
          GotNonce: success.NonceNumber
        };
        //nonce = success.NonceNumber;
        //console.log(postData);
        $http.post(SERVER.authenticationBaseURL+"mobile/register", "\""+obj.encryptData(angular.toJson(postData))+"\"", config).then(
          function(success){
            //session token
            console.log("registration OK");
            //console.log(success);
            def.resolve(success.data);
          },
          function(error){
            console.error('error registration');
            //console.error(error);
            def.reject(error);
          }
        );
      },
      function(error){
        def.reject();
      }
    );
    return def.promise;
  };

  /* Login
   * -- */
  obj.login = function(email, password){
    var def = $q.defer();
    var appSecret = "EASIN::MOBILE::APP::SECRET"; //find a secure way

    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    obj.getNonce().then(
      function(success){
        var postData = {
          Email: email,
          Password: password,
          AppSecret: appSecret,
          GotNonce: success.NonceNumber
        };
        $http.post(SERVER.authenticationBaseURL+"mobile/login", "\""+obj.encryptData(angular.toJson(postData))+"\"", config).then(
          function(success){
            //session token
            def.resolve(success.data);
          },
          function(error){
            def.reject(error);
          }
        );
      },
      function(error){
        def.reject();
      }
    );
    return def.promise;
  };

  /* Check Session
   * -- */
  obj.checkSession = function(token){
    var def = $q.defer();
    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    $http.post(SERVER.authenticationBaseURL+"mobile/checksession", "\""+token+"\"", config).then(
      function(success){
        //session token
        def.resolve(success.data);
      },
      function(error){
        def.reject(error);
      }
    );

    return def.promise;
  };

  /* Change Password
   * -- */
  obj.changePassword = function(email, oldPassword, newPassword, confirmPassword){
    var def = $q.defer();
    var appSecret = "EASIN::MOBILE::APP::SECRET";

    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    obj.getNonce().then(
      function(success){
        var postData = {
          Email: email,
          AppSecret: appSecret,
          GotNonce: success.NonceNumber,
          OldPassword: oldPassword,
          NewPassword: newPassword,
          ConfirmPassword: confirmPassword
        };
        $http.post(SERVER.authenticationBaseURL+"mobile/changepwd", "\""+obj.encryptData(angular.toJson(postData))+"\"", config).then(
          function(success){
            console.log("success service changePWD");
            //console.log(success);
            def.resolve(success.data);
          },
          function(error){
        	  console.log(error);
            def.reject(error);
          }
        );
      },
      function(error){
        def.reject();
      }
    );
    return def.promise;
  };

  /* Forgot Password
   * -- */
  obj.forgotPassword = function(email){
    var def = $q.defer();
    var appSecret = "EASIN::MOBILE::APP::SECRET";

    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    obj.getNonce().then(
      function(success){
        var postData = {
          Email: email,
          AppSecret: appSecret,
          GotNonce: success.NonceNumber
        };
        //encryptPostData
        $http.post(SERVER.authenticationBaseURL+"mobile/forgotpwd", "\""+obj.encryptData(angular.toJson(postData))+"\"", config).then(
          function(success){
            //console.log(success);
            def.resolve(success.data);
          },
          function(error){
            def.reject(error);
          }
        );
      },
      function(error){
        def.reject(error);
      }
    );
    return def.promise;
  };

  /* Rest Password
   * -- */
  obj.resetPassword = function(email, newPassword, confirmPassword, resetToken){
    var def = $q.defer();
    var appSecret = "EASIN::MOBILE::APP::SECRET";

    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    var postData = {
      Email: email,
      AppSecret: appSecret,
      NewPassword: newPassword,
      ConfirmPassword: confirmPassword,
      ResetToken: resetToken
    };

    //console.log(postData);

    $http.post(SERVER.authenticationBaseURL+"mobile/resetpwd", "\""+obj.encryptData(angular.toJson(postData))+"\"", config).then(
      function(success){
        //console.log(success);
        def.resolve(success.data);
      },
      function(error){
        def.reject(error);
      }
    );

    return def.promise;
  };


  /* Logout
   * -- */
  obj.logout = function(token){
    var def = $q.defer();
    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    $http.post(SERVER.authenticationBaseURL+"mobile/logout", "\""+token+"\"", config).then(
      function(success){
        //console.log(success);
        def.resolve(success.data);
      },
      function(error){
        def.reject(error);
      }
    );
    return def.promise;
  };

  return obj;
}])


/** $localstorage
 * Store Data in LocalStorage
 */
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('$language', ['$localstorage', '$cordovaGlobalization', '$q', function($localstorage, $cordovaGlobalization, $q) {
  var obj = {};

  // obj.availableLanguageKey = ["bg","es","cs","da","de","et","el","fr","ga","hr","it","lv","lt","hu","mt","nl","pl","pt","ro","sk","sl","fi","sv","en"];
  obj.availableLanguageKey = ["en", "de", "it", "es","ro","el","fr","hu","ro","pt"];

  obj.get = function(){
    var def = $q.defer();
    if($localstorage.get('language') === undefined || $localstorage.get('language') === 'undefined' || $localstorage.get('language') === ''){
      ionic.Platform.ready(function() {
        navigator.globalization.getPreferredLanguage(function(result) {
            var languageCode = result.value.slice(0,2);
            if (obj.availableLanguageKey.indexOf(languageCode) != -1){
              obj.set(languageCode);
            }else{
              obj.set("en");
            }
            def.resolve($localstorage.get('language'));
          },
          function(error) {
            obj.set("en"); // default to en
            def.resolve($localstorage.get('language'));
        });
      });
    }else{
      def.resolve($localstorage.get('language'));
    }
    //obj.set("en");
    return def.promise;
  };
  obj.set = function(language){
    $localstorage.set('language', language);
  };

  obj.test = function(){
    //alert('mpmpmpmpm');
  };

  return obj;
}])
;
