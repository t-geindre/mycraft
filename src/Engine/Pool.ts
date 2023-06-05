export default class Pool<Type> {
    private pool: Type[];

    constructor(pool: Type[] = []) {
        this.pool = pool;
    }

    add(item: Type) {
        this.pool.push(item);
    }

    clear() {
        this.pool = [];
    }

    remove(item: Type) {
        this.pool = this.pool.filter((i) => i !== item);
    }

    forEach(callback: (item: Type) => void) {
        this.pool.forEach(callback);
    }
}