const glob = require('glob');
const { dialog } = require('electron').remote;

document.getElementById('selFolder').addEventListener('click', (event) => {
	dialog.showOpenDialog({ properties: [ 'openDirectory' ] }, (filePaths, bookmarks) => {
		console.log(filePaths);
		if (filePaths === undefined || filePaths.length === 0) {
			console.log('The user has clicked the cancle button.');
			return;
		}
		glob(filePaths[0] + '/**/*.dcm', (err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(res);
			}
		});
	});
});
