export class Player {
    constructor(
        public id: string | null,
        public name: string,
        public email: string,
        public gameId: string,
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.gameId = gameId;
    }
}