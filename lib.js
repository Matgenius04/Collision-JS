class Point {
    // input object and point will be converted to whatever
    // not inputted. ex: obj = {x:1,y:1} return {x:1,y:1,a:Math.PI/4,d:Math.sqrt(2)} 
    constructor(obj) {
        // will take preference of cartesian coords
        if (typeof Number(obj.x) == "number" && typeof Number(obj.y) == "number" && obj.x && obj.y) {
            this.x = Number(obj.x);
            this.y = Number(obj.y);
            let p = Point.cartToPolar(this.x, this.y);
            this.a = p.a;
            this.d = p.d;
        } else if (typeof Number(obj.a) == "number" && typeof Number(obj.d) == "number" && obj.a && obj.d) {
            this.a = normalAngle(Number(obj.a));
            this.d = Number(obj.d);
            let p = Point.polarToCart(this.a, this.d);
            this.x = p.x;
            this.y = p.y;
        } else {
            console.log(new Error("Incorrect Input Type"));
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
    // accepts angle in rads and then rotates polar coordinate around origin
    rotate(a) {
        return new Point({
            a: a + this.a,
            d: this.d
        })
    }
}

class Line {
    // p1 and p2 being points
    constructor(p1, p2) {
        if (p1.x == p2.x && p1.y == p2.y) {
            console.log(new Error("Points are the same"));
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
        if (l1.m == undefined && l2.m == undefined) {
            if (l1.x == l2.x) {
                return {c:true,x:l1.x,y:undefined};
            }
            return {c:false,x:undefined,y:undefined};
        } else if (l1.m == undefined) {
            x = l1.x;
            y = (l2.m * l1.x) + l2.b;
            if (inRange(Math.min(l2.p1.x,l2.p2.x), Math.max(l2.p1.x,l2.p1.y),x) &&
            inRange(Math.min(l1.p1.y,l1.p2.y), Math.max(l1,p1.y,l1.p2.y),y) &&
            inRange(Math.min(l2.p1.y,l2.p2.y), Math.max(l2,p1.y,l2.p2.y),y)) {
                return {c:true,x:x,y:y};
            }
            return {c:false,x:x,y:y};
        } else if (l2.m == undefined) {
            x = l2.x;
            y = (l1.m * l2.x) + l1.b;
            if (inRange(Math.min(l1.p1.x,l1.p2.x), Math.max(l1.p1.x,l1.p2.x),x) &&
            inRange(Math.min(l1.p1.y,l1.p2.y), Math.max(l1,p1.y,l1.p2.y),y) &&
            inRange(Math.min(l2.p1.y,l2.p2.y), Math.max(l2,p1.y,l2.p2.y),y)) {
                return {c:true,x:x,y:y};
            }
            return {c:false,x:x,y:y};
        } else {
            // (l1.m * x) + l1.b = (l2.m * x) + l2.b
            // x(l1.m - l2.m) = l2.b - l1.b
            x = (l2.b - l1.b) / (l1.m - l2.m);
            y = (l1.m * x) + l1.b;
            // checks if the x and y of the intersection is actually within the constraints of the line segment
            if (inRange(Math.min(l1.p1.x,l1.p2.x), Math.max(l1.p1.x,l1.p2.x),x) &&
            inRange(Math.min(l2.p1.x,l2.p2.x), Math.max(l2.p1.x,l2.p1.y),x) &&
            inRange(Math.min(l1.p1.y,l1.p2.y), Math.max(l1,p1.y,l1.p2.y),y) &&
            inRange(Math.min(l2.p1.y,l2.p2.y), Math.max(l2,p1.y,l2.p2.y),y)) {
                return {c:true,x:x,y:y};
            }
            return {c:false,x:x,y:y};
        }
    }
}

class Body {
    constructor(obj) {
        this.p = {
            x: (obj.p && obj.p.x) ? obj.p.x : 0,
            y: (obj.p && obj.p.y) ? obj.p.y : 0,
            r: (obj.p && obj.p.r) ? obj.p.r : 0,
        };
        this.v = {
            x: 0,
            y: 0,
            r: 0,
        }
        // this.vertices must consist of an array of (the class) Point's
        this.vertices = obj.vertices || [];
        // this.lines updates once every update() because they account for rotation
        this.lines = [];
    }
    pointsToLines() {
        if (this.vertices.length < 3) {
            return new Error("Not Enough Vertices");
        } else {
            let lines = [];
            let v = this.vertices;
            for (let i = 0; i < v.length; i++) {
                // console.log(v[0].rotate(this.p.r), v[(i + 1)%v.length].rotate(this.p.r));
                console.log(v,v[i]);
                lines.push(new Line(v[i].rotate(this.p.r), v[(i + 1)%v.length].rotate(this.p.r)));
            }
            this.lines = lines;
        }
    }
    updateVelocity(x,y,r) {

    }
    update() {
        // updates position from velocity
        this.p.x += this.v.x;
        this.p.y += this.v.y;
        this.p.r += this.v.r;

    }
    addVertices() {

    }
    draw(ctx,fill) {
        ctx.beginPath();
        ctx.moveTo(this.lines[0].p1.x,this.lines[0].p1.y);
        for (let i=0; i < this.lines.length; i++) {
            console.log(this.lines[i]);
            ctx.lineTo(this.lines[i].p2.x,this.lines[i].p2.y);
        }
        if (fill == true) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
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
    draw() {
        for (let i=0; i<this.bodies; i++) {

        }
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