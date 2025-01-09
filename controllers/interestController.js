const userModel = require('../models/user');
const workModel = require('../models/work');
const interestModel = require('../models/interest');


exports.expressInterest = async (req, res) => {
    try {
        const workId = req.query.workid;
        const labourId = req.query.id;

        // Check if the labour has already expressed interest in the work
        const existingInterest = await interestModel.findOne({
            where: { workId, labourId },
        });

        if (existingInterest) {
            return res.status(400).json({ message: 'You have already expressed interest in this work' });
        }

        const interest = await interestModel.create({
            workId,
            labourId,
        });

        res.status(201).json({
            message: 'Interest expressed successfully',
            interest,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error expressing interest', error });
    }
};

// Get all interests for a specific work (farmers can see which labours are interested)
exports.getInterestsByWork = async (req, res) => {
    try {
        const { workId } = req.query; 

        const interests = await interestModel.findAll({
            where: { workId:workId },
            include: [
                {
                    model: userModel,
                    as: 'labour',
                    where: { role: 1 }, 
                    // attributes: ['id', 'name', 'email', 'phone', 'age'], // Include only relevant user details
                },
            ],
        });

        if (!interests.length) {
            return res.status(404).json({
                success: false,
                message: 'No interests found for the specified work',
            });
        }

        res.status(200).json({
            success: true,
            data: interests,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interests',
            error: error.message,
        });
    }
};

exports.getInterestsByLabour = async (req, res) => {
    try {
        const labourId = req.query.labourId; 

        if (!labourId) {
            return res.status(400).json({
                success: false,
                message: 'Labour ID is required',
            });
        }

        // Fetch interests associated with the labour ID
        const interests = await interestModel.findAll({
            where: { labourId },
            include: [
                {
                    model: workModel,
                    as: 'work', 
                },
            ],
        });

        res.status(200).json({
            success: true,
            message: 'Interests fetched successfully',
            data: interests,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interests',
            error: error.message,
        });
    }
};

// Update interest status (e.g., accept, decline) using query parameters
exports.updateInterestStatus = async (req, res) => {
    try {
        const { id } = req.query; // Interest ID from query param
        const { status } = req.query; // Status from query param

        if (!id || !status) {
            return res.status(400).json({ message: 'Interest ID and status are required' });
        }

        if (!['pending', 'accepted', 'declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find interest by ID
        const interest = await interestModel.findOne({ where: { id } });

        if (!interest) {
            return res.status(404).json({ message: 'Interest not found' });
        }

        // Ensure only the farmer who owns the work can update the interest
        const work = await workModel.findOne({ where: { id: interest.workId } });

        
        // Update status
        interest.status = status;
        await interest.save();

        res.status(200).json({
            message: `Interest status updated to ${status}`,
            interest,
        });
    } catch (error) {
        console.error('Error updating interest status:', error);
        res.status(500).json({ message: 'Error updating interest status', error });
    }
};

