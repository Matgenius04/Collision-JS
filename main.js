let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let drawing = true;

let p = {p1: undefined, p2: undefined};
let l = [];
let k = {};
let t = 0; // tickspeed

let b1 = new Body({
    vertices: generatePoints(3,100)
});
let b2 = new Body({
    vertices: generatePoints(80,300)
});
let b3 = new Body({
    vertices: rect(window.innerWidth-100,window.innerHeight-100),
    movable: false,
});
let circle = new Body({
    vertices: circ(100)
});
let e = new Environment({
    bodies: {["b1"]:b1,["b4"]:circle}
});
e.addBody(b3,"b3");
e.addBody(b2,"b2");
b1 = e.bodies["b1"],
b2 = e.bodies["b2"],
b3 = e.bodies["b3"],
b4 = e.bodies["b4"];

function setup() {
    let body = document.querySelector("body");
    c.width = body.clientWidth;
    c.height = body.clientHeight;
    ctx.save();
    ctx.translate(c.width/2,c.height/2);
    ctx.scale(1,-1);
    window.addEventListener("change", (ev)=> {
        ctx.restore();
        c.width = body.clientWidth;
        c.height = body.clientHeight;
        ctx.translate(c.width/2,c.height/2);
        ctx.scale(1,-1);
    })
    // c.addEventListener("mousedown", (ev) => {
    //     let x = ev.clientX-(c.width/2),
    //     y = -ev.clientY+(c.height/2);
    //     p.p1 = (new Point({x:x,y:y}));
    // })
    // c.addEventListener("mousemove", (ev) => {
    //     let x = ev.clientX-(c.width/2),
    //     y = -ev.clientY+(c.height/2);
    //     p.p2 = new Point({x:x,y:y});
    //     console.log("mousemove");
    // });
    // c.addEventListener("mouseup", (ev) => {
    //     let x = ev.clientX-(c.width/2),
    //     y = -ev.clientY+(c.height/2);
    //     l.push(new Line(p.p1,new Point({x:x,y:y})));
    //     p.p1 = undefined;
    //     p.p2 = undefined;
    // })
    window.addEventListener("keydown", (ev)=>{
        k[ev.key] = true;
    })
    window.addEventListener("keyup", (ev) => {
        k[ev.key] = false;
    })
    requestAnimationFrame(draw);
}
function draw() {
    // console.clear();
    // console.log(k);
    // ctx.clearRect(-c.width/2,-c.height/2,c.width,c.height);
    ctx.fillStyle = "white";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(-c.width/2,-c.height/2,c.width,c.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    b1.pointsToLines();
    b1.draw(ctx,false);
    // b2.pointsToLines();
    // b2.draw(ctx,false);
    b3.pointsToLines();
    b3.draw(ctx,false);
    b4.pointsToLines();
    b4.draw(ctx,false);
    updateMove();
    e.update();
    // console.log(p[0],p[1]);
    // console.log(Body.detectCollision(b1,b2));
    if (Body.detectCollision(b1,b2).x && Body.detectCollision(b1,b2).y) {
        ctx.beginPath();
        ctx.arc(Body.detectCollision(b1,b2).x,Body.detectCollision(b1,b2).y,5,0,2*Math.PI);
        ctx.fill();
    }
    // for (let i=0; i<l.length; i++) {
    //     for (let j=0; j<l.length-1; j++) {
    //         (j==i) ? j++ : null;
    //         console.log(l[i].f,l[j].f);
    //         console.log(Line.intersect(l[i],l[j]));
    //         ctx.beginPath();
    //         ctx.arc(Line.intersect(l[i],l[j]).x,Line.intersect(l[i],l[j]).y,5,0,2*Math.PI);
    //         ctx.fill();
    //     }
    //     ctx.moveTo(l[i].p1.x,l[i].p1.y);
    //     ctx.lineTo(l[i].p2.x,l[i].p2.y);
    //     ctx.stroke();
    // }
    // // allows user to draw lines
    // if (p.p1 && p.p2) {
    //     ctx.moveTo(p.p1.x,p.p1.y);
    //     ctx.lineTo(p.p2.x,p.p2.y);
    //     ctx.stroke();
    // }
    if (drawing == true) {
        requestAnimationFrame(draw);
    }
}

function updateMove() {
    if (k.w == true) {
        b1.updateVelocity(1*Math.cos(b1.p.r),1*Math.sin(b1.p.r),0);
    }
    if (k.a == true) {
        b1.updateVelocity(0,0,2*(Math.PI/180))
    }
    if (k.s == true) {
        b1.updateVelocity(-1*Math.cos(b1.p.r),-1*Math.sin(b1.p.r),0);
    }
    if (k.d == true) {
        b1.updateVelocity(0,0,-2*(Math.PI/180))
    }
    // b1.updateVelocity(-b1.v.x/8,-b1.v.y/8,-b1.v.r/4);
    // b2.updateVelocity(-b2.v.x/8,-b2.v.x/8,-b2.v.r/4);
}

function generatePoints(n,r) {
    let out = [];
    for (let i=0; i<n; i++) {
        let angle = (((2*Math.PI)/n)*Math.random()) + ((i+1)*(((2*Math.PI)/n)));
        out.push(new Point({
            a: angle,
            d: ((Math.random()*0.5)+0.25) * 0.5 * r,
        }));
    }
    return out;
}

function rect(w,h) {
    return [
        new Point({x:-w/2,y:-h/2}),
        new Point({x:-w/2,y:h/2}),
        new Point({x:w/2,y:h/2}),
        new Point({x:w/2,y:-h/2}),
    ]
}
function circ(r) {
    let o = [];
    for (let i=0; i<360; i++) {
        o.push(new Point({a:(i*Math.PI)/180,d:r}));
    }
    return o;
}

setup();