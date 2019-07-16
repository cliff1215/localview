const glob = require('glob');
const { dialog } = require('electron').remote;

const Utils = require('./classes/Utils');
const Patient = require('./classes/Patient');
const AppData = require('./classes/AppData');

let appData = new AppData();

let showStudyList = (studylist) => {
	if (!studylist.length) {
		return;
	}

	let domElmt = document.getElementById('study-list');

	let htmlString = `
        <table class='table table-hover'>
            <thead class='thead-dark'>
                <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">Sex</th>
                <th scope="col">Modality</th>
                <th scope="col">Study Name</th>
                <th scope="col">Study Date</th>
                <th scope="col">Bodypart</th>
                <th scope="col">Series</th>
                <th scope="col">Images</th>
                </tr>
            </thead>
            <tbody>
    `;

	for (let study of studylist) {
		htmlString += `
            <tr>
                <th scope="row">${study.tag}</th>
                <td>${study.patInfo.id}</td>
                <td>${study.patInfo.name}</td>
                <td>${study.patInfo.getAge()}</td>
                <td>${study.patInfo.sex}</td>
                <td>${study.modal}</td>
                <td>${study.desc}</td>
                <td>${study.date}</td>
                <td>${study.bodypart}</td>
                <td>${study.seriesInfos.length}</td>
                <td>${study.getImageCount()}</td>
            </tr>
        `;
	}
	htmlString += `</tbody></table>`;

	domElmt.innerHTML = htmlString;
};

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
				appData.clear();
				await appData.setStudyListFromFiles(res);
				showStudyList(appData.studyList);
			}
		});
	});
});
