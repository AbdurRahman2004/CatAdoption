const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { postPetRequest, approveRequest, deletePost, allPets, updatePet } = require('../Controller/PetController');




// Routes for all pet requests
router.get('/requests', (req, res) => allPets('Pending', req, res));
router.get('/approvedPets', (req, res) => allPets('Approved', req, res));
router.get('/adoptedPets', (req, res) => allPets('Adopted', req, res));

// Routes for pet services
router.post('/services', upload.single('picture'), postPetRequest);
router.put('/approving/:id', approveRequest);
router.delete('/delete/:id', deletePost);

// Route for updating pet information
router.put('/update/:id', updatePet);

module.exports = router;
