import { Crew } from "./person";
import { Location } from "./systems";

/**
 * @swagger
 * components:
 *   schemas:
 *     Ship:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         captain:
 *           type: string
 *         registry:
 *           type: string
 *         hull:
 *           type: string
 *         shipClass:
 *           type: string
 *         location:
 *           type: string
 *         value:
 *           type: number
 *         speed:
 *           type: number
 *         bounty:
 *           type: number
 *         armour:
 *           type: number
 *         current_hp:
 *           type: number
 *         max_hp:
 *           type: number
 *         armour_class:
 *           type: number
 *         cargo_mass_limit:
 *           type: number   
 *         crew:
 *           type: array
 *         fittings:
 *           type: array
 *         fittingLimit:
 *           type: object
 *         modifications:
 *           type: array    
 *         weapons:
 *           type: array
 *         defences:
 *           type: array
 *         cargo:
 *           type: array    
 */         
export class Ship {
    public id: string;
    public captain: string;
    public registry: string;
    public hull: string;
    public shipClass: string;
    public location: string;
    public value: number;
    public speed: number;
    public bounty: number;
    public armour: number;
    public current_hp: number;
    public max_hp: number;
    public armour_class: number;
    public cargo_mass_limit: number;
    public crew: Crew[];
    public fittings: ShipFitting[];
    public fittingLimit: ShipFittingLimit | null;
    public modifications: ShipModification[];
    public weapons: ShipWeapon[];
    public defences: ShipDefence[];
    public cargo: ShipCargo[];

    constructor(
        id: string,
        captain: string,
        registry: string,
        hull: string,
        shipClass: string,
        location: string,
        value: number,
        speed: number,
        bounty: number,
        armour: number,
        current_hp: number,
        max_hp: number,
        armour_class: number,
        cargo_mass_limit: number,
        crew: Crew[],
        fittings: ShipFitting[] = [],
        fittingLimit: ShipFittingLimit | null = null, 
        modifications: ShipModification[] = [],
        weapons: ShipWeapon[] = [],
        defences: ShipDefence[] = [],
        cargo: ShipCargo[] = [],
    ) {
        this.id = id;
        this.captain = captain;
        this.registry = registry;
        this.hull = hull;
        this.shipClass = shipClass;
        this.location = location;
        this.value = value;
        this.speed = speed;
        this.bounty = bounty;
        this.armour = armour;
        this.current_hp = current_hp;
        this.max_hp = max_hp;
        this.armour_class = armour_class;
        this.cargo_mass_limit = cargo_mass_limit;
        this.crew = crew;
        this.fittings = fittings;
        this.fittingLimit = fittingLimit;
        this.modifications = modifications;
        this.weapons = weapons;
        this.defences = defences;
        this.cargo = cargo;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Fitting:
 *       type: object
 *       properties:
 *         id:  
 *           type: string
 *         ship:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         mass:
 *           type: number
 *         power:
 *           type: number
 *         hardpoints:
 *           type: number
 */         
export class ShipFitting {
    public id: string;
    public ship: string;
    public name: string;
    public description: string;
    public mass: number;
    public power: number;
    public hardpoints: number;

    constructor(
        id: string, 
        ship: string,
        name: string,
        description: string,
        mass: number,
        power: number,
        hardpoints: number,
    ) {
        this.id = id;   
        this.ship = ship;
        this.name = name;
        this.description = description;
        this.mass = mass;
        this.power = power;
        this.hardpoints = hardpoints;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ShipFittingLimit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
*         ship:
 *           type: string
 *         power:
 *           type: number
 *         mass:
 *           type: number
 *         hardpoints:
 *           type: number
 */         
export class ShipFittingLimit {
    public id: string;
    public ship: string;
    public power: number;
    public mass: number;
    public hardpoints: number;

    constructor(
        id: string,
        ship: string,
        power: number,
        mass: number,
        hardpoints: number,
    ) {
        this.id = id;
        this.ship = ship;
        this.power = power;
        this.mass = mass;
        this.hardpoints = hardpoints;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Modification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         ship:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 */         
export class ShipModification {
    public id: string;
    public ship: string;
    public name: string;
    public description: string;

    constructor(
        id: string,
        ship: string,
        name: string,
        description: string,
    ) {
        this.id = id;
        this.ship = ship;
        this.name = name;
        this.description = description;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Weapon:
 *       type: object
 *       properties:
 *         id:
*           type: string
 *         ship:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         cost:
 *           type: number
 *         damage_die:
 *           type: string
 *         damage_die_quantity:
 *           type: number
 *         mass:
 *           type: number
 *         power:
 *           type: number
 *         hardpoints:
 *           type: number
 *         minimum_class:
 *           type: string
 *         tech_level:
 *           type: number
 *         qualities:
 *           type: string   
 *         current_ammunition:
 *           type: number
 *         max_ammunition:
 *           type: number
 *         replenishment_cost:
 *           type: number
 *         location:
 *           type: string   
 */         
export class ShipWeapon {
    public id: string;
    public ship: string;
    public name: string;
    public description: string;
    public cost: number;
    public damage_die: string;
    public damage_die_quantity: number;
    public mass: number;
    public power: number;
    public hardpoints: number;
    public minimum_class: string;
    public tech_level: number;
    public qualities: string;
    public current_ammunition: number; 
    public max_ammunition: number;
    public replenishment_cost: number;
    public location: Location | null;

    constructor(
        id: string,
        ship: string,
        name: string,
        description: string,
        cost: number,
        damage_die: string,
        damage_die_quantity: number,
        mass: number,
        power: number,
        hardpoints: number,
        minimum_class: string,
        tech_level: number,
        qualities: string,
        current_ammunition: number,
        max_ammunition: number, 
        replenishment_cost: number,
        location: Location | null = null,
    ) {
        this.id = id;
        this.ship = ship;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.damage_die = damage_die;
        this.damage_die_quantity = damage_die_quantity;
        this.mass = mass;
        this.power = power;
        this.hardpoints = hardpoints;
        this.minimum_class = minimum_class;
        this.tech_level = tech_level;
        this.qualities = qualities;
        this.current_ammunition = current_ammunition;
        this.max_ammunition = max_ammunition;   
        this.replenishment_cost = replenishment_cost;
        this.location = location;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ShipDefence:
 *       type: object
 *       properties:
 *         id:
 *           type: string   
 *         ship:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         cost:
 *           type: number   
 *         power:
 *           type: number
 *         mass:
 *           type: number
 *         minimum_class:
 *           type: string
 *         effect:
 *           type: string   
 */         
export class ShipDefence {
    public id: string;
    public ship: string;
    public name: string;
    public description: string;
    public cost: number;
    public power: number;
    public mass: number;
    public minimum_class: string;
    public effect: string;

    constructor(
        id: string,
        ship: string,
        name: string,
        description: string,
        cost: number,
        power: number,
        mass: number,
        minimum_class: string,
        effect: string,
    ) {
        this.id = id;
        this.ship = ship;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.power = power;
        this.mass = mass;
        this.minimum_class = minimum_class;
        this.effect = effect;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Cargo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         ship:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         quantity:
 *           type: number
 *         cost:
 *           type: number
 *         space_occupied:
 *           type: number
 */         
export class ShipCargo {
    public id: string;
    public ship: string;
    public name: string;
    public description: string;
    public quantity: number;
    public cost: number;
    public space_occupied: number;

    constructor(
        id: string,
        ship: string,
        name: string,
        description: string,
        quantity: number,
        cost: number,
        space_occupied: number,
    ) {
        this.id = id;
        this.ship = ship;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.cost = cost;
        this.space_occupied = space_occupied;
    }
}