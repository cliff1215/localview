const { dialog } = require('electron').remote;
const path = require('path');
const glob = require('glob');

window.cornerstone = require('cornerstone-core');
window.cornerstoneWADOImageLoader = require('cornerstone-wado-image-loader');
window.cornerstoneTools = require('cornerstone-tools');
const cornerstoneMath = require('cornerstone-math');
const hammer = require('hammerjs');
const dicomParser = require('dicom-parser');

window.$ = window.jQuery = require('jquery');
window.Bootstrap = require('bootstrap');

require('datatables.net')(window, $);
require('datatables.net-bs4')(window, $);

const Utils = require('./classes/Utils');
const AppData = require('./classes/AppData');

let appData = new AppData();
let isLoadingCancel = false;
let thumbData = {
	domElements: null,
	dcmImages: null,
	clear() {
		this.domElements = [];
		this.domElements = null;
		this.dcmImages = [];
		this.dcmImages = null;
	}
};

const initCornerstoneWADOImageLoader = () => {
	cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
	cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

	cornerstoneWADOImageLoader.configure({
		useWebWorkers: true
	});

	if (!cornerstoneWADOImageLoader.initialized) {
		cornerstoneWADOImageLoader.webWorkerManager.initialize({
			maxWebWorkers: 4,
			startWebWorkersOnDemand: true,
			webWorkerPath: path.join(__dirname, 'cornerstoneWADOImageLoaderWebWorker.js'),
			webWorkerTaskPaths: [],
			taskConfiguration: {
				decodeTask: {
					loadCodecsOnStartup: true,
					initializeCodecsOnStartup: false,
					codecsPath: path.join(__dirname, 'cornerstoneWADOImageLoaderCodecs.js'),
					usePDFJS: false,
					strict: true
				}
			}
		});
		cornerstoneWADOImageLoader.initialized = true;
	}
};

const initCornerstoneTools = () => {
	cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
	cornerstoneTools.external.cornerstone = cornerstone;
	cornerstoneTools.external.Hammer = hammer;

	cornerstoneTools.init({
		globalToolSyncEnabled: true
	});
	const WwwcTool = cornerstoneTools.WwwcTool;
	const ZoomTool = cornerstoneTools.ZoomTool;
	const PanTool = cornerstoneTools.PanTool;
	// const StackScrollMouseWheelTool =
	//   cornerstoneTools.StackScrollMouseWheelTool;
	//const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
	cornerstoneTools.addTool(WwwcTool);
	cornerstoneTools.addTool(ZoomTool);
	cornerstoneTools.addTool(PanTool);
	//cornerstoneTools.addTool(StackScrollMouseWheelTool);
	//cornerstoneTools.addTool(ZoomMouseWheelTool);
	cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 2 });
	cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 4 });
	cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
	//cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
	//cornerstoneTools.setToolActive("ZoomMouseWheel", {});
};

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

const loadAndViewImage = (dcmImage, elmt) => {
	cornerstone.loadAndCacheImage(dcmImage.imageID, { usePDFJS: false }).then((image) => {
		//cornerstone.loadImage(dcmImage.imageID, { usePDFJS: false }).then((image) => {
		//console.log(image);

		cornerstone.displayImage(elmt, image);
		console.log(cornerstone.getEnabledElement(elmt).viewport);
		dcmImage.isLoaded = true;

		// cornerstoneTools.addStackStateManager(elmt, ["stack"]);
		// cornerstoneTools.addToolState(elmt, "stack", g_data);
		//const element = document.getElementById('currentFileName');
		//element.innerHTML = g_data.files[g_data.currentIdx].name;

		//g_data.loaded = true;
	}, function(err) {
		alert(err);
	});
};

const getThumbnailElements = (parentElmtID, thumbCnt) => {
	let thumbPanel = document.getElementById(parentElmtID);
	if (!thumbPanel) {
		return null;
	}

	let strHtml = '';
	let i;
	for (i = 0; i < thumbCnt; ++i) {
		strHtml += `<div id='thumb${i}' class='rounded d-inline-flex ml-2' style='width: 200px; height: 200px; background-color: black;'></div>`;
	}
	thumbPanel.innerHTML = strHtml;

	let thumbElmts = [];
	for (i = 0; i < thumbCnt; ++i) {
		let elmt = document.getElementById(`thumb${i}`);
		thumbElmts.push(elmt);
	}
	return thumbElmts;
};

const clearThumbnailData = () => {
	if (!thumbData.domElements) {
		return;
	}

	for (let element of thumbData.domElements) {
		cornerstone.disable(element);
	}
	cornerstoneWADOImageLoader.wadouri.fileManager.purge();
	cornerstone.imageCache.purgeCache();
	thumbData.clear();
};

const showThumbnailImages = (studyIdx) => {
	clearThumbnailData();

	thumbData.dcmImages = appData.getThumbnailImages(studyIdx);
	if (!thumbData.dcmImages) {
		return;
	}
	const len = thumbData.dcmImages.length;
	thumbData.domElements = getThumbnailElements('thumbnail-panel', len);
	if (!thumbData.domElements) {
		return;
	}
	for (let thumbElmt of thumbData.domElements) {
		//cornerstone.enable(thumbElmt, { renderer: 'webgl' });
		cornerstone.enable(thumbElmt);
	}

	for (let i = 0; i < len; ++i) {
		const dcmImage = thumbData.dcmImages[i];
		const fileObj = dcmImage.getFileObject();
		const id = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileObj);
		dcmImage.imageID = id;
		loadAndViewImage(dcmImage, thumbData.domElements[i]);
	}
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

document.getElementById('modal-cancel').addEventListener('click', (event) => {
	console.log('click modal cancel button');
	isLoadingCancel = true;
});

$(document).ready(() => {
	console.log('Document loading done!!!');
	initCornerstoneWADOImageLoader();
	initCornerstoneTools();

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

			let data = $('#study-datatable').DataTable().row(selRow).data();
			let index = parseInt(data[0]) - 1;
			console.log(index);
			showThumbnailImages(index);
		}
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
});
