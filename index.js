const glob = require('glob');
const { dialog } = require('electron').remote;

const Utils = require('./classes/Utils');
const AppData = require('./classes/AppData');

window.$ = window.jQuery = require('jquery');
window.Bootstrap = require('bootstrap');

let appData = new AppData();
let isLoadingCancel = false;

const showStudyList = (studylist) => {
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

	let i = 0;
	for (let study of studylist) {
		htmlString += `
            <tr>
                <th scope="row">${++i}</th>
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

const updateProgressbar = (progressbar, strPercent) => {
	progressbar.innerHTML = strPercent;
	progressbar.style.width = strPercent;
	progressbar.setAttribute('aria-valuenow', strPercent);
};

document.getElementById('selFolder').addEventListener('click', (event) => {
	dialog.showOpenDialog({ properties: [ 'openDirectory' ] }, (filePaths, bookmarks) => {
		//console.log(filePaths);

		let selDirNameElmt = document.getElementById('selected-folder-name');
		if (filePaths === undefined || filePaths.length === 0) {
			console.log('The user has clicked the cancle button.');
			selDirNameElmt.innerHTML = 'No selected folder';
			return;
		}
		selDirNameElmt.innerHTML = filePaths[0];

		glob(filePaths[0] + '/**/*.dcm', async (err, filenames) => {
			if (err) {
				console.log(err);
			} else {
				// modal initialization
				const modalLabel = document.getElementById('exampleModalLabel');
				modalLabel.innerHTML = `Parsing...(${filePaths[0]})`;

				const modalProgressbar = document.getElementById('modal-progressbar');
				updateProgressbar(modalProgressbar, '0%');

				// show modal
				document.getElementById('show-modal').click();

				// global data initialization
				appData.clear();
				isLoadingCancel = false;
				const total = filenames.length;

				// parsing files
				for (let i = 0; i < total; ++i) {
					const dcmDS = await Utils.getDicomDataSet(filenames[i]);
					let temp = appData.findOrCreatePatient(dcmDS);
					temp = appData.findOrCreateStudy(dcmDS, temp);
					temp = appData.findOrCreateSeries(dcmDS, temp);
					appData.findOrCreateDcmImage(dcmDS, temp, filenames[i]);

					if (isLoadingCancel) {
						break;
					}

					updateProgressbar(modalProgressbar, Math.floor(i * 100 / total) + '%');
				}
				// if not cancel, then close modal
				if (!isLoadingCancel) {
					document.getElementById('modal-close').click();
				}
				// show studylist
				showStudyList(appData.studyList);
			}
		});
	});
});

document.getElementById('modal-cancel').addEventListener('click', (event) => {
	console.log('click modal cancel button');
	isLoadingCancel = true;
});
