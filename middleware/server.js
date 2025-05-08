const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`👑 Master running on PID ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`❌ Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  require('./api'); // API server
  console.log(`Worker ${process.pid} started`);
}
