const DcmElmt = require('./DicomElement');

class Series {
	constructor(dcmDS, studyInfo = null, tag = -1) {
		this.study = studyInfo;
		this.tag = tag;

		this.instUID = dcmDS.string(DcmElmt.SeriesInstanceUID.Tag);
		this.date = dcmDS.string(DcmElmt.SeriesDate.Tag);
		this.time = dcmDS.string(DcmElmt.SeriesTime.Tag);
		this.number = dcmDS.string(DcmElmt.SeriesNumber.Tag);
		this.desc = dcmDS.string(DcmElmt.SeriesDescription.Tag);
		this.modal = dcmDS.string(DcmElmt.Modality.Tag);
		this.manufacturer = dcmDS.string(DcmElmt.Manufacturer.Tag);

		this.dcmImageInfos = [];
	}

	clearImages() {
		this.dcmImageInfos = [];
	}

	getImageCount() {
		return this.dcmImageInfos.length;
	}

	getThumbImage() {
		if (this.dcmImageInfos.length == 0) {
			return null;
		}
		let idx = Math.floor(this.dcmImageInfos.length / 2);
		return this.dcmImageInfos[idx];
	}
}

module.exports = Series;
