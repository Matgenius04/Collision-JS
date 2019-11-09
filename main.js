let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

let body = new Body({
    vertices: generatePoints(10),
})

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
    requestAnimationFrame(draw);
}

function draw() {
    body.pointsToLines();
    body.draw(ctx,false);
}

function generatePoints(n,r) {
    let out = [];
    let a = 0;
    for (let i=0; i<n; i++) {
        let angle = ((Math.PI*2)-a)*Math.random();
        out.push(new Point({
            a: angle,
            d: Math.random() * 0.5 * r,
        }));
        a += angle;
    }
    return out;
}

setup();