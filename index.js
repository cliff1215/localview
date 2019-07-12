const { dialog } = require('electron').remote;

document.getElementById('selFolder').addEventListener('click', (event) => {
	dialog.showOpenDialog({ properties: [ 'openDirectory' ] }, (filePaths, bookmarks) => {
		console.log(filePaths);
	});
});
