const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email, orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

  let listItem = '';
  const attachImage = [];
  orderItems.forEach((order) => {
    listItem += `
      <div>
        <div>
          <p>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></p>
          <p>Bên dưới là hình ảnh của sản phẩm:</p>
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <img src="${order.image}" alt="Product Image" style="max-width: 300px; height: auto;">
      </div>
    `;
    attachImage.push({ path: order.image });
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "You have placed an order at Amogus Store", // Subject line
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Thanks for choosing our service</h2>
        ${listItem}
      </div>
    `,
    attachments: attachImage,
  });
}

module.exports = {
  sendEmailCreateOrder
}