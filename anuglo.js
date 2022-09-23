for(let i= 0; i<360; i++){
    let m = Math.tan( i.toString() * Math.PI / 180)
    console.log(i + "  " + m.toFixed(4))
}