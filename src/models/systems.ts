export class System {
    public id: string;
    public name: string;
    public neighbors: System[];
    public locations: Location[];

    constructor(
        id: string,
        name: string,
        neighbors: System[]=[],
        locations: Location[]=[],
    ) {
        this.id = id;
        this.name = name;
        this.neighbors = neighbors;
        this.locations = locations;
    }
  }
  export class Location {
    public id: string;
    public system_id: string;
    public name: string;
    public description: string;

    constructor(
        id: string,
        system_id: string,
        name: string,
        description: string,
    ) {
        this.id = id;
        this.system_id = system_id;
        this.name = name;
        this.description = description;
    }
}