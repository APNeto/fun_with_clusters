import cluster from "cluster"
import os from "os"
import express from "express"

const app = express()
const numCores = os.cpus().length

function fibonacci(num){
    let a = 1, b = 0, temp;
    while (num >= 0){
      temp = a;
      a = a + b;
      b = temp;
      num--;
    }
    return b;
  }


app.get("/", (req, res) => {
    if(!req.query.num) return res.status(400).send("Ill formed request")
    const _num = parseInt(req.query.num)
    if(_num > 100) {
        return res.send("Sorry, that's a too large number")
    }
    const answer = fibonacci(_num)
    res.send(`Your answer is ${answer}`)
})

if(cluster.isPrimary ) {
    for(let times = 0; times < numCores; times++) {
        cluster.fork()
    }
} else {
    app.listen(3000, () => console.log(`Server ${process.pid} listening on 3000`)
    )
}


// app.listen(3000, () => console.log(`Server ${process.pid} listening on 3000`)
// )
