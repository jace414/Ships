import { z } from 'zod';
import chalk from 'chalk';
const portIdSchema = z.uuid();
const portSchema = z.object({
    type: z.literal('Feature'),
    id: portIdSchema,
    geometry: z.object({
        type: z.literal('Point'),
        coordinates: z.tuple([
            z.number().min(-180).max(180),
            z.number().min(-90).max(90),
        ]),
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
    const seenIds = new Set();
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
class Ship {
    constructor(config) {
        this.name = config.name;
        this.classification = config.classification;
        this.homePort = config.homePort;
        this.currentPort = config.homePort;
        this.maxSpeedKnots = config.maxSpeedKnots;
    }
    name;
    classification;
    homePort;
    currentPort;
    maxSpeedKnots;
    mileageNauticalMiles = 0;
    logs = [];
    sailTo(port) {
        const distance = this.distanceTo(port);
        const hours = this.travelTime(distance);
        this.logJourney(port, distance, hours);
        this.mileageNauticalMiles += distance;
        if (port) {
            this.currentPort = port;
        }
    }
    setMaxSpeed(speedKnots) {
        this.maxSpeedKnots = speedKnots;
    }
    distanceTo(port) {
        console.log('currentLocation: ', this.currentPort.geometry.coordinates);
        if (port) {
            console.log('destination: ', port.geometry.coordinates);
        }
        return 0;
        // calculate the distance in nautical miles between two cooridinate points
    }
    travelTime(distance) {
        return distance / this.maxSpeedKnots;
    }
    logJourney(port, distance, hours) {
        if (!port) {
            throw new Error('logJourney: argument port is undefined');
        }
        const log = {
            date: new Date().toISOString(),
            message: `${this.classification}, ${chalk.whiteBright.bold.italic(this.name)}, travelled ${chalk.yellow(distance)} na. miles\nfrom ${chalk.green.bold(this.currentPort.properties.name)} -> ${chalk.red.bold(port.properties.name)} in ${chalk.yellow(hours)} hours.`,
        };
        this.logs.push(log);
        console.log(log.message);
    }
}
// implementation
const portsApiBody = {
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
const ports = portsSchema.parse(portsApiBody);
function getPortById(ports, id) {
    const validatedId = portIdSchema.parse(id);
    const port = ports.features.find(candidate => candidate.id === validatedId);
    if (!port) {
        throw new Error(`Unknown port ID: ${validatedId}`);
    }
    return port;
}
const homePort = getPortById(ports, '0b9d6a87-6e0f-4c7b-ae3c-1a0e7c942ef1');
const ship = new Ship({
    name: 'Carribean',
    classification: 'Cruise Ship',
    homePort,
    maxSpeedKnots: 50,
});
const destinationPort = getPortById(ports, 'f4bba4b2-48d6-4c29-89b5-2ff2f307b25a');
ship.sailTo(destinationPort);
//# sourceMappingURL=ships.main.js.map