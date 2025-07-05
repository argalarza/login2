const axios = require('axios');

const verifyFacebookToken = async (accessToken) => {
  const response = await axios.get(`https://graph.facebook.com/me`, {
    params: {
      fields: 'email',
      access_token: accessToken,
    },
  });

  return response.data.email;
};

module.exports = { verifyFacebookToken };
