const cornerstoneMath = require('cornerstone-math');
const hammer = require('hammerjs');
const dicomParser = require('dicom-parser');
const path = require('path');

class CornerstoneUtils {
	static init() {
		window.cornerstone = require('cornerstone-core');
		window.cornerstoneWADOImageLoader = require('cornerstone-wado-image-loader');
		window.cornerstoneTools = require('cornerstone-tools');

		this.__initCornerstoneWADOImageLoader();
		this.__initCornerstoneTools();
	}

	static clear() {
		cornerstoneWADOImageLoader.wadouri.fileManager.purge();
		cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.purge();
		cornerstone.webGL.textureCache.purgeCache();
		cornerstone.imageCache.purgeCache();
	}

	static disableElements(elements) {
		for (let i = elements.length - 1; i >= 0; --i) {
			cornerstone.disable(elements[i]);
		}
		console.log(cornerstone.getEnabledElements().length);
	}

	static enableElement(element) {
		cornerstone.enable(element, { renderer: 'webgl' });
	}

	static getImageID(fileObject) {
		return cornerstoneWADOImageLoader.wadouri.fileManager.add(fileObject);
	}

	static loadAndViewImage(dcmImage, element) {
		cornerstone.loadAndCacheImage(dcmImage.imageID, { usePDFJS: false }).then(
			(image) => {
				//cornerstone.loadImage(dcmImage.imageID, { usePDFJS: false }).then((image) => {
				//console.log(image);

				cornerstone.displayImage(element, image);
				//console.log(cornerstone.getEnabledElement(element).viewport);
				dcmImage.isLoaded = true;

				// cornerstoneTools.addStackStateManager(elmt, ["stack"]);
				// cornerstoneTools.addToolState(elmt, "stack", g_data);
				//const element = document.getElementById('currentFileName');
				//element.innerHTML = g_data.files[g_data.currentIdx].name;

				//g_data.loaded = true;
			},
			(err) => {
				alert(err);
			}
		);
	}

	static __initCornerstoneWADOImageLoader() {
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
	}

	static __initCornerstoneTools() {
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
	}
}

module.exports = CornerstoneUtils;
