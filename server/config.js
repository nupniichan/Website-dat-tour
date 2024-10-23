module.exports = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  orderInfo: 'pay with MoMo',
  partnerCode: 'MOMO',
  redirectUrl: 'http://localhost:5173/payment-result',
  ipnUrl: 'https://c2da-2001-ee0-25e-157a-bd5a-69bd-4a75-9d7f.ngrok-free.app/callback', //chú ý: cần dùng ngrok thì momo mới post đến url này được
  requestType: 'payWithMethod',
  extraData: '',
  orderGroupId: '',
  autoCapture: true,
  lang: 'vi',
};
