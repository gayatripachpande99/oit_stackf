const DataEntry = require('../models/DataEntry');
const User = require('../models/User');

// Create a new Data Entry in MongoDB
const createDataEntry = async (req, res) => {
  try {
    const { constituency_number, booth_number, candidate_name, father_name, age, address, created_by } = req.body;

    if (!constituency_number || !booth_number || !candidate_name || !father_name || !age || !address) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: Constituency Number, Booth Number, Candidate Name, Father Name, Age, and Address.',
      });
    }

    const newEntry = await DataEntry.create({
      constituency_number: Number(constituency_number),
      booth_number: String(booth_number).trim(),
      candidate_name: String(candidate_name).trim(),
      father_name: String(father_name).trim(),
      relation_type: req.body.relation_type || 'Father',
      age: Number(age),
      address: String(address).trim(),
      created_by: created_by || 'admin01@gmail.com',
    });

    return res.status(201).json({
      success: true,
      message: 'Data entry created successfully in MongoDB',
      data: newEntry,
    });
  } catch (error) {
    console.error('Error creating data entry:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while saving data entry',
    });
  }
};

// Fetch all Data Entries from MongoDB with optional search query
const getAllDataEntries = async (req, res) => {
  try {
    const { search, constituency } = req.query;
    let query = {};

    if (constituency) {
      query.constituency_number = Number(constituency);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { candidate_name: searchRegex },
        { father_name: searchRegex },
        { booth_number: searchRegex },
        { address: searchRegex },
      ];

      if (!isNaN(Number(search))) {
        query.$or.push({ constituency_number: Number(search) });
      }
    }

    const entries = await DataEntry.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error('Error fetching data entries:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching data entries',
    });
  }
};

// Update a Data Entry by ID
const updateDataEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { constituency_number, booth_number, candidate_name, father_name, age, address } = req.body;

    const updatedEntry = await DataEntry.findByIdAndUpdate(
      id,
      {
        constituency_number: Number(constituency_number),
        booth_number: String(booth_number).trim(),
        candidate_name: String(candidate_name).trim(),
        father_name: String(father_name).trim(),
        ...(req.body.relation_type !== undefined && { relation_type: req.body.relation_type }),
        age: Number(age),
        address: String(address).trim(),
        ...(req.body.remark !== undefined && { remark: String(req.body.remark).trim() }),
        ...(req.body.gps_photo !== undefined && { gps_photo: req.body.gps_photo }),
        ...(req.body.gps_location !== undefined && { gps_location: req.body.gps_location }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Data entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data entry updated successfully in MongoDB',
      data: updatedEntry,
    });
  } catch (error) {
    console.error('Error updating data entry:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating data entry',
    });
  }
};

// Delete a Data Entry by ID
const deleteDataEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await DataEntry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Data entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data entry deleted successfully from MongoDB',
      data: deletedEntry,
    });
  } catch (error) {
    console.error('Error deleting data entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting data entry',
    });
  }
};

// Helper function to seed or ensure admin01@gmail.com exists in User model
const ensureAdmin01Account = async () => {
  try {
    const email = 'admin01@gmail.com';
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      user = new User({
        name: 'Data Entry Employee (Admin01)',
        email: email,
        password: '123456',
        role: 'admin',
        college: 'OIT_STACK',
        branch: 'Data Entry',
      });
      await user.save();
      console.log(`[Seed] Created ${email} user account with role admin.`);
    } else {
      user.password = '123456';
      user.role = 'admin';
      await user.save();
      console.log(`[Seed] Updated ${email} credentials and admin role.`);
    }
  } catch (err) {
    console.error('Error ensuring admin01@gmail.com account:', err.message);
  }
};

// Helper function to seed or ensure admin02@gmail.com exists in User model
const ensureAdmin02Account = async () => {
  try {
    const email = 'admin02@gmail.com';
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      user = new User({
        name: 'Search Data Employee (Admin02)',
        email: email,
        password: '01234567',
        role: 'admin',
        college: 'OIT_STACK',
        branch: 'Search Data',
      });
      await user.save();
      console.log(`[Seed] Created ${email} user account with role admin.`);
    } else {
      user.password = '01234567';
      user.role = 'admin';
      await user.save();
      console.log(`[Seed] Updated ${email} credentials and admin role.`);
    }
  } catch (err) {
    console.error('Error ensuring admin02@gmail.com account:', err.message);
  }
};

module.exports = {
  createDataEntry,
  getAllDataEntries,
  updateDataEntry,
  deleteDataEntry,
  ensureAdmin01Account,
  ensureAdmin02Account,
};
