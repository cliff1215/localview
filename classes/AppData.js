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

		let study = findInfo(this.studyList, instUID);
		if (!study) {
			study = new Study(dcmDS, pat, pat.studyInfos.length);
			addInfo(pat.studyInfos, study);
			this.studyList.push(study);
		}
		return study;
	}

	static addInfo(infoList, item) {
		// return the index value
		return !item ? -1 : infoList.push(item) - 1;
	}

	static findInfo(infoList, instUID) {
		for (let info of infoList) {
			if (info.instUID === instUID) return info;
		}
		return null;
	}

	static async setStudyListFromFiles(filenames) {
		for (let filename of filenames) {
			let dcmDS = await Utils.getDicomDataSet(filename);
			let pat = findPatientFromDS(dcmDS);
			if (!pat) {
			}
		}
	}
}

module.exports = AppData;
