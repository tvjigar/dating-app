/**
 * Common functions
 */
export default class Common {
  /**
   * generate otp.
   *
   */
  static generateOTP = () => {
    //create 5 digit OTP
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };
}
