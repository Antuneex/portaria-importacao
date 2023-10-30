const Launcher = require('./src/launcher');

class Server {
  constructor() {
    this.launcher = new Launcher();
  }

  run() {
    this.launcher.run();
  }
}

new Server().run();
