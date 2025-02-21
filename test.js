const a = [
  {id:1,content:1},
  {id:2,content:2},
  {id:3,content:3},
  {id:4,content:4},
]

const b = {id:2,content:5}

const index = a.findIndex(a => a.id == b.id)
a.splice(index,1,b)

console.log(a);
