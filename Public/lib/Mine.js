// restituisce il numero binario in un array
function binary(n, m) {
    var bin = []

    while (n > 0) {
        bin.unshift(n % 2)
        n = floor(n / 2)
    }

    while (bin.length < m)
        bin.unshift(0)

    return bin
}

function axis_grid_3D(range = 3000, step = 100, h = 300) {
    push()

    stroke(255, 50)
    strokeWeight(1)
    for (var x = -range / 2; x < range / 2; x += step) {
        line(x, h, -range / 2, x, h, range / 2)
    }
    for (var z = -range / 2; z < range / 2; z += step) {
        line(-range / 2, h, z, range / 2, h, z)
    }

    stroke(255, 0, 0, 100)
    line(-range / 2, 0, 0, range / 2, 0, 0)

    stroke(0, 255, 0, 100)
    line(0, 0, -range / 2, 0, 0, range / 2)

    stroke(0, 0, 255, 100)
    line(0, -range / 2, 0, 0, range / 2, 0)
    pop()
}

function loadText(url) {
    arr = loadStrings(url);
    txt = "";
    for (var i = 0; i < arr.length; i++)
        txt += arr[i];

    return txt;
}

function s(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function spring(sx, sy, ex, ey, n, a) {
    n += 2
    var len = dist(sx, sy, ex, ey) / n

    var b = createVector((sx * (n - 1) + ex) / n, (sy * (n - 1) + ey) / n)
    var c = createVector((sx + ex * (n - 1)) / n, (sy + ey * (n - 1)) / n)
    line(sx, sy, b.x - len / 8, b.y)
    line(ex, ey, c.x + len / 8, c.y)

    noFill()
    for (var i = 1.5; i <= n - 1.5; i += 0.5) {
        var d = createVector((sx * (n - i) + ex * i) / n, (sy * (n - i) + ey * i) / n)
        if (i % 1 == 0) {
            arc(d.x, d.y, len / 4, len / 4, 0, PI)
        } else {
            arc(d.x, d.y, len * 5 / 4, 2 * a, PI, 0)
        }
    }
}

function randomHexColor() {
    col = "#";
    for (var i = 0; i < 6; i++)
        col += random(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"])
    
    return col;
}

function fibonacci(n) {
    const phi = (1 + sqrt(5)) / 2;
    return round((pow(phi, n) + pow(1 / phi, n)) / sqrt(5));
}

function hsb_to_rgb(hue, saturation, brightness) {
    h = map(hue, 0, 255, 0, 360)
    s = saturation / 255
    b = brightness / 255

    x = s * b
    y = x * (1 - abs((h / 60) % 2 - 1))
    z = b - x

    switch (true) {
        case h < 60:
            red = x
            green = y
            blue = 0
            break;
        case h < 120:
            red = y
            green = x
            blue = 0
            break;
        case h < 180:
            red = 0
            green = x
            blue = y
            break;
        case h < 240:
            red = 0
            green = y
            blue = x
            break;
        case h < 300:
            red = y
            green = 0
            blue = x
            break;
        case h < 360:
            red = x
            green = 0
            blue = y
            break;
    }

    col_rgb = {
        r: (red + z) * 255,
        g: (green + z) * 255,
        b: (blue + z) * 255,
    }

    return col_rgb
}

function grid(sqx, sqy, lx, ly) {
    for (var i = 0; i <= sqx; i++) {
        for (var j = 0; j <= sqy; j++) {
            line(i * lx, 0, i * lx, height)
            line(0, j * ly, width, j * ly)
        }
    }
}

function hexaGrid(len) {
    for (var x = 0; x <= width; x += len * 3 / 2) {
        for (var y = 0; y <= height; y += len * sqrt(3)) {
            if (x / (len * 3 / 2) % 2 == 0)
                polygon(x, y, len, 6)
            else
                polygon(x, y + len * sqrt(3) / 2, len, 6)
        }
    }
}

function log_b(b, n) {
    return log(n) / log(b);
}

function findFirst(arr, n, start_index = 0) {
    for (var i = start_index; i < arr.length; i++)
        if (arr[i] == n)
            return i;

    return -1;
}

// cerca un elemento in un array e ritorna l'indice del'ultimo trovato
function findLast(arr, n) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == n) {
            return i
        }
    }
    return -1
}

p5.Vector.prototype.round = function() {
    return createVector(round(this.x), round(this.y));
}

// creazione di una matrice
// argomenti: grandezza della matrice (x, y)
function matrix(x, y) {
    var arr = new Array(x)
    for (var i = 0; i < arr.length; i++)
        arr[i] = new Array(y)
    
    return arr
}

// creazione di una matrice in tre dimensioni
// argomenti: grandezza della matrice (x, y, z)
function matrix3D(x, y, z) {
    var arr = new Array(x)
    for (var i = 0; i < x; i++) {
        arr[i] = new Array(y)
        for (var j = 0; j < y; j++) {
            arr[i][j] = new Array(z)
        }
    }
    return arr
}

// concatenamento di due Array
function braid(arr1, arr2) {
    var arr3 = []
    var m = max(arr1.length, arr2.length)
    for (var i = 0; i < m; i++) {
        arr3.push(arr1[i])
        if (arr2[i]) {
            arr3.push(arr2[i])
        }
    }
    return arr3
}

function shuffle(arr) {
    new_arr = []
    for (var i = 0; i < arr.length; i++)
        new_arr.push(random(arr))

    return new_arr
}

function bubble_sort(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j + 1]
                arr[j + 1] = arr[j]
                arr[j] = temp
            }
        }
    }
}

function discard(arr, element) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === element) {
            arr.splice(i, 1)
        }
    }
}

function invert(arr) {
    var inverted = []
    for (var i = arr.length - 1; i >= 0; i--) {
        inverted.push(arr[i])
    }
    return inverted
}

function containsVector(vector, element) {
    var present = false
    for (var i = 0; i < vector.length; i++) {
        if (vector[i].x == element.x && vector[i].y == element.y) {
            present = true
        }
    }
    return present
}

function contains(vector, element) {
    var present = false
    for (var i = 0; i < vector.length; i++) {
        if (vector[i] == element) {
            present = true
        }
    }
    return present
}

function sign(x) {
    return abs(x) / x
}

function mod(n, m) {
    return n - floor(n / m) * m;
}

function coprime(a, b) {
    common_factors = []
    for (var i = 2; i <= min(abs(a), abs(b)); i++) {
        if (abs(a / i) % 1 == 0 && abs(b / i) % 1 == 0) {
            common_factors.push(i)
        }
    }

    return common_factors
}

function min_terms(a, b) {
    while (coprime(a, b) != 0) {
        a /= common_factors[common_factors.length - 1]
        b /= common_factors[common_factors.length - 1]
    }

    if (b == 1) {
        return "" + a
    } else if (b == -1) {
        return "" + (-a)
    } else if (a / b > 0) {
        if (a > 0) {
            return a + "/" + b
        } else {
            return (-a) + "/" + (-b)
        }
    } else {
        if (a > 0) {
            return (-a) + "/" + (-b)
        } else {
            return a + "/" + b
        }
    }
}

function prime(n) {
    for (var i = 2; i <= ceil(sqrt(n)); i++) {
        if (n % i == 0 && n != i) {
            return false
        }
    }
    return true
}

function factors(n) {
    var f = []
    for (var i = 2; i < n; i++) {
        if (n % i == 0) {
            f.push(i)
        }
    }
    return f
}

function prime_factors(n) {
    var f = []
    while (n > 1) {
        var i = 2
        while (i <= n) {
            if (n % i == 0) {
                n /= i
                f.push(i)
                i = 1
            }
            i++
        }
    }
    return f
}

function distinct_prime_factors(n) {
    var f = []
    for (var i = 2; i < ceil(sqrt(n)); i++)
        if (n % i == 0 && prime(i))
            f.push(i)

    return f
}

// calcolo del fattoriale di un numero n
function factorial(n) {
    var fact = 1;
    while (n > 0)
        fact *= n--;

    return fact
}

// radice di un numero dati il radicando e l'indice della radice
function root(num, index) {
    var r = pow(num, 1 / index);
    if (abs(r - round(r)) < 0.001)
        return round(pow(num, 1 / index));
    else
        return pow(num, 1 / index);
}

// massimo comun divisore
function mcd(a = 0, b = 0) {
    var r
    while (b != 0) {
        r = a % b
        a = b
        b = r
    }
    return a
}

// minimo comune multiplo
function mcm(a = 0, b = 0) {
    return a * b / mcd(a, b)
}

function pond_random(arr, rate) {
    var choose_arr = []
    for (var i = 0; i < arr.length; i++)
        for (var j = 0; j < rate[i] * 100; i++)
            choose_arr.push(arr[i])

    return random(choose_arr)
}

// disegno una freccia
function arrow(sX, sY, eX, eY) {
    push()
    if (sX != eX || sY != eY) {
        line(sX, sY, eX, eY)
        var teta = atan2(eY - sY, eX - sX)
        translate(eX, eY)
        rotate(teta)
        triangle(0, 0, -10, 5, -10, -5)
    } else {
        noFill()
        arc(sX, sY + 25, 50, 50, -PI / 3, -PI / 2)
        translate(sX + 25 * cos(-PI / 3), sY + 25 + 25 * sin(-PI / 3))
        rotate(PI + PI / 3 - 0.3)
        fill(0)
        triangle(0, 0, -10, 5, -10, -5)
    }
    pop()
}

// disegno un poligono regolare dati:
// posizione, raggio della circonferenza circoscritta, numero di lati, (rotazione)
function polygon(x, y, r, num, angle = 0) {
    var incr = TWO_PI / num

    push()
    translate(x, y)
    beginShape()
    for (angle; angle < TWO_PI; angle += incr) {
        vertex(r * cos(angle), r * sin(angle))
    }
    endShape()
    pop()
}

// disegno una stella dati:
// posizione, raggio della circonferenza circoscritta, numero di punte
function star(x, y, r, spikes) {
    var incr = 2 * TWO_PI / spikes

    push()
    translate(x, y)
    noStroke()
    fill(255, 255, 0)
    beginShape()
    for (var angle = -PI / 2; angle < 2 * TWO_PI - PI / 2; angle += incr) {
        vertex(r * cos(angle), r * sin(angle))
    }
    endShape()
    pop()
}

// inversione circolare di un punto
function inversivePoint(circle, pt) {
    var invPt = createVector(
        circle.pos.x + (pt.x - circle.pos.x) * sq(circle.rad) / sq(dist(pt.x, pt.y, circle.pos.x, circle.pos.y)),
        circle.pos.y + (pt.y - circle.pos.y) * sq(circle.rad) / sq(dist(pt.x, pt.y, circle.pos.x, circle.pos.y))
    )
    return invPt
}

// inversione circolare di una circonferenza
function inversiveCircle(o, c) {
    var d = dist(c.pos.x, c.pos.y, o.pos.x, o.pos.y)
    var invC
    if (d != 0) {
        var a = createVector(
            o.pos.x + (d - c.rad) * (c.pos.x - o.pos.x) / d,
            o.pos.y + (d - c.rad) * (c.pos.y - o.pos.y) / d
        )
        var b = createVector(
            o.pos.x + (d + c.rad) * (c.pos.x - o.pos.x) / d,
            o.pos.y + (d + c.rad) * (c.pos.y - o.pos.y) / d
        )
        var ap = createVector(
            o.pos.x + (a.x - o.pos.x) * sq(o.rad) / sq(dist(a.x, a.y, o.pos.x, o.pos.y)),
            o.pos.y + (a.y - o.pos.y) * sq(o.rad) / sq(dist(a.x, a.y, o.pos.x, o.pos.y))
        )
        var bp = createVector(
            o.pos.x + (b.x - o.pos.x) * sq(o.rad) / sq(dist(b.x, b.y, o.pos.x, o.pos.y)),
            o.pos.y + (b.y - o.pos.y) * sq(o.rad) / sq(dist(b.x, b.y, o.pos.x, o.pos.y))
        )
        invC = {
            pos: createVector(
                (ap.x + bp.x) / 2,
                (ap.y + bp.y) / 2
            ),
            rad: dist(
                (ap.x + bp.x) / 2,
                (ap.y + bp.y) / 2,
                ap.x, ap.y
            )
        }
    } else {
        invC = {
            pos: createVector(o.pos.x, o.pos.y),
            rad: sq(o.rad) / c.rad
        }
    }
    return invC
}
// inversione sferica di una sfera
function inversiveSphere(o, c) {
    var d = dist(c.pos.x, c.pos.y, c.pos.z, o.pos.x, o.pos.y, o.pos.z)
    var invS
    if (d != 0) {
        var a = createVector(
            o.pos.x + (d - c.rad) * (c.pos.x - o.pos.x) / d,
            o.pos.y + (d - c.rad) * (c.pos.y - o.pos.y) / d,
            o.pos.z + (d - c.rad) * (c.pos.z - o.pos.z) / d
        )
        var b = createVector(
            o.pos.x + (d + c.rad) * (c.pos.x - o.pos.x) / d,
            o.pos.y + (d + c.rad) * (c.pos.y - o.pos.y) / d,
            o.pos.z + (d + c.rad) * (c.pos.z - o.pos.z) / d
        )
        var ap = createVector(
            o.pos.x + (a.x - o.pos.x) * sq(o.rad) / sq(dist(a.x, a.y, a.z, o.pos.x, o.pos.y, o.pos.z)),
            o.pos.y + (a.y - o.pos.y) * sq(o.rad) / sq(dist(a.x, a.y, a.z, o.pos.x, o.pos.y, o.pos.z)),
            o.pos.z + (a.z - o.pos.z) * sq(o.rad) / sq(dist(a.x, a.y, a.z, o.pos.x, o.pos.y, o.pos.z))
        )
        var bp = createVector(
            o.pos.x + (b.x - o.pos.x) * sq(o.rad) / sq(dist(b.x, b.y, b.z, o.pos.x, o.pos.y, o.pos.z)),
            o.pos.y + (b.y - o.pos.y) * sq(o.rad) / sq(dist(b.x, b.y, b.z, o.pos.x, o.pos.y, o.pos.z)),
            o.pos.z + (b.z - o.pos.z) * sq(o.rad) / sq(dist(b.x, b.y, b.z, o.pos.x, o.pos.y, o.pos.z))
        )
        invS = {
            pos: createVector(
                (ap.x + bp.x) / 2,
                (ap.y + bp.y) / 2,
                (ap.z + bp.z) / 2
            ),
            rad: dist(
                (ap.x + bp.x) / 2,
                (ap.y + bp.y) / 2,
                (ap.z + bp.z) / 2,
                ap.x, ap.y, ap.z
            )
        }
    } else {
        invS = {
            pos: createVector(o.pos.x, o.pos.y, o.pos.z),
            rad: sq(o.rad) / c.rad
        }
    }
    return invS
}