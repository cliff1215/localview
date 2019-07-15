const DcmElmt = require('./DicomElement');

class DcmImage {
	constructor(dcmDS, filename, seriesInfo = null, tag = -1) {
		this.filename = filename;
		this.seriesInfo = seriesInfo;
		this.tag = tag;

		this.instUID = dcmDS.string(DcmElmt.SOPInstanceUID.Tag);
		this.number = dcmDS.string(DcmElmt.InstanceNumber.Tag);
		this.byresPerPixel = dcmDS.string(DcmElmt.byresPerPixel.Tag);
		this.photoInterpretation = dcmDS.string(DcmElmt.PhotometricInterpretation.Tag);
		this.rows = dcmDS.string(DcmElmt.Rows.Tag);
		this.cols = dcmDS.string(DcmElmt.Columns.Tag);
		this.bitsAlloc = dcmDS.string(DcmElmt.BitsAllocated.Tag);
		this.bitsStored = dcmDS.string(DcmElmt.BitsStored.Tag);
		this.highBit = dcmDS.string(DcmElmt.HighBit.Tag);
		this.rescaleSlope = dcmDS.string(DcmElmt.RescaleIntercept.Tag);
		this.rescaleIntercept = dcmDS.string(DcmElmt.RescaleIntercept.Tag);
		this.winWidth = dcmDS.string(DcmElmt.WindowWidth.Tag);
		this.winCenter = dcmDS.string(DcmElmt.WindowCenter.Tag);

		this.isLoaded = false;
	}
}

module.exports = DcmImage;
