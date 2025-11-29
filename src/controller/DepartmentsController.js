import db from '../config/database.js';

export const addDepartment = async (req, res, next) => {
    try {
        // Check admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { name, description } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Check if department already exists
        const [existing] = await db.promise().execute(
            'SELECT id FROM departments WHERE name = ?',
            [name]
        );

        if (existing.length > 0) {
            return next(new Error("Department already exists"));
        }

        // Insert department
        await db.promise().execute(
            'INSERT INTO departments (name, description, image) VALUES (?, ?, ?)',
            [name, description, image]
        );

        res.status(201).json({
            success: true,
            message: "Department added successfully"
        });

    } catch (error) {
        next(error);
    }
};

export const getAllDepartments = async (req, res, next) => {
    try {
        const [departments] = await db.promise().execute(
            'SELECT id, name, description, image FROM departments'
        );

        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        next(error);
    }
};

export const getOneDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [department] = await db.promise().execute(
            'SELECT id, name, description, image FROM departments WHERE id = ?',
            [id]
        );

        if (department.length === 0) {
            return next(new Error("Department not found"));
        }

        res.status(200).json({
            success: true,
            data: department[0]
        });
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (req, res, next) => {
    try {
        // Check admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { id } = req.params;
        const { name, description } = req.body;
        const image = req.file ? req.file.filename : null;

        // Build update query
        let updateQuery = 'UPDATE departments SET ';
        let updateValues = [];

        if (name) {
            updateQuery += 'name = ?, ';
            updateValues.push(name);
        }
        if (description) {
            updateQuery += 'description = ?, ';
            updateValues.push(description);
        }
        if (image) {
            updateQuery += 'image = ?, ';
            updateValues.push(image);
        }

        if (updateValues.length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        // Remove trailing comma and space
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ' WHERE id = ?';
        updateValues.push(id);

        await db.promise().execute(updateQuery, updateValues);

        res.status(200).json({
            success: true,
            message: "Department updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDepartment = async (req, res, next) => {
    try {
        // Check admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { id } = req.params;

        await db.promise().execute(
            'DELETE FROM departments WHERE id = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
