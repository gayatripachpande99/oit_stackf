const constituencyModel = require('../models/constituencyModel');

const getConstituency = async (req, res) => {
  const constituencyId = req.params.id;

  try {
    const data = await constituencyModel.getConstituencyData(constituencyId);

    res.json({
      constituency_number: parseInt(constituencyId),
      ...data
    });
  } catch (error) {
    console.error('API ERROR:', error);
    res.status(500).json({
      message: error.message,
      sqlMessage: error.sqlMessage
    });
  }
};

const getHealth = (req, res) => {
  res.json({ status: 'ok' });
};

module.exports = {
  getConstituency,
  getHealth
};
