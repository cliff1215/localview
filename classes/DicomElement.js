const DicomElement = {
	PatientName: {
		Tag: 'x00100010',
		VR: 'PN',
		VM: '1',
		Desc: 'Patient Name'
	},
	PatientID: {
		Tag: 'x00100020',
		VR: 'LO',
		VM: '1',
		Desc: 'Patient ID'
	},
	PatientBirthDate: {
		Tag: 'x00100030',
		VR: 'DA',
		VM: '1',
		Desc: 'Patient Birthdate'
	},
	PatientSex: {
		Tag: 'x00100040',
		VR: 'CS',
		VM: '1',
		Desc: 'Patient Sex'
	},
	StudyInstanceUID: {
		Tag: 'x0020000d',
		VR: 'UI',
		VM: '1',
		Desc: 'Study Instance UID'
	},
	StudyDate: {
		Tag: 'x00080020',
		VR: 'DA',
		VM: '1',
		Desc: 'Study Date'
	},
	StudyTime: {
		Tag: 'x00080030',
		VR: 'TM',
		VM: '1',
		Desc: 'Study Time'
	},
	StudyID: {
		Tag: 'x00200010',
		VR: 'SH',
		VM: '1',
		Desc: 'Study ID'
	},
	AccessionNumber: {
		Tag: 'x00080050',
		VR: 'SH',
		VM: '1',
		Desc: 'Accession Number'
	},
	StudyDescription: {
		Tag: 'x00081030',
		VR: 'LO',
		VM: '1',
		Desc: 'Study Description'
	},
	Modality: {
		Tag: 'x00080060',
		VR: 'CS',
		VM: '1',
		Desc: 'Modality'
	},
	Bodypart: {
		Tag: 'x00180015',
		VR: 'CS',
		VM: '1',
		Desc: 'Body Part Examined'
	},
	InstitutionName: {
		Tag: 'x00080080',
		VR: 'LO',
		VM: '1',
		Desc: 'Institution Name'
	},
	SeriesInstanceUID: {
		Tag: 'x0020000e',
		VR: 'UI',
		VM: '1',
		Desc: 'Series Instance UID'
	},
	SeriesDate: {
		Tag: 'x00080021',
		VR: 'DA',
		VM: '1',
		Desc: 'Series Date'
	},
	SeriesTime: {
		Tag: 'x00080031',
		VR: 'TM',
		VM: '1',
		Desc: 'Series Time'
	},
	SeriesNumber: {
		Tag: 'x00200011',
		VR: 'IS',
		VM: '1',
		Desc: 'Series Number'
	},
	SeriesDescription: {
		Tag: 'x0008103e',
		VR: 'LO',
		VM: '1',
		Desc: 'Series Description'
	},
	Manufacturer: {
		Tag: 'x00080070',
		VR: 'LO',
		VM: '1',
		Desc: 'Manufacturer'
	},
	SOPInstanceUID: {
		Tag: 'x00080018',
		VR: 'UI',
		VM: '1',
		Desc: 'SOP Instance UID'
	},
	InstanceNumber: {
		Tag: 'x00200013',
		VR: 'IS',
		VM: '1',
		Desc: 'Instance Number'
	},
	SamplesPerPixel: {
		Tag: 'x00280002',
		VR: 'US',
		VM: '1',
		Desc: 'Samples Per Pixel'
	},
	PhotometricInterpretation: {
		Tag: 'x00280004',
		VR: 'CS',
		VM: '1',
		Desc: 'Photometric Interpretation'
	},
	Rows: {
		Tag: 'x00280010',
		VR: 'US',
		VM: '1',
		Desc: 'Rows'
	},
	Columns: {
		Tag: 'x00280011',
		VR: 'US',
		VM: '1',
		Desc: 'Columns'
	},
	BitsAllocated: {
		Tag: 'x00280100',
		VR: 'US',
		VM: '1',
		Desc: 'Bits Allocated'
	},
	BitsStored: {
		Tag: 'x00280101',
		VR: 'US',
		VM: '1',
		Desc: 'Bits Stored'
	},
	HighBit: {
		Tag: 'x00280102',
		VR: 'US',
		VM: '1',
		Desc: 'High Bit'
	},
	WindowCenter: {
		Tag: 'x00281050',
		VR: 'DS',
		VM: '1-n',
		Desc: 'Window Center'
	},
	WindowWidth: {
		Tag: 'x00281051',
		VR: 'DS',
		VM: '1-n',
		Desc: 'Window Width'
	},
	RescaleIntercept: {
		Tag: 'x00281052',
		VR: 'DS',
		VM: '1',
		Desc: 'RescaleIntercept'
	},
	RescaleSlope: {
		Tag: 'x00281053',
		VR: 'DS',
		VM: '1',
		Desc: 'RescaleSlope'
	}
};

module.exports = DicomElement;

//        '(0028,1050)': {'tag': '(0028,1050)', 'vr': 'DS', 'vm': '1-n', 'name': 'WindowCenter'},
// '(0028,1051)': {'tag': '(0028,1051)', 'vr': 'DS', 'vm': '1-n', 'name': 'WindowWidth'},
// '(0028,1052)': {'tag': '(0028,1052)', 'vr': 'DS', 'vm': '1', 'name': 'RescaleIntercept'},
// '(0028,1053)': {'tag': '(0028,1053)', 'vr': 'DS', 'vm': '1', 'name': 'RescaleSlope'},
