// studentController.js 
import { studentRepo } from '../repositories/studentRepo.js';
import { parentRepo } from '../repositories/parentRepo.js';

export const registerStudent = async (req, res) => {
    try {
        const { 
            full_name, matric_number, gender, dob, phone, email, address,
            student_type, department, exam_type, course, edu_level, goal,
            parent_name, parent_relationship, parent_phone_call, parent_phone_whatsapp,
            parent_email, parent_occupation, parent_address,
            photo_url, form_url   // ✅ ADDED: photo_url and form_url
        } = req.body;

        // Validate required fields
        if (!full_name) return res.status(400).json({ error: 'Full name is required' });
        if (!matric_number) return res.status(400).json({ error: 'Matric number is required' });
        if (!gender) return res.status(400).json({ error: 'Gender is required' });
        if (!dob) return res.status(400).json({ error: 'Date of birth is required' });
        if (!phone) return res.status(400).json({ error: 'Phone number is required' });
        if (!address) return res.status(400).json({ error: 'Address is required' });
        if (!student_type) return res.status(400).json({ error: 'Student type is required' });
        
        if (student_type === 'exam') {
            if (!department) return res.status(400).json({ error: 'Department is required for exam students' });
            if (!exam_type) return res.status(400).json({ error: 'Exam type is required for exam students' });
        } else {
            if (!course) return res.status(400).json({ error: 'Course is required for training students' });
            if (!edu_level) return res.status(400).json({ error: 'Education level is required for training students' });
        }

        if (!parent_name) return res.status(400).json({ error: 'Parent name is required' });
        if (!parent_relationship) return res.status(400).json({ error: 'Parent relationship is required' });
        if (!parent_phone_call) return res.status(400).json({ error: 'Parent phone (call) is required' });
        if (!parent_phone_whatsapp) return res.status(400).json({ error: 'Parent phone (WhatsApp) is required' });
        if (!parent_occupation) return res.status(400).json({ error: 'Parent occupation is required' });
        if (!parent_address) return res.status(400).json({ error: 'Parent address is required' });

        // Generate student ID
        const studentId = 'GEO-' + Date.now().toString().slice(-6);

        // Create student - ✅ NOW INCLUDES photo_url AND form_url
        const studentData = {
            id: studentId,
            student_id: studentId,
            full_name,
            matric_number,
            gender,
            date_of_birth: dob,
            phone_number: phone,
            email: email || null,
            address,
            student_type,
            department: student_type === 'exam' ? department : null,
            exam_type: student_type === 'exam' ? exam_type : null,
            course: student_type !== 'exam' ? course : null,
            edu_level: student_type !== 'exam' ? edu_level : null,
            goal: goal || '',
            current_status: 'OUT',
            photo_url: photo_url || null,  // ✅ ADDED
            form_url: form_url || null     // ✅ ADDED
        };

        const student = await studentRepo.create(studentData);

        // Create parent record
        const parentData = {
            student_id: studentId,
            full_name: parent_name,
            relationship: parent_relationship,
            phone_call: parent_phone_call,
            phone_whatsapp: parent_phone_whatsapp,
            email: parent_email || null,
            occupation: parent_occupation,
            address: parent_address
        };

        await parentRepo.create(parentData);

        res.status(201).json({ 
            success: true, 
            message: 'Student registered successfully', 
            data: student 
        });

    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(400).json({ error: err.message });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const data = await studentRepo.getAll();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getStudentsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const data = await studentRepo.getByType(type);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await studentRepo.getById(id);
        if (!data) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await studentRepo.delete(id);
        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Delete student error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const data = await studentRepo.update(id, updates);
        res.status(200).json({ success: true, message: 'Student updated successfully', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};