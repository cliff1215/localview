const Utils = require('./Utils');
const DcmElmt = require('./DicomElement');

class DcmImage {
	constructor(dcmDS, filename, seriesInfo = null, tag = -1) {
		this.filename = filename;
		this.fileObject = null;

		this.seriesInfo = seriesInfo;
		this.tag = tag;

		this.instUID = dcmDS.string(DcmElmt.SOPInstanceUID.Tag);
		this.number = dcmDS.string(DcmElmt.InstanceNumber.Tag);
		this.samplePerPixel = dcmDS.string(DcmElmt.SamplesPerPixel.Tag);
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

		// The ID comes from cornerstone-wado-image-loader, format `dicomfile:${fileIndex - 1}`
		this.imageID = '';

		this.isLoaded = false;
	}

	async getFileObject() {
		if (!this.filename || this.filename.length === 0) {
			return null;
		}
		if (this.fileObject) {
			return this.fileObject;
		}

		//const data = fs.readFileSync(this.filename);
		const data = await Utils.loadFile(this.filename);
		this.fileObject = new File([ data ], this.filename);
		return this.fileObject;
	}
}

module.exports = DcmImage;
