const glob = require('glob');
const { dialog } = require('electron').remote;

const Utils = require('./classes/Utils');
const Patient = require('./classes/Patient');

document.getElementById('selFolder').addEventListener('click', (event) => {
	dialog.showOpenDialog({ properties: [ 'openDirectory' ] }, (filePaths, bookmarks) => {
		console.log(filePaths);
		if (filePaths === undefined || filePaths.length === 0) {
			console.log('The user has clicked the cancle button.');
			return;
		}
		glob(filePaths[0] + '/**/*.dcm', async (err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(res[0]);

				// let patient = new Patient('12349876', 'Iksoo Choi', 'M', '19701215');
				// console.log(patient);
				// console.log(patient.getAge());
				let dcmDS = await Utils.getDicomDataSet(res[0]);
				let patient = new Patient(dcmDS);
				console.log(patient);
				console.log(patient.getAge());
			}
		});
	});
});
