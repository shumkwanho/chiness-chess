const chessTable = document.querySelector('#canvas')
const message = document.querySelector(".message")
const startBtn = document.querySelector(".start")
const unitWidth = 80
const unitHeight = 80
const padding = 40
const bgColor = "#eebb55"
let redTurn = true

let pickFlag = false
let chessPicked = []
const initialState = [
    [2, 0, 0, 7, 0, 0, 17, 0, 0, 12],
    [3, 0, 4, 0, 0, 0, 0, 14, 0, 13],
    [6, 0, 0, 7, 0, 0, 17, 0, 0, 16],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 15],
    [1, 0, 0, 7, 0, 0, 17, 0, 0, 11],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 15],
    [6, 0, 0, 7, 0, 0, 17, 0, 0, 16],
    [3, 0, 4, 0, 0, 0, 0, 14, 0, 13],
    [2, 0, 0, 7, 0, 0, 17, 0, 0, 12]
]
let chessState = []

const obj = {
    1: { text: "將", color: "black" },
    2: { text: "車", color: "black" },
    3: { text: "馬", color: "black" },
    4: { text: "炮", color: "black" },
    5: { text: "士", color: "black" },
    6: { text: "象", color: "black" },
    7: { text: "卒", color: "black" },
    11: { text: "帥", color: "red" },
    12: { text: "車", color: "red" },
    13: { text: "馬", color: "red" },
    14: { text: "砲", color: "red" },
    15: { text: "仕", color: "red" },
    16: { text: "象", color: "red" },
    17: { text: "兵", color: "red" }
}

const chessName = Object.freeze({
    jiang: 1,
    shuai: 11
})

const ctx = chessTable.getContext("2d")
drawCanvas()

startBtn.addEventListener("click", (e) => {
    chessState = JSON.parse(JSON.stringify(initialState))
    drawCanvas()
    startBtn.classList.add("hide")
    message.innerHTML = "red turn"
    chessTable.addEventListener("click", chessMovement)
})


function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 9; i++) {
        if (i == 4) {
            ctx.fillStyle = bgColor

            ctx.fillRect(padding, i * unitHeight + padding, unitWidth * 8, unitHeight)
            ctx.strokeRect(padding, i * unitHeight + padding, unitWidth * 8, unitHeight)
            continue
        }
        for (let j = 0; j < 8; j++) {
            ctx.fillStyle = bgColor
            ctx.fillRect(j * unitWidth + padding, padding + i * unitHeight, unitHeight, unitHeight)
            ctx.strokeRect(j * unitWidth + padding, padding + i * unitHeight, unitHeight, unitHeight)
        }
    }
    drawline(280, 440, 40, 200)
    drawline(440, 280, 40, 200)
    drawline(280, 440, 760, 600)
    drawline(440, 280, 760, 600)

    drawText(160, 400, "楚", "black")
    drawText(220, 400, "河", "black")
    drawText(480, 400, "漢", "black")
    drawText(540, 400, "界", "black")

    for (let x = 0; x < chessState.length; x++) {
        for (let y = 0; y < chessState[x].length; y++) {
            if (chessState[x][y] == 0) {
                continue
            }
            if (x == chessPicked[0] && y == chessPicked[1]) {
                ctx.shadowColor = "black";
                ctx.shadowBlur = 10;
                drawCircle(padding + 10 + unitWidth * x, padding - 10 + unitHeight * y)
                ctx.shadowColor = "transparent"
                drawText(padding + 10 + unitWidth * x, padding - 10 + unitHeight * y, obj[chessState[x][y]].text, obj[chessState[x][y]].color)
                continue
            }
            drawCircle(padding + unitWidth * x, padding + unitHeight * y)
            drawText(padding + unitWidth * x, padding + unitHeight * y, obj[chessState[x][y]].text, obj[chessState[x][y]].color)

        }
    }
}

function drawline(x1, x2, y1, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function drawCircle(x, y) {
    ctx.beginPath()
    ctx.arc(x, y, 35, 0, 2 * Math.PI)
    ctx.fillStyle = "#FDFDFD"
    ctx.fill()
    ctx.stroke()
}

function drawText(x, y, text, color) {
    ctx.fillStyle = color
    ctx.font = "40px PMingLiU"
    ctx.fillText(text, x - 20, y + 14)
}



function chessMovement(e) {
    const x = Math.floor(e.offsetX / 80)
    const y = Math.floor(e.offsetY / 80)
    const chessId = chessState[x][y]
    let turn = redTurn ? "red" : "black"

    

    const isPicked = pickFlag == true
    if (!isPicked) {
        const emptyPick = chessId == 0
        if(emptyPick) return

        const notMyTurn = obj[chessId].color != turn

        if(notMyTurn) return 

        pickFlag = true
        chessPicked.push(x, y, chessId, obj[chessId].color)
        drawCanvas()
        message.innerHTML = turn + " turn"
        return
    }

    //same position
    if (x == chessPicked[0] && y == chessPicked[1]) {
        chessPicked = []
        pickFlag = false
        drawCanvas()
        return
    }
    //isMoveLegal
    const isMoveLegal = checkMoveLogic(chessPicked[2], x, y, obj[chessPicked[2]].color)
    if (!isMoveLegal) {
        message.innerHTML = "Invalid Move"
        return
    }

    chessState[chessPicked[0]][chessPicked[1]] = 0
    chessState[x][y] = chessPicked[2]

    const isWin = chessId == chessName.jiang || chessId == chessName.shuai
    if (isWin) {
        message.innerHTML = chessId == 1 ? "Red Win" : "Black Win"
        chessTable.removeEventListener("click", chessMovement)
        startBtn.classList.remove("hide")
        redTurn = true
    } else {
        redTurn = !redTurn
        turn = redTurn ? "red" : "black"
        message.innerHTML = turn + " turn"
    }

    drawCanvas()
    chessPicked = []
    pickFlag = false
}



const checkMoveLogic = (chessType, x, y, color) => {

    switch (chessType) {
        case 1:
            return jiangLogic(x, y, color)
        case 2:
            return juLogic(x, y, color)
        case 3:
            return maLogic(x, y, color)
        case 4:
            return paoLogic(x, y, color)
        case 5:
            return blackShiLogic(x, y, color)
        case 6:
            return blackXiangLogic(x, y, color)
        case 7:
            return zuLogic(x, y, color)
        case 11:
            return shuaiLogic(x, y, color)
        case 12:
            return juLogic(x, y, color)
        case 13:
            return maLogic(x, y, color)
        case 14:
            return paoLogic(x, y, color)
        case 15:
            return redShiLogic(x, y, color)
        case 16:
            return redXiangLogic(x, y, color)
        case 17:
            return bingLogic(x, y, color)
    }
}
const checkStaticPosition = (possiblePosition, x, y) => {
    const result = possiblePosition.some((arr) => {
        return arr[0] === x && arr[1] === y;
    });
    if (result == false) {
        return false
    }
}
const checkEndPoint = (x, y, color) => {
    //end point is empty or enemy
    if (chessState[x][y] == 0 || obj[chessState[x][y]].color != color) {
        return true
    }
    //end point is teammate
    if (chessState[x][y] != 0) {
        if (obj[chessState[x][y]].color == color) {
            return false
        }
    }

}
const juLogic = (x, y, color) => {
    if (x != chessPicked[0] && y != chessPicked[1]) {
        return false
    }
    const dx = Math.sign(x - chessPicked[0])
    const dy = Math.sign(y - chessPicked[1])
    let movingX = chessPicked[0] + dx
    let movingY = chessPicked[1] + dy
    while (movingX != x || movingY != y) {
        if (chessState[movingX][movingY] != 0) {
            return false
        }
        movingX += dx
        movingY += dy
    }
    return checkEndPoint(x, y, color)
}

const isMaStuck = (dx, dy) => {

    // stuckPoint
    const stuckPointX = chessPicked[0] + dx
    const stuckPointY = chessPicked[1] + dy
    const isStuck = chessState[stuckPointX][stuckPointY] != 0

    if (isStuck) {
        return true
    }
    return false
}

/** MaLogic 
 * @parma X = new position X
 * @parma Y = new position Y
*/
const maLogic = (x, y, color) => {
    const possibleMovement = [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2]]
    const result = possibleMovement.filter((arr) => {
        return arr[0] === x - chessPicked[0] && arr[1] === y - chessPicked[1];
    });
    console.log(result);
    if (result.length == 0) {
        return false
    }

    const movement = result[0]
    const movementX = result[0][0]
    const movementY = result[0][1]

    if (movementX === -2) dx = -1
    if (movementY === 2) dx = 1

    const dx = Math.abs(result[0][0]) === 2 ? result[0][0] / 2 : 0;
    const dy = Math.abs(result[0][1]) === 2 ? result[0][1] / 2 : 0;

    if (isMaStuck(dx, dy)) { return false }

    return checkEndPoint(x, y, color)
}

const blackXiangLogic = (x, y, color) => {
    const possiblePosition = [[2, 0], [6, 0], [0, 2], [4, 2], [8, 2], [2, 4], [6, 4]]
    if (checkStaticPosition(possiblePosition, x, y) == false) {
        return false
    }
    if (Math.abs(x - chessPicked[0]) != 2 || Math.abs(y - chessPicked[1]) != 2) {
        return false
    }
    let blockX = (x + chessPicked[0]) / 2
    let blockY = (y + chessPicked[1]) / 2
    if (chessState[blockX][blockY] != 0) {
        return false
    }
    return checkEndPoint(x, y, color)
}

const blackShiLogic = (x, y, color) => {
    const possiblePosition = [[3, 0], [5, 0], [4, 1], [3, 2], [5, 2]]
    if (checkStaticPosition(possiblePosition, x, y) == false) {
        return false
    }
    if (Math.abs(x - chessPicked[0]) != 1 || Math.abs(y - chessPicked[1]) != 1) {
        return false
    }
    return checkEndPoint(x, y, color)
}

const jiangLogic = (x, y, color) => {
    const possiblePosition = [[3, 0], [4, 0], [5, 0], [3, 1], [4, 1], [5, 1], [3, 2], [4, 2], [5, 2]]
    if (checkStaticPosition(possiblePosition, x, y) == false) {
        return false
    }
    if ((Math.abs(x - chessPicked[0]) == 1 && y == chessPicked[1]) || (x == chessPicked[0] && Math.abs(y - chessPicked[1]) == 1)) {
        return checkEndPoint(x, y, color)
    }
}

const paoLogic = (x, y, color) => {
    const barrier = []
    if (x != chessPicked[0] && y != chessPicked[1]) {
        return false
    }
    const dx = Math.sign(x - chessPicked[0])
    const dy = Math.sign(y - chessPicked[1])
    let movingX = chessPicked[0] + dx
    let movingY = chessPicked[1] + dy
    while (movingX != x || movingY != y) {
        if (chessState[movingX][movingY] != 0) {
            barrier.push([movingX, movingY])
        }
        movingX += dx
        movingY += dy
    }
    if (chessState[x][y] == 0 && barrier.length == 0) {
        return true
    } else if (chessState[x][y] != 0) {
        if (obj[chessState[x][y]].color != color && barrier.length == 1) {
            return true
        }
        return false
    }
    else {
        return false
    }
}

const zuLogic = (x, y, color) => {
    if (chessPicked[1] < 5) {
        if (y - chessPicked[1] != 1 || x != chessPicked[0]) {
            return false
        }
        return checkEndPoint
    } else {
        if (y - chessPicked[1] == -1) {
            return false
        }
        if ((Math.abs(x - chessPicked[0]) == 1 && y == chessPicked[1]) || (x == chessPicked[0] && Math.abs(y - chessPicked[1]) == 1)) {
            return checkEndPoint(x, y, color)
        }
    }
}

const redXiangLogic = (x, y, color) => {
    const possiblePosition = [[2, 9], [6, 9], [0, 7], [4, 7], [8, 7], [2, 5], [6, 5]]
    if (checkStaticPosition(possiblePosition, x, y) == false) {
        return false
    }
    if (Math.abs(x - chessPicked[0]) != 2 || Math.abs(y - chessPicked[1]) != 2) {
        return false
    }
    let blockX = (x + chessPicked[0]) / 2
    let blockY = (y + chessPicked[1]) / 2
    if (chessState[blockX][blockY] != 0) {
        return false
    }
    return checkEndPoint(x, y, color)
}

const redShiLogic = (x, y, color) => {
    const possiblePosition = [[3, 9], [5, 9], [4, 8], [3, 7], [5, 7]]
    if (checkStaticPosition(possiblePosition, x, y) == false) {
        return false
    }
    if (Math.abs(x - chessPicked[0]) != 1 || Math.abs(y - chessPicked[1]) != 1) {
        return false
    }
    return checkEndPoint(x, y, color)
}

const shuaiLogic = (x, y, color) => {
    const possiblePosition = [[3, 9], [4, 9], [5, 9], [3, 8], [4, 8], [5, 8], [3, 7], [4, 7], [5, 7]]
    if (checkStaticPosition(possiblePosition, x, y) == false) {
        return false
    }
    if ((Math.abs(x - chessPicked[0]) == 1 && y == chessPicked[1]) || (x == chessPicked[0] && Math.abs(y - chessPicked[1]) == 1)) {
        return checkEndPoint(x, y, color)
    }

}

const bingLogic = (x, y, color) => {
    if (chessPicked[1] > 4) {
        if (y - chessPicked[1] != -1 || x != chessPicked[0]) {
            return false
        }
        return checkEndPoint
    } else {
        if (y - chessPicked[1] == 1) {
            return false
        }
        if ((Math.abs(x - chessPicked[0]) == 1 && y == chessPicked[1]) || (x == chessPicked[0] && Math.abs(y - chessPicked[1]) == 1)) {
            return checkEndPoint(x, y, color)
        }
    }
}

