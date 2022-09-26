function hashOfErros(){
    return {
        ERRORinitialViga: [1,1,1,2,3,4,3,9],
        ERRORvigas: new Set(),
        ERRORapoyosDeslizantes: [],
        ERRORapoyosNoDeslizantes: [],
        ERRORempotrados: [],
        ERRORbielas: [],
        ERRORrotulas: [],
        ERRORfuerzas: [],
        ERRORmomentosPositivos: [],
        ERRORmomentosNegativos: []
    }

}

const s = hashOfErros()
s.ERRORinitialViga = new Set(s.ERRORinitialViga)
s.ERRORvigas.add(1)
s.ERRORvigas.add(1)
s.ERRORvigas.add(1)
s.ERRORvigas.add(1)
console.log(s.ERRORvigas)