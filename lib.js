class Point {
    // input object and point will be converted to whatever
    // not inputted. ex: obj = {x:1,y:1} return {x:1,y:1,a:Math.PI/4,d:Math.sqrt(2)} 
    constructor(obj) {
        // will take preference of cartesian coords
        if (typeof Number(obj.x) == "number" && typeof Number(obj.y) == "number") {
            this.x = Number(obj.x);
            this.y = Number(obj.y);
            let p = Point.cartToPolar(this.x, this.y);
            this.a = p.a;
            this.d = p.d;
        } else if (typeof obj.a == "number" && typeof obj.d == "number") {
            this.a = normalAngle(Number(a));
            this.d = Number(obj.d);
            let p = Point.polarToCart(this.a, this.d);
            this.x = p.x;
            this.y = p.y;
        } else {
            return new Error("Incorrect Input Type");
        }
    }
    // converts Cartesian (x,y) to Polar (a,d) coordinates
    // returns object {a,d}
    static cartToPolar(x, y) {
        let a = normalAngle(Math.atan2(y, x));
        let d = Math.sqrt((x ** 2) + (y ** 2));
        return {
            a: a,
            d: d
        };
    }
    // converts Polar (a,d) to Cartesian (x,y) coordinates
    // returns object {x,y}
    static polarToCart(a, d) {
        return {
            x: Math.cos(a) * d,
            y: Math.sin(a) * d
        }
    }
}

class Line {
    // p1 and p2 being points
    constructor(p1, p2) {
        if (p1.x == p2.x && p1.y == p2.y) {
            return new Error("Points are the same");
        }
        this.p1 = {
            a: Number(p1.a),
            d: Number(p1.d),
            x: Number(p1.x),
            y: Number(p1.y)
        }
        this.p2 = {
            a: Number(p2.a),
            d: Number(p2.d),
            x: Number(p2.x),
            y: Number(p2.y),
        }
        let f = Line.getFormula(this.p1, this.p2);
        this.f = {
            m: f.m,
            b: f.b,
            x: f.x // if applicable
        }
    }
    static getFormula(p1, p2) {
        if (p1.x == p2.x) {
            return {
                m: undefined,
                b: 0,
                x: p1.x
            };
        }
        // y = mx + b
        let m = p2.x - p1.x / p2.y - p1.y;
        // p1.y = (m * p1.x) + b
        let b = p1.y - (m * p1.x);
        return {
            m: m,
            b: b,
            x: undefined
        };
    }
    static intersect(l1, l2) {
        let x, y;
        if (l1.x != undefined && l2.x != undefined) {

        } else if (l1.x != undefined) {

        } else if (l2.x != undefined) {

        } else {
            // (l1.m * x) + l1.b = (l2.m * x) + l2.b
            // x(l1.m - l2.m) = l2.b - l1.b
            x = (l2.b - l1.b) / (l1.m - l2.m);
            y = (l1.m * x) + l1.b;
            if (inRange(Math.min(l1.p1.x,l1.p2.x), Math.max(l1.p1.x),x)) {

            }
        }
    }
}

class Body {
    constructor(obj) {
        this.p = {
            x: obj.p.x || 0,
            y: obj.p.y || 0,
            r: obj.p.r || 0,
        };
        this.v = {
            x: 0,
            y: 0,
            r: 0,
        }
        this.vertices = [];
        this.lines = [];
    }
    pointsToLines() {
        if (this.vertices.length < 3) {
            return;
        } else {
            let lines = [];
            let v = this.vertices;
            for (let i = 0; i < v; i++) {
                lines.push(v[0], v[i + 1])
            }
        }
    }
    updateVelocity() {

    }
    update() {

    }
    addVertices() {

    }
    static detectCollision(a, b) {
        // start with body a and body b

    }
}

class Environment {
    constructor(obj) {
        this.bodies = obj.bodies || [];
        this.ctx = obj.ctx || undefined;
    }
}

// converts angle 
function normalAngle(a) {
    let o = a;
    while (o >= Math.PI * 2) {
        o -= Math.PI * 2
    }
    while (o < 0) {
        o += Math.PI * 2
    }
    return o;
}

// checks if val is within v1 and v2 inclusive
function inRange(v1, v2, val) {
    if (val >= Math.min(v1, v2) && val <= Math.max(v1, v2)) {
        return true;
    } else {
        return false;
    }
}