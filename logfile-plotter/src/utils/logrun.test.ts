import { Logrun, LogrunPath } from './logrun';

const EXAMPLE_LOGRUN = `
{"time":1613395666041,"data":{"cleanMissionStatus":{"cycle":"quick","phase":"run","expireM":0,"rechrgM":0,"error":0,"notReady":0,"mssnM":0,"sqft":0,"initiator":"localApp","nMssn":122},"pose":{"theta":0,"point":{"x":0,"y":0}},"bin":{"present":true,"full":false}}}
{"time":1613395666843,"data":{"cleanMissionStatus":{"cycle":"quick","phase":"run","expireM":0,"rechrgM":0,"error":0,"notReady":0,"mssnM":0,"sqft":0,"initiator":"localApp","nMssn":122},"pose":{"theta":0,"point":{"x":0,"y":0}},"bin":{"present":true,"full":false}}}
{"time":1613395667644,"data":{"cleanMissionStatus":{"cycle":"quick","phase":"run","expireM":0,"rechrgM":0,"error":0,"notReady":0,"mssnM":0,"sqft":0,"initiator":"localApp","nMssn":122},"pose":{"theta":0,"point":{"x":-6,"y":0}},"bin":{"present":true,"full":false}}}
{"time":1613395668444,"data":{"cleanMissionStatus":{"cycle":"quick","phase":"run","expireM":0,"rechrgM":0,"error":0,"notReady":0,"mssnM":0,"sqft":0,"initiator":"localApp","nMssn":122},"pose":{"theta":0,"point":{"x":-13,"y":0}},"bin":{"present":true,"full":false}}}
{"time":1613395669244,"data":{"cleanMissionStatus":{"cycle":"quick","phase":"run","expireM":0,"rechrgM":0,"error":0,"notReady":0,"mssnM":0,"sqft":0,"initiator":"localApp","nMssn":122},"pose":{"theta":0,"point":{"x":-13,"y":0}},"bin":{"present":true,"full":false}}}
{"time":1613395670046,"data":{"cleanMissionStatus":{"cycle":"quick","phase":"run","expireM":0,"rechrgM":0,"error":0,"notReady":0,"mssnM":0,"sqft":0,"initiator":"localApp","nMssn":122},"pose":{"theta":0,"point":{"x":-17,"y":0}},"bin":{"present":true,"full":false}}}
{"time":1613395670847,"data":{"cleanMissionStatus":{"cycle":"quick","phase":"run","expireM":0,"rechrgM":0,"error":0,"notReady":0,"mssnM":0,"sqft":0,"initiator":"localApp","nMssn":122},"pose":{"theta":0,"point":{"x":-17,"y":0}},"bin":{"present":true,"full":false}}}
`;

const EXAMPLE_PATH: LogrunPath = [
  [0, 0],
  [0, 0],
  [-6, 0],
  [-13, 0],
  [-13, 0],
  [-17, 0],
  [-17, 0],
];

test('Logrun#toPath', () => {
  const l1 = Logrun.fromCLI(EXAMPLE_LOGRUN);
  expect(l1.getPath()).toEqual(EXAMPLE_PATH);
});
