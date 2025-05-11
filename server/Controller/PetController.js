const db = require('../config/db.js');
const fs = require('fs');
const path = require('path');

const postPetRequest = async (req, res) => {
  try {
    const { name, age, area, justification, email, phone, type } = req.body;
    const { filename } = req.file;

    const pet = await db.one(
      `INSERT INTO pets (name, age, area, justification, email, phone, type, filename, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending') RETURNING *`,
      [name, age, area, justification, email, phone, type, filename]
    );

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const pet = await db.oneOrNone(
      `UPDATE pets SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [status, id]
    );

    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    res.status(200).json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Accepts status as first parameter (used by router)
const allPets = async (status, req, res) => {
  try {
    const pets = await db.any(
      `SELECT * FROM pets WHERE status = $1 ORDER BY updated_at DESC`,
      [status]
    );

    if (pets.length > 0) {
      res.status(200).json(pets);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, age, area, justification, email, phone, type } = req.body;
    const filename = req.file ? req.file.filename : undefined;

    const pet = await db.oneOrNone(
      'SELECT * FROM pets WHERE id = $1',
      [id]
    );

    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    // If a new image is uploaded, delete the old image from the server
    if (filename) {
      const oldFilePath = path.join(__dirname, '../images', pet.filename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const updatedPet = await db.one(
      `UPDATE pets
       SET name = $1, age = $2, area = $3, justification = $4, email = $5, phone = $6, type = $7, filename = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [name, age, area, justification, email, phone, type, filename || pet.filename, id]
    );

    res.status(200).json(updatedPet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const pet = await db.oneOrNone(`DELETE FROM pets WHERE id = $1 RETURNING filename`, [id]);

    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    const filePath = path.join(__dirname, '../images', pet.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { postPetRequest, approveRequest, deletePost, allPets , updatePet };
