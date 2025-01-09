const workModel = require('../models/work')
const userModel = require('../models/user');

exports.createWork = async (req, res) => {
    try {
        const { title, description, location, direction, status, farmerId } = req.body;

        const work = await workModel.create({
            title,
            description,
            location,
            direction,
            status,
            farmerId,
        });

        res.status(201).json({
            message: 'Work posted successfully',
            work,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error posting work', error });
    }
};

// Get all works (for labours)
exports.getAllWorks = async (req, res) => {
    try {
        const works = await workModel.findAll({
            where: { status: 'active' } // Filter works with status 'active'
        });

        res.status(200).json({
            success: true,
            data: works,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching works',
            error: error.message,
        });
    }
};


// Get active works posted by a specific farmer
exports.getWorksByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.query; 

        if (!farmerId) {
            return res.status(400).json({
                success: false,
                message: 'farmerId query parameter is required',
            });
        }

        const works = await workModel.findAll({
            where: { 
                farmerId,
                status: 'active'
            }
        });

        res.status(200).json({
            success: true,
            data: works,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching works',
            error: error.message,
        });
    }
};

exports.getInactiveWorksByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.query; 

        if (!farmerId) {
            return res.status(400).json({
                success: false,
                message: 'farmerId query parameter is required',
            });
        }

        const works = await workModel.findAll({
            where: { 
                farmerId,
                status: 'completed'
            }
        });

        res.status(200).json({
            success: true,
            data: works,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching works',
            error: error.message,
        });
    }
};

// Update work details
exports.updateWork = async (req, res) => {
    try {
        const { id } = req.query;

        const work = await workModel.findOne({ where: { id } });

        if (!work) {
            return res.status(404).json({ 
                success: false, 
                message: 'Work not found' 
            });
        }
        const { title, description, location, direction, status } = req.body;

        work.title = title || work.title;
        work.description = description || work.description;
        work.location = location || work.location;
        work.direction = direction || work.direction;
        work.status = status || work.status;

        await work.save();

        res.status(200).json({ 
            success: true, 
            message: 'Work updated successfully', 
            work 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating work', 
            error: error.message 
        });
    }
};


// Delete a work (only accessible to the farmer)
exports.deleteWork = async (req, res) => {
    try {
        const { id } = req.query;

        const work = await workModel.findByPk(id);

        if (!work) {
            return res.status(404).json({
                success: false,
                message: 'Work not found',
            });
        }

        await work.destroy();

        res.status(200).json({
            success: true,
            message: 'Work deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error deleting work',
            error: error.message,
        });
    }
};
