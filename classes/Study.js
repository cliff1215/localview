const DcmElmt = require('./DicomElement');

class Study {
	/**
     *Creates an instance of Study.
     * @param {DicomDataSet} dcmDS - DicomDataSet from dicom-parser module
     * @param {Patient} [patInfo=null] - Patient object
     * @param {int} [tag=-1] - this object tag
     * @memberof Study
     */
	constructor(dcmDS, patInfo = null, tag = -1) {
		this.patInfo = patInfo;
		this.tag = tag;

		this.instUID = dcmDS.string(DcmElmt.StudyInstanceUID.Tag);
		this.date = dcmDS.string(DcmElmt.StudyDate.Tag);
		this.time = dcmDS.string(DcmElmt.StudyTime.Tag);
		this.id = dcmDS.string(DcmElmt.StudyID.Tag);
		this.accessNo = dcmDS.string(DcmElmt.AccessionNumber.Tag);
		this.desc = dcmDS.string(DcmElmt.StudyDescription.Tag);
		this.modal = dcmDS.string(DcmElmt.Modality.Tag);
		this.bodypart = dcmDS.string(DcmElmt.Bodypart.Tag);
		this.institutionName = dcmDS.string(DcmElmt.InstitutionName.Tag);

		this.seriesInfos = [];
	}

	/**
     * Get the number of all images in the study
     *
     * @return {int} count - total image count
     * @memberof Study
     */
	getImageCount() {
		let count = 0;
		for (let series of this.seriesInfos) {
			count += series.getImageCount();
		}
		return count;
	}

	/**
     * Get the thumbnail image array in the study
     *
     * @return {DcmImage[]} thumbImages - thumbnail images
     * @memberof Study
     */
	getThumbImages() {
		let thumbImages = [];
		for (let series of this.seriesInfos) {
			thumbImages.push(series.getThumbImage());
		}
		return thumbImages;
	}
}

module.exports = Study;
