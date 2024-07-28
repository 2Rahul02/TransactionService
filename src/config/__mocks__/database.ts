import {vi} from "vitest"

const mockPool = {
query: vi.fn()
};

const Pool = vi.fn(()=> mockPool);
const pool = new Pool()

export default pool;
