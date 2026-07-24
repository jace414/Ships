import { z } from 'zod';
import chalk from 'chalk';
import { argon2 } from 'crypto';
import { tuple } from 'zod/v3';

type ShipClass = 'Cruise Ship' | 'Cargo Ship' | 'Tanker Ship' | 'Pirate Ship' | 'Yacht';

type JourneyLogEntry = {
	date: string;
	message: string;
};

const portIdSchema = z.uuid();

const object = {
	manila: {
		type: 'Feature',
		id: '0b9d6a87-6e0f-4c7b-ae3c-1a0e7c942ef1',
		geometry: {
			type: 'Point',
			coordinates: ['120.9647', '14.585'],
		},
		properties: {
			home: 'true',
			name: 'Port of Manila',
		},
	},
	davao: {
		type: 'Feature',
		id: 'f4bba4b2-48d6-4c29-89b5-2ff2f307b25a',
		geometry: {
			type: 'Point',
			coordinates: ['125.664', '7.129'],
		},

		properties: {
			home: 'false',
			name: 'Port of Davao',
		},
	},
};
object.davao.properties.name;
const tupleObject: TupleLibrary = [
	[
		'manila',
		[
			['type', 'Feature'],
			['id', '0b9d6a87-6e0f-4c7b-ae3c-1a0e7c942ef1'],
			[
				'geometry',
				[
					['type', 'Point'],
					['coordinates', ['120.9647', '14.585']],
				],
			],
			[
				'properties',
				[
					['home', 'true'],
					['name', 'Port of Manila'],
				],
			],
		],
	],
	[
		'davao',
		[
			['type', 'Feature'],
			['id', 'f4bba4b2-48d6-4c29-89b5-2ff2f307b25a'],
			[
				'geometry',
				[
					['type', 'Point'],
					['coordinates', ['125.664', '7.129']],
				],
			],
			[
				'properties',
				[
					['home', 'false'],
					['name', 'Port of Davao'],
				],
			],
		],
	],
	[
		'cebu',
		[
			['type', 'Feature'],
			['id', 'a1c13d5e-9e4f-4a64-8cc6-2aa6ed32e801'],
			[
				'geometry',
				[
					['type', 'Point'],
					['coordinates', ['123.911', '10.297']],
				],
			],
			[
				'properties',
				[
					['home', 'false'],
					['name', 'Port of Cebu'],
				],
			],
		],
	],
];

type TupleLibrary = Array<[string, TupleValue]>;
type TupleLibraryElement = [string, TupleValue];
type TupleValue = string | string[] | TupleLibrary;
type TupleLibraryCallback = { (element: TupleLibraryElement, index: number): boolean };

function isTupleLibrary(value: TupleValue): value is TupleLibrary {
	return (
		Array.isArray(value) &&
		value.every(
			(entry) => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === 'string',
		)
	);
}
//---------------------------------------[DECIDE WHETHER A VALUE PASSES A TEST ]------------------------//
function getArrayElementByKey(library: TupleLibrary, ...keys: string[]): TupleValue | undefined {
	const [currentKey, ...remainingKeys] = keys;
	if (currentKey === undefined) return library;
	const entry = library.find((element) => element[0] === currentKey);
	if (!entry) return undefined;
	const value = entry[1];
	// We have reached the requested value.
	if (remainingKeys.length === 0) return value;
	// More keys remain, so the value must be another tuple library.
	if (!isTupleLibrary(value)) return undefined;
	//return getArrayElementByKey(value, ...remainingKeys);
}
//----------------------------------------[ DECIDE WHETHER A VALUE PASSES A TEST ]---------------------//
const library = {
	data: tupleObject,
	find(callback: TupleLibraryCallback): TupleLibraryElement | undefined {
		for (const [i, element] of this.data.entries()) {
			if (callback(element, i)) {
				return element;
			}
		}
		return undefined;
	},
};

function timer(tickerStyle: 'counter' | 'ticker', setTime: number, callback: () => void): void {
	if (tickerStyle !== 'counter' && tickerStyle !== 'ticker') {
		throw new Error(
			`argument, ${chalk.bold.white('tickerStyle')}, must be: ${chalk.green("'counter' | 'ticker'")}\nReceived: ${chalk.bold.red(tickerStyle)}`,
		);
	}
	if (!setTime || setTime < 0) {
		throw new Error(
			`argument, ${chalk.bold.white('setTime')}, must be a ${chalk.green('positive number in milliseconds')}\nReceived: ${chalk.bold.red(setTime)}`,
		);
	}
	if (typeof callback !== 'function') {
		throw new Error(
			`argument, ${chalk.bold.white('callback')}, must be ${chalk.green('valid function')}\nReceived: ${chalk.bold.red(callback)}`,
		);
	}
	const tickerSounds = ['tick', 'tock'];
	const tick = (() => {
		// internal state
		const uptick = tickerSounds[0];
		const downtick = tickerSounds[1];
		let cycle = 0;

		return () => {
			if (cycle < 1) {
				console.log(uptick);
				cycle++;
			} else {
				console.log(downtick);
				cycle--;
			}
		};
	})();
	const count = (() => {
		// internal state
		let count = 0;
		return () => {
			console.log(++count);
		};
	})();
	const tickerStyles = {
		ticker: () => tick(),
		counter: () => count(),
	};
	const startTime = Date.now();
	let lastTime = startTime;

	const getCurrentTime = () => Date.now();
	const timeIsUp = () => getCurrentTime() - startTime >= setTime;

	while (true) {
		if (getCurrentTime() - lastTime >= 1000) {
			if (timeIsUp()) {
				callback();
				return;
			}
			lastTime = getCurrentTime();
			tickerStyles[tickerStyle]();
		}
	}
}
timer('counter', 5000, () => {
	console.log('done!');
});
/* timer('counter', 5000, () => {
	console.log(chalk.bold.yellow('Ding!'));
}); */
//---------------------------------------[Applying and unknown action to each value]-----------------//
const arr = [1, 2, 3, 4, 5, 6];
/* console.log(
	arr.map((val) => {
		return val * 1;
	}),
); */
//---------------------------------------[ DECIDE WHETER A VALUE PASSES A TEST ]----------------------//
const numberPair = {
	pair: [21, 9, 3, 6, 7, 8, 11, 12],
	filter(callback: (number: number) => boolean): number[] {
		const passedValues: number[] = [];
		for (let i = 0; i < this.pair.length; i++) {
			const currentNumber = this.pair[i];
			if (currentNumber === undefined || typeof currentNumber !== 'number') {
				throw new Error('filter(): this.pair[i] is not a number');
			}
			if (callback(currentNumber)) passedValues.push(currentNumber);
		}
		return passedValues;
	},
};

console.log(numberPair.filter((num) => num % 2 === 0));

const portSchema = z.object({
	type: z.literal('Feature'),
	id: portIdSchema,
	geometry: z.object({
		type: z.literal('Point'),
		coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]), // coordinates: [longitude: number, latitude: number]
	}),
	properties: z.object({
		name: z.string().min(1),
		home: z.boolean(),
	}),
});

const portsSchema = z
	.object({
		type: z.literal('FeatureCollection'),
		features: z.array(portSchema).min(1),
	})
	.superRefine(({ features }, context) => {
		const seenIds = new Set<string>();
		let homePortCount = 0;

		features.forEach((port, index) => {
			if (seenIds.has(port.id)) {
				context.addIssue({
					code: 'custom',
					message: `Duplicate port ID: ${port.id}`,
					path: ['features', index, 'id'],
				});
			}

			seenIds.add(port.id);

			if (port.properties.home) {
				homePortCount += 1;
			}
		});

		if (homePortCount !== 1) {
			context.addIssue({
				code: 'custom',
				message: 'A FeatureCollection must contain exactly one home port',
				path: ['features'],
			});
		}
	});

type Port = z.infer<typeof portSchema>;
type Ports = z.infer<typeof portsSchema>;

interface ShipConfig {
	name: string;
	classification: ShipClass;
	homePort: Port;
	maxSpeedKnots: number;
}
class Ship {
	constructor(config: ShipConfig) {
		this.name = config.name;
		this.classification = config.classification;
		this.homePort = config.homePort;
		this.currentPort = config.homePort;
		this.maxSpeedKnots = config.maxSpeedKnots;
	}
	name: string;
	classification: ShipClass;
	homePort: Port;
	currentPort: Port;
	maxSpeedKnots: number;
	mileageNauticalMiles = 0;
	logs: JourneyLogEntry[] = [];
	sailTo(port: Port): void {
		const distance = this.distanceTo(port);
		const hours = this.travelTime(distance);
		this.logJourney(port, distance, hours);
		this.mileageNauticalMiles += distance;
		if (port) {
			this.currentPort = port;
		}
	}
	setMaxSpeed(speedKnots: number): void {
		this.maxSpeedKnots = speedKnots;
	}
	private distanceTo(port: Port): number {
		//console.log('currentLocation: ', this.currentPort.geometry.coordinates);
		if (port) {
			//console.log('destination: ', port.geometry.coordinates);
		}
		return 0;

		// calculate the distance in nautical miles between two cooridinate points
	}
	private travelTime(distance: number): number {
		return distance / this.maxSpeedKnots;
	}
	private logJourney(port: Port, distance: number, hours: number): void {
		if (!port) {
			throw new Error('logJourney: argument port is undefined');
		}
		const log: JourneyLogEntry = {
			date: new Date().toISOString(),
			message: `${this.classification}, ${chalk.whiteBright.bold.italic(this.name)}, travelled ${chalk.yellow(distance)} na. miles\nfrom ${chalk.green.bold(this.currentPort.properties.name)} -> ${chalk.red.bold(port.properties.name)} in ${chalk.yellow(hours)} hours.`,
		};
		this.logs.push(log);
		//console.log(log.message);
	}
}

// implementation

const portsApiBody: unknown = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			id: '0b9d6a87-6e0f-4c7b-ae3c-1a0e7c942ef1',
			geometry: {
				type: 'Point',
				coordinates: [120.9647, 14.585], //14.585171957235625, 120.96478225506924
			},
			properties: {
				home: true,
				name: 'Port of Manila',
			},
		},
		{
			type: 'Feature',
			id: 'a1c13d5e-9e4f-4a64-8cc6-2aa6ed32e801',
			properties: {
				home: false,
				name: 'Port of Cebu',
			},
			geometry: {
				type: 'Point',
				coordinates: [123.911, 10.297],
			},
		},
		{
			type: 'Feature',
			id: 'f4bba4b2-48d6-4c29-89b5-2ff2f307b25a',
			properties: {
				home: false,
				name: 'Port of Davao',
			},
			geometry: {
				type: 'Point',
				coordinates: [125.664, 7.129],
			},
		},
		{
			type: 'Feature',
			id: '93600beb-792c-4b83-9f9e-79d4af324203',
			properties: {
				home: false,
				name: 'Port of Ilo Ilo',
			},
			geometry: {
				type: 'Point',
				coordinates: [122.595, 10.707],
			},
		},
		{
			type: 'Feature',
			id: 'c7019532-70ea-46cb-9b07-90f66e86c6f9',
			properties: {
				home: false,
				name: 'Port of General Santos',
			},
			geometry: {
				type: 'Point',
				coordinates: [125.16, 6.095],
			},
		},
	],
};

const getPortID = {
	manila: '0b9d6a87-6e0f-4c7b-ae3c-1a0e7c942ef1',
	cebu: 'a1c13d5e-9e4f-4a64-8cc6-2aa6ed32e801',
	davao: 'f4bba4b2-48d6-4c29-89b5-2ff2f307b25a',
	'ilo ilo': '93600beb-792c-4b83-9f9e-79d4af324203',
	'general santos': 'c7019532-70ea-46cb-9b07-90f66e86c6f9',
};

const ports = portsSchema.parse(portsApiBody);

function getPortById(ports: Ports, id: unknown): Port {
	const validatedId = portIdSchema.parse(id);
	const port = ports.features.find((candidate) => candidate.id === validatedId);

	if (!port) {
		throw new Error(`Unknown port ID: ${validatedId}`);
	}

	return port;
}

const homePort = getPortById(ports, getPortID['manila']);

const ship = new Ship({
	name: 'Carribean',
	classification: 'Cruise Ship',
	homePort,
	maxSpeedKnots: 50,
});

const destinationPort = getPortById(ports, getPortID['davao']);
ship.sailTo(getPortById(ports, getPortID['davao']));
