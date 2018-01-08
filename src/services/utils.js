
class Utils {

  getId() {
    let letters = 'abcdefghijklmnopqrstuvwxyz';
    let id = '';
    for (let i = 0; i < 6; i++ ) {
      id += letters[Math.floor(Math.random() * 26)];
    }
    return id;
  }
}

const utils = new Utils();