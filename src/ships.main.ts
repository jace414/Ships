import { z } from 'zod';

type ShipClassification = 'Cruise Ship' | 'Cargo Ship' | 'Tanker Ship' | 'Pirate Ship' | 'Yacht';

type GeoJSON = {
	type: 'Point';
	coordinates: [longitude: number, latitude: number];
};

type JourneyLog = {
	date: string;
	message: string;
};

type PortType = {
	home: boolean;
	name: string;
	location: GeoJSON;
};

interface ShipConfig {
	name: string;
	classification: ShipClassification;
	homePort: PortType;
	maxSpeedNauts: number;
}
class Ship {
	constructor(config: ShipConfig) {
		this.name = config.name;
		this.classification = config.classification;
		this.homePort = config.homePort;
		this.currentPort = config.homePort;
		this.maxSpeedNauts = config.maxSpeedNauts;
	}
	name: string;
	classification: ShipClassification;
	homePort: PortType;
	currentPort: PortType;
	maxSpeedNauts: number;
	mileage: number = 0;
	logs: JourneyLog[] = [];
	travel(destinationPort: PortType): void {
		const travelDistanceNauts = this.calcTravelDistance(destinationPort);
		const travelTimeHrs = this.calcTravelTime(travelDistanceNauts);
		const log = this.log(destinationPort, travelDistanceNauts, travelTimeHrs);
		console.log(log.message);
		this.updateMileage(travelDistanceNauts);
		this.currentPort = destinationPort;
	}
	setMaxSpeed(newSpeed: number): void {
		this.maxSpeedNauts = newSpeed;
	}
	private calcTravelDistance(destinationPort: PortType): number {
		console.log('currentLocation: ', this.currentPort.location.coordinates);
		console.log('destination: ', destinationPort.location.coordinates);
		return 0;

		// calculate the distance in nautical miles between two cooridinate points
	}
	private calcTravelTime(travelDistanceNauts: number): number {
		return travelDistanceNauts / this.maxSpeedNauts;
	}
	private updateMileage(distance: number): void {
		this.mileage += distance;
	}
	private log(
		destinationPort: PortType,
		travelDistanceNauts: number,
		travelTimeHrs: number,
	): JourneyLog {
		const log = {
			date: new Date().toISOString(),
			message: `${this.classification}, ${this.name}, travelled ${travelDistanceNauts} nautical miles from ${this.currentPort.name} to ${destinationPort.name}in ${travelTimeHrs} hours.`,
		};
		this.logs.push(log);
		return log;
	}
}

// implementation
const ports: Record<string, PortType> = {
	manila: {
		home: true,
		name: 'Port of Manila',
		location: {
			type: 'Point',
			coordinates: [120.9647, 14.585], //14.585171957235625, 120.96478225506924
		},
	},
	cebu: {
		home: false,
		name: 'Port of Cebu',
		location: {
			type: 'Point',
			coordinates: [123.911, 10.297],
		},
	}, // 10.297441901095748, 123.91095305903276 //

	davao: {
		home: false,
		name: 'Port of Davao',
		location: {
			type: 'Point',
			coordinates: [125.664, 7.129],
		},
	}, //7.128833062154214, 125.6635716777722

	iloIlo: {
		home: false,
		name: 'Port of Ilo Ilo',
		location: {
			type: 'Point',
			coordinates: [122.595, 10.707],
		},
	}, //10.706570594883743, 122.59450934838944

	generalSantos: {
		home: false,
		name: 'Port of General Santos',
		location: {
			type: 'Point',
			coordinates: [125.16, 6.095],
		},
	},
}; //6.0945740549402645, 125.16039924741254

const ship = new Ship({
	name: 'Carribean',
	classification: 'Cruise Ship',
	homePort: {
		home: true,
		name: 'Port of Manila',
		location: {
			type: 'Point',
			coordinates: [120.9647, 14.585], //14.585171957235625, 120.96478225506924
		},
	},
	maxSpeedNauts: 50,
});

ship.travel({
	home: false,
	name: 'Port of General Santos',
	location: {
		type: 'Point',
		coordinates: [125.16, 6.095],
	},
});

console.log(ports.manila);
