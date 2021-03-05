const dorita980 = require("dorita980");

dorita980.getRobotIP((err, ip) => {
  if (err) {
    return console.log("failed to find a robot:", err);
  }

  console.log("found robot with ip", ip);
  return;
});
