const generateId = (username, email) => {
  const firstCharUsername = username.charAt(0);
  const firstCharEmail = email.charAt(0);
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  const generatedId = `${firstCharUsername}${firstCharEmail}${randomNumbers}`;

  return generatedId;
};

module.exports = { generateId };
