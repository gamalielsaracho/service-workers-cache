
if(navigator.serviceWorker) {
	navigator.serviceWorker.register('service-worker.js')
	.then(function (registration) {
		console.log(registration)
	})
	.catch(function (error) {
		console.log(error)
	})
} else {
	console.log('Service Worker is not supported in this browser.')
}