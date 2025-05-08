const db = require('../config/db.js');

const saveForm = async (req, res) => {
  try {
    const { email, phoneNo, livingSituation, previousExperience, familyComposition, petId } = req.body;

    const form = await db.one(
      `INSERT INTO adopt_forms (email, phone_no, living_situation, previous_experience, family_composition, pet_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email, phoneNo, livingSituation, previousExperience, familyComposition, petId]
    );

    res.status(200).json(form);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAdoptForms = async (req, res) => {
  try {
    const forms = await db.any(`SELECT * FROM adopt_forms ORDER BY created_at DESC`);
    res.status(200).json(forms);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.result(`DELETE FROM adopt_forms WHERE id = $1`, [id]);

    if (result.rowCount === 0) return res.status(404).json({ message: 'Form not found' });

    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteAllRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.result(`DELETE FROM adopt_forms WHERE pet_id = $1`, [id]);

    if (result.rowCount === 0) return res.status(404).json({ message: 'Forms not found' });

    res.status(200).json({ message: 'Forms deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { saveForm, getAdoptForms, deleteForm, deleteAllRequests };
