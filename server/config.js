module.exports = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  orderInfo: 'pay with MoMo',
  partnerCode: 'MOMO',
  redirectUrl: 'http://localhost:5173/payment-result',
  ipnUrl: 'https://b986-2001-ee0-25c-4f63-b4d3-c099-64ff-9148.ngrok-free.app/callback', //chú ý: cần dùng ngrok thì momo mới post đến url này được
  requestType: 'payWithMethod',
  extraData: '',
  orderGroupId: '',
  autoCapture: true,
  lang: 'vi',
};
