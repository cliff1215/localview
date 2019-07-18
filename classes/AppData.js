const Utils = require('./Utils');
const DcmElmt = require('./DicomElement');
const Patient = require('./Patient');
const Study = require('./Study');
const Series = require('./Series');
const DcmImage = require('./DcmImage');

class AppData {
	constructor() {
		this.patList = [];
		this.studyList = [];
	}

	clear() {
		this.patList = [];
		this.studyList = [];
	}

	/**
     * find patient in the 'patList' by using patient id and name, 
     * and return the patient object if found, otherwise return null
     *
     * @param {string} id - patient id
     * @param {string} name - patient name
     * @return {Patient} patient - Patient object
     * @memberof AppData
     */
	findPatient(id, name) {
		for (let patient of this.patList) {
			if (patient.id === id && patient.name === name) {
				return patient;
			}
		}
		return null;
	}

	findOrCreatePatient(dcmDS) {
		let id = dcmDS.string(DcmElmt.PatientID.Tag);
		let name = dcmDS.string(DcmElmt.PatientName.Tag);

		let pat = this.findPatient(id, name);
		if (!pat) {
			pat = new Patient(dcmDS, this.patList.length);
			this.patList.push(pat);
		}
		return pat;
	}

	findOrCreateStudy(dcmDS, pat) {
		let instUID = dcmDS.string(DcmElmt.StudyInstanceUID.Tag);

		let study = AppData.findInfo(this.studyList, instUID);
		if (!study) {
			study = new Study(dcmDS, pat, pat.studyInfos.length);
			AppData.addInfo(pat.studyInfos, study);
			this.studyList.push(study);
		}
		return study;
	}

	findOrCreateSeries(dcmDS, study) {
		let instUID = dcmDS.string(DcmElmt.SeriesInstanceUID.Tag);

		let series = AppData.findInfo(study.seriesInfos, instUID);
		if (!series) {
			series = new Series(dcmDS, study, study.seriesInfos.length);
			AppData.addInfo(study.seriesInfos, series);
		}
		return series;
	}

	findOrCreateDcmImage(dcmDS, series, filename) {
		let instUID = dcmDS.string(DcmElmt.SOPInstanceUID.Tag);

		let dcmImage = AppData.findInfo(series.dcmImageInfos, instUID);
		if (!dcmImage) {
			dcmImage = new DcmImage(dcmDS, series, series.dcmImageInfos.length);
			AppData.addInfo(series.dcmImageInfos, dcmImage);
		}
		return dcmImage;
	}

	/**
     * Add item to the infoList and return the index of the item in the list
     *
     * @static
     * @param {object []} infoList - Any array
     * @param {object} item - any object
     * @return {int} index - the index of the item in the list
     * @memberof AppData
     */
	static addInfo(infoList, item) {
		return !item ? -1 : infoList.push(item) - 1;
	}

	/**
     * Find item in the infoList by using instance UID,
     * and return the item if found, otherwise return null
     *
     * @static
     * @param {object []} infoList - Any array, but in this case, 
     *      the item of the array is supposed to be one of Study, Series, or DcmImage object 
     * @param {string} instUID - instance UID in a dicom file
     * @return {object} item - the object or null
     * @memberof AppData
     */
	static findInfo(infoList, instUID) {
		for (let info of infoList) {
			if (info.instUID === instUID) return info;
		}
		return null;
	}

	// async setStudyListFromFiles(filenames) {
	// 	for (let filename of filenames) {
	// 		let dcmDS = await Utils.getDicomDataSet(filename);

	// 		let temp = this.findOrCreatePatient(dcmDS);
	// 		temp = this.findOrCreateStudy(dcmDS, temp);
	// 		temp = this.findOrCreateSeries(dcmDS, temp);
	// 		this.findOrCreateDcmImage(dcmDS, temp, filename);
	// 	}
	// }
}

module.exports = AppData;
