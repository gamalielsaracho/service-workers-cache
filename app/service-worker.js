// Se hace uso de cache-polyfill, ya que el soporte de cache es limitado.
importScripts('./js/cache-polyfill.js')

var CACHE_VERSION = 'app-v1'
var CACHE_FILES = [
	'/',
	'images/image-content.jpg',
	'js/app.js',
	'css/styles.css',
	'https://fonts.googleapis.com/css?family=Roboto:100'
]

// El evento install se activa cuando el navegador ve al service workers
// por primera vez.
self.addEventListener('install', function(event) {
	// console.log(event)
	event.waitUntil(
		// Abre una cache con el nombre app-v1.
		caches.open(CACHE_VERSION)
		.then(function(cache) {
			console.log('cache abierta.!')
			// Es importante cachear los componentes que mejoren el tiempo de 
			// espera de la página web.
			// Agregamos nuestros assets.
			return cache.addAll(CACHE_FILES) 
		})
	)
	// El Metodo install termina unicamente cuando los assets estén guardados.
})

self.addEventListener('activate', function(event) {
	// console.log(event)
	// Encontraremos todas las claves diferentes de la versión actual
	// y luego las limpiaremos.

	event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){
                if(key !== CACHE_VERSION){
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
})

// El evento fecha lo qu hace es interceptar las solicitudes hechas al servidor
self.addEventListener('fetch', function(event) {
	// console.log('the url is: '+event.request.url)

	event.respondWith(
		caches.match(event.request)
		.then(function(res) {
			if(res) {
				return res
			}

			requestBackend(event)
		})
	)
})	

function requestBackend(event) {
	var url = event.request.clone()

	return fetch(url).then(function (res) {
		if(!res || res.status !== 200 || res.type !== 'basic'){
            return res
        }

        var response = res.clone()

        caches.open(CACHE_VERSION)
        .then(function (cache) {
        	// Hay que actualizar la cache porque si el navegador detecta 
        	// algún cambio en el service worker, esto volverá a cambiar.
        	// y el evento install en el nuevo service worker será despedido,
        	// pero el nuevo service worker entrará en la etapa de espera
        	// porque la página sería todavía controlada por el viejo
        	// service worker.  
        	cache.put(event.request, response)
        	// Cuando todas las instancias de su sitio web estén cerradas, 
        	// el nuevo service worker tomará el control 
        	// (en lugar del más antiguo)
        })

        return res
	})
}
