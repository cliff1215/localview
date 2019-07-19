const glob = require('glob');
const { dialog } = require('electron').remote;

const Utils = require('./classes/Utils');
const AppData = require('./classes/AppData');

window.$ = window.jQuery = require('jquery');
window.Bootstrap = require('bootstrap');

require('datatables.net')(window, $);
require('datatables.net-bs4')(window, $);

let appData = new AppData();
let isLoadingCancel = false;

const showStudyList = (studylist) => {
	if (!studylist.length) {
		return;
	}

	let data = [];
	let len = studylist.length;
	for (let i = 0; i < len; ++i) {
		let item = [];
		item.push(`${i + 1}`);
		item.push(studylist[i].patInfo.id);
		item.push(studylist[i].patInfo.name);
		item.push(studylist[i].patInfo.getAge());
		item.push(studylist[i].patInfo.sex);
		item.push(studylist[i].modal);
		item.push(studylist[i].desc);
		item.push(Utils.getDateStringWithHypens(studylist[i].date));
		item.push(`${studylist[i].bodypart}`);
		item.push(`${studylist[i].seriesInfos.length}`);
		item.push(`${studylist[i].getImageCount().toString()}`);

		data.push(item);
	}
	document.getElementById('table-information').innerHTML = `Total: ${len} Studies`;
	$('#study-datatable').DataTable().clear().rows.add(data).draw();
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

		glob(filePaths[0] + '/**/*.dcm', (err, filenames) => {
			if (err) {
				console.log(err);
			} else {
				const modalLabel = document.getElementById('exampleModalLabel');
				modalLabel.innerHTML = `Parsing...(${filePaths[0]})`;

				// The filenames are saved in a custom attribute of the hidden modal trigger button
				// and passed to modal dialog.
				const modalBtn = document.getElementById('show-modal');
				modalBtn.setAttribute('params', filenames.toString());

				modalBtn.click();
			}
		});
	});
});

$('#exampleModal').on('shown.bs.modal', async () => {
	// modal-progressbar initialization
	const modalProgressbar = document.getElementById('modal-progressbar');
	updateProgressbar(modalProgressbar, '0%');

	// Get filenames from the hidden modal button
	const modalBtn = document.getElementById('show-modal');
	const filenames = modalBtn.getAttribute('params').split(',');
	modalBtn.setAttribute('params', '');
	//console.log(filenames);

	// global data initialization
	appData.clear();
	isLoadingCancel = false;
	const total = filenames.length;

	// parsing files
	for (let i = 0, valnow = 0, valmod = 0; i < total; ++i) {
		const dcmDS = await Utils.getDicomDataSet(filenames[i]);
		let temp = appData.findOrCreatePatient(dcmDS);
		temp = appData.findOrCreateStudy(dcmDS, temp);
		temp = appData.findOrCreateSeries(dcmDS, temp);
		appData.findOrCreateDcmImage(dcmDS, temp, filenames[i]);

		if (isLoadingCancel) {
			break;
		}
		valnow = Math.floor((i + 1) * 100 / total);
		valmod = valnow % 10;
		if (valmod === 0 || valmod === 5) {
			updateProgressbar(modalProgressbar, valnow + '%');
		}
	}
	// if not cancel, then close modal
	if (!isLoadingCancel) {
		document.getElementById('modal-close').click();
	}

	updateProgressbar(modalProgressbar, '0%');
	// show studylist
	showStudyList(appData.studyList);
});

document.getElementById('modal-cancel').addEventListener('click', (event) => {
	console.log('click modal cancel button');
	isLoadingCancel = true;
});

$(document).ready(() => {
	console.log('Document loading done!!!');

	$('#study-datatable').DataTable({
		scrollY: '400px',
		scrollCollapse: false,
		paging: false,
		//dom: "<'row'<'pb-3 col-sm-12 col-md-6'i><'pt-2 col-sm-12 col-md-6'f>>t"
		dom: 't'
	});

	$('#study-datatable tbody').on('click', 'tr', (event) => {
		//console.log(event);

		const selRow = event.currentTarget;
		if ($(selRow).hasClass('selected')) {
			$(selRow).removeClass('selected');
			console.log('removeClass');
		} else {
			$('#study-datatable tbody tr.selected').removeClass('selected');
			$(selRow).addClass('selected');
			console.log('addClass');
		}
	});
});
