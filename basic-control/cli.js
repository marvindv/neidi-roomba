const { program } = require("commander");
const dorita980 = require("dorita980");
const fs = require("fs");

/**
 * 
 * @param {Options} Result of program.opts().
 * @param {*} callback A function that gets a vacuum handle and returns a promise.
 */
function oneoff({ ip, blid, password }, callback) {
  const beforeConnectTime = Date.now();
  const vacuum = dorita980.Local(blid, password, ip);
  vacuum.on("connect", () => {
    const afterConnectTime = Date.now();
    console.log("oneoff: connected in", afterConnectTime - beforeConnectTime, "ms");
    callback(vacuum)
      .then(() => {
        vacuum.end();
        const afterCallback = Date.now();
        console.log("oneoff: run callback in", afterCallback - afterConnectTime, "ms");
      })
      .catch(err => console.error("ERR:", err));
  });
}

program
  .description("A cli for controlling a roomba vacuum robot.")
  .requiredOption("--ip <ip>", "ip address of your vacuum")
  .requiredOption("--blid <blid>")
  .requiredOption("--password <password>")

program
  .command("mission")
  .action(() => {
    oneoff(
      program.opts(),
      vacuum => vacuum.getMission().then(mission => console.log("Mission:", mission))
    );
  });

program
  .command("start")
  .action(() => {
    oneoff(program.opts(), vacuum => vacuum.start());
  });

program
  .command("clean")
  .action(() => {
    oneoff(program.opts(), vacuum => vacuum.clean());
  });

program
  .command("pause")
  .action(() => {
    oneoff(program.opts(), vacuum => vacuum.pause());
  });

program
  .command("stop")
  .action(() => {
    oneoff(program.opts(), vacuum => vacuum.stop());
  });

program
  .command("resume")
  .action(() => {
    oneoff(program.opts(), vacuum => vacuum.resume());
  });

program
  .command("dock")
  .action(() => {
    oneoff(program.opts(), vacuum => vacuum.dock());
  });

program
  .command("logrun")
  .action(() => {
    const { blid, password, ip } = program.opts();
    const vacuum = dorita980.Local(blid, password, ip);
    vacuum.on("connect", () => {
      vacuum.start();

      process.on('SIGINT', function() {
        vacuum.stop()
          .then(() => vacuum.end())
          .catch(err => console.error('logrun: failed to cleanup', err));
        console.log("logrun: cleaned up. Goodbye!")
        process.exit();
      });
    });

    const writeLog = (time, data) => {
      fs.appendFile('logrun.txt', JSON.stringify({ time, data }) + "\n", function (err) {
        if (err) return console.log(err);
      });
    };

    // It is possible to increase the frequency of the mission event via the emitIntervalTime
    // parameter of dorita980.Local, but in testing the position only updated every 900-1000ms, so
    // would be of no benefit and emitIntervalTime can be left at the default 800ms.
    let lastEmit = Date.now();
    vacuum.on("mission", data => {
      const now = Date.now();
      console.log("logrun:", data.pose, 'after', now - lastEmit, 'ms');
      lastEmit = now;
      writeLog(now, data);
    })
  });

program.parse();

