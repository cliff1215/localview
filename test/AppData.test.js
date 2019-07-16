const AppData = require('../classes/AppData');

const testArray1 = [
	{ instUID: '123-123', name: 'John Doe', sex: 'M' },
	{ instUID: '124-124', name: 'Cam Newton', sex: 'M' },
	{ instUID: '125-125', name: 'Mary Jane', sex: 'F' },
	{ instUID: '126-126', name: 'Richard Simpson', sex: 'M' },
	{ instUID: '127-127', name: 'Matt Brown', sex: 'M' }
];
const testArray2 = [
	{ instUID: '123-123', studyName: 'CT, Chest', studyId: '123' },
	{ instUID: '124-124', studyName: 'CT, Abdomen', studyId: '124' },
	{ instUID: '125-125', studyName: 'MR, Diffusion', studyId: '125' },
	{ instUID: '126-126', studyName: 'MR, L-Spine', studyId: '126' },
	{ instUID: '127-127', studyName: 'DX, Chest', studyId: '127' }
];

test('1. Test AppData.findInfo 01', () => {
	expect(AppData.findInfo(testArray1, '124-124')).toEqual(testArray1[1]);
});

test('2. Test AppData.findInfo 02', () => {
	expect(AppData.findInfo(testArray2, '127-127')).toEqual(testArray2[4]);
});
