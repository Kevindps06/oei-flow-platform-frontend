export class Utils {
  static makeRandomString(length: number) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  static getBase64(file: File) {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = function (e) {
        resolve((reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    });
  }
}
