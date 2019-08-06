const Utils = require('./Utils');
const DcmElmt = require('./DicomElement');

class Patient {
	/**
     * Creates an instance of Patient.
     * @param {DicomDataSet} dcmDS - DicomDataSet from dicom-parser module
     * @param {int} [tag=-1] - this object tag
     * @memberof Patient
     */
	constructor(dcmDS, tag = -1) {
		this.tag = tag;
		this.id = dcmDS.string(DcmElmt.PatientID.Tag);
		this.name = dcmDS.string(DcmElmt.PatientName.Tag);
		this.sex = dcmDS.string(DcmElmt.PatientSex.Tag);
		this.birthdate = dcmDS.string(DcmElmt.PatientBirthDate.Tag);
		this.studyInfos = [];
	}

	addStudy(study) {
		return !study ? -1 : this.studyInfos.push(study) - 1;
	}

	/**
     * Calculate age based on the birthdate and retrun age string
     *
     * @return {string} age
     * @memberof Patient
     */
	getAge() {
		let birthdate = Utils.getDateStringWithHypens(this.birthdate);
		if (birthdate === '') {
			return '';
		}

		birthdate = new Date(birthdate);
		let today = new Date();
		let age = today.getFullYear() - birthdate.getFullYear();
		if (birthdate > today.setFullYear(today.getFullYear() - age)) {
			--age;
		}
		return age.toString();
	}
}

module.exports = Patient;
